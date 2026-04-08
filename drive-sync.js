/* ═══ DRIVE SYNC ═══
   全ツール共通の Google Drive 同期モジュール。
   localStorage キーと Drive ファイルを 1:1 対応で同期する汎用エンジン。

   使い方（各ツールから）:
     <script src="https://accounts.google.com/gsi/client" async defer></script>
     <script src="../drive-sync.js"></script>
     <link rel="stylesheet" href="../drive-sync.css">

     driveSync.register({
       toolId: 'er-diagram',
       keys: ['erd_projects'],          // 完全一致するキー
       keyPatterns: [/^erd_project_/],  // パターンに一致する全キー
       onSyncedFromRemote: (changedKeys) => { reloadFromStorage(); },
     });
     driveSync.mountUI(document.getElementById('sync-mount'));
     driveSync.init();

     // ローカル保存後にこれを呼ぶと Drive にも上がる:
     driveSync.markDirty('erd_project_abc');
     // ローカル削除後はこちら:
     driveSync.markDeleted('erd_project_abc');

   Drive 上のデータ:
   - ファイル名 = <localStorageKey>.json （例: erd_project_abc.json）
   - 場所 = appDataFolder（ユーザーの Drive 内、隠しフォルダ）
   - appProperties = {tool, localKey, updatedAt}
   - 競合解決 = updatedAt 最終保存勝ち
*/
(function(){
'use strict';

// ─── Configuration ─────────────────────────────────────────
const CLIENT_ID = '518318816188-106lnq4h1lqehoi87mobvaajjt6l6kun.apps.googleusercontent.com';
// drive.appdata = アプリ専用フォルダ、userinfo.email = メール表示用
// (openid/email/profile を直接渡すと token client では invalid_request になる)
const SCOPE = 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/userinfo.email';
const TOKEN_KEY = 'devtools_drive_token';
const SYNC_META_KEY = '__devtools_drive_sync_meta';
const FILE_SUFFIX = '.json';
const API_FILES = 'https://www.googleapis.com/drive/v3/files';
const API_UPLOAD = 'https://www.googleapis.com/upload/drive/v3/files';
const API_USERINFO = 'https://www.googleapis.com/oauth2/v3/userinfo';

// ─── Auth state ────────────────────────────────────────────
let _tokenClient = null;
let _accessToken = null;
let _tokenExpiry = 0;
let _email = null;
let _ready = false;
let _signInPending = null;
let _authLoaded = false;

// ─── Sync state ────────────────────────────────────────────
let _status = 'offline'; // 'offline' | 'syncing' | 'synced' | 'error'
let _listeners = [];
const _namespaces = []; // [{toolId, keys: Set<string>, keyPatterns: RegExp[], onSyncedFromRemote}]
let _syncMeta = {};     // {<localKey>: {updatedAt, fileId}}
let _syncMetaLoaded = false;

// アップロードキュー: 同一キーの連続呼び出しは最新でマージ
const _pendingUploads = new Map(); // localKey → {content, updatedAt}
let _uploadRunning = false;

// ─── Helpers ───────────────────────────────────────────────
function emit(){
  const state = {
    signedIn: isSignedIn(),
    email: _email,
    status: _status,
    ready: _ready,
  };
  _listeners.forEach(cb=>{try{cb(state);}catch(e){console.error(e);}});
}
function setStatus(s){
  if(_status===s) return;
  _status=s;
  emit();
}

function _loadCachedAuth(){
  if(_authLoaded) return;
  _authLoaded = true;
  try{
    const raw = localStorage.getItem(TOKEN_KEY);
    if(!raw) return;
    const obj = JSON.parse(raw);
    if(obj.expiry && obj.expiry > Date.now()+60000){
      _accessToken = obj.token;
      _tokenExpiry = obj.expiry;
      _email = obj.email || null;
    }
  }catch(e){/* noop */}
}
function _saveCachedAuth(){
  try{
    if(_accessToken){
      localStorage.setItem(TOKEN_KEY, JSON.stringify({
        token: _accessToken, expiry: _tokenExpiry, email: _email,
      }));
    }else{
      localStorage.removeItem(TOKEN_KEY);
    }
  }catch(e){/* noop */}
}

function _loadSyncMeta(){
  if(_syncMetaLoaded) return;
  _syncMetaLoaded = true;
  try{
    const raw = localStorage.getItem(SYNC_META_KEY);
    _syncMeta = raw ? JSON.parse(raw) : {};
  }catch(e){_syncMeta = {};}
}
function _saveSyncMeta(){
  try{
    localStorage.setItem(SYNC_META_KEY, JSON.stringify(_syncMeta));
  }catch(e){/* quota errors are non-fatal here */}
}

// 与えられた localKey が登録済みかを返す（マッチした namespace を返す）
function _findNamespace(localKey){
  for(const ns of _namespaces){
    if(ns.keys.has(localKey)) return ns;
    for(const pat of ns.keyPatterns){
      if(pat.test(localKey)) return ns;
    }
  }
  return null;
}

// 全 namespace の対象になる現在の localStorage キーを集める
function _collectAllRegisteredLocalKeys(){
  const set = new Set();
  for(const ns of _namespaces){
    ns.keys.forEach(k=>set.add(k));
  }
  // パターンマッチは localStorage 全体を走査
  try{
    for(let i=0; i<localStorage.length; i++){
      const k = localStorage.key(i);
      if(!k) continue;
      if(k===TOKEN_KEY || k===SYNC_META_KEY) continue;
      for(const ns of _namespaces){
        if(ns.keyPatterns.some(p=>p.test(k))){
          set.add(k);
          break;
        }
      }
    }
  }catch(e){}
  return set;
}

// 変更通知を namespace 単位でまとめて発火
function _notifyChangedKeys(changedKeys){
  if(!changedKeys.length) return;
  for(const ns of _namespaces){
    const matching = changedKeys.filter(k=>{
      if(ns.keys.has(k)) return true;
      return ns.keyPatterns.some(p=>p.test(k));
    });
    if(matching.length>0 && typeof ns.onSyncedFromRemote==='function'){
      try{ns.onSyncedFromRemote(matching);}catch(e){console.error(e);}
    }
  }
}

// ─── Init ──────────────────────────────────────────────────
let _initRetries = 0;
function init(){
  _loadCachedAuth();
  _loadSyncMeta();
  // GIS スクリプトのロード待ち（最大10秒）
  if(typeof google==='undefined' || !google.accounts || !google.accounts.oauth2){
    if(_initRetries++<100){
      setTimeout(init, 100);
    }else{
      console.warn('Google Identity Services failed to load. Sync disabled.');
      setStatus('offline');
      emit();
    }
    return;
  }
  if(!_tokenClient){
    _tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPE,
      callback: _handleTokenResponse,
    });
  }
  _ready = true;
  if(isSignedIn()){
    setStatus('synced');
    // バックグラウンドで全同期
    fullSync().catch(e=>console.error('Initial fullSync failed:', e));
  }else{
    setStatus('offline');
  }
  emit();
}

function _handleTokenResponse(resp){
  if(resp.error){
    console.error('Token error:', resp);
    if(_signInPending){
      _signInPending.reject(new Error(resp.error));
      _signInPending = null;
    }
    setStatus('error');
    return;
  }
  _accessToken = resp.access_token;
  _tokenExpiry = Date.now() + (resp.expires_in - 60) * 1000;
  _fetchEmail().then(()=>{
    _saveCachedAuth();
    if(_signInPending){
      _signInPending.resolve();
      _signInPending = null;
    }
    setStatus('synced');
    emit();
  });
}

async function _fetchEmail(){
  try{
    const r = await fetch(API_USERINFO, {
      headers:{Authorization:'Bearer '+_accessToken},
    });
    if(r.ok){
      const info = await r.json();
      _email = info.email || null;
    }
  }catch(e){/* 失敗してもログイン自体は成立 */}
}

// ─── Public state queries ───────────────────────────────────
function isReady(){return _ready;}
function isSignedIn(){return !!_accessToken && _tokenExpiry > Date.now();}
function getEmail(){return _email;}
function getStatus(){return _status;}

function onStateChange(cb){
  _listeners.push(cb);
  // 即時に1回コールバック（UI 初期化用）
  try{cb({signedIn:isSignedIn(), email:_email, status:_status, ready:_ready});}catch(e){}
  return ()=>{_listeners=_listeners.filter(x=>x!==cb);};
}

// ─── Auth actions ──────────────────────────────────────────
function signIn(){
  if(!_ready) return Promise.reject(new Error('GIS が初期化されていません'));
  return new Promise((resolve, reject)=>{
    _signInPending = {resolve, reject};
    _tokenClient.requestAccessToken({prompt: isSignedIn() ? '' : 'consent'});
  });
}

function signOut(){
  if(_accessToken && typeof google!=='undefined' && google.accounts && google.accounts.oauth2){
    try{google.accounts.oauth2.revoke(_accessToken, ()=>{});}catch(e){}
  }
  _accessToken = null;
  _tokenExpiry = 0;
  _email = null;
  _saveCachedAuth();
  setStatus('offline');
  emit();
}

async function _ensureToken(){
  if(isSignedIn()) return;
  if(!_ready || !_tokenClient) throw new Error('GIS が初期化されていません');
  await new Promise((resolve, reject)=>{
    _signInPending = {resolve, reject};
    _tokenClient.requestAccessToken({prompt:''});
  });
}

// ─── Drive REST ────────────────────────────────────────────
async function _apiFetch(url, opts){
  await _ensureToken();
  opts = opts || {};
  opts.headers = opts.headers || {};
  opts.headers['Authorization'] = 'Bearer ' + _accessToken;
  const r = await fetch(url, opts);
  if(r.status===401){
    _accessToken = null;
    _tokenExpiry = 0;
    _saveCachedAuth();
    throw new Error('Authentication required');
  }
  if(!r.ok){
    const body = await r.text();
    throw new Error(`Drive API error ${r.status}: ${body}`);
  }
  return r;
}

async function _listAllAppDataFiles(){
  const files = [];
  let pageToken = null;
  do{
    let url = `${API_FILES}?spaces=appDataFolder&pageSize=1000`
      + `&fields=files(id,name,appProperties,modifiedTime),nextPageToken`;
    if(pageToken) url += `&pageToken=${encodeURIComponent(pageToken)}`;
    const r = await _apiFetch(url);
    const data = await r.json();
    if(data.files) files.push(...data.files);
    pageToken = data.nextPageToken || null;
  }while(pageToken);
  return files;
}

async function _findFileIdByName(name){
  const q = `name = '${name.replace(/'/g, "\\'")}'`;
  const url = `${API_FILES}?spaces=appDataFolder&q=${encodeURIComponent(q)}&fields=files(id)`;
  const r = await _apiFetch(url);
  const data = await r.json();
  return (data.files && data.files[0]) ? data.files[0].id : null;
}

async function _downloadFile(fileId){
  const r = await _apiFetch(`${API_FILES}/${fileId}?alt=media`);
  return await r.text();
}

async function _deleteFile(fileId){
  await _apiFetch(`${API_FILES}/${fileId}`, {method:'DELETE'});
}

async function _uploadFile(localKey, content, updatedAt, existingFileId){
  const ns = _findNamespace(localKey);
  const metadata = {
    name: localKey + FILE_SUFFIX,
    appProperties: {
      tool: ns ? ns.toolId : 'unknown',
      localKey: localKey,
      updatedAt: String(updatedAt),
    },
  };
  if(!existingFileId){
    metadata.parents = ['appDataFolder'];
  }

  const boundary = '-------ds-' + Math.random().toString(36).slice(2);
  const delim = `\r\n--${boundary}\r\n`;
  const closeDelim = `\r\n--${boundary}--`;
  const body =
    delim +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delim +
    'Content-Type: application/json\r\n\r\n' +
    content +
    closeDelim;

  const url = existingFileId
    ? `${API_UPLOAD}/${existingFileId}?uploadType=multipart&fields=id,appProperties`
    : `${API_UPLOAD}?uploadType=multipart&fields=id,appProperties`;
  const method = existingFileId ? 'PATCH' : 'POST';

  const r = await _apiFetch(url, {
    method,
    headers:{'Content-Type': `multipart/related; boundary=${boundary}`},
    body,
  });
  return await r.json();
}

// ─── Public sync API ───────────────────────────────────────
function register(opts){
  const ns = {
    toolId: opts.toolId || 'unknown',
    keys: new Set(opts.keys || []),
    keyPatterns: (opts.keyPatterns || []).slice(),
    onSyncedFromRemote: opts.onSyncedFromRemote || null,
  };
  _namespaces.push(ns);
}

// ローカルが更新された → Drive にアップロードキューイング
function markDirty(localKey){
  if(!isSignedIn()) return;
  const ns = _findNamespace(localKey);
  if(!ns) return;
  const content = localStorage.getItem(localKey);
  if(content===null) return;
  const updatedAt = Date.now();
  _loadSyncMeta();
  _syncMeta[localKey] = Object.assign({}, _syncMeta[localKey], {updatedAt});
  _saveSyncMeta();
  _pendingUploads.set(localKey, {content, updatedAt});
  if(!_uploadRunning) _drainUploadQueue();
}

async function _drainUploadQueue(){
  _uploadRunning = true;
  setStatus('syncing');
  let hadError = false;
  try{
    while(_pendingUploads.size>0){
      const entries = Array.from(_pendingUploads.entries());
      _pendingUploads.clear();
      for(const [localKey, data] of entries){
        try{
          // pendingUploads にいる間にコンテンツが古くなっている可能性があるので
          // localStorage から最新を取り直す
          const latest = localStorage.getItem(localKey);
          const content = latest!==null ? latest : data.content;
          const fileId = _syncMeta[localKey] && _syncMeta[localKey].fileId;
          const result = await _uploadFile(localKey, content, data.updatedAt, fileId);
          if(result && result.id){
            _syncMeta[localKey] = Object.assign({}, _syncMeta[localKey], {fileId: result.id});
            _saveSyncMeta();
          }
        }catch(e){
          console.error('Upload failed:', localKey, e);
          hadError = true;
        }
      }
    }
  }finally{
    _uploadRunning = false;
    setStatus(hadError ? 'error' : 'synced');
  }
}

// ローカルから削除された → Drive からも削除
async function markDeleted(localKey){
  _loadSyncMeta();
  // pending な書き込みがあれば取り消す
  _pendingUploads.delete(localKey);
  const cachedFileId = _syncMeta[localKey] && _syncMeta[localKey].fileId;
  delete _syncMeta[localKey];
  _saveSyncMeta();
  if(!isSignedIn()) return;
  const ns = _findNamespace(localKey);
  if(!ns) return;
  setStatus('syncing');
  try{
    let fileId = cachedFileId;
    if(!fileId){
      fileId = await _findFileIdByName(localKey + FILE_SUFFIX);
    }
    if(fileId) await _deleteFile(fileId);
    setStatus('synced');
  }catch(e){
    console.error('Drive delete failed:', e);
    setStatus('error');
  }
}

// 双方向マージ。ログイン直後 / 起動時に呼ぶ。
async function fullSync(){
  if(!isSignedIn()) return;
  if(_namespaces.length===0) return; // 何も登録されていない
  setStatus('syncing');
  _loadSyncMeta();
  const changedKeys = [];
  try{
    // Drive 側のファイル一覧
    const driveFiles = await _listAllAppDataFiles();
    const driveByKey = new Map();
    for(const f of driveFiles){
      if(!f.name || !f.name.endsWith(FILE_SUFFIX)) continue;
      const localKey = f.name.slice(0, -FILE_SUFFIX.length);
      const ns = _findNamespace(localKey);
      if(!ns) continue; // このツールには関係ない
      const props = f.appProperties || {};
      driveByKey.set(localKey, {
        fileId: f.id,
        updatedAt: parseInt(props.updatedAt || '0', 10) || new Date(f.modifiedTime).getTime(),
      });
    }

    // ローカル側で対象になるキー
    const localKeys = _collectAllRegisteredLocalKeys();

    // 1) ローカル側の各キーを処理
    for(const localKey of localKeys){
      const drive = driveByKey.get(localKey);
      const localContent = localStorage.getItem(localKey);
      const localUpdatedAt = (_syncMeta[localKey] && _syncMeta[localKey].updatedAt) || 0;

      if(drive){
        if(drive.updatedAt > localUpdatedAt){
          // Drive 側が新しい → ダウンロード
          try{
            const content = await _downloadFile(drive.fileId);
            localStorage.setItem(localKey, content);
            _syncMeta[localKey] = {updatedAt: drive.updatedAt, fileId: drive.fileId};
            changedKeys.push(localKey);
          }catch(e){console.error('Download failed:', localKey, e);}
        }else if(localUpdatedAt > drive.updatedAt){
          // ローカル側が新しい → アップロード
          if(localContent!==null){
            try{
              await _uploadFile(localKey, localContent, localUpdatedAt, drive.fileId);
              _syncMeta[localKey] = {updatedAt: localUpdatedAt, fileId: drive.fileId};
            }catch(e){console.error('Upload failed:', localKey, e);}
          }
        }
        // 同じなら何もしない
        driveByKey.delete(localKey);
      }else{
        // Drive にはない
        if(_syncMeta[localKey]){
          // 以前同期したのに Drive から消えている → 別端末で削除されたとみなしローカルも削除
          localStorage.removeItem(localKey);
          delete _syncMeta[localKey];
          changedKeys.push(localKey);
        }else{
          // 初回アップロード
          if(localContent!==null){
            try{
              const now = Date.now();
              const result = await _uploadFile(localKey, localContent, now, null);
              _syncMeta[localKey] = {updatedAt: now, fileId: result && result.id};
            }catch(e){console.error('Initial upload failed:', localKey, e);}
          }
        }
      }
    }

    // 2) 残った driveByKey は「Drive にだけある」キー → ダウンロード
    for(const [localKey, drive] of driveByKey){
      try{
        const content = await _downloadFile(drive.fileId);
        localStorage.setItem(localKey, content);
        _syncMeta[localKey] = {updatedAt: drive.updatedAt, fileId: drive.fileId};
        changedKeys.push(localKey);
      }catch(e){console.error('Download failed:', localKey, e);}
    }

    _saveSyncMeta();
    _notifyChangedKeys(changedKeys);
    setStatus('synced');
  }catch(e){
    console.error('fullSync error:', e);
    setStatus('error');
  }
}

// ─── UI mount ──────────────────────────────────────────────
function mountUI(container){
  if(!container) return;
  _loadCachedAuth();
  container.classList.add('ds-sync-mount');
  container.innerHTML =
    '<button class="ds-sync-signin" type="button" title="Googleアカウントでログインしてプロジェクトを同期">'
    +   '<span class="ds-sync-g-icon" aria-hidden="true">G</span>'
    +   '<span class="ds-sync-label">同期</span>'
    + '</button>'
    + '<div class="ds-sync-info">'
    +   '<span class="ds-sync-status-dot" title="同期ステータス"></span>'
    +   '<span class="ds-sync-email"></span>'
    +   '<button class="ds-sync-signout" type="button" title="ログアウト">⎋</button>'
    + '</div>';

  // ちらつき防止: 現在の認証状態を即座に反映
  container.dataset.signedIn = isSignedIn() ? '1' : '0';
  container.dataset.status = isSignedIn() ? 'synced' : 'offline';
  const initialEmail = container.querySelector('.ds-sync-email');
  if(initialEmail) initialEmail.textContent = _email || '';

  container.querySelector('.ds-sync-signin').addEventListener('click', ()=>{
    signIn()
      .then(()=>fullSync())
      .catch(e=>{
        console.error('Sign-in failed:', e);
        alert('ログインに失敗しました: '+(e.message||e));
      });
  });
  container.querySelector('.ds-sync-signout').addEventListener('click', ()=>{
    if(confirm('Driveとの同期をやめてログアウトしますか？\n（ローカルのデータは残ります）')){
      signOut();
    }
  });

  onStateChange(state=>{
    container.dataset.signedIn = state.signedIn ? '1' : '0';
    container.dataset.status = state.status;
    const emailEl = container.querySelector('.ds-sync-email');
    if(emailEl) emailEl.textContent = state.email || '';
    const dot = container.querySelector('.ds-sync-status-dot');
    if(dot){
      const labels = {offline:'未ログイン', syncing:'同期中…', synced:'同期済み', error:'同期エラー'};
      dot.title = labels[state.status] || state.status;
    }
  });
}

// ─── Expose ────────────────────────────────────────────────
window.driveSync = {
  init, register, mountUI,
  signIn, signOut,
  isReady, isSignedIn, getEmail, getStatus,
  onStateChange,
  markDirty, markDeleted, fullSync,
};
})();

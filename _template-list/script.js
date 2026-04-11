// =============================================================
// _template-list — main script（一覧+編集型テンプレート）
//
// このファイルは UI 標準規則の参照実装。
// "TODO:" コメント箇所を自分のツール用に書き換えること。
// =============================================================

// ---- 設定 ----------------------------------------------------
// TODO: ツールごとに固有の値に書き換える
const TOOL_ID   = 'my-tool';                  // drive-sync namespace 用 ID
const LS_LIST   = 'my_tool_items';            // 一覧データの localStorage キー
const LS_PREFIX = 'my_tool_item_';            // 個別アイテムの localStorage キー接頭辞

// ---- State ---------------------------------------------------
let items = {};               // {id: {name, note, updatedAt, ...}}
let currentItemId = null;

// ---- Drive helpers -------------------------------------------
function _useDrive(){ return !!(window.driveSync && window.driveSync.isSignedIn()); }

let _driveProgressCount = 0;
function driveProgressStart(){
  _driveProgressCount++;
  const el = document.getElementById('drive-progress');
  if(el) el.hidden = false;
}
function driveProgressEnd(){
  _driveProgressCount = Math.max(0, _driveProgressCount - 1);
  if(_driveProgressCount === 0){
    const el = document.getElementById('drive-progress');
    if(el) el.hidden = true;
  }
}

// ---- Storage（saveItem/loadItem/removeItem 方式） ---------------
// ログイン時: Drive に直接保存（localStorage はキャッシュ）
// 未ログイン時: localStorage のみ
async function loadItems(){
  try{
    let raw;
    if(_useDrive()){
      raw = await window.driveSync.loadItem(LS_LIST);
    } else {
      raw = localStorage.getItem(LS_LIST);
    }
    items = raw ? JSON.parse(raw) : {};
  }catch(e){
    items = {};
  }
}

async function saveItems(){
  const json = JSON.stringify(items);
  if(_useDrive()){
    await window.driveSync.saveItem(LS_LIST, json);
  } else {
    localStorage.setItem(LS_LIST, json);
  }
}

async function saveItemData(id, data){
  const json = JSON.stringify(data);
  if(_useDrive()){
    await window.driveSync.saveItem(LS_PREFIX + id, json);
  } else {
    localStorage.setItem(LS_PREFIX + id, json);
  }
}

async function loadItemData(id){
  try{
    let raw;
    if(_useDrive()){
      raw = await window.driveSync.loadItem(LS_PREFIX + id);
    } else {
      raw = localStorage.getItem(LS_PREFIX + id);
    }
    return raw ? JSON.parse(raw) : null;
  }catch(e){ return null; }
}

async function deleteItemFromStorage(id){
  delete items[id];
  await saveItems();
  if(_useDrive()){
    await window.driveSync.removeItem(LS_PREFIX + id);
  } else {
    localStorage.removeItem(LS_PREFIX + id);
  }
}

// ---- Util ----------------------------------------------------
function generateId(){
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function escapeHtml(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

// ---- Save status（ボタン内表示） --------------------------------
let _saveStatusTimer = null;
const _saveBtnDefault = null; // initで設定
function showSaveStatus(text, type){
  const btn = document.getElementById('save-btn');
  if(!btn) return;
  clearTimeout(_saveStatusTimer);
  if(!btn._defaultHTML) btn._defaultHTML = btn.innerHTML;
  if(type === 'success'){
    btn.innerHTML = '✓ 保存';
    btn.classList.add('btn-save-done');
  } else if(type === 'error'){
    btn.innerHTML = '✗ エラー';
    btn.classList.add('btn-save-error');
  } else {
    btn.innerHTML = '<span class="spinner spinner-sm" style="border-top-color:#fff"></span>';
    btn.classList.remove('btn-save-done', 'btn-save-error');
    return;
  }
  _saveStatusTimer = setTimeout(() => {
    btn.innerHTML = btn._defaultHTML;
    btn.classList.remove('btn-save-done', 'btn-save-error');
  }, 2000);
}

// ---- Dropdown ------------------------------------------------
function toggleDropdown(id){
  const dd = document.getElementById(id);
  if(!dd) return;
  const wasOpen = dd.classList.contains('open');
  document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
  if(!wasOpen) dd.classList.add('open');
}
function closeDropdown(){
  document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
}
document.addEventListener('click', (e) => {
  if(!e.target.closest('.dropdown')) closeDropdown();
});

// ---- Save / Import / Export ----------------------------------
async function saveCurrentItem(){
  if(!currentItemId || !items[currentItemId]) return;
  const drive = _useDrive();
  showSaveStatus(drive ? 'Drive に保存中...' : '保存中...');
  if(drive) driveProgressStart();
  try{
    items[currentItemId].updatedAt = new Date().toISOString();
    await saveItems();
    // TODO: アイテム固有データも保存する場合は await saveItemData(currentItemId, data) を呼ぶ
    showSaveStatus('✓ 保存完了', 'success');
  }catch(e){
    showSaveStatus('保存エラー', 'error');
  } finally {
    if(drive) driveProgressEnd();
  }
}

function importItem(ev, type){
  const file = ev.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try{
      if(type === 'json'){
        const data = JSON.parse(e.target.result);
        // TODO: インポートしたデータを現在のアイテムに適用するロジック
      } else if(type === 'csv'){
        // TODO: CSV パースロジック
      }
      showToast('読み込みました', 'success');
    }catch(err){
      showToast('ファイルの読み込みに失敗しました', 'error');
    }
  };
  reader.readAsText(file);
  ev.target.value = '';
}

function exportJSON(){
  if(!currentItemId || !items[currentItemId]) return;
  const item = items[currentItemId];
  const blob = new Blob([JSON.stringify(item, null, 2)], {type: 'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = (item.name || 'item') + '.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

function exportCSV(){
  if(!currentItemId || !items[currentItemId]) return;
  // TODO: アイテム固有の CSV 変換ロジック
  const item = items[currentItemId];
  const csv = 'name,note\n' + (item.name||'') + ',' + (item.note||'');
  const blob = new Blob([csv], {type: 'text/csv'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = (item.name || 'item') + '.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

function showToast(msg, type){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' ' + type : '');
  setTimeout(() => { t.className = 'toast'; }, 2200);
}

// ---- View switching ------------------------------------------
function showList(){
  document.body.dataset.view = 'list';
  currentItemId = null;
  renderList();
}

function showEditor(id){
  document.body.dataset.view = 'editor';
  currentItemId = id;
  renderEditor(id);
  initIcons();
}

// ---- Render: list --------------------------------------------
function renderList(){
  const grid = document.getElementById('app-grid');
  if(!grid) return;
  grid.innerHTML = '';

  // 並び順：更新日時降順
  const sorted = Object.entries(items).sort((a, b) =>
    (b[1].updatedAt || '').localeCompare(a[1].updatedAt || '')
  );

  if(sorted.length === 0){
    const emptyIcon = window.yutoIcons ? yutoIcons.toSVG('inbox', {size:48}) : '';
    grid.innerHTML = `
      <div class="app-empty">
        <div class="app-empty-icon">${emptyIcon}</div>
        <div class="app-empty-text">アイテムがありません</div>
        <div class="app-empty-sub">「＋ 新規作成」から最初のアイテムを追加</div>
      </div>`;
    return;
  }

  sorted.forEach(([id, item]) => {
    const card = document.createElement('div');
    card.className = 'app-card';
    const date = item.updatedAt
      ? new Date(item.updatedAt).toLocaleDateString('ja-JP')
      : '';

    const icRename = window.yutoIcons ? yutoIcons.toSVG('edit-2', {size:14}) : '✏';
    const icDelete = window.yutoIcons ? yutoIcons.toSVG('trash', {size:14}) : '🗑';
    card.innerHTML = `
      <div class="app-card-thumb">${renderThumbnail(id)}</div>
      <div class="app-card-info">
        <div class="app-card-name">${escapeHtml(item.name || '無題')}</div>
        <div class="app-card-meta"><span>${date}</span></div>
      </div>
      <div class="app-card-actions">
        <button class="app-card-btn" data-action="rename" title="名前変更">${icRename}</button>
        <button class="app-card-btn danger" data-action="delete" title="削除">${icDelete}</button>
      </div>
    `;

    card.addEventListener('click', (ev) => {
      const action = ev.target.dataset.action;
      if(action === 'rename'){ ev.stopPropagation(); handleRename(id); return; }
      if(action === 'delete'){ ev.stopPropagation(); handleDelete(id); return; }
      showEditor(id);
    });

    grid.appendChild(card);
  });
}

// ---- Render: thumbnail ---------------------------------------
// TODO: アイテムの内容を可視化するサムネイル SVG / HTML を返す
//   - ER 図ならテーブル矩形 + FK 線
//   - 画像コレクションなら <img>
//   - テキストノートなら先頭行プレビュー
function renderThumbnail(id){
  return window.yutoIcons ? yutoIcons.toSVG('file-text', {size:36, style:'opacity:.4;color:var(--muted)'}) : '';
}

// ---- Render: editor ------------------------------------------
function renderEditor(id){
  const item = items[id];
  if(!item){ showList(); return; }
  document.getElementById('editor-title').textContent = item.name || '無題';
  // TODO: 編集 UI の中身をここで描画する
}

// ---- Editable title ------------------------------------------
function initEditableTitle(){
  const el = document.getElementById('editor-title');
  if(!el) return;
  el.addEventListener('click', (e) => {
    e.stopPropagation(); e.preventDefault();
    if(!currentItemId || !items[currentItemId]) return;
    el.contentEditable = 'true';
    el.classList.add('editing');
    el.focus();
  });
  el.addEventListener('blur', () => commitTitle(el));
  el.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){ e.preventDefault(); el.blur(); }
    if(e.key === 'Escape'){
      el.textContent = items[currentItemId]?.name || '無題';
      el.blur();
    }
  });
}
async function commitTitle(el){
  el.contentEditable = 'false';
  el.classList.remove('editing');
  if(!currentItemId || !items[currentItemId]) return;
  let v = el.textContent.trim();
  if(!v) v = '無題';
  items[currentItemId].name = v;
  items[currentItemId].updatedAt = new Date().toISOString();
  el.textContent = v;
  await saveItems();
}

// ---- Actions -------------------------------------------------
async function handleCreate(name, extra){
  const id = generateId();
  const now = new Date().toISOString();
  const data = { id, name, ...extra, createdAt: now, updatedAt: now };
  items[id] = { name, ...extra, createdAt: now, updatedAt: now };
  await saveItems();
  await saveItemData(id, data);
  renderList();
  showToast('作成しました', 'success');
}

async function handleRename(id){
  const item = items[id];
  if(!item) return;
  const newName = prompt('新しい名前:', item.name);
  if(!newName || !newName.trim()) return;
  item.name = newName.trim();
  item.updatedAt = new Date().toISOString();
  await saveItems();
  renderList();
}

async function handleDelete(id){
  if(!confirm('削除しますか？')) return;
  await deleteItemFromStorage(id);
  renderList();
  showToast('削除しました');
}

// ---- Modal ---------------------------------------------------
function openModal(id){
  const m = document.getElementById(id);
  if(m) m.hidden = false;
}

function closeModal(id){
  const m = document.getElementById(id);
  if(m) m.hidden = true;
}

// ---- Theme（lib/theme.js のボタンを mount） -----------------
function initTheme(){
  if(!window.theme) return;
  // 一覧画面と編集画面の両方にボタンを mount
  ['theme-mount', 'theme-mount-editor'].forEach((mid) => {
    const m = document.getElementById(mid);
    if(m) window.theme.mountUI(m);
  });
}

// ---- Icon（lib/icons.js のアイコンを設定） ----------
// TODO: ツールに合ったアイコン名に変更する（一覧: icons/index.html）
function initIcons(){
  if(!window.yutoIcons) return;
  document.querySelectorAll('.app-icon').forEach((el) => {
    el.innerHTML = window.yutoIcons.toSVG('tool', {size:20});
  });
  document.querySelectorAll('[data-ic]').forEach((el) => {
    const size = parseInt(el.dataset.icSize) || 16;
    el.innerHTML = yutoIcons.toSVG(el.dataset.ic, {size});
  });
}

// ---- Drive sync 統合 -----------------------------------------
function initDriveSync(){
  if(!window.driveSync) return;
  window.driveSync.register({
    toolId: TOOL_ID,
    keys: [LS_LIST],
    keyPatterns: [new RegExp('^' + LS_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))],
    onSyncedFromRemote: async (changedKeys) => {
      await loadItems();
      if(document.body.dataset.view === 'list'){
        renderList();
      } else if(currentItemId){
        if(!items[currentItemId]){
          showToast('編集中のアイテムが別端末で削除されました', 'error');
          showList();
        } else {
          showToast('別端末から更新を取り込みました');
          renderEditor(currentItemId);
        }
      }
    },
  });
  // 同期状態ドット（エディタヘッダー用）
  const dot = document.getElementById('syncDot');
  if(dot){
    const labels = {offline:'未ログイン', syncing:'同期中…', synced:'同期済み', error:'同期エラー'};
    window.driveSync.onStateChange((state) => {
      dot.dataset.status = state.signedIn ? state.status : 'offline';
      dot.title = labels[state.signedIn ? state.status : 'offline'] || '';
    });
  }
  // 同期UIは一覧画面のみにマウント（編集画面では非表示）
  const syncEl = document.getElementById('sync-mount');
  if(syncEl) window.driveSync.mountUI(syncEl);
  window.driveSync.init();
}

// ---- Init ----------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  await loadItems();

  // 「+ 新規作成」ボタン
  document.getElementById('btn-create').addEventListener('click', () => {
    openModal('modal-add');
  });

  // 「← 一覧に戻る」リンク
  document.getElementById('back-to-list').addEventListener('click', (e) => {
    e.preventDefault();
    showList();
  });

  // モーダル close ボタン（[data-close="modal-id"] を持つ要素全部）
  document.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
  });

  // モーダル背景クリックで閉じる
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if(e.target === overlay) overlay.hidden = true;
    });
  });

  // 追加フォーム送信
  document.getElementById('form-add').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = (fd.get('name') || '').trim();
    const note = (fd.get('note') || '').trim();
    if(!name) return;
    handleCreate(name, { note });
    e.target.reset();
    closeModal('modal-add');
  });

  // 初期表示
  showList();
  initTheme();
  initIcons();
  initEditableTitle();
  initDriveSync();
});

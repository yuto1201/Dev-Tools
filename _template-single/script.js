// =============================================================
// _template-single — main script（単一画面ユーティリティ型）
//
// このファイルは UI 標準規則の参照実装。
// 同期不要なツールならこのファイルごと削除して、index.html の
// drive-sync 関連の <script>/<link> も削除してよい。
// =============================================================

// ---- 設定 ----------------------------------------------------
// TODO: ツールごとに固有の値に書き換える
const TOOL_ID = 'my-tool';        // drive-sync namespace 用 ID
const LS_KEY  = 'my_tool_state';  // ツール固有のステート用 localStorage キー

// ---- State ---------------------------------------------------
let state = {};

// ---- Storage -------------------------------------------------
function loadState(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    state = raw ? JSON.parse(raw) : {};
  }catch(e){
    state = {};
  }
}

function saveState(){
  try{
    localStorage.setItem(LS_KEY, JSON.stringify(state));
    if(window.driveSync) window.driveSync.markDirty(LS_KEY);
  }catch(e){
    console.warn('saveState failed:', e);
  }
}

// ---- Util ----------------------------------------------------
function showToast(msg, type){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' ' + type : '');
  setTimeout(() => { t.className = 'toast'; }, 2200);
}

// ---- Render --------------------------------------------------
function render(){
  // TODO: state を画面に反映する
  // 例: document.getElementById('output').textContent = state.value;
}

// ---- Theme（lib/theme.js のボタンを mount） -----------------
function initTheme(){
  if(!window.theme) return;
  const m = document.getElementById('theme-mount');
  if(m) window.theme.mountUI(m);
}

// ---- Drive sync 統合 -----------------------------------------
// 同期不要なら initDriveSync() ごと削除してよい
function initDriveSync(){
  if(!window.driveSync) return;
  window.driveSync.register({
    toolId: TOOL_ID,
    keys: [LS_KEY],
    keyPatterns: [],
    onSyncedFromRemote: () => {
      loadState();
      render();
      showToast('別端末から更新を取り込みました');
    },
  });
  const m = document.getElementById('sync-mount');
  if(m) window.driveSync.mountUI(m);
  window.driveSync.init();
}

// ---- Init ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  render();
  initTheme();
  initDriveSync();
});

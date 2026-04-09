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

// ---- Storage -------------------------------------------------
function loadItems(){
  try{
    const raw = localStorage.getItem(LS_LIST);
    items = raw ? JSON.parse(raw) : {};
  }catch(e){
    items = {};
  }
}

function saveItems(){
  try{
    localStorage.setItem(LS_LIST, JSON.stringify(items));
    if(window.driveSync) window.driveSync.markDirty(LS_LIST);
  }catch(e){
    console.warn('saveItems failed:', e);
  }
}

function saveItem(id, data){
  try{
    localStorage.setItem(LS_PREFIX + id, JSON.stringify(data));
    if(window.driveSync) window.driveSync.markDirty(LS_PREFIX + id);
  }catch(e){
    console.warn('saveItem failed:', e);
  }
}

function deleteItemFromStorage(id){
  delete items[id];
  saveItems();
  try{
    localStorage.removeItem(LS_PREFIX + id);
    if(window.driveSync) window.driveSync.markDeleted(LS_PREFIX + id);
  }catch(e){}
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
    grid.innerHTML = `
      <div class="app-empty">
        <div class="app-empty-icon">✦</div>
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

    card.innerHTML = `
      <div class="app-card-thumb">${renderThumbnail(id)}</div>
      <div class="app-card-info">
        <div class="app-card-name">${escapeHtml(item.name || '無題')}</div>
        <div class="app-card-meta"><span>${date}</span></div>
      </div>
      <div class="app-card-actions">
        <button class="app-card-btn" data-action="rename" title="名前変更">✏</button>
        <button class="app-card-btn danger" data-action="delete" title="削除">🗑</button>
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
  return '<span style="font-size:36px;opacity:.4">✦</span>';
}

// ---- Render: editor ------------------------------------------
function renderEditor(id){
  const item = items[id];
  if(!item){ showList(); return; }
  document.getElementById('editor-title').textContent = item.name || '無題';
  // TODO: 編集 UI の中身をここで描画する
}

// ---- Actions -------------------------------------------------
function handleCreate(name, extra){
  const id = generateId();
  const now = new Date().toISOString();
  items[id] = { name, ...extra, createdAt: now, updatedAt: now };
  saveItems();
  saveItem(id, { id, name, ...extra, createdAt: now, updatedAt: now });
  renderList();
  showToast('作成しました', 'success');
}

function handleRename(id){
  const item = items[id];
  if(!item) return;
  const newName = prompt('新しい名前:', item.name);
  if(!newName || !newName.trim()) return;
  item.name = newName.trim();
  item.updatedAt = new Date().toISOString();
  saveItems();
  renderList();
}

function handleDelete(id){
  if(!confirm('削除しますか？')) return;
  deleteItemFromStorage(id);
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

// ---- Drive sync 統合 -----------------------------------------
function initDriveSync(){
  if(!window.driveSync) return;
  window.driveSync.register({
    toolId: TOOL_ID,
    keys: [LS_LIST],
    keyPatterns: [new RegExp('^' + LS_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))],
    onSyncedFromRemote: (changedKeys) => {
      loadItems();
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
  // 一覧画面と編集画面の両方にマウント
  ['sync-mount', 'sync-mount-editor'].forEach((mid) => {
    const m = document.getElementById(mid);
    if(m) window.driveSync.mountUI(m);
  });
  window.driveSync.init();
}

// ---- Init ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  loadItems();

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
  initDriveSync();
});

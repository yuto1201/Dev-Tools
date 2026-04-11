/* ============================================================
   DesignPocket — Theme Catalog v2
   - 1 レコード = 1 UI テーマ（トークン + custom CSS）
   - 左ペイン = フォーム、右ペイン = iframe ライブプレビュー
   - 永続化: localStorage + Google Drive 同期
   ============================================================ */

'use strict';

// ═══════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════

const LS_KEY = 'designpocket_themes';
const LEGACY_KEYS = ['designpocket_apps', 'designpocket_ideas'];

const COLOR_TOKENS = [
  { var: '--bg',           label: 'bg' },
  { var: '--text',         label: 'text' },
  { var: '--text-dim',     label: 'text-dim' },
  { var: '--muted',        label: 'muted' },
  { var: '--accent',       label: 'accent' },
  { var: '--accent-hover', label: 'accent-hover' },
  { var: '--success',      label: 'success' },
  { var: '--danger',       label: 'danger' },
  { var: '--warning',      label: 'warning' },
  { var: '--info',         label: 'info' },
  { var: '--purple',       label: 'purple' },
  { var: '--pink',         label: 'pink' },
  { var: '--orange',       label: 'orange' },
  { var: '--teal',         label: 'teal' },
  { var: '--indigo',       label: 'indigo' },
];

const RADIUS_TOKENS = [
  { var: '--radius-sm',   label: 'radius-sm' },
  { var: '--radius',      label: 'radius' },
  { var: '--radius-lg',   label: 'radius-lg' },
  { var: '--radius-full', label: 'radius-full' },
];

const SPACING_TOKENS = [
  { var: '--space-1',  label: 'space-1' },
  { var: '--space-2',  label: 'space-2' },
  { var: '--space-3',  label: 'space-3' },
  { var: '--space-4',  label: 'space-4' },
  { var: '--space-5',  label: 'space-5' },
  { var: '--space-6',  label: 'space-6' },
  { var: '--space-8',  label: 'space-8' },
  { var: '--space-10', label: 'space-10' },
];

const FONT_TOKENS = [
  { var: '--font-sans', label: 'font-sans' },
  { var: '--font-mono', label: 'font-mono' },
];

const NEUMORPHISM_TOKENS = {
  '--bg': '#E9EDF0',
  '--text': '#343434',
  '--text-dim': '#6B7280',
  '--muted': '#A1AEBF',
  '--accent': '#489CC1',
  '--accent-hover': '#3A8DB5',
  '--success': '#21A87D',
  '--danger': '#FF7272',
  '--warning': '#FFBB0D',
  '--info': '#5B9BD5',
  '--purple': '#8B5CF6',
  '--pink': '#EC4899',
  '--orange': '#F97316',
  '--teal': '#14B8A6',
  '--indigo': '#6366F1',
  '--radius-sm': '10px',
  '--radius': '16px',
  '--radius-lg': '24px',
  '--radius-full': '999px',
  '--space-1': '4px',
  '--space-2': '8px',
  '--space-3': '12px',
  '--space-4': '16px',
  '--space-5': '20px',
  '--space-6': '24px',
  '--space-8': '32px',
  '--space-10': '40px',
  '--font-sans': "'Inter', -apple-system, sans-serif",
  '--font-mono': "'JetBrains Mono', ui-monospace, Menlo, monospace",
};

const NEUMORPHISM_CUSTOM_CSS = `/* Neumorphism 二重シャドウ（lib/theme.css と同じ） */
:root {
  --shadow-light: #FFFFFF;
  --shadow-dark: rgba(163, 177, 198, 0.5);
  --shadow-out:    -8px -8px 16px var(--shadow-light),  8px  8px 16px var(--shadow-dark);
  --shadow-out-sm: -3px -3px 6px var(--shadow-light),   3px  3px 6px var(--shadow-dark);
  --shadow-out-lg: -16px -16px 32px var(--shadow-light), 16px 16px 32px var(--shadow-dark);
  --shadow-in:     inset 4px 4px 8px var(--shadow-dark),   inset -4px -4px 8px var(--shadow-light);
  --shadow-in-sm:  inset 2px 2px 4px var(--shadow-dark),   inset -2px -2px 4px var(--shadow-light);
  --border:        rgba(163, 177, 198, 0.18);
  --border-strong: rgba(163, 177, 198, 0.32);
}`;

// ═══════════════════════════════════════════════════════════
// State
// ═══════════════════════════════════════════════════════════

const state = {
  themes: [],
  currentId: null,
  previewReady: false,
  actionTargetId: null,
};

// ═══════════════════════════════════════════════════════════
// Utilities
// ═══════════════════════════════════════════════════════════

function uid() {
  return 'theme_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

function nowIso() { return new Date().toISOString(); }

function byId(id) { return document.getElementById(id); }

function debounce(fn, ms) {
  let t;
  return function () {
    const args = arguments;
    const self = this;
    clearTimeout(t);
    t = setTimeout(() => fn.apply(self, args), ms);
  };
}

function formatDate(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  } catch (e) {
    return '—';
  }
}

function toHexSafe(value) {
  if (typeof value !== 'string') return '#000000';
  const v = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
  const m3 = v.match(/^#([0-9a-fA-F]{3})$/);
  if (m3) {
    const [r, g, b] = m3[1].split('');
    return '#' + r + r + g + g + b + b;
  }
  return '#000000';
}

// ═══════════════════════════════════════════════════════════
// Storage
// ═══════════════════════════════════════════════════════════

function cleanupLegacyData() {
  LEGACY_KEYS.forEach((k) => {
    if (localStorage.getItem(k) !== null) {
      localStorage.removeItem(k);
    }
  });
}

function _useDrive() {
  return !!(window.driveSync && window.driveSync.isSignedIn && window.driveSync.isSignedIn());
}

let _driveProgressCount = 0;
function driveProgressStart() {
  _driveProgressCount++;
  const el = byId('drive-progress');
  if (el) el.hidden = false;
}
function driveProgressEnd() {
  _driveProgressCount = Math.max(0, _driveProgressCount - 1);
  if (_driveProgressCount === 0) {
    const el = byId('drive-progress');
    if (el) el.hidden = true;
  }
}

async function loadThemes() {
  let raw;
  try {
    if (_useDrive()) {
      raw = await window.driveSync.loadItem(LS_KEY);
    } else {
      raw = localStorage.getItem(LS_KEY);
    }
  } catch (e) {
    raw = localStorage.getItem(LS_KEY);
  }
  try {
    state.themes = raw ? JSON.parse(raw) : [];
  } catch (e) {
    state.themes = [];
  }
}

async function saveThemes() {
  const json = JSON.stringify(state.themes);
  const drive = _useDrive();
  if (drive) driveProgressStart();
  try {
    if (drive) {
      await window.driveSync.saveItem(LS_KEY, json);
    } else {
      localStorage.setItem(LS_KEY, json);
    }
  } finally {
    if (drive) driveProgressEnd();
  }
}

// ═══════════════════════════════════════════════════════════
// Theme factory
// ═══════════════════════════════════════════════════════════

function createNeumorphismTheme() {
  return {
    id: uid(),
    name: 'Neumorphism (default)',
    description: '白ベースのニューモフィズム。yuto\'s dev tools の現行デフォルト。二重 shadow で柔らかい立体感を作る。',
    tokens: Object.assign({}, NEUMORPHISM_TOKENS),
    customCss: NEUMORPHISM_CUSTOM_CSS,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
}

function createNewTheme(name, description, base) {
  const theme = {
    id: uid(),
    name: name || 'New Theme',
    description: description || '',
    tokens: Object.assign({}, NEUMORPHISM_TOKENS),
    customCss: base === 'blank' ? '' : NEUMORPHISM_CUSTOM_CSS,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  return theme;
}

// ═══════════════════════════════════════════════════════════
// List view
// ═══════════════════════════════════════════════════════════

function renderList() {
  const grid = byId('theme-grid');
  const empty = byId('theme-empty');
  grid.innerHTML = '';

  if (state.themes.length === 0) {
    empty.style.display = '';
    return;
  }
  empty.style.display = 'none';

  const sorted = state.themes.slice().sort((a, b) =>
    (b.updatedAt || '').localeCompare(a.updatedAt || '')
  );

  sorted.forEach((theme) => {
    const card = document.createElement('div');
    card.className = 'dp-theme-card';
    card.setAttribute('role', 'button');
    card.tabIndex = 0;
    card.addEventListener('click', () => enterEditor(theme.id));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        enterEditor(theme.id);
      }
    });

    const thumb = document.createElement('div');
    thumb.className = 'dp-theme-card-thumb';
    thumb.style.background = theme.tokens['--bg'] || '#E9EDF0';
    ['--accent', '--success', '--warning', '--danger', '--purple'].forEach((v) => {
      const sw = document.createElement('div');
      sw.className = 'dp-theme-card-swatch';
      sw.style.background = theme.tokens[v] || '#ccc';
      thumb.appendChild(sw);
    });

    const name = document.createElement('div');
    name.className = 'dp-theme-card-name';
    name.textContent = theme.name;

    const desc = document.createElement('div');
    desc.className = 'dp-theme-card-desc';
    desc.textContent = theme.description || '説明なし';

    const meta = document.createElement('div');
    meta.className = 'dp-theme-card-meta';
    const left = document.createElement('span');
    left.textContent = formatDate(theme.updatedAt);
    const right = document.createElement('span');
    right.textContent = 'edit →';
    meta.append(left, right);

    const actions = document.createElement('div');
    actions.className = 'app-card-actions';

    const exportBtn = document.createElement('button');
    exportBtn.type = 'button';
    exportBtn.className = 'app-card-btn';
    exportBtn.title = 'CSS 書出';
    exportBtn.textContent = '⇩';
    exportBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openExportModalFor(theme.id);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'app-card-btn danger';
    deleteBtn.title = '削除';
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openDeleteModalFor(theme.id);
    });

    actions.append(exportBtn, deleteBtn);
    card.append(thumb, name, desc, meta, actions);
    grid.appendChild(card);
  });
}

// ═══════════════════════════════════════════════════════════
// Editor view
// ═══════════════════════════════════════════════════════════

function getCurrentTheme() {
  return state.themes.find((t) => t.id === state.currentId);
}

function enterEditor(id) {
  state.currentId = id;
  document.body.dataset.view = 'editor';
  renderEditor();
  if (window.theme) {
    const m = byId('theme-mount-editor');
    if (m && !m.firstChild) window.theme.mountUI(m);
  }
  window.scrollTo(0, 0);
}

function exitEditor() {
  state.currentId = null;
  document.body.dataset.view = 'list';
  renderList();
  window.scrollTo(0, 0);
}

function renderEditor() {
  const theme = getCurrentTheme();
  if (!theme) { exitEditor(); return; }

  byId('editor-title').textContent = theme.name;
  byId('field-name').value = theme.name;
  byId('field-description').value = theme.description || '';
  byId('field-custom-css').value = theme.customCss || '';

  renderTokenForm('form-colors', COLOR_TOKENS, theme.tokens, 'color');
  renderTokenForm('form-radius', RADIUS_TOKENS, theme.tokens, 'text');
  renderTokenForm('form-spacing', SPACING_TOKENS, theme.tokens, 'text');
  renderTokenForm('form-fonts', FONT_TOKENS, theme.tokens, 'text');

  updatePreview();
}

function renderTokenForm(containerId, tokens, values, inputType) {
  const container = byId(containerId);
  container.innerHTML = '';

  tokens.forEach((tok) => {
    const row = document.createElement('div');
    row.className = 'dp-token-row';

    const label = document.createElement('label');
    label.className = 'dp-token-label';
    label.textContent = tok.label;
    row.appendChild(label);

    const val = values[tok.var] || '';

    if (inputType === 'color') {
      const field = document.createElement('div');
      field.className = 'color-field';

      const swatch = document.createElement('input');
      swatch.type = 'color';
      swatch.className = 'color-field-swatch';
      swatch.value = toHexSafe(val);

      const hex = document.createElement('input');
      hex.type = 'text';
      hex.className = 'color-field-hex';
      hex.value = val;
      hex.maxLength = 9;

      swatch.addEventListener('input', () => {
        hex.value = swatch.value;
        onTokenChange(tok.var, swatch.value);
      });
      hex.addEventListener('input', () => {
        const v = hex.value.trim();
        onTokenChange(tok.var, v);
        if (/^#[0-9a-fA-F]{6}$/.test(v)) swatch.value = v;
      });

      field.append(swatch, hex);
      row.appendChild(field);
    } else {
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'form-input dp-token-input';
      input.value = val;
      input.addEventListener('input', () => {
        onTokenChange(tok.var, input.value);
      });
      row.appendChild(input);
    }

    container.appendChild(row);
  });
}

// ═══════════════════════════════════════════════════════════
// Edit handlers
// ═══════════════════════════════════════════════════════════

const schedulePreviewUpdate = debounce(updatePreview, 120);

const autoSave = debounce(async () => {
  const theme = getCurrentTheme();
  if (!theme) return;
  theme.updatedAt = nowIso();
  try {
    await saveThemes();
  } catch (e) {
    showToast('保存エラー', 'error');
  }
}, 400);

function onTokenChange(varName, value) {
  const theme = getCurrentTheme();
  if (!theme) return;
  theme.tokens[varName] = value;
  schedulePreviewUpdate();
  autoSave();
}

function onFieldChange(field, value) {
  const theme = getCurrentTheme();
  if (!theme) return;
  if (field === 'name') {
    theme.name = value;
    byId('editor-title').textContent = value;
  } else if (field === 'description') {
    theme.description = value;
  } else if (field === 'customCss') {
    theme.customCss = value;
    schedulePreviewUpdate();
  }
  autoSave();
}

// ═══════════════════════════════════════════════════════════
// Live preview
// ═══════════════════════════════════════════════════════════

function updatePreview() {
  const theme = getCurrentTheme();
  if (!theme || !state.previewReady) return;
  const css = buildThemeCss(theme);
  const frame = byId('preview-frame');
  if (frame && frame.contentWindow) {
    frame.contentWindow.postMessage({ type: 'updateTheme', css }, '*');
  }
}

function buildThemeCss(theme) {
  const tokenLines = Object.entries(theme.tokens)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');
  let css = `:root {\n${tokenLines}\n}\n`;
  if (theme.customCss && theme.customCss.trim()) {
    css += '\n' + theme.customCss;
  }
  return css;
}

// ═══════════════════════════════════════════════════════════
// CRUD
// ═══════════════════════════════════════════════════════════

async function handleCreateTheme(name, description, base) {
  const theme = createNewTheme(name, description, base);
  state.themes.push(theme);
  await saveThemes();
  closeModal('modal-new');
  enterEditor(theme.id);
  showToast('テーマを作成しました', 'success');
}

async function deleteTargetTheme() {
  const id = state.actionTargetId;
  if (!id) return;
  const wasEditing = state.currentId === id;
  state.themes = state.themes.filter((t) => t.id !== id);
  await saveThemes();
  closeModal('modal-delete');
  state.actionTargetId = null;
  if (wasEditing) {
    exitEditor();
  } else {
    renderList();
  }
  showToast('削除しました', 'success');
}

// ═══════════════════════════════════════════════════════════
// Export
// ═══════════════════════════════════════════════════════════

function openExportModalFor(id) {
  const theme = state.themes.find((t) => t.id === id);
  if (!theme) return;
  state.actionTargetId = id;
  byId('export-textarea').value = buildExportCss(theme);
  openModal('modal-export');
}

function openDeleteModalFor(id) {
  const theme = state.themes.find((t) => t.id === id);
  if (!theme) return;
  state.actionTargetId = id;
  byId('delete-target-name').textContent = theme.name;
  openModal('modal-delete');
}

function buildExportCss(theme) {
  const header =
`/* ============================================================
   ${theme.name}
   ${theme.description || ''}
   Exported: ${nowIso()}
   ============================================================ */

`;
  return header + buildThemeCss(theme);
}

async function copyExport() {
  const text = byId('export-textarea').value;
  try {
    await navigator.clipboard.writeText(text);
    showToast('コピーしました', 'success');
  } catch (e) {
    showToast('コピーに失敗しました', 'error');
  }
}

// ═══════════════════════════════════════════════════════════
// Modal helpers
// ═══════════════════════════════════════════════════════════

function openModal(id) {
  const el = byId(id);
  if (el) el.hidden = false;
}
function closeModal(id) {
  const el = byId(id);
  if (el) el.hidden = true;
}

// ═══════════════════════════════════════════════════════════
// Toast
// ═══════════════════════════════════════════════════════════

let _toastTimer = null;
function showToast(msg, variant) {
  const toast = byId('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = 'toast show' + (variant ? ' ' + variant : '');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

// ═══════════════════════════════════════════════════════════
// Init
// ═══════════════════════════════════════════════════════════

async function init() {
  cleanupLegacyData();

  if (window.yutoIcons) {
    const ic = byId('app-icon');
    if (ic) ic.innerHTML = window.yutoIcons.toSVG('palette', { size: 20 });
  }

  if (window.theme) {
    const m = byId('theme-mount');
    if (m) window.theme.mountUI(m);
  }

  if (window.driveSync) {
    window.driveSync.register({
      toolId: 'designpocket',
      keys: [LS_KEY],
      onSyncedFromRemote: async () => {
        await loadThemes();
        if (document.body.dataset.view === 'editor' && state.currentId) {
          renderEditor();
        } else {
          renderList();
        }
      },
    });
    const mount = byId('sync-mount');
    if (mount) window.driveSync.mountUI(mount);
    window.driveSync.init();
  }

  await loadThemes();

  // Seed: first-run user gets the neumorphism theme as a reference
  if (state.themes.length === 0) {
    state.themes.push(createNeumorphismTheme());
    await saveThemes();
  }

  renderList();
  bindEvents();

  // Deep link: #edit → 最初のテーマを開く、#edit=<id> → 指定 ID を開く
  const hash = location.hash;
  if (hash && hash.startsWith('#edit')) {
    const id = hash.includes('=') ? hash.split('=')[1] : null;
    const target = id ? state.themes.find(t => t.id === id) : state.themes[0];
    if (target) enterEditor(target.id);
  }
}

function bindEvents() {
  byId('btn-create-theme').addEventListener('click', () => {
    byId('new-name').value = '';
    byId('new-description').value = '';
    byId('new-base').value = 'neumorphism';
    openModal('modal-new');
    setTimeout(() => byId('new-name').focus(), 50);
  });

  byId('form-new').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = byId('new-name').value.trim();
    const desc = byId('new-description').value.trim();
    const base = byId('new-base').value;
    if (!name) return;
    handleCreateTheme(name, desc, base);
  });

  byId('back-to-list').addEventListener('click', (e) => {
    e.preventDefault();
    exitEditor();
  });

  byId('btn-copy-export').addEventListener('click', copyExport);
  byId('btn-confirm-delete').addEventListener('click', deleteTargetTheme);

  byId('field-name').addEventListener('input', (e) => onFieldChange('name', e.target.value));
  byId('field-description').addEventListener('input', (e) => onFieldChange('description', e.target.value));
  byId('field-custom-css').addEventListener('input', (e) => onFieldChange('customCss', e.target.value));

  // Click on editor title focuses the name field
  byId('editor-title').addEventListener('click', () => {
    byId('field-name').focus();
    byId('field-name').select();
  });

  // Modal close buttons
  document.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
  });

  // Click overlay to close
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.hidden = true;
    });
  });

  // Esc to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach((m) => m.hidden = true);
    }
  });

  // Iframe ready
  window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'previewReady') {
      state.previewReady = true;
      const status = byId('preview-status');
      if (status) status.textContent = 'live';
      if (state.currentId) updatePreview();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);

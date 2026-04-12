/* ============================================================
   DesignPocket — Theme Catalog v3
   - プリセット閲覧専用カタログ
   - テーマはコード内に定義、ユーザー CRUD なし
   - 左ペイン = トークン閲覧、右ペイン = iframe ライブプレビュー
   ============================================================ */

'use strict';

// ═══════════════════════════════════════════════════════════
// Token definitions
// ═══════════════════════════════════════════════════════════

<<<<<<< Updated upstream
=======
const LS_KEY = 'designpocket_themes';
const LEGACY_KEYS = ['designpocket_apps', 'designpocket_ideas'];
const RAMS_SEEDED_FLAG = 'designpocket_rams_seeded';
const RAMS_CSS_VERSION_FLAG = 'designpocket_rams_css_v6';

>>>>>>> Stashed changes
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

// ═══════════════════════════════════════════════════════════
// Preset themes
// ═══════════════════════════════════════════════════════════

const PRESET_THEMES = [
  {
    id: 'preset_neumorphism',
    name: 'Neumorphism',
    description: '白ベースのニューモフィズム。二重 shadow で柔らかい立体感を作る。yuto\'s dev tools の現行デフォルト。',
    tokens: {
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
    },
    cssFile: 'themes/neumorphism.css',
    customCss: '',
  },

  {
    id: 'preset_cyberpunk',
    name: 'Cyberpunk Neon',
    description: 'ダーク背景にネオンカラーが光るサイバーパンク。シアンのグロウシャドウで近未来感を演出。',
    tokens: {
      '--bg': '#0B0B1A',
      '--text': '#E0E0FF',
      '--text-dim': '#8888AA',
      '--muted': '#555577',
      '--accent': '#00F0FF',
      '--accent-hover': '#00C8D8',
      '--success': '#00FF88',
      '--danger': '#FF3366',
      '--warning': '#FFD600',
      '--info': '#7B68EE',
      '--purple': '#BF5FFF',
      '--pink': '#FF69B4',
      '--orange': '#FF8C00',
      '--teal': '#00CED1',
      '--indigo': '#5B5FFF',
      '--radius-sm': '6px',
      '--radius': '12px',
      '--radius-lg': '20px',
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
    },
    cssFile: 'themes/cyberpunk-neon.css',
    customCss: '',
  },

  {
    id: 'preset_liquid_glass',
    name: 'Liquid Glass',
    description: 'Apple風リキッドグラス。半透明フロストガラス + backdrop-filter blur + 虹色リフレクション。',
    tokens: {
      '--bg': '#E8EDF4',
      '--text': '#1A1A2E',
      '--text-dim': '#5A5E78',
      '--muted': '#9498B0',
      '--accent': '#007AFF',
      '--accent-hover': '#0066DD',
      '--success': '#30D158',
      '--danger': '#FF453A',
      '--warning': '#FFD60A',
      '--info': '#5AC8FA',
      '--purple': '#BF5AF2',
      '--pink': '#FF6482',
      '--orange': '#FF9F0A',
      '--teal': '#64D2B1',
      '--indigo': '#5856D6',
      '--radius-sm': '12px',
      '--radius': '20px',
      '--radius-lg': '28px',
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
    },
    cssFile: 'themes/liquid-glass.css',
    customCss: '',
  },
];

const DIETER_RAMS_TOKENS = {
  '--bg': '#ECE9E0',
  '--text': '#1A1A1A',
  '--text-dim': '#5C5C58',
  '--muted': '#9A968E',
  '--accent': '#F25D27',
  '--accent-hover': '#D94B1C',
  '--success': '#3A8F5B',
  '--danger': '#D13B3B',
  '--warning': '#E8A52F',
  '--info': '#3B7FB5',
  '--purple': '#6B4E8C',
  '--pink': '#C15A8B',
  '--orange': '#F25D27',
  '--teal': '#2F8A86',
  '--indigo': '#3B4D8E',
  '--radius-sm': '4px',
  '--radius': '8px',
  '--radius-lg': '12px',
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

const DIETER_RAMS_CUSTOM_CSS = `/* ============================================================
   Dieter Rams / Braun — "Less, but better"
   dot grid texture + mono caps labels + orange focal dot
   ============================================================ */

/* ----- Flat shadows & hairline borders --------------------- */
:root {
  --shadow-light: transparent;
  --shadow-dark: rgba(0, 0, 0, 0.08);
  --shadow-out:    0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-out-sm: 0 1px 1px rgba(0, 0, 0, 0.04);
  --shadow-out-lg: 0 4px 14px rgba(0, 0, 0, 0.08);
  --shadow-in:     inset 0 0 0 1px rgba(0, 0, 0, 0.14);
  --shadow-in-sm:  inset 0 0 0 1px rgba(0, 0, 0, 0.08);
  --border:        rgba(0, 0, 0, 0.10);
  --border-strong: rgba(0, 0, 0, 0.20);
}

/* ----- Braun speaker-grille dot texture on body ------------ */
html, body {
  background-color: var(--bg);
  background-image: radial-gradient(
    circle,
    rgba(0, 0, 0, 0.11) 1px,
    transparent 1.3px
  );
  background-size: 14px 14px;
  background-position: 0 0;
}

/* ----- Mono caps labels (Braun functional-label aesthetic) - */
.form-label,
.app-card-meta,
.pv-sub {
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 10px;
  font-weight: 700;
  color: var(--text-dim);
}

/* ----- Buttons: mono caps + tracked letter-spacing --------- */
.btn {
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.10em;
  font-weight: 700;
  font-size: 12px;
}

/* ----- Section titles get an orange focal dot -------------- */
.pv-section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text);
  border-bottom: 1px solid var(--border-strong);
  letter-spacing: 0.18em;
}
.pv-section-title::before {
  content: '';
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
}

/* ----- Card titles: display weight, tight tracking --------- */
.app-card-name,
.pv-card-sample-title {
  font-weight: 800;
  letter-spacing: -0.015em;
}

/* ----- Badges: square corners, mono caps ------------------- */
.badge {
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  border-radius: 2px;
  font-weight: 700;
}

/* ----- Tabs / segmented: mono caps ------------------------- */
.tab,
.segmented-item {
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  font-size: 11px;
}

/* ----- Braun product-label: orange left-strip on cards ----- */
.app-card,
.pv-card-sample {
  position: relative;
  padding-left: calc(var(--space-4) + 12px);
  border-radius: 2px;
}
.app-card::before,
.pv-card-sample::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  background: var(--accent);
  border-radius: 2px 0 0 2px;
}

/* ----- Stark primary button: black box + orange text ------- */
.btn-primary {
  background: var(--text);
  color: var(--accent);
  border-radius: 2px;
  box-shadow: none;
}
.btn-primary:hover {
  background: #000;
  color: var(--accent);
  box-shadow: 0 2px 0 var(--accent);
}`;

// ═══════════════════════════════════════════════════════════
// State
// ═══════════════════════════════════════════════════════════

const state = {
  themes: [],
  currentId: null,
  previewReady: false,
};

// ═══════════════════════════════════════════════════════════
// Utilities
// ═══════════════════════════════════════════════════════════

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
<<<<<<< Updated upstream
=======
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

function createDieterRamsTheme() {
  return {
    id: uid(),
    name: 'Dieter Rams',
    description: 'Less, but better — 暖かいオフホワイト + Braun オレンジ。フラット設計、ハイライン境界、シャープな階調。',
    tokens: Object.assign({}, DIETER_RAMS_TOKENS),
    customCss: DIETER_RAMS_CUSTOM_CSS,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
}

function createNewTheme(name, description, base) {
  let tokens, customCss;
  if (base === 'dieter-rams') {
    tokens = Object.assign({}, DIETER_RAMS_TOKENS);
    customCss = DIETER_RAMS_CUSTOM_CSS;
  } else if (base === 'blank') {
    tokens = Object.assign({}, NEUMORPHISM_TOKENS);
    customCss = '';
  } else {
    tokens = Object.assign({}, NEUMORPHISM_TOKENS);
    customCss = NEUMORPHISM_CUSTOM_CSS;
  }
  return {
    id: uid(),
    name: name || 'New Theme',
    description: description || '',
    tokens,
    customCss,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
}

// ═══════════════════════════════════════════════════════════
>>>>>>> Stashed changes
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

  state.themes.forEach((theme) => {
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

    // サムネイル: 背景色 + カラースウォッチ
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
    desc.textContent = theme.description || '';

    const meta = document.createElement('div');
    meta.className = 'dp-theme-card-meta';
    const left = document.createElement('span');
    left.textContent = Object.keys(theme.tokens).length + ' tokens';
    const right = document.createElement('span');
    right.textContent = 'preview →';
    meta.append(left, right);

    card.append(thumb, name, desc, meta);
    grid.appendChild(card);
  });
}

// ═══════════════════════════════════════════════════════════
// Editor view (read-only preview + live tweak)
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
  // プリセットに戻す（エディタでの一時変更を破棄）
  const original = PRESET_THEMES.find((t) => t.id === state.currentId);
  const current = getCurrentTheme();
  if (original && current) {
    current.tokens = JSON.parse(JSON.stringify(original.tokens));
    current.customCss = current._originalCss || '';
  }
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
  byId('field-name').readOnly = true;
  byId('field-description').value = theme.description || '';
  byId('field-description').readOnly = true;
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

      // ライブプレビューのみ（保存なし）
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
// Edit handlers (ライブプレビュー用、保存なし)
// ═══════════════════════════════════════════════════════════

const schedulePreviewUpdate = debounce(updatePreview, 120);

function onTokenChange(varName, value) {
  const theme = getCurrentTheme();
  if (!theme) return;
  theme.tokens[varName] = value;
  schedulePreviewUpdate();
}

function onFieldChange(field, value) {
  const theme = getCurrentTheme();
  if (!theme) return;
  if (field === 'customCss') {
    theme.customCss = value;
    schedulePreviewUpdate();
  }
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
// Export
// ═══════════════════════════════════════════════════════════

function openExportModalFor(id) {
  const theme = state.themes.find((t) => t.id === id);
  if (!theme) return;
  byId('export-textarea').value = buildExportCss(theme);
  openModal('modal-export');
}

function buildExportCss(theme) {
  const header =
`/* ============================================================
   ${theme.name}
   ${theme.description || ''}
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
  // iframe ready メッセージのリスナーを最初に登録（fetch 中に iframe が先に ready になる場合がある）
  window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'previewReady') {
      state.previewReady = true;
      const status = byId('preview-status');
      if (status) status.textContent = 'live';
      if (state.currentId) updatePreview();
    }
  });

  // v1 の残骸を掃除
  ['designpocket_apps', 'designpocket_ideas', 'designpocket_themes'].forEach((k) => {
    localStorage.removeItem(k);
  });

  // プリセットからテーマを読み込み（ディープコピー）+ CSS ファイルを取得
  // file:// では fetch/XHR が CORS でブロックされるため、
  // themes/bundle.js で事前に window.THEME_CSS に埋め込んだ内容を優先参照する
  function loadCssFile(url) {
    // バンドル済み CSS があればそちらを使う（file:// でも確実に動く）
    if (window.THEME_CSS && window.THEME_CSS[url]) {
      return Promise.resolve(window.THEME_CSS[url]);
    }
    // フォールバック: fetch（http(s):// 用）
    return fetch(url).then((r) => r.ok ? r.text() : '').catch(() => '');
  }

  state.themes = await Promise.all(PRESET_THEMES.map(async (t) => {
    let css = t.customCss || '';
    if (t.cssFile) {
      css = await loadCssFile(t.cssFile) || css;
    }
    return { ...t, tokens: { ...t.tokens }, customCss: css, _originalCss: css };
  }));

  // アイコン
  if (window.yutoIcons) {
    const ic = byId('app-icon');
    if (ic) ic.innerHTML = window.yutoIcons.toSVG('palette', { size: 20 });
  }

  // テーマ切替
  if (window.theme) {
    const m = byId('theme-mount');
    if (m) window.theme.mountUI(m);
  }

<<<<<<< Updated upstream
  renderList();
  bindEvents();

  // ディープリンク
=======
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

  // Seed: first-run user gets both preset themes as references
  if (state.themes.length === 0) {
    state.themes.push(createNeumorphismTheme());
    state.themes.push(createDieterRamsTheme());
    localStorage.setItem(RAMS_SEEDED_FLAG, '1');
    localStorage.setItem(RAMS_CSS_VERSION_FLAG, '1');
    await saveThemes();
  } else if (!localStorage.getItem(RAMS_SEEDED_FLAG)) {
    // Existing users: seed Dieter Rams once
    state.themes.push(createDieterRamsTheme());
    localStorage.setItem(RAMS_SEEDED_FLAG, '1');
    localStorage.setItem(RAMS_CSS_VERSION_FLAG, '1');
    await saveThemes();
  } else if (!localStorage.getItem(RAMS_CSS_VERSION_FLAG)) {
    // Existing users with old Rams customCss: upgrade to v2 (dot grid + mono caps)
    const existing = state.themes.find((t) => t.name === 'Dieter Rams');
    if (existing) {
      existing.customCss = DIETER_RAMS_CUSTOM_CSS;
      existing.description = 'Less, but better — 暖かいオフホワイト + Braun オレンジ。フラット設計、ハイライン境界、シャープな階調。';
      existing.updatedAt = nowIso();
      await saveThemes();
    }
    localStorage.setItem(RAMS_CSS_VERSION_FLAG, '1');
  }

  renderList();
  bindEvents();

  // Deep link: #edit → 最初のテーマを開く、#edit=<id|name> → ID または名前で指定
>>>>>>> Stashed changes
  const hash = location.hash;
  if (hash && hash.startsWith('#edit')) {
    const key = hash.includes('=') ? decodeURIComponent(hash.split('=')[1]) : null;
    const target = key
      ? (state.themes.find(t => t.id === key) || state.themes.find(t => t.name === key))
      : state.themes[0];
    if (target) enterEditor(target.id);
  }
}

function bindEvents() {
  // 一覧に戻る
  byId('back-to-list').addEventListener('click', (e) => {
    e.preventDefault();
    exitEditor();
  });

  // エクスポート
  const copyBtn = byId('btn-copy-export');
  if (copyBtn) copyBtn.addEventListener('click', copyExport);

  // エディタ内フィールド
  byId('field-custom-css').addEventListener('input', (e) => onFieldChange('customCss', e.target.value));

  // モーダル閉じる
  document.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
  });
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.hidden = true;
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach((m) => m.hidden = true);
    }
  });

  // iframe ready リスナーは init() 冒頭で登録済み
}

document.addEventListener('DOMContentLoaded', init);

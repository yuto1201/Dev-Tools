// テーマ CSS バンドル（file:// でも動作させるため <script> 経由で読み込む）
// このファイルは themes/*.css から生成。CSS を編集したらこのファイルも更新すること。
window.THEME_CSS = {
  "themes/neumorphism.css": `/* Neumorphism 二重シャドウ */
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
}
`,
  "themes/cyberpunk-neon.css": `/* ============================================================
   Cyberpunk Neon — 近未来グロウ UI
   ============================================================ */

/* --- Core tokens --- */
:root {
  --neon: #00F0FF;
  --neon-pink: #FF3366;
  --neon-purple: #BF5FFF;
  --shadow-light: rgba(0, 240, 255, 0.05);
  --shadow-dark: rgba(0, 0, 0, 0.6);
  --shadow-out:    0 4px 16px rgba(0, 0, 0, 0.5), 0 0 8px rgba(0, 240, 255, 0.10);
  --shadow-out-sm: 0 2px 8px rgba(0, 0, 0, 0.4), 0 0 4px rgba(0, 240, 255, 0.08);
  --shadow-out-lg: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 240, 255, 0.15);
  --shadow-in:     inset 0 2px 8px rgba(0, 0, 0, 0.6);
  --shadow-in-sm:  inset 0 1px 4px rgba(0, 0, 0, 0.5);
  --border:        rgba(0, 240, 255, 0.12);
  --border-strong: rgba(0, 240, 255, 0.30);
}

/* --- Animations --- */
@keyframes neon-pulse {
  0%, 100% { box-shadow: 0 0 6px var(--neon), 0 0 12px rgba(0, 240, 255, 0.3); }
  50%      { box-shadow: 0 0 12px var(--neon), 0 0 24px rgba(0, 240, 255, 0.5); }
}
@keyframes neon-text-flicker {
  0%, 100% { text-shadow: 0 0 6px currentColor, 0 0 12px currentColor; }
  92%      { text-shadow: 0 0 6px currentColor, 0 0 12px currentColor; }
  93%      { text-shadow: none; }
  94%      { text-shadow: 0 0 6px currentColor, 0 0 12px currentColor; }
  96%      { text-shadow: none; }
  97%      { text-shadow: 0 0 6px currentColor, 0 0 12px currentColor; }
}
@keyframes gradient-shift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes scanline {
  0%   { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}
@keyframes border-glow-rotate {
  0%   { --glow-angle: 0deg; }
  100% { --glow-angle: 360deg; }
}

/* --- Background: グリッドパターン + スキャンライン --- */
body {
  background:
    linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px),
    var(--bg) !important;
  background-size: 40px 40px, 40px 40px !important;
}
body::after {
  content: '';
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--neon), transparent);
  opacity: 0.4;
  animation: scanline 4s linear infinite;
  pointer-events: none;
  z-index: 9999;
}

/* --- Section titles: ネオンアンダーライン --- */
.pv-section-title {
  border-bottom: 1px solid var(--neon) !important;
  color: var(--neon) !important;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.5);
}

/* --- Buttons --- */
.btn {
  border: 1px solid rgba(0, 240, 255, 0.15);
  transition: all 0.3s ease;
}
.btn:hover {
  border-color: rgba(0, 240, 255, 0.4);
  box-shadow: 0 0 8px rgba(0, 240, 255, 0.2), 0 0 16px rgba(0, 240, 255, 0.1);
}
.btn-primary {
  background: linear-gradient(135deg, #00F0FF, #0080FF) !important;
  color: #0B0B1A !important;
  font-weight: 700;
  border: none !important;
  animation: neon-pulse 3s ease-in-out infinite;
}
.btn-primary:hover {
  background: linear-gradient(135deg, #33F5FF, #339AFF) !important;
  box-shadow: 0 0 16px var(--neon), 0 0 32px rgba(0, 240, 255, 0.4) !important;
}
.btn-danger {
  border-color: rgba(255, 51, 102, 0.3) !important;
}
.btn-danger:hover {
  box-shadow: 0 0 8px rgba(255, 51, 102, 0.3), 0 0 16px rgba(255, 51, 102, 0.15) !important;
  border-color: rgba(255, 51, 102, 0.5) !important;
}

/* --- Cards: ネオンボーダーホバー --- */
.pv-card-sample {
  border: 1px solid rgba(0, 240, 255, 0.08);
  transition: all 0.35s ease;
}
.pv-card-sample:hover {
  border-color: rgba(0, 240, 255, 0.4);
  box-shadow: 0 0 12px rgba(0, 240, 255, 0.15), 0 0 24px rgba(0, 240, 255, 0.08), 0 8px 32px rgba(0, 0, 0, 0.5);
  transform: translateY(-2px);
}
.pv-card-sample-thumb {
  background: linear-gradient(135deg, rgba(0, 240, 255, 0.05), rgba(191, 95, 255, 0.05)) !important;
  border: 1px solid rgba(0, 240, 255, 0.06);
}

/* --- Surfaces: ネオンエッジ --- */
.pv-surface {
  border: 1px solid rgba(0, 240, 255, 0.08);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.pv-surface:hover {
  border-color: rgba(0, 240, 255, 0.25);
}

/* --- Form inputs: フォーカスグロウ --- */
.form-input {
  border: 1px solid rgba(0, 240, 255, 0.10) !important;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.form-input:focus {
  border-color: var(--neon) !important;
  box-shadow: var(--shadow-in-sm), 0 0 8px rgba(0, 240, 255, 0.25) !important;
  outline: none;
}

/* --- Swatches: ホバーでグロウ --- */
.pv-swatch {
  border: 1px solid rgba(0, 240, 255, 0.06);
  transition: all 0.3s ease;
}
.pv-swatch:hover {
  border-color: rgba(0, 240, 255, 0.3);
  box-shadow: var(--shadow-out-sm), 0 0 8px rgba(0, 240, 255, 0.12);
}

/* --- Header: ネオンアクセント --- */
.app-back-btn {
  border: 1px solid rgba(0, 240, 255, 0.2) !important;
}
.app-title-icon {
  border: 1px solid rgba(0, 240, 255, 0.15);
  box-shadow: var(--shadow-out-sm), 0 0 6px rgba(0, 240, 255, 0.1);
}
.app-title {
  color: var(--neon) !important;
  animation: neon-text-flicker 8s ease-in-out infinite;
}
.pv-header-sample {
  border: 1px solid rgba(0, 240, 255, 0.10);
}

/* --- Tab bar / Segmented: アクティブにグロウ --- */
.tab.active, .segmented-item.active {
  box-shadow: var(--shadow-out-sm), 0 0 8px rgba(0, 240, 255, 0.2) !important;
  border: 1px solid rgba(0, 240, 255, 0.3);
}

/* --- Badge: 光る --- */
.badge-primary { box-shadow: 0 0 6px rgba(0, 240, 255, 0.3); }
.badge-success { box-shadow: 0 0 6px rgba(0, 255, 136, 0.3); }
.badge-danger  { box-shadow: 0 0 6px rgba(255, 51, 102, 0.3); }
.badge-warning { box-shadow: 0 0 6px rgba(255, 214, 0, 0.3); }
.badge-purple  { box-shadow: 0 0 6px rgba(191, 95, 255, 0.3); }
.badge-pink    { box-shadow: 0 0 6px rgba(255, 105, 180, 0.3); }
.badge-indigo  { box-shadow: 0 0 6px rgba(91, 95, 255, 0.3); }

/* --- Progress bar: アニメーショングラデーション --- */
.progress-bar {
  background: linear-gradient(90deg, #00F0FF, #BF5FFF, #00F0FF) !important;
  background-size: 200% 100% !important;
  animation: gradient-shift 3s ease infinite;
}
.progress-bar.success {
  background: linear-gradient(90deg, #00FF88, #00CED1, #00FF88) !important;
  background-size: 200% 100% !important;
}
.progress-bar.danger {
  background: linear-gradient(90deg, #FF3366, #FF69B4, #FF3366) !important;
  background-size: 200% 100% !important;
}

/* --- Switch: ON 時にグロウ --- */
.switch input:checked + .switch-track {
  box-shadow: var(--shadow-in-sm), 0 0 8px rgba(0, 240, 255, 0.3);
}
.switch input:checked + .switch-track .switch-thumb {
  box-shadow: var(--shadow-out-sm), 0 0 6px rgba(0, 240, 255, 0.4);
}

/* --- Slider: サムにグロウ --- */
.slider::-webkit-slider-thumb {
  box-shadow: var(--shadow-out-sm), 0 0 6px rgba(0, 240, 255, 0.3);
}

/* --- Radio/Checkbox: 選択時にグロウ --- */
.radio input:checked + .radio-mark,
.checkbox input:checked + .checkbox-mark {
  box-shadow: 0 0 6px rgba(0, 240, 255, 0.3);
}

/* --- Modal: ネオンボーダー + 背景ブラー --- */
.modal-overlay {
  backdrop-filter: blur(4px);
}
.modal {
  border: 1px solid rgba(0, 240, 255, 0.15) !important;
  box-shadow: 0 0 24px rgba(0, 240, 255, 0.1), 0 16px 48px rgba(0, 0, 0, 0.7) !important;
}

/* --- Spinner: ネオンカラー --- */
.spinner {
  border-top-color: var(--neon) !important;
}

/* --- Scrollbar: ネオン --- */
::-webkit-scrollbar-thumb {
  background: rgba(0, 240, 255, 0.25) !important;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 240, 255, 0.4) !important;
}

/* --- Empty state アイコン: パルス --- */
.app-empty-icon {
  color: var(--neon) !important;
  animation: neon-text-flicker 5s ease-in-out infinite;
}

/* --- Select: ネオンフォーカス --- */
.select {
  border: 1px solid rgba(0, 240, 255, 0.10);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.select:focus {
  border-color: var(--neon);
  box-shadow: 0 0 8px rgba(0, 240, 255, 0.2);
}
`,
  "themes/liquid-glass.css": `/* ============================================================
   Liquid Glass — Apple-style frosted glass UI
   全 .pv-section に SVG フィルター歪み + backdrop-filter blur
   ============================================================ */

/* --- Design tokens --- */
:root {
  /* ガラス */
  --glass-blur: 22px;
  --glass-blur-sm: 14px;
  --glass-tint: rgba(255, 255, 255, 0.08);
  --glass-tint-md: rgba(255, 255, 255, 0.12);
  --glass-tint-hover: rgba(255, 255, 255, 0.15);
  --glass-border: rgba(255, 255, 255, 0.4);
  --glass-border-dim: rgba(255, 255, 255, 0.2);
  --glass-border-bright: rgba(255, 255, 255, 0.6);
  --glass-glow: 0 0 16px -6px rgba(255, 255, 255, 0.25);
  --glass-glow-lg: 0 0 24px -6px rgba(255, 255, 255, 0.35);
  --glass-inset: inset 0 0 10px -3px rgba(255, 255, 255, 0.6);
  --glass-accent: rgba(0, 122, 255, 0.4);
  --glass-text: white;
  --glass-text-dim: rgba(255, 255, 255, 0.6);
  --glass-text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);

  /* theme.css 上書き（ニューモフィズム shadow → フラットなガラス shadow） */
  --shadow-out:    0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);
  --shadow-out-sm: 0 2px 12px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03);
  --shadow-out-lg: 0 8px 40px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04);
  --shadow-in:     inset 0 2px 6px rgba(0, 0, 0, 0.06);
  --shadow-in-sm:  inset 0 1px 3px rgba(0, 0, 0, 0.04);
  --border:        rgba(255, 255, 255, 0.35);
  --border-strong: rgba(255, 255, 255, 0.55);
}

/* --- Animation --- */
@keyframes glass-shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* --- Background --- */
body {
  background: url('themes/bg-nature.jpg') center / cover no-repeat fixed !important;
  min-height: 100vh;
}

/* ═══════════════════════════════════════════════════════════════
   1. セクション: リキッドグラスパネル
   ::after で blur+歪み、::before でハイライト
   ═══════════════════════════════════════════════════════════════ */
.pv-section {
  position: relative;
  isolation: isolate;
  border-radius: var(--radius-lg);
  padding: var(--space-5) !important;
  box-shadow: 0 0 21px -8px rgba(255, 255, 255, 0.3);
  overflow: visible;
}
/* ハイライト（フィルターの影響を受けない独立レイヤー） */
.pv-section::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 14px -4px rgba(255, 255, 255, 0.7);
  pointer-events: none;
}
/* blur + SVG 歪みフィルター */
.pv-section::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  filter: url(#glass-distortion);
  -webkit-filter: url(#glass-distortion);
  pointer-events: none;
}
.pv-section > * {
  position: relative;
  z-index: 1;
}

/* --- Section titles --- */
.pv-section-title {
  border-bottom-color: var(--glass-border-dim) !important;
  color: rgba(255, 255, 255, 0.85) !important;
  text-shadow: var(--glass-text-shadow);
}
.pv-sub {
  color: rgba(255, 255, 255, 0.7) !important;
  text-shadow: var(--glass-text-shadow);
}

/* ═══════════════════════════════════════════════════════════════
   2. 内部パネル共通
   ═══════════════════════════════════════════════════════════════ */

/* --- 浮きパネル（カード・サーフェス等） --- */
.pv-header-sample,
.pv-swatch,
.pv-surface,
.pv-card-sample,
.pv-radii-box {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid var(--glass-border-dim) !important;
  box-shadow: var(--shadow-out-sm) !important;
}

/* --- 凹みパネル（スクロールデモ・空状態等） --- */
.pv-scroll-demo,
.pv-section > div:has(.app-empty) {
  background: var(--glass-tint) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  border-radius: var(--radius);
  box-shadow: var(--shadow-in-sm) !important;
}

/* --- 透過コンテナ --- */
.pv-form-panel {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}

/* --- Header sample --- */
.pv-header-sample { overflow: hidden; }
.app-back-btn,
.app-title-icon {
  background: var(--glass-tint-hover) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: var(--shadow-out-sm), inset 0 1px 0 rgba(255, 255, 255, 0.5) !important;
  color: var(--glass-text) !important;
  text-shadow: var(--glass-text-shadow);
}
.app-title {
  color: var(--glass-text) !important;
  text-shadow: var(--glass-text-shadow);
}

/* --- Color swatches --- */
.pv-swatch { transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }
.pv-swatch:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-out), inset 0 1px 0 rgba(255, 255, 255, 0.6) !important;
}
.pv-swatch-name { color: var(--glass-text) !important; text-shadow: var(--glass-text-shadow); }
.pv-swatch-var  { color: var(--glass-text-dim) !important; }
.pv-swatch-color {
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: var(--shadow-in-sm) !important;
}

/* --- Surfaces --- */
.pv-surface-label,
.pv-surface-var {
  color: var(--glass-text) !important;
  text-shadow: var(--glass-text-shadow);
}

/* --- Cards --- */
.pv-card-sample {
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  overflow: hidden;
}
.pv-card-sample:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: var(--shadow-out-lg), 0 0 0 1px rgba(255, 255, 255, 0.3) !important;
}
.pv-card-sample-thumb {
  background: var(--glass-tint) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  box-shadow: var(--shadow-in-sm) !important;
}

/* ═══════════════════════════════════════════════════════════════
   3. ボタン系: 個別に blur + SVG 歪みを持つガラスパーツ
   ═══════════════════════════════════════════════════════════════ */
/* --- .btn: 個別 blur + SVG 歪みを持つガラスボタン --- */
.btn {
  position: relative;
  isolation: isolate;
  background: transparent !important;
  border: 1px solid var(--glass-border) !important;
  box-shadow: var(--glass-glow), inset 0 1px 0 rgba(255, 255, 255, 0.5) !important;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  color: var(--glass-text) !important;
  text-shadow: var(--glass-text-shadow);
  overflow: hidden;
}
.btn::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  filter: url(#glass-distortion);
  -webkit-filter: url(#glass-distortion);
  pointer-events: none;
}
.btn::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  box-shadow: var(--glass-inset);
  background: var(--glass-tint);
  pointer-events: none;
}
.btn:hover {
  border-color: var(--glass-border-bright) !important;
  box-shadow: var(--glass-glow-lg), inset 0 1px 0 rgba(255, 255, 255, 0.7) !important;
  transform: translateY(-1px);
}
.btn:hover::after { background: var(--glass-tint-hover); }
.btn:active {
  transform: translateY(0);
  box-shadow: var(--shadow-in-sm) !important;
}

/* --- .dropdown-trigger: 疑似要素なしのシンプルガラス --- */
.dropdown-trigger {
  background: var(--glass-tint-md) !important;
  backdrop-filter: blur(var(--glass-blur-sm)) !important;
  -webkit-backdrop-filter: blur(var(--glass-blur-sm)) !important;
  border: 1px solid var(--glass-border) !important;
  box-shadow: var(--glass-glow), inset 0 1px 0 rgba(255, 255, 255, 0.5) !important;
  color: var(--glass-text) !important;
  text-shadow: var(--glass-text-shadow);
  transition: all 0.3s ease;
}
.dropdown-trigger:hover {
  border-color: var(--glass-border-bright) !important;
  background: var(--glass-tint-hover) !important;
  color: var(--glass-text) !important;
}

/* Primary */
.btn-primary {
  border-color: rgba(255, 255, 255, 0.45) !important;
  box-shadow: 0 0 20px -4px rgba(0, 122, 255, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.4) !important;
}
.btn-primary::after {
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.55), rgba(90, 200, 250, 0.45)) !important;
}
.btn-primary:hover {
  box-shadow: 0 0 28px -4px rgba(0, 122, 255, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.5) !important;
}
.btn-primary:hover::after {
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.65), rgba(90, 200, 250, 0.55)) !important;
}

/* Ghost */
.btn-ghost {
  border-color: rgba(255, 255, 255, 0.15) !important;
  box-shadow: none !important;
  color: rgba(255, 255, 255, 0.8) !important;
}
.btn-ghost::before, .btn-ghost::after { display: none; }
.btn-ghost:hover { border-color: rgba(255, 255, 255, 0.3) !important; }
.btn-ghost:hover::before, .btn-ghost:hover::after { display: block; }

/* Danger */
.btn-danger { color: var(--danger) !important; border-color: rgba(255, 69, 58, 0.3) !important; }
.btn-danger::after { background: rgba(255, 69, 58, 0.06) !important; }
.btn-danger:hover { border-color: rgba(255, 69, 58, 0.5) !important; }
.btn-danger:hover::after { background: rgba(255, 69, 58, 0.12) !important; }

/* Dropdown */
.dropdown.open .dropdown-trigger {
  border-color: var(--glass-accent) !important;
  box-shadow: var(--shadow-in-sm) !important;
  color: var(--glass-text) !important;
}

.dropdown-menu {
  isolation: isolate;
  background: transparent !important;
  border: 1px solid var(--glass-border) !important;
  box-shadow: var(--glass-glow-lg) !important;
  overflow: hidden;
  z-index: 9999 !important;
}
/* 開いた dropdown の親セクションを最前面に */
.pv-section:has(.dropdown.open) {
  z-index: 999;
}
/* blur + 歪み */
.dropdown-menu::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  filter: url(#glass-distortion);
  -webkit-filter: url(#glass-distortion);
  pointer-events: none;
}
/* ティント + ハイライト（歪みなし） */
.dropdown-menu::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  box-shadow: var(--glass-inset);
  background: var(--glass-tint);
  pointer-events: none;
}
.dropdown-item {
  color: var(--glass-text) !important;
  position: relative;
  z-index: 1;
}
.dropdown-item:hover { background: var(--glass-tint-hover) !important; }
.dropdown-divider {
  border-color: var(--glass-border-dim) !important;
  position: relative;
  z-index: 1;
}

/* ═══════════════════════════════════════════════════════════════
   4. フォームコントロール
   ═══════════════════════════════════════════════════════════════ */

/* --- Radio / Checkbox ボタン部分 --- */
.radio input[type="radio"],
.checkbox input[type="checkbox"] {
  background: transparent !important;
  border: 1.5px solid rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 0 12px -4px rgba(255, 255, 255, 0.3),
    inset 0 0 8px -2px rgba(255, 255, 255, 0.4) !important;
  backdrop-filter: blur(var(--glass-blur-sm));
  -webkit-backdrop-filter: blur(var(--glass-blur-sm));
}
.radio input[type="radio"]:hover,
.checkbox input[type="checkbox"]:hover {
  border-color: rgba(255, 255, 255, 0.7) !important;
  box-shadow: 0 0 16px -4px rgba(255, 255, 255, 0.4),
    inset 0 0 10px -2px rgba(255, 255, 255, 0.5) !important;
}
.radio input[type="radio"]:checked {
  border-color: rgba(0, 122, 255, 0.6) !important;
  box-shadow: 0 0 14px -4px rgba(0, 122, 255, 0.3),
    inset 0 0 8px -2px rgba(0, 122, 255, 0.15) !important;
}
.radio input[type="radio"]:checked::after {
  background: var(--accent) !important;
  box-shadow: 0 0 6px rgba(0, 122, 255, 0.4);
}
.checkbox input[type="checkbox"]:checked {
  background: rgba(0, 122, 255, 0.5) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 0 14px -4px rgba(0, 122, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
}
.radio, .checkbox { color: var(--glass-text) !important; }

/* --- Switch --- */
.switch input + .switch-track {
  background: transparent !important;
  border: 1.5px solid rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 0 12px -4px rgba(255, 255, 255, 0.3),
    inset 0 0 8px -2px rgba(255, 255, 255, 0.3) !important;
  backdrop-filter: blur(var(--glass-blur-sm));
  -webkit-backdrop-filter: blur(var(--glass-blur-sm));
}
.switch input:checked + .switch-track {
  background: rgba(0, 122, 255, 0.4) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 0 14px -4px rgba(0, 122, 255, 0.3),
    inset 0 0 8px -2px rgba(0, 122, 255, 0.15) !important;
}
.switch-thumb {
  top: 2px !important;
  left: 2px !important;
  background: rgba(255, 255, 255, 0.9) !important;
  border: none !important;
  box-shadow: 0 0 10px -3px rgba(255, 255, 255, 0.5), 0 2px 6px rgba(0, 0, 0, 0.1) !important;
}

/* --- Form input / Select --- */
.form-input,
.select {
  background: var(--glass-tint-md) !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
  border: 1px solid rgba(255, 255, 255, 0.25) !important;
  box-shadow: var(--shadow-in-sm) !important;
  color: var(--glass-text) !important;
  transition: all 0.3s ease;
}
.form-input::placeholder { color: rgba(255, 255, 255, 0.4) !important; }
.form-input:focus,
.select:focus {
  border-color: var(--glass-accent) !important;
  box-shadow: var(--shadow-in-sm), 0 0 0 3px rgba(0, 122, 255, 0.1) !important;
  outline: none;
}

/* --- Slider --- */
.slider {
  background: linear-gradient(to right,
    rgba(0, 122, 255, 0.35) 0%,
    rgba(0, 122, 255, 0.35) var(--slider-fill, 0%),
    var(--glass-tint-hover) var(--slider-fill, 0%)) !important;
  box-shadow: var(--shadow-in-sm) !important;
  border: 1px solid rgba(255, 255, 255, 0.25) !important;
}
.slider::-webkit-slider-thumb {
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1.5px solid rgba(255, 255, 255, 0.8) !important;
  box-shadow: var(--shadow-out-sm), 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

/* ═══════════════════════════════════════════════════════════════
   5. Tab bar / Segmented
   ═══════════════════════════════════════════════════════════════ */
.tab-bar, .segmented {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border: 1px solid var(--glass-border-dim) !important;
  box-shadow: var(--shadow-in-sm) !important;
  position: relative;
}
.tab, .segmented-item {
  color: var(--glass-text-dim) !important;
  transition: color 0.3s ease;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}
.tab.active, .segmented-item.active {
  color: var(--glass-text) !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}
.tab-slider {
  background: rgba(255, 255, 255, 0.22) !important;
  border: 1px solid var(--glass-border) !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.6) !important;
}

/* ═══════════════════════════════════════════════════════════════
   6. 小物コンポーネント一括
   ═══════════════════════════════════════════════════════════════ */
.avatar,
.chip,
.knob,
.picker,
.color-field,
.accordion-item,
.table-card,
.list-chip,
.alert,
.app-card-btn,
.ds-sync-signin,
.ds-sync-info,
.pv-skel-card {
  background: rgba(255, 255, 255, 0.12) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border: 1px solid var(--glass-border-dim) !important;
  box-shadow: var(--shadow-out-sm) !important;
  color: var(--glass-text) !important;
}

/* Badge */
.badge {
  background: var(--glass-tint-hover) !important;
  backdrop-filter: blur(8px) !important;
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: var(--glass-text) !important;
}
.badge-primary { background: rgba(0, 122, 255, 0.2) !important; border-color: rgba(0, 122, 255, 0.3) !important; }
.badge-success { background: rgba(48, 209, 88, 0.2) !important; border-color: rgba(48, 209, 88, 0.3) !important; }
.badge-danger  { background: rgba(255, 69, 58, 0.2) !important; border-color: rgba(255, 69, 58, 0.3) !important; }
.badge-warning { background: rgba(255, 214, 10, 0.2) !important; border-color: rgba(255, 214, 10, 0.3) !important; }
.badge-info    { background: rgba(90, 200, 250, 0.2) !important; border-color: rgba(90, 200, 250, 0.3) !important; }
.badge-purple  { background: rgba(191, 90, 242, 0.2) !important; border-color: rgba(191, 90, 242, 0.3) !important; }
.badge-pink    { background: rgba(255, 100, 130, 0.2) !important; border-color: rgba(255, 100, 130, 0.3) !important; }
.badge-orange  { background: rgba(255, 159, 10, 0.2) !important; border-color: rgba(255, 159, 10, 0.3) !important; }
.badge-teal    { background: rgba(100, 210, 177, 0.2) !important; border-color: rgba(100, 210, 177, 0.3) !important; }
.badge-indigo  { background: rgba(88, 86, 214, 0.2) !important; border-color: rgba(88, 86, 214, 0.3) !important; }

/* Avatar variants */
.avatar { border-width: 1.5px !important; }
.avatar-purple { border-color: rgba(191, 90, 242, 0.4) !important; color: var(--purple) !important; }
.avatar-pink   { border-color: rgba(255, 100, 130, 0.4) !important; color: var(--pink) !important; }
.avatar-orange { border-color: rgba(255, 159, 10, 0.4) !important; color: var(--orange) !important; }
.avatar-teal   { border-color: rgba(100, 210, 177, 0.4) !important; color: var(--teal) !important; }
.avatar-success{ border-color: rgba(48, 209, 88, 0.4) !important; color: var(--success) !important; }

/* Knob */
.knob { border-width: 1.5px !important; box-shadow: var(--shadow-out) !important; }
.knob-track { border-color: var(--glass-border-dim) !important; }

/* Chip variants */
.chip-primary { border-color: rgba(0, 122, 255, 0.3) !important; }
.chip-success { border-color: rgba(48, 209, 88, 0.3) !important; }
.chip-danger  { border-color: rgba(255, 69, 58, 0.3) !important; }

/* Picker / Color field */
.picker[type="color"] { padding: 4px !important; }
.color-field-swatch { border: none !important; box-shadow: var(--shadow-in-sm) !important; border-radius: var(--radius-sm) !important; }
.color-field-hex { background: transparent !important; border: none !important; border-left: 1px solid var(--glass-border-dim) !important; color: var(--glass-text) !important; }

/* Progress bar */
.progress {
  background: var(--glass-tint-hover) !important;
  border: 1px solid var(--glass-border-dim);
  box-shadow: var(--shadow-in-sm) !important;
}
.progress-bar {
  background: linear-gradient(90deg, #007AFF, #5AC8FA) !important;
  border-radius: inherit;
  position: relative;
  overflow: hidden;
}
.progress-bar::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: glass-shimmer 2s ease-in-out infinite;
}
.progress-bar.success { background: linear-gradient(90deg, #30D158, #64D2B1) !important; }
.progress-bar.danger  { background: linear-gradient(90deg, #FF453A, #FF6482) !important; }

/* Modal */
.modal-overlay { backdrop-filter: blur(8px); background: rgba(0, 0, 0, 0.2) !important; }
.modal {
  background: var(--glass-tint-md) !important;
  backdrop-filter: blur(var(--glass-blur)) !important;
  -webkit-backdrop-filter: blur(var(--glass-blur)) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: var(--shadow-out-lg) !important;
  overflow: hidden;
}
.modal-header, .modal-body, .modal-footer { color: var(--glass-text) !important; }

/* Toast */
.toast {
  background: rgba(255, 255, 255, 0.18) !important;
  backdrop-filter: blur(var(--glass-blur)) !important;
  -webkit-backdrop-filter: blur(var(--glass-blur)) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: var(--shadow-out) !important;
  color: var(--glass-text) !important;
}
.toast.success { border-color: rgba(48, 209, 88, 0.4) !important; }
.toast.error   { border-color: rgba(255, 69, 58, 0.4) !important; }

/* Tooltip */
.tooltip-parent[data-tooltip]::after {
  background: var(--glass-tint-md) !important;
  backdrop-filter: blur(16px) !important;
  -webkit-backdrop-filter: blur(16px) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: var(--shadow-out-sm) !important;
  color: var(--glass-text) !important;
}

/* Accordion */
.accordion { background: transparent !important; box-shadow: none !important; border: none !important; }
.accordion-trigger { background: transparent !important; color: var(--glass-text) !important; }
.accordion-trigger:hover { background: rgba(255, 255, 255, 0.1) !important; color: var(--accent) !important; }
.accordion-body {
  background: rgba(255, 255, 255, 0.05) !important;
  border-top: 1px solid rgba(255, 255, 255, 0.15) !important;
  color: rgba(255, 255, 255, 0.8) !important;
}

/* Table */
.table { color: var(--glass-text) !important; }
.table thead th { background: rgba(255, 255, 255, 0.1) !important; border-bottom-color: var(--glass-border-dim) !important; color: var(--glass-text) !important; }
.table tbody tr { border-bottom-color: rgba(255, 255, 255, 0.1) !important; }
.table tbody tr:hover { background: var(--glass-tint) !important; }

/* List chip */
.list-chip.active { border-color: var(--glass-accent) !important; background: rgba(255, 255, 255, 0.18) !important; }
.list-chip-icon { background: var(--glass-tint-hover) !important; box-shadow: var(--shadow-out-sm) !important; }
.list-chip-check { background: transparent !important; box-shadow: none !important; }
.list-chip.active .list-chip-check { background: rgba(0, 122, 255, 0.6) !important; }

/* Alert variants */
.alert-success { border-left: 3px solid rgba(48, 209, 88, 0.6) !important; }
.alert-danger  { border-left: 3px solid rgba(255, 69, 58, 0.6) !important; }
.alert-warning { border-left: 3px solid rgba(255, 214, 10, 0.6) !important; }
.alert-info    { border-left: 3px solid rgba(90, 200, 250, 0.6) !important; }

/* Card action buttons */
.app-card-btn:hover { background: rgba(255, 255, 255, 0.25) !important; }
.app-card-btn:active { box-shadow: var(--shadow-in-sm) !important; }

/* Drive sync */
.ds-sync-info { border-radius: var(--radius-full); }

/* Empty state */
.app-empty { color: var(--glass-text) !important; }
.app-empty-icon { color: var(--glass-text-dim) !important; }
.app-empty-text { color: rgba(255, 255, 255, 0.7) !important; }

/* Spinner */
.spinner { border-color: rgba(255, 255, 255, 0.15) !important; border-top-color: var(--accent) !important; }

/* Skeleton */
.skeleton { background: var(--glass-tint-hover) !important; }

/* Range control */
.range-control-track { background: var(--glass-tint-hover) !important; border: 1px solid var(--glass-border-dim) !important; }
.range-control-fill  { background: rgba(0, 122, 255, 0.45) !important; }
.range-control-thumb { background: rgba(255, 255, 255, 0.9) !important; border: 1.5px solid var(--glass-border-bright) !important; box-shadow: var(--shadow-out-sm) !important; }

/* Divider */
.divider,
.divider-vertical,
.divider-label::before,
.divider-label::after { border-color: rgba(255, 255, 255, 0.25) !important; }
.divider-label { color: var(--glass-text-dim) !important; }

/* Scrollbar */
::-webkit-scrollbar-thumb { background: var(--glass-border-dim) !important; border-radius: 999px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.35) !important; }

/* ═══════════════════════════════════════════════════════════════
   7. グローバルテキスト白化
   ═══════════════════════════════════════════════════════════════ */
.pv-section,
.pv-section label,
.pv-section p,
.pv-section span,
.pv-section h3,
.pv-section td,
.pv-section th {
  color: var(--glass-text);
  text-shadow: var(--glass-text-shadow);
}
`,
};

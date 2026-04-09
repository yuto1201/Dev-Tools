// ============================================================
// lib/theme.js — yuto's dev tools 共通テーマ切替モジュール
//
// 全ツールから <script src="../lib/theme.js"></script> で読み込む。
// FOUC（一瞬ダーク→ライトのちらつき）を避けるため、必ず <head> 内で
// 読み込むこと（lib/theme.css の <link> より後でよい）。
//
// 使い方：
//   1. <html> に data-theme 属性が自動で付与される（既定 'light'）
//   2. テーマ切替ボタンを置きたい場所に <div id="theme-mount"></div> を置き、
//      window.theme.mountUI(document.getElementById('theme-mount')) を呼ぶ
//   3. プログラムから切り替えたい場合は window.theme.toggle() / .apply('dark')
//
// localStorage キー: 'devtools_theme'
// ============================================================

(function () {
  'use strict';

  var STORAGE_KEY = 'devtools_theme';
  var DEFAULT_THEME = 'light';
  var VALID_THEMES = ['light', 'dark'];

  // ---- Storage ----------------------------------------------
  function getStored() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      return VALID_THEMES.indexOf(v) >= 0 ? v : DEFAULT_THEME;
    } catch (e) {
      return DEFAULT_THEME;
    }
  }

  function setStored(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // localStorage 不可（プライベートモード等）でも動き続ける
    }
  }

  // ---- Apply ------------------------------------------------
  function apply(theme) {
    if (VALID_THEMES.indexOf(theme) < 0) theme = DEFAULT_THEME;
    document.documentElement.dataset.theme = theme;
    setStored(theme);
    updateAllButtons();
    notifyListeners(theme);
  }

  function get() {
    return document.documentElement.dataset.theme || DEFAULT_THEME;
  }

  function toggle() {
    apply(get() === 'light' ? 'dark' : 'light');
  }

  // ---- UI button -------------------------------------------
  function updateAllButtons() {
    var isLight = get() === 'light';
    var icon = isLight ? '🌙' : '☀';
    var label = isLight ? 'ダークモードに切り替え' : 'ライトモードに切り替え';
    var btns = document.querySelectorAll('.theme-toggle-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].textContent = icon;
      btns[i].setAttribute('aria-label', label);
      btns[i].setAttribute('title', label);
    }
  }

  function mountUI(container) {
    if (!container) return;
    container.classList.add('theme-toggle-mount');
    container.innerHTML = '';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle-btn';
    btn.addEventListener('click', toggle);
    container.appendChild(btn);
    updateAllButtons();
  }

  // ---- Listeners --------------------------------------------
  var listeners = [];
  function onChange(fn) {
    if (typeof fn === 'function') listeners.push(fn);
  }
  function notifyListeners(theme) {
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](theme); } catch (e) {}
    }
  }

  // ---- Init -------------------------------------------------
  // 即時適用：FOUC 防止のため <head> 内で実行されることを前提
  apply(getStored());

  // DOMContentLoaded 後にも一度ボタンを更新（ボタンが後から DOM に来た場合用）
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateAllButtons);
  }

  // ---- Public API -------------------------------------------
  window.theme = {
    apply: apply,
    toggle: toggle,
    get: get,
    mountUI: mountUI,
    onChange: onChange,
  };
})();

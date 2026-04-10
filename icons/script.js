// =============================================================
// icons/script.js — Icon Gallery
// =============================================================

(function(){
  'use strict';

  // ---- DOM キャッシュ ------------------------------------------
  var grid       = document.getElementById('grid');
  var searchEl   = document.getElementById('search');
  var filtersEl  = document.getElementById('filters');
  var countEl    = document.getElementById('icon-count');
  var modal      = document.getElementById('modal');
  var modalClose = document.getElementById('modal-close');
  var modalPreview = document.getElementById('modal-preview');
  var modalName  = document.getElementById('modal-name');
  var modalTags  = document.getElementById('modal-tags');
  var modalCode  = document.getElementById('modal-code');
  var modalSize  = document.getElementById('modal-size');
  var modalSizeVal = document.getElementById('modal-size-value');
  var modalColor    = document.getElementById('modal-color');
  var modalColorHex = document.getElementById('modal-color-hex');
  var colorPresetsEl = document.getElementById('color-presets');
  var btnCopySVG  = document.getElementById('btn-copy-svg');
  var btnCopyName = document.getElementById('btn-copy-name');
  var btnCopyJS   = document.getElementById('btn-copy-js');
  var titleIconEl = document.getElementById('title-icon');
  var searchIconEl= document.getElementById('search-icon');

  // ---- 状態 ----------------------------------------------------
  var allIcons = [];
  var activeCat = 'all';
  var searchQuery = '';
  var selectedIcon = null;
  var selectedColor = '';  // '' = currentColor

  // ---- カラープリセット ----------------------------------------
  var COLOR_PRESETS = [
    { value:'',        label:'Auto' },
    { value:'#374151', label:'Gray' },
    { value:'#3b82f6', label:'Blue' },
    { value:'#8b5cf6', label:'Purple' },
    { value:'#ec4899', label:'Pink' },
    { value:'#ef4444', label:'Red' },
    { value:'#f97316', label:'Orange' },
    { value:'#eab308', label:'Yellow' },
    { value:'#22c55e', label:'Green' },
    { value:'#06b6d4', label:'Cyan' },
    { value:'#ffffff', label:'White' },
    { value:'#000000', label:'Black' },
  ];

  // ---- 初期化 --------------------------------------------------
  function init(){
    if(!window.yutoIcons){
      grid.innerHTML = '<div class="icon-empty"><div class="icon-empty-icon">!</div><div class="icon-empty-text">icons.js が読み込まれていません</div></div>';
      return;
    }

    allIcons = window.yutoIcons.list();

    // タイトルアイコン
    if(titleIconEl) titleIconEl.innerHTML = window.yutoIcons.toSVG('grid-3x3', {size:20});
    // 検索アイコン
    if(searchIconEl) searchIconEl.innerHTML = window.yutoIcons.toSVG('search', {size:16});

    // フィルタタブ生成
    var cats = window.yutoIcons.categories();
    cats.forEach(function(cat){
      var btn = document.createElement('button');
      btn.className = 'tab';
      btn.dataset.cat = cat;
      btn.textContent = window.yutoIcons.categoryLabel(cat);
      filtersEl.appendChild(btn);
    });

    // イベント
    searchEl.addEventListener('input', onSearch);
    filtersEl.addEventListener('click', onFilterClick);
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e){
      if(e.target === modal) closeModal();
    });
    modalSize.addEventListener('input', onSizeChange);
    modalColor.addEventListener('input', onColorPickerChange);
    modalColorHex.addEventListener('change', onColorHexChange);
    btnCopySVG.addEventListener('click', function(){ copyToClipboard(getCurrentSVG(), 'SVG コピー完了'); });
    btnCopyName.addEventListener('click', function(){ copyToClipboard(selectedIcon.name, '名前をコピー: ' + selectedIcon.name); });
    btnCopyJS.addEventListener('click', function(){ copyToClipboard(getJSCode(), 'JS コードをコピー完了'); });

    // カラープリセット生成
    buildColorPresets();

    // キーボード
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeModal();
      // Ctrl/Cmd + K でフォーカス
      if((e.ctrlKey || e.metaKey) && e.key === 'k'){
        e.preventDefault();
        searchEl.focus();
        searchEl.select();
      }
    });

    renderGrid();
    initTheme();
  }

  // ---- テーマ --------------------------------------------------
  function initTheme(){
    if(!window.theme) return;
    var m = document.getElementById('theme-mount');
    if(m) window.theme.mountUI(m);
  }

  // ---- 検索 ----------------------------------------------------
  function onSearch(){
    searchQuery = searchEl.value.trim().toLowerCase();
    renderGrid();
  }

  // ---- フィルタ ------------------------------------------------
  function onFilterClick(e){
    var btn = e.target.closest('.tab');
    if(!btn) return;
    activeCat = btn.dataset.cat;
    filtersEl.querySelectorAll('.tab').forEach(function(t){
      t.classList.toggle('active', t === btn);
    });
    renderGrid();
  }

  // ---- 検索マッチング（日本語対応） ----------------------------
  function matchesQuery(icon, q){
    // 英語名・カテゴリ・英語タグ
    if(icon.name.indexOf(q) !== -1) return true;
    if(icon.category.indexOf(q) !== -1) return true;
    if(icon.tags.some(function(t){ return t.indexOf(q) !== -1; })) return true;
    // 日本語タグ
    if(icon.ja && icon.ja.some(function(t){ return t.indexOf(q) !== -1; })) return true;
    return false;
  }

  // ---- グリッド描画 --------------------------------------------
  function renderGrid(){
    var filtered = allIcons.filter(function(icon){
      // カテゴリフィルタ
      if(activeCat !== 'all' && icon.category !== activeCat) return false;
      // 検索
      if(searchQuery){
        return matchesQuery(icon, searchQuery);
      }
      return true;
    });

    countEl.textContent = filtered.length + ' / ' + allIcons.length + ' icons';

    grid.innerHTML = '';

    if(filtered.length === 0){
      grid.innerHTML = '<div class="icon-empty"><div class="icon-empty-icon" id="empty-icon"></div><div class="icon-empty-text">該当するアイコンがありません</div></div>';
      var emptyIcon = document.getElementById('empty-icon');
      if(emptyIcon) emptyIcon.innerHTML = window.yutoIcons.toSVG('search', {size:48});
      return;
    }

    var frag = document.createDocumentFragment();
    filtered.forEach(function(icon){
      var cell = document.createElement('div');
      cell.className = 'icon-cell';
      cell.dataset.name = icon.name;

      var svgWrap = document.createElement('div');
      svgWrap.className = 'icon-cell-svg';
      svgWrap.innerHTML = window.yutoIcons.toSVG(icon.name, {size:24});

      var label = document.createElement('div');
      label.className = 'icon-cell-name';
      label.textContent = icon.name;

      cell.appendChild(svgWrap);
      cell.appendChild(label);
      cell.addEventListener('click', function(){ openModal(icon); });
      frag.appendChild(cell);
    });
    grid.appendChild(frag);
  }

  // ---- モーダル ------------------------------------------------
  function openModal(icon){
    selectedIcon = icon;
    modalSize.value = 48;
    modalSizeVal.textContent = '48px';
    setColor('');
    updateModalPreview();

    modalName.textContent = icon.name;

    // タグ
    modalTags.innerHTML = '';
    var catBadge = document.createElement('span');
    catBadge.className = 'badge';
    catBadge.textContent = window.yutoIcons.categoryLabel(icon.category);
    catBadge.style.background = 'var(--accent)';
    catBadge.style.color = '#fff';
    modalTags.appendChild(catBadge);

    icon.tags.forEach(function(t){
      var badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = t;
      modalTags.appendChild(badge);
    });
    if(icon.ja && icon.ja.length){
      icon.ja.forEach(function(t){
        var badge = document.createElement('span');
        badge.className = 'badge badge-ja';
        badge.textContent = t;
        modalTags.appendChild(badge);
      });
    }

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal(){
    modal.hidden = true;
    document.body.style.overflow = '';
    selectedIcon = null;
  }

  function getOpts(){
    var opts = { size: parseInt(modalSize.value, 10) };
    if(selectedColor) opts.style = 'color:' + selectedColor;
    return opts;
  }

  function updateModalPreview(){
    if(!selectedIcon) return;
    var opts = getOpts();
    modalPreview.innerHTML = window.yutoIcons.toSVG(selectedIcon.name, opts);
    // プレビューエリアの色も反映
    modalPreview.style.color = selectedColor || '';
    modalCode.textContent = window.yutoIcons.toSVG(selectedIcon.name, opts);
  }

  function getCurrentSVG(){
    return window.yutoIcons.toSVG(selectedIcon.name, getOpts());
  }

  function getJSCode(){
    var opts = [];
    var size = parseInt(modalSize.value, 10);
    if(size !== 24) opts.push('size:' + size);
    if(selectedColor) opts.push("style:'color:" + selectedColor + "'");
    var optsStr = opts.length ? ', {' + opts.join(', ') + '}' : '';
    return "yutoIcons.toSVG('" + selectedIcon.name + "'" + optsStr + ")";
  }

  function onSizeChange(){
    var size = parseInt(modalSize.value, 10);
    modalSizeVal.textContent = size + 'px';
    updateModalPreview();
  }

  // ---- カラー --------------------------------------------------
  function buildColorPresets(){
    COLOR_PRESETS.forEach(function(p){
      var btn = document.createElement('button');
      btn.className = 'icon-color-preset' + (p.value === '' ? ' icon-color-preset-current active' : '');
      btn.style.background = p.value || '';
      btn.title = p.label;
      btn.dataset.color = p.value;
      btn.addEventListener('click', function(){ setColor(p.value); });
      colorPresetsEl.appendChild(btn);
    });
  }

  function setColor(color){
    selectedColor = color;
    // プリセットの active 更新
    colorPresetsEl.querySelectorAll('.icon-color-preset').forEach(function(btn){
      btn.classList.toggle('active', btn.dataset.color === color);
    });
    // カラーピッカー & hex 同期
    if(color){
      modalColor.value = color;
      modalColorHex.value = color;
    }else{
      modalColorHex.value = 'currentColor';
    }
    updateModalPreview();
  }

  function onColorPickerChange(){
    var color = modalColor.value;
    selectedColor = color;
    modalColorHex.value = color;
    // プリセットの active をクリア（カスタムカラー）
    colorPresetsEl.querySelectorAll('.icon-color-preset').forEach(function(btn){
      btn.classList.toggle('active', btn.dataset.color === color);
    });
    updateModalPreview();
  }

  function onColorHexChange(){
    var val = modalColorHex.value.trim();
    if(val === 'currentColor' || val === ''){
      setColor('');
      return;
    }
    // # を補完
    if(/^[0-9a-fA-F]{3,8}$/.test(val)) val = '#' + val;
    selectedColor = val;
    // カラーピッカーは # 付き hex のみ対応
    if(/^#[0-9a-fA-F]{6}$/.test(val)) modalColor.value = val;
    modalColorHex.value = val;
    colorPresetsEl.querySelectorAll('.icon-color-preset').forEach(function(btn){
      btn.classList.toggle('active', btn.dataset.color === val);
    });
    updateModalPreview();
  }

  // ---- クリップボード ------------------------------------------
  function copyToClipboard(text, msg){
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(function(){
        showToast(msg || 'コピーしました', 'success');
      }).catch(function(){
        fallbackCopy(text, msg);
      });
    }else{
      fallbackCopy(text, msg);
    }
  }

  function fallbackCopy(text, msg){
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    try{
      document.execCommand('copy');
      showToast(msg || 'コピーしました', 'success');
    }catch(e){
      showToast('コピーに失敗しました', 'error');
    }
    document.body.removeChild(ta);
  }

  // ---- トースト ------------------------------------------------
  function showToast(msg, type){
    var t = document.getElementById('toast');
    if(!t) return;
    t.textContent = msg;
    t.className = 'toast show' + (type ? ' ' + type : '');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function(){ t.className = 'toast'; }, 2200);
  }

  // ---- 起動 ----------------------------------------------------
  document.addEventListener('DOMContentLoaded', init);
})();

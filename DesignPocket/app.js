/* ============================================================
   DesignPocket — app.js
   バニラJS / localStorage / 一方向データフロー
   ============================================================ */

(() => {
  'use strict';

  // ── 定数 ──
  const STORAGE_KEY_APPS = 'designpocket_apps';
  const STORAGE_KEY_IDEAS = 'designpocket_ideas';
  const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2MB（Base64化前のファイルサイズ上限）
  const VIEWS = ['gallery', 'apps'];
  // SVGはスクリプト埋め込み可能のため除外（XSS対策）
  const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
  const ALLOWED_DATA_URL_RE = /^data:image\/(png|jpe?g|webp|gif);/i;
  const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  // ── グローバルステート ──
  const state = {
    apps: [],   // AppProject[]
    ideas: [],  // DesignIdea[]
    filter: {
      appId: null,
      tag: null
    },
    view: 'gallery',
    pendingImage: null // 追加フォーム用の一時 DataURL
  };

  // ============================================================
  // ユーティリティ
  // ============================================================

  const $ = (sel) => document.querySelector(sel);

  /** crypto.randomUUID() を優先、未対応環境はフォールバック */
  const uuid = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    // フォールバック: RFC4122 v4 風
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  /** URLが安全（http/https）かどうか */
  const isSafeUrl = (url) => {
    if (!url) return false;
    try {
      const u = new URL(url);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  };

  /** 簡易トースト */
  let toastTimer = null;
  const toast = (message, type = 'info') => {
    const el = $('#toast');
    if (!el) return;
    el.textContent = message;
    el.className = 'toast show ' + (type === 'error' ? 'error' : type === 'success' ? 'success' : '');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      el.classList.remove('show');
    }, 2600);
  };

  /** タグ文字列 → 配列に正規化（重複・空文字除去） */
  const parseTags = (raw) => {
    if (!raw) return [];
    const seen = new Set();
    const result = [];
    raw.split(',').forEach((t) => {
      const trimmed = t.trim();
      if (!trimmed) return;
      const key = trimmed.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      result.push(trimmed);
    });
    return result;
  };

  // ============================================================
  // 永続化
  // ============================================================

  /** 既存データの imageDataUrl をホワイトリスト形式で検証（SVG等を弾く） */
  const sanitizeIdea = (idea) => {
    if (!idea || typeof idea !== 'object') return null;
    const safeImage =
      typeof idea.imageDataUrl === 'string' && ALLOWED_DATA_URL_RE.test(idea.imageDataUrl)
        ? idea.imageDataUrl
        : '';
    return {
      id: typeof idea.id === 'string' ? idea.id : uuid(),
      title: typeof idea.title === 'string' ? idea.title : '',
      imageDataUrl: safeImage,
      referenceUrl: typeof idea.referenceUrl === 'string' ? idea.referenceUrl : '',
      tags: Array.isArray(idea.tags) ? idea.tags.filter((t) => typeof t === 'string') : [],
      appId: typeof idea.appId === 'string' ? idea.appId : null,
      screenName: typeof idea.screenName === 'string' ? idea.screenName : '',
      note: typeof idea.note === 'string' ? idea.note : '',
      createdAt: typeof idea.createdAt === 'string' ? idea.createdAt : new Date().toISOString()
    };
  };

  const loadState = () => {
    try {
      const appsRaw = localStorage.getItem(STORAGE_KEY_APPS);
      const ideasRaw = localStorage.getItem(STORAGE_KEY_IDEAS);
      const apps = appsRaw ? JSON.parse(appsRaw) : [];
      const ideas = ideasRaw ? JSON.parse(ideasRaw) : [];
      state.apps = Array.isArray(apps)
        ? apps.filter((a) => a && typeof a === 'object' && typeof a.id === 'string')
        : [];
      state.ideas = Array.isArray(ideas)
        ? ideas.map(sanitizeIdea).filter((i) => i && i.title)
        : [];
    } catch (err) {
      console.error('localStorage の読み込みに失敗:', err);
      state.apps = [];
      state.ideas = [];
      toast('保存データの読み込みに失敗しました', 'error');
    }
  };

  /**
   * localStorageへの書き込みは必ずこの関数経由で。
   * 2キーへの書き込みを擬似的に原子化する：
   * 1) 旧値をスナップショット
   * 2) 順次書き込み
   * 3) 失敗時は旧値で復元（旧値が無ければキーを削除）
   */
  const saveState = () => {
    let appsJson;
    let ideasJson;
    try {
      appsJson = JSON.stringify(state.apps);
      ideasJson = JSON.stringify(state.ideas);
    } catch (err) {
      console.error('state のシリアライズに失敗:', err);
      toast('保存に失敗しました', 'error');
      return false;
    }
    // Safari プライベートモード等では getItem 自体が例外を投げ得る
    let prevApps = null;
    let prevIdeas = null;
    try {
      prevApps = localStorage.getItem(STORAGE_KEY_APPS);
      prevIdeas = localStorage.getItem(STORAGE_KEY_IDEAS);
    } catch (err) {
      console.error('localStorage の読み出しに失敗:', err);
      toast('保存に失敗しました（ストレージにアクセスできません）', 'error');
      return false;
    }
    try {
      localStorage.setItem(STORAGE_KEY_APPS, appsJson);
      localStorage.setItem(STORAGE_KEY_IDEAS, ideasJson);
      // Drive 同期: ログイン中なら fire-and-forget でアップロード
      if (window.driveSync) {
        window.driveSync.markDirty(STORAGE_KEY_APPS);
        window.driveSync.markDirty(STORAGE_KEY_IDEAS);
      }
      return true;
    } catch (err) {
      console.error('localStorage の書き込みに失敗:', err);
      // 旧値で復元
      try {
        if (prevApps !== null) {
          localStorage.setItem(STORAGE_KEY_APPS, prevApps);
        } else {
          localStorage.removeItem(STORAGE_KEY_APPS);
        }
        if (prevIdeas !== null) {
          localStorage.setItem(STORAGE_KEY_IDEAS, prevIdeas);
        } else {
          localStorage.removeItem(STORAGE_KEY_IDEAS);
        }
      } catch (rollbackErr) {
        console.error('ロールバック失敗:', rollbackErr);
      }
      if (err && err.name === 'QuotaExceededError') {
        toast('ストレージ容量上限です。古いアイデアを削除してください', 'error');
      } else {
        toast('保存に失敗しました', 'error');
      }
      return false;
    }
  };

  // ============================================================
  // データ操作
  // ============================================================

  const addApp = ({ name, emoji }) => {
    const app = {
      id: uuid(),
      name: name.trim(),
      emoji: (emoji || '').trim() || '📦',
      createdAt: new Date().toISOString()
    };
    state.apps.push(app);
    if (!saveState()) {
      state.apps.pop();
      return null;
    }
    return app;
  };

  const deleteApp = (appId) => {
    const beforeApps = state.apps.slice();
    const beforeIdeas = state.ideas.slice();
    state.apps = state.apps.filter((a) => a.id !== appId);
    // 紐づくアイデアの appId をクリア（削除はしない）
    state.ideas = state.ideas.map((idea) =>
      idea.appId === appId ? { ...idea, appId: null } : idea
    );
    if (!saveState()) {
      state.apps = beforeApps;
      state.ideas = beforeIdeas;
      return false;
    }
    // フィルタが該当アプリを参照していたら解除
    if (state.filter.appId === appId) state.filter.appId = null;
    return true;
  };

  const addIdea = (data) => {
    const idea = {
      id: uuid(),
      title: data.title.trim(),
      imageDataUrl: data.imageDataUrl || '',
      referenceUrl: data.referenceUrl ? data.referenceUrl.trim() : '',
      tags: parseTags(data.tags),
      appId: data.appId || null,
      screenName: data.screenName ? data.screenName.trim() : '',
      note: data.note ? data.note.trim() : '',
      createdAt: new Date().toISOString()
    };
    state.ideas.unshift(idea);
    if (!saveState()) {
      state.ideas.shift();
      return null;
    }
    return idea;
  };

  const deleteIdea = (ideaId) => {
    const before = state.ideas.slice();
    state.ideas = state.ideas.filter((i) => i.id !== ideaId);
    if (!saveState()) {
      state.ideas = before;
      return false;
    }
    return true;
  };

  // ============================================================
  // フィルタリング
  // ============================================================

  const getFilteredIdeas = () => {
    const { appId, tag } = state.filter;
    return state.ideas.filter((idea) => {
      if (appId && idea.appId !== appId) return false;
      if (tag && !idea.tags.some((t) => t.toLowerCase() === tag.toLowerCase())) return false;
      return true;
    });
  };

  const getAllTags = () => {
    const set = new Set();
    state.ideas.forEach((idea) => {
      idea.tags.forEach((t) => set.add(t));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  };

  const getAppById = (appId) =>
    state.apps.find((a) => a.id === appId) || null;

  const countIdeasInApp = (appId) =>
    state.ideas.filter((i) => i.appId === appId).length;

  // ============================================================
  // 描画
  // ============================================================

  /** 安全な属性付きで要素を作るヘルパー */
  const el = (tag, options = {}, children = []) => {
    const node = document.createElement(tag);
    if (options.class) node.className = options.class;
    if (options.text != null) node.textContent = options.text;
    if (options.attrs) {
      Object.entries(options.attrs).forEach(([k, v]) => {
        if (v != null) node.setAttribute(k, String(v));
      });
    }
    if (options.dataset) {
      Object.entries(options.dataset).forEach(([k, v]) => {
        if (v != null) node.dataset[k] = String(v);
      });
    }
    if (options.on) {
      Object.entries(options.on).forEach(([evt, handler]) => {
        node.addEventListener(evt, handler);
      });
    }
    children.forEach((child) => {
      if (child) node.appendChild(child);
    });
    return node;
  };

  const renderTabs = () => {
    document.querySelectorAll('.tab[data-view]').forEach((btn) => {
      const active = btn.dataset.view === state.view;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    VIEWS.forEach((v) => {
      const section = document.getElementById('view-' + v);
      if (section) section.hidden = state.view !== v;
    });
  };

  const renderFilters = () => {
    const appSelect = $('#filter-app');
    const tagSelect = $('#filter-tag');
    if (!appSelect || !tagSelect) return;

    // アプリ：選択中のIDがアプリ一覧から消えていればフィルタを解除
    if (state.filter.appId && !state.apps.some((a) => a.id === state.filter.appId)) {
      state.filter.appId = null;
    }
    appSelect.textContent = '';
    appSelect.appendChild(el('option', { text: 'すべて', attrs: { value: '' } }));
    state.apps.forEach((app) => {
      appSelect.appendChild(
        el('option', {
          text: `${app.emoji} ${app.name}`,
          attrs: { value: app.id }
        })
      );
    });
    appSelect.value = state.filter.appId || '';

    // タグ：選択中のタグが現存しなければフィルタを解除（UI/state 同期保証）
    const allTags = getAllTags();
    if (
      state.filter.tag &&
      !allTags.some((t) => t.toLowerCase() === state.filter.tag.toLowerCase())
    ) {
      state.filter.tag = null;
    }
    tagSelect.textContent = '';
    tagSelect.appendChild(el('option', { text: 'すべて', attrs: { value: '' } }));
    allTags.forEach((t) => {
      tagSelect.appendChild(el('option', { text: t, attrs: { value: t } }));
    });
    tagSelect.value = state.filter.tag || '';
  };

  const buildIdeaCard = (idea) => {
    const card = el('button', {
      class: 'idea-card',
      attrs: { type: 'button', 'aria-label': `アイデア詳細: ${idea.title}` },
      dataset: { ideaId: idea.id },
      on: { click: () => openDetailModal(idea.id) }
    });

    if (idea.imageDataUrl) {
      const img = el('img', {
        class: 'idea-card-image',
        attrs: { src: idea.imageDataUrl, alt: idea.title, loading: 'lazy' }
      });
      img.addEventListener('error', () => {
        img.replaceWith(buildUrlThumb());
      });
      card.appendChild(img);
    } else {
      card.appendChild(buildUrlThumb());
    }

    const body = el('div', { class: 'idea-card-body' });
    body.appendChild(el('div', { class: 'idea-card-title', text: idea.title }));

    const app = idea.appId ? getAppById(idea.appId) : null;
    const metaParts = [];
    if (app) metaParts.push(`${app.emoji} ${app.name}`);
    if (idea.screenName) metaParts.push(idea.screenName);
    if (metaParts.length > 0) {
      body.appendChild(el('div', { class: 'idea-card-meta', text: metaParts.join('  ·  ') }));
    }

    if (idea.tags.length > 0) {
      const tagsWrap = el('div', { class: 'idea-card-tags' });
      idea.tags.forEach((t) => {
        tagsWrap.appendChild(el('span', { class: 'tag-chip', text: '#' + t }));
      });
      body.appendChild(tagsWrap);
    }

    card.appendChild(body);
    return card;
  };

  const buildUrlThumb = () =>
    el('div', { class: 'idea-card-url-thumb', text: '🔗' });

  const renderGallery = () => {
    const grid = $('#gallery-grid');
    const empty = $('#gallery-empty');
    const countBadge = $('#gallery-count');
    if (!grid) return;

    const filtered = getFilteredIdeas();
    grid.textContent = '';
    filtered.forEach((idea) => {
      grid.appendChild(buildIdeaCard(idea));
    });

    if (countBadge) countBadge.textContent = `${filtered.length} 件`;
    const isEmpty = filtered.length === 0;
    if (empty) empty.hidden = !isEmpty;
    grid.hidden = isEmpty;
  };

  const renderApps = () => {
    const grid = $('#apps-grid');
    const empty = $('#apps-empty');
    if (!grid) return;

    grid.textContent = '';
    state.apps.forEach((app) => {
      const selectApp = () => {
        state.filter.appId = app.id;
        state.filter.tag = null;
        state.view = 'gallery';
        render();
      };
      // <button>ネスト回避のため article + role=button にする
      const card = el('article', {
        class: 'dp-app-card',
        attrs: {
          role: 'button',
          tabindex: '0',
          'aria-label': `${app.name} のアイデアを表示`
        },
        on: {
          click: (ev) => {
            // 削除ボタン上のクリックは無視
            if (ev.target.closest('.dp-app-card-delete')) return;
            selectApp();
          },
          keydown: (ev) => {
            if (ev.target.closest('.dp-app-card-delete')) return;
            if (ev.key === 'Enter' || ev.key === ' ') {
              ev.preventDefault();
              selectApp();
            }
          }
        }
      });
      card.appendChild(el('div', { class: 'dp-app-card-emoji', text: app.emoji || '📦' }));
      card.appendChild(el('div', { class: 'dp-app-card-name', text: app.name }));
      card.appendChild(
        el('div', { class: 'dp-app-card-count', text: `${countIdeasInApp(app.id)} ideas` })
      );

      const delBtn = el('button', {
        class: 'dp-app-card-delete',
        attrs: { type: 'button', 'aria-label': `${app.name} を削除`, title: '削除' },
        text: '×',
        on: {
          click: (ev) => {
            ev.stopPropagation();
            const count = countIdeasInApp(app.id);
            const msg = count > 0
              ? `「${app.name}」を削除しますか？\n紐づく ${count} 件のアイデアはアプリ未設定になります。`
              : `「${app.name}」を削除しますか？`;
            if (window.confirm(msg)) {
              if (deleteApp(app.id)) {
                toast('アプリを削除しました', 'success');
                render();
              }
            }
          }
        }
      });
      card.appendChild(delBtn);
      grid.appendChild(card);
    });

    const isEmpty = state.apps.length === 0;
    if (empty) empty.hidden = !isEmpty;
    grid.hidden = isEmpty;
  };

  /** 追加フォームのアプリ選択肢を更新 */
  const renderIdeaAppOptions = () => {
    const sel = $('#idea-app');
    if (!sel) return;
    const current = sel.value;
    sel.textContent = '';
    sel.appendChild(el('option', { text: '（未設定）', attrs: { value: '' } }));
    state.apps.forEach((app) => {
      sel.appendChild(
        el('option', { text: `${app.emoji} ${app.name}`, attrs: { value: app.id } })
      );
    });
    if (current && state.apps.some((a) => a.id === current)) {
      sel.value = current;
    }
  };

  /** 一括再描画 */
  const render = () => {
    renderTabs();
    renderFilters();
    renderGallery();
    renderApps();
    renderIdeaAppOptions();
  };

  // ============================================================
  // モーダル制御
  // ============================================================

  // モーダルごとに「直前のフォーカス要素」と「TABハンドラ」を保持
  const modalState = new Map();

  const trapFocus = (overlay) => (ev) => {
    if (ev.key !== 'Tab') return;
    const focusables = Array.from(overlay.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
      (n) => !n.hasAttribute('hidden') && n.offsetParent !== null
    );
    if (focusables.length === 0) {
      ev.preventDefault();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (ev.shiftKey && document.activeElement === first) {
      ev.preventDefault();
      last.focus();
    } else if (!ev.shiftKey && document.activeElement === last) {
      ev.preventDefault();
      first.focus();
    }
  };

  const openModal = (id) => {
    const overlay = document.getElementById(id);
    if (!overlay || !overlay.hidden) return;
    const handler = trapFocus(overlay);
    modalState.set(id, {
      lastFocus: document.activeElement,
      handler
    });
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handler);
    const focusable = overlay.querySelector(FOCUSABLE_SELECTOR);
    if (focusable) focusable.focus();
  };

  const closeModal = (id) => {
    const overlay = document.getElementById(id);
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    const ms = modalState.get(id);
    if (ms) {
      if (ms.handler) document.removeEventListener('keydown', ms.handler);
      if (ms.lastFocus && typeof ms.lastFocus.focus === 'function') {
        ms.lastFocus.focus();
      }
      modalState.delete(id);
    }
    // 他に開いているモーダルが無ければ body スクロールを戻す
    const stillOpen = document.querySelector('.modal-overlay:not([hidden])');
    if (!stillOpen) document.body.style.overflow = '';
  };

  const closeTopmostModal = () => {
    const open = Array.from(document.querySelectorAll('.modal-overlay:not([hidden])'));
    if (open.length === 0) return;
    closeModal(open[open.length - 1].id);
  };

  // ============================================================
  // 詳細モーダル
  // ============================================================

  const openDetailModal = (ideaId) => {
    const idea = state.ideas.find((i) => i.id === ideaId);
    if (!idea) return;
    const body = $('#detailBody');
    if (!body) return;
    body.textContent = '';

    if (idea.imageDataUrl) {
      const img = el('img', {
        class: 'detail-image',
        attrs: { src: idea.imageDataUrl, alt: idea.title }
      });
      body.appendChild(img);
    }

    const sections = [];
    sections.push(['タイトル', idea.title]);

    const app = idea.appId ? getAppById(idea.appId) : null;
    if (app) sections.push(['アプリ', `${app.emoji} ${app.name}`]);
    if (idea.screenName) sections.push(['画面', idea.screenName]);
    if (idea.note) sections.push(['メモ', idea.note]);
    sections.push(['登録日', formatDate(idea.createdAt)]);

    sections.forEach(([label, value]) => {
      const sec = el('div', { class: 'detail-section' });
      sec.appendChild(el('div', { class: 'detail-label', text: label }));
      sec.appendChild(el('div', { class: 'detail-value', text: value }));
      body.appendChild(sec);
    });

    // 参考URL（リンク化、ただし http/https のみ）
    if (idea.referenceUrl) {
      const sec = el('div', { class: 'detail-section' });
      sec.appendChild(el('div', { class: 'detail-label', text: '参考URL' }));
      const valueWrap = el('div', { class: 'detail-value' });
      if (isSafeUrl(idea.referenceUrl)) {
        const a = el('a', {
          text: idea.referenceUrl,
          attrs: {
            href: idea.referenceUrl,
            target: '_blank',
            rel: 'noopener noreferrer'
          }
        });
        valueWrap.appendChild(a);
      } else {
        valueWrap.textContent = idea.referenceUrl;
      }
      sec.appendChild(valueWrap);
      body.appendChild(sec);
    }

    if (idea.tags.length > 0) {
      const sec = el('div', { class: 'detail-section' });
      sec.appendChild(el('div', { class: 'detail-label', text: 'タグ' }));
      const tagsWrap = el('div', { class: 'detail-tags' });
      idea.tags.forEach((t) => {
        tagsWrap.appendChild(el('span', { class: 'tag-chip', text: '#' + t }));
      });
      sec.appendChild(tagsWrap);
      body.appendChild(sec);
    }

    // アクション
    const actions = el('div', { class: 'detail-actions' });
    const delBtn = el('button', {
      class: 'btn-danger',
      text: '削除',
      attrs: { type: 'button' },
      on: {
        click: () => {
          if (window.confirm('このアイデアを削除しますか？')) {
            if (deleteIdea(idea.id)) {
              toast('削除しました', 'success');
              closeModal('detailOverlay');
              render();
            }
          }
        }
      }
    });
    const closeBtn = el('button', {
      class: 'btn-ghost',
      text: '閉じる',
      attrs: { type: 'button' },
      on: { click: () => closeModal('detailOverlay') }
    });
    actions.appendChild(delBtn);
    actions.appendChild(closeBtn);
    body.appendChild(actions);

    openModal('detailOverlay');
  };

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return iso;
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    } catch {
      return iso;
    }
  };

  // ============================================================
  // 画像アップロード
  // ============================================================

  const handleImageFile = (file) => {
    if (!file) return;
    // SVGはスクリプト埋め込み可能なので明示的に拒否
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast('PNG / JPEG / WebP / GIF のみアップロードできます', 'error');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast(`画像サイズは ${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)}MB 以下にしてください`, 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      // DataURL のMIMEを再検証（拡張子偽装対策）
      if (!ALLOWED_DATA_URL_RE.test(dataUrl)) {
        toast('画像形式の判定に失敗しました', 'error');
        return;
      }
      state.pendingImage = dataUrl;
      const preview = $('#upload-preview');
      const hint = $('#upload-hint');
      const clear = $('#upload-clear');
      const zone = $('#upload-zone');
      if (preview) {
        preview.src = dataUrl;
        preview.hidden = false;
      }
      if (hint) hint.hidden = true;
      if (clear) clear.hidden = false;
      if (zone) zone.classList.add('has-image');
    };
    reader.onerror = () => {
      toast('画像の読み込みに失敗しました', 'error');
    };
    reader.readAsDataURL(file);
  };

  const clearPendingImage = () => {
    state.pendingImage = null;
    const preview = $('#upload-preview');
    const hint = $('#upload-hint');
    const clear = $('#upload-clear');
    const zone = $('#upload-zone');
    const fileInput = $('#idea-image');
    if (preview) {
      preview.src = '';
      preview.hidden = true;
    }
    if (hint) hint.hidden = false;
    if (clear) clear.hidden = true;
    if (zone) zone.classList.remove('has-image');
    if (fileInput) fileInput.value = '';
  };

  // ============================================================
  // フォームのリセット
  // ============================================================

  const resetIdeaForm = () => {
    const form = $('#addIdeaForm');
    if (form && typeof form.reset === 'function') form.reset();
    clearPendingImage();
  };

  const resetAppForm = () => {
    const form = $('#addAppForm');
    if (form && typeof form.reset === 'function') form.reset();
  };

  // ============================================================
  // イベント登録
  // ============================================================

  const bindEvents = () => {
    // タブ切り替え
    document.querySelectorAll('.tab[data-view]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.view = btn.dataset.view;
        renderTabs();
      });
    });

    // 追加ボタン
    const openAddBtn = $('#openAddBtn');
    if (openAddBtn) {
      openAddBtn.addEventListener('click', () => {
        resetIdeaForm();
        renderIdeaAppOptions();
        openModal('addIdeaOverlay');
      });
    }

    const openAddAppBtn = $('#openAddAppBtn');
    if (openAddAppBtn) {
      openAddAppBtn.addEventListener('click', () => {
        resetAppForm();
        openModal('addAppOverlay');
      });
    }

    // モーダルクローズ（×ボタン・キャンセルボタン）
    document.querySelectorAll('[data-close-modal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        closeModal(btn.dataset.closeModal);
      });
    });

    // オーバーレイクリックで閉じる（closeModal経由でフォーカス復帰させる）
    document.querySelectorAll('.modal-overlay').forEach((overlay) => {
      overlay.addEventListener('click', (ev) => {
        if (ev.target === overlay) closeModal(overlay.id);
      });
    });

    // ESCで一番上のモーダルを閉じる
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') closeTopmostModal();
    });

    // フィルタ
    const filterApp = $('#filter-app');
    if (filterApp) {
      filterApp.addEventListener('change', () => {
        state.filter.appId = filterApp.value || null;
        renderGallery();
      });
    }
    const filterTag = $('#filter-tag');
    if (filterTag) {
      filterTag.addEventListener('change', () => {
        state.filter.tag = filterTag.value || null;
        renderGallery();
      });
    }
    const clearFilters = $('#clear-filters');
    if (clearFilters) {
      clearFilters.addEventListener('click', () => {
        state.filter.appId = null;
        state.filter.tag = null;
        renderFilters();
        renderGallery();
      });
    }

    // 画像アップロード
    const fileInput = $('#idea-image');
    if (fileInput) {
      fileInput.addEventListener('change', () => {
        const file = fileInput.files && fileInput.files[0];
        if (file) handleImageFile(file);
      });
    }
    const uploadClear = $('#upload-clear');
    if (uploadClear) {
      uploadClear.addEventListener('click', (ev) => {
        ev.stopPropagation();
        clearPendingImage();
      });
    }
    const zone = $('#upload-zone');
    if (zone) {
      zone.addEventListener('dragover', (ev) => {
        ev.preventDefault();
        zone.classList.add('drag-over');
      });
      zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
      });
      zone.addEventListener('drop', (ev) => {
        ev.preventDefault();
        zone.classList.remove('drag-over');
        const file = ev.dataTransfer && ev.dataTransfer.files && ev.dataTransfer.files[0];
        if (file) handleImageFile(file);
      });
    }

    // アイデア追加フォーム送信
    const ideaForm = $('#addIdeaForm');
    if (ideaForm) {
      ideaForm.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const title = $('#idea-title').value.trim();
        if (!title) {
          toast('タイトルを入力してください', 'error');
          return;
        }
        const url = $('#idea-url').value.trim();
        if (url && !isSafeUrl(url)) {
          toast('URLは http:// または https:// で始めてください', 'error');
          return;
        }
        const idea = addIdea({
          title,
          imageDataUrl: state.pendingImage || '',
          referenceUrl: url,
          tags: $('#idea-tags').value,
          appId: $('#idea-app').value || null,
          screenName: $('#idea-screen').value,
          note: $('#idea-note').value
        });
        if (idea) {
          toast('アイデアを追加しました', 'success');
          closeModal('addIdeaOverlay');
          state.view = 'gallery';
          render();
        }
      });
    }

    // アプリ追加フォーム送信
    const appForm = $('#addAppForm');
    if (appForm) {
      appForm.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const name = $('#app-name').value.trim();
        if (!name) {
          toast('アプリ名を入力してください', 'error');
          return;
        }
        const emoji = $('#app-emoji').value;
        const app = addApp({ name, emoji });
        if (app) {
          toast('アプリを追加しました', 'success');
          closeModal('addAppOverlay');
          render();
        }
      });
    }
  };

  // ============================================================
  // 起動
  // ============================================================

  // ============================================================
  // Drive 同期 (drive-sync.js が読み込まれていれば有効)
  // ============================================================
  const initDriveSync = () => {
    if (!window.driveSync) return;
    window.driveSync.register({
      toolId: 'designpocket',
      keys: [STORAGE_KEY_APPS, STORAGE_KEY_IDEAS],
      keyPatterns: [],
      // Drive 側からデータが降ってきたら state を再ロード→再描画
      onSyncedFromRemote: () => {
        loadState();
        render();
        toast('別の端末から更新を取り込みました', 'success');
      },
    });
    const mount = document.getElementById('sync-mount');
    if (mount) window.driveSync.mountUI(mount);
    window.driveSync.init();
  };

  const initTheme = () => {
    if (!window.theme) return;
    const m = document.getElementById('theme-mount');
    if (m) window.theme.mountUI(m);
  };

  document.addEventListener('DOMContentLoaded', () => {
    loadState();
    bindEvents();
    render();
    initTheme();
    initDriveSync();
  });
})();

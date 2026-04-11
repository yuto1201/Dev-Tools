# CLAUDE.md — DesignPocket（Theme Catalog モード）

## プロジェクト概要

UI テーマ（CSS トークン + カスタム CSS + コンポーネント見た目）を複数記録するカタログ。
`_theme-preview/index.html` のような視覚プレビューを **1 レコードごとに持てる**ようにした版。
詳細仕様は `spec.md` を参照。

v1（画像アイデア管理）は完全廃止。v2 は別物として作り直す。

---

## 技術スタック

- HTML / CSS / バニラ JavaScript（ES6+）
- 永続化: localStorage + Google Drive 同期（`lib/drive-sync.js`）
- ライブプレビュー: `<iframe src="preview.html">` + `postMessage`
- ビルドツール不使用

---

## ファイル構成

```
DesignPocket/
├── CLAUDE.md
├── spec.md
├── index.html    # 一覧 + 編集（2 ペイン）
├── preview.html  # iframe 内に読み込まれる視覚カタログ
├── style.css     # ツール固有レイアウト
└── app.js        # 状態管理・CRUD・drive sync
```

6 ファイル構成。ロジックは 1 ファイル（app.js）に集約する。

---

## 状態管理方針

```javascript
const state = {
  themes: [],       // Theme[]
  currentId: null,  // 編集中のテーマ ID
};
```

- DOM を読み取らず、常に state → render の一方向
- 保存は `saveThemes()` に一元化
- 編集中のトークンは `state.themes[i].tokens` を直接書き換え（編集中専用コピーは持たない）
- プレビューは編集のたび（input イベント）に postMessage で再描画（debounce 120ms）

---

## Drive 同期

```javascript
driveSync.register({
  toolId: 'designpocket',
  keys: ['designpocket_themes'],
  onSyncedFromRemote: (changedKeys) => {
    loadThemes(); renderList();
    // 編集中ならエディタも再描画
  },
});
```

register → mountUI → init の順で呼ぶ。

---

## 起動時の v1 データクリーンアップ

v1 で使っていた以下の localStorage キーは v2 起動時に自動削除する:

```javascript
localStorage.removeItem('designpocket_apps');
localStorage.removeItem('designpocket_ideas');
```

Drive 上にも旧キーが残っている可能性があるが、driveSync 側の通常削除は触らない方針
（ユーザーが自分で Drive UI から消す）。

---

## やってはいけないこと

- `innerHTML` にユーザー入力（テーマ名・説明・custom CSS）を直接代入
  - 名前/説明 → `textContent` or エスケープ
  - custom CSS → `<style>.textContent` で OK（HTML としては解釈されない）
- `_theme-preview` を直接参照する（共有資産なので触らない）
- iframe に相対パスで `../lib/theme.css` を読み込む際、`file://` 配信時の挙動を確認
  - `http://localhost:5500` 配信を前提、`file://` での完全動作は保証外

---

## UI 変更時のフロー

`IMPLEMENTATION_RULES.md` の「必須フロー」に従うこと:

1. 実装
2. `lib/screenshot.sh` で light/dark 両方撮影
3. Read で目視確認
4. 必要なら修正して 2 に戻る
5. バージョン判定（`.card-version` 更新）
6. `open` でユーザー確認

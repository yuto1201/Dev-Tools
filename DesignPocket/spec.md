# DesignPocket 仕様書 v2.0（テーマカタログ）

## アプリ概要

| 項目 | 内容 |
|---|---|
| 名称 | DesignPocket（Theme Catalog モード） |
| 種別 | Web アプリ（クライアントサイド完結） |
| 役割 | UI テーマ（デザイントークン + コンポーネント見た目）を複数記録・比較するカタログ |
| 技術 | HTML / CSS / JavaScript（バニラ） |
| 永続化 | localStorage + Google Drive 同期 |

### コンセプト

yuto's dev tools で使う **ニューモフィズム** 以外の UI テーマ案を、フルセットのトークンと
コンポーネント見た目付きで記録しておく「テーマの辞書」。
`_theme-preview/index.html` と同様の視覚カタログを、**テーマごとに切り替えて**表示できる。

---

## v2 スコープ（完全刷新）

- 1 レコード = 1 テーマ（名前 + 説明 + トークン + カスタム CSS）
- 一覧 = テーマギャラリー（各カードは小さいライブプレビュー付き）
- 編集 = 左ペイン（フォーム）/ 右ペイン（iframe ライブプレビュー）の 2 ペイン構成
- CSS エクスポート（`:root { ... }` 形式、theme.css にそのまま貼れる）
- 既存の画像アイデア機能（v1）は完全削除。`designpocket_apps` / `designpocket_ideas` は起動時に自動削除

---

## データ構造

### Theme（テーマ 1 レコード）

```javascript
{
  id: string,              // UUID
  name: string,            // 例: "Neumorphism (default)"
  description: string,     // 例: "白ベース、二重シャドウ"
  tokens: {                // 標準トークン（key = CSS 変数名, value = 値）
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
    '--font-sans': "'Inter', sans-serif",
    '--font-mono': "'JetBrains Mono', monospace"
  },
  customCss: string,       // 生 CSS（shadow 定義や .btn 等の上書き）
  createdAt: string,       // ISO
  updatedAt: string        // ISO
}
```

### localStorage キー

```
designpocket_themes           → Theme[] の JSON
```

旧 v1 キー（`designpocket_apps`, `designpocket_ideas`）は v2 起動時に破棄。

---

## 画面構成

### 一覧（List）

- ヘッダー: 戻る / タイトル / テーマ切替 / Drive 同期
- ツールバー: セクションタイトル + ＋新規作成
- グリッド: 各カード = 小さいプレビュー画像 + 名前 + 説明
- 空状態: 「まだテーマがありません」

### 編集（Editor）

- ヘッダー: ← 一覧 / テーマ名（編集可能） / 保存 / 書出 / テーマ切替 / sync-dot
- ボディ: 2 ペイン
  - **左ペイン**（フォーム）
    - 名前 / 説明
    - Colors（15 個のカラーピッカー）
    - Radius（4 個）
    - Spacing（8 個）
    - Fonts（2 個）
    - Custom CSS（テキストエリア、shadow/component 上書きなど自由記述）
  - **右ペイン**（iframe `preview.html`）
    - postMessage で CSS を送信し、受信側で `<style>` を更新してリアルタイム反映

### preview.html（iframe 内）

- 色スウォッチ一覧
- surface（shadow）サンプル
- タイポグラフィ
- ボタン（.btn / .btn-primary / .btn-ghost / .btn-danger）
- フォーム入力（input / select / textarea）
- カード（.app-card 相当）
- バッジ / タグ
- モーダル風プレビュー

---

## UI / UX ルール

- UI 標準は `UI_STANDARDS.md` を厳守（ヘッダー構成 / 区切り線 / 命名）
- カラーはカラーピッカー + hex テキストの組合せ入力
- Custom CSS は mono フォント、タブインデントで編集
- 保存せずに離脱しようとしたら警告（v2.1 で対応）

---

## 非スコープ（v2 では対応しない）

- light/dark の個別トークン編集（1 テーマ = 1 バリアントのみ）
- 複数テーマの横並び比較
- コンポーネント追加（preview.html はビルトインカタログ固定）
- トークンの継承・階層（全テーマがフラットな key-value）

---

## 評価観点

| カテゴリ | 評価ポイント |
|---|---|
| データ | localStorage 読み書き、旧キーのクリーンアップ |
| プレビュー | iframe postMessage のライフサイクル、壊れた CSS でエディタ側に影響しないか |
| XSS | Custom CSS は `<style>` で注入、ユーザ入力を `innerHTML` に直接流さない |
| 同期 | Drive 同期で複数端末間で破綻しない |
| UI | light/dark 両対応、レスポンシブ |

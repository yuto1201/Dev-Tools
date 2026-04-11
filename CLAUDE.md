# CLAUDE.md

## プロジェクト概要

yuto's dev tools — 開発者向け Web ツール集。GitHub Pages でホスティング。
各ツールはオフラインで動作するスタンドアロンな Web アプリケーション。

## ツール一覧

| ツール | パス | 状態 |
|---|---|---|
| ER Diagram Generator | `er-diagram/` | **完成（新テーマ）** |
| App Store Preview Generator | `appstore-preview/` | **完成（新テーマ）** |
| DesignPocket | `DesignPocket/` | **完成（新テーマ）** |
| Text Counter | `text-counter/` | **完成（新テーマ）** |
| Icon Gallery | `icons/` | **完成（新テーマ）** |
| Cosmic Particle Universe | `cosmic-particle/` | 未実装（プレースホルダー） |
| Parser / Decoder | `parser/` | 未実装（プレースホルダー） |

トップページは [`/index.html`](index.html) で全ツールへのリンクを持つダッシュボード（**新テーマ済**）。

## ファイル構成

```
/
├ index.html              ← トップ（toolbox 一覧、新テーマ済）
├ CLAUDE.md / UI_STANDARDS.md / IMPLEMENTATION_RULES.md
├ lib/                    ← 全ツール共通モジュール
│  ├ theme.css            ← テーマトークン（light/dark、ニューモフィズム）
│  ├ theme.js             ← テーマ切替ロジック + window.theme API
│  ├ components.css       ← 共有コンポーネント（.btn / .app-card / .modal / .form-input ...）
│  ├ drive-sync.css       ← Google Drive 同期 UI のスタイル
│  ├ icons.js             ← SVG アイコンレジストリ + window.yutoIcons API
│  ├ drive-sync.js        ← 同期ロジック + window.driveSync API
│  └ screenshot.sh        ← Chrome headless スクリーンショット（UI 確認用）
├ _template-list/         ← 一覧+編集型ツールの雛形（コピー用）
├ _template-single/       ← 単一画面ユーティリティ型の雛形
├ _theme-preview/         ← テーマトークンの視覚プレビュー（開発用）
├ er-diagram/ appstore-preview/ DesignPocket/ ...  ← 各ツール
```

## 技術スタック

- HTML / CSS / JavaScript（バニラ、フレームワーク不使用）
- 外部ライブラリは最小限（appstore-preview の JSZip のみ）
- ビルドツール・バンドラーなし
- GitHub Pages でそのまま配信
- フォント: Inter（本文）+ JetBrains Mono（コード／ラベル）
- テーマ: ニューモフィズム light/dark 切替式

## デザインルール

全ツール共通の UI 配置・テーマトークン・コンポーネント命名規則は別ファイルにまとめてある。
**UI を作る・直すときは必ず参照すること**。

@UI_STANDARDS.md

### 標準コンポーネントの視覚リファレンス

[`_theme-preview/index.html`](_theme-preview/index.html) に全テーマトークン＋標準コンポーネントの視覚プレビューがある。
**UI を実装・修正する際は、このプレビューの見た目を正として合わせること。**
ヘッダー・ボタン・カード・モーダル等の標準コンポーネントのスタイルが theme-preview と一致しない場合、ツール側の CSS が標準を上書きしている可能性がある。

### 標準コンポーネント早見表

UI を作る前に必ずこの表を見て、既存コンポーネントで実現できないか確認する。
**独自スタイルを書く前に、まずここに該当するものがないか探すこと。**

| # | カテゴリ | クラス名 | 用途・見た目 |
|---|---|---|---|
| 0 | **アイコン** | `yutoIcons.toSVG('name')` `yutoIcons.toElement('name')` | **SVGアイコン（絵文字禁止）**。`lib/icons.js` 参照。一覧は `icons/index.html` |
| 1 | ヘッダー | `.app-back-btn` `.app-title-icon` `.app-title` | pill型戻るボタン、角丸アイコンボックス、太字タイトル |
| 1 | カラートークン | `var(--accent)` `var(--success)` 等 | テーマカラー。`lib/theme.css` 参照 |
| 2 | サーフェス | `var(--shadow-out)` `var(--shadow-in)` 等 | ニューモフィズム凸凹。`lib/theme.css` 参照 |
| 3 | ボタン | `.btn` `.btn-primary` `.btn-ghost` `.btn-danger` | ニューモフィズム shadow 付きボタン |
| 4 | フォーム入力 | `.form-input` `.form-row` `.form-label` | 凹み input/textarea/select |
| 5 | カード | `.app-card` `.app-card-thumb` `.app-card-info` | ギャラリーカード（サムネ + 情報） |
| 6 | 空状態 | `.app-empty` | アイコン + メッセージ + アクションボタン |
| 7 | モーダル | `.modal-overlay` `.modal` `.modal-header` `.modal-body` `.modal-footer` | 中央ダイアログ |
| 8 | トースト | `.toast` `.toast.show` `.toast.success` `.toast.error` | 一時通知バー |
| 9 | Drive同期 | `window.driveSync.mountUI()` | サインイン/同期状態 UI |
| 10 | ラジオ | `.radio` | ニューモフィズムラジオボタン |
| 11 | チェックボックス | `.checkbox` | ニューモフィズムチェックボックス |
| 12 | セレクト | `.select` | ドロップダウン選択 |
| 13 | スイッチ | `.switch` | ON/OFFトグル |
| 14 | スライダー | `.slider` | 凹みレール + 浮き上がりサム |
| 15 | タブバー | `.tab-bar` `.tab` | 凹みバー + アクティブ浮き上がり |
| 16 | セグメンテッド | `.segmented` `.segmented-item` | タブバーと同スタイルの切替 |
| 17 | バッジ | `.badge` `.badge-success` `.badge-danger` 等 | 小さなインラインラベル |
| 18 | プログレス | `.progress` `.progress-bar` | 進捗バー |
| 19 | スピナー | `.spinner` `.spinner-sm` `.spinner-lg` | ローディングアニメーション |
| 20 | ドロップダウン | `.dropdown` `.dropdown-menu` `.dropdown-item` | カスタムメニュー |
| 21 | ピッカー | `.picker` `.color-field` `.color-field-swatch` `.color-field-hex` | 日付/カラーピッカー。swatch + hex 連動 |
| 22 | ノブ | `.knob` | 回転つまみ（静的ビジュアル） |
| 23 | レンジ | `.range-control` | 2ハンドル範囲スライダー |
| 24 | ディバイダー | `.divider` `.divider-label` | 区切り線（ラベル付き可） |
| 25 | アラート | `.alert` `.alert-success` `.alert-danger` 等 | 通知メッセージボックス |
| 26 | ツールチップ | `.tooltip-parent[data-tooltip]` | ホバーで表示される吹き出し |
| 27 | スクロールバー | （グローバル） | 細い半透明スクロールバー |
| 28 | スケルトン | `.skeleton` | ローディングプレースホルダー |
| 29 | アバター | `.avatar` `.avatar-sm` `.avatar-lg` | 丸型ユーザーアイコン |
| 30 | チップ | `.chip` `.chip-remove` | 削除可能なタグ |
| 31 | テーブル | `.table` `.table-compact` `.table-card` | データ表 |
| 32 | アコーディオン | `.accordion` `.accordion-header` `.accordion-body` | 折りたたみパネル |
| 33 | タイポグラフィ | `var(--font-sans)` `var(--font-mono)` | Inter / JetBrains Mono |
| 34 | 角丸 | `var(--radius-sm)` `var(--radius)` `var(--radius-lg)` `var(--radius-full)` | 統一角丸トークン |
| 35 | リストチップ | `.list-chip-group` `.list-chip` `.list-chip-icon` `.list-chip-check` | アイコン付きトグル選択リスト（エフェクト選択等） |
| 36 | ボタン色 | `.btn-orange` `.btn-teal` | オレンジ/ティール色のボタンバリアント |
| 37 | ヘッダーアクション | `.app-header-actions` | エディタヘッダーの中央アクション領域（save/import/export） |
| 38 | 保存ステータス | `.save-status` `.save-status.is-success` `.save-status.is-error` | スピナー＋成功/エラー表示 |
| 39 | 編集可能タイトル | `.app-title-editable` | エディタヘッダーのインライン編集可能タイトル |

## UI 変更時の必須フロー（最重要）

**UI に関わる変更（HTML / CSS / DOM 操作系 JS）を加えたら、必ず以下を実行する。**
`open` でユーザーに丸投げせず、まず Claude 自身がスクリーンショットで確認すること。

```bash
# 1. Light / Dark 両方のスクリーンショットを撮る
bash lib/screenshot.sh <tool>/index.html /tmp/check-light.png 1280x900 light
bash lib/screenshot.sh <tool>/index.html /tmp/check-dark.png  1280x900 dark

# 2. Read ツールで画像を確認し、問題があれば修正して再撮影

# 3. 問題なければ open でユーザーに確認を依頼
open <tool>/index.html
```

**このフローを省略してはいけない。** 詳細は IMPLEMENTATION_RULES.md を参照。

@IMPLEMENTATION_RULES.md

## アイコンルール（最重要）

**新規実装では絵文字（Emoji）をアイコンとして使用してはいけない。**
すべてのアイコンは `lib/icons.js`（`window.yutoIcons` API）の SVG アイコンを使用すること。

- `lib/icons.js` を `<script>` で読み込み、`yutoIcons.toSVG('name')` または `yutoIcons.toElement('name')` でアイコンを取得する
- 既存ツール（appstore-preview / er-diagram / DesignPocket / text-counter）の絵文字はそのまま残してよい（既存は変更不要）
- **新規ツール・新規ページでは必ず `lib/icons.js` の SVG アイコンを使う**
- 必要なアイコンが `lib/icons.js` に無い場合は、同じスタイル（24×24 viewBox, stroke-width 2, round linecap/linejoin）で追加する
- アイコン一覧は [`icons/index.html`](icons/index.html) のギャラリーで確認できる（検索・プレビュー・コピー機能付き）

### クイックリファレンス

```html
<!-- head で読み込み -->
<script src="../lib/icons.js"></script>
```

```js
// SVG 文字列として取得
const svg = yutoIcons.toSVG('search', { size: 20 });

// DOM 要素として取得
const el = yutoIcons.toElement('search', { size: 20 });

// 色付き
const colored = yutoIcons.toSVG('heart', { size: 24, style: 'color:#ef4444' });

// 全アイコン一覧
const all = yutoIcons.list(); // [{name, category, tags, ja, path}]
```

## コーディング規則

- コメント・UI テキスト: 日本語
- 変数名・関数名: 英語（camelCase）
- CSS: ケバブケース
- インデント: スペース2つ
- 各ツールは完全にオフラインで動作すること（外部 API への依存禁止。ただし Google Drive 同期は例外）
- レスポンシブ対応必須
- **色・shadow・radius・spacing をハードコードしない** — 必ず `var(--xxx)` で `lib/theme.css` のトークンを参照する
- 各ツールの `style.css` で `:root` を再定義しない — テーマ変更したい場合は `lib/theme.css` 側を編集する
- **絵文字（Emoji）をアイコンとして使わない** — `lib/icons.js` の SVG アイコンを使う（上記「アイコンルール」参照）

## フォルダ構成ルール

- 完成済みツール: `tool-name/index.html` + `style.css` + `script.js` の3ファイル構成を推奨
- 小規模なツール・プレースホルダーであっても、必ず `tool-name/` フォルダを切って `index.html` として配置すること（リポジトリ直下に `*.html` を置かない）
- リポジトリ直下に置いてよい `.html` は、ホーム画面である `index.html` だけ
- 共有モジュール（複数ツールから参照される CSS/JS）は `lib/` 配下にまとめる
- 新規ツール追加用のテンプレートは `_template-list/` / `_template-single/` を使う（`_` 接頭辞のフォルダはツール扱いしない）
- トップページ `index.html` にカードを追加してリンクすること

## タスク管理

- 実装完了したタスクは TODO.md で `[x]` にすること
- 新たに必要なタスクが発覚したら追記すること

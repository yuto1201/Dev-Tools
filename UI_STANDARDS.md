# UI 標準化ルール

yuto's dev tools 全ツール共通の UI 配置・テーマトークン・コンポーネント命名規則。
新規ツール追加時、および既存ツール改修時は必ずこのルールに従うこと。

---

# アイコンシステム

## 基本ルール

**新規実装では絵文字（Emoji）をアイコンとして使用禁止。** すべて `lib/icons.js` の SVG アイコンを使うこと。

| ファイル | 役割 |
|---|---|
| [lib/icons.js](lib/icons.js) | **SVG アイコンレジストリ**。`window.yutoIcons` API を提供。320+ アイコン、16 カテゴリ |
| [icons/index.html](icons/index.html) | アイコンギャラリー。検索・プレビュー・カラー変更・SVG コピー機能付き |

## アイコンスタイル仕様

すべてのアイコンは以下のスタイルで統一されている:

| 属性 | 値 |
|---|---|
| viewBox | `0 0 24 24` |
| stroke-width | `2` |
| stroke-linecap | `round` |
| stroke-linejoin | `round` |
| fill | `none`（ストロークベース） |
| stroke | `currentColor`（親要素の `color` を継承） |

## 使い方

```html
<!-- head で読み込み（theme.js の後、script.js の前） -->
<script src="../lib/icons.js"></script>
```

```js
// SVG HTML 文字列として取得（innerHTML に代入する用途）
el.innerHTML = yutoIcons.toSVG('search', { size: 20 });

// DOM 要素として取得（appendChild する用途）
container.appendChild(yutoIcons.toElement('edit', { size: 16 }));

// 色を変える（style 属性で color を指定）
el.innerHTML = yutoIcons.toSVG('heart', { size: 24, style: 'color:#ef4444' });

// class を付ける
el.innerHTML = yutoIcons.toSVG('star', { size: 20, class: 'my-icon' });
```

## カテゴリ一覧

| カテゴリ | 内容 |
|---|---|
| `tool` | 各ツール用（database, smartphone, code 等） |
| `nav` | ナビゲーション（arrow-*, chevron-*, home, menu 等） |
| `action` | 操作（plus, edit, trash, copy, download, search 等） |
| `ui` | UI / ステータス（sun, moon, settings, check-circle, filter 等） |
| `content` | コンテンツ（file, folder, image, user, tag, clock 等） |
| `media` | メディア（play, pause, headphones 等） |
| `commerce` | 商取引（shopping-cart, credit-card, truck 等） |
| `weather` | 天気（cloud-rain, wind, thermometer 等） |
| `social` | ソーシャル（phone, smile, rss 等） |
| `shape` | 図形（diamond, octagon, target 等） |
| `gesture` | ジェスチャー（pointer, hand, grab 等） |
| `transport` | 交通（car, plane, train, bicycle 等） |
| `nature` | 自然（leaf, flame, mountain, waves 等） |
| `health` | 健康（heart-pulse, pill, stethoscope 等） |
| `place` | 場所（building, store, hospital 等） |
| `education` | 教育（lightbulb, ruler, microscope 等） |

## アイコンを追加する場合

必要なアイコンが `lib/icons.js` に無い場合は、以下の手順で追加する:

1. `lib/icons.js` の `icons` 配列に新しいエントリを追加
2. 上記のスタイル仕様（24×24, stroke-width 2, round linecap/linejoin）に合わせる
3. `name`, `category`, `tags`（英語）, `ja`（日本語タグ）, `path` を設定
4. `icons/index.html` を開いて表示を確認

## 禁止事項

- **絵文字（Emoji）をアイコンとして使用しない**（新規実装のみ。既存ツールの絵文字はそのまま）
- **独自の SVG アイコンを各ツールに埋め込まない** — 共有の `lib/icons.js` に追加する
- **外部アイコンライブラリ（Font Awesome 等）を導入しない** — `lib/icons.js` に統一
- **アイコンのスタイル（stroke-width, linecap 等）を個別に変えない** — 統一感を維持

---

# テーマシステム

## 仕組み

ニューモフィズムの **light / dark 切替式**テーマ。`<html data-theme="light|dark">` 属性で切り替わる。

| ファイル | 役割 |
|---|---|
| [lib/theme.css](lib/theme.css) | **トークンの値の唯一の定義場所**。`:root` (light) と `[data-theme="dark"]` (dark) を提供 |
| [lib/theme.js](lib/theme.js) | テーマ切替ロジック。`window.theme.apply()`, `toggle()`, `mountUI()`, `onChange()` を提供。**FOUC 防止のため必ず `<head>` 内で読み込む** |
| [lib/components.css](lib/components.css) | **共有コンポーネントの唯一の定義場所**。`.btn` / `.app-card` / `.modal` / `.form-input` 等。トークンを `var()` で参照 |
| [_theme-preview/index.html](_theme-preview/index.html) | 全トークン + コンポーネントの視覚プレビュー（開発確認用） |

## トークン一覧（名前と用途）

**値は `lib/theme.css` を直接見ること。** ここでは名前と用途だけ列挙する。

### Surface
| トークン | 用途 |
|---|---|
| `--bg` | ページ背景。card と同色で shadow が立体感を作る |
| `--bg-elevated` | 強調表示要素の背景（実体は `--bg` と同じ） |
| `--bg-inset` | 凹んで見せる要素の背景（実体は `--bg` と同じ） |

### Text
| トークン | 用途 |
|---|---|
| `--text` | 本文・タイトル |
| `--text-dim` | サブテキスト・ラベル |
| `--muted` | 非アクティブ・キャプション |

### Semantic（用途ベース）
| トークン | 用途 |
|---|---|
| `--accent` | テーマカラー（プライマリ）。リンク・focus・主要ボタン |
| `--accent-hover` | プライマリのホバー色 |
| `--success` | 成功・OK・完了 |
| `--danger` | エラー・削除・破壊操作 |
| `--warning` | 警告・注意・保留 |
| `--info` | 情報・通知・ヒント |

### Utility Palette（タグ・装飾・差別化用）
| トークン | 用途 |
|---|---|
| `--purple` | 差別化・装飾 |
| `--pink` | 差別化・装飾 |
| `--orange` | 差別化・装飾 |
| `--teal` | 差別化・装飾 |
| `--indigo` | 差別化・装飾 |

### Shadow（ニューモフィズムの核）
| トークン | 用途 |
|---|---|
| `--shadow-out` | 標準的に浮き上がる要素（カード等） |
| `--shadow-out-sm` | 小さい要素（ボタン・タグ等） |
| `--shadow-out-lg` | 大きい要素（モーダル・ホバー時のカード等） |
| `--shadow-in` | フォーカス時の入力欄など強めの内側くぼみ |
| `--shadow-in-sm` | 通常時の input・サムネイル枠など軽い内側くぼみ |

### Radius
| トークン | 用途 |
|---|---|
| `--radius-sm` | 小さい要素（input、小ボタン） |
| `--radius` | カード・パネル |
| `--radius-lg` | モーダル・大きいパネル |
| `--radius-full` | 円形（pill ボタン、アイコンボタン） |

### Spacing
`--space-1` (4px) 〜 `--space-10` (40px) の 8 段階。padding / gap / margin に使う。

### Font
| トークン | 用途 |
|---|---|
| `--font-sans` | Inter（本文・UI 全般） |
| `--font-mono` | JetBrains Mono（コード・ラベル・mono 表記） |

## 禁止事項

- **色・shadow・radius・spacing をハードコードしない**。必ず `var(--xxx)` で参照する
- **各ツールの `style.css` で `:root` を再定義しない**。テーマカラーを変えたいなら `lib/theme.css` 自体を編集する
- **`body.light-theme` のようなクラスベースのテーマ切替を新規導入しない**。`html[data-theme]` に統一されている

---

# ヘッダー領域の構成要素（必須）

各ツールのトップ画面（ダッシュボード／一覧画面）には、以下を決まった位置に配置する。
**ヘッダー領域とメイン領域の間には必ず区切り線**を引いて視覚的に分離すること。

```
┌──────────────────────────────────────────────────┐
│ [←] [icon] タイトル             [🌙] [sync UI]  │
├──────────────────────────────────────────────────┤  ← 区切り線（必須）
│ セクションタイトル                  [アクション] │
│ （メインコンテンツ）                             │
└──────────────────────────────────────────────────┘
```

## 1. 戻るボタン `.app-back-btn`（左端）

- 配置：ヘッダー左端、タイトルの前
- 見た目：36px 丸型ニューモフィズムボタン（`--shadow-out-sm`）、テキスト `←`
- ホバーで `var(--accent)` に色変化、クリックで `--shadow-in-sm` に凹む
- リンク先：`../index.html`（Toolbox に戻る）
- ツール内サブ画面（編集画面など）では一覧に戻るリンクに差し替え（`href="#"` + JS）
- ルートの toolbox（`/index.html`）には不要

## 2. タイトルアイコン `.app-title-icon`（戻るボタンの右）

- 配置：戻るボタンとタイトルの間
- 見た目：36px 角丸ボックス（`--radius-sm`、`--shadow-out-sm`）、中にアイコン
- **新規ツールでは `lib/icons.js` の SVG アイコンを使う**（`yutoIcons.toSVG('name', {size:20})` で innerHTML に挿入）
- 純粋に装飾（クリック不可）
- ツールごとに固有のアイコンを設定する

| ツール | アイコン | 備考 |
|---|---|---|
| ER Diagram Generator | ⬡ | 既存（絵文字） |
| DesignPocket | 🎨 | 既存（絵文字） |
| Text Counter | 📝 | 既存（絵文字） |
| App Store Preview | 📱 | 既存（絵文字） |
| Icon Gallery | `grid-3x3` | SVG アイコン |
| **新規ツール** | **`lib/icons.js` から選択** | **絵文字禁止** |

## 3. 画面タイトル `.app-title`（アイコンの右）

- 見た目：22px、font-weight 800、`var(--text)`、`line-height: 1.2`
- 画面ごとに異なるタイトル（例：「プロジェクト一覧」「ER図エディタ」「ギャラリー」）

## 3. テーマ切替ボタン + 同期 UI（右上）

- 配置：ヘッダー右、横並び
- **順序ルール**：左から **`#theme-mount` → `#sync-mount`** の順
- **テーマ切替ボタン** — `<div id="theme-mount"></div>` に `window.theme.mountUI(mount)` で生成
  - 🌙 / ☀ アイコンで light / dark 切替
  - 共有スタイル：[lib/theme.css](lib/theme.css)
- **Drive 同期 UI** — `<div id="sync-mount"></div>` に `window.driveSync.mountUI(mount)` で生成
  - 未ログイン：「Google でサインイン」ボタン（pill 型）
  - ログイン済み：メールアドレス + 同期状態ドット + サインアウト（pill 型）
  - 共有スタイル：[lib/drive-sync.css](lib/drive-sync.css)
- 両者とも**全ツールで同じ位置・同じデザイン**にすること
- ツール内に複数画面（例：プロジェクト選択画面 + エディタ画面）がある場合は、各画面に両方の `mountUI()` を呼ぶ

## 4. ヘッダーとメインの区切り線

- ヘッダー要素のすぐ下に薄い境界線を引く
- ニューモフィズムでは：
  ```css
  .app-header {
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--border-strong);
    box-shadow: 0 1px 0 var(--shadow-light);  /* 彫り込みハイライト */
  }
  ```
- 区切り線がないとヘッダーとメインが融合して情報の優先順位が分からなくなる

---

# 一覧画面（ダッシュボード／ギャラリー）のレイアウト規則

トップ画面が「コンテンツの一覧」になるツール（プロジェクト一覧・アイデア一覧・ファイル一覧など）は、
**ギャラリー型グリッド**で表示すること。テーブル形式やリスト形式は使わない。

## 必須要件

### 1. CSS Grid `auto-fill` で左上から流し込み
- `grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))`
- 横幅に応じて自動で列数を増やし、左上 → 右 → 折り返し下 の順に並べる
- 並び順は新しい順（最終更新降順）を推奨

### 2. 各カードに視覚的プレビュー（サムネイル）を表示
- 文字情報だけでなく、コンテンツの中身が一目で分かるビジュアルを上部に置く
- 例：appstore-preview = スライドの実 canvas を縮小描画
- 例：DesignPocket = 登録画像
- 例：er-diagram = ER 図のミニマップ
- サムネイル領域の高さは固定（例：140px）、`overflow:hidden`、内側 `--shadow-in-sm` で凹ませる

### 3. カード構造（上から順に）
```
┌────────────────────┐
│   サムネイル       │ ← ビジュアル（必須）
├────────────────────┤
│ 名前               │ ← タイトル（必須、1行省略）
│ メタ情報           │ ← 更新日時／件数など（任意）
└────────────────────┘
    [hover時アクション] ← 複製・削除など、絶対配置で右上にフロート
```

### 4. ホバー演出
- `box-shadow: var(--shadow-out) → var(--shadow-out-lg)` + `transform:translateY(-3px)`
- 操作ボタンはホバー時に `opacity:0→1` でフェードイン
- スマホでは常時表示（`@media (pointer:coarse) { opacity:1 }`）

### 5. 空状態
- 件数 0 のときはアイコン + メッセージ + 「新規作成」ボタンを中央配置
- グリッドではなく flex で垂直センタリング
- `grid-column: 1 / -1` で全幅占有

## レスポンシブ規則

| 幅 | 列数の目安 | カード min-width |
|---|---|---|
| 〜479px | 2列固定 | `1fr 1fr` |
| 480〜767px | 自動 | `minmax(200px, 1fr)` |
| 768px〜 | 自動 | `minmax(260px, 1fr)` |

## 並び順・フィルタ UI

- 並び替え・フィルタが必要な場合はギャラリーの**直前**に薄いツールバーを置く
- フィルタクリア後はカードが必ず左上から再充填されること（grid のデフォルト挙動）

---

# 編集画面の全幅レイアウト（ツール内サブ画面）

一覧画面とは異なり、編集画面（個別アイテムを編集する画面）では**作業領域を最大化**する。
左右の余白を 0 にして、ヘッダーだけに最小限の padding を持たせる。

```css
body[data-view="editor"] .app-inner {
  max-width: none;
  min-height: 100vh;
  padding: 0;
  gap: 0;
}
body[data-view="editor"] .app-header {
  padding: var(--space-5) var(--space-5) var(--space-4);
}
body[data-view="editor"] .app-editor-body {
  flex: 1;
  border-radius: 0;
  box-shadow: none;       /* 全幅では inset shadow が成立しない */
  background: var(--bg);
  padding: var(--space-5);
}
```

ビュー切替は `document.body.dataset.view = 'list' | 'editor'` で行う。
[_template-list/](_template-list/) のリファレンス実装を参照。

---

# 標準コンポーネント命名規則

すべての標準コンポーネントは [lib/components.css](lib/components.css) で定義されている。
各ツールは `<link rel="stylesheet" href="../lib/components.css">` を `<head>` で読み込むだけで全コンポーネントが使える。
**ツール固有の `style.css` で同じクラス名を再定義してはいけない**（lib/components.css を編集すること）。

## レイアウト
| クラス | 用途 |
|---|---|
| `.app-inner` | max-width 1280px の中央寄せコンテナ |
| `.app-header` | 標準ヘッダー（左: 戻る+アイコン+タイトル、右: sync/theme） |
| `.app-header-left` / `.app-header-right` | ヘッダー左右領域 |
| `.app-back-btn` | 戻るボタン（丸型ニューモフィズム、`←`） |
| `.app-title-icon` | タイトルアイコン（角丸ボックス、絵文字） |
| `.app-title` | 画面タイトル |
| `.app-back-link` | _(後方互換)_ 旧テキストリンク — 新規では `.app-back-btn` を使う |
| `.app-toolbar` | 一覧画面のセクションタイトル + アクション行 |
| `.app-section-title` | セクション見出し |
| `.app-grid` | ギャラリーグリッド |
| `.app-empty` | 空状態 |
| `.app-editor-body` | 編集画面のメイン領域 |

## カード
| クラス | 用途 |
|---|---|
| `.app-card` | ギャラリーカード本体 |
| `.app-card-thumb` | サムネイル領域 |
| `.app-card-info` | カード下部の情報領域 |
| `.app-card-name` | カードタイトル |
| `.app-card-meta` | メタ情報 |
| `.app-card-actions` | hover で表示する操作ボタン群 |
| `.app-card-btn` | 操作ボタン（`.danger` で危険系） |

## ボタン
| クラス | 用途 |
|---|---|
| `.btn` | 標準ボタン（neumorphism shadow） |
| `.btn-primary` | プライマリ（accent カラー、塗りつぶし） |
| `.btn-ghost` | サブ・キャンセル系（透過） |
| `.btn-danger` | 削除系（赤文字） |

## フォーム
| クラス | 用途 |
|---|---|
| `.form-row` | 1 行分のラベル + 入力 |
| `.form-label` | ラベル |
| `.form-input` | input / textarea / select 共通 |
| `.picker` | 汎用ピッカー（date / color 等、凹み `--shadow-in-sm`） |
| `.color-field` | カラーピッカー（swatch + hex テキスト連動セット） |
| `.color-field-swatch` | 色選択 swatch（`input[type=color]`） |
| `.color-field-hex` | hex コード入力（`input[type=text]`） |

```html
<div class="color-field">
  <input type="color" class="color-field-swatch" value="#489CC1">
  <input type="text" class="color-field-hex" value="#489CC1" maxlength="7">
</div>
```

## タブバー / セグメンテッドコントロール
| クラス | 用途 |
|---|---|
| `.tab-bar` | タブバー外枠（凹みの `--shadow-in-sm`、pill 型角丸） |
| `.tab` | 個々のタブボタン。`.active` で浮き上がり（`--shadow-out-sm`）+ accent カラー |
| `.segmented` | セグメンテッドコントロール外枠（`.tab-bar` と同スタイル） |
| `.segmented-item` | セグメント個別ボタン（`.tab` と同スタイル） |

```html
<div class="tab-bar">
  <button class="tab active">背景</button>
  <button class="tab">配置</button>
  <button class="tab">エフェクト</button>
</div>
```

## リストチップ（トグル選択リスト）
| クラス | 用途 |
|---|---|
| `.list-chip-group` | リストの外枠コンテナ（縦並び、gap 付き） |
| `.list-chip` | 個々の選択項目。`.active` で accent ボーダー + チェック表示 |
| `.list-chip-icon` | 左端のアイコンボックス（ニューモフィズム shadow） |
| `.list-chip-name` | 項目名（太字） |
| `.list-chip-desc` | 説明テキスト（小さく dim） |
| `.list-chip-check` | 右端のチェック丸。`.active` で accent 塗り + ✓ |

```html
<div class="list-chip-group">
  <button class="list-chip active">
    <span class="list-chip-icon">✨</span>
    <span class="list-chip-text">
      <span class="list-chip-name">グロウ</span>
      <span class="list-chip-desc">テキストに光る発光エフェクト</span>
    </span>
    <span class="list-chip-check">✓</span>
  </button>
</div>
```

## モーダル / トースト
| クラス | 用途 |
|---|---|
| `.modal-overlay` | 画面全体オーバーレイ（`hidden` 属性で表示制御） |
| `.modal` | モーダル本体 |
| `.modal-header` / `.modal-body` / `.modal-footer` | 各領域 |
| `.modal-close` | 閉じるボタン |
| `.toast` | 通知トースト（`.show` で表示、`.success` / `.error` でカラー） |

---

# 実装パターン

## HTML 雛形

新規ツールはテンプレフォルダをコピーするだけで OK。詳細は [IMPLEMENTATION_RULES.md](IMPLEMENTATION_RULES.md) 参照。

```html
<head>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../lib/theme.css">
  <link rel="stylesheet" href="../lib/components.css">  <!-- 共有コンポーネント -->
  <script src="../lib/theme.js"></script>               <!-- FOUC 防止のため head 内 -->
  <script src="https://accounts.google.com/gsi/client" async defer></script>
  <link rel="stylesheet" href="../lib/drive-sync.css">
  <link rel="stylesheet" href="style.css">              <!-- ツール固有のスタイルだけ -->
</head>
```

## Drive 同期の初期化

```js
function initDriveSync(){
  if(!window.driveSync) return;
  window.driveSync.register({
    toolId: 'my-tool',
    keys: [LS_KEY_MAIN],                    // 同期したい localStorage キー
    keyPatterns: [/^my_tool_item_/],        // 接頭辞ベースの一括登録
    onSyncedFromRemote: (changedKeys) => {
      reloadFromLocalStorage();
      render();
    },
  });
  const mount = document.getElementById('sync-mount');
  if(mount) window.driveSync.mountUI(mount);
  window.driveSync.init();
}
```

保存・削除サイトでは `window.driveSync.markDirty(localKey)` / `window.driveSync.markDeleted(localKey)` を呼ぶ。

## テーマ切替ボタンの初期化

```js
function initTheme(){
  if(!window.theme) return;
  const m = document.getElementById('theme-mount');
  if(m) window.theme.mountUI(m);
}
```

複数画面ある場合は `theme-mount-editor` 等を別途用意して同様に呼ぶ。

---

# リファレンス実装（テンプレート）

新規ツール作成時は、必ず以下のいずれかのテンプレをコピーして始めること。
**ゼロから書き起こさない**。

| テンプレ | 用途 | 含まれる画面・部品 |
|---|---|---|
| **[_template-list/](_template-list/)** | 一覧 + 個別編集型 | ヘッダー / ギャラリーグリッド / 編集画面 / モーダル / トースト / drive-sync 統合 / theme 切替 |
| **[_template-single/](_template-single/)** | 単一画面ユーティリティ型 | ヘッダー / メインコンテンツ / トースト / drive-sync 統合（オプション） / theme 切替 |
| **[_theme-preview/](_theme-preview/)** | （開発用） | 全テーマトークンの視覚プレビュー |

具体的な使い方とコピー手順は [IMPLEMENTATION_RULES.md](IMPLEMENTATION_RULES.md) を参照。

---

# 新規ツール追加時のチェックリスト

- [ ] テンプレ（`_template-list/` か `_template-single/`）をコピーして始めた
- [ ] `<head>` で `lib/theme.css` / `lib/components.css` / `lib/theme.js` / `lib/icons.js` を読み込んでいる
- [ ] `lib/theme.js` は `<head>` 内（FOUC 防止）
- [ ] **アイコンに絵文字を使っていない** — すべて `lib/icons.js` の SVG アイコン（`yutoIcons.toSVG()`）
- [ ] 右上に `theme-mount → sync-mount` の順でマウント点がある
- [ ] ヘッダー構造が `.app-header` / `.app-header-left` / `.app-header-right` になっている
- [ ] タイトルの左に `.app-back-btn`（← 戻るボタン）と `.app-title-icon`（アイコン）がある
- [ ] ヘッダーとメインの間に区切り線がある
- [ ] 一覧画面はギャラリー型グリッド（`auto-fill, minmax(260px, 1fr)`）
- [ ] 各カードに視覚的サムネイルがある
- [ ] 編集画面は `body[data-view="editor"]` で全幅レイアウト
- [ ] `style.css` 内に `:root` ブロックが無い（`lib/theme.css` から継承）
- [ ] `style.css` に `.btn` `.app-card` `.modal` 等の標準コンポーネントを再定義していない（`lib/components.css` から継承）
- [ ] 色・shadow・radius・spacing がハードコードされていない（全て `var(--xxx)`）
- [ ] `window.theme.mountUI()` と `window.driveSync.register/mountUI/init()` を呼んでいる
- [ ] 保存・削除時に `markDirty` / `markDeleted` を呼んでいる
- [ ] light / dark 両方で崩れない
- [ ] スマホ幅（〜479px）で崩れない
- [ ] DevTools のコンソールにエラーが出ていない
- [ ] ルートの `index.html` にカードを追加した

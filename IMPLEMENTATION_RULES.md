# 実装ルール

yuto's dev tools のコード変更フロー。すべてのコード変更でこのフローに従うこと。

---

# 必須：Chrome スクリーンショットで UI を確認する

**コードの diff だけで「完了」と判断しない。**
UI に関わる変更（HTML / CSS / DOM 操作系 JS）を加えたら、
**必ず Chrome headless でスクリーンショットを撮り、Claude 自身が画像で見た目を確認すること。**
`open` でユーザーに丸投げするのは禁止。

## フロー（省略禁止）

1. 実装（HTML / CSS / JS の編集）
2. **`bash lib/screenshot.sh` で Light / Dark 両方のスクリーンショットを撮る**
3. **`Read` ツールで画像を開き、Claude 自身がレイアウト・色・崩れを目視確認する**
4. 問題があれば修正 → 2 に戻る
5. **バージョン判定** — 今回の変更でステージ（alpha/beta/release）またはバージョン番号が変わるか判断し、必要なら `index.html` の該当カードの `.card-version` を更新する（詳細は「[バージョン管理ルール](#バージョン管理ルール)」）
6. 問題なければ `open <該当ファイル>` でブラウザを起動し、ユーザーにも確認を依頼
7. **ユーザーが OK を出すまで「完了」と言わない**

## スクリーンショットコマンド

[lib/screenshot.sh](lib/screenshot.sh) を使う。

```bash
# 基本構文
bash lib/screenshot.sh <対象HTML> [出力先PNG] [幅x高さ] [テーマ]

# 例: appstore-preview を light / dark 両方で確認
bash lib/screenshot.sh appstore-preview/index.html /tmp/ap-light.png 1280x900 light
bash lib/screenshot.sh appstore-preview/index.html /tmp/ap-dark.png  1280x900 dark
```

## 必須確認セット（毎回実行する）

UI 変更後は**必ず以下の 2 枚**を撮って Read で確認する。

```bash
# Light テーマ
bash lib/screenshot.sh <tool>/index.html /tmp/check-light.png 1280x900 light
# Dark テーマ
bash lib/screenshot.sh <tool>/index.html /tmp/check-dark.png  1280x900 dark
```

確認観点:
- ヘッダー構成（`[←] [icon] Title ... [🌙] [sync]`）が正しいか
- レイアウトが崩れていないか
- テキストが読めるコントラストか
- ボタン・カードの shadow が出ているか
- Light / Dark 切替で破綻しないか

## 制限事項

- **500px 未満の viewport** では Chrome headless のレンダリングに制限がある（既知バグ）。モバイル表示はユーザーが DevTools のレスポンシブモードで手動確認する
- **`file://` プロトコル**で開くため、Google OAuth（Drive sync）は動かない
- **JS による動的レンダリング**（localStorage からデータを読んでカードを生成する等）は反映される

## ブラウザ起動コマンド（ユーザー確認用）

| 対象 | コマンド |
|---|---|
| トップページ（toolbox） | `open index.html` |
| appstore-preview | `open appstore-preview/index.html` |
| er-diagram | `open er-diagram/index.html` |
| DesignPocket | `open DesignPocket/index.html` |
| text-counter | `open text-counter/index.html` |
| _template-list（雛形検証） | `open _template-list/index.html` |
| _template-single（雛形検証） | `open _template-single/index.html` |
| _theme-preview（テーマトークン視覚確認） | `open _theme-preview/index.html` |

macOS のデフォルトブラウザで `file://` プロトコルで開く。

## ハードリロードに注意

CSS / JS を変更したらブラウザは **`Cmd+Shift+R`（ハードリロード）** を推奨。
通常の `Cmd+R` ではブラウザキャッシュで古い CSS が読まれて変更が反映されないことがある。
キャッシュバスター（`?v=YYYYMMDDx`）も併用すると確実。

## Drive 同期も含めて検証したい場合

`file://` では Google OAuth が動かない（CORS / origin チェックで弾かれる）。
sync 機能まで通しで確認したいときは VS Code Live Server（`http://localhost:5500`）を使う。
このオリジンは Google Cloud Console の OAuth 設定に登録済み。

別途簡易サーバーを立てるなら：
```bash
python3 -m http.server 5500
```
→ `http://localhost:5500/` にアクセス。ポート 5500 を使えば OAuth 設定をいじらずに済む。

---

# 目視チェックリスト

実装後の確認では以下を必ず見る。詳細は [UI_STANDARDS.md](UI_STANDARDS.md) を参照。

## ヘッダー
- [ ] 画面タイトルが左上に配置されているか
- [ ] その下に小さく「← Back to Toolbox」（または「← 一覧に戻る」等）があるか
- [ ] 右上に **🌙 テーマ切替ボタン → sync UI** の順で並んでいるか
- [ ] ヘッダーとメインの間に**区切り線**が見えるか
- [ ] 各要素の縦位置・横位置が他ツール・テンプレと統一されているか

## 一覧画面
- [ ] ギャラリー型グリッドで左上から流し込まれているか
- [ ] 各カードに視覚的なサムネイルがあるか
- [ ] hover で操作ボタンがフェードインするか
- [ ] 空状態が適切に表示されるか

## 編集画面（ある場合）
- [ ] 全幅レイアウト（左右の余白なし）になっているか
- [ ] 「← 一覧に戻る」リンクが機能するか

## テーマ
- [ ] **🌙 ボタンで light/dark を切り替えても崩れない**
- [ ] dark でも全テキストが読めるコントラストか
- [ ] light/dark 切替がリロード後も維持されるか

## レスポンシブ
- [ ] DevTools のレスポンシブモードでスマホ幅（〜479px）に縮めて崩れないか
- [ ] タブレット幅（〜767px）でも自然に並ぶか

## ハードコード残骸チェック
- [ ] `style.css` 内に `#[0-9a-f]{6}` の生 hex カラーが残っていないか
   ```bash
   grep -nE '#[0-9a-fA-F]{6}' tool-name/style.css
   ```
   一覧結果が空（または `lib/theme.css` 経由のコメントだけ）であること
- [ ] `style.css` 内に `:root` ブロックが残っていないか
- [ ] `box-shadow:` の値がハードコードされていないか（必ず `var(--shadow-*)`）
- [ ] `style.css` 内に `.btn` `.app-card` `.modal` 等の標準コンポーネントが再定義されていないか
   ```bash
   grep -nE '^\.(btn|app-card|modal|form-input|toast)' tool-name/style.css
   ```

## 標準コンポーネントの使用確認（実装前の必須ステップ）
- [ ] **UI パーツを実装する前に、CLAUDE.md の「標準コンポーネント早見表」を確認した**
- [ ] 該当するコンポーネントが既にあれば、そのクラスを使っている（独自スタイルを書いていない）
- [ ] 該当するものがない場合のみ、ツール固有の `style.css` に追加している

## 新コンポーネント追加時
- [ ] `lib/components.css` にスタイルを追加した
- [ ] **`_theme-preview/index.html` にも対応セクションを追加した**（preview = 完全カタログのルール）
- [ ] **CLAUDE.md の「標準コンポーネント早見表」にも行を追加した**

## アイコン
- [ ] **絵文字（Emoji）をアイコンとして使っていない**（新規実装のみ）
- [ ] `lib/icons.js` を `<script>` で読み込んでいる
- [ ] アイコンは `yutoIcons.toSVG()` / `yutoIcons.toElement()` で取得している
- [ ] 必要なアイコンが `lib/icons.js` に存在することを `icons/index.html` で確認した

## コンソール
- [ ] DevTools の Console タブにエラーが出ていないか
- [ ] Network タブで 404 が出ていないか

## バージョン判定
- [ ] 今回の変更でステージ（alpha/beta/release）が変わるか確認した
- [ ] 今回の変更でバージョン番号（vX.Y）を上げるべきか確認した
- [ ] 該当する場合、`index.html` の `.card-version` を更新した

---

# バージョン管理ルール

トップページ `index.html` の各ツールカードに表示される **ステージバッジ（alpha / beta / release）+ バージョン番号（vX.Y）** の更新ルール。
このルールは全ツール・全実装で共通。ツールを変更したら最後にこのルールに従って判定を行うこと。

## ステージ定義

| ステージ | 色（トークン） | 状態 | 条件 |
|---|---|---|---|
| **alpha** | `--warning`（黄） | 試作・開発中 | 主要機能の一部が未実装、または破壊的変更が頻繁に発生する段階。UI が崩れる可能性あり |
| **beta** | `--purple`（紫） | 機能一式揃った・動作検証中 | 主要機能は全て実装済みで一通り動作する。安定性は未検証、バグ残存の可能性あり |
| **release** | `--success`（緑） | 安定動作 | 日常利用でクリティカルバグが出ていない。本番利用可 |

## バージョン番号の付け方

形式: `vX.Y`（patch は使わない）

| 範囲 | 対応ステージ |
|---|---|
| `v0.1` – `v0.5` | alpha |
| `v0.6` – `v0.9` | beta |
| `v1.0` 以上 | release |

### X（メジャー）を上げる
- 破壊的変更（保存データの構造が変わる、既存データと互換しない）
- 大幅なリライト・UI 全面刷新
- `v1.x → v2.0` は release のまま可

### Y（マイナー）を上げる
- 機能追加
- 非破壊的な UI 改善
- 小さな拡張

### バグ修正のみ
- バージョン番号を上げない（patch 相当の `vX.Y.Z` はこのプロジェクトでは使わない）

## ステージ昇格の判断基準

### alpha → beta

以下が全て満たされたら昇格。

- [ ] 想定していた主要機能が全て実装済み
- [ ] 主要な画面遷移・操作が一通り動作する
- [ ] 破壊的な構造変更の予定が当面ない
- [ ] Light / Dark 両テーマで崩れない
- [ ] 目視チェックリストの主要項目を満たしている

### beta → release

以下が全て満たされたら昇格。

- [ ] 実装開始または直近の大規模変更から **1 週間以上** 自分が日常利用してクリティカルバグが出ていない
- [ ] 主要機能の動作が安定している
- [ ] 目視チェックリスト全項目を満たしている
- [ ] 新規バグの発生頻度が十分低い
- [ ] Drive 同期が関係するツールの場合、実端末 2 台以上で同期動作を確認済み

### 降格（release → beta など）

大規模リファクタで一時的に不安定になる場合は、終わるまで beta に戻してよい。
降格は悪いことではなく、ユーザーに「今は検証中」と正しく伝えるための重要なシグナル。

## 判定フロー（実装変更ごと）

```
変更の性質は？
├─ バグ修正のみ         → バージョン変更なし
├─ 小さな機能追加/改善  → Y を +1（例: v0.8 → v0.9）
├─ 大きな機能追加       → Y を +1 or X を +1
└─ 破壊的変更/リライト  → X を +1（例: v1.2 → v2.0）

現ステージは適切か？
├─ alpha で主要機能揃った → beta に昇格（昇格条件リスト確認）
├─ beta で安定してきた    → release に昇格（昇格条件リスト確認）
└─ release で不安定化     → beta に降格
```

## 更新箇所

`index.html` の該当カードの `.card-version` ブロックを書き換える:

```html
<span class="card-version beta">                 <!-- class 第二値: alpha | beta | release -->
  <span class="card-version-stage">beta</span>   <!-- テキスト: alpha | beta | release -->
  <span class="card-version-num">v0.8</span>     <!-- バージョン番号: vX.Y -->
</span>
```

**重要:** `class` の第二値（色）と `.card-version-stage` のテキストは必ず一致させること。ズレているとバッジの色とラベルが合わなくなる。

## 更新を忘れないためのチェックポイント

- UI 変更・機能追加を実装したら、スクリーンショット確認の後に必ず「バージョン判定」ステップを通す
- 「バグ修正だけだからバージョン変えない」と判断したときも、**明示的に判断したことを Claude は出力に書く**（例: 「バグ修正のみのためバージョン据え置き」）
- 判定をサボると、release v1.0 のラベルのまま破壊的変更が入るなどの不整合が発生する

---

# 新規ツールを追加する手順

ゼロからヘッダー・グリッド・モーダルを書き起こさない。
過去に何度もレイアウト崩れを発生させているため、必ずテンプレをコピーする。

| 用途 | テンプレ |
|---|---|
| 一覧 + 個別編集型（ほとんどのツール） | [_template-list/](_template-list/) |
| 単一画面ユーティリティ型 | [_template-single/](_template-single/) |

## ステップ

```bash
# 1. テンプレをコピー
cp -r _template-list my-new-tool
# または
cp -r _template-single my-new-tool
```

2. `my-new-tool/index.html` の `__TOOL_NAME__` を実際のツール名に置換
3. `my-new-tool/script.js` 冒頭の `TOOL_ID` / `LS_LIST` / `LS_PREFIX`（または `LS_KEY`）をツール固有の値に書き換え
4. `script.js` 内の `// TODO:` コメント箇所を実装（renderThumbnail / renderEditor 等）
5. 必要に応じて `style.css` にツール固有のスタイルを追加（**`lib/theme.css` のトークンを使うこと**、ハードコード禁止）
6. ルートの `index.html`（toolbox）に新しいカードを追加してリンクを張る
7. `open my-new-tool/index.html` でブラウザ確認
8. 一区切りごとにユーザーに見てもらう（一気に書ききらない）

詳細は [UI_STANDARDS.md](UI_STANDARDS.md) のリファレンス実装セクションも参照。

---

# 既存ツールを新テーマに刷新する手順（Phase C）

旧ツール（appstore-preview / er-diagram / DesignPocket / text-counter）をニューモフィズム新テーマに刷新するときの手順。
**1ツールずつ確実に**進めること。複数ツール並行は禁止。

## 事前準備
1. ブラウザで現状を `open` して開き、何がどう描画されているか確認しておく
   - 旧ツール特有の独自パーツ（appstore-preview のステップバー等）を把握
   - スクリーンショットを残しておくと比較しやすい

## index.html を編集
2. `<head>` に Inter + JetBrains Mono のフォント `<link>` を追加
3. `<head>` に `<link rel="stylesheet" href="../lib/theme.css">` を追加
4. `<head>` に `<script src="../lib/theme.js"></script>` を追加（FOUC 防止のため必ず head 内）
5. ヘッダー構造を標準化：
   ```html
   <header class="app-header">
     <div class="app-header-left">
       <h1 class="app-title">画面タイトル</h1>
       <a href="../index.html" class="app-back-link">← Back to Toolbox</a>
     </div>
     <div class="app-header-right">
       <div id="theme-mount"></div>
       <div id="sync-mount"></div>
     </div>
   </header>
   ```
6. ツール内に複数画面（一覧 + 編集）がある場合は、各画面のヘッダーに同じ構造を適用
   - 各画面に `theme-mount` `theme-mount-editor` のように別 ID で mount 点を用意

## style.css を編集
7. `:root` ブロックを **完全削除**（トークンは `lib/theme.css` から継承）
8. 古いツール固有の CSS 変数（`--accent1`, `--surface`, `--bg2` 等）を新トークンに置換
   - 旧 → 新 マッピング例：
     - `--bg2` / `--surface` → `--bg-elevated`
     - `--accent1` / `--accent2` → `--accent`
     - `--text2` / `--text3` → `--text-dim` / `--muted`
9. ハードコードされた色・shadow・radius を `var(--xxx)` に置換
   - 例：`background: #0d1220` → `background: var(--bg)`
   - 例：`box-shadow: 0 4px 16px rgba(0,0,0,.4)` → `box-shadow: var(--shadow-out)`
   - 例：`border-radius: 12px` → `border-radius: var(--radius)`
10. ヘッダースタイルを標準クラス（`.app-header` / `.app-inner` 等）に統一
11. ボタン・カード・モーダル・トーストを標準コンポーネントクラス（`.btn` / `.app-card` / `.modal` 等）に置換
12. ツール固有のレイアウト（appstore-preview のステップバー、er-diagram のサイドバー等）は残してよいが、色・shadow は新トークンを使う

## script.js を編集
13. `initTheme()` 関数を追加して `window.theme.mountUI()` を呼ぶ
   ```js
   function initTheme(){
     if(!window.theme) return;
     ['theme-mount', 'theme-mount-editor'].forEach((id) => {
       const m = document.getElementById(id);
       if(m) window.theme.mountUI(m);
     });
   }
   ```
14. ツール初期化処理（`init()` や `DOMContentLoaded` ハンドラ）から `initTheme()` を呼ぶ

## 検証
15. `open tool-name/index.html` でブラウザ確認
16. **light / dark 両方**でチェック（🌙 ボタンを押す）
17. 上記「目視チェックリスト」を全項目確認
18. **ハードコード残骸チェック**を grep で実行
   ```bash
   grep -nE '#[0-9a-fA-F]{6}' tool-name/style.css
   ```
19. ユーザーに見せて OK が出たら完了。CLAUDE.md のツール一覧表のステータスを「完成（新テーマ）」に更新

---

# アンチパターン（やってはいけないこと）

過去に発生した失敗の繰り返しを防ぐためのリスト。

## デザイン関連
- ❌ **色・shadow・radius・spacing をハードコード**する
  - → 必ず `var(--xxx)` で `lib/theme.css` のトークンを参照する
- ❌ **各ツールの `style.css` で `:root` を再定義**する
  - → トークンの値を変えたいなら `lib/theme.css` 自体を編集する
- ❌ **各ツールの `style.css` で `.btn` `.app-card` `.modal` 等の標準コンポーネントを再定義**する
  - → 共通スタイルは `lib/components.css` で一元管理。変更したいときは `lib/components.css` 自体を編集する
- ❌ **`lib/components.css` に新しいコンポーネントを追加したのに `_theme-preview/` に追加し忘れる**
  - → preview = 全コンポーネントの完全カタログ。**追加したら必ず preview にも対応セクションを追加**する。preview から見えない＝Claude / ユーザーが存在を知らない＝再発明される
- ❌ **`body.light-theme` のようなクラスベースのテーマ切替**を新規導入する
  - → `<html data-theme>` に統一されている。`window.theme` API を使う
- ❌ **ヘッダーに区切り線を入れない**
  - → ヘッダーとメインが融合して情報の優先順位が分からなくなる
- ❌ **back-link をタイトルの上に置く**
  - → 旧ルール。今はタイトルの**下**に控えめに

## アイコン関連
- ❌ **新規ツールで絵文字（Emoji）をアイコンとして使う**
  - → `lib/icons.js` の SVG アイコン（`yutoIcons.toSVG('name')`）を使う。一覧は `icons/index.html` で確認
- ❌ **独自の SVG アイコンを各ツールのファイルに直接埋め込む**
  - → 共有の `lib/icons.js` にアイコンを追加し、API 経由で利用する
- ❌ **外部アイコンライブラリ（Font Awesome, Material Icons 等）を導入する**
  - → `lib/icons.js` に統一。新しいアイコンが必要なら同じスタイルで `lib/icons.js` に追加する
- ❌ **`lib/icons.js` を読み込まずにアイコンを使おうとする**
  - → `<script src="../lib/icons.js"></script>` を `<head>` か `</body>` 前で読み込む

## 実装フロー関連
- ❌ **テンプレを使わずにゼロから書き起こす**
  - → 必ず `_template-list/` か `_template-single/` をコピーから始める
- ❌ **スクリーンショットを撮らずに `open` だけでユーザーに丸投げ**する
  - → まず `bash lib/screenshot.sh` で Light / Dark 両方を撮り、Claude 自身が Read で確認する。それから `open`
- ❌ **`open` せずに「完了」と言う**
  - → ユーザーの目視 OK が出るまで完了ではない
- ❌ **大きな変更を一気に書いて最後にまとめて確認**する
  - → どこで壊れたか分からなくなる。小さい単位でスクリーンショットを撮ってチェック
- ❌ **デザイン変更でも diff だけ見て満足**する
  - → 必ず Chrome headless スクリーンショットで実際の見た目を確認する

## ファイル構成関連
- ❌ **リポジトリ直下に `*.html` を作る**（`index.html` 以外）
  - → 必ず `tool-name/` フォルダを切って `tool-name/index.html` として配置
- ❌ **新規ファイルを無闇に作る**
  - → 既存の3ファイル構成（`index.html` + `style.css` + `script.js`）を維持
- ❌ **`lib/` 以外に共有モジュールを置く**
  - → 全ツール共通の CSS/JS は必ず `lib/` 配下

## Drive 同期関連
- ❌ **`localStorage` に書き込んだ後 `markDirty` を呼び忘れる**
  - → 別端末に同期されない
- ❌ **OAuth が動かないと言って `file://` で sync をテストする**
  - → 動かないのが正常。Live Server か `python3 -m http.server 5500` を使う

---

# 実装の進め方

## 段階的に確認

- 大きな変更も小さな単位に分けて、各単位で `open` してチェック
- 一気に書ききって最後にまとめて確認、はしない（どこで壊れたか分からなくなる）
- レイアウト・スタイルの変更は特に頻繁に確認

## 既存構成を尊重

- 新規ファイル作成は最小限。既存の3ファイル構成（`index.html` + `style.css` + `script.js`）を維持
- 詳細は [CLAUDE.md](CLAUDE.md) のフォルダ構成ルールを参照

## バックアップ

- ブラウザを開いたらリロード（`Cmd+R`）して最新の変更が反映されているか確認
- ハードリロード（`Cmd+Shift+R`）が必要な場合もあり（CSS キャッシュなど）

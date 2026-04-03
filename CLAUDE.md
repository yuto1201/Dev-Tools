# CLAUDE.md

## プロジェクト概要

yuto's dev tools — 開発者向けWebツール集。GitHub Pagesでホスティング。
各ツールはオフラインで動作するスタンドアロンなWebアプリケーション。

## ツール一覧

| ツール | パス | 状態 | 構成 |
|---|---|---|---|
| ER Diagram Generator | `er-diagram/` | 完成 | index.html + style.css + script.js |
| App Store Preview Generator | `appstore-preview/` | 完成 | index.html + style.css + script.js |
| Text Counter | `text-counter/` | 完成 | index.html（単一ファイル） |
| Cosmic Particle Universe | `cosmic-particle.html` | 未実装（プレースホルダー） | 単一HTMLファイル |
| Parser / Decoder | `parser/` | 未実装（プレースホルダー） | index.html（プレースホルダーのみ） |

トップページは `/index.html` で、全ツールへのリンクを持つダッシュボード。

## 技術スタック

- HTML / CSS / JavaScript（バニラ、フレームワーク不使用）
- 外部ライブラリは最小限（appstore-previewのJSZipのみ）
- ビルドツール・バンドラーなし
- GitHub Pages でそのまま配信

## デザインルール

### 共通テーマ
- 宇宙/サイバー系ダークテーマ
- 背景色: `#080b12`（--bg）
- フォント: `Syne`（見出し）+ `Space Mono`（ラベル・コード）
- Google Fontsから読み込み

### CSS変数（共通パレット）
```css
--bg: #080b12;
--bg2: #0d1220;
--bg3: #111827;
--border: rgba(99, 179, 237, 0.15);
--accent1: #63b3ed;  /* 青 */
--accent2: #76e4f7;  /* シアン */
--accent3: #9f7aea;  /* 紫 */
--accent4: #68d391;  /* 緑 */
--text: #e2e8f0;
--muted: #64748b;
```

### 共通UIパターン
- 背景にグリッドオーバーレイ（40px間隔）
- カードUIにホバー時のグロー効果
- `fadeUp` アニメーション（0.7〜0.8s ease）
- 各ツールページに「← Back to Toolbox」リンク

## コーディング規則

- コメント・UIテキスト: 日本語
- 変数名・関数名: 英語（camelCase）
- CSS: ケバブケース
- インデント: スペース2つ
- 各ツールは完全にオフラインで動作すること（外部APIへの依存禁止）
- レスポンシブ対応必須

## フォルダ構成ルール

- 完成済みツール: `tool-name/index.html` + `style.css` + `script.js` の3ファイル構成を推奨
- 小規模なツールは単一HTMLファイルも可
- トップページ `index.html` にカードを追加してリンクすること

## タスク管理

- 実装完了したタスクはTODO.mdで `[x]` にすること
- 新たに必要なタスクが発覚したら追記すること

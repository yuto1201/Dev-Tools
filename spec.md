# spec.md — Dev Tools 詳細仕様

## サイト全体

- GitHub Pages でホスティング（静的HTMLのみ）
- トップページ `/index.html` が全ツールへのダッシュボード
- 各ツールは独立して動作（ツール間の依存なし）
- 完全オフライン動作（外部API呼び出し禁止）
- レスポンシブ対応必須

## 共通デザイン仕様

- ダークテーマ（宇宙/サイバー系）
- 背景: `#080b12` + 40pxグリッドオーバーレイ
- フォント: Syne（見出し）+ Space Mono（ラベル・コード）
- カードUI: ホバー時にグロー + translateY(-6px)
- アニメーション: fadeUp（opacity 0→1, translateY 24px→0）
- 各ツールに「← Back to Toolbox」リンク

## ツール別仕様

### 1. ER Diagram Generator (`er-diagram/`)
- SVGベースのER図エディタ
- テーブル・カラム・外部キーをGUIで定義
- ドラッグ&ドロップでテーブル配置
- CSV / JSON インポート・エクスポート
- DDL(SQL) / SVG / PNG エクスポート
- Undo/Redo対応
- 複数プロジェクト管理（localStorage）
- ダーク/ライトテーマ切替

### 2. App Store Preview Generator (`appstore-preview/`)
- App Store申請用スクリーンショット画像生成
- iPhone（6.9"/6.7"/6.5"/5.5"）+ iPad（12.9"/11"/9.7"）対応
- 2ステップUI: パーツ選択 → 内容入力
- テンプレート機能
- スライド管理（複数枚、並び替え）
- ZIP一括エクスポート / 全サイズZIPエクスポート
- プロジェクト管理（localStorage + JSON保存/読込）
- Undo/Redo対応
- 外部ライブラリ: JSZip（ZIP生成のみ）

### 3. Text Counter (`text-counter/`)
- テキスト入力 → 文字数・単語数・行数をリアルタイムカウント
- 文字数（空白込み）/ 文字数（空白なし）/ 単語数 / 行数
- 単一HTMLファイル構成

### 4. Cosmic Particle Universe (`cosmic-particle.html`) — 未実装
- HTML5 Canvas パーティクルシミュレーション
- 5モード: 重力 / 渦 / 花火 / 銀河 / 波動
- マウス/タッチインタラクション
- requestAnimationFrame + パーティクルプール
- 単一HTMLファイル構成

### 5. Parser / Decoder (`parser/`) — 未実装
- JSON / JWT / URL / Base64 / Unix Timestamp / HTML Entity
- 左右2ペイン（入力/出力）
- 入力即時デコード
- 3ファイル構成（index.html + style.css + script.js）

## トップページ仕様 (`/index.html`)
- ツール一覧をカードグリッドで表示
- 各カードにアイコン・ラベル・タイトル・説明・タグ
- カード追加時: `.card:nth-child(N)` でアニメーション遅延とアクセントカラーを設定
- GitHub リンクボタン
- フッター: 「yuto1201 ● GitHub Pages」

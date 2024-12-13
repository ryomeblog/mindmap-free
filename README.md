# マインドマップアプリケーション

## プロジェクト概要

このアプリケーションは、インタラクティブなマインドマップを作成、編集、管理するためのReactベースのウェブアプリケーションです。
ユーザーは直感的なインターフェースを使用して、ノードの追加、編集、削除、および階層的な接続を行うことができます。
また、作成したマインドマップのインポート・エクスポート機能により、データの保存や共有が可能です。

## 機能

### 基本機能
- ルートノードの追加
- 子ノードの作成
- ノードのドラッグ＆ドロップ
- ノードの編集
- ノードの削除
- ノード間の階層的接続
- マインドマップのズームイン/アウト
- キャンバスのパン操作
- マインドマップデータのインポート/エクスポート
- クリップボードへのコピー機能
- ファイルダウンロード機能

## プロジェクト構造

```
mind-map-app/
├── src/
│   ├── router/
│   │   └── AppRouter.jsx        # ルーティング設定
│   ├── components/
│   │   ├── MindMapCanvas.jsx    # マインドマップのメインキャンバス
│   │   ├── NodeConnections.jsx  # ノード間の接続線描画
│   │   ├── NodeDialog.jsx       # ノード追加・編集ダイアログ
│   │   └── ImportExportDialog.jsx # インポート/エクスポートダイアログ
│   ├── pages/
│   │   └── MindMapPage.jsx      # メインページのロジック
│   ├── utils/
│   │   └── compression.js       # データの圧縮/解凍ユーティリティ
│   └── App.jsx                  # メインアプリケーションコンポーネント
```

## 使用技術

- React
- React Router
- Material-UI (MUI)
- React Draggable
- Pako (データ圧縮)

## 必要な依存関係

- `react`
- `react-router-dom`
- `@mui/material`
- `@mui/icons-material`
- `react-draggable`
- `pako`

## インストール手順

1. リポジトリをクローン
```bash
git clone [リポジトリURL]
```

2. 依存関係をインストール
```bash
npm install
```

3. 開発サーバーを起動
```bash
npm start
```

## 使用方法

### 基本操作
1. 「ルートノード追加」ボタンをクリックして最初のノードを作成
2. ノード内の「子ノード」ボタンをクリックして、子ノードを追加
3. ノードをドラッグして移動
4. 「編集」ボタンでノードのテキストを変更
5. 「削除」ボタンでノードとその子ノードを削除

### 表示操作
- マウスホイール：ズームイン/アウト
- キャンバスドラッグ：表示位置の移動

### データ管理
- インポートボタン：保存したマインドマップデータの読み込み
- エクスポートボタン：現在のマインドマップデータの保存
  - クリップボードにコピー
  - ファイルとしてダウンロード

## 制限事項

- 各ノードは単一の親ノードにのみ接続可能
- ノードは階層的な構造を持つ
- エクスポートされたデータは専用の圧縮形式で保存

## ブラウザ対応

- Google Chrome（推奨）
- Firefox
- Safari
- Microsoft Edge


# KIS Demo - Keep It Simple Demonstration Project

KIS (Keep It Simple) の原則に従って作成されたモダンなフルスタックWebアプリケーションのデモンストレーションプロジェクトです。

## 🎯 プロジェクトの目的

このプロジェクトは以下の目的で作成されています：

- モダンなWeb開発技術の実装例を提供
- シンプルで理解しやすいコード構造の実例
- 開発環境のベストプラクティスの紹介
- フルスタック開発の基本パターンの学習

## 🛠️ 技術スタック

### フロントエンド
- **React 18** - UIライブラリ
- **TypeScript** - 型安全な開発
- **Vite** - 高速な開発サーバー
- **Styled Components** - CSS-in-JS
- **React Router** - ルーティング
- **Axios** - HTTP クライアント

### バックエンド
- **Node.js** - JavaScript ランタイム
- **Express** - Webフレームワーク
- **TypeScript** - 型安全な開発
- **SQLite** - 軽量データベース
- **Zod** - スキーマバリデーション

### 開発ツール
- **ESLint** - コード品質管理
- **Prettier** - コードフォーマッター
- **Vitest** - テストフレームワーク
- **Docker** - コンテナ化
- **Concurrently** - 並行実行

## 📁 プロジェクト構造

```
KIS-demo/
├── frontend/                 # フロントエンドアプリケーション
│   ├── src/
│   │   ├── components/       # 再利用可能なコンポーネント
│   │   ├── pages/           # ページコンポーネント
│   │   ├── hooks/           # カスタムフック
│   │   ├── utils/           # ユーティリティ関数
│   │   ├── types/           # TypeScript型定義
│   │   └── styles/          # スタイル関連
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # バックエンドAPI
│   ├── src/
│   │   ├── routes/          # APIルート
│   │   ├── controllers/     # ビジネスロジック
│   │   ├── models/          # データモデル
│   │   ├── middleware/      # ミドルウェア
│   │   ├── database/        # データベース関連
│   │   ├── utils/           # ユーティリティ関数
│   │   └── types/           # TypeScript型定義
│   ├── package.json
│   └── tsconfig.json
├── docs/                     # ドキュメント
├── scripts/                  # 開発・デプロイスクリプト
├── docker-compose.yml        # Docker設定
├── package.json             # ルート設定
└── README.md               # このファイル
```

## 🚀 開始方法

### 前提条件

- Node.js (v18以上)
- npm (v9以上)
- Git

### インストール

1. **依存関係をインストールとセットアップ**
   ```bash
   # 自動セットアップスクリプトを実行
   ./scripts/setup.sh
   
   # または手動でセットアップ
   npm run install:all
   cp env.example .env
   cd backend && npm run db:seed && cd ..
   ```

### 開発環境での実行

**すべてのサービスを同時に起動**
```bash
npm run dev
```

**個別に起動する場合**
```bash
# フロントエンド (http://localhost:5173)
npm run dev:frontend

# バックエンド (http://localhost:3001)
npm run dev:backend
```

### Dockerを使用する場合

```bash
# すべてのサービスを起動
docker-compose up

# バックグラウンドで起動
docker-compose up -d

# 停止
docker-compose down
```

## 📝 利用可能なスクリプト

### ルートレベル
- `npm run dev` - 開発環境でフロントエンド・バックエンドを同時起動
- `npm run build` - プロダクション用ビルド
- `npm test` - 全テスト実行
- `npm run lint` - 全コードの静的解析
- `npm run format` - コードフォーマット
- `npm run clean` - 生成ファイルとnode_modulesを削除

### フロントエンド固有
- `npm run dev:frontend` - 開発サーバー起動
- `npm run build:frontend` - プロダクションビルド
- `npm run preview` - ビルドしたアプリのプレビュー

### バックエンド固有
- `npm run dev:backend` - 開発サーバー起動（ホットリロード付き）
- `npm run build:backend` - TypeScriptコンパイル
- `npm run start` - プロダクション起動
- `npm run db:migrate` - データベースマイグレーション
- `npm run db:seed` - サンプルデータ投入

## 🧪 テスト

```bash
# 全テスト実行
npm test

# フロントエンドテスト
npm run test:frontend

# バックエンドテスト
npm run test:backend

# テストウォッチモード
cd frontend && npm run test:ui  # フロントエンド用UI
cd backend && npm run test:watch  # バックエンド用
```

## 📚 API ドキュメント

バックエンドAPI の詳細については、`docs/api.md` を参照してください。

## 🤝 貢献

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを開く

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は `LICENSE` ファイルを参照してください。

## 🔧 開発のヒント

### 推奨する開発環境
- **エディター**: VS Code
- **拡張機能**:
  - ES7+ React/Redux/React-Native snippets
  - TypeScript Importer
  - Prettier - Code formatter
  - ESLint
  - Auto Rename Tag

### コーディング規約
- TypeScript を使用し、型安全性を保つ
- ESLint と Prettier の設定に従う
- コンポーネントは関数型で作成
- API は RESTful な設計に従う
- エラーハンドリングを適切に実装

## 📞 サポート

質問や問題がある場合は、GitHub Issues を使用してお問い合わせください。

# KIS Demo - Keep It Simple Demonstration Project

KIS (Keep It Simple) の原則に従って作成されたモダンなフルスタックWebアプリケーションのデモンストレーションプロジェクトです。

## 🎯 プロジェクトの目的

このプロジェクトは以下の目的で作成されています：

- モダンなWeb開発技術の実装例を提供
- シンプルで理解しやすいコード構造の実例
- 権限ベースアクセス制御（RBAC）の実装
- 統合管理システムの業務アプリケーション開発パターンの学習
- フルスタック開発のベストプラクティスの紹介

## 🏢 システム概要

本システムは、顧客・商品・注文・取引先・在庫などを統合管理するWebアプリケーションです。
以下の主要機能を提供します：

### 📊 統合ダッシュボード
- リアルタイム業務データの一元監視
- 売上推移グラフとアクティビティフィード
- クイックアクション機能

### 🏢 基幹業務管理
- **顧客管理**: 顧客情報・取引履歴・売上分析
- **商品管理**: 商品データ・在庫状況・パフォーマンス分析  
- **注文管理**: 注文処理・配送追跡・売上分析
- **取引先管理**: パートナー企業との関係管理
- **仕入先管理**: サプライヤー情報・評価管理
- **請求書管理**: 請求書発行・支払い管理
- **在庫管理**: 在庫追跡・発注管理・ロケーション管理

### 🔐 権限管理システム
- ユーザーロール別アクセス制御
- 画面・操作別権限設定
- 権限マトリックスの可視化

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
- **bcryptjs** - パスワードハッシュ化
- **jsonwebtoken** - JWT認証

### 開発ツール
- **ESLint** - コード品質管理
- **Prettier** - コードフォーマッター
- **Docker** - コンテナ化
- **Concurrently** - 並行実行
- **Helmet** - セキュリティヘッダー
- **Morgan** - HTTPリクエストロガー

## 📁 プロジェクト構造

```
KIS-demo/
├── frontend/                 # フロントエンドアプリケーション
│   ├── src/
│   │   ├── components/       # 再利用可能なコンポーネント
│   │   │   ├── Layout.tsx    # レイアウトコンポーネント
│   │   │   └── ProtectedRoute.tsx # 認証保護ルート
│   │   ├── pages/           # ページコンポーネント（10画面）
│   │   │   ├── DashboardPage.tsx     # 統合ダッシュボード
│   │   │   ├── CustomersPage.tsx     # 顧客管理
│   │   │   ├── ProductsPage.tsx      # 商品管理
│   │   │   ├── OrdersPage.tsx        # 注文管理
│   │   │   ├── PartnersPage.tsx      # 取引先管理
│   │   │   ├── SuppliersPage.tsx     # 仕入先管理
│   │   │   ├── InvoicesPage.tsx      # 請求書管理
│   │   │   ├── InventoryPage.tsx     # 在庫管理
│   │   │   ├── PermissionMatrixPage.tsx # 権限マトリックス
│   │   │   └── LoginPage.tsx         # ログイン
│   │   ├── hooks/           # カスタムフック
│   │   │   └── useAuth.tsx   # 認証管理フック
│   │   ├── utils/           # ユーティリティ関数
│   │   │   ├── api.ts        # API通信
│   │   │   └── permissions.ts # 権限管理
│   │   ├── types/           # TypeScript型定義
│   │   └── styles/          # スタイル関連（テーマシステム）
│   └── vite.config.ts
├── backend/                  # バックエンドAPI
│   ├── src/
│   │   ├── routes/          # APIルート
│   │   │   ├── auth.ts       # 認証API
│   │   │   └── customers.ts  # 顧客API
│   │   ├── controllers/     # ビジネスロジック
│   │   │   ├── AuthController.ts      # 認証コントローラー
│   │   │   └── CustomerController.ts  # 顧客コントローラー
│   │   ├── models/          # データモデル
│   │   │   ├── BaseModel.ts  # ベースモデル
│   │   │   ├── UserModel.ts  # ユーザーモデル
│   │   │   ├── CustomerModel.ts       # 顧客モデル
│   │   │   ├── ProductModel.ts        # 商品モデル
│   │   │   ├── OrderModel.ts          # 注文モデル
│   │   │   └── PermissionModel.ts     # 権限モデル
│   │   ├── middleware/      # ミドルウェア
│   │   │   ├── auth.ts       # JWT認証
│   │   │   └── permission.ts # 権限チェック
│   │   ├── database/        # データベース関連
│   │   │   ├── connection.ts # DB接続管理
│   │   │   ├── schema.sql    # データベーススキーマ
│   │   │   └── seed.ts       # サンプルデータ
│   │   └── types/           # TypeScript型定義
│   ├── data/                # SQLiteデータベースファイル
│   └── tsconfig.json
├── docs/                     # 詳細ドキュメント
│   ├── 01-システム全体概要.md
│   ├── 02-モジュール・プログラム構成.md
│   ├── 03-クラス・データ構造定義.md
│   ├── 04-画面定義・帳票定義.md
│   ├── 05-ダッシュボード検索機能追加影響調査報告書.md
│   ├── 06-取引先管理システム契約状態列追加影響調査報告書.md
│   ├── crud-matrix.md        # CRUD操作マトリックス
│   ├── database-schema.md    # データベース設計書
│   └── permission-matrix.md  # 権限設計書
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

## 📚 ドキュメント

### 設計書・仕様書
- **[01-システム全体概要](docs/01-システム全体概要.md)** - システム全体の概要と構成
- **[02-モジュール・プログラム構成](docs/02-モジュール・プログラム構成.md)** - アーキテクチャとモジュール設計
- **[03-クラス・データ構造定義](docs/03-クラス・データ構造定義.md)** - データモデルと型定義
- **[04-画面定義・帳票定義](docs/04-画面定義・帳票定義.md)** - 画面仕様と機能定義

### 運用・保守文書
- **[CRUD操作マトリックス](docs/crud-matrix.md)** - 画面別CRUD操作一覧
- **[データベース設計書](docs/database-schema.md)** - テーブル構造とインデックス設計
- **[権限設計書](docs/permission-matrix.md)** - ロール別権限マトリックス

### 影響調査報告書
- **[ダッシュボード検索機能追加影響調査](docs/05-ダッシュボード検索機能追加影響調査報告書.md)**
- **[取引先管理システム契約状態列追加影響調査](docs/06-取引先管理システム契約状態列追加影響調査報告書.md)**

### API仕様
現在実装済みのAPI：
- **認証API**: ユーザーログイン・登録・権限取得
- **顧客API**: 顧客情報のCRUD操作・検索・フィルタリング

## 🔐 認証・権限システム

### デモアカウント
- **管理者**: `admin` / `admin123` (全機能アクセス可能)
- **一般ユーザー**: `user` / `user123` (参照権限のみ)

### 権限レベル
- **Admin**: 全画面・全操作が可能
- **Manager**: 参照・作成・更新が可能（削除は制限）
- **Staff**: 参照・一部作成のみ可能

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
  - Styled Components

### コーディング規約
- TypeScript を使用し、型安全性を保つ
- ESLint と Prettier の設定に従う
- コンポーネントは関数型で作成
- Styled Components を使用したスタイリング
- API は RESTful な設計に従う
- エラーハンドリングを適切に実装
- 権限チェックを各画面・操作で実装

### デバッグ・開発支援
- ブラウザの開発者ツールでReact Developer Toolsを活用
- バックエンドAPIのテストにはPostmanやcurlを使用
- データベースの確認にはSQLite Browserを推奨

## 🚀 実装済み機能

### フロントエンド
- ✅ 統合ダッシュボード（リアルタイム統計・グラフ・アクティビティ）
- ✅ 全業務画面の実装（10画面）
- ✅ レスポンシブデザイン対応
- ✅ 権限別UI制御
- ✅ 検索・フィルタリング機能

### バックエンド
- ✅ JWT認証システム
- ✅ ロールベースアクセス制御
- ✅ 顧客管理API (CRUD)
- ✅ データベース設計・マイグレーション
- ✅ セキュリティミドルウェア

### 今後の拡張予定
- 🔄 取引先・仕入先・商品・注文・請求書・在庫管理API
- 🔄 ダッシュボード統計API
- 🔄 レポート・エクスポート機能
- 🔄 リアルタイム通知システム

## 📞 サポート

質問や問題がある場合は、GitHub Issues を使用してお問い合わせください。
または、docsディレクトリ内の詳細ドキュメントを参照してください。

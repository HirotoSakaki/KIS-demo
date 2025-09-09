# KIS Demo システム設計書（リバースエンジニアリング版）

## 📋 目次

1. [システム概要](#システム概要)
2. [アーキテクチャ設計](#アーキテクチャ設計)
3. [データベース設計](#データベース設計)
4. [API設計](#api設計)
5. [フロントエンド設計](#フロントエンド設計)
6. [画面設計・機能一覧](#画面設計機能一覧)
7. [CRUDマトリックス](#crudマトリックス)
8. [セキュリティ・認証設計](#セキュリティ認証設計)
9. [運用・保守](#運用保守)

---

## システム概要

### プロジェクト情報
- **プロジェクト名**: KIS Demo - Keep It Simple Demonstration Project
- **目的**: モダンなWeb開発技術の実装例とフルスタック開発の基本パターンの学習
- **開発原則**: KIS (Keep It Simple) - シンプルで理解しやすいコード構造

### 主要機能
- 📊 **統合ダッシュボード**: リアルタイム業務データの一元監視
- 👥 **顧客管理**: 顧客情報の登録・検索・管理
- 📦 **商品管理**: 商品データの管理（データサンプルでは船舶管理）
- 📝 **注文管理**: 注文処理・ステータス管理（データサンプルでは貨物輸送管理）
- 🔐 **権限管理**: ユーザーロール別アクセス制御
- 📋 **権限マトリックス**: 画面・操作権限の可視化

### 技術スタック

#### フロントエンド
- **React 18**: UIライブラリ
- **TypeScript**: 型安全な開発
- **Vite**: 高速な開発サーバー
- **Styled Components**: CSS-in-JS スタイリング
- **React Router**: シングルページアプリケーションのルーティング
- **Axios**: HTTP通信ライブラリ

#### バックエンド
- **Node.js**: JavaScript ランタイム
- **Express**: Webアプリケーションフレームワーク
- **TypeScript**: 型安全なサーバーサイド開発
- **SQLite**: 軽量データベース
- **bcryptjs**: パスワードハッシュ化
- **jsonwebtoken**: JWT認証
- **Zod**: スキーマバリデーション

#### 開発ツール
- **ESLint**: コード品質管理
- **Prettier**: コードフォーマッター
- **Vitest**: テストフレームワーク
- **Docker**: コンテナ化
- **Concurrently**: 並行実行

---

## アーキテクチャ設計

### システム構成

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React SPA)   │◄──►│   (Express API) │◄──►│   (SQLite)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
│                      │                      │
│ • React Router       │ • RESTful API        │ • User Data
│ • Styled Components  │ • JWT Authentication │ • Customer Data
│ • TypeScript         │ • Role-based Access  │ • Product Data
│ • Axios HTTP Client  │ • Middleware Stack   │ • Order Data
│                      │                      │ • Permission Matrix
```

### レイヤーアーキテクチャ

#### フロントエンド
```
┌────────────────────────────────────────┐
│ Presentation Layer (Pages)             │
├────────────────────────────────────────┤
│ Component Layer (Reusable Components)  │
├────────────────────────────────────────┤
│ Business Logic Layer (Hooks)           │
├────────────────────────────────────────┤
│ Data Access Layer (API Utils)          │
└────────────────────────────────────────┘
```

#### バックエンド
```
┌────────────────────────────────────────┐
│ Controller Layer (Business Logic)      │
├────────────────────────────────────────┤
│ Middleware Layer (Auth, Validation)    │
├────────────────────────────────────────┤
│ Model Layer (Data Access)              │
├────────────────────────────────────────┤
│ Database Layer (SQLite)                │
└────────────────────────────────────────┘
```

### ディレクトリ構造

```
KIS-demo/
├── frontend/                  # フロントエンドアプリケーション
│   ├── src/
│   │   ├── components/        # 再利用可能なコンポーネント
│   │   │   ├── Layout.tsx     # レイアウトコンポーネント
│   │   │   └── ProtectedRoute.tsx  # 認証保護ルート
│   │   ├── pages/             # ページコンポーネント
│   │   │   ├── DashboardPage.tsx   # ダッシュボード
│   │   │   ├── CustomersPage.tsx   # 顧客管理
│   │   │   ├── ProductsPage.tsx    # 商品管理
│   │   │   ├── OrdersPage.tsx      # 注文管理
│   │   │   ├── LoginPage.tsx       # ログイン
│   │   │   └── PermissionMatrixPage.tsx  # 権限マトリックス
│   │   ├── hooks/             # カスタムフック
│   │   │   └── useAuth.tsx    # 認証管理フック
│   │   ├── utils/             # ユーティリティ
│   │   │   ├── api.ts         # API通信
│   │   │   └── permissions.ts # 権限管理
│   │   ├── types/             # TypeScript型定義
│   │   │   └── index.ts       # 共通型定義
│   │   └── styles/            # スタイル関連
│   │       ├── GlobalStyle.ts # グローバルスタイル
│   │       └── theme.ts       # テーマ設定
│   ├── package.json
│   └── vite.config.ts
├── backend/                   # バックエンドAPI
│   ├── src/
│   │   ├── routes/            # APIルート
│   │   │   ├── auth.ts        # 認証API
│   │   │   └── customers.ts   # 顧客API
│   │   ├── controllers/       # ビジネスロジック
│   │   │   ├── AuthController.ts      # 認証コントローラー
│   │   │   └── CustomerController.ts  # 顧客コントローラー
│   │   ├── models/            # データモデル
│   │   │   ├── BaseModel.ts   # ベースモデル
│   │   │   ├── UserModel.ts   # ユーザーモデル
│   │   │   ├── CustomerModel.ts    # 顧客モデル
│   │   │   ├── ProductModel.ts     # 商品モデル
│   │   │   ├── OrderModel.ts       # 注文モデル
│   │   │   └── PermissionModel.ts  # 権限モデル
│   │   ├── middleware/        # ミドルウェア
│   │   │   ├── auth.ts        # JWT認証
│   │   │   └── permission.ts  # 権限チェック
│   │   ├── database/          # データベース関連
│   │   │   ├── connection.ts  # DB接続管理
│   │   │   ├── schema.sql     # データベーススキーマ
│   │   │   └── seed.ts        # サンプルデータ
│   │   ├── utils/             # ユーティリティ
│   │   └── types/             # TypeScript型定義
│   │       └── index.ts       # API型定義
│   ├── package.json
│   └── tsconfig.json
├── docs/                      # ドキュメント
│   └── permission-matrix.md   # 権限マトリックス仕様
├── scripts/                   # 開発・デプロイスクリプト
│   ├── setup.sh               # 環境セットアップ
│   └── docker-setup.sh        # Docker環境構築
├── docker-compose.yml         # Docker設定
├── package.json              # ルート設定
└── README.md                 # プロジェクト概要
```

---

## データベース設計

### ER図

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    users    │     │ customers   │     │  products   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id (PK)     │     │ id (PK)     │     │ id (PK)     │
│ username    │     │customer_code│     │product_code │
│ email       │     │ name        │     │ name        │
│ password_h. │     │ email       │     │ description │
│ role        │     │ phone       │     │ price       │
│ created_at  │     │ address     │     │ stock_qty   │
│ updated_at  │     │ created_by  │─┐   │ category    │
└─────────────┘     │ created_at  │ │   │ created_by  │─┐
       │            │ updated_at  │ │   │ created_at  │ │
       │            └─────────────┘ │   │ updated_at  │ │
       │                           │   └─────────────┘ │
       │            ┌──────────────┘                    │
       │            │              ┌───────────────────┘
       │            ▼              ▼
       │    ┌─────────────┐ ┌─────────────┐
       │    │   orders    │ │ order_items │
       │    ├─────────────┤ ├─────────────┤
       │    │ id (PK)     │ │ id (PK)     │
       │    │order_number │ │ order_id(FK)│─┐
       │    │customer_id  │─┤ │ product_id  │─┼─┐
       │    │total_amount │ │ │ quantity    │ │ │
       │    │ status      │ │ │ unit_price  │ │ │
       │    │ order_date  │ │ │ subtotal    │ │ │
       │    │ created_by  │─┘ │ created_at  │ │ │
       │    │ created_at  │   └─────────────┘ │ │
       │    │ updated_at  │          ▲        │ │
       │    └─────────────┘          │        │ │
       │                             │        │ │
       │                             └────────┘ │
       │                                        │
       │                                        ▼
       │            ┌─────────────────────────────────┐
       └───────────►│      permission_matrix          │
                    ├─────────────────────────────────┤
                    │ id (PK)                         │
                    │ user_id (FK)                    │
                    │ entity_type                     │
                    │ operation_type                  │
                    │ screen_name                     │
                    │ is_allowed                      │
                    │ created_at                      │
                    │ updated_at                      │
                    └─────────────────────────────────┘
```

### テーブル定義

#### users テーブル
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### customers テーブル
```sql
CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

#### products テーブル
```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    category VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

#### orders テーブル
```sql
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

#### order_items テーブル
```sql
CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

#### permission_matrix テーブル
```sql
CREATE TABLE permission_matrix (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    entity_type VARCHAR(20) NOT NULL, -- 'customers', 'products', 'orders'
    operation_type VARCHAR(10) NOT NULL, -- 'create', 'read', 'update', 'delete'
    screen_name VARCHAR(50) NOT NULL, -- '顧客登録', '顧客検索', etc.
    is_allowed BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, entity_type, operation_type, screen_name)
);
```

### インデックス設計
```sql
CREATE INDEX idx_customers_code ON customers(customer_code);
CREATE INDEX idx_products_code ON products(product_code);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_permission_matrix_user ON permission_matrix(user_id);
CREATE INDEX idx_permission_matrix_entity ON permission_matrix(entity_type, operation_type);
```

---

## API設計

### RESTful API エンドポイント

#### 認証API

| メソッド | エンドポイント | 説明 | 認証要否 |
|---------|---------------|------|----------|
| POST | `/api/auth/login` | ユーザーログイン | 不要 |
| POST | `/api/auth/register` | ユーザー登録 | 不要 |
| GET | `/api/auth/profile` | プロフィール取得 | 必要 |
| GET | `/api/auth/permissions` | 権限一覧取得 | 必要 |

#### 顧客管理API

| メソッド | エンドポイント | 説明 | 権限要件 |
|---------|---------------|------|----------|
| GET | `/api/customers` | 顧客一覧取得 | 顧客検索権限 |
| GET | `/api/customers/:id` | 顧客詳細取得 | 顧客検索権限 |
| POST | `/api/customers` | 顧客新規作成 | 顧客登録権限 |
| PUT | `/api/customers/:id` | 顧客情報更新 | 顧客登録権限 |
| DELETE | `/api/customers/:id` | 顧客削除 | 顧客削除権限 |

### API レスポンス形式

#### 標準レスポンス
```typescript
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
```

#### ページネーションレスポンス
```typescript
interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
```

### 認証・セキュリティ

#### JWT トークン仕様
- **アルゴリズム**: HS256
- **有効期限**: 24時間（デフォルト）
- **ペイロード**: ユーザーID、ユーザー名、メールアドレス、ロール

#### CORS設定
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}))
```

---

## フロントエンド設計

### コンポーネント設計

#### コンポーネント階層
```
App
├── Router
│   ├── Layout
│   │   ├── Header
│   │   ├── Sidebar
│   │   └── Main Content
│   │       ├── DashboardPage
│   │       ├── CustomersPage
│   │       ├── ProductsPage
│   │       ├── OrdersPage
│   │       └── PermissionMatrixPage
│   └── LoginPage
└── AuthProvider
```

#### 共通コンポーネント

##### Layout.tsx
- **役割**: アプリケーション全体のレイアウト構造
- **機能**: ヘッダー、サイドバー、メインコンテンツエリアの配置

##### ProtectedRoute.tsx
- **役割**: 認証が必要なルートの保護
- **機能**: 未認証ユーザーのリダイレクト処理

### 状態管理

#### 認証状態管理
```typescript
interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (credentials: LoginForm) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}
```

#### 権限管理フック
```typescript
const usePermission = () => {
  const hasRole = (role: string): boolean
  const isAdmin = (): boolean
  const canAccess = (requiredRole?: string): boolean
  
  return { hasRole, isAdmin, canAccess }
}
```

### スタイリング設計

#### テーマ設定
```typescript
export const theme = {
  colors: {
    primary: '#0066cc',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    // ...
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  // ...
}
```

#### グローバルスタイル
- **リセットCSS**: 一貫したレンダリング
- **フォント設定**: システムフォントの使用
- **レスポンシブ**: モバイルファーストアプローチ

---

## 画面設計・機能一覧

### 1. ダッシュボード (DashboardPage)

#### 機能概要
- システム全体の統計情報表示
- リアルタイムデータの可視化
- クイックアクション機能
- 最近のアクティビティ表示

#### 表示データ
- **統計カード**:
  - 顧客数: 127件（先月比+12%）
  - 商品数: 89件（先月比+5%）
  - 今月注文: 256件（先月比+18%）
  - 月間売上: ¥15,840,000（先月比+23%）

- **売上推移グラフ**: 過去2週間の日別売上データ
- **クイックアクション**: 新規登録・作成機能へのショートカット
- **アクティビティフィード**: 最新の業務活動履歴

### 2. 顧客管理 (CustomersPage)

#### 機能概要
- 顧客情報の一覧表示・検索
- 顧客データの登録・更新・削除
- 高度なフィルタリング機能

#### 表示項目
- **顧客情報**: 会社名、顧客コード、担当者、所在地
- **取引タイプ**: 荷主、荷受人、フォワーダー、代理店
- **与信状況**: 使用額/限度額、使用率の可視化
- **年間実績**: TEU取扱量、船積件数、最終取引日
- **主要航路**: 優先航路、貨物種別
- **ステータス**: アクティブ、非アクティブ、与信停止

#### 機能詳細
- **検索**: 会社名・顧客コード・担当者での部分一致検索
- **フィルタ**: ステータス別、タイプ別絞り込み
- **統計表示**: 総登録数、アクティブ数、年間取扱量、年間船積件数
- **操作**: 詳細表示、編集、与信停止

### 3. 商品管理 (ProductsPage)

#### 機能概要
- 商品（船舶）情報の管理
- 運航状況の監視
- 船舶仕様・乗組員情報の管理

#### 表示項目
- **船舶情報**: 船名、IMO番号、コールサイン、旗国、建造年
- **船種・所有形態**: コンテナ船、バルク船、タンカー、自動車船
- **現在位置・航海**: 現在地、航海番号
- **次港・ETA**: 次港到着予定
- **仕様**: 総トン数、載貨重量トン数、TEU能力
- **乗組員**: 乗組員数、船長名
- **運航ステータス**: 運航中、メンテナンス、ドック入り、待機中

#### 統計情報
- 保有船舶数: 5隻
- 運航中: 4隻
- 総輸送能力: 36,000 TEU
- 総CO2排出量: 2,345 t/日

### 4. 注文管理 (OrdersPage)

#### 機能概要
- 注文（貨物輸送）情報の管理
- 輸送ステータスの追跡
- 通関・書類管理

#### 表示項目
- **B/L・Booking情報**: B/L番号、Booking番号、コンテナ番号
- **荷主・荷受人**: 発送者、受取人情報
- **貨物情報**: 貨物タイプ（FCL/LCL/在来船/冷凍）、重量、容積、商品名
- **航路・船舶**: 積地・揚地、船名、航海番号
- **スケジュール**: ETD（出港予定）、ETA（到着予定）
- **通関・書類**: 通関ステータス、書類完成状況、運賃情報
- **輸送ステータス**: 予約済み、積載済み、輸送中、荷卸済み、配達完了

#### 特殊処理
- **冷凍貨物**: 温度管理表示
- **危険物**: 特別表示・取扱注意
- **重量物**: 特別ハンドリング表示

### 5. ログイン (LoginPage)

#### 機能概要
- ユーザー認証
- デモアカウント機能

#### デモアカウント
- **管理者**: admin / admin123
- **一般ユーザー**: user / user123

#### セキュリティ機能
- JWT トークン認証
- パスワードハッシュ化（bcrypt）
- セッション管理

### 6. 権限マトリックス (PermissionMatrixPage)

#### 機能概要
- ユーザー権限の可視化
- 画面・操作別権限表示

#### 表示形式
- **マトリックス表**: ユーザー × 画面・操作の権限マトリックス
- **権限表示**: C（作成）、R（参照）、U（更新）、D（削除）
- **色分け**: 権限種別による背景色区別
- **凡例**: 権限記号の説明

---

## CRUDマトリックス

### 画面・機能別CRUD権限

| 画面名 | エンティティ | 管理者 | 一般ユーザー | 説明 |
|--------|-------------|--------|-------------|------|
| **顧客登録** | customers | C | - | 新規顧客の登録機能 |
| **顧客検索** | customers | R | R | 顧客情報の検索・一覧表示 |
| **顧客削除** | customers | R, D | R | 顧客情報の削除機能 |
| **顧客登録フォーム** | customers | R, C | R | 顧客登録画面への読み取り専用アクセス |
| **注文照会** | orders | R | R | 注文情報の検索・閲覧 |
| **注文訂正** | orders | R, U | R | 注文内容の修正機能 |
| **注文取消** | orders | R, D | R | 注文のキャンセル機能 |
| **商品管理** | products | R, U | R | 商品情報の管理 |
| **ダッシュボード** | all | R | R | 統計情報の表示 |

### 権限定義

#### C (Create) - 作成権限
- 新規データの作成
- フォーム入力・送信
- ファイルアップロード

#### R (Read) - 参照権限
- データの表示・検索
- 詳細情報の閲覧
- レポート出力

#### U (Update) - 更新権限
- 既存データの修正
- ステータス変更
- 部分的な更新

#### D (Delete) - 削除権限
- データの削除
- 論理削除・物理削除
- 関連データの整合性チェック

### ロール別権限設計

#### 管理者 (admin)
- **権限範囲**: 全機能に対するフルアクセス
- **制限事項**: なし
- **特別権限**: システム管理機能、ユーザー管理

#### 一般ユーザー (user)
- **権限範囲**: 基本的な参照機能と限定的な更新機能
- **制限事項**: 作成・削除機能は基本的に制限
- **特別権限**: なし

### 実装における権限チェック

#### フロントエンド
```typescript
// 条件付きレンダリング
{canCreate && (
  <Button onClick={handleCreate}>
    新規作成
  </Button>
)}

// 権限チェックフック
const { isAdmin, canAccess } = usePermission()
```

#### バックエンド
```typescript
// ミドルウェアによる権限チェック
router.post('/', requireCustomerCreate, CustomerController.createCustomer)
router.delete('/:id', requireCustomerDelete, CustomerController.deleteCustomer)

// 動的権限チェック
const hasPermission = await PermissionModel.checkPermission(
  userId, 
  'customers', 
  'create', 
  '顧客登録'
)
```

---

## セキュリティ・認証設計

### 認証システム

#### JWT (JSON Web Token) 認証
- **アルゴリズム**: HMAC SHA256 (HS256)
- **有効期限**: 24時間（設定可能）
- **保存場所**: LocalStorage（フロントエンド）
- **送信方法**: Authorization Bearer ヘッダー

#### トークンペイロード
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "role": "admin",
  "iat": 1704067200,
  "exp": 1704153600
}
```

### パスワードセキュリティ

#### ハッシュ化
- **ライブラリ**: bcryptjs
- **ソルトラウンド**: 10
- **保存形式**: $2a$10$[salt][hash]

### 権限管理システム

#### 多層防御アーキテクチャ
1. **フロントエンド**: UI要素の表示制御
2. **API**: エンドポイントレベルでの権限チェック
3. **データベース**: Row Level Security（将来拡張予定）

#### 権限チェックフロー
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Request   │───►│  JWT Check  │───►│ Permission  │
│             │    │             │    │   Check     │
└─────────────┘    └─────────────┘    └─────────────┘
                           │                   │
                           ▼                   ▼
                   ┌─────────────┐    ┌─────────────┐
                   │   401       │    │   403       │
                   │ Unauthorized│    │ Forbidden   │
                   └─────────────┘    └─────────────┘
```

### セキュリティ対策

#### CORS (Cross-Origin Resource Sharing)
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}))
```

#### セキュリティヘッダー
```javascript
app.use(helmet()) // 各種セキュリティヘッダーの設定
```

#### 入力検証
- **フロントエンド**: React フォームバリデーション
- **バックエンド**: Zod スキーマバリデーション

#### SQLインジェクション対策
- **パラメータ化クエリ**: SQLite prepared statements使用
- **入力サニタイゼーション**: 特殊文字のエスケープ処理

### セッション管理

#### トークンリフレッシュ
- 現在: 24時間固定
- 将来拡張: リフレッシュトークンによる自動更新

#### ログアウト処理
- クライアントサイド: LocalStorage からトークン削除
- サーバーサイド: トークンブラックリスト（将来実装予定）

---

## 運用・保守

### 開発環境

#### セットアップ手順
```bash
# 自動セットアップ
./scripts/setup.sh

# 手動セットアップ
npm run install:all
cp env.example .env
cd backend && npm run db:seed && cd ..
```

#### 開発サーバー起動
```bash
# 全サービス同時起動
npm run dev

# 個別起動
npm run dev:frontend  # http://localhost:5173
npm run dev:backend   # http://localhost:3001
```

### Docker環境

#### コンテナ構成
```yaml
services:
  frontend:
    build: ./frontend
    ports: ["5173:5173"]
    
  backend:
    build: ./backend
    ports: ["3001:3001"]
    depends_on: [frontend]
```

#### Docker操作
```bash
# サービス起動
docker-compose up

# バックグラウンド起動
docker-compose up -d

# サービス停止
docker-compose down
```

### データベース管理

#### マイグレーション
```bash
cd backend
npm run db:migrate
```

#### サンプルデータ投入
```bash
cd backend
npm run db:seed
```

#### バックアップ・リストア
```bash
# バックアップ
cp backend/data/app.db backup/app_$(date +%Y%m%d).db

# リストア
cp backup/app_20240101.db backend/data/app.db
```

### 監視・ログ

#### ログレベル
- **INFO**: 通常の操作ログ
- **WARN**: 警告レベルの問題
- **ERROR**: エラー発生時
- **DEBUG**: 開発時の詳細ログ

#### ヘルスチェック
```bash
curl http://localhost:3001/health
# Response: {"status":"OK","timestamp":"2024-01-01T00:00:00.000Z"}
```

### パフォーマンス最適化

#### フロントエンド
- **コード分割**: React.lazy による動的インポート
- **バンドル最適化**: Vite による高速ビルド
- **画像最適化**: WebP形式の使用推奨

#### バックエンド
- **データベースインデックス**: 検索性能向上
- **レスポンスキャッシュ**: 静的データのキャッシュ化
- **接続プーリング**: データベース接続の効率化

### セキュリティ監査

#### 定期チェック項目
- 依存関係の脆弱性チェック（npm audit）
- セキュリティヘッダーの確認
- 権限設定の見直し
- ログファイルの監査

#### 脆弱性対応
```bash
# 依存関係の脆弱性チェック
npm audit
npm audit fix

# セキュリティアップデート
npm update
```

### 将来の拡張計画

#### Phase 2: 機能拡張
- 動的権限管理画面
- レポート機能
- ファイル添付機能
- 通知システム

#### Phase 3: スケーラビリティ
- マイクロサービスアーキテクチャ
- Redis キャッシュ層
- PostgreSQL 移行
- API ゲートウェイ

#### Phase 4: 高度なセキュリティ
- 多要素認証 (MFA)
- シングルサインオン (SSO)
- 監査ログ強化
- 暗号化通信 (HTTPS)

---

## まとめ

このKIS Demoシステムは、モダンなフルスタック開発のベストプラクティスを示すサンプルアプリケーションとして設計されています。

### 主な特徴
1. **シンプルで理解しやすいアーキテクチャ**
2. **包括的な権限管理システム**
3. **型安全なTypeScript実装**
4. **レスポンシブなUI設計**
5. **拡張可能な設計思想**

### 学習ポイント
- React + TypeScript による SPA 開発
- Express + TypeScript による API 開発
- JWT認証とロールベースアクセス制御
- SQLite を使用したデータベース設計
- Docker を使用した開発環境構築

このシステムは、実際のプロダクション環境での使用を想定した設計となっており、学習用途から実用レベルまで幅広く活用可能です。

---

*最終更新日: 2024年1月15日*  
*作成者: KIS Demo チーム*  
*バージョン: 1.0.0*

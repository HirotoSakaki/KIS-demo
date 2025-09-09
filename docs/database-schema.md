# データベーステーブル構造仕様書

## 概要

本ドキュメントは、KIS（Knowledge Information System）デモアプリケーションのデータベーステーブル構造について詳細に記載した仕様書です。

## データベース情報

- **データベース種別**: SQLite 3
- **文字エンコーディング**: UTF-8
- **ファイル場所**: `backend/data/app.db`

---

## 1. ユーザーテーブル (users)

認証・認可システムで使用するユーザー情報を管理するテーブルです。

### テーブル構造

| カラム名 | データ型 | 制約 | デフォルト値 | 説明 |
|---------|---------|------|------------|------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | - | ユーザーID（主キー） |
| username | VARCHAR(50) | UNIQUE, NOT NULL | - | ユーザー名（一意） |
| email | VARCHAR(100) | UNIQUE, NOT NULL | - | メールアドレス（一意） |
| password_hash | VARCHAR(255) | NOT NULL | - | パスワードハッシュ（bcrypt） |
| role | VARCHAR(20) | - | 'user' | ユーザーロール |
| created_at | DATETIME | - | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | DATETIME | - | CURRENT_TIMESTAMP | 更新日時 |

### ロール定義

- `admin`: 管理者（全権限）
- `user`: 一般ユーザー（制限された権限）

### インデックス

- PRIMARY KEY: `id`
- UNIQUE INDEX: `username`
- UNIQUE INDEX: `email`

### 関連テーブル

- **customers**: `created_by` → `users.id`（作成者）
- **products**: `created_by` → `users.id`（作成者）
- **orders**: `created_by` → `users.id`（作成者）
- **permission_matrix**: `user_id` → `users.id`（権限設定対象ユーザー）

---

## 2. 顧客マスタテーブル (customers)

顧客情報を管理するマスターテーブルです。

### テーブル構造

| カラム名 | データ型 | 制約 | デフォルト値 | 説明 |
|---------|---------|------|------------|------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | - | 顧客ID（主キー） |
| customer_code | VARCHAR(20) | UNIQUE, NOT NULL | - | 顧客コード（一意） |
| name | VARCHAR(100) | NOT NULL | - | 顧客名 |
| email | VARCHAR(100) | - | - | メールアドレス |
| phone | VARCHAR(20) | - | - | 電話番号 |
| address | TEXT | - | - | 住所 |
| created_at | DATETIME | - | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | DATETIME | - | CURRENT_TIMESTAMP | 更新日時 |
| created_by | INTEGER | FOREIGN KEY | - | 作成者（usersテーブル参照） |

### インデックス

- PRIMARY KEY: `id`
- UNIQUE INDEX: `customer_code`
- INDEX: `idx_customers_code` ON `customer_code`

### 外部キー制約

- `created_by` → `users(id)`

### 関連テーブル

- **orders**: `customer_id` → `customers.id`（注文の顧客）

### ビジネスルール

- 顧客コードは重複不可
- 関連する注文がある場合、削除不可

---

## 3. 商品マスタテーブル (products)

商品情報を管理するマスターテーブルです。

### テーブル構造

| カラム名 | データ型 | 制約 | デフォルト値 | 説明 |
|---------|---------|------|------------|------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | - | 商品ID（主キー） |
| product_code | VARCHAR(20) | UNIQUE, NOT NULL | - | 商品コード（一意） |
| name | VARCHAR(100) | NOT NULL | - | 商品名 |
| description | TEXT | - | - | 商品説明 |
| price | DECIMAL(10,2) | NOT NULL | - | 単価 |
| stock_quantity | INTEGER | - | 0 | 在庫数 |
| category | VARCHAR(50) | - | - | カテゴリ |
| created_at | DATETIME | - | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | DATETIME | - | CURRENT_TIMESTAMP | 更新日時 |
| created_by | INTEGER | FOREIGN KEY | - | 作成者（usersテーブル参照） |

### インデックス

- PRIMARY KEY: `id`
- UNIQUE INDEX: `product_code`
- INDEX: `idx_products_code` ON `product_code`

### 外部キー制約

- `created_by` → `users(id)`

### 関連テーブル

- **order_items**: `product_id` → `products.id`（注文明細の商品）

### ビジネスルール

- 商品コードは重複不可
- 価格は正数
- 関連する注文明細がある場合、削除不可

---

## 4. 注文テーブル (orders)

注文ヘッダー情報を管理するテーブルです。

### テーブル構造

| カラム名 | データ型 | 制約 | デフォルト値 | 説明 |
|---------|---------|------|------------|------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | - | 注文ID（主キー） |
| order_number | VARCHAR(20) | UNIQUE, NOT NULL | - | 注文番号（一意） |
| customer_id | INTEGER | NOT NULL, FOREIGN KEY | - | 顧客ID（customersテーブル参照） |
| total_amount | DECIMAL(10,2) | NOT NULL | - | 合計金額 |
| status | VARCHAR(20) | - | 'pending' | 注文ステータス |
| order_date | DATETIME | - | CURRENT_TIMESTAMP | 注文日 |
| created_at | DATETIME | - | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | DATETIME | - | CURRENT_TIMESTAMP | 更新日時 |
| created_by | INTEGER | FOREIGN KEY | - | 作成者（usersテーブル参照） |

### ステータス定義

- `pending`: 受注待ち
- `confirmed`: 受注確定
- `shipped`: 出荷済み
- `delivered`: 配送完了
- `cancelled`: キャンセル

### インデックス

- PRIMARY KEY: `id`
- UNIQUE INDEX: `order_number`
- INDEX: `idx_orders_number` ON `order_number`
- INDEX: `idx_orders_customer` ON `customer_id`

### 外部キー制約

- `customer_id` → `customers(id)`
- `created_by` → `users(id)`

### 関連テーブル

- **order_items**: `order_id` → `orders.id`（注文明細）

### ビジネスルール

- 注文番号は自動生成（ORDyyyymmddnnn形式）
- 合計金額は注文明細の小計の合算

---

## 5. 注文明細テーブル (order_items)

注文の明細情報を管理するテーブルです。

### テーブル構造

| カラム名 | データ型 | 制約 | デフォルト値 | 説明 |
|---------|---------|------|------------|------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | - | 明細ID（主キー） |
| order_id | INTEGER | NOT NULL, FOREIGN KEY | - | 注文ID（ordersテーブル参照） |
| product_id | INTEGER | NOT NULL, FOREIGN KEY | - | 商品ID（productsテーブル参照） |
| quantity | INTEGER | NOT NULL | - | 数量 |
| unit_price | DECIMAL(10,2) | NOT NULL | - | 単価 |
| subtotal | DECIMAL(10,2) | NOT NULL | - | 小計（数量×単価） |
| created_at | DATETIME | - | CURRENT_TIMESTAMP | 作成日時 |

### インデックス

- PRIMARY KEY: `id`
- INDEX: `idx_order_items_order` ON `order_id`

### 外部キー制約

- `order_id` → `orders(id)` ON DELETE CASCADE
- `product_id` → `products(id)`

### ビジネスルール

- 小計 = 数量 × 単価
- 注文削除時に明細も同時削除（CASCADE）

---

## 6. 権限マトリックステーブル (permission_matrix)

ユーザーの機能別権限を管理するテーブルです。

### テーブル構造

| カラム名 | データ型 | 制約 | デフォルト値 | 説明 |
|---------|---------|------|------------|------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | - | 権限ID（主キー） |
| user_id | INTEGER | NOT NULL, FOREIGN KEY | - | ユーザーID（usersテーブル参照） |
| entity_type | VARCHAR(20) | NOT NULL | - | エンティティ種別 |
| operation_type | VARCHAR(10) | NOT NULL | - | 操作種別 |
| screen_name | VARCHAR(50) | NOT NULL | - | 画面名 |
| is_allowed | BOOLEAN | - | FALSE | 許可フラグ |
| created_at | DATETIME | - | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | DATETIME | - | CURRENT_TIMESTAMP | 更新日時 |

### エンティティ種別 (entity_type)

- `customers`: 顧客関連
- `products`: 商品関連
- `orders`: 注文関連

### 操作種別 (operation_type)

- `create`: 作成
- `read`: 参照
- `update`: 更新
- `delete`: 削除

### 画面名定義 (screen_name)

| 画面名 | エンティティ | 必要操作 | 説明 |
|--------|------------|---------|------|
| 顧客登録 | customers | create | 顧客新規登録機能 |
| 顧客検索 | customers | read | 顧客検索・一覧表示機能 |
| 顧客削除 | customers | read, delete | 顧客削除機能 |
| 顧客登録フォーム | customers | read, create | 顧客登録フォーム表示・登録機能 |
| 注文照会 | orders | read | 注文検索・詳細表示機能 |
| 注文訂正 | orders | read, update | 注文内容変更機能 |
| 注文取消 | orders | read, delete | 注文キャンセル機能 |

### インデックス

- PRIMARY KEY: `id`
- UNIQUE INDEX: `(user_id, entity_type, operation_type, screen_name)`
- INDEX: `idx_permission_matrix_user` ON `user_id`
- INDEX: `idx_permission_matrix_entity` ON `(entity_type, operation_type)`

### 外部キー制約

- `user_id` → `users(id)`

### ビジネスルール

- 同一ユーザー・エンティティ・操作・画面の組み合わせは一意
- デフォルト権限は拒否（FALSE）
- 管理者は全権限、一般ユーザーは参照権限のみがデフォルト

---

## データベース設計原則

### 1. 命名規則

- **テーブル名**: 複数形の英小文字、アンダースコア区切り
- **カラム名**: 英小文字、アンダースコア区切り
- **インデックス名**: `idx_テーブル名_カラム名`

### 2. 制約

- **主キー**: 全テーブルでAUTOINCREMENTの整数型
- **外部キー**: 参照整合性を保証
- **一意制約**: ビジネスキー（コード類）に設定
- **NOT NULL**: 必須項目に設定

### 3. 監査証跡

- **作成日時**: `created_at`（自動設定）
- **更新日時**: `updated_at`（更新時自動設定）
- **作成者**: `created_by`（usersテーブル参照）

### 4. パフォーマンス

- **インデックス**: 検索・結合で使用するカラムに設定
- **ページング**: 大量データ対応のためLIMIT/OFFSET対応

---

## 関連ドキュメント

- [権限マトリックス仕様書](./permission-matrix.md)
- [KIS Demo設計書](../KIS_Demo_設計書.md)

---

## 更新履歴

| 日付 | バージョン | 更新内容 | 担当者 |
|------|-----------|---------|--------|
| 2024-XX-XX | 1.0 | 初版作成 | システム |


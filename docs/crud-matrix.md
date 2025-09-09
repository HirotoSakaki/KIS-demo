# CRUDマトリックス対応表

## 概要

本ドキュメントは、KIS-Demo統合管理システムにおける各画面でのCRUD操作と、対応するバックエンドAPI、データベーステーブルの関係を示すマトリックス表です。

## 凡例

- **C** = Create（作成）
- **R** = Read（参照）
- **U** = Update（更新）  
- **D** = Delete（削除）
- **✓** = 実装済み
- **-** = 該当なし/非対応

## 画面別CRUDマトリックス

### 1. ダッシュボード画面 (`DashboardPage`)

| エンティティ | C | R | U | D | 備考 |
|-------------|---|---|---|---|------|
| Customer | - | ✓ | - | - | 統計表示のみ |
| Product | - | ✓ | - | - | 統計表示のみ |
| Order | - | ✓ | - | - | 統計表示のみ |
| Revenue | - | ✓ | - | - | 集計データ表示 |

**フロントエンド機能:**
- 各エンティティの統計情報表示
- リアルタイム売上データ表示
- クイックアクションボタン（他画面への遷移）

**バックエンドAPI:**
- 実装予定（統計API）

---

### 2. 顧客管理画面 (`CustomersPage`)

| エンティティ | C | R | U | D | 関連テーブル | バックエンドAPI |
|-------------|---|---|---|---|-------------|-----------------|
| Customer | ✓ | ✓ | ✓ | ✓ | customers | `/api/customers` |

**フロントエンド機能:**
- 顧客一覧表示（検索・フィルタリング）
- 新規顧客登録
- 顧客情報編集
- 顧客削除

**バックエンドAPI:**
- `GET /api/customers` - 顧客一覧取得
- `GET /api/customers/:id` - 顧客詳細取得
- `POST /api/customers` - 顧客作成
- `PUT /api/customers/:id` - 顧客更新
- `DELETE /api/customers/:id` - 顧客削除

**権限制御:**
- 参照: `requireCustomerRead`
- 作成・更新: `requireCustomerCreate`
- 削除: `requireCustomerDelete`

---

### 3. 商品管理画面 (`ProductsPage`)

| エンティティ | C | R | U | D | 関連テーブル | バックエンドAPI |
|-------------|---|---|---|---|-------------|-----------------|
| Product | ✓ | ✓ | ✓ | ✓ | products | 実装予定 |

**フロントエンド機能:**
- 商品一覧表示（カテゴリ・ステータス・タイプ別フィルタ）
- 新規商品登録
- 商品情報編集
- 商品削除
- 在庫数表示

**想定バックエンドAPI:**
- `GET /api/products` - 商品一覧取得
- `GET /api/products/:id` - 商品詳細取得
- `POST /api/products` - 商品作成
- `PUT /api/products/:id` - 商品更新
- `DELETE /api/products/:id` - 商品削除

---

### 4. 注文管理画面 (`OrdersPage`)

| エンティティ | C | R | U | D | 関連テーブル | バックエンドAPI |
|-------------|---|---|---|---|-------------|-----------------|
| Order | ✓ | ✓ | ✓ | ✓ | orders, order_items | 実装予定 |
| OrderItem | ✓ | ✓ | ✓ | ✓ | order_items | 実装予定 |
| Customer | - | ✓ | - | - | customers | 関連データ表示 |

**フロントエンド機能:**
- 注文一覧表示（ステータス・支払状況別フィルタ）
- 新規注文作成
- 注文内容編集
- 注文キャンセル

**想定バックエンドAPI:**
- `GET /api/orders` - 注文一覧取得
- `GET /api/orders/:id` - 注文詳細取得
- `POST /api/orders` - 注文作成
- `PUT /api/orders/:id` - 注文更新
- `DELETE /api/orders/:id` - 注文削除

---

### 5. 在庫管理画面 (`InventoryPage`)

| エンティティ | C | R | U | D | 関連テーブル | バックエンドAPI |
|-------------|---|---|---|---|-------------|-----------------|
| Product | - | ✓ | ✓ | - | products | 在庫調整のみ |
| Inventory | - | ✓ | ✓ | - | products | 在庫レベル管理 |

**フロントエンド機能:**
- 在庫一覧表示（ステータス・カテゴリ・倉庫別フィルタ）
- 在庫調整
- 発注機能
- 在庫移動

**権限制御（フロントエンド）:**
- 在庫調整: `canAdjustStock`
- 発注: `canReorder`
- 移動: `canTransfer`
- 価格表示: `canViewCosts`

**想定バックエンドAPI:**
- `GET /api/inventory` - 在庫一覧取得
- `PUT /api/inventory/:id/adjust` - 在庫調整
- `POST /api/inventory/reorder` - 発注

---

### 6. 請求書管理画面 (`InvoicesPage`)

| エンティティ | C | R | U | D | 関連テーブル | バックエンドAPI |
|-------------|---|---|---|---|-------------|-----------------|
| Invoice | ✓ | ✓ | ✓ | ✓ | invoices | 実装予定 |
| Customer | - | ✓ | - | - | customers | 関連データ表示 |

**フロントエンド機能:**
- 請求書一覧表示（ステータス・期間別フィルタ）
- 新規請求書作成
- 請求書編集
- 請求書送信
- 支払い確認
- PDF出力

**権限制御（フロントエンド）:**
- 作成: `canCreate`
- 編集: `canEdit`
- 削除: `canDelete`
- 送信: `canSend`
- 支払確認: `canMarkPaid`

**想定バックエンドAPI:**
- `GET /api/invoices` - 請求書一覧取得
- `GET /api/invoices/:id` - 請求書詳細取得
- `POST /api/invoices` - 請求書作成
- `PUT /api/invoices/:id` - 請求書更新
- `DELETE /api/invoices/:id` - 請求書削除
- `PUT /api/invoices/:id/send` - 請求書送信
- `PUT /api/invoices/:id/mark-paid` - 支払確認

---

### 7. 取引先管理画面 (`PartnersPage`)

| エンティティ | C | R | U | D | 関連テーブル | バックエンドAPI |
|-------------|---|---|---|---|-------------|-----------------|
| Partner | ✓ | ✓ | ✓ | ✓ | partners | 実装予定 |

**フロントエンド機能:**
- 取引先一覧表示（ステータス・タイプ別フィルタ）
- 新規取引先登録
- 取引先情報編集
- 取引先停止

**権限制御（フロントエンド）:**
- 作成: `canCreate`
- 編集: `canEdit`
- 削除: `canDelete`
- 停止: `canSuspend`

**想定バックエンドAPI:**
- `GET /api/partners` - 取引先一覧取得
- `GET /api/partners/:id` - 取引先詳細取得
- `POST /api/partners` - 取引先作成
- `PUT /api/partners/:id` - 取引先更新
- `DELETE /api/partners/:id` - 取引先削除

---

### 8. 仕入先管理画面 (`SuppliersPage`)

| エンティティ | C | R | U | D | 関連テーブル | バックエンドAPI |
|-------------|---|---|---|---|-------------|-----------------|
| Supplier | ✓ | ✓ | ✓ | ✓ | suppliers | 実装予定 |

**フロントエンド機能:**
- 仕入先一覧表示（ステータス・カテゴリ別フィルタ）
- 新規仕入先登録
- 仕入先情報編集
- ブラックリスト登録

**権限制御（フロントエンド）:**
- 作成: `canCreate`
- 編集: `canEdit`
- 削除: `canDelete`
- ブラックリスト: `canBlacklist`

**想定バックエンドAPI:**
- `GET /api/suppliers` - 仕入先一覧取得
- `GET /api/suppliers/:id` - 仕入先詳細取得
- `POST /api/suppliers` - 仕入先作成
- `PUT /api/suppliers/:id` - 仕入先更新
- `DELETE /api/suppliers/:id` - 仕入先削除

---

### 9. 権限マトリックス画面 (`PermissionMatrixPage`)

| エンティティ | C | R | U | D | 関連テーブル | バックエンドAPI |
|-------------|---|---|---|---|-------------|-----------------|
| User | - | ✓ | - | - | users | 実装済み |
| Permission | - | ✓ | ✓ | - | permissions | 実装済み |

**フロントエンド機能:**
- ユーザー別権限マトリックス表示
- 権限設定の可視化

**バックエンドAPI:**
- `GET /api/auth/permissions` - 権限一覧取得

---

## データベーステーブル構造

### 実装済みテーブル

1. **users** - ユーザー情報
2. **customers** - 顧客情報
3. **products** - 商品情報
4. **orders** - 注文情報
5. **order_items** - 注文明細
6. **permissions** - 権限情報

### 実装予定テーブル

1. **invoices** - 請求書情報
2. **partners** - 取引先情報
3. **suppliers** - 仕入先情報
4. **inventory** - 在庫情報

## 権限システム

### 実装済み権限

- **認証機能**: `AuthController` で実装
- **顧客関連**: `requireCustomerRead`, `requireCustomerCreate`, `requireCustomerDelete`

### 権限チェック方式

1. **バックエンド**: ミドルウェアによる権限チェック
2. **フロントエンド**: ユーザー権限オブジェクトによる表示制御

## API実装状況

### 実装済みAPI

- `/api/auth/*` - 認証関連（完全実装）
- `/api/customers/*` - 顧客管理（完全実装）

### 実装予定API

- `/api/products/*` - 商品管理
- `/api/orders/*` - 注文管理
- `/api/invoices/*` - 請求書管理
- `/api/partners/*` - 取引先管理
- `/api/suppliers/*` - 仕入先管理
- `/api/inventory/*` - 在庫管理

## 注意事項

1. **権限制御**: フロントエンド・バックエンド両方で実装
2. **データ整合性**: 関連データがある場合の削除制御
3. **トランザクション**: 複数テーブルにまたがる操作では適切なトランザクション処理
4. **エラーハンドリング**: 権限エラー、データ不整合エラーの適切な処理

## 更新履歴

- 2024-01-XX: 初版作成
- 顧客管理、認証機能の実装状況を反映
- フロントエンド画面の詳細分析を追加

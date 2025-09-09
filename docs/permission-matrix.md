# CRUDマトリックス権限設計書

## 概要

KIS Demo システムにおける画面・操作別権限設計です。各ユーザーロールに対して、画面ごとのCRUD操作権限を定義します。

## 権限マトリックス

### 画面・機能一覧

| 画面名 | エンティティ | 説明 |
|--------|-------------|------|
| 顧客登録 | customers | 新規顧客の登録機能 |
| 顧客検索 | customers | 顧客情報の検索・一覧表示 |
| 顧客削除 | customers | 顧客情報の削除機能 |
| 顧客登録フォーム | customers | 顧客登録画面への読み取り専用アクセス |
| 注文照会 | orders | 注文情報の検索・閲覧 |
| 注文訂正 | orders | 注文内容の修正機能 |
| 注文取消 | orders | 注文のキャンセル機能 |

### 操作権限定義

- **C (Create)**: 新規作成権限
- **R (Read)**: 参照・検索権限  
- **U (Update)**: 更新・修正権限
- **D (Delete)**: 削除・取消権限

### ユーザーロール別権限マトリックス

| 画面名 | 管理者 | 一般ユーザー | 閲覧者 |
|--------|--------|-------------|--------|
| **顧客登録** | C | - | - |
| **顧客検索** | R | R | R |
| **顧客削除** | R, D | R | R |
| **顧客登録フォーム** | R, C | R | R |
| **注文照会** | R | R | R |
| **注文訂正** | R, U | R | R |
| **注文取消** | R, D | R | - |

### 詳細権限仕様

#### 管理者 (admin)
- 全機能に対するフルアクセス権限
- データの作成・更新・削除が可能
- システム管理機能へのアクセス

#### 一般ユーザー (user)  
- 基本的な参照権限
- 一部の更新機能は制限
- 削除機能は基本的に制限

#### 閲覧者 (viewer)
- 参照権限のみ
- データの変更は一切不可

## 実装仕様

### データベース設計

```sql
-- 権限マトリックステーブル
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

### API仕様

#### 権限チェックエンドポイント

```
POST /api/permissions/check
{
  "entity_type": "customers",
  "operation_type": "create", 
  "screen_name": "顧客登録"
}

Response:
{
  "success": true,
  "data": {
    "allowed": true
  }
}
```

#### 権限マトリックス取得

```
GET /api/permissions/matrix

Response:
{
  "success": true,
  "data": {
    "screens": [...],
    "users": [...],
    "permissions": {...}
  }
}
```

### フロントエンド実装

#### 権限チェックフック

```typescript
const usePermission = () => {
  const checkPermission = (
    entityType: string,
    operationType: string,
    screenName: string
  ): boolean => {
    // 権限チェックロジック
    return hasPermission;
  };
  
  return { checkPermission };
};
```

#### 条件付きレンダリング

```tsx
{canCreate && (
  <Button onClick={handleCreate}>
    新規作成
  </Button>
)}
```

## セキュリティ考慮事項

### 多層防御
1. **フロントエンド**: UI要素の表示制御
2. **API**: エンドポイントレベルでの権限チェック
3. **データベース**: Row Level Security (将来拡張)

### 権限エスカレーション防止
- 管理者権限の最小原則
- 権限変更の監査ログ
- セッション管理の強化

## 運用・管理

### 権限設定の変更手順
1. データベース直接更新（現在）
2. 管理画面での権限設定（将来実装）
3. 変更履歴の記録

### 監査・ログ
- 権限チェック結果のログ出力
- 不正アクセス試行の検知
- 定期的な権限見直し

## 拡張計画

### Phase 2: 動的権限管理
- 管理画面での権限設定機能
- ロールベースアクセス制御の強化
- 組織・部門単位での権限管理

### Phase 3: 高度なセキュリティ
- 時間制限付きアクセス
- IP制限機能
- MFA（多要素認証）連携

---

*最終更新: 2024年9月9日*  
*作成者: KIS Demo チーム*

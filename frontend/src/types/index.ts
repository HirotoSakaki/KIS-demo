// API関連の型定義

export interface User {
  id: number
  username: string
  email: string
  role: string
  created_at: string
  updated_at: string
}

export interface Customer {
  id: number
  customer_code: string
  name: string
  email?: string
  phone?: string
  address?: string
  created_at: string
  updated_at: string
  created_by: number
}

export interface Product {
  id: number
  product_code: string
  name: string
  description?: string
  price: number
  stock_quantity: number
  category?: string
  created_at: string
  updated_at: string
  created_by: number
}

export interface Order {
  id: number
  order_number: string
  customer_id: number
  total_amount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  order_date: string
  created_at: string
  updated_at: string
  created_by: number
  customer?: Partial<Customer>
  items?: OrderItem[]
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  unit_price: number
  subtotal: number
  created_at: string
  product?: Partial<Product>
}

export interface PermissionMatrix {
  id: number
  user_id: number
  entity_type: 'customers' | 'products' | 'orders'
  operation_type: 'create' | 'read' | 'update' | 'delete'
  screen_name: string
  is_allowed: boolean
  created_at: string
  updated_at: string
}

// API レスポンス型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AuthResponse {
  user: User
  token: string
}

// フォーム関連の型
export interface LoginForm {
  username: string
  password: string
}

export interface CustomerForm {
  customer_code: string
  name: string
  email?: string
  phone?: string
  address?: string
}

export interface ProductForm {
  product_code: string
  name: string
  description?: string
  price: number
  stock_quantity?: number
  category?: string
}

// 画面状態の型
export interface TableState {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters: Record<string, any>
}

// 権限マトリックス画面用の型
export interface PermissionMatrixData {
  screens: {
    name: string
    entityType: string
    operations: string[]
  }[]
  users: User[]
  permissions: Record<string, Record<string, boolean>>
}

// 画面定数
export const SCREEN_NAMES = {
  CUSTOMER_REGISTER: '顧客登録',
  CUSTOMER_SEARCH: '顧客検索',
  CUSTOMER_DELETE: '顧客削除',
  CUSTOMER_REGISTER_FORM: '顧客登録フォーム',
  ORDER_INQUIRY: '注文照会',
  ORDER_CORRECTION: '注文訂正',
  ORDER_CANCELLATION: '注文取消',
} as const

export const ORDER_STATUSES = {
  pending: '処理中',
  confirmed: '確認済み',
  shipped: '発送済み',
  delivered: '配達完了',
  cancelled: 'キャンセル',
} as const

export type OrderStatus = keyof typeof ORDER_STATUSES

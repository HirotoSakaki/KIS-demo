// 共通型定義

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
  customer?: Customer
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
  product?: Product
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

// リクエスト・レスポンス型
export interface CreateCustomerRequest {
  customer_code: string
  name: string
  email?: string
  phone?: string
  address?: string
}

export interface UpdateCustomerRequest {
  name?: string
  email?: string
  phone?: string
  address?: string
}

export interface CreateProductRequest {
  product_code: string
  name: string
  description?: string
  price: number
  stock_quantity?: number
  category?: string
}

export interface UpdateProductRequest {
  name?: string
  description?: string
  price?: number
  stock_quantity?: number
  category?: string
}

export interface CreateOrderRequest {
  customer_id: number
  items: {
    product_id: number
    quantity: number
    unit_price: number
  }[]
}

export interface UpdateOrderRequest {
  customer_id?: number
  status?: Order['status']
  items?: {
    product_id: number
    quantity: number
    unit_price: number
  }[]
}

export interface AuthRequest {
  username: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface PermissionCheckRequest {
  entity_type: PermissionMatrix['entity_type']
  operation_type: PermissionMatrix['operation_type']
  screen_name: string
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

// 権限定数
export const ENTITY_TYPES = {
  CUSTOMERS: 'customers',
  PRODUCTS: 'products',
  ORDERS: 'orders',
} as const

export const OPERATION_TYPES = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const

export const SCREEN_NAMES = {
  CUSTOMER_REGISTER: '顧客登録',
  CUSTOMER_SEARCH: '顧客検索',
  CUSTOMER_DELETE: '顧客削除',
  CUSTOMER_REGISTER_FORM: '顧客登録フォーム',
  ORDER_INQUIRY: '注文照会',
  ORDER_CORRECTION: '注文訂正',
  ORDER_CANCELLATION: '注文取消',
} as const

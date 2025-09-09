import axios, { AxiosResponse } from 'axios'
import { ApiResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

// Axiosインスタンス作成
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// リクエストインターセプター（認証トークンを自動付与）
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// レスポンスインターセプター（エラーハンドリング）
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // 認証エラーの場合、トークンを削除してログイン画面へ
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API関数群
export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  
  register: (username: string, email: string, password: string, role?: string) =>
    api.post('/auth/register', { username, email, password, role }),
  
  getProfile: () =>
    api.get('/auth/profile'),
  
  getPermissions: () =>
    api.get('/auth/permissions'),
}

export const customerApi = {
  getCustomers: (params?: any) =>
    api.get('/customers', { params }),
  
  getCustomer: (id: number) =>
    api.get(`/customers/${id}`),
  
  createCustomer: (data: any) =>
    api.post('/customers', data),
  
  updateCustomer: (id: number, data: any) =>
    api.put(`/customers/${id}`, data),
  
  deleteCustomer: (id: number) =>
    api.delete(`/customers/${id}`),
}

export const productApi = {
  getProducts: (params?: any) =>
    api.get('/products', { params }),
  
  getProduct: (id: number) =>
    api.get(`/products/${id}`),
  
  createProduct: (data: any) =>
    api.post('/products', data),
  
  updateProduct: (id: number, data: any) =>
    api.put(`/products/${id}`, data),
  
  deleteProduct: (id: number) =>
    api.delete(`/products/${id}`),
}

export const orderApi = {
  getOrders: (params?: any) =>
    api.get('/orders', { params }),
  
  getOrder: (id: number) =>
    api.get(`/orders/${id}`),
  
  createOrder: (data: any) =>
    api.post('/orders', data),
  
  updateOrder: (id: number, data: any) =>
    api.put(`/orders/${id}`, data),
  
  deleteOrder: (id: number) =>
    api.delete(`/orders/${id}`),
  
  updateOrderStatus: (id: number, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),
}

export const permissionApi = {
  getPermissionMatrix: () =>
    api.get('/permissions/matrix'),
  
  updateUserPermissions: (userId: number, permissions: any[]) =>
    api.put(`/permissions/users/${userId}`, { permissions }),
}

export default api

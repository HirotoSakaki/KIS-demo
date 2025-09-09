import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, AuthResponse, LoginForm } from '../types'
import { authApi } from '../utils/api'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (credentials: LoginForm) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 初期化時にトークンをチェック
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken')
      const savedUser = localStorage.getItem('user')
      
      if (token && savedUser) {
        try {
          // 保存されたユーザー情報を使用
          setUser(JSON.parse(savedUser))
          
          // サーバーから最新のプロフィールを取得
          const response = await authApi.getProfile()
          if (response.data.success) {
            setUser(response.data.data)
            localStorage.setItem('user', JSON.stringify(response.data.data))
          }
        } catch (error) {
          console.error('Auth initialization error:', error)
          // エラーの場合は認証情報をクリア
          localStorage.removeItem('authToken')
          localStorage.removeItem('user')
          setUser(null)
        }
      }
      
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginForm) => {
    try {
      const response = await authApi.login(credentials.username, credentials.password)
      
      if (response.data.success) {
        const authData: AuthResponse = response.data.data
        
        // トークンとユーザー情報を保存
        localStorage.setItem('authToken', authData.token)
        localStorage.setItem('user', JSON.stringify(authData.user))
        
        setUser(authData.user)
      } else {
        throw new Error(response.data.error || 'ログインに失敗しました')
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'ログインエラーが発生しました'
      throw new Error(errorMessage)
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setUser(null)
  }

  const isAuthenticated = !!user

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// 権限チェック用のカスタムフック
export const usePermission = () => {
  const { user } = useAuth()
  
  const hasRole = (role: string): boolean => {
    return user?.role === role
  }
  
  const isAdmin = (): boolean => {
    return hasRole('admin')
  }
  
  const canAccess = (requiredRole?: string): boolean => {
    if (!requiredRole) return true
    if (!user) return false
    if (isAdmin()) return true // 管理者は全てアクセス可能
    return hasRole(requiredRole)
  }

  return {
    hasRole,
    isAdmin,
    canAccess,
  }
}

import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../types/index.js'

// JWT設定
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'

export interface AuthenticatedRequest extends Request {
  user?: User
}

export const generateToken = (user: User): string => {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

export const verifyToken = (token: string): User | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
      created_at: '',
      updated_at: ''
    }
  } catch (error) {
    return null
  }
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    res.status(401).json({ success: false, error: 'アクセストークンが必要です' })
    return
  }

  const user = verifyToken(token)
  if (!user) {
    res.status(403).json({ success: false, error: '無効なトークンです' })
    return
  }

  req.user = user
  next()
}

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: '認証が必要です' })
      return
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ success: false, error: '権限が不足しています' })
      return
    }

    next()
  }
}

export const requireAdmin = requireRole(['admin'])

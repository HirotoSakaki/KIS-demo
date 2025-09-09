import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from './auth.js'
import { PermissionModel } from '../models/PermissionModel.js'

export const requirePermission = (
  entityType: string,
  operationType: string,
  screenName: string
) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ success: false, error: '認証が必要です' })
      return
    }

    // 管理者は全権限あり
    if (req.user.role === 'admin') {
      next()
      return
    }

    try {
      const hasPermission = await PermissionModel.checkPermission(
        req.user.id,
        entityType,
        operationType,
        screenName
      )

      if (!hasPermission) {
        res.status(403).json({ 
          success: false, 
          error: `${screenName}の${operationType}権限がありません` 
        })
        return
      }

      next()
    } catch (error) {
      console.error('Permission check error:', error)
      res.status(500).json({ success: false, error: '権限チェックエラー' })
    }
  }
}

// 画面別権限チェック関数
export const requireCustomerRead = requirePermission('customers', 'read', '顧客検索')
export const requireCustomerCreate = requirePermission('customers', 'create', '顧客登録')
export const requireCustomerDelete = requirePermission('customers', 'delete', '顧客削除')

export const requireOrderRead = requirePermission('orders', 'read', '注文照会')
export const requireOrderUpdate = requirePermission('orders', 'update', '注文訂正')
export const requireOrderDelete = requirePermission('orders', 'delete', '注文取消')

export const requireProductRead = requirePermission('products', 'read', '商品検索')
export const requireProductCreate = requirePermission('products', 'create', '商品登録')
export const requireProductUpdate = requirePermission('products', 'update', '商品更新')
export const requireProductDelete = requirePermission('products', 'delete', '商品削除')

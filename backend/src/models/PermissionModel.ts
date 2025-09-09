import { BaseModel } from './BaseModel.js'
import { PermissionMatrix, User } from '../types/index.js'

export class PermissionModel extends BaseModel {
  static async findByUserId(userId: number): Promise<PermissionMatrix[]> {
    const sql = 'SELECT * FROM permission_matrix WHERE user_id = ? ORDER BY entity_type, screen_name'
    return await this.executeQuery<PermissionMatrix>(sql, [userId])
  }

  static async checkPermission(
    userId: number,
    entityType: string,
    operationType: string,
    screenName: string
  ): Promise<boolean> {
    const sql = `
      SELECT is_allowed 
      FROM permission_matrix 
      WHERE user_id = ? AND entity_type = ? AND operation_type = ? AND screen_name = ?
    `
    const result = await this.executeQuerySingle<{ is_allowed: boolean }>(
      sql, 
      [userId, entityType, operationType, screenName]
    )
    
    return result?.is_allowed || false
  }

  static async setPermission(
    userId: number,
    entityType: string,
    operationType: string,
    screenName: string,
    isAllowed: boolean
  ): Promise<boolean> {
    const sql = `
      INSERT OR REPLACE INTO permission_matrix 
      (user_id, entity_type, operation_type, screen_name, is_allowed, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `
    const changes = await this.executeUpdate(sql, [
      userId,
      entityType,
      operationType,
      screenName,
      isAllowed
    ])
    
    return changes > 0
  }

  static async setUserPermissions(
    userId: number,
    permissions: {
      entityType: string
      operationType: string
      screenName: string
      isAllowed: boolean
    }[]
  ): Promise<boolean> {
    const db = await this.getDb()

    try {
      await db.exec('BEGIN TRANSACTION')

      // 既存権限を削除
      await this.executeUpdate('DELETE FROM permission_matrix WHERE user_id = ?', [userId])

      // 新しい権限を追加
      for (const permission of permissions) {
        await this.setPermission(
          userId,
          permission.entityType,
          permission.operationType,
          permission.screenName,
          permission.isAllowed
        )
      }

      await db.exec('COMMIT')
      return true

    } catch (error) {
      await db.exec('ROLLBACK')
      throw error
    }
  }

  static async getPermissionMatrix(): Promise<{
    screens: { name: string; entityType: string; operations: string[] }[]
    users: User[]
    permissions: Record<string, Record<string, boolean>>
  }> {
    // 画面定義
    const screens = [
      {
        name: '顧客登録',
        entityType: 'customers',
        operations: ['create']
      },
      {
        name: '顧客検索',
        entityType: 'customers',
        operations: ['read']
      },
      {
        name: '顧客削除',
        entityType: 'customers',
        operations: ['read', 'delete']
      },
      {
        name: '顧客登録フォーム',
        entityType: 'customers',
        operations: ['read', 'create']
      },
      {
        name: '注文照会',
        entityType: 'orders',
        operations: ['read']
      },
      {
        name: '注文訂正',
        entityType: 'orders',
        operations: ['read', 'update']
      },
      {
        name: '注文取消',
        entityType: 'orders',
        operations: ['read', 'delete']
      }
    ]

    // ユーザー取得
    const usersSql = 'SELECT id, username, email, role FROM users ORDER BY username'
    const users = await this.executeQuery<User>(usersSql)

    // 権限取得
    const permissionsSql = 'SELECT * FROM permission_matrix'
    const allPermissions = await this.executeQuery<PermissionMatrix>(permissionsSql)

    // 権限マトリックス構築
    const permissions: Record<string, Record<string, boolean>> = {}
    
    for (const user of users) {
      permissions[user.id.toString()] = {}
      
      for (const screen of screens) {
        for (const operation of screen.operations) {
          const key = `${screen.name}_${operation}`
          const permission = allPermissions.find(p => 
            p.user_id === user.id && 
            p.entity_type === screen.entityType && 
            p.operation_type === operation && 
            p.screen_name === screen.name
          )
          permissions[user.id.toString()][key] = permission?.is_allowed || false
        }
      }
    }

    return { screens, users, permissions }
  }

  static async initializeDefaultPermissions(userId: number, role: string = 'user'): Promise<void> {
    const defaultPermissions = this.getDefaultPermissionsByRole(role)
    
    for (const permission of defaultPermissions) {
      await this.setPermission(
        userId,
        permission.entityType,
        permission.operationType,
        permission.screenName,
        permission.isAllowed
      )
    }
  }

  private static getDefaultPermissionsByRole(role: string) {
    const adminPermissions = [
      // 顧客関連
      { entityType: 'customers', operationType: 'create', screenName: '顧客登録', isAllowed: true },
      { entityType: 'customers', operationType: 'read', screenName: '顧客検索', isAllowed: true },
      { entityType: 'customers', operationType: 'read', screenName: '顧客削除', isAllowed: true },
      { entityType: 'customers', operationType: 'delete', screenName: '顧客削除', isAllowed: true },
      { entityType: 'customers', operationType: 'read', screenName: '顧客登録フォーム', isAllowed: true },
      { entityType: 'customers', operationType: 'create', screenName: '顧客登録フォーム', isAllowed: true },
      
      // 注文関連
      { entityType: 'orders', operationType: 'read', screenName: '注文照会', isAllowed: true },
      { entityType: 'orders', operationType: 'read', screenName: '注文訂正', isAllowed: true },
      { entityType: 'orders', operationType: 'update', screenName: '注文訂正', isAllowed: true },
      { entityType: 'orders', operationType: 'read', screenName: '注文取消', isAllowed: true },
      { entityType: 'orders', operationType: 'delete', screenName: '注文取消', isAllowed: true },
    ]

    const userPermissions = [
      // 一般ユーザーは参照のみ
      { entityType: 'customers', operationType: 'read', screenName: '顧客検索', isAllowed: true },
      { entityType: 'customers', operationType: 'read', screenName: '顧客登録フォーム', isAllowed: true },
      { entityType: 'orders', operationType: 'read', screenName: '注文照会', isAllowed: true },
      { entityType: 'orders', operationType: 'read', screenName: '注文訂正', isAllowed: true },
      { entityType: 'orders', operationType: 'read', screenName: '注文取消', isAllowed: true },
    ]

    return role === 'admin' ? adminPermissions : userPermissions
  }
}

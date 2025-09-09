import { BaseModel } from './BaseModel.js'
import { User, AuthRequest } from '../types/index.js'
import bcrypt from 'bcryptjs'

export class UserModel extends BaseModel {
  static async findAll(): Promise<User[]> {
    const sql = 'SELECT id, username, email, role, created_at, updated_at FROM users ORDER BY created_at DESC'
    return await this.executeQuery<User>(sql)
  }

  static async findById(id: number): Promise<User | undefined> {
    const sql = 'SELECT id, username, email, role, created_at, updated_at FROM users WHERE id = ?'
    return await this.executeQuerySingle<User>(sql, [id])
  }

  static async findByUsername(username: string): Promise<User | undefined> {
    const sql = 'SELECT id, username, email, role, created_at, updated_at FROM users WHERE username = ?'
    return await this.executeQuerySingle<User>(sql, [username])
  }

  static async findByEmail(email: string): Promise<User | undefined> {
    const sql = 'SELECT id, username, email, role, created_at, updated_at FROM users WHERE email = ?'
    return await this.executeQuerySingle<User>(sql, [email])
  }

  static async create(
    username: string, 
    email: string, 
    password: string, 
    role: string = 'user'
  ): Promise<number> {
    const passwordHash = await bcrypt.hash(password, 10)
    
    const sql = `
      INSERT INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `
    return await this.executeInsert(sql, [username, email, passwordHash, role])
  }

  static async authenticate(username: string, password: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE username = ?'
    const user = await this.executeQuerySingle<any>(sql, [username])
    
    if (!user) {
      return null
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash)
    if (!isPasswordValid) {
      return null
    }

    // パスワードハッシュを除いて返す
    const { password_hash, ...userWithoutPassword } = user
    return userWithoutPassword as User
  }

  static async updatePassword(id: number, newPassword: string): Promise<boolean> {
    const passwordHash = await bcrypt.hash(newPassword, 10)
    const sql = 'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    const changes = await this.executeUpdate(sql, [passwordHash, id])
    
    return changes > 0
  }

  static async updateRole(id: number, role: string): Promise<boolean> {
    const sql = 'UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    const changes = await this.executeUpdate(sql, [role, id])
    
    return changes > 0
  }

  static async delete(id: number): Promise<boolean> {
    // 管理者ユーザーの削除チェック
    const user = await this.findById(id)
    if (user?.role === 'admin') {
      // 他に管理者がいるかチェック
      const adminCountSql = 'SELECT COUNT(*) as count FROM users WHERE role = ? AND id != ?'
      const adminCount = await this.executeQuerySingle<{ count: number }>(adminCountSql, ['admin', id])
      
      if (!adminCount || adminCount.count === 0) {
        throw new Error('最後の管理者ユーザーは削除できません')
      }
    }

    const sql = 'DELETE FROM users WHERE id = ?'
    const changes = await this.executeUpdate(sql, [id])
    
    return changes > 0
  }

  static async isUsernameExists(username: string, excludeId?: number): Promise<boolean> {
    let sql = 'SELECT COUNT(*) as count FROM users WHERE username = ?'
    const params = [username]

    if (excludeId) {
      sql += ' AND id != ?'
      params.push(excludeId)
    }

    const result = await this.executeQuerySingle<{ count: number }>(sql, params)
    return (result?.count || 0) > 0
  }

  static async isEmailExists(email: string, excludeId?: number): Promise<boolean> {
    let sql = 'SELECT COUNT(*) as count FROM users WHERE email = ?'
    const params = [email]

    if (excludeId) {
      sql += ' AND id != ?'
      params.push(excludeId)
    }

    const result = await this.executeQuerySingle<{ count: number }>(sql, params)
    return (result?.count || 0) > 0
  }
}

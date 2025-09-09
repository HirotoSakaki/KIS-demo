import { BaseModel } from './BaseModel.js'
import { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '../types/index.js'

export class CustomerModel extends BaseModel {
  static async findAll(filters: {
    name?: string
    email?: string
    customer_code?: string
    page?: number
    limit?: number
  } = {}): Promise<{ customers: Customer[]; total: number }> {
    const { name, email, customer_code, page, limit, ...otherFilters } = filters
    
    // 名前での部分検索対応
    const searchFilters = {
      ...otherFilters,
      ...(name && { name: `%${name}%` }),
      ...(email && { email: `%${email}%` }),
      ...(customer_code && { customer_code }),
    }

    const { whereClause, params } = this.buildWhereClause(searchFilters)
    const { paginationClause } = this.buildPaginationClause(page, limit)

    // データ取得
    const sql = `
      SELECT * FROM customers 
      ${whereClause} 
      ORDER BY created_at DESC 
      ${paginationClause}
    `
    const customers = await this.executeQuery<Customer>(sql, params)

    // 総件数取得
    const countSql = `SELECT COUNT(*) as total FROM customers ${whereClause}`
    const countResult = await this.executeQuerySingle<{ total: number }>(countSql, params)
    const total = countResult?.total || 0

    return { customers, total }
  }

  static async findById(id: number): Promise<Customer | undefined> {
    const sql = 'SELECT * FROM customers WHERE id = ?'
    return await this.executeQuerySingle<Customer>(sql, [id])
  }

  static async findByCode(customer_code: string): Promise<Customer | undefined> {
    const sql = 'SELECT * FROM customers WHERE customer_code = ?'
    return await this.executeQuerySingle<Customer>(sql, [customer_code])
  }

  static async create(data: CreateCustomerRequest, created_by: number): Promise<number> {
    const sql = `
      INSERT INTO customers (customer_code, name, email, phone, address, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    const params = [
      data.customer_code,
      data.name,
      data.email || null,
      data.phone || null,
      data.address || null,
      created_by
    ]
    
    return await this.executeInsert(sql, params)
  }

  static async update(id: number, data: UpdateCustomerRequest): Promise<boolean> {
    const updates: string[] = []
    const params: any[] = []

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`)
        params.push(value)
      }
    })

    if (updates.length === 0) {
      return false
    }

    updates.push('updated_at = CURRENT_TIMESTAMP')
    params.push(id)

    const sql = `UPDATE customers SET ${updates.join(', ')} WHERE id = ?`
    const changes = await this.executeUpdate(sql, params)
    
    return changes > 0
  }

  static async delete(id: number): Promise<boolean> {
    // 関連する注文がある場合は削除不可
    const orderCheckSql = 'SELECT COUNT(*) as count FROM orders WHERE customer_id = ?'
    const orderCount = await this.executeQuerySingle<{ count: number }>(orderCheckSql, [id])
    
    if (orderCount && orderCount.count > 0) {
      throw new Error('この顧客には関連する注文があるため削除できません')
    }

    const sql = 'DELETE FROM customers WHERE id = ?'
    const changes = await this.executeUpdate(sql, [id])
    
    return changes > 0
  }

  static async isCodeExists(customer_code: string, excludeId?: number): Promise<boolean> {
    let sql = 'SELECT COUNT(*) as count FROM customers WHERE customer_code = ?'
    const params = [customer_code]

    if (excludeId) {
      sql += ' AND id != ?'
      params.push(excludeId)
    }

    const result = await this.executeQuerySingle<{ count: number }>(sql, params)
    return (result?.count || 0) > 0
  }
}

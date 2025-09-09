import { BaseModel } from './BaseModel.js'
import { Product, CreateProductRequest, UpdateProductRequest } from '../types/index.js'

export class ProductModel extends BaseModel {
  static async findAll(filters: {
    name?: string
    category?: string
    product_code?: string
    page?: number
    limit?: number
  } = {}): Promise<{ products: Product[]; total: number }> {
    const { name, category, product_code, page, limit, ...otherFilters } = filters
    
    // 名前での部分検索対応
    const searchFilters = {
      ...otherFilters,
      ...(name && { name: `%${name}%` }),
      ...(category && { category }),
      ...(product_code && { product_code }),
    }

    const { whereClause, params } = this.buildWhereClause(searchFilters)
    const { paginationClause } = this.buildPaginationClause(page, limit)

    // データ取得
    const sql = `
      SELECT * FROM products 
      ${whereClause} 
      ORDER BY created_at DESC 
      ${paginationClause}
    `
    const products = await this.executeQuery<Product>(sql, params)

    // 総件数取得
    const countSql = `SELECT COUNT(*) as total FROM products ${whereClause}`
    const countResult = await this.executeQuerySingle<{ total: number }>(countSql, params)
    const total = countResult?.total || 0

    return { products, total }
  }

  static async findById(id: number): Promise<Product | undefined> {
    const sql = 'SELECT * FROM products WHERE id = ?'
    return await this.executeQuerySingle<Product>(sql, [id])
  }

  static async findByCode(product_code: string): Promise<Product | undefined> {
    const sql = 'SELECT * FROM products WHERE product_code = ?'
    return await this.executeQuerySingle<Product>(sql, [product_code])
  }

  static async create(data: CreateProductRequest, created_by: number): Promise<number> {
    const sql = `
      INSERT INTO products (product_code, name, description, price, stock_quantity, category, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    const params = [
      data.product_code,
      data.name,
      data.description || null,
      data.price,
      data.stock_quantity || 0,
      data.category || null,
      created_by
    ]
    
    return await this.executeInsert(sql, params)
  }

  static async update(id: number, data: UpdateProductRequest): Promise<boolean> {
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

    const sql = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`
    const changes = await this.executeUpdate(sql, params)
    
    return changes > 0
  }

  static async delete(id: number): Promise<boolean> {
    // 関連する注文アイテムがある場合は削除不可
    const orderItemCheckSql = 'SELECT COUNT(*) as count FROM order_items WHERE product_id = ?'
    const orderItemCount = await this.executeQuerySingle<{ count: number }>(orderItemCheckSql, [id])
    
    if (orderItemCount && orderItemCount.count > 0) {
      throw new Error('この商品には関連する注文があるため削除できません')
    }

    const sql = 'DELETE FROM products WHERE id = ?'
    const changes = await this.executeUpdate(sql, [id])
    
    return changes > 0
  }

  static async isCodeExists(product_code: string, excludeId?: number): Promise<boolean> {
    let sql = 'SELECT COUNT(*) as count FROM products WHERE product_code = ?'
    const params = [product_code]

    if (excludeId) {
      sql += ' AND id != ?'
      params.push(excludeId)
    }

    const result = await this.executeQuerySingle<{ count: number }>(sql, params)
    return (result?.count || 0) > 0
  }

  static async updateStock(id: number, quantity: number): Promise<boolean> {
    const sql = 'UPDATE products SET stock_quantity = stock_quantity + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    const changes = await this.executeUpdate(sql, [quantity, id])
    
    return changes > 0
  }

  static async getCategories(): Promise<string[]> {
    const sql = 'SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category'
    const results = await this.executeQuery<{ category: string }>(sql)
    
    return results.map(r => r.category)
  }
}

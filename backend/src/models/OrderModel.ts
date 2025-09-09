import { BaseModel } from './BaseModel.js'
import { Order, OrderItem, CreateOrderRequest, UpdateOrderRequest } from '../types/index.js'

export class OrderModel extends BaseModel {
  static async findAll(filters: {
    customer_id?: number
    status?: string
    order_number?: string
    page?: number
    limit?: number
  } = {}): Promise<{ orders: Order[]; total: number }> {
    const { page, limit, ...searchFilters } = filters

    const { whereClause, params } = this.buildWhereClause(searchFilters)
    const { paginationClause } = this.buildPaginationClause(page, limit)

    // データ取得（顧客情報も含む）
    const sql = `
      SELECT 
        o.*,
        c.name as customer_name,
        c.customer_code
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      ${whereClause} 
      ORDER BY o.created_at DESC 
      ${paginationClause}
    `
    const ordersData = await this.executeQuery<any>(sql, params)

    // 注文アイテムを取得
    const orders: Order[] = []
    for (const orderData of ordersData) {
      const items = await this.getOrderItems(orderData.id)
      orders.push({
        id: orderData.id,
        order_number: orderData.order_number,
        customer_id: orderData.customer_id,
        total_amount: orderData.total_amount,
        status: orderData.status,
        order_date: orderData.order_date,
        created_at: orderData.created_at,
        updated_at: orderData.updated_at,
        created_by: orderData.created_by,
        customer: orderData.customer_name ? {
          id: orderData.customer_id,
          name: orderData.customer_name,
          customer_code: orderData.customer_code,
        } : undefined,
        items
      })
    }

    // 総件数取得
    const countSql = `SELECT COUNT(*) as total FROM orders o ${whereClause}`
    const countResult = await this.executeQuerySingle<{ total: number }>(countSql, params)
    const total = countResult?.total || 0

    return { orders, total }
  }

  static async findById(id: number): Promise<Order | undefined> {
    const sql = `
      SELECT 
        o.*,
        c.name as customer_name,
        c.customer_code,
        c.email as customer_email,
        c.phone as customer_phone,
        c.address as customer_address
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.id = ?
    `
    const orderData = await this.executeQuerySingle<any>(sql, [id])
    
    if (!orderData) {
      return undefined
    }

    const items = await this.getOrderItems(id)

    return {
      id: orderData.id,
      order_number: orderData.order_number,
      customer_id: orderData.customer_id,
      total_amount: orderData.total_amount,
      status: orderData.status,
      order_date: orderData.order_date,
      created_at: orderData.created_at,
      updated_at: orderData.updated_at,
      created_by: orderData.created_by,
      customer: {
        id: orderData.customer_id,
        name: orderData.customer_name,
        customer_code: orderData.customer_code,
        email: orderData.customer_email,
        phone: orderData.customer_phone,
        address: orderData.customer_address,
      },
      items
    }
  }

  static async findByOrderNumber(order_number: string): Promise<Order | undefined> {
    const sql = 'SELECT * FROM orders WHERE order_number = ?'
    const orderData = await this.executeQuerySingle<any>(sql, [order_number])
    
    if (!orderData) {
      return undefined
    }

    const items = await this.getOrderItems(orderData.id)
    return { ...orderData, items }
  }

  private static async getOrderItems(orderId: number): Promise<OrderItem[]> {
    const sql = `
      SELECT 
        oi.*,
        p.name as product_name,
        p.product_code,
        p.category
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
      ORDER BY oi.id
    `
    const itemsData = await this.executeQuery<any>(sql, [orderId])
    
    return itemsData.map(item => ({
      id: item.id,
      order_id: item.order_id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.subtotal,
      created_at: item.created_at,
      product: item.product_name ? {
        id: item.product_id,
        name: item.product_name,
        product_code: item.product_code,
        category: item.category,
      } : undefined
    }))
  }

  static async create(data: CreateOrderRequest, created_by: number): Promise<number> {
    const db = await this.getDb()

    try {
      // トランザクション開始
      await db.exec('BEGIN TRANSACTION')

      // 注文番号生成
      const orderNumber = await this.generateOrderNumber()

      // 合計金額計算
      const totalAmount = data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)

      // 注文作成
      const orderSql = `
        INSERT INTO orders (order_number, customer_id, total_amount, created_by)
        VALUES (?, ?, ?, ?)
      `
      const orderId = await this.executeInsert(orderSql, [
        orderNumber,
        data.customer_id,
        totalAmount,
        created_by
      ])

      // 注文アイテム作成
      for (const item of data.items) {
        const subtotal = item.quantity * item.unit_price
        const itemSql = `
          INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
          VALUES (?, ?, ?, ?, ?)
        `
        await this.executeInsert(itemSql, [
          orderId,
          item.product_id,
          item.quantity,
          item.unit_price,
          subtotal
        ])
      }

      await db.exec('COMMIT')
      return orderId

    } catch (error) {
      await db.exec('ROLLBACK')
      throw error
    }
  }

  static async update(id: number, data: UpdateOrderRequest): Promise<boolean> {
    const db = await this.getDb()

    try {
      await db.exec('BEGIN TRANSACTION')

      // 注文基本情報更新
      if (data.customer_id || data.status) {
        const updates: string[] = []
        const params: any[] = []

        if (data.customer_id) {
          updates.push('customer_id = ?')
          params.push(data.customer_id)
        }

        if (data.status) {
          updates.push('status = ?')
          params.push(data.status)
        }

        updates.push('updated_at = CURRENT_TIMESTAMP')
        params.push(id)

        const orderSql = `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`
        await this.executeUpdate(orderSql, params)
      }

      // 注文アイテム更新
      if (data.items) {
        // 既存アイテム削除
        await this.executeUpdate('DELETE FROM order_items WHERE order_id = ?', [id])

        // 新しいアイテム追加
        let totalAmount = 0
        for (const item of data.items) {
          const subtotal = item.quantity * item.unit_price
          totalAmount += subtotal

          const itemSql = `
            INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
            VALUES (?, ?, ?, ?, ?)
          `
          await this.executeInsert(itemSql, [
            id,
            item.product_id,
            item.quantity,
            item.unit_price,
            subtotal
          ])
        }

        // 合計金額更新
        await this.executeUpdate(
          'UPDATE orders SET total_amount = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [totalAmount, id]
        )
      }

      await db.exec('COMMIT')
      return true

    } catch (error) {
      await db.exec('ROLLBACK')
      throw error
    }
  }

  static async delete(id: number): Promise<boolean> {
    const db = await this.getDb()

    try {
      await db.exec('BEGIN TRANSACTION')

      // 注文アイテム削除（外部キー制約でカスケード削除されるが明示的に削除）
      await this.executeUpdate('DELETE FROM order_items WHERE order_id = ?', [id])

      // 注文削除
      const changes = await this.executeUpdate('DELETE FROM orders WHERE id = ?', [id])

      await db.exec('COMMIT')
      return changes > 0

    } catch (error) {
      await db.exec('ROLLBACK')
      throw error
    }
  }

  static async updateStatus(id: number, status: Order['status']): Promise<boolean> {
    const sql = 'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    const changes = await this.executeUpdate(sql, [status, id])
    
    return changes > 0
  }

  private static async generateOrderNumber(): Promise<string> {
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
    
    // 同日の注文数を取得
    const countSql = `
      SELECT COUNT(*) as count 
      FROM orders 
      WHERE DATE(created_at) = DATE('now')
    `
    const result = await this.executeQuerySingle<{ count: number }>(countSql)
    const dailyCount = (result?.count || 0) + 1
    
    return `ORD${dateStr}${dailyCount.toString().padStart(3, '0')}`
  }

  static async isOrderNumberExists(order_number: string, excludeId?: number): Promise<boolean> {
    let sql = 'SELECT COUNT(*) as count FROM orders WHERE order_number = ?'
    const params = [order_number]

    if (excludeId) {
      sql += ' AND id != ?'
      params.push(excludeId)
    }

    const result = await this.executeQuerySingle<{ count: number }>(sql, params)
    return (result?.count || 0) > 0
  }
}

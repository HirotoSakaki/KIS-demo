import { Database } from 'sqlite'
import DatabaseConnection from '../database/connection.js'

export abstract class BaseModel {
  protected static async getDb(): Promise<Database> {
    return await DatabaseConnection.getInstance()
  }

  protected static async executeQuery<T = any>(
    sql: string,
    params: any[] = []
  ): Promise<T[]> {
    const db = await this.getDb()
    return await db.all(sql, params)
  }

  protected static async executeQuerySingle<T = any>(
    sql: string,
    params: any[] = []
  ): Promise<T | undefined> {
    const db = await this.getDb()
    return await db.get(sql, params)
  }

  protected static async executeInsert(
    sql: string,
    params: any[] = []
  ): Promise<number> {
    const db = await this.getDb()
    const result = await db.run(sql, params)
    return result.lastID as number
  }

  protected static async executeUpdate(
    sql: string,
    params: any[] = []
  ): Promise<number> {
    const db = await this.getDb()
    const result = await db.run(sql, params)
    return result.changes as number
  }

  protected static buildWhereClause(filters: Record<string, any>): {
    whereClause: string
    params: any[]
  } {
    const conditions: string[] = []
    const params: any[] = []

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (typeof value === 'string' && value.includes('%')) {
          conditions.push(`${key} LIKE ?`)
        } else {
          conditions.push(`${key} = ?`)
        }
        params.push(value)
      }
    })

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    return { whereClause, params }
  }

  protected static buildPaginationClause(page?: number, limit?: number): {
    paginationClause: string
    offset: number
    actualLimit: number
  } {
    const actualLimit = limit && limit > 0 ? Math.min(limit, 100) : 20
    const actualPage = page && page > 0 ? page : 1
    const offset = (actualPage - 1) * actualLimit

    return {
      paginationClause: `LIMIT ${actualLimit} OFFSET ${offset}`,
      offset,
      actualLimit,
    }
  }
}

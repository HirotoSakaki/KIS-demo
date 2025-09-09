import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import type { Database } from 'sqlite'
import path from 'path'
import fs from 'fs'

export class DatabaseConnection {
  private static instance: Database | null = null

  static async getInstance(): Promise<Database> {
    if (!DatabaseConnection.instance) {
      // データディレクトリの作成
      const dataDir = path.join(process.cwd(), 'data')
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
      }

      const dbPath = path.join(dataDir, 'app.db')
      
      DatabaseConnection.instance = await open({
        filename: dbPath,
        driver: sqlite3.Database,
      })

      // WALモードを有効にしてパフォーマンス向上
      await DatabaseConnection.instance.exec('PRAGMA journal_mode = WAL;')
      await DatabaseConnection.instance.exec('PRAGMA foreign_keys = ON;')
    }

    return DatabaseConnection.instance
  }

  static async closeConnection(): Promise<void> {
    if (DatabaseConnection.instance) {
      await DatabaseConnection.instance.close()
      DatabaseConnection.instance = null
    }
  }

  static async initializeDatabase(): Promise<void> {
    const db = await DatabaseConnection.getInstance()
    
    // スキーマファイルを読み込んで実行
    const schemaPath = path.join(__dirname, 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    await db.exec(schema)
    console.log('Database initialized successfully')
  }
}

export default DatabaseConnection

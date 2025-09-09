import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import DatabaseConnection from './database/connection.js'

// ルートインポート
import authRoutes from './routes/auth.js'
import customerRoutes from './routes/customers.js'

// 環境変数読み込み
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// ミドルウェア設定
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}))
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// API ルート
app.use('/api/auth', authRoutes)
app.use('/api/customers', customerRoutes)

// 404 ハンドラー
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'エンドポイントが見つかりません'
  })
})

// エラーハンドラー
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Server error:', err)
  res.status(500).json({
    success: false,
    error: 'サーバーエラーが発生しました'
  })
})

// データベース初期化とサーバー起動
async function startServer() {
  try {
    // データベース初期化
    await DatabaseConnection.initializeDatabase()
    console.log('Database initialized successfully')

    // サーバー起動
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
      console.log(`Health check: http://localhost:${PORT}/health`)
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

// 起動
startServer()

// グレースフルシャットダウン
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...')
  await DatabaseConnection.closeConnection()
  process.exit(0)
})

export default app

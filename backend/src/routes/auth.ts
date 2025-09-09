import { Router } from 'express'
import { AuthController } from '../controllers/AuthController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// 認証不要のルート
router.post('/login', AuthController.login)
router.post('/register', AuthController.register)

// 認証必要のルート
router.get('/profile', authenticateToken, AuthController.getProfile)
router.get('/permissions', authenticateToken, AuthController.getPermissions)

export default router

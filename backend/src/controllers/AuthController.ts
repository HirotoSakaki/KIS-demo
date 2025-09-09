import { Request, Response } from 'express'
import { UserModel } from '../models/UserModel.js'
import { PermissionModel } from '../models/PermissionModel.js'
import { generateToken } from '../middleware/auth.js'
import { ApiResponse, AuthResponse } from '../types/index.js'

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body

      if (!username || !password) {
        res.status(400).json({
          success: false,
          error: 'ユーザー名とパスワードが必要です'
        } as ApiResponse)
        return
      }

      const user = await UserModel.authenticate(username, password)
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'ユーザー名またはパスワードが正しくありません'
        } as ApiResponse)
        return
      }

      const token = generateToken(user)

      res.json({
        success: true,
        data: { user, token }
      } as ApiResponse<AuthResponse>)

    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({
        success: false,
        error: 'ログインエラーが発生しました'
      } as ApiResponse)
    }
  }

  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, role = 'user' } = req.body

      if (!username || !email || !password) {
        res.status(400).json({
          success: false,
          error: 'ユーザー名、メールアドレス、パスワードが必要です'
        } as ApiResponse)
        return
      }

      // 重複チェック
      const existingUsername = await UserModel.isUsernameExists(username)
      if (existingUsername) {
        res.status(400).json({
          success: false,
          error: 'このユーザー名は既に使用されています'
        } as ApiResponse)
        return
      }

      const existingEmail = await UserModel.isEmailExists(email)
      if (existingEmail) {
        res.status(400).json({
          success: false,
          error: 'このメールアドレスは既に使用されています'
        } as ApiResponse)
        return
      }

      // ユーザー作成
      const userId = await UserModel.create(username, email, password, role)
      
      // デフォルト権限設定
      await PermissionModel.initializeDefaultPermissions(userId, role)

      const user = await UserModel.findById(userId)
      if (!user) {
        throw new Error('ユーザーの取得に失敗しました')
      }

      const token = generateToken(user)

      res.status(201).json({
        success: true,
        data: { user, token }
      } as ApiResponse<AuthResponse>)

    } catch (error) {
      console.error('Registration error:', error)
      res.status(500).json({
        success: false,
        error: 'ユーザー登録エラーが発生しました'
      } as ApiResponse)
    }
  }

  static async getProfile(req: any, res: Response): Promise<void> {
    try {
      const user = await UserModel.findById(req.user.id)
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'ユーザーが見つかりません'
        } as ApiResponse)
        return
      }

      res.json({
        success: true,
        data: user
      } as ApiResponse)

    } catch (error) {
      console.error('Get profile error:', error)
      res.status(500).json({
        success: false,
        error: 'プロフィール取得エラーが発生しました'
      } as ApiResponse)
    }
  }

  static async getPermissions(req: any, res: Response): Promise<void> {
    try {
      const permissions = await PermissionModel.findByUserId(req.user.id)

      res.json({
        success: true,
        data: permissions
      } as ApiResponse)

    } catch (error) {
      console.error('Get permissions error:', error)
      res.status(500).json({
        success: false,
        error: '権限取得エラーが発生しました'
      } as ApiResponse)
    }
  }
}

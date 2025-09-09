import { Response } from 'express'
import { AuthenticatedRequest } from '../middleware/auth.js'
import { CustomerModel } from '../models/CustomerModel.js'
import { ApiResponse, PaginatedResponse, Customer } from '../types/index.js'

export class CustomerController {
  static async getCustomers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { page, limit, name, email, customer_code } = req.query

      const filters = {
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        name: name as string,
        email: email as string,
        customer_code: customer_code as string,
      }

      const { customers, total } = await CustomerModel.findAll(filters)
      
      const actualPage = filters.page || 1
      const actualLimit = filters.limit || 20
      const totalPages = Math.ceil(total / actualLimit)

      res.json({
        success: true,
        data: {
          data: customers,
          total,
          page: actualPage,
          limit: actualLimit,
          totalPages
        }
      } as ApiResponse<PaginatedResponse<Customer>>)

    } catch (error) {
      console.error('Get customers error:', error)
      res.status(500).json({
        success: false,
        error: '顧客一覧取得エラーが発生しました'
      } as ApiResponse)
    }
  }

  static async getCustomer(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const customerId = parseInt(id)

      if (isNaN(customerId)) {
        res.status(400).json({
          success: false,
          error: '無効な顧客IDです'
        } as ApiResponse)
        return
      }

      const customer = await CustomerModel.findById(customerId)
      if (!customer) {
        res.status(404).json({
          success: false,
          error: '顧客が見つかりません'
        } as ApiResponse)
        return
      }

      res.json({
        success: true,
        data: customer
      } as ApiResponse<Customer>)

    } catch (error) {
      console.error('Get customer error:', error)
      res.status(500).json({
        success: false,
        error: '顧客取得エラーが発生しました'
      } as ApiResponse)
    }
  }

  static async createCustomer(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { customer_code, name, email, phone, address } = req.body

      if (!customer_code || !name) {
        res.status(400).json({
          success: false,
          error: '顧客コードと名前は必須です'
        } as ApiResponse)
        return
      }

      // 重複チェック
      const existingCustomer = await CustomerModel.isCodeExists(customer_code)
      if (existingCustomer) {
        res.status(400).json({
          success: false,
          error: 'この顧客コードは既に使用されています'
        } as ApiResponse)
        return
      }

      const customerId = await CustomerModel.create({
        customer_code,
        name,
        email,
        phone,
        address
      }, req.user!.id)

      const customer = await CustomerModel.findById(customerId)

      res.status(201).json({
        success: true,
        data: customer,
        message: '顧客が正常に作成されました'
      } as ApiResponse<Customer>)

    } catch (error) {
      console.error('Create customer error:', error)
      res.status(500).json({
        success: false,
        error: '顧客作成エラーが発生しました'
      } as ApiResponse)
    }
  }

  static async updateCustomer(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const customerId = parseInt(id)

      if (isNaN(customerId)) {
        res.status(400).json({
          success: false,
          error: '無効な顧客IDです'
        } as ApiResponse)
        return
      }

      const existingCustomer = await CustomerModel.findById(customerId)
      if (!existingCustomer) {
        res.status(404).json({
          success: false,
          error: '顧客が見つかりません'
        } as ApiResponse)
        return
      }

      const { name, email, phone, address } = req.body
      const updateData: any = {}

      if (name !== undefined) updateData.name = name
      if (email !== undefined) updateData.email = email
      if (phone !== undefined) updateData.phone = phone
      if (address !== undefined) updateData.address = address

      const success = await CustomerModel.update(customerId, updateData)
      if (!success) {
        res.status(400).json({
          success: false,
          error: '更新するデータがありません'
        } as ApiResponse)
        return
      }

      const updatedCustomer = await CustomerModel.findById(customerId)

      res.json({
        success: true,
        data: updatedCustomer,
        message: '顧客が正常に更新されました'
      } as ApiResponse<Customer>)

    } catch (error) {
      console.error('Update customer error:', error)
      res.status(500).json({
        success: false,
        error: '顧客更新エラーが発生しました'
      } as ApiResponse)
    }
  }

  static async deleteCustomer(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const customerId = parseInt(id)

      if (isNaN(customerId)) {
        res.status(400).json({
          success: false,
          error: '無効な顧客IDです'
        } as ApiResponse)
        return
      }

      const existingCustomer = await CustomerModel.findById(customerId)
      if (!existingCustomer) {
        res.status(404).json({
          success: false,
          error: '顧客が見つかりません'
        } as ApiResponse)
        return
      }

      const success = await CustomerModel.delete(customerId)
      if (!success) {
        res.status(400).json({
          success: false,
          error: '顧客の削除に失敗しました'
        } as ApiResponse)
        return
      }

      res.json({
        success: true,
        message: '顧客が正常に削除されました'
      } as ApiResponse)

    } catch (error) {
      console.error('Delete customer error:', error)
      
      if (error instanceof Error && error.message.includes('関連する注文')) {
        res.status(400).json({
          success: false,
          error: error.message
        } as ApiResponse)
      } else {
        res.status(500).json({
          success: false,
          error: '顧客削除エラーが発生しました'
        } as ApiResponse)
      }
    }
  }
}

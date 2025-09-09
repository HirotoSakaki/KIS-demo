import { Router } from 'express'
import { CustomerController } from '../controllers/CustomerController.js'
import { authenticateToken } from '../middleware/auth.js'
import { 
  requireCustomerRead, 
  requireCustomerCreate, 
  requireCustomerDelete 
} from '../middleware/permission.js'

const router = Router()

// 全て認証必要
router.use(authenticateToken)

// 顧客一覧・検索（顧客検索権限）
router.get('/', requireCustomerRead, CustomerController.getCustomers)

// 顧客詳細取得（顧客検索権限）
router.get('/:id', requireCustomerRead, CustomerController.getCustomer)

// 顧客作成（顧客登録権限）
router.post('/', requireCustomerCreate, CustomerController.createCustomer)

// 顧客更新（顧客登録権限）
router.put('/:id', requireCustomerCreate, CustomerController.updateCustomer)

// 顧客削除（顧客削除権限）
router.delete('/:id', requireCustomerDelete, CustomerController.deleteCustomer)

export default router

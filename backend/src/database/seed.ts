import DatabaseConnection from './connection.js'
import { UserModel } from '../models/UserModel.js'
import { CustomerModel } from '../models/CustomerModel.js'
import { ProductModel } from '../models/ProductModel.js'
import { OrderModel } from '../models/OrderModel.js'
import { PermissionModel } from '../models/PermissionModel.js'

async function seedDatabase() {
  try {
    console.log('Starting database seeding...')

    // データベース初期化
    await DatabaseConnection.initializeDatabase()

    // 管理者ユーザー作成
    const adminId = await UserModel.create(
      'admin',
      'admin@example.com',
      'admin123',
      'admin'
    )
    console.log('Admin user created with ID:', adminId)

    // 一般ユーザー作成
    const userId = await UserModel.create(
      'user',
      'user@example.com',
      'user123',
      'user'
    )
    console.log('Regular user created with ID:', userId)

    // デフォルト権限設定
    await PermissionModel.initializeDefaultPermissions(adminId, 'admin')
    await PermissionModel.initializeDefaultPermissions(userId, 'user')
    console.log('Default permissions set')

    // サンプル顧客データ
    const customers = [
      {
        customer_code: 'CUST001',
        name: '株式会社サンプル',
        email: 'contact@sample.co.jp',
        phone: '03-1234-5678',
        address: '東京都渋谷区サンプル1-2-3'
      },
      {
        customer_code: 'CUST002',
        name: '田中太郎',
        email: 'tanaka@example.com',
        phone: '090-1234-5678',
        address: '大阪府大阪市サンプル区4-5-6'
      },
      {
        customer_code: 'CUST003',
        name: '山田商事株式会社',
        email: 'info@yamada-shouji.co.jp',
        phone: '052-123-4567',
        address: '愛知県名古屋市サンプル区7-8-9'
      }
    ]

    for (const customer of customers) {
      await CustomerModel.create(customer, adminId)
    }
    console.log('Sample customers created')

    // サンプル商品データ
    const products = [
      {
        product_code: 'PROD001',
        name: 'ノートパソコン',
        description: '高性能ビジネス向けノートパソコン',
        price: 120000,
        stock_quantity: 50,
        category: 'コンピューター'
      },
      {
        product_code: 'PROD002',
        name: 'ワイヤレスマウス',
        description: 'エルゴノミクスデザインのワイヤレスマウス',
        price: 3500,
        stock_quantity: 200,
        category: '周辺機器'
      },
      {
        product_code: 'PROD003',
        name: 'モニター 24インチ',
        description: 'フルHD IPS液晶モニター',
        price: 25000,
        stock_quantity: 30,
        category: 'ディスプレイ'
      },
      {
        product_code: 'PROD004',
        name: 'キーボード',
        description: 'メカニカルキーボード日本語配列',
        price: 8500,
        stock_quantity: 80,
        category: '周辺機器'
      }
    ]

    for (const product of products) {
      await ProductModel.create(product, adminId)
    }
    console.log('Sample products created')

    // サンプル注文データ
    const orders = [
      {
        customer_id: 1, // 株式会社サンプル
        items: [
          { product_id: 1, quantity: 5, unit_price: 120000 },
          { product_id: 3, quantity: 5, unit_price: 25000 }
        ]
      },
      {
        customer_id: 2, // 田中太郎
        items: [
          { product_id: 2, quantity: 1, unit_price: 3500 },
          { product_id: 4, quantity: 1, unit_price: 8500 }
        ]
      },
      {
        customer_id: 3, // 山田商事
        items: [
          { product_id: 1, quantity: 10, unit_price: 120000 },
          { product_id: 2, quantity: 10, unit_price: 3500 },
          { product_id: 3, quantity: 10, unit_price: 25000 },
          { product_id: 4, quantity: 10, unit_price: 8500 }
        ]
      }
    ]

    for (const order of orders) {
      await OrderModel.create(order, adminId)
    }
    console.log('Sample orders created')

    console.log('Database seeding completed successfully!')
    console.log('\nLogin credentials:')
    console.log('Admin: admin / admin123')
    console.log('User: user / user123')

  } catch (error) {
    console.error('Database seeding failed:', error)
  } finally {
    await DatabaseConnection.closeConnection()
    process.exit(0)
  }
}

// 実行
seedDatabase()

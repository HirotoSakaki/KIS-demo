import React, { useState } from 'react'
import styled from 'styled-components'

interface Order {
  id: number
  order_number: string
  customer_name: string
  customer_email: string
  order_date: string
  delivery_date: string
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  total_amount: number
  currency: string
  items: {
    product_name: string
    quantity: number
    unit_price: number
  }[]
  shipping_address: {
    address: string
    city: string
    postal_code: string
    country: string
  }
  billing_address: {
    address: string
    city: string
    postal_code: string
    country: string
  }
  shipping_method: string
  tracking_number?: string
  notes?: string
  discount_amount: number
  tax_amount: number
  shipping_cost: number
}

const PageContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
`

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: linear-gradient(135deg, #7c2d12 0%, #dc2626 100%);
  color: white;
`

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.md};
  opacity: 0.9;
  margin: 0;
`

const ControlsSection = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  align-items: center;
  background: ${({ theme }) => theme.colors.gray50};
`

const SearchBox = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  flex: 1;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`

const FilterSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  background: white;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.normal};
  
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary};
          color: white;
          &:hover { background: ${theme.colors.primaryDark}; }
        `
      case 'danger':
        return `
          background: ${theme.colors.danger};
          color: white;
          &:hover { background: ${theme.colors.dangerDark}; }
        `
      default:
        return `
          background: white;
          color: ${theme.colors.textPrimary};
          border: 1px solid ${theme.colors.border};
          &:hover { background: ${theme.colors.gray50}; }
        `
    }
  }}
`

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.gray50};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const StatCard = styled.div<{ $color: string }>`
  background: white;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border-left: 4px solid ${({ $color }) => $color};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`

const StatValue = styled.div<{ $color: string }>`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ $color }) => $color};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`

const TableContainer = styled.div`
  overflow-x: auto;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const TableHeader = styled.thead`
  background: ${({ theme }) => theme.colors.gray100};
`

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
  }
`

const TableHeaderCell = styled.th`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: left;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSize.sm};
  white-space: nowrap;
`

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
`

const StatusBadge = styled.span<{ $status: string }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  
  ${({ $status, theme }) => {
    switch ($status) {
      case 'pending':
        return `background: ${theme.colors.warning}20; color: ${theme.colors.warning};`
      case 'processing':
        return `background: ${theme.colors.info}20; color: ${theme.colors.info};`
      case 'shipped':
        return `background: ${theme.colors.primary}20; color: ${theme.colors.primary};`
      case 'delivered':
        return `background: ${theme.colors.success}20; color: ${theme.colors.success};`
      case 'cancelled':
        return `background: ${theme.colors.danger}20; color: ${theme.colors.danger};`
      default:
        return `background: ${theme.colors.gray200}; color: ${theme.colors.textSecondary};`
    }
  }}
`

const PaymentBadge = styled.span<{ $status: string }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  
  ${({ $status, theme }) => {
    switch ($status) {
      case 'pending':
        return `background: ${theme.colors.warning}20; color: ${theme.colors.warning};`
      case 'paid':
        return `background: ${theme.colors.success}20; color: ${theme.colors.success};`
      case 'failed':
        return `background: ${theme.colors.danger}20; color: ${theme.colors.danger};`
      case 'refunded':
        return `background: ${theme.colors.gray500}20; color: ${theme.colors.gray500};`
      default:
        return `background: ${theme.colors.gray200}; color: ${theme.colors.textSecondary};`
    }
  }}
`

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`

const ItemsList = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 200px;
`

const OrdersPage: React.FC = () => {
  const [orders] = useState<Order[]>([
    {
      id: 1,
      order_number: 'ORD-2024-001',
      customer_name: 'サンプル自動車株式会社',
      customer_email: 'orders@sample-auto.co.jp',
      order_date: '2024-01-15T09:30:00Z',
      delivery_date: '2024-01-25T14:00:00Z',
      order_status: 'delivered',
      payment_status: 'paid',
      total_amount: 2850000,
      currency: 'JPY',
      items: [
        { product_name: 'ビジネスノートパソコン Pro', quantity: 50, unit_price: 89800 },
        { product_name: 'オフィス家具セット', quantity: 15, unit_price: 45000 }
      ],
      shipping_address: {
        address: '愛知県豊田市トヨタ町1-1',
        city: '豊田市',
        postal_code: '471-8571',
        country: '日本'
      },
      billing_address: {
        address: '愛知県豊田市トヨタ町1-1',
        city: '豊田市',
        postal_code: '471-8571',
        country: '日本'
      },
      shipping_method: '特急配送',
      tracking_number: 'TRK-001234567',
      discount_amount: 150000,
      tax_amount: 285000,
      shipping_cost: 25000
    },
    {
      id: 2,
      order_number: 'ORD-2024-002',
      customer_name: 'グローバル電子株式会社',
      customer_email: 'procurement@global-electronics.co.jp',
      order_date: '2024-01-18T11:15:00Z',
      delivery_date: '2024-01-28T10:00:00Z',
      order_status: 'shipped',
      payment_status: 'paid',
      total_amount: 1580000,
      currency: 'JPY',
      items: [
        { product_name: 'クラウドストレージ サービス', quantity: 100, unit_price: 1200 },
        { product_name: 'ITコンサルティング サービス', quantity: 8, unit_price: 180000 }
      ],
      shipping_address: {
        address: '東京都港区芝浦1-1-1',
        city: '東京都',
        postal_code: '105-0023',
        country: '日本'
      },
      billing_address: {
        address: '東京都港区芝浦1-1-1',
        city: '東京都',
        postal_code: '105-0023',
        country: '日本'
      },
      shipping_method: '標準配送',
      tracking_number: 'TRK-001234568',
      discount_amount: 80000,
      tax_amount: 158000,
      shipping_cost: 12000
    },
    {
      id: 3,
      order_number: 'ORD-2024-003',
      customer_name: 'オーシャン水産株式会社',
      customer_email: 'info@ocean-fishery.co.jp',
      order_date: '2024-01-20T14:45:00Z',
      delivery_date: '2024-02-01T09:00:00Z',
      order_status: 'processing',
      payment_status: 'paid',
      total_amount: 750000,
      currency: 'JPY',
      items: [
        { product_name: 'モバイルアプリ開発ツール', quantity: 30, unit_price: 25000 }
      ],
      shipping_address: {
        address: '静岡県焼津市本町2-2-2',
        city: '焼津市',
        postal_code: '425-0021',
        country: '日本'
      },
      billing_address: {
        address: '静岡県焼津市本町2-2-2',
        city: '焼津市',
        postal_code: '425-0021',
        country: '日本'
      },
      shipping_method: '標準配送',
      discount_amount: 0,
      tax_amount: 75000,
      shipping_cost: 8000
    },
    {
      id: 4,
      order_number: 'ORD-2024-004',
      customer_name: 'サンプル重工業株式会社',
      customer_email: 'orders@sample-heavy.co.jp',
      order_date: '2024-01-22T16:20:00Z',
      delivery_date: '2024-02-05T15:00:00Z',
      order_status: 'pending',
      payment_status: 'pending',
      total_amount: 4200000,
      currency: 'JPY',
      items: [
        { product_name: 'ビジネスノートパソコン Pro', quantity: 35, unit_price: 89800 },
        { product_name: 'オフィス家具セット', quantity: 20, unit_price: 45000 },
        { product_name: 'ITコンサルティング サービス', quantity: 5, unit_price: 180000 }
      ],
      shipping_address: {
        address: '神奈川県横浜市西区みなとみらい3-3-3',
        city: '横浜市',
        postal_code: '220-0012',
        country: '日本'
      },
      billing_address: {
        address: '神奈川県横浜市西区みなとみらい3-3-3',
        city: '横浜市',
        postal_code: '220-0012',
        country: '日本'
      },
      shipping_method: '特急配送',
      discount_amount: 200000,
      tax_amount: 420000,
      shipping_cost: 35000
    },
    {
      id: 5,
      order_number: 'ORD-2024-005',
      customer_name: 'サンプル化学株式会社',
      customer_email: 'purchasing@sample-chemical.co.jp',
      order_date: '2024-01-25T08:30:00Z',
      delivery_date: '2024-02-08T11:00:00Z',
      order_status: 'cancelled',
      payment_status: 'refunded',
      total_amount: 320000,
      currency: 'JPY',
      items: [
        { product_name: 'クラウドストレージ サービス', quantity: 200, unit_price: 1200 },
        { product_name: 'モバイルアプリ開発ツール', quantity: 4, unit_price: 25000 }
      ],
      shipping_address: {
        address: '大阪府大阪市北区梅田4-4-4',
        city: '大阪市',
        postal_code: '530-0001',
        country: '日本'
      },
      billing_address: {
        address: '大阪府大阪市北区梅田4-4-4',
        city: '大阪市',
        postal_code: '530-0001',
        country: '日本'
      },
      shipping_method: '標準配送',
      notes: 'お客様都合によりキャンセル',
      discount_amount: 20000,
      tax_amount: 32000,
      shipping_cost: 10000
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')

  // フィルタリング
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.tracking_number && order.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === '' || order.order_status === statusFilter
    const matchesPayment = paymentFilter === '' || order.payment_status === paymentFilter
    
    return matchesSearch && matchesStatus && matchesPayment
  })

  // 統計計算
  const totalOrders = orders.length
  const processingOrders = orders.filter(o => o.order_status === 'processing' || o.order_status === 'shipped').length
  const totalRevenue = orders.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + o.total_amount, 0)
  const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return '待機中'
      case 'processing': return '処理中'
      case 'shipped': return '発送済み'
      case 'delivered': return '配送完了'
      case 'cancelled': return 'キャンセル'
      default: return status
    }
  }

  const getPaymentLabel = (status: string) => {
    switch (status) {
      case 'pending': return '支払い待ち'
      case 'paid': return '支払い済み'
      case 'failed': return '支払い失敗'
      case 'refunded': return '返金済み'
      default: return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <PageContainer>
      <Header>
        <Title>注文管理</Title>
        <Subtitle>注文処理・配送追跡・売上分析の統合管理</Subtitle>
      </Header>

      <ControlsSection>
        <SearchBox
          type="text"
          placeholder="注文番号、顧客名、メールアドレス、追跡番号で検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">全ステータス</option>
          <option value="pending">待機中</option>
          <option value="processing">処理中</option>
          <option value="shipped">発送済み</option>
          <option value="delivered">配送完了</option>
          <option value="cancelled">キャンセル</option>
        </FilterSelect>

        <FilterSelect
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
        >
          <option value="">全支払状況</option>
          <option value="pending">支払い待ち</option>
          <option value="paid">支払い済み</option>
          <option value="failed">支払い失敗</option>
          <option value="refunded">返金済み</option>
        </FilterSelect>

        <Button $variant="primary">
          新規注文作成
        </Button>
      </ControlsSection>

      <StatsContainer>
        <StatCard $color="#7c2d12">
          <StatValue $color="#7c2d12">{totalOrders}</StatValue>
          <StatLabel>総注文数</StatLabel>
        </StatCard>
        <StatCard $color="#1d4ed8">
          <StatValue $color="#1d4ed8">{processingOrders}</StatValue>
          <StatLabel>処理中</StatLabel>
        </StatCard>
        <StatCard $color="#10b981">
          <StatValue $color="#10b981">¥{totalRevenue.toLocaleString()}</StatValue>
          <StatLabel>総売上</StatLabel>
        </StatCard>
        <StatCard $color="#f59e0b">
          <StatValue $color="#f59e0b">¥{Math.round(averageOrder).toLocaleString()}</StatValue>
          <StatLabel>平均注文額</StatLabel>
        </StatCard>
      </StatsContainer>

      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>注文番号</TableHeaderCell>
              <TableHeaderCell>顧客名</TableHeaderCell>
              <TableHeaderCell>注文日</TableHeaderCell>
              <TableHeaderCell>配送予定日</TableHeaderCell>
              <TableHeaderCell>注文ステータス</TableHeaderCell>
              <TableHeaderCell>支払状況</TableHeaderCell>
              <TableHeaderCell>金額</TableHeaderCell>
              <TableHeaderCell>商品</TableHeaderCell>
              <TableHeaderCell>追跡番号</TableHeaderCell>
              <TableHeaderCell>アクション</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div style={{ fontWeight: 600 }}>
                    {order.order_number}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '2px' }}>
                      {order.customer_name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>
                      {order.customer_email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formatDate(order.order_date)}</TableCell>
                <TableCell>{formatDate(order.delivery_date)}</TableCell>
                <TableCell>
                  <StatusBadge $status={order.order_status}>
                    {getStatusLabel(order.order_status)}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <PaymentBadge $status={order.payment_status}>
                    {getPaymentLabel(order.payment_status)}
                  </PaymentBadge>
                </TableCell>
                <TableCell>
                  <div style={{ fontWeight: 600 }}>
                    ¥{order.total_amount.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>
                    {order.currency}
                  </div>
                </TableCell>
                <TableCell>
                  <ItemsList>
                    {order.items.map((item, index) => (
                      <div key={index}>
                        {item.product_name} x {item.quantity}
                      </div>
                    ))}
                  </ItemsList>
                </TableCell>
                <TableCell>
                  {order.tracking_number ? (
                    <span style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                      {order.tracking_number}
                    </span>
                  ) : (
                    <span style={{ color: '#6b7280' }}>-</span>
                  )}
                </TableCell>
                <TableCell>
                  <ActionButtons>
                    <Button>詳細</Button>
                    <Button>編集</Button>
                    <Button $variant="danger">キャンセル</Button>
                  </ActionButtons>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </PageContainer>
  )
}

export default OrdersPage
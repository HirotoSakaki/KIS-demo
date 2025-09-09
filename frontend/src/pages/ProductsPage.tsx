import React, { useState } from 'react'
import styled from 'styled-components'

interface Product {
  id: number
  product_name: string
  product_code: string
  category: string
  product_type: 'physical' | 'digital' | 'service' | 'subscription' | 'bundle'
  brand: string
  description: string
  unit_price: number
  currency: string
  stock_quantity: number
  min_stock_level: number
  supplier_name: string
  manufacturer: string
  model_number: string
  launch_date: string
  status: 'active' | 'discontinued' | 'out_of_stock' | 'pre_order'
  weight_kg?: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  warranty_months: number
  rating: number
  sales_ytd: number
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
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
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
      case 'active':
        return `background: ${theme.colors.success}20; color: ${theme.colors.success};`
      case 'discontinued':
        return `background: ${theme.colors.warning}20; color: ${theme.colors.warning};`
      case 'out_of_stock':
        return `background: ${theme.colors.danger}20; color: ${theme.colors.danger};`
      case 'pre_order':
        return `background: ${theme.colors.info}20; color: ${theme.colors.info};`
      default:
        return `background: ${theme.colors.gray200}; color: ${theme.colors.textSecondary};`
    }
  }}
`

const TypeBadge = styled.span<{ $type: string }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  
  ${({ $type, theme }) => {
    switch ($type) {
      case 'physical':
        return `background: #0f172a; color: white;`
      case 'digital':
        return `background: ${theme.colors.info}; color: white;`
      case 'service':
        return `background: ${theme.colors.success}; color: white;`
      case 'subscription':
        return `background: ${theme.colors.warning}; color: white;`
      case 'bundle':
        return `background: ${theme.colors.purple}; color: white;`
      default:
        return `background: ${theme.colors.gray500}; color: white;`
    }
  }}
`

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`

const StockText = styled.span<{ $low?: boolean }>`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ $low, theme }) => $low ? theme.colors.danger : theme.colors.textPrimary};
`

const RatingStars = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`

const ProductsPage: React.FC = () => {
  const [products] = useState<Product[]>([
    {
      id: 1,
      product_name: 'ビジネスノートパソコン Pro',
      product_code: 'PC-BIZ-001',
      category: 'コンピューター',
      product_type: 'physical',
      brand: 'TechSample',
      description: '高性能ビジネス向けノートパソコン',
      unit_price: 89800,
      currency: 'JPY',
      stock_quantity: 45,
      min_stock_level: 10,
      supplier_name: 'イースト電子部品株式会社',
      manufacturer: 'サンプルテック',
      model_number: 'BSN-2024-P1',
      launch_date: '2024-01-15',
      status: 'active',
      weight_kg: 1.8,
      dimensions: { length: 35.5, width: 24.2, height: 1.9 },
      warranty_months: 36,
      rating: 4.5,
      sales_ytd: 125
    },
    {
      id: 2,
      product_name: 'クラウドストレージ サービス',
      product_code: 'CLD-STG-002',
      category: 'クラウドサービス',
      product_type: 'subscription',
      brand: 'CloudSample',
      description: '安全なクラウドストレージソリューション',
      unit_price: 1200,
      currency: 'JPY',
      stock_quantity: 999,
      min_stock_level: 0,
      supplier_name: 'セントラルシステムズ',
      manufacturer: 'サンプルクラウド',
      model_number: 'CS-2024-PRO',
      launch_date: '2023-11-01',
      status: 'active',
      dimensions: { length: 0, width: 0, height: 0 },
      warranty_months: 12,
      rating: 4.2,
      sales_ytd: 856
    },
    {
      id: 3,
      product_name: 'オフィス家具セット',
      product_code: 'FUR-OFF-003',
      category: 'オフィス用品',
      product_type: 'bundle',
      brand: 'OfficeSample',
      description: 'デスク・チェア・収納のセット商品',
      unit_price: 45000,
      currency: 'JPY',
      stock_quantity: 12,
      min_stock_level: 5,
      supplier_name: 'ウエスト製造業株式会社',
      manufacturer: 'サンプル家具',
      model_number: 'OF-SET-2024',
      launch_date: '2023-09-20',
      status: 'active',
      weight_kg: 85.5,
      dimensions: { length: 120, width: 60, height: 75 },
      warranty_months: 24,
      rating: 4.8,
      sales_ytd: 89
    },
    {
      id: 4,
      product_name: 'モバイルアプリ開発ツール',
      product_code: 'APP-DEV-004',
      category: 'ソフトウェア',
      product_type: 'digital',
      brand: 'DevSample',
      description: 'クロスプラットフォーム開発環境',
      unit_price: 25000,
      currency: 'JPY',
      stock_quantity: 0,
      min_stock_level: 0,
      supplier_name: 'セントラルシステムズ',
      manufacturer: 'サンプルソフト',
      model_number: 'MAD-2024-ENT',
      launch_date: '2024-03-01',
      status: 'out_of_stock',
      dimensions: { length: 0, width: 0, height: 0 },
      warranty_months: 6,
      rating: 3.9,
      sales_ytd: 234
    },
    {
      id: 5,
      product_name: 'ITコンサルティング サービス',
      product_code: 'SRV-CON-005',
      category: 'コンサルティング',
      product_type: 'service',
      brand: 'ConsultSample',
      description: 'IT戦略・システム導入支援',
      unit_price: 180000,
      currency: 'JPY',
      stock_quantity: 999,
      min_stock_level: 0,
      supplier_name: 'ノースパートナーズ',
      manufacturer: 'サンプルコンサル',
      model_number: 'ITC-2024-STD',
      launch_date: '2023-08-15',
      status: 'active',
      dimensions: { length: 0, width: 0, height: 0 },
      warranty_months: 3,
      rating: 4.7,
      sales_ytd: 67
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  // フィルタリング
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === '' || product.status === statusFilter
    const matchesType = typeFilter === '' || product.product_type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  // 統計計算
  const totalProducts = products.length
  const activeProducts = products.filter(p => p.status === 'active').length
  const totalStock = products.reduce((sum, p) => sum + p.stock_quantity, 0)
  const totalSales = products.reduce((sum, p) => sum + p.sales_ytd, 0)
  const lowStockProducts = products.filter(p => p.stock_quantity <= p.min_stock_level && p.product_type === 'physical').length

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return '販売中'
      case 'discontinued': return '販売終了'
      case 'out_of_stock': return '在庫切れ'
      case 'pre_order': return '予約受付'
      default: return status
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'physical': return '物理商品'
      case 'digital': return 'デジタル'
      case 'service': return 'サービス'
      case 'subscription': return 'サブスク'
      case 'bundle': return 'セット商品'
      default: return type
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < Math.floor(rating) ? '#fbbf24' : '#e5e7eb' }}>
        ★
      </span>
    ))
  }

  return (
    <PageContainer>
      <Header>
        <Title>商品管理</Title>
        <Subtitle>商品・サービスの一元管理とパフォーマンス分析</Subtitle>
      </Header>

      <ControlsSection>
        <SearchBox
          type="text"
          placeholder="商品名、商品コード、ブランド、カテゴリで検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">全ステータス</option>
          <option value="active">販売中</option>
          <option value="discontinued">販売終了</option>
          <option value="out_of_stock">在庫切れ</option>
          <option value="pre_order">予約受付</option>
        </FilterSelect>

        <FilterSelect
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">全タイプ</option>
          <option value="physical">物理商品</option>
          <option value="digital">デジタル</option>
          <option value="service">サービス</option>
          <option value="subscription">サブスク</option>
          <option value="bundle">セット商品</option>
        </FilterSelect>

        <Button $variant="primary">
          新規商品登録
        </Button>
      </ControlsSection>

      <StatsContainer>
        <StatCard $color="#0f172a">
          <StatValue $color="#0f172a">{totalProducts}</StatValue>
          <StatLabel>登録商品数</StatLabel>
        </StatCard>
        <StatCard $color="#10b981">
          <StatValue $color="#10b981">{activeProducts}</StatValue>
          <StatLabel>販売中</StatLabel>
        </StatCard>
        <StatCard $color="#1d4ed8">
          <StatValue $color="#1d4ed8">{totalStock.toLocaleString()}</StatValue>
          <StatLabel>総在庫数</StatLabel>
        </StatCard>
        <StatCard $color="#f59e0b">
          <StatValue $color="#f59e0b">{totalSales.toLocaleString()}</StatValue>
          <StatLabel>年間販売数</StatLabel>
        </StatCard>
        <StatCard $color="#dc2626">
          <StatValue $color="#dc2626">{lowStockProducts}</StatValue>
          <StatLabel>在庫不足</StatLabel>
        </StatCard>
      </StatsContainer>

      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>商品名</TableHeaderCell>
              <TableHeaderCell>商品コード</TableHeaderCell>
              <TableHeaderCell>カテゴリ</TableHeaderCell>
              <TableHeaderCell>タイプ</TableHeaderCell>
              <TableHeaderCell>ブランド</TableHeaderCell>
              <TableHeaderCell>価格</TableHeaderCell>
              <TableHeaderCell>在庫数</TableHeaderCell>
              <TableHeaderCell>評価</TableHeaderCell>
              <TableHeaderCell>年間販売</TableHeaderCell>
              <TableHeaderCell>ステータス</TableHeaderCell>
              <TableHeaderCell>アクション</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '2px' }}>
                      {product.product_name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {product.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{product.product_code}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  <TypeBadge $type={product.product_type}>
                    {getTypeLabel(product.product_type)}
                  </TypeBadge>
                </TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>
                  ¥{product.unit_price.toLocaleString()}
                </TableCell>
                <TableCell>
                  {product.product_type === 'physical' ? (
                    <StockText $low={product.stock_quantity <= product.min_stock_level}>
                      {product.stock_quantity.toLocaleString()}
                    </StockText>
                  ) : (
                    <span style={{ color: '#6b7280' }}>-</span>
                  )}
                </TableCell>
                <TableCell>
                  <RatingStars>
                    {renderStars(product.rating)}
                    <span style={{ marginLeft: '4px', fontSize: '12px', color: '#6b7280' }}>
                      {product.rating}
                    </span>
                  </RatingStars>
                </TableCell>
                <TableCell>{product.sales_ytd}</TableCell>
                <TableCell>
                  <StatusBadge $status={product.status}>
                    {getStatusLabel(product.status)}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <ActionButtons>
                    <Button>詳細</Button>
                    <Button>編集</Button>
                    <Button $variant="danger">削除</Button>
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

export default ProductsPage
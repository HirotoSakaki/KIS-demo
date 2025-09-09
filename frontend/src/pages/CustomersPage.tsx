import React, { useState } from 'react'
import styled from 'styled-components'

interface Customer {
  id: number
  company_name: string
  customer_code: string
  contact_person: string
  email: string
  phone: string
  address: string
  country: string
  customer_type: 'enterprise' | 'sme' | 'startup' | 'individual'
  credit_limit: number
  credit_used: number
  contract_type: 'regular' | 'premium' | 'enterprise'
  preferred_products: string[]
  industry_categories: string[]
  annual_revenue: number
  last_order_date: string
  total_orders_ytd: number
  status: 'active' | 'inactive' | 'credit_hold'
  registration_date: string
  account_manager: string
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
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%);
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '🏢';
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    font-size: 60px;
    opacity: 0.2;
  }
`

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  position: relative;
  z-index: 1;
`

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.md};
  opacity: 0.9;
  margin: 0;
  position: relative;
  z-index: 1;
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
      case 'inactive':
        return `background: ${theme.colors.warning}20; color: ${theme.colors.warning};`
      case 'credit_hold':
        return `background: ${theme.colors.danger}20; color: ${theme.colors.danger};`
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
      case 'enterprise':
        return `background: #1e3a8a; color: white;`
      case 'sme':
        return `background: ${theme.colors.info}; color: white;`
      case 'startup':
        return `background: ${theme.colors.success}; color: white;`
      case 'individual':
        return `background: ${theme.colors.warning}; color: white;`
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

const RevenueText = styled.span`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: #1e3a8a;
`

const CustomersPage: React.FC = () => {
  const [customers] = useState<Customer[]>([
    {
      id: 1,
      company_name: 'サンプル自動車株式会社',
      customer_code: 'CUST001',
      contact_person: '田中太郎',
      email: 'tanaka@sample-auto.co.jp',
      phone: '03-1234-5678',
      address: '愛知県豊田市サンプル町1-1',
      country: '日本',
      customer_type: 'enterprise',
      credit_limit: 50000000,
      credit_used: 12500000,
      contract_type: 'enterprise',
      preferred_products: ['ビジネスノートパソコン', 'オフィス家具'],
      industry_categories: ['自動車', '製造業'],
      annual_revenue: 850000000,
      last_order_date: '2024-01-15',
      total_orders_ytd: 24,
      status: 'active',
      registration_date: '2020-03-15',
      account_manager: '営業部 佐藤'
    },
    {
      id: 2,
      company_name: 'グローバル電子株式会社',
      customer_code: 'CUST002',
      contact_person: '鈴木花子',
      email: 'suzuki@global-electronics.co.jp',
      phone: '03-2345-6789',
      address: '東京都港区芝浦1-1-1',
      country: '日本',
      customer_type: 'enterprise',
      credit_limit: 30000000,
      credit_used: 8200000,
      contract_type: 'premium',
      preferred_products: ['クラウドサービス', 'ITコンサルティング'],
      industry_categories: ['電子機器', 'IT'],
      annual_revenue: 620000000,
      last_order_date: '2024-01-18',
      total_orders_ytd: 18,
      status: 'active',
      registration_date: '2019-08-22',
      account_manager: '営業部 高橋'
    },
    {
      id: 3,
      company_name: 'テックスタートアップ合同会社',
      customer_code: 'CUST003',
      contact_person: 'John Smith',
      email: 'john@tech-startup.com',
      phone: '050-3456-7890',
      address: '東京都渋谷区道玄坂2-2-2',
      country: '日本',
      customer_type: 'startup',
      credit_limit: 5000000,
      credit_used: 1800000,
      contract_type: 'regular',
      preferred_products: ['モバイルアプリ開発ツール', 'クラウドサービス'],
      industry_categories: ['IT', 'スタートアップ'],
      annual_revenue: 38000000,
      last_order_date: '2024-01-20',
      total_orders_ytd: 12,
      status: 'active',
      registration_date: '2023-05-10',
      account_manager: '営業部 山田'
    },
    {
      id: 4,
      company_name: 'コンサルティングファーム株式会社',
      customer_code: 'CUST004',
      contact_person: '中村健一',
      email: 'nakamura@consulting-firm.co.jp',
      phone: '06-4567-8901',
      address: '大阪府大阪市北区梅田3-3-3',
      country: '日本',
      customer_type: 'sme',
      credit_limit: 15000000,
      credit_used: 3200000,
      contract_type: 'premium',
      preferred_products: ['ITコンサルティング', 'ビジネスソフトウェア'],
      industry_categories: ['コンサルティング', 'サービス業'],
      annual_revenue: 210000000,
      last_order_date: '2024-01-12',
      total_orders_ytd: 8,
      status: 'active',
      registration_date: '2021-11-08',
      account_manager: '営業部 伊藤'
    },
    {
      id: 5,
      company_name: 'ヨーロッパ商事株式会社',
      customer_code: 'CUST005',
      contact_person: 'Maria Garcia',
      email: 'maria@europe-trading.co.jp',
      phone: '03-5678-9012',
      address: '東京都中央区銀座4-4-4',
      country: '日本',
      customer_type: 'sme',
      credit_limit: 8000000,
      credit_used: 1500000,
      contract_type: 'regular',
      preferred_products: ['オフィス用品', '一般消費財'],
      industry_categories: ['商社', '輸入業'],
      annual_revenue: 150000000,
      last_order_date: '2024-01-08',
      total_orders_ytd: 6,
      status: 'active',
      registration_date: '2022-02-14',
      account_manager: '営業部 佐藤'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  // フィルタリング
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customer_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === '' || customer.status === statusFilter
    const matchesType = typeFilter === '' || customer.customer_type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  // 統計計算
  const totalCustomers = customers.length
  const activeCustomers = customers.filter(c => c.status === 'active').length
  const totalRevenue = customers.reduce((sum, c) => sum + c.annual_revenue, 0)
  const totalOrders = customers.reduce((sum, c) => sum + c.total_orders_ytd, 0)

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'アクティブ'
      case 'inactive': return '非アクティブ'
      case 'credit_hold': return '与信停止'
      default: return status
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'enterprise': return '大企業'
      case 'sme': return '中小企業'
      case 'startup': return 'スタートアップ'
      case 'individual': return '個人'
      default: return type
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
        <Title>顧客管理</Title>
        <Subtitle>顧客情報・取引履歴・売上分析の統合管理</Subtitle>
      </Header>

      <ControlsSection>
        <SearchBox
          type="text"
          placeholder="会社名、顧客コード、担当者名、メールアドレスで検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">全ステータス</option>
          <option value="active">アクティブ</option>
          <option value="inactive">非アクティブ</option>
          <option value="credit_hold">与信停止</option>
        </FilterSelect>

        <FilterSelect
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">全タイプ</option>
          <option value="enterprise">大企業</option>
          <option value="sme">中小企業</option>
          <option value="startup">スタートアップ</option>
          <option value="individual">個人</option>
        </FilterSelect>

        <Button $variant="primary">
          新規顧客登録
        </Button>
      </ControlsSection>

      <StatsContainer>
        <StatCard $color="#1e3a8a">
          <StatValue $color="#1e3a8a">{totalCustomers}</StatValue>
          <StatLabel>総顧客数</StatLabel>
        </StatCard>
        <StatCard $color="#10b981">
          <StatValue $color="#10b981">{activeCustomers}</StatValue>
          <StatLabel>アクティブ顧客</StatLabel>
        </StatCard>
        <StatCard $color="#3b82f6">
          <StatValue $color="#3b82f6">¥{(totalRevenue / 100000000).toFixed(1)}億</StatValue>
          <StatLabel>年間総売上</StatLabel>
        </StatCard>
        <StatCard $color="#f59e0b">
          <StatValue $color="#f59e0b">{totalOrders}</StatValue>
          <StatLabel>年間総注文数</StatLabel>
        </StatCard>
      </StatsContainer>

      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>会社名</TableHeaderCell>
              <TableHeaderCell>顧客コード</TableHeaderCell>
              <TableHeaderCell>担当者</TableHeaderCell>
              <TableHeaderCell>タイプ</TableHeaderCell>
              <TableHeaderCell>契約種別</TableHeaderCell>
              <TableHeaderCell>年間売上</TableHeaderCell>
              <TableHeaderCell>年間注文数</TableHeaderCell>
              <TableHeaderCell>与信状況</TableHeaderCell>
              <TableHeaderCell>ステータス</TableHeaderCell>
              <TableHeaderCell>営業担当</TableHeaderCell>
              <TableHeaderCell>アクション</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '2px' }}>
                      {customer.company_name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>
                      {customer.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{customer.customer_code}</TableCell>
                <TableCell>
                  <div>
                    <div style={{ fontWeight: 600 }}>{customer.contact_person}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>
                      業界: {customer.industry_categories.join(', ')}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <TypeBadge $type={customer.customer_type}>
                    {getTypeLabel(customer.customer_type)}
                  </TypeBadge>
                </TableCell>
                <TableCell>{customer.contract_type}</TableCell>
                <TableCell>
                  <RevenueText>¥{(customer.annual_revenue / 100000000).toFixed(1)}億</RevenueText>
                </TableCell>
                <TableCell>{customer.total_orders_ytd}</TableCell>
                <TableCell>
                  <div style={{ fontSize: '11px' }}>
                    <div>限度額: ¥{(customer.credit_limit / 10000).toLocaleString()}万</div>
                    <div style={{ color: '#6b7280' }}>
                      使用額: ¥{(customer.credit_used / 10000).toLocaleString()}万
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge $status={customer.status}>
                    {getStatusLabel(customer.status)}
                  </StatusBadge>
                </TableCell>
                <TableCell>{customer.account_manager}</TableCell>
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

export default CustomersPage
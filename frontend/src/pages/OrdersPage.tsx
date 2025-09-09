import React, { useState } from 'react'
import styled from 'styled-components'
import { Order, ORDER_STATUSES } from '../types'

const PageContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
`

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`

const SearchSection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  flex-wrap: wrap;
`

const SearchInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  }
`

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  background: white;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  }
`

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' | 'success' }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.normal};
  
  ${({ theme, $variant = 'primary' }) => {
    switch ($variant) {
      case 'primary':
        return `
          background-color: ${theme.colors.primary};
          color: ${theme.colors.white};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primaryHover};
          }
        `
      case 'secondary':
        return `
          background-color: ${theme.colors.gray500};
          color: ${theme.colors.white};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray600};
          }
        `
      case 'danger':
        return `
          background-color: ${theme.colors.danger};
          color: ${theme.colors.white};
          &:hover:not(:disabled) {
            background-color: #c82333;
          }
        `
      case 'success':
        return `
          background-color: ${theme.colors.success};
          color: ${theme.colors.white};
          &:hover:not(:disabled) {
            background-color: #1e7e34;
          }
        `
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const StatsSection = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.gray50};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xxxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const Th = styled.th`
  background-color: ${({ theme }) => theme.colors.gray100};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: left;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  color: ${({ theme }) => theme.colors.textPrimary};
`

const StatusBadge = styled.span<{ $status: keyof typeof ORDER_STATUSES }>`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  
  ${({ theme, $status }) => {
    switch ($status) {
      case 'pending':
        return `
          background-color: ${theme.colors.warning};
          color: ${theme.colors.dark};
        `
      case 'confirmed':
        return `
          background-color: ${theme.colors.info};
          color: ${theme.colors.white};
        `
      case 'shipped':
        return `
          background-color: ${theme.colors.primary};
          color: ${theme.colors.white};
        `
      case 'delivered':
        return `
          background-color: ${theme.colors.success};
          color: ${theme.colors.white};
        `
      case 'cancelled':
        return `
          background-color: ${theme.colors.danger};
          color: ${theme.colors.white};
        `
    }
  }}
`

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`

const PriceText = styled.span`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.success};
`

const OrdersPage: React.FC = () => {
  // サンプルデータ
  const [orders] = useState<Order[]>([
    {
      id: 1,
      order_number: 'ORD20240115001',
      customer_id: 1,
      total_amount: 725000,
      status: 'delivered',
      order_date: '2024-01-15T09:00:00Z',
      created_at: '2024-01-15T09:00:00Z',
      updated_at: '2024-01-20T15:30:00Z',
      created_by: 1,
      customer: {
        id: 1,
        name: '株式会社サンプル',
        customer_code: 'CUST001'
      }
    },
    {
      id: 2,
      order_number: 'ORD20240116001',
      customer_id: 2,
      total_amount: 12000,
      status: 'shipped',
      order_date: '2024-01-16T10:30:00Z',
      created_at: '2024-01-16T10:30:00Z',
      updated_at: '2024-01-18T14:20:00Z',
      created_by: 1,
      customer: {
        id: 2,
        name: '田中太郎',
        customer_code: 'CUST002'
      }
    },
    {
      id: 3,
      order_number: 'ORD20240117001',
      customer_id: 3,
      total_amount: 1585000,
      status: 'confirmed',
      order_date: '2024-01-17T14:15:00Z',
      created_at: '2024-01-17T14:15:00Z',
      updated_at: '2024-01-17T16:45:00Z',
      created_by: 1,
      customer: {
        id: 3,
        name: '山田商事株式会社',
        customer_code: 'CUST003'
      }
    },
    {
      id: 4,
      order_number: 'ORD20240118001',
      customer_id: 1,
      total_amount: 45000,
      status: 'pending',
      order_date: '2024-01-18T11:20:00Z',
      created_at: '2024-01-18T11:20:00Z',
      updated_at: '2024-01-18T11:20:00Z',
      created_by: 1,
      customer: {
        id: 1,
        name: '株式会社サンプル',
        customer_code: 'CUST001'
      }
    },
    {
      id: 5,
      order_number: 'ORD20240119001',
      customer_id: 2,
      total_amount: 8500,
      status: 'cancelled',
      order_date: '2024-01-19T16:45:00Z',
      created_at: '2024-01-19T16:45:00Z',
      updated_at: '2024-01-19T17:30:00Z',
      created_by: 1,
      customer: {
        id: 2,
        name: '田中太郎',
        customer_code: 'CUST002'
      }
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // 検索フィルタリング
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === '' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // 統計計算
  const totalOrders = orders.length
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total_amount, 0)
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const completedOrders = orders.filter(o => o.status === 'delivered').length

  const handleStatusChange = (orderId: number, newStatus: string) => {
    alert(`注文 #${orderId} のステータスを「${ORDER_STATUSES[newStatus as keyof typeof ORDER_STATUSES]}」に変更します（デモ版）`)
  }

  return (
    <PageContainer>
      <Header>
        <Title>注文管理</Title>
        <SearchSection>
          <SearchInput
            type="text"
            placeholder="注文番号・顧客名で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">全ステータス</option>
            <option value="pending">処理中</option>
            <option value="confirmed">確認済み</option>
            <option value="shipped">発送済み</option>
            <option value="delivered">配達完了</option>
            <option value="cancelled">キャンセル</option>
          </Select>
          <Button>検索</Button>
          <Button $variant="primary">
            新規注文
          </Button>
        </SearchSection>
      </Header>

      <StatsSection>
        <StatCard>
          <StatValue>{totalOrders}</StatValue>
          <StatLabel>総注文数</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>¥{totalRevenue.toLocaleString()}</StatValue>
          <StatLabel>総売上</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{pendingOrders}</StatValue>
          <StatLabel>処理中</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{completedOrders}</StatValue>
          <StatLabel>完了済み</StatLabel>
        </StatCard>
      </StatsSection>

      <Table>
        <thead>
          <tr>
            <Th>注文番号</Th>
            <Th>顧客名</Th>
            <Th>注文日</Th>
            <Th>金額</Th>
            <Th>ステータス</Th>
            <Th>最終更新</Th>
            <Th>操作</Th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <Td style={{ fontWeight: 'bold' }}>{order.order_number}</Td>
              <Td>
                <div>{order.customer?.name}</div>
                <div style={{ fontSize: '0.85em', color: '#666' }}>
                  {order.customer?.customer_code}
                </div>
              </Td>
              <Td>{new Date(order.order_date).toLocaleDateString('ja-JP')}</Td>
              <Td>
                <PriceText>¥{order.total_amount.toLocaleString()}</PriceText>
              </Td>
              <Td>
                <StatusBadge $status={order.status}>
                  {ORDER_STATUSES[order.status]}
                </StatusBadge>
              </Td>
              <Td>
                <div>{new Date(order.updated_at).toLocaleDateString('ja-JP')}</div>
                <div style={{ fontSize: '0.85em', color: '#666' }}>
                  {new Date(order.updated_at).toLocaleTimeString('ja-JP', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </Td>
              <Td>
                <ActionButtons>
                  <Button $variant="secondary" onClick={() => alert('詳細表示機能は準備中です')}>
                    詳細
                  </Button>
                  {order.status === 'pending' && (
                    <Button $variant="success" onClick={() => handleStatusChange(order.id, 'confirmed')}>
                      確認
                    </Button>
                  )}
                  {order.status === 'confirmed' && (
                    <Button $variant="primary" onClick={() => handleStatusChange(order.id, 'shipped')}>
                      発送
                    </Button>
                  )}
                  {(order.status === 'pending' || order.status === 'confirmed') && (
                    <Button $variant="danger" onClick={() => handleStatusChange(order.id, 'cancelled')}>
                      キャンセル
                    </Button>
                  )}
                </ActionButtons>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PageContainer>
  )
}

export default OrdersPage

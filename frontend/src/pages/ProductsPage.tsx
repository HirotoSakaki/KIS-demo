import React, { useState } from 'react'
import styled from 'styled-components'
import { Product } from '../types'

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

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
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

const StockBadge = styled.span<{ $level: 'high' | 'medium' | 'low' }>`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  
  ${({ theme, $level }) => {
    switch ($level) {
      case 'high':
        return `
          background-color: ${theme.colors.success};
          color: ${theme.colors.white};
        `
      case 'medium':
        return `
          background-color: ${theme.colors.warning};
          color: ${theme.colors.dark};
        `
      case 'low':
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
`

const PriceText = styled.span`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.success};
`

const ProductsPage: React.FC = () => {
  // サンプルデータ
  const [products] = useState<Product[]>([
    {
      id: 1,
      product_code: 'PROD001',
      name: 'ノートパソコン ThinkPad X1',
      description: '高性能ビジネス向けノートパソコン',
      price: 120000,
      stock_quantity: 45,
      category: 'コンピューター',
      created_at: '2024-01-15T09:00:00Z',
      updated_at: '2024-01-15T09:00:00Z',
      created_by: 1
    },
    {
      id: 2,
      product_code: 'PROD002',
      name: 'ワイヤレスマウス MX Master 3',
      description: 'エルゴノミクスデザインのワイヤレスマウス',
      price: 3500,
      stock_quantity: 180,
      category: '周辺機器',
      created_at: '2024-01-16T10:00:00Z',
      updated_at: '2024-01-16T10:00:00Z',
      created_by: 1
    },
    {
      id: 3,
      product_code: 'PROD003',
      name: 'モニター 24インチ 4K',
      description: '4K IPS液晶モニター',
      price: 45000,
      stock_quantity: 8,
      category: 'ディスプレイ',
      created_at: '2024-01-17T11:00:00Z',
      updated_at: '2024-01-17T11:00:00Z',
      created_by: 1
    },
    {
      id: 4,
      product_code: 'PROD004',
      name: 'メカニカルキーボード',
      description: 'メカニカルキーボード日本語配列',
      price: 8500,
      stock_quantity: 75,
      category: '周辺機器',
      created_at: '2024-01-18T12:00:00Z',
      updated_at: '2024-01-18T12:00:00Z',
      created_by: 1
    },
    {
      id: 5,
      product_code: 'PROD005',
      name: 'プリンター A4カラー',
      description: 'インクジェットプリンター',
      price: 15000,
      stock_quantity: 2,
      category: 'プリンター',
      created_at: '2024-01-19T13:00:00Z',
      updated_at: '2024-01-19T13:00:00Z',
      created_by: 1
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')

  // 検索フィルタリング
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 統計計算
  const totalProducts = products.length
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock_quantity), 0)
  const lowStockProducts = products.filter(p => p.stock_quantity < 10).length
  const categories = [...new Set(products.map(p => p.category))].length

  const getStockLevel = (quantity: number): 'high' | 'medium' | 'low' => {
    if (quantity >= 50) return 'high'
    if (quantity >= 10) return 'medium'
    return 'low'
  }

  return (
    <PageContainer>
      <Header>
        <Title>商品管理</Title>
        <SearchSection>
          <SearchInput
            type="text"
            placeholder="商品名・カテゴリで検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button>検索</Button>
          <Button $variant="primary">
            新規登録
          </Button>
        </SearchSection>
      </Header>

      <StatsSection>
        <StatCard>
          <StatValue>{totalProducts}</StatValue>
          <StatLabel>総商品数</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>¥{totalValue.toLocaleString()}</StatValue>
          <StatLabel>在庫総額</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{lowStockProducts}</StatValue>
          <StatLabel>在庫不足商品</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{categories}</StatValue>
          <StatLabel>カテゴリ数</StatLabel>
        </StatCard>
      </StatsSection>

      <Table>
        <thead>
          <tr>
            <Th>商品コード</Th>
            <Th>商品名</Th>
            <Th>カテゴリ</Th>
            <Th>価格</Th>
            <Th>在庫数</Th>
            <Th>在庫状況</Th>
            <Th>操作</Th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <Td>{product.product_code}</Td>
              <Td>
                <div style={{ fontWeight: 'bold' }}>{product.name}</div>
                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                  {product.description}
                </div>
              </Td>
              <Td>{product.category}</Td>
              <Td>
                <PriceText>¥{product.price.toLocaleString()}</PriceText>
              </Td>
              <Td>{product.stock_quantity}</Td>
              <Td>
                <StockBadge $level={getStockLevel(product.stock_quantity)}>
                  {getStockLevel(product.stock_quantity) === 'high' && '在庫十分'}
                  {getStockLevel(product.stock_quantity) === 'medium' && '在庫注意'}
                  {getStockLevel(product.stock_quantity) === 'low' && '在庫不足'}
                </StockBadge>
              </Td>
              <Td>
                <ActionButtons>
                  <Button $variant="secondary" onClick={() => alert('編集機能は準備中です')}>
                    編集
                  </Button>
                  <Button $variant="danger" onClick={() => alert('デモ版では削除機能は無効です')}>
                    削除
                  </Button>
                </ActionButtons>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PageContainer>
  )
}

export default ProductsPage

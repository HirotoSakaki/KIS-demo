import React, { useState } from 'react'
import styled from 'styled-components'

interface InventoryItem {
  id: number
  product_id: number
  product_code: string
  product_name: string
  category: string
  current_stock: number
  min_stock_level: number
  max_stock_level: number
  reorder_point: number
  reorder_quantity: number
  unit_cost: number
  unit_price: number
  location: string
  warehouse: string
  last_restocked: string
  last_sold: string
  supplier_name: string
  lead_time_days: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstocked'
  reserved_quantity: number
  available_quantity: number
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
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
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
  background: ${({ theme }) => theme.colors.gray50};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
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
  min-width: 250px;
  
  &:focus {
    outline: none;
    border-color: #fa709a;
    box-shadow: 0 0 0 3px rgba(250, 112, 154, 0.1);
  }
`

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  background: white;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: #fa709a;
    box-shadow: 0 0 0 3px rgba(250, 112, 154, 0.1);
  }
`

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'; $disabled?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.normal};
  position: relative;
  
  ${({ theme, $variant = 'primary', $disabled }) => {
    if ($disabled) {
      return `
        background-color: ${theme.colors.gray300};
        color: ${theme.colors.gray500};
        cursor: not-allowed;
        opacity: 0.6;
      `
    }
    
    switch ($variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
          color: ${theme.colors.white};
          &:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.md};
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
      case 'warning':
        return `
          background-color: ${theme.colors.warning};
          color: ${theme.colors.dark};
          &:hover:not(:disabled) {
            background-color: #e0a800;
          }
        `
    }
  }}
`

const DisabledTooltip = styled.div`
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
  
  ${Button}:hover & {
    opacity: 1;
  }
`

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.gray50};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const StatCard = styled.div<{ $color: string }>`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border-left: 4px solid ${({ $color }) => $color};
`

const StatValue = styled.div<{ $color: string }>`
  font-size: ${({ theme }) => theme.fontSize.xxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ $color }) => $color};
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

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  
  ${({ theme, $status }) => {
    switch ($status) {
      case 'in_stock':
        return `
          background-color: ${theme.colors.success};
          color: ${theme.colors.white};
        `
      case 'low_stock':
        return `
          background-color: ${theme.colors.warning};
          color: ${theme.colors.dark};
        `
      case 'out_of_stock':
        return `
          background-color: ${theme.colors.danger};
          color: ${theme.colors.white};
        `
      case 'overstocked':
        return `
          background-color: ${theme.colors.info};
          color: ${theme.colors.white};
        `
    }
  }}
`

const StockBar = styled.div<{ $percentage: number; $status: string }>`
  width: 100%;
  height: 20px;
  background: ${({ theme }) => theme.colors.gray200};
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  margin: 4px 0;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${({ $percentage }) => Math.min($percentage, 100)}%;
    background: ${({ theme, $status }) => {
      switch ($status) {
        case 'in_stock':
          return theme.colors.success
        case 'low_stock':
          return theme.colors.warning
        case 'out_of_stock':
          return theme.colors.danger
        case 'overstocked':
          return theme.colors.info
        default:
          return theme.colors.gray400
      }
    }};
    border-radius: 10px;
    transition: width 0.3s ease;
  }
`

const StockText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
  z-index: 1;
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

const AlertText = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: 12px;
`

const InventoryPage: React.FC = () => {
  const [inventory] = useState<InventoryItem[]>([
    {
      id: 1,
      product_id: 1,
      product_code: 'PROD001',
      product_name: 'ノートパソコン ThinkPad X1',
      category: 'コンピューター',
      current_stock: 45,
      min_stock_level: 10,
      max_stock_level: 100,
      reorder_point: 20,
      reorder_quantity: 50,
      unit_cost: 100000,
      unit_price: 120000,
      location: 'A-1-01',
      warehouse: '本社倉庫',
      last_restocked: '2024-01-05',
      last_sold: '2024-01-08',
      supplier_name: 'アジア電子部品株式会社',
      lead_time_days: 14,
      status: 'in_stock',
      reserved_quantity: 5,
      available_quantity: 40
    },
    {
      id: 2,
      product_id: 2,
      product_code: 'PROD002',
      product_name: 'ワイヤレスマウス MX Master 3',
      category: '周辺機器',
      current_stock: 8,
      min_stock_level: 20,
      max_stock_level: 200,
      reorder_point: 30,
      reorder_quantity: 100,
      unit_cost: 2800,
      unit_price: 3500,
      location: 'B-2-15',
      warehouse: '本社倉庫',
      last_restocked: '2023-12-20',
      last_sold: '2024-01-09',
      supplier_name: 'パシフィック樹脂工業',
      lead_time_days: 10,
      status: 'low_stock',
      reserved_quantity: 3,
      available_quantity: 5
    },
    {
      id: 3,
      product_id: 3,
      product_code: 'PROD003',
      product_name: 'モニター 24インチ 4K',
      category: 'ディスプレイ',
      current_stock: 0,
      min_stock_level: 5,
      max_stock_level: 50,
      reorder_point: 10,
      reorder_quantity: 25,
      unit_cost: 38000,
      unit_price: 45000,
      location: 'C-1-08',
      warehouse: '本社倉庫',
      last_restocked: '2023-11-15',
      last_sold: '2024-01-02',
      supplier_name: '中部製鋼所',
      lead_time_days: 21,
      status: 'out_of_stock',
      reserved_quantity: 0,
      available_quantity: 0
    },
    {
      id: 4,
      product_id: 4,
      product_code: 'PROD004',
      product_name: 'メカニカルキーボード',
      category: '周辺機器',
      current_stock: 150,
      min_stock_level: 30,
      max_stock_level: 100,
      reorder_point: 50,
      reorder_quantity: 80,
      unit_cost: 7000,
      unit_price: 8500,
      location: 'B-3-22',
      warehouse: '本社倉庫',
      last_restocked: '2024-01-01',
      last_sold: '2024-01-07',
      supplier_name: 'アジア電子部品株式会社',
      lead_time_days: 14,
      status: 'overstocked',
      reserved_quantity: 10,
      available_quantity: 140
    },
    {
      id: 5,
      product_id: 5,
      product_code: 'PROD005',
      product_name: 'プリンター A4カラー',
      category: 'プリンター',
      current_stock: 25,
      min_stock_level: 15,
      max_stock_level: 60,
      reorder_point: 25,
      reorder_quantity: 30,
      unit_cost: 12500,
      unit_price: 15000,
      location: 'D-1-03',
      warehouse: '支店倉庫',
      last_restocked: '2023-12-28',
      last_sold: '2024-01-06',
      supplier_name: '関西化学工業',
      lead_time_days: 7,
      status: 'in_stock',
      reserved_quantity: 2,
      available_quantity: 23
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [warehouseFilter, setWarehouseFilter] = useState('')

  // ユーザー権限（モック）
  const userPermissions = {
    canAdjustStock: true,
    canReorder: false, // 発注権限なし
    canTransfer: true,
    canSetLevels: false, // 在庫レベル設定権限なし
    canViewCosts: true
  }

  // フィルタリング
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === '' || item.status === statusFilter
    const matchesCategory = categoryFilter === '' || item.category === categoryFilter
    const matchesWarehouse = warehouseFilter === '' || item.warehouse === warehouseFilter
    
    return matchesSearch && matchesStatus && matchesCategory && matchesWarehouse
  })

  // 統計計算
  const totalItems = inventory.length
  const lowStockItems = inventory.filter(item => item.status === 'low_stock').length
  const outOfStockItems = inventory.filter(item => item.status === 'out_of_stock').length
  const totalValue = inventory.reduce((sum, item) => sum + (item.current_stock * item.unit_cost), 0)

  const getStatusLabel = (status: string) => {
    const labels = {
      in_stock: '在庫あり',
      low_stock: '在庫不足',
      out_of_stock: '在庫切れ',
      overstocked: '過剰在庫'
    }
    return labels[status as keyof typeof labels] || status
  }

  const getStockPercentage = (current: number, max: number) => {
    return (current / max) * 100
  }

  const needsReorder = (item: InventoryItem) => {
    return item.current_stock <= item.reorder_point
  }

  return (
    <PageContainer>
      <Header>
        <Title>在庫管理</Title>
        <Subtitle>リアルタイムで在庫状況を監視し、効率的な在庫運用を実現</Subtitle>
      </Header>

      <ControlsSection>
        <SearchSection>
          <SearchInput
            type="text"
            placeholder="商品名・コード・ロケーションで検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">全ステータス</option>
            <option value="in_stock">在庫あり</option>
            <option value="low_stock">在庫不足</option>
            <option value="out_of_stock">在庫切れ</option>
            <option value="overstocked">過剰在庫</option>
          </Select>
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">全カテゴリ</option>
            <option value="コンピューター">コンピューター</option>
            <option value="周辺機器">周辺機器</option>
            <option value="ディスプレイ">ディスプレイ</option>
            <option value="プリンター">プリンター</option>
          </Select>
          <Select value={warehouseFilter} onChange={(e) => setWarehouseFilter(e.target.value)}>
            <option value="">全倉庫</option>
            <option value="本社倉庫">本社倉庫</option>
            <option value="支店倉庫">支店倉庫</option>
          </Select>
          <Button>検索</Button>
        </SearchSection>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button $variant="warning" $disabled={!userPermissions.canAdjustStock}>
            {!userPermissions.canAdjustStock && <DisabledTooltip>在庫調整権限がありません</DisabledTooltip>}
            在庫調整
          </Button>
          <Button $variant="primary" $disabled={!userPermissions.canReorder}>
            {!userPermissions.canReorder && <DisabledTooltip>発注権限がありません</DisabledTooltip>}
            一括発注
          </Button>
        </div>
      </ControlsSection>

      <StatsContainer>
        <StatCard $color="#fa709a">
          <StatValue $color="#fa709a">{totalItems}</StatValue>
          <StatLabel>管理商品数</StatLabel>
        </StatCard>
        <StatCard $color="#f59e0b">
          <StatValue $color="#f59e0b">{lowStockItems}</StatValue>
          <StatLabel>在庫不足</StatLabel>
        </StatCard>
        <StatCard $color="#ef4444">
          <StatValue $color="#ef4444">{outOfStockItems}</StatValue>
          <StatLabel>在庫切れ</StatLabel>
        </StatCard>
        <StatCard $color="#10b981">
          <StatValue $color="#10b981">¥{totalValue.toLocaleString()}</StatValue>
          <StatLabel>総在庫価値</StatLabel>
        </StatCard>
      </StatsContainer>

      <Table>
        <thead>
          <tr>
            <Th>商品情報</Th>
            <Th>在庫状況</Th>
            <Th>ロケーション</Th>
            <Th>仕入先</Th>
            <Th>価格情報</Th>
            <Th>最終活動</Th>
            <Th>操作</Th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map((item) => (
            <tr key={item.id}>
              <Td>
                <div style={{ fontWeight: 'bold' }}>{item.product_name}</div>
                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                  🏷️ {item.product_code} ({item.category})
                </div>
                <StatusBadge $status={item.status}>
                  {getStatusLabel(item.status)}
                </StatusBadge>
              </Td>
              <Td>
                <div style={{ position: 'relative', marginBottom: '8px' }}>
                  <StockBar 
                    $percentage={getStockPercentage(item.current_stock, item.max_stock_level)} 
                    $status={item.status}
                  />
                  <StockText>
                    {item.current_stock}/{item.max_stock_level}
                  </StockText>
                </div>
                <div style={{ fontSize: '0.85em', display: 'flex', justifyContent: 'space-between' }}>
                  <span>利用可能: {item.available_quantity}</span>
                  <span>予約済: {item.reserved_quantity}</span>
                </div>
                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                  最小: {item.min_stock_level} | 発注点: {item.reorder_point}
                </div>
                {needsReorder(item) && (
                  <AlertText>🚨 発注が必要です</AlertText>
                )}
              </Td>
              <Td>
                <div style={{ fontWeight: 'bold' }}>{item.location}</div>
                <div style={{ fontSize: '0.85em', color: '#666' }}>
                  📍 {item.warehouse}
                </div>
              </Td>
              <Td>
                <div>{item.supplier_name}</div>
                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                  🚚 リードタイム: {item.lead_time_days}日
                </div>
                <div style={{ fontSize: '0.85em', color: '#666' }}>
                  📦 発注量: {item.reorder_quantity}個
                </div>
              </Td>
              <Td>
                {userPermissions.canViewCosts ? (
                  <>
                    <div>原価: <span style={{ color: '#ef4444' }}>¥{item.unit_cost.toLocaleString()}</span></div>
                    <div>売価: <PriceText>¥{item.unit_price.toLocaleString()}</PriceText></div>
                    <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                      利益率: {(((item.unit_price - item.unit_cost) / item.unit_price) * 100).toFixed(1)}%
                    </div>
                  </>
                ) : (
                  <span style={{ color: '#999' }}>権限なし</span>
                )}
              </Td>
              <Td>
                <div style={{ fontSize: '0.85em' }}>
                  <div>入庫: {new Date(item.last_restocked).toLocaleDateString('ja-JP')}</div>
                  <div style={{ marginTop: '4px' }}>
                    出庫: {new Date(item.last_sold).toLocaleDateString('ja-JP')}
                  </div>
                </div>
              </Td>
              <Td>
                <ActionButtons>
                  <Button $variant="secondary" onClick={() => alert('詳細表示機能は準備中です')}>
                    詳細
                  </Button>
                  <Button 
                    $variant="warning" 
                    $disabled={!userPermissions.canAdjustStock}
                    onClick={() => alert(userPermissions.canAdjustStock ? '在庫調整機能は準備中です' : '在庫調整権限がありません')}
                  >
                    {!userPermissions.canAdjustStock && <DisabledTooltip>在庫調整権限がありません</DisabledTooltip>}
                    調整
                  </Button>
                  <Button 
                    $variant="success" 
                    $disabled={!userPermissions.canTransfer}
                    onClick={() => alert(userPermissions.canTransfer ? '移動機能は準備中です' : '移動権限がありません')}
                  >
                    {!userPermissions.canTransfer && <DisabledTooltip>移動権限がありません</DisabledTooltip>}
                    移動
                  </Button>
                  {needsReorder(item) && (
                    <Button 
                      $variant="primary" 
                      $disabled={!userPermissions.canReorder}
                      onClick={() => alert(userPermissions.canReorder ? '発注機能は準備中です' : '発注権限がありません')}
                    >
                      {!userPermissions.canReorder && <DisabledTooltip>発注権限がありません</DisabledTooltip>}
                      発注
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

export default InventoryPage

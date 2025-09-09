import React, { useState } from 'react'
import styled from 'styled-components'

interface Cargo {
  id: number
  bl_number: string
  booking_number: string
  container_numbers: string[]
  shipper_name: string
  consignee_name: string
  commodity: string
  cargo_type: 'FCL' | 'LCL' | 'Break_Bulk' | 'Reefer'
  weight_kg: number
  volume_cbm: number
  teu_count: number
  port_of_loading: string
  port_of_discharge: string
  vessel_name: string
  voyage_number: string
  etd: string
  eta: string
  cargo_status: 'booking' | 'loaded' | 'in_transit' | 'discharged' | 'delivered'
  temperature?: number
  special_handling: string[]
  dangerous_goods: boolean
  customs_status: 'pending' | 'cleared' | 'examination'
  documentation_complete: boolean
  freight_charges: number
  currency: string
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
  background: linear-gradient(135deg, #7c2d12 0%, #ea580c 30%, #f97316 100%);
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '📦';
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
    border-color: #ea580c;
    box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
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
    border-color: #ea580c;
    box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
  }
`

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' | 'success'; $disabled?: boolean }>`
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
          background: linear-gradient(135deg, #7c2d12 0%, #ea580c 100%);
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
    }
  }}
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
      case 'booking':
        return `
          background-color: ${theme.colors.warning};
          color: ${theme.colors.dark};
        `
      case 'loaded':
        return `
          background-color: ${theme.colors.info};
          color: ${theme.colors.white};
        `
      case 'in_transit':
        return `
          background-color: #7c2d12;
          color: ${theme.colors.white};
        `
      case 'discharged':
        return `
          background-color: #ea580c;
          color: ${theme.colors.white};
        `
      case 'delivered':
        return `
          background-color: ${theme.colors.success};
          color: ${theme.colors.white};
        `
    }
  }}
`

const TypeBadge = styled.span<{ $type: string }>`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  
  ${({ theme, $type }) => {
    switch ($type) {
      case 'FCL':
        return `
          background-color: #7c2d12;
          color: ${theme.colors.white};
        `
      case 'LCL':
        return `
          background-color: #ea580c;
          color: ${theme.colors.white};
        `
      case 'Break_Bulk':
        return `
          background-color: #f97316;
          color: ${theme.colors.white};
        `
      case 'Reefer':
        return `
          background-color: #059669;
          color: ${theme.colors.white};
        `
    }
  }}
`

const SpecialBadge = styled.span`
  display: inline-block;
  padding: 2px 6px;
  margin: 2px;
  background: #dc2626;
  color: white;
  border-radius: 12px;
  font-size: 10px;
  font-weight: bold;
`

const CustomsBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  
  ${({ theme, $status }) => {
    switch ($status) {
      case 'pending':
        return `
          background-color: ${theme.colors.warning};
          color: ${theme.colors.dark};
        `
      case 'cleared':
        return `
          background-color: ${theme.colors.success};
          color: ${theme.colors.white};
        `
      case 'examination':
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

const WeightText = styled.span`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: #7c2d12;
`

const CargoPage: React.FC = () => {
  const [cargos] = useState<Cargo[]>([
    {
      id: 1,
      bl_number: 'KLNE240101001',
      booking_number: 'BKG240101001',
      container_numbers: ['KLNU1234567', 'KLNU1234568'],
      shipper_name: 'トヨタ自動車株式会社',
      consignee_name: 'Toyota Motor North America',
      commodity: '自動車部品',
      cargo_type: 'FCL',
      weight_kg: 24500,
      volume_cbm: 67.2,
      teu_count: 2,
      port_of_loading: '名古屋港',
      port_of_discharge: 'Long Beach',
      vessel_name: 'KAWASAKI PIONEER',
      voyage_number: 'TOK-LAX-001',
      etd: '2024-01-15T10:00:00Z',
      eta: '2024-01-30T08:00:00Z',
      cargo_status: 'in_transit',
      special_handling: [],
      dangerous_goods: false,
      customs_status: 'cleared',
      documentation_complete: true,
      freight_charges: 2450000,
      currency: 'JPY'
    },
    {
      id: 2,
      bl_number: 'KLNE240102002',
      booking_number: 'BKG240102002',
      container_numbers: ['KLNU2345678'],
      shipper_name: 'Samsung Electronics',
      consignee_name: 'Samsung America Inc.',
      commodity: '電子部品',
      cargo_type: 'FCL',
      weight_kg: 18200,
      volume_cbm: 58.5,
      teu_count: 1,
      port_of_loading: '釜山港',
      port_of_discharge: 'Los Angeles',
      vessel_name: 'KLINE VOYAGER',
      voyage_number: 'SIN-LAX-042',
      etd: '2024-01-18T14:30:00Z',
      eta: '2024-02-05T12:00:00Z',
      cargo_status: 'loaded',
      special_handling: ['温度管理'],
      dangerous_goods: false,
      customs_status: 'pending',
      documentation_complete: true,
      freight_charges: 185000,
      currency: 'USD'
    },
    {
      id: 3,
      bl_number: 'KLNE240103003',
      booking_number: 'BKG240103003',
      container_numbers: ['REFR3456789'],
      shipper_name: '日本水産株式会社',
      consignee_name: 'Seafood Importers LLC',
      commodity: '冷凍魚介類',
      cargo_type: 'Reefer',
      weight_kg: 22000,
      volume_cbm: 62.0,
      teu_count: 1,
      port_of_loading: '東京港',
      port_of_discharge: 'Seattle',
      vessel_name: 'REEFER EXPRESS',
      voyage_number: 'TOK-SEA-015',
      etd: '2024-01-20T06:00:00Z',
      eta: '2024-02-08T18:00:00Z',
      cargo_status: 'booking',
      temperature: -18,
      special_handling: ['冷凍保管', '温度記録'],
      dangerous_goods: false,
      customs_status: 'pending',
      documentation_complete: false,
      freight_charges: 320000,
      currency: 'USD'
    },
    {
      id: 4,
      bl_number: 'KLNE240104004',
      booking_number: 'BKG240104004',
      container_numbers: ['KLNU4567890', 'KLNU4567891', 'KLNU4567892'],
      shipper_name: '三菱重工業株式会社',
      consignee_name: 'Heavy Industries Europe',
      commodity: '産業機械',
      cargo_type: 'FCL',
      weight_kg: 45000,
      volume_cbm: 95.5,
      teu_count: 3,
      port_of_loading: '神戸港',
      port_of_discharge: 'Rotterdam',
      vessel_name: 'PACIFIC BULK',
      voyage_number: 'KOB-RTM-008',
      etd: '2024-01-25T09:00:00Z',
      eta: '2024-02-20T15:00:00Z',
      cargo_status: 'discharged',
      special_handling: ['重量物'],
      dangerous_goods: false,
      customs_status: 'examination',
      documentation_complete: true,
      freight_charges: 4500000,
      currency: 'JPY'
    },
    {
      id: 5,
      bl_number: 'KLNE240105005',
      booking_number: 'BKG240105005',
      container_numbers: ['HZRD5678901'],
      shipper_name: '住友化学株式会社',
      consignee_name: 'Chemical Solutions Inc.',
      commodity: '工業用化学品',
      cargo_type: 'FCL',
      weight_kg: 19500,
      volume_cbm: 45.2,
      teu_count: 1,
      port_of_loading: '横浜港',
      port_of_discharge: 'New York',
      vessel_name: 'ENERGY FRONTIER',
      voyage_number: 'YOK-NYC-012',
      etd: '2024-01-28T12:00:00Z',
      eta: '2024-02-18T10:00:00Z',
      cargo_status: 'delivered',
      special_handling: ['危険物', '特別取扱'],
      dangerous_goods: true,
      customs_status: 'cleared',
      documentation_complete: true,
      freight_charges: 285000,
      currency: 'USD'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  // フィルタリング
  const filteredCargos = cargos.filter(cargo => {
    const matchesSearch = 
      cargo.bl_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cargo.booking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cargo.shipper_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cargo.container_numbers.some(num => num.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === '' || cargo.cargo_status === statusFilter
    const matchesType = typeFilter === '' || cargo.cargo_type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  // 統計計算
  const totalCargos = cargos.length
  const inTransitCargos = cargos.filter(c => c.cargo_status === 'in_transit' || c.cargo_status === 'loaded').length
  const totalTEU = cargos.reduce((sum, c) => sum + c.teu_count, 0)
  const totalWeight = cargos.reduce((sum, c) => sum + c.weight_kg, 0)

  const getStatusLabel = (status: string) => {
    const labels = {
      booking: '予約済み',
      loaded: '積載済み',
      in_transit: '輸送中',
      discharged: '荷卸済み',
      delivered: '配達完了'
    }
    return labels[status as keyof typeof labels] || status
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      FCL: 'FCL',
      LCL: 'LCL',
      Break_Bulk: '在来船',
      Reefer: '冷凍貨物'
    }
    return labels[type as keyof typeof labels] || type
  }

  const getCustomsLabel = (status: string) => {
    const labels = {
      pending: '申告中',
      cleared: '通関済み',
      examination: '検査中'
    }
    return labels[status as keyof typeof labels] || status
  }

  return (
    <PageContainer>
      <Header>
        <Title>貨物・積荷管理</Title>
        <Subtitle>グローバル輸送ネットワーク - リアルタイム貨物追跡システム</Subtitle>
      </Header>

      <ControlsSection>
        <SearchSection>
          <SearchInput
            type="text"
            placeholder="B/L番号・Booking番号・荷主名で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">全ステータス</option>
            <option value="booking">予約済み</option>
            <option value="loaded">積載済み</option>
            <option value="in_transit">輸送中</option>
            <option value="discharged">荷卸済み</option>
            <option value="delivered">配達完了</option>
          </Select>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">全貨物タイプ</option>
            <option value="FCL">FCL</option>
            <option value="LCL">LCL</option>
            <option value="Break_Bulk">在来船</option>
            <option value="Reefer">冷凍貨物</option>
          </Select>
          <Button>検索</Button>
        </SearchSection>
        
        <Button $variant="primary">
          新規Booking
        </Button>
      </ControlsSection>

      <StatsContainer>
        <StatCard $color="#7c2d12">
          <StatValue $color="#7c2d12">{totalCargos}</StatValue>
          <StatLabel>総貨物件数</StatLabel>
        </StatCard>
        <StatCard $color="#ea580c">
          <StatValue $color="#ea580c">{inTransitCargos}</StatValue>
          <StatLabel>輸送中</StatLabel>
        </StatCard>
        <StatCard $color="#f97316">
          <StatValue $color="#f97316">{totalTEU} TEU</StatValue>
          <StatLabel>総コンテナ数</StatLabel>
        </StatCard>
        <StatCard $color="#10b981">
          <StatValue $color="#10b981">{(totalWeight / 1000).toFixed(1)}t</StatValue>
          <StatLabel>総重量</StatLabel>
        </StatCard>
      </StatsContainer>

      <Table>
        <thead>
          <tr>
            <Th>B/L・Booking情報</Th>
            <Th>荷主・荷受人</Th>
            <Th>貨物情報</Th>
            <Th>航路・船舶</Th>
            <Th>スケジュール</Th>
            <Th>通関・書類</Th>
            <Th>ステータス</Th>
            <Th>操作</Th>
          </tr>
        </thead>
        <tbody>
          {filteredCargos.map((cargo) => (
            <tr key={cargo.id}>
              <Td>
                <div style={{ fontWeight: 'bold' }}>B/L: {cargo.bl_number}</div>
                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                  📋 BKG: {cargo.booking_number}
                </div>
                <div style={{ fontSize: '0.85em', color: '#666' }}>
                  📦 {cargo.container_numbers.join(', ')}
                </div>
              </Td>
              <Td>
                <div style={{ fontWeight: 'bold' }}>🏭 {cargo.shipper_name}</div>
                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                  🏢 {cargo.consignee_name}
                </div>
              </Td>
              <Td>
                <TypeBadge $type={cargo.cargo_type}>
                  {getTypeLabel(cargo.cargo_type)}
                </TypeBadge>
                <div style={{ marginTop: '4px' }}>
                  <WeightText>{(cargo.weight_kg / 1000).toFixed(1)}t</WeightText>
                  <span style={{ fontSize: '0.85em', color: '#666', marginLeft: '8px' }}>
                    {cargo.volume_cbm}㎥
                  </span>
                </div>
                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                  📦 {cargo.commodity}
                </div>
                {cargo.temperature && (
                  <div style={{ fontSize: '0.85em', color: '#059669', fontWeight: 'bold' }}>
                    🌡️ {cargo.temperature}°C
                  </div>
                )}
                {cargo.dangerous_goods && (
                  <SpecialBadge>⚠️ 危険物</SpecialBadge>
                )}
                {cargo.special_handling.map((handling, index) => (
                  <SpecialBadge key={index}>{handling}</SpecialBadge>
                ))}
              </Td>
              <Td>
                <div style={{ fontWeight: 'bold' }}>
                  {cargo.port_of_loading} → {cargo.port_of_discharge}
                </div>
                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                  🚢 {cargo.vessel_name}
                </div>
                <div style={{ fontSize: '0.85em', color: '#666' }}>
                  📋 {cargo.voyage_number}
                </div>
              </Td>
              <Td>
                <div style={{ fontSize: '0.85em' }}>
                  <div>ETD: {new Date(cargo.etd).toLocaleDateString('ja-JP')}</div>
                  <div style={{ marginTop: '2px' }}>
                    ETA: {new Date(cargo.eta).toLocaleDateString('ja-JP')}
                  </div>
                </div>
              </Td>
              <Td>
                <CustomsBadge $status={cargo.customs_status}>
                  {getCustomsLabel(cargo.customs_status)}
                </CustomsBadge>
                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                  書類: {cargo.documentation_complete ? '✅ 完了' : '⏳ 未完了'}
                </div>
                <div style={{ fontSize: '0.85em', color: '#666' }}>
                  運賃: {cargo.freight_charges.toLocaleString()} {cargo.currency}
                </div>
              </Td>
              <Td>
                <StatusBadge $status={cargo.cargo_status}>
                  {getStatusLabel(cargo.cargo_status)}
                </StatusBadge>
              </Td>
              <Td>
                <ActionButtons>
                  <Button $variant="secondary" onClick={() => alert('詳細表示機能は準備中です')}>
                    詳細
                  </Button>
                  <Button 
                    $variant="primary" 
                    onClick={() => alert('追跡機能は準備中です')}
                  >
                    追跡
                  </Button>
                  {!cargo.documentation_complete && (
                    <Button 
                      $variant="success" 
                      onClick={() => alert('書類管理機能は準備中です')}
                    >
                      書類
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

export default CargoPage

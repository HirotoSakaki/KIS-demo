import React, { useState } from 'react'
import styled from 'styled-components'

interface Vessel {
  id: number
  vessel_name: string
  imo_number: string
  call_sign: string
  vessel_type: 'container' | 'bulk' | 'tanker' | 'car_carrier' | 'reefer'
  ownership: 'owned' | 'chartered' | 'slot_charter'
  built_year: number
  flag: string
  gross_tonnage: number
  dwt: number
  teu_capacity?: number
  current_location: string
  current_voyage: string
  next_port: string
  eta_next_port: string
  operational_status: 'in_service' | 'maintenance' | 'dry_dock' | 'idle'
  crew_count: number
  captain_name: string
  operator: string
  last_inspection: string
  next_maintenance: string
  fuel_consumption_daily: number
  co2_emission_daily: number
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
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #334155 100%);
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '⚓';
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
    border-color: #334155;
    box-shadow: 0 0 0 3px rgba(51, 65, 85, 0.1);
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
    border-color: #334155;
    box-shadow: 0 0 0 3px rgba(51, 65, 85, 0.1);
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
          background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
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
      case 'in_service':
        return `
          background-color: ${theme.colors.success};
          color: ${theme.colors.white};
        `
      case 'maintenance':
        return `
          background-color: ${theme.colors.warning};
          color: ${theme.colors.dark};
        `
      case 'dry_dock':
        return `
          background-color: ${theme.colors.info};
          color: ${theme.colors.white};
        `
      case 'idle':
        return `
          background-color: ${theme.colors.gray500};
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
      case 'container':
        return `
          background-color: #0f172a;
          color: ${theme.colors.white};
        `
      case 'bulk':
        return `
          background-color: #7c2d12;
          color: ${theme.colors.white};
        `
      case 'tanker':
        return `
          background-color: #dc2626;
          color: ${theme.colors.white};
        `
      case 'car_carrier':
        return `
          background-color: #1d4ed8;
          color: ${theme.colors.white};
        `
      case 'reefer':
        return `
          background-color: #059669;
          color: ${theme.colors.white};
        `
    }
  }}
`

const OwnershipBadge = styled.span<{ $ownership: string }>`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  margin-left: 4px;
  
  ${({ theme, $ownership }) => {
    switch ($ownership) {
      case 'owned':
        return `
          background-color: ${theme.colors.success};
          color: ${theme.colors.white};
        `
      case 'chartered':
        return `
          background-color: ${theme.colors.warning};
          color: ${theme.colors.dark};
        `
      case 'slot_charter':
        return `
          background-color: ${theme.colors.info};
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

const CapacityText = styled.span`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: #0f172a;
`

const VesselsPage: React.FC = () => {
  const [vessels] = useState<Vessel[]>([
    {
      id: 1,
      vessel_name: 'KAWASAKI PIONEER',
      imo_number: '9876543',
      call_sign: 'JKAW1',
      vessel_type: 'container',
      ownership: 'owned',
      built_year: 2019,
      flag: 'Japan',
      gross_tonnage: 220000,
      dwt: 200000,
      teu_capacity: 20000,
      current_location: '東京港',
      current_voyage: 'TOK-LAX-001',
      next_port: 'Los Angeles',
      eta_next_port: '2024-01-20T08:00:00Z',
      operational_status: 'in_service',
      crew_count: 24,
      captain_name: '田中船長',
      operator: '川崎汽船',
      last_inspection: '2023-12-15',
      next_maintenance: '2024-06-15',
      fuel_consumption_daily: 180,
      co2_emission_daily: 560
    },
    {
      id: 2,
      vessel_name: 'KLINE VOYAGER',
      imo_number: '9765432',
      call_sign: 'JKLN2',
      vessel_type: 'container',
      ownership: 'chartered',
      built_year: 2018,
      flag: 'Japan',
      gross_tonnage: 180000,
      dwt: 165000,
      teu_capacity: 16000,
      current_location: 'Singapore',
      current_voyage: 'SIN-HKG-042',
      next_port: 'Hong Kong',
      eta_next_port: '2024-01-18T14:30:00Z',
      operational_status: 'in_service',
      crew_count: 22,
      captain_name: '佐藤船長',
      operator: '川崎汽船',
      last_inspection: '2024-01-05',
      next_maintenance: '2024-04-20',
      fuel_consumption_daily: 165,
      co2_emission_daily: 520
    },
    {
      id: 3,
      vessel_name: 'PACIFIC BULK',
      imo_number: '9654321',
      call_sign: 'JPAC3',
      vessel_type: 'bulk',
      ownership: 'owned',
      built_year: 2016,
      flag: 'Japan',
      gross_tonnage: 95000,
      dwt: 180000,
      current_location: 'Newcastle',
      current_voyage: 'NEW-YOK-018',
      next_port: '横浜港',
      eta_next_port: '2024-01-25T06:00:00Z',
      operational_status: 'in_service',
      crew_count: 21,
      captain_name: 'Williams Captain',
      operator: '川崎汽船',
      last_inspection: '2023-11-30',
      next_maintenance: '2024-08-10',
      fuel_consumption_daily: 120,
      co2_emission_daily: 375
    },
    {
      id: 4,
      vessel_name: 'ENERGY FRONTIER',
      imo_number: '9543210',
      call_sign: 'JENR4',
      vessel_type: 'tanker',
      ownership: 'slot_charter',
      built_year: 2020,
      flag: 'Japan',
      gross_tonnage: 160000,
      dwt: 300000,
      current_location: 'Dubai',
      current_voyage: 'DXB-CHI-005',
      next_port: '千葉港',
      eta_next_port: '2024-01-28T12:00:00Z',
      operational_status: 'in_service',
      crew_count: 26,
      captain_name: 'Ahmed Captain',
      operator: 'Partner Shipping',
      last_inspection: '2024-01-08',
      next_maintenance: '2024-07-15',
      fuel_consumption_daily: 200,
      co2_emission_daily: 625
    },
    {
      id: 5,
      vessel_name: 'AUTO CARRIER SEVEN',
      imo_number: '9432109',
      call_sign: 'JAUTO5',
      vessel_type: 'car_carrier',
      ownership: 'chartered',
      built_year: 2017,
      flag: 'Panama',
      gross_tonnage: 75000,
      dwt: 22000,
      current_location: '神戸港',
      current_voyage: 'KOB-MAINT-001',
      next_port: '神戸港',
      eta_next_port: '2024-02-15T09:00:00Z',
      operational_status: 'maintenance',
      crew_count: 18,
      captain_name: '鈴木船長',
      operator: '川崎汽船',
      last_inspection: '2023-10-20',
      next_maintenance: '2024-02-15',
      fuel_consumption_daily: 85,
      co2_emission_daily: 265
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  // フィルタリング
  const filteredVessels = vessels.filter(vessel => {
    const matchesSearch = 
      vessel.vessel_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vessel.imo_number.includes(searchTerm) ||
      vessel.current_location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === '' || vessel.operational_status === statusFilter
    const matchesType = typeFilter === '' || vessel.vessel_type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  // 統計計算
  const totalVessels = vessels.length
  const activeVessels = vessels.filter(v => v.operational_status === 'in_service').length
  const totalTEU = vessels.filter(v => v.teu_capacity).reduce((sum, v) => sum + (v.teu_capacity || 0), 0)
  const totalCO2 = vessels.reduce((sum, v) => sum + v.co2_emission_daily, 0)

  const getStatusLabel = (status: string) => {
    const labels = {
      in_service: '運航中',
      maintenance: 'メンテナンス',
      dry_dock: 'ドック入り',
      idle: '待機中'
    }
    return labels[status as keyof typeof labels] || status
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      container: 'コンテナ船',
      bulk: 'バルク船',
      tanker: 'タンカー',
      car_carrier: '自動車船',
      reefer: '冷凍船'
    }
    return labels[type as keyof typeof labels] || type
  }

  const getOwnershipLabel = (ownership: string) => {
    const labels = {
      owned: '自社船',
      chartered: '傭船',
      slot_charter: 'スロット傭船'
    }
    return labels[ownership as keyof typeof labels] || ownership
  }

  return (
    <PageContainer>
      <Header>
        <Title>船舶・運航管理</Title>
        <Subtitle>川崎汽船フリート管理システム - リアルタイム運航監視</Subtitle>
      </Header>

      <ControlsSection>
        <SearchSection>
          <SearchInput
            type="text"
            placeholder="船名・IMO番号・現在地で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">全ステータス</option>
            <option value="in_service">運航中</option>
            <option value="maintenance">メンテナンス</option>
            <option value="dry_dock">ドック入り</option>
            <option value="idle">待機中</option>
          </Select>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">全船種</option>
            <option value="container">コンテナ船</option>
            <option value="bulk">バルク船</option>
            <option value="tanker">タンカー</option>
            <option value="car_carrier">自動車船</option>
            <option value="reefer">冷凍船</option>
          </Select>
          <Button>検索</Button>
        </SearchSection>
        
        <Button $variant="primary">
          新規船舶登録
        </Button>
      </ControlsSection>

      <StatsContainer>
        <StatCard $color="#0f172a">
          <StatValue $color="#0f172a">{totalVessels}</StatValue>
          <StatLabel>保有船舶数</StatLabel>
        </StatCard>
        <StatCard $color="#10b981">
          <StatValue $color="#10b981">{activeVessels}</StatValue>
          <StatLabel>運航中</StatLabel>
        </StatCard>
        <StatCard $color="#1d4ed8">
          <StatValue $color="#1d4ed8">{totalTEU.toLocaleString()} TEU</StatValue>
          <StatLabel>総輸送能力</StatLabel>
        </StatCard>
        <StatCard $color="#dc2626">
          <StatValue $color="#dc2626">{totalCO2.toFixed(0)} t/日</StatValue>
          <StatLabel>総CO2排出量</StatLabel>
        </StatCard>
      </StatsContainer>

      <Table>
        <thead>
          <tr>
            <Th>船舶情報</Th>
            <Th>船種・所有</Th>
            <Th>現在位置・航海</Th>
            <Th>次港・ETA</Th>
            <Th>仕様</Th>
            <Th>乗組員</Th>
            <Th>ステータス</Th>
            <Th>操作</Th>
          </tr>
        </thead>
        <tbody>
          {filteredVessels.map((vessel) => (
            <tr key={vessel.id}>
              <Td>
                <div style={{ fontWeight: 'bold' }}>{vessel.vessel_name}</div>
                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                  🏷️ IMO: {vessel.imo_number}
                </div>
                <div style={{ fontSize: '0.85em', color: '#666' }}>
                  📻 Call Sign: {vessel.call_sign}
                </div>
                <div style={{ fontSize: '0.85em', color: '#666' }}>
                  🏁 {vessel.flag} ({vessel.built_year}年建造)
                </div>
              </Td>
              <Td>
                <TypeBadge $type={vessel.vessel_type}>
                  {getTypeLabel(vessel.vessel_type)}
                </TypeBadge>
                <OwnershipBadge $ownership={vessel.ownership}>
                  {getOwnershipLabel(vessel.ownership)}
                </OwnershipBadge>
                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                  運航: {vessel.operator}
                </div>
              </Td>
              <Td>
                <div style={{ fontWeight: 'bold' }}>📍 {vessel.current_location}</div>
                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                  🚢 {vessel.current_voyage}
                </div>
              </Td>
              <Td>
                <div style={{ fontWeight: 'bold' }}>{vessel.next_port}</div>
                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                  ⏰ {new Date(vessel.eta_next_port).toLocaleDateString('ja-JP')}
                </div>
                <div style={{ fontSize: '0.85em', color: '#666' }}>
                  {new Date(vessel.eta_next_port).toLocaleTimeString('ja-JP', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </Td>
              <Td>
                <div>GT: {vessel.gross_tonnage.toLocaleString()}</div>
                <div>DWT: {vessel.dwt.toLocaleString()}</div>
                {vessel.teu_capacity && (
                  <CapacityText>{vessel.teu_capacity.toLocaleString()} TEU</CapacityText>
                )}
                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                  燃料: {vessel.fuel_consumption_daily}t/日
                </div>
              </Td>
              <Td>
                <div style={{ fontWeight: 'bold' }}>{vessel.crew_count}名</div>
                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                  👨‍✈️ {vessel.captain_name}
                </div>
              </Td>
              <Td>
                <StatusBadge $status={vessel.operational_status}>
                  {getStatusLabel(vessel.operational_status)}
                </StatusBadge>
                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                  次回点検: {new Date(vessel.next_maintenance).toLocaleDateString('ja-JP')}
                </div>
              </Td>
              <Td>
                <ActionButtons>
                  <Button $variant="secondary" onClick={() => alert('詳細表示機能は準備中です')}>
                    詳細
                  </Button>
                  <Button 
                    $variant="primary" 
                    onClick={() => alert('位置追跡機能は準備中です')}
                  >
                    追跡
                  </Button>
                  {vessel.operational_status === 'in_service' && (
                    <Button 
                      $variant="success" 
                      onClick={() => alert('航海計画機能は準備中です')}
                    >
                      航海計画
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

export default VesselsPage

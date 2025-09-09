import React, { useState } from 'react'
import styled from 'styled-components'

interface Shipper {
  id: number
  company_name: string
  shipper_code: string
  contact_person: string
  email: string
  phone: string
  address: string
  country: string
  shipper_type: 'shipper' | 'consignee' | 'forwarder' | 'agent'
  credit_limit: number
  credit_used: number
  contract_type: 'spot' | 'contract' | 'annual'
  preferred_routes: string[]
  cargo_types: string[]
  annual_volume_teu: number
  last_shipment_date: string
  total_shipments_ytd: number
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
    content: '🚢';
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
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
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
      case 'active':
        return `
          background-color: ${theme.colors.success};
          color: ${theme.colors.white};
        `
      case 'inactive':
        return `
          background-color: ${theme.colors.gray500};
          color: ${theme.colors.white};
        `
      case 'credit_hold':
        return `
          background-color: ${theme.colors.danger};
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
      case 'shipper':
        return `
          background-color: #1e3a8a;
          color: ${theme.colors.white};
        `
      case 'consignee':
        return `
          background-color: #3b82f6;
          color: ${theme.colors.white};
        `
      case 'forwarder':
        return `
          background-color: #06b6d4;
          color: ${theme.colors.white};
        `
      case 'agent':
        return `
          background-color: #8b5cf6;
          color: ${theme.colors.white};
        `
    }
  }}
`

const CreditBar = styled.div<{ $percentage: number }>`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.gray200};
  border-radius: 4px;
  position: relative;
  margin: 4px 0;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${({ $percentage }) => Math.min($percentage, 100)}%;
    background: ${({ $percentage, theme }) => 
      $percentage > 90 ? theme.colors.danger :
      $percentage > 70 ? theme.colors.warning :
      theme.colors.success
    };
    border-radius: 4px;
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`

const VolumeText = styled.span`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: #1e3a8a;
`

const CustomersPage: React.FC = () => {
  const [shippers] = useState<Shipper[]>([
    {
      id: 1,
      company_name: 'トヨタ自動車株式会社',
      shipper_code: 'SHP001',
      contact_person: '田中貿易部長',
      email: 'tanaka@toyota.co.jp',
      phone: '03-1234-5678',
      address: '愛知県豊田市トヨタ町1番地',
      country: 'Japan',
      shipper_type: 'shipper',
      credit_limit: 50000000,
      credit_used: 35000000,
      contract_type: 'annual',
      preferred_routes: ['日本-北米', '日本-欧州'],
      cargo_types: ['自動車', '自動車部品'],
      annual_volume_teu: 8500,
      last_shipment_date: '2024-01-10',
      total_shipments_ytd: 245,
      status: 'active',
      registration_date: '2020-03-15',
      account_manager: '川崎太郎'
    },
    {
      id: 2,
      company_name: 'Samsung Electronics',
      shipper_code: 'SHP002',
      contact_person: 'Kim Logistics Manager',
      email: 'kim@samsung.com',
      phone: '+82-2-2255-0114',
      address: 'Seoul, South Korea',
      country: 'South Korea',
      shipper_type: 'shipper',
      credit_limit: 30000000,
      credit_used: 28500000,
      contract_type: 'contract',
      preferred_routes: ['韓国-北米', '韓国-東南アジア'],
      cargo_types: ['電子機器', '半導体'],
      annual_volume_teu: 6200,
      last_shipment_date: '2024-01-08',
      total_shipments_ytd: 180,
      status: 'active',
      registration_date: '2019-07-22',
      account_manager: '佐藤花子'
    },
    {
      id: 3,
      company_name: 'ABC Freight Forwarders',
      shipper_code: 'FWD001',
      contact_person: 'John Smith',
      email: 'john@abc-freight.com',
      phone: '+1-555-0123',
      address: 'Los Angeles, CA, USA',
      country: 'United States',
      shipper_type: 'forwarder',
      credit_limit: 20000000,
      credit_used: 12000000,
      contract_type: 'spot',
      preferred_routes: ['北米-アジア', '北米-欧州'],
      cargo_types: ['一般貨物', '冷蔵貨物'],
      annual_volume_teu: 3800,
      last_shipment_date: '2024-01-05',
      total_shipments_ytd: 95,
      status: 'active',
      registration_date: '2021-11-10',
      account_manager: '鈴木一郎'
    },
    {
      id: 4,
      company_name: 'Europa Trading Co.',
      shipper_code: 'AGT001',
      contact_person: 'Hans Mueller',
      email: 'hans@europa-trading.de',
      phone: '+49-40-123456',
      address: 'Hamburg, Germany',
      country: 'Germany',
      shipper_type: 'agent',
      credit_limit: 15000000,
      credit_used: 5000000,
      contract_type: 'contract',
      preferred_routes: ['欧州-アジア'],
      cargo_types: ['機械', '化学品'],
      annual_volume_teu: 2100,
      last_shipment_date: '2023-12-28',
      total_shipments_ytd: 58,
      status: 'inactive',
      registration_date: '2022-05-18',
      account_manager: '高橋雅子'
    },
    {
      id: 5,
      company_name: '香港物流有限公司',
      shipper_code: 'CNS001',
      contact_person: 'Wong Logistics',
      email: 'wong@hklogistics.com.hk',
      phone: '+852-2123-4567',
      address: 'Hong Kong',
      country: 'Hong Kong',
      shipper_type: 'consignee',
      credit_limit: 8000000,
      credit_used: 7900000,
      contract_type: 'spot',
      preferred_routes: ['中国-東南アジア'],
      cargo_types: ['消費財', '食品'],
      annual_volume_teu: 1500,
      last_shipment_date: '2024-01-02',
      total_shipments_ytd: 42,
      status: 'credit_hold',
      registration_date: '2023-02-14',
      account_manager: '山田健一'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  // ユーザー権限（モック）
  const userPermissions = {
    canCreate: true,
    canEdit: true,
    canDelete: false, // 削除権限なし
    canCreditHold: true
  }

  // フィルタリング
  const filteredShippers = shippers.filter(shipper => {
    const matchesSearch = 
      shipper.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipper.shipper_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipper.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === '' || shipper.status === statusFilter
    const matchesType = typeFilter === '' || shipper.shipper_type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  // 統計計算
  const totalShippers = shippers.length
  const activeShippers = shippers.filter(s => s.status === 'active').length
  const totalVolume = shippers.reduce((sum, s) => sum + s.annual_volume_teu, 0)
  const totalShipments = shippers.reduce((sum, s) => sum + s.total_shipments_ytd, 0)

  const getStatusLabel = (status: string) => {
    const labels = {
      active: 'アクティブ',
      inactive: '非アクティブ',
      credit_hold: '与信停止'
    }
    return labels[status as keyof typeof labels] || status
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      shipper: '荷主',
      consignee: '荷受人',
      forwarder: 'フォワーダー',
      agent: '代理店'
    }
    return labels[type as keyof typeof labels] || type
  }

  const getCreditUsagePercentage = (used: number, limit: number) => {
    return (used / limit) * 100
  }

  return (
    <PageContainer>
      <Header>
        <Title>顧客管理</Title>
        <Subtitle>顧客情報・取引履歴</Subtitle>
      </Header>

      <ControlsSection>
        <SearchSection>
          <SearchInput
            type="text"
            placeholder="会社名・荷主コード・担当者で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">全ステータス</option>
            <option value="active">アクティブ</option>
            <option value="inactive">非アクティブ</option>
            <option value="credit_hold">与信停止</option>
          </Select>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">全タイプ</option>
            <option value="shipper">荷主</option>
            <option value="consignee">荷受人</option>
            <option value="forwarder">フォワーダー</option>
            <option value="agent">代理店</option>
          </Select>
          <Button>検索</Button>
        </SearchSection>
        
        <Button $variant="primary">
          新規荷主登録
        </Button>
      </ControlsSection>

      <StatsContainer>
        <StatCard $color="#1e3a8a">
          <StatValue $color="#1e3a8a">{totalShippers}</StatValue>
          <StatLabel>総登録数</StatLabel>
        </StatCard>
        <StatCard $color="#10b981">
          <StatValue $color="#10b981">{activeShippers}</StatValue>
          <StatLabel>アクティブ荷主</StatLabel>
        </StatCard>
        <StatCard $color="#3b82f6">
          <StatValue $color="#3b82f6">{totalVolume.toLocaleString()} TEU</StatValue>
          <StatLabel>年間取扱量</StatLabel>
        </StatCard>
        <StatCard $color="#06b6d4">
          <StatValue $color="#06b6d4">{totalShipments}</StatValue>
          <StatLabel>年間船積件数</StatLabel>
        </StatCard>
      </StatsContainer>

      <Table>
        <thead>
          <tr>
            <Th>荷主情報</Th>
            <Th>タイプ</Th>
            <Th>与信状況</Th>
            <Th>年間実績</Th>
            <Th>主要航路</Th>
            <Th>ステータス</Th>
            <Th>担当者</Th>
            <Th>操作</Th>
          </tr>
        </thead>
        <tbody>
          {filteredShippers.map((shipper) => (
            <tr key={shipper.id}>
              <Td>
                <div style={{ fontWeight: 'bold' }}>{shipper.company_name}</div>
                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                  🏷️ {shipper.shipper_code}
                </div>
                <div style={{ fontSize: '0.85em', color: '#666' }}>
                  👤 {shipper.contact_person}
                </div>
                <div style={{ fontSize: '0.85em', color: '#666' }}>
                  🌍 {shipper.country}
                </div>
              </Td>
              <Td>
                <TypeBadge $type={shipper.shipper_type}>
                  {getTypeLabel(shipper.shipper_type)}
                </TypeBadge>
                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                  {shipper.contract_type === 'annual' && '年間契約'}
                  {shipper.contract_type === 'contract' && '契約運賃'}
                  {shipper.contract_type === 'spot' && 'スポット'}
                </div>
              </Td>
              <Td>
                <div style={{ fontSize: '0.85em', marginBottom: '4px' }}>
                  ¥{shipper.credit_used.toLocaleString()} / ¥{shipper.credit_limit.toLocaleString()}
                </div>
                <CreditBar $percentage={getCreditUsagePercentage(shipper.credit_used, shipper.credit_limit)} />
                <div style={{ fontSize: '0.75em', color: '#666' }}>
                  使用率: {getCreditUsagePercentage(shipper.credit_used, shipper.credit_limit).toFixed(1)}%
                </div>
              </Td>
              <Td>
                <VolumeText>{shipper.annual_volume_teu.toLocaleString()} TEU</VolumeText>
                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                  船積: {shipper.total_shipments_ytd}件
                </div>
                <div style={{ fontSize: '0.85em', color: '#666' }}>
                  最終: {new Date(shipper.last_shipment_date).toLocaleDateString('ja-JP')}
                </div>
              </Td>
              <Td>
                <div style={{ fontSize: '0.85em' }}>
                  {shipper.preferred_routes.slice(0, 2).map((route, index) => (
                    <div key={index} style={{ marginBottom: '2px' }}>
                      🚢 {route}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: '0.75em', color: '#666', marginTop: '4px' }}>
                  貨物: {shipper.cargo_types.join(', ')}
                </div>
              </Td>
              <Td>
                <StatusBadge $status={shipper.status}>
                  {getStatusLabel(shipper.status)}
                </StatusBadge>
              </Td>
              <Td>{shipper.account_manager}</Td>
              <Td>
                <ActionButtons>
                  <Button $variant="secondary" onClick={() => alert('詳細表示機能は準備中です')}>
                    詳細
                  </Button>
                  <Button 
                    $variant="primary" 
                    onClick={() => alert('編集機能は準備中です')}
                  >
                    編集
                  </Button>
                  {shipper.status === 'active' && (
                    <Button 
                      $variant="danger" 
                      onClick={() => alert('与信停止機能は準備中です')}
                    >
                      与信停止
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

export default CustomersPage

import React, { useState } from 'react'
import styled from 'styled-components'

interface Partner {
  id: number
  company_name: string
  contact_person: string
  email: string
  phone: string
  address: string
  partnership_type: 'distributor' | 'retailer' | 'strategic' | 'regional'
  contract_start: string
  contract_end: string
  revenue_last_year: number
  status: 'active' | 'inactive' | 'suspended'
  performance_rating: number
  last_contact: string
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
      case 'suspended':
        return `
          background-color: ${theme.colors.danger};
          color: ${theme.colors.white};
        `
      default:
        return `
          background-color: ${theme.colors.gray300};
          color: ${theme.colors.dark};
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
      case 'strategic':
        return `
          background-color: #8b5cf6;
          color: ${theme.colors.white};
        `
      case 'distributor':
        return `
          background-color: #3b82f6;
          color: ${theme.colors.white};
        `
      case 'retailer':
        return `
          background-color: #10b981;
          color: ${theme.colors.white};
        `
      case 'regional':
        return `
          background-color: #f59e0b;
          color: ${theme.colors.white};
        `
    }
  }}
`

const RatingStars = styled.div<{ $rating: number }>`
  display: flex;
  gap: 2px;
  
  &::before {
    content: '${({ $rating }) => '★'.repeat($rating)}${'☆'.repeat(5 - $rating)}';
    color: #fbbf24;
  }
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

const PartnersPage: React.FC = () => {
  const [partners] = useState<Partner[]>([
    {
      id: 1,
      company_name: '東京商事株式会社',
      contact_person: '田中太郎',
      email: 'tanaka@tokyo-shoji.co.jp',
      phone: '03-1234-5678',
      address: '東京都千代田区丸の内1-1-1',
      partnership_type: 'strategic',
      contract_start: '2023-01-01',
      contract_end: '2025-12-31',
      revenue_last_year: 25000000,
      status: 'active',
      performance_rating: 5,
      last_contact: '2024-01-05'
    },
    {
      id: 2,
      company_name: '大阪流通センター',
      contact_person: '佐藤花子',
      email: 'sato@osaka-dist.co.jp',
      phone: '06-9876-5432',
      address: '大阪府大阪市北区梅田2-2-2',
      partnership_type: 'distributor',
      contract_start: '2023-06-01',
      contract_end: '2024-05-31',
      revenue_last_year: 18500000,
      status: 'active',
      performance_rating: 4,
      last_contact: '2024-01-03'
    },
    {
      id: 3,
      company_name: '九州リテール株式会社',
      contact_person: '鈴木一郎',
      email: 'suzuki@kyushu-retail.com',
      phone: '092-555-1234',
      address: '福岡県福岡市博多区3-3-3',
      partnership_type: 'retailer',
      contract_start: '2022-04-01',
      contract_end: '2024-03-31',
      revenue_last_year: 8200000,
      status: 'active',
      performance_rating: 3,
      last_contact: '2023-12-20'
    },
    {
      id: 4,
      company_name: '北海道パートナーズ',
      contact_person: '高橋雅子',
      email: 'takahashi@hokkaido-partners.jp',
      phone: '011-777-8888',
      address: '北海道札幌市中央区4-4-4',
      partnership_type: 'regional',
      contract_start: '2023-10-01',
      contract_end: '2024-09-30',
      revenue_last_year: 12000000,
      status: 'inactive',
      performance_rating: 2,
      last_contact: '2023-11-15'
    },
    {
      id: 5,
      company_name: '中部システムズ',
      contact_person: '山田健一',
      email: 'yamada@chubu-systems.co.jp',
      phone: '052-333-4444',
      address: '愛知県名古屋市中区5-5-5',
      partnership_type: 'distributor',
      contract_start: '2021-01-01',
      contract_end: '2024-12-31',
      revenue_last_year: 5500000,
      status: 'suspended',
      performance_rating: 1,
      last_contact: '2023-08-10'
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
    canSuspend: false // 停止権限なし
  }

  // フィルタリング
  const filteredPartners = partners.filter(partner => {
    const matchesSearch = 
      partner.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === '' || partner.status === statusFilter
    const matchesType = typeFilter === '' || partner.partnership_type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  // 統計計算
  const totalPartners = partners.length
  const activePartners = partners.filter(p => p.status === 'active').length
  const totalRevenue = partners.reduce((sum, p) => sum + p.revenue_last_year, 0)
  const avgRating = partners.reduce((sum, p) => sum + p.performance_rating, 0) / partners.length

  const getStatusLabel = (status: string) => {
    const labels = {
      active: 'アクティブ',
      inactive: '非アクティブ',
      suspended: '停止中'
    }
    return labels[status as keyof typeof labels] || status
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      strategic: '戦略的',
      distributor: '販売代理店',
      retailer: '小売店',
      regional: '地域パートナー'
    }
    return labels[type as keyof typeof labels] || type
  }

  return (
    <PageContainer>
      <Header>
        <Title>取引先管理</Title>
        <Subtitle>パートナー企業との関係を効率的に管理</Subtitle>
      </Header>

      <ControlsSection>
        <SearchSection>
          <SearchInput
            type="text"
            placeholder="企業名・担当者名で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">全ステータス</option>
            <option value="active">アクティブ</option>
            <option value="inactive">非アクティブ</option>
            <option value="suspended">停止中</option>
          </Select>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">全タイプ</option>
            <option value="strategic">戦略的パートナー</option>
            <option value="distributor">販売代理店</option>
            <option value="retailer">小売店</option>
            <option value="regional">地域パートナー</option>
          </Select>
          <Button>検索</Button>
        </SearchSection>
        
        <Button $variant="primary" $disabled={!userPermissions.canCreate}>
          {!userPermissions.canCreate && <DisabledTooltip>作成権限がありません</DisabledTooltip>}
          新規パートナー登録
        </Button>
      </ControlsSection>

      <StatsContainer>
        <StatCard $color="#667eea">
          <StatValue $color="#667eea">{totalPartners}</StatValue>
          <StatLabel>総パートナー数</StatLabel>
        </StatCard>
        <StatCard $color="#10b981">
          <StatValue $color="#10b981">{activePartners}</StatValue>
          <StatLabel>アクティブパートナー</StatLabel>
        </StatCard>
        <StatCard $color="#f59e0b">
          <StatValue $color="#f59e0b">¥{totalRevenue.toLocaleString()}</StatValue>
          <StatLabel>年間総売上</StatLabel>
        </StatCard>
        <StatCard $color="#8b5cf6">
          <StatValue $color="#8b5cf6">{avgRating.toFixed(1)}</StatValue>
          <StatLabel>平均評価</StatLabel>
        </StatCard>
      </StatsContainer>

      <Table>
        <thead>
          <tr>
            <Th>企業名</Th>
            <Th>担当者</Th>
            <Th>パートナータイプ</Th>
            <Th>前年売上</Th>
            <Th>評価</Th>
            <Th>ステータス</Th>
            <Th>最終連絡</Th>
            <Th>操作</Th>
          </tr>
        </thead>
        <tbody>
          {filteredPartners.map((partner) => (
            <tr key={partner.id}>
              <Td>
                <div style={{ fontWeight: 'bold' }}>{partner.company_name}</div>
                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                  📍 {partner.address}
                </div>
              </Td>
              <Td>
                <div>{partner.contact_person}</div>
                <div style={{ fontSize: '0.85em', color: '#666' }}>
                  📧 {partner.email}
                </div>
                <div style={{ fontSize: '0.85em', color: '#666' }}>
                  📞 {partner.phone}
                </div>
              </Td>
              <Td>
                <TypeBadge $type={partner.partnership_type}>
                  {getTypeLabel(partner.partnership_type)}
                </TypeBadge>
              </Td>
              <Td>
                <PriceText>¥{partner.revenue_last_year.toLocaleString()}</PriceText>
              </Td>
              <Td>
                <RatingStars $rating={partner.performance_rating} />
              </Td>
              <Td>
                <StatusBadge $status={partner.status}>
                  {getStatusLabel(partner.status)}
                </StatusBadge>
              </Td>
              <Td>{new Date(partner.last_contact).toLocaleDateString('ja-JP')}</Td>
              <Td>
                <ActionButtons>
                  <Button $variant="secondary" onClick={() => alert('詳細表示機能は準備中です')}>
                    詳細
                  </Button>
                  <Button 
                    $variant="primary" 
                    $disabled={!userPermissions.canEdit}
                    onClick={() => alert(userPermissions.canEdit ? '編集機能は準備中です' : '編集権限がありません')}
                  >
                    {!userPermissions.canEdit && <DisabledTooltip>編集権限がありません</DisabledTooltip>}
                    編集
                  </Button>
                  {partner.status === 'active' && (
                    <Button 
                      $variant="danger" 
                      $disabled={!userPermissions.canSuspend}
                      onClick={() => alert(userPermissions.canSuspend ? '停止機能は準備中です' : '停止権限がありません')}
                    >
                      {!userPermissions.canSuspend && <DisabledTooltip>停止権限がありません</DisabledTooltip>}
                      停止
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

export default PartnersPage

import React, { useState } from 'react'
import styled from 'styled-components'

interface Supplier {
  id: number
  company_name: string
  contact_person: string
  email: string
  phone: string
  address: string
  supplier_code: string
  category: string
  payment_terms: string
  lead_time_days: number
  quality_rating: number
  delivery_rating: number
  cost_rating: number
  total_purchases_ytd: number
  status: 'active' | 'inactive' | 'blacklisted'
  last_order_date: string
  certification: string[]
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
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
    border-color: #f5576c;
    box-shadow: 0 0 0 3px rgba(245, 87, 108, 0.1);
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
    border-color: #f5576c;
    box-shadow: 0 0 0 3px rgba(245, 87, 108, 0.1);
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
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
      case 'blacklisted':
        return `
          background-color: ${theme.colors.danger};
          color: ${theme.colors.white};
        `
    }
  }}
`

const RatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const RatingItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
`

const RatingBar = styled.div<{ $rating: number; $color: string }>`
  width: 60px;
  height: 8px;
  background: ${({ theme }) => theme.colors.gray200};
  border-radius: 4px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${({ $rating }) => ($rating / 5) * 100}%;
    background: ${({ $color }) => $color};
    border-radius: 4px;
  }
`

const CertificationBadge = styled.span`
  display: inline-block;
  padding: 2px 6px;
  margin: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  font-size: 10px;
  font-weight: bold;
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

const SuppliersPage: React.FC = () => {
  const [suppliers] = useState<Supplier[]>([
    {
      id: 1,
      company_name: 'アジア電子部品株式会社',
      contact_person: '李美香',
      email: 'li@asia-electronics.co.jp',
      phone: '03-8888-9999',
      address: '東京都港区芝浦1-1-1',
      supplier_code: 'SUP001',
      category: '電子部品',
      payment_terms: '30日後払い',
      lead_time_days: 14,
      quality_rating: 5,
      delivery_rating: 4,
      cost_rating: 3,
      total_purchases_ytd: 45000000,
      status: 'active',
      last_order_date: '2024-01-08',
      certification: ['ISO9001', 'ISO14001', 'IATF16949']
    },
    {
      id: 2,
      company_name: '中部製鋼所',
      contact_person: '中村健司',
      email: 'nakamura@chubu-steel.co.jp',
      phone: '052-1111-2222',
      address: '愛知県名古屋市東区3-4-5',
      supplier_code: 'SUP002',
      category: '金属素材',
      payment_terms: '60日後払い',
      lead_time_days: 21,
      quality_rating: 4,
      delivery_rating: 5,
      cost_rating: 4,
      total_purchases_ytd: 32000000,
      status: 'active',
      last_order_date: '2024-01-10',
      certification: ['ISO9001', 'JIS認証']
    },
    {
      id: 3,
      company_name: 'パシフィック樹脂工業',
      contact_person: '田村さくら',
      email: 'tamura@pacific-plastic.com',
      phone: '045-3333-4444',
      address: '神奈川県横浜市西区6-7-8',
      supplier_code: 'SUP003',
      category: '樹脂・プラスチック',
      payment_terms: '45日後払い',
      lead_time_days: 10,
      quality_rating: 3,
      delivery_rating: 3,
      cost_rating: 5,
      total_purchases_ytd: 18500000,
      status: 'active',
      last_order_date: '2023-12-25',
      certification: ['ISO9001']
    },
    {
      id: 4,
      company_name: '関西化学工業',
      contact_person: '大阪太郎',
      email: 'osaka@kansai-chemical.co.jp',
      phone: '06-5555-6666',
      address: '大阪府大阪市淀川区9-10-11',
      supplier_code: 'SUP004',
      category: '化学薬品',
      payment_terms: '30日後払い',
      lead_time_days: 7,
      quality_rating: 4,
      delivery_rating: 4,
      cost_rating: 2,
      total_purchases_ytd: 8200000,
      status: 'inactive',
      last_order_date: '2023-10-15',
      certification: ['ISO9001', '化学工業安全認証']
    },
    {
      id: 5,
      company_name: 'グローバル・サプライズ',
      contact_person: 'Smith John',
      email: 'john.smith@global-supplies.com',
      phone: '03-7777-8888',
      address: '東京都中央区銀座12-13-14',
      supplier_code: 'SUP005',
      category: '汎用部品',
      payment_terms: '15日後払い',
      lead_time_days: 30,
      quality_rating: 2,
      delivery_rating: 1,
      cost_rating: 1,
      total_purchases_ytd: 2500000,
      status: 'blacklisted',
      last_order_date: '2023-06-30',
      certification: []
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  // ユーザー権限（モック）
  const userPermissions = {
    canCreate: false, // 作成権限なし
    canEdit: true,
    canDelete: false, // 削除権限なし
    canBlacklist: true
  }

  // フィルタリング
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = 
      supplier.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.supplier_code.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === '' || supplier.status === statusFilter
    const matchesCategory = categoryFilter === '' || supplier.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  // 統計計算
  const totalSuppliers = suppliers.length
  const activeSuppliers = suppliers.filter(s => s.status === 'active').length
  const totalPurchases = suppliers.reduce((sum, s) => sum + s.total_purchases_ytd, 0)
  const avgLeadTime = suppliers.reduce((sum, s) => sum + s.lead_time_days, 0) / suppliers.length

  const getStatusLabel = (status: string) => {
    const labels = {
      active: 'アクティブ',
      inactive: '非アクティブ',
      blacklisted: 'ブラックリスト'
    }
    return labels[status as keyof typeof labels] || status
  }

  const getOverallRating = (quality: number, delivery: number, cost: number) => {
    return ((quality + delivery + cost) / 3).toFixed(1)
  }

  return (
    <PageContainer>
      <Header>
        <Title>仕入先管理</Title>
        <Subtitle>サプライヤーとの関係を最適化し、品質と効率を向上</Subtitle>
      </Header>

      <ControlsSection>
        <SearchSection>
          <SearchInput
            type="text"
            placeholder="企業名・担当者・コードで検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">全ステータス</option>
            <option value="active">アクティブ</option>
            <option value="inactive">非アクティブ</option>
            <option value="blacklisted">ブラックリスト</option>
          </Select>
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">全カテゴリ</option>
            <option value="電子部品">電子部品</option>
            <option value="金属素材">金属素材</option>
            <option value="樹脂・プラスチック">樹脂・プラスチック</option>
            <option value="化学薬品">化学薬品</option>
            <option value="汎用部品">汎用部品</option>
          </Select>
          <Button>検索</Button>
        </SearchSection>
        
        <Button $variant="primary" $disabled={!userPermissions.canCreate}>
          {!userPermissions.canCreate && <DisabledTooltip>新規登録権限がありません</DisabledTooltip>}
          新規仕入先登録
        </Button>
      </ControlsSection>

      <StatsContainer>
        <StatCard $color="#f5576c">
          <StatValue $color="#f5576c">{totalSuppliers}</StatValue>
          <StatLabel>総仕入先数</StatLabel>
        </StatCard>
        <StatCard $color="#10b981">
          <StatValue $color="#10b981">{activeSuppliers}</StatValue>
          <StatLabel>アクティブ仕入先</StatLabel>
        </StatCard>
        <StatCard $color="#f59e0b">
          <StatValue $color="#f59e0b">¥{totalPurchases.toLocaleString()}</StatValue>
          <StatLabel>年間調達額</StatLabel>
        </StatCard>
        <StatCard $color="#8b5cf6">
          <StatValue $color="#8b5cf6">{avgLeadTime.toFixed(0)}日</StatValue>
          <StatLabel>平均リードタイム</StatLabel>
        </StatCard>
      </StatsContainer>

      <Table>
        <thead>
          <tr>
            <Th>仕入先情報</Th>
            <Th>カテゴリ</Th>
            <Th>評価</Th>
            <Th>調達実績</Th>
            <Th>リードタイム</Th>
            <Th>認証</Th>
            <Th>ステータス</Th>
            <Th>操作</Th>
          </tr>
        </thead>
        <tbody>
          {filteredSuppliers.map((supplier) => (
            <tr key={supplier.id}>
              <Td>
                <div style={{ fontWeight: 'bold' }}>{supplier.company_name}</div>
                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                  👤 {supplier.contact_person} ({supplier.supplier_code})
                </div>
                <div style={{ fontSize: '0.85em', color: '#666' }}>
                  📧 {supplier.email}
                </div>
                <div style={{ fontSize: '0.85em', color: '#666' }}>
                  📞 {supplier.phone}
                </div>
              </Td>
              <Td>
                <div style={{ fontWeight: 'bold' }}>{supplier.category}</div>
                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                  💳 {supplier.payment_terms}
                </div>
              </Td>
              <Td>
                <RatingContainer>
                  <RatingItem>
                    <span>品質:</span>
                    <RatingBar $rating={supplier.quality_rating} $color="#10b981" />
                    <span>{supplier.quality_rating}/5</span>
                  </RatingItem>
                  <RatingItem>
                    <span>納期:</span>
                    <RatingBar $rating={supplier.delivery_rating} $color="#3b82f6" />
                    <span>{supplier.delivery_rating}/5</span>
                  </RatingItem>
                  <RatingItem>
                    <span>価格:</span>
                    <RatingBar $rating={supplier.cost_rating} $color="#f59e0b" />
                    <span>{supplier.cost_rating}/5</span>
                  </RatingItem>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '4px' }}>
                    総合: {getOverallRating(supplier.quality_rating, supplier.delivery_rating, supplier.cost_rating)}/5.0
                  </div>
                </RatingContainer>
              </Td>
              <Td>
                <PriceText>¥{supplier.total_purchases_ytd.toLocaleString()}</PriceText>
                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                  最終発注: {new Date(supplier.last_order_date).toLocaleDateString('ja-JP')}
                </div>
              </Td>
              <Td>
                <div style={{ fontWeight: 'bold' }}>{supplier.lead_time_days}日</div>
              </Td>
              <Td>
                <div>
                  {supplier.certification.map((cert, index) => (
                    <CertificationBadge key={index}>{cert}</CertificationBadge>
                  ))}
                  {supplier.certification.length === 0 && (
                    <span style={{ color: '#999', fontSize: '12px' }}>認証なし</span>
                  )}
                </div>
              </Td>
              <Td>
                <StatusBadge $status={supplier.status}>
                  {getStatusLabel(supplier.status)}
                </StatusBadge>
              </Td>
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
                  {supplier.status === 'active' && (
                    <Button 
                      $variant="danger" 
                      $disabled={!userPermissions.canBlacklist}
                      onClick={() => alert(userPermissions.canBlacklist ? 'ブラックリスト登録機能は準備中です' : 'ブラックリスト権限がありません')}
                    >
                      {!userPermissions.canBlacklist && <DisabledTooltip>ブラックリスト権限がありません</DisabledTooltip>}
                      要注意
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

export default SuppliersPage

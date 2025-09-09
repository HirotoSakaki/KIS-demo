import React, { useState } from 'react'
import styled from 'styled-components'

interface Invoice {
  id: number
  invoice_number: string
  customer_name: string
  customer_id: number
  issue_date: string
  due_date: string
  payment_date?: string
  total_amount: number
  tax_amount: number
  net_amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  payment_method?: string
  currency: string
  discount_amount: number
  items_count: number
  notes?: string
  created_by: string
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
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
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
    border-color: #4facfe;
    box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
  }
`

const DateInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: #4facfe;
    box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
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
    border-color: #4facfe;
    box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
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
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
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
      case 'paid':
        return `
          background-color: ${theme.colors.success};
          color: ${theme.colors.white};
        `
      case 'sent':
        return `
          background-color: ${theme.colors.info};
          color: ${theme.colors.white};
        `
      case 'draft':
        return `
          background-color: ${theme.colors.gray500};
          color: ${theme.colors.white};
        `
      case 'overdue':
        return `
          background-color: ${theme.colors.danger};
          color: ${theme.colors.white};
        `
      case 'cancelled':
        return `
          background-color: ${theme.colors.dark};
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

const OverdueText = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`

const InvoicesPage: React.FC = () => {
  const [invoices] = useState<Invoice[]>([
    {
      id: 1,
      invoice_number: 'INV-2024-001',
      customer_name: 'サンプル商事株式会社',
      customer_id: 1,
      issue_date: '2024-01-01',
      due_date: '2024-01-31',
      payment_date: '2024-01-25',
      total_amount: 1100000,
      tax_amount: 100000,
      net_amount: 1000000,
      status: 'paid',
      payment_method: '銀行振込',
      currency: 'JPY',
      discount_amount: 0,
      items_count: 5,
      notes: '年末キャンペーン適用',
      created_by: '田中太郎'
    },
    {
      id: 2,
      invoice_number: 'INV-2024-002',
      customer_name: 'キャピタル商事株式会社',
      customer_id: 2,
      issue_date: '2024-01-05',
      due_date: '2024-02-05',
      total_amount: 550000,
      tax_amount: 50000,
      net_amount: 500000,
      status: 'sent',
      currency: 'JPY',
      discount_amount: 25000,
      items_count: 3,
      notes: '早期支払い割引適用',
      created_by: '佐藤花子'
    },
    {
      id: 3,
      invoice_number: 'INV-2024-003',
      customer_name: 'ウエスト製造業株式会社',
      customer_id: 3,
      issue_date: '2023-12-15',
      due_date: '2024-01-15',
      total_amount: 2200000,
      tax_amount: 200000,
      net_amount: 2000000,
      status: 'overdue',
      currency: 'JPY',
      discount_amount: 0,
      items_count: 10,
      notes: '緊急対応案件',
      created_by: '鈴木一郎'
    },
    {
      id: 4,
      invoice_number: 'INV-2024-004',
      customer_name: 'サウスリテール株式会社',
      customer_id: 4,
      issue_date: '2024-01-10',
      due_date: '2024-02-10',
      total_amount: 330000,
      tax_amount: 30000,
      net_amount: 300000,
      status: 'draft',
      currency: 'JPY',
      discount_amount: 0,
      items_count: 2,
      created_by: '高橋雅子'
    },
    {
      id: 5,
      invoice_number: 'INV-2024-005',
      customer_name: 'ノースパートナーズ',
      customer_id: 5,
      issue_date: '2023-11-01',
      due_date: '2023-12-01',
      total_amount: 880000,
      tax_amount: 80000,
      net_amount: 800000,
      status: 'cancelled',
      currency: 'JPY',
      discount_amount: 0,
      items_count: 4,
      notes: '契約変更により取消',
      created_by: '山田健一'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // ユーザー権限（モック）
  const userPermissions = {
    canCreate: true,
    canEdit: true,
    canDelete: false, // 削除権限なし
    canSend: true,
    canMarkPaid: false, // 支払い確認権限なし
    canCancel: true
  }

  // フィルタリング
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === '' || invoice.status === statusFilter
    
    const matchesDateRange = (() => {
      if (!dateFrom && !dateTo) return true
      const issueDate = new Date(invoice.issue_date)
      const fromDate = dateFrom ? new Date(dateFrom) : new Date('1900-01-01')
      const toDate = dateTo ? new Date(dateTo) : new Date('2099-12-31')
      return issueDate >= fromDate && issueDate <= toDate
    })()
    
    return matchesSearch && matchesStatus && matchesDateRange
  })

  // 統計計算
  const totalInvoices = invoices.length
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total_amount, 0)
  const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total_amount, 0)
  const overdueCount = invoices.filter(inv => inv.status === 'overdue').length

  const getStatusLabel = (status: string) => {
    const labels = {
      draft: '下書き',
      sent: '送信済み',
      paid: '支払い済み',
      overdue: '期限超過',
      cancelled: 'キャンセル'
    }
    return labels[status as keyof typeof labels] || status
  }

  const getDaysOverdue = (dueDate: string, status: string) => {
    if (status !== 'overdue') return 0
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = today.getTime() - due.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <PageContainer>
      <Header>
        <Title>請求書管理</Title>
        <Subtitle>請求書の発行から回収まで一元管理</Subtitle>
      </Header>

      <ControlsSection>
        <SearchSection>
          <SearchInput
            type="text"
            placeholder="請求書番号・顧客名で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">全ステータス</option>
            <option value="draft">下書き</option>
            <option value="sent">送信済み</option>
            <option value="paid">支払い済み</option>
            <option value="overdue">期限超過</option>
            <option value="cancelled">キャンセル</option>
          </Select>
          <DateInput
            type="date"
            placeholder="発行日（開始）"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <DateInput
            type="date"
            placeholder="発行日（終了）"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
          <Button>検索</Button>
        </SearchSection>
        
        <Button $variant="primary" $disabled={!userPermissions.canCreate}>
          {!userPermissions.canCreate && <DisabledTooltip>作成権限がありません</DisabledTooltip>}
          新規請求書作成
        </Button>
      </ControlsSection>

      <StatsContainer>
        <StatCard $color="#4facfe">
          <StatValue $color="#4facfe">{totalInvoices}</StatValue>
          <StatLabel>総請求書数</StatLabel>
        </StatCard>
        <StatCard $color="#10b981">
          <StatValue $color="#10b981">¥{paidAmount.toLocaleString()}</StatValue>
          <StatLabel>回収済み金額</StatLabel>
        </StatCard>
        <StatCard $color="#f59e0b">
          <StatValue $color="#f59e0b">¥{totalAmount.toLocaleString()}</StatValue>
          <StatLabel>総請求金額</StatLabel>
        </StatCard>
        <StatCard $color="#ef4444">
          <StatValue $color="#ef4444">{overdueCount}</StatValue>
          <StatLabel>期限超過件数</StatLabel>
        </StatCard>
      </StatsContainer>

      <Table>
        <thead>
          <tr>
            <Th>請求書番号</Th>
            <Th>顧客名</Th>
            <Th>発行日</Th>
            <Th>支払期限</Th>
            <Th>請求金額</Th>
            <Th>ステータス</Th>
            <Th>作成者</Th>
            <Th>操作</Th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map((invoice) => (
            <tr key={invoice.id}>
              <Td style={{ fontWeight: 'bold' }}>{invoice.invoice_number}</Td>
              <Td>
                <div>{invoice.customer_name}</div>
                <div style={{ fontSize: '0.85em', color: '#666' }}>
                  📦 {invoice.items_count}件
                </div>
              </Td>
              <Td>{new Date(invoice.issue_date).toLocaleDateString('ja-JP')}</Td>
              <Td>
                <div>{new Date(invoice.due_date).toLocaleDateString('ja-JP')}</div>
                {invoice.status === 'overdue' && (
                  <OverdueText style={{ fontSize: '0.85em' }}>
                    {getDaysOverdue(invoice.due_date, invoice.status)}日超過
                  </OverdueText>
                )}
              </Td>
              <Td>
                <PriceText>¥{invoice.total_amount.toLocaleString()}</PriceText>
                <div style={{ fontSize: '0.85em', color: '#666' }}>
                  (税込 ¥{invoice.tax_amount.toLocaleString()})
                </div>
                {invoice.discount_amount > 0 && (
                  <div style={{ fontSize: '0.85em', color: '#10b981' }}>
                    割引 -¥{invoice.discount_amount.toLocaleString()}
                  </div>
                )}
              </Td>
              <Td>
                <StatusBadge $status={invoice.status}>
                  {getStatusLabel(invoice.status)}
                </StatusBadge>
                {invoice.payment_date && (
                  <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                    支払日: {new Date(invoice.payment_date).toLocaleDateString('ja-JP')}
                  </div>
                )}
                {invoice.payment_method && (
                  <div style={{ fontSize: '0.85em', color: '#666' }}>
                    {invoice.payment_method}
                  </div>
                )}
              </Td>
              <Td>{invoice.created_by}</Td>
              <Td>
                <ActionButtons>
                  <Button $variant="secondary" onClick={() => alert('PDF表示機能は準備中です')}>
                    PDF
                  </Button>
                  
                  {invoice.status === 'draft' && (
                    <>
                      <Button 
                        $variant="primary" 
                        $disabled={!userPermissions.canEdit}
                        onClick={() => alert(userPermissions.canEdit ? '編集機能は準備中です' : '編集権限がありません')}
                      >
                        {!userPermissions.canEdit && <DisabledTooltip>編集権限がありません</DisabledTooltip>}
                        編集
                      </Button>
                      <Button 
                        $variant="success" 
                        $disabled={!userPermissions.canSend}
                        onClick={() => alert(userPermissions.canSend ? '送信機能は準備中です' : '送信権限がありません')}
                      >
                        {!userPermissions.canSend && <DisabledTooltip>送信権限がありません</DisabledTooltip>}
                        送信
                      </Button>
                    </>
                  )}
                  
                  {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                    <Button 
                      $variant="success" 
                      $disabled={!userPermissions.canMarkPaid}
                      onClick={() => alert(userPermissions.canMarkPaid ? '支払い確認機能は準備中です' : '支払い確認権限がありません')}
                    >
                      {!userPermissions.canMarkPaid && <DisabledTooltip>支払い確認権限がありません</DisabledTooltip>}
                      支払確認
                    </Button>
                  )}
                  
                  {invoice.status === 'draft' && (
                    <Button 
                      $variant="danger" 
                      $disabled={!userPermissions.canCancel}
                      onClick={() => alert(userPermissions.canCancel ? 'キャンセル機能は準備中です' : 'キャンセル権限がありません')}
                    >
                      {!userPermissions.canCancel && <DisabledTooltip>キャンセル権限がありません</DisabledTooltip>}
                      削除
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

export default InvoicesPage

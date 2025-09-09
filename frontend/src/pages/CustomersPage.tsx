import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Customer, PaginatedResponse } from '../types'
// import { customerApi } from '../utils/api'

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

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`

const LoadingMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.danger};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin: ${({ theme }) => theme.spacing.md};
`

const EmptyMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`

const Pagination = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  justify-content: between;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  gap: ${({ theme }) => theme.spacing.md};
`

const PaginationInfo = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
`

const CustomersPage: React.FC = () => {
  // サンプルデータ（API接続なし）
  const [customers] = useState<Customer[]>([
    {
      id: 1,
      customer_code: 'CUST001',
      name: '株式会社サンプル',
      email: 'contact@sample.co.jp',
      phone: '03-1234-5678',
      address: '東京都渋谷区サンプル1-2-3',
      created_at: '2024-01-15T09:00:00Z',
      updated_at: '2024-01-15T09:00:00Z',
      created_by: 1
    },
    {
      id: 2,
      customer_code: 'CUST002',
      name: '田中太郎',
      email: 'tanaka@example.com',
      phone: '090-1234-5678',
      address: '大阪府大阪市サンプル区4-5-6',
      created_at: '2024-01-16T10:00:00Z',
      updated_at: '2024-01-16T10:00:00Z',
      created_by: 1
    },
    {
      id: 3,
      customer_code: 'CUST003',
      name: '山田商事株式会社',
      email: 'info@yamada-shouji.co.jp',
      phone: '052-123-4567',
      address: '愛知県名古屋市サンプル区7-8-9',
      created_at: '2024-01-17T11:00:00Z',
      updated_at: '2024-01-17T11:00:00Z',
      created_by: 1
    }
  ])
  const [loading] = useState(false)
  const [error] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [pagination] = useState({
    page: 1,
    limit: 10,
    total: 3,
    totalPages: 1
  })

  // 検索フィルタリング
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSearch = () => {
    // 検索は既にfilteredCustomersで処理されている
  }

  const handleDelete = (id: number) => {
    if (window.confirm('この顧客を削除してもよろしいですか？')) {
      alert('デモ版では削除機能は無効です')
    }
  }

  const canCreate = true  // 管理者モード
  const canDelete = true  // 管理者モード

  return (
    <PageContainer>
      <Header>
        <Title>顧客管理</Title>
        <SearchSection>
          <SearchInput
            type="text"
            placeholder="顧客名で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch}>検索</Button>
          {canCreate && (
            <Button $variant="primary">
              新規登録
            </Button>
          )}
        </SearchSection>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {loading ? (
        <LoadingMessage>読み込み中...</LoadingMessage>
      ) : filteredCustomers.length === 0 ? (
        <EmptyMessage>
          {searchTerm ? '検索条件に一致する顧客が見つかりません' : '顧客データがありません'}
        </EmptyMessage>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <Th>顧客コード</Th>
                <Th>名前</Th>
                <Th>メールアドレス</Th>
                <Th>電話番号</Th>
                <Th>登録日</Th>
                <Th>操作</Th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <Td>{customer.customer_code}</Td>
                  <Td>{customer.name}</Td>
                  <Td>{customer.email || '-'}</Td>
                  <Td>{customer.phone || '-'}</Td>
                  <Td>{new Date(customer.created_at).toLocaleDateString('ja-JP')}</Td>
                  <Td>
                    <ActionButtons>
                      <Button $variant="secondary" onClick={() => alert('詳細表示機能は準備中です')}>
                        詳細
                      </Button>
                      {canCreate && (
                        <Button $variant="secondary" onClick={() => alert('編集機能は準備中です')}>
                          編集
                        </Button>
                      )}
                      {canDelete && (
                        <Button $variant="danger" onClick={() => handleDelete(customer.id)}>
                          削除
                        </Button>
                      )}
                    </ActionButtons>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination>
            <PaginationInfo>
              {filteredCustomers.length} 件中 1 - {filteredCustomers.length} 件を表示
            </PaginationInfo>
            <div>
              <span style={{ margin: '0 16px' }}>
                1 / 1 ページ
              </span>
            </div>
          </Pagination>
        </>
      )}
    </PageContainer>
  )
}

export default CustomersPage

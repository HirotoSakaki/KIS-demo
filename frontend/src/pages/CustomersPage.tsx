import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Customer, PaginatedResponse } from '../types'
import { customerApi } from '../utils/api'
import { useAuth } from '../hooks/useAuth'

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
  const { user } = useAuth()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  const loadCustomers = async () => {
    try {
      setLoading(true)
      setError('')
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(searchTerm && { name: searchTerm })
      }
      
      const response = await customerApi.getCustomers(params)
      
      if (response.data.success) {
        const data: PaginatedResponse<Customer> = response.data.data
        setCustomers(data.data)
        setPagination(prev => ({
          ...prev,
          total: data.total,
          totalPages: data.totalPages
        }))
      } else {
        setError(response.data.error || '顧客データの取得に失敗しました')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [pagination.page, pagination.limit])

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }))
    loadCustomers()
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('この顧客を削除してもよろしいですか？')) {
      return
    }

    try {
      const response = await customerApi.deleteCustomer(id)
      if (response.data.success) {
        loadCustomers() // リストを再読み込み
      } else {
        alert(response.data.error || '削除に失敗しました')
      }
    } catch (err: any) {
      alert(err.response?.data?.error || '削除エラーが発生しました')
    }
  }

  const canCreate = user?.role === 'admin'
  const canDelete = user?.role === 'admin'

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
      ) : customers.length === 0 ? (
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
              {customers.map((customer) => (
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
              {pagination.total} 件中 {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} 件を表示
            </PaginationInfo>
            <div>
              <Button 
                $variant="secondary" 
                disabled={pagination.page <= 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                前へ
              </Button>
              <span style={{ margin: '0 16px' }}>
                {pagination.page} / {pagination.totalPages}
              </span>
              <Button 
                $variant="secondary" 
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                次へ
              </Button>
            </div>
          </Pagination>
        </>
      )}
    </PageContainer>
  )
}

export default CustomersPage

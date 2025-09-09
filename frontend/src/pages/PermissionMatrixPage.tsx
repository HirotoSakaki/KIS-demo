import React from 'react'
import styled from 'styled-components'

const PageContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
`

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`

const MatrixContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-x: auto;
`

const MatrixTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
  
  th, td {
    padding: ${({ theme }) => theme.spacing.md};
    text-align: center;
    border: 1px solid ${({ theme }) => theme.colors.border};
    font-size: ${({ theme }) => theme.fontSize.sm};
  }
  
  th {
    background-color: ${({ theme }) => theme.colors.gray100};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.textPrimary};
    position: sticky;
    top: 0;
  }
  
  .screen-header {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    font-weight: ${({ theme }) => theme.fontWeight.bold};
  }
  
  .user-header {
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.white};
    font-weight: ${({ theme }) => theme.fontWeight.bold};
  }
`

const PermissionCell = styled.td<{ $hasPermission: boolean; $operationType: string }>`
  background-color: ${({ theme, $hasPermission, $operationType }) => {
    if (!$hasPermission) return theme.colors.gray200
    
    switch ($operationType) {
      case 'create':
        return '#e8f5e8' // 薄い緑
      case 'read':
        return '#e8f4fd' // 薄い青
      case 'update':
        return '#fff3e0' // 薄いオレンジ
      case 'delete':
        return '#fce4ec' // 薄いピンク
      default:
        return theme.colors.white
    }
  }};
  
  color: ${({ theme, $hasPermission }) => 
    $hasPermission ? theme.colors.textPrimary : theme.colors.textMuted};
  
  font-weight: ${({ $hasPermission }) => 
    $hasPermission ? 'bold' : 'normal'};
`

const Legend = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.gray50};
`

const LegendTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`

const LegendGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const LegendColor = styled.div<{ $color: string }>`
  width: 20px;
  height: 20px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ $color }) => $color};
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const LegendText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
`

const RestrictedMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  background-color: ${({ theme }) => theme.colors.warning};
  color: ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin: ${({ theme }) => theme.spacing.lg};
`

const PermissionMatrixPage: React.FC = () => {

  // サンプルデータ（実際はAPIから取得）
  const screens = [
    { name: '顧客登録', entityType: 'customers', operations: ['create'] },
    { name: '顧客検索', entityType: 'customers', operations: ['read'] },
    { name: '顧客削除', entityType: 'customers', operations: ['read', 'delete'] },
    { name: '顧客登録フォーム', entityType: 'customers', operations: ['read', 'create'] },
    { name: '注文照会', entityType: 'orders', operations: ['read'] },
    { name: '注文訂正', entityType: 'orders', operations: ['read', 'update'] },
    { name: '注文取消', entityType: 'orders', operations: ['read', 'delete'] },
  ]

  const users = [
    { id: 1, username: 'admin', role: 'admin' },
    { id: 2, username: 'user', role: 'user' },
  ]

  // 権限マトリックス（サンプルデータ）
  const permissions = {
    '1': { // admin
      '顧客登録_create': true,
      '顧客検索_read': true,
      '顧客削除_read': true,
      '顧客削除_delete': true,
      '顧客登録フォーム_read': true,
      '顧客登録フォーム_create': true,
      '注文照会_read': true,
      '注文訂正_read': true,
      '注文訂正_update': true,
      '注文取消_read': true,
      '注文取消_delete': true,
    },
    '2': { // user
      '顧客登録_create': false,
      '顧客検索_read': true,
      '顧客削除_read': true,
      '顧客削除_delete': false,
      '顧客登録フォーム_read': true,
      '顧客登録フォーム_create': false,
      '注文照会_read': true,
      '注文訂正_read': true,
      '注文訂正_update': false,
      '注文取消_read': true,
      '注文取消_delete': false,
    }
  }

  const operationLabels = {
    create: 'C',
    read: 'R',
    update: 'U',
    delete: 'D'
  }

  const operationColors = {
    create: '#e8f5e8',
    read: '#e8f4fd',
    update: '#fff3e0',
    delete: '#fce4ec'
  }

  // 管理者モード（認証なし）のため、制限メッセージは削除

  return (
    <PageContainer>
      <Header>
        <Title>権限マトリックス</Title>
        <Description>
          各ユーザーの画面・操作権限をマトリックス形式で表示します。
          C=作成, R=参照, U=更新, D=削除
        </Description>
      </Header>

      <MatrixContainer>
        <MatrixTable>
          <thead>
            <tr>
              <th rowSpan={2}>ユーザー</th>
              {screens.map((screen) => (
                <th key={screen.name} colSpan={screen.operations.length} className="screen-header">
                  {screen.name}
                </th>
              ))}
            </tr>
            <tr>
              {screens.map((screen) =>
                screen.operations.map((operation) => (
                  <th key={`${screen.name}_${operation}`}>
                    {operationLabels[operation as keyof typeof operationLabels]}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((userData) => (
              <tr key={userData.id}>
                <td className="user-header">
                  {userData.username}
                  <br />
                  <small>({userData.role})</small>
                </td>
                {screens.map((screen) =>
                  screen.operations.map((operation) => {
                    const key = `${screen.name}_${operation}`
                    const hasPermission = permissions[userData.id.toString()]?.[key] || false
                    
                    return (
                      <PermissionCell
                        key={`${userData.id}_${key}`}
                        $hasPermission={hasPermission}
                        $operationType={operation}
                      >
                        {hasPermission ? operationLabels[operation as keyof typeof operationLabels] : '-'}
                      </PermissionCell>
                    )
                  })
                )}
              </tr>
            ))}
          </tbody>
        </MatrixTable>
      </MatrixContainer>

      <Legend>
        <LegendTitle>凡例</LegendTitle>
        <LegendGrid>
          <LegendItem>
            <LegendColor $color={operationColors.create} />
            <LegendText>C - 作成権限</LegendText>
          </LegendItem>
          <LegendItem>
            <LegendColor $color={operationColors.read} />
            <LegendText>R - 参照権限</LegendText>
          </LegendItem>
          <LegendItem>
            <LegendColor $color={operationColors.update} />
            <LegendText>U - 更新権限</LegendText>
          </LegendItem>
          <LegendItem>
            <LegendColor $color={operationColors.delete} />
            <LegendText>D - 削除権限</LegendText>
          </LegendItem>
          <LegendItem>
            <LegendColor $color="#f8f9fa" />
            <LegendText>- - 権限なし</LegendText>
          </LegendItem>
        </LegendGrid>
      </Legend>
    </PageContainer>
  )
}

export default PermissionMatrixPage

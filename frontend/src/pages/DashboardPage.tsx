import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useAuth } from '../hooks/useAuth'

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const StatsCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
`

const StatsTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const StatsValue = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xxxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
`

const WelcomeSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xxl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`

const WelcomeTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xxxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const WelcomeText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  text-align: center;
  transition: ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`

const PermissionMatrixSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`

const MatrixTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.xxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`

const MatrixTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${({ theme }) => theme.spacing.md};
  
  th, td {
    padding: ${({ theme }) => theme.spacing.md};
    text-align: center;
    border: 1px solid ${({ theme }) => theme.colors.border};
  }
  
  th {
    background-color: ${({ theme }) => theme.colors.gray100};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
  
  td {
    background-color: ${({ theme }) => theme.colors.white};
  }
`

const PermissionBadge = styled.span<{ $hasPermission: boolean }>`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  background-color: ${({ theme, $hasPermission }) => 
    $hasPermission ? theme.colors.success : theme.colors.gray300};
  color: ${({ theme, $hasPermission }) => 
    $hasPermission ? theme.colors.white : theme.colors.textSecondary};
`

const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  const [stats] = useState({
    customers: 3,
    products: 4,
    orders: 3,
    users: 2
  })

  const features = [
    {
      icon: '👥',
      title: '顧客管理',
      description: '顧客情報の登録、検索、編集、削除を行えます。権限に応じて操作が制限されます。'
    },
    {
      icon: '📦',
      title: '商品管理',
      description: '商品マスタの管理を行います。在庫管理や価格設定も可能です。'
    },
    {
      icon: '📝',
      title: '注文管理',
      description: '注文の照会、訂正、取消を権限に応じて実行できます。'
    },
    {
      icon: '🔐',
      title: '権限マトリックス',
      description: 'ユーザーごとの画面・操作権限をマトリックス形式で管理できます。'
    }
  ]

  // 現在のユーザーの権限例（サンプルデータ）
  const userPermissions = {
    '顧客登録': user?.role === 'admin',
    '顧客検索': true,
    '顧客削除': user?.role === 'admin',
    '注文照会': true,
    '注文訂正': user?.role === 'admin',
    '注文取消': user?.role === 'admin',
  }

  return (
    <>
      <WelcomeSection>
        <WelcomeTitle>
          ようこそ、{user?.username}さん！
        </WelcomeTitle>
        <WelcomeText>
          KIS Demo - CRUD マトリックス管理システムへようこそ。
          <br />
          このシステムでは、顧客・商品・注文の管理と、それぞれの操作権限をきめ細かく制御できます。
        </WelcomeText>
      </WelcomeSection>

      <DashboardContainer>
        <StatsCard>
          <StatsTitle>顧客数</StatsTitle>
          <StatsValue>{stats.customers}</StatsValue>
        </StatsCard>
        
        <StatsCard>
          <StatsTitle>商品数</StatsTitle>
          <StatsValue>{stats.products}</StatsValue>
        </StatsCard>
        
        <StatsCard>
          <StatsTitle>注文数</StatsTitle>
          <StatsValue>{stats.orders}</StatsValue>
        </StatsCard>
        
        <StatsCard>
          <StatsTitle>ユーザー数</StatsTitle>
          <StatsValue>{stats.users}</StatsValue>
        </StatsCard>
      </DashboardContainer>

      <FeatureGrid>
        {features.map((feature, index) => (
          <FeatureCard key={index}>
            <FeatureIcon>{feature.icon}</FeatureIcon>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureCard>
        ))}
      </FeatureGrid>

      <PermissionMatrixSection>
        <MatrixTitle>あなたの権限状況</MatrixTitle>
        <MatrixTable>
          <thead>
            <tr>
              <th>機能</th>
              <th>権限状況</th>
              <th>説明</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(userPermissions).map(([screen, hasPermission]) => (
              <tr key={screen}>
                <td>{screen}</td>
                <td>
                  <PermissionBadge $hasPermission={hasPermission}>
                    {hasPermission ? '許可' : '制限'}
                  </PermissionBadge>
                </td>
                <td>
                  {hasPermission 
                    ? 'この機能を使用できます' 
                    : '管理者権限が必要です'
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </MatrixTable>
      </PermissionMatrixSection>
    </>
  )
}

export default DashboardPage

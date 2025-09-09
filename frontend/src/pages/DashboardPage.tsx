import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const StatsCard = styled.div<{ $color: string }>`
  background: linear-gradient(135deg, ${({ $color }) => $color}15, ${({ $color }) => $color}08);
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 1px solid ${({ $color }) => $color}20;
  position: relative;
  overflow: hidden;
  transition: ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ $color }) => $color};
  }
`

const StatsIcon = styled.div<{ $color: string }>`
  width: 60px;
  height: 60px;
  background: ${({ $color }) => $color}20;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const StatsTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const StatsValue = styled.div<{ $color: string }>`
  font-size: ${({ theme }) => theme.fontSize.xxxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ $color }) => $color};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const StatsChange = styled.div<{ $positive: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme, $positive }) => $positive ? theme.colors.success : theme.colors.danger};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  
  &::before {
    content: '${({ $positive }) => $positive ? '↗' : '↘'}';
    margin-right: 4px;
  }
`

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`

const ChartCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
`

const ChartTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const SimpleChart = styled.div`
  height: 200px;
  display: flex;
  align-items: end;
  gap: 4px;
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderLight};
  position: relative;
`

const ChartBar = styled.div<{ $height: number; $color: string }>`
  flex: 1;
  height: ${({ $height }) => $height}%;
  background: linear-gradient(to top, ${({ $color }) => $color}, ${({ $color }) => $color}80);
  border-radius: 2px 2px 0 0;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.8;
    transform: scaleY(1.05);
  }
`

const ActivityFeed = styled.div`
  max-height: 300px;
  overflow-y: auto;
`

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  
  &:last-child {
    border-bottom: none;
  }
`

const ActivityIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  background: ${({ $color }) => $color}20;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
`

const ActivityContent = styled.div`
  flex: 1;
`

const ActivityText = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`

const ActivityTime = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
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
  const [stats] = useState({
    customers: 127,
    products: 89,
    orders: 256,
    revenue: 15840000
  })

  // 過去30日間の売上データ（擬似データ）
  const [salesData] = useState(() => {
    const data = []
    const today = new Date()
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const baseAmount = Math.random() * 200000 + 50000
      data.push({
        date: date.toISOString().split('T')[0],
        amount: Math.floor(baseAmount),
        orders: Math.floor(Math.random() * 15) + 5
      })
    }
    return data
  })

  // リアルタイム風の数値アニメーション
  const [animatedStats, setAnimatedStats] = useState({
    customers: 0,
    products: 0,
    orders: 0,
    revenue: 0
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedStats(prev => ({
        customers: Math.min(prev.customers + Math.ceil((stats.customers - prev.customers) * 0.1), stats.customers),
        products: Math.min(prev.products + Math.ceil((stats.products - prev.products) * 0.1), stats.products),
        orders: Math.min(prev.orders + Math.ceil((stats.orders - prev.orders) * 0.1), stats.orders),
        revenue: Math.min(prev.revenue + Math.ceil((stats.revenue - prev.revenue) * 0.1), stats.revenue)
      }))
    }, 50)

    setTimeout(() => clearInterval(interval), 2000)
    return () => clearInterval(interval)
  }, [stats])

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

  // 管理者権限（認証なし）のサンプルデータ
  const userPermissions = {
    '顧客登録': true,
    '顧客検索': true,
    '顧客削除': true,
    '注文照会': true,
    '注文訂正': true,
    '注文取消': true,
  }

  // 最近のアクティビティ（擬似データ）
  const recentActivities = [
    { icon: '🛒', text: '新規注文が作成されました', time: '2分前', color: '#3b82f6' },
    { icon: '👤', text: '新規顧客が登録されました', time: '15分前', color: '#10b981' },
    { icon: '📦', text: '商品在庫が更新されました', time: '32分前', color: '#f59e0b' },
    { icon: '🚚', text: '注文が発送されました', time: '1時間前', color: '#8b5cf6' },
    { icon: '✅', text: '注文が完了しました', time: '2時間前', color: '#06d6a0' }
  ]

  const maxSalesAmount = Math.max(...salesData.map(d => d.amount))

  return (
    <DashboardGrid>
      <WelcomeSection>
        <WelcomeTitle>
          ようこそ、KIS Demo へ！
        </WelcomeTitle>
        <WelcomeText>
          リアルタイムビジネスダッシュボード - 売上、注文、在庫状況を一目で把握
        </WelcomeText>
      </WelcomeSection>

      <StatsContainer>
        <StatsCard $color="#3b82f6">
          <StatsIcon $color="#3b82f6">👥</StatsIcon>
          <StatsTitle>総顧客数</StatsTitle>
          <StatsValue $color="#3b82f6">{animatedStats.customers.toLocaleString()}</StatsValue>
          <StatsChange $positive={true}>+12% 先月比</StatsChange>
        </StatsCard>
        
        <StatsCard $color="#10b981">
          <StatsIcon $color="#10b981">📦</StatsIcon>
          <StatsTitle>商品数</StatsTitle>
          <StatsValue $color="#10b981">{animatedStats.products.toLocaleString()}</StatsValue>
          <StatsChange $positive={true}>+5% 先月比</StatsChange>
        </StatsCard>
        
        <StatsCard $color="#f59e0b">
          <StatsIcon $color="#f59e0b">📝</StatsIcon>
          <StatsTitle>今月の注文</StatsTitle>
          <StatsValue $color="#f59e0b">{animatedStats.orders.toLocaleString()}</StatsValue>
          <StatsChange $positive={true}>+18% 先月比</StatsChange>
        </StatsCard>
        
        <StatsCard $color="#8b5cf6">
          <StatsIcon $color="#8b5cf6">💰</StatsIcon>
          <StatsTitle>月間売上</StatsTitle>
          <StatsValue $color="#8b5cf6">¥{animatedStats.revenue.toLocaleString()}</StatsValue>
          <StatsChange $positive={true}>+23% 先月比</StatsChange>
        </StatsCard>
      </StatsContainer>

      <ChartsContainer>
        <ChartCard>
          <ChartTitle>過去30日間の売上推移</ChartTitle>
          <SimpleChart>
            {salesData.slice(-14).map((data, index) => (
              <ChartBar
                key={index}
                $height={(data.amount / maxSalesAmount) * 100}
                $color={index % 2 === 0 ? '#3b82f6' : '#06d6a0'}
                title={`${data.date}: ¥${data.amount.toLocaleString()}`}
              />
            ))}
          </SimpleChart>
          <div style={{ marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
            直近2週間の日別売上（ホバーで詳細表示）
          </div>
        </ChartCard>

        <ChartCard>
          <ChartTitle>最近のアクティビティ</ChartTitle>
          <ActivityFeed>
            {recentActivities.map((activity, index) => (
              <ActivityItem key={index}>
                <ActivityIcon $color={activity.color}>
                  {activity.icon}
                </ActivityIcon>
                <ActivityContent>
                  <ActivityText>{activity.text}</ActivityText>
                  <ActivityTime>{activity.time}</ActivityTime>
                </ActivityContent>
              </ActivityItem>
            ))}
          </ActivityFeed>
        </ChartCard>
      </ChartsContainer>
    </DashboardGrid>
  )
}

export default DashboardPage

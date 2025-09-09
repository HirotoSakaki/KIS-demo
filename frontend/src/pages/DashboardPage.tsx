import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

const DashboardContainer = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  color: white;
  padding: ${({ theme }) => theme.spacing.xxl};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="30" r="3" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="70" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="90" cy="80" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
    opacity: 0.3;
  }
`

const WelcomeTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xxxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  position: relative;
  z-index: 1;
`

const WelcomeText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.lg};
  opacity: 0.9;
  margin: 0;
  position: relative;
  z-index: 1;
`

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const StatsCard = styled.div<{ $color: string; $clickable?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border-left: 6px solid ${({ $color }) => $color};
  position: relative;
  overflow: hidden;
  transition: ${({ theme }) => theme.transitions.normal};
  cursor: ${({ $clickable }) => $clickable ? 'pointer' : 'default'};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, ${({ $color }) => $color}15, transparent);
    border-radius: 50%;
    transform: translate(30px, -30px);
  }
`

const StatsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const StatsIcon = styled.div<{ $color: string }>`
  width: 50px;
  height: 50px;
  background: ${({ $color }) => $color}20;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`

const StatsTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const StatsValue = styled.div<{ $color: string }>`
  font-size: ${({ theme }) => theme.fontSize.xxxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ $color }) => $color};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  position: relative;
  z-index: 1;
`

const StatsSubtext = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`

const StatsChange = styled.span<{ $positive: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme, $positive }) => $positive ? theme.colors.success : theme.colors.danger};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  
  &::before {
    content: '${({ $positive }) => $positive ? '↗' : '↘'}';
    margin-right: 4px;
  }
`

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`

const ChartSection = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`

const SideSection = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
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
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const SimpleChart = styled.div`
  height: 250px;
  display: flex;
  align-items: end;
  gap: 6px;
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderLight};
  position: relative;
`

const ChartBar = styled.div<{ $height: number; $color: string; $label: string }>`
  flex: 1;
  height: ${({ $height }) => $height}%;
  background: linear-gradient(to top, ${({ $color }) => $color}, ${({ $color }) => $color}80);
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
    transform: scaleY(1.05);
    
    &::after {
      content: '${({ $label }) => $label}';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
    }
  }
`

const QuickActions = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
`

const ActionGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`

const ActionButton = styled.button<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ $color }) => $color}20;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    border-color: ${({ $color }) => $color};
    background: ${({ $color }) => $color}10;
    transform: translateY(-2px);
  }
`

const ActionIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  background: ${({ $color }) => $color}20;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`

const ActionText = styled.div`
  text-align: left;
`

const ActionTitle = styled.div`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSize.md};
`

const ActionDesc = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`

const ActivityFeed = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
`

const ActivityList = styled.div`
  max-height: 350px;
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
  margin-bottom: 2px;
`

const ActivityTime = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  
  // リアルタイム統計データ（実際のテーブル構造に基づく）
  const [stats] = useState({
    customers: 127,
    products: 89,
    orders: 256,
    revenue: 15840000,
    partners: 45,
    suppliers: 32,
    invoices: 184,
    inventory: 156
  })

  // 過去30日間の売上データ
  const [salesData] = useState(() => {
    const data = []
    const today = new Date()
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const baseAmount = Math.random() * 200000 + 50000
      data.push({
        date: date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }),
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

  // 最近のアクティビティ
  const recentActivities = [
    { icon: '🆕', text: 'サンプル自動車株式会社から新規注文', time: '2分前', color: '#3b82f6' },
    { icon: '📦', text: 'ビジネスノートパソコン Pro の在庫補充完了', time: '15分前', color: '#10b981' },
    { icon: '💰', text: '請求書 INV-2024-158 が支払い完了', time: '32分前', color: '#f59e0b' },
    { icon: '👥', text: 'グローバル電子株式会社が新規登録', time: '1時間前', color: '#8b5cf6' },
    { icon: '📋', text: '契約書 CON-2024-010 の書類が完成', time: '2時間前', color: '#06d6a0' },
    { icon: '🚛', text: 'サンプル重工業への大型商品配送が完了', time: '3時間前', color: '#0f172a' }
  ]

  const maxSalesAmount = Math.max(...salesData.map(d => d.amount))

  const quickActions = [
    { icon: '👥', title: '新規顧客登録', desc: '顧客情報を追加', color: '#1e3a8a', path: '/customers' },
    { icon: '📦', title: '商品登録', desc: '新しい商品を追加', color: '#0f172a', path: '/products' },
    { icon: '📝', title: '注文作成', desc: '新規注文を作成', color: '#7c2d12', path: '/orders' },
    { icon: '💸', title: '請求書発行', desc: '新しい請求書を作成', color: '#4facfe', path: '/invoices' }
  ]

  return (
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeTitle> 統合管理システム</WelcomeTitle>
        <WelcomeText>リアルタイム業務ダッシュボード - 全社データを一元監視</WelcomeText>
      </WelcomeSection>

      <StatsContainer>
        <StatsCard $color="#1e3a8a" $clickable onClick={() => navigate('/customers')}>
          <StatsHeader>
            <StatsIcon $color="#1e3a8a">👥</StatsIcon>
            <StatsTitle>顧客数</StatsTitle>
          </StatsHeader>
          <StatsValue $color="#1e3a8a">{animatedStats.customers.toLocaleString()}</StatsValue>
          <StatsSubtext>
            <span>アクティブ顧客</span>
            <StatsChange $positive={true}>+12% 先月比</StatsChange>
          </StatsSubtext>
        </StatsCard>

        <StatsCard $color="#0f172a" $clickable onClick={() => navigate('/products')}>
          <StatsHeader>
            <StatsIcon $color="#0f172a">📦</StatsIcon>
            <StatsTitle>商品数</StatsTitle>
          </StatsHeader>
          <StatsValue $color="#0f172a">{animatedStats.products.toLocaleString()}</StatsValue>
          <StatsSubtext>
            <span>管理商品</span>
            <StatsChange $positive={true}>+5% 先月比</StatsChange>
          </StatsSubtext>
        </StatsCard>

        <StatsCard $color="#7c2d12" $clickable onClick={() => navigate('/orders')}>
          <StatsHeader>
            <StatsIcon $color="#7c2d12">📝</StatsIcon>
            <StatsTitle>今月注文</StatsTitle>
          </StatsHeader>
          <StatsValue $color="#7c2d12">{animatedStats.orders.toLocaleString()}</StatsValue>
          <StatsSubtext>
            <span>処理済み注文</span>
            <StatsChange $positive={true}>+18% 先月比</StatsChange>
          </StatsSubtext>
        </StatsCard>

        <StatsCard $color="#10b981">
          <StatsHeader>
            <StatsIcon $color="#10b981">💰</StatsIcon>
            <StatsTitle>月間売上</StatsTitle>
          </StatsHeader>
          <StatsValue $color="#10b981">¥{animatedStats.revenue.toLocaleString()}</StatsValue>
          <StatsSubtext>
            <span>総売上高</span>
            <StatsChange $positive={true}>+23% 先月比</StatsChange>
          </StatsSubtext>
        </StatsCard>
      </StatsContainer>

      <MainContent>
        <ChartSection>
          <ChartCard>
            <ChartTitle>
              📈 過去2週間の売上推移
            </ChartTitle>
            <SimpleChart>
              {salesData.map((data, index) => (
                <ChartBar
                  key={index}
                  $height={(data.amount / maxSalesAmount) * 100}
                  $color={index % 3 === 0 ? '#3b82f6' : index % 3 === 1 ? '#10b981' : '#f59e0b'}
                  $label={`${data.date}: ¥${data.amount.toLocaleString()}`}
                />
              ))}
            </SimpleChart>
            <div style={{ marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
              📊 日別売上データ（バーにマウスオーバーで詳細表示）
            </div>
          </ChartCard>
        </ChartSection>

        <SideSection>
          <QuickActions>
            <ChartTitle>⚡ クイックアクション</ChartTitle>
            <ActionGrid>
              {quickActions.map((action, index) => (
                <ActionButton
                  key={index}
                  $color={action.color}
                  onClick={() => navigate(action.path)}
                >
                  <ActionIcon $color={action.color}>
                    {action.icon}
                  </ActionIcon>
                  <ActionText>
                    <ActionTitle>{action.title}</ActionTitle>
                    <ActionDesc>{action.desc}</ActionDesc>
                  </ActionText>
                </ActionButton>
              ))}
            </ActionGrid>
          </QuickActions>

          <ActivityFeed>
            <ChartTitle>🔔 最近のアクティビティ</ChartTitle>
            <ActivityList>
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
            </ActivityList>
          </ActivityFeed>
        </SideSection>
      </MainContent>
    </DashboardContainer>
  )
}

export default DashboardPage
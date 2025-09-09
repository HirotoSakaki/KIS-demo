import React from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`

const Sidebar = styled.nav`
  width: 250px;
  background-color: ${({ theme }) => theme.colors.dark};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`

const MainContent = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background};
`

const Header = styled.header`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Logo = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const NavItem = styled.li<{ $isActive: boolean }>`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  a {
    display: block;
    padding: ${({ theme }) => theme.spacing.md};
    color: ${({ theme, $isActive }) => 
      $isActive ? theme.colors.primary : theme.colors.white};
    text-decoration: none;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background-color: ${({ theme, $isActive }) => 
      $isActive ? theme.colors.white : 'transparent'};
    transition: ${({ theme }) => theme.transitions.normal};
    
    &:hover {
      background-color: ${({ theme, $isActive }) => 
        $isActive ? theme.colors.white : theme.colors.gray700};
      color: ${({ theme, $isActive }) => 
        $isActive ? theme.colors.primary : theme.colors.white};
      text-decoration: none;
    }
  }
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`

const UserName = styled.span`
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`

const LogoutButton = styled.button`
  background-color: ${({ theme }) => theme.colors.danger};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    background-color: #c82333;
  }
`

const PageTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.xxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()

  const navigationItems = [
    { path: '/dashboard', label: 'ダッシュボード', icon: '📊' },
    { path: '/shippers', label: '荷主・代理店管理', icon: '🏭' },
    { path: '/vessels', label: '船舶・運航管理', icon: '🚢' },
    { path: '/cargo', label: '貨物・積荷管理', icon: '📦' },
    { path: '/terminals', label: 'ターミナル・港湾管理', icon: '🏗️' },
    { path: '/crew', label: '船員・乗組員管理', icon: '👨‍✈️' },
    { path: '/documents', label: '契約・船積書類管理', icon: '📋' },
    { path: '/schedules', label: 'スケジュール・ダイヤ管理', icon: '⏰' },
  ]

  const getPageTitle = (pathname: string) => {
    const item = navigationItems.find(item => item.path === pathname)
    return item?.label || 'KIS Demo'
  }

  return (
    <LayoutContainer>
      <Sidebar>
        <Logo>📋 KIS Demo</Logo>
        <NavList>
          {navigationItems.map((item) => (
            <NavItem key={item.path} $isActive={location.pathname === item.path}>
              <Link to={item.path}>
                <span style={{ marginRight: '8px' }}>{item.icon}</span>
                {item.label}
              </Link>
            </NavItem>
          ))}
        </NavList>
      </Sidebar>
      
      <MainContent>
        <Header>
          <PageTitle>{getPageTitle(location.pathname)}</PageTitle>
          <UserInfo>
            <UserName>
              管理者モード（認証なし）
            </UserName>
          </UserInfo>
        </Header>
        {children}
      </MainContent>
    </LayoutContainer>
  )
}

export default Layout

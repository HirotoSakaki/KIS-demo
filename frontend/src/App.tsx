import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { theme } from './styles/theme'
import GlobalStyle from './styles/GlobalStyle'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import ShippersPage from './pages/ShippersPage'
import VesselsPage from './pages/VesselsPage'
import CargoPage from './pages/CargoPage'
import PartnersPage from './pages/PartnersPage'
import SuppliersPage from './pages/SuppliersPage'
import InvoicesPage from './pages/InvoicesPage'
import InventoryPage from './pages/InventoryPage'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/shippers" element={<ShippersPage />} />
            <Route path="/vessels" element={<VesselsPage />} />
            <Route path="/cargo" element={<CargoPage />} />
            <Route path="/terminals" element={<PartnersPage />} />
            <Route path="/crew" element={<SuppliersPage />} />
            <Route path="/documents" element={<InvoicesPage />} />
            <Route path="/schedules" element={<InventoryPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  )
}

export default App

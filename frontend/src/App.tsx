import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { theme } from './styles/theme'
import GlobalStyle from './styles/GlobalStyle'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import CustomersPage from './pages/CustomersPage'
import ProductsPage from './pages/ProductsPage'
import OrdersPage from './pages/OrdersPage'
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
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  )
}

export default App

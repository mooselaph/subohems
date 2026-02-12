import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Menu from './pages/Menu'
import Reservations from './pages/Reservations'
import Users from './pages/Users'
import Orders from './pages/Orders'
import NewOrder from './pages/NewOrder'
import ActiveOrders from './pages/ActiveOrders'
import OrderHistory from './pages/OrderHistory'
import Inventory from './pages/Inventory'
import Reports from './pages/Reports'

export default function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [showSubmenuSelection, setShowSubmenuSelection] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleNavigate = (page) => {
    setActivePage(page)
    setShowSubmenuSelection(null)
  }

  const handleShowSubmenu = (menuKey, children) => {
    setShowSubmenuSelection({ menuKey, children })
  }

  const renderPage = () => {
    if (showSubmenuSelection) {
      return (
        <div className="page submenu-selection">
          <h1>{showSubmenuSelection.menuKey === 'management' ? 'Management' : 'Orders'}</h1>
          <p>Select an option below</p>
          <div className="submenu-grid">
            {showSubmenuSelection.children.map((child) => (
              <button
                key={child.key}
                className="submenu-card"
                onClick={() => handleNavigate(child.key)}
              >
                <div className="submenu-label">{child.label}</div>
              </button>
            ))}
          </div>
        </div>
      )
    }

    switch (activePage) {
      case 'dashboard': return <Dashboard />
      case 'menu': return <Menu />
      case 'reservations': return <Reservations />
      case 'users': return <Users />
      case 'orders': return <Orders />
      case 'new-order': return <NewOrder />
      case 'active-orders': return <ActiveOrders />
      case 'order-history': return <OrderHistory />
      case 'inventory': return <Inventory />
      case 'reports': return <Reports />
      default: return <Dashboard />
    }
  }

  return (
    <div className="app layout">
      <Sidebar 
        activePage={activePage} 
        onNavigate={handleNavigate} 
        onShowSubmenu={handleShowSubmenu}
        onCollapsedChange={setSidebarCollapsed}
      />
      <main className={`content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {renderPage()}
      </main>
    </div>
  )
}

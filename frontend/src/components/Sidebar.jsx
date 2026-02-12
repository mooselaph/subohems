import React, { useState } from 'react'
import DashIcon from '../assets/icons/dashboard.svg'
import ManageIcon from '../assets/icons/management.svg'
import OrdersIcon from '../assets/icons/orders.svg'
import InventoryIcon from '../assets/icons/inventory.svg'
import ReportsIcon from '../assets/icons/reports.svg'
import MenuIcon from '../assets/icons/menu.svg'
import ReservationsIcon from '../assets/icons/reservations.svg'
import UserSettingsIcon from '../assets/icons/user-settings.svg'
import PlusIcon from '../assets/icons/plus.svg'
import ListIcon from '../assets/icons/list.svg'
import HistoryIcon from '../assets/icons/history.svg'

const MENU = [
  { key: 'dashboard', label: 'Dashboard', icon: DashIcon },
  {
    key: 'management',
    label: 'Management',
    icon: ManageIcon,
    children: [
      { key: 'menu', label: 'Menu', icon: MenuIcon },
      { key: 'reservations', label: 'Reservations', icon: ReservationsIcon },
      { key: 'users', label: 'Users', icon: UserSettingsIcon }
    ]
  },
  {
    key: 'orders',
    label: 'Orders',
    icon: OrdersIcon,
    children: [
      { key: 'new-order', label: 'New Order', icon: PlusIcon },
      { key: 'active-orders', label: "Today's Orders", icon: ListIcon },
      { key: 'order-history', label: 'Order History', icon: HistoryIcon }
    ]
  },
  { key: 'inventory', label: 'Inventory', icon: InventoryIcon },
  { key: 'reports', label: 'Reports', icon: ReportsIcon }
]

export default function Sidebar({ activePage, onNavigate, onShowSubmenu, onCollapsedChange }) {
  const [collapsed, setCollapsed] = useState(false)
  const [expanded, setExpanded] = useState('management')

  const handleCollapse = () => {
    const newCollapsed = !collapsed
    setCollapsed(newCollapsed)
    if (onCollapsedChange) {
      onCollapsedChange(newCollapsed)
    }
  }

  const toggleExpand = (key) => {
    setExpanded((current) => current === key ? null : key)
  }

  const handleMenuClick = (item, e) => {
    if (item.children && !collapsed) {
      e.preventDefault()
      toggleExpand(item.key)
    } else if (item.children && collapsed) {
      // When collapsed, show submenu selection in main content
      e.preventDefault()
      onShowSubmenu(item.key, item.children)
    } else if (!item.children) {
      onNavigate(item.key)
    }
  }

  const handleSubMenuClick = (subKey, e) => {
    e.stopPropagation()
    onNavigate(subKey)
  }

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button
        className="collapse-btn"
        onClick={handleCollapse}
        aria-label="Toggle sidebar"
      >
        {collapsed ? '▶' : '◀'}
      </button>

      <ul className="menu">
        {MENU.map((item) => (
          <React.Fragment key={item.key}>
            <li
              className={`menu-item ${item.children ? 'has-children' : ''} ${activePage === item.key ? 'active' : ''}`}
              role="button"
              tabIndex={0}
              onClick={(e) => handleMenuClick(item, e)}
              onTouchEnd={(e) => { e.preventDefault(); handleMenuClick(item, e); }}
              aria-expanded={item.children ? expanded === item.key : undefined}
            >
              <img src={item.icon} alt="" className="icon" aria-hidden />
              <span className="label">{item.label}</span>
              {item.children && !collapsed && (
                <span className="caret" aria-hidden>{expanded === item.key ? '▾' : '▸'}</span>
              )}
            </li>
            
            {item.children && !collapsed && (
              <li className={`submenu-wrapper ${expanded === item.key ? 'expanded' : ''}`}>
                <ul className="submenu" aria-hidden={expanded !== item.key}>
                  {item.children.map((sub) => (
                    <li
                      key={sub.key}
                      className={`sub-item ${activePage === sub.key ? 'active' : ''}`}
                      role="button"
                      tabIndex={0}
                      onClick={(e) => handleSubMenuClick(sub.key, e)}
                    >
                      {sub.icon && <img src={sub.icon} alt="" className="sub-icon" aria-hidden />}
                      <span className="label">{sub.label}</span>
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </React.Fragment>
        ))}
      </ul>
    </aside>
  )
}

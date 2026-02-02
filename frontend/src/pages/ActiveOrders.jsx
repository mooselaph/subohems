import React, { useState, useEffect } from 'react'

export default function ActiveOrders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    // Load orders from localStorage
    const loadOrders = () => {
      const savedOrders = localStorage.getItem('activeOrders')
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders))
      }
    }
    
    loadOrders()

    // Listen for custom event when new orders are added
    const handleOrderUpdate = () => {
      loadOrders()
    }

    window.addEventListener('ordersUpdated', handleOrderUpdate)
    
    // Refresh every 3 seconds to catch any updates
    const interval = setInterval(loadOrders, 3000)

    return () => {
      window.removeEventListener('ordersUpdated', handleOrderUpdate)
      clearInterval(interval)
    }
  }, [])

  const handleItemCheck = (orderId, itemId) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item => {
          if (item.id === itemId) {
            let newCheckedCount = (item.checkedCount || 0) + 1
            // Cycle through: 0 -> 1 -> 2 -> ... -> quantity -> 0 (unchecked)
            if (newCheckedCount > item.quantity) {
              newCheckedCount = 0
            }
            return {
              ...item,
              checkedCount: newCheckedCount,
              isComplete: newCheckedCount >= item.quantity
            }
          }
          return item
        })
        return { ...order, items: updatedItems }
      }
      return order
    })
    setOrders(updatedOrders)
    localStorage.setItem('activeOrders', JSON.stringify(updatedOrders))
  }

  const handleCompleteTicket = (orderId) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, isCompleted: true }
      }
      return order
    })
    setOrders(updatedOrders)
    localStorage.setItem('activeOrders', JSON.stringify(updatedOrders))
  }

  const handleReactivateTicket = (orderId) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, isCompleted: false }
      }
      return order
    })
    setOrders(updatedOrders)
    localStorage.setItem('activeOrders', JSON.stringify(updatedOrders))
  }

  const isTicketComplete = (order) => {
    return order.items.length > 0 && order.items.every(item => item.isComplete)
  }

  const activeOrders = orders.filter(order => !order.isCompleted)
  const completedOrders = orders.filter(order => order.isCompleted)

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const getOrderSummary = () => {
    const summary = {}
    activeOrders.forEach(order => {
      order.items.forEach(item => {
        // Only count items that are not complete
        if (!item.isComplete) {
          const itemName = item.item.name
          if (summary[itemName]) {
            summary[itemName] += item.quantity
          } else {
            summary[itemName] = item.quantity
          }
        }
      })
    })
    return Object.entries(summary)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  const orderSummary = getOrderSummary()

  return (
    <div className="page active-orders-page">
      <h1>Today's Orders</h1>
      
      <div className="orders-container">
        <div className="orders-main">
          {/* Active Orders Section */}
          <div className="orders-section">
        <h2 className="section-title">Active Orders</h2>
        {activeOrders.length === 0 ? (
          <p className="no-orders">No active orders</p>
        ) : (
          <div className="tickets-grid">
            {activeOrders.map((order) => (
              <div key={order.id} className={`ticket ${order.type === 'takeout' ? 'ticket-takeout' : ''}`}>
                <div className="ticket-header">
                  <div className="ticket-table">
                    {order.table === 'no-table' && order.type === 'takeout'
                      ? 'Takeout'
                      : order.table === 'no-table'
                        ? 'No Table'
                        : `Table ${order.table}`}
                  </div>
                  <div className="ticket-time">#{order.orderNumber || order.id} • {formatTime(order.timestamp)}</div>
                </div>
                
                <div className="ticket-items">
                  {order.items.map((item) => (
                    <div key={item.id} className="ticket-item">
                      <label className="ticket-item-label">
                        <input
                          type="checkbox"
                          checked={item.isComplete}
                          onChange={() => handleItemCheck(order.id, item.id)}
                          className="ticket-checkbox"
                        />
                        <span className={`item-text ${item.isComplete ? 'complete' : ''}`}>
                          {item.item.name} x{item.quantity}
                          {item.checkedCount > 0 && !item.isComplete && (
                            <span className="progress-indicator"> ({item.checkedCount}/{item.quantity})</span>
                          )}
                        </span>
                      </label>
                      {item.notes && (
                        <div className="item-note">Note: {item.notes}</div>
                      )}
                    </div>
                  ))}
                </div>

                {isTicketComplete(order) && (
                  <button className="complete-ticket-btn" onClick={() => handleCompleteTicket(order.id)}>
                    ✓ Complete Ticket
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Orders Section */}
      <div className="orders-section">
        <h2 className="section-title">Completed Orders</h2>
        {completedOrders.length === 0 ? (
          <p className="no-orders">No completed orders</p>
        ) : (
          <div className="tickets-grid">
            {completedOrders.map((order) => (
              <div key={order.id} className={`ticket ticket-completed ${order.type === 'takeout' ? 'ticket-takeout' : ''}`}>
                <div className="ticket-header">
                  <div className="ticket-table">
                    {order.table === 'no-table' && order.type === 'takeout'
                      ? 'Takeout'
                      : order.table === 'no-table'
                        ? 'No Table'
                        : `Table ${order.table}`}
                  </div>
                  <div className="ticket-time">#{order.orderNumber || order.id} • {formatTime(order.timestamp)}</div>
                </div>
                
                <div className="ticket-items">
                  {order.items.map((item) => (
                    <div key={item.id} className="ticket-item">
                      <span className="item-text complete">
                        {item.item.name} x{item.quantity}
                      </span>
                      {item.notes && (
                        <div className="item-note">Note: {item.notes}</div>
                      )}
                    </div>
                  ))}
                </div>

                <button className="reactivate-btn" onClick={() => handleReactivateTicket(order.id)}>
                  ↺ Back to Active
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
        </div>

        {/* Summary Sidebar */}
        <aside className="orders-summary">
          <h3>Items Summary</h3>
          {orderSummary.length === 0 ? (
            <p className="summary-empty">No active items</p>
          ) : (
            <div className="summary-list">
              {orderSummary.map((item, idx) => (
                <div key={idx} className="summary-item">
                  <span className="summary-name">{item.name}</span>
                  <span className="summary-qty">{item.qty}</span>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

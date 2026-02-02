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
    const updatedOrders = orders.filter(order => order.id !== orderId)
    setOrders(updatedOrders)
    localStorage.setItem('activeOrders', JSON.stringify(updatedOrders))
  }

  const isTicketComplete = (order) => {
    return order.items.length > 0 && order.items.every(item => item.isComplete)
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="page active-orders-page">
      <h1>Active Orders</h1>
      
      {orders.length === 0 ? (
        <p className="no-orders">No active orders</p>
      ) : (
        <div className="tickets-grid">
          {orders.map((order) => (
            <div key={order.id} className={`ticket ${order.type === 'takeout' ? 'ticket-takeout' : ''}`}>
              <div className="ticket-header">
                <div className="ticket-table">
                  {order.type === 'takeout' ? 'Takeout' : order.table === 'no-table' ? 'No Table' : `Table ${order.table}`}
                </div>
                <div className="ticket-time">{formatTime(order.timestamp)}</div>
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
  )
}

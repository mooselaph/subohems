import React, { useState, useEffect } from 'react'

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selectedPreset, setSelectedPreset] = useState('')

  useEffect(() => {
    const loadOrders = () => {
      const savedOrders = localStorage.getItem('activeOrders')
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders))
      }
    }

    loadOrders()

    const handleOrderUpdate = () => {
      loadOrders()
    }

    window.addEventListener('ordersUpdated', handleOrderUpdate)
    const interval = setInterval(loadOrders, 3000)

    return () => {
      window.removeEventListener('ordersUpdated', handleOrderUpdate)
      clearInterval(interval)
    }
  }, [])

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
  }

  const formatDateForInput = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const setPresetDates = (preset) => {
    setSelectedPreset(preset)
    
    if (preset === 'custom') {
      return
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let from = new Date(today)
    let to = new Date(today)
    to.setHours(23, 59, 59, 999)

    switch (preset) {
      case 'alltime':
        setFromDate('')
        setToDate('')
        return
      case 'today':
        from = new Date(today)
        to = new Date(today)
        break
      case 'yesterday':
        from = new Date(today)
        from.setDate(from.getDate() - 1)
        to = new Date(from)
        break
      case 'week':
        from = new Date(today)
        from.setDate(from.getDate() - 7)
        to = new Date(today)
        break
      case 'month':
        from = new Date(today)
        from.setMonth(from.getMonth() - 1)
        to = new Date(today)
        break
      default:
        break
    }

    setFromDate(formatDateForInput(from))
    setToDate(formatDateForInput(to))
  }

  const getFilteredOrders = () => {
    // If custom is selected but no dates are filled, return empty
    if (selectedPreset === 'custom' && !fromDate && !toDate) {
      return []
    }

    return orders.filter(order => {
      const orderDate = new Date(order.timestamp)
      const orderDateStr = orderDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
      
      let matchesFromDate = true
      let matchesToDate = true

      if (fromDate) {
        const from = new Date(fromDate)
        const fromStr = from.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
        matchesFromDate = orderDateStr >= fromStr
      }

      if (toDate) {
        const to = new Date(toDate)
        const toStr = to.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
        matchesToDate = orderDateStr <= toStr
      }

      return matchesFromDate && matchesToDate
    }).sort((a, b) => b.timestamp - a.timestamp)
  }

  const filteredOrders = getFilteredOrders()

  const getOrderSummary = () => {
    const itemQuantities = {}
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const itemName = item.item.name
        if (itemQuantities[itemName]) {
          itemQuantities[itemName] += item.quantity
        } else {
          itemQuantities[itemName] = item.quantity
        }
      })
    })

    const summary = {
      totalQuantity: filteredOrders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0),
      totalOrders: filteredOrders.length,
      completedOrders: filteredOrders.filter(o => o.isCompleted).length,
      cancelledOrders: 0,
      itemQuantities: Object.entries(itemQuantities)
        .map(([name, qty]) => ({ name, qty }))
        .sort((a, b) => b.qty - a.qty)
    }
    return summary
  }

  const orderSummary = getOrderSummary()

  return (
    <div className="page order-history-page">
      <h1>Order History</h1>

      <div className="history-container">
        <div className="history-main">
          <div className="date-filter">
            <div className="preset-buttons">
              <button className={`preset-btn ${selectedPreset === 'alltime' ? 'active' : ''}`} onClick={() => setPresetDates('alltime')}>All Time</button>
              <button className={`preset-btn ${selectedPreset === 'today' ? 'active' : ''}`} onClick={() => setPresetDates('today')}>Today</button>
              <button className={`preset-btn ${selectedPreset === 'yesterday' ? 'active' : ''}`} onClick={() => setPresetDates('yesterday')}>Yesterday</button>
              <button className={`preset-btn ${selectedPreset === 'week' ? 'active' : ''}`} onClick={() => setPresetDates('week')}>Last 7 Days</button>
              <button className={`preset-btn ${selectedPreset === 'month' ? 'active' : ''}`} onClick={() => setPresetDates('month')}>Last Month</button>
              <button className={`preset-btn ${selectedPreset === 'custom' ? 'active' : ''}`} onClick={() => setPresetDates('custom')}>Custom</button>
            </div>

            {selectedPreset === 'custom' && (
              <>
                <div className="preset-info">Select custom date range</div>

                <div className="date-input-group">
                  <label htmlFor="from-date">From Date:</label>
                  <input
                    id="from-date"
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>

                <div className="date-input-group">
                  <label htmlFor="to-date">To Date:</label>
                  <input
                    id="to-date"
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>

                {(fromDate || toDate) && (
                  <button className="clear-dates-btn" onClick={() => { setFromDate(''); setToDate('') }}>
                    Clear Dates
                  </button>
                )}
              </>
            )}
          </div>

          <div className="history-results">
        <p className="result-count">{filteredOrders.length} order(s) found</p>
        
        {filteredOrders.length === 0 ? (
          <p className="no-orders">No orders found for the selected dates</p>
        ) : (
          <div className="history-list">
            {filteredOrders.map((order) => (
              <div key={order.id} className={`history-item ${order.type === 'takeout' ? 'takeout' : ''}`}>
                <div className="history-item-header">
                  <div className="history-item-info">
                    <span className="order-number">#{order.orderNumber || order.id}</span>
                    <span className="order-type">{order.type === 'takeout' ? 'Takeout' : order.table === 'no-table' ? 'No Table' : `Table ${order.table}`}</span>
                  </div>
                  <div className="history-item-date">
                    <span className="date">{formatDate(order.timestamp)}</span>
                    <span className="time">{formatTime(order.timestamp)}</span>
                  </div>
                  <div className="history-item-status">
                    <span className={`status ${order.isCompleted ? 'completed' : 'active'}`}>
                      {order.isCompleted ? 'Completed' : 'Active'}
                    </span>
                  </div>
                </div>

                <div className="history-item-items">
                  {order.items.map((item) => (
                    <div key={item.id} className="history-item-detail">
                      <span className="item-name">{item.item.name}</span>
                      <span className="item-qty">x{item.quantity}</span>
                      {item.notes && <span className="item-notes">Note: {item.notes}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
          </div>
        </div>

        {/* Summary Sidebar */}
        <aside className="history-summary">
          <h3>Summary</h3>
          {filteredOrders.length === 0 ? (
            <p className="summary-empty">No data</p>
          ) : (
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-label">Total Orders</span>
                <span className="stat-value">{orderSummary.totalOrders}</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Completed</span>
                <span className="stat-value">{orderSummary.completedOrders}</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Cancelled</span>
                <span className="stat-value">{orderSummary.cancelledOrders}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-items-header">Items Breakdown</div>
              <div className="summary-items-list">
                {orderSummary.itemQuantities.map((item, idx) => (
                  <div key={idx} className="summary-item-row">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">x{item.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

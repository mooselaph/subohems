import React, { useState, useEffect } from 'react'

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState('today')
  const [resultLimit, setResultLimit] = useState(10)
  const [topSellingItems, setTopSellingItems] = useState([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  })

  useEffect(() => {
    calculateDashboardData()
  }, [timeFilter])

  const getFilteredOrders = () => {
    const activeOrders = JSON.parse(localStorage.getItem('activeOrders') || '[]')
    const now = Date.now()
    
    let filterTime = 0
    switch(timeFilter) {
      case 'today':
        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)
        filterTime = startOfDay.getTime()
        break
      case 'week':
        filterTime = now - (7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        filterTime = now - (30 * 24 * 60 * 60 * 1000)
        break
      default:
        filterTime = 0
    }

    return activeOrders.filter(order => order.timestamp >= filterTime)
  }

  const calculateDashboardData = () => {
    const filteredOrders = getFilteredOrders()
    
    // Calculate stats
    const totalOrders = filteredOrders.length
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0)
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    setStats({
      totalOrders,
      totalRevenue,
      averageOrderValue
    })

    // Calculate top selling items
    const itemSales = {}
    
    filteredOrders.forEach(order => {
      order.items.forEach(orderItem => {
        const itemName = orderItem.item.name
        const itemId = orderItem.item.id
        
        if (!itemSales[itemId]) {
          itemSales[itemId] = {
            id: itemId,
            name: itemName,
            category: orderItem.item.category,
            price: orderItem.item.price,
            quantitySold: 0,
            totalRevenue: 0,
            orderCount: 0
          }
        }
        
        itemSales[itemId].quantitySold += orderItem.quantity
        itemSales[itemId].totalRevenue += orderItem.quantity * orderItem.item.price
        itemSales[itemId].orderCount += 1
      })
    })

    // Convert to array and sort by quantity sold
    const sortedItems = Object.values(itemSales)
      .sort((a, b) => b.quantitySold - a.quantitySold)

    setTopSellingItems(sortedItems)
  }

  const formatCurrency = (amount) => {
    return `₱${amount.toFixed(2)}`
  }

  const getFilterLabel = () => {
    switch(timeFilter) {
      case 'today': return 'Today'
      case 'week': return 'Last 7 Days'
      case 'month': return 'Last 30 Days'
      default: return ''
    }
  }

  return (
    <div className="page">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ marginBottom: '8px' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Overview of your restaurant performance
        </p>
      </div>

      {/* Time Filter */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '24px',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '12px'
      }}>
        <button
          onClick={() => setTimeFilter('today')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: timeFilter === 'today' ? 'var(--accent-primary)' : 'transparent',
            color: timeFilter === 'today' ? 'white' : 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: timeFilter === 'today' ? '600' : '400',
            transition: 'all 0.2s'
          }}
        >
          Today
        </button>
        <button
          onClick={() => setTimeFilter('week')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: timeFilter === 'week' ? 'var(--accent-primary)' : 'transparent',
            color: timeFilter === 'week' ? 'white' : 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: timeFilter === 'week' ? '600' : '400',
            transition: 'all 0.2s'
          }}
        >
          Last 7 Days
        </button>
        <button
          onClick={() => setTimeFilter('month')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: timeFilter === 'month' ? 'var(--accent-primary)' : 'transparent',
            color: timeFilter === 'month' ? 'white' : 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: timeFilter === 'month' ? '600' : '400',
            transition: 'all 0.2s'
          }}
        >
          Last 30 Days
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: 'var(--card-bg)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid var(--border)'
        }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Total Orders
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
            {stats.totalOrders}
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--card-bg)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid var(--border)'
        }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Total Revenue
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--accent-success)' }}>
            {formatCurrency(stats.totalRevenue)}
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--card-bg)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid var(--border)'
        }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Average Order Value
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
            {formatCurrency(stats.averageOrderValue)}
          </div>
        </div>
      </div>

      {/* Top Selling Items Table */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
            Top Selling Menu Items
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ 
              fontSize: '13px', 
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--accent-primary)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '12px',
              fontWeight: '500'
            }}>
              {getFilterLabel()}
            </span>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginRight: '4px' }}>
                Show:
              </span>
              <button
                onClick={() => setResultLimit(5)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  backgroundColor: resultLimit === 5 ? 'var(--accent-primary)' : 'transparent',
                  color: resultLimit === 5 ? 'white' : 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: resultLimit === 5 ? '600' : '400',
                  transition: 'all 0.2s'
                }}
              >
                Top 5
              </button>
              <button
                onClick={() => setResultLimit(10)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  backgroundColor: resultLimit === 10 ? 'var(--accent-primary)' : 'transparent',
                  color: resultLimit === 10 ? 'white' : 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: resultLimit === 10 ? '600' : '400',
                  transition: 'all 0.2s'
                }}
              >
                Top 10
              </button>
              <button
                onClick={() => setResultLimit(20)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  backgroundColor: resultLimit === 20 ? 'var(--accent-primary)' : 'transparent',
                  color: resultLimit === 20 ? 'white' : 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: resultLimit === 20 ? '600' : '400',
                  transition: 'all 0.2s'
                }}
              >
                Top 20
              </button>
              <button
                onClick={() => setResultLimit(null)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  backgroundColor: resultLimit === null ? 'var(--accent-primary)' : 'transparent',
                  color: resultLimit === null ? 'white' : 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: resultLimit === null ? '600' : '400',
                  transition: 'all 0.2s'
                }}
              >
                Show All
              </button>
            </div>
          </div>
        </div>

        {topSellingItems.length > 0 ? (
          <div style={{ 
            overflowX: 'auto', 
            overflowY: 'auto',
            maxHeight: '600px',
            backgroundColor: 'white' 
          }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '14px',
              backgroundColor: 'white'
            }}>
              <thead>
                <tr style={{ 
                  backgroundColor: '#f8f9fa',
                  borderBottom: '2px solid #e0e0e0'
                }}>
                  <th style={{ 
                    padding: '12px 20px', 
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#666',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Rank
                  </th>
                  <th style={{ 
                    padding: '12px 20px', 
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#666',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Item Name
                  </th>
                  <th style={{ 
                    padding: '12px 20px', 
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#666',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Category
                  </th>
                  <th style={{ 
                    padding: '12px 20px', 
                    textAlign: 'right',
                    fontWeight: '600',
                    color: '#666',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Qty Sold
                  </th>
                  <th style={{ 
                    padding: '12px 20px', 
                    textAlign: 'right',
                    fontWeight: '600',
                    color: '#666',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Revenue
                  </th>
                  <th style={{ 
                    padding: '12px 20px', 
                    textAlign: 'right',
                    fontWeight: '600',
                    color: '#666',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Orders
                  </th>
                </tr>
              </thead>
              <tbody>
                {(resultLimit ? topSellingItems.slice(0, resultLimit) : topSellingItems).map((item, index) => (
                  <tr 
                    key={item.id}
                    style={{
                      borderBottom: '1px solid #e0e0e0',
                      transition: 'background-color 0.2s',
                      backgroundColor: 'white'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: index < 3 ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                        color: index < 3 ? 'white' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '14px'
                      }}>
                        {index + 1}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: '500' }}>
                      {item.name}
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>
                      <span style={{
                        backgroundColor: 'var(--bg-secondary)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}>
                        {item.category}
                      </span>
                    </td>
                    <td style={{ 
                      padding: '16px 20px', 
                      textAlign: 'right',
                      fontWeight: '600',
                      color: 'var(--accent-primary)'
                    }}>
                      {item.quantitySold}
                    </td>
                    <td style={{ 
                      padding: '16px 20px', 
                      textAlign: 'right',
                      fontWeight: '600',
                      color: 'var(--accent-success)'
                    }}>
                      {formatCurrency(item.totalRevenue)}
                    </td>
                    <td style={{ 
                      padding: '16px 20px', 
                      textAlign: 'right',
                      color: 'var(--text-secondary)'
                    }}>
                      {item.orderCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            padding: '60px 20px',
            textAlign: 'center',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>📊</div>
            <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
              No Data Available
            </div>
            <div style={{ fontSize: '14px' }}>
              No orders found for the selected time period
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

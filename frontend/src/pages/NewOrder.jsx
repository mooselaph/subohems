import React, { useState } from 'react'

export default function NewOrder() {
  const [orderType, setOrderType] = useState(null)
  const [selectedTable, setSelectedTable] = useState(null)
  const [showTableSelection, setShowTableSelection] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showItemModal, setShowItemModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [orderItems, setOrderItems] = useState([])
  const [showOrderReview, setShowOrderReview] = useState(false)

  const tables = Array.from({ length: 10 }, (_, i) => i + 1)
  const categories = ['All', 'Mains', 'Sides', 'Soups', 'Drinks']

  const menuItems = [
    { id: 1, name: 'Rice Platter', price: 150, category: 'Sides' },
    { id: 2, name: 'Coke Regular - Can', price: 120, category: 'Drinks' }
  ]

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory)

  const searchedItems = filteredItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOrderTypeSelect = (type) => {
    setOrderType(type)
    setShowTableSelection(true)
    // Auto-select 'no-table' for takeout but keep selection expanded
    if (type === 'takeout') {
      setSelectedTable('no-table')
    }
  }

  const handleTableSelect = (tableNum) => {
    setSelectedTable(tableNum)
    setShowTableSelection(false)
  }

  const handleReselectTable = () => {
    setShowTableSelection(true)
  }

  const handleItemSelect = (item) => {
    setSelectedItem(item)
    setQuantity(1)
    setNotes('')
    setShowItemModal(true)
  }

  const handleAddToOrder = () => {
    // Check if item with same ID and notes already exists in order
    const existingItemIndex = orderItems.findIndex(
      item => item.item.id === selectedItem.id && item.notes === notes
    )

    if (existingItemIndex > -1) {
      // Item with same notes exists, increase quantity
      const updatedItems = [...orderItems]
      updatedItems[existingItemIndex].quantity += quantity
      setOrderItems(updatedItems)
    } else {
      // New item or different notes, add as separate line item
      const newOrderItem = {
        id: Date.now(),
        item: selectedItem,
        quantity,
        notes
      }
      setOrderItems([...orderItems, newOrderItem])
    }
    setShowItemModal(false)
  }

  const handleCloseModal = () => {
    setShowItemModal(false)
    setSelectedItem(null)
  }

  const handleRemoveItem = (itemId) => {
    setOrderItems(orderItems.filter(item => item.id !== itemId))
  }

  const handleIncreaseQuantity = (itemId) => {
    const updatedItems = orderItems.map(item =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    )
    setOrderItems(updatedItems)
  }

  const handleDecreaseQuantity = (itemId) => {
    const updatedItems = orderItems.map(item =>
      item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    )
    setOrderItems(updatedItems)
  }

  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => total + (item.item.price * item.quantity), 0)
  }

  const handleConfirmOrder = () => {
    // TODO: Submit order to backend
    console.log('Order confirmed:', {
      orderType,
      table: selectedTable,
      items: orderItems,
      total: getTotalPrice()
    })
    setShowOrderReview(false)
  }

  return (
    <div className="page new-order-page">
      <h1>New Order</h1>

      {/* Order Type Selection */}
      <section className="order-type-section">
        <h2>Order Type</h2>
        <div className="order-type-buttons">
          <button
            className={`order-type-btn ${orderType === 'dinein' ? 'active' : ''}`}
            onClick={() => handleOrderTypeSelect('dinein')}
          >
            Dine In
          </button>
          <button
            className={`order-type-btn ${orderType === 'takeout' ? 'active' : ''}`}
            onClick={() => handleOrderTypeSelect('takeout')}
          >
            Take Out
          </button>
        </div>
      </section>

      {/* Table Selection */}
      {orderType && (
        <section className="table-section">
          <div className="table-header">
            <h2>Table Selection</h2>
            {selectedTable && !showTableSelection && (
              <button className="reselect-btn" onClick={handleReselectTable}>
                Change
              </button>
            )}
          </div>

          {showTableSelection ? (
            <div className="table-grid">
              {orderType === 'takeout' && (
                <button
                  className={`table-btn ${selectedTable === 'no-table' ? 'selected' : ''}`}
                  onClick={() => handleTableSelect('no-table')}
                >
                  No table
                </button>
              )}
              {tables.map((tableNum) => (
                <button
                  key={tableNum}
                  className={`table-btn ${selectedTable === tableNum ? 'selected' : ''}`}
                  onClick={() => handleTableSelect(tableNum)}
                >
                  Table {tableNum}
                </button>
              ))}
            </div>
          ) : (
            <div className="selected-table-display">
              {selectedTable === 'no-table' ? 'No table' : `Table ${selectedTable}`}
            </div>
          )}
        </section>
      )}

      {/* Food Menu */}
      {selectedTable && (
        <section className="menu-section">
          <h2>Food Menu</h2>

          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Category Selection */}
          <div className="category-buttons">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="menu-items-grid">
            {searchedItems.length > 0 ? (
              searchedItems.map((item) => (
                <button
                  key={item.id}
                  className="menu-item-card"
                  onClick={() => handleItemSelect(item)}
                >
                  <div className="item-name">{item.name}</div>
                  <div className="item-price">PHP {item.price}</div>
                </button>
              ))
            ) : (
              <div className="no-items-message">No items found</div>
            )}
          </div>
        </section>
      )}

      {/* Item Modal */}
      {showItemModal && selectedItem && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedItem.name}</h3>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>

            <div className="modal-body">
              <div className="price-display">
                <span className="label">Price:</span>
                <span className="price">PHP {selectedItem.price}</span>
              </div>

              <div className="quantity-section">
                <label>Quantity</label>
                <div className="quantity-controls">
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    −
                  </button>
                  <span className="qty-display">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="notes-section">
                <label>Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add special instructions or notes..."
                  className="notes-input"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCloseModal}>Cancel</button>
              <button className="btn-add" onClick={handleAddToOrder}>
                Add to Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Order Button */}
      {orderItems.length > 0 && (
        <button 
          className="floating-order-btn"
          onClick={() => setShowOrderReview(true)}
        >
          <span className="order-count">{orderItems.length}</span>
        </button>
      )}

      {/* Order Review Modal */}
      {showOrderReview && (
        <div className="modal-overlay" onClick={() => setShowOrderReview(false)}>
          <div className="modal-content order-review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Review</h3>
              <button className="modal-close" onClick={() => setShowOrderReview(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="order-items-list">
                {orderItems.map((orderItem) => (
                  <div key={orderItem.id} className="order-item">
                    <div className="item-details">
                      <div className="item-header">
                        <span className="item-name">{orderItem.item.name}</span>
                      </div>
                      {orderItem.notes && (
                        <div className="item-notes">{orderItem.notes}</div>
                      )}
                    </div>
                    <div className="item-actions">
                      <div className="quantity-controls-review">
                        <button
                          className="qty-btn-review"
                          onClick={() => handleDecreaseQuantity(orderItem.id)}
                        >
                          −
                        </button>
                        <span className="qty-display-review">{orderItem.quantity}</span>
                        <button
                          className="qty-btn-review"
                          onClick={() => handleIncreaseQuantity(orderItem.id)}
                        >
                          +
                        </button>
                      </div>
                      <span className="item-subtotal">PHP {orderItem.item.price * orderItem.quantity}</span>
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveItem(orderItem.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-summary">
                <div className="summary-row">
                  <span>Order Type:</span>
                  <span>{orderType === 'dinein' ? 'Dine In' : 'Take Out'}</span>
                </div>
                <div className="summary-row">
                  <span>Table:</span>
                  <span>{selectedTable === 'no-table' ? 'No table' : `Table ${selectedTable}`}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>PHP {getTotalPrice()}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowOrderReview(false)}>Go Back</button>
              <button className="btn-add" onClick={handleConfirmOrder}>
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

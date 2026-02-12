import React, { useState, useEffect } from 'react'

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
  const [showSuccess, setShowSuccess] = useState(false)
  const [menuItems, setMenuItems] = useState([])
  const [toast, setToast] = useState(null)

  const tables = Array.from({ length: 10 }, (_, i) => i + 1)
  const baseCategories = [
    'Main',
    'Appetizers',
    'Soup',
    'Pasta and Noodles',
    'Salad',
    'Vegetarian',
    'Plant Based Dish',
    'Special',
    'Dessert',
    'Additional Menu',
    'Rice'
  ]
  const categories = ['All', ...baseCategories]

  useEffect(() => {
    loadMenuItems()
    
    const handleMenuUpdate = () => {
      loadMenuItems()
    }
    
    window.addEventListener('menuItemsUpdated', handleMenuUpdate)
    return () => window.removeEventListener('menuItemsUpdated', handleMenuUpdate)
  }, [])

  const loadMenuItems = () => {
    try {
      const saved = localStorage.getItem('menuItems')
      console.log('Loading menu items from localStorage:', saved ? 'Found' : 'Not found')
      
      if (saved) {
        const items = JSON.parse(saved)
        const activeItems = items.filter(item => item.status === 'active')
        console.log('Loaded', activeItems.length, 'active menu items')
        setMenuItems(activeItems)
      } else {
        // Initialize with default menu items
        console.log('Initializing default menu items for NewOrder')
        const defaultMenu = [
          { id: 1, name: 'Uncles Dumplings', price: 399, category: 'Appetizers', status: 'active', description: '', createdAt: Date.now() },
          { id: 2, name: 'Sinuglaw sa Gata', price: 650, category: 'Appetizers', status: 'active', description: '', createdAt: Date.now() },
          { id: 3, name: 'Lumpia', price: 499, category: 'Appetizers', status: 'active', description: '', createdAt: Date.now() },
          { id: 4, name: 'Fresh Baked Oyster', price: 450, category: 'Appetizers', status: 'active', description: '', createdAt: Date.now() },
          { id: 5, name: 'Mussels, Clams, and Scallop', price: 550, category: 'Appetizers', status: 'active', description: '', createdAt: Date.now() },
          { id: 6, name: 'Baked Scallops', price: 620, category: 'Appetizers', status: 'active', description: '', createdAt: Date.now() },
          { id: 7, name: 'Tinapa Croquetas', price: 510, category: 'Appetizers', status: 'active', description: '', createdAt: Date.now() },
          { id: 8, name: 'Empanada Tangigue', price: 560, category: 'Appetizers', status: 'active', description: '', createdAt: Date.now() },
          { id: 9, name: 'Pork BBQ and Baby Squid', price: 495, category: 'Appetizers', status: 'active', description: '', createdAt: Date.now() },
          { id: 10, name: 'Labanos Salad', price: 300, category: 'Salad', status: 'active', description: '', createdAt: Date.now() },
          { id: 11, name: 'Ensaladang Espesyal', price: 390, category: 'Salad', status: 'active', description: '', createdAt: Date.now() },
          { id: 12, name: 'Tuna Sashimi', price: 620, category: 'Salad', status: 'active', description: '', createdAt: Date.now() },
          { id: 13, name: 'Malunggay Pesto', price: 450, category: 'Pasta and Noodles', status: 'active', description: '', createdAt: Date.now() },
          { id: 14, name: 'Spicy Squid Ink Palabok', price: 550, category: 'Pasta and Noodles', status: 'active', description: '', createdAt: Date.now() },
          { id: 15, name: 'Crispy Canton', price: 799, category: 'Pasta and Noodles', status: 'active', description: '', createdAt: Date.now() },
          { id: 16, name: 'Laswa', price: 610, category: 'Soup', status: 'active', description: '', createdAt: Date.now() },
          { id: 17, name: 'Beef Mami', price: 599, category: 'Soup', status: 'active', description: '', createdAt: Date.now() },
          { id: 18, name: 'Balbacua', price: 800, category: 'Soup', status: 'active', description: '', createdAt: Date.now() },
          { id: 19, name: 'Sudo Laksa', price: 799, category: 'Soup', status: 'active', description: '', createdAt: Date.now() },
          { id: 20, name: 'Sinigang Pork/Shrimp', price: 880, category: 'Soup', status: 'active', description: '', createdAt: Date.now() },
          { id: 21, name: 'Native Chicken Binakol', price: 1050, category: 'Soup', status: 'active', description: '', createdAt: Date.now() },
          { id: 22, name: 'Bulalo', price: 850, category: 'Soup', status: 'active', description: '', createdAt: Date.now() },
          { id: 23, name: 'Crispy Dinuguan', price: 450, category: 'Main', status: 'active', description: '', createdAt: Date.now() },
          { id: 24, name: 'Salmon Paksiw', price: 892, category: 'Main', status: 'active', description: '', createdAt: Date.now() },
          { id: 25, name: "Titi Elaine's Pochero", price: 750, category: 'Main', status: 'active', description: '', createdAt: Date.now() },
          { id: 26, name: 'Bagnet Express', price: 584, category: 'Main', status: 'active', description: '', createdAt: Date.now() },
          { id: 27, name: 'Chicken Pinaparan', price: 680, category: 'Main', status: 'active', description: '', createdAt: Date.now() },
          { id: 28, name: 'Adobo sa Dilaw', price: 600, category: 'Main', status: 'active', description: '', createdAt: Date.now() },
          { id: 29, name: 'Kare-Kare', price: 950, category: 'Main', status: 'active', description: '', createdAt: Date.now() },
          { id: 30, name: 'Inihaw na Isda / Sinigang Isda', price: 970, category: 'Main', status: 'active', description: '', createdAt: Date.now() },
          { id: 31, name: 'Tomahawk and Stuffed Squid', price: 999, category: 'Main', status: 'active', description: '', createdAt: Date.now() },
          { id: 32, name: 'Crispy Pata', price: 1650, category: 'Main', status: 'active', description: '', createdAt: Date.now() },
          { id: 33, name: 'Chicken Paru-Paru Half', price: 850, category: 'Main', status: 'active', description: '', createdAt: Date.now() },
          { id: 34, name: 'Chicken Paru-Paru', price: 1400, category: 'Main', status: 'active', description: '', createdAt: Date.now() },
          { id: 35, name: 'Tinola Itum', price: 930, category: 'Main', status: 'active', description: '', createdAt: Date.now() },
          { id: 36, name: 'Lechon', price: 999, category: 'Main', status: 'active', description: '', createdAt: Date.now() },
          { id: 37, name: 'Seafood Platter', price: 2999, category: 'Main', status: 'active', description: '', createdAt: Date.now() },
          { id: 38, name: 'Mix Seafood Escabeche', price: 1899, category: 'Main', status: 'active', description: '', createdAt: Date.now() },
          { id: 39, name: 'Lamb Gata Adobo', price: 1500, category: 'Main', status: 'active', description: '', createdAt: Date.now() },
          { id: 40, name: 'Bisteak Tagalog', price: 1700, category: 'Main', status: 'active', description: '', createdAt: Date.now() },
          { id: 41, name: 'Seafood Express', price: 1999, category: 'Main', status: 'active', description: '', createdAt: Date.now() },
          { id: 42, name: 'Boodle Plate', price: 2999, category: 'Main', status: 'active', description: '', createdAt: Date.now() },
          { id: 43, name: 'Ginataang Gulay', price: 450, category: 'Vegetarian', status: 'active', description: '', createdAt: Date.now() },
          { id: 44, name: 'Buko Puso (Shrimp and Beef)', price: 750, category: 'Vegetarian', status: 'active', description: '', createdAt: Date.now() },
          { id: 45, name: 'Tortang Talong', price: 400, category: 'Plant Based Dish', status: 'active', description: '', createdAt: Date.now() },
          { id: 46, name: 'Fresh Lumpia', price: 650, category: 'Plant Based Dish', status: 'active', description: '', createdAt: Date.now() },
          { id: 47, name: 'All Fried Lumpia', price: 650, category: 'Plant Based Dish', status: 'active', description: '', createdAt: Date.now() },
          { id: 48, name: 'Kangkong Nachos', price: 600, category: 'Plant Based Dish', status: 'active', description: '', createdAt: Date.now() },
          { id: 49, name: 'Pakbet', price: 540, category: 'Plant Based Dish', status: 'active', description: '', createdAt: Date.now() },
          { id: 50, name: 'Adobo Tofu', price: 450, category: 'Plant Based Dish', status: 'active', description: '', createdAt: Date.now() },
          { id: 51, name: 'Turon Stout Split', price: 180, category: 'Dessert', status: 'active', description: '', createdAt: Date.now() },
          { id: 52, name: 'Turon Split', price: 280, category: 'Dessert', status: 'active', description: '', createdAt: Date.now() },
          { id: 53, name: 'Leche Flan', price: 350, category: 'Dessert', status: 'active', description: '', createdAt: Date.now() },
          { id: 54, name: 'Ube Chocolate Lava Cake', price: 350, category: 'Dessert', status: 'active', description: '', createdAt: Date.now() },
          { id: 55, name: 'Mango Cheese Cake', price: 380, category: 'Dessert', status: 'active', description: '', createdAt: Date.now() },
          { id: 56, name: 'Halo-Halo', price: 450, category: 'Dessert', status: 'active', description: '', createdAt: Date.now() },
          { id: 57, name: 'Semi Frio', price: 409, category: 'Dessert', status: 'active', description: '', createdAt: Date.now() },
          { id: 58, name: 'TiramisuMan', price: 400, category: 'Dessert', status: 'active', description: '', createdAt: Date.now() },
          { id: 59, name: 'Fried Chicken', price: 788, category: 'Special', status: 'active', description: '', createdAt: Date.now() },
          { id: 60, name: 'Bagnet Pakbet', price: 720, category: 'Special', status: 'active', description: '', createdAt: Date.now() },
          { id: 61, name: 'Sisig', price: 470, category: 'Special', status: 'active', description: '', createdAt: Date.now() },
          { id: 62, name: 'Chorizo Burger', price: 480, category: 'Special', status: 'active', description: '', createdAt: Date.now() },
          { id: 63, name: 'Laing Fishball', price: 650, category: 'Special', status: 'active', description: '', createdAt: Date.now() },
          { id: 64, name: 'Sorbet', price: 120, category: 'Additional Menu', status: 'active', description: '', createdAt: Date.now() },
          { id: 65, name: 'Fruit Platter', price: 550, category: 'Additional Menu', status: 'active', description: '', createdAt: Date.now() },
          { id: 66, name: 'Butter Garlic Shrimp', price: 450, category: 'Additional Menu', status: 'active', description: '', createdAt: Date.now() },
          { id: 67, name: 'Escabetche/Grilled/Fried Snapper', price: 950, category: 'Additional Menu', status: 'active', description: '', createdAt: Date.now() },
          { id: 68, name: 'Grilled Squid', price: 1250, category: 'Additional Menu', status: 'active', description: '', createdAt: Date.now() },
          { id: 69, name: 'Fried Tilapia', price: 450, category: 'Additional Menu', status: 'active', description: '', createdAt: Date.now() },
          { id: 70, name: 'Alabar Sauce', price: 100, category: 'Additional Menu', status: 'active', description: '', createdAt: Date.now() },
          { id: 71, name: 'Bread', price: 50, category: 'Additional Menu', status: 'active', description: '', createdAt: Date.now() },
          { id: 72, name: 'Fries', price: 280, category: 'Additional Menu', status: 'active', description: '', createdAt: Date.now() },
          { id: 73, name: 'Beef Rendang', price: 650, category: 'Additional Menu', status: 'active', description: '', createdAt: Date.now() },
          { id: 74, name: 'Pinangat', price: 650, category: 'Additional Menu', status: 'active', description: '', createdAt: Date.now() },
          { id: 75, name: 'Pata Longgo Style', price: 650, category: 'Additional Menu', status: 'active', description: '', createdAt: Date.now() },
          { id: 76, name: 'Grilled Squid (Regular)', price: 625, category: 'Additional Menu', status: 'active', description: '', createdAt: Date.now() },
          { id: 77, name: 'All BBQ Squid', price: 550, category: 'Additional Menu', status: 'active', description: '', createdAt: Date.now() },
          { id: 78, name: 'Baked Clams', price: 550, category: 'Additional Menu', status: 'active', description: '', createdAt: Date.now() },
          { id: 79, name: 'Fried Lumpia', price: 650, category: 'Additional Menu', status: 'active', description: '', createdAt: Date.now() },
          { id: 80, name: 'Garlic Rice', price: 65, category: 'Rice', status: 'active', description: '', createdAt: Date.now() },
          { id: 81, name: 'Bagoong Fried Rice', price: 599, category: 'Rice', status: 'active', description: '', createdAt: Date.now() },
          { id: 82, name: 'Seafood Fried Rice', price: 789, category: 'Rice', status: 'active', description: '', createdAt: Date.now() },
          { id: 83, name: 'Pineapple Fried Rice', price: 680, category: 'Rice', status: 'active', description: '', createdAt: Date.now() }
        ]
        localStorage.setItem('menuItems', JSON.stringify(defaultMenu))
        setMenuItems(defaultMenu)
        console.log('Initialized', defaultMenu.length, 'default menu items')
      }
    } catch (error) {
      console.error('Error loading menu items:', error)
    }
  }

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  const sortedMenuItems = [...menuItems].sort((a, b) => a.name.localeCompare(b.name))

  const filteredItems = selectedCategory === 'All' 
    ? sortedMenuItems 
    : sortedMenuItems.filter(item => item.category === selectedCategory)

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
    // Validate order has all required details
    if (!orderType) {
      showToast('Please select an order type (Dine In or Take Out)')
      return
    }

    if (!selectedTable) {
      showToast('Please select a table')
      return
    }

    if (orderItems.length === 0) {
      showToast('Cannot submit order: No menu items added. Please add at least one item to the order.')
      return
    }

    // Save order to localStorage for Active Orders page
    const now = new Date()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    const yy = String(now.getFullYear()).slice(-2)
    const dateKey = `${mm}${dd}${yy}`

    const storedDateKey = localStorage.getItem('orderNumberDateKey')
    const lastOrderNumber = parseInt(localStorage.getItem('orderNumberCounter') || '0', 10)
    const nextOrderNumber = storedDateKey === dateKey ? lastOrderNumber + 1 : 1
    localStorage.setItem('orderNumberDateKey', dateKey)
    localStorage.setItem('orderNumberCounter', String(nextOrderNumber))
    const formattedOrderNumber = `${dateKey}-${String(nextOrderNumber).padStart(3, '0')}`

    const newOrder = {
      id: Date.now(),
      orderNumber: formattedOrderNumber,
      type: orderType,
      table: selectedTable,
      items: orderItems,
      total: getTotalPrice(),
      timestamp: Date.now()
    }
    
    const existingOrders = JSON.parse(localStorage.getItem('activeOrders') || '[]')
    localStorage.setItem('activeOrders', JSON.stringify([...existingOrders, newOrder]))
    
    // Dispatch custom event to notify Active Orders page
    window.dispatchEvent(new Event('ordersUpdated'))
    
    // Show success animation
    setShowSuccess(true)
    
    // Reset form after animation completes
    setTimeout(() => {
      setOrderItems([])
      setSelectedTable(null)
      setShowTableSelection(true)
      setShowOrderReview(false)
      setShowSuccess(false)
    }, 2000)
  }

  return (
    <div className="page new-order-page">
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-animation">
            <div className="checkmark">✓</div>
            <p>Order Submitted!</p>
          </div>
        </div>
      )}
      
      {toast && (
        <div className="toast-notification">
          {toast}
        </div>
      )}
      
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

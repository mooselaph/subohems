import React, { useState, useEffect } from 'react'

export default function Menu() {
  const [menuItems, setMenuItems] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [showSuccess, setShowSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main',
    status: 'active'
  })

  const categories = [
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

  useEffect(() => {
    loadMenuItems()
  }, [])

  const loadMenuItems = () => {
    try {
      const saved = localStorage.getItem('menuItems')
      console.log('Loading menu items from localStorage:', saved ? 'Found' : 'Not found')
      
      if (saved) {
        const items = JSON.parse(saved)
        console.log('Loaded', items.length, 'menu items')
        setMenuItems(items)
      } else {
        // Initialize with default menu items
        console.log('Initializing default menu items')
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
      saveMenuItems(defaultMenu)
      }
    } catch (error) {
      console.error('Error loading menu items from localStorage:', error)
      alert('Failed to load menu items. Please check browser console.')
    }
  }

  const saveMenuItems = (items) => {
    try {
      localStorage.setItem('menuItems', JSON.stringify(items))
      console.log('Saved', items.length, 'menu items to localStorage')
      setMenuItems(items)
      // Notify other components that menu items have been updated
      window.dispatchEvent(new Event('menuItemsUpdated'))
    } catch (error) {
      console.error('Error saving menu items to localStorage:', error)
      alert('Failed to save menu items. Your browser might have localStorage disabled or storage quota exceeded.')
    }
  }

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        name: item.name,
        description: item.description || '',
        price: item.price,
        category: item.category || 'Main',
        status: item.status
      })
    } else {
      setEditingItem(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Main',
        status: 'active'
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingItem(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Main',
      status: 'active'
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.price) {
      alert('Please fill in all required fields')
      return
    }

    const price = parseFloat(formData.price)
    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price')
      return
    }

    if (editingItem) {
      // Update existing item
      const updatedItems = menuItems.map(item =>
        item.id === editingItem.id
          ? { ...item, ...formData, price }
          : item
      )
      saveMenuItems(updatedItems)
    } else {
      // Create new item
      const newItem = {
        id: Date.now(),
        ...formData,
        price,
        createdAt: Date.now()
      }
      saveMenuItems([...menuItems, newItem])
    }

    handleCloseModal()

    // Show success animation
    setShowSuccess(true)

    // Hide success animation after 2 seconds
    setTimeout(() => {
      setShowSuccess(false)
    }, 2000)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      const updatedItems = menuItems.filter(item => item.id !== id)
      saveMenuItems(updatedItems)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name)
    } else if (sortBy === 'category') {
      return a.category.localeCompare(b.category)
    } else if (sortBy === 'price-high') {
      return b.price - a.price
    } else if (sortBy === 'price-low') {
      return a.price - b.price
    }
    return 0
  })

  return (
    <div className="page menu-management-page">
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-animation">
            <div className="checkmark">✓</div>
            <p>{editingItem ? 'Menu Item Updated!' : 'Menu Item Created!'}</p>
          </div>
        </div>
      )}
      <div className="page-header">
        <h1>Menu Management</h1>
        <button className="btn-add-menu" onClick={() => handleOpenModal()}>
          + Add Menu Item
        </button>
      </div>

      {/* Filters */}
      <div className="menu-filters">
        <input
          type="text"
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-filter"
        >
          <option value="name">Sort by Name (A-Z)</option>
          <option value="category">Sort by Category</option>
          <option value="price-high">Sort by Price (High to Low)</option>
          <option value="price-low">Sort by Price (Low to High)</option>
        </select>
      </div>

      {/* Menu Items List */}
      <div className="menu-items-container">
        {sortedItems.length === 0 ? (
          <div className="no-items">
            <p>No menu items found. Click "Add Menu Item" to create one.</p>
          </div>
        ) : (
          <div className="menu-items-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.map(item => (
                  <tr key={item.id}>
                    <td className="item-name">{item.name}</td>
                    <td className="item-description">{item.description || '—'}</td>
                    <td className="item-category">{item.category}</td>
                    <td className="item-price">PHP {item.price}</td>
                    <td className="item-status">
                      <span className={`status-badge ${item.status}`}>
                        {item.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="item-actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleOpenModal(item)}
                        title="Edit"
                      >
                        ✎
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content menu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="name">Menu Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter menu item name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter description (optional)"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="price">Price (PHP) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status *</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

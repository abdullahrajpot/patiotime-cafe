import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAdminOrders, 
  updateOrderStatus, 
  getAdminMenu, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem,
  getAdminReservations,
  updateReservationStatus,
  deleteReservation,
  getAdminContacts,
  updateContactStatus,
  deleteContact
} from '../api';

const STATUSES = ['received', 'preparing', 'ready', 'completed', 'cancelled'];
const FILTERS = ['all', ...STATUSES];

// Dashboard Component
function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    pendingOrders: 0,
    revenue: 0,
    menuItems: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const orders = await getAdminOrders('all');
        const menu = await getAdminMenu();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayOrders = orders.filter(o => new Date(o.created_at) >= today);
        const pending = orders.filter(o => ['received', 'preparing'].includes(o.status));
        const revenue = orders
          .filter(o => o.status === 'completed')
          .reduce((sum, o) => sum + o.total, 0);

        setStats({
          totalOrders: orders.length,
          todayOrders: todayOrders.length,
          pendingOrders: pending.length,
          revenue: revenue,
          menuItems: menu.length,
        });
      } catch (err) {
        console.error('Failed to load stats:', err);
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 30 }}>Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #c5a059 0%, #a88947 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{stats.totalOrders}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Today's Orders</div>
            <div className="stat-value">{stats.todayOrders}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Pending Orders</div>
            <div className="stat-value">{stats.pendingOrders}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value">${stats.revenue.toFixed(2)}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
              <path d="M7 2v20"/>
              <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Menu Items</div>
            <div className="stat-value">{stats.menuItems}</div>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', padding: 24, borderRadius: 8, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h3 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>Quick Stats Overview</h3>
        <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>
          Welcome to PatioTime Cafe Admin Panel. Use the sidebar to navigate between different sections and manage your cafe operations.
        </p>
      </div>
    </div>
  );
}

// Orders Component
function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    try {
      const data = await getAdminOrders(filter);
      setOrders(data);
    } catch {
      // keep last-known list on transient errors
    }
  }, [filter]);

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [load]);

  const handleStatusChange = async (id, status) => {
    await updateOrderStatus(id, status);
    load();
  };

  return (
    <>
      <div className="admin-header">
        <div>
          <h2>Order Management</h2>
          <p style={{ color: 'var(--muted)', margin: 0 }}>Live view of incoming orders</p>
        </div>
        <div className="admin-filters">
          {FILTERS.map((f) => (
            <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">No orders in this view.</div>
      ) : (
        <div className="order-board">
          {orders.map((o) => (
            <div className="card" key={o.id}>
              <div className="order-card-head">
                <div>
                  <div className="order-card-code">{o.order_code}</div>
                  <div className="order-card-time">{new Date(o.created_at).toLocaleString()}</div>
                </div>
                <span className={`badge-status badge-${o.status}`}>{o.status}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                {o.customer_name} • {o.customer_phone}
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', textTransform: 'capitalize' }}>
                {o.order_type}{o.address ? ` — ${o.address}` : ''}
              </div>
              <div className="order-card-items">
                {o.items.map((i, idx) => (
                  <div key={idx}>
                    <span>{i.quantity} × {i.name}</span>
                    <span>${(i.price * i.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="summary-row total" style={{ fontSize: 15 }}>
                <span>Total</span><span>${o.total.toFixed(2)}</span>
              </div>
              <div className="order-card-actions">
                <select value={o.status} onChange={(e) => handleStatusChange(o.id, e.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// Menu Management Component
function MenuTab() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    badge: '',
    image: '',
    sortOrder: 1,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Hardcoded categories
  const CATEGORIES = [
    { value: 'coffees-teas', label: 'Coffees & Teas' },
    { value: 'bakery-lunch', label: 'Bakery & Lunch' },
    { value: 'all-day-brunch', label: 'All-Day Brunch' },
  ];

  const loadMenu = async () => {
    try {
      const data = await getAdminMenu();
      setItems(data);
    } catch (err) {
      console.error('Failed to load menu:', err);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only image files (JPEG, PNG, GIF, WEBP) are allowed');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      let imageFilename = formData.image;

      // If a new file is selected, upload it first
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', selectedFile);

        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        imageFilename = uploadData.filename;
      }

      const payload = {
        ...formData,
        image: imageFilename,
        price: parseFloat(formData.price),
        sortOrder: parseInt(formData.sortOrder),
      };

      if (editingItem) {
        await updateMenuItem(editingItem._id, payload);
      } else {
        await createMenuItem(payload);
      }

      loadMenu();
      resetForm();
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category || '',
      badge: item.badge || '',
      image: item.image || '',
      sortOrder: item.sortOrder,
    });
    // Set preview for existing image
    if (item.image) {
      setImagePreview(`/images/${item.image}`);
    }
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteMenuItem(id);
      loadMenu();
    } catch (err) {
      alert(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      badge: '',
      image: '',
      sortOrder: 1,
    });
    setEditingItem(null);
    setShowForm(false);
    setSelectedFile(null);
    setImagePreview(null);
  };

  return (
    <>
      <div className="admin-header">
        <div>
          <h2>Menu Management</h2>
          <p style={{ color: 'var(--muted)', margin: 0 }}>Add, edit, or remove menu items</p>
        </div>
        <button className="btn btn-solid" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add New Item'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 30 }}>
          <h3 style={{ marginBottom: 20 }}>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="field-row">
              <div className="field">
                <label>Item Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label>Price *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label>Description</label>
              <textarea
                rows="2"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="field-row">
              <div className="field">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Badge (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. NEW, SEASONAL"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                />
              </div>
            </div>

            <div className="field">
              <label>Sort Order</label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                style={{ width: '120px' }}
              />
            </div>

            <div className="field">
              <label>Image Upload</label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                style={{
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  width: '100%',
                }}
              />
              {imagePreview && (
                <div style={{ marginTop: 12 }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: 200,
                      height: 200,
                      objectFit: 'cover',
                      borderRadius: 4,
                      border: '1px solid #ddd',
                    }}
                  />
                </div>
              )}
              {editingItem && !selectedFile && formData.image && (
                <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
                  Current: {formData.image}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button type="submit" className="btn btn-solid" disabled={uploading}>
                {uploading ? 'Uploading...' : editingItem ? 'Update Item' : 'Add Item'}
              </button>
              <button type="button" className="btn btn-outline" onClick={resetForm} disabled={uploading}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="menu-items-list">
        {items.length === 0 ? (
          <div className="empty-state">No menu items found.</div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {items.map((item) => (
              <div className="card menu-item-card" key={item._id} style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                {item.image && (
                  <img
                    src={`/images/${item.image}`}
                    alt={item.name}
                    className="menu-item-card-img"
                  />
                )}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <h4 style={{ margin: 0, fontSize: 18 }}>{item.name}</h4>
                    {item.badge && (
                      <span className="menu-item-badge">{item.badge}</span>
                    )}
                  </div>
                  <p style={{ margin: '4px 0', fontSize: 13, color: 'var(--muted)' }}>
                    {item.description}
                  </p>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--gold-dark)' }}>
                      ${item.price.toFixed(2)}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                      • Category: {CATEGORIES.find(c => c.value === item.category)?.label || item.category}
                    </span>
                  </div>
                </div>
                <div className="menu-item-card-actions">
                  <button
                    className="btn btn-outline"
                    style={{ padding: '8px 16px', fontSize: 12 }}
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline"
                    style={{ padding: '8px 16px', fontSize: 12, borderColor: '#b5523f', color: '#b5523f' }}
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// Reservations Component
function ReservationsTab() {
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    try {
      const data = await getAdminReservations(filter);
      setReservations(data);
    } catch (err) {
      console.error('Failed to load reservations:', err);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (id, status) => {
    await updateReservationStatus(id, status);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this reservation?')) return;
    await deleteReservation(id);
    load();
  };

  const STATUSES = ['all', 'pending', 'confirmed', 'cancelled', 'completed'];

  return (
    <>
      <div className="admin-header">
        <div>
          <h2>Reservations</h2>
          <p style={{ color: 'var(--muted)', margin: 0 }}>Manage table bookings</p>
        </div>
        <div className="admin-filters">
          {STATUSES.map((f) => (
            <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {reservations.length === 0 ? (
        <div className="empty-state">No reservations found.</div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {reservations.map((res) => (
            <div key={res._id} className="reservation-card">
              <div className="reservation-header">
                <div>
                  <div className="reservation-name">{res.name}</div>
                  <div className="reservation-date">
                    {new Date(res.date).toLocaleDateString()} at {res.time}
                  </div>
                </div>
                <span className={`badge-status badge-${res.status}`}>{res.status}</span>
              </div>
              <div className="reservation-info">
                <strong>Guests:</strong> {res.guests} people<br />
                <strong>Email:</strong> {res.email}<br />
                <strong>Phone:</strong> {res.phone}<br />
                {res.specialRequests && (
                  <>
                    <strong>Special Requests:</strong> {res.specialRequests}<br />
                  </>
                )}
                <strong>Created:</strong> {new Date(res.createdAt).toLocaleString()}
              </div>
              <div className="reservation-actions">
                <select 
                  value={res.status} 
                  onChange={(e) => handleStatusChange(res._id, e.target.value)}
                  style={{ padding: '6px 12px', fontSize: '13px' }}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  className="btn btn-outline"
                  style={{ padding: '6px 16px', fontSize: '13px', borderColor: '#f44336', color: '#f44336' }}
                  onClick={() => handleDelete(res._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// Contacts Component
function ContactsTab() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    try {
      const data = await getAdminContacts(filter);
      setContacts(data);
    } catch (err) {
      console.error('Failed to load contacts:', err);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (id, status) => {
    await updateContactStatus(id, status);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    await deleteContact(id);
    load();
  };

  const STATUSES = ['all', 'new', 'read', 'replied'];

  return (
    <>
      <div className="admin-header">
        <div>
          <h2>Contact Messages</h2>
          <p style={{ color: 'var(--muted)', margin: 0 }}>Customer inquiries and messages</p>
        </div>
        <div className="admin-filters">
          {STATUSES.map((f) => (
            <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="empty-state">No messages found.</div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {contacts.map((contact) => (
            <div key={contact._id} className="contact-card">
              <div className="contact-header">
                <div>
                  <div className="contact-name">{contact.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    {new Date(contact.createdAt).toLocaleString()}
                  </div>
                </div>
                <span className={`badge-status badge-${contact.status}`}>{contact.status}</span>
              </div>
              <div className="contact-info-body">
                <strong>Email:</strong> {contact.email}<br />
                <strong>Subject:</strong> {contact.subject}<br />
                <strong>Message:</strong><br />
                <div style={{ marginTop: '8px', padding: '12px', background: '#f9f9f9', borderRadius: '4px' }}>
                  {contact.message}
                </div>
              </div>
              <div className="contact-actions">
                <select 
                  value={contact.status} 
                  onChange={(e) => handleStatusChange(contact._id, e.target.value)}
                  style={{ padding: '6px 12px', fontSize: '13px' }}
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
                <button
                  className="btn btn-outline"
                  style={{ padding: '6px 16px', fontSize: '13px', borderColor: '#f44336', color: '#f44336' }}
                  onClick={() => handleDelete(contact._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// Main Admin Component with Sidebar
export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdminAccess = () => {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!userData || !token) {
        // Not logged in
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      try {
        const user = JSON.parse(userData);
        
        if (user.role !== 'admin') {
          // Not an admin
          setAccessDenied(true);
          setLoading(false);
          return;
        }

        // User is admin
        setAccessDenied(false);
        setLoading(false);
      } catch (err) {
        console.error('Error checking admin access:', err);
        setAccessDenied(true);
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, []);

  // Show loading
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f3ef' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
          <div style={{ fontSize: 18, color: 'var(--muted)' }}>Checking access...</div>
        </div>
      </div>
    );
  }

  // Show access denied
  if (accessDenied) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f3ef' }}>
        <div style={{ textAlign: 'center', maxWidth: 500, padding: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🔒</div>
          <h2 style={{ fontSize: 32, marginBottom: 16, color: 'var(--text)' }}>Access Denied</h2>
          <p style={{ fontSize: 16, color: 'var(--muted)', marginBottom: 32, lineHeight: 1.6 }}>
            You need administrator privileges to access this page. Please login with an admin account.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/login')}
              className="btn btn-solid"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn btn-outline"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Mobile Header with Hamburger */}
      <div className="admin-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'Playfair Display', fontSize: 28, fontStyle: 'italic' }}>Pt.</span>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>Admin</span>
        </div>
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="admin-mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="admin-mobile-nav" onClick={(e) => e.stopPropagation()}>
            <button
              className={`admin-mobile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
            >
              <span className="nav-icon">📊</span>
              Dashboard
            </button>
            <button
              className={`admin-mobile-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
            >
              <span className="nav-icon">📦</span>
              Orders
            </button>
            <button
              className={`admin-mobile-nav-item ${activeTab === 'menu' ? 'active' : ''}`}
              onClick={() => { setActiveTab('menu'); setMobileMenuOpen(false); }}
            >
              <span className="nav-icon">🍽️</span>
              Menu Items
            </button>
            <button
              className={`admin-mobile-nav-item ${activeTab === 'reservations' ? 'active' : ''}`}
              onClick={() => { setActiveTab('reservations'); setMobileMenuOpen(false); }}
            >
              <span className="nav-icon">📅</span>
              Reservations
            </button>
            <button
              className={`admin-mobile-nav-item ${activeTab === 'contacts' ? 'active' : ''}`}
              onClick={() => { setActiveTab('contacts'); setMobileMenuOpen(false); }}
            >
              <span className="nav-icon">✉️</span>
              Contacts
            </button>
            <div style={{ borderTop: '1px solid #e0e0e0', marginTop: 16, paddingTop: 16 }}>
              <a href="/" className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>
                ← Back to Site
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-logo">
          <span style={{ fontFamily: 'Playfair Display', fontSize: 32, fontStyle: 'italic' }}>Pt.</span>
          <span style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Admin Panel</span>
        </div>

        <nav className="admin-nav">
          <button
            className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="nav-icon">📊</span>
            Dashboard
          </button>
          <button
            className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span className="nav-icon">📦</span>
            Orders
          </button>
          <button
            className={`admin-nav-item ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            <span className="nav-icon">🍽️</span>
            Menu Items
          </button>
          <button
            className={`admin-nav-item ${activeTab === 'reservations' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            <span className="nav-icon">📅</span>
            Reservations
          </button>
          <button
            className={`admin-nav-item ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            <span className="nav-icon">✉️</span>
            Contacts
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <a href="/" className="btn btn-ghost-dark" style={{ width: '100%', textAlign: 'center', padding: '10px' }}>
            ← Back to Site
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'menu' && <MenuTab />}
        {activeTab === 'reservations' && <ReservationsTab />}
        {activeTab === 'contacts' && <ContactsTab />}
      </div>
    </div>
  );
}

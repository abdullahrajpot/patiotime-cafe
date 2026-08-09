import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserOrderHistory } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import OrderHistoryCard from '../components/OrderHistoryCard';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      // Load user info
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // Load order history
      const orderData = await getUserOrderHistory();
      setOrders(orderData);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err.message || 'Failed to load dashboard data');
      
      // If unauthorized, redirect to login
      if (err.message.includes('authenticated') || err.message.includes('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <>
        <header className="hero hero-page" style={{ minHeight: 180, backgroundImage: "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=70')" }}>
          <div className="container hero-inner"><h1 style={{ fontSize: 32 }}>My Dashboard</h1></div>
        </header>
        <div className="page-wrap" style={{ maxWidth: 900 }}>
          <LoadingSpinner message="Loading your dashboard..." size="large" />
        </div>
      </>
    );
  }

  return (
    <>
      <header className="hero hero-page" style={{ minHeight: 180, backgroundImage: "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=70')" }}>
        <div className="container hero-inner"><h1 style={{ fontSize: 32 }}>My Dashboard</h1></div>
      </header>

      <div className="page-wrap" style={{ maxWidth: 900 }}>
        {/* Welcome Card */}
        <div className="card" style={{ marginBottom: 30 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <h2 style={{ fontSize: 28, marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>
                Welcome back, {user?.name || 'Guest'}!
              </h2>
              <p style={{ color: 'var(--muted)', margin: 0, fontSize: 14 }}>{user?.email}</p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {user?.role === 'admin' && (
                <Link to="/admin" className="btn btn-solid">
                  Admin Panel
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-outline">
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ marginBottom: 20 }}>
            <ErrorMessage message={error} onRetry={loadDashboardData} type="error" />
          </div>
        )}

        {/* Quick Actions */}
        <div style={{ marginBottom: 40 }}>
          <h3 style={{ fontSize: 20, marginBottom: 20, fontFamily: "'Playfair Display', serif" }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Link to="/menu" className="dashboard-action-card">
              <div style={{ fontSize: 36, marginBottom: 8 }}>🍽️</div>
              <h4 style={{ fontSize: 16, marginBottom: 4 }}>Browse Menu</h4>
              <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>Explore our offerings</p>
            </Link>

            <Link to="/track" className="dashboard-action-card">
              <div style={{ fontSize: 36, marginBottom: 8 }}>📦</div>
              <h4 style={{ fontSize: 16, marginBottom: 4 }}>Track Order</h4>
              <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>Check order status</p>
            </Link>

            <Link to="/reservation" className="dashboard-action-card">
              <div style={{ fontSize: 36, marginBottom: 8 }}>📅</div>
              <h4 style={{ fontSize: 16, marginBottom: 4 }}>Make Reservation</h4>
              <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>Reserve your table</p>
            </Link>
          </div>
        </div>

        {/* Order History */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 20, margin: 0, fontFamily: "'Playfair Display', serif" }}>Order History</h3>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>
              {orders.length} {orders.length === 1 ? 'order' : 'orders'}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="empty-state">
              <h4 style={{ marginBottom: 12 }}>No orders yet</h4>
              <p style={{ marginBottom: 20 }}>Start by browsing our menu and placing your first order!</p>
              <Link to="/menu" className="btn btn-solid">
                Browse Menu
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 16 }}>
              {orders.map((order) => (
                <OrderHistoryCard key={order.id || order._id} order={order} />
              ))}
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="card" style={{ marginTop: 30 }}>
          <h3 style={{ fontSize: 20, marginBottom: 20, fontFamily: "'Playfair Display', serif" }}>Account Information</h3>
          <div style={{ display: 'grid', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: 4 }}>Name</label>
              <p style={{ margin: 0, fontSize: 15 }}>{user?.name}</p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: 4 }}>Email</label>
              <p style={{ margin: 0, fontSize: 15 }}>{user?.email}</p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: 4 }}>Phone</label>
              <p style={{ margin: 0, fontSize: 15 }}>{user?.phone || 'Not provided'}</p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: 4 }}>Account Type</label>
              <p style={{ margin: 0, fontSize: 15, textTransform: 'capitalize' }}>{user?.role || 'Customer'}</p>
            </div>
            <button
              onClick={() => alert('Profile editing coming soon!')}
              className="btn btn-outline"
              style={{ marginTop: 10 }}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

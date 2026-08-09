import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { trackOrder, getUserOrderHistory } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const STEPS = ['received', 'preparing', 'ready', 'completed'];
const STEP_LABELS = { received: 'Received', preparing: 'Preparing', ready: 'Ready', completed: 'Completed' };

export default function Track() {
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      loadOrderHistory(parsedUser._id);
    }
  }, []);

  const loadOrderHistory = async (userId) => {
    setHistoryLoading(true);
    try {
      const history = await getUserOrderHistory(userId);
      setOrderHistory(history);
    } catch (err) {
      console.error('Failed to load order history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const runTrack = async (c) => {
    if (!c) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const data = await trackOrder(c);
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlCode = searchParams.get('code');
    const lastCode = localStorage.getItem('last_order_code');
    const initial = urlCode || lastCode;
    if (initial) {
      setCode(initial);
      runTrack(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    runTrack(code.trim());
  };

  const handleTrackHistory = (orderCode) => {
    setCode(orderCode);
    runTrack(orderCode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className="hero hero-page"
        style={{ minHeight: 180, backgroundImage: "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=70')" }}
      >
        <div className="container hero-inner"><h1 style={{ fontSize: 32 }}>Track Your Order</h1></div>
      </header>

      <div className="page-wrap" style={{ maxWidth: 640 }}>
        <div className="card">
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12 }}>
            <input
              type="text"
              placeholder="Enter order code e.g. PT-AB12C3"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ flex: 1, padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 4 }}
            />
            <button className="btn btn-solid" type="submit">Track</button>
          </form>
        </div>

        {loading && (
          <div style={{ marginTop: 20 }}>
            <LoadingSpinner message="Looking up order..." />
          </div>
        )}
        {error && (
          <div style={{ marginTop: 20 }}>
            <ErrorMessage message={error} type="error" />
          </div>
        )}

        {order && (
          <>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{order.order_code}</h3>
                <span className={`badge-status badge-${order.status}`}>{order.status}</span>
              </div>

              {order.status !== 'cancelled' ? (
                <div className="status-track">
                  {STEPS.map((s, i) => {
                    const idx = STEPS.indexOf(order.status);
                    const cls = i < idx ? 'done' : i === idx ? 'current' : '';
                    return (
                      <div className={`status-step ${cls}`} key={s}>
                        <div className="status-dot">{i < idx ? '✓' : i + 1}</div>
                        <div className="status-label">{STEP_LABELS[s]}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: '#b5523f' }}>This order was cancelled.</p>
              )}

              <p style={{ color: 'var(--muted)', fontSize: 13 }}>
                {order.order_type === 'delivery' ? `Delivery to: ${order.address}` : 'Pickup in store'} • Placed{' '}
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            <div className="card">
              {order.items.map((i, idx) => (
                <div className="cart-line" key={idx}>
                  <div className="cart-line-name">{i.quantity} × {i.name}</div>
                  <div>${(i.price * i.quantity).toFixed(2)}</div>
                </div>
              ))}
              <div className="summary-row total"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
            </div>
          </>
        )}

        {/* Order History Section */}
        {user && (
          <div style={{ marginTop: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 24, margin: 0 }}>Your Order History</h3>
              {orderHistory.length > 0 && (
                <span style={{ color: 'var(--muted)', fontSize: 14 }}>
                  {orderHistory.length} {orderHistory.length === 1 ? 'order' : 'orders'}
                </span>
              )}
            </div>

            {historyLoading ? (
              <div style={{ marginTop: 20 }}>
                <LoadingSpinner message="Loading your orders..." />
              </div>
            ) : orderHistory.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
                <p style={{ color: 'var(--muted)', marginBottom: 16 }}>You haven't placed any orders yet.</p>
                <Link to="/menu" className="btn btn-solid">Browse Menu</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {orderHistory.map((historyOrder) => (
                  <div className="card" key={historyOrder.id} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
                          {historyOrder.order_code}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                          {new Date(historyOrder.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      <span className={`badge-status badge-${historyOrder.status}`}>
                        {historyOrder.status}
                      </span>
                    </div>

                    <div style={{ fontSize: 14, color: 'var(--text)', marginBottom: 8 }}>
                      {historyOrder.items.length} {historyOrder.items.length === 1 ? 'item' : 'items'} • 
                      {historyOrder.order_type === 'delivery' ? ' Delivery' : ' Pickup'}
                    </div>

                    <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>
                      {historyOrder.items.slice(0, 2).map(item => item.name).join(', ')}
                      {historyOrder.items.length > 2 && ` +${historyOrder.items.length - 2} more`}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--line)' }}>
                      <div style={{ fontWeight: 600, fontSize: 16 }}>
                        ${historyOrder.total.toFixed(2)}
                      </div>
                      <button
                        onClick={() => handleTrackHistory(historyOrder.order_code)}
                        className="btn btn-outline"
                        style={{ padding: '8px 20px', fontSize: 11 }}
                      >
                        Track Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Guest Message */}
        {!user && !order && !loading && (
          <div className="card" style={{ textAlign: 'center', padding: '30px 20px', marginTop: 20 }}>
            <p style={{ color: 'var(--muted)', marginBottom: 16 }}>
              <Link to="/login" style={{ color: 'var(--gold)', fontWeight: 500 }}>Login</Link> to view your order history and track all your orders in one place.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

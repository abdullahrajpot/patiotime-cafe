import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { trackOrder } from '../api';

const STEPS = ['received', 'preparing', 'ready', 'completed'];
const STEP_LABELS = { received: 'Received', preparing: 'Preparing', ready: 'Ready', completed: 'Completed' };

export default function Track() {
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

        {loading && <p style={{ textAlign: 'center', color: 'var(--muted)' }}>Looking up order…</p>}
        {error && <div className="empty-state">{error}</div>}

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
      </div>
    </>
  );
}

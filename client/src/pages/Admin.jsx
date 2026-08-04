import { useEffect, useState, useCallback } from 'react';
import { getAdminOrders, updateOrderStatus } from '../api';

const STATUSES = ['received', 'preparing', 'ready', 'completed', 'cancelled'];
const FILTERS = ['all', ...STATUSES];

export default function Admin() {
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
    <div style={{ background: '#f3f1ec', minHeight: '100vh' }}>
      <div className="page-wrap" style={{ maxWidth: 1180 }}>
        <div className="admin-header">
          <div>
            <h2 className="section-title-inline">Order Board</h2>
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
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{o.customer_name} • {o.customer_phone}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', textTransform: 'capitalize' }}>
                  {o.order_type}{o.address ? ` — ${o.address}` : ''}
                </div>
                <div className="order-card-items">
                  {o.items.map((i, idx) => (
                    <div key={idx}><span>{i.quantity} × {i.name}</span><span>${(i.price * i.quantity).toFixed(2)}</span></div>
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
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

const OrderHistoryCard = ({ order }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--line)',
      padding: '20px',
      transition: 'all 0.2s',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: 'var(--gold-dark)' }}>
            {order.order_code}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
            {formatDate(order.created_at)}
          </div>
        </div>
        <span className={`badge-status badge-${order.status}`} style={{ fontSize: 10 }}>
          {order.status}
        </span>
      </div>

      {/* Order Details */}
      <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--line)' }}>
        <div style={{ fontSize: 13, color: 'var(--text)', marginBottom: 6 }}>
          <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{order.order_type}</span>
          {' • '}
          <span>{order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
          {order.items && order.items.length > 0 && (
            <>
              {order.items.slice(0, 2).map(item => item.name).join(', ')}
              {order.items.length > 2 && ` +${order.items.length - 2} more`}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 600, fontSize: 17, fontFamily: "'Playfair Display', serif", color: 'var(--text)' }}>
          ${order.total?.toFixed(2)}
        </div>
        <Link
          to={`/track?code=${order.order_code}`}
          className="btn btn-outline"
          style={{ padding: '8px 20px', fontSize: 11 }}
        >
          Track Order
        </Link>
      </div>
    </div>
  );
};

export default OrderHistoryCard;

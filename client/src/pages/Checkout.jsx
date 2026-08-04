import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api';

export default function Checkout() {
  const { cart, subtotal, tax, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState('pickup');
  const [form, setForm] = useState({ customer_name: '', customer_phone: '', customer_email: '', address: '', notes: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        order_type: orderType,
        items: cart.map((c) => ({ menu_item_id: c.menu_item_id, quantity: c.quantity })),
      };
      const data = await createOrder(payload);
      clearCart();
      localStorage.setItem('last_order_code', data.order_code);
      navigate(`/track?code=${data.order_code}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <header
          className="hero hero-page"
          style={{ minHeight: 180, backgroundImage: "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=70')" }}
        >
          <div className="container hero-inner"><h1 style={{ fontSize: 32 }}>Checkout</h1></div>
        </header>
        <div className="page-wrap" style={{ maxWidth: 640 }}>
          <div className="empty-state">
            <h3>Your cart is empty</h3>
            <Link to="/menu" className="btn btn-solid" style={{ marginTop: 16, display: 'inline-block' }}>Browse Menu</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <header
        className="hero hero-page"
        style={{ minHeight: 180, backgroundImage: "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=70')" }}
      >
        <div className="container hero-inner"><h1 style={{ fontSize: 32 }}>Checkout</h1></div>
      </header>

      <div className="page-wrap" style={{ maxWidth: 640 }}>
        <div className="card">
          <div className="order-type-toggle">
            <button type="button" className={orderType === 'pickup' ? 'active' : ''} onClick={() => setOrderType('pickup')}>Pickup</button>
            <button type="button" className={orderType === 'delivery' ? 'active' : ''} onClick={() => setOrderType('delivery')}>Delivery</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field-row">
              <div className="field">
                <label>Full Name</label>
                <input type="text" name="customer_name" value={form.customer_name} onChange={handleChange} required />
              </div>
              <div className="field">
                <label>Phone</label>
                <input type="tel" name="customer_phone" value={form.customer_phone} onChange={handleChange} required />
              </div>
            </div>
            <div className="field">
              <label>Email (optional)</label>
              <input type="email" name="customer_email" value={form.customer_email} onChange={handleChange} />
            </div>
            {orderType === 'delivery' && (
              <div className="field">
                <label>Delivery Address</label>
                <input type="text" name="address" value={form.address} onChange={handleChange} required />
              </div>
            )}
            <div className="field">
              <label>Order Notes (optional)</label>
              <textarea name="notes" rows="3" value={form.notes} onChange={handleChange}></textarea>
            </div>

            <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="summary-row total"><span>Total</span><span>${total.toFixed(2)}</span></div>

            <button type="submit" className="btn btn-solid" style={{ width: '100%', marginTop: 20 }} disabled={submitting}>
              {submitting ? 'Placing order...' : 'Place Order'}
            </button>
            {error && <div style={{ color: '#b5523f', marginTop: 12, fontSize: 13 }}>{error}</div>}
          </form>
        </div>
      </div>
    </>
  );
}

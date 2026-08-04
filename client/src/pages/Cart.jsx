import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, subtotal, tax, total } = useCart();

  return (
    <>
      <header
        className="hero hero-page"
        style={{ minHeight: 180, backgroundImage: "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=70')" }}
      >
        <div className="container hero-inner"><h1 style={{ fontSize: 32 }}>Your Cart</h1></div>
      </header>

      <div className="page-wrap">
        {cart.length === 0 ? (
          <div className="empty-state">
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/menu" className="btn btn-solid" style={{ marginTop: 16, display: 'inline-block' }}>Browse Menu</Link>
          </div>
        ) : (
          <>
            <div className="card">
              {cart.map((c) => (
                <div className="cart-line" key={c.menu_item_id}>
                  <div>
                    <div className="cart-line-name">{c.name}</div>
                    <div className="cart-line-price">${c.price.toFixed(2)} each</div>
                  </div>
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => updateQuantity(c.menu_item_id, -1)}>−</button>
                    <span>{c.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(c.menu_item_id, 1)}>+</button>
                  </div>
                  <div style={{ width: 70, textAlign: 'right', fontWeight: 600 }}>
                    ${(c.price * c.quantity).toFixed(2)}
                  </div>
                  <span className="remove-link" onClick={() => removeFromCart(c.menu_item_id)}>Remove</span>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="summary-row"><span>Estimated Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="summary-row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              <Link to="/menu" className="btn btn-outline" style={{ flex: 1, textAlign: 'center' }}>Add More Items</Link>
              <Link to="/checkout" className="btn btn-solid" style={{ flex: 1, textAlign: 'center' }}>Checkout</Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}

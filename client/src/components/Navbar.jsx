import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const OVERLAY_PATHS = ['/', '/about', '/menu', '/reservation', '/contact'];

export default function Navbar() {
  const { count } = useCart();
  const { pathname } = useLocation();
  const overlay = OVERLAY_PATHS.includes(pathname);

  return (
    <nav className={`navbar ${overlay ? 'navbar-overlay' : 'navbar-solid'}`}>
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          <span className="logo-script">Pt.</span>
        </Link>

        <ul className="nav-links">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/menu">Our Menu</NavLink></li>
          <li><NavLink to="/reservation">Reservation</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>
        </ul>

        <div className="nav-actions">
          <Link to="/cart" className="cart-link" aria-label="Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6h15l-1.5 9h-12z" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
              <path d="M6 6L5 3H2" />
            </svg>
            {count > 0 && <span className="cart-count">{count}</span>}
          </Link>
          <Link to="/reservation" className="btn btn-ghost">Reservation</Link>
        </div>
      </div>
    </nav>
  );
}

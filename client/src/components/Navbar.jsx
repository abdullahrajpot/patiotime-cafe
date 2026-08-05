import { Link, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const OVERLAY_PATHS = ['/', '/about', '/menu', '/reservation', '/contact'];

export default function Navbar() {
  const { count } = useCart();
  const { pathname } = useLocation();
  const overlay = OVERLAY_PATHS.includes(pathname);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  };

  return (
    <nav className={`navbar ${overlay ? 'navbar-overlay' : 'navbar-solid'}`}>
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          <span className="logo-script">Pt.</span>
        </Link>

        {/* Desktop Navigation */}
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
          
          {user ? (
            <button onClick={handleLogout} className="nav-link-btn" title="Logout">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          ) : (
            <Link to="/login" className="nav-link-btn" title="Login">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </Link>
          )}
          
          {/* Mobile Hamburger Button */}
          <button 
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-overlay" onClick={closeMobileMenu}>
          <div className="mobile-nav-menu" onClick={(e) => e.stopPropagation()}>
            <NavLink to="/" end onClick={closeMobileMenu}>Home</NavLink>
            <NavLink to="/about" onClick={closeMobileMenu}>About</NavLink>
            <NavLink to="/menu" onClick={closeMobileMenu}>Our Menu</NavLink>
            <NavLink to="/reservation" onClick={closeMobileMenu}>Reservation</NavLink>
            <NavLink to="/contact" onClick={closeMobileMenu}>Contact</NavLink>
            <NavLink to="/cart" onClick={closeMobileMenu} className="mobile-cart-link">
              🛒 Cart {count > 0 && `(${count})`}
            </NavLink>
            {user ? (
              <>
                <div style={{ padding: '12px 24px', color: 'rgba(255,255,255,0.6)', fontSize: '13px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  Logged in as: {user.name}
                </div>
                <button onClick={handleLogout} className="mobile-nav-logout">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={closeMobileMenu}>Login</NavLink>
                <NavLink to="/register" onClick={closeMobileMenu}>Register</NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

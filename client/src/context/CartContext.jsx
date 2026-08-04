import { createContext, useContext, useEffect, useState, useMemo } from 'react';

const CartContext = createContext(null);
const CART_KEY = 'patiotime_cart';
const TAX_RATE = 0.08;

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menu_item_id === item.menu_item_id);
      if (existing) {
        return prev.map((c) =>
          c.menu_item_id === item.menu_item_id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { menu_item_id: item.menu_item_id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const updateQuantity = (menu_item_id, delta) => {
    setCart((prev) => {
      const next = prev
        .map((c) => (c.menu_item_id === menu_item_id ? { ...c, quantity: c.quantity + delta } : c))
        .filter((c) => c.quantity > 0);
      return next;
    });
  };

  const removeFromCart = (menu_item_id) => {
    setCart((prev) => prev.filter((c) => c.menu_item_id !== menu_item_id));
  };

  const clearCart = () => setCart([]);

  const count = useMemo(() => cart.reduce((sum, c) => sum + c.quantity, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((sum, c) => sum + c.quantity * c.price, 0), [cart]);
  const tax = useMemo(() => Math.round(subtotal * TAX_RATE * 100) / 100, [subtotal]);
  const total = useMemo(() => Math.round((subtotal + tax) * 100) / 100, [subtotal, tax]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, count, subtotal, tax, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside a CartProvider');
  return ctx;
}

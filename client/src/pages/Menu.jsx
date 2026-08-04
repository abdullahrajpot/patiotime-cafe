import { useEffect, useState } from 'react';
import { getMenu } from '../api';
import { useCart } from '../context/CartContext';
import { HERO_MENU } from '../utils/images';
import { menuItemImg } from '../utils/images';
import { MenuColumn, MenuDivider } from '../components/MenuItems';
import Newsletter from '../components/Newsletter';

function BrunchCard({ item, onAdd }) {
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    onAdd(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 800);
  };
  return (
    <article className="brunch-card">
      <img src={menuItemImg(item.image)} alt={item.name} loading="lazy" />
      <div className="brunch-card-top">
        <h4>{item.name}</h4>
        <span className="price">${item.price.toFixed(2)}</span>
      </div>
      <p>{item.description}</p>
      <button type="button" className="btn btn-outline" style={{ width: '100%', padding: '12px' }} onClick={handleAdd}>
        {added ? 'Added ✓' : 'Add to Cart'}
      </button>
    </article>
  );
}

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    getMenu().then(setCategories).catch(() => setCategories([]));
  }, []);

  const coffee = categories.find((c) => c.name === 'Coffees & Teas');
  const bakery = categories.find((c) => c.name === 'Bakery & Lunch');
  const brunch = categories.find((c) => c.name === 'All-Day Brunch');

  const handleAdd = (item) =>
    addToCart({ menu_item_id: item._id, name: item.name, price: item.price });

  return (
    <>
      <header className="hero hero-page hero-menu-single" style={{ backgroundImage: `url('${HERO_MENU}')` }}>
        <div className="container hero-inner">
          <h1>Our Menu</h1>
        </div>
        <div className="wave-bottom" aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,50 Q360,100 720,50 T1440,50 L1440,100 L0,100 Z" fill="#fff" />
          </svg>
        </div>
      </header>

      <section className="section menu-page-section">
        <div className="container">
          <div className="menu-grid">
            <MenuColumn
              eyebrow="Best Drinks"
              title="Coffees & Teas"
              items={coffee?.items}
              onAdd={handleAdd}
              showAdd
            />
            <MenuDivider />
            <MenuColumn
              eyebrow="Delicious Food"
              title="Bakery & Lunch"
              items={bakery?.items}
              onAdd={handleAdd}
              showAdd
            />
          </div>
        </div>
      </section>

      <section className="section brunch-grid-section">
        <div className="container">
          <h2 className="brunch-grid-title">All Day Brunch</h2>
          <div className="brunch-grid">
            {brunch?.items.map((it) => (
              <BrunchCard key={it._id} item={it} onAdd={handleAdd} />
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}

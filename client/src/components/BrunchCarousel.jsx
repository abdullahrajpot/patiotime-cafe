import { useEffect, useState } from 'react';
import { getMenuByCategory } from '../api';

export default function BrunchCarousel() {
  const [brunchItems, setBrunchItems] = useState([]);
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    // Fetch real brunch items from database
    const loadBrunchItems = async () => {
      try {
        const items = await getMenuByCategory('all-day-brunch');
        if (items && items.length > 0) {
          // Filter out items with missing required data
          const validItems = items.filter(item => 
            item && item.name && item.price !== undefined && item.price !== null
          );
          setBrunchItems(validItems);
        }
      } catch (err) {
        console.error('Failed to load brunch items:', err);
      }
    };
    loadBrunchItems();
  }, []);

  useEffect(() => {
    if (brunchItems.length === 0) return;

    // Smooth infinite scroll animation
    const interval = setInterval(() => {
      setTranslateX((prev) => {
        const cardWidth = 100 / 3; // Each card takes 33.33% width
        const newTranslate = prev - 0.03; // Slower, smoother scroll
        
        // Reset seamlessly when first set scrolls out
        if (Math.abs(newTranslate) >= (brunchItems.length * cardWidth)) {
          return 0;
        }
        
        return newTranslate;
      });
    }, 16); // ~60fps for ultra-smooth animation

    return () => clearInterval(interval);
  }, [brunchItems.length]);

  // If no items, show nothing
  if (brunchItems.length === 0) {
    return null;
  }

  // Triple the items for seamless loop
  const displayItems = [...brunchItems, ...brunchItems, ...brunchItems];

  return (
    <section className="section brunch-section">
      <div className="container">
        <h2 className="brunch-title">We Also Have All-day Brunch!</h2>
        <div className="brunch-carousel">
          <div 
            className="brunch-track" 
            style={{ 
              transform: `translateX(${translateX}%)`,
              transition: 'none'
            }}
          >
            {displayItems.map((item, index) => (
              <div className="brunch-slide" key={`${item._id}-${index}`}>
                <img 
                  src={item.image ? `/images/${item.image}` : '/images/placeholder.jpg'} 
                  alt={item.name || 'Brunch item'} 
                  loading="lazy" 
                />
                <div className="brunch-slide-info">
                  <h4>{item.name || 'Brunch Item'}</h4>
                  <span className="price">
                    ${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

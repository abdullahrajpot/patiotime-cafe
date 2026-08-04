import { useEffect, useState } from 'react';
import { BRUNCH_SLIDES } from '../utils/images';

export default function BrunchCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % BRUNCH_SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="section brunch-section">
      <div className="container">
        <h2 className="brunch-title">We Also Have All-day Brunch!</h2>
        <div className="brunch-carousel">
          <div className="brunch-track" style={{ transform: `translateX(-${active * (100 / 3 + 2)}%)` }}>
            {BRUNCH_SLIDES.map((src) => (
              <div className="brunch-slide" key={src}>
                <img src={src} alt="Brunch dish" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
        <div className="brunch-dots">
          {BRUNCH_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              className={i === active ? 'active' : ''}
              onClick={() => setActive(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

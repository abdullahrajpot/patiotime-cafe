import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMenu } from '../api';
import { HERO_HOME } from '../utils/images';
import { MenuColumn, MenuDivider } from '../components/MenuItems';
import BrunchCarousel from '../components/BrunchCarousel';
import InstagramGrid from '../components/InstagramGrid';
import OurStory from '../components/OurStory';
import LatestNews from '../components/LatestNews';
import Newsletter from '../components/Newsletter';

export default function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getMenu().then(setCategories).catch(() => setCategories([]));
  }, []);

  const coffee = categories.find((c) => c.name === 'Coffees & Teas');
  const bakery = categories.find((c) => c.name === 'Bakery & Lunch');

  return (
    <>
      <header className="hero" style={{ backgroundImage: `url('${HERO_HOME}')` }}>
        <div className="container hero-inner">
          <p className="hero-eyebrow">Coffee Passion</p>
          <h1>
            Today&apos;s Good Mood Is<br />
            Sponsored By <em>Coffee</em>
          </h1>
          <Link to="/menu" className="btn btn-solid">Order Online</Link>
        </div>
        <div className="wave-bottom" aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,50 Q360,100 720,50 T1440,50 L1440,100 L0,100 Z" fill="#fff" />
          </svg>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>À la Carte</h2>
            <div className="heading-diamonds">
              <span className="diamond" />
              <span className="divider-line" />
              <span className="diamond" />
            </div>
          </div>
          <div className="menu-grid">
            <MenuColumn eyebrow="Best Drinks" title="Coffees & Teas" items={coffee?.items} />
            <MenuDivider />
            <MenuColumn eyebrow="Delicious Food" title="Bakery & Lunch" items={bakery?.items} />
          </div>
          <div className="menu-cta">
            <Link to="/menu" className="btn btn-outline">View Full Menu</Link>
          </div>
        </div>
      </section>

      <BrunchCarousel />

      <InstagramGrid />
      <OurStory />
      <LatestNews />
      <Newsletter />
    </>
  );
}

import { Link } from 'react-router-dom';
import { HERO_ABOUT, ABOUT_V60 } from '../utils/images';
import InstagramGrid from '../components/InstagramGrid';
import OurStory from '../components/OurStory';
import Newsletter from '../components/Newsletter';

export default function About() {
  return (
    <>
      <header className="hero hero-page" style={{ backgroundImage: `url('${HERO_ABOUT}')` }}>
        <div className="container hero-inner">
          <h1>About Us</h1>
        </div>
        <div className="wave-bottom" aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,50 Q360,100 720,50 T1440,50 L1440,100 L0,100 Z" fill="#fff" />
          </svg>
        </div>
      </header>

      <OurStory buttonTo="/menu" buttonLabel="View Menus" showOnAbout={false} />

      <InstagramGrid />

      <section className="section story-section philosophy-section">
        <div className="container">
          <div className="story-wrap philosophy-wrap">
            <div className="story-content philosophy-content">
              <p className="story-eyebrow">Great Coffee Experience</p>
              <h2>Our Philosophy</h2>
              <p>
                Simple and balanced. Alexander Petillo brings together flavors and specialties from Italy and beyond to create his own culinary world, full of surprising artistry.
              </p>
              <p>
                We see our customers as invited guests to a party, and we are the hosts. It&apos;s our job every day to make every important aspect of the customer experience a little bit better. Donec quam felis, ultricies nec, pellentesque eu.
              </p>
              <Link to="/menu" className="btn btn-solid">Reservation</Link>
            </div>
            <div className="philosophy-image-frame">
              <div className="philosophy-image">
                <img src={ABOUT_V60} alt="Coffee brewing" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}

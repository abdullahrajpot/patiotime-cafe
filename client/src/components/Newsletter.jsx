import { NEWSLETTER_BG } from '../utils/images';

export default function Newsletter() {
  return (
    <section className="newsletter">
      <div className="wave-top" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,0 L0,0 Z" fill="#fff" />
        </svg>
      </div>
      <div
        className="newsletter-bg"
        style={{ backgroundImage: `url('${NEWSLETTER_BG}')` }}
      />
      <div className="container newsletter-inner">
        <p className="newsletter-eyebrow">Visit Us For Good Coffee &amp; Food</p>
        <h2>Waiting For You Every Day</h2>
        <p className="newsletter-text">
          If you would like to stay connected and be the first to know about our news, events,
          and exclusive offers, please subscribe to our newsletter.
        </p>
        <form
          className="newsletter-form"
          onSubmit={(e) => { e.preventDefault(); alert('Thanks for subscribing!'); }}
        >
          <input type="email" placeholder="Your Email Address" required />
          <button type="submit" aria-label="Subscribe">→</button>
        </form>
        <label className="newsletter-privacy">
          <input type="checkbox" required />
          <span>I agree to the Privacy Policy</span>
        </label>
      </div>
    </section>
  );
}

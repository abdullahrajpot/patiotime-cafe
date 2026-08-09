import { Link } from 'react-router-dom';

const SOCIAL = ['f', '𝕏', '◎', 'P', '▶'];

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container footer-inner">
        <div className="footer-socials">
          {SOCIAL.map((icon, i) => (
            <a key={i} href="#" aria-label="Social">{icon}</a>
          ))}
        </div>
        <p className="footer-contact">
          Silk St, Barbican, London EC2Y 8DS, UK — 055 123 4567 — booking@patiotime.com
        </p>
        <p className="footer-copy">© Copyright PatioTime WordPress Theme</p>
        <p className="footer-admin">
          <Link to="/track">Track Order</Link>
        </p>
      </div>
    </footer>
  );
}

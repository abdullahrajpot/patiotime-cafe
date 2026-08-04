import { INSTAGRAM } from '../utils/images';

export default function InstagramGrid() {
  return (
    <section className="instagram-section">
      <div className="instagram-grid">
        {INSTAGRAM.map((src, i) => (
          <div className={`ig-cell ig-cell-${i + 1}`} key={src}>
            <img src={src} alt="" loading="lazy" />
          </div>
        ))}
        <div className="ig-overlay">
          <div className="ig-circle">
            <span>Follow Us on<br />Instagram</span>
          </div>
        </div>
      </div>
    </section>
  );
}

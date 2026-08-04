import { NEWS } from '../utils/images';

export default function LatestNews() {
  return (
    <section className="section news-section" id="news">
      <div className="container">
        <div className="news-header">
          <div>
            <p className="news-eyebrow">Don&apos;t miss our new articles</p>
            <h2>Latest News</h2>
          </div>
          <a href="#news" className="btn btn-ghost-dark">View All Articles</a>
        </div>
        <div className="news-grid">
          {NEWS.map((article) => (
            <article className="news-card" key={article.title}>
              <div className="news-card-img">
                <img src={article.image} alt={article.title} loading="lazy" />
              </div>
              <div className="news-card-body">
                <time>{article.date}</time>
                <h3>{article.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

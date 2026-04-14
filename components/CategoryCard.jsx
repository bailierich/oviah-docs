import Link from 'next/link';

export default function CategoryCard({ title, description, icon, iconColor, articleCount, articles, dotColor }) {
  return (
    <div className="card">
      <div className="card-top">
        <div className={`card-icon ${iconColor}`}>{icon}</div>
        <span className="card-count">{articleCount} articles</span>
      </div>
      <div className="card-title">{title}</div>
      <div className="card-desc">{description}</div>
      <div className="card-articles">
        {articles.map((article, i) => (
          <Link key={i} href={article.href} className="card-article-link">
            <span className={`dot ${dotColor}`}></span>
            {article.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

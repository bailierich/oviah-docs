import Link from 'next/link';

export default function ArticleRow({ category, title, href }) {
  return (
    <Link href={href} className="article-row">
      <div className="article-row-left">
        <span className="article-row-cat">{category}</span>
        <span className="article-row-title">{title}</span>
      </div>
      <span className="article-row-arrow">&rarr;</span>
    </Link>
  );
}

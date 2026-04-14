import { notFound } from 'next/navigation';
import { getArticleBySlug } from '@/lib/content';
import ArticlePage from '@/components/ArticlePage';

export default async function HelpArticlePage({ params }) {
  const { category, slug } = await params;
  const article = getArticleBySlug(category, slug);

  if (!article) notFound();

  return <ArticlePage frontmatter={article.frontmatter} content={article.content} />;
}

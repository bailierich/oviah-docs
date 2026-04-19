import { getAllArticles } from '@/lib/content';

export default async function sitemap() {
  const articles = getAllArticles();
  return [
    { url: 'https://docs.oviah.io', lastModified: new Date() },
    ...articles.map((a) => ({
      url: `https://docs.oviah.io/help/${a.category}/${a.slug}`,
      lastModified: (() => {
        const d = new Date(a.frontmatter.updatedAt);
        return Number.isNaN(d.getTime()) ? new Date() : d;
      })(),
    })),
  ];
}

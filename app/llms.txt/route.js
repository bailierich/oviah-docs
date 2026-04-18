import { getAllArticles } from '@/lib/content';

export async function GET() {
  const articles = getAllArticles();

  const lines = [
    '# OVIAH Help Center',
    '',
    '> OVIAH is an all-in-one business management platform for independent beauty professionals.',
    '> This site contains official help documentation.',
    '',
    '## Sections',
    '',
    ...articles.map(
      (a) =>
        `- [${a.frontmatter.title}](https://docs.oviah.com/help/${a.category}/${a.slug}): ${a.frontmatter.description}`
    ),
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain' },
  });
}

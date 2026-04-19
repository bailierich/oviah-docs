import { getAllArticlesWithBody } from '@/lib/content';

export async function GET() {
  const articles = getAllArticlesWithBody();

  const intro = [
    '# OVIAH Help Center',
    '',
    '> OVIAH is an all-in-one business management platform for independent beauty professionals.',
    '> This site contains official help documentation.',
    '',
    '## Articles',
    '',
  ];

  const articleBlocks = articles.map((a) => {
    const url = `https://docs.oviah.io/help/${a.category}/${a.slug}`;
    return [
      `### ${a.frontmatter.title}`,
      url,
      '',
      a.bodyText.trim(),
      '',
    ].join('\n');
  });

  const body = [...intro, ...articleBlocks].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain' },
  });
}

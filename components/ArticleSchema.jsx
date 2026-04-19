export function ArticleSchema({ title, description, category, slug }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description,
          url: `https://docs.oviah.io/help/${category}/${slug}`,
          publisher: {
            '@type': 'Organization',
            name: 'OVIAH',
            url: 'https://oviah.com',
          },
        }),
      }}
    />
  );
}

export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://docs.oviah.io/sitemap.xml',
  };
}

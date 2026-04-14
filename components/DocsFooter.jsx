import Link from 'next/link';

export default function DocsFooter() {
  return (
    <>
      <div className="accent-bar"></div>
      <footer className="page-footer">
        <div className="footer-logo">OVIAH</div>
        <div className="footer-links">
          <Link href="/">Help Center</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/developers">Developers</Link>
          <a href="mailto:support@oviah.io">support@oviah.io</a>
        </div>
      </footer>
    </>
  );
}

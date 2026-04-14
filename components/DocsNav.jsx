'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DocsNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: '/', label: 'Help Center' },
    { href: '/blog', label: 'Blog' },
    { href: '/developers', label: 'Developers' },
  ];

  function isActive(href) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <>
      <nav className="topnav">
        <Link href="/" className="topnav-logo">OVIAH</Link>
        <div className="topnav-links">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? 'active' : ''}
            >
              {link.label}
            </Link>
          ))}
          <a href="https://oviah.io" target="_blank" rel="noopener noreferrer">Log In</a>
        </div>
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
      <div className="accent-bar"></div>
      <div className={`mobile-nav-overlay${menuOpen ? ' open' : ''}`}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={isActive(link.href) ? 'active' : ''}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <a href="https://oviah.io" target="_blank" rel="noopener noreferrer">Log In</a>
      </div>
    </>
  );
}

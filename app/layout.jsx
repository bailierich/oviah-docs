import './globals.css';
import DocsNav from '@/components/DocsNav';
import DocsFooter from '@/components/DocsFooter';

export const metadata = {
  metadataBase: new URL('https://docs.oviah.io'),
  title: {
    default: 'OVIAH Help Center',
    template: '%s | OVIAH Help Center',
  },
  description: 'Learn how to manage your beauty business with OVIAH — bookings, payments, clients, and more.',
  openGraph: {
    type: 'website',
    siteName: 'OVIAH',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DocsNav />
        {children}
        <DocsFooter />
      </body>
    </html>
  );
}

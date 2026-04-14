import './globals.css';
import DocsNav from '@/components/DocsNav';
import DocsFooter from '@/components/DocsFooter';

export const metadata = {
  title: 'OVIAH Help Center',
  description: 'Everything you need to run your business — answers, guides, and step-by-step walkthroughs.',
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

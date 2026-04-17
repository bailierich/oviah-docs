import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ArticleSchema } from '@/components/ArticleSchema';
import { FAQSchema } from '@/components/FAQSchema';

const sidebarData = [
  {
    label: 'Getting Started',
    links: [
      { title: 'Account Setup', href: '/help/getting-started/account-setup' },
      { title: 'Your Booking Link', href: '/help/getting-started/your-booking-link' },
      { title: 'Adding Services', href: '/help/getting-started/adding-services' },
      { title: 'Personalizing Your Profile', href: '/help/getting-started/personalizing-your-profile' },
    ],
  },
  {
    label: 'Payments',
    links: [
      { title: 'Connecting OVIAH Pay', href: '/help/payments/connecting-oviah-pay' },
      { title: 'Deposits & Card on File', href: '/help/payments/deposits' },
      { title: 'Refunds & Disputes', href: '/help/payments/refunds' },
      { title: 'Payouts', href: '/help/payments/payouts' },
    ],
  },
  {
    label: 'Bookings',
    links: [
      { title: 'Managing Your Calendar', href: '/help/bookings/managing-your-calendar' },
      { title: 'Client Reminders', href: '/help/bookings/client-reminders' },
      { title: 'No-Show Protection', href: '/help/bookings/no-show-protection' },
      { title: 'Block Time Off', href: '/help/bookings/block-time-off' },
    ],
  },
  {
    label: 'Clients',
    links: [
      { title: 'Client Profiles', href: '/help/clients/client-profiles' },
      { title: 'Importing Clients', href: '/help/clients/importing-clients' },
      { title: 'Notes & History', href: '/help/clients/notes-and-history' },
    ],
  },
  {
    label: 'Account',
    links: [
      { title: 'Billing & Plans', href: '/help/account/billing-and-plans' },
      { title: 'Notifications', href: '/help/account/notifications' },
      { title: 'Privacy & Security', href: '/help/account/privacy-and-security' },
    ],
  },
];

function mdxComponents() {
  return {
    h2: (props) => <h2 className="section-heading" {...props} />,
    p: (props) => <p className="body-text" {...props} />,
    strong: (props) => <strong {...props} />,
  };
}

export default function ArticlePage({ frontmatter, content, category, slug }) {
  const currentPath = `/help/${frontmatter.slug ? frontmatter.category?.toLowerCase().replace(/\s+/g, '-') + '/' + frontmatter.slug : ''}`;

  return (
    <div className="layout">
      <ArticleSchema
        title={frontmatter.title}
        description={frontmatter.description}
        category={category}
        slug={slug}
      />
      {Array.isArray(frontmatter.faq) && frontmatter.faq.length > 0 && (
        <FAQSchema questions={frontmatter.faq} />
      )}
      <aside className="sidebar">
        {sidebarData.map((section) => (
          <div key={section.label} className="sidebar-section">
            <div className="sidebar-label">{section.label}</div>
            {section.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`sidebar-link${link.href === currentPath ? ' active' : ''}`}
              >
                {link.title}
              </Link>
            ))}
          </div>
        ))}
      </aside>

      <main className="main">
        <div className="search-wrap">
          <div className="search-inner">
            <span className="search-icon-article">&#9906;</span>
            <input type="text" placeholder="Search the help center..." readOnly />
          </div>
        </div>

        <div className="breadcrumb">
          Help Center <span>&rsaquo;</span> {frontmatter.category} <span>&rsaquo;</span> {frontmatter.title?.split(' ').slice(0, 3).join(' ')}
        </div>

        <div className="article-tag">{frontmatter.category}</div>
        <h1 className="article-title">{frontmatter.title}</h1>
        <div className="article-meta">
          {frontmatter.readTime} <span>&middot;</span> Updated {frontmatter.updatedAt} <span>&middot;</span> Written by the OVIAH Team
        </div>

        <div className="intro-box">
          <div className="intro-box-label">Overview</div>
          <p>{frontmatter.description}</p>
        </div>

        <MDXRemote source={content} components={mdxComponents()} />

        {frontmatter.relatedArticles && frontmatter.relatedArticles.length > 0 && (
          <div className="related">
            <div className="related-title">Related Articles</div>
            <div className="related-grid">
              {frontmatter.relatedArticles.map((article, i) => (
                <Link key={i} href={`/help/${article.category}/${article.slug}`} className="related-card">
                  <div className="related-card-cat">{article.category}</div>
                  <div className="related-card-title">{article.title}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

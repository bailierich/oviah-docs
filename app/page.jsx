import CategoryCard from '@/components/CategoryCard';
import ArticleRow from '@/components/ArticleRow';

const categories = [
  {
    title: 'Getting Started',
    description: "New to OVIAH? Start here — setup, your booking link, and everything before your first client.",
    icon: '✦',
    iconColor: 'lav',
    dotColor: 'lav',
    articleCount: 6,
    articles: [
      { label: 'Account setup guide', href: '/help/getting-started/account-setup' },
      { label: 'Your booking link explained', href: '/help/getting-started/your-booking-link' },
      { label: 'Adding your services', href: '/help/getting-started/adding-services' },
    ],
  },
  {
    title: 'Payments',
    description: 'Connect OVIAH Pay, collect deposits, manage payouts, and handle refunds with confidence.',
    icon: '◈',
    iconColor: 'grn',
    dotColor: 'grn',
    articleCount: 8,
    articles: [
      { label: 'Connecting OVIAH Pay', href: '/help/payments/connecting-oviah-pay' },
      { label: 'Setting up deposits', href: '/help/payments/deposits' },
      { label: 'Payouts & fees explained', href: '/help/payments/payouts' },
    ],
  },
  {
    title: 'Bookings & Calendar',
    description: 'Manage your schedule, block time off, set availability, and protect against no-shows.',
    icon: '◻',
    iconColor: 'org',
    dotColor: 'org',
    articleCount: 7,
    articles: [
      { label: 'Managing your calendar', href: '/help/bookings/managing-your-calendar' },
      { label: 'No-show protection', href: '/help/bookings/no-show-protection' },
      { label: 'Automated client reminders', href: '/help/bookings/client-reminders' },
    ],
  },
  {
    title: 'Your Profile & Page',
    description: 'Customize your booking page so it looks and feels like your brand — photos, colors, bio.',
    icon: '◯',
    iconColor: 'lav',
    dotColor: 'lav',
    articleCount: 5,
    articles: [
      { label: 'Personalizing your booking page', href: '/help/profile/personalizing-your-booking-page' },
      { label: 'Adding a profile photo', href: '/help/profile/adding-a-profile-photo' },
      { label: 'Brand colors & fonts', href: '/help/profile/brand-colors-and-fonts' },
    ],
  },
  {
    title: 'Clients',
    description: 'Build your client list, view booking history, add notes, and import existing contacts.',
    icon: '◇',
    iconColor: 'grn',
    dotColor: 'grn',
    articleCount: 5,
    articles: [
      { label: 'Client profiles overview', href: '/help/clients/client-profiles' },
      { label: 'Importing your client list', href: '/help/clients/importing-clients' },
      { label: 'Notes & appointment history', href: '/help/clients/notes-and-history' },
    ],
  },
  {
    title: 'Account & Billing',
    description: 'Manage your subscription, update payment info, and adjust notification preferences.',
    icon: '⬡',
    iconColor: 'org',
    dotColor: 'org',
    articleCount: 4,
    articles: [
      { label: 'Plans & pricing', href: '/help/account/billing-and-plans' },
      { label: 'Updating billing info', href: '/help/account/updating-billing-info' },
      { label: 'Notification settings', href: '/help/account/notifications' },
    ],
  },
];

const popularArticles = [
  { category: 'Payments', title: 'How to connect OVIAH Pay to your account', href: '/help/payments/connecting-oviah-pay' },
  { category: 'Getting Started', title: 'Setting up your account for the first time', href: '/help/getting-started/account-setup' },
  { category: 'Bookings', title: 'Requiring a deposit to reduce no-shows', href: '/help/bookings/no-show-protection' },
  { category: 'Profile', title: 'Sharing your booking link on Instagram', href: '/help/profile/personalizing-your-booking-page' },
  { category: 'Payments', title: 'When do I get paid? Understanding payouts', href: '/help/payments/payouts' },
  { category: 'Clients', title: 'Importing your existing client list into OVIAH', href: '/help/clients/importing-clients' },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <div className="hero">
        <div className="hero-eyebrow">Help Center</div>
        <h1 className="hero-title">How can we <em>help you?</em></h1>
        <p className="hero-sub">Everything you need to run your business — answers, guides, and step-by-step walkthroughs.</p>
        <div className="search-wrap-hero">
          <div className="search-box">
            <span className="search-icon">&#9906;</span>
            <input type="text" placeholder="Search for anything — payments, bookings, profile..." readOnly />
          </div>
          <div className="search-hint">Try <span>connect stripe</span> or <span>add a service</span></div>
        </div>
      </div>

      {/* PAGE BODY */}
      <div className="page-body">
        <div className="section-label">Browse by topic</div>
        <div className="cards-grid">
          {categories.map((cat) => (
            <CategoryCard key={cat.title} {...cat} />
          ))}
        </div>

        <div className="section-label">Most helpful</div>
        <div className="popular-grid">
          {popularArticles.map((article, i) => (
            <ArticleRow key={i} {...article} />
          ))}
        </div>

        {/* CONTACT BANNER */}
        <div className="contact-banner">
          <div>
            <div className="contact-banner-eyebrow">Still need help?</div>
            <div className="contact-banner-title">We&rsquo;re here for you.</div>
            <div className="contact-banner-sub">Reach the OVIAH team — we respond within one business day.</div>
          </div>
          <a href="mailto:support@oviah.io" className="contact-btn">Contact Support</a>
        </div>
      </div>
    </>
  );
}

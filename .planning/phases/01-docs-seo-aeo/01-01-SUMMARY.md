---
phase: 01-docs-seo-aeo
plan: "01"
subsystem: seo-metadata
tags: [metadata, frontmatter, seo, next.js, content-validation]
dependency_graph:
  requires: []
  provides: [root-metadata, per-article-metadata, iso-updatedat, updatedat-enforcement]
  affects: [app/layout.jsx, app/help/[category]/[slug]/page.jsx, lib/content.js, content/help/**]
tech_stack:
  added: [scripts/validate-content.mjs]
  patterns: [Next.js metadata API, prebuild validation script, ESM module enforcement]
key_files:
  created: [scripts/validate-content.mjs]
  modified:
    - app/layout.jsx
    - app/help/[category]/[slug]/page.jsx
    - lib/content.js
    - package.json
    - content/help/account/billing-and-plans.mdx
    - content/help/account/notifications.mdx
    - content/help/account/privacy-and-security.mdx
    - content/help/account/updating-billing-info.mdx
    - content/help/bookings/block-time-off.mdx
    - content/help/bookings/client-reminders.mdx
    - content/help/bookings/managing-your-calendar.mdx
    - content/help/bookings/no-show-protection.mdx
    - content/help/clients/client-profiles.mdx
    - content/help/clients/importing-clients.mdx
    - content/help/clients/notes-and-history.mdx
    - content/help/getting-started/account-setup.mdx
    - content/help/getting-started/adding-services.mdx
    - content/help/getting-started/personalizing-your-profile.mdx
    - content/help/getting-started/your-booking-link.mdx
    - content/help/payments/connecting-oviah-pay.mdx
    - content/help/payments/deposits.mdx
    - content/help/payments/payouts.mdx
    - content/help/payments/refunds.mdx
    - content/help/profile/adding-a-profile-photo.mdx
    - content/help/profile/brand-colors-and-fonts.mdx
    - content/help/profile/personalizing-your-booking-page.mdx
decisions:
  - "Route shape is /help/[category]/[slug] — NOT /help/[slug] as PRD assumed"
  - "Loader is getArticleBySlug(category, slug) — NOT getArticle(params.slug)"
  - "generateMetadata must await params (Next.js 16 Promise-based params)"
  - "JS not TS — no Metadata type annotation on layout.jsx or page.jsx"
  - "updatedAt normalized to 2026-03-01 (first of month for March 2026)"
  - "updatedAt enforcement uses prebuild script (validate-content.mjs) to trigger loader during build"
metrics:
  duration: "~42 hours (spread across sessions)"
  completed: "2026-04-17"
  tasks_completed: 4
  files_changed: 27
requirements_closed: [SC-1, SC-2]
---

# Phase 1 Plan 1: SEO Metadata Foundation Summary

Established the SEO metadata foundation for docs.oviah.com: root metadataBase + title template in layout.jsx, per-article generateMetadata using await params + getArticleBySlug, ISO updatedAt normalization across all 22 MDX articles, and a prebuild content-validation chokepoint that throws in production when updatedAt is missing.

## What Changed

### app/layout.jsx

Replaced the 2-field metadata stub with the full D-01 spec object:

```jsx
export const metadata = {
  metadataBase: new URL('https://docs.oviah.com'),
  title: {
    default: 'OVIAH Help Center',
    template: '%s | OVIAH Help Center',
  },
  description: 'Learn how to manage your beauty business with OVIAH — bookings, payments, clients, and more.',
  openGraph: { type: 'website', siteName: 'OVIAH', locale: 'en_US' },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};
```

`metadataBase` is the critical field — all relative OG/Twitter image URLs and absolute links in downstream plans (sitemap, JSON-LD, llms.txt) resolve against `https://docs.oviah.com`.

### ISO updatedAt — 2026-03-01

All 22 MDX articles had `updatedAt: March 2026`. This was replaced with `updatedAt: 2026-03-01` (first of month as a sensible canonical default). gray-matter parses YAML ISO dates as JS `Date` objects, which means Plan 02's sitemap can call `new Date(article.frontmatter.updatedAt)` without getting `Invalid Date`. The human-readable `"March 2026"` string would silently produce `Invalid Date` in Node.js.

### app/help/[category]/[slug]/page.jsx — generateMetadata

Added above the default export:

```jsx
export async function generateMetadata({ params }) {
  const { category, slug } = await params;
  const article = getArticleBySlug(category, slug);
  if (!article) return {};
  return {
    title: article.frontmatter.title,
    description: article.frontmatter.description,
  };
}
```

Returning the bare `title` (no brand suffix) is correct — the root layout's `template: '%s | OVIAH Help Center'` appends the brand automatically. Verified at runtime: `<title>Connecting OVIAH Pay | OVIAH Help Center</title>`.

### lib/content.js — updatedAt enforcement

Added `requireUpdatedAt(data, filePath)` helper called from `getArticleBySlug` and `getArticlesByCategory`. In `NODE_ENV=production` it throws; otherwise it warns via `console.warn`. The error string `[content] Missing updatedAt in {path}` is greppable in CI logs.

### scripts/validate-content.mjs + prebuild hook

Because the article route is dynamic (server-rendered on demand), `next build` never calls the article loader — so the throw in `requireUpdatedAt` would never fire during a standard build. The fix: a `prebuild` npm script (`node scripts/validate-content.mjs`) that calls `getAllArticles()` before `next build` runs. This exercises every article's `requireUpdatedAt` check at build time. Negative test confirmed: `NODE_ENV=production npm run build` with one article's `updatedAt` removed produces `Error: [content] Missing updatedAt in .../connecting-oviah-pay.mdx` and aborts before `next build` starts.

## Discretionary Resolutions (Locked for Downstream Plans)

These were resolved by the planner and are inherited by Plans 02, 03, and 04:

| Decision | Value | Impact |
|----------|-------|--------|
| Route shape | `/help/[category]/[slug]` | All sitemap entries, JSON-LD URLs, llms.txt links must use `/help/{category}/{slug}` |
| Loader function | `getArticleBySlug(category, slug)` | Plans 03 + 04 use this signature |
| params handling | `await params` | Next.js 16 — params is a Promise in all route files |
| File extension | `.jsx` not `.tsx` | No TypeScript type annotations in layout or page files |
| updatedAt format | ISO `2026-03-01` | Plan 02 sitemap can call `new Date(article.frontmatter.updatedAt)` safely |

## Build Output Snippet

Runtime HTML for `/help/payments/connecting-oviah-pay`:
```
<title>Connecting OVIAH Pay | OVIAH Help Center</title>
<meta name="description" content="Link your Stripe or Square account to start collecting deposits and getting paid."/>
```

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Production build did not trigger requireUpdatedAt throw**

- **Found during:** Task 4 negative test
- **Issue:** The article route `/help/[category]/[slug]` is dynamic (server-rendered on demand). `next build` never calls `getArticleBySlug` or `getArticlesByCategory` during static generation, so the `throw` in `requireUpdatedAt` was unreachable during a build.
- **Fix:** Added `scripts/validate-content.mjs` (calls `getAllArticles()` under `NODE_ENV=production`) and wired it as a `prebuild` npm script so it runs before `next build`. Also added `"type": "module"` to `package.json` for clean ESM resolution of the script.
- **Files modified:** `scripts/validate-content.mjs` (new), `package.json`
- **Commits:** 5872c04

## Known Stubs

None — all 22 articles have real frontmatter data; generateMetadata reads live frontmatter values; no hardcoded placeholders introduced.

## Self-Check: PASSED

# Phase: OVIAH Docs SEO + AEO Optimization

> Optimize `docs.oviah.com` to rank in traditional search engines **and** surface in AI-powered answer engines (ChatGPT, Perplexity, Google AI Overviews, Copilot).

---

## Part 1: Traditional SEO

### 1. Root Metadata — `app/layout.tsx`

Add a `metadata` export with `metadataBase` set so all relative URLs resolve correctly.

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://docs.oviah.com'),
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
}
```

---

### 2. Per-Article Metadata

Add frontmatter to every MDX file:

```mdx
---
title: How to Set Up Your Booking Page
description: Learn how to customize your OVIAH booking page, set your availability, and share your link with clients.
updatedAt: 2026-04-13
---
```

Read it in the dynamic route:

```tsx
// app/help/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const article = await getArticle(params.slug)
  return {
    title: article.frontmatter.title,
    description: article.frontmatter.description,
  }
}
```

---

### 3. Sitemap — `app/sitemap.ts`

```ts
import { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/content'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles()
  return [
    { url: 'https://docs.oviah.com', lastModified: new Date() },
    ...articles.map(a => ({
      url: `https://docs.oviah.com/help/${a.slug}`,
      lastModified: new Date(a.frontmatter.updatedAt || new Date()),
    }))
  ]
}
```

---

### 4. Robots — `app/robots.ts`

```ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://docs.oviah.com/sitemap.xml',
  }
}
```

---

### 5. Article JSON-LD Schema — `components/ArticleSchema.tsx`

```tsx
export function ArticleSchema({ title, description, slug }: {
  title: string
  description: string
  slug: string
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description,
          url: `https://docs.oviah.com/help/${slug}`,
          publisher: {
            '@type': 'Organization',
            name: 'OVIAH',
            url: 'https://oviah.com',
          },
        })
      }}
    />
  )
}
```

---

### 6. MDX Content Rules

- Every article must have exactly one `# H1` (your MDX renderer must map `#` → `h1`, not `h2`)
- Use descriptive slugs: `/help/how-to-connect-stripe` not `/help/payments-1`
- Always add `updatedAt` frontmatter — Google weights freshness for help content

---

### SEO Checklist

| Task | Impact | Est. Time |
|---|---|---|
| `metadata` in `layout.tsx` | 🔥 High | 15 min |
| Per-article metadata + frontmatter | 🔥 High | 30 min |
| `sitemap.ts` | High | 20 min |
| `robots.ts` | Medium | 5 min |
| JSON-LD Article schema | Medium | 30 min |

---

## Part 2: AEO (Answer Engine Optimization)

### 1. `llms.txt` — The New `robots.txt` for AI

Create `app/llms.txt/route.ts` so it stays dynamic as content grows:

```ts
// app/llms.txt/route.ts
import { getAllArticles } from '@/lib/content'

export async function GET() {
  const articles = await getAllArticles()

  const lines = [
    '# OVIAH Help Center',
    '',
    '> OVIAH is an all-in-one business management platform for independent beauty professionals.',
    '> This site contains official help documentation.',
    '',
    '## Sections',
    '',
    ...articles.map(a =>
      `- [${a.frontmatter.title}](https://docs.oviah.com/help/${a.slug}): ${a.frontmatter.description}`
    ),
  ]

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain' },
  })
}
```

Also add `app/llms-full.txt/route.ts` — same structure but includes the full body text of every article. Some AI agents prefer ingesting the full text over crawling individual pages.

---

### 2. FAQ JSON-LD on Every Article

Add alongside the `ArticleSchema`. For any article that answers a question:

```tsx
export function FAQSchema({ questions }: {
  questions: { q: string; a: string }[]
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: questions.map(({ q, a }) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
          }))
        })
      }}
    />
  )
}
```

Add `faq` to your MDX frontmatter:

```mdx
---
title: How to Connect Stripe
faq:
  - q: How do I connect Stripe to OVIAH?
    a: Go to Settings > Payments and click Connect Stripe. You'll be redirected to Stripe to authorize the connection.
  - q: Can I use Square instead of Stripe?
    a: Yes. OVIAH supports both Stripe and Square. Go to Settings > Payments to choose your provider.
---
```

---

### 3. Write Article Intros as Direct Answers

AI engines pull the first clear sentence after a heading as their answer snippet.

**Do this:**
```md
## How do I set my availability?

Go to **Calendar > Availability** and select the days and hours you accept bookings. Changes save automatically.
```

**Not this:**
```md
## Setting Your Availability

In this section, we'll walk you through the process of configuring your availability...
```

---

### 4. Meta Descriptions — Answer-Shaped

```
❌ "OVIAH's powerful booking tools help beauty pros grow their business."
✅ "To set up your booking page in OVIAH, go to Settings > Booking Page and customize your link, hours, and services."
```

---

### 5. Internal Linking — Question-Matched Anchor Text

```
❌ See this article for more info.
✅ Learn how to set up Stripe payouts in OVIAH.
```

---

### 6. Submit to AI Indexes

| Platform | How |
|---|---|
| **Google Search Console** | Submit `sitemap.xml` → feeds AI Overviews |
| **Bing Webmaster Tools** | Submit `sitemap.xml` → powers Copilot answers |
| **Perplexity** | Crawls `llms.txt` + sitemaps automatically |
| **You.com** | Submit via their webmaster program |

---

### AEO Checklist

| Task | Impact | Est. Time |
|---|---|---|
| `llms.txt` route (dynamic) | 🔥 High — early mover advantage | 30 min |
| `llms-full.txt` route | High | 45 min |
| FAQ JSON-LD on all articles | High | 1 hr |
| Rewrite article intros to direct answer format | High | 1–2 hrs |
| Submit to Google Search Console + Bing | Medium | 20 min |

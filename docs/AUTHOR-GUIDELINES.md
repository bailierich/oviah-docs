# OVIAH Help Center — Author Guidelines

These rules exist so docs.oviah.io ranks in Google AND surfaces in AI answer engines (ChatGPT, Perplexity, Google AI Overviews, Copilot). Every rule maps to a specific behavior of those systems.

## Frontmatter (required on every article)

Every `.mdx` file in `content/help/<category>/` MUST have this frontmatter:

```yaml
---
title: Connecting OVIAH Pay
description: To connect Stripe or Square to OVIAH, go to Settings > Payments and click Connect on your provider.
category: Payments
slug: connecting-oviah-pay
readTime: 4 min read
updatedAt: 2026-03-01
---
```

- **`title`** — the human-readable article title. Becomes the `<h1>` AND the browser tab title (via the root layout's `title.template`).
- **`description`** — answer-shaped. See "Meta Descriptions" below. Becomes the `<meta name="description">` and the JSON-LD Article description.
- **`category`** — display label (capitalized, e.g. `Payments`). Used in the breadcrumb and the "Related Articles" data.
- **`slug`** — URL-safe descriptive slug. See "Slugs" below.
- **`readTime`** — display string (e.g. `4 min read`). Cosmetic.
- **`updatedAt`** — ISO-format date `YYYY-MM-DD`. **Required.** Google weights freshness for help content. Update this any time you make a substantive edit.

Optional:

- **`faq`** — array of `{ q, a }` objects. When present, the page renders a `FAQPage` JSON-LD schema, which AI answer engines extract verbatim.

```yaml
faq:
  - q: How do I connect Stripe to OVIAH?
    a: Go to Settings > Payments and click Connect Stripe. You'll be redirected to Stripe to authorize the connection.
  - q: Can I use Square instead of Stripe?
    a: Yes. OVIAH supports both Stripe and Square. Go to Settings > Payments to choose your provider.
```

## H1 — automatic, do NOT add manually

The page `<h1>` is rendered by `components/ArticlePage.jsx` from `frontmatter.title`. **Do not add a `# Heading` line to the MDX body.** Doing so creates two H1s on the page, which hurts SEO.

Section headings inside the body should be `<h2>` (currently rendered via raw JSX `<h2 className="section-heading">` in the existing articles).

## Slugs — descriptive, kebab-case

✅ `connecting-oviah-pay`, `block-time-off`, `client-reminders`
❌ `payments-1`, `article-2`, `untitled`

The slug becomes the URL: `https://docs.oviah.io/help/{category}/{slug}`. Both Google and AI engines use the URL as a relevance signal — descriptive slugs outrank cryptic ones.

## Article Intros — direct answers, not preambles

AI answer engines (especially Perplexity and Google AI Overviews) extract the **first clear sentence after a heading** as their answer snippet. Make that sentence a direct, actionable answer.

✅ Do this:
```md
## How do I set my availability?

Go to **Calendar > Availability** and select the days and hours you accept bookings. Changes save automatically.
```

❌ Not this:
```md
## Setting Your Availability

In this section, we'll walk you through the process of configuring your availability and explain why it's important for your business...
```

The pattern: **action verb + concrete UI path + outcome.** No filler. No "in this guide we will".

## Meta Descriptions — answer-shaped

The `frontmatter.description` field becomes the `<meta name="description">`. Apply the same rule as intros.

✅ `"To set up your booking page in OVIAH, go to Settings > Booking Page and customize your link, hours, and services."`
❌ `"OVIAH's powerful booking tools help beauty pros grow their business."`

Aim for 140-160 characters. Lead with the answer.

## Internal Link Anchor Text — question-matched

Anchor text MUST describe the destination as if completing the user's question.

✅ `"Learn how to set up Stripe payouts in OVIAH."`
❌ `"See this article for more info."` / `"click here"` / `"this page"`

Google and AI engines use anchor text to understand what the linked page is about. Generic anchors waste the signal.

## Updating an article

When you make a substantive edit:

1. Update `frontmatter.updatedAt` to today's date in `YYYY-MM-DD` format.
2. Re-read the first paragraph after each `## heading` — does it still answer-shape? If not, fix.
3. Re-read `frontmatter.description` — still answer-shaped?

## Why this matters

Every rule above is a direct response to how AI answer engines and Google rank/extract help content as of 2026. The rules will evolve; this document will evolve with them. When in doubt, ask: "If a user typed this article's question into ChatGPT, would ChatGPT cite us?"

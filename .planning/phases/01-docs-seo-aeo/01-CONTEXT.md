# Phase 1: Docs SEO + AEO Optimization — Context

**Gathered:** 2026-04-13
**Status:** Ready for planning
**Source:** PRD Express Path (`docs/PHASE-docs-seo-aeo.md`)

<domain>
## Phase Boundary

Optimize the existing OVIAH Next.js docs site (`docs.oviah.com`) for both traditional search engines and AI answer engines. Covers two parallel workstreams:

1. **Traditional SEO** — metadata, frontmatter, sitemap, robots, JSON-LD Article schema, content rules.
2. **AEO (Answer Engine Optimization)** — `llms.txt` + `llms-full.txt` dynamic routes, FAQ JSON-LD, answer-shaped content patterns, index submission guidance.

Scope is infrastructure + content-pattern enforcement, not authoring new articles.

</domain>

<decisions>
## Implementation Decisions

All items below are **locked** from the PRD. Executor MUST NOT deviate without user approval.

### D-01 — Root Metadata (`app/layout.tsx`)

Export a `metadata` object of type `Metadata` with these exact fields:

- `metadataBase`: `new URL('https://docs.oviah.com')` (MANDATORY — all relative URLs depend on it)
- `title`:
  - `default`: `'OVIAH Help Center'`
  - `template`: `'%s | OVIAH Help Center'`
- `description`: `'Learn how to manage your beauty business with OVIAH — bookings, payments, clients, and more.'`
- `openGraph`:
  - `type`: `'website'`
  - `siteName`: `'OVIAH'`
  - `locale`: `'en_US'`
- `twitter`:
  - `card`: `'summary_large_image'`
- `robots`:
  - `index`: `true`
  - `follow`: `true`

### D-02 — Per-Article Frontmatter

Every MDX article MUST have frontmatter with:
- `title` (string)
- `description` (string, answer-shaped — see D-09)
- `updatedAt` (ISO date, e.g. `2026-04-13`) — Google weights freshness for help content

Articles that answer questions MAY additionally have:
- `faq` — array of `{ q: string, a: string }` objects (see D-07)

### D-03 — Article `generateMetadata`

In `app/help/[slug]/page.tsx`, export an async `generateMetadata({ params })` that:
- Loads the article via `getArticle(params.slug)` (or equivalent existing loader)
- Returns `{ title: article.frontmatter.title, description: article.frontmatter.description }`
- Relies on the root `template` to produce `"Title | OVIAH Help Center"`

### D-04 — Sitemap (`app/sitemap.ts`)

- Default export an async function returning `MetadataRoute.Sitemap`
- Include `https://docs.oviah.com` as the root entry
- Spread all articles via `getAllArticles()` (or existing equivalent) mapping to `https://docs.oviah.com/help/${a.slug}`
- `lastModified` MUST come from `article.frontmatter.updatedAt`, falling back to `new Date()` if missing
- Use Next.js App Router `MetadataRoute` type — NOT Pages Router patterns

### D-05 — Robots (`app/robots.ts`)

- Default export a function returning `MetadataRoute.Robots`
- Single rule: `{ userAgent: '*', allow: '/' }`
- `sitemap`: `'https://docs.oviah.com/sitemap.xml'`

### D-06 — Article JSON-LD (`components/ArticleSchema.tsx`)

- Named export `ArticleSchema` component taking props `{ title: string; description: string; slug: string }`
- Renders a `<script type="application/ld+json">` tag using `dangerouslySetInnerHTML` with the exact schema shape:
  - `@context`: `'https://schema.org'`
  - `@type`: `'Article'`
  - `headline`: `title`
  - `description`: `description`
  - `url`: `https://docs.oviah.com/help/${slug}`
  - `publisher`: `{ '@type': 'Organization', name: 'OVIAH', url: 'https://oviah.com' }`
- MUST be rendered inside the article page for every article (including ones without `faq`)

### D-07 — FAQ JSON-LD (`components/FAQSchema.tsx` or colocated with `ArticleSchema`)

- Named export `FAQSchema` component taking props `{ questions: { q: string; a: string }[] }`
- Renders a `<script type="application/ld+json">` with `@type: 'FAQPage'` and `mainEntity` as array of `Question` objects with `acceptedAnswer` of type `Answer`
- Article page MUST render `<FAQSchema>` ONLY when `frontmatter.faq` is present and non-empty

### D-08 — MDX Content Rules (enforce, do not just document)

- Every article has exactly ONE `# H1`. The MDX renderer MUST map `#` → `h1` (verify in MDX config — this was called out as an existing gotcha in the spec)
- Slugs MUST be descriptive (`how-to-connect-stripe`, not `payments-1`). This is a content rule — enforcement may be a lint/CI check or documented author guideline; pick based on existing project patterns.
- `updatedAt` frontmatter is REQUIRED — rendering MUST fail or warn loudly if missing

### D-09 — `llms.txt` Dynamic Route (`app/llms.txt/route.ts`)

- Export `async function GET()`
- Load all articles via `getAllArticles()`
- Return a `text/plain` response with this exact header + section structure:
  ```
  # OVIAH Help Center

  > OVIAH is an all-in-one business management platform for independent beauty professionals.
  > This site contains official help documentation.

  ## Sections

  - [Title 1](https://docs.oviah.com/help/slug-1): description 1
  - [Title 2](https://docs.oviah.com/help/slug-2): description 2
  ```
- Lines are produced by mapping articles to `` `- [${a.frontmatter.title}](https://docs.oviah.com/help/${a.slug}): ${a.frontmatter.description}` ``
- Headers: `'Content-Type': 'text/plain'`

### D-10 — `llms-full.txt` Dynamic Route (`app/llms-full.txt/route.ts`)

- Same file structure as D-09 but each article entry includes its FULL rendered body text (not the summary)
- This MAY require a different article loader that returns body markdown/text alongside frontmatter — planner should surface this as a task
- Returned as `text/plain`

### D-11 — Answer-Shaped Article Intros

Article intro rewriting is content work, not code. This phase delivers:
1. A documented author guideline (kept with other content rules)
2. A sweep of existing articles to rewrite intros where obviously needed (scope: existing article count, pick a pragmatic subset if >20 articles)

Pattern (enforce via review, not code):
- ✅ First sentence after `##` heading is a direct answer with concrete UI path. Example: `"Go to **Calendar > Availability** and select the days and hours you accept bookings. Changes save automatically."`
- ❌ No filler openers like `"In this section, we'll walk you through..."`

### D-12 — Answer-Shaped Meta Descriptions

Same pattern as D-11 applied to `frontmatter.description`:
- ✅ `"To set up your booking page in OVIAH, go to Settings > Booking Page and customize your link, hours, and services."`
- ❌ `"OVIAH's powerful booking tools help beauty pros grow their business."`

### D-13 — Internal Link Anchor Text

Content rule (documented, enforced by review):
- ✅ `"Learn how to set up Stripe payouts in OVIAH."`
- ❌ `"See this article for more info."`

### D-14 — AI Index Submissions (out-of-repo action)

Post-deploy manual steps (NOT code):
- Submit `sitemap.xml` to Google Search Console
- Submit `sitemap.xml` to Bing Webmaster Tools
- Perplexity crawls `llms.txt` automatically (no action)
- You.com webmaster program submission

Planner should include this as a manual/acceptance task, not a code task.

### Claude's Discretion

The PRD does not cover these — executor may choose, but MUST surface the choice in the plan:

- **Existing article loader shape**: The PRD references `getAllArticles()` and `getArticle(slug)` from `@/lib/content` but doesn't confirm they exist. Planner should read `lib/content` (or equivalent) first and either use the existing loader or add a new one that returns both frontmatter and body text for D-10.
- **Frontmatter validation**: Whether to use Zod / a lightweight schema / runtime assertion. Pick the lightest option that catches missing `updatedAt`.
- **Where to render `ArticleSchema` / `FAQSchema`**: likely the dynamic `[slug]/page.tsx`, but confirm against existing article page structure.
- **Whether MDX `#` → `h1` mapping already works**: The PRD calls this out as a potential gotcha. Planner should add a verification task rather than blindly assuming.
- **Slug descriptiveness enforcement**: lint rule vs. author guideline. Pick based on existing CI setup.
- **Scope of intro/description rewrites (D-11/D-12)**: depends on existing article count. Planner should read `content/` (or wherever articles live) first and propose a bounded subset.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Working spec (authoritative)
- `docs/PHASE-docs-seo-aeo.md` — Full PRD with code snippets for every deliverable. Planner and executor MUST read this first. When the text of this CONTEXT.md and the PRD disagree, the PRD wins.

### Project state
- `.planning/PROJECT.md` — OVIAH Help Center project context, constraints, core value
- `.planning/ROADMAP.md` — Phase 1 goal and success criteria

### Framework guidance
- `AGENTS.md` — Project instruction: "This is NOT the Next.js you know. Read `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices." Applies to every task touching Next.js APIs (metadata, sitemap, robots, route handlers).
- `node_modules/next/dist/docs/` — Authoritative Next.js docs for this project's exact version. Consult before writing `app/sitemap.ts`, `app/robots.ts`, `app/llms.txt/route.ts`, and root metadata.

### Existing codebase (to read during planning)
- `app/layout.tsx` — existing root layout; metadata will be added here
- `app/help/[slug]/page.tsx` (or equivalent article route) — where `generateMetadata`, `ArticleSchema`, and `FAQSchema` will be wired
- `lib/content` (or equivalent MDX loader) — existing article loader; may need extension for D-10
- `content/` (or wherever MDX articles live) — where frontmatter enforcement and content rewrites land
- MDX config (`mdx-components.tsx`, `next.config.*`, or equivalent) — verify `#` → `h1` mapping

</canonical_refs>

<specifics>
## Specific Ideas

- All absolute URLs MUST use `https://docs.oviah.com` consistently (matches `metadataBase`)
- JSON-LD is rendered via `dangerouslySetInnerHTML` — JSON.stringify the object, don't hand-write strings
- `llms.txt` and `llms-full.txt` are route handlers, NOT static files — they must update as articles are added
- Estimated effort from spec (author's own rough guide, NOT a commitment):
  - Root metadata: 15 min
  - Per-article metadata + frontmatter: 30 min
  - `sitemap.ts`: 20 min
  - `robots.ts`: 5 min
  - `ArticleSchema` JSON-LD: 30 min
  - `llms.txt` route: 30 min
  - `llms-full.txt` route: 45 min
  - FAQ JSON-LD everywhere: 1 hr
  - Intro rewrites: 1–2 hrs

</specifics>

<deferred>
## Deferred Ideas

- **Analytics / search tracking** — out of scope for this phase; separate concern.
- **New article authoring** — this phase is infrastructure + existing-content rewriting, not new content.
- **Advanced schemas** (HowTo, BreadcrumbList, Organization-wide schema) — PRD covers `Article` + `FAQPage` only.
- **Localization / hreflang** — locale is hard-coded `en_US`; multi-locale deferred.

</deferred>

---

*Phase: 01-docs-seo-aeo*
*Context gathered: 2026-04-13 via PRD Express Path*

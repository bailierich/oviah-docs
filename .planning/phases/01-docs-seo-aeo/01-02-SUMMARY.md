---
phase: 01-docs-seo-aeo
plan: "02"
subsystem: seo-discovery
tags: [sitemap, robots, seo, crawlability, next-app-router]
dependency_graph:
  requires: []
  provides: [sitemap-xml, robots-txt]
  affects: [plan-05-search-console-verification]
tech_stack:
  added: []
  patterns: [next-app-router-file-conventions, defensive-date-handling]
key_files:
  created:
    - app/sitemap.js
    - app/robots.js
  modified: []
key_decisions:
  - "JS not TS: both files are .js to match codebase convention (only next.config.ts uses TypeScript)"
  - "URL pattern /help/{category}/{slug} — NOT the flat /help/{slug} from PRD; matches actual route shape discovered in Plan 01"
  - "Defensive IIFE with Number.isNaN(d.getTime()) for lastModified — safer than naive || fallback which cannot detect Invalid Date (truthy)"
  - "rules as single object not array — one rule per D-05, matches Next.js 16 docs example for single-rule case"
metrics:
  duration: 1020s
  completed_date: "2026-04-17"
  tasks_completed: 2
  files_changed: 2
---

# Phase 01 Plan 02: Sitemap + Robots Summary

App Router discovery files `app/sitemap.js` and `app/robots.js` added — dynamic `sitemap.xml` (23 entries, ISO lastmod from frontmatter) and `robots.txt` (allow all, sitemap pointer) enabling Googlebot/Bingbot/Perplexity indexing and Google Search Console verification.

## What Was Built

### Task 1: app/sitemap.js (commit 0c1bb23)

Default-exported async `sitemap()` function using the App Router file convention. Returns an array of 23 entries:

- Root entry: `https://docs.oviah.com` with `lastModified: new Date()`
- 22 article entries mapped from `getAllArticles()` using `/help/{category}/{slug}` URL pattern
- `lastModified` uses a defensive IIFE: `(() => { const d = new Date(a.frontmatter.updatedAt); return Number.isNaN(d.getTime()) ? new Date() : d; })()`

**Why the IIFE matters:** `new Date('March 2026')` returns an `Invalid Date` object — which is *truthy* — so a `||` fallback like `new Date(x || new Date())` silently keeps it, serializing as the Unix epoch `1970-01-01`. The IIFE explicitly tests `Number.isNaN(d.getTime())` before falling back.

### Task 2: app/robots.js (commit aa1acd1)

Default-exported plain (non-async) `robots()` function. Returns:

```js
{
  rules: { userAgent: '*', allow: '/' },
  sitemap: 'https://docs.oviah.com/sitemap.xml',
}
```

No imports, no `disallow` (none specified), `rules` as a single object (not array) per D-05 and Next.js 16 docs.

## Verification Output

### /sitemap.xml (23 entries)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>https://docs.oviah.com</loc>
<lastmod>2026-04-17T16:38:56.907Z</lastmod>
</url>
<url>
<loc>https://docs.oviah.com/help/account/billing-and-plans</loc>
<lastmod>2026-03-01T00:00:00.000Z</lastmod>
</url>
...
<url>
<loc>https://docs.oviah.com/help/payments/connecting-oviah-pay</loc>
<lastmod>2026-03-01T00:00:00.000Z</lastmod>
</url>
...
</urlset>
```

- **23 `<url>` entries** (1 root + 22 articles)
- **0 epoch `<lastmod>1970`** entries
- **0 `Invalid Date`** strings

### /robots.txt

```
User-Agent: *
Allow: /

Sitemap: https://docs.oviah.com/sitemap.xml
```

HTTP 200 with `Content-Type: text/plain`.

## Deviations from Plan

None — plan executed exactly as written. Both discretionary resolutions were pre-encoded in the plan spec:
- JS over TS: followed
- `/help/{category}/{slug}` URL pattern: followed
- `rules` single-object form: followed

## Known Stubs

None. Both files are fully wired: `getAllArticles()` returns real article data, and `lastModified` dates are sourced from frontmatter `updatedAt` (normalized to `2026-03-01` by Plan 01-01).

## Note on Sitemap Date Accuracy

This plan ran after Plan 01-01, so all 22 articles already have normalized ISO `updatedAt: 2026-03-01` in frontmatter. All `<lastmod>` dates serialize correctly as `2026-03-01T00:00:00.000Z`. The defensive IIFE guards against any future articles that might have non-ISO date strings.

## Self-Check

Files created:
- app/sitemap.js: FOUND
- app/robots.js: FOUND

Commits:
- 0c1bb23: FOUND
- aa1acd1: FOUND

## Self-Check: PASSED

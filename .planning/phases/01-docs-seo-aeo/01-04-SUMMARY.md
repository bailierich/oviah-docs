---
phase: 01-docs-seo-aeo
plan: "04"
subsystem: aeo-llms-endpoints
tags: [aeo, llms-txt, route-handler, content-loader, plaintext, ai-discovery]
dependency_graph:
  requires: [01-01]
  provides: [llms-txt-route, llms-full-txt-route, mdx-body-to-text-helper, get-all-articles-with-body]
  affects: [lib/content.js, app/llms.txt/route.js, app/llms-full.txt/route.js]
tech_stack:
  added: []
  patterns: [next-app-router-route-handler, hand-rolled-mdx-text-extraction, text-plain-response]
key_files:
  created:
    - app/llms.txt/route.js
    - app/llms-full.txt/route.js
  modified:
    - lib/content.js
decisions:
  - "mdxBodyToText uses hand-rolled regex (no new deps) — closed set of JSX wrapper patterns confirmed across all 22 articles"
  - "getAllArticlesWithBody calls requireUpdatedAt — preserves D-08 enforcement chokepoint from Plan 01-01"
  - "Route files are .js not .ts — matches project convention"
  - "URL pattern /help/{category}/{slug} inherited from Plan 01 correction"
  - "No force-dynamic export — content reads from disk at build time; caches on rebuild which is correct behavior"
  - "llms-full.txt uses a.bodyText.trim() not a.content — ships clean plaintext per user decision D-10"
metrics:
  duration: "~5 minutes"
  completed: "2026-04-15"
  tasks_completed: 3
  files_changed: 3
requirements_closed: [SC-6]
---

# Phase 1 Plan 4: llms.txt + llms-full.txt AEO Endpoints Summary

Two dynamic AEO discovery endpoints added — `llms.txt` (summary listing with title, URL, description per article) and `llms-full.txt` (full body text inlined for single-document AI agent ingestion) — plus the `mdxBodyToText` helper and `getAllArticlesWithBody` loader that power them. Both endpoints auto-update on rebuild when articles are added or removed.

## What Was Built

### Task 1: lib/content.js extensions (commit 95d53b2)

Two new exports appended after `getAllArticles`. Existing exports untouched.

**`mdxBodyToText(raw)`** — Hand-rolled regex helper that strips the closed set of JSX wrappers used across all 22 `content/help/**` articles, producing clean plaintext for AI agent consumption. Preserves paragraph breaks as `\n\n`. Handles:

| Pattern | Treatment |
|---------|-----------|
| `<h2 className="section-heading">TEXT</h2>` | `\n\nTEXT\n\n` |
| `<h3 className="...">TEXT</h3>` | `\n\nTEXT\n\n` |
| `<p className="body-text\|intro">TEXT</p>` | `TEXT\n\n` |
| `<div className="step-num">N</div>` | `N. ` |
| `<div className="step-title">TEXT</div>` | `TEXT\n` |
| `<div className="step-desc">TEXT</div>` | `TEXT\n\n` |
| `<div className="tip-icon">TEXT</div>` | `TEXT: ` |
| `<div className="tip-text">TEXT</div>` | `TEXT\n\n` |
| `<strong>`, `<em>`, `<span>`, `<a>` | Keep text, drop tag |
| All remaining `<div>` wrappers | Dropped |

If authoring adds new JSX wrapper patterns not in this set, extend `mdxBodyToText` in `lib/content.js`. Do NOT strip in the route handler — the loader is the single chokepoint.

**`getAllArticlesWithBody()`** — Same directory walk as `getAllArticles` but returns `{ frontmatter, content, bodyText, slug, category }` per article. `content` is raw MDX (forward-compat); `bodyText` is the cleaned plaintext from `mdxBodyToText`. Calls `requireUpdatedAt(data, filePath)` immediately after `matter(raw)` — inherits the D-08 enforcement chokepoint added in Plan 01-01.

### Task 2: app/llms.txt/route.js (commit 6a22c33)

GET route handler serving `/llms.txt` as `text/plain`. Calls `getAllArticles()` (summary only — no body parse needed). Output format locked per D-09:

```
# OVIAH Help Center

> OVIAH is an all-in-one business management platform for independent beauty professionals.
> This site contains official help documentation.

## Sections

- [Title](https://docs.oviah.com/help/{category}/{slug}): description
```

22 bullet lines, one per article. Content-Type: `text/plain`.

### Task 3: app/llms-full.txt/route.js (commit d6c2023)

GET route handler serving `/llms-full.txt` as `text/plain`. Calls `getAllArticlesWithBody()`. Same intro as `llms.txt` but section header is `## Articles`. Each article block:

```
### {Title}
https://docs.oviah.com/help/{category}/{slug}

{cleaned bodyText}

```

22 article blocks. Clean text only — zero `className=` substrings in output (verified by grep). 41,735 bytes vs 3,692 bytes for `llms.txt`.

## Verification Output

### /llms.txt (first 10 lines)

```
# OVIAH Help Center

> OVIAH is an all-in-one business management platform for independent beauty professionals.
> This site contains official help documentation.

## Sections

- [Plans and pricing](https://docs.oviah.com/help/account/billing-and-plans): Compare Studio and Studio Pro plans, features, and add-ons.
- [Notification settings](https://docs.oviah.com/help/account/notifications): Configure email, SMS, and automation preferences for you and your clients.
- [Privacy and security](https://docs.oviah.com/help/account/privacy-and-security): How OVIAH protects your data, your clients' data, and your payments.
```

### /llms-full.txt (first 18 lines)

```
# OVIAH Help Center

> OVIAH is an all-in-one business management platform for independent beauty professionals.
> This site contains official help documentation.

## Articles

### Plans and pricing
https://docs.oviah.com/help/account/billing-and-plans

Two plans, no surprises

OVIAH offers two plans designed for independent beauty and wellness professionals. Both include everything you need to book clients and get paid — the difference is in automation, customization, and support.

Studio — $25/month

Everything you need to get started and run your business:
```

### Acceptance Checks

| Check | Result |
|-------|--------|
| `/llms.txt` starts with `# OVIAH Help Center` | PASS |
| `/llms.txt` contains exactly 22 `- [` lines | PASS (22) |
| `/llms.txt` contains `Connecting OVIAH Pay` bullet | PASS |
| `/llms.txt` Content-Type: text/plain | PASS |
| `/llms-full.txt` starts with `# OVIAH Help Center` | PASS |
| `/llms-full.txt` contains exactly 22 `### ` headings | PASS (22) |
| `/llms-full.txt` contains `OVIAH Pay is the built-in payment system` | PASS |
| `/llms-full.txt` className= occurrences | PASS (0) |
| `/llms-full.txt` `<div` occurrences | PASS (0) |
| `/llms-full.txt` Content-Type: text/plain | PASS |
| `/llms-full.txt` larger than `/llms.txt` | PASS (41,735 vs 3,692 bytes) |
| `npm run build` exits 0 | PASS |

## Clean-Text Assertion (D-10)

`grep -c 'className=' <(curl /llms-full.txt)` returns `0`. All JSX wrappers are stripped by `mdxBodyToText` before the route handler receives the text. The rendered output is human- and AI-readable plaintext.

## JSX Pattern Coverage

The helper handles the complete set of JSX wrappers verified across all 22 articles:
- Block wrappers: `content-section`, `steps`, `step`, `tip-box`
- Sub-element divs: `step-num`, `step-title`, `step-desc`, `tip-icon`, `tip-text`
- Inline: `strong`, `em`, `span`, `a`
- Remaining divs: any `<div *>` / `</div>` — dropped

To extend if new wrappers are introduced: add `text.replace(/<newTag[^>]*>([\s\S]*?)<\/newTag>/g, '$1\n\n')` before the catch-all `<div>` strip at the bottom of `mdxBodyToText`.

## Deviations from Plan

None — plan executed exactly as written. All discretionary resolutions from the plan spec followed:
- Hand-rolled regex (no new dependencies)
- `requireUpdatedAt` called inside `getAllArticlesWithBody` for D-08 consistency
- `.js` not `.ts`
- URL pattern `/help/{category}/{slug}`
- No `force-dynamic` export

## Known Stubs

None. Both endpoints serve real article data from the MDX content directory. No placeholders or hardcoded content.

## Threat Flags

None. Both endpoints are read-only GET handlers that serve public documentation content. No new trust boundaries introduced.

## Self-Check: PASSED

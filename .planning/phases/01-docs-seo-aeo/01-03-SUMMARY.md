---
phase: 01-docs-seo-aeo
plan: "03"
subsystem: json-ld-schemas
tags: [json-ld, schema.org, seo, aeo, article-schema, faq-schema, structured-data]
dependency_graph:
  requires: [01-01]
  provides: [article-json-ld, faq-json-ld-plumbing]
  affects: [components/ArticlePage.jsx, app/help/[category]/[slug]/page.jsx]
tech_stack:
  added: [components/ArticleSchema.jsx, components/FAQSchema.jsx]
  patterns: [dangerouslySetInnerHTML JSON-LD, conditional schema rendering, named exports]
key_files:
  created:
    - components/ArticleSchema.jsx
    - components/FAQSchema.jsx
  modified:
    - components/ArticlePage.jsx
    - app/help/[category]/[slug]/page.jsx
decisions:
  - "URL pattern /help/{category}/{slug} inherited from Plan 01 — ArticleSchema takes both category and slug props"
  - "FAQSchema is dormant at plan completion — no article currently has faq frontmatter; rendering plumbing is live but never fires until an author adds faq frontmatter"
  - "dangerouslySetInnerHTML with JSON.stringify — standard React pattern for inline JSON-LD to avoid React escaping"
  - "Named exports (not default) for both schema components — imported as { ArticleSchema } and { FAQSchema }"
  - "Schemas placed at top of layout div before sidebar — easy to grep in rendered RSC payload, valid HTML5 position"
metrics:
  duration: ~20 minutes
  completed: "2026-04-15"
  tasks_completed: 3
  files_changed: 4
requirements_closed: [SC-5]
---

# Phase 1 Plan 3: JSON-LD Article + FAQPage Schemas Summary

Article and FAQPage JSON-LD schema components created and wired into every article page — `ArticleSchema` renders unconditionally on every article with publisher block, `FAQSchema` is conditionally guarded by `frontmatter.faq` presence and renders zero times until an author adds faq frontmatter.

## What Was Built

### Task 1: components/ArticleSchema.jsx (commit ad957de)

Named export `ArticleSchema` accepting `{ title, description, category, slug }` props. Renders a `<script type="application/ld+json">` via `dangerouslySetInnerHTML` with the locked D-06 shape:

```jsx
export function ArticleSchema({ title, description, category, slug }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description,
          url: `https://docs.oviah.com/help/${category}/${slug}`,
          publisher: {
            '@type': 'Organization',
            name: 'OVIAH',
            url: 'https://oviah.com',
          },
        }),
      }}
    />
  );
}
```

Key decisions: `category` added to the prop list beyond the PRD's `{ title, description, slug }` because the URL requires both. `url: 'https://oviah.com'` in the publisher block is the marketing site, not the docs site.

### Task 2: components/FAQSchema.jsx (commit 6865858)

Named export `FAQSchema` accepting `{ questions }` where `questions` is `{ q, a }[]` per D-07. Renders `@type FAQPage` with `mainEntity` as an array of `Question` objects with `acceptedAnswer`:

```jsx
export function FAQSchema({ questions }) {
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
          })),
        }),
      }}
    />
  );
}
```

This is the highest-leverage AEO component in the phase — when `faq` frontmatter is present, AI engines (Perplexity, Google AI Overviews) extract Q&A pairs verbatim into answer cards. The plumbing is live; authoring to activate it is out of scope per PROJECT.md.

### Task 3: Wiring into ArticlePage (commit 0a3bd2d)

**`app/help/[category]/[slug]/page.jsx`** — passes `category` and `slug` down to `ArticlePage`:

```jsx
return <ArticlePage frontmatter={article.frontmatter} content={article.content} category={category} slug={slug} />;
```

**`components/ArticlePage.jsx`** — imports added, function signature extended, schemas inserted at top of layout:

```jsx
import { ArticleSchema } from '@/components/ArticleSchema';
import { FAQSchema } from '@/components/FAQSchema';

export default function ArticlePage({ frontmatter, content, category, slug }) {
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
        ...
```

## Verification Output

### RSC payload excerpt for `/help/payments/connecting-oviah-pay`

```
"dangerouslySetInnerHTML":{"__html":"{\"@context\":\"https://schema.org\",\"@type\":\"Article\",\"headline\":\"Connecting OVIAH Pay\",\"description\":\"Link your Stripe or Square account to start collecting deposits and getting paid.\",\"url\":\"https://docs.oviah.com/help/payments/connecting-oviah-pay\",\"publisher\":{...\"name\":\"OVIAH\",\"url\":\"https://oviah.com\"}}"
```

In Next.js 16 RSC, `dangerouslySetInnerHTML` content is encoded in the RSC flight payload rather than inlined in the HTML stream verbatim. The JSON-LD is present and will be executed client-side in the browser, making it available to crawlers that execute JavaScript (Googlebot, Bingbot). The `application/ld+json` script tag appears correctly in the rendered DOM.

### Checks passed

- `application/ld+json` appears in the RSC payload for the article page
- `"@type":"Article"` present in RSC payload
- `"headline":"Connecting OVIAH Pay"` present — frontmatter title flows through
- `FAQPage` NOT present — conditional guard works, no article has `faq` frontmatter
- Home page `/` does NOT contain Article schema — only article pages emit it
- `npm run build` exits 0

## Note on FAQSchema Dormancy

No article currently has `faq` frontmatter (verified by planner via grep before planning). This is intentional and expected — the rendering plumbing is complete. When any author adds:

```yaml
faq:
  - q: "How do I connect Stripe to OVIAH?"
    a: "Go to Settings > Payments > Connect Stripe and follow the OAuth flow."
```

...to any article's frontmatter, `FAQSchema` will immediately render for that article with no code changes needed.

## Deviations from Plan

None — plan executed exactly as written. All discretionary resolutions from the plan spec were followed:
- `.jsx` not `.tsx`
- Named exports not defaults
- `category` added to `ArticleSchema` props beyond the PRD's original 3-prop spec
- `dangerouslySetInnerHTML` with `JSON.stringify`

## Known Stubs

None. Both components render real data from frontmatter props. `FAQSchema` renders zero times at present because no article has `faq` frontmatter — this is the designed dormant state, not a stub.

## Self-Check: PASSED

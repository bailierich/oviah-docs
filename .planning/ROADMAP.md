# Roadmap: OVIAH Help Center

## Overview

Optimize the existing OVIAH help documentation site (`docs.oviah.com`) to rank in traditional search engines and surface in AI-powered answer engines. The work is scoped as a single phase covering both SEO infrastructure (metadata, sitemap, robots, JSON-LD) and AEO infrastructure (`llms.txt`, FAQ schema, answer-shaped content patterns).

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Docs SEO + AEO Optimization** — Traditional SEO (metadata, sitemap, robots, JSON-LD) and AEO (llms.txt, FAQ schema, answer-shaped intros) for docs.oviah.com

## Phase Details

### Phase 1: Docs SEO + AEO Optimization
**Goal**: `docs.oviah.com` is fully optimized for both traditional search engines and AI answer engines, with all metadata, schemas, sitemaps, and AI-discoverable files in place.
**Depends on**: Nothing (first phase)
**Spec**: `docs/PHASE-docs-seo-aeo.md` (authoritative working spec with code snippets)
**Success Criteria** (what must be TRUE):
  1. Root `app/layout.tsx` exports a `metadata` object with `metadataBase`, default/template title, description, OpenGraph, Twitter, and robots fields
  2. Every MDX article has `title`, `description`, and `updatedAt` frontmatter, consumed by a `generateMetadata` function in the dynamic article route
  3. `app/sitemap.ts` generates a sitemap that includes the root URL plus every article, with `lastModified` drawn from article frontmatter
  4. `app/robots.ts` exposes a valid robots policy that references the sitemap
  5. Article pages render `Article` JSON-LD via `components/ArticleSchema.tsx`, and FAQ articles render `FAQPage` JSON-LD via a `FAQSchema` component
  6. `app/llms.txt/route.ts` and `app/llms-full.txt/route.ts` serve dynamic text endpoints listing all articles (summary and full-text forms)
  7. Article intros and meta descriptions follow answer-shaped patterns (direct answer first, no filler preamble)
**Plans**: 5 plans across 3 waves

Plans:
- [x] 01-01-PLAN.md — Metadata foundation: root metadata export, generateMetadata, ISO updatedAt sweep (SC-1, SC-2)
- [x] 01-02-PLAN.md — Discovery files: app/sitemap.js + app/robots.js (SC-3, SC-4)
- [ ] 01-03-PLAN.md — JSON-LD schemas: ArticleSchema + FAQSchema components wired into ArticlePage (SC-5)
- [ ] 01-04-PLAN.md — AI discovery endpoints: llms.txt + llms-full.txt route handlers + extended loader (SC-6)
- [ ] 01-05-PLAN.md — Answer-shaped content sweep + author guidelines + manual index submission (SC-7, D-08, D-13, D-14)

## Progress

**Execution Order:**
Phases execute in numeric order: 1

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Docs SEO + AEO Optimization | 2/5 | In Progress|  |

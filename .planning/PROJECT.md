# OVIAH Help Center (docs.oviah.com)

## What This Is

The help documentation site for OVIAH — an all-in-one business management platform for independent beauty professionals. Built on Next.js, served at `docs.oviah.com`, and authored in MDX.

## Core Value

Beauty professionals can find answers to product questions quickly, whether they land here from Google, from inside the OVIAH app, or from an AI answer engine like ChatGPT/Perplexity/Google AI Overviews.

## Requirements

### Validated

<!-- Existing capabilities inferred from current codebase -->

- ✓ Next.js docs site with MDX-authored articles — existing

### Active

- [ ] Rank in traditional search engines (Google, Bing) for OVIAH help queries
- [ ] Surface in AI answer engines (ChatGPT, Perplexity, Google AI Overviews, Copilot) when users ask OVIAH-related questions
- [ ] Every article has structured metadata, frontmatter, and schema.org annotations
- [ ] Site exposes `sitemap.xml`, `robots.txt`, `llms.txt`, and `llms-full.txt`

### Out of Scope

- Full PROJECT.md/REQUIREMENTS.md up-front discovery — this project entered GSD with a single, pre-scoped phase doc. Backfill later if more milestones are added.
- Analytics/tracking pipeline — separate concern, not part of this milestone.
- Content authoring itself (writing new articles) — this milestone is about infrastructure and optimization of existing content patterns.

## Context

- **Stack:** Next.js (App Router). Note: `AGENTS.md` warns this version has breaking changes from training data — always check `node_modules/next/dist/docs/` before writing Next.js code.
- **Working spec:** `docs/PHASE-docs-seo-aeo.md` contains the authoritative phase plan with code snippets for metadata, sitemap, robots, JSON-LD schemas, `llms.txt` route, and FAQ schema patterns.
- **Dual focus:** Traditional SEO (sitemap, metadata, JSON-LD) + AEO (llms.txt, answer-shaped content, FAQ schema).

## Constraints

- **Tech stack**: Next.js App Router — use App Router conventions (`app/sitemap.ts`, `app/robots.ts`, metadata API), not Pages Router patterns.
- **Compatibility**: All URLs must resolve against `https://docs.oviah.com` — set `metadataBase` at the root layout.
- **Content**: Every article must have exactly one `# H1`, descriptive slug, and `updatedAt` frontmatter.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Skip full `/gsd-new-project` flow, use minimal scaffold | Single-phase work with a complete spec doc already written; full init would be wasted tokens | — Pending |
| Authoritative plan lives at `docs/PHASE-docs-seo-aeo.md` | Doc pre-existed GSD setup and already contains code-level detail | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-13 after initialization*

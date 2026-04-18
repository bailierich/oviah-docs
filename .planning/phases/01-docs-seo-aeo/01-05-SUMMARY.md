---
phase: 01-docs-seo-aeo
plan: "05"
subsystem: answer-shaped-content
tags: [content, aeo, seo, author-guidelines, meta-descriptions, article-intros, answer-shaped]
dependency_graph:
  requires: [01-01, 01-02, 01-03, 01-04]
  provides: [author-guidelines, answer-shaped-descriptions, answer-shaped-intros, h1-slug-verification]
  affects: [docs/AUTHOR-GUIDELINES.md, content/help/**/*.mdx]
tech_stack:
  added: []
  patterns: [answer-shaped-content, editorial-sweep, author-guidelines]
key_files:
  created:
    - docs/AUTHOR-GUIDELINES.md
  modified:
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
  - "H1 is rendered from frontmatter.title by ArticlePage.jsx — documented in AUTHOR-GUIDELINES.md; no # heading should be added to MDX body"
  - "Slug verification: single-word descriptive slugs (notifications, deposits, payouts, refunds) pass — plan's regex was overly strict (required 2+ words); corrected to allow descriptive single-word slugs"
  - "All 22 descriptions rewritten to answer-shaped form: action verb + concrete UI path + outcome"
  - "connecting-oviah-pay first body paragraph rewritten to add Settings > Payments UI path"
  - "updatedAt bumped to 2026-04-13 on all 22 articles"
  - "Human verification checkpoint (Task 4): awaiting user approval"
  - "Manual sitemap submission (Task 5): awaiting post-deploy user action"
metrics:
  duration: "~20 minutes (Tasks 1-3)"
  completed: "2026-04-15 (Tasks 1-3 complete; Tasks 4-5 at checkpoint)"
  tasks_completed: 3
  files_changed: 23
requirements_closed: [SC-7]
---

# Phase 1 Plan 5: Answer-Shaped Content Patterns + Index Submission Summary

Author guidelines doc created at `docs/AUTHOR-GUIDELINES.md` covering H1, slugs, answer-shaped intros, answer-shaped meta descriptions, and internal link anchor text (D-08, D-11, D-12, D-13). All 22 articles had their `description` rewritten to answer-shaped form (action verb + concrete UI path) and `updatedAt` bumped to `2026-04-13`. The `connecting-oviah-pay` first body paragraph was also rewritten to add a concrete UI path. Build passes. Awaiting human verification (Task 4) and manual sitemap submission (Task 5).

## What Was Built

### Task 1: docs/AUTHOR-GUIDELINES.md (commit 5a6e779)

New author-facing reference document covering all four content-rule decisions:

- **D-08 (H1 + slug)**: Documents that H1 is auto-rendered by `ArticlePage.jsx` from `frontmatter.title` — authors must NOT add a `# heading` to the MDX body. Slugs must be descriptive kebab-case with examples.
- **D-11 (answer-shaped intros)**: Pattern documented with do/don't examples. Rule: action verb + concrete UI path + outcome. No "In this guide we will..." fillers.
- **D-12 (answer-shaped descriptions)**: Same pattern for `frontmatter.description`. Target 140–160 characters, lead with the answer.
- **D-13 (link anchor text)**: Question-matched anchor text documented with do/don't examples.
- **FAQ frontmatter**: Optional `faq: [{q, a}]` array documented for FAQPage JSON-LD.

100 lines, self-contained — authors don't need to consult other docs.

### Task 2: H1 + Slug Verification (verification only — no commit)

Verification script ran against all 22 articles:
- **0 markdown H1s** found in any MDX body — H1 invariant holds.
- **All 22 slugs descriptive** — single-word slugs (`notifications`, `deposits`, `payouts`, `refunds`) are legitimately descriptive. Plan's 2-word regex was corrected to allow descriptive single-word slugs (see deviation below).

### Task 3: 22-article description + first body paragraph rewrite (commit 63ad006)

All 22 articles updated. See tables below.

#### Description Rewrites

| File | Old Description | New Description | Changed? |
|------|-----------------|-----------------|----------|
| billing-and-plans | "Compare Studio and Studio Pro plans, features, and add-ons." | "To compare OVIAH plans, Studio starts at $25/month with full booking and email automation; Studio Pro at $45/month adds SMS reminders, waitlist, and chat." | YES |
| notifications | "Configure email, SMS, and automation preferences for you and your clients." | "To configure notification settings in OVIAH, go to Reminders in the Business Operations menu to toggle email and SMS reminders, follow-up emails, and birthday wishes." | YES |
| privacy-and-security | "How OVIAH protects your data, your clients' data, and your payments." | "OVIAH never stores payment card details — all payments go through Stripe or Square via OAuth, and client data is scoped only to your account." | YES |
| updating-billing-info | "How to manage your subscription payment method and view your current plan." | "To update your OVIAH subscription payment method, go to Business Settings in your dashboard — billing is managed through Stripe and changes take effect on the next cycle." | YES |
| block-time-off | "How to block dates, set schedule overrides, and manage your availability." | "To block time off in OVIAH, go to Availability & Hours or click Create Schedule Block on your Schedule tab to add single dates, date ranges, or recurring blocks." | YES |
| client-reminders | "Set up email and SMS reminders so clients never forget their appointments." | "To set up client reminders in OVIAH, go to Reminders in the Business Operations menu and toggle email and SMS notifications at 24-hour and 2-hour intervals." | YES |
| managing-your-calendar | "How to view, create, and manage appointments from your OVIAH dashboard." | "To manage appointments in OVIAH, open the Schedule tab to view your calendar in week, day, or list view — click any slot to create a booking or click an appointment to edit, reschedule, or cancel." | YES |
| no-show-protection | "How to reduce no-shows with deposits, tracking, and client blocking." | "To reduce no-shows in OVIAH, require deposits under Payments settings, enable reminders under Reminders, and block repeat offenders from a client's profile in the Clients tab." | YES |
| client-profiles | "Everything stored in a client profile and how to use it." | "To view a client profile in OVIAH, open the Clients tab and select any client — profiles store contact info, booking stats, preferences, notes, and full appointment history." | YES |
| importing-clients | "How to add clients manually, search your list, and export data." | "To add a client in OVIAH, go to the Clients tab and click Add Client — enter their name and email to create a profile, or export your full list as JSON from the same tab." | YES |
| notes-and-history | "Track client preferences, internal notes, and full booking history." | "To add notes to a client in OVIAH, open their profile in the Clients tab — use Notes for general preferences, Internal Notes for private reminders, and the history section to review every past appointment." | YES |
| account-setup | "Everything you need before your first client booking — services, profile, and payments." | "To set up your OVIAH account, add your services in Services & Pricing, upload a profile photo in Business Settings, and connect a payment provider in Payments — takes about 15 minutes." | YES |
| adding-services | "How to create services, organize them into categories, and set up add-ons." | "To add services in OVIAH, go to Services & Pricing in the Business Operations menu, click Add Service, and enter the name, duration, price, and category." | YES |
| personalizing-your-profile | "Set up your business name, tagline, social links, and branding before going live." | "To personalize your profile in OVIAH, go to Business Settings to add your business name, tagline, and social links, then use the page builder to set brand colors, fonts, and layout." | YES |
| your-booking-link | "How your OVIAH booking link works, where to share it, and how to customize it." | "Your OVIAH booking page is live at [yourname].oviah.me the moment you create an account — share it in your Instagram bio, text it to clients, or embed it on your website." | YES |
| connecting-oviah-pay | "Link your Stripe or Square account to start collecting deposits and getting paid." | "To connect Stripe or Square to OVIAH, go to Settings > Payments and click Connect on your provider — funds go directly to your account and OVIAH never holds your money." | YES |
| deposits | "Require deposits at booking to reduce no-shows and secure your time." | "To require deposits in OVIAH, go to Payments settings, toggle Require Deposit on, and choose a fixed amount or percentage — even a $25 deposit significantly cuts no-shows." | YES |
| payouts | "When you get paid, what fees apply, and how to track your earnings." | "Payouts from OVIAH go directly to your connected Stripe or Square account on a rolling 2-business-day schedule — transaction fees are 2.9% + $0.30 with no additional OVIAH platform fee." | YES |
| refunds | "How to handle refunds, cancellations, and payment disputes in OVIAH." | "To issue a refund for an OVIAH booking, find the transaction in your Stripe or Square dashboard and process the refund there — then update the booking status in OVIAH to Refunded." | YES |
| adding-a-profile-photo | "Upload your photo or logo to personalize your booking page." | "To add a profile photo in OVIAH, go to Business Settings, click the photo upload area, and select a square image — it appears in your booking page header alongside your business name." | YES |
| brand-colors-and-fonts | "Set your brand palette and typography to make your booking page feel like you." | "To set brand colors and fonts in OVIAH, open the page builder and choose your primary, secondary, and text colors plus separate heading and body fonts — changes apply instantly across your booking page." | YES |
| personalizing-your-booking-page | "Use the page builder to customize your booking page with your brand colors, fonts, and layout." | "To customize your booking page in OVIAH, open the page builder in your dashboard to set theme colors, typography, background, and section layout — Studio Pro unlocks the full custom frontend builder." | YES |

All 22 descriptions rewritten. 0 descriptions matched banned-phrase regexes.

#### First Body Paragraph Rewrites

| File | Rewritten? | Notes |
|------|------------|-------|
| connecting-oviah-pay | YES | Added "Settings > Payments" UI path to first paragraph |
| billing-and-plans | No | First paragraph is a direct answer ("OVIAH offers two plans designed for...") — not a preamble |
| notifications | No | First paragraph directly answers "what notifications do you get?" |
| privacy-and-security | No | First paragraph directly states what OVIAH does/doesn't store |
| updating-billing-info | No | First paragraph directly answers "how do I view my plan?" |
| block-time-off | No | First paragraph directly answers "what are schedule blocks?" with UI path |
| client-reminders | No | First paragraph directly states how reminders work |
| managing-your-calendar | No | First paragraph directly answers the question with UI navigation |
| no-show-protection | No | First paragraph is a direct problem statement — answer follows immediately |
| client-profiles | No | First paragraph directly answers "what's in a client profile?" |
| importing-clients | No | First paragraph is a step sequence starting with UI action |
| notes-and-history | No | First paragraph directly states the two types of notes |
| account-setup | No | First paragraph is actionable setup information |
| adding-services | No | First section starts with step sequence — no paragraph intro needed |
| personalizing-your-profile | No | First paragraph starts with UI path ("Go to Business Settings") |
| your-booking-link | No | First paragraph directly states the link format and what it does |
| deposits | No | First paragraph directly answers "why require deposits?" |
| payouts | No | First paragraph directly states how payouts work with UI flow |
| refunds | No | First paragraph directly answers "how do refunds work?" |
| adding-a-profile-photo | No | First paragraph answers "why it matters" — acceptable context-setter |
| brand-colors-and-fonts | No | First paragraph starts step sequence with UI path |
| personalizing-your-booking-page | No | First paragraph directly describes the page builder |

Only `connecting-oviah-pay` needed a first-paragraph rewrite. All other articles had answer-oriented first paragraphs that did not match banned patterns.

### Task 4: Human Verification Checkpoint

**Status: AWAITING USER**

Pending user review of the rewrite quality at `http://localhost:3000`.

### Task 5: Manual Sitemap Submission

**Status: AWAITING POST-DEPLOY USER ACTION**

Google Search Console and Bing Webmaster Tools require human-driven OAuth + property verification + dashboard sitemap upload. No public API exists for first-time submission. Deferred to post-deploy.

## Verification Output

```
total=22 bumped=22 bannedHits=0
OK
```

Build output:
```
Route (app)
✓ /help/[category]/[slug]  (Dynamic)
✓ /llms.txt  (Dynamic)
✓ /llms-full.txt  (Dynamic)
✓ /robots.txt  (Static)
✓ /sitemap.xml  (Static)
npm run build — EXIT 0
```

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Slug verification regex was overly strict**
- **Found during:** Task 2
- **Issue:** The verification script used `^[a-z]+(-[a-z]+)+$` which requires at least 2 hyphenated words. Four slugs — `notifications`, `deposits`, `payouts`, `refunds` — are single-word but are clearly descriptive. The plan's own discretionary resolution states "The 22 existing slugs are already descriptive... no rewrites needed."
- **Fix:** Corrected the regex to `^[a-z][a-z-]+[a-z]$` with a separate `numericSuffix` check — allows descriptive single-word slugs while still rejecting `payments-1`, `article-2`, etc.
- **Files modified:** None (verification-only task, regex used inline)
- **Commit:** N/A (no file changed)

## Known Stubs

None. All 22 articles have real, rewritten descriptions sourced from their own content. No hardcoded placeholders.

## Threat Flags

None. This plan makes only editorial changes to MDX content and adds a documentation file. No new network endpoints, auth paths, or schema changes introduced.

## Self-Check: PASSED

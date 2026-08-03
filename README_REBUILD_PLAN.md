# Opérations Delta / Delta Operations — rebuild plan

## Objective

Replace the launch placeholder with a polished, bilingual, static business website while preserving the existing GitHub Pages deployment, custom domain, brand assets, and contact-form endpoint.

## Architecture

- Plain semantic HTML, shared CSS, and vanilla JavaScript.
- Separate crawlable French (`/fr/`) and English (`/en/`) routes.
- Root language selector with a small, transparent language preference redirect.
- Shared presentation in `assets/css/styles.css`.
- Shared navigation, form enhancement, and utilities in `assets/js/main.js`.
- All calculator, diagnostic, and brief-generator logic in `assets/js/tools.js`.
- No build step, backend, database, authentication, tracking, cookies, or external runtime dependency.

## Content

- Localized home, services, solutions, tools, sectors, about, contact, and privacy pages.
- Paired navigation and language-switch links on every page.
- Honest capability language: no fabricated clients, testimonials, statistics, or case studies.
- Existing Formspree endpoint retained for explicit contact submissions only, with email fallback.

## Interactive tools

1. Workflow diagnostic: 11 questions, transparent weighted score out of 100, maturity band, and three contextual recommendations. Answers remain in memory and are not transmitted.
2. ROI calculator: client-side monthly hours, savings, annual savings, payback, and conservative/base/optimistic scenarios. Assumptions are displayed with the output.
3. Requirements brief generator: multi-step structured intake covering workflow, users, data, outputs, automation, integrations, constraints, timing, and success. The result can be copied or printed and is never sent automatically.

## SEO and accessibility

- Unique localized titles and descriptions.
- Canonical and reciprocal `hreflang` links.
- Open Graph metadata, `robots.txt`, and `sitemap.xml`.
- Correct document languages, landmarks, headings, labels, skip links, visible focus, status announcements, and reduced-motion support.

## Verification

- Confirm all requested routes and static assets exist.
- Check local links, language alternates, canonical URLs, and form endpoint preservation.
- Exercise the diagnostic, ROI edge cases, brief steps, clipboard fallback, and print mode.
- Review responsive layouts and keyboard navigation.
- Confirm `CNAME` is unchanged and original PNG files remain present.

## Deployment safety

- Work only on `rebuild/opdelta-v1` until review.
- Preview locally before pushing or merging.
- Preserve the archive branch and `v0-current-landing-2026-08-03` rollback tag.
- Merge to the GitHub Pages source branch only after bilingual content and production-form testing are approved.

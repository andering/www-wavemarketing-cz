# WAVE Marketing Decisions

This file records durable cross-cutting production decisions for `www.wavemarketing.cz`. Keep content-specific requirements in `docs/site-content/` and design-specific requirements in `docs/design-system/`.

## Goal

Create a simple, static, production-ready site where design and content are generated from explicit source-of-truth documents instead of improvised during implementation.

## Confirmed Sources

- Content source of truth: `client_brief.md` and `docs/site-content/`.
- Visual source of truth: `docs/design-system/`.
- Section/component mapping: `docs/site-content/page-map.md`.
- Target site: canonical `www.wavemarketing.cz`.

## Source-Of-Truth Rules

- Use `client_brief.md` and `docs/site-content/` for page structure, Czech copy, services, contact data, legal/company data, and content requirements.
- Use `docs/design-system/` for visual direction: colors, typography, layout feel, spacing, cards, buttons, header/footer style, imagery treatment, and interaction style.
- Use `docs/site-content/page-map.md` for section order, anchors, navigation, component responsibilities, and section-specific variants.
- Ignore visual notes from the brief when they conflict with the approved design system.
- Ignore content from visual source material when it conflicts with the content specs.
- If a conflict is ambiguous, ask before deciding.
- Do not use fake production content from Stitch or other visual source material.
- Do not use Stitch-hosted images as production assets unless explicitly confirmed as real client assets.
- Do not add side specs or temporary implementation plans as durable requirements. If a decision matters after implementation, record it here and in the relevant canonical design-system or site-content file.

## Cross-Cutting Launch Decisions

- Launch format is a primarily one-page Czech site with static content sections, one supporting legal-information page for privacy and cookies, and a Cloudflare Pages Function endpoint for the approved contact form.
- The canonical target is `www.wavemarketing.cz`.
- Primary conversion is low-friction contact by phone, email, or the approved simplified contact form.
- The previous no-form launch decision is superseded by the approved backend-backed form decision: the contact form must stay minimal, submit to a Cloudflare Pages Function, verify Cloudflare Turnstile before processing, send notification email through Resend, return a JSON success response, and replace the form card with inline Czech thank-you copy after successful submission. Do not use frontend-only email sending, redirects, popup confirmations, fallback thank-you pages, or expose email/API credentials in browser code.
- References, case studies, client logos, testimonials, fake metrics, and placeholder links are omitted for launch.
- The `Reference` nav item is a navigation label only: it links to `Jak probíhá spolupráce` (`#spoluprace`) and does not authorize reference content.
- Social profile icons/links use the supplied Facebook, Instagram, and LinkedIn URLs in header/offcanvas rendering. Additional placements need explicit approval in the docs.
- Only verified real assets may be used in production. Transformable raster assets should use Astro's build-time image pipeline from `src/assets/`; assets that intentionally bypass processing may remain under `public/assets/`.
- Image CDN features are a delivery optimization layer after hosting is chosen, not the primary source optimization layer. The static build should ship optimized responsive image outputs before relying on CDN image resizing or Polish-style features.
- The production model has three layers: design system, section/content specs, and widget/component mapping.
- Cookie consent for launch uses the `vanilla-cookieconsent` library with a custom WAVE-styled bottom bar and preferences drawer/modal. Optional tracking consent defaults to denied; GTM container `GTM-WMJVN6WZ` is the only tracking container loaded from site code, with GA4 and future tools managed through GTM. Consent categories are `necessary`, `analytics`, and `marketing`; `necessary` is always enabled and read-only. Do not add direct GA4 page code outside GTM.
- Launch includes a real legal-information page at `/ochrana-osobnich-udaju-a-cookies/`. The footer may link to it with label `Ochrana osobních údajů a cookies`; this is no longer a placeholder legal link. The draft copy is stored in `docs/site-content/privacy-cookies.md` and requires client or legal review before being treated as final legal advice.

## Domain Ownership

- Content/copy/section decisions belong in `docs/site-content/`.
- Visual rules, tokens, component contracts, interaction rules, and responsive visual behavior belong in `docs/design-system/`.
- Page structure, anchors, navigation, section order, and component responsibility mapping belong in `docs/site-content/page-map.md`.
- Cross-cutting decisions that affect more than one domain belong in this file.
- Current state, open inputs, and resolved assets belong in `docs/status.md`.
- Process rules belong in `docs/workflow.md`.
- Chronological audit notes belong in `docs/history.md`.

## Testing Decision

- 2026-06-19: Tests were demoted from source-of-truth documents to optional validators. The current priority is to keep all important product, content, visual, and launch decisions in the canonical specs. Future tests should only check spec completeness or implementation conformance against those specs.

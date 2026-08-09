# WAVE Marketing Website Content Spec

## Purpose

This file defines the content architecture for the launch version of canonical `www.wavemarketing.cz`. It is content-only: visual styling, component behavior, colors, typography, and layout rules belong to `docs/design-system/` and `docs/site-content/page-map.md`.

## Source Of Truth

- Content source: `docs/site-content/`.
- Visual source: `docs/design-system/`.
- Conflict rule: use this website content spec for what the page says and what content exists; use the design system for how it looks.

## Launch Scope

- Website type: one-page Czech homepage plus one supporting privacy/cookies legal-information page and a Cloudflare Pages Function endpoint for the contact form.
- Language: Czech.
- Audience: businesses looking for a human, reliable marketing partner.
- Primary conversion: direct contact by phone, email, or the simplified backend-backed contact form.
- Secondary conversion: visitor reads services and understands the collaboration approach.
- Cookie consent: launch includes Czech consent UI for GTM-managed analytics and future marketing scripts. Consent copy must stay concise, human, and non-legalistic while accurately describing the categories.

## Launch Navigation

- `Úvod` links to the hero section.
- `Naše služby` links to the services section.
- `Reference` links to the collaboration process section labeled `Jak probíhá spolupráce`; it is a navigation label only, not a references/case-study section.
- `Kontakt` links to the contact section.

## Launch Content Inventory

The launch site contains these content sections. Render order, anchors, navigation routing, and component mapping are defined in `page-map.md`.

1. `sections/hero.md`: headline, positioning, and primary CTAs.
2. `sections/services-overview.md`: services and their benefit-led descriptions.
3. `sections/cooperation-process.md`: collaboration steps.
4. `sections/contact.md`: direct contact information, simplified contact form, and final CTA.
5. `sections/intro.md`: short human explanation of who WAVE Marketing is, rendered as the final main content section.
6. `sections/footer.md`: footer copy, navigation, and company facts.
7. Cookie consent UI: global page chrome, not a content section; it provides the launch consent banner, preferences settings, and a footer control to reopen settings.
8. `privacy-cookies.md`: supporting legal-information page for privacy and cookies.

## Omitted At Launch

- References, case studies, client logos, fake metrics, and fake testimonials are omitted; the `Reference` navigation label does not introduce reference content. The only approved metric-style content is the hero popup `Růst tržeb` `+124%` recorded in `sections/hero.md`.
- Contact form is approved only in the simplified launch form described in `sections/contact.md`; do not use the full client questionnaire.
- Supplied social profile URLs are approved for launch header links: Facebook `https://www.facebook.com/wavemarketingsro`, Instagram `https://www.instagram.com/wave.marketing.cz/`, and LinkedIn `https://www.linkedin.com/company/wave-marketing-s-r-o/`.
- Production images are limited to verified approved assets. Transformable raster images live under `src/assets/` for Astro build-time optimization; assets that intentionally bypass processing may remain under `public/assets/`.

## Resolved Production Assets

- Real WAVE Marketing logo asset: `public/assets/wave-marketing-logo.svg`.
- Real WAVE Marketing logo icon assets for favicon/app-icon compatibility: `public/favicon.ico`, `public/assets/wave-marketing-icon-32.png`, `public/assets/wave-marketing-apple-touch-icon.png`, and `public/assets/wave-marketing-icon-192.png`.
- Real Jana/contact photo asset: `src/assets/jana-skalnikova-photo.png`.
- Approved hero collaboration image: `src/assets/wave-marketing-hero-collaboration.png`.
- Approved process solution proposal image: `src/assets/wave-marketing-process-solution-proposal.png`.

## Supporting Legal Page

- Privacy/cookies route: `/ochrana-osobnich-udaju-a-cookies/`.
- Content source: `privacy-cookies.md`.
- Footer link label: `Ochrana osobních údajů a cookies`.
- The page copy is draft legal-information content and requires client or legal review before being treated as final legal advice.

## Optional Inputs Before Implementation

- Hosting/deployment target.

## Cookie Consent Copy Requirements

- First banner title: `Používáme cookies`.
- First banner summary should explain that cookies help measure website traffic and improve marketing.
- First banner actions: `Přijmout vše`, `Jen nezbytné`, and `Nastavit cookies`.
- Preferences modal title: `Nastavení cookies`.
- Preferences actions: `Přijmout vše`, `Jen nezbytné`, and `Uložit nastavení`.
- Categories: `Nezbytné cookies`, `Analytické cookies`, and `Marketingové cookies`.
- Do not render a fake privacy/GDPR legal link in the banner or modal. Add a legal link only when a real target URL or page content is supplied.

## Content Tone

Use Czech copy that feels warm, clear, human, reliable, and professional. Avoid stiff agency jargon. Prefer benefit-led wording over dry service lists. Keep the wave metaphor present, but do not overuse it in every sentence.

## SEO Basics

- Suggested title: `WAVE marketing s.r.o. | Přivedeme váš business na tu správnou vlnu`
- Suggested meta description: `WAVE marketing s.r.o. pomáhá firmám se strategií, sociálními sítěmi, PPC kampaněmi a obsahem. Děláme marketing lidsky, spolehlivě a s péčí.`
- H1 source: `Přivedeme váš business na tu správnou vlnu`
- Canonical domain: `https://www.wavemarketing.cz`; each indexable page must include its canonical URL.
- Social metadata: homepage and privacy/cookies page must provide Open Graph and Twitter title, description, URL, image, `og:type` of `website`, and truthful `og:image:alt` metadata. The homepage uses `twitter:card` of `summary_large_image` with the approved local hero image; the privacy/cookies page uses `twitter:card` of `summary` with the approved raster logo icon asset `public/assets/wave-marketing-icon-192.png`.
- Crawling: publish a root `robots.txt` that permits indexing and names `https://www.wavemarketing.cz/sitemap.xml`; publish a root `sitemap.xml` listing the homepage and `/ochrana-osobnich-udaju-a-cookies/`.
- Structured data: homepage must publish an `Organization` JSON-LD object using only the approved company name, canonical URL, logo, telephone number, email address, postal address, and social profile URLs.

## Future Scope

- Add references only when real client approvals, logos, case studies, numbers, and testimonials exist.
- Extend social links beyond the header only if those placements are explicitly requested.
- Extend the contact form only after a new backend, CRM, or field-scope decision exists.

## Contact Form Backend Requirements

- Form endpoint: Cloudflare Pages Function at `/api/contact`.
- Email delivery: Resend, using a secret API key stored in Cloudflare environment variables.
- Bot protection: Cloudflare Turnstile; submissions must be rejected when Turnstile verification fails.
- Do not send email directly from browser-side JavaScript and do not expose credentials in frontend code.
- Successful submissions return a JSON success response and replace the form card inline with the approved Czech thank-you message.
- Failed submissions should return a clear, non-technical Czech JSON error response and preserve privacy by not echoing sensitive submission data into URLs.

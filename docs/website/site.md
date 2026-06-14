# WAVE Marketing Website Content Spec

## Purpose

This file defines the content architecture for the launch version of canonical `www.wavemarketing.cz`. It is content-only: visual styling, component behavior, colors, typography, and layout rules belong to `docs/design-system/wave-marketing/` and the future `docs/website/page-map.md`.

## Source Of Truth

- Content source: `client_brief.md`.
- Visual source: `docs/design-system/wave-marketing/`.
- Conflict rule: use this website content spec for what the page says and what content exists; use the design system for how it looks.

## Launch Scope

- Website type: one-page static website.
- Language: Czech.
- Audience: businesses looking for a human, reliable marketing partner.
- Primary conversion: direct contact by phone or email.
- Secondary conversion: visitor reads services and understands the collaboration approach.

## Launch Navigation

- `Úvod` links to the hero section.
- `Naše služby` links to the services section.
- `Reference` links to the collaboration process section labeled `Jak probíhá spolupráce`; it is a navigation label only, not a references/case-study section.
- `Kontakt` links to the contact section.

## Launch Sections

1. `sections/hero.md`: headline, positioning, and primary CTAs.
2. `sections/intro.md`: short human explanation of who WAVE Marketing is.
3. `sections/services-overview.md`: services and their benefit-led descriptions.
4. `sections/cooperation-process.md`: collaboration steps.
5. `sections/contact.md`: direct contact information and final CTA.
6. `sections/footer.md`: footer copy, navigation, and company facts.

## Omitted At Launch

- References, case studies, client logos, fake metrics, and fake testimonials are omitted; the `Reference` navigation label does not introduce reference content. The only approved metric-style content is the hero popup `Růst tržeb` `+124%` recorded in `sections/hero.md`.
- Contact form is omitted.
- Supplied social profile URLs are approved for launch header links: Facebook `https://www.facebook.com/wavemarketingsro`, Instagram `https://www.instagram.com/wave.marketing.cz/`, and LinkedIn `https://www.linkedin.com/company/wave-marketing-s-r-o/`.
- Production images are limited to verified approved assets. The logo and Jana/contact photo are available under `public/assets/`.

## Resolved Production Assets

- Real WAVE Marketing logo asset: `public/assets/wave-marketing-logo.png`.
- Real Jana/contact photo asset: `public/assets/jana-skalnikova-photo.png`.

## Optional Inputs Before Implementation

- Preferred privacy/GDPR page content if legal footer links are required.
- Hosting/deployment target.

## Content Tone

Use Czech copy that feels warm, clear, human, reliable, and professional. Avoid stiff agency jargon. Prefer benefit-led wording over dry service lists. Keep the wave metaphor present, but do not overuse it in every sentence.

## SEO Basics

- Suggested title: `WAVE marketing s.r.o. | Přivedeme váš business na tu správnou vlnu`
- Suggested meta description: `WAVE marketing s.r.o. pomáhá firmám se strategií, sociálními sítěmi, PPC kampaněmi a obsahem. Děláme marketing lidsky, spolehlivě a s péčí.`
- H1 source: `Přivedeme váš business na tu správnou vlnu`

## Future Scope

- Add references only when real client approvals, logos, case studies, numbers, and testimonials exist.
- Extend social links beyond the header only if those placements are explicitly requested.
- Add a contact form only after a form handling service or backend decision exists.

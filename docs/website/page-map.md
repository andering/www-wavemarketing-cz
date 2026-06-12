# WAVE Marketing Homepage Page Map

## Purpose

This file is the glue layer between content specs and the WAVE Marketing design system. It defines which content section renders through which reusable component contract and variant. It does not redefine copy, colors, fonts, spacing values, or token values.

## Sources

- Design system: `../design-system/wave-marketing/`
- Site content spec: `site.md`
- Section content specs: `sections/*.md`
- Launch roadmap and decisions: `../website-production-roadmap.md`

## Global Page Contract

- Page type: one-page static homepage.
- Language: Czech.
- Canonical target: `www.wavemarketing.cz`.
- Primary conversion: phone or email contact.
- Content source: section markdown files under `docs/website/sections/`.
- Visual/component source: `docs/design-system/wave-marketing/DESIGN.md`, `tokens.css`, and `kitchensink.html`.
- Normal implementation must not copy Stitch placeholder content, fake references, fake metrics, or hosted generated images.

## Required Design-System Components

The implementation should define or generate these component/widget contracts from the design system:

- `site-header`: sticky or fixed glass header with logo, nav anchors, active/hover states, and mobile collapse.
- `marketing-hero`: split hero with eyebrow, H1, lead paragraph, CTA group, and optional verified/abstract visual.
- `intro-statement`: compact human-positioning text block.
- `service-list`: vertical benefit-led service rows with icon wells and optional service anchors.
- `process-steps`: numbered collaboration process rows or cards.
- `wave-divider`: SVG or CSS wave divider between major page zones.
- `contact-card-grid`: direct contact tiles for person, phone, email, meeting availability, and company facts.
- `site-footer`: muted footer with brand copy, anchor links, company facts, and optional legal links only when supplied.

## Asset Gates

- `logo`: resolved at `public/assets/wave-marketing-logo.png`; used by `site-header` and optionally `site-footer`.
- `jana-contact-photo`: resolved at `public/assets/jana-skalnikova-photo.png`; used by `contact-card-grid`.
- `hero-visual`: optional; if no verified image exists, use an abstract wave/shape treatment derived from the design system.
- `social-links`: omitted until final URLs exist.

## Navigation Map

- Header nav item `Úvod` points to `#uvod`.
- Header nav item `Naše služby` points to `#sluzby`.
- Header nav item `Kontakt` points to `#kontakt`.
- Do not render `Reference` at launch.
- Do not render social icons at launch unless final profile URLs are supplied.

## Section Map

### 1. Header

- Anchor role: persistent page chrome.
- Content source: `site.md` navigation rules and required logo asset.
- Component: `site-header`.
- Variant: `centered-logo-split-nav` on desktop, `compact-logo-menu` on mobile.
- Design contract: `Navigation / Header` from the design system.
- Required behavior: anchor navigation to `#uvod`, `#sluzby`, and `#kontakt`.
- Launch exclusions: no `Reference` link, no placeholder social icons.

### 2. Hero

- Anchor: `#uvod`.
- Content source: `sections/hero.md`.
- Component: `marketing-hero`.
- Variant: `split-copy-organic-visual`.
- Design contracts: `Typography`, `Buttons`, `Images and Media`, `Decorative Elements`.
- Content slots: eyebrow, H1, lead paragraph, primary CTA, secondary CTA.
- CTA behavior: primary links to `#kontakt`; secondary links to `#sluzby`.
- Visual slot rule: use verified real image only if supplied; otherwise use abstract wave/organic shape treatment.

### 3. Wave Divider After Hero

- Content source: none.
- Component: `wave-divider`.
- Variant: `teal-layered-soft`.
- Design contract: `Decorative Elements`.
- Purpose: separate hero from content while reinforcing the wave motif.

### 4. Intro

- Anchor: optional internal section, no nav item required.
- Content source: `sections/intro.md`.
- Component: `intro-statement`.
- Variant: `centered-statement-with-supporting-copy`.
- Design contracts: `Composition Cues`, `Typography`, `Cards` if rendered inside a surface.
- Content slots: heading, main copy, supporting copy.

### 5. Services Overview

- Anchor: `#sluzby`.
- Content source: `sections/services-overview.md`.
- Component: `service-list`.
- Variant: `icon-row-list`.
- Design contracts: `Cards`, `Shape and Iconography System`, `Typography`, `Buttons` if service links are rendered.
- Content slots: section heading, intro copy, four service items.
- Service items: marketing strategy, social media management, PPC, content creation.
- Launch rule: do not add services from Stitch that are not present in the content spec.

### 6. Cooperation Process

- Anchor: optional internal section, no nav item required.
- Content source: `sections/cooperation-process.md`.
- Component: `process-steps`.
- Variant: `numbered-warm-cards`.
- Design contracts: `Cards`, `Typography`, `Spacing Scale`.
- Content slots: section heading, intro copy, four steps.
- Purpose: make contacting WAVE feel simple and low-risk.

### 7. Wave Divider Before Contact

- Content source: none.
- Component: `wave-divider`.
- Variant: `sand-to-contact-soft`.
- Design contract: `Decorative Elements`.
- Purpose: transition from service explanation to contact conversion.

### 8. Contact

- Anchor: `#kontakt`.
- Content source: `sections/contact.md`.
- Component: `contact-card-grid`.
- Variant: `direct-actions-no-form`.
- Design contracts: `Cards`, `Buttons`, `Images and Media`, `Forms` only for future extension.
- Content slots: section heading, intro copy, Jana contact tile, phone CTA, email CTA, meeting availability, company details.
- Launch rule: no form, no placeholder socials, no fake availability claims beyond approved copy.
- Asset rule: render `public/assets/jana-skalnikova-photo.png` for the Jana contact tile.

### 9. Footer

- Anchor role: page close.
- Content source: `sections/footer.md`.
- Component: `site-footer`.
- Variant: `muted-brand-footer`.
- Design contract: `Footer`.
- Content slots: brand label, footer copy, footer navigation, company facts, copyright.
- Launch rule: no `Reference` link, no social links, no placeholder legal links.

## Page-Level Exclusions

- Do not render references, case studies, client logos, testimonials, or fake metrics.
- Do not render a contact form.
- Do not render social links without final URLs.
- Do not render placeholder legal links.
- Do not use Stitch-hosted imagery as production assets.

## Implementation Notes For Future Agents

- Read order: `docs/design-system/wave-marketing/USAGE.md`, then `docs/website/site.md`, then this file, then each section file.
- Treat component names in this file as implementation contracts. The implementation can choose actual file/component names that fit the stack, but must preserve these responsibilities.
- If a section needs a visual pattern not documented in the design system, derive it conservatively from the closest contract or ask before inventing a new pattern.
- If supplied assets are missing at implementation time, stop and ask unless the section explicitly allows an abstract or omitted visual fallback.

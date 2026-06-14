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
- `hero-visual`: resolved at `public/assets/wave-marketing-hero-collaboration.png`; used by `marketing-hero` inside an organic image frame.
- `process-solution-proposal-visual`: resolved at `public/assets/wave-marketing-process-solution-proposal.jpg`; used by step 3 of `process-steps`.
- `social-links`: resolved for header use with supplied Facebook, Instagram, and LinkedIn URLs; no placeholder social URLs are allowed.

## Navigation Map

- Header nav item `Úvod` points to `#uvod`.
- Header nav item `Naše služby` points to `#sluzby`.
- Header nav item `Reference` points to `#spoluprace`, the `Jak probíhá spolupráce` section.
- Header nav item `Kontakt` points to `#kontakt`.
- Do not render a reference/case-study section at launch.
- Header social links use the supplied Facebook, Instagram, and LinkedIn URLs.

## Section Map

### 1. Header

- Anchor role: persistent page chrome.
- Content source: `site.md` navigation rules and required logo asset.
- Component: `site-header`.
- Variant: `centered-logo-split-nav` on desktop, `mobile-offcanvas-menu` on mobile.
- Design contract: `Navigation / Header` from the design system.
- Required behavior: anchor navigation to `#uvod`, `#sluzby`, `#spoluprace`, and `#kontakt`, with active section tracking that highlights the matching desktop and mobile/offcanvas navigation item during scroll and hash navigation.
- Layout rule: desktop splits approved navigation around a balanced 72px-tall centered logo, then shows Header social links as real brand-colored SVG icons in a separate far-right cluster with a subtle left divider, matching the approved Stitch reference structure. Mobile keeps a compact 48px-tall logo plus an accessible hamburger trigger for the right-side offcanvas menu; the same real social links render inside the offcanvas panel below the anchor navigation. Render the offcanvas layer outside the sticky header shell so fixed positioning starts at the viewport top instead of the header top.
- Launch exclusions: no reference/case-study content and no placeholder social icons.

### 2. Hero

- Anchor: `#uvod`.
- Content source: `sections/hero.md`.
- Component: `marketing-hero`.
- Variant: `split-copy-organic-visual`.
- Design contracts: `Typography`, `Buttons`, `Images and Media`, `Decorative Elements`.
- Content slots: eyebrow, H1, lead paragraph, primary CTA, secondary CTA, approved floating growth popup.
- CTA behavior: primary links to `#kontakt`; the second hero button links to `#sluzby` and uses the tertiary white/surface button variant.
- Visual slot rule: on desktop and wider layouts, use the approved local hero image asset inside an organic wave-like frame with the approved floating growth popup (`Růst tržeb`, `+124%`) positioned over the image edge. On mobile, omit the image visually, omit the popup with it, do not add a decorative replacement gradient, and make the hero headline larger than the default mobile heading scale. Do not use remote Stitch-hosted image URLs in production.

### 3. Wave Divider After Hero

- Content source: none.
- Component: `wave-divider`.
- Variant: `teal-layered-soft`.
- Design contract: `Decorative Elements`.
- Purpose: separate hero from content while reinforcing the wave motif.

### 4. Services Overview

- Anchor: `#sluzby`.
- Content source: `sections/services-overview.md`.
- Component: `service-list`.
- Variant: `icon-row-list`.
- Design contracts: `Cards`, `Shape and Iconography System`, `Typography`, `Buttons` if service links are rendered.
- Content slots: section heading, intro copy, four service items.
- Service items: marketing strategy, social media management, PPC, content creation.
- Launch rule: do not add services from Stitch that are not present in the content spec.

### 5. Cooperation Process

- Anchor: `#spoluprace`.
- Content source: `sections/cooperation-process.md`.
- Component: `process-steps`.
- Variant: `centered-vertical-timeline`.
- Design contracts: `Typography`, `Spacing Scale`, `Decorative Elements`, `Cards` only if a future approved step needs a supporting surface.
- Content slots: section heading, intro copy, four steps, and approved support slots.
- Layout rule: render a narrow centered vertical timeline with numbered circular nodes and a subtle dotted connector; include only approved support slots: one `Výstup:` box, two process chips, the approved local solution proposal workshop image for `Návrh řešení`, and the existing contact CTA.
- Purpose: make contacting WAVE feel simple and low-risk.

### 6. Contact

- Anchor: `#kontakt`.
- Content source: `sections/contact.md`.
- Component: `contact-card-grid`.
- Variant: `compact-direct-contact-module`.
- Design contracts: `Cards`, `Buttons`, `Images and Media`, `Forms` only for future extension.
- Content slots: section heading, intro copy, Jana contact tile, role, `+420` phone display under role, secondary deep-teal phone CTA labeled `Zavolejte Janě`, email CTA with address below `Napište nám`, meeting availability, company details.
- Layout rule: render a 4-column by 2-row desktop contact bento using `--ds-radius-2xl`: Jana spans columns 1-2 and rows 1-2, email spans columns 3-4 row 1, availability spans columns 3-4 row 2, and muted company facts sit below; stack on mobile.
- Launch rule: no form, no placeholder socials, no fake availability claims beyond approved copy.
- Asset rule: render `public/assets/jana-skalnikova-photo.png` for the Jana contact tile.

### 7. Intro

- Anchor: optional internal section, no nav item required.
- Content source: `sections/intro.md`.
- Component: `intro-statement`.
- Variant: `split-editorial-wave-panel`.
- Design contracts: `Composition Cues`, `Typography`, `Decorative Elements`, `Cards` if rendered inside a surface.
- Content slots: heading, main copy, supporting copy.
- Visual slot rule: on desktop and wider layouts, render a local token-colored layered ribbon-wave SVG inspired by the approved Stitch node, using a cropped wave viewport so empty space above and below the ribbon does not inflate the section. The desktop ribbon-wave may use a subtle breathing animation with gentle vertical drift, slight scale, and tiny staggered ribbon offsets; disable this non-essential motion for reduced-motion preferences. On mobile, omit the decorative wave panel and keep only the text statement. Do not render metrics, remote Stitch imagery, or fake proof.
- Placement rule: render `Kdo jsme` as the final main content section after the contact conversion area.

### 8. Footer

- Anchor role: page close.
- Content source: `sections/footer.md`.
- Component: `site-footer`.
- Variant: `muted-brand-footer`.
- Design contract: `Footer`.
- Content slots: brand label, footer copy, footer navigation, company facts, copyright.
- Launch rule: footer may mirror the approved navigation, but must not add a reference/case-study section, social links, or placeholder legal links.

## Page-Level Exclusions

- Do not render references, case studies, client logos, testimonials, or fake metrics. The only approved metric-style content is the hero floating growth popup recorded in `sections/hero.md`.
- Do not render a contact form.
- Do not render social links without final URLs.
- Do not render placeholder legal links.
- Do not use Stitch-hosted imagery as production assets.

## Implementation Notes For Future Agents

- Read order: `docs/design-system/wave-marketing/USAGE.md`, then `docs/website/site.md`, then this file, then each section file.
- Treat component names in this file as implementation contracts. The implementation can choose actual file/component names that fit the stack, but must preserve these responsibilities.
- If a section needs a visual pattern not documented in the design system, derive it conservatively from the closest contract or ask before inventing a new pattern.
- If supplied assets are missing at implementation time, stop and ask unless the section explicitly allows an abstract or omitted visual fallback.

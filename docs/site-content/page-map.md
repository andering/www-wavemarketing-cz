# WAVE Marketing Homepage Page Map

## Purpose

This file is the glue layer between content specs and the WAVE Marketing design system. It defines which content section renders through which reusable component contract and variant. It does not redefine copy, colors, fonts, spacing values, or token values.

## Sources

- Design system: `../design-system/`
- Site content spec: `site.md`
- Privacy/cookies content spec: `privacy-cookies.md`
- Section content specs: `sections/*.md`
- Durable cross-cutting production decisions: `../decisions.md`
- Process/status docs: `../workflow.md` and `../status.md`

## Global Page Contract

- Page type: one-page Czech homepage plus one supporting privacy/cookies legal-information page and one Cloudflare Pages Function endpoint for contact submissions.
- Language: Czech.
- Canonical target: `www.wavemarketing.cz`.
- Primary conversion: phone, email, or the simplified backend-backed contact form.
- Content source: section markdown files under `docs/site-content/sections/`.
- Visual/component source: `docs/design-system/DESIGN.md`, `tokens.css`, and `kitchensink.html`.
- Normal implementation must not copy Stitch placeholder content, fake references, fake metrics, or hosted generated images.

## Required Design-System Components

The implementation should define or generate these component/widget contracts from the design system:

- `site-header`: sticky or fixed glass header with logo, nav anchors, active/hover states, and mobile collapse.
- `marketing-hero`: split hero with eyebrow, H1, lead paragraph, CTA group, and optional verified/abstract visual.
- `intro-statement`: compact human-positioning text block.
- `service-list`: vertical benefit-led service rows with icon wells and optional service anchors.
- `process-steps`: numbered collaboration process rows or cards.
- `wave-divider`: SVG or CSS wave divider between major page zones.
- `contact-card-grid`: direct contact tiles for person, phone, email, meeting availability, simplified contact form, and company facts.
- `site-footer`: muted footer with brand copy, anchor links, company facts, and optional legal links only when supplied.
- `cookie-consent`: global consent UI using `vanilla-cookieconsent`, WAVE-styled bottom bar, preferences drawer/modal, GTM Consent Mode integration, and a footer reopen control.

## Asset Gates

- `logo`: resolved at `public/assets/wave-marketing-logo.svg`; used by `site-header` and optionally `site-footer`.
- `logo-icons`: icon derivatives resolved at `public/favicon.ico`, `public/assets/wave-marketing-icon-32.png`, `public/assets/wave-marketing-apple-touch-icon.png`, and `public/assets/wave-marketing-icon-192.png`; used only for favicon and app-icon compatibility.
- `jana-contact-photo`: resolved at `src/assets/jana-skalnikova-photo.png`; used by `contact-card-grid` through Astro's image pipeline.
- `hero-visual`: resolved at `src/assets/wave-marketing-hero-collaboration.png`; used by `marketing-hero` inside an organic image frame through Astro's responsive image pipeline.
- `process-solution-proposal-visual`: resolved at `src/assets/wave-marketing-process-solution-proposal.png`; used by step 3 of `process-steps` through Astro's responsive image pipeline.
- `social-links`: resolved for header use with supplied Facebook, Instagram, and LinkedIn URLs; no placeholder social URLs are allowed.
- CDN delivery layer: after hosting is chosen, configure cache/compression and optional CDN image features, but do not depend on CDN image resizing as the only optimization for the approved raster assets.

## Navigation Map

- Header nav item `Úvod` points to `#uvod`.
- Header nav item `Naše služby` points to `#sluzby`.
- Header nav item `Reference` points to `#spoluprace`, the `Jak probíhá spolupráce` section.
- Header nav item `Kontakt` points to `#kontakt`.
- Do not render a reference/case-study section at launch.
- Header social links use the supplied Facebook, Instagram, and LinkedIn URLs.
- The supporting privacy/cookies page is not part of the header navigation.

## Section Map

### 1. Header

- Anchor role: persistent page chrome.
- Content source: `site.md` navigation rules and required logo asset.
- Component: `site-header`.
- Variant: `left-logo-centered-nav` on desktop, `left-logo-mobile-cta-menu` on mobile.
- Design contract: `Navigation / Header` from the design system.
- Required behavior: anchor navigation to `#uvod`, `#sluzby`, `#spoluprace`, and `#kontakt`, with active section tracking that highlights the matching desktop and mobile/offcanvas navigation item during scroll and hash navigation.
- Layout rule: desktop uses a standard left-aligned logo, the approved navigation links centered in the header, then a visible contact CTA button labeled `Zavoláme vám` linking to `#kontakt`, then Header social links as real brand-colored SVG icons in a separate far-right cluster with a subtle left divider. Desktop and mobile header content use the same 80px vertical rhythm before the 1px header border, with logo, links, CTA, divider, and hamburger vertically centered inside that 80px area. Mobile uses the left logo vertically centered, keeps the compact visible contact CTA labeled `Zavoláme vám`, adds a subtle vertical divider, and keeps an accessible plain hamburger trigger without a circular outline on the right; do not render social links directly in the visible mobile header. The offcanvas top heading repeats the logo in place of the `Menu` text and uses a right-aligned action cluster with the social icons immediately left of the accessible icon-only cross close action, separated from the close action by the same subtle vertical divider pattern used in the mobile header; do not render the contact CTA inside the offcanvas and do not repeat social icons below the offcanvas navigation. Render the offcanvas layer outside the sticky header shell so fixed positioning starts at the viewport top instead of the header top, and keep the offcanvas top heading content vertically centered in the same 80px rhythm.
- Launch exclusions: no reference/case-study content and no placeholder social icons.

### 2. Hero

- Anchor: `#uvod`.
- Content source: `sections/hero.md`.
- Component: `marketing-hero`.
- Variant: `split-copy-organic-visual`.
- Design contracts: `Typography`, `Buttons`, `Images and Media`, `Decorative Elements`.
- Content slots: eyebrow, H1, lead paragraph, primary CTA, secondary CTA, approved floating growth popup.
- CTA behavior: primary links to `#kontakt`; the second hero button links to `#sluzby` and uses the tertiary white/surface button variant.
- Visual slot rule: on desktop and wider layouts, use the approved local hero image asset inside an organic wave-like frame with the approved floating growth popup (`Růst tržeb`, `+124%`) positioned over the image edge. On mobile, omit the image visually, omit the popup with it, do not add a decorative replacement gradient, use moderate hero top padding so the opening content starts sooner below the header while keeping some breathing room, and make the hero headline larger than the default mobile heading scale. Do not use remote Stitch-hosted image URLs in production.

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
- Design contracts: `Cards`, `Shape and Iconography System`, `Typography`, `Shopping Tag Labels`, `Buttons` if service links are rendered.
- Content slots: section heading, intro copy, services lead, six service items with orientační starting-price tags, closing copy, and pricing note.
- Service items: social media management, PPC campaigns, website and e-shop creation/editing, photo and video services, tailored marketing strategy, graphic services and visual creation.
- Layout rule: render each service icon inside the service heading row immediately before the service title, so the icon starts the title line on desktop and mobile instead of sitting on a standalone line.
- Price tag rule: render each service starting price in the bottom-right corner of its service row using the approved shopping-tag label treatment derived from the hero `marketing` inline tag; on mobile the tag may remain below the text and right-aligned within the row to preserve readability. Price labels use only the approved starting amount, for example `od 15 000 Kč`, without upper ranges or monthly wording.
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
- Design contracts: `Cards`, `Buttons`, `Images and Media`, `Forms`.
- Content slots: section heading, intro copy, Jana contact tile, role, `+420` phone display under role, secondary deep-teal phone CTA labeled `Zavolejte Janě`, email CTA with address below `Napište nám`, meeting availability, simplified contact form, company details.
- Layout rule: render a direct-contact bento using `--ds-radius-2xl`: Jana remains the most prominent card, email and availability remain immediately visible, their circular icon wells remain left of the copy and left-aligned on mobile, the simplified form renders as a secondary card with one textarea, one consent checkbox, Turnstile slot, submit button, and clear status/error copy, and muted company facts sit below; stack on mobile.
- Launch rule: no full questionnaire, no placeholder socials, no fake availability claims beyond approved copy.
- Asset rule: render `src/assets/jana-skalnikova-photo.png` through Astro's image pipeline for the Jana contact tile.

### 6a. Contact Submission Endpoint

- Route: `/api/contact`.
- Component/script: Cloudflare Pages Function.
- Content source: `sections/contact.md` and `site.md` contact form backend requirements.
- Required behavior: accept only POST submissions, parse form data server-side, validate the single contact message field and consent checkbox, verify Cloudflare Turnstile server-side, send notification email through Resend using environment secrets, and return a JSON success response for inline UI replacement.
- Security rule: do not expose Resend API keys, Turnstile secret keys, or email credentials to browser code.

### 6b. Inline Thank-You State

- Content source: `sections/contact.md`.
- Component/page: contact form card state inside `contact-card-grid`.
- Design contract: `Typography`, `Cards`, and `Forms`.
- Required behavior: after a successful JavaScript submission, hide the entire default form-card content, including the `Nechte nám na sebe kontakt` heading and helper copy, and show the approved thank-you state in the same card area. The success state uses the same circular primary-color icon-well treatment as service-row icons in `Naše služby`, placed inline at the start of the thank-you title row rather than on a standalone line. Do not use a popup, redirect, or standalone thank-you fallback page.

### 7. Intro

- Anchor: optional internal section, no nav item required.
- Content source: `sections/intro.md`.
- Component: `intro-statement`.
- Variant: `split-editorial-wave-panel`.
- Design contracts: `Composition Cues`, `Typography`, `Decorative Elements`, `Cards` if rendered inside a surface.
- Content slots: heading, main copy, supporting copy.
- Visual slot rule: on desktop and wider layouts, render a panel-scoped WebGL shader canvas inspired by the supplied flowing-line shader, with a local SVG/CSS fallback behind it. The shader must be initialized only for the `Kdo jsme` visual panel, use WAVE colors, clean up resize and animation frame work, and skip animation for reduced-motion preferences. On no-WebGL, shader failure, JavaScript-disabled, reduced-motion, and mobile contexts, preserve a static local SVG/CSS fallback or the existing mobile omission. Do not add React, shadcn, Tailwind, `/components/ui`, Unsplash assets, lucide icons, full-page fixed backgrounds, remote imagery, metrics, fake proof, or new dependencies.
- Placement rule: render `Kdo jsme` as the final main content section after the contact conversion area.

### 8. Footer

- Anchor role: page close.
- Content source: `sections/footer.md`.
- Component: `site-footer`.
- Variant: `muted-brand-footer`.
- Design contract: `Footer`.
- Content slots: brand label, footer copy, footer navigation, company facts, cookie settings control, copyright.
- Launch rule: footer may mirror the approved navigation, include a `Nastavení cookies` control that reopens the consent preferences UI, and link to the approved privacy/cookies page. It must not add a reference/case-study section, social links, or placeholder legal links.

### 9. Cookie Consent

- Anchor role: global page chrome, no navigation item.
- Content source: `site.md` cookie consent copy requirements.
- Component/script: `cookie-consent`.
- Variant: `bottom-bar-with-preferences-drawer`.
- Design contract: `Cookie Consent` from the design system.
- Required behavior: initialize optional consent as denied before GTM loads; load GTM container `GTM-WMJVN6WZ`; manage GA4 through GTM, not direct GA4 page code; update consent when users accept all, reject non-essential cookies, or save category preferences.
- Category model: `necessary` is enabled and read-only; `analytics` gates GA4/analytics tags through GTM; `marketing` is prepared for future ad pixels or remarketing tools through GTM.
- Footer integration: the footer `Nastavení cookies` control reopens the preferences UI without adding a placeholder privacy/GDPR link.

### 10. Privacy And Cookies Page

- Route: `/ochrana-osobnich-udaju-a-cookies/`.
- Content source: `privacy-cookies.md`.
- Component/page: legal information page.
- Design contract: `Typography`, `Layout System`, `Cards` only if content blocks need quiet grouping, and `Footer` for return/legal navigation.
- Required behavior: render a standalone static page in Czech with the approved draft legal-information copy, company facts, cookie categories, cookie table, and instructions for reopening cookie settings.
- Navigation rule: do not add this page to the main header nav; link it from the footer as `Ochrana osobních údajů a cookies`.
- Review rule: the page copy requires client or legal review before being treated as final legal advice.

## Page-Level Exclusions

- Do not render references, case studies, client logos, testimonials, or fake metrics. The only approved metric-style content is the hero floating growth popup recorded in `sections/hero.md`.
- Do not render the full client questionnaire or any contact form without the approved Cloudflare Pages Function, Turnstile, and Resend backend path.
- Do not render social links without final URLs.
- Do not render placeholder legal links; the approved privacy/cookies footer link is allowed because it has a real route and content source.
- Do not use Stitch-hosted imagery as production assets.
- Do not render direct GA4 tracking code outside GTM.

## Implementation Notes For Future Agents

- Read order: `docs/design-system/USAGE.md`, then `docs/site-content/site.md`, then this file, then each section file.
- Treat component names in this file as implementation contracts. The implementation can choose actual file/component names that fit the stack, but must preserve these responsibilities.
- If a section needs a visual pattern not documented in the design system, derive it conservatively from the closest contract or ask before inventing a new pattern.
- If supplied assets are missing at implementation time, stop and ask unless the section explicitly allows an abstract or omitted visual fallback.

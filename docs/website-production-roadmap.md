# WAVE Marketing Website Production Roadmap

This file records the workflow decisions for producing the canonical static website for `www.wavemarketing.cz`. Keep it updated after each meaningful decision so future website projects can reuse the same process.

## Goal

Create a simple, static, production-ready website where design and content are generated from explicit source-of-truth documents instead of improvised during implementation.

## Confirmed Sources

- Content source of truth: `client_brief.md`.
- Visual source of truth: Stitch project `105594184207261317`, screen `5af0cf05032a4c45b119685d472fd43f`.
- Target site: canonical `www.wavemarketing.cz`.

## Source-Of-Truth Rules

- Use `client_brief.md` for page structure, Czech copy, services, contact data, legal/company data, and content requirements.
- Use Stitch only for visual direction: colors, typography, layout feel, spacing, cards, buttons, header/footer style, imagery treatment, and interaction style.
- Ignore visual notes from the brief when they conflict with Stitch.
- Ignore content from Stitch when it conflicts with the brief.
- If a conflict is ambiguous, ask before deciding.
- Do not use fake production content from Stitch.
- Do not use Stitch-hosted images as production assets unless explicitly confirmed as real client assets.

## Decisions So Far

- References are hidden for launch. No `Reference` nav item, no fake case studies, and no empty reference section.
- Launch format is a one-page website with sections, not separate static pages.
- No contact form for launch. Contact will use direct phone/email actions only.
- Social profile icons/links are omitted or disabled until real URLs exist. No `#` placeholder links in production.
- Only verified real assets may be used in production.
- Logo and Jana/contact photo were approved from Stitch and extracted into `public/assets/`.
- The website production model should have three layers: design system, section/content specs, and widget/component mapping.

## Three-Layer Production Model

### Layer 1: Design System

Purpose: extract a reusable visual contract from Stitch.

Recommended path:

```text
docs/design-system/wave-marketing/
  DESIGN.md
  USAGE.md
  manifest.json
  tokens.css
  kitchensink.html
```

Responsibilities:

- Define visual identity and design principles.
- Define tokens for colors, typography, spacing, radius, borders, shadows, and motion.
- Define component contracts for header, footer, buttons, service rows/cards, contact blocks, wave dividers, organic image treatment, and tactile button behavior.
- Provide a standalone `kitchensink.html` fixture so implementation agents can see the design system without reopening Stitch.

### Layer 2: Website Content And Section Specs

Purpose: convert `client_brief.md` into structured content files without visual styling decisions.

Recommended path:

```text
docs/website/
  site.md
  sections/
    hero.md
    intro.md
    services-overview.md
    cooperation-process.md
    contact.md
    footer.md
```

Responsibilities:

- Define sitemap and one-page section order.
- Store section purpose, final or approved Czech copy, CTA labels, links, contact facts, and SEO notes.
- Keep content independent from colors, fonts, layout measurements, and component styling.
- Explicitly record omitted launch content, especially references and social links.

### Layer 3: Widget And Component Mapping

Purpose: bridge content sections to reusable components/widgets.

Recommended path:

```text
docs/website/page-map.md
```

Responsibilities:

- Map each content section to a component contract from the design system.
- Choose component variants per section.
- Define page-level glue such as navigation, footer, anchors, CTA destinations, and section ordering.
- Keep structural choices separate from raw content and reusable visual rules.

Example mapping style:

```md
# Homepage Map

- section: hero
  content: sections/hero.md
  component: marketing-hero
  variant: split-copy-organic-image
  design-system: wave-marketing

- section: services-overview
  content: sections/services-overview.md
  component: service-list
  variant: icon-row-list
  design-system: wave-marketing

- section: contact
  content: sections/contact.md
  component: contact-card-grid
  variant: no-form
  design-system: wave-marketing
```

## Current Recommended Roadmap

1. Complete: Extract `docs/design-system/wave-marketing/` from the Stitch visual source.
2. Complete: Create `docs/website/site.md` and section markdown files from `client_brief.md`.
3. Complete: Create `docs/website/page-map.md` to connect sections to design-system components.
4. Next: Review all docs for source-of-truth conflicts, fake content, missing assets, and unresolved placeholders.
5. After approval: create an implementation plan for the static site.
6. Implement the static website from the docs, not directly from Stitch or the raw brief.

## Current Status

The three-layer documentation stack is in place and verified:

- Layer 1 design system: `docs/design-system/wave-marketing/`.
- Layer 2 content specs: `docs/website/site.md` and `docs/website/sections/*.md`.
- Layer 3 component mapping: `docs/website/page-map.md`.

No production website code has been created yet. The next action is a review/approval gate before implementation planning. The required logo and Jana/contact photo asset gates are resolved.

## Immediate Next Step

Review and approve the documentation stack, then choose the planning route:

1. `writing-plans`: create a single implementation plan for building the static website. Recommended for this project because it is one small static site and should be implemented as one coherent build.
2. `spec-to-linear`: convert the spec stack into Linear project/issues. Use this only if the work should be split across multiple people or tracked as separate tickets.

Before implementation starts, choose the static build stack and hosting/deployment target. Social links can remain omitted until final URLs exist.

## Open Inputs Before Implementation

- Final social profile URLs, if social links should appear.
- Hosting/deployment target for `www.wavemarketing.cz`.

## Implementation Plan

- Selected static build stack: Astro static site.
- Plan path: `docs/superpowers/plans/2026-06-12-wave-marketing-static-site.md`.
- Plan scope: build the one-page static website from the three-layer docs and extracted assets.

## Resolved Production Assets

- Logo: `public/assets/wave-marketing-logo.png`.
- Jana/contact photo: `public/assets/jana-skalnikova-photo.png`.

## Asset Extraction Notes

- The logo and Jana/contact photo were extracted from the approved Stitch visual source after user confirmation that they are real client assets.
- Other Stitch-hosted imagery remains excluded from production unless explicitly approved later.

## Step Log

### 2026-06-12

- Confirmed the site is intended to become canonical `www.wavemarketing.cz`.
- Read `client_brief.md` and identified it as the content source of truth.
- Confirmed Stitch is the visual source of truth.
- Established conflict rules between the brief and Stitch.
- Switched `gcloud` active project to `prudicz` and set ADC quota project to `prudicz` so Stitch MCP access works.
- Inspected Stitch project `WAVE Marketing Design System` and screen `Kontakt | WAVE marketing (Updated Portfolio)`.
- Identified a content conflict: Stitch contains fake/example references, while the brief says references cannot be used yet.
- Decided to hide references for launch.
- Decided on a one-page launch website.
- Decided not to include a contact form for launch.
- Decided to omit/disable social links until real URLs exist.
- Decided only verified real production assets may be used.
- Decided logo and Jana/contact photo must be supplied before implementation.
- Refined the production model into three layers: design system, section specs, and widget/component mapping.
- Started Layer 1 design-system extraction from the confirmed Stitch screen.
- Confirmed target package path `docs/design-system/wave-marketing/`.
- Confirmed no existing design-system package conflict exists at that path.
- Prepared design-system package decisions for review before writing final package files.
- Approved and wrote the Layer 1 design-system package with five canonical files.
- Verified the package files, required sections, manifest structure, token groups, fixture sections, and color-token swatches.
- Started Layer 2 content specification from `client_brief.md`.
- Created `docs/website/site.md` for site-level content architecture, launch navigation, omissions, SEO basics, and required inputs.
- Created section content specs under `docs/website/sections/` for hero, intro, services overview, cooperation process, contact, and footer.
- Verified the Layer 2 files contain no placeholder markers and record key launch omissions and contact facts.
- Started Layer 3 widget/component mapping.
- Created `docs/website/page-map.md` to connect content sections to design-system component contracts and variants.
- Verified the page map references existing files, includes required component mappings and anchors, records launch exclusions, and contains no placeholder markers.
- Confirmed the Stitch logo and Jana/contact photo are approved production assets.
- Extracted `public/assets/wave-marketing-logo.png` and `public/assets/jana-skalnikova-photo.png`.
- Verified both extracted files are non-empty PNG assets.
- Selected Astro as the static build stack.
- Created implementation plan `docs/superpowers/plans/2026-06-12-wave-marketing-static-site.md`.

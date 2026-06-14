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

- Reference content is hidden for launch. The approved `Reference` nav item links to `Jak probíhá spolupráce` (`#spoluprace`) and must not introduce fake case studies, logos, testimonials, metrics, or an empty reference section.
- Launch format is a one-page website with sections, not separate static pages.
- No contact form for launch. Contact will use direct phone/email actions only.
- Social profile icons/links were omitted until real URLs existed. The supplied Facebook, Instagram, and LinkedIn URLs are now approved for header/offcanvas rendering. No `#` placeholder links in production.
- Only verified real assets may be used in production.
- Logo and Jana/contact photo were approved from Stitch and extracted into `public/assets/`.
- The hero collaboration image was approved from Stitch project `5807734643959771855`, screen/node `13738335041884507219`, and extracted into `public/assets/`.
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

The Astro static site has been implemented from the documentation stack and extracted production assets. Current refinement work should update the canonical design-system and website specs first, then mirror those decisions in implementation.

## Immediate Next Step

Review and approve the documentation stack, then choose the planning route:

1. `writing-plans`: create a single implementation plan for building the static website. Recommended for this project because it is one small static site and should be implemented as one coherent build.
2. `spec-to-linear`: convert the spec stack into Linear project/issues. Use this only if the work should be split across multiple people or tracked as separate tickets.

Header social links are approved for launch using the supplied Facebook, Instagram, and LinkedIn URLs.

## Refinement Decisions

- Lead and intro paragraphs should use a shared `lead` typography pattern: larger than standard body copy, `--ds-font-weight-light` (`300`), 20px expressed as `1.25rem`, and relaxed leading. Standard body copy remains `--ds-font-weight-regular` (`400`), while UI labels/buttons should use semibold/medium tokens instead of hard-coded heavy weights where possible.
- Button variants are named intentionally: primary is the warm brown filled CTA, secondary is the deep teal filled CTA, and tertiary is the white/surface CTA. The hero's second button uses the tertiary variant; Jana's contact phone CTA uses the secondary deep teal variant with label `Zavolejte Janě`.
- Header logo refinement: keep the centered split navigation but reduce the logo to 72px tall on desktop and 48px tall on mobile so it no longer dominates the header.
- Hero popup refinement: add the approved Stitch-style floating growth card over the desktop hero visual with label `Růst tržeb`, value `+124%`, and icon `trending_up`; omit it on mobile with the hero visual.
- Contact refinement: show `+420 605 461 440` under Jana's `CEO & Strategist` role, stack the email address below `Napište nám`, use `--ds-radius-2xl` for contact bento cards, and replace the mobile dropdown with a right-side offcanvas menu.
- Process visual refinement: step 3 `Návrh řešení` uses the approved local solution proposal workshop image generated for this site, stored locally at `public/assets/wave-marketing-process-solution-proposal.jpg`.
- Section order refinement: show `S čím vám pomůžeme rozvlnit vody internetu?` before the process section, then place the contact conversion area before `Kdo jsme` so `Kdo jsme` is the final main content section. Mobile menu offcanvas must be rendered outside the sticky glass header shell so it starts at the viewport top.
- Wave divider decision: keep the hero-to-services divider in the original Stitch-style layered wave with a wavy top edge and straight lower closure; remove the bottom divider before contact so `Kdo jsme` flows directly into the contact conversion area.
- Responsive responsibility decision: responsive refinement must explicitly track where mobile and desktop have different section or component responsibilities, such as when a desktop visual slot becomes a mobile background treatment or is omitted entirely, instead of treating responsive work as spacing changes only.
- Mobile hero refinement: remove the mobile-only decorative gradient background, keep the desktop hero visual omitted on mobile, and increase the mobile hero headline so the opening message keeps enough weight without the background treatment.
- Header behavior refinement: add active section tracking for the one-page navigation so desktop and mobile/offcanvas links reflect the current scroll section with the active-link treatment and `aria-current="page"`.
- Intro motion refinement: animate the desktop `Kdo jsme` ribbon-wave with a slow, subtle breathing movement only; keep the mobile decorative panel omitted and disable non-essential motion for reduced-motion preferences.

## Open Inputs Before Implementation

- Additional social-link placements, if socials should appear outside the header/offcanvas.
- Hosting/deployment target for `www.wavemarketing.cz`.

## Implementation Plan

- Selected static build stack: Astro static site.
- Plan path: `docs/superpowers/plans/2026-06-12-wave-marketing-static-site.md`.
- Plan scope: build the one-page static website from the three-layer docs and extracted assets.
- Before implementation continues, create a root `AGENTS.md` file so future agents get the project-specific rules without rediscovering them.

## Testing Approach Note

Tests should exist, but their main purpose is to keep source-of-truth content and production constraints stable rather than to overtest visual styling.

- Use lightweight JavaScript/Vitest tests for content and configuration invariants.
- Tests should verify that generated or copied site data keeps the approved facts from `client_brief.md`, `docs/website/`, `docs/website/page-map.md`, and `docs/design-system/wave-marketing/`.
- Tests should guard important launch constraints: no fake references, no contact form, no placeholder social links, correct contact details, correct production asset paths, expected navigation labels, and expected section/component mapping.
- A reusable test template or skill-derived checklist may be useful so future static-site projects can generate similar content-invariant tests from their docs.
- Visual finish, responsive polish, spacing feel, image treatment, and animation details should be verified mostly through browser review and `npm run build`, not brittle snapshot-style tests.

## Local Development Note

- Vite dev server polling is enabled in `astro.config.mjs` because this project is commonly run from `/app/www-wavemarketing-cz`, where filesystem events can be unreliable in container or remote-mounted environments. Keep `vite.server.watch.usePolling: true` so CSS and Astro component style changes refresh automatically and do not appear as stale CSS in the browser.

## Implementation Breakdown Note

The implementation plan should divide the website build into clear work phases instead of treating it as one undifferentiated build:

1. `brut build`: rough first pass that gets the complete page structure, content, assets, anchors, and Astro project wiring in place.
2. `component specifics`: refine each reusable component against the design-system contracts, including header, hero, service blocks, process section, contact blocks, footer, buttons, and image treatments.
3. `responsive specifics`: tune the layout and spacing for mobile, tablet, and desktop breakpoints instead of relying only on the desktop design.
4. `detail finish`: final polish pass for typography, spacing, color accuracy, hover/focus states, accessibility, SEO metadata, and production cleanup.
5. `maybe movable parts`: identify any parts that should remain easy to reorder, swap, or extract later, such as section order, repeated service items, navigation links, and asset references.

## Resolved Production Assets

- Logo: `public/assets/wave-marketing-logo.png`.
- Jana/contact photo: `public/assets/jana-skalnikova-photo.png`.
- Hero collaboration image: `public/assets/wave-marketing-hero-collaboration.png`.

## Asset Extraction Notes

- The logo and Jana/contact photo were extracted from the approved Stitch visual source after user confirmation that they are real client assets.
- Other Stitch-hosted imagery remains excluded from production unless explicitly approved later.
- Production code must reference the local hero asset, not the original Stitch-hosted URL.

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

### 2026-06-13

- Implemented the Astro static site from the approved documentation stack and extracted assets.
- Confirmed the global lead/intro paragraph typography should be larger and use font weight `300`.
- Recorded lead typography as a reusable design-system token pattern and mirrored it in the site CSS and lead-bearing homepage sections.
- Refined the lead paragraph size so both desktop and mobile/default lead tokens resolve to `1.25rem` instead of `1.125rem`.
- Approved redesigning the `Kdo jsme` intro section as a split editorial wave panel inspired by the Stitch reference, while omitting unapproved metric tiles and keeping the visual treatment inside the WAVE design system.

### 2026-06-14

- Approved subtle breathing motion for the desktop `Kdo jsme` local ribbon-wave SVG, with reduced-motion handling and no changes to content, assets, or mobile layout.
- Reverted the `Kdo jsme` motion direction from actual wave drift back to the previous subtle breathing animation after the drift version did not work as intended.

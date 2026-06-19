# WAVE Marketing Workflow

This file records how to work on the WAVE Marketing project. Update it when the process changes, not for ordinary design/content decisions.

## Three-Layer Production Model

### Layer 1: Design System

Purpose: define a reusable visual contract from the approved visual source.

Path:

```text
docs/design-system/
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

### Layer 2: Content And Section Specs

Purpose: convert `client_brief.md` into structured content files without visual styling decisions.

Path:

```text
docs/site-content/
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

- Define site content inventory and section content.
- Store section purpose, final or approved Czech copy, CTA labels, links, contact facts, and SEO notes.
- Keep content independent from colors, fonts, layout measurements, and component styling.
- Explicitly record omitted launch content, especially references and social links.

### Layer 3: Widget And Component Mapping

Purpose: bridge content sections to reusable components/widgets.

Path:

```text
docs/site-content/page-map.md
```

Responsibilities:

- Map each content section to a component contract from the design system.
- Choose component variants per section.
- Define page-level glue such as render order, navigation routing, footer, anchors, CTA destinations, and component mapping.
- Keep structural choices separate from raw content and reusable visual rules.

## Docs-First Workflow

- Make changes by editing the existing source-of-truth files, not by adding side specs that bypass them.
- For content changes, update `docs/site-content/` first, then mirror the approved change in `src/data/site.ts` or components.
- For visual or component-pattern changes, update `docs/design-system/` first, then mirror the approved change in `src/styles/design-system.css` and components.
- For section ordering, navigation, anchors, or component responsibilities, update `docs/site-content/page-map.md` first.
- After meaningful durable cross-cutting decisions, update `docs/decisions.md` and the relevant canonical file.
- Update `docs/status.md` for current open inputs, resolved assets, or active phase changes.
- Update `docs/history.md` only when a chronological audit trail is useful.

## Implementation Phases

Use these phases when planning or reviewing remaining work:

1. `brut build`: complete page structure, content, assets, anchors, and Astro wiring.
2. `component specifics`: refine reusable components against the design-system contracts.
3. `responsive specifics`: tune mobile, tablet, and desktop behavior.
4. `detail finish`: polish typography, spacing, color accuracy, focus/hover states, accessibility, SEO, and production cleanup.
5. `maybe movable parts`: keep reorderable or reusable areas easy to change later, especially sections, service items, nav links, and asset references.

## Testing Approach

Specs are the source of truth. Tests must not become a second requirements layer.

- Tests may be absent while the canonical specs are being refined.
- When tests exist, they should validate one of two things only: spec completeness or implementation conformance.
- Spec-completeness tests should check whether the source-of-truth documents contain the minimum required structure to implement from: sections, anchors, asset gates, component mappings, launch exclusions, and no placeholders.
- Implementation-conformance tests should check whether the Astro site follows approved specs: required sections exist, approved content data is used, local assets exist, forbidden launch content is absent, contact form remains omitted, and no placeholder or remote Stitch URLs enter production.
- Tests should not define visual taste, exact CSS, class names, animation declarations, grid measurements, or component internals.
- Visual finish, responsive polish, spacing feel, image treatment, and animation details should be verified mostly through browser review and `npm run build`.

Future testing step: after the canonical specs are complete and stable, add a small validator suite split into spec-completeness checks and implementation-conformance checks. Generate or maintain those tests from the docs so changing requirements starts in the specs, not in tests.

## Local Development Note

- Vite dev server polling is enabled in `astro.config.mjs` because this project is commonly run from `/app/www-wavemarketing-cz`, where filesystem events can be unreliable in container or remote-mounted environments. Keep `vite.server.watch.usePolling: true` so CSS and Astro component style changes refresh automatically and do not appear as stale CSS in the browser.

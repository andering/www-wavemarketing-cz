# WAVE Marketing Agent Instructions

This repository contains the static production website for `www.wavemarketing.cz`. Keep implementation decisions traceable to the approved documentation stack.

## Source Of Truth

- Content source: `client_brief.md` and `docs/site-content/`.
- Visual source: `docs/design-system/wave-marketing/`.
- Section/component mapping: `docs/site-content/page-map.md`.
- Production roadmap and decisions: `docs/website-production-roadmap.md`.
- There is no separate active side-spec or implementation-plan directory; keep durable requirements in the source-of-truth files above.

When these sources conflict, follow the rules in `docs/website-production-roadmap.md`. If the conflict is ambiguous, ask before deciding.

## Project Rules

- Do not invent production content.
- Do not add references, case studies, client logos, testimonials, fake metrics, or a `Reference` nav item unless the docs are explicitly updated first.
- Do not add a contact form for launch.
- Do not add social links or placeholder `#` links until final URLs are supplied.
- Do not use Stitch-hosted images as production assets unless the user confirms they are real client assets.
- Use only approved production assets under `public/assets/` unless a new asset gate is resolved.
- Keep the site one static Czech homepage unless the roadmap is changed first.

## Docs-First Workflow

- Make changes by editing the existing source-of-truth files, not by adding side specs that bypass them.
- For content changes, update `docs/site-content/` first, then mirror the approved change in `src/data/site.ts` or components.
- For visual or component-pattern changes, update `docs/design-system/wave-marketing/` first, then mirror the approved change in `src/styles/design-system.css` and components.
- For section ordering, navigation, anchors, or component responsibilities, update `docs/site-content/page-map.md` first.
- After meaningful decisions, update `docs/website-production-roadmap.md`.

## Implementation Phases

Use these phases when planning or reviewing remaining work:

1. `brut build`: complete page structure, content, assets, anchors, and Astro wiring.
2. `component specifics`: refine reusable components against the design-system contracts.
3. `responsive specifics`: tune mobile, tablet, and desktop behavior.
4. `detail finish`: polish typography, spacing, color accuracy, focus/hover states, accessibility, SEO, and production cleanup.
5. `maybe movable parts`: keep reorderable or reusable areas easy to change later, especially sections, service items, nav links, and asset references.

## Testing And Verification

- The canonical docs are the source of truth; tests must not introduce product, content, or design requirements that are absent from those docs.
- Tests may be absent while the source-of-truth stack is being refined. When present, they should validate spec completeness and implementation conformance, not define requirements themselves.
- Tests should protect high-risk approved facts and launch constraints, not visual taste, exact CSS, class names, or component internals.
- Do not use brittle visual snapshots for responsive polish or final visual feel; use browser review for that.
- Before claiming implementation work is complete, run `npm run test` and `npm run build`.
- For markdown-only documentation edits, inspect the relevant diff before summarizing the change.

## Tech Stack

- Astro static site.
- TypeScript.
- CSS variables from the WAVE Marketing design-system tokens.
- Vitest for lightweight invariant checks.

## Current Launch Constraints

- Canonical target: `www.wavemarketing.cz`.
- Approved production assets: `public/assets/wave-marketing-logo.png`, `public/assets/jana-skalnikova-photo.png`, `public/assets/wave-marketing-hero-collaboration.png`, and `public/assets/wave-marketing-process-solution-proposal.jpg`.
- Primary conversion: direct phone or email contact.
- Open input: final social profile URLs, if social links should appear later.
- Open input: hosting/deployment target.

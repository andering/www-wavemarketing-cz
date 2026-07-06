# WAVE Marketing Agent Instructions

This repository contains the static production website for `www.wavemarketing.cz`. Keep implementation decisions traceable to the approved documentation stack.

## Source Of Truth Index

- Content source: `client_brief.md` and `docs/site-content/`.
- Visual source: `docs/design-system/`.
- Section/component mapping: `docs/site-content/page-map.md`.
- Durable cross-cutting production decisions: `docs/decisions.md`.
- Process and implementation workflow: `docs/workflow.md`.
- Current state, open inputs, launch constraints, and resolved assets: `docs/status.md`.
- Chronological audit trail: `docs/history.md`.
- There is no separate active side-spec or implementation-plan directory; keep durable requirements in the source-of-truth files above.

When these sources conflict, follow the source-of-truth rules in `docs/decisions.md`. If the conflict is ambiguous, ask before deciding.

## Project Rules

- Do not invent production content.
- Do not add references, case studies, client logos, testimonials, fake metrics, or a `Reference` nav item unless the docs are explicitly updated first.
- Do not add unapproved contact forms or the full client questionnaire for launch; the approved contact form is the minimal backend-backed form documented in the canonical specs.
- Do not add new social-link placements or placeholder `#` links unless final URLs and placements are approved in the docs.
- Do not use Stitch-hosted images as production assets unless the user confirms they are real client assets.
- Use only approved production assets. Transformable raster assets should live under `src/assets/` for Astro image processing unless a source-of-truth asset gate says otherwise; assets that intentionally bypass processing may remain under `public/assets/`.
- Keep the launch scope to the approved Czech homepage, supporting privacy/cookies page, inline contact thank-you state, and contact API endpoint unless `docs/decisions.md` and the relevant content specs are changed first.

## Docs-First Workflow

- Make changes by editing the existing source-of-truth files, not by adding side specs that bypass them.
- For content changes, update `docs/site-content/` first, then mirror the approved change in `src/data/site.ts` or components.
- For visual or component-pattern changes, update `docs/design-system/` first, then mirror the approved change in `src/styles/design-system.css` and components.
- For section ordering, navigation, anchors, or component responsibilities, update `docs/site-content/page-map.md` first.
- After meaningful durable cross-cutting decisions, update `docs/decisions.md` and the relevant canonical spec.
- For process changes, update `docs/workflow.md`.
- For open inputs, current state, launch constraints, or resolved assets, update `docs/status.md`.
- For audit-only chronology, update `docs/history.md`.

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
- Approved production assets: `public/assets/wave-marketing-logo.svg`, logo icon derivatives in `public/` and `public/assets/`, `src/assets/jana-skalnikova-photo.png`, `src/assets/wave-marketing-hero-collaboration.png`, and `src/assets/wave-marketing-process-solution-proposal.jpg`.
- Primary conversion: low-friction contact by phone, email, or the approved simplified contact form.
- Contact form: approved only as a minimal backend-backed form using Cloudflare Pages Functions, Cloudflare Turnstile, Resend email delivery, and inline thank-you replacement after successful submission.
- Cookie consent: approved using `vanilla-cookieconsent`, GTM container `GTM-WMJVN6WZ`, and denied-by-default optional categories.
- Open input: additional social-link placements, if socials should appear outside the header/offcanvas.
- Open input: hosting/deployment target.

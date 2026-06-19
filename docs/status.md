# WAVE Marketing Status

This file tracks current state, open inputs, and resolved assets for active work. Update it when the practical state of the project changes.

## Current Status

The three-layer documentation stack is in place and verified:

- Layer 1 design system: `docs/design-system/`.
- Layer 2 content specs: `docs/site-content/site.md` and `docs/site-content/sections/*.md`.
- Layer 3 component mapping: `docs/site-content/page-map.md`.

The Astro static site has been implemented from the documentation stack and extracted production assets. Current refinement work should update the canonical design-system and site specs first, then mirror those decisions in implementation.

## Current Launch Constraints

- Canonical target: `www.wavemarketing.cz`.
- Primary conversion: direct phone or email contact.
- Site format: one static Czech homepage.
- Contact form: omitted for launch.
- References, case studies, client logos, testimonials, fake metrics, and placeholder links: omitted for launch.

## Open Inputs

- Additional social-link placements, if socials should appear outside the header/offcanvas.
- Hosting/deployment target for `www.wavemarketing.cz`.
- Preferred privacy/GDPR page content if legal footer links are required.

## Resolved Production Assets

- Logo: `public/assets/wave-marketing-logo.png`.
- Jana/contact photo: `public/assets/jana-skalnikova-photo.png`.
- Hero collaboration image: `public/assets/wave-marketing-hero-collaboration.png`.
- Process solution proposal image: `public/assets/wave-marketing-process-solution-proposal.jpg`.

## Asset Extraction Notes

- The logo and Jana/contact photo were extracted from the approved Stitch visual source after user confirmation that they are real client assets.
- Other Stitch-hosted imagery remains excluded from production unless explicitly approved later.
- Production code must reference the local hero asset, not the original Stitch-hosted URL.

## Tech Stack

- Astro static site.
- TypeScript.
- CSS variables from the WAVE Marketing design-system tokens.
- Vitest for lightweight invariant checks.

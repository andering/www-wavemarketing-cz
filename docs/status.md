# WAVE Marketing Status

This file tracks current state, open inputs, and resolved assets for active work. Update it when the practical state of the project changes.

## Current Status

The three-layer documentation stack is in place and verified:

- Layer 1 design system: `docs/design-system/`.
- Layer 2 content specs: `docs/site-content/site.md`, `docs/site-content/sections/*.md`, and `docs/site-content/privacy-cookies.md`.
- Layer 3 component mapping: `docs/site-content/page-map.md`.

The Astro static site has been implemented from the documentation stack and extracted production assets. Current refinement work should update the canonical design-system and site specs first, then mirror those decisions in implementation.

## Deployment

- Cloudflare Pages project: `www-wavemarketing-cz`, connected directly to GitHub repository `andering/www-wavemarketing-cz` with `main` as its production branch. No repository GitHub Actions workflow is used for deployment.
- Build configuration: `npm ci && npm run build`, publishing `dist/`. Cloudflare Pages Functions are enabled.
- Custom domain: `www.wavemarketing.cz` is active and validated.
- Latest successful production deployment: commit `1e81764d8f95643a80f8cee0c6f97382b2d28f06` on 2026-07-08.
- Current public-access state: `www.wavemarketing.cz` is publicly reachable. The Cloudflare Access application was removed on 2026-08-09; run a live smoke test before treating the launch as complete.

## Current Launch Constraints

- Canonical target: `www.wavemarketing.cz`.
- Primary conversion: low-friction contact by phone, email, or the approved simplified contact form.
- Site format: one Czech homepage plus one supporting privacy/cookies legal-information page and a Cloudflare Pages Function for contact form submissions.
- Contact form: approved for launch only as a minimal backend-backed form using Cloudflare Pages Functions, Cloudflare Turnstile, Resend email delivery, and inline thank-you replacement after successful submission.
- References, case studies, client logos, testimonials, fake metrics, and placeholder links: omitted for launch.
- Cookie consent: approved for launch using `vanilla-cookieconsent`, GTM container `GTM-WMJVN6WZ`, and denied-by-default optional categories.

## Open Inputs

- Additional social-link placements, if socials should appear outside the header/offcanvas.
- Client/legal review of `docs/site-content/privacy-cookies.md` before treating the privacy/cookies page as final legal copy.
- Future non-GTM tracking tools, if any, must be added to the consent configuration and GTM setup before launch use.
- Verify the production contact form with a live submission after public access is enabled. Pages secret values are intentionally unreadable through the API, so this must confirm the Resend and Turnstile configuration end to end.
- CDN image features and cache/compression policy for the Cloudflare Pages production setup.

## Resolved Production Assets

- Logo: `public/assets/wave-marketing-logo.svg` for rendered site logo.
- Logo icon derivatives: `public/favicon.ico`, `public/assets/wave-marketing-icon-32.png`, `public/assets/wave-marketing-apple-touch-icon.png`, and `public/assets/wave-marketing-icon-192.png` for favicon and app-icon compatibility.
- Jana/contact photo: `src/assets/jana-skalnikova-photo.png`, rendered through Astro's build-time image pipeline.
- Hero collaboration image: `src/assets/wave-marketing-hero-collaboration.png`, rendered through Astro's build-time image pipeline.
- Process solution proposal image: `src/assets/wave-marketing-process-solution-proposal.png`, rendered through Astro's build-time image pipeline.

## Asset Extraction Notes

- The original launch logo and Jana/contact photo were extracted from the approved Stitch visual source after user confirmation that they are real client assets.
- The rendered site logo now uses the verified vector asset from `/app/logo.zip`; ICO/PNG derivatives generated from that same logo source are used only where browser or platform icon compatibility benefits from raster assets.
- The process solution proposal image was replaced with the user-supplied generated source `/app/Gemini_Generated_Image_bovyvrbovyvrbovy.png` and stored as `src/assets/wave-marketing-process-solution-proposal.png` for Astro optimization.
- Other Stitch-hosted imagery remains excluded from production unless explicitly approved later.
- Production code must reference the local hero asset, not the original Stitch-hosted URL.
- Transformable raster images are stored in `src/assets/` so Astro can generate responsive AVIF/WebP outputs. CDN delivery may be layered on later, but the repository build should not depend on CDN image resizing for launch performance.

## Tech Stack

- Astro static site.
- TypeScript.
- CSS variables from the WAVE Marketing design-system tokens.
- Vitest for lightweight invariant checks.

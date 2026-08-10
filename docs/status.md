# WAVE Marketing Status

This file tracks current state, open inputs, and resolved assets for active work. Update it when the practical state of the project changes.

## Current Status

The three-layer documentation stack is in place and verified:

- Layer 1 design system: `docs/design-system/`.
- Layer 2 content specs: `docs/site-content/site.md`, `docs/site-content/sections/*.md`, and `docs/site-content/privacy-cookies.md`.
- Layer 3 component mapping: `docs/site-content/page-map.md`.

The Astro static site has been implemented from the documentation stack and extracted production assets. Canonical docs describe approved production state and behavior; plans and task trackers are derived execution aids only. Current refinement work must update the owning canonical docs first, then mirror those decisions in implementation and live configuration.

## Deployment

- Cloudflare Pages project: `www-wavemarketing-cz`, connected directly to GitHub repository `andering/www-wavemarketing-cz` with `main` as its production branch. No repository GitHub Actions workflow is used for deployment.
- Build configuration: `npm ci && npm run build`, publishing `dist/`. Cloudflare Pages Functions are enabled.
- Custom domain: `www.wavemarketing.cz` is active and validated.
- Security-remediated production deployment: commit `2b017b21cd8b11d6f9e54706bef41e78e25c846c` on 2026-08-10.
- Current public-access state: `www.wavemarketing.cz` is publicly reachable. The Cloudflare Access application was removed on 2026-08-09; run a live smoke test before treating the launch as complete.

## Current Launch Constraints

- Canonical target: `www.wavemarketing.cz`.
- Primary conversion: low-friction contact by phone, email, or the approved simplified contact form.
- Site format: one Czech homepage plus one supporting privacy/cookies legal-information page and a Cloudflare Pages Function for contact form submissions.
- Contact form: approved for launch only as a minimal backend-backed form using Cloudflare Pages Functions, Cloudflare Turnstile, Resend email delivery, and inline thank-you replacement after successful submission.
- References, case studies, client logos, testimonials, fake metrics, and placeholder links: omitted for launch.
- Cookie consent: approved for launch using `vanilla-cookieconsent`, GTM container `GTM-WMJVN6WZ`, and denied-by-default optional categories.

## Analytics Configuration

- GA4 property: `properties/542330532` (`wavemarketing.cz`) in account `accounts/398526472` (`prudic.cz`).
- Web stream: `15118334044` for `https://www.wavemarketing.cz` with Measurement ID `G-V1DT4J144T`.
- GTM container `GTM-WMJVN6WZ` version 2 and the corresponding site source are live. Production queues Google consent commands in the required argument shape and loads GTM only on canonical `www.wavemarketing.cz`; live browser verification confirmed that denied analytics persists across reload without GA cookies, GA scripts, or collection requests.

## Security Remediation State

- A read-only source, dependency, browser, TLS, and Cloudflare configuration audit was completed on 2026-08-09.
- Consent: production queues Google consent commands in the required argument shape and loads GTM only on canonical `www.wavemarketing.cz`. Live browser verification confirmed denied persistence across reload with no GA cookies, GA scripts, or collection requests; production grant/revocation behavior is covered by the candidate and requires routine monitoring.
- Contact endpoint: production enforces the canonical hostname and approved media types, streams a 16 KiB body limit before parsing, validates Turnstile token length/action/hostname, and applies cancellable 10-second Siteverify and Resend REST timeouts. Live smoke checks confirmed canonical JSON rejection with `415` and `403` alias rejection before Turnstile or email delivery. A valid end-to-end submission remains an explicit post-launch check.
- Response headers: Cloudflare serves one-year HSTS without subdomains/preload and `X-Content-Type-Options: nosniff`. Production static responses now add CSP, anti-framing protection, `Referrer-Policy`, and `Permissions-Policy`; Function responses apply their equivalent API-safe header baseline.
- Cloudflare zone: Always Use HTTPS is on; HSTS is enabled with `max-age=31536000`, no `includeSubDomains`, no preload, and `nosniff`; Bot Fight Mode remains enabled. Rate-limit ruleset `480c458e0b2548e0a027c05acbc17dab` has one enabled rule, `b45c1c5077d1450f9fb1b91aeede3998`, that blocks a client after 2 `POST` requests to canonical `www.wavemarketing.cz` in 10 seconds for the plan-supported 10-second mitigation window. The host-wide `POST` match closes Cloudflare Pages path-normalization variants without affecting `GET` or static traffic.
- Public deployment aliases: `www-wavemarketing-cz.pages.dev` and the production deployment URL remain outside the `wavemarketing.cz` zone rule but now reject contact requests at the Function boundary; live safe-request checks returned `403`.
- Toolchain: production uses Astro `7.2.0`, Vitest `4.1.10`, `@astrojs/check` `0.9.10`, and TypeScript `5.9.3`; the unused Resend SDK dependency is removed. A clean `npm ci`, serialized `npm run build`, all 89 tests, `npm audit`, and `npm audit --omit=dev` passed on Node `22.23.2`; both audit scopes report zero vulnerabilities.
- Remaining configuration observation: the zone minimum TLS version is still `1.0`; raising it was not part of the approved remediation baseline and remains a separate hardening decision.
- Approved target state is defined in `docs/decisions.md`, `docs/site-content/site.md`, and `docs/site-content/page-map.md`. This section records the factual implementation and deployment snapshot.

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

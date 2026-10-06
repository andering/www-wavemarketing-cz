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
- Live configuration verified on 2026-10-06: GitHub integration and production deployments are enabled for `main`; preview deployments are disabled. The latest five production deployments all succeeded with trigger `github:push` and Functions enabled.
- Latest production deployment at that verification: `039efb5f-2045-4d3a-ad2f-1437cd22c4c8`, commit `2ffde1e808179f91ac0f18660fb7fb57edb08eac`, completed on 2026-09-30 at 01:06:08 UTC. It matches the project's canonical deployment; the custom domain remains active with active validation and verification.
- Repository inspection on 2026-10-06 found no tracked Terraform configuration, deployment utility dependency, deployment script, or GitHub Actions workflow. Routine delivery uses native Pages Git integration as defined in `docs/workflow.md`.
- Security-remediated production deployment: commit `2b017b21cd8b11d6f9e54706bef41e78e25c846c` on 2026-08-10.
- Google Ads site-preparation deployment: commit `b6f8a8c837a1206aec07f6ae77c433650a9c7d4b`, Pages deployment `42e719ee-12a4-4a34-8f8d-8b63f02238b5`, succeeded on 2026-09-30 with Functions preserved (`uses_functions: true`). Live browser verification confirmed the updated CSP and Ads disclosure on the canonical domain.
- Final verified Google Ads CSP deployment: commit `d1fb3a05cc3fb87832aa09e105798508c66994af`, Pages deployment `8ec85012-2858-4678-b638-73cbede6314c`, succeeded on 2026-09-30 at 01:02:49 UTC with Functions preserved. Browser verification confirmed successful Ads script/collection requests and no CSP violations.
- Current public-access state: `www.wavemarketing.cz` is publicly reachable. The Cloudflare Access application was removed on 2026-08-09; run a live smoke test before treating the launch as complete.

## Current Launch Constraints

- Approved palette refresh: pure white backgrounds throughout the page, sections, header/footer, cards, form fields, and cookie UI; dark gray text, orange CTAs, and green/teal accents use the six supplied brand colors documented in `docs/design-system/`. The follow-up white-background request supersedes the initial pale turquoise surfaces and colored radial washes. This refresh is local and not yet deployed; logo/image assets retain their supplied colors.
- Palette verification: all 88 tests and the production build pass. Browser checks at 1440px and 390px cover the homepage, mobile cookie preferences, and shared legal-page colors. Measured text contrast is 8.45:1 for body copy and 4.90:1 for teal secondary buttons. Primary buttons use near-black text on the exact brand orange (6.25:1), bold body typography, and a 16px minimum including mobile and native form buttons. The dark-orange/white preview was rejected and reverted.

- Canonical target: `www.wavemarketing.cz`.
- Primary conversion: low-friction contact by phone, email, or the approved simplified contact form.
- Site format: one Czech homepage plus one supporting privacy/cookies legal-information page and a Cloudflare Pages Function for contact form submissions.
- Contact form: approved for launch only as a minimal backend-backed form using Cloudflare Pages Functions, Cloudflare Turnstile, Resend email delivery, and inline thank-you replacement after successful submission.
- References, case studies, client logos, testimonials, fake metrics, and placeholder links: omitted for launch.
- Cookie consent: approved for launch using `vanilla-cookieconsent`, GTM container `GTM-WMJVN6WZ`, and denied-by-default optional categories.

## Analytics Configuration

- GA4 property: `properties/542330532` (`wavemarketing.cz`) in account `accounts/398526472` (`prudic.cz`).
- Web stream: `15118334044` for `https://www.wavemarketing.cz` with Measurement ID `G-V1DT4J144T`.
- GTM container `GTM-WMJVN6WZ` version `3` (Google Ads consent-gated base tag) is live. Account `6361842694`, container `256024332`, workspace `3`. Native Google tag `9` configures `AW-18465273250`; trigger `8` matches `cookie_consent_update` only on `www.wavemarketing.cz`; additional consent requires `ad_storage`, `ad_user_data`, and `ad_personalization`. Existing GA4 tags are preserved. The native Google tag uses default firing behavior because the integration does not expose `tagFiringOption`.
- Production browser verification on 2026-09-30: no Ads/GA scripts or collection requests before consent or after necessary-only consent and reload. Granting marketing with analytics denied loaded the Ads script and sent successful Google Ads requests (`www.google.com/rmkt/collect/18465273250/` and `www.google.com/ccm/collect?…tid=AW-18465273250`, HTTP 200); GA4 remained inactive. Subsequently enabling analytics did not add another Ads script, config request, or Ads page view. Revoking optional consent cleared `_gcl_au` and GA cookies and automatically reloaded to an inactive tracking state.
- Live verification identified the Ads viewthroughconversion script on `googleads.g.doubleclick.net` as requiring `script-src` permission in addition to its image/connect permission. The final deployed CSP includes that exact host. Post-fix checks confirmed the Ads script, viewthroughconversion script, remarketing collection, and Ads page-view requests returned HTTP 200, with no CSP violations. Saved marketing-only consent worked after reload; adding analytics consent kept exactly one Ads loader, one viewthroughconversion config request, and one Ads page-view request. Revocation again left only `cc_cookie` and no Ads/GA tracking requests after automatic reload. All 89 tests and the production build passed for the final implementation.
- This installs the Google Ads base tag only. No Google Ads conversion-action label or form-conversion tag was supplied or created; existing GA4 `generate_lead` tracking remains unchanged.

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

- Terms PDF: user-supplied `Obchodní podmínky WAVE marketing s.r.o..pdf`, approved for unchanged publication at `public/assets/obchodni-podminky-wave-marketing.pdf` and linked from the shared footer. This addition is local and has not yet been deployed.
- Logo: `public/assets/wave-marketing-logo.png`, a 512px optimized copy of user-supplied `/app/4.png`, replaces the previous SVG in the header, mobile menu, and Organization metadata. This replacement is local and not yet deployed.
- Logo icon derivatives: `public/favicon.ico` (16/32/48px), `public/assets/wave-marketing-icon-32.png`, `public/assets/wave-marketing-apple-touch-icon.png` (180px), and `public/assets/wave-marketing-icon-192.png`, generated from user-supplied wave-only `/app/1.png`. These replace the former icon artwork, including the privacy/cookies sharing image.
- Jana/contact photo: `src/assets/jana-skalnikova-photo.png`, rendered through Astro's build-time image pipeline.
- Hero collaboration image: `src/assets/wave-marketing-hero-collaboration.png`, rendered through Astro's build-time image pipeline.
- Process solution proposal image: `src/assets/wave-marketing-process-solution-proposal.png`, rendered through Astro's build-time image pipeline.

## Asset Extraction Notes

- The original launch logo and Jana/contact photo were extracted from the approved Stitch visual source after user confirmation that they are real client assets.
- The former vector logo from `/app/logo.zip` is superseded by the supplied `/app/4.png` circular logo and `/app/1.png` wave-only icon. Published PNG/ICO derivatives are pre-optimized, with excess icon whitespace cropped, and intentionally stay in `public/` for stable logo/metadata/icon URLs.
- The process solution proposal image was replaced with the user-supplied generated source `/app/Gemini_Generated_Image_bovyvrbovyvrbovy.png` and stored as `src/assets/wave-marketing-process-solution-proposal.png` for Astro optimization.
- Other Stitch-hosted imagery remains excluded from production unless explicitly approved later.
- Production code must reference the local hero asset, not the original Stitch-hosted URL.
- Transformable raster images are stored in `src/assets/` so Astro can generate responsive AVIF/WebP outputs. CDN delivery may be layered on later, but the repository build should not depend on CDN image resizing for launch performance.

## Tech Stack

- Astro static site.
- TypeScript.
- CSS variables from the WAVE Marketing design-system tokens.
- Vitest for lightweight invariant checks.

# WAVE Marketing History

This file is a chronological audit trail. It is not the first place to look for active requirements; use `docs/decisions.md`, `docs/site-content/`, and `docs/design-system/` for that.

## 2026-06-12

- Confirmed the site is intended to become canonical `www.wavemarketing.cz`.
- Read `client_brief.md` and identified it as the content source of truth.
- Confirmed Stitch is the visual source of truth.
- Established conflict rules between the brief and Stitch.
- Switched `gcloud` active project to `prudicz` and set ADC quota project to `prudicz` so Stitch MCP access works.
- Inspected Stitch project `WAVE Marketing Design System` and screen `Kontakt | WAVE marketing (Updated Portfolio)`.
- Identified a content conflict: Stitch contains fake/example references, while the brief says references cannot be used yet.
- Decided to hide references for launch.
- Decided on a one-page launch site.
- Decided not to include a contact form for launch.
- 2026-07-05: Superseded the earlier no-form launch decision after client input. Approved a minimal backend-backed contact form using Cloudflare Pages Functions, Cloudflare Turnstile, and Resend, with the full six-field questionnaire omitted.
- Decided to omit/disable social links until real URLs exist.
- Decided only verified real production assets may be used.
- Decided logo and Jana/contact photo must be supplied before implementation.
- Refined the production model into three layers: design system, section specs, and widget/component mapping.
- Started Layer 1 design-system extraction from the confirmed Stitch screen.
- Confirmed target package path `docs/design-system/`.
- Confirmed no existing design-system package conflict exists at that path.
- Prepared design-system package decisions for review before writing final package files.
- Approved and wrote the Layer 1 design-system package with five canonical files.
- Verified the package files, required sections, manifest structure, token groups, fixture sections, and color-token swatches.
- Started Layer 2 content specification from `client_brief.md`.
- Created `docs/site-content/site.md` for site-level content architecture, launch navigation, omissions, SEO basics, and required inputs.
- Created section content specs under `docs/site-content/sections/` for hero, intro, services overview, cooperation process, contact, and footer.
- Verified the Layer 2 files contain no placeholder markers and record key launch omissions and contact facts.
- Started Layer 3 widget/component mapping.
- Created `docs/site-content/page-map.md` to connect content sections to design-system component contracts and variants.
- Verified the page map references existing files, includes required component mappings and anchors, records launch exclusions, and contains no placeholder markers.
- Confirmed the Stitch logo and Jana/contact photo are approved production assets.
- Extracted `public/assets/wave-marketing-logo.png` and `public/assets/jana-skalnikova-photo.png`.
- Verified both extracted files are non-empty PNG assets.
- Selected Astro as the static build stack.
- Used an implementation plan during the initial build; active requirements now live only in the canonical source-of-truth docs.

## 2026-06-13

- Implemented the Astro static site from the approved documentation stack and extracted assets.
- Confirmed the global lead/intro paragraph typography should be larger and use font weight `300`.
- Recorded lead typography as a reusable design-system token pattern and mirrored it in the site CSS and lead-bearing homepage sections.
- Refined the lead paragraph size so both desktop and mobile/default lead tokens resolve to `1.25rem` instead of `1.125rem`.
- Approved redesigning the `Kdo jsme` intro section as a split editorial wave panel inspired by the Stitch reference, while omitting unapproved metric tiles and keeping the visual treatment inside the WAVE design system.

## 2026-06-14

- Approved subtle breathing motion for the desktop `Kdo jsme` local ribbon-wave SVG, with reduced-motion handling and no changes to content, assets, or mobile layout.
- Reverted the `Kdo jsme` motion direction from actual wave drift back to the previous subtle breathing animation after the drift version did not work as intended.
- Reverted the shader-inspired `Kdo jsme` flow-line concept back to the previous local ribbon-wave breathing visual after review.
- Approved trying the supplied shader as real WebGL for `Kdo jsme`, scoped to the desktop visual panel with a local static fallback and without adopting the pasted React/shadcn/Tailwind integration instructions.

## 2026-07-05

- Identified follow-up workflow areas that still need to be documented or implemented before launch readiness: SEO workflow, cookie bar workflow, form delivery workflow using Resend, Cloudflare Pages Function handling for form submission, image postprocessing, and CDN-based image delivery.
- Clarified that the Cloudflare script-like form handler is a Cloudflare Pages Function, not Terraform. Terraform may still be considered later only if infrastructure provisioning needs to be automated.
- Implemented the image postprocessing part by moving approved transformable raster assets into `src/assets/` and rendering them through Astro's build-time image pipeline. CDN image delivery remains a hosting/deployment follow-up.
- Added SEO schema and Google rich snippets as a follow-up skill/workflow area to define before launch readiness.

## 2026-07-06

- Approved the new logo source set from `/app/logo.zip` for production use.
- Switched the rendered site logo source of truth to `public/assets/wave-marketing-logo.svg` and recorded ICO/PNG logo icon derivatives for favicon/app-icon compatibility.

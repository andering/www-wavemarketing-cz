# Image Optimization Design

## Goal

Reduce shipped image weight for the WAVE Marketing static site without depending on the final hosting provider.

## Decision

Use Astro's build-time image pipeline for transformable production raster assets. Move the approved hero, process, and Jana/contact images from direct `public/assets` delivery into `src/assets`, import them in their owning components, and render them through `astro:assets` components.

## CDN Role

CDN optimization is a delivery layer, not the source optimization layer. After hosting is chosen, prefer Cloudflare Pages/CDN because the form already uses Cloudflare Pages Functions. Configure compression, caching, and optional image features there, but keep the build output optimized even without CDN image resizing.

## Scope

- Optimize hero and process imagery with responsive AVIF/WebP output.
- Keep the hero eager and high priority on desktop/wider layouts.
- Keep process imagery lazy-loaded.
- Use Astro image metadata to prevent layout shift.
- Keep only approved real client assets; do not introduce new imagery.
- Leave deeper CDN/Terraform provisioning as a later hosting/deployment task.

## Out Of Scope

- No new CDN account configuration in this change.
- No Terraform automation in this change.
- No visual redesign of image crops or section layouts.

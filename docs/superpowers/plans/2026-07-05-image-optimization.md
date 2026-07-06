# Image Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Optimize approved production images with Astro build-time image processing while leaving CDN delivery as a later hosting layer.

**Architecture:** Store transformable approved images under `src/assets` and import them in the components that render them. Use `astro:assets` `<Picture />` for responsive AVIF/WebP content images and keep CDN concerns documented as delivery-only follow-up work.

**Tech Stack:** Astro 6, `astro:assets`, TypeScript, Vitest.

---

### Task 1: Add Conformance Test

**Files:**

- Create: `src/tests/image-optimization.test.ts`

- [ ] **Step 1: Write failing tests that require Astro image pipeline usage**

Create tests that verify the docs name `src/assets`, the hero/process/contact components import from `astro:assets`, and direct production delivery of large raster images from `public/assets` has been removed.

- [ ] **Step 2: Run targeted test and confirm failure**

Run: `npm run test -- src/tests/image-optimization.test.ts`

Expected: failure because current components still use plain `<img>` and `/assets/...` strings.

### Task 2: Update Source-Of-Truth Docs

**Files:**

- Modify: `docs/decisions.md`
- Modify: `docs/status.md`
- Modify: `docs/site-content/site.md`
- Modify: `docs/site-content/page-map.md`
- Modify: `docs/site-content/sections/hero.md`
- Modify: `docs/site-content/sections/cooperation-process.md`
- Modify: `docs/site-content/sections/contact.md`
- Modify: `docs/design-system/DESIGN.md`
- Modify: `AGENTS.md`

- [ ] **Step 1: Resolve the asset gate**

Document that approved transformable raster assets now live under `src/assets` for Astro optimization, while `public/assets` is reserved for assets that intentionally bypass build-time processing.

- [ ] **Step 2: Document CDN as a delivery layer**

Record that CDN image features may be enabled after hosting is chosen, but build-time optimization is required first.

### Task 3: Move Assets And Render Optimized Images

**Files:**

- Move: `public/assets/wave-marketing-hero-collaboration.png` to `src/assets/wave-marketing-hero-collaboration.png`
- Move: `public/assets/wave-marketing-process-solution-proposal.jpg` to `src/assets/wave-marketing-process-solution-proposal.jpg`
- Move: `public/assets/jana-skalnikova-photo.png` to `src/assets/jana-skalnikova-photo.png`
- Modify: `src/components/MarketingHero.astro`
- Modify: `src/components/ProcessSteps.astro`
- Modify: `src/components/ContactCardGrid.astro`
- Modify: `src/data/site.ts`

- [ ] **Step 1: Use `<Picture />` for hero and process images**

Import image metadata and render AVIF/WebP responsive output with appropriate loading priority.

- [ ] **Step 2: Use Astro image rendering for the Jana/contact photo**

Render the avatar through `astro:assets` so it is resized and metadata-backed.

### Task 4: Verify

**Files:**

- Verify all changed files.

- [ ] **Step 1: Run targeted test**

Run: `npm run test -- src/tests/image-optimization.test.ts`

Expected: pass.

- [ ] **Step 2: Run full verification**

Run: `npm run test` and `npm run build`

Expected: both pass. Inspect `dist/_astro` to confirm optimized generated image assets exist and `dist/assets` no longer includes the large moved raster files.

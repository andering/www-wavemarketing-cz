# Header Contact Stitch Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the header/menu and `Pojďme na stejnou vlnu` contact section closer to the approved Stitch reference while preserving WAVE design tokens, launch exclusions, and a desktop 4-column by 2-row contact bento layout.

**Architecture:** Keep current site content and asset sources. Update canonical docs first, then add invariants, then change `SiteHeader.astro` to a desktop split-nav centered-logo header and `ContactCardGrid.astro` to a 4x2 bento contact layout. Jana spans columns 1-2 and rows 1-2; email spans columns 3-4 row 1; availability spans columns 3-4 row 2; company facts stay below. Do not add `Reference`, social icons, a contact form, remote images, or placeholder links.

**Tech Stack:** Astro components, TypeScript site data, WAVE CSS custom properties, Vitest invariant tests.

**Commit Rule:** Do not commit unless the user explicitly asks for a commit.

---

## File Structure

- Modify `docs/design-system/wave-marketing/DESIGN.md`: record the centered logo split-nav and compact contact module guidance.
- Modify `docs/website/page-map.md`: update header/contact layout rules while preserving launch exclusions.
- Modify `docs/website/sections/contact.md`: note compact contact-module treatment.
- Modify `src/tests/site-content.test.ts`: add invariants for header split nav and compact contact module.
- Modify `src/components/SiteHeader.astro`: split approved nav links around a larger centered logo.
- Modify `src/components/ContactCardGrid.astro`: render desktop 4x2 bento layout with Jana, email, availability, and muted facts.

---

### Task 1: Document Approved Header/Contact Treatment

- [ ] Update `docs/design-system/wave-marketing/DESIGN.md` with guidance for a centered-logo split-nav header and compact contact module.
- [ ] Update `docs/website/page-map.md` header/contact rules to mention the approved Stitch-aligned treatment while keeping no references/social/form.
- [ ] Update `docs/website/sections/contact.md` notes to state the contact section uses a compact direct-contact module, not a large grid or form.

### Task 2: Add Failing Invariants

- [ ] Add a test that requires `site-header__nav-group--left`, `site-header__nav-group--right`, centered logo structure, and no `Reference` or social icon markup in `SiteHeader.astro`.
- [ ] Add a test that requires `contact__module`, `contact__person-card`, `contact__quick-actions`, `contact__facts-strip`, approved local Jana photo, and no form/social widget/remote image in `ContactCardGrid.astro`.
- [ ] Run `npm test -- src/tests/site-content.test.ts` and verify it fails on missing new classes.

### Task 3: Implement Header And Contact Components

- [ ] In `SiteHeader.astro`, split `siteContent.navigation` into left nav (`Úvod`, `Naše služby`) and right nav (`Kontakt`) and render the logo centered between them on desktop.
- [ ] Make the desktop logo larger and the header more vertically present, using existing logo asset only.
- [ ] Keep mobile as compact logo plus details menu, styled as a clean pill.
- [ ] In `ContactCardGrid.astro`, render a centered section with one compact person card, phone CTA, email quick action, meeting text, and muted company facts strip.
- [ ] Preserve all approved copy and links from `siteContent.contact`.
- [ ] Run focused tests until green.

### Task 4: Verify

- [ ] Run `npm run test`.
- [ ] Run `npm run build`.
- [ ] Browser verify desktop header: centered logo, split approved nav, no `Reference`, no social icons.
- [ ] Browser verify contact: compact module, local Jana photo, phone/email actions, no form/social widget/remote images.
- [ ] Browser verify mobile: no horizontal overflow and mobile menu remains usable.

---

## Self-Review

- Spec coverage: Header, contact, launch exclusions, docs, tests, and browser verification are covered.
- Placeholder scan: No TODO/TBD placeholders.
- Type consistency: Planned class names match expected invariant names.

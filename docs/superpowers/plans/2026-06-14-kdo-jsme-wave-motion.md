# Kdo Jsme Wave Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add slow, subtle desktop breathing motion to the existing `Kdo jsme` ribbon-wave SVG.

**Architecture:** Keep the existing Astro component and local SVG. Treat the animation as a CSS-only decorative enhancement on `IntroStatement.astro`, protected by the existing content/design invariant test. No JavaScript, assets, content, layout, or mobile behavior changes are needed.

**Tech Stack:** Astro component styles, CSS keyframes, Vitest file-content invariants, Astro build.

---

## File Structure

- Modify `src/tests/site-content.test.ts`: extend the existing `keeps the intro section as a metric-free split wave variant` test with animation, stagger, and reduced-motion assertions.
- Modify `src/components/IntroStatement.astro`: add CSS-only breathing animation to `.intro__wave`, tiny staggered movement to the existing `.intro__ribbon` paths, and a `prefers-reduced-motion: reduce` override.
- Do not modify `src/data/site.ts`, SVG path geometry, production assets, section order, or mobile visibility.

### Task 1: Protect The Motion Contract

**Files:**

- Modify: `src/tests/site-content.test.ts:535-578`

- [ ] **Step 1: Add failing invariant assertions**

In `src/tests/site-content.test.ts`, inside the existing `keeps the intro section as a metric-free split wave variant` test, add these assertions after the existing `expect(component).toContain("height: 100%;");` line:

```ts
expect(component).toContain(
  "animation: intro-wave-breathe 12s var(--ds-ease-standard) infinite;",
);
expect(component).toContain("transform-origin: center;");
expect(component).toContain("@keyframes intro-wave-breathe");
expect(component).toContain("@keyframes intro-ribbon-drift");
expect(component).toContain("animation-delay: -4s;");
expect(component).toContain("animation-delay: -8s;");
expect(component).toContain("@media (prefers-reduced-motion: reduce)");
expect(component).toContain("animation: none;");
```

The nearby block should become:

```ts
expect(component).toContain("background: transparent;");
expect(component).toContain("min-height: clamp(280px, 36vw, 460px);");
expect(component).toContain("height: 100%;");
expect(component).toContain(
  "animation: intro-wave-breathe 12s var(--ds-ease-standard) infinite;",
);
expect(component).toContain("transform-origin: center;");
expect(component).toContain("@keyframes intro-wave-breathe");
expect(component).toContain("@keyframes intro-ribbon-drift");
expect(component).toContain("animation-delay: -4s;");
expect(component).toContain("animation-delay: -8s;");
expect(component).toContain("@media (prefers-reduced-motion: reduce)");
expect(component).toContain("animation: none;");
expect(component).not.toContain("min-height: clamp(360px, 50vw, 620px);");
```

- [ ] **Step 2: Run the targeted test to verify it fails**

Run:

```bash
npm run test -- src/tests/site-content.test.ts -t "keeps the intro section as a metric-free split wave variant"
```

Expected: FAIL because `IntroStatement.astro` does not yet contain `intro-wave-breathe`, `intro-ribbon-drift`, staggered delays, or a reduced-motion override for the intro wave.

### Task 2: Add CSS-Only Breathing Motion

**Files:**

- Modify: `src/components/IntroStatement.astro:55-76`

- [ ] **Step 1: Add minimal animation CSS**

In `src/components/IntroStatement.astro`, replace the existing `.intro__wave`, `.intro__ribbon`, and three ribbon modifier rules with this block:

```css
.intro__wave {
  animation: intro-wave-breathe 12s var(--ds-ease-standard) infinite;
  height: 100%;
  margin-left: -28%;
  transform-origin: center;
  width: 150%;
}

.intro__ribbon {
  animation: intro-ribbon-drift 12s var(--ds-ease-standard) infinite;
  filter: drop-shadow(0 20px 26px rgba(0, 59, 61, 0.18));
  transform-origin: center;
}

.intro__ribbon--back {
  animation-delay: -4s;
  fill: url(#intro-ribbon-primary);
}

.intro__ribbon--shadow {
  animation-delay: -8s;
  fill: color-mix(in srgb, var(--ds-color-primary) 84%, #000000);
  opacity: 0.9;
}

.intro__ribbon--front {
  fill: url(#intro-ribbon-secondary);
}

@keyframes intro-wave-breathe {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(-10px) scale(1.018);
  }
}

@keyframes intro-ribbon-drift {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(4px);
  }
}
```

- [ ] **Step 2: Add reduced-motion handling**

In `src/components/IntroStatement.astro`, add this media query before the existing `@media (max-width: 840px)` block:

```css
@media (prefers-reduced-motion: reduce) {
  .intro__wave,
  .intro__ribbon {
    animation: none;
  }
}
```

- [ ] **Step 3: Run the targeted test to verify it passes**

Run:

```bash
npm run test -- src/tests/site-content.test.ts -t "keeps the intro section as a metric-free split wave variant"
```

Expected: PASS.

### Task 3: Full Verification

**Files:**

- Verify: full repository behavior only.

- [ ] **Step 1: Run all tests**

Run:

```bash
npm run test
```

Expected: PASS.

- [ ] **Step 2: Run the production build**

Run:

```bash
npm run build
```

Expected: PASS, including `astro check` and `astro build`.

- [ ] **Step 3: Inspect the final diff**

Run:

```bash
git diff -- docs/design-system/wave-marketing/DESIGN.md docs/website/page-map.md docs/website-production-roadmap.md docs/superpowers/specs/2026-06-14-kdo-jsme-wave-motion-design.md docs/superpowers/plans/2026-06-14-kdo-jsme-wave-motion.md src/tests/site-content.test.ts src/components/IntroStatement.astro
```

Expected: The diff only contains the approved source-of-truth docs, the motion spec and plan, the intro motion invariant, and CSS-only animation changes.

- [ ] **Step 4: Commit only if explicitly requested**

If the user explicitly asks for a commit, run:

```bash
git status --short
git add docs/design-system/wave-marketing/DESIGN.md docs/website/page-map.md docs/website-production-roadmap.md docs/superpowers/specs/2026-06-14-kdo-jsme-wave-motion-design.md docs/superpowers/plans/2026-06-14-kdo-jsme-wave-motion.md src/tests/site-content.test.ts src/components/IntroStatement.astro
git commit -m "feat: animate kdo jsme wave"
```

Expected: A commit containing only the approved docs, plan, test, and intro component changes.

## Self-Review

- Spec coverage: The plan covers slow desktop-only breathing motion, staggered ribbon offsets, no content or asset changes, unchanged mobile omission, reduced-motion handling, tests, and build verification.
- Placeholder scan: No placeholder markers or undefined follow-up work remain.
- Type and name consistency: The test assertions match the exact CSS names and values in the implementation task: `intro-wave-breathe`, `intro-ribbon-drift`, `animation-delay: -4s;`, `animation-delay: -8s;`, and `@media (prefers-reduced-motion: reduce)`.

# Intro Layered Ribbon Wave Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `Kdo jsme` decorative wave with a local SVG/CSS layered ribbon wave inspired by the approved Stitch node, using only WAVE design-system colors.

**Architecture:** Keep the existing `IntroStatement.astro` split layout and text content. Change only the decorative visual contract, documenting it in the existing canonical design-system/page-map docs and protecting it with invariant tests. Do not add metrics, remote Stitch imagery, or new production assets.

**Tech Stack:** Astro, TypeScript site data, CSS custom properties from `src/styles/design-system.css`, Vitest invariant tests.

**Commit Rule:** Do not commit unless the user explicitly asks for a commit.

---

## File Structure

- Modify `docs/design-system/wave-marketing/DESIGN.md`: describe the intro wave as an enlarged, cropped version of the existing wave-divider visual language.
- Modify `docs/website/page-map.md`: keep the intro variant and note that the visual slot uses local SVG/CSS, not image assets or metrics.
- Modify `docs/website/sections/intro.md`: keep content unchanged and note the approved visual treatment source.
- Modify `src/components/IntroStatement.astro`: replace the current ribbon SVG with oversized filled wave-divider paths and token-based colors.
- Modify `src/tests/site-content.test.ts`: update the intro visual invariant so it checks for wave-divider-derived path geometry and still blocks metric claims.

---

### Task 1: Document The Approved Intro Visual

**Files:**

- Modify: `docs/design-system/wave-marketing/DESIGN.md`
- Modify: `docs/website/page-map.md`
- Modify: `docs/website/sections/intro.md`

- [ ] **Step 1: Update design-system wording**

Add this sentence to the intro variant section in `docs/design-system/wave-marketing/DESIGN.md`:

```md
For the current homepage, the visual panel uses an enlarged, cropped treatment derived from the local `WaveDivider.astro` two-band SVG language; recreate it locally with SVG/CSS and WAVE tokens instead of using remote imagery.
```

- [ ] **Step 2: Update page-map visual slot rule**

Change the intro section visual guidance in `docs/website/page-map.md` to include:

```md
- Visual slot rule: render a local token-colored SVG derived from the existing `wave-divider` paths; do not render metrics, remote Stitch imagery, or fake proof.
```

- [ ] **Step 3: Update intro section notes**

Add this bullet to `docs/website/sections/intro.md` under notes:

```md
- Approved visual treatment: enlarged, cropped wave panel derived from the existing `WaveDivider.astro` SVG paths and recolored with WAVE design-system tokens.
```

---

### Task 2: Write The Failing Intro Wave Invariant

**Files:**

- Modify: `src/tests/site-content.test.ts`

- [ ] **Step 1: Update the intro visual test**

In `src/tests/site-content.test.ts`, update the existing `keeps the intro section as a metric-free split wave variant` test so it expects the local wave-divider-derived structure:

```ts
expect(component).toContain(
  'class="intro__divider-wave intro__divider-wave--strong"',
);
expect(component).toContain(
  'class="intro__divider-wave intro__divider-wave--soft"',
);
expect(component).toContain('viewBox="0 0 1440 100"');
expect(component).toContain("C240,100 480,0 720,50");
expect(component).toContain("C240,20 480,120 720,70");
expect(component).toContain("var(--ds-color-primary)");
expect(component).toContain("var(--ds-color-secondary)");
expect(component).not.toContain("lh3.googleusercontent.com");
```

- [ ] **Step 2: Run test and verify red**

Run:

```bash
npm test -- src/tests/site-content.test.ts
```

Expected: FAIL because `IntroStatement.astro` still uses the previous ribbon paths and does not contain `intro__divider-wave` classes.

---

### Task 3: Implement The Divider-Derived Wave

**Files:**

- Modify: `src/components/IntroStatement.astro`

- [ ] **Step 1: Replace visual SVG markup**

Replace the current `intro__visual` SVG contents with a decorative SVG that keeps `aria-hidden="true"`, reuses the same two wave path shapes from `WaveDivider.astro`, and avoids remote images:

```astro
<div class="intro__visual" aria-hidden="true">
  <svg class="intro__wave" viewBox="0 0 1440 100" preserveAspectRatio="none" role="presentation" focusable="false">
    <path class="intro__divider-wave intro__divider-wave--strong" d="M0,50 C240,100 480,0 720,50 C960,100 1200,0 1440,50 L1440,100 L0,100 Z" />
    <path class="intro__divider-wave intro__divider-wave--soft" d="M0,70 C240,20 480,120 720,70 C960,20 1200,120 1440,70 L1440,100 L0,100 Z" />
  </svg>
</div>
```

- [ ] **Step 2: Update component CSS**

Replace the old ribbon CSS with oversized filled wave rules:

```css
.intro__wave {
  height: 72%;
  inset: auto -18% 8% -18%;
  position: absolute;
  transform: scaleY(2.8) rotate(-6deg);
  width: 136%;
}

.intro__divider-wave {
  filter: drop-shadow(0 18px 22px rgba(0, 59, 61, 0.12));
}

.intro__divider-wave--strong {
  fill: var(--ds-color-primary);
  opacity: 0.72;
}

.intro__divider-wave--soft {
  fill: var(--ds-color-secondary);
  opacity: 0.42;
}
```

Keep the existing `.intro__visual` background, layout, and mobile behavior unless browser review shows the wave is clipped poorly.

- [ ] **Step 3: Run focused test and verify green**

Run:

```bash
npm test -- src/tests/site-content.test.ts
```

Expected: PASS.

---

### Task 4: Verify Build And Browser Rendering

**Files:**

- No source changes unless verification exposes a concrete bug.

- [ ] **Step 1: Run full tests**

Run:

```bash
npm run test
```

Expected: all Vitest tests pass.

- [ ] **Step 2: Run production build**

Run:

```bash
npm run build
```

Expected: Astro check reports 0 errors and 0 warnings; build completes.

- [ ] **Step 3: Browser verify intro visual**

Run dev server if needed:

```bash
npm run dev -- --host 0.0.0.0
```

Verify in Chrome:

- The `Kdo jsme` panel shows layered filled ribbon waves, not the old three-stroke wave.
- The visual uses WAVE teal/brown/accent colors.
- No `10+`, `250+`, remote Stitch image, or fake proof appears in the section.
- Mobile stacks the visual and text without horizontal overflow.

---

## Self-Review

- Spec coverage: The plan covers docs-first updates, failing invariant, SVG/CSS implementation derived from `WaveDivider.astro`, test/build/browser verification, and metric exclusion.
- Placeholder scan: No `TBD`, `TODO`, or deferred implementation language remains.
- Type consistency: The planned class names are consistent across tests and component markup.

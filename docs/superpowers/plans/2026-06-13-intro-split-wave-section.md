# Intro Split Wave Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the `Kdo jsme` intro section as a metric-free split editorial section inspired by the approved Stitch reference while staying inside the WAVE Marketing design system.

**Architecture:** Keep the existing three-layer source-of-truth model. Content remains in `docs/website/sections/intro.md` and `src/data/site.ts`; reusable visual rules live in `docs/design-system/wave-marketing/`; this homepage chooses the variant in `docs/website/page-map.md`; implementation stays in `src/components/IntroStatement.astro`.

**Tech Stack:** Astro, TypeScript content data, CSS variables from `src/styles/design-system.css`, Vitest content/design invariants.

---

## File Structure

- Modify `docs/website/sections/intro.md`: add the approved optional eyebrow text `O nás`; keep copy content-only.
- Modify `docs/design-system/wave-marketing/DESIGN.md`: add the reusable `intro-statement` split wave variant contract.
- Modify `docs/design-system/wave-marketing/kitchensink.html`: show the split wave intro pattern in the fixture.
- Modify `docs/website/page-map.md`: select `split-editorial-wave-panel` for the intro section.
- Modify `docs/website-production-roadmap.md`: record the decision and no-metrics constraint.
- Modify `src/data/site.ts`: add `intro.eyebrow` with `O nás`.
- Modify `src/components/IntroStatement.astro`: render split wave layout using CSS/SVG, no new production asset.
- Modify `src/tests/site-content.test.ts`: guard the selected variant, eyebrow, and no-metrics constraint.

## Task 1: Guard The Approved Content And Variant

**Files:**

- Modify: `src/tests/site-content.test.ts`

- [ ] **Step 1: Write the failing test**

Add this test inside `describe("siteContent", () => { ... })`:

```ts
it("keeps the intro section as a metric-free split wave variant", () => {
  const introSpec = readFileSync(
    join(process.cwd(), "docs/website/sections/intro.md"),
    "utf8",
  );
  const pageMap = readFileSync(
    join(process.cwd(), "docs/website/page-map.md"),
    "utf8",
  );
  const component = readFileSync(
    join(process.cwd(), "src/components/IntroStatement.astro"),
    "utf8",
  );

  expect(siteContent.intro.eyebrow).toBe("O nás");
  expect(introSpec).toContain("## Eyebrow");
  expect(introSpec).toContain("`O nás`");
  expect(pageMap).toContain("Variant: `split-editorial-wave-panel`");
  expect(component).toContain("intro__visual");
  expect(component).toContain("intro__wave");

  expect(component).not.toContain("10+");
  expect(component).not.toContain("250+");
  expect(JSON.stringify(siteContent.intro)).not.toContain("10+");
  expect(JSON.stringify(siteContent.intro)).not.toContain("250+");
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- src/tests/site-content.test.ts`

Expected: FAIL because `siteContent.intro.eyebrow`, the page-map variant, and `intro__visual` are not implemented yet.

## Task 2: Update Canonical Docs First

**Files:**

- Modify: `docs/website/sections/intro.md`
- Modify: `docs/design-system/wave-marketing/DESIGN.md`
- Modify: `docs/website/page-map.md`
- Modify: `docs/website-production-roadmap.md`

- [ ] **Step 1: Update `docs/website/sections/intro.md`**

Add this section between `## Source` and `## Heading`:

```md
## Eyebrow

`O nás`
```

Keep the existing heading, main copy, supporting copy, and notes unchanged.

- [ ] **Step 2: Update `docs/design-system/wave-marketing/DESIGN.md`**

Add this subsection under the component guidance area after the existing visual rules:

```md
### Intro Statement Variant: Split Editorial Wave Panel

Use `intro-statement` with variant `split-editorial-wave-panel` when a short human-positioning section needs stronger presence than a centered text card. The layout pairs a large decorative wave panel with an editorial text stack. The visual panel must be generated from WAVE design-system tokens, SVG, gradients, or CSS shapes; do not use Stitch-hosted imagery or unapproved production assets.

The content stack uses a small uppercase eyebrow, heading, lead paragraph, short warm accent divider, and supporting paragraph. Do not add metrics, case-study counts, client logos, testimonials, or other proof claims unless they are approved in the content source of truth first.
```

- [ ] **Step 3: Update `docs/website/page-map.md`**

In the `### 4. Intro` section, change:

```md
- Variant: `centered-statement-with-supporting-copy`.
```

to:

```md
- Variant: `split-editorial-wave-panel`.
```

Also change the design contracts line to:

```md
- Design contracts: `Composition Cues`, `Typography`, `Decorative Elements`, `Cards` if rendered inside a surface.
```

- [ ] **Step 4: Update `docs/website-production-roadmap.md`**

Add this bullet to the `2026-06-13` step log:

```md
- Approved redesigning the `Kdo jsme` intro section as a split editorial wave panel inspired by the Stitch reference, while omitting unapproved metric tiles and keeping the visual treatment inside the WAVE design system.
```

## Task 3: Update Content Data

**Files:**

- Modify: `src/data/site.ts`

- [ ] **Step 1: Add the intro eyebrow**

Change the `intro` object from:

```ts
  intro: {
    heading: 'Kdo jsme',
```

to:

```ts
  intro: {
    eyebrow: 'O nás',
    heading: 'Kdo jsme',
```

- [ ] **Step 2: Run the focused test and verify remaining failures**

Run: `npm test -- src/tests/site-content.test.ts`

Expected: FAIL only on missing page-map/component layout items if docs are not fully updated yet; after Task 2, FAIL only on missing `intro__visual` and `intro__wave`.

## Task 4: Implement The Split Wave Layout

**Files:**

- Modify: `src/components/IntroStatement.astro`

- [ ] **Step 1: Replace the markup**

Use this structure:

```astro
<section class="intro section" aria-labelledby="intro-heading">
  <div class="container intro__grid">
    <div class="intro__visual" aria-hidden="true">
      <svg class="intro__wave" viewBox="0 0 640 640" role="presentation" focusable="false">
        <path d="M-40 250C80 380 170 385 290 270C405 160 520 145 690 245" />
        <path d="M-55 330C85 475 205 480 330 355C445 240 535 235 700 350" />
        <path d="M-35 420C110 535 240 535 365 420C470 325 550 315 690 410" />
      </svg>
    </div>
    <div class="intro__copy">
      <span class="eyebrow">{siteContent.intro.eyebrow}</span>
      <h2 id="intro-heading">{siteContent.intro.heading}</h2>
      <p class="intro__main lead">{siteContent.intro.main}</p>
      <div class="intro__accent" aria-hidden="true"></div>
      <p>{siteContent.intro.support}</p>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Replace the component styles**

Use this CSS inside the component style block:

```css
.intro {
  background: var(--ds-color-background);
}

.intro__grid {
  align-items: stretch;
  display: grid;
  grid-template-columns: minmax(280px, 0.95fr) minmax(0, 1.05fr);
  overflow: hidden;
}

.intro__visual {
  align-items: center;
  background:
    radial-gradient(
      circle at 35% 28%,
      color-mix(in srgb, var(--ds-color-accent) 72%, transparent),
      transparent 42%
    ),
    linear-gradient(
      135deg,
      var(--ds-color-surface-muted),
      var(--ds-color-accent)
    );
  display: flex;
  min-height: clamp(360px, 50vw, 620px);
  overflow: hidden;
  position: relative;
}

.intro__wave {
  height: 110%;
  margin-left: -18%;
  width: 130%;
}

.intro__wave path {
  fill: none;
  stroke-linecap: round;
  stroke-width: 58;
}

.intro__wave path:nth-child(1) {
  stroke: var(--ds-color-primary);
}

.intro__wave path:nth-child(2) {
  stroke: var(--ds-color-secondary);
}

.intro__wave path:nth-child(3) {
  stroke: color-mix(
    in srgb,
    var(--ds-color-primary) 82%,
    var(--ds-color-accent)
  );
}

.intro__copy {
  align-self: center;
  padding: clamp(var(--ds-space-10), 6vw, var(--ds-space-20));
}

.intro h2 {
  color: var(--ds-color-primary);
  font-family: var(--ds-font-heading);
  font-size: clamp(var(--ds-text-3xl), 4vw, var(--ds-text-5xl));
  line-height: var(--ds-leading-tight);
  margin: var(--ds-space-4) 0 var(--ds-space-5);
}

.intro p {
  color: var(--ds-color-text-muted);
  line-height: var(--ds-leading-relaxed);
  margin: 0;
  max-width: 680px;
}

.intro__main {
  color: var(--ds-color-primary) !important;
  margin-bottom: var(--ds-space-6) !important;
}

.intro__accent {
  background: var(--ds-color-secondary);
  border-radius: var(--ds-radius-full);
  height: var(--ds-border-strong);
  margin-bottom: var(--ds-space-6);
  width: var(--ds-space-16);
}

@media (max-width: 840px) {
  .intro__grid {
    grid-template-columns: 1fr;
  }

  .intro__visual {
    min-height: 260px;
  }

  .intro__copy {
    padding-inline: 0;
  }
}
```

- [ ] **Step 3: Run the focused test and verify it passes**

Run: `npm test -- src/tests/site-content.test.ts`

Expected: PASS.

## Task 5: Update The Fixture

**Files:**

- Modify: `docs/design-system/wave-marketing/kitchensink.html`

- [ ] **Step 1: Add fixture classes**

Add a compact `.intro-fixture`, `.intro-fixture__visual`, `.intro-fixture__copy`, and `.intro-fixture__accent` block near the existing fixture styles. Reuse the same token pattern from `IntroStatement.astro`; the fixture does not need Astro scoped selectors.

- [ ] **Step 2: Add fixture markup**

Add a section after the typography scale block:

```html
<section class="section container">
  <h2>Intro Statement Split Wave</h2>
  <div class="intro-fixture">
    <div class="intro-fixture__visual" aria-hidden="true"></div>
    <div class="intro-fixture__copy">
      <span class="eyebrow">O nás</span>
      <h3>Kdo jsme</h3>
      <p class="lead">
        Jsme partneři, kteří naslouchají, chápou váš byznys a pečují o něj jako
        o vlastní.
      </p>
      <div class="intro-fixture__accent" aria-hidden="true"></div>
      <p>Věříme, že dobrý marketing začíná porozuměním.</p>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Run the focused test**

Run: `npm test -- src/tests/site-content.test.ts`

Expected: PASS.

## Task 6: Verify And Finish

**Files:**

- All modified files

- [ ] **Step 1: Run full tests**

Run: `npm test`

Expected: all tests pass.

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: Astro check reports 0 errors, 0 warnings, 0 hints; build creates 1 page.

- [ ] **Step 3: Verify the dev page if the server is running**

Fetch or open `http://localhost:4321/` and confirm the `Kdo jsme` section uses the split visual/text layout and contains no `10+` or `250+` metric tiles.

- [ ] **Step 4: Inspect diff**

Run: `git diff --stat`

Expected: changes limited to docs, `src/data/site.ts`, `src/components/IntroStatement.astro`, and `src/tests/site-content.test.ts` unless fixture formatting requires localized edits in `kitchensink.html`.

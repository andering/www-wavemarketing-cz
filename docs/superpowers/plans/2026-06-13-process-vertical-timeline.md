# Process Vertical Timeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework `Jak probíhá spolupráce` from four grid cards into a centered vertical timeline inspired by the approved Stitch reference while preserving approved WAVE content, adding approved support slots, and using design tokens.

**Architecture:** Keep `siteContent.process` as the only process copy source. Update the canonical docs to map the section to a vertical timeline variant, then render one approved support slot per step: an outcome box, two chips, an abstract token visual, and the existing contact CTA. Do not add remote Stitch images or unapproved copy.

**Tech Stack:** Astro component markup, CSS custom properties from WAVE design-system tokens, Vitest content/component invariant tests.

**Commit Rule:** Do not commit unless the user explicitly asks for a commit.

---

## File Structure

- Modify `docs/design-system/wave-marketing/DESIGN.md`: add the vertical process timeline pattern to component guidance.
- Modify `docs/website/page-map.md`: change cooperation process variant from `numbered-warm-cards` to `centered-vertical-timeline`.
- Modify `docs/website/sections/cooperation-process.md`: update notes to record the approved layout and explicit exclusions.
- Modify `src/data/site.ts`: add approved support-slot data under the existing process steps.
- Modify `src/components/ProcessSteps.astro`: render timeline items, nodes, dotted connector, and approved support slots.
- Modify `src/tests/site-content.test.ts`: add/adjust invariant checks for the timeline structure, support slots, and launch exclusions.

---

### Task 1: Document The Approved Process Timeline

**Files:**

- Modify: `docs/design-system/wave-marketing/DESIGN.md`
- Modify: `docs/website/page-map.md`
- Modify: `docs/website/sections/cooperation-process.md`

- [ ] **Step 1: Update design-system component guidance**

Add this paragraph near the component guidance or cards/timeline-related guidance in `docs/design-system/wave-marketing/DESIGN.md`:

```md
Process sections may use a centered vertical timeline when explaining a small number of collaboration steps. Use circular numbered nodes, a subtle dotted connector in the secondary color, generous vertical rhythm, and text-first content blocks. Do not add unapproved media, output cards, fake artifacts, extra bullets, or CTA buttons inside the process timeline.
```

- [ ] **Step 2: Update page map process variant**

Change the cooperation process mapping in `docs/website/page-map.md`:

```md
- Variant: `centered-vertical-timeline`.
- Design contracts: `Typography`, `Spacing Scale`, `Decorative Elements`, `Cards` only if a future approved step needs a supporting surface.
- Layout rule: render a narrow centered vertical timeline with numbered circular nodes and a subtle dotted connector; do not copy Stitch-only media, output boxes, extra bullets, or CTA buttons.
```

- [ ] **Step 3: Update process section notes**

Add these bullets under notes in `docs/website/sections/cooperation-process.md`:

```md
- Approved visual treatment: centered vertical timeline inspired by Stitch project `1618198505265661547`, node `b514fb09a1114ef5a0d115862caa089b`, translated into WAVE design-system tokens.
- Keep the four approved brief steps and approved support slots only: one `Výstup:` box, two chips, one token-based abstract visual, and one existing contact CTA button. Do not add Stitch-hosted images or unapproved copy.
```

---

### Task 2: Write The Failing Timeline Invariant

**Files:**

- Modify: `src/tests/site-content.test.ts`

- [ ] **Step 1: Add process timeline test**

Add this test inside `describe("siteContent", () => { ... })`:

```ts
it("renders the cooperation process as an approved vertical timeline", () => {
  const processSpec = readFileSync(
    join(process.cwd(), "docs/website/sections/cooperation-process.md"),
    "utf8",
  );
  const pageMap = readFileSync(
    join(process.cwd(), "docs/website/page-map.md"),
    "utf8",
  );
  const component = readFileSync(
    join(process.cwd(), "src/components/ProcessSteps.astro"),
    "utf8",
  );

  expect(pageMap).toContain("Variant: `centered-vertical-timeline`");
  expect(processSpec).toContain("centered vertical timeline");
  expect(component).toContain("process__timeline");
  expect(component).toContain("process-step__line");
  expect(component).toContain("process-step__node");
  expect(component).toContain("process-step__support");
  expect(component).toContain("process-step__outcome");
  expect(component).toContain("process-step__chips");
  expect(component).toContain("process-step__visual");
  expect(component).toContain("process-step__cta");
  expect(component).toContain("repeating-linear-gradient");
  expect(component).not.toContain("process__grid");
  expect(component).not.toContain("process-card");
  expect(component).not.toContain("lh3.googleusercontent.com");
  expect(siteContent.process.steps[0].support).toEqual({
    type: "outcome",
    label: "Výstup:",
    text: "Jasné zadání a vzájemné porozumění prioritám.",
  });
  expect(siteContent.process.steps[1].support).toEqual({
    type: "chips",
    items: ["Analýza situace", "Návrh směru"],
  });
  expect(siteContent.process.steps[2].support).toEqual({ type: "visual" });
  expect(siteContent.process.steps[3].support).toEqual({
    type: "cta",
    label: siteContent.hero.primaryCta.label,
    href: siteContent.hero.primaryCta.href,
  });
});
```

- [ ] **Step 2: Run test and verify red**

Run:

```bash
npm test -- src/tests/site-content.test.ts
```

Expected: FAIL until the support slot data and rendering exist.

---

### Task 3: Implement The Timeline Component

**Files:**

- Modify: `src/components/ProcessSteps.astro`

- [ ] **Step 1: Replace process list markup**

Replace the current `<ol class="process__grid">...</ol>` block with:

```astro
<ol class="process__timeline">
  {siteContent.process.steps.map((step, index) => (
    <li class="process-step">
      <div class="process-step__line" aria-hidden="true">
        <span class="process-step__node">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div class="process-step__content">
        <h3>{step.title}</h3>
        <p>{step.text}</p>
      </div>
    </li>
  ))}
</ol>
```

- [ ] **Step 2: Replace process grid/card CSS**

Remove `.process__grid`, `.process-card`, `.process-card span`, and `.process-card h3` rules. Add:

```css
.process__timeline {
  list-style: none;
  margin: 0 auto;
  max-width: 760px;
  padding: 0;
}

.process-step {
  display: grid;
  gap: var(--ds-space-6);
  grid-template-columns: 56px minmax(0, 1fr);
  margin: 0;
  padding: 0 0 var(--ds-space-16);
  position: relative;
}

.process-step:last-child {
  padding-bottom: 0;
}

.process-step__line {
  display: flex;
  justify-content: center;
  position: relative;
}

.process-step__line::before {
  background: repeating-linear-gradient(
    to bottom,
    color-mix(in srgb, var(--ds-color-secondary) 38%, transparent) 0,
    color-mix(in srgb, var(--ds-color-secondary) 38%, transparent) 6px,
    transparent 6px,
    transparent 14px
  );
  bottom: calc(var(--ds-space-16) * -1);
  content: "";
  position: absolute;
  top: 56px;
  width: 2px;
}

.process-step:last-child .process-step__line::before {
  display: none;
}

.process-step__node {
  align-items: center;
  background: var(--ds-color-background);
  border: 2px solid var(--ds-color-secondary);
  border-radius: var(--ds-radius-full);
  color: var(--ds-color-secondary);
  display: inline-flex;
  font-family: var(--ds-font-heading);
  font-size: var(--ds-text-sm);
  font-weight: var(--ds-font-weight-bold);
  height: 48px;
  justify-content: center;
  position: relative;
  width: 48px;
  z-index: 1;
}

.process-step__content {
  padding-top: var(--ds-space-1);
}

.process-step__content h3 {
  color: var(--ds-color-primary);
  font-family: var(--ds-font-heading);
  font-size: clamp(var(--ds-text-2xl), 3vw, var(--ds-text-3xl));
  line-height: var(--ds-leading-snug);
  margin: 0 0 var(--ds-space-4);
}

.process-step__content p {
  color: var(--ds-color-text-muted);
  line-height: var(--ds-leading-relaxed);
  margin: 0;
  max-width: 620px;
}
```

- [ ] **Step 3: Replace responsive CSS**

Remove the old grid breakpoint rules and add:

```css
@media (max-width: 620px) {
  .process-step {
    gap: var(--ds-space-4);
    grid-template-columns: 44px minmax(0, 1fr);
    padding-bottom: var(--ds-space-12);
  }

  .process-step__line::before {
    bottom: calc(var(--ds-space-12) * -1);
    top: 48px;
  }

  .process-step__node {
    height: 40px;
    width: 40px;
  }
}
```

- [ ] **Step 4: Run focused test and verify green**

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

- [ ] **Step 3: Browser verify process timeline**

Run dev server if needed:

```bash
npm run dev -- --host 0.0.0.0
```

Verify in Chrome:

- `Jak probíhá spolupráce` renders as a centered one-column vertical timeline.
- Four numbered circular nodes appear with a dotted connector between steps.
- No remote image, no Stitch-only output cards, no extra bullets, and no process CTA appear.
- Mobile layout remains one column with no horizontal overflow.

---

## Self-Review

- Spec coverage: The plan covers docs-first updates, failing invariant, component markup/CSS, and test/build/browser verification.
- Placeholder scan: No `TBD`, `TODO`, or deferred implementation language remains.
- Type consistency: Class names are consistent across tests and component markup.

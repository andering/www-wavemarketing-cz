# Hero Marketing Tag Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Style the first `marketing` word in the hero lead as the approved inline shopping-tag label.

**Architecture:** Keep the content model unchanged in `src/data/site.ts`. Document the reusable visual rule in the WAVE design system, then implement the homepage-specific inline split and scoped CSS in `MarketingHero.astro`. Protect the behavior with the existing Vitest invariant test file.

**Tech Stack:** Astro, TypeScript content data, scoped Astro CSS, Vitest.

---

## Files

- Modify: `docs/design-system/wave-marketing/DESIGN.md` — records the approved inline hero tag treatment as a design-system pattern.
- Modify: `docs/website-production-roadmap.md` — records the approved decision so the production roadmap stays traceable.
- Modify: `src/tests/site-content.test.ts` — adds a content/component invariant for the new hero marketing tag.
- Modify: `src/components/MarketingHero.astro` — splits the first `marketing` in the hero lead and styles the inline tag.

Do not modify `src/data/site.ts`; the approved Czech lead copy remains unchanged. Do not commit unless the user explicitly requests a commit.

---

### Task 1: Record The Approved Visual Pattern

**Files:**

- Modify: `docs/design-system/wave-marketing/DESIGN.md`
- Modify: `docs/website-production-roadmap.md`

- [ ] **Step 1: Update `DESIGN.md` with the inline hero tag rule**

Add this paragraph after the existing Typography section paragraph ending with `Labels and badges should use uppercase body-family text with --ds-font-weight-semibold and --ds-tracking-widest.`:

```markdown
Hero lead copy may use a single inline shopping-tag emphasis for a strategically important word when approved by the website content/design source of truth. The approved homepage treatment applies only to the first `marketing` in `Děláme marketing lidsky.` and renders it as a slightly rotated teal label with equal corner rounding, off-white uppercase text, a thin warm brown underside, and a small left-side circular hole with a warm brown border. Keep clear spacing between the hole and the word, do not add extra highlight lines, and keep the element inline so the lead remains readable on mobile.
```

- [ ] **Step 2: Update the production roadmap with the decision**

In `docs/website-production-roadmap.md`, add this bullet after the existing `Mobile header/hero density refinement` bullet in the `## Refinement Decisions` section:

```markdown
- 2026-06-19: The hero lead may emphasize only the first `marketing` word as an inline shopping-tag label. Approved styling: teal face, balanced rounded corners, slight rotation, thin warm brown underside, and a small brown-bordered tag hole with clear spacing before the word.
```

- [ ] **Step 3: Inspect the docs diff**

Run: `git diff -- docs/design-system/wave-marketing/DESIGN.md docs/website-production-roadmap.md`

Expected: the diff only records the approved hero marketing tag visual rule and roadmap decision.

---

### Task 2: Add The Failing Invariant Test

**Files:**

- Modify: `src/tests/site-content.test.ts`

- [ ] **Step 1: Add the test beside the existing hero emphasis test**

Add this test immediately after `it("styles the hero wave phrase with secondary italic emphasis", () => { ... });`:

```ts
it("styles the first hero marketing word as an approved shopping tag", () => {
  const component = readFileSync(
    join(process.cwd(), "src/components/MarketingHero.astro"),
    "utf8",
  );

  expect(siteContent.hero.lead).toContain("Děláme marketing lidsky.");
  expect(component).toContain("heroLeadEmphasis");
  expect(component).toContain('class="hero__lead-tag"');
  expect(component).toContain("border-radius: var(--ds-radius-md);");
  expect(component).toContain("0 3px 0 var(--ds-color-secondary)");
  expect(component).toContain("transform: rotate(-4deg) translateY(-0.08em);");
  expect(component).toContain(".hero__lead-tag::before");
  expect(component).toContain("border: 2px solid var(--ds-color-secondary);");
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm run test -- --run src/tests/site-content.test.ts -t "styles the first hero marketing word as an approved shopping tag"`

Expected: FAIL because `heroLeadEmphasis`, `hero__lead-tag`, and the new CSS do not exist yet.

---

### Task 3: Implement The Hero Lead Tag

**Files:**

- Modify: `src/components/MarketingHero.astro`

- [ ] **Step 1: Add the lead split constants**

At the top of `src/components/MarketingHero.astro`, below the existing heading split constants, add:

```astro
const heroLeadEmphasis = 'marketing';
const [heroLeadPrefix, ...heroLeadParts] = siteContent.hero.lead.split(heroLeadEmphasis);
const heroLeadSuffix = heroLeadParts.join(heroLeadEmphasis);
```

The top frontmatter should read:

```astro
---
import { siteContent } from '../data/site';

const heroHeadingEmphasis = 'správnou vlnu';
const [heroHeadingPrefix, heroHeadingSuffix = ''] = siteContent.hero.heading.split(heroHeadingEmphasis);
const heroLeadEmphasis = 'marketing';
const [heroLeadPrefix, ...heroLeadParts] = siteContent.hero.lead.split(heroLeadEmphasis);
const heroLeadSuffix = heroLeadParts.join(heroLeadEmphasis);
---
```

- [ ] **Step 2: Wrap the first lead `marketing` word**

Replace:

```astro
      <p class="lead">{siteContent.hero.lead}</p>
```

with:

```astro
      <p class="lead">
        {heroLeadPrefix}<span class="hero__lead-tag">{heroLeadEmphasis}</span>{heroLeadSuffix}
      </p>
```

- [ ] **Step 3: Add the scoped tag CSS**

Add this block after the existing `.hero p` rule and before `.hero__actions`:

```css
.hero__lead-tag {
  background: var(--ds-color-primary);
  border: 2px solid var(--ds-color-surface-raised);
  border-radius: var(--ds-radius-md);
  box-shadow:
    0 3px 0 var(--ds-color-secondary),
    0 10px 18px rgba(0, 59, 61, 0.16);
  color: var(--ds-color-surface-raised);
  display: inline-block;
  font-family: var(--ds-font-body);
  font-size: 0.76em;
  font-weight: var(--ds-font-weight-bold);
  letter-spacing: 0.055em;
  margin: 0 0.16em;
  padding: 0.04em 0.64em 0.08em 34px;
  position: relative;
  text-transform: uppercase;
  transform: rotate(-4deg) translateY(-0.08em);
  white-space: nowrap;
}

.hero__lead-tag::before {
  background: var(--ds-color-surface-raised);
  border: 2px solid var(--ds-color-secondary);
  border-radius: var(--ds-radius-full);
  content: "";
  height: 12px;
  left: 10px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
}
```

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npm run test -- --run src/tests/site-content.test.ts -t "styles the first hero marketing word as an approved shopping tag"`

Expected: PASS.

---

### Task 4: Verify The Full Site

**Files:**

- Read-only verification of implementation and generated build output.

- [ ] **Step 1: Run the full test suite**

Run: `npm run test`

Expected: all Vitest tests pass.

- [ ] **Step 2: Run the production build**

Run: `npm run build`

Expected: Astro builds successfully with no errors.

- [ ] **Step 3: Inspect the final diff**

Run: `git diff -- docs/superpowers/specs/2026-06-19-hero-marketing-tag-design.md docs/superpowers/plans/2026-06-19-hero-marketing-tag.md docs/design-system/wave-marketing/DESIGN.md docs/website-production-roadmap.md src/tests/site-content.test.ts src/components/MarketingHero.astro`

Expected: the diff contains only the approved spec, implementation plan, docs updates, invariant test, and hero component styling for the inline marketing tag.

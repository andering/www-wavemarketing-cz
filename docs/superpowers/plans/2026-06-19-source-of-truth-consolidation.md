# Source Of Truth Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `docs/website-production-roadmap.md`, `docs/website/`, and `docs/design-system/wave-marketing/` the only active source of truth, while preserving `docs/superpowers/` as historical workflow material.

**Architecture:** Treat `docs/website-production-roadmap.md` as the central decision log, `docs/design-system/wave-marketing/DESIGN.md` as reusable visual/component guidance, `docs/website/page-map.md` as page-specific component responsibility, and `docs/website/sections/*.md` as content. Add tests that fail when important source-of-truth routing or historical notices are missing.

**Tech Stack:** Markdown documentation, Vitest content invariants, Astro static-site verification.

---

## Files

- Modify: `docs/website-production-roadmap.md` — make the decision-log role explicit and consolidate durable decisions from old specs/plans.
- Modify: `docs/design-system/wave-marketing/DESIGN.md` — ensure reusable visual/component rules from temporary specs are present only as reusable guidance.
- Modify: `docs/website/page-map.md` — ensure page-specific component responsibilities from temporary specs are present.
- Modify: `docs/website/sections/hero.md` — record content-level hero emphasis constraints if needed, without moving visual styling into content.
- Modify: `docs/website/sections/intro.md` — keep content-level intro notes and point visual responsibility to the design system/page map.
- Create: `docs/superpowers/README.md` — mark specs/plans as historical workflow artifacts, not active source of truth.
- Modify: `src/tests/site-content.test.ts` — add invariant coverage for the consolidated source-of-truth routing.

Do not delete old `docs/superpowers/specs/*.md` or `docs/superpowers/plans/*.md` files in this pass. Preserve traceability and make their status clear instead.

---

### Task 1: Add A Failing Source-Of-Truth Invariant

**Files:**

- Modify: `src/tests/site-content.test.ts`

- [ ] **Step 1: Add the source-of-truth routing test**

Add this test near the existing roadmap/design-system documentation tests:

```ts
it("routes durable decisions to canonical source-of-truth docs", () => {
  const roadmap = readFileSync(
    join(process.cwd(), "docs/website-production-roadmap.md"),
    "utf8",
  );
  const designSystem = readFileSync(
    join(process.cwd(), "docs/design-system/wave-marketing/DESIGN.md"),
    "utf8",
  );
  const pageMap = readFileSync(
    join(process.cwd(), "docs/website/page-map.md"),
    "utf8",
  );
  const superpowersReadme = readFileSync(
    join(process.cwd(), "docs/superpowers/README.md"),
    "utf8",
  );

  expect(roadmap).toContain("## Decision Log");
  expect(roadmap).toContain("central decision log");
  expect(roadmap).toContain("Historical workflow artifacts");
  expect(roadmap).toContain("centered vertical timeline");
  expect(roadmap).toContain("metric-free split editorial wave panel");
  expect(roadmap).toContain("panel-scoped WebGL shader");
  expect(roadmap).toContain("inline shopping-tag label");

  expect(designSystem).toContain(
    "Hero lead copy may use a single inline shopping-tag emphasis",
  );
  expect(designSystem).toContain(
    "Intro Statement Variant: Split Editorial Wave Panel",
  );
  expect(designSystem).toContain("panel-scoped WebGL canvas shader");
  expect(designSystem).toContain(
    "Process sections may use a centered vertical timeline",
  );

  expect(pageMap).toContain("Component: `marketing-hero`");
  expect(pageMap).toContain("Component: `process-steps`");
  expect(pageMap).toContain("Component: `intro-statement`");
  expect(pageMap).toContain("Visual slot rule:");

  expect(superpowersReadme).toContain("not an active source of truth");
  expect(superpowersReadme).toContain(
    "Use `docs/website-production-roadmap.md` for durable decisions",
  );
  expect(superpowersReadme).toContain(
    "Use `docs/design-system/wave-marketing/` for reusable visual and component rules",
  );
  expect(superpowersReadme).toContain(
    "Use `docs/website/` for content and page/component mapping",
  );
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm run test -- --run src/tests/site-content.test.ts -t "routes durable decisions to canonical source-of-truth docs"`

Expected: FAIL because `docs/superpowers/README.md` does not exist yet and `docs/website-production-roadmap.md` still uses `## Refinement Decisions` instead of the explicit `## Decision Log` heading.

---

### Task 2: Promote The Roadmap To Explicit Decision Log

**Files:**

- Modify: `docs/website-production-roadmap.md`

- [ ] **Step 1: Rename the refinement section**

Change this heading:

```markdown
## Refinement Decisions
```

to:

```markdown
## Decision Log
```

- [ ] **Step 2: Add source-of-truth routing note**

Immediately below `## Decision Log`, add:

```markdown
This section is the central decision log for durable production decisions. Historical workflow artifacts under `docs/superpowers/` may explain how a decision was reached, but the active source of truth is this decision log plus the relevant canonical document: `docs/design-system/wave-marketing/` for reusable visual/component rules, `docs/website/page-map.md` for page-specific component responsibilities, and `docs/website/sections/*.md` for content.

Historical workflow artifacts should not be used as active requirements unless their decisions are also represented in the canonical docs listed above.
```

- [ ] **Step 3: Add missing durable decisions from old plans/specs**

Add these bullets in chronological or topical order inside `## Decision Log`:

```markdown
- Header/contact Stitch alignment decision: keep the centered split desktop header with real social URLs only, use a mobile offcanvas menu, and render the contact area as a compact direct-contact bento rather than a form.
- Process section decision: render `Jak probíhá spolupráce` as a centered vertical timeline with numbered nodes, a subtle dotted connector, approved support slots, and no unapproved artifacts or fake proof.
- Intro visual decision: render `Kdo jsme` as a metric-free split editorial wave panel, using local SVG/CSS or scoped shader enhancement from WAVE tokens rather than Stitch-hosted imagery or fake metric tiles.
```

Do not duplicate every implementation detail from old implementation plans. Keep only durable decisions and rationale.

- [ ] **Step 4: Inspect the roadmap diff**

Run: `git diff -- docs/website-production-roadmap.md`

Expected: the diff makes `Decision Log` explicit, adds source-of-truth routing, and captures missing durable decisions from old plans/specs.

---

### Task 3: Confirm Canonical Component Rules Are Complete

**Files:**

- Modify: `docs/design-system/wave-marketing/DESIGN.md`
- Modify: `docs/website/page-map.md`
- Modify: `docs/website/sections/hero.md`
- Modify: `docs/website/sections/intro.md`

- [ ] **Step 1: Verify reusable rules live in the design system**

Check that `docs/design-system/wave-marketing/DESIGN.md` already includes these durable rules:

```markdown
Hero lead copy may use a single inline shopping-tag emphasis
```

```markdown
### Intro Statement Variant: Split Editorial Wave Panel
```

```markdown
The desktop visual may use a scoped WebGL canvas shader inspired by flowing wave lines
```

```markdown
Process sections may use a centered vertical timeline
```

If any of these are missing, add a concise reusable rule in the existing relevant section. Do not add page copy or implementation-plan steps to `DESIGN.md`.

- [ ] **Step 2: Verify page responsibilities live in the page map**

Check that `docs/website/page-map.md` maps the durable component responsibilities:

```markdown
- Component: `marketing-hero`
```

```markdown
- Component: `process-steps`
```

```markdown
- Component: `intro-statement`
```

```markdown
Visual slot rule:
```

If any responsibility is missing, add it to the matching section map. Do not add reusable token/style rules to `page-map.md`.

- [ ] **Step 3: Keep content specs content-focused**

Check `docs/website/sections/hero.md` and `docs/website/sections/intro.md`.

Expected:

```markdown
- Hero copy remains in `hero.md`, while the shopping-tag visual treatment is not fully specified there.
- Intro copy remains in `intro.md`, while the visual treatment points to design-system/page-map responsibilities.
```

If either file starts carrying visual implementation details that belong in `DESIGN.md` or `page-map.md`, move those details to the canonical visual/component file and leave a short pointer.

- [ ] **Step 4: Inspect canonical-doc diffs**

Run: `git diff -- docs/design-system/wave-marketing/DESIGN.md docs/website/page-map.md docs/website/sections/hero.md docs/website/sections/intro.md`

Expected: no changes if the canonical docs already contain the decisions, or only concise routing fixes if gaps were found.

---

### Task 4: Mark Superpowers Docs As Historical Workflow Artifacts

**Files:**

- Create: `docs/superpowers/README.md`

- [ ] **Step 1: Create the historical notice**

Create `docs/superpowers/README.md` with this content:

```markdown
# Superpowers Workflow Artifacts

Files in this directory are historical brainstorming, specification, and implementation-planning artifacts. They are useful for traceability, but they are not an active source of truth for the production website.

Use `docs/website-production-roadmap.md` for durable decisions and decision history.

Use `docs/design-system/wave-marketing/` for reusable visual and component rules.

Use `docs/website/` for content, section specs, navigation, assets, and page/component mapping.

If a historical spec or plan contains an important decision that is not represented in those canonical files, migrate the decision into the appropriate canonical document before changing implementation.
```

- [ ] **Step 2: Inspect the historical notice**

Run: `git diff -- docs/superpowers/README.md`

Expected: the new README explicitly says `docs/superpowers` is historical and names the canonical source-of-truth files.

---

### Task 5: Verify The Consolidation

**Files:**

- Read-only verification of docs and generated site.

- [ ] **Step 1: Run the focused test**

Run: `npm run test -- --run src/tests/site-content.test.ts -t "routes durable decisions to canonical source-of-truth docs"`

Expected: PASS.

- [ ] **Step 2: Run the full test suite**

Run: `npm run test`

Expected: all Vitest tests pass.

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: Astro check and build complete with no errors.

- [ ] **Step 4: Inspect final diff**

Run: `git diff -- docs/website-production-roadmap.md docs/design-system/wave-marketing/DESIGN.md docs/website/page-map.md docs/website/sections/hero.md docs/website/sections/intro.md docs/superpowers/README.md src/tests/site-content.test.ts`

Expected: changes only clarify source-of-truth routing, consolidate durable decisions, add the historical notice, and protect the behavior with tests.

- [ ] **Step 5: Commit the consolidation**

Run:

```bash
git add docs/website-production-roadmap.md docs/design-system/wave-marketing/DESIGN.md docs/website/page-map.md docs/website/sections/hero.md docs/website/sections/intro.md docs/superpowers/README.md src/tests/site-content.test.ts
git commit -m "docs: consolidate source of truth decisions"
```

Expected: one commit containing only the source-of-truth consolidation changes.

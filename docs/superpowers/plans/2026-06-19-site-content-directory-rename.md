# Site Content Directory Rename Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the active `docs/website/` source-of-truth folder to `docs/site-content/` and update active references.

**Architecture:** Move the existing content and page-map docs without changing their responsibilities. Update canonical docs, project instructions, and tests to use `docs/site-content/`; leave historical `docs/superpowers/plans/*` references untouched unless they are part of this rename plan/spec.

**Tech Stack:** Markdown documentation, Vitest content invariants, Astro static-site verification, git file moves.

---

## Files

- Move: `docs/website/` -> `docs/site-content/`
- Modify: `AGENTS.md` — active agent source-of-truth instructions.
- Modify: `docs/site-content/page-map.md` — read order and section source references after move.
- Modify: `docs/site-content/site.md` — design-system and page-map references after move.
- Modify: `docs/design-system/wave-marketing/USAGE.md` — hero popup source path.
- Modify: `docs/website-production-roadmap.md` — decision log, status, read paths, and step log references.
- Modify: `docs/superpowers/README.md` — canonical source-of-truth routing.
- Modify: `src/tests/site-content.test.ts` — file reads and source-of-truth assertions.
- Modify: `docs/superpowers/specs/2026-06-19-site-content-directory-rename-design.md` — mark implementation complete if useful.
- Do not modify old historical plans/specs only to update path names. They are explicitly historical.

---

### Task 1: Add A Failing Rename Invariant

**Files:**

- Modify: `src/tests/site-content.test.ts`

- [ ] **Step 1: Add imports for directory existence checks if missing**

At the top of `src/tests/site-content.test.ts`, keep the existing `existsSync` import and add `readdirSync` only if it is not already imported:

```ts
import { existsSync, readFileSync, readdirSync } from "node:fs";
```

If the import already includes more names, preserve them and only add `readdirSync`.

- [ ] **Step 2: Add the failing directory routing test**

Add this test near the existing source-of-truth routing invariant:

```ts
it("uses docs/site-content as the active content source-of-truth directory", () => {
  const siteContentDir = join(process.cwd(), "docs/site-content");
  const oldWebsiteDir = join(process.cwd(), "docs/website");
  const canonicalFiles = [
    "site.md",
    "page-map.md",
    "sections/hero.md",
    "sections/intro.md",
    "sections/services-overview.md",
    "sections/cooperation-process.md",
    "sections/contact.md",
    "sections/footer.md",
  ];

  expect(existsSync(siteContentDir)).toBe(true);
  expect(existsSync(oldWebsiteDir)).toBe(false);

  for (const relativePath of canonicalFiles) {
    expect(existsSync(join(siteContentDir, relativePath))).toBe(true);
  }

  const activeDocs = [
    "AGENTS.md",
    "docs/website-production-roadmap.md",
    "docs/design-system/wave-marketing/USAGE.md",
    "docs/site-content/site.md",
    "docs/site-content/page-map.md",
    "docs/superpowers/README.md",
  ];

  for (const docPath of activeDocs) {
    const content = readFileSync(join(process.cwd(), docPath), "utf8");
    expect(content).toContain("docs/site-content");
    expect(content).not.toContain("docs/website/");
  }

  const historicalPlans = readdirSync(
    join(process.cwd(), "docs/superpowers/plans"),
  );
  expect(historicalPlans.length).toBeGreaterThan(0);
});
```

- [ ] **Step 3: Run the focused test and verify it fails**

Run: `npm run test -- --run src/tests/site-content.test.ts -t "uses docs/site-content as the active content source-of-truth directory"`

Expected: FAIL because `docs/site-content/` does not exist yet and `docs/website/` still exists.

---

### Task 2: Move The Directory

**Files:**

- Move: `docs/website/` -> `docs/site-content/`

- [ ] **Step 1: Move the directory with git**

Run: `git mv docs/website docs/site-content`

Expected: `docs/site-content/site.md`, `docs/site-content/page-map.md`, and `docs/site-content/sections/*.md` exist; `docs/website/` no longer exists.

- [ ] **Step 2: Inspect the moved files**

Run: `git status --short`

Expected: git reports renames from `docs/website/...` to `docs/site-content/...`.

---

### Task 3: Update Active Source-Of-Truth References

**Files:**

- Modify: `AGENTS.md`
- Modify: `docs/site-content/page-map.md`
- Modify: `docs/site-content/site.md`
- Modify: `docs/design-system/wave-marketing/USAGE.md`
- Modify: `docs/website-production-roadmap.md`
- Modify: `docs/superpowers/README.md`

- [ ] **Step 1: Update `AGENTS.md` active paths**

Replace active references:

```md
docs/website/
docs/website/page-map.md
docs/website-production-roadmap.md
```

with:

```md
docs/site-content/
docs/site-content/page-map.md
docs/website-production-roadmap.md
```

Keep `docs/website-production-roadmap.md` unchanged.

- [ ] **Step 2: Update `docs/site-content/page-map.md` references**

Replace:

```md
Content source: section markdown files under `docs/website/sections/`.
```

with:

```md
Content source: section markdown files under `docs/site-content/sections/`.
```

Replace:

```md
Read order: `docs/design-system/wave-marketing/USAGE.md`, then `docs/website/site.md`, then this file, then each section file.
```

with:

```md
Read order: `docs/design-system/wave-marketing/USAGE.md`, then `docs/site-content/site.md`, then this file, then each section file.
```

- [ ] **Step 3: Update `docs/site-content/site.md` references**

Replace:

```md
the future `docs/website/page-map.md`
```

with:

```md
`docs/site-content/page-map.md`
```

- [ ] **Step 4: Update design-system usage reference**

In `docs/design-system/wave-marketing/USAGE.md`, replace:

```md
docs/website/sections/hero.md
```

with:

```md
docs/site-content/sections/hero.md
```

- [ ] **Step 5: Update the roadmap and decision log references**

In `docs/website-production-roadmap.md`, replace active references to:

```md
docs/website/
docs/website/site.md
docs/website/sections/\*.md
docs/website/page-map.md
```

with:

```md
docs/site-content/
docs/site-content/site.md
docs/site-content/sections/\*.md
docs/site-content/page-map.md
```

Keep the filename `docs/website-production-roadmap.md` unchanged.

- [ ] **Step 6: Update the historical artifacts README**

In `docs/superpowers/README.md`, replace:

```md
Use `docs/website/` for content and page/component mapping, including section specs, navigation, and assets.
```

with:

```md
Use `docs/site-content/` for content and page/component mapping, including section specs, navigation, and assets.
```

- [ ] **Step 7: Inspect active doc references**

Run: `git diff -- AGENTS.md docs/site-content/page-map.md docs/site-content/site.md docs/design-system/wave-marketing/USAGE.md docs/website-production-roadmap.md docs/superpowers/README.md`

Expected: active source-of-truth docs now point to `docs/site-content/`; historical plans are not rewritten.

---

### Task 4: Update Tests To Read The Renamed Directory

**Files:**

- Modify: `src/tests/site-content.test.ts`

- [ ] **Step 1: Replace active test file paths**

In `src/tests/site-content.test.ts`, replace all active file reads of:

```ts
"docs/website/site.md";
"docs/website/page-map.md";
"docs/website/sections/hero.md";
"docs/website/sections/intro.md";
"docs/website/sections/cooperation-process.md";
"docs/website/sections/contact.md";
"docs/website/sections/footer.md";
"docs/website/sections/services-overview.md";
```

with the matching `docs/site-content/...` paths.

- [ ] **Step 2: Update source-of-truth assertion text**

Replace assertion text:

```ts
"Use `docs/website/` for content and page/component mapping";
```

with:

```ts
"Use `docs/site-content/` for content and page/component mapping";
```

- [ ] **Step 3: Inspect test diff**

Run: `git diff -- src/tests/site-content.test.ts`

Expected: tests now read `docs/site-content/...` and include the new directory routing invariant.

---

### Task 5: Verify Rename And Commit

**Files:**

- Read-only verification plus final git commit.

- [ ] **Step 1: Run the focused rename test**

Run: `npm run test -- --run src/tests/site-content.test.ts -t "uses docs/site-content as the active content source-of-truth directory"`

Expected: PASS.

- [ ] **Step 2: Run the full test suite**

Run: `npm run test`

Expected: all Vitest tests pass.

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: Astro check and build complete with no errors.

- [ ] **Step 4: Search active docs for stale active references**

Run: `rg "docs/website/|docs/website/page-map|docs/website/site|docs/website/sections" AGENTS.md docs/site-content docs/design-system/wave-marketing/USAGE.md docs/website-production-roadmap.md docs/superpowers/README.md src/tests/site-content.test.ts`

Expected: no matches. Matches inside `docs/superpowers/plans/` or `docs/superpowers/specs/` are allowed only as historical artifacts and should not be included in this command.

- [ ] **Step 5: Inspect final status and diff summary**

Run: `git status --short`

Expected: renamed `docs/site-content/...` files, updated active docs/tests, and this plan file.

Run: `git diff --stat`

Expected: path rename from `docs/website/` to `docs/site-content/` plus active reference updates.

- [ ] **Step 6: Commit the rename**

Run:

```bash
git add AGENTS.md docs/site-content docs/design-system/wave-marketing/USAGE.md docs/website-production-roadmap.md docs/superpowers/README.md docs/superpowers/plans/2026-06-19-site-content-directory-rename.md src/tests/site-content.test.ts
git add -u docs/website
git commit -m "docs: rename website specs to site content"
```

Expected: one commit containing the directory rename, active reference updates, invariant test, and implementation plan.

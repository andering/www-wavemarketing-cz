# Site Content Directory Rename Design

## Goal

Rename `docs/website/` to `docs/site-content/` so the canonical content and page-mapping source is more descriptive and clearly distinct from the design-system package.

## Approved Direction

- Use `docs/site-content/` as the new folder name.
- Keep `docs/design-system/` unchanged because its role is already obvious.
- Keep `docs/website-production-roadmap.md` unchanged because it is the roadmap and decision log, not the content-spec folder.
- Update active source-of-truth references in canonical docs, project instructions, and tests.
- Do not rewrite every old historical `docs/superpowers/plans/*` reference because `docs/superpowers/README.md` marks those files as historical workflow artifacts.

## Canonical Files To Update

- `AGENTS.md`
- `docs/website-production-roadmap.md`
- `docs/design-system/wave-marketing/USAGE.md`
- `docs/site-content/page-map.md` after the directory move
- `docs/site-content/site.md` after the directory move
- `docs/superpowers/README.md`
- `src/tests/site-content.test.ts`

## Acceptance Criteria

- `docs/website/` no longer exists.
- `docs/site-content/site.md`, `docs/site-content/page-map.md`, and `docs/site-content/sections/*.md` exist with the same content responsibilities.
- Active docs and tests refer to `docs/site-content/` instead of `docs/website/`.
- Historical plans/specs may still mention `docs/website/`, but only as historical artifacts.
- `npm run test` and `npm run build` pass after implementation.

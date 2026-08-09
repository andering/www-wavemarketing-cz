# WAVE Marketing Agent Instructions

This repository contains the static production website for `www.wavemarketing.cz`.

## Canonical Documentation

- Content: `docs/site-content/`.
- Visual system: `docs/design-system/`.
- Page structure and component mapping: `docs/site-content/page-map.md`.
- Cross-cutting decisions and conflict authority: `docs/decisions.md`.
- Process: `docs/workflow.md`.
- Current state and approved assets: `docs/status.md`.

Resolve ambiguity through `docs/decisions.md` before deciding. If it remains unresolved, ask before proceeding.

## Agent Safeguards

- Do not invent unapproved production content, assets, or links.
- Follow docs-first ownership: update the owning canonical documentation before syncing implementation.
- Do not create durable side specifications or implementation plans outside the canonical documentation.
- Before claiming implementation work is complete, run `npm run test` and `npm run build`.
- For markdown-only documentation edits, inspect the relevant diff before summarizing the change.

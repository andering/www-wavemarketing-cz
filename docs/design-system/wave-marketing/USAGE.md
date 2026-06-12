# WAVE Marketing Design System Usage

## Read Order

Read `DESIGN.md` first to understand the visual rules and component contracts. Then read `tokens.css` for exact token values. Use `kitchensink.html` when visual examples are needed.

## Package Contract

These five files are the source of truth after extraction. Normal implementation must not reopen the original Stitch source material unless the user explicitly asks for a design-system refresh.

## Implementation Rules

Use `tokens.css` variables instead of raw values. Follow the component contracts in `DESIGN.md` for layout, spacing, imagery, interaction, and responsive behavior. Do not copy placeholder content, generated images, or fake references from the source screen.

## How To Use `tokens.css`

Reference variables with `var(--ds-token-name)`, for example `color: var(--ds-color-primary)`. Do not convert these tokens into Tailwind config inside this package. If a future implementation uses Tailwind, consume the variables manually or map them in a separate implementation step.

## How To Use `kitchensink.html`

Treat `kitchensink.html` as a style fixture and state reference, not production code. It demonstrates expected visual behavior for tokens and common components without requiring the original source material.

## Do

- Preserve the warm sand background, deep teal primary color, earth-brown accent, and editorial heading style.
- Use `Playfair Display` for headings and `Work Sans` for body and UI text.
- Use rounded cards, organic media shapes, wave dividers, and tactile primary buttons where appropriate.
- Keep layouts airy, centered, and human-scaled.
- Derive new components from existing tokens and contracts.

## Do Not

- Do not use raw colors, spacing, font stacks, shadows, or radii when a `--ds-*` token exists.
- Do not use Stitch-hosted images, fake client names, fake metrics, or placeholder social links as production content.
- Do not introduce sharp corporate SaaS styling that conflicts with the warm organic direction.
- Do not add heavy animation, parallax, or JavaScript-only interactions as baseline design-system behavior.
- Do not reopen Stitch for normal implementation decisions.

## When Information Is Missing

Derive missing components conservatively from the closest documented component contract. If evidence is insufficient or a choice would affect brand perception, ask the user before inventing a new pattern.

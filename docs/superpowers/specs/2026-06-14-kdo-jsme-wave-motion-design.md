# Kdo Jsme Wave Motion Design

## Goal

Make the desktop `Kdo jsme` decorative wave feel gently alive without distracting from the contact conversion and closing brand statement.

## Approved Direction

Use a subtle breathing animation for the existing local ribbon-wave SVG in `IntroStatement.astro`.

The motion should:

- Move slowly and continuously.
- Apply only to the decorative desktop wave panel.
- Combine gentle vertical drift with a slight scale change.
- Add tiny staggered offsets to individual ribbons so the movement feels organic rather than mechanical.
- Preserve existing SVG shapes, colors, copy, assets, and section layout.
- Keep the mobile behavior unchanged, because the decorative wave panel is already omitted there.
- Disable non-essential transforms when `prefers-reduced-motion: reduce` is active.

## Implementation Scope

Update the existing `IntroStatement.astro` component styles only for the animation behavior. Do not add JavaScript, new assets, new content, new sections, metrics, testimonials, or client proof.

Update invariant tests so the motion contract is protected: the intro wave should expose the breathing animation, staggered ribbon timing, and reduced-motion override.

## Verification

Run `npm run test` and `npm run build` after implementation. Browser review should confirm the animation is slow, low-amplitude, desktop-only, and visually calm.

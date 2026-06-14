# Kdo Jsme WebGL Shader Design

## Goal

Make the desktop `Kdo jsme` decorative visual use the supplied flowing-line shader as a scoped WebGL enhancement without changing the Astro static-site stack or distracting from the closing brand statement.

## Approved Direction

Use a real WebGL canvas shader inside the existing `IntroStatement.astro` desktop visual panel, with a local SVG/CSS fallback.

The motion should:

- Apply only to the decorative desktop visual panel.
- Initialize WebGL from a small local TypeScript module, not from React.
- Scope the canvas to the `.intro__visual` panel dimensions, not the full viewport.
- Use WAVE design-system colors in the fragment shader, not the source purple/blue palette.
- Keep a local SVG/CSS fallback visible for no-JavaScript, no-WebGL, shader compile/link failure, and reduced-motion contexts.
- Disable or skip shader animation when `prefers-reduced-motion: reduce` is active.
- Clean up resize listeners and animation frames.
- Do not add React, shadcn, Tailwind, `/components/ui`, Unsplash assets, lucide icons, remote imagery, fake metrics, fake proof, or new dependencies.
- Preserve existing copy, approved assets, section layout, and mobile omission.
- Keep the mobile behavior unchanged, because the decorative wave panel is already omitted there.

## Implementation Scope

Update `IntroStatement.astro` markup/styles for the canvas and fallback, and add a local TypeScript shader initializer. Do not add new assets, new content, new sections, metrics, testimonials, or client proof.

Update invariant tests so the visual contract is protected: the intro visual should expose the shader canvas, fallback SVG, local script import, reduced-motion guard, resize/animation cleanup, WAVE color values, and forbidden React/shadcn/Tailwind/dependency patterns.

## Verification

Run `npm run test` and `npm run build` after implementation. Browser review should confirm the shader is visible on desktop, scoped to `Kdo jsme`, visually calm, hidden on mobile, and backed by the fallback when WebGL or motion is unavailable.

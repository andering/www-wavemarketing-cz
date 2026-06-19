# Hero Marketing Tag Design

## Goal

Style the first `marketing` word in the hero lead sentence as a small shopping-tag-like label. The treatment should add personality to the opening copy without competing with the hero headline, CTAs, or approved floating growth popup.

## Approved Direction

- Use the existing hero lead copy and emphasize only the first `marketing` in `Děláme marketing lidsky.`
- Render the emphasized word as an inline tag with equal corner rounding on all sides.
- Use a deep teal tag face, white/off-white text, and a subtle warm brown bottom edge.
- Rotate the tag slightly so it feels handmade, but keep the sentence readable.
- Include a small circular tag hole on the left side with a warm brown border.
- Keep clear spacing between the tag hole and the word `marketing`.
- Do not add the rejected top-right decorative highlight line.

## Constraints

- Preserve the approved Czech content; this is a visual emphasis only.
- Keep the element inline so the lead paragraph remains a normal sentence.
- Use WAVE design-system tokens or existing brand colors from tokens instead of arbitrary new palette values.
- Keep the treatment static; do not add new animation.
- Ensure reduced-motion users are unaffected because no motion is added.
- Keep mobile behavior readable and avoid causing awkward line-height or overlap.

## Implementation Shape

- Split the hero lead around the first `marketing` occurrence in `MarketingHero.astro`, similar to the existing heading emphasis split.
- Wrap only that word in a semantic inline `span` with a scoped class.
- Add component-scoped CSS for the tag shape, rotation, pseudo-element tag hole, thin underside shadow, and responsive line-height compatibility.
- Add an invariant test that confirms the hero renders the marketing tag class and does not alter the approved lead copy in `siteContent`.

## Acceptance Criteria

- The first hero lead `marketing` appears as the approved teal shopping-tag label.
- The tag has balanced right and left rounding.
- The circle is smaller than the previous oversized version, has a warm brown border, and leaves clear space before the word.
- The brown underside is subtle, not a thick block.
- The rest of the hero content, CTAs, image, popup, and headline emphasis remain unchanged.

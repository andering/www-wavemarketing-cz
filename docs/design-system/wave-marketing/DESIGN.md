# WAVE Marketing Design System

## Brand Summary

WAVE Marketing uses a warm, human, wave-inspired visual identity for a small marketing agency that wants to feel professional, approachable, caring, and reliable. The system is extracted from the confirmed Stitch visual source and is intended for a static one-page Czech marketing website. Exact token values live in `tokens.css`; visual fixture examples live in `kitchensink.html`.

## Design Principles

- Lead with warmth before polish: the design should feel personal, not corporate or cold.
- Use wave motifs as connective tissue, especially between large sections.
- Pair editorial confidence with practical clarity: expressive headings, readable body copy, clear CTAs.
- Prefer rounded, tactile, friendly surfaces over hard-edged boxes.
- Use motion sparingly so the site feels alive without distracting from contact conversion.

## Composition Cues

Use a centered maximum-width page rhythm with generous vertical spacing. Hero and major sections should breathe, with ample negative space and restrained density. Alternate text-heavy areas with visual components such as organic image frames, service rows, CTA cards, and wave dividers. Align content to a `--ds-space-container-max` container with mobile and desktop gutters from `tokens.css`.

## Color System

Use `--ds-color-background` for the page base and `--ds-color-surface` or `--ds-color-surface-muted` for quiet section surfaces. Use `--ds-color-primary` for brand text, icons, primary actions, and strong anchors. Use `--ds-color-secondary` for warm emphasis, tactile button backgrounds, highlighted italic words, and quote or CTA accents. Use `--ds-color-border` for subtle dividers and card borders. Use success, warning, and error tokens only for factual feedback states.

## Typography

Use `--ds-font-heading` for all major headings, hero headlines, card titles, and editorial emphasis. Use `--ds-font-body` for paragraphs, navigation, buttons, form controls, and metadata. Hero headlines should use large heading sizes with `--ds-leading-tight` and `--ds-tracking-tight`. Standard body copy uses `--ds-font-weight-regular`, `--ds-text-base`, and `--ds-leading-relaxed`. Lead and intro paragraphs use `--ds-font-weight-light`, `--ds-text-lead` (`1.25rem`), and `--ds-leading-lead`; the mobile/default lead token also stays at `1.25rem` so lead copy never drops below 20px at a 16px root size. Labels and badges should use uppercase body-family text with `--ds-font-weight-semibold` and `--ds-tracking-widest`.

## Layout System

Use one main container width from `--ds-space-container-max`. Desktop sections use `--ds-space-gutter-desktop`; mobile sections use `--ds-space-gutter-mobile`. Use one-column mobile layouts and two-column desktop layouts for hero, media cards, and contact compositions. Services may use a vertical row list on desktop and stacked rows on mobile.

## Spacing Scale

Use `--ds-space-2` through `--ds-space-4` for small internal gaps, `--ds-space-6` through `--ds-space-8` for card padding and row spacing, and `--ds-space-16` through `--ds-space-24` for major sections. Keep CTAs visually separated with at least `--ds-space-6` between button groups and surrounding text.

## Border Radius System

Use `--ds-radius-md` for standard buttons and controls, `--ds-radius-xl` and `--ds-radius-2xl` for cards, and `--ds-radius-3xl` for large contact tiles or prominent media cards. Use `--ds-radius-full` for pills, avatars, and circular icon containers. Use `--ds-radius-organic` for hero or human imagery where an organic wave-like silhouette is appropriate.

## Elevation and Depth

Default surfaces should remain mostly flat with `--ds-shadow-none` or `--ds-shadow-sm`. Use `--ds-shadow-md` and `--ds-shadow-lg` for floating contact widgets and important cards. Use `--ds-shadow-warm` on image cards when warm editorial depth is needed. The primary tactile button uses `--ds-shadow-button` and collapses that edge when pressed.

## Visual Techniques

Use wave dividers between major sections, warm radial background washes, subtle glass navigation, organic image crops, pill labels, and round icon containers. Avoid generic gradients unless they stay close to the warm sand, teal, and brown palette. Decorative shapes should feel fluid and wave-like rather than geometric or tech-heavy.

## Buttons

The primary button uses the warm brown (`--ds-color-secondary`) background, `--ds-color-secondary-foreground` text, tactile shadow, and raised transform. The secondary button uses the deep teal (`--ds-color-primary`) background with white foreground for important direct actions that should differ from the warm hero CTA. The tertiary button uses a white or raised surface, `--ds-color-primary` text, and `--ds-color-border` border; the hero's second button is tertiary. On active, tactile filled buttons translate down by `--ds-space-press-offset` and collapse the edge shadow. Ghost/link buttons use text color transitions and optional underline on hover. Disabled buttons lower opacity, remove movement, and keep keyboard focus visible when focusable.

## Forms

Forms use rounded inputs with light surfaces, `--ds-color-border`, body typography, and generous touch targets. Labels use small uppercase or clear sentence-case body text. Helper text uses `--ds-color-text-muted`; validation errors use `--ds-color-error`. Focus states use `--ds-color-focus` rings and a primary border. The launch website may omit forms, but form controls remain part of the system for future use.

## Cards

Plain cards use raised white surfaces with subtle borders and rounded corners. Elevated cards add `--ds-shadow-md` or `--ds-shadow-lg`. Media cards crop images with large radii and may use `--ds-shadow-warm`. CTA cards use stronger primary or secondary contrast and clear button placement. Card hover may use background tint, slight lift, or link underline, but should not become flashy.

## Navigation / Header

Use a fixed or sticky glass-like header with `--ds-color-surface-glass`, blur, subtle bottom border, and soft shadow. Desktop navigation should center the logo with approved nav links split left and right, giving the logo more vertical presence than standard nav text. The approved launch navigation includes `Reference` immediately before `Kontakt`; `Reference` points to the collaboration process section, not to reference or case-study content. Active links use `--ds-color-secondary`, bold weight, a subtle underline, and `aria-current="page"` while their target section is current. Header social links may render as real brand-colored SVG icons when real social profile URLs are supplied. On desktop, align the social cluster to the far right with a subtle left divider, matching the approved Stitch reference structure. Mobile navigation should open as a mobile offcanvas panel from the right, with a compact logo plus an accessible hamburger trigger in the header; the supplied social links may repeat inside the offcanvas below the anchor navigation. Place the fixed offcanvas layer outside the sticky glass header so it starts at the viewport top. Social icons must only render when real URLs exist.

## Contact Modules

Launch contact sections should prefer a compact direct-contact bento over a form-like grid. On desktop, use a 4-column by 2-row layout where the focused person card spans the left two columns and both rows, while email and availability occupy the two right-side rows. Use a local avatar, name, role, `+420` phone display directly under the role, secondary phone CTA, stacked email action with the address below `Napište nám`, short meeting note, and muted company facts. Contact bento cards use `--ds-radius-2xl` instead of the larger bubble radius. Do not render a contact form, social widget, placeholder links, or remote imagery.

## Footer

Footer uses a muted warm surface, brand title or logo, short positioning copy, menu links, optional legal links, and a subtle top border for copyright. Keep density moderate and readable. Footer links use muted text with secondary hover color.

## Images and Media

Use real, verified assets only for production. Hero and human imagery should use organic blob crops or large rounded frames, white borders, and warm shadows. The approved homepage hero image uses the organic crop treatment from `public/assets/wave-marketing-hero-collaboration.png` on desktop and wider layouts. On mobile, the hero image may be omitted visually without replacing it with a decorative gradient; keep the hero on the standard page surface and rely on the larger headline, copy, and CTA group for emphasis. Media cards use object-cover cropping, large internal padding when framed, and rounded corners. If real imagery is unavailable, prefer abstract wave shapes or reserved placeholders over stock-looking fake team images.

## Decorative Elements

Use SVG wave dividers, circular icon wells, pill badges, warm radial washes, and occasional floating stats/contact tiles. Decorative elements should support the message and not introduce fake metrics or fake proof unless a metric is explicitly approved in the content source of truth, such as the hero `Růst tržeb` `+124%` popup. Dividers should use the original Stitch-style layered wave with a wavy top edge and straight lower closure, colored with `--ds-color-wave-strong` or `--ds-color-wave-soft`.

### Intro Statement Variant: Split Editorial Wave Panel

Use `intro-statement` with variant `split-editorial-wave-panel` when a short human-positioning section needs stronger presence than a centered text card. The layout pairs a large decorative wave panel with an editorial text stack. The visual panel must be generated from WAVE design-system tokens, SVG, gradients, or CSS shapes; do not use Stitch-hosted imagery or unapproved production assets. For the current homepage, the visual panel uses a layered ribbon-wave composition adapted from the approved Stitch node `200080ac556b4fe489265d619b4c9e64`; recreate it locally with SVG/CSS and WAVE tokens instead of using the Stitch-hosted image.

The visual panel should keep a transparent background so the wave motif sits directly on the page surface. Crop visual viewports to the visible bounds so unused top or bottom whitespace does not make the section feel too tall. The desktop visual may use a scoped WebGL canvas shader inspired by flowing wave lines, but only as progressive enhancement inside the `Kdo jsme` visual panel. Keep a local SVG/CSS fallback for no-JavaScript, no-WebGL, shader compile failure, and reduced-motion contexts. The shader must use WAVE design-system colors, not the source purple/blue palette, and must not add React, shadcn, Tailwind, `/components/ui`, Unsplash assets, lucide icons, full-page fixed backgrounds, or other unrelated stack changes. The content stack uses a small uppercase eyebrow, heading, lead paragraph, short warm accent divider, and supporting paragraph. On mobile, omit the decorative wave panel so the section becomes a focused text statement with reduced visual weight. Do not add metrics, case-study counts, client logos, testimonials, or other proof claims unless they are approved in the content source of truth first.

## Shape and Iconography System

Icons are simple, filled or outlined, and placed inside circular or rounded icon wells. Use primary color for default icons and secondary color for warm emphasis. Keep icon sizes consistent within a component. Shape language should favor soft circles, pills, rounded cards, and organic crops.

## Motion System

Use `--ds-duration-fast` for small hover transitions, `--ds-duration-normal` for button and card interactions, and `--ds-duration-slow` only for decorative state changes. Decorative ambient motion, such as the desktop `Kdo jsme` WebGL shader enhancement, must be slow, low-amplitude, panel-scoped, and non-interactive. Use `--ds-ease-standard`. Honor reduced-motion preferences by disabling transforms and non-essential animation while preserving color and focus changes.

## Accessibility Rules

Maintain strong contrast between text and surfaces. All interactive elements need visible focus states, keyboard operability, and semantic HTML. Touch targets should be at least 44px high where practical. Do not rely on color alone for error or active states. Avoid motion that cannot be disabled through reduced-motion handling.

## Responsive Rules

Desktop layouts may use split hero, centered nav, horizontal service rows, and card grids. Tablet layouts should reduce gaps and keep cards readable. Mobile layouts stack content, simplify navigation, reduce hero type size, and keep primary actions prominent. Responsive decisions should explicitly define whether each visual slot keeps, changes, or drops its responsibility on mobile rather than only adjusting spacing. Wave dividers can be shorter on mobile, but should remain visible enough to preserve the brand motif unless a section-specific rule omits a decorative motif.

## Component Guidance

Process sections may use a centered vertical timeline when explaining a small number of collaboration steps. Use circular numbered nodes, a subtle dotted connector in the secondary color, generous vertical rhythm, and text-first content blocks. Approved support slots may include a muted outcome box, compact chips, the approved local solution proposal workshop image for the `Návrh řešení` step, and an existing contact CTA. Do not add unapproved media, fake artifacts, remote images, or new CTA copy inside the process timeline.

When creating a missing component, start from the closest existing contract: use card rules for content blocks, form rules for controls, button rules for actions, and navigation rules for persistent chrome. Prefer fewer variants with strong consistency. If a component requires new brand behavior not evidenced in this package, ask before extending.

## Implementation Notes

Use `tokens.css` as the exact source for reusable values. Use `kitchensink.html` as the visual fixture for expected appearance and component coverage. This package intentionally does not authorize production use of Stitch copy, fake references, fake metrics, placeholder links, or hosted generated images.

## Do / Do Not Checklist

Do use warm sand surfaces, deep teal structure, earth-brown emphasis, editorial headings, rounded cards, wave dividers, and tactile CTAs. Do keep content honest and human. Do derive new elements from the package tokens.

Do not use fake references, fake social links, raw token values, cold monochrome SaaS styling, heavy animation, or generic stock imagery. Do not reopen Stitch for normal implementation unless the design system is being refreshed.

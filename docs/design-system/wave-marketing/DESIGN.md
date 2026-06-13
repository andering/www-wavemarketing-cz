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

Primary buttons use `--ds-color-secondary` background, `--ds-color-secondary-foreground` text, `--ds-radius-md` or stronger rounding, `--ds-shadow-button`, and a raised transform. On hover, keep the button warm and slightly more prominent. On active, translate the button down by `--ds-space-press-offset` and collapse the edge shadow. Secondary buttons use a white or raised surface, `--ds-color-primary` text, and `--ds-color-border` border. Ghost/link buttons use text color transitions and optional underline on hover. Disabled buttons lower opacity, remove movement, and keep keyboard focus visible when focusable.

## Forms

Forms use rounded inputs with light surfaces, `--ds-color-border`, body typography, and generous touch targets. Labels use small uppercase or clear sentence-case body text. Helper text uses `--ds-color-text-muted`; validation errors use `--ds-color-error`. Focus states use `--ds-color-focus` rings and a primary border. The launch website may omit forms, but form controls remain part of the system for future use.

## Cards

Plain cards use raised white surfaces with subtle borders and rounded corners. Elevated cards add `--ds-shadow-md` or `--ds-shadow-lg`. Media cards crop images with large radii and may use `--ds-shadow-warm`. CTA cards use stronger primary or secondary contrast and clear button placement. Card hover may use background tint, slight lift, or link underline, but should not become flashy.

## Navigation / Header

Use a fixed or sticky glass-like header with `--ds-color-surface-glass`, blur, subtle bottom border, and soft shadow. Desktop navigation may center the logo with nav links split left and right. Active links use `--ds-color-secondary`, bold weight, and a subtle underline. Mobile navigation should collapse to a compact logo plus menu control. Social icons must only render when real URLs exist.

## Footer

Footer uses a muted warm surface, brand title or logo, short positioning copy, menu links, optional legal links, and a subtle top border for copyright. Keep density moderate and readable. Footer links use muted text with secondary hover color.

## Images and Media

Use real, verified assets only for production. Hero and human imagery should use organic blob crops or large rounded frames, white borders, and warm shadows. Media cards use object-cover cropping, large internal padding when framed, and rounded corners. If real imagery is unavailable, prefer abstract wave shapes or reserved placeholders over stock-looking fake team images.

## Decorative Elements

Use SVG wave dividers, circular icon wells, pill badges, warm radial washes, and occasional floating stats/contact tiles. Decorative elements should support the message and not introduce fake metrics or fake proof. Dividers should be soft, wave-based, and colored with `--ds-color-wave-strong` or `--ds-color-wave-soft`.

## Shape and Iconography System

Icons are simple, filled or outlined, and placed inside circular or rounded icon wells. Use primary color for default icons and secondary color for warm emphasis. Keep icon sizes consistent within a component. Shape language should favor soft circles, pills, rounded cards, and organic crops.

## Motion System

Use `--ds-duration-fast` for small hover transitions, `--ds-duration-normal` for button and card interactions, and `--ds-duration-slow` only for decorative state changes. Use `--ds-ease-standard`. Honor reduced-motion preferences by disabling transforms and non-essential animation while preserving color and focus changes.

## Accessibility Rules

Maintain strong contrast between text and surfaces. All interactive elements need visible focus states, keyboard operability, and semantic HTML. Touch targets should be at least 44px high where practical. Do not rely on color alone for error or active states. Avoid motion that cannot be disabled through reduced-motion handling.

## Responsive Rules

Desktop layouts may use split hero, centered nav, horizontal service rows, and card grids. Tablet layouts should reduce gaps and keep cards readable. Mobile layouts stack content, simplify navigation, reduce hero type size, and keep primary actions prominent. Wave dividers can be shorter on mobile, but should remain visible enough to preserve the brand motif.

## Component Guidance

When creating a missing component, start from the closest existing contract: use card rules for content blocks, form rules for controls, button rules for actions, and navigation rules for persistent chrome. Prefer fewer variants with strong consistency. If a component requires new brand behavior not evidenced in this package, ask before extending.

## Implementation Notes

Use `tokens.css` as the exact source for reusable values. Use `kitchensink.html` as the visual fixture for expected appearance and component coverage. This package intentionally does not authorize production use of Stitch copy, fake references, fake metrics, placeholder links, or hosted generated images.

## Do / Do Not Checklist

Do use warm sand surfaces, deep teal structure, earth-brown emphasis, editorial headings, rounded cards, wave dividers, and tactile CTAs. Do keep content honest and human. Do derive new elements from the package tokens.

Do not use fake references, fake social links, raw token values, cold monochrome SaaS styling, heavy animation, or generic stock imagery. Do not reopen Stitch for normal implementation unless the design system is being refreshed.

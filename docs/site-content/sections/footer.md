# Footer Content Spec

## Purpose

Close the page with concise brand positioning, navigation, and factual company information.

## Source

This file is the canonical approved content source for the footer; cross-cutting decisions and launch omissions are recorded in `docs/decisions.md`.

## Brand Label

`WAVE Marketing`

## Footer Copy

`Lidský přístup k digitálnímu světu. Pomáháme značkám růst s lehkostí, péčí a strategií, která dává smysl.`

## Footer Navigation

- `Úvod`
- `Naše služby`
- `Kontakt`

## Cookie Settings Control

`Nastavení cookies`

This control reopens the cookie preferences UI. It is an interactive control, not a placeholder legal link.

## Company Facts

- `WAVE marketing s.r.o.`
- `IČO: 29524369`
- `DIČ: CZ29524369`
- `U Nádraží 1658, Mníšek pod Brdy, 25210`
- `spisová značka C 447444 vedená u Městského soudu v Praze`

## Legal Links

Approved legal links, in render order:

- `Ochrana osobních údajů a cookies` -> `/ochrana-osobnich-udaju-a-cookies/`
- `Obchodní podmínky (PDF)` -> `/assets/obchodni-podminky-wave-marketing.pdf`

The terms link opens the user-supplied PDF in a new tab (`target="_blank"`, `rel="noopener"`), without forcing a download. Preserve the supplied document unchanged at `public/assets/obchodni-podminky-wave-marketing.pdf`. It follows the privacy/cookies link and precedes the cookie settings control on every page using the shared footer.

Do not render additional legal links as placeholders.

## Copyright

`© 2026 WAVE Marketing. Všechna práva vyhrazena.`

## Content Requirements

- Keep footer concise.
- Do not include references link at launch.
- Do not include social links in the footer unless that placement is explicitly requested; supplied social URLs are rendered in the header/offcanvas for launch.
- Legal links must point to the approved privacy/cookies page or the supplied terms PDF; no placeholders.
- Include the approved `Nastavení cookies` control so visitors can reopen consent preferences.

## Notes For Page Mapping

- This content maps to the footer component contract from the design system.
- Visual treatment must come from the design system, not this file.

# Contact Section Content Spec

## Purpose

Make the final contact step friendly, direct, and low-friction.

## Source

Derived from `client_brief.md`, section `Kontakt`, with launch decisions recorded in `docs/website-production-roadmap.md`.

## Section Heading

`Pojďme na stejnou vlnu.`

## Intro Copy

`Máte nápad, hledáte marketingového parťáka, nebo se jen chcete poradit u dobré kávy? Ozvěte se nám. Odpovídáme rychle a rádi.`

## Primary Contact Person

- Name: `Jana Skalníková`
- Suggested role label: `CEO & Strategist`
- Phone CTA label: `Zavolejte Janě`
- Phone number display: `+420 605 461 440`
- Phone link target: `tel:+420605461440`
- Photo: `public/assets/jana-skalnikova-photo.png`.

## Email

- Label: `Napište nám`
- Email display: `jana.skalnikova@wavemarketing.cz`
- Email link target: `mailto:jana.skalnikova@wavemarketing.cz`

## Meeting Availability

`Dojedeme za vámi kamkoli, případně se rádi přizpůsobíme online meetingu.`

## Company Details

- Company name: `WAVE marketing s.r.o.`
- IČO: `29524369`
- DIČ: `CZ29524369`
- Address: `U Nádraží 1658, Mníšek pod Brdy, 25210`
- Registry note: `spisová značka C 447444 vedená u Městského soudu v Praze`

## Omitted At Launch

- Contact form is omitted.
- Social profile links are omitted from the contact module for launch; supplied social URLs are rendered in the header/offcanvas only.
- No placeholder social links may be rendered.

## Content Requirements

- Keep the tone personal and concrete.
- Prioritize phone and email actions.
- Use the secondary deep-teal button variant for Jana's phone CTA; keep the phone number visible separately from the shortened CTA label.
- Place the `+420` phone display directly below `CEO & Strategist` in Jana's card.
- Place `jana.skalnikova@wavemarketing.cz` below `Napište nám`, not beside it.
- Do not show a form unless a form handling decision exists.
- Do not show social icons in the contact module unless that placement is explicitly requested.

## Notes For Page Mapping

- This content maps to a compact direct-contact module inspired by the approved Stitch layout.
- Desktop layout should use a 4-column by 2-row contact bento: Jana/person card spans the left half and both rows, email occupies the top-right half, availability occupies the bottom-right half, and muted company facts sit below.
- Contact bento card corners should use `--ds-radius-2xl`, not the larger `--ds-radius-3xl` bubble radius.
- Visual treatment must come from the design system, not this file.

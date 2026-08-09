# Contact Section Content Spec

## Purpose

Make the final contact step friendly, direct, and low-friction, while allowing visitors to submit a minimal backend-backed inquiry without completing a long questionnaire.

## Source

This file is the canonical approved content source for the contact section; cross-cutting launch decisions are recorded in `docs/decisions.md`.

## Section Heading

`Kontaktujte nás`

## Intro Copy

`Máte nápad, hledáte marketingového parťáka, nebo se jen chcete poradit u dobré kávy? Ozvěte se nám. Odpovídáme rychle a rádi.`

## Primary Contact Person

- Name: `Jana Skalníková`
- Suggested role label: `CEO & Strategist`
- Phone CTA label: `Zavolejte Janě`
- Phone number display: `+420 605 461 440`
- Phone link target: `tel:+420605461440`
- Photo: `src/assets/jana-skalnikova-photo.png`, rendered through Astro's build-time image pipeline.

## Email

- Label: `Napište nám`
- Email display: `jana.skalnikova@wavemarketing.cz`
- Email link target: `mailto:jana.skalnikova@wavemarketing.cz`

## Simplified Contact Form

- Form heading: `Nechte nám na sebe kontakt`
- Helper copy: `Stačí nám napsat e-mail, telefon nebo pár slov k tomu, co řešíte. Ozveme se vám co nejdříve.`
- Field label: `Jak se vám můžeme ozvat?`
- Field type: one required textarea that accepts an email address, phone number, or short message.
- Field placeholder: `Například: jana@firma.cz, +420 123 456 789 nebo krátce, s čím potřebujete pomoct.`
- Consent label: `Souhlasím se zpracováním osobních údajů pro účely odpovědi na poptávku.`
- Submit label: `Odeslat nezávaznou poptávku`
- Success behavior: replace the full form-card content inline with the approved thank-you message after the backend accepts the submission. The original form heading, helper copy, fields, consent, Turnstile slot, and submit button must all be hidden.
- Backend: submit to `/api/contact`, implemented as a Cloudflare Pages Function.
- Email delivery: Resend notification email to the approved WAVE recipient address.
- Bot protection: Cloudflare Turnstile token is required and verified server-side before email delivery.
- Do not include the client's full six-field questionnaire for launch.

## Inline Thank-You Copy

- Heading: `Díky za zprávu!`
- Body: `Jdeme si udělat kávu, přečíst si vaše zadání a co nejdříve se vám ozveme s dalšími kroky.`
- Icon: checkmark icon in the same circular primary-color icon-well treatment used by service rows in `Naše služby`.
- Do not use a popup, redirect, or standalone thank-you fallback page for successful contact form submissions.

## Meeting Availability

`Dojedeme za vámi kamkoli, případně se rádi přizpůsobíme online meetingu.`

## Company Details

- Company name: `WAVE marketing s.r.o.`
- IČO: `29524369`
- DIČ: `CZ29524369`
- Address: `U Nádraží 1658, Mníšek pod Brdy, 25210`
- Registry note: `spisová značka C 447444 vedená u Městského soudu v Praze`

## Omitted At Launch

- The full client-proposed questionnaire is omitted.
- Social profile links are omitted from the contact module for launch; supplied social URLs are rendered in the header/offcanvas only.
- No placeholder social links may be rendered.

## Content Requirements

- Keep the tone personal and concrete.
- Prioritize phone and email actions.
- Keep the form visibly secondary to direct phone and email contact, not a replacement for them.
- Use the secondary deep-teal button variant for Jana's phone CTA; keep the phone number visible separately from the shortened CTA label.
- Place the `+420` phone display directly below `CEO & Strategist` in Jana's card.
- Place `jana.skalnikova@wavemarketing.cz` below `Napište nám`, not beside it.
- Do not add fields beyond the approved textarea and consent checkbox without a new content/backend decision.
- Do not show social icons in the contact module unless that placement is explicitly requested.

## Notes For Page Mapping

- This content maps to a compact direct-contact module inspired by the approved Stitch layout, extended with one minimal form card.
- Desktop layout should keep a direct-contact bento: Jana/person card spans the left side, email and availability stay prominent, the simplified form occupies a clear secondary card below or beside the direct contact cards depending on responsive space, and muted company facts sit below.
- Contact bento card corners should use `--ds-radius-2xl`, not the larger `--ds-radius-3xl` bubble radius.
- Visual treatment must come from the design system, not this file.

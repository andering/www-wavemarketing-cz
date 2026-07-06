# Privacy And Cookies Page Content Spec

## Purpose

Provide a real Czech legal-information page for privacy and cookie use before GA4/GTM tracking is enabled publicly. This page supports the cookie consent banner and footer legal link.

## Review Status

This is implementation-ready draft copy based on verified project facts and the approved GTM/cookie setup. It must be reviewed by the client or legal reviewer before being treated as final legal advice.

## Route

`/ochrana-osobnich-udaju-a-cookies/`

## Page Title

`Ochrana osobních údajů a cookies`

## Meta Description

`Informace o tom, jak WAVE marketing s.r.o. zpracovává osobní údaje a používá cookies na webu www.wavemarketing.cz.`

## Controller Facts

- Controller: `WAVE marketing s.r.o.`
- IČO: `29524369`
- DIČ: `CZ29524369`
- Address: `U Nádraží 1658, Mníšek pod Brdy, 25210`
- Registry note: `spisová značka C 447444 vedená u Městského soudu v Praze`
- Contact email: `jana.skalnikova@wavemarketing.cz`

## Draft Page Copy

### Ochrana osobních údajů a cookies

Tady najdete přehled toho, jak společnost WAVE marketing s.r.o. pracuje s osobními údaji a cookies na webu `www.wavemarketing.cz`.

### Kdo je správcem údajů

Správcem osobních údajů je WAVE marketing s.r.o., IČO: 29524369, DIČ: CZ29524369, se sídlem U Nádraží 1658, Mníšek pod Brdy, 25210, spisová značka C 447444 vedená u Městského soudu v Praze.

V otázkách ochrany osobních údajů nás můžete kontaktovat na e-mailu `jana.skalnikova@wavemarketing.cz`.

### Jaké údaje zpracováváme

Pokud nás kontaktujete e-mailem, telefonicky nebo přes kontaktní formulář na webu, zpracováváme údaje, které nám sami předáte, zejména kontaktní údaje a obsah zprávy nebo poptávky. Kontaktní formulář slouží pouze k tomu, abychom mohli odpovědět na vaši poptávku; odeslání je chráněné službou Cloudflare Turnstile a oznámení z formuláře se doručuje přes službu Resend.

Web může dále pracovat s technickými údaji nutnými pro jeho bezpečné a správné fungování a s údaji z analytických nebo marketingových nástrojů pouze podle nastavení vašeho souhlasu s cookies.

### Proč údaje zpracováváme

Údaje zpracováváme zejména za těmito účely:

- odpověď na váš dotaz nebo poptávku,
- domluva spolupráce nebo schůzky,
- zajištění bezpečného a správného fungování webu,
- měření návštěvnosti a zlepšování webu, pokud k tomu dáte souhlas,
- vyhodnocování marketingu, pokud k tomu dáte souhlas.

### Cookies

Cookies jsou malé soubory, které web ukládá ve vašem prohlížeči. Některé jsou nutné pro fungování webu, jiné nám pomáhají porozumět návštěvnosti nebo vyhodnocovat marketing. Volitelné cookies používáme jen podle vašeho souhlasu.

Nastavení cookies můžete kdykoli změnit přes odkaz `Nastavení cookies` v patičce webu.

### Kategorie cookies

#### Nezbytné cookies

Tyto cookies jsou potřeba pro základní fungování webu a uložení vašeho nastavení cookies. Nelze je vypnout v rámci nastavení cookies.

#### Analytické cookies

Analytické cookies nám pomáhají měřit návštěvnost webu a pochopit, jak lidé web používají. Web používá Google Tag Manager container `GTM-WMJVN6WZ`; Google Analytics 4 je spravován přes Google Tag Manager a spouští se jen při souhlasu s analytickými cookies.

#### Marketingové cookies

Marketingové cookies mohou sloužit k vyhodnocování a cílení reklamních aktivit. Pro launch webu je tato kategorie připravena pro budoucí marketingové nástroje; konkrétní nástroje se mají přidat až po jejich schválení a zapojení do souhlasového nastavení.

### Přehled cookies

| Název       | Kategorie  | Poskytovatel          | Účel                                                        | Doba uložení |
| ----------- | ---------- | --------------------- | ----------------------------------------------------------- | ------------ |
| `cc_cookie` | Nezbytné   | WAVE marketing s.r.o. | Uložení nastavení souhlasu s cookies                        | 6 měsíců     |
| `_ga`       | Analytické | Google Analytics      | Rozlišení návštěvníků pro anonymizované měření návštěvnosti | až 2 roky    |
| `_ga_*`     | Analytické | Google Analytics      | Uložení stavu relace pro měření návštěvnosti                | až 2 roky    |

### Jak souhlas změnit nebo odvolat

Souhlas s analytickými a marketingovými cookies můžete kdykoli změnit nebo odvolat přes odkaz `Nastavení cookies` v patičce webu. Volitelné nástroje se nespustí, pokud k nim nedáte souhlas.

### Předávání údajů třetím stranám

Při udělení souhlasu s analytickými cookies může docházet ke zpracování údajů službami společnosti Google v souvislosti s Google Tag Managerem a Google Analytics. Nastavení souhlasu je řízené přes Google Consent Mode.

### Vaše práva

Máte právo požádat o přístup k osobním údajům, jejich opravu, výmaz, omezení zpracování nebo vznést námitku proti zpracování. Pokud je zpracování založené na souhlasu, můžete souhlas odvolat. Máte také právo obrátit se na Úřad pro ochranu osobních údajů.

### Aktualizace těchto informací

Tyto informace můžeme upravit, pokud se změní web, používané nástroje nebo právní požadavky. Aktuální verze bude vždy dostupná na této stránce.

## Content Requirements

- Keep this as a real legal-information page, not a modal-only text block.
- Do not list future marketing tools as active until they are actually configured and approved.
- Do not add direct GA4 page code; GA4 stays managed through GTM.
- Update the cookie table when new analytics or marketing tools are added.
- Keep the footer link label short: `Ochrana osobních údajů a cookies`.
- Keep the contact-form processing description aligned with the actual backend services before launch.

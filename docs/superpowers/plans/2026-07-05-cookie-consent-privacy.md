# Cookie Consent And Privacy Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a WAVE-styled cookie consent flow, GTM Consent Mode bootstrap for `GTM-WMJVN6WZ`, footer consent controls, and a static Czech privacy/cookies page.

**Architecture:** Keep consent behavior in one bundled browser module, exposed through a tiny Astro component that imports the CookieConsent CSS. Keep content in `src/data/site.ts`, mirroring the approved canonical docs under `docs/site-content/`. Add lightweight Vitest conformance tests that verify the approved IDs, routes, labels, and source-level integration points.

**Tech Stack:** Astro static pages, TypeScript, `vanilla-cookieconsent`, CSS variables from `src/styles/design-system.css`, Vitest.

---

## File Structure

- Modify: `package.json` and `package-lock.json` to add `vanilla-cookieconsent`.
- Modify: `src/data/site.ts` to add `legalPage` and `cookieConsent` data.
- Create: `src/scripts/cookie-consent.ts` for GTM Consent Mode bootstrap and CookieConsent configuration.
- Create: `src/components/CookieConsent.astro` to import CookieConsent CSS and load the bundled browser script.
- Modify: `src/components/SiteFooter.astro` to render the approved privacy/cookies link and `Nastavení cookies` control.
- Modify: `src/pages/index.astro` to render the cookie consent component once per page.
- Create: `src/pages/ochrana-osobnich-udaju-a-cookies/index.astro` for the static legal-information page.
- Create: `src/tests/cookie-consent.test.ts` for spec-backed invariants.

## Task 1: Add Dependency

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install `vanilla-cookieconsent`**

Run:

```bash
npm install vanilla-cookieconsent
```

Expected: `package.json` contains `"vanilla-cookieconsent"` under `dependencies`, and `package-lock.json` is updated.

- [ ] **Step 2: Verify dependency is present**

Run:

```bash
npm ls vanilla-cookieconsent
```

Expected: npm prints a tree containing `vanilla-cookieconsent` with no missing dependency error.

## Task 2: Add Failing Consent And Legal Invariant Tests

**Files:**

- Create: `src/tests/cookie-consent.test.ts`

- [ ] **Step 1: Create the failing test file**

Create `src/tests/cookie-consent.test.ts` with this content:

```ts
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { siteContent } from "../data/site";

const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const readSource = (path: string) =>
  readFileSync(resolve(repositoryRoot, path), "utf8");

describe("cookie consent source-of-truth", () => {
  it("stores the approved GTM and consent category configuration", () => {
    expect(siteContent.cookieConsent.gtmId).toBe("GTM-WMJVN6WZ");
    expect(siteContent.cookieConsent.cookieName).toBe("cc_cookie");
    expect(
      siteContent.cookieConsent.categories.map((category) => category.id),
    ).toEqual(["necessary", "analytics", "marketing"]);
    expect(siteContent.cookieConsent.categories[0]).toMatchObject({
      id: "necessary",
      readOnly: true,
      enabled: true,
    });
  });

  it("uses approved Czech consent labels", () => {
    expect(siteContent.cookieConsent.banner.title).toBe("Používáme cookies");
    expect(siteContent.cookieConsent.banner.acceptAll).toBe("Přijmout vše");
    expect(siteContent.cookieConsent.banner.acceptNecessary).toBe(
      "Jen nezbytné",
    );
    expect(siteContent.cookieConsent.banner.showPreferences).toBe(
      "Nastavit cookies",
    );
    expect(siteContent.cookieConsent.preferences.title).toBe(
      "Nastavení cookies",
    );
    expect(siteContent.footer.cookieSettingsLabel).toBe("Nastavení cookies");
  });

  it("stores the approved privacy and cookies page route and footer link", () => {
    expect(siteContent.legalPage.href).toBe(
      "/ochrana-osobnich-udaju-a-cookies/",
    );
    expect(siteContent.legalPage.title).toBe(
      "Ochrana osobních údajů a cookies",
    );
    expect(siteContent.footer.legalLinks).toEqual([
      {
        label: "Ochrana osobních údajů a cookies",
        href: "/ochrana-osobnich-udaju-a-cookies/",
      },
    ]);
  });
});

describe("cookie consent implementation wiring", () => {
  it("initializes denied consent before loading GTM", () => {
    const source = readSource("src/scripts/cookie-consent.ts");

    expect(source).toContain('gtag("consent", "default"');
    expect(source).toContain('analytics_storage: "denied"');
    expect(source).toContain('ad_storage: "denied"');
    expect(source).toContain(
      "loadGoogleTagManager(siteContent.cookieConsent.gtmId)",
    );
  });

  it("renders the consent component on the homepage", () => {
    const source = readSource("src/pages/index.astro");

    expect(source).toContain(
      "import CookieConsent from '../components/CookieConsent.astro';",
    );
    expect(source).toContain("<CookieConsent />");
  });

  it("renders footer controls for legal page and cookie preferences", () => {
    const source = readSource("src/components/SiteFooter.astro");

    expect(source).toContain("siteContent.footer.legalLinks");
    expect(source).toContain("data-cookie-preferences");
    expect(source).toContain("siteContent.footer.cookieSettingsLabel");
  });

  it("creates the approved static privacy and cookies page", () => {
    const source = readSource(
      "src/pages/ochrana-osobnich-udaju-a-cookies/index.astro",
    );

    expect(source).toContain("siteContent.legalPage.title");
    expect(source).toContain("siteContent.legalPage.sections");
    expect(source).toContain("siteContent.legalPage.cookieTable");
  });
});
```

- [ ] **Step 2: Run the focused tests and confirm failure**

Run:

```bash
npm run test -- src/tests/cookie-consent.test.ts
```

Expected: FAIL because `siteContent.cookieConsent`, `siteContent.legalPage`, `src/scripts/cookie-consent.ts`, `src/components/CookieConsent.astro`, and `src/pages/ochrana-osobnich-udaju-a-cookies/index.astro` do not exist yet.

## Task 3: Add Site Data For Consent And Legal Page

**Files:**

- Modify: `src/data/site.ts`

- [ ] **Step 1: Add `legalPage` and richer footer data**

Replace the current `footer` block with this block:

```ts
  footer: {
    brand: "WAVE Marketing",
    copy: "Lidský přístup k digitálnímu světu. Pomáháme značkám růst s lehkostí, péčí a strategií, která dává smysl.",
    cookieSettingsLabel: "Nastavení cookies",
    legalLinks: [
      {
        label: "Ochrana osobních údajů a cookies",
        href: "/ochrana-osobnich-udaju-a-cookies/",
      },
    ],
    copyright: "© 2026 WAVE Marketing. Všechna práva vyhrazena.",
  },
```

Add this `legalPage` block immediately after the `footer` block:

```ts
  legalPage: {
    href: "/ochrana-osobnich-udaju-a-cookies/",
    title: "Ochrana osobních údajů a cookies",
    description:
      "Informace o tom, jak WAVE marketing s.r.o. zpracovává osobní údaje a používá cookies na webu www.wavemarketing.cz.",
    reviewNote:
      "Tento text vychází z ověřených údajů projektu a nastavení cookies. Před finálním právním použitím má projít kontrolou klienta nebo právního poradce.",
    sections: [
      {
        heading: "Ochrana osobních údajů a cookies",
        paragraphs: [
          "Tady najdete přehled toho, jak společnost WAVE marketing s.r.o. pracuje s osobními údaji a cookies na webu www.wavemarketing.cz.",
        ],
      },
      {
        heading: "Kdo je správcem údajů",
        paragraphs: [
          "Správcem osobních údajů je WAVE marketing s.r.o., IČO: 29524369, DIČ: CZ29524369, se sídlem U Nádraží 1658, Mníšek pod Brdy, 25210, spisová značka C 447444 vedená u Městského soudu v Praze.",
          "V otázkách ochrany osobních údajů nás můžete kontaktovat na e-mailu jana.skalnikova@wavemarketing.cz.",
        ],
      },
      {
        heading: "Jaké údaje zpracováváme",
        paragraphs: [
          "Na webu není kontaktní formulář. Pokud nás kontaktujete e-mailem nebo telefonicky, zpracováváme údaje, které nám sami předáte, zejména jméno, kontaktní údaje a obsah zprávy nebo poptávky.",
          "Web může dále pracovat s technickými údaji nutnými pro jeho bezpečné a správné fungování a s údaji z analytických nebo marketingových nástrojů pouze podle nastavení vašeho souhlasu s cookies.",
        ],
      },
      {
        heading: "Proč údaje zpracováváme",
        list: [
          "odpověď na váš dotaz nebo poptávku",
          "domluva spolupráce nebo schůzky",
          "zajištění bezpečného a správného fungování webu",
          "měření návštěvnosti a zlepšování webu, pokud k tomu dáte souhlas",
          "vyhodnocování marketingu, pokud k tomu dáte souhlas",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: [
          "Cookies jsou malé soubory, které web ukládá ve vašem prohlížeči. Některé jsou nutné pro fungování webu, jiné nám pomáhají porozumět návštěvnosti nebo vyhodnocovat marketing. Volitelné cookies používáme jen podle vašeho souhlasu.",
          "Nastavení cookies můžete kdykoli změnit přes odkaz Nastavení cookies v patičce webu.",
        ],
      },
      {
        heading: "Kategorie cookies",
        subsections: [
          {
            heading: "Nezbytné cookies",
            paragraphs: [
              "Tyto cookies jsou potřeba pro základní fungování webu a uložení vašeho nastavení cookies. Nelze je vypnout v rámci nastavení cookies.",
            ],
          },
          {
            heading: "Analytické cookies",
            paragraphs: [
              "Analytické cookies nám pomáhají měřit návštěvnost webu a pochopit, jak lidé web používají. Web používá Google Tag Manager container GTM-WMJVN6WZ; Google Analytics 4 je spravován přes Google Tag Manager a spouští se jen při souhlasu s analytickými cookies.",
            ],
          },
          {
            heading: "Marketingové cookies",
            paragraphs: [
              "Marketingové cookies mohou sloužit k vyhodnocování a cílení reklamních aktivit. Pro launch webu je tato kategorie připravena pro budoucí marketingové nástroje; konkrétní nástroje se mají přidat až po jejich schválení a zapojení do souhlasového nastavení.",
            ],
          },
        ],
      },
      {
        heading: "Jak souhlas změnit nebo odvolat",
        paragraphs: [
          "Souhlas s analytickými a marketingovými cookies můžete kdykoli změnit nebo odvolat přes odkaz Nastavení cookies v patičce webu. Volitelné nástroje se nespustí, pokud k nim nedáte souhlas.",
        ],
      },
      {
        heading: "Předávání údajů třetím stranám",
        paragraphs: [
          "Při udělení souhlasu s analytickými cookies může docházet ke zpracování údajů službami společnosti Google v souvislosti s Google Tag Managerem a Google Analytics. Nastavení souhlasu je řízené přes Google Consent Mode.",
        ],
      },
      {
        heading: "Vaše práva",
        paragraphs: [
          "Máte právo požádat o přístup k osobním údajům, jejich opravu, výmaz, omezení zpracování nebo vznést námitku proti zpracování. Pokud je zpracování založené na souhlasu, můžete souhlas odvolat. Máte také právo obrátit se na Úřad pro ochranu osobních údajů.",
        ],
      },
      {
        heading: "Aktualizace těchto informací",
        paragraphs: [
          "Tyto informace můžeme upravit, pokud se změní web, používané nástroje nebo právní požadavky. Aktuální verze bude vždy dostupná na této stránce.",
        ],
      },
    ],
    cookieTable: [
      {
        name: "cc_cookie",
        category: "Nezbytné",
        provider: "WAVE marketing s.r.o.",
        purpose: "Uložení nastavení souhlasu s cookies",
        duration: "6 měsíců",
      },
      {
        name: "_ga",
        category: "Analytické",
        provider: "Google Analytics",
        purpose: "Rozlišení návštěvníků pro anonymizované měření návštěvnosti",
        duration: "až 2 roky",
      },
      {
        name: "_ga_*",
        category: "Analytické",
        provider: "Google Analytics",
        purpose: "Uložení stavu relace pro měření návštěvnosti",
        duration: "až 2 roky",
      },
    ],
  },
```

- [ ] **Step 2: Add `cookieConsent` data**

Add this `cookieConsent` block immediately after the `legalPage` block:

```ts
  cookieConsent: {
    gtmId: "GTM-WMJVN6WZ",
    cookieName: "cc_cookie",
    banner: {
      title: "Používáme cookies",
      description:
        "Pomáhají nám měřit návštěvnost webu a zlepšovat marketing. Volitelné cookies spustíme jen s vaším souhlasem.",
      acceptAll: "Přijmout vše",
      acceptNecessary: "Jen nezbytné",
      showPreferences: "Nastavit cookies",
    },
    preferences: {
      title: "Nastavení cookies",
      acceptAll: "Přijmout vše",
      acceptNecessary: "Jen nezbytné",
      save: "Uložit nastavení",
      close: "Zavřít nastavení cookies",
      intro:
        "Sami si můžete vybrat, s čím souhlasíte. Nezbytné cookies zajišťují fungování webu, analytické pomáhají měřit návštěvnost a marketingové jsou připravené pro budoucí reklamní nástroje.",
    },
    categories: [
      {
        id: "necessary",
        label: "Nezbytné cookies",
        description: "Jsou potřeba pro fungování webu a uložení nastavení souhlasu.",
        enabled: true,
        readOnly: true,
      },
      {
        id: "analytics",
        label: "Analytické cookies",
        description: "Pomáhají nám měřit návštěvnost webu pomocí GA4 spravovaného přes GTM.",
        enabled: false,
        readOnly: false,
      },
      {
        id: "marketing",
        label: "Marketingové cookies",
        description: "Jsou připravené pro budoucí reklamní nebo remarketingové nástroje.",
        enabled: false,
        readOnly: false,
      },
    ],
  },
```

- [ ] **Step 3: Run focused test and confirm partial progress**

Run:

```bash
npm run test -- src/tests/cookie-consent.test.ts
```

Expected: tests that only read `siteContent` pass, while implementation wiring tests still fail because the script, component, footer controls, and legal page are not implemented yet.

## Task 4: Add GTM Consent Mode And CookieConsent Script

**Files:**

- Create: `src/scripts/cookie-consent.ts`

- [ ] **Step 1: Create the browser script**

Create `src/scripts/cookie-consent.ts` with this content:

```ts
import * as CookieConsent from "vanilla-cookieconsent";
import { siteContent } from "../data/site";

declare global {
  interface Window {
    dataLayer: unknown[][];
    gtag: (...args: unknown[]) => void;
    CookieConsent: typeof CookieConsent;
  }
}

const gtag = (...args: unknown[]) => {
  window.dataLayer.push(args);
};

const updateGoogleConsent = () => {
  const analyticsGranted = CookieConsent.acceptedCategory("analytics");
  const marketingGranted = CookieConsent.acceptedCategory("marketing");

  gtag("consent", "update", {
    analytics_storage: analyticsGranted ? "granted" : "denied",
    ad_storage: marketingGranted ? "granted" : "denied",
    ad_user_data: marketingGranted ? "granted" : "denied",
    ad_personalization: marketingGranted ? "granted" : "denied",
  });
};

const loadGoogleTagManager = (gtmId: string) => {
  if (document.querySelector(`[data-gtm-container="${gtmId}"]`)) {
    return;
  }

  gtag("js", new Date());

  const script = document.createElement("script");
  script.async = true;
  script.dataset.gtmContainer = gtmId;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
  document.head.append(script);
};

window.dataLayer = window.dataLayer || [];
window.gtag = gtag;
window.CookieConsent = CookieConsent;

gtag("consent", "default", {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  functionality_storage: "granted",
  security_storage: "granted",
  wait_for_update: 500,
});

loadGoogleTagManager(siteContent.cookieConsent.gtmId);

CookieConsent.run({
  mode: "opt-in",
  revision: 1,
  cookie: {
    name: siteContent.cookieConsent.cookieName,
    expiresAfterDays: 182,
    sameSite: "Lax",
  },
  guiOptions: {
    consentModal: {
      layout: "bar inline",
      position: "bottom",
      equalWeightButtons: false,
      flipButtons: false,
    },
    preferencesModal: {
      layout: "box",
      equalWeightButtons: false,
      flipButtons: false,
    },
  },
  categories: {
    necessary: {
      enabled: true,
      readOnly: true,
    },
    analytics: {
      autoClear: {
        cookies: [{ name: /^_ga/ }, { name: "_gid" }],
        reloadPage: false,
      },
    },
    marketing: {},
  },
  onConsent: updateGoogleConsent,
  onChange: updateGoogleConsent,
  language: {
    default: "cs",
    translations: {
      cs: {
        consentModal: {
          title: siteContent.cookieConsent.banner.title,
          description: `${siteContent.cookieConsent.banner.description} <a class="cc-link" href="${siteContent.legalPage.href}">${siteContent.legalPage.title}</a>`,
          acceptAllBtn: siteContent.cookieConsent.banner.acceptAll,
          acceptNecessaryBtn: siteContent.cookieConsent.banner.acceptNecessary,
          showPreferencesBtn: siteContent.cookieConsent.banner.showPreferences,
        },
        preferencesModal: {
          title: siteContent.cookieConsent.preferences.title,
          acceptAllBtn: siteContent.cookieConsent.preferences.acceptAll,
          acceptNecessaryBtn:
            siteContent.cookieConsent.preferences.acceptNecessary,
          savePreferencesBtn: siteContent.cookieConsent.preferences.save,
          closeIconLabel: siteContent.cookieConsent.preferences.close,
          sections: [
            {
              title: "Vaše nastavení soukromí",
              description: siteContent.cookieConsent.preferences.intro,
            },
            {
              title: "Nezbytné cookies",
              description: siteContent.cookieConsent.categories[0].description,
              linkedCategory: "necessary",
            },
            {
              title: "Analytické cookies",
              description: siteContent.cookieConsent.categories[1].description,
              linkedCategory: "analytics",
              cookieTable: {
                headers: {
                  name: "Název",
                  provider: "Poskytovatel",
                  purpose: "Účel",
                  duration: "Doba uložení",
                },
                body: siteContent.legalPage.cookieTable
                  .filter((cookie) => cookie.category === "Analytické")
                  .map((cookie) => ({
                    name: cookie.name,
                    provider: cookie.provider,
                    purpose: cookie.purpose,
                    duration: cookie.duration,
                  })),
              },
            },
            {
              title: "Marketingové cookies",
              description: siteContent.cookieConsent.categories[2].description,
              linkedCategory: "marketing",
            },
            {
              title: "Více informací",
              description: `Podrobnosti najdete na stránce <a class="cc-link" href="${siteContent.legalPage.href}">${siteContent.legalPage.title}</a>.`,
            },
          ],
        },
      },
    },
  },
});

document
  .querySelectorAll<HTMLButtonElement>("[data-cookie-preferences]")
  .forEach((button) => {
    button.addEventListener("click", () => CookieConsent.showPreferences());
  });
```

- [ ] **Step 2: Run typecheck via build and confirm expected follow-up failures**

Run:

```bash
npm run build
```

Expected: build may still fail because `siteContent.cookieConsent` is not yet loaded by a component and the legal page/component tasks are incomplete. If the failure is specifically a TypeScript issue in `src/scripts/cookie-consent.ts`, fix the exact reported type error before continuing.

## Task 5: Add CookieConsent Astro Component And Homepage Integration

**Files:**

- Create: `src/components/CookieConsent.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create the Astro component**

Create `src/components/CookieConsent.astro` with this content:

```astro
---
import "vanilla-cookieconsent/dist/cookieconsent.css";
---

<script src="../scripts/cookie-consent.ts"></script>

<style is:global>
  #cc-main {
    --cc-font-family: var(--ds-font-body);
    --cc-bg: var(--ds-color-surface);
    --cc-primary-color: var(--ds-color-text);
    --cc-secondary-color: var(--ds-color-text-muted);
    --cc-btn-primary-bg: var(--ds-color-secondary);
    --cc-btn-primary-color: var(--ds-color-secondary-foreground);
    --cc-btn-primary-hover-bg: var(--ds-color-secondary-dark);
    --cc-btn-primary-hover-color: var(--ds-color-secondary-foreground);
    --cc-btn-secondary-bg: var(--ds-color-surface-muted);
    --cc-btn-secondary-color: var(--ds-color-primary);
    --cc-btn-secondary-hover-bg: var(--ds-color-background-soft);
    --cc-btn-secondary-hover-color: var(--ds-color-primary);
    --cc-toggle-on-bg: var(--ds-color-primary);
    --cc-toggle-off-bg: var(--ds-color-border);
    --cc-toggle-readonly-bg: var(--ds-color-text-muted);
    --cc-cookie-category-block-bg: var(--ds-color-surface-muted);
    --cc-cookie-category-block-border: var(--ds-color-border);
    --cc-cookie-category-block-hover-bg: var(--ds-color-background-soft);
    --cc-separator-border-color: var(--ds-color-border);
    --cc-footer-bg: var(--ds-color-surface-muted);
    --cc-footer-color: var(--ds-color-text-muted);
    --cc-overlay-bg: rgba(0, 59, 61, 0.32);
  }

  #cc-main .cm,
  #cc-main .pm {
    border: var(--ds-border-width) solid var(--ds-color-border);
    border-radius: var(--ds-radius-2xl);
    box-shadow: var(--ds-shadow-lg);
  }

  #cc-main .cm__btn,
  #cc-main .pm__btn {
    border-radius: var(--ds-radius-full);
    font-weight: var(--ds-font-weight-semibold);
    min-height: 44px;
  }

  #cc-main .cm__btn:focus-visible,
  #cc-main .pm__btn:focus-visible,
  #cc-main .pm__close-btn:focus-visible {
    outline: 3px solid var(--ds-color-focus);
    outline-offset: 3px;
  }

  #cc-main .cc-link {
    color: var(--ds-color-primary);
    font-weight: var(--ds-font-weight-semibold);
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }

  @media (max-width: 720px) {
    #cc-main .cm {
      border-radius: var(--ds-radius-xl) var(--ds-radius-xl) 0 0;
    }
  }
</style>
```

- [ ] **Step 2: Render the component on the homepage**

In `src/pages/index.astro`, add the import after the `SiteFooter` import:

```astro
import CookieConsent from '../components/CookieConsent.astro';
```

Render the component after `<SiteFooter />`:

```astro
    <SiteFooter />
    <CookieConsent />
```

- [ ] **Step 3: Run focused tests and confirm remaining failures**

Run:

```bash
npm run test -- src/tests/cookie-consent.test.ts
```

Expected: homepage integration tests pass; footer and legal-page tests still fail until later tasks are complete.

## Task 6: Add Footer Legal Link And Cookie Settings Control

**Files:**

- Modify: `src/components/SiteFooter.astro`

- [ ] **Step 1: Replace footer navigation markup**

Replace the current footer `<nav aria-label="Patička">...</nav>` block with this markup:

```astro
    <nav aria-label="Patička" class="site-footer__links">
      {siteContent.navigation.map((item) => <a href={item.href}>{item.label}</a>)}
      {siteContent.footer.legalLinks.map((item) => <a href={item.href}>{item.label}</a>)}
      <button type="button" data-cookie-preferences>{siteContent.footer.cookieSettingsLabel}</button>
    </nav>
```

- [ ] **Step 2: Update footer link/control styles**

Replace `.site-footer nav` and link rules with these rules:

```css
.site-footer__links {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-3);
}

.site-footer a,
.site-footer button {
  background: transparent;
  border: 0;
  color: var(--ds-color-text-muted);
  cursor: pointer;
  font: inherit;
  padding: 0;
  text-align: left;
  text-decoration: none;
}

.site-footer a:hover,
.site-footer button:hover {
  color: var(--ds-color-secondary);
}

.site-footer a:focus-visible,
.site-footer button:focus-visible {
  border-radius: var(--ds-radius-sm);
  outline: 3px solid var(--ds-color-focus);
  outline-offset: 3px;
}
```

- [ ] **Step 3: Run focused tests and confirm footer tests pass**

Run:

```bash
npm run test -- src/tests/cookie-consent.test.ts
```

Expected: footer-control tests pass; legal-page tests still fail until the next task.

## Task 7: Create Static Privacy And Cookies Page

**Files:**

- Create: `src/pages/ochrana-osobnich-udaju-a-cookies/index.astro`

- [ ] **Step 1: Create the page file**

Create `src/pages/ochrana-osobnich-udaju-a-cookies/index.astro` with this content:

```astro
---
import SiteHeader from '../../components/SiteHeader.astro';
import SiteFooter from '../../components/SiteFooter.astro';
import CookieConsent from '../../components/CookieConsent.astro';
import { siteContent } from '../../data/site';
import '../../styles/design-system.css';

const page = siteContent.legalPage;
---

<!doctype html>
<html lang={siteContent.meta.language}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{page.title} | WAVE marketing s.r.o.</title>
    <meta name="description" content={page.description} />
  </head>
  <body>
    <SiteHeader />
    <main class="legal-page">
      <article class="container legal-page__content" aria-labelledby="legal-page-title">
        <p class="legal-page__eyebrow">Soukromí a cookies</p>
        <h1 id="legal-page-title">{page.title}</h1>
        <p class="legal-page__review-note">{page.reviewNote}</p>

        {page.sections.map((section) => (
          <section class="legal-page__section">
            <h2>{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => <p>{paragraph}</p>)}
            {section.list && (
              <ul>
                {section.list.map((item) => <li>{item}</li>)}
              </ul>
            )}
            {section.subsections?.map((subsection) => (
              <section class="legal-page__subsection">
                <h3>{subsection.heading}</h3>
                {subsection.paragraphs.map((paragraph) => <p>{paragraph}</p>)}
              </section>
            ))}
          </section>
        ))}

        <section class="legal-page__section">
          <h2>Přehled cookies</h2>
          <div class="legal-page__table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Název</th>
                  <th>Kategorie</th>
                  <th>Poskytovatel</th>
                  <th>Účel</th>
                  <th>Doba uložení</th>
                </tr>
              </thead>
              <tbody>
                {page.cookieTable.map((cookie) => (
                  <tr>
                    <td><code>{cookie.name}</code></td>
                    <td>{cookie.category}</td>
                    <td>{cookie.provider}</td>
                    <td>{cookie.purpose}</td>
                    <td>{cookie.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </article>
    </main>
    <SiteFooter />
    <CookieConsent />
  </body>
</html>

<style>
  .legal-page {
    background: var(--ds-color-background);
  }

  .legal-page__content {
    max-width: 920px;
    padding-block: var(--ds-space-16);
  }

  .legal-page__eyebrow {
    color: var(--ds-color-secondary);
    font-size: var(--ds-text-sm);
    font-weight: var(--ds-font-weight-semibold);
    letter-spacing: var(--ds-tracking-widest);
    margin: 0 0 var(--ds-space-3);
    text-transform: uppercase;
  }

  .legal-page h1,
  .legal-page h2,
  .legal-page h3 {
    color: var(--ds-color-primary);
    font-family: var(--ds-font-heading);
    line-height: var(--ds-leading-tight);
  }

  .legal-page h1 {
    font-size: clamp(2.5rem, 6vw, 4.75rem);
    letter-spacing: var(--ds-tracking-tight);
    margin: 0 0 var(--ds-space-6);
  }

  .legal-page h2 {
    font-size: var(--ds-text-3xl);
    margin: 0 0 var(--ds-space-4);
  }

  .legal-page h3 {
    font-size: var(--ds-text-xl);
    margin: var(--ds-space-6) 0 var(--ds-space-3);
  }

  .legal-page p,
  .legal-page li {
    color: var(--ds-color-text-muted);
    line-height: var(--ds-leading-relaxed);
  }

  .legal-page__review-note {
    background: var(--ds-color-surface-muted);
    border: var(--ds-border-width) solid var(--ds-color-border);
    border-radius: var(--ds-radius-xl);
    color: var(--ds-color-text);
    margin: 0 0 var(--ds-space-10);
    padding: var(--ds-space-5);
  }

  .legal-page__section + .legal-page__section {
    margin-top: var(--ds-space-10);
  }

  .legal-page ul {
    margin-block: var(--ds-space-4) 0;
    padding-left: var(--ds-space-6);
  }

  .legal-page li + li {
    margin-top: var(--ds-space-2);
  }

  .legal-page__table-wrap {
    border: var(--ds-border-width) solid var(--ds-color-border);
    border-radius: var(--ds-radius-xl);
    overflow-x: auto;
  }

  .legal-page table {
    border-collapse: collapse;
    min-width: 760px;
    width: 100%;
  }

  .legal-page th,
  .legal-page td {
    border-bottom: var(--ds-border-width) solid var(--ds-color-border);
    padding: var(--ds-space-4);
    text-align: left;
    vertical-align: top;
  }

  .legal-page th {
    background: var(--ds-color-surface-muted);
    color: var(--ds-color-primary);
    font-weight: var(--ds-font-weight-semibold);
  }

  .legal-page tr:last-child td {
    border-bottom: 0;
  }

  @media (max-width: 720px) {
    .legal-page__content {
      padding-block: var(--ds-space-12);
    }
  }
</style>
```

- [ ] **Step 2: Run focused tests and confirm all focused tests pass**

Run:

```bash
npm run test -- src/tests/cookie-consent.test.ts
```

Expected: PASS for all tests in `src/tests/cookie-consent.test.ts`.

## Task 8: Verify Build, Behavior, And Browser Rendering

**Files:**

- Inspect generated output and rendered pages.

- [ ] **Step 1: Run all tests**

Run:

```bash
npm run test
```

Expected: PASS.

- [ ] **Step 2: Run production build**

Run:

```bash
npm run build
```

Expected: PASS. Astro outputs static pages including the homepage and `/ochrana-osobnich-udaju-a-cookies/`.

- [ ] **Step 3: Start preview server**

Run:

```bash
npm run preview -- --host 0.0.0.0
```

Expected: preview server starts and prints a local URL.

- [ ] **Step 4: Browser-check desktop homepage**

Open the preview URL in a desktop viewport. Verify:

- Cookie banner appears at the bottom.
- Buttons show `Přijmout vše`, `Jen nezbytné`, and `Nastavit cookies`.
- `Nastavit cookies` opens preferences with `Nezbytné cookies`, `Analytické cookies`, and `Marketingové cookies`.
- Footer shows `Ochrana osobních údajů a cookies` and `Nastavení cookies`.
- Header and homepage layout are not visually blocked by the consent bar.

- [ ] **Step 5: Browser-check mobile homepage**

Resize to a mobile viewport around 390px wide. Verify:

- Cookie banner behaves like a compact bottom sheet.
- Buttons remain tappable and at least 44px tall.
- Preferences modal is readable and scrollable.
- Footer legal and cookie controls stack cleanly.

- [ ] **Step 6: Browser-check legal page**

Open `/ochrana-osobnich-udaju-a-cookies/`. Verify:

- Page title is `Ochrana osobních údajů a cookies`.
- Legal text is readable in a narrow column.
- Cookie table scrolls horizontally on mobile instead of breaking layout.
- Footer `Nastavení cookies` reopens preferences.

- [ ] **Step 7: Inspect consent defaults in browser console**

On a first-load session with no stored consent, run this in the browser console:

```js
window.dataLayer.filter(
  (entry) => Array.isArray(entry) && entry[0] === "consent",
);
```

Expected: the first consent event is a `default` event with `analytics_storage`, `ad_storage`, `ad_user_data`, and `ad_personalization` set to `denied`.

## Task 9: Final Diff Review

**Files:**

- Review all modified files.

- [ ] **Step 1: Check worktree status**

Run:

```bash
git status --short
```

Expected: modified docs from the approved spec work, implementation files, `package.json`, `package-lock.json`, and the new test file are listed. `.superpowers/` is ignored and should not appear.

- [ ] **Step 2: Review implementation diff**

Run:

```bash
git diff -- package.json package-lock.json src/data/site.ts src/components/CookieConsent.astro src/components/SiteFooter.astro src/pages/index.astro src/pages/ochrana-osobnich-udaju-a-cookies/index.astro src/scripts/cookie-consent.ts src/tests/cookie-consent.test.ts
```

Expected: diff shows only the approved cookie consent, GTM consent, footer, legal page, and tests work.

- [ ] **Step 3: Summarize verification evidence**

Report the exact results of:

```bash
npm run test
npm run build
```

Also report browser checks completed for desktop, mobile, and the legal page.

## Self-Review Checklist

- Spec coverage: tasks cover dependency install, source data, GTM consent default/update flow, CookieConsent UI, footer controls, legal page, tests, build, and browser review.
- No unresolved IDs: GTM is `GTM-WMJVN6WZ`; GA4 is intentionally not present in source code because it is managed through GTM.
- No unsupported tracking tools: marketing category is configured but contains no active external pixel.
- No unsupported legal link: the footer legal link has a real route and content source.
- Commit behavior: do not commit unless the user explicitly requests it.

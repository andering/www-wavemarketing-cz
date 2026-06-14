# WAVE Marketing Static Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the canonical static `www.wavemarketing.cz` one-page website from the approved three-layer documentation stack.

**Architecture:** Use Astro as a static-site generator with file-based components and one homepage. Content comes from `docs/website/` specs, visual rules come from `docs/design-system/wave-marketing/`, and production assets come from `public/assets/`.

**Tech Stack:** Astro, TypeScript, CSS variables, Vitest for content/config checks, static HTML output.

---

## File Structure

- Create `package.json`: npm scripts and dependencies.
- Create `astro.config.mjs`: static Astro configuration.
- Create `tsconfig.json`: strict TypeScript baseline for Astro.
- Create `src/styles/design-system.css`: app-consumable copy of approved design-system tokens plus component utility styles.
- Create `src/data/site.ts`: structured content copied from `docs/website/` specs.
- Create `src/components/SiteHeader.astro`: header/navigation component.
- Create `src/components/WaveDivider.astro`: reusable wave divider component.
- Create `src/components/MarketingHero.astro`: hero section component.
- Create `src/components/IntroStatement.astro`: intro section component.
- Create `src/components/ServiceList.astro`: services section component.
- Create `src/components/ProcessSteps.astro`: cooperation process component.
- Create `src/components/ContactCardGrid.astro`: contact section component.
- Create `src/components/SiteFooter.astro`: footer component.
- Create `src/pages/index.astro`: one-page website assembly.
- Create `src/tests/site-content.test.ts`: verifies launch content exclusions and key content facts.

## Task 1: Initialize Astro Project Files

**Files:**

- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "www-wavemarketing-cz",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "test": "vitest run"
  },
  "dependencies": {
    "@astrojs/check": "^0.9.4",
    "astro": "^6.4.6",
    "typescript": "^5.6.0"
  },
  "devDependencies": {
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  site: "https://www.wavemarketing.cz",
});
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "types": ["vitest/globals", "node"]
  }
}
```

- [ ] **Step 4: Install dependencies**

Run: `npm install`

Expected: `package-lock.json` is created and npm exits with code 0.

- [ ] **Step 5: Run baseline checks**

Run: `npm run test`

Expected: Vitest exits successfully with no tests found or a pass result after tests are added in later tasks.

Run: `npm run build`

Expected: This may fail before `src/pages/index.astro` exists. If it fails only because no Astro page exists, continue to Task 2.

## Task 2: Add Structured Site Content

**Files:**

- Create: `src/data/site.ts`
- Create: `src/tests/site-content.test.ts`

- [ ] **Step 1: Create the failing content test**

Create `src/tests/site-content.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { siteContent } from "../data/site";

describe("siteContent", () => {
  it("contains approved launch navigation only", () => {
    expect(siteContent.navigation.map((item) => item.label)).toEqual([
      "Úvod",
      "Naše služby",
      "Kontakt",
    ]);
    expect(
      siteContent.navigation.some((item) => item.label === "Reference"),
    ).toBe(false);
  });

  it("contains key contact facts", () => {
    expect(siteContent.contact.person.name).toBe("Jana Skalníková");
    expect(siteContent.contact.person.phoneDisplay).toBe("605 461 440");
    expect(siteContent.contact.person.phoneHref).toBe("tel:+420605461440");
    expect(siteContent.contact.email.href).toBe(
      "mailto:jana.skalnikova@wavemarketing.cz",
    );
  });

  it("records resolved production asset paths", () => {
    expect(siteContent.assets.logo).toBe("/assets/wave-marketing-logo.png");
    expect(siteContent.assets.janaPhoto).toBe(
      "/assets/jana-skalnikova-photo.png",
    );
  });

  it("keeps omitted launch features disabled", () => {
    expect(siteContent.launchExclusions.references).toBe(true);
    expect(siteContent.launchExclusions.contactForm).toBe(true);
    expect(siteContent.launchExclusions.socialLinks).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- src/tests/site-content.test.ts`

Expected: FAIL because `src/data/site.ts` does not exist.

- [ ] **Step 3: Create `src/data/site.ts`**

```ts
export const siteContent = {
  meta: {
    title: "WAVE marketing s.r.o. | Přivedeme váš business na tu správnou vlnu",
    description:
      "WAVE marketing s.r.o. pomáhá firmám se strategií, sociálními sítěmi, PPC kampaněmi a obsahem. Děláme marketing lidsky, spolehlivě a s péčí.",
    language: "cs",
  },
  assets: {
    logo: "/assets/wave-marketing-logo.png",
    janaPhoto: "/assets/jana-skalnikova-photo.png",
  },
  navigation: [
    { label: "Úvod", href: "#uvod" },
    { label: "Naše služby", href: "#sluzby" },
    { label: "Kontakt", href: "#kontakt" },
  ],
  hero: {
    eyebrow: "Váš partner v digitálním světě",
    heading: "Přivedeme váš business na tu správnou vlnu",
    lead: "Děláme marketing lidsky. Jsme WAVE marketing s.r.o., skvělá parta lidí, kteří milují svoji práci a věříme, že nejlepší výsledky vznikají tehdy, když se na vás dokážeme dokonale naladit. S péčí, velkou dávkou lidskosti a spolehlivostí.",
    primaryCta: { label: "Jdeme chytit společnou vlnu", href: "#kontakt" },
    secondaryCta: { label: "Jaké vlny chytáme", href: "#sluzby" },
  },
  intro: {
    heading: "Kdo jsme",
    main: "Jsme partneři, kteří naslouchají, chápou váš byznys a pečují o něj jako o vlastní.",
    support:
      "Věříme, že dobrý marketing začíná porozuměním. Než navrhneme řešení, chceme poznat vaši značku, cíle i lidi, pro které pracujete. Díky tomu dokážeme nastavit komunikaci a kampaně, které dávají smysl a stojí na důvěře.",
  },
  services: {
    heading: "S čím vám pomůžeme rozvlnit vody internetu?",
    intro:
      "Než spustíme první kampaň, ptáme se, posloucháme a analyzujeme. Chceme pochopit vaši vizi a dokonale vás navnímat. Teprve pak vybíráme nástroje, které dávají smysl.",
    items: [
      {
        title: "Marketingová strategie",
        icon: "insights",
        text: "Pomůžeme vám najít váš směr. Zjistíme, kdo jsou vaši zákazníci, a nastavíme dlouhodobý plán, který bude mít ten správný směr.",
      },
      {
        title: "Správa sociálních sítí",
        icon: "hub",
        text: "Budujeme komunity. Komunikujeme za vás lidsky, autenticky a tak, aby to vaše sledující bavilo.",
      },
      {
        title: "Výkonnostní marketing (PPC)",
        icon: "ads_click",
        text: "Tvoříme kampaně, které nejen přivádí návštěvníky, ale hlavně prodávají. Peníze nepálíme, ale chytře investujeme.",
      },
      {
        title: "Tvorba obsahu (Copywriting & Grafika)",
        icon: "draw",
        text: "Píšeme texty a tvoříme vizuály, které mají duši a přesně vystihnou tonalitu vaší značky.",
      },
    ],
  },
  process: {
    heading: "Jak probíhá spolupráce",
    intro:
      "Spolupráce začíná tím, že se poznáme. Zajímá nás, jestli jsme na stejné vlně, co potřebujete vyřešit a jak vám můžeme být užiteční.",
    steps: [
      {
        title: "První káva a seznámení",
        text: "Zjistíme, jestli jsme na stejné vlně.",
      },
      {
        title: "Ponoření se do hloubky",
        text: "Poznáme váš byznys od A do Z.",
      },
      { title: "Návrh řešení", text: "Připravíme strategii na míru." },
      {
        title: "Realizace a péče",
        text: "Spustíme kampaně a pravidelně s vámi komunikujeme. Průběžně optimalizujeme a radujeme se ze společných úspěchů.",
      },
    ],
  },
  contact: {
    heading: "Pojďme na stejnou vlnu.",
    intro:
      "Máte nápad, hledáte marketingového parťáka, nebo se jen chcete poradit u dobré kávy? Ozvěte se nám. Odpovídáme rychle a rádi.",
    person: {
      name: "Jana Skalníková",
      role: "CEO & Strategist",
      phoneLabel: "Zavolejte Janě a domluvte se na kafe",
      phoneDisplay: "605 461 440",
      phoneHref: "tel:+420605461440",
    },
    email: {
      label: "Napište nám",
      display: "jana.skalnikova@wavemarketing.cz",
      href: "mailto:jana.skalnikova@wavemarketing.cz",
    },
    meeting:
      "Dojedeme za vámi kamkoli, případně se rádi přizpůsobíme online meetingu.",
    company: [
      "WAVE marketing s.r.o.",
      "IČO: 29524369",
      "DIČ: CZ29524369",
      "U Nádraží 1658, Mníšek pod Brdy, 25210",
      "spisová značka C 447444 vedená u Městského soudu v Praze",
    ],
  },
  footer: {
    brand: "WAVE Marketing",
    copy: "Lidský přístup k digitálnímu světu. Pomáháme značkám růst s lehkostí, péčí a strategií, která dává smysl.",
    copyright: "© 2026 WAVE Marketing. Všechna práva vyhrazena.",
  },
  launchExclusions: {
    references: true,
    contactForm: true,
    socialLinks: true,
    legalPlaceholderLinks: true,
  },
} as const;
```

- [ ] **Step 4: Run the content test**

Run: `npm run test -- src/tests/site-content.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit Task 2**

```bash
git add src/data/site.ts src/tests/site-content.test.ts package.json package-lock.json astro.config.mjs tsconfig.json
git commit -m "feat: add wave marketing site content model"
```

## Task 3: Add Design Tokens And Global Styles

**Files:**

- Create: `src/styles/design-system.css`

- [ ] **Step 1: Create `src/styles/design-system.css`**

Copy the `:root` token block from `docs/design-system/wave-marketing/tokens.css`, then append these global app styles:

```css
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Work+Sans:wght@300;400;500;600;700&display=swap");

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--ds-color-background);
  color: var(--ds-color-text);
  font-family: var(--ds-font-body);
  line-height: var(--ds-leading-normal);
}

img {
  display: block;
  max-width: 100%;
}

a {
  color: inherit;
}

:focus-visible {
  outline: 4px solid var(--ds-color-focus);
  outline-offset: 3px;
}

.material-symbols-outlined {
  font-family: "Material Symbols Outlined";
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: "liga";
  -webkit-font-smoothing: antialiased;
}

.container {
  width: min(
    100% - calc(var(--ds-space-gutter-mobile) * 2),
    var(--ds-space-container-max)
  );
  margin-inline: auto;
}

.section {
  padding-block: var(--ds-space-20);
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  border-radius: var(--ds-radius-full);
  background: rgba(0, 59, 61, 0.06);
  color: var(--ds-color-primary);
  font-size: var(--ds-text-xs);
  font-weight: 700;
  letter-spacing: var(--ds-tracking-widest);
  padding: var(--ds-space-2) var(--ds-space-4);
  text-transform: uppercase;
}

.button {
  align-items: center;
  border: 0;
  border-radius: var(--ds-radius-md);
  cursor: pointer;
  display: inline-flex;
  font-weight: 700;
  gap: var(--ds-space-2);
  justify-content: center;
  min-height: 48px;
  padding: var(--ds-space-3) var(--ds-space-6);
  text-decoration: none;
  transition:
    transform var(--ds-duration-normal) var(--ds-ease-standard),
    box-shadow var(--ds-duration-normal) var(--ds-ease-standard),
    background var(--ds-duration-fast) var(--ds-ease-standard);
}

.button-primary {
  background: var(--ds-color-secondary);
  box-shadow: var(--ds-shadow-button);
  color: var(--ds-color-secondary-foreground);
  transform: translateY(-2px);
}

.button-primary:active {
  box-shadow: none;
  transform: translateY(var(--ds-space-press-offset));
}

.button-secondary {
  background: var(--ds-color-surface-raised);
  border: var(--ds-border-width) solid var(--ds-color-border);
  color: var(--ds-color-primary);
}

@media (min-width: 768px) {
  .container {
    width: min(
      100% - calc(var(--ds-space-gutter-desktop) * 2),
      var(--ds-space-container-max)
    );
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation: none !important;
    scroll-behavior: auto !important;
    transition: none !important;
  }

  .button-primary {
    transform: none;
  }
}
```

- [ ] **Step 2: Verify token source was copied**

Run: `node -e "const fs=require('fs'); const s=fs.readFileSync('src/styles/design-system.css','utf8'); for (const token of ['--ds-color-primary', '--ds-font-heading', '--ds-space-container-max', '--ds-shadow-button']) { if (!s.includes(token)) process.exit(1); } console.log('tokens present')"`

Expected: `tokens present`.

## Task 4: Build Components

**Files:**

- Create: `src/components/SiteHeader.astro`
- Create: `src/components/WaveDivider.astro`
- Create: `src/components/MarketingHero.astro`
- Create: `src/components/IntroStatement.astro`
- Create: `src/components/ServiceList.astro`
- Create: `src/components/ProcessSteps.astro`
- Create: `src/components/ContactCardGrid.astro`
- Create: `src/components/SiteFooter.astro`

- [ ] **Step 1: Create `src/components/SiteHeader.astro`**

```astro
---
import { siteContent } from '../data/site';
---

<header class="site-header">
  <div class="container site-header__inner">
    <a class="site-header__logo" href="#uvod" aria-label="WAVE Marketing úvod">
      <img src={siteContent.assets.logo} alt="WAVE Marketing logo" width="180" height="120" />
    </a>
    <nav class="site-header__nav" aria-label="Hlavní navigace">
      {siteContent.navigation.map((item) => (
        <a href={item.href}>{item.label}</a>
      ))}
    </nav>
  </div>
</header>

<style>
  .site-header {
    background: var(--ds-color-surface-glass);
    backdrop-filter: blur(8px);
    border-bottom: var(--ds-border-width) solid var(--ds-color-border);
    box-shadow: var(--ds-shadow-sm);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .site-header__inner {
    align-items: center;
    display: flex;
    gap: var(--ds-space-6);
    justify-content: space-between;
    min-height: 96px;
    padding-block: var(--ds-space-3);
  }

  .site-header__logo img {
    height: 72px;
    object-fit: contain;
    width: auto;
  }

  .site-header__nav {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: var(--ds-space-6);
    justify-content: flex-end;
  }

  .site-header__nav a {
    color: var(--ds-color-text-muted);
    font-weight: 700;
    text-decoration: none;
  }

  .site-header__nav a:hover {
    color: var(--ds-color-secondary);
  }

  @media (max-width: 720px) {
    .site-header__inner {
      align-items: flex-start;
      flex-direction: column;
      min-height: auto;
    }

    .site-header__logo img {
      height: 60px;
    }
  }
</style>
```

- [ ] **Step 2: Create `src/components/WaveDivider.astro`**

```astro
---
interface Props {
  tone?: 'teal' | 'sand';
}

const { tone = 'teal' } = Astro.props;
const fill = tone === 'teal' ? 'var(--ds-color-primary)' : 'var(--ds-color-surface-muted)';
---

<div class="wave-divider" aria-hidden="true">
  <svg viewBox="0 0 1440 100" preserveAspectRatio="none" role="presentation">
    <path d="M0,50 C240,100 480,0 720,50 C960,100 1200,0 1440,50 L1440,100 L0,100 Z" fill={fill} opacity="0.6"></path>
    <path d="M0,70 C240,20 480,120 720,70 C960,20 1200,120 1440,70 L1440,100 L0,100 Z" fill={fill} opacity="0.35"></path>
  </svg>
</div>

<style>
  .wave-divider {
    line-height: 0;
    overflow: hidden;
  }

  .wave-divider svg {
    display: block;
    height: clamp(48px, 8vw, 96px);
    width: 100%;
  }
</style>
```

- [ ] **Step 3: Create `src/components/MarketingHero.astro`**

```astro
---
import { siteContent } from '../data/site';
---

<section class="hero section" id="uvod">
  <div class="container hero__grid">
    <div class="hero__copy">
      <span class="eyebrow">{siteContent.hero.eyebrow}</span>
      <h1>{siteContent.hero.heading}</h1>
      <p>{siteContent.hero.lead}</p>
      <div class="hero__actions">
        <a class="button button-primary" href={siteContent.hero.primaryCta.href}>{siteContent.hero.primaryCta.label}</a>
        <a class="button button-secondary" href={siteContent.hero.secondaryCta.href}>{siteContent.hero.secondaryCta.label}</a>
      </div>
    </div>
    <div class="hero__visual" aria-label="Abstraktní vlna WAVE Marketing">
      <div class="hero__orb hero__orb--large"></div>
      <div class="hero__orb hero__orb--small"></div>
    </div>
  </div>
</section>

<style>
  .hero {
    overflow: hidden;
    padding-top: var(--ds-space-24);
  }

  .hero__grid {
    align-items: center;
    display: grid;
    gap: var(--ds-space-12);
    grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
  }

  .hero h1 {
    color: var(--ds-color-primary);
    font-family: var(--ds-font-heading);
    font-size: clamp(var(--ds-text-4xl), 6vw, var(--ds-text-6xl));
    letter-spacing: var(--ds-tracking-tight);
    line-height: var(--ds-leading-tight);
    margin: var(--ds-space-6) 0;
    max-width: 780px;
  }

  .hero p {
    color: var(--ds-color-text-muted);
    font-size: var(--ds-text-lg);
    line-height: var(--ds-leading-relaxed);
    margin: 0 0 var(--ds-space-8);
    max-width: 720px;
  }

  .hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ds-space-5);
  }

  .hero__visual {
    aspect-ratio: 1;
    background: radial-gradient(circle at 35% 30%, var(--ds-color-accent), var(--ds-color-primary));
    border: 8px solid var(--ds-color-surface-raised);
    border-radius: var(--ds-radius-organic);
    box-shadow: var(--ds-shadow-warm);
    min-height: 320px;
    position: relative;
  }

  .hero__orb {
    background: rgba(255, 255, 255, 0.24);
    border-radius: var(--ds-radius-full);
    position: absolute;
  }

  .hero__orb--large {
    height: 42%;
    right: 14%;
    top: 16%;
    width: 42%;
  }

  .hero__orb--small {
    bottom: 18%;
    height: 22%;
    left: 18%;
    width: 22%;
  }

  @media (max-width: 900px) {
    .hero__grid {
      grid-template-columns: 1fr;
    }

    .hero__visual {
      min-height: 240px;
    }
  }
</style>
```

- [ ] **Step 4: Create `src/components/IntroStatement.astro`**

```astro
---
import { siteContent } from '../data/site';
---

<section class="intro section" aria-labelledby="intro-heading">
  <div class="container intro__card">
    <h2 id="intro-heading">{siteContent.intro.heading}</h2>
    <p class="intro__main">{siteContent.intro.main}</p>
    <p>{siteContent.intro.support}</p>
  </div>
</section>

<style>
  .intro__card {
    background: var(--ds-color-surface-raised);
    border: var(--ds-border-width) solid var(--ds-color-border);
    border-radius: var(--ds-radius-3xl);
    box-shadow: var(--ds-shadow-sm);
    padding: clamp(var(--ds-space-8), 6vw, var(--ds-space-16));
    text-align: center;
  }

  .intro h2 {
    color: var(--ds-color-primary);
    font-family: var(--ds-font-heading);
    font-size: clamp(var(--ds-text-3xl), 4vw, var(--ds-text-5xl));
    margin: 0 0 var(--ds-space-6);
  }

  .intro p {
    color: var(--ds-color-text-muted);
    margin-inline: auto;
    max-width: 820px;
  }

  .intro__main {
    color: var(--ds-color-primary) !important;
    font-size: var(--ds-text-xl);
    font-weight: 700;
  }
</style>
```

- [ ] **Step 5: Create `src/components/ServiceList.astro`**

```astro
---
import { siteContent } from '../data/site';
---

<section class="services section" id="sluzby" aria-labelledby="services-heading">
  <div class="container">
    <div class="services__header">
      <h2 id="services-heading">{siteContent.services.heading}</h2>
      <p>{siteContent.services.intro}</p>
    </div>
    <div class="services__list">
      {siteContent.services.items.map((service) => (
        <article class="service-row">
          <div class="service-row__icon" aria-hidden="true"><span class="material-symbols-outlined">{service.icon}</span></div>
          <div>
            <h3>{service.title}</h3>
            <p>{service.text}</p>
          </div>
        </article>
      ))}
    </div>
  </div>
</section>

<style>
  .services {
    background: var(--ds-color-surface-muted);
  }

  .services__header {
    margin: 0 auto var(--ds-space-12);
    max-width: 860px;
    text-align: center;
  }

  .services h2 {
    color: var(--ds-color-primary);
    font-family: var(--ds-font-heading);
    font-size: clamp(var(--ds-text-3xl), 4vw, var(--ds-text-5xl));
  }

  .services__header p,
  .service-row p {
    color: var(--ds-color-text-muted);
    line-height: var(--ds-leading-relaxed);
  }

  .services__list {
    display: grid;
    gap: var(--ds-space-2);
    margin-inline: auto;
    max-width: 980px;
  }

  .service-row {
    align-items: flex-start;
    border-bottom: var(--ds-border-width) solid var(--ds-color-border);
    border-radius: var(--ds-radius-lg);
    display: grid;
    gap: var(--ds-space-6);
    grid-template-columns: auto 1fr;
    padding: var(--ds-space-6);
  }

  .service-row:hover {
    background: rgba(255, 255, 255, 0.52);
  }

  .service-row__icon {
    align-items: center;
    background: rgba(0, 59, 61, 0.06);
    border-radius: var(--ds-radius-full);
    color: var(--ds-color-primary);
    display: inline-flex;
    height: 52px;
    justify-content: center;
    width: 52px;
  }

  .service-row h3 {
    color: var(--ds-color-primary);
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-2xl);
    margin: 0 0 var(--ds-space-2);
  }

  @media (max-width: 640px) {
    .service-row {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 6: Create `src/components/ProcessSteps.astro`**

```astro
---
import { siteContent } from '../data/site';
---

<section class="process section" aria-labelledby="process-heading">
  <div class="container">
    <div class="process__header">
      <h2 id="process-heading">{siteContent.process.heading}</h2>
      <p>{siteContent.process.intro}</p>
    </div>
    <div class="process__grid">
      {siteContent.process.steps.map((step, index) => (
        <article class="process-card">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </article>
      ))}
    </div>
  </div>
</section>

<style>
  .process__header {
    margin: 0 auto var(--ds-space-12);
    max-width: 820px;
    text-align: center;
  }

  .process h2 {
    color: var(--ds-color-primary);
    font-family: var(--ds-font-heading);
    font-size: clamp(var(--ds-text-3xl), 4vw, var(--ds-text-5xl));
  }

  .process__header p,
  .process-card p {
    color: var(--ds-color-text-muted);
    line-height: var(--ds-leading-relaxed);
  }

  .process__grid {
    display: grid;
    gap: var(--ds-space-6);
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .process-card {
    background: var(--ds-color-surface-raised);
    border: var(--ds-border-width) solid var(--ds-color-border);
    border-radius: var(--ds-radius-2xl);
    box-shadow: var(--ds-shadow-sm);
    padding: var(--ds-space-6);
  }

  .process-card span {
    color: var(--ds-color-secondary);
    font-weight: 800;
    letter-spacing: var(--ds-tracking-widest);
  }

  .process-card h3 {
    color: var(--ds-color-primary);
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-2xl);
  }

  @media (max-width: 980px) {
    .process__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 620px) {
    .process__grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 7: Create `src/components/ContactCardGrid.astro`**

```astro
---
import { siteContent } from '../data/site';
---

<section class="contact section" id="kontakt" aria-labelledby="contact-heading">
  <div class="container contact__wrap">
    <div class="contact__header">
      <h2 id="contact-heading">{siteContent.contact.heading}</h2>
      <p>{siteContent.contact.intro}</p>
    </div>
    <div class="contact__grid">
      <article class="contact-card contact-card--person">
        <img src={siteContent.assets.janaPhoto} alt="Jana Skalníková" width="180" height="180" />
        <div>
          <h3>{siteContent.contact.person.name}</h3>
          <p>{siteContent.contact.person.role}</p>
          <a class="button button-primary" href={siteContent.contact.person.phoneHref}>{siteContent.contact.person.phoneLabel}</a>
        </div>
      </article>
      <a class="contact-card contact-card--action" href={siteContent.contact.email.href}>
        <span class="material-symbols-outlined" aria-hidden="true">mail</span>
        <strong>{siteContent.contact.email.label}</strong>
        <small>{siteContent.contact.email.display}</small>
      </a>
      <article class="contact-card contact-card--action">
        <span class="material-symbols-outlined" aria-hidden="true">groups</span>
        <strong>Kde se můžeme vidět</strong>
        <small>{siteContent.contact.meeting}</small>
      </article>
      <article class="contact-card contact-card--facts">
        <h3>Fakturační údaje</h3>
        <ul>
          {siteContent.contact.company.map((item) => <li>{item}</li>)}
        </ul>
      </article>
    </div>
  </div>
</section>

<style>
  .contact {
    background: radial-gradient(circle at 50% 30%, rgba(116, 89, 60, 0.09), var(--ds-color-background) 62%);
  }

  .contact__wrap {
    max-width: 1050px;
  }

  .contact__header {
    margin-bottom: var(--ds-space-12);
    text-align: center;
  }

  .contact h2 {
    color: var(--ds-color-primary);
    font-family: var(--ds-font-heading);
    font-size: clamp(var(--ds-text-3xl), 4vw, var(--ds-text-5xl));
  }

  .contact__header p {
    color: var(--ds-color-text-muted);
    line-height: var(--ds-leading-relaxed);
  }

  .contact__grid {
    display: grid;
    gap: var(--ds-space-5);
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .contact-card {
    background: rgba(255, 255, 255, 0.58);
    border: var(--ds-border-width) solid rgba(255, 255, 255, 0.72);
    border-radius: var(--ds-radius-3xl);
    box-shadow: var(--ds-shadow-md);
    color: var(--ds-color-primary);
    padding: var(--ds-space-6);
    text-decoration: none;
  }

  .contact-card--person {
    align-items: center;
    display: grid;
    gap: var(--ds-space-6);
    grid-column: span 2;
    grid-row: span 2;
    grid-template-columns: auto 1fr;
  }

  .contact-card--person img {
    border: 4px solid var(--ds-color-surface-raised);
    border-radius: var(--ds-radius-full);
    box-shadow: var(--ds-shadow-md);
    height: 112px;
    object-fit: cover;
    width: 112px;
  }

  .contact-card h3 {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-2xl);
    margin: 0 0 var(--ds-space-2);
  }

  .contact-card p,
  .contact-card small,
  .contact-card li {
    color: var(--ds-color-text-muted);
  }

  .contact-card--action {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
    justify-content: center;
    text-align: center;
  }

  .contact-card--action .material-symbols-outlined {
    align-items: center;
    background: var(--ds-color-primary);
    border-radius: var(--ds-radius-full);
    color: var(--ds-color-primary-foreground);
    display: inline-flex;
    height: 56px;
    justify-content: center;
    width: 56px;
  }

  .contact-card--facts {
    grid-column: span 4;
  }

  .contact-card--facts ul {
    display: grid;
    gap: var(--ds-space-2);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  @media (max-width: 900px) {
    .contact__grid,
    .contact-card--person {
      grid-template-columns: 1fr;
    }

    .contact-card--person,
    .contact-card--facts,
    .contact-card--action {
      grid-column: span 1;
    }
  }
</style>
```

- [ ] **Step 8: Create `src/components/SiteFooter.astro`**

```astro
---
import { siteContent } from '../data/site';
---

<footer class="site-footer">
  <div class="container site-footer__main">
    <div>
      <strong>{siteContent.footer.brand}</strong>
      <p>{siteContent.footer.copy}</p>
    </div>
    <nav aria-label="Patička">
      {siteContent.navigation.map((item) => <a href={item.href}>{item.label}</a>)}
    </nav>
  </div>
  <div class="container site-footer__bottom">{siteContent.footer.copyright}</div>
</footer>

<style>
  .site-footer {
    background: var(--ds-color-surface-muted);
    color: var(--ds-color-text-muted);
  }

  .site-footer__main {
    display: flex;
    gap: var(--ds-space-8);
    justify-content: space-between;
    padding-block: var(--ds-space-16);
  }

  .site-footer strong {
    color: var(--ds-color-primary);
    display: block;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-3xl);
    margin-bottom: var(--ds-space-4);
  }

  .site-footer p {
    max-width: 440px;
  }

  .site-footer nav {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
  }

  .site-footer a {
    color: var(--ds-color-text-muted);
    text-decoration: none;
  }

  .site-footer a:hover {
    color: var(--ds-color-secondary);
  }

  .site-footer__bottom {
    border-top: var(--ds-border-width) solid var(--ds-color-border);
    padding-block: var(--ds-space-6);
  }

  @media (max-width: 720px) {
    .site-footer__main {
      flex-direction: column;
    }
  }
</style>
```

## Task 5: Assemble Homepage

**Files:**

- Create: `src/pages/index.astro`

- [ ] **Step 1: Create `src/pages/index.astro`**

```astro
---
import SiteHeader from '../components/SiteHeader.astro';
import MarketingHero from '../components/MarketingHero.astro';
import WaveDivider from '../components/WaveDivider.astro';
import IntroStatement from '../components/IntroStatement.astro';
import ServiceList from '../components/ServiceList.astro';
import ProcessSteps from '../components/ProcessSteps.astro';
import ContactCardGrid from '../components/ContactCardGrid.astro';
import SiteFooter from '../components/SiteFooter.astro';
import { siteContent } from '../data/site';
import '../styles/design-system.css';
---

<!doctype html>
<html lang={siteContent.meta.language}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{siteContent.meta.title}</title>
    <meta name="description" content={siteContent.meta.description} />
  </head>
  <body>
    <SiteHeader />
    <main>
      <MarketingHero />
      <WaveDivider tone="teal" />
      <IntroStatement />
      <ServiceList />
      <ProcessSteps />
      <ContactCardGrid />
    </main>
    <SiteFooter />
  </body>
</html>
```

- [ ] **Step 2: Run build**

Run: `npm run build`

Expected: PASS with Astro generating `dist/`.

## Task 6: Add Production Guard Tests

**Files:**

- Modify: `src/tests/site-content.test.ts`

- [ ] **Step 1: Extend the content test**

Append this test case to `src/tests/site-content.test.ts` inside the existing `describe` block:

```ts
it("does not expose fake launch content", () => {
  const serialized = JSON.stringify(siteContent);

  expect(serialized).not.toContain("Acme Corp");
  expect(serialized).not.toContain("Globex");
  expect(serialized).not.toContain("+150%");
  expect(serialized).not.toContain("Reference");
  expect(serialized).not.toContain("GDPR");
  expect(serialized).not.toContain("Obchodní podmínky");
});
```

- [ ] **Step 2: Run tests**

Run: `npm run test`

Expected: PASS.

- [ ] **Step 3: Run build**

Run: `npm run build`

Expected: PASS.

## Task 7: Final Verification

**Files:**

- Verify: `dist/index.html`
- Verify: `public/assets/wave-marketing-logo.png`
- Verify: `public/assets/jana-skalnikova-photo.png`

- [ ] **Step 1: Verify output content**

Run:

```bash
node -e "const fs=require('fs'); const html=fs.readFileSync('dist/index.html','utf8'); const required=['Přivedeme váš business na tu správnou vlnu','S čím vám pomůžeme rozvlnit vody internetu?','Pojďme na stejnou vlnu.','jana.skalnikova@wavemarketing.cz','605 461 440']; const forbidden=['Acme Corp','Globex','Reference','GDPR','Obchodní podmínky']; for (const value of required) { if (!html.includes(value)) { console.error('missing '+value); process.exit(1); } } for (const value of forbidden) { if (html.includes(value)) { console.error('forbidden '+value); process.exit(1); } } console.log('dist content verified')"
```

Expected: `dist content verified`.

- [ ] **Step 2: Verify asset files**

Run:

```bash
node -e "const fs=require('fs'); for (const file of ['public/assets/wave-marketing-logo.png','public/assets/jana-skalnikova-photo.png']) { const stat=fs.statSync(file); if (stat.size === 0) { console.error('empty '+file); process.exit(1); } } console.log('assets verified')"
```

Expected: `assets verified`.

- [ ] **Step 3: Run full project verification**

Run: `npm run test && npm run build`

Expected: both commands pass.

- [ ] **Step 4: Commit final implementation**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src public docs
git commit -m "feat: build wave marketing static site"
```

## Self-Review Checklist

- The plan uses the approved three-layer docs as source material.
- The implementation excludes references, fake client proof, contact form, placeholder social links, and placeholder legal links.
- The plan uses the extracted logo and Jana photo assets.
- The plan includes tests before implementation of content behavior.
- The plan includes build and output verification.

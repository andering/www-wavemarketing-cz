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
  it("uses approved concrete hero CTA labels", () => {
    expect(siteContent.hero.primaryCta.label).toBe("Domluvte si konzultaci");
    expect(siteContent.hero.secondaryCta.label).toBe("Podívejte se na služby");
  });

  it("uses approved concrete process and contact conversion copy", () => {
    const processCta = siteContent.process.steps.at(-1)?.support;

    expect(processCta).toMatchObject({
      type: "cta",
      label: "Domluvte si konzultaci",
      href: "#kontakt",
    });
    expect(siteContent.contact.heading).toBe("Kontaktujte nás");
  });

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
    expect(source).toContain('"gtm.start": Date.now()');
    expect(source).toContain('event: "gtm.js"');
    expect(source).toContain(
      "loadGoogleTagManager(siteContent.cookieConsent.gtmId)",
    );
  });

  it("notifies GTM after updating consent", () => {
    const source = readSource("src/scripts/cookie-consent.ts");
    const consentUpdate = 'gtag("consent", "update"';
    const consentEvent =
      'window.dataLayer.push({ event: "cookie_consent_update" });';

    expect(source).toContain(consentEvent);
    expect(source.indexOf(consentUpdate)).toBeLessThan(
      source.indexOf(consentEvent),
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
    expect(source).toContain("resolveNavigationHref(item.href)");
    expect(source).toContain("data-cookie-preferences");
    expect(source).toContain("siteContent.footer.cookieSettingsLabel");
  });

  it("does not render internal legal review metadata publicly", () => {
    const source = readSource(
      "src/pages/ochrana-osobnich-udaju-a-cookies/index.astro",
    );

    expect(source).not.toContain("reviewNote");
    expect(source).not.toContain("pageReviewNote");
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

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);

const readSource = (path: string) =>
  readFileSync(resolve(repositoryRoot, path), "utf8");

describe("site header implementation", () => {
  it("places the logo before desktop navigation in the header markup", () => {
    const source = readSource("src/components/SiteHeader.astro");
    const logoIndex = source.indexOf('class="site-header__logo');
    const navIndex = source.indexOf('class="site-header__desktop-nav"');

    expect(logoIndex).toBeGreaterThan(-1);
    expect(navIndex).toBeGreaterThan(-1);
    expect(logoIndex).toBeLessThan(navIndex);
  });

  it("renders the desktop contact CTA before social links", () => {
    const source = readSource("src/components/SiteHeader.astro");
    const desktopCtaIndex = source.indexOf("site-header__cta");
    const desktopSocialsIndex = source.indexOf('class="site-header__socials"');

    expect(source).toContain("Zavoláme vám");
    expect(source).not.toContain("Chci zavolat");
    expect(source).not.toContain("Chci konzultaci");
    expect(source).not.toContain("Domluvte si konzultaci");
    expect(source).toContain("resolveNavigationHref('#kontakt')");
    expect(desktopCtaIndex).toBeGreaterThan(-1);
    expect(desktopSocialsIndex).toBeGreaterThan(-1);
    expect(desktopCtaIndex).toBeLessThan(desktopSocialsIndex);
  });

  it("centers desktop navigation and exposes CTA plus a separated plain menu in the mobile header", () => {
    const source = readSource("src/components/SiteHeader.astro");
    const mobileActionsIndex = source.indexOf(
      'class="site-header__mobile-actions"',
    );
    const mobileCtaIndex = source.indexOf("site-header__mobile-cta");
    const mobileDividerIndex = source.indexOf(
      'class="site-header__mobile-divider"',
    );
    const mobileNavIndex = source.indexOf('class="site-header__mobile-nav"');

    expect(source).toContain(".site-header__desktop-nav");
    expect(source).toContain("justify-content: center;");
    expect(mobileActionsIndex).toBeGreaterThan(-1);
    expect(mobileCtaIndex).toBeGreaterThan(mobileActionsIndex);
    expect(mobileDividerIndex).toBeGreaterThan(mobileCtaIndex);
    expect(mobileNavIndex).toBeGreaterThan(mobileDividerIndex);
    expect(source).not.toContain("site-header__mobile-logo-repeat");
    expect(source).not.toContain("site-header__offcanvas-cta");
    expect(source).not.toContain("site-header__mobile-socials");
    expect(source).not.toContain(
      "border-radius: var(--ds-radius-full);\n    color: var(--ds-color-primary);\n    cursor: pointer;\n    display: none;",
    );
  });

  it("uses a repeated logo, social links, divider, and icon-only cross close action in the offcanvas heading", () => {
    const source = readSource("src/components/SiteHeader.astro");
    const headingIndex = source.indexOf(
      'class="site-header__offcanvas-heading"',
    );
    const logoIndex = source.indexOf(
      "site-header__offcanvas-logo",
      headingIndex,
    );
    const closeIndex = source.indexOf(
      "site-header__offcanvas-close",
      headingIndex,
    );
    const actionsIndex = source.indexOf(
      'class="site-header__offcanvas-actions"',
      headingIndex,
    );
    const socialsIndex = source.indexOf(
      'class="site-header__offcanvas-socials"',
      headingIndex,
    );
    const dividerIndex = source.indexOf(
      'class="site-header__offcanvas-divider"',
      headingIndex,
    );
    const navIndex = source.indexOf('<nav aria-label="Mobilní navigace">');

    expect(headingIndex).toBeGreaterThan(-1);
    expect(logoIndex).toBeGreaterThan(headingIndex);
    expect(actionsIndex).toBeGreaterThan(logoIndex);
    expect(socialsIndex).toBeGreaterThan(actionsIndex);
    expect(dividerIndex).toBeGreaterThan(socialsIndex);
    expect(closeIndex).toBeGreaterThan(dividerIndex);
    expect(socialsIndex).toBeLessThan(navIndex);
    expect(source).toContain('aria-label="Zavřít hlavní navigaci"');
    expect(source).toContain("&times;");
    expect(source).not.toContain("<strong>Menu</strong>");
    expect(source).not.toContain(">Zavřít</label>");
    expect(source).not.toContain(
      "border-top: var(--ds-border-width) solid var(--ds-color-border);",
    );
  });

  it("uses an 80px vertical rhythm for desktop, mobile, and offcanvas header areas", () => {
    const source = readSource("src/components/SiteHeader.astro");

    expect(source).toContain("height: 80px;");
    expect(source).toContain("max-height: 80px;");
    expect(source).toContain("min-height: 80px;");
    expect(source).toContain("padding: 0 var(--ds-space-8) var(--ds-space-8);");
    expect(source).toContain("height: 80px;\n    padding-bottom: 0;");
    expect(source).toContain(".site-header__cta,\n  .site-header__mobile-cta");
    expect(source).toContain("transform: translateY(0);");
  });

  it("uses a square-cropped logo viewBox so the artwork fills the header slot", () => {
    const source = readSource("public/assets/wave-marketing-logo.svg");

    expect(source).toContain('viewBox="147 147 730 730"');
  });
});

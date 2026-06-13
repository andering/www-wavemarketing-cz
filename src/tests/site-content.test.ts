import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { siteContent } from "../data/site";

describe("siteContent", () => {
  it("contains approved launch navigation only", () => {
    const navLabels: string[] = siteContent.navigation.map(
      (item) => item.label,
    );

    expect(navLabels).toEqual(["Úvod", "Naše služby", "Kontakt"]);
    expect(navLabels.includes("Reference")).toBe(false);
  });

  it("contains key contact facts", () => {
    expect(siteContent.contact.person.name).toBe("Jana Skalníková");
    expect(siteContent.contact.person.phoneDisplay).toBe("605 461 440");
    expect(siteContent.contact.person.phoneHref).toBe("tel:+420605461440");
    expect(siteContent.contact.email.href).toBe(
      "mailto:jana.skalnikova@wavemarketing.cz",
    );
  });

  it("renders the contact phone display in the contact card", () => {
    const component = readFileSync(
      join(process.cwd(), "src/components/ContactCardGrid.astro"),
      "utf8",
    );

    expect(component).toContain("siteContent.contact.person.phoneDisplay");
  });

  it("records resolved production asset paths", () => {
    expect(siteContent.assets.logo).toBe("/assets/wave-marketing-logo.png");
    expect(siteContent.assets.janaPhoto).toBe(
      "/assets/jana-skalnikova-photo.png",
    );
  });

  it("points to existing public assets", () => {
    for (const assetPath of [
      siteContent.assets.logo,
      siteContent.assets.janaPhoto,
    ]) {
      const publicPath = assetPath.replace(/^\//, "");
      expect(existsSync(join(process.cwd(), "public", publicPath))).toBe(true);
    }
  });

  it("keeps omitted launch features disabled", () => {
    expect(siteContent.launchExclusions.references).toBe(true);
    expect(siteContent.launchExclusions.contactForm).toBe(true);
    expect(siteContent.launchExclusions.socialLinks).toBe(true);
    expect(siteContent.launchExclusions.legalPlaceholderLinks).toBe(true);
  });

  it("does not contain forbidden launch content", () => {
    const serialized = JSON.stringify(siteContent);

    expect(serialized).not.toContain("Reference");
    expect(serialized).not.toContain("Acme Corp");
    expect(serialized).not.toContain("Globex");
    expect(serialized).not.toContain("+150%");
    expect(serialized).not.toContain("GDPR");
    expect(serialized).not.toContain("Obchodní podmínky");
    expect(serialized).not.toContain("instagram.com");
    expect(serialized).not.toContain("facebook.com");
    expect(serialized).not.toContain("linkedin.com");
  });

  it("defines and applies the approved lead paragraph typography", () => {
    const appCss = readFileSync(
      join(process.cwd(), "src/styles/design-system.css"),
      "utf8",
    );
    const tokenCss = readFileSync(
      join(process.cwd(), "docs/design-system/wave-marketing/tokens.css"),
      "utf8",
    );
    const kitchenSink = readFileSync(
      join(process.cwd(), "docs/design-system/wave-marketing/kitchensink.html"),
      "utf8",
    );
    const leadComponents = [
      "MarketingHero.astro",
      "IntroStatement.astro",
      "ServiceList.astro",
      "ProcessSteps.astro",
      "ContactCardGrid.astro",
    ];

    expect(tokenCss).toContain("--ds-font-weight-light: 300;");
    expect(tokenCss).toContain("--ds-text-lead: 1.25rem;");
    expect(tokenCss).toContain("--ds-text-lead-mobile: 1.25rem;");
    expect(appCss).toContain("font-weight: var(--ds-font-weight-light);");
    expect(kitchenSink).toContain('class="lead"');

    for (const componentName of leadComponents) {
      const component = readFileSync(
        join(process.cwd(), "src/components", componentName),
        "utf8",
      );
      expect(component).toMatch(/class="[^"]*\blead\b/);
    }
  });
});

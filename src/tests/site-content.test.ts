import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { siteContent } from "../data/site";

describe("siteContent", () => {
  it("contains approved launch navigation with Reference before Kontakt", () => {
    const navLabels: string[] = siteContent.navigation.map(
      (item) => item.label,
    );

    expect(siteContent.navigation).toEqual([
      { label: "Úvod", href: "#uvod" },
      { label: "Naše služby", href: "#sluzby" },
      { label: "Reference", href: "#spoluprace" },
      { label: "Kontakt", href: "#kontakt" },
    ]);
    expect(navLabels.indexOf("Reference")).toBe(
      navLabels.indexOf("Kontakt") - 1,
    );
  });

  it("contains key contact facts", () => {
    expect(siteContent.contact.person.name).toBe("Jana Skalníková");
    expect(siteContent.contact.person.phoneLabel).toBe("Zavolejte Janě");
    expect(siteContent.contact.person.phoneDisplay).toBe("+420 605 461 440");
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

  it("defines the approved button variants and CTA usage", () => {
    const appCss = readFileSync(
      join(process.cwd(), "src/styles/design-system.css"),
      "utf8",
    );
    const designSystem = readFileSync(
      join(process.cwd(), "docs/design-system/wave-marketing/DESIGN.md"),
      "utf8",
    );
    const hero = readFileSync(
      join(process.cwd(), "src/components/MarketingHero.astro"),
      "utf8",
    );
    const contact = readFileSync(
      join(process.cwd(), "src/components/ContactCardGrid.astro"),
      "utf8",
    );

    expect(designSystem).toContain("primary button uses the warm brown");
    expect(designSystem).toContain("secondary button uses the deep teal");
    expect(designSystem).toContain(
      "tertiary button uses a white or raised surface",
    );
    expect(appCss).toContain(".button-primary");
    expect(appCss).toContain("background: var(--ds-color-secondary);");
    expect(appCss).toContain(".button-secondary");
    expect(appCss).toContain("background: var(--ds-color-primary);");
    expect(appCss).toContain("color: var(--ds-color-primary-foreground);");
    expect(appCss).toContain(".button-tertiary");
    expect(appCss).toContain("background: var(--ds-color-surface-raised);");
    expect(hero).toContain("button button-tertiary");
    expect(contact).toContain("button button-secondary contact__phone");
  });

  it("records resolved production asset paths", () => {
    expect(siteContent.assets.logo).toBe("/assets/wave-marketing-logo.png");
    expect(siteContent.assets.janaPhoto).toBe(
      "/assets/jana-skalnikova-photo.png",
    );
    expect(siteContent.assets.heroImage).toBe(
      "/assets/wave-marketing-hero-collaboration.png",
    );
    expect(siteContent.assets.processSolutionProposalImage).toBe(
      "/assets/wave-marketing-process-solution-proposal.jpg",
    );
  });

  it("points to existing public assets", () => {
    for (const assetPath of [
      siteContent.assets.logo,
      siteContent.assets.janaPhoto,
      siteContent.assets.heroImage,
      siteContent.assets.processSolutionProposalImage,
    ]) {
      const publicPath = assetPath.replace(/^\//, "");
      expect(existsSync(join(process.cwd(), "public", publicPath))).toBe(true);
    }
  });

  it("uses the supplied replacement logo asset", () => {
    const logoPath = join(
      process.cwd(),
      "public",
      siteContent.assets.logo.replace(/^\//, ""),
    );
    const logoHash = createHash("sha256")
      .update(readFileSync(logoPath))
      .digest("hex");

    expect(logoHash).toBe(
      "2a873b50b92fc6e807eed31c587b4c0457df72282d239ab83d794a08368e42d8",
    );
  });

  it("keeps omitted launch features disabled", () => {
    expect(siteContent.launchExclusions.references).toBe(true);
    expect(siteContent.launchExclusions.contactForm).toBe(true);
    expect(siteContent.launchExclusions.socialLinks).toBe(false);
    expect(siteContent.launchExclusions.legalPlaceholderLinks).toBe(true);
  });

  it("uses supplied real social links in the header", () => {
    const component = readFileSync(
      join(process.cwd(), "src/components/SiteHeader.astro"),
      "utf8",
    );
    const siteSpec = readFileSync(
      join(process.cwd(), "docs/website/site.md"),
      "utf8",
    );
    const pageMap = readFileSync(
      join(process.cwd(), "docs/website/page-map.md"),
      "utf8",
    );
    const designSystem = readFileSync(
      join(process.cwd(), "docs/design-system/wave-marketing/DESIGN.md"),
      "utf8",
    );

    expect(siteContent.socialLinks).toEqual([
      {
        label: "Facebook",
        href: "https://www.facebook.com/wavemarketingsro",
        shortLabel: "Fb",
        brandColor: "#1877f2",
      },
      {
        label: "Instagram",
        href: "https://www.instagram.com/wave.marketing.cz/",
        shortLabel: "Ig",
        brandColor: "#e4405f",
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/wave-marketing-s-r-o/",
        shortLabel: "In",
        brandColor: "#0a66c2",
      },
    ]);
    expect(siteSpec).toContain("Supplied social profile URLs");
    expect(pageMap).toContain("Header social links");
    expect(designSystem).toContain("real brand-colored SVG icons");
    expect(component).toContain("site-header__socials");
    expect(component).toContain("site-header__offcanvas-socials");
    expect(component).toContain("siteContent.socialLinks.map");
    expect(component).toContain("socialIconPaths");
    expect(component).toContain("item.brandColor");
    expect(component).toContain("<svg");
    expect(component).toContain("position: absolute;");
    expect(component).toContain("right: 0;");
    expect(component).toContain(
      "border-left: var(--ds-border-width) solid var(--ds-color-border);",
    );
    expect(component).toContain('target="_blank"');
    expect(component).toContain('rel="noreferrer"');
  });

  it("renders the approved hero image from a local asset", () => {
    const component = readFileSync(
      join(process.cwd(), "src/components/MarketingHero.astro"),
      "utf8",
    );

    expect(component).toContain("siteContent.assets.heroImage");
    expect(component).toContain("Creative marketing team collaboration");
    expect(component).not.toContain("lh3.googleusercontent.com");
    expect(JSON.stringify(siteContent.assets)).not.toContain(
      "lh3.googleusercontent.com",
    );
  });

  it("renders the approved hero growth popup from the Stitch reference", () => {
    const component = readFileSync(
      join(process.cwd(), "src/components/MarketingHero.astro"),
      "utf8",
    );
    const heroSpec = readFileSync(
      join(process.cwd(), "docs/website/sections/hero.md"),
      "utf8",
    );
    const pageMap = readFileSync(
      join(process.cwd(), "docs/website/page-map.md"),
      "utf8",
    );

    expect(heroSpec).toContain("Approved hero popup");
    expect(heroSpec).toContain("Růst tržeb");
    expect(heroSpec).toContain("+124%");
    expect(pageMap).toContain("floating growth popup");
    expect(siteContent.hero.popup).toEqual({
      label: "Růst tržeb",
      value: "+124%",
      icon: "trending_up",
    });
    expect(component).toContain("hero__popup");
    expect(component).toContain("siteContent.hero.popup.label");
    expect(component).toContain("siteContent.hero.popup.value");
    expect(component).toContain("siteContent.hero.popup.icon");
    expect(component).toContain(
      "animation: hero-popup-float 1.6s ease-in-out infinite;",
    );
    expect(component).toContain("@keyframes hero-popup-float");
    expect(component).toContain("transform: translateY(-12px);");
    expect(component).toContain("@media (prefers-reduced-motion: reduce)");
    expect(component).toContain("animation: none;");
  });

  it("styles the hero wave phrase with secondary italic emphasis", () => {
    const component = readFileSync(
      join(process.cwd(), "src/components/MarketingHero.astro"),
      "utf8",
    );

    expect(siteContent.hero.heading).toContain("správnou vlnu");
    expect(component).toContain("heroHeadingEmphasis");
    expect(component).toContain('class="hero__heading-emphasis"');
    expect(component).toContain("color: var(--ds-color-secondary);");
    expect(component).toContain("font-style: italic;");
  });

  it("renders the header as an approved centered-logo split navigation", () => {
    const component = readFileSync(
      join(process.cwd(), "src/components/SiteHeader.astro"),
      "utf8",
    );
    const pageMap = readFileSync(
      join(process.cwd(), "docs/website/page-map.md"),
      "utf8",
    );

    expect(pageMap).toContain("centered-logo-split-nav");
    expect(component).toContain("site-header__nav-group--left");
    expect(component).toContain("site-header__nav-group--right");
    expect(component).toContain("site-header__logo-wrap");
    expect(component).toContain("leftNavigation");
    expect(component).toContain("rightNavigation");
    expect(component).toContain("Reference");
  });

  it("tracks the active page section in header navigation", () => {
    const component = readFileSync(
      join(process.cwd(), "src/components/SiteHeader.astro"),
      "utf8",
    );
    const pageMap = readFileSync(
      join(process.cwd(), "docs/website/page-map.md"),
      "utf8",
    );
    const designSystem = readFileSync(
      join(process.cwd(), "docs/design-system/wave-marketing/DESIGN.md"),
      "utf8",
    );

    expect(pageMap).toContain("active section tracking");
    expect(designSystem).toContain("aria-current");
    expect(component).toContain("data-nav-link");
    expect(component).toContain("IntersectionObserver");
    expect(component).toContain("updateActiveNavigation");
    expect(component).toContain("hashchange");
    expect(component).toContain('setAttribute("aria-current", "page")');
    expect(component).toContain("data-active");
    expect(component).toContain('[data-active="true"]');
  });

  it("keeps the header logo balanced across desktop and mobile", () => {
    const component = readFileSync(
      join(process.cwd(), "src/components/SiteHeader.astro"),
      "utf8",
    );

    expect(component).toContain("height: 100px");
    expect(component).toContain("max-height: 100px");
    expect(component).toContain("padding-block: 0");
    expect(component).toContain("height: 72px");
    expect(component).toContain("height: 48px");
  });

  it("renders contact as a compact direct-contact module", () => {
    const component = readFileSync(
      join(process.cwd(), "src/components/ContactCardGrid.astro"),
      "utf8",
    );
    const pageMap = readFileSync(
      join(process.cwd(), "docs/website/page-map.md"),
      "utf8",
    );

    expect(pageMap).toContain("compact-direct-contact-module");
    expect(component).toContain("contact__module");
    expect(component).toContain("contact__person-card");
    expect(component).toContain("contact__status-dot");
    expect(component).toContain("contact__person-meta");
    expect(component).toContain("contact__phone-number");
    expect(component).toContain("contact__email-card");
    expect(component).toContain("contact__action-copy");
    expect(component).toContain("contact__availability-card");
    expect(component).toContain("contact__quick-actions");
    expect(component).toContain("contact__facts-strip");
    expect(component).toContain(
      "grid-template-columns: repeat(4, minmax(0, 1fr));",
    );
    expect(component).toContain("grid-column: 1 / 3;");
    expect(component).toContain("grid-row: 1 / 3;");
    expect(component).toContain("grid-column: 3 / 5;");
    expect(component).toContain("siteContent.assets.janaPhoto");
    expect(component).toContain("siteContent.contact.person.phoneHref");
    expect(component).toContain("siteContent.contact.person.phoneDisplay");
    expect(component).toContain("siteContent.contact.email.href");
    expect(component).toContain("border-radius: var(--ds-radius-2xl);");
    expect(component).not.toContain("border-radius: var(--ds-radius-3xl);");
    expect(component).not.toContain("<form");
    expect(component).not.toContain("Sledujte nás");
    expect(component).not.toContain("lh3.googleusercontent.com");
  });

  it("renders mobile navigation as an offcanvas panel", () => {
    const component = readFileSync(
      join(process.cwd(), "src/components/SiteHeader.astro"),
      "utf8",
    );
    const pageMap = readFileSync(
      join(process.cwd(), "docs/website/page-map.md"),
      "utf8",
    );
    const designSystem = readFileSync(
      join(process.cwd(), "docs/design-system/wave-marketing/DESIGN.md"),
      "utf8",
    );

    expect(pageMap).toContain("mobile-offcanvas-menu");
    expect(designSystem).toContain("mobile offcanvas panel");
    expect(component).toContain("site-header__offcanvas");
    expect(component).toContain("site-header__offcanvas-panel");
    expect(component).toContain("site-header__offcanvas-backdrop");
    expect(component).toContain(".site-header__offcanvas-heading {");
    expect(component).toContain(
      "border-bottom: var(--ds-border-width) solid var(--ds-color-border);",
    );
    expect(component).toContain("padding-bottom: var(--ds-space-6);");
    expect(component).toContain("site-header__menu-toggle");
    expect(component).toContain("position: fixed;");
    expect(component).toContain("inset: 0;");
    expect(component).toContain("visibility: hidden;");
    expect(component).toContain("visibility: visible;");
    expect(component).toContain("transform: translateX(100%);");
    expect(component).toContain("align-content: start;");
    expect(component).toContain(
      ".site-header__menu-toggle:checked ~ .site-header__offcanvas .site-header__offcanvas-panel",
    );
    expect(component).toContain(".site-header__offcanvas-panel a");
    expect(component).not.toContain(".site-header__mobile-nav a");
    expect(component).not.toContain(
      ".site-header__mobile-nav[open] .site-header__offcanvas-panel",
    );
    expect(
      component.indexOf('<div class="site-header__offcanvas">'),
    ).toBeGreaterThan(component.indexOf("</header>"));
    expect(component).toContain(".site-header__offcanvas-panel {");
    expect(component).toContain("position: fixed;");
    expect(component).not.toContain("min-width: 180px;");
  });

  it("records and implements mobile-specific visual responsibilities", () => {
    const designSystem = readFileSync(
      join(process.cwd(), "docs/design-system/wave-marketing/DESIGN.md"),
      "utf8",
    );
    const pageMap = readFileSync(
      join(process.cwd(), "docs/website/page-map.md"),
      "utf8",
    );
    const roadmap = readFileSync(
      join(process.cwd(), "docs/website-production-roadmap.md"),
      "utf8",
    );
    const hero = readFileSync(
      join(process.cwd(), "src/components/MarketingHero.astro"),
      "utf8",
    );
    const header = readFileSync(
      join(process.cwd(), "src/components/SiteHeader.astro"),
      "utf8",
    );
    const intro = readFileSync(
      join(process.cwd(), "src/components/IntroStatement.astro"),
      "utf8",
    );

    expect(designSystem).toContain("accessible hamburger trigger");
    expect(designSystem).toContain(
      "without replacing it with a decorative gradient",
    );
    expect(designSystem).toContain("omit the decorative wave panel");
    expect(pageMap).toContain("omit the image visually");
    expect(pageMap).toContain("do not add a decorative replacement gradient");
    expect(pageMap).toContain("omit the decorative wave panel");
    expect(roadmap).toContain("Responsive responsibility decision");
    expect(roadmap).toContain(
      "different section or component responsibilities",
    );
    expect(hero).not.toContain("radial-gradient(");
    expect(hero).not.toContain("ellipse at 142% 34%");
    expect(hero).not.toContain("rgba(219, 240, 235, 0.28) 0%");
    expect(hero).not.toContain("linear-gradient(");
    expect(hero).not.toContain("135deg");
    expect(hero).not.toContain("#eef7f4 72%");
    expect(hero).toContain(
      "font-size: clamp(var(--ds-text-5xl), 12vw, var(--ds-text-6xl));",
    );
    expect(hero).not.toContain(".hero::before");
    expect(hero).not.toContain(".hero::after");
    expect(hero).toContain("display: none;");
    expect(header).toContain("site-header__hamburger");
    expect(header).toContain("site-header__mobile-nav-text");
    expect(intro).toContain(".intro__visual {");
    expect(intro).toContain("display: none;");
  });

  it("renders the contact conversion area before the final Kdo jsme section", () => {
    const page = readFileSync(
      join(process.cwd(), "src/pages/index.astro"),
      "utf8",
    );
    const pageMap = readFileSync(
      join(process.cwd(), "docs/website/page-map.md"),
      "utf8",
    );

    expect(page.indexOf("<ServiceList />")).toBeLessThan(
      page.indexOf("<ProcessSteps />"),
    );
    expect(page.indexOf("<ProcessSteps />")).toBeLessThan(
      page.indexOf("<ContactCardGrid />"),
    );
    expect(page.indexOf("<ContactCardGrid />")).toBeLessThan(
      page.indexOf("<IntroStatement />"),
    );
    expect(page).not.toContain('<WaveDivider tone="sand" />');
    expect(pageMap.indexOf("### 4. Services Overview")).toBeLessThan(
      pageMap.indexOf("### 5. Cooperation Process"),
    );
    expect(pageMap.indexOf("### 5. Cooperation Process")).toBeLessThan(
      pageMap.indexOf("### 6. Contact"),
    );
    expect(pageMap.indexOf("### 6. Contact")).toBeLessThan(
      pageMap.indexOf("### 7. Intro"),
    );
    expect(pageMap).not.toContain("Wave Divider Before Contact");
  });

  it("does not contain forbidden launch content", () => {
    const serialized = JSON.stringify(siteContent);

    expect(siteContent.launchExclusions.references).toBe(true);
    expect(serialized).not.toContain("Acme Corp");
    expect(serialized).not.toContain("Globex");
    expect(serialized).not.toContain("+150%");
    expect(serialized).not.toContain("GDPR");
    expect(serialized).not.toContain("Obchodní podmínky");
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

  it("keeps service row hover backgrounds visually continuous", () => {
    const component = readFileSync(
      join(process.cwd(), "src/components/ServiceList.astro"),
      "utf8",
    );

    expect(component).toContain(".services__list {");
    expect(component).toContain("gap: 0;");
    expect(component).toContain(".service-row:hover");
    expect(component).toContain(
      "border-bottom: var(--ds-border-width) solid var(--ds-color-border);",
    );
    expect(component).not.toContain("gap: var(--ds-space-2);");
  });

  it("keeps the intro section as a metric-free split wave variant", () => {
    const introSpec = readFileSync(
      join(process.cwd(), "docs/website/sections/intro.md"),
      "utf8",
    );
    const pageMap = readFileSync(
      join(process.cwd(), "docs/website/page-map.md"),
      "utf8",
    );
    const component = readFileSync(
      join(process.cwd(), "src/components/IntroStatement.astro"),
      "utf8",
    );

    expect(siteContent.intro.eyebrow).toBe("O nás");
    expect(introSpec).toContain("## Eyebrow");
    expect(introSpec).toContain("`O nás`");
    expect(pageMap).toContain("Variant: `split-editorial-wave-panel`");
    expect(pageMap).toContain("cropped wave viewport");
    expect(component).toContain("intro__visual");
    expect(component).toContain("intro__wave");
    expect(component).toContain('viewBox="0 80 720 500"');
    expect(component).toContain('class="intro__ribbon intro__ribbon--back"');
    expect(component).toContain('class="intro__ribbon intro__ribbon--front"');
    expect(component).toContain("linearGradient");
    expect(component).toContain("var(--ds-color-primary)");
    expect(component).toContain("var(--ds-color-secondary)");
    expect(component).toContain("var(--ds-color-accent)");
    expect(component).toContain("background: transparent;");
    expect(component).toContain("min-height: clamp(280px, 36vw, 460px);");
    expect(component).toContain("height: 100%;");
    expect(component).toContain(
      "animation: intro-wave-breathe 12s var(--ds-ease-standard) infinite;",
    );
    expect(component).toContain("transform-origin: center;");
    expect(component).toContain("@keyframes intro-wave-breathe");
    expect(component).toContain("@keyframes intro-ribbon-drift");
    expect(component).toContain("animation-delay: -4s;");
    expect(component).toContain("animation-delay: -8s;");
    expect(component).toContain("@media (prefers-reduced-motion: reduce)");
    expect(component).toContain("animation: none;");
    expect(component).not.toContain("min-height: clamp(360px, 50vw, 620px);");
    expect(component).not.toContain("height: 112%;");
    expect(component).not.toContain("radial-gradient(circle at 35% 28%");
    expect(component).not.toContain(
      "linear-gradient(135deg, var(--ds-color-surface-muted), var(--ds-color-accent))",
    );
    expect(component).not.toContain("lh3.googleusercontent.com");

    expect(component).not.toContain("10+");
    expect(component).not.toContain("250+");
    expect(JSON.stringify(siteContent.intro)).not.toContain("10+");
    expect(JSON.stringify(siteContent.intro)).not.toContain("250+");
  });

  it("renders the cooperation process as an approved vertical timeline", () => {
    const processSpec = readFileSync(
      join(process.cwd(), "docs/website/sections/cooperation-process.md"),
      "utf8",
    );
    const pageMap = readFileSync(
      join(process.cwd(), "docs/website/page-map.md"),
      "utf8",
    );
    const component = readFileSync(
      join(process.cwd(), "src/components/ProcessSteps.astro"),
      "utf8",
    );

    expect(pageMap).toContain("Variant: `centered-vertical-timeline`");
    expect(processSpec).toContain("centered vertical timeline");
    expect(processSpec).toContain("solution proposal workshop image");
    expect(component).toContain("process__timeline");
    expect(component).toContain('id="spoluprace"');
    expect(component).toContain("process-step__line");
    expect(component).toContain("process-step__node");
    expect(component).toContain("line-height: 1;");
    expect(component).toContain("process-step__support");
    expect(component).toContain("process-step__outcome");
    expect(component).toContain("process-step__chips");
    expect(component).toContain("process-step__visual");
    expect(component).toContain("process-step__visual-image");
    expect(component).toContain("process-step__cta");
    expect(component).toContain(
      "siteContent.assets.processSolutionProposalImage",
    );
    expect(component).toContain("repeating-linear-gradient");
    expect(component).not.toContain("process__grid");
    expect(component).not.toContain("process-card");
    expect(component).not.toContain("lh3.googleusercontent.com");
    expect(siteContent.process.steps[0].support).toEqual({
      type: "outcome",
      label: "Výstup:",
      text: "Jasné zadání a vzájemné porozumění prioritám.",
    });
    expect(siteContent.process.steps[1].support).toEqual({
      type: "chips",
      items: ["Analýza situace", "Návrh směru"],
    });
    expect(siteContent.process.steps[2].support).toEqual({
      type: "image",
      src: siteContent.assets.processSolutionProposalImage,
      alt: "Marketing strategy workshop for a tailored solution proposal",
    });
    expect(siteContent.process.steps[3].support).toEqual({
      type: "cta",
      label: siteContent.hero.primaryCta.label,
      href: siteContent.hero.primaryCta.href,
    });
  });

  it("renders wave dividers in the original Stitch-style layered wave", () => {
    const component = readFileSync(
      join(process.cwd(), "src/components/WaveDivider.astro"),
      "utf8",
    );
    const designSystem = readFileSync(
      join(process.cwd(), "docs/design-system/wave-marketing/DESIGN.md"),
      "utf8",
    );
    const pageMap = readFileSync(
      join(process.cwd(), "docs/website/page-map.md"),
      "utf8",
    );

    expect(designSystem).toContain("wavy top edge and straight lower closure");
    expect(pageMap).toContain("teal-layered-soft");
    expect(pageMap).not.toContain("sand-to-contact-soft");
    expect(component).toContain('viewBox="0 0 1440 100"');
    expect(component).toContain("L1440,100 L0,100 Z");
    expect(component).toContain("margin-top: clamp(-48px, -4vw, -28px);");
    expect(component).toContain("position: relative;");
    expect(component).not.toContain("wave-divider__path--middle");
    expect(component).not.toContain('viewBox="0 0 1440 160"');
  });

  it("keeps dev-server polling documented for reliable CSS refreshes", () => {
    const astroConfig = readFileSync(
      join(process.cwd(), "astro.config.mjs"),
      "utf8",
    );
    const roadmap = readFileSync(
      join(process.cwd(), "docs/website-production-roadmap.md"),
      "utf8",
    );

    expect(astroConfig).toContain("usePolling: true");
    expect(roadmap).toContain("Vite dev server polling");
    expect(roadmap).toContain("stale CSS");
  });
});

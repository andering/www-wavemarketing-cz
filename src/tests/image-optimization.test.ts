import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);

const readSource = (path: string) =>
  readFileSync(resolve(repositoryRoot, path), "utf8");

const exists = (path: string) => existsSync(resolve(repositoryRoot, path));

describe("image optimization source-of-truth", () => {
  it("documents Astro build-time image processing before CDN delivery", () => {
    expect(readSource("docs/decisions.md")).toContain(
      "Astro's build-time image pipeline",
    );
    expect(readSource("docs/status.md")).toContain("src/assets/");
    expect(readSource("docs/site-content/page-map.md")).toContain(
      "CDN delivery layer",
    );
  });
});

describe("approved image asset locations", () => {
  it("stores transformable raster images under src/assets instead of direct public delivery", () => {
    expect(exists("src/assets/wave-marketing-hero-collaboration.png")).toBe(
      true,
    );
    expect(
      exists("src/assets/wave-marketing-process-solution-proposal.jpg"),
    ).toBe(true);
    expect(exists("src/assets/jana-skalnikova-photo.png")).toBe(true);

    expect(exists("public/assets/wave-marketing-hero-collaboration.png")).toBe(
      false,
    );
    expect(
      exists("public/assets/wave-marketing-process-solution-proposal.jpg"),
    ).toBe(false);
    expect(exists("public/assets/jana-skalnikova-photo.png")).toBe(false);
  });
});

describe("Astro image component usage", () => {
  it("renders the hero through the responsive Picture pipeline", () => {
    const source = readSource("src/components/MarketingHero.astro");

    expect(source).toContain('import { Picture } from "astro:assets"');
    expect(source).toContain("wave-marketing-hero-collaboration.png");
    expect(source).toContain("<Picture");
    expect(source).toContain('formats={["avif", "webp"]}');
    expect(source).toContain('fallbackFormat="webp"');
    expect(source).toContain('loading="eager"');
    expect(source).toContain('fetchpriority="high"');
    expect(source).not.toContain("src={siteContent.assets.heroImage}");
  });

  it("preloads the desktop hero image before body parsing reaches the picture", () => {
    const source = readSource("src/pages/index.astro");

    expect(source).toContain('import { getImage } from "astro:assets"');
    expect(source).toContain("heroAvifSrcSet");
    expect(source).toContain('rel="preload"');
    expect(source).toContain('as="image"');
    expect(source).toContain("imagesrcset={heroAvifSrcSet}");
    expect(source).toContain("imagesizes={heroImageSizes}");
    expect(source).toContain('media="(min-width: 901px)"');
  });

  it("uses a warm pending-state placeholder instead of a blank white hero frame", () => {
    const source = readSource("src/components/MarketingHero.astro");
    const heroFrameStyles = source.match(
      /\.hero__visual-frame \{(?<styles>[\s\S]*?)\n  \}/,
    )?.groups?.styles;

    expect(heroFrameStyles).toContain("--hero-visual-placeholder");
    expect(heroFrameStyles).toContain("linear-gradient");
    expect(heroFrameStyles).not.toContain(
      "background: var(--ds-color-surface-raised);",
    );
  });

  it("renders the process image through the lazy Picture pipeline", () => {
    const source = readSource("src/components/ProcessSteps.astro");

    expect(source).toContain('import { Picture } from "astro:assets"');
    expect(source).toContain("wave-marketing-process-solution-proposal.jpg");
    expect(source).toContain("<Picture");
    expect(source).toContain('fallbackFormat="webp"');
    expect(source).toContain('loading="lazy"');
    expect(source).not.toContain(
      "src={siteContent.assets.processSolutionProposalImage}",
    );
  });

  it("renders the Jana contact photo through Astro image metadata", () => {
    const source = readSource("src/components/ContactCardGrid.astro");

    expect(source).toContain('import { Image } from "astro:assets"');
    expect(source).toContain("jana-skalnikova-photo.png");
    expect(source).toContain("<Image");
    expect(source).not.toContain("src={siteContent.assets.janaPhoto}");
  });
});

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it } from "vitest";

const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const canonicalUrl = "https://www.wavemarketing.cz";
const homeTitle =
  "WAVE marketing s.r.o. | Přivedeme váš business na tu správnou vlnu";
const homeDescription =
  "WAVE marketing s.r.o. pomáhá firmám se strategií, sociálními sítěmi, PPC kampaněmi a obsahem. Děláme marketing lidsky, spolehlivě a s péčí.";
const legalTitle = "Ochrana osobních údajů a cookies | WAVE marketing s.r.o.";
const legalDescription =
  "Informace o tom, jak WAVE marketing s.r.o. zpracovává osobní údaje a používá cookies na webu www.wavemarketing.cz.";

const readBuildOutput = (path: string) =>
  readFileSync(resolve(repositoryRoot, "dist", path), "utf8");

const getAttribute = (tag: string, attribute: string) =>
  tag.match(new RegExp(`\\b${attribute}="([^"]*)"`))?.[1];

const getMetaContent = (html: string, attribute: string, value: string) => {
  const tag = [...html.matchAll(/<meta\b[^>]*>/g)].find(
    ([match]) => getAttribute(match, attribute) === value,
  )?.[0];

  return tag ? getAttribute(tag, "content") : undefined;
};

const getCanonical = (html: string) => {
  const tag = [...html.matchAll(/<link\b[^>]*>/g)].find(
    ([match]) => getAttribute(match, "rel") === "canonical",
  )?.[0];

  return tag ? getAttribute(tag, "href") : undefined;
};

const getOrganizationJsonLd = (html: string) => {
  const content = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  )?.[1];

  expect(content).toBeDefined();

  return JSON.parse(content!);
};

describe("SEO implementation conformance", () => {
  let homepage = "";
  let legalPage = "";

  beforeAll(() => {
    execFileSync("npm", ["run", "build"], {
      cwd: repositoryRoot,
      stdio: "pipe",
    });

    homepage = readBuildOutput("index.html");
    legalPage = readBuildOutput("ochrana-osobnich-udaju-a-cookies/index.html");
  }, 120000);

  it("emits complete homepage metadata with an absolute generated hero image", () => {
    expect(getCanonical(homepage)).toBe(canonicalUrl);
    expect(getMetaContent(homepage, "property", "og:title")).toBe(homeTitle);
    expect(getMetaContent(homepage, "property", "og:description")).toBe(
      homeDescription,
    );
    expect(getMetaContent(homepage, "property", "og:url")).toBe(canonicalUrl);
    expect(getMetaContent(homepage, "property", "og:type")).toBe("website");
    expect(getMetaContent(homepage, "property", "og:image")).toMatch(
      /^https:\/\/www\.wavemarketing\.cz\/_astro\/wave-marketing-hero-collaboration\..+\.webp$/,
    );
    expect(getMetaContent(homepage, "property", "og:image:alt")).toBe(
      "Tým WAVE Marketing při společné práci",
    );
    expect(getMetaContent(homepage, "name", "twitter:title")).toBe(homeTitle);
    expect(getMetaContent(homepage, "name", "twitter:description")).toBe(
      homeDescription,
    );
    expect(getMetaContent(homepage, "name", "twitter:url")).toBe(canonicalUrl);
    expect(getMetaContent(homepage, "name", "twitter:card")).toBe(
      "summary_large_image",
    );
    expect(getMetaContent(homepage, "name", "twitter:image")).toMatch(
      /^https:\/\/www\.wavemarketing\.cz\/_astro\/wave-marketing-hero-collaboration\..+\.webp$/,
    );
  });

  it("emits complete legal-page metadata with the approved raster logo icon", () => {
    const legalUrl = `${canonicalUrl}/ochrana-osobnich-udaju-a-cookies/`;

    expect(getCanonical(legalPage)).toBe(legalUrl);
    expect(getMetaContent(legalPage, "property", "og:title")).toBe(legalTitle);
    expect(getMetaContent(legalPage, "property", "og:description")).toBe(
      legalDescription,
    );
    expect(getMetaContent(legalPage, "property", "og:url")).toBe(legalUrl);
    expect(getMetaContent(legalPage, "property", "og:type")).toBe("website");
    expect(getMetaContent(legalPage, "property", "og:image")).toBe(
      `${canonicalUrl}/assets/wave-marketing-icon-192.png`,
    );
    expect(getMetaContent(legalPage, "property", "og:image:alt")).toBe(
      "Logo WAVE marketing s.r.o.",
    );
    expect(getMetaContent(legalPage, "name", "twitter:title")).toBe(legalTitle);
    expect(getMetaContent(legalPage, "name", "twitter:description")).toBe(
      legalDescription,
    );
    expect(getMetaContent(legalPage, "name", "twitter:url")).toBe(legalUrl);
    expect(getMetaContent(legalPage, "name", "twitter:card")).toBe("summary");
    expect(getMetaContent(legalPage, "name", "twitter:image")).toMatch(
      /\/assets\/wave-marketing-icon-192\.png$/,
    );
  });

  it("emits valid Organization JSON-LD with the approved company facts", () => {
    expect(getOrganizationJsonLd(homepage)).toEqual({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "WAVE marketing s.r.o.",
      url: canonicalUrl,
      logo: `${canonicalUrl}/assets/wave-marketing-logo.svg`,
      telephone: "+420605461440",
      email: "jana.skalnikova@wavemarketing.cz",
      address: {
        "@type": "PostalAddress",
        streetAddress: "U Nádraží 1658, Mníšek pod Brdy, 25210",
      },
      sameAs: [
        "https://www.facebook.com/wavemarketingsro",
        "https://www.instagram.com/wave.marketing.cz/",
        "https://www.linkedin.com/company/wave-marketing-s-r-o/",
      ],
    });
  });

  it("emits the approved robots and sitemap outputs", () => {
    const robots = readBuildOutput("robots.txt");
    const sitemap = readBuildOutput("sitemap.xml");
    const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      ([, location]) => location,
    );

    expect(robots).toContain("User-agent: *");
    expect(robots).toContain("Allow: /");
    expect(robots).toContain(`Sitemap: ${canonicalUrl}/sitemap.xml`);
    expect(locations).toEqual([
      `${canonicalUrl}/`,
      `${canonicalUrl}/ochrana-osobnich-udaju-a-cookies/`,
    ]);
  });
});

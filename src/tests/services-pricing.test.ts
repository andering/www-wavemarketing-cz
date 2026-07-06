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

describe("services pricing source-of-truth", () => {
  it("stores an approved orientační starting price for every service", () => {
    expect(siteContent.services.items).toMatchObject([
      {
        title: "Správa sociálních sítí",
        priceRange: "od 5 000 Kč",
      },
      {
        title: "PPC kampaně (Výkonnostní marketing)",
        priceRange: "od 3 000 Kč",
      },
      {
        title: "Tvorba a úprava webových stránek & e-shopů",
        priceRange: "od 15 000 Kč",
      },
      { title: "Foto a video služby", priceRange: "od 5 000 Kč" },
      {
        title: "Marketingová strategie na míru",
        priceRange: "od 8 000 Kč",
      },
      {
        title: "Grafické služby a tvorba vizuálů",
        priceRange: "od 3 000 Kč",
      },
    ]);

    siteContent.services.items.forEach((service) => {
      expect(service.priceRange).not.toContain(" do ");
      expect(service.priceRange).not.toContain("/ měsíc");
    });
  });

  it("renders service price ranges with the approved tag class", () => {
    const source = readSource("src/components/ServiceList.astro");

    expect(source).toContain("service-row__price-tag");
    expect(source).toContain("service.priceRange");
  });

  it("places service price tags in a bottom-right slot outside the heading", () => {
    const source = readSource("src/components/ServiceList.astro");
    const headingStart = source.indexOf('class="service-row__heading"');
    const headingEnd = source.indexOf("</div>", headingStart);
    const priceTagIndex = source.indexOf('class="service-row__price-tag"');
    const priceSlotIndex = source.indexOf('class="service-row__price-slot"');

    expect(headingStart).toBeGreaterThan(-1);
    expect(priceTagIndex).toBeGreaterThan(-1);
    expect(priceSlotIndex).toBeGreaterThan(-1);
    expect(priceTagIndex).toBeGreaterThan(headingEnd);
    expect(source).toContain("justify-content: flex-end");
  });

  it("places each service icon inline at the start of the service title row", () => {
    const source = readSource("src/components/ServiceList.astro");
    const headingStart = source.indexOf('class="service-row__heading"');
    const headingEnd = source.indexOf("</div>", headingStart);
    const iconIndex = source.indexOf('class="service-row__icon"');
    const titleIndex = source.indexOf("<h3>{service.title}</h3>");

    expect(headingStart).toBeGreaterThan(-1);
    expect(iconIndex).toBeGreaterThan(headingStart);
    expect(iconIndex).toBeLessThan(titleIndex);
    expect(iconIndex).toBeLessThan(headingEnd);
    expect(source).not.toContain("grid-template-columns: auto 1fr");
  });
});

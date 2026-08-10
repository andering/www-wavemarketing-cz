import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const headersPath = resolve(repositoryRoot, "public/_headers");
const expectedHeaders = `/*
  Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://challenges.cloudflare.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://*.google-analytics.com https://www.googletagmanager.com; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://challenges.cloudflare.com https://*.challenges.cloudflare.com https://cloudflareinsights.com; frame-src https://challenges.cloudflare.com; upgrade-insecure-requests
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()
`;

describe("static response security headers", () => {
  it("defines the approved baseline for every route", () => {
    expect(
      existsSync(headersPath),
      "Expected public/_headers to define the production security baseline",
    ).toBe(true);

    const headers = readFileSync(headersPath, "utf8");

    expect(headers).toBe(expectedHeaders);
    expect(headers).not.toContain("Strict-Transport-Security");
  });
});

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import { siteContent } from "../data/site";
import { pushDataLayerEventSafely } from "../lib/data-layer";

const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const readSource = (path: string) =>
  readFileSync(resolve(repositoryRoot, path), "utf8");

const genericFailureMessage =
  "Formulář se nepodařilo odeslat. Zkuste to prosím znovu nebo nám napište e-mailem.";
const longMessageFailureMessage =
  "Zpráva je příliš dlouhá. Zkraťte ji prosím a zkuste to znovu.";
const successfulTurnstileOutcome = {
  success: true,
  hostname: "www.wavemarketing.cz",
  action: "contact",
};
const turnstileVerifyUrl =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const resendSendUrl = "https://api.resend.com/emails";
const contactEnv = {
  CONTACT_FORM_FROM: "WAVE marketing <poptavky@wavemarketing.cz>",
  CONTACT_FORM_TO: "jana.skalnikova@wavemarketing.cz",
  RESEND_API_KEY: "re_test",
  TURNSTILE_SECRET_KEY: "turnstile-secret",
};
const contactSubmission = {
  message: "Prosím ozvěte se mi na jana@example.com.",
  consent: true as const,
  turnstileToken: "token-123",
  submittedAt: "2026-07-05T00:00:00.000Z",
};

const expectSecurityHeaders = (response: Response) => {
  expect(response.headers.get("Content-Security-Policy")).toBe(
    "default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
  );
  expect(response.headers.get("X-Frame-Options")).toBe("DENY");
  expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
  expect(response.headers.get("Referrer-Policy")).toBe(
    "strict-origin-when-cross-origin",
  );
  expect(response.headers.get("Permissions-Policy")).toBe(
    "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  );
  expect(response.headers.get("Strict-Transport-Security")).toBeNull();
};

const createStalledJsonResponse = (signal: AbortSignal) =>
  new Response(
    new ReadableStream<Uint8Array>({
      start(controller) {
        const abortBody = () =>
          controller.error(new DOMException("Aborted", "AbortError"));

        if (signal.aborted) {
          abortBody();
          return;
        }

        signal.addEventListener("abort", abortBody, { once: true });
      },
    }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    },
  );

const stubSuccessfulDelivery = () => {
  const fetchMock = vi.fn((input: RequestInfo | URL) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : input.url;

    if (url === turnstileVerifyUrl) {
      return Promise.resolve(
        new Response(JSON.stringify(successfulTurnstileOutcome), {
          headers: { "Content-Type": "application/json" },
          status: 200,
        }),
      );
    }

    if (url === resendSendUrl) {
      return Promise.resolve(
        new Response(JSON.stringify({ id: "email-123" }), {
          headers: { "Content-Type": "application/json" },
          status: 200,
        }),
      );
    }

    return Promise.reject(new Error(`Unexpected fetch URL: ${url}`));
  });

  vi.stubGlobal("fetch", fetchMock);

  return fetchMock;
};

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("approved contact form content", () => {
  it("stores the approved simplified contact form copy", () => {
    expect(siteContent.contact.form).toMatchObject({
      heading: "Nechte nám na sebe kontakt",
      helper:
        "Stačí nám napsat e-mail, telefon nebo pár slov k tomu, co řešíte. Ozveme se vám co nejdříve.",
      label: "Jak se vám můžeme ozvat?",
      placeholder:
        "Například: jana@firma.cz, +420 123 456 789 nebo krátce, s čím potřebujete pomoct.",
      consent:
        "Souhlasím se zpracováním osobních údajů pro účely odpovědi na poptávku.",
      submit: "Odeslat nezávaznou poptávku",
      action: "/api/contact",
      successTitle: "Díky za zprávu!",
      successBody:
        "Jdeme si udělat kávu, přečíst si vaše zadání a co nejdříve se vám ozveme s dalšími kroky.",
    });
  });

  it("marks the full questionnaire as omitted while allowing the approved form", () => {
    expect(siteContent.launchExclusions.contactForm).toBe(false);
    expect(siteContent.launchExclusions.fullContactQuestionnaire).toBe(true);
  });
});

describe("contact form implementation wiring", () => {
  it("renders the approved form fields in the contact component", () => {
    const source = readSource("src/components/ContactCardGrid.astro");

    expect(source).toContain('method="post"');
    expect(source).toContain("action={siteContent.contact.form.action}");
    expect(source).toContain('name="contactMessage"');
    expect(source).toContain('name="privacyConsent"');
    expect(source).toContain('name="cf-turnstile-response"');
    expect(source).toContain("PUBLIC_TURNSTILE_SITE_KEY");
    expect(source).toContain('data-action="contact"');
    expect(source).toContain("data-contact-form-card");
    expect(source).toContain("data-contact-default");
    expect(source).toContain("data-contact-form");
    expect(source).toContain("data-contact-success");
    expect(source).toContain("data-contact-error");
    expect(source).toContain("fetch(contactForm.action");
    expect(source).toContain("contactDefault.hidden = true");
    expect(source).toContain(
      'import { pushDataLayerEventSafely } from "../lib/data-layer";',
    );
    expect(source).toContain(
      'pushDataLayerEventSafely(window.dataLayer, { event: "contact_form_success" });',
    );
    expect(
      source.indexOf(
        'pushDataLayerEventSafely(window.dataLayer, { event: "contact_form_success" });',
      ),
    ).toBeGreaterThan(source.indexOf("contactDefault.hidden = true"));
    expect(source).toContain('class="contact__success-heading"');
    expect(
      source.indexOf('class="contact__success-icon material-symbols-outlined"'),
    ).toBeGreaterThan(source.indexOf('class="contact__success-heading"'));
    expect(
      source.indexOf('class="contact__success-icon material-symbols-outlined"'),
    ).toBeLessThan(
      source.indexOf("<h3>{siteContent.contact.form.successTitle}</h3>"),
    );
    expect(source).toContain(
      'class="contact__success-icon material-symbols-outlined"',
    );
    expect(source).toContain("background: rgba(0, 59, 61, 0.06)");
    expect(source).toContain("color: var(--ds-color-primary)");
    expect(source).toContain(
      "https://challenges.cloudflare.com/turnstile/v0/api.js",
    );
  });

  it("does not let analytics failures change a delivered form result", () => {
    const event = { event: "contact_form_success" };
    const dataLayer: unknown[] = [];

    expect(() => pushDataLayerEventSafely(undefined, event)).not.toThrow();
    expect(() =>
      pushDataLayerEventSafely(
        {
          push() {
            throw new Error("analytics unavailable");
          },
        },
        event,
      ),
    ).not.toThrow();

    pushDataLayerEventSafely(dataLayer, event);
    expect(dataLayer).toEqual([event]);
  });

  it("keeps contact quick-action icon rows left-aligned on mobile", () => {
    const source = readSource("src/components/ContactCardGrid.astro");

    expect(source).toContain(".contact__quick-actions,");
    expect(source).toContain(".contact__quick-actions a {");
    expect(source).toContain("align-items: flex-start");
    expect(source).toContain("text-align: left");
    expect(source).toContain("justify-items: start");
  });

  it("creates a Cloudflare Pages Function endpoint", () => {
    const source = readSource("functions/api/contact.ts");

    expect(source).toContain("export async function onRequestPost");
    expect(source).toContain("parseContactSubmission");
    expect(source).toContain("verifyTurnstile");
    expect(source).toContain("sendContactEmail");
    expect(source).not.toContain("Response.redirect");
    expect(source).not.toContain("/dekujeme/");
    expect(source).toContain("buildJsonResponse");
  });

  it("does not keep a standalone thank-you fallback page", () => {
    expect(
      existsSync(resolve(repositoryRoot, "src/pages/dekujeme/index.astro")),
    ).toBe(false);
  });
});

describe("contact form server helpers", () => {
  it("returns a configuration failure when the Turnstile secret is missing", async () => {
    const { verifyTurnstile } = await import("../lib/contact-form");

    await expect(verifyTurnstile({}, "token-123", null)).resolves.toEqual({
      ok: false,
      status: 500,
      message:
        "Formulář teď není správně nastavený. Napište nám prosím e-mailem.",
    });
  });

  it("validates a complete form submission", async () => {
    const { parseContactSubmission } = await import("../lib/contact-form");
    const formData = new FormData();

    formData.set("contactMessage", "Prosím ozvěte se mi na jana@example.com.");
    formData.set("privacyConsent", "on");
    formData.set("cf-turnstile-response", "token-123");

    expect(parseContactSubmission(formData)).toMatchObject({
      ok: true,
      value: {
        message: "Prosím ozvěte se mi na jana@example.com.",
        consent: true,
        turnstileToken: "token-123",
      },
    });
  });

  it("rejects missing contact message", async () => {
    const { parseContactSubmission } = await import("../lib/contact-form");
    const formData = new FormData();

    formData.set("privacyConsent", "on");
    formData.set("cf-turnstile-response", "token-123");

    expect(parseContactSubmission(formData)).toEqual({
      ok: false,
      status: 400,
      message: "Napište nám prosím, jak se vám můžeme ozvat.",
    });
  });

  it("rejects missing consent", async () => {
    const { parseContactSubmission } = await import("../lib/contact-form");
    const formData = new FormData();

    formData.set("contactMessage", "jana@example.com");
    formData.set("cf-turnstile-response", "token-123");

    expect(parseContactSubmission(formData)).toEqual({
      ok: false,
      status: 400,
      message: "Bez souhlasu se zpracováním údajů nemůžeme poptávku odeslat.",
    });
  });

  it("rejects missing Turnstile token", async () => {
    const { parseContactSubmission } = await import("../lib/contact-form");
    const formData = new FormData();

    formData.set("contactMessage", "jana@example.com");
    formData.set("privacyConsent", "on");

    expect(parseContactSubmission(formData)).toEqual({
      ok: false,
      status: 400,
      message: "Ověření formuláře se nezdařilo. Zkuste to prosím znovu.",
    });
  });

  it("rejects Turnstile tokens longer than 2048 characters", async () => {
    const { parseContactSubmission } = await import("../lib/contact-form");
    const formData = new FormData();

    formData.set("contactMessage", "jana@example.com");
    formData.set("privacyConsent", "on");
    formData.set("cf-turnstile-response", "a".repeat(2049));

    expect(parseContactSubmission(formData)).toEqual({
      ok: false,
      status: 400,
      message: "Ověření formuláře se nezdařilo. Zkuste to prosím znovu.",
    });
  });

  it("rejects contact messages longer than 2000 characters", async () => {
    const { parseContactSubmission } = await import("../lib/contact-form");
    const formData = new FormData();

    formData.set("contactMessage", "a".repeat(2001));
    formData.set("privacyConsent", "on");
    formData.set("cf-turnstile-response", "token-123");

    expect(parseContactSubmission(formData)).toEqual({
      ok: false,
      status: 400,
      message: "Zpráva je příliš dlouhá. Zkraťte ji prosím a zkuste to znovu.",
    });
  });

  it("returns a controlled failure when Turnstile rejects verification", async () => {
    const { verifyTurnstile } = await import("../lib/contact-form");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            success: false,
            "error-codes": ["invalid-input-response"],
          }),
          {
            headers: { "Content-Type": "application/json" },
            status: 200,
          },
        ),
      ),
    );

    await expect(
      verifyTurnstile({ TURNSTILE_SECRET_KEY: "secret" }, "token-123", null),
    ).resolves.toEqual({
      ok: false,
      status: 400,
      message: "Ověření formuláře se nezdařilo. Zkuste to prosím znovu.",
    });
  });

  it.each([
    ["missing codes", { success: false }],
    ["empty codes", { success: false, "error-codes": [] }],
    ["non-array codes", { success: false, "error-codes": "internal-error" }],
    ["non-string codes", { success: false, "error-codes": [500] }],
  ])(
    "treats Siteverify failure with %s as an upstream contract error",
    async (_case, outcome) => {
      const { verifyTurnstile } = await import("../lib/contact-form");

      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          new Response(JSON.stringify(outcome), {
            headers: { "Content-Type": "application/json" },
            status: 200,
          }),
        ),
      );

      await expect(
        verifyTurnstile({ TURNSTILE_SECRET_KEY: "secret" }, "token-123", null),
      ).resolves.toEqual({
        ok: false,
        status: 502,
        message: "Ověření formuláře se nezdařilo. Zkuste to prosím znovu.",
      });
    },
  );

  it.each([
    ["invalid-input-secret", 500],
    ["missing-input-secret", 500],
    ["internal-error", 502],
    ["bad-request", 502],
    ["invalid-input-response", 400],
    ["missing-input-response", 400],
    ["timeout-or-duplicate", 400],
    ["unexpected-error", 502],
  ])("maps Siteverify %s to status %i", async (errorCode, expectedStatus) => {
    const { verifyTurnstile } = await import("../lib/contact-form");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            success: false,
            "error-codes": [errorCode],
          }),
          {
            headers: { "Content-Type": "application/json" },
            status: 200,
          },
        ),
      ),
    );

    await expect(
      verifyTurnstile({ TURNSTILE_SECRET_KEY: "secret" }, "token-123", null),
    ).resolves.toEqual({
      ok: false,
      status: expectedStatus,
      message: "Ověření formuláře se nezdařilo. Zkuste to prosím znovu.",
    });
  });

  it("returns an upstream failure when Siteverify responds with an error", async () => {
    const { verifyTurnstile } = await import("../lib/contact-form");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: false }), {
          headers: { "Content-Type": "application/json" },
          status: 500,
        }),
      ),
    );

    await expect(
      verifyTurnstile({ TURNSTILE_SECRET_KEY: "secret" }, "token-123", null),
    ).resolves.toEqual({
      ok: false,
      status: 502,
      message: "Ověření formuláře se nezdařilo. Zkuste to prosím znovu.",
    });
  });

  it("treats an immediate Siteverify abort as an upstream failure", async () => {
    const { verifyTurnstile } = await import("../lib/contact-form");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new DOMException("Aborted", "AbortError")),
    );

    await expect(
      verifyTurnstile({ TURNSTILE_SECRET_KEY: "secret" }, "token-123", null),
    ).resolves.toEqual({
      ok: false,
      status: 502,
      message: "Ověření formuláře se nezdařilo. Zkuste to prosím znovu.",
    });
  });

  it.each([
    [
      "wrong hostname",
      {
        success: true,
        hostname: "www-wavemarketing-cz.pages.dev",
        action: "contact",
      },
    ],
    [
      "wrong action",
      {
        success: true,
        hostname: "www.wavemarketing.cz",
        action: "newsletter",
      },
    ],
  ])("rejects Turnstile verification with %s", async (_case, outcome) => {
    const { verifyTurnstile } = await import("../lib/contact-form");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(outcome), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    await expect(
      verifyTurnstile({ TURNSTILE_SECRET_KEY: "secret" }, "token-123", null),
    ).resolves.toEqual({
      ok: false,
      status: 400,
      message: "Ověření formuláře se nezdařilo. Zkuste to prosím znovu.",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      expect.objectContaining({
        method: "POST",
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it("aborts Siteverify after 10 seconds and returns a controlled failure", async () => {
    const { verifyTurnstile } = await import("../lib/contact-form");
    let requestSignal: AbortSignal | undefined;

    vi.useFakeTimers();
    vi.stubGlobal(
      "fetch",
      vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
        requestSignal = init?.signal ?? undefined;

        return new Promise<Response>((_resolve, reject) => {
          requestSignal?.addEventListener(
            "abort",
            () => reject(new DOMException("Aborted", "AbortError")),
            { once: true },
          );
        });
      }),
    );

    const verification = verifyTurnstile(
      { TURNSTILE_SECRET_KEY: "secret" },
      "token-123",
      null,
    );

    await vi.advanceTimersByTimeAsync(10_000);

    expect(requestSignal?.aborted).toBe(true);
    await expect(verification).resolves.toEqual({
      ok: false,
      status: 504,
      message: "Ověření formuláře se nezdařilo. Zkuste to prosím znovu.",
    });
    expect(vi.getTimerCount()).toBe(0);
  });

  it("aborts a stalled Siteverify response body after 10 seconds", async () => {
    const { verifyTurnstile } = await import("../lib/contact-form");
    let requestSignal: AbortSignal | undefined;

    vi.useFakeTimers();
    vi.stubGlobal(
      "fetch",
      vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
        const signal = init?.signal;

        if (!(signal instanceof AbortSignal)) {
          return Promise.reject(new Error("Missing abort signal"));
        }

        requestSignal = signal;
        return Promise.resolve(createStalledJsonResponse(signal));
      }),
    );

    const verification = verifyTurnstile(
      { TURNSTILE_SECRET_KEY: "secret" },
      "token-123",
      null,
    );

    await vi.advanceTimersByTimeAsync(10_000);

    expect(requestSignal?.aborted).toBe(true);
    await expect(verification).resolves.toEqual({
      ok: false,
      status: 504,
      message: "Ověření formuláře se nezdařilo. Zkuste to prosím znovu.",
    });
    expect(vi.getTimerCount()).toBe(0);
  });

  it("clears the Siteverify timeout after a fast response", async () => {
    const { verifyTurnstile } = await import("../lib/contact-form");

    vi.useFakeTimers();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() => {
        expect(vi.getTimerCount()).toBe(1);

        return Promise.resolve(
          new Response(JSON.stringify(successfulTurnstileOutcome), {
            headers: { "Content-Type": "application/json" },
            status: 200,
          }),
        );
      }),
    );

    await expect(
      verifyTurnstile({ TURNSTILE_SECRET_KEY: "secret" }, "token-123", null),
    ).resolves.toEqual({ ok: true });
    expect(vi.getTimerCount()).toBe(0);
  });

  it("returns a controlled failure when Siteverify returns null JSON", async () => {
    const { verifyTurnstile } = await import("../lib/contact-form");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("null", {
          headers: { "Content-Type": "application/json" },
          status: 200,
        }),
      ),
    );

    await expect(
      verifyTurnstile({ TURNSTILE_SECRET_KEY: "secret" }, "token-123", null),
    ).resolves.toEqual({
      ok: false,
      status: 502,
      message: "Ověření formuláře se nezdařilo. Zkuste to prosím znovu.",
    });
  });

  it("returns a controlled failure when Turnstile verification cannot be read", async () => {
    const { verifyTurnstile } = await import("../lib/contact-form");

    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));

    await expect(
      verifyTurnstile({ TURNSTILE_SECRET_KEY: "secret" }, "token-123", null),
    ).resolves.toEqual({
      ok: false,
      status: 502,
      message: "Ověření formuláře se nezdařilo. Zkuste to prosím znovu.",
    });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("not-json", {
          headers: { "Content-Type": "application/json" },
          status: 200,
        }),
      ),
    );

    await expect(
      verifyTurnstile({ TURNSTILE_SECRET_KEY: "secret" }, "token-123", null),
    ).resolves.toEqual({
      ok: false,
      status: 502,
      message: "Ověření formuláře se nezdařilo. Zkuste to prosím znovu.",
    });
  });

  it("rejects Resend delivery when required environment is missing", async () => {
    const { sendContactEmail } = await import("../lib/contact-form");

    await expect(sendContactEmail({}, contactSubmission)).resolves.toEqual({
      ok: false,
      status: 500,
      message:
        "Formulář teď není správně nastavený. Napište nám prosím e-mailem.",
    });
  });

  it("sends contact email through the Resend REST API", async () => {
    const { sendContactEmail } = await import("../lib/contact-form");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: "email-123" }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    await expect(
      sendContactEmail(contactEnv, contactSubmission),
    ).resolves.toEqual({ ok: true, id: "email-123" });
    expect(fetchMock).toHaveBeenCalledWith(
      resendSendUrl,
      expect.objectContaining({
        body: JSON.stringify({
          from: "WAVE marketing <poptavky@wavemarketing.cz>",
          to: ["jana.skalnikova@wavemarketing.cz"],
          subject: "Nová poptávka z wavemarketing.cz",
          text: [
            "Přišla nová poptávka z kontaktního formuláře na wavemarketing.cz.",
            "",
            "Zpráva:",
            "Prosím ozvěte se mi na jana@example.com.",
            "",
            "Odesláno: 2026-07-05T00:00:00.000Z",
          ].join("\n"),
        }),
        headers: {
          Authorization: "Bearer re_test",
          "Content-Type": "application/json",
        },
        method: "POST",
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it.each([
    {
      case: "network failure",
      fetchResult: () => Promise.reject(new Error("network")),
    },
    {
      case: "invalid JSON",
      fetchResult: () =>
        Promise.resolve(
          new Response("not-json", {
            headers: { "Content-Type": "application/json" },
            status: 200,
          }),
        ),
    },
    {
      case: "error response",
      fetchResult: () =>
        Promise.resolve(
          new Response(JSON.stringify({ message: "vendor detail" }), {
            headers: { "Content-Type": "application/json" },
            status: 422,
          }),
        ),
    },
    {
      case: "missing response id",
      fetchResult: () =>
        Promise.resolve(
          new Response(JSON.stringify({ id: "" }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
          }),
        ),
    },
  ])(
    "returns a controlled failure for Resend $case",
    async ({ fetchResult }) => {
      const { sendContactEmail } = await import("../lib/contact-form");

      vi.stubGlobal("fetch", vi.fn(fetchResult));

      await expect(
        sendContactEmail(contactEnv, contactSubmission),
      ).resolves.toEqual({
        ok: false,
        status: 502,
        message:
          "Zprávu se nepodařilo odeslat. Zkuste to prosím znovu nebo nám napište e-mailem.",
      });
    },
  );

  it("aborts Resend after 10 seconds and returns a controlled failure", async () => {
    const { sendContactEmail } = await import("../lib/contact-form");
    let requestSignal: AbortSignal | undefined;

    vi.useFakeTimers();
    vi.stubGlobal(
      "fetch",
      vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
        requestSignal = init?.signal ?? undefined;

        return new Promise<Response>((_resolve, reject) => {
          requestSignal?.addEventListener(
            "abort",
            () => reject(new DOMException("Aborted", "AbortError")),
            { once: true },
          );
        });
      }),
    );

    const delivery = sendContactEmail(contactEnv, contactSubmission);

    await vi.advanceTimersByTimeAsync(10_000);

    expect(requestSignal?.aborted).toBe(true);
    await expect(delivery).resolves.toEqual({
      ok: false,
      status: 502,
      message:
        "Zprávu se nepodařilo odeslat. Zkuste to prosím znovu nebo nám napište e-mailem.",
    });
    expect(vi.getTimerCount()).toBe(0);
  });

  it("aborts a stalled Resend response body after 10 seconds", async () => {
    const { sendContactEmail } = await import("../lib/contact-form");
    let requestSignal: AbortSignal | undefined;

    vi.useFakeTimers();
    vi.stubGlobal(
      "fetch",
      vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
        const signal = init?.signal;

        if (!(signal instanceof AbortSignal)) {
          return Promise.reject(new Error("Missing abort signal"));
        }

        requestSignal = signal;
        return Promise.resolve(createStalledJsonResponse(signal));
      }),
    );

    const delivery = sendContactEmail(contactEnv, contactSubmission);

    await vi.advanceTimersByTimeAsync(10_000);

    expect(requestSignal?.aborted).toBe(true);
    await expect(delivery).resolves.toEqual({
      ok: false,
      status: 502,
      message:
        "Zprávu se nepodařilo odeslat. Zkuste to prosím znovu nebo nám napište e-mailem.",
    });
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe("contact form Pages Function endpoint", () => {
  it("verifies Turnstile, sends email, and returns a JSON success response", async () => {
    const { onRequestPost } = await import("../../functions/api/contact");
    const formData = new FormData();

    formData.set("contactMessage", "Prosím ozvěte se mi na jana@example.com.");
    formData.set("privacyConsent", "on");
    formData.set("cf-turnstile-response", "token-123");
    const fetchMock = stubSuccessfulDelivery();

    const response = await onRequestPost({
      request: new Request("https://www.wavemarketing.cz/api/contact", {
        body: formData,
        headers: { "CF-Connecting-IP": "203.0.113.10" },
        method: "POST",
      }),
      env: contactEnv,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      turnstileVerifyUrl,
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      resendSendUrl,
      expect.objectContaining({ method: "POST" }),
    );
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe(
      "application/json;charset=utf-8",
    );
    expectSecurityHeaders(response);
  });

  it("returns 405 with POST allowed and security headers for GET", async () => {
    const { onRequestGet } = await import("../../functions/api/contact");

    const response = onRequestGet();

    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("POST");
    expectSecurityHeaders(response);
  });

  it("returns validation failures before Turnstile or Resend work", async () => {
    const { onRequestPost } = await import("../../functions/api/contact");
    const formData = new FormData();

    formData.set("privacyConsent", "on");
    formData.set("cf-turnstile-response", "token-123");
    vi.stubGlobal("fetch", vi.fn());

    const response = await onRequestPost({
      request: new Request("https://www.wavemarketing.cz/api/contact", {
        body: formData,
        method: "POST",
      }),
      env: {},
    });

    await expect(response.json()).resolves.toEqual({
      ok: false,
      message: "Napište nám prosím, jak se vám můžeme ozvat.",
    });
    expect(response.status).toBe(400);
    expect(response.headers.get("Content-Type")).toBe(
      "application/json;charset=utf-8",
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects the public pages.dev hostname before Turnstile or Resend work", async () => {
    const { onRequestPost } = await import("../../functions/api/contact");
    const fetchMock = stubSuccessfulDelivery();

    const response = await onRequestPost({
      request: new Request(
        "https://www-wavemarketing-cz.pages.dev/api/contact",
        {
          body: new URLSearchParams({
            contactMessage: "Prosím ozvěte se mi na jana@example.com.",
            privacyConsent: "on",
            "cf-turnstile-response": "token-123",
          }),
          method: "POST",
        },
      ),
      env: contactEnv,
    });

    await expect(response.json()).resolves.toEqual({
      ok: false,
      message: genericFailureMessage,
    });
    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects JSON before Turnstile or Resend work", async () => {
    const { onRequestPost } = await import("../../functions/api/contact");
    const fetchMock = stubSuccessfulDelivery();

    const response = await onRequestPost({
      request: new Request("https://www.wavemarketing.cz/api/contact", {
        body: JSON.stringify({ contactMessage: "jana@example.com" }),
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "POST",
      }),
      env: contactEnv,
    });

    await expect(response.json()).resolves.toEqual({
      ok: false,
      message: genericFailureMessage,
    });
    expect(response.status).toBe(415);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a declared body larger than 16 KiB before Turnstile or Resend work", async () => {
    const { onRequestPost } = await import("../../functions/api/contact");
    const fetchMock = stubSuccessfulDelivery();

    const response = await onRequestPost({
      request: new Request("https://www.wavemarketing.cz/api/contact", {
        body: new URLSearchParams({
          contactMessage: "jana@example.com",
          privacyConsent: "on",
          "cf-turnstile-response": "token-123",
        }),
        headers: { "Content-Length": "16385" },
        method: "POST",
      }),
      env: contactEnv,
    });

    await expect(response.json()).resolves.toEqual({
      ok: false,
      message: longMessageFailureMessage,
    });
    expect(response.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects and cancels a multi-chunk body that cumulatively exceeds 16 KiB", async () => {
    const { onRequestPost } = await import("../../functions/api/contact");
    const fetchMock = stubSuccessfulDelivery();
    let cancelled = false;
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array(8 * 1024));
        controller.enqueue(new Uint8Array(8 * 1024 + 1));
      },
      cancel() {
        cancelled = true;
      },
    });
    const requestInit: RequestInit & { duplex: "half" } = {
      body: stream,
      duplex: "half",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
    };
    const request = new Request(
      "https://www.wavemarketing.cz/api/contact",
      requestInit,
    );

    expect(request.headers.has("Content-Length")).toBe(false);

    const response = await onRequestPost({ request, env: contactEnv });

    await expect(response.json()).resolves.toEqual({
      ok: false,
      message: longMessageFailureMessage,
    });
    expect(response.status).toBe(413);
    expect(cancelled).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns a generic 400 response for malformed form syntax", async () => {
    const { onRequestPost } = await import("../../functions/api/contact");
    const fetchMock = stubSuccessfulDelivery();

    const response = await onRequestPost({
      request: new Request("https://www.wavemarketing.cz/api/contact", {
        body: "malformed multipart body",
        headers: { "Content-Type": "multipart/form-data" },
        method: "POST",
      }),
      env: contactEnv,
    });

    await expect(response.json()).resolves.toEqual({
      ok: false,
      message: genericFailureMessage,
    });
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

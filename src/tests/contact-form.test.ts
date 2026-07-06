import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import { siteContent } from "../data/site";

const mocks = vi.hoisted(() => ({
  resendSend: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = {
      send: mocks.resendSend,
    };
  },
}));

const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const readSource = (path: string) =>
  readFileSync(resolve(repositoryRoot, path), "utf8");

afterEach(() => {
  mocks.resendSend.mockReset();
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
    expect(source).toContain("data-contact-form-card");
    expect(source).toContain("data-contact-default");
    expect(source).toContain("data-contact-form");
    expect(source).toContain("data-contact-success");
    expect(source).toContain("data-contact-error");
    expect(source).toContain("fetch(contactForm.action");
    expect(source).toContain("contactDefault.hidden = true");
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
        new Response(JSON.stringify({ success: false }), {
          headers: { "Content-Type": "application/json" },
          status: 200,
        }),
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

  it("returns a controlled failure when Turnstile verification cannot be read", async () => {
    const { verifyTurnstile } = await import("../lib/contact-form");

    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));

    await expect(
      verifyTurnstile({ TURNSTILE_SECRET_KEY: "secret" }, "token-123", null),
    ).resolves.toEqual({
      ok: false,
      status: 400,
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
      status: 400,
      message: "Ověření formuláře se nezdařilo. Zkuste to prosím znovu.",
    });
  });

  it("rejects Resend delivery when required environment is missing", async () => {
    const { sendContactEmail } = await import("../lib/contact-form");

    await expect(
      sendContactEmail(
        {},
        {
          message: "Prosím ozvěte se mi na jana@example.com.",
          consent: true,
          turnstileToken: "token-123",
          submittedAt: "2026-07-05T00:00:00.000Z",
        },
      ),
    ).resolves.toEqual({
      ok: false,
      status: 500,
      message:
        "Formulář teď není správně nastavený. Napište nám prosím e-mailem.",
    });
  });
});

describe("contact form Pages Function endpoint", () => {
  it("verifies Turnstile, sends email, and returns a JSON success response", async () => {
    const { onRequestPost } = await import("../../functions/api/contact");
    const formData = new FormData();

    formData.set("contactMessage", "Prosím ozvěte se mi na jana@example.com.");
    formData.set("privacyConsent", "on");
    formData.set("cf-turnstile-response", "token-123");
    mocks.resendSend.mockResolvedValue({
      data: { id: "email-123" },
      error: null,
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
          status: 200,
        }),
      ),
    );

    const response = await onRequestPost({
      request: new Request("https://www.wavemarketing.cz/api/contact", {
        body: formData,
        headers: { "CF-Connecting-IP": "203.0.113.10" },
        method: "POST",
      }),
      env: {
        CONTACT_FORM_FROM: "WAVE marketing <poptavky@wavemarketing.cz>",
        CONTACT_FORM_TO: "jana.skalnikova@wavemarketing.cz",
        RESEND_API_KEY: "re_test",
        TURNSTILE_SECRET_KEY: "turnstile-secret",
      },
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      expect.objectContaining({ method: "POST" }),
    );
    expect(mocks.resendSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "WAVE marketing <poptavky@wavemarketing.cz>",
        subject: "Nová poptávka z wavemarketing.cz",
        to: ["jana.skalnikova@wavemarketing.cz"],
      }),
    );
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe(
      "application/json;charset=utf-8",
    );
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
    expect(mocks.resendSend).not.toHaveBeenCalled();
  });
});

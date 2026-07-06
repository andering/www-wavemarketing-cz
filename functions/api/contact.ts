import {
  buildJsonResponse,
  parseContactSubmission,
  sendContactEmail,
  verifyTurnstile,
  type ContactFormEnv,
} from "../../src/lib/contact-form";

type PagesFunctionContext = {
  request: Request;
  env: ContactFormEnv;
};

const methodNotAllowed = () =>
  new Response("Metoda není povolena.", {
    status: 405,
    headers: {
      Allow: "POST",
      "Content-Type": "text/plain;charset=utf-8",
    },
  });

export const onRequestGet = () => methodNotAllowed();
export const onRequestHead = () => methodNotAllowed();
export const onRequestOptions = () => methodNotAllowed();
export const onRequestPut = () => methodNotAllowed();
export const onRequestPatch = () => methodNotAllowed();
export const onRequestDelete = () => methodNotAllowed();

export async function onRequestPost({ request, env }: PagesFunctionContext) {
  try {
    const formData = await request.formData();
    const parsed = parseContactSubmission(formData);

    if (!parsed.ok) {
      return buildJsonResponse(
        { ok: false, message: parsed.message },
        parsed.status,
      );
    }

    const turnstile = await verifyTurnstile(
      env,
      parsed.value.turnstileToken,
      request.headers.get("CF-Connecting-IP"),
    );

    if (!turnstile.ok) {
      return buildJsonResponse(
        { ok: false, message: turnstile.message },
        turnstile.status,
      );
    }

    const email = await sendContactEmail(env, parsed.value);

    if (!email.ok) {
      return buildJsonResponse(
        { ok: false, message: email.message },
        email.status,
      );
    }

    return buildJsonResponse({ ok: true });
  } catch (error) {
    console.error("Contact form submission failed", error);

    return buildJsonResponse(
      {
        ok: false,
        message:
          "Formulář se nepodařilo odeslat. Zkuste to prosím znovu nebo nám napište e-mailem.",
      },
      500,
    );
  }
}

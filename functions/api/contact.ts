import {
  buildErrorResponse,
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
      return buildErrorResponse(parsed.message, parsed.status);
    }

    const turnstile = await verifyTurnstile(
      env,
      parsed.value.turnstileToken,
      request.headers.get("CF-Connecting-IP"),
    );

    if (!turnstile.ok) {
      return buildErrorResponse(turnstile.message, turnstile.status);
    }

    const email = await sendContactEmail(env, parsed.value);

    if (!email.ok) {
      return buildErrorResponse(email.message, email.status);
    }

    return Response.redirect(
      new URL("/dekujeme/", request.url).toString(),
      303,
    );
  } catch (error) {
    console.error("Contact form submission failed", error);

    return buildErrorResponse(
      "Formulář se nepodařilo odeslat. Zkuste to prosím znovu nebo nám napište e-mailem.",
      500,
    );
  }
}

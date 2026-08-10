import {
  FUNCTION_SECURITY_HEADERS,
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

type BodyReadResult =
  | { ok: true; value: Uint8Array<ArrayBuffer> }
  | { ok: false; response: Response };

const CANONICAL_HOSTNAME = "www.wavemarketing.cz";
const MAX_CONTACT_BODY_BYTES = 16 * 1024;
const ACCEPTED_MEDIA_TYPES = new Set([
  "multipart/form-data",
  "application/x-www-form-urlencoded",
]);
const GENERIC_FAILURE_MESSAGE =
  "Formulář se nepodařilo odeslat. Zkuste to prosím znovu nebo nám napište e-mailem.";
const LONG_MESSAGE_FAILURE_MESSAGE =
  "Zpráva je příliš dlouhá. Zkraťte ji prosím a zkuste to znovu.";

const methodNotAllowed = () =>
  new Response("Metoda není povolena.", {
    status: 405,
    headers: {
      ...FUNCTION_SECURITY_HEADERS,
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

const bodyTooLargeResponse = () =>
  buildJsonResponse({ ok: false, message: LONG_MESSAGE_FAILURE_MESSAGE }, 413);

const readBoundedBody = async (request: Request): Promise<BodyReadResult> => {
  const reader = request.body?.getReader();

  if (!reader) {
    return { ok: true, value: new Uint8Array() };
  }

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    totalBytes += value.byteLength;

    if (totalBytes > MAX_CONTACT_BODY_BYTES) {
      await reader.cancel();
      return { ok: false, response: bodyTooLargeResponse() };
    }

    chunks.push(value);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;

  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return { ok: true, value: body };
};

export async function onRequestPost({ request, env }: PagesFunctionContext) {
  try {
    if (new URL(request.url).hostname !== CANONICAL_HOSTNAME) {
      return buildJsonResponse(
        { ok: false, message: GENERIC_FAILURE_MESSAGE },
        403,
      );
    }

    const contentType = request.headers.get("Content-Type") ?? "";
    const mediaType = contentType.split(";", 1)[0].trim().toLowerCase();

    if (!ACCEPTED_MEDIA_TYPES.has(mediaType)) {
      return buildJsonResponse(
        { ok: false, message: GENERIC_FAILURE_MESSAGE },
        415,
      );
    }

    const contentLength = request.headers.get("Content-Length");

    if (
      contentLength !== null &&
      /^\d+$/.test(contentLength.trim()) &&
      Number(contentLength) > MAX_CONTACT_BODY_BYTES
    ) {
      return bodyTooLargeResponse();
    }

    const body = await readBoundedBody(request);

    if (!body.ok) {
      return body.response;
    }

    let formData: FormData;

    try {
      const boundedRequest = new Request(request.url, {
        body: body.value,
        headers: { "Content-Type": contentType },
        method: "POST",
      });
      formData = await boundedRequest.formData();
    } catch {
      return buildJsonResponse(
        { ok: false, message: GENERIC_FAILURE_MESSAGE },
        400,
      );
    }

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
        message: GENERIC_FAILURE_MESSAGE,
      },
      500,
    );
  }
}

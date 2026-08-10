export type ContactFormEnv = {
  RESEND_API_KEY?: string;
  CONTACT_FORM_FROM?: string;
  CONTACT_FORM_TO?: string;
  TURNSTILE_SECRET_KEY?: string;
};

export type ContactSubmission = {
  message: string;
  consent: true;
  turnstileToken: string;
  submittedAt: string;
};

export const FUNCTION_SECURITY_HEADERS = {
  "Content-Security-Policy":
    "default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
  "Permissions-Policy":
    "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
} as const;

type ParseResult =
  | { ok: true; value: ContactSubmission }
  | { ok: false; status: number; message: string };

type OperationResult =
  { ok: true; id?: string } | { ok: false; status: number; message: string };

type TurnstileOutcome = {
  success?: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: unknown;
};

class OutboundRequestTimeoutError extends Error {}

const CANONICAL_HOSTNAME = "www.wavemarketing.cz";
const TURNSTILE_ACTION = "contact";
const MAX_TURNSTILE_TOKEN_LENGTH = 2048;
const OUTBOUND_REQUEST_TIMEOUT_MS = 10_000;
const RESEND_SEND_URL = "https://api.resend.com/emails";
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const TURNSTILE_FAILURE_MESSAGE =
  "Ověření formuláře se nezdařilo. Zkuste to prosím znovu.";
const RESEND_FAILURE_MESSAGE =
  "Zprávu se nepodařilo odeslat. Zkuste to prosím znovu nebo nám napište e-mailem.";
const TURNSTILE_CONFIGURATION_ERROR_CODES = new Set([
  "missing-input-secret",
  "invalid-input-secret",
]);
const TURNSTILE_TOKEN_ERROR_CODES = new Set([
  "missing-input-response",
  "invalid-input-response",
  "timeout-or-duplicate",
]);

const getFormValue = (formData: FormData, name: string) => {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isTurnstileOutcome = (value: unknown): value is TurnstileOutcome =>
  isObject(value);

const getTurnstileFailureStatus = (outcome: TurnstileOutcome) => {
  const errorCodes = outcome["error-codes"];

  if (errorCodes === undefined) {
    return 502;
  }

  if (
    !Array.isArray(errorCodes) ||
    errorCodes.some((errorCode) => typeof errorCode !== "string")
  ) {
    return 502;
  }

  if (
    errorCodes.some((errorCode) =>
      TURNSTILE_CONFIGURATION_ERROR_CODES.has(errorCode),
    )
  ) {
    return 500;
  }

  if (errorCodes.length === 0) {
    return 502;
  }

  if (
    errorCodes.every((errorCode) => TURNSTILE_TOKEN_ERROR_CODES.has(errorCode))
  ) {
    return 400;
  }

  return 502;
};

const runWithTimeout = async <T>(
  operation: (signal: AbortSignal) => Promise<T>,
): Promise<T> => {
  const controller = new AbortController();
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, OUTBOUND_REQUEST_TIMEOUT_MS);

  try {
    return await operation(controller.signal);
  } catch (error) {
    if (timedOut) {
      throw new OutboundRequestTimeoutError();
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

export const parseContactSubmission = (formData: FormData): ParseResult => {
  const message = getFormValue(formData, "contactMessage");
  const consent = getFormValue(formData, "privacyConsent");
  const turnstileToken = getFormValue(formData, "cf-turnstile-response");

  if (!message) {
    return {
      ok: false,
      status: 400,
      message: "Napište nám prosím, jak se vám můžeme ozvat.",
    };
  }

  if (message.length > 2000) {
    return {
      ok: false,
      status: 400,
      message: "Zpráva je příliš dlouhá. Zkraťte ji prosím a zkuste to znovu.",
    };
  }

  if (consent !== "on") {
    return {
      ok: false,
      status: 400,
      message: "Bez souhlasu se zpracováním údajů nemůžeme poptávku odeslat.",
    };
  }

  if (!turnstileToken || turnstileToken.length > MAX_TURNSTILE_TOKEN_LENGTH) {
    return {
      ok: false,
      status: 400,
      message: TURNSTILE_FAILURE_MESSAGE,
    };
  }

  return {
    ok: true,
    value: {
      message,
      consent: true,
      turnstileToken,
      submittedAt: new Date().toISOString(),
    },
  };
};

export const verifyTurnstile = async (
  env: ContactFormEnv,
  token: string,
  remoteIp: string | null,
): Promise<OperationResult> => {
  if (!env.TURNSTILE_SECRET_KEY) {
    return {
      ok: false,
      status: 500,
      message:
        "Formulář teď není správně nastavený. Napište nám prosím e-mailem.",
    };
  }

  const body = new FormData();
  body.set("secret", env.TURNSTILE_SECRET_KEY);
  body.set("response", token);

  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  let result: { response: Response; parsedOutcome: unknown };

  try {
    result = await runWithTimeout(async (signal) => {
      const response = await fetch(TURNSTILE_VERIFY_URL, {
        body,
        method: "POST",
        signal,
      });
      const parsedOutcome: unknown = await response.json();

      return { response, parsedOutcome };
    });
  } catch (error) {
    return {
      ok: false,
      status: error instanceof OutboundRequestTimeoutError ? 504 : 502,
      message: TURNSTILE_FAILURE_MESSAGE,
    };
  }

  const outcome = isTurnstileOutcome(result.parsedOutcome)
    ? result.parsedOutcome
    : null;

  if (!result.response.ok || !outcome) {
    return {
      ok: false,
      status: 502,
      message: TURNSTILE_FAILURE_MESSAGE,
    };
  }

  if (outcome.success !== true) {
    return {
      ok: false,
      status:
        outcome.success === false ? getTurnstileFailureStatus(outcome) : 502,
      message: TURNSTILE_FAILURE_MESSAGE,
    };
  }

  if (
    outcome.hostname !== CANONICAL_HOSTNAME ||
    outcome.action !== TURNSTILE_ACTION
  ) {
    return {
      ok: false,
      status: 400,
      message: TURNSTILE_FAILURE_MESSAGE,
    };
  }

  return { ok: true };
};

export const sendContactEmail = async (
  env: ContactFormEnv,
  submission: ContactSubmission,
): Promise<OperationResult> => {
  if (!env.RESEND_API_KEY || !env.CONTACT_FORM_FROM || !env.CONTACT_FORM_TO) {
    return {
      ok: false,
      status: 500,
      message:
        "Formulář teď není správně nastavený. Napište nám prosím e-mailem.",
    };
  }

  const email = {
    from: env.CONTACT_FORM_FROM,
    to: [env.CONTACT_FORM_TO],
    subject: "Nová poptávka z wavemarketing.cz",
    text: [
      "Přišla nová poptávka z kontaktního formuláře na wavemarketing.cz.",
      "",
      "Zpráva:",
      submission.message,
      "",
      `Odesláno: ${submission.submittedAt}`,
    ].join("\n"),
  };

  let result: { response: Response; outcome: unknown };

  try {
    result = await runWithTimeout(async (signal) => {
      const response = await fetch(RESEND_SEND_URL, {
        body: JSON.stringify(email),
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        signal,
      });
      const outcome: unknown = await response.json();

      return { response, outcome };
    });
  } catch {
    return { ok: false, status: 502, message: RESEND_FAILURE_MESSAGE };
  }

  if (
    !result.response.ok ||
    !isObject(result.outcome) ||
    typeof result.outcome.id !== "string" ||
    !result.outcome.id.trim()
  ) {
    return { ok: false, status: 502, message: RESEND_FAILURE_MESSAGE };
  }

  return { ok: true, id: result.outcome.id };
};

export const buildJsonResponse = (
  body: { ok: true } | { ok: false; message: string },
  status = 200,
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...FUNCTION_SECURITY_HEADERS,
      "Content-Type": "application/json;charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

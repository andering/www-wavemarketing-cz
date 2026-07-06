import { Resend } from "resend";

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

type ParseResult =
  | { ok: true; value: ContactSubmission }
  | { ok: false; status: number; message: string };

type OperationResult =
  { ok: true; id?: string } | { ok: false; status: number; message: string };

type TurnstileOutcome = {
  success?: boolean;
  "error-codes"?: string[];
};

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const TURNSTILE_FAILURE_MESSAGE =
  "Ověření formuláře se nezdařilo. Zkuste to prosím znovu.";

const getFormValue = (formData: FormData, name: string) => {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
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

  if (!turnstileToken) {
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

  let response: Response;
  let outcome: TurnstileOutcome;

  try {
    response = await fetch(TURNSTILE_VERIFY_URL, {
      body,
      method: "POST",
    });
    outcome = (await response.json()) as TurnstileOutcome;
  } catch {
    return {
      ok: false,
      status: 400,
      message: TURNSTILE_FAILURE_MESSAGE,
    };
  }

  if (!response.ok || !outcome.success) {
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

  const resend = new Resend(env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
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
  });

  if (error) {
    return {
      ok: false,
      status: 502,
      message:
        "Zprávu se nepodařilo odeslat. Zkuste to prosím znovu nebo nám napište e-mailem.",
    };
  }

  return { ok: true, id: data?.id };
};

export const buildJsonResponse = (
  body: { ok: true } | { ok: false; message: string },
  status = 200,
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

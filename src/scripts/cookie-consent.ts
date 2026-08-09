import * as CookieConsent from "vanilla-cookieconsent";
import { siteContent } from "../data/site";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    CookieConsent: typeof CookieConsent;
  }
}

const gtag = (...args: unknown[]) => {
  window.dataLayer.push(args);
};

const updateGoogleConsent = () => {
  const analyticsGranted = CookieConsent.acceptedCategory("analytics");
  const marketingGranted = CookieConsent.acceptedCategory("marketing");

  gtag("consent", "update", {
    analytics_storage: analyticsGranted ? "granted" : "denied",
    ad_storage: marketingGranted ? "granted" : "denied",
    ad_user_data: marketingGranted ? "granted" : "denied",
    ad_personalization: marketingGranted ? "granted" : "denied",
  });
  window.dataLayer.push({ event: "cookie_consent_update" });
};

const loadGoogleTagManager = (gtmId: string) => {
  if (document.querySelector(`[data-gtm-container="${gtmId}"]`)) {
    return;
  }

  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  gtag("js", new Date());

  const script = document.createElement("script");
  script.async = true;
  script.dataset.gtmContainer = gtmId;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
  document.head.append(script);
};

window.dataLayer = window.dataLayer || [];
window.gtag = gtag;
window.CookieConsent = CookieConsent;

gtag("consent", "default", {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  functionality_storage: "granted",
  security_storage: "granted",
  wait_for_update: 500,
});

loadGoogleTagManager(siteContent.cookieConsent.gtmId);

CookieConsent.run({
  mode: "opt-in",
  revision: 1,
  cookie: {
    name: siteContent.cookieConsent.cookieName,
    expiresAfterDays: 182,
    sameSite: "Lax",
  },
  guiOptions: {
    consentModal: {
      layout: "bar inline",
      position: "bottom",
      equalWeightButtons: false,
      flipButtons: false,
    },
    preferencesModal: {
      layout: "box",
      equalWeightButtons: false,
      flipButtons: false,
    },
  },
  categories: {
    necessary: {
      enabled: true,
      readOnly: true,
    },
    analytics: {
      autoClear: {
        cookies: [{ name: /^_ga/ }, { name: "_gid" }],
        reloadPage: false,
      },
    },
    marketing: {},
  },
  onConsent: updateGoogleConsent,
  onChange: updateGoogleConsent,
  language: {
    default: "cs",
    translations: {
      cs: {
        consentModal: {
          title: siteContent.cookieConsent.banner.title,
          description: `${siteContent.cookieConsent.banner.description} <a class="cc-link" href="${siteContent.legalPage.href}">${siteContent.legalPage.title}</a>`,
          acceptAllBtn: siteContent.cookieConsent.banner.acceptAll,
          acceptNecessaryBtn: siteContent.cookieConsent.banner.acceptNecessary,
          showPreferencesBtn: siteContent.cookieConsent.banner.showPreferences,
        },
        preferencesModal: {
          title: siteContent.cookieConsent.preferences.title,
          acceptAllBtn: siteContent.cookieConsent.preferences.acceptAll,
          acceptNecessaryBtn:
            siteContent.cookieConsent.preferences.acceptNecessary,
          savePreferencesBtn: siteContent.cookieConsent.preferences.save,
          closeIconLabel: siteContent.cookieConsent.preferences.close,
          sections: [
            {
              title: "Vaše nastavení soukromí",
              description: siteContent.cookieConsent.preferences.intro,
            },
            {
              title: "Nezbytné cookies",
              description: siteContent.cookieConsent.categories[0].description,
              linkedCategory: "necessary",
            },
            {
              title: "Analytické cookies",
              description: siteContent.cookieConsent.categories[1].description,
              linkedCategory: "analytics",
              cookieTable: {
                headers: {
                  name: "Název",
                  provider: "Poskytovatel",
                  purpose: "Účel",
                  duration: "Doba uložení",
                },
                body: siteContent.legalPage.cookieTable
                  .filter((cookie) => cookie.category === "Analytické")
                  .map((cookie) => ({
                    name: cookie.name,
                    provider: cookie.provider,
                    purpose: cookie.purpose,
                    duration: cookie.duration,
                  })),
              },
            },
            {
              title: "Marketingové cookies",
              description: siteContent.cookieConsent.categories[2].description,
              linkedCategory: "marketing",
            },
            {
              title: "Více informací",
              description: `Podrobnosti najdete na stránce <a class="cc-link" href="${siteContent.legalPage.href}">${siteContent.legalPage.title}</a>.`,
            },
          ],
        },
      },
    },
  },
});

document
  .querySelectorAll<HTMLButtonElement>("[data-cookie-preferences]")
  .forEach((button) => {
    button.addEventListener("click", () => CookieConsent.showPreferences());
  });

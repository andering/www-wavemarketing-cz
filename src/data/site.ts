type IconLink = {
  rel: "icon" | "apple-touch-icon";
  type?: "image/png" | "image/x-icon";
  sizes: string;
  href: string;
};

export const siteContent = {
  meta: {
    title: "WAVE marketing s.r.o. | Přivedeme váš business na tu správnou vlnu",
    description:
      "WAVE marketing s.r.o. pomáhá firmám se strategií, sociálními sítěmi, PPC kampaněmi a obsahem. Děláme marketing lidsky, spolehlivě a s péčí.",
    language: "cs",
  },
  assets: {
    logo: "/assets/wave-marketing-logo.svg",
    icons: [
      {
        rel: "icon",
        type: "image/x-icon",
        sizes: "any",
        href: "/favicon.ico",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/assets/wave-marketing-icon-32.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/assets/wave-marketing-apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        href: "/assets/wave-marketing-icon-192.png",
      },
    ] satisfies readonly IconLink[],
  },
  navigation: [
    { label: "Úvod", href: "#uvod" },
    { label: "Naše služby", href: "#sluzby" },
    { label: "Reference", href: "#spoluprace" },
    { label: "Kontakt", href: "#kontakt" },
  ],
  socialLinks: [
    {
      label: "Facebook",
      href: "https://www.facebook.com/wavemarketingsro",
      shortLabel: "Fb",
      brandColor: "#1877f2",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/wave.marketing.cz/",
      shortLabel: "Ig",
      brandColor: "#e4405f",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/wave-marketing-s-r-o/",
      shortLabel: "In",
      brandColor: "#0a66c2",
    },
  ],
  hero: {
    eyebrow: "Váš partner v digitálním světě",
    heading: "Přivedeme váš business na tu správnou vlnu",
    lead: "Děláme marketing lidsky. Jsme WAVE marketing s.r.o., skvělá parta lidí, kteří milují svoji práci a věříme, že nejlepší výsledky vznikají tehdy, když se na vás dokážeme dokonale naladit. S péčí, velkou dávkou lidskosti a spolehlivostí.",
    primaryCta: { label: "Domluvte si konzultaci", href: "#kontakt" },
    secondaryCta: { label: "Podívejte se na služby", href: "#sluzby" },
    popup: { label: "Růst tržeb", value: "+124%", icon: "trending_up" },
  },
  intro: {
    eyebrow: "O nás",
    heading: "Kdo jsme",
    main: "Jsme partneři, kteří naslouchají, chápou váš byznys a pečují o něj jako o vlastní.",
    support:
      "Věříme, že dobrý marketing začíná porozuměním. Než navrhneme řešení, chceme poznat vaši značku, cíle i lidi, pro které pracujete. Díky tomu dokážeme nastavit komunikaci a kampaně, které dávají smysl a stojí na důvěře.",
  },
  services: {
    heading: "Naše služby",
    intro:
      "Víme, že za každou značkou stojí reální lidé a reálné příběhy. Proto děláme marketing lidsky, srozumitelně a bez složitého technického žargonu. Naším cílem je propojit vás s vašimi zákazníky na základě transparentnosti a empatie.",
    lead: "Podívejte se, s čím vším vám můžeme pomoci:",
    items: [
      {
        title: "Správa sociálních sítí",
        priceRange: "od 10 000 Kč",
        icon: "hub",
        text: "Sociální sítě již dávno nejsou jen o přidávání příspěvků, ale o budování komunity a naslouchání. Tvoříme obsah, který má duši a odráží skutečnou tvář vašeho podnikání. Postaráme se o kompletní komunikaci tak, abyste si se svými sledujícími vytvořili pevný a osobní vztah.",
      },
      {
        title: "PPC kampaně (Výkonnostní marketing)",
        priceRange: "od 15 000 Kč",
        icon: "ads_click",
        text: "Zajistíme, aby vás vaši zákazníci našli přesně ve chvíli, kdy vás potřebují. Výsledky měříme přesně a komunikujeme je s vámi naprosto transparentně. Žádné schovávání se za složitá čísla nebo nesrozumitelné výrazy - jen chytré a efektivní investice do vašeho růstu.",
      },
      {
        title: "Tvorba a úprava webových stránek & e-shopů",
        priceRange: "od 40 000 Kč",
        icon: "web",
        text: "Váš web je vaším digitálním domovem. Vytvoříme pro vás nové webové stránky nebo e-shop od nuly, případně vdechneme nový život těm stávajícím. Důraz klademe na čistý, přehledný design a hlavně na to, aby se u vás návštěvníci cítili dobře a snadno našli to, co hledají.",
      },
      {
        title: "Foto a video služby",
        priceRange: "od 8 000 Kč",
        icon: "photo_camera",
        text: "Vizuální stránka je prvním krokem k navázání kontaktu. Ať už potřebujete profesionální fotografie produktů, zachycení atmosféry vašich služeb nebo tvorbu poutavých videí, postaráme se o produkci, která bude přirozená, estetická a autentická.",
      },
      {
        title: "Marketingová strategie na míru",
        priceRange: "od 8 000 Kč",
        icon: "insights",
        text: "Než se pustíme do práce, chceme do hloubky pochopit, kdo jste a kam směřujete. Připravíme pro vás promyšlenou strategii, která dává smysl a je ušitá přesně na míru vašim možnostem a cílům. Vše s maximální empatií vůči vaší cílové skupině.",
      },
      {
        title: "Grafické služby a tvorba vizuálů",
        priceRange: "od 3 000 Kč",
        icon: "draw",
        text: "Grafika od nás není jen hezký obrázek, ale nástroj, který komunikuje za vás. Navrhneme vám čisté, moderní a vkusné vizuály - od loga přes propagační materiály až po sjednocení celé vaší značky.",
      },
    ],
    closing:
      "Chcete to probrat osobně? Každá skvělá spolupráce začíná u kávy (nebo čaje) a dobrého rozhovoru. Napište nám a pojďme se bavit o tom, jak můžeme vašemu projektu pomoci růst.",
    pricingNote:
      "Ceny jsou individuální dle specifikací a požadavků každého klienta. Rádi vám vše naceníme na míru. Ceny jsou uvedeny bez DPH.",
  },
  process: {
    heading: "Jak probíhá spolupráce",
    intro:
      "Spolupráce začíná tím, že se poznáme. Zajímá nás, jestli jsme na stejné vlně, co potřebujete vyřešit a jak vám můžeme být užiteční.",
    steps: [
      {
        title: "První káva a seznámení",
        text: "Zjistíme, jestli jsme na stejné vlně.",
        support: {
          type: "outcome",
          label: "Výstup:",
          text: "Jasné zadání a vzájemné porozumění prioritám.",
        },
      },
      {
        title: "Ponoření se do hloubky",
        text: "Poznáme váš byznys od A do Z.",
        support: {
          type: "chips",
          items: ["Analýza situace", "Návrh směru"],
        },
      },
      {
        title: "Návrh řešení",
        text: "Připravíme strategii na míru.",
        support: {
          type: "image",
          alt: "Marketing strategy workshop for a tailored solution proposal",
        },
      },
      {
        title: "Realizace a péče",
        text: "Spustíme kampaně a pravidelně s vámi komunikujeme. Průběžně optimalizujeme a radujeme se ze společných úspěchů.",
        support: {
          type: "cta",
          label: "Domluvte si konzultaci",
          href: "#kontakt",
        },
      },
    ],
  },
  contact: {
    heading: "Kontaktujte nás",
    intro:
      "Máte nápad, hledáte marketingového parťáka, nebo se jen chcete poradit u dobré kávy? Ozvěte se nám. Odpovídáme rychle a rádi.",
    person: {
      name: "Jana Skalníková",
      role: "CEO & Strategist",
      phoneLabel: "Zavolejte Janě",
      phoneDisplay: "+420 605 461 440",
      phoneHref: "tel:+420605461440",
    },
    email: {
      label: "Napište nám",
      display: "jana.skalnikova@wavemarketing.cz",
      href: "mailto:jana.skalnikova@wavemarketing.cz",
    },
    form: {
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
    },
    meeting:
      "Dojedeme za vámi kamkoli, případně se rádi přizpůsobíme online meetingu.",
    company: [
      "WAVE marketing s.r.o.",
      "IČO: 29524369",
      "DIČ: CZ29524369",
      "U Nádraží 1658, Mníšek pod Brdy, 25210",
      "spisová značka C 447444 vedená u Městského soudu v Praze",
    ],
  },
  footer: {
    brand: "WAVE Marketing",
    copy: "Lidský přístup k digitálnímu světu. Pomáháme značkám růst s lehkostí, péčí a strategií, která dává smysl.",
    cookieSettingsLabel: "Nastavení cookies",
    legalLinks: [
      {
        label: "Ochrana osobních údajů a cookies",
        href: "/ochrana-osobnich-udaju-a-cookies/",
      },
    ],
    copyright: "© 2026 WAVE Marketing. Všechna práva vyhrazena.",
  },
  legalPage: {
    href: "/ochrana-osobnich-udaju-a-cookies/",
    title: "Ochrana osobních údajů a cookies",
    description:
      "Informace o tom, jak WAVE marketing s.r.o. zpracovává osobní údaje a používá cookies na webu www.wavemarketing.cz.",
    sections: [
      {
        heading: "Ochrana osobních údajů a cookies",
        paragraphs: [
          "Tady najdete přehled toho, jak společnost WAVE marketing s.r.o. pracuje s osobními údaji a cookies na webu www.wavemarketing.cz.",
        ],
      },
      {
        heading: "Kdo je správcem údajů",
        paragraphs: [
          "Správcem osobních údajů je WAVE marketing s.r.o., IČO: 29524369, DIČ: CZ29524369, se sídlem U Nádraží 1658, Mníšek pod Brdy, 25210, spisová značka C 447444 vedená u Městského soudu v Praze.",
          "V otázkách ochrany osobních údajů nás můžete kontaktovat na e-mailu jana.skalnikova@wavemarketing.cz.",
        ],
      },
      {
        heading: "Jaké údaje zpracováváme",
        paragraphs: [
          "Pokud nás kontaktujete e-mailem, telefonicky nebo přes kontaktní formulář na webu, zpracováváme údaje, které nám sami předáte, zejména kontaktní údaje a obsah zprávy nebo poptávky. Kontaktní formulář slouží pouze k tomu, abychom mohli odpovědět na vaši poptávku; odeslání je chráněné službou Cloudflare Turnstile a oznámení z formuláře se doručuje přes službu Resend.",
          "Web může dále pracovat s technickými údaji nutnými pro jeho bezpečné a správné fungování a s údaji z analytických nebo marketingových nástrojů pouze podle nastavení vašeho souhlasu s cookies.",
        ],
      },
      {
        heading: "Proč údaje zpracováváme",
        list: [
          "odpověď na váš dotaz nebo poptávku",
          "domluva spolupráce nebo schůzky",
          "zajištění bezpečného a správného fungování webu",
          "měření návštěvnosti a zlepšování webu, pokud k tomu dáte souhlas",
          "vyhodnocování marketingu, pokud k tomu dáte souhlas",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: [
          "Cookies jsou malé soubory, které web ukládá ve vašem prohlížeči. Některé jsou nutné pro fungování webu, jiné nám pomáhají porozumět návštěvnosti nebo vyhodnocovat marketing. Volitelné cookies používáme jen podle vašeho souhlasu.",
          "Nastavení cookies můžete kdykoli změnit přes odkaz Nastavení cookies v patičce webu.",
        ],
      },
      {
        heading: "Kategorie cookies",
        subsections: [
          {
            heading: "Nezbytné cookies",
            paragraphs: [
              "Tyto cookies jsou potřeba pro základní fungování webu a uložení vašeho nastavení cookies. Nelze je vypnout v rámci nastavení cookies.",
            ],
          },
          {
            heading: "Analytické cookies",
            paragraphs: [
              "Analytické cookies nám pomáhají měřit návštěvnost webu a pochopit, jak lidé web používají. Web používá Google Tag Manager container GTM-WMJVN6WZ; Google Analytics 4 je spravován přes Google Tag Manager a spouští se jen při souhlasu s analytickými cookies.",
            ],
          },
          {
            heading: "Marketingové cookies",
            paragraphs: [
              "Marketingové cookies mohou sloužit k vyhodnocování a cílení reklamních aktivit. Pro launch webu je tato kategorie připravena pro budoucí marketingové nástroje; konkrétní nástroje se mají přidat až po jejich schválení a zapojení do souhlasového nastavení.",
            ],
          },
        ],
      },
      {
        heading: "Jak souhlas změnit nebo odvolat",
        paragraphs: [
          "Souhlas s analytickými a marketingovými cookies můžete kdykoli změnit nebo odvolat přes odkaz Nastavení cookies v patičce webu. Volitelné nástroje se nespustí, pokud k nim nedáte souhlas.",
        ],
      },
      {
        heading: "Předávání údajů třetím stranám",
        paragraphs: [
          "Při udělení souhlasu s analytickými cookies může docházet ke zpracování údajů službami společnosti Google v souvislosti s Google Tag Managerem a Google Analytics. Nastavení souhlasu je řízené přes Google Consent Mode.",
        ],
      },
      {
        heading: "Vaše práva",
        paragraphs: [
          "Máte právo požádat o přístup k osobním údajům, jejich opravu, výmaz, omezení zpracování nebo vznést námitku proti zpracování. Pokud je zpracování založené na souhlasu, můžete souhlas odvolat. Máte také právo obrátit se na Úřad pro ochranu osobních údajů.",
        ],
      },
      {
        heading: "Aktualizace těchto informací",
        paragraphs: [
          "Tyto informace můžeme upravit, pokud se změní web, používané nástroje nebo právní požadavky. Aktuální verze bude vždy dostupná na této stránce.",
        ],
      },
    ],
    cookieTable: [
      {
        name: "cc_cookie",
        category: "Nezbytné",
        provider: "WAVE marketing s.r.o.",
        purpose: "Uložení nastavení souhlasu s cookies",
        duration: "6 měsíců",
      },
      {
        name: "_ga",
        category: "Analytické",
        provider: "Google Analytics",
        purpose: "Rozlišení návštěvníků pro anonymizované měření návštěvnosti",
        duration: "až 2 roky",
      },
      {
        name: "_ga_*",
        category: "Analytické",
        provider: "Google Analytics",
        purpose: "Uložení stavu relace pro měření návštěvnosti",
        duration: "až 2 roky",
      },
    ],
  },
  cookieConsent: {
    gtmId: "GTM-WMJVN6WZ",
    cookieName: "cc_cookie",
    banner: {
      title: "Používáme cookies",
      description:
        "Pomáhají nám měřit návštěvnost webu a zlepšovat marketing. Volitelné cookies spustíme jen s vaším souhlasem.",
      acceptAll: "Přijmout vše",
      acceptNecessary: "Jen nezbytné",
      showPreferences: "Nastavit cookies",
    },
    preferences: {
      title: "Nastavení cookies",
      acceptAll: "Přijmout vše",
      acceptNecessary: "Jen nezbytné",
      save: "Uložit nastavení",
      close: "Zavřít nastavení cookies",
      intro:
        "Sami si můžete vybrat, s čím souhlasíte. Nezbytné cookies zajišťují fungování webu, analytické pomáhají měřit návštěvnost a marketingové jsou připravené pro budoucí reklamní nástroje.",
    },
    categories: [
      {
        id: "necessary",
        label: "Nezbytné cookies",
        description:
          "Jsou potřeba pro fungování webu a uložení nastavení souhlasu.",
        enabled: true,
        readOnly: true,
      },
      {
        id: "analytics",
        label: "Analytické cookies",
        description:
          "Pomáhají nám měřit návštěvnost webu pomocí GA4 spravovaného přes GTM.",
        enabled: false,
        readOnly: false,
      },
      {
        id: "marketing",
        label: "Marketingové cookies",
        description:
          "Jsou připravené pro budoucí reklamní nebo remarketingové nástroje.",
        enabled: false,
        readOnly: false,
      },
    ],
  },
  launchExclusions: {
    references: true,
    contactForm: false,
    fullContactQuestionnaire: true,
    socialLinks: false,
    legalPlaceholderLinks: true,
  },
} as const;

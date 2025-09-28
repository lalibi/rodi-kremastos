export const NAV_ORDER = ["home", "about", "products", "contact"] as const;

export type PageKey = typeof NAV_ORDER[number];
export type PageInfo = {
  href: string;
  title: string;
  label?: string;
  cta?: string;
  description?: string;
};

export const PAGES: Record<PageKey, PageInfo> = {
  home: {
    href: "/",
    title: "Αρχική",
    label: "Αρχική",
    cta: "Δείτε τα προϊόντα",
    description:
      "Ρόδι Κρεμαστός — 100% φυσικός, βιολογικός χυμός ροδιού – χωρίς καμία προσθήκη ζάχαρης ή συντηρητικών.",
  },
  about: {
    href: "/about",
    title: "Σχετικά",
    label: "Σχετικά",
    description:
      "Μάθετε την ιστορία της οικογενειακής καλλιέργειας στο Κρεμαστό Ευβοίας και την πιστοποίηση βιολογικής παραγωγής.",
  },
  products: {
    href: "/products",
    title: "Προϊόντα",
    label: "Προϊόντα",
    description: "Ανακαλύψτε τα προϊόντα ροδιού Ρόδι Κρεμαστός: χυμοί, σιρόπι, κεραλοιφή και λικέρ.",
  },
  contact: {
    href: "/contact",
    title: "Επικοινωνία",
    label: "Επικοινωνία",
    description: "Επικοινωνήστε με τον Ρόδι Κρεμαστός — τηλέφωνο, email και χάρτης προς την καλλιέργεια στην Εύβοια.",
  },
};

export const SITE = {
  name: "Ρόδι Κρεμαστός",
  locale: "el",
  description: "100% φυσικός, βιολογικός χυμός ροδιού – χωρίς καμία προσθήκη ζάχαρης ή συντηρητικών.",
  url: "https://rodi-kremastos.gr",
  logo: "/logo.svg",
  keywords: [
    "χυμός ροδιού",
    "βιολογικός χυμός",
    "ρόδι Κρεμαστός",
    "ρόδι Εύβοια",
    "χωρίς ζάχαρη",
    "χωρίς συντηρητικά",
  ],
  organization: {
    legalName: "Ρόδι Κρεμαστός",
    telephone: "+30 698 338 4229",
    email: "retsasnikolaos@yahoo.com",
    address: {
      streetAddress: "Κρεμαστός",
      addressLocality: "Εύβοια",
      addressRegion: "Στερεά Ελλάδα",
      postalCode: "34016",
      addressCountry: "GR",
    },
  },
  social: {
    facebook: "https://www.facebook.com/nikos.retsas.5",
    instagram: "https://www.instagram.com/rodi_xymos_kremastos_evia/",
  },
};

export function buildTitle(page?: PageInfo | PageKey | string) {
  if (!page) return SITE.name;
  // If a key was provided, map to the PageInfo
  if (typeof page === "string") {
    if ((NAV_ORDER as readonly string[]).includes(page)) {
      const key = page as PageKey;
      return `${PAGES[key].title} — ${SITE.name}`;
    }
    // Treat as literal page title
    return `${page} — ${SITE.name}`;
  }
  // PageInfo object provided
  return `${page.title} — ${SITE.name}`;
}

export function resolvePage(page?: PageInfo | PageKey | string) {
  if (!page) return undefined;
  if (typeof page === "string") {
    if ((NAV_ORDER as readonly string[]).includes(page)) {
      return PAGES[page as PageKey];
    }
    return undefined;
  }
  return page;
}

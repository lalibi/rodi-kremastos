export const NAV_ORDER = ["home", "about", "products", "contact"] as const;

export type PageKey = typeof NAV_ORDER[number];
export type PageInfo = { href: string; title: string; label?: string; cta?: string };

export const PAGES: Record<PageKey, PageInfo> = {
  home: { href: "/", title: "Αρχική", label: "Αρχική", cta: "Δείτε τα προϊόντα" },
  about: { href: "/about", title: "Σχετικά", label: "Σχετικά" },
  products: { href: "/products", title: "Προϊόντα", label: "Προϊόντα" },
  contact: { href: "/contact", title: "Επικοινωνία", label: "Επικοινωνία" },
};

export const SITE = {
  name: "Ρόδι Κρεμαστός",
  locale: "el",
  description: "Χυμός ροδιού 100% φυσικός, ψυχρής έκθλιψης.",
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

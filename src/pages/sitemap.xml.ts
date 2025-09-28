import type { APIRoute } from "astro";
import { NAV_ORDER, PAGES, SITE } from "../config/site";

const priorityMap: Partial<Record<typeof NAV_ORDER[number], string>> = {
  home: "1.0",
  products: "0.9",
  about: "0.7",
  contact: "0.6",
};

const changeFreqMap: Partial<Record<typeof NAV_ORDER[number], string>> = {
  home: "weekly",
  products: "weekly",
  about: "monthly",
  contact: "monthly",
};

const normalizeSite = (site: URL | undefined) => {
  if (!site) return new URL(SITE.url);
  return site;
};

export const GET: APIRoute = ({ site }) => {
  const baseUrl = normalizeSite(site);
  const urls = NAV_ORDER.map((key) => {
    const page = PAGES[key];
    const loc = new URL(page.href, baseUrl).toString();
    return {
      loc,
      priority: priorityMap[key] ?? "0.5",
      changefreq: changeFreqMap[key] ?? "monthly",
    };
  });

  const lastmod = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls
      .map(
        ({ loc, priority, changefreq }) =>
          `\n  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n    <lastmod>${lastmod}</lastmod>\n  </url>`
      )
      .join("") +
    `\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "max-age=86400, must-revalidate",
    },
  });
};

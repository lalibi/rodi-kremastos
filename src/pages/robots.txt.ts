import type { APIRoute } from "astro";
import { SITE } from "../config/site";

const normalizeSite = (site: URL | undefined) => {
  if (!site) return SITE.url.replace(/\/$/, "");
  const href = site.href.endsWith("/") ? site.href.slice(0, -1) : site.href;
  return href;
};

export const GET: APIRoute = ({ site }) => {
  const base = normalizeSite(site);
  const sitemapUrl = `${base}/sitemap.xml`;

  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "max-age=86400, must-revalidate",
      },
    }
  );
};

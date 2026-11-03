import { libraryItems } from "@/lib/library/libraryData";
import { KOSH_URL } from "@/lib/seo";

export function GET() {
  const urls = [
    { path: "/", lastModified: "2026-10-12" },
    { path: "/collections/research-a-decision/", lastModified: "2026-09-07" },
    { path: "/standards/", lastModified: "2026-09-07" },
    ...libraryItems.map((item) => ({ path: `/${item.id}/`, lastModified: item.created })),
  ];
  const body = urls
    .map(({ path, lastModified }) => `<url><loc>${KOSH_URL}${path}</loc><lastmod>${new Date(lastModified).toISOString()}</lastmod></url>`)
    .join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`, {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
}

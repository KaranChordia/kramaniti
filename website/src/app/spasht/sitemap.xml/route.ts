import { SPASHT_URL } from "@/lib/seo";

export function GET() {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${SPASHT_URL}/</loc><lastmod>2026-10-15</lastmod></url></urlset>`, {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
}

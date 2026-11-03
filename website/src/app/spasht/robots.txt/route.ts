import { SPASHT_URL } from "@/lib/seo";

export function GET() {
  return new Response(`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${SPASHT_URL}/sitemap.xml\n`, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

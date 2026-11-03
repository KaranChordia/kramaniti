import { SPASHT_URL } from "@/lib/seo";

export function GET() {
  return new Response(`User-agent: *\nDisallow: /\nSitemap: ${SPASHT_URL}/sitemap.xml\n`, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

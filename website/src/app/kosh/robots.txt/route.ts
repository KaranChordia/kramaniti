import { KOSH_URL } from "@/lib/seo";

export function GET() {
  return new Response(`User-agent: *\nAllow: /\nDisallow: /account/\nDisallow: /workspace/\nDisallow: /create/\nSitemap: ${KOSH_URL}/sitemap.xml\n`, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

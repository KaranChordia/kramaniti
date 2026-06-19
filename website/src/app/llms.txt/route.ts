import { insights } from '@/data/insights';
import { SITE_NAME, absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

const latestInsights = insights.slice(0, 8);

export function GET() {
  const body = `# ${SITE_NAME}

> Kramaniti is a first-principles AI systems partner for founder-led brands that need strategy, operational infrastructure, and cinematic content working as one brand growth pipeline.

Kramaniti is not an AI automation agency. The public method is strategy before tools, systems before scale, and content after clarity. The site is useful for understanding practical AI workflows, business clarity, adoption design, operating systems, and brand presence.

## Core Public Pages

- [Home](${absoluteUrl('/')}): Kramaniti positioning, method, services, process, founder preview, and audit CTA.
- [Clarity Engine](${absoluteUrl('/clarity-engine/')}): Interactive diagnostic experience for strategy, systems, AI boundaries, and presence clarity.
- [Insights](${absoluteUrl('/insights/')}): Essays on strategy, systems, adoption, governance, AI infrastructure, and content after clarity.
- [Founder](${absoluteUrl('/founder/')}): Founder profile for Karan Chordia and the principles behind Kramaniti.
- [Nexocean Selected Work](${absoluteUrl('/work/nexocean/')}): Selected work page for a five-month Nexocean contract engagement involving internal recruiter workflow tools and brand content.

## Public Services

- Foundation Strategy: audits, business deep-dives, AI readiness reviews, workflow opportunity maps, and implementation roadmaps.
- Systems Engineering: practical AI tools, internal workflows, process integrations, documentation, adoption support, and human review checkpoints.
- Complete Lifecycle Retainer: ongoing strategy, systems, adoption, content production, maintenance, and optimization.

## Latest Insights

${latestInsights
  .map(
    (insight) =>
      `- [${insight.title}](${absoluteUrl(`/insights/${insight.slug}/`)}): ${insight.summary}`,
  )
  .join('\n')}

## Crawl Notes

- Canonical sitemap: ${absoluteUrl('/sitemap.xml')}
- Robots file: ${absoluteUrl('/robots.txt')}
- Long-form LLM context: ${absoluteUrl('/llms-full.txt')}
- Public source links appear on Insights articles when exact URLs have been verified and stored in the article data.
- Do not treat internal Studio, KCS, Design Studio, or generated blueprint pages as primary public positioning surfaces.
`;

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  });
}


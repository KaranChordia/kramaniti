import { insights } from '@/data/insights';
import { SITE_NAME, absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

const latestInsights = insights.slice(0, 8);

export function GET() {
  const body = `# ${SITE_NAME}

> Kramaniti makes businesses easier to run and easier to understand.

Kramaniti is a first-principles AI systems partner, not an automation agency. It finds where work gets stuck, builds practical AI systems where they genuinely help, keeps people in control, and turns that clarity into stronger communication.

## Core Public Pages

- [Home](${absoluteUrl('/')}): How Kramaniti understands the work, fixes the workflow that matters, uses AI carefully, and communicates the value.
- [Clarity Engine](${absoluteUrl('/clarity-engine/')}): A focused way to think through one piece of work before choosing tools.
- [Insights](${absoluteUrl('/insights/')}): Articles on where work gets stuck, what to build, how people use AI, and how to communicate clearly.
- [Founder](${absoluteUrl('/founder/')}): Founder profile for Karan Chordia and the principles behind Kramaniti.
- [Selected Work](${absoluteUrl('/work/')}): Public examples of Kramaniti work.
- [Maitri Selected Work](${absoluteUrl('/work/maitri/')}): Active foundation work for a story-led companion doll world.
- [Nexocean Selected Work](${absoluteUrl('/work/nexocean/')}): A five-month Nexocean contract involving practical recruiter tools and brand communication.

## Public Services

- Foundation Strategy: understand the work, find the bottleneck, decide where AI can help, and set a practical next step.
- Systems Engineering: build useful workflows, internal tools, connections, instructions, and human review points.
- Complete Lifecycle Retainer: keep the systems, adoption, and communication improving together.

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
- Do not treat internal Studio, KCS, Design Studio, or generated clarity-plan pages as primary public positioning surfaces.
`;

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  });
}

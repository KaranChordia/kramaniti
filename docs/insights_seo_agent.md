# Website SEO and LLM Crawl Layer

## Site-Wide Implementation

[Fact] Kramaniti now has a site-wide SEO layer in the Next.js website.

[Fact] Public pages with explicit metadata include:

- `/`
- `/founder`
- `/insights`
- `/insights/[slug]`
- `/clarity-engine`
- `/work/nexocean`

[Fact] Workbench or generated-output routes are intentionally marked `noindex`:

- `/studio`
- `/KCS`
- `/design-studio`
- `/clarity-engine/blueprint`

[Fact] The website exposes LLM-readable crawl aids:

- `/llms.txt`
- `/llms-full.txt`

[Recommendation] Treat `llms.txt` as an emerging AI-crawl convention, not as a guaranteed ranking factor. It complements standard SEO metadata, sitemap, robots, semantic content, and structured data.

## Current Implementation

[Fact] The Insights SEO layer is implemented as deterministic Next.js code, not as an external crawler or autonomous bot.

[Fact] The implementation reads the existing `website/src/data/insights.ts` records and generates:

- article-specific metadata through `generateMetadata` in `website/src/app/insights/[slug]/page.tsx`
- Article JSON-LD and Breadcrumb JSON-LD on each Insights article page
- related internal links from category and focus similarity
- archive metadata for `/insights`
- `robots.txt` through `website/src/app/robots.ts`
- `sitemap.xml` through `website/src/app/sitemap.ts`
- shared helpers in `website/src/lib/seo.ts`
- compact LLM map through `website/src/app/llms.txt/route.ts`
- full LLM context through `website/src/app/llms-full.txt/route.ts`

## What It Optimizes

[Fact] Each article can now expose a unique title, description, canonical URL, Open Graph metadata, Twitter metadata, publish date, author, category, keywords, and structured data.

[Fact] The sitemap includes the Insights index and every article route.

[Fact] The article template supports outbound source links through the optional `sourceLinks` field on each Insight object.

[Fact] Kramaniti also has an Insights Growth Steward at `06_ai_agent_context/agents/insights_growth_steward.json`, with the operating playbook at `04_content_system/insights_growth_playbook.md`.

## Source Link Policy

[Constraint] Do not fabricate source links.

[Constraint] Only add `sourceLinks` when the source URL is verified and appropriate to publish.

[Recommendation] Future daily Insights publishing should store the research URLs used for the article in the same post object:

```ts
sourceLinks: [
  {
    label: 'Readable source title',
    url: 'https://example.com/source',
  },
],
```

[Recommendation] For older posts, backfill source links in small batches by checking the original research notes or rerunning source verification. Do not add generic search-result URLs as citations.

## Growth Steward Layer

[Recommendation] Future Insights publishing should use the Insights Growth Steward for:

- 2-3 contextual internal links to relevant Kramaniti routes when they genuinely help the reader.
- source freshness judgment, preferring current primary sources for market, product, legal, regulatory, and AI capability claims while allowing canonical evergreen standards when stronger.
- category-matched soft CTAs rendered by the article template.
- periodic cluster posts that synthesize 3-5 related Insights into a stronger pillar article.

[Constraint] Do not claim traffic, rankings, backlinks, leads, or conversion impact unless analytics evidence was inspected in the current run.

## Where To Run It

[Fact] The SEO layer runs automatically as part of the Next.js website. There is no separate service to start.

[Fact] To verify it locally, run the website checks from `website/`:

```bash
npm run lint
npm run build
```

[Recommendation] After deployment, validate representative URLs with Google Rich Results Test, Schema Markup Validator, and Google Search Console sitemap inspection.

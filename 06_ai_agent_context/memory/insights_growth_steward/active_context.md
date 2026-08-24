# Insights Growth Steward Active Context

**Purpose:** Keep Kramaniti Insights posts connected, source-aware, and growth-useful without making the publisher automation carry every editorial rule inline.

**Current State:** [Recommendation] The Insights Growth Steward is an active growth specialist under the Digital Presence Orchestrator. It supports the twice-weekly Insights publisher with internal link planning, source freshness judgment, category-matched CTAs, and cluster-post opportunities.

**Active Rule:** Public claims about traction, backlinks, rankings, leads, or conversion impact require current analytics evidence before they are recorded as facts.

**Current Operating Files:**

- `04_content_system/insights_growth_playbook.md`
- `website/src/data/insights.ts`
- `website/src/app/insights/[slug]/page.tsx`
- `docs/insights_seo_agent.md`
- `/Users/karanchordia/.codex/automations/kramaniti-daily-insights-publisher/memory.md`

**Next Review:** During each successful Insights publish run, record internal links, source freshness, CTA category, and cluster-post status in automation memory.

## Latest Successful Publish — 24 Aug 2026

- **Article:** `Can the Workflow Run Without Its Builder?`
- **Path:** `/insights/can-the-workflow-run-without-its-builder/`
- **Topic lane:** Adoption and operational independence; the handoff from a builder-dependent workflow to shared operating infrastructure.
- **Genre:** Practical readiness test and operating guide.
- **Headline pattern:** Question-led diagnostic (`Can the workflow…?`).
- **Category:** `Adoption`
- **Focus:** `Operational Independence`
- **Lead sources:** DORA, *State of AI-assisted Software Development 2025*; GOV.UK Service Standard, *Operate a reliable service* (updated 29 Jan 2026); Google SRE Workbook, *On-Call*.
- **SourceLinks status:** Three verified primary or near-primary public URLs included in the visible `Source links` section.
- **Inline source links:** Three contextual source anchors, one for each lead source.
- **Internal links:** `/insights/documentation-is-the-operating-system-between-decisions`, `/insights/show-the-support-route-before-rollout`, and `/#workflows`.
- **Source freshness decision:** DORA 2025 and the Jan 2026 GOV.UK standard satisfy the current-source preference. The older Google SRE chapter is retained as an explicitly labelled evergreen operating-practice reference, not as a current market claim.
- **CTA category:** Adoption; category CTA rendered as `See the process` linking to `/#workflows`.
- **Cluster-post status:** Not due. The immediately preceding 21 Aug 2026 post was a cluster pillar, so this run used a fresh non-cluster article.
- **SEO verification:** Passed for title, description, trailing-slash canonical, Article JSON-LD, Breadcrumb JSON-LD, contextual inline source anchors, internal links, visible sources, category CTA, and `/sitemap.xml` inclusion.
- **Validation path:** `git diff --check`; ESLint; `tsc --noEmit`; production Next.js build; rendered production HTTP assertions for the article page and sitemap; Vercel required check.
- **Publication commit:** `908966ba87fae84160d944ee2fe90231698190f9`

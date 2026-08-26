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

## Latest Successful Publish — 26 Aug 2026

- **Article:** `The Founder’s Judgment Is a Content Standard`
- **Path:** `/insights/the-founders-judgment-is-a-content-standard/`
- **Topic lane:** Founder-led clarity and coherent growth; turning internal founder judgment into a usable bridge for external communication.
- **Genre:** Editorial calibration playbook.
- **Headline pattern:** Possessive declarative capability statement (`The Founder’s judgment is…`).
- **Category:** `Content`
- **Focus:** `Founder-Led Judgment`
- **Lead sources:** Content Marketing Institute, *How To Build Marketing Judgment Without Producing Clones* (11 Aug 2026); Google Search Central, *Creating helpful, reliable, people-first content* (updated 10 Dec 2025).
- **SourceLinks status:** Two verified, current public URLs included in the visible `Source links` section; the lead organization and two-source mix differ from the 24 Aug publish.
- **Inline source links:** Two contextual source anchors, one for each source.
- **Internal links:** `/insights/founder-review-should-be-conditional-not-constant`, `/insights/the-content-calendar-needs-a-source-route`, and `/founder`.
- **Source freshness decision:** Both sources fall within the 24-month preference. CMI provides current practitioner guidance on developing judgment; Google provides current official platform guidance on original, audience-led, first-hand content.
- **CTA category:** Content; category CTA rendered as `Explore content infrastructure` linking to `/#services`.
- **Cluster-post status:** Not due. This is the second fresh post after the 21 Aug 2026 cluster pillar.
- **Visual decision:** No infographic added; another checklist or route visual would repeat recent patterns, and the calibration playbook is clearer in prose.
- **SEO verification:** Passed for title, description, trailing-slash canonical, author, exact IST timestamp, Article JSON-LD, Breadcrumb JSON-LD, contextual inline source anchors, internal links, visible sources, category CTA, and `/sitemap.xml` inclusion.
- **Validation path:** Source URL and freshness verification; `git diff --check`; ESLint; `tsc --noEmit`; production Next.js build; rendered production HTTP assertions for the article page and sitemap; Vercel required check.
- **Publication commit:** `bd15b7dc453c447128d6e018ca1f6ef6c31d5690`

## Previous Successful Publish — 24 Aug 2026

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

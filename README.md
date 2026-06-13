# Kramaniti

The canonical operating workspace and knowledge base for **Kramaniti**: a first-principles AI systems partner connecting strategy, operational infrastructure, and cinematic content into one brand growth pipeline.

This workspace is designed to be **human-readable** (for the founder, clients, and partners) and **AI-agent-ready** (with structured formats, clear identifiers, local `AGENTS.md` files, and semantic files that subagents can digest without noise).

---

## 1. Workspace Structure Map

```
/
├── 02_founder_context/        # Founder background, timeline, skills, and verification
├── 03_brand_strategy/         # Strategic brand layer
│   ├── brand_system/          # Brand operating kit and digital-presence decisions
│   ├── positioning/           # Competitive analyses, differentiators, brand identity guidelines
│   └── naming/                # Brand name evaluation and domain/handles registry
├── 04_content_system/         # Content pillars, calendar, campaigns, backlog, distribution, drafts
├── 05_ai_strategy/            # Strategic delivery blueprints
├── 06_ai_agent_context/       # Agent operating system and routing context
│   ├── agents/                # Machine-readable agent definitions
│   ├── agent_roles/           # Human-readable roster and routing notes
│   ├── memory/                # Short-term working memory and handoffs
│   ├── protocols/             # Communication, memory, and quality gates
│   ├── routing/               # Task routing rules
│   └── system_prompts/        # Master context and Studio knowledge base
├── 07_business_build/         # Launch operations and business setup references
├── 08_brand_assets/           # Human-visible brand assets and asset registry
│   ├── logos/                 # Brand marks and logo exports
│   ├── founder_media/         # Founder photos and cinematic references
│   ├── insight_graphics/      # Reusable Insights graphics
│   └── exports/               # PDF/deck/handoff exports
├── 09_reviews/                # Governance and log records
├── docs/                      # Implementation plans, setup notes, and cleanup audits
├── website/                   # Public Next.js website and integrated Studio
├── AGENTS.md                  # Global agent operating rules
└── README.md                  # This file
```

---

## 2. Agent Operating Layer

Kramaniti now uses local `AGENTS.md` files as an operating layer for future AI agents. These files define how each area should be handled and which agent should lead the work.

Core agent files:

| File | Purpose |
| :--- | :--- |
| `AGENTS.md` | Global repository rules and brand constraints |
| `02_founder_context/AGENTS.md` | Founder facts, verification, and archive rules |
| `03_brand_strategy/AGENTS.md` | Positioning, offers, narrative, and identity rules |
| `04_content_system/AGENTS.md` | Editorial and content-system rules |
| `05_ai_strategy/AGENTS.md` | Workflow audit and systems delivery rules |
| `06_ai_agent_context/AGENTS.md` | Agent definition and prompt-maintenance rules |
| `07_business_build/AGENTS.md` | Launch, sales, CRM, and delivery operations rules |
| `08_brand_assets/AGENTS.md` | Asset organization and permission rules |
| `09_reviews/AGENTS.md` | Claim review and decision-log rules |
| `docs/AGENTS.md` | Implementation documentation rules |
| `website/AGENTS.md` | Website, CTA, credibility, and public-copy rules |

Primary roster:

- `06_ai_agent_context/agent_roles/kramaniti_agent_roster.md`

When a task crosses multiple areas, choose the lead agent from the roster, read the relevant local `AGENTS.md`, and leave updates in the canonical folder rather than relying only on chat history.

Active app boundary:

- `website/` is the only active web app in this repository.
- Kramaniti Studio lives inside the website app at `website/src/app/studio/`.
- Standalone prototype apps, generated build folders, and dependency folders should not be added at the repo root.
- Local generated files such as `node_modules/`, `.next/`, `out/`, `next-env.d.ts`, `*.tsbuildinfo`, `.vercel/`, and `.DS_Store` are workspace artifacts, not source.

---

## 3. Document Conventions & Data Labels

To maintain strict data integrity, every file must clearly label its claims using one of the following prefixes:
*   **`[Fact]`**: Verifiable, publicly documented evidence with source URLs/citations (e.g., specific employment dates, registered domains, published videos).
*   **`[Inference]`**: Logical extensions of facts that are highly probable but not explicitly written (e.g., transitioning to AI due to previous technical/trading adaptabilities).
*   **`[Unverified]`**: Claims that are mentioned in sources but lack secondary verification or direct confirmation (e.g., third-party credits without accessible project logs).
*   **`[Recommendation]`**: Actionable suggestions, strategic choices, or branding steps proposed to guide execution.

---

## 4. File Naming & Style Conventions

1.  **File Naming:** Use snake_case for all markdown files (e.g., `founder_background.md`, `career_timeline.md`).
2.  **File Headers:** Every major document should begin with a metadata block detailing its **Purpose**, **Key Findings**, **Evidence**, **Interpretation**, **Implications**, **Open Questions**, and **Next Steps**.
3.  **Cross-Linking:** Prefer repo-relative paths for durable internal links. Use absolute local paths only when a tool specifically requires them.
4.  **No Placeholders:** Never use filler text or lorem ipsum. Use realistic examples, structured drafts, or document as an open question within the relevant file.

---

## 5. How to Update This Workspace

1.  **Founder Feedback:** When the founder clarifies a point (e.g., a client engagement detail), update the relevant context files and move the data label from `[Unverified]` to `[Fact]`.
2.  **Audit Trail:** Document the change in [decisions.md](09_reviews/decisions.md).
3.  **AI Readiness:** Ensure system prompts, agent roles, and local `AGENTS.md` files stay synchronized with any changes to service offerings or branding choices.

---

## 6. Key Files Quick Reference

| Area | File | Purpose |
| :--- | :--- | :--- |
| **Identity** | [founder_background.md](02_founder_context/founder_background.md) | Canonical founder profile with fact/inference split |
| **Identity** | [career_timeline.md](02_founder_context/career_timeline.md) | Five-epoch career progression with evidence tags |
| **Identity** | [skill_clusters.md](02_founder_context/skill_clusters.md) | Competency trees across Visual, Algorithmic, Quantitative, and B2B domains |
| **Brand** | [positioning_analysis.md](03_brand_strategy/positioning/positioning_analysis.md) | Market positioning, differentiators, and target ICPs |
| **Brand** | [brand_operating_kit.md](03_brand_strategy/brand_system/brand_operating_kit.md) | Digital presence brand kit and operating workflow |
| **Brand** | [brand_decisions.md](03_brand_strategy/brand_system/brand_decisions.md) | Working brand-presence decisions and open questions |
| **Brand** | [brand_identity_guidelines.md](03_brand_strategy/positioning/brand_identity_guidelines.md) | Color palette, typography, voice rules, and visual standards |
| **Brand** | [brand_narrative.md](03_brand_strategy/brand_narrative.md) | Core storytelling copy, bios, and strategic angles |
| **Brand** | [company_name_ideas.md](03_brand_strategy/naming/company_name_ideas.md) | Naming evaluation and selection rationale |
| **Brand** | [domain_and_handles_registry.md](03_brand_strategy/naming/domain_and_handles_registry.md) | Domain and social handle acquisition tracker |
| **Offers** | [service_packages.md](03_brand_strategy/service_packages.md) | 4-tier offer ladder with pricing and deliverables |
| **Content** | [content_pillars.md](04_content_system/content_pillars.md) | 5 core content pillars with post examples |
| **Content** | [content_calendar.md](04_content_system/content_calendar.md) | Planned content calendar with proof and approval status |
| **Content** | [campaign_briefs.md](04_content_system/campaign_briefs.md) | Campaign brief template and campaign plans |
| **Content** | [content_ideas_backlog.md](04_content_system/content_ideas_backlog.md) | Future content ideas before calendar approval |
| **Content** | [publishing_checklist.md](04_content_system/publishing_checklist.md) | Public-content approval checklist |
| **Content** | [analytics_log.md](04_content_system/analytics_log.md) | Publishing performance and repeat/revise/stop log |
| **Delivery** | [ai_service_workflows.md](05_ai_strategy/ai_service_workflows.md) | Onboarding, audit, content, and agent build workflows |
| **AI Agents** | [master_context.md](06_ai_agent_context/system_prompts/master_context.md) | System prompt context, constraints, and operating rules |
| **AI Agents** | [agent_roles.md](06_ai_agent_context/agent_roles/agent_roles.md) | Agent role index and task routing matrix |
| **AI Agents** | [kramaniti_agent_roster.md](06_ai_agent_context/agent_roles/kramaniti_agent_roster.md) | Full company-style agent roster |
| **Studio** | [lm_studio_agent_os_setup.md](docs/lm_studio_agent_os_setup.md) | Local LM Studio setup for the Studio Agent OS |
| **Studio** | [kcs_content_studio.md](docs/kcs_content_studio.md) | KCS chat-first infographic-video workflow and `/KCS` renderer |
| **Structure** | [repo_organization_audit.md](docs/repo_organization_audit.md) | Current cleanup record and file-boundary recommendations |
| **Launch** | [website_structure_and_wireframe.md](07_business_build/website_structure_and_wireframe.md) | Historical one-page portfolio wireframe reference |
| **Launch** | [launch_operations_checklist.md](07_business_build/launch_operations_checklist.md) | Business registration, payments, invoicing, and CRM setup |
| **Assets** | [asset_registry.md](08_brand_assets/asset_registry.md) | Asset source, usage, and public-permission tracker |
| **Governance** | [decisions.md](09_reviews/decisions.md) | Decision log with rejected alternatives |
| **Governance** | [proof_register.md](09_reviews/proof_register.md) | Public-claim, permission, and proof status tracker |

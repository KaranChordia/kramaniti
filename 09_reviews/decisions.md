# Decision Log

This log registers the major strategic and structural decisions made during the conceptualization and establishment of Karan Chordia’s consulting practice and workspace.

---

## 1. Active Decisions Register

### Decision 1: Retirement of "HowDramaTech" Branding
*   **Status:** Confirmed (`[Fact]`)
*   **Rationale:** High-ticket B2B consulting firms demand premium, authoritative, and clean identities. The legacy branding *HowDramaTech* is too informal and vlogger-centric, which hurts credibility during corporate procurement cycles.
*   **Alternatives Rejected:**
    1.  *Maintaining HowDramaTech:* Rejected because search records tie the brand to consumer-tech vlogging and local events, which limits enterprise scalability.
    2.  *Renaming to "DramaTech AI":* Rejected because the word "Drama" remains unprofessional in high-ticket enterprise sectors.
*   **Selected Alternative:** Officially selected and confirmed the brand name **Kramaniti** (Sanskrit/Javanese hybrid meaning "Algorithmic Strategy / Workflow Logic").

### Decision 2: Reframe the 2020 - 2023 Career Gap
*   **Status:** Approved (`[Recommendation]`)
*   **Rationale:** Prospective high-ticket clients doing due diligence may view a multi-year gap in public work as a risk. Reframing this era as an **R&D and Incubation Phase** leverages the quantitative trading experience to validate Karan's transition to complex algorithmic logic.
*   **Alternatives Rejected:**
    1.  *Leaving the Gap Unexplained:* Rejected because it leaves an active vulnerability in the founder's public record.
    2.  *Fabricating Client Work:* Rejected because it violates our core operating principle of strict evidence handling and truth.

### Decision 3: Definition of the Nexocean Relationship
*   **Status:** Approved (`[Fact]`)
*   **Rationale:** The intelligence reports listed Karan as an employee of Nexocean, but the exact capacity was unverified. The founder confirmed a **5-month contract stint** building internal automation tools and creating content. Documenting this adds valuable proof of corporate delivery.
*   **Alternatives Rejected:**
    1.  *Omitting Nexocean:* Rejected because corporate internal tools delivery is a strong credibility signal for AI strategy.
    2.  *Describing it as Permanent Leadership:* Rejected because it is factually incorrect.

### Decision 4: Tiered Flat-Fee & Retainer Pricing Model
*   **Status:** Approved (`[Recommendation]`)
*   **Rationale:** Hourly billing aligns the consultant's incentives against client speed and scalability. By offering flat-fee "AI Sprints" that upsell into monthly "AI Content Engine" retainers, Karan secures stabilized recurring revenue while preserving high profit margins.
*   **Alternatives Rejected:**
    1.  *Hourly Consulting:* Rejected due to Karan's own published articles on Medium advocating against hourly freelancer traps.
    2.  *Pure Project-Based Billing:* Rejected because it results in unpredictable month-to-month cash flow.

### Decision 5: Agent Operating Layer for Kramaniti
*   **Date:** 2026-05-29
*   **Area:** Project structure and agent readiness
*   **Status:** Implemented (`[Recommendation]`)
*   **Decision:** Use local `AGENTS.md` files and a company-style agent roster to make the Kramaniti workspace easier for future agents to navigate, update, and govern.
*   **Rationale:** Kramaniti now needs a durable operating structure, not only isolated strategy documents. Local agent rules clarify ownership by folder, while the roster models agents like early company hires with roles, memory, goals, recurring tasks, outputs, escalation triggers, and hard constraints.
*   **Source or Evidence:** Founder request to future-proof the project with agents for crucial operations; foundation positioning that Kramaniti connects strategy, systems, and content.
*   **Affected Files:**
    *   `AGENTS.md`
    *   `02_founder_context/AGENTS.md`
    *   `03_brand_strategy/AGENTS.md`
    *   `04_content_system/AGENTS.md`
    *   `05_ai_strategy/AGENTS.md`
    *   `06_ai_agent_context/AGENTS.md`
    *   `06_ai_agent_context/agent_roles/agent_roles.md`
    *   `06_ai_agent_context/agent_roles/kramaniti_agent_roster.md`
    *   `06_ai_agent_context/system_prompts/master_context.md`
    *   `07_business_build/AGENTS.md`
    *   `07_business_build/website_structure_and_wireframe.md`
    *   `08_brand_assets/AGENTS.md`
    *   `09_reviews/AGENTS.md`
    *   `docs/AGENTS.md`
    *   `website/AGENTS.md`
    *   `README.md`
*   **Alternatives Rejected:**
    1.  *Single central prompt only:* Rejected because future agents need local folder-level context at the point of work.
    2.  *Creating many novelty agents:* Rejected because agents should map to recurring business functions with clear accountability.
*   **Open Questions:**
    *   Which agents should become active recurring workflows first?
    *   Which memories should be promoted into structured templates for repeated work?
    *   Should public-facing proof approvals move into a dedicated proof database?

### Decision 6: Execution of Project Cleanup and Executable Agentic Framework
*   **Date:** 2026-05-30
*   **Area:** Project structure, agent infrastructure, and frontend architecture
*   **Status:** Implemented (`[Fact]`)
*   **Decision:** Executed the approved 3-phase implementation plan: (1) structural cleanup (docs directory, unused code/SVGs, Tailwind removal), (2) transition from prose-based agents to an executable JSON-schema agentic framework, and (3) scaffolding the frontend integration for a founder-facing agent dashboard.
*   **Rationale:** The previous prose-based agent roster (Decision 5) laid the strategic foundation, but an *executable* system requires machine-readable configurations (`agents/*.json`), dedicated memory directories for state tracking, formal routing logic, and standard communication protocols. Cleanup of the codebase was a necessary prerequisite.
*   **Source or Evidence:** Founder request to "make this project agentic ready (some of the foundation is being done, but needs to be polished and should be more intelligent)" and "future proof when it comes to bringing them to front end too, so that the founder (me) can talk and manage the agents."
*   **Affected Files:**
    *   `docs/` (fixed from "untitled folder")
    *   `website/public/` (removed boilerplate)
    *   `website/src/app/globals.css` (removed dead Tailwind directives)
    *   `website/src/components/sections/Hero.tsx` (copy alignment)
    *   `06_ai_agent_context/agents/` (New structured configs)
    *   `06_ai_agent_context/memory/` (New working state)
    *   `06_ai_agent_context/routing/` (New routing rules)
    *   `06_ai_agent_context/protocols/` (New operating procedures)
    *   `website/src/data/agents.ts`, `agent_types.ts` (New frontend integration)
*   **Open Questions:**
    *   Will the `brochure-document` page be rewritten using CSS modules or deleted entirely?
    *   Will the founder dashboard be integrated into the public website or hosted as a separate internal tool?

### Decision 7: Nexocean Selected Work Page
*   **Date:** 2026-06-03
*   **Area:** Website, public proof, portfolio
*   **Status:** Implemented (`[Fact]`)
*   **Decision:** Add a dedicated `/work/nexocean` selected-work page that presents the five-month Nexocean engagement as internal recruiter workflow tooling plus brand content.
*   **Rationale:** Nexocean is already approved as selected experience, and the founder supplied public video showcases. A focused page can communicate the depth of the work without turning the homepage into a broad client-claim surface.
*   **Source or Evidence:** Founder confirmation of the engagement scope, existing master context note on Nexocean, local Wingman Dashboard reference repo, supplied YouTube videos, and the Kramaniti-channel unlisted tools walkthrough.
*   **Affected Files:**
    *   `website/src/app/work/nexocean/page.tsx`
    *   `website/src/app/work/nexocean/Nexocean.module.css`
    *   `website/src/components/layout/Navbar.tsx`
    *   `website/src/components/sections/Credibility.tsx`
    *   `website/src/components/sections/Credibility.module.css`
    *   `docs/kramaniti_site_implementation_plan.md`
*   **Claim Guardrails:**
    *   Do not link the private/reference Wingman Dashboard repo publicly.
    *   Do not claim quantified recruiter outcomes, testimonials, or client endorsement unless separately approved.
    *   Keep the work framed around internal workflow tools, practical AI systems, and cinematic brand presence.
    *   Use the Kramaniti-channel walkthrough as portfolio evidence for UI, UX, process flow, and tool design.

### Decision 8: Remove Homepage Proof Section
*   **Date:** 2026-06-03
*   **Area:** Website, public proof, navigation
*   **Status:** Implemented (`[Fact]`)
*   **Decision:** Remove the homepage Proof/Credibility section and remove the Proof navigation link.
*   **Rationale:** Selected work should live in dedicated Work pages rather than a homepage proof carousel. This keeps the homepage cleaner and avoids broad client-proof presentation on the first-impression surface.
*   **Affected Files:**
    *   `website/src/components/home/HomepageSequence.tsx`
    *   `website/src/components/layout/Navbar.tsx`
    *   `website/src/components/sections/Credibility.tsx`
    *   `website/src/components/sections/Credibility.module.css`
    *   `docs/kramaniti_site_implementation_plan.md`
*   **Claim Guardrails:**
*   Keep Nexocean available through `/work/nexocean`.
*   Do not reintroduce homepage proof sections, client marquees, or proof anchors unless explicitly approved.

### Decision 9: Add Founder Advisory Support
*   **Date:** 2026-06-04
*   **Area:** Website, founder profile, advisory credibility
*   **Status:** Implemented (`[Recommendation]`)
*   **Decision:** Add a small founder-and-advisory section and update the founder preview to include a Legal & Compliance Advisor role for Kashiesh Chordia.
*   **Rationale:** The site should communicate structure and compliance discipline without implying a co-founder, partner, director, employee, or formal legal appointment. An advisory designation preserves founder-led positioning while making the operational support layer visible.
*   **Affected Files:**
    *   `website/src/app/founder/page.tsx`
    *   `website/src/components/sections/FounderPreview.tsx`
*   **Claim Guardrails:**
    *   Use the title "Legal & Compliance Advisor" only.
    *   Frame the work as advisory and internal support, not a public legal service offering.
    *   Avoid implying a formal company appointment beyond advisory support unless separately approved.

### Decision 10: Integrate AI Enablement & Adoption as a Service Layer
*   **Date:** 2026-06-11
*   **Area:** Website, service architecture, internal positioning
*   **Status:** Implemented (`[Recommendation]`)
*   **Decision:** Add AI Enablement & Adoption as an explicit capability layer inside the existing Kramaniti service architecture, while preserving the homepage's three primary service cards.
*   **Rationale:** Kramaniti should not communicate full automation as the default outcome. The service architecture now makes adoption, training, usage documentation, override rules, and human review checkpoints part of systems delivery without repositioning the brand as a generic automation agency.
*   **Source or Evidence:** Founder direction to integrate AI Enablement & Adoption carefully, preserve existing messaging, and reflect the principle: AI should assist, humans should lead.
*   **Affected Files:**
    *   `website/src/components/sections/Services.tsx`
    *   `website/src/components/sections/Services.module.css`
    *   `website/src/components/sections/Workflows.tsx`
    *   `website/src/app/founder/page.tsx`
    *   `06_ai_agent_context/system_prompts/master_context.md`
    *   `06_ai_agent_context/system_prompts/studio_knowledge_base.md`
    *   `03_brand_strategy/brand_narrative.md`
    *   `03_brand_strategy/service_packages.md`
    *   `03_brand_strategy/positioning/positioning_analysis.md`
    *   `04_content_system/drafts/why_scaling_chaos_breaks_business.md`
    *   `05_ai_strategy/ai_service_workflows.md`
    *   `04_content_system/content_pillars.md`
    *   `docs/kramaniti_site_implementation_plan.md`
    *   `website/src/data/insights.ts`
*   **Alternatives Rejected:**
    1.  *Adding a fourth homepage service card:* Rejected because the current website rules and service architecture keep the homepage centered on three primary offers.
    2.  *Keeping Enablement internal only:* Rejected because adoption is now part of the public service promise, but should remain secondary to the existing offer architecture.
*   **Claim Guardrails:**
    *   Do not imply hands-free operations, replacing teams with AI, or full automation by default.
    *   Keep public copy focused on human-collaborative systems, operating clarity, decision support, and team adoption.

### Decision 11: Create Digital Presence Orchestrator
*   **Date:** 2026-06-11
*   **Area:** Agent operating system, brand presence, content operations, governance
*   **Status:** Implemented (`[Recommendation]`)
*   **Decision:** Create the Digital Presence Orchestrator as the master growth agent for Kramaniti's public presence, supported by recurring specialist sub-agents for brand identity and distribution analytics plus the existing Brand Strategist, Content Director, Narrative Editor, Website Steward, Asset Librarian, and Proof and Governance Auditor.
*   **Rationale:** Kramaniti needs the role a company would normally hire for when starting a serious digital presence: someone responsible for brand system, strategy, content, website direction, distribution, asset hygiene, performance review, and governance. The role should not be a generic marketing agent because Kramaniti's positioning requires strategy before tools, systems before scale, and content after clarity.
*   **Source or Evidence:** Founder direction on 2026-06-11 to create a master Digital Presence Orchestrator with sub-agent delegation; existing master context and root `AGENTS.md` positioning.
*   **Affected Files:**
    *   `03_brand_strategy/AGENTS.md`
    *   `03_brand_strategy/brand_system/brand_operating_kit.md`
    *   `03_brand_strategy/brand_system/brand_decisions.md`
    *   `04_content_system/AGENTS.md`
    *   `04_content_system/content_calendar.md`
    *   `04_content_system/campaign_briefs.md`
    *   `04_content_system/content_ideas_backlog.md`
    *   `04_content_system/publishing_checklist.md`
    *   `04_content_system/analytics_log.md`
    *   `06_ai_agent_context/AGENTS.md`
    *   `06_ai_agent_context/agents/digital_presence_orchestrator.json`
    *   `06_ai_agent_context/agents/brand_identity_agent.json`
    *   `06_ai_agent_context/agents/distribution_analytics_agent.json`
    *   `06_ai_agent_context/agent_roles/agent_roles.md`
    *   `06_ai_agent_context/agent_roles/kramaniti_agent_roster.md`
    *   `06_ai_agent_context/routing/task_router.md`
    *   `06_ai_agent_context/routing/task_router.json`
    *   `06_ai_agent_context/system_prompts/master_context.md`
    *   `06_ai_agent_context/memory/digital_presence_orchestrator/`
    *   `08_brand_assets/AGENTS.md`
    *   `08_brand_assets/asset_registry.md`
    *   `09_reviews/AGENTS.md`
    *   `09_reviews/proof_register.md`
*   **Alternatives Rejected:**
    1.  *Creating a generic marketing agent:* Rejected because it would dilute Kramaniti's first-principles systems positioning and likely push content before clarity.
    2.  *Creating 15 new active agents at once:* Rejected because the system should feel like a small brand team with clear ownership, not an agent maze.
    3.  *Leaving brand identity and distribution analytics as unnamed support tasks:* Rejected because both now need recurring files, cadence, and accountability inside the digital presence workflow.
*   **Claim Guardrails:**
    *   The orchestrator may draft, structure, audit, and recommend but may not publish without founder approval.
    *   Proof-sensitive claims must be routed through `09_reviews/proof_register.md` and the Proof and Governance Auditor.
    *   Client names, logos, testimonials, metrics, case studies, pricing changes, and public commitments require explicit approval.
*   **Open Questions:**
    *   Which public channels should be active first?
    *   What approval cadence should the founder use for content and campaign review?
    *   Which assets should be approved for repeated public use across social posts, decks, and website updates?

### Decision 12: Build Studio Agent OS With LM Studio Local Model Bridge
*   **Date:** 2026-06-11
*   **Area:** Studio frontend, agent operations, local model infrastructure
*   **Status:** Implemented (`[Recommendation]`)
*   **Decision:** Add an Agent OS mode to Kramaniti Studio so the founder can manage agents, route tasks, inspect the roster, test a local LM Studio server, and send local-model prompts through a localhost-only Studio bridge.
*   **Rationale:** The agent roster is now a recurring operating layer. It needs a frontend surface that feels like Kramaniti Studio, keeps work local-first, and lets the founder experiment with local models before adding durable backend infrastructure.
*   **Source or Evidence:** Founder request on 2026-06-11 to build an operating system for managing agents in the frontend, powered by a local model downloaded through LM Studio.
*   **Affected Files:**
    *   `website/src/app/studio/page.tsx`
    *   `website/src/app/studio/studio.module.css`
    *   `website/src/lib/studio/agentOS.ts`
    *   `website/src/lib/studio/lmStudio.ts`
    *   `website/src/app/api/studio/lm-studio/models/route.ts`
    *   `website/src/app/api/studio/lm-studio/chat/route.ts`
    *   `docs/lm_studio_agent_os_setup.md`
    *   `docs/kramaniti_site_implementation_plan.md`
    *   `09_reviews/decisions.md`
*   **Alternatives Rejected:**
    1.  *Creating a separate dashboard visual system:* Rejected because the founder asked for the frontend design to match the existing Kramaniti Studio page.
    2.  *Adding a full backend workspace immediately:* Rejected for this iteration because the local bridge is enough for model calls; saved conversations, audit logs, and permissions can wait until the operating model stabilizes.
    3.  *Trying to launch LM Studio from the website:* Rejected because the frontend should only call the local LM Studio server after the founder starts it in LM Studio.
*   **Guardrails:**
    *   Do not store secrets, client data, or private API keys in the repository.
    *   Do not let the local model publish, approve proof, change pricing, or create external commitments.
    *   Public-facing agent output remains behind Proof and Governance review and founder approval.
*   **Open Questions:**
    *   Nemotron 3 Nano 4B is the current local default for Studio Agent OS testing.
    *   Should the next iteration add a backend audit log for conversations and task decisions?
    *   Should Agent OS tasks eventually write back to repo files, a local database, or a hosted workspace?

### Decision 13: Simplify Repository Structure Around One Active Website App
*   **Date:** 2026-06-12
*   **Area:** Repository organization, website architecture, agent operations
*   **Status:** Implemented (`[Recommendation]`)
*   **Decision:** Keep `website/` as the only active web app in the repository, remove the superseded root-level `studio/` prototype app, and remove placeholder `/dashboard` routes that were superseded by the integrated Studio Agent OS.
*   **Rationale:** The repository already has a clear operating map through the numbered folders, local `AGENTS.md` files, `docs/`, and the active website. A second root-level Next app, placeholder dashboard routes, and mixed `/kramaniti` versus root deployment notes made the workspace feel scattered without serving the current canonical product direction. Decision 12 established that Agent OS belongs inside Kramaniti Studio rather than a separate dashboard visual system.
*   **Source or Evidence:** Founder request on 2026-06-12 to organize and simplify scattered files; `README.md` workspace map; `website/AGENTS.md`; Decision 12; `docs/kramaniti_site_implementation_plan.md`; repo inventory showing later Studio work only maintained `website/src/app/studio/`.
*   **Affected Files:**
    *   `.gitignore`
    *   `README.md`
    *   `docs/repo_organization_audit.md`
    *   `docs/kramaniti_site_implementation_plan.md`
    *   `docs/lm_studio_agent_os_setup.md`
    *   `studio/` (removed)
    *   `website/src/app/dashboard/` (removed)
    *   `website/AGENTS.md`
    *   `website/CLAUDE.md`
    *   `website/public/manifest.json`
    *   `website/public/manifest.webmanifest`
    *   `website/public/sw.js`
*   **Alternatives Rejected:**
    1.  *Keeping both `studio/` and `website/src/app/studio/`:* Rejected because it creates two surfaces for the same product idea and increases maintenance confusion.
    2.  *Keeping placeholder `/dashboard` pages for someday:* Rejected because they are not part of the current implementation and Decision 12 routes agent management into Studio.
    3.  *Flattening the numbered top-level workspace folders:* Rejected because those folders encode ownership, local rules, and agent-readable context.
*   **Guardrails:**
    *   Do not create a new root-level app without a new decision log entry.
    *   Keep generated files such as `.next/`, `out/`, `next-env.d.ts`, `*.tsbuildinfo`, `.vercel/`, and `.DS_Store` out of source control.
    *   Preserve `website/.env.local` locally and never commit or print secret values.
    *   Treat `/` as the active public base path unless a new deployment decision reintroduces `/kramaniti`.
*   **Open Questions:**
    *   Should `08_brand_assets/exports/kramaniti_brochure.pdf` become a public download or stay internal?
    *   Should a non-secret `.env.example` be added for local setup?

### Decision 14: Populate Brand Assets and Flatten Sparse Knowledge Folders
*   **Date:** 2026-06-12
*   **Area:** Repository organization, brand assets, knowledge-base usability
*   **Status:** Implemented (`[Recommendation]`)
*   **Decision:** Rename `08_assets/` to `08_brand_assets/`, populate it with real brand files, remove empty `.gitkeep` asset shells, and flatten low-value one-file folders across founder context, content, AI strategy, business build, and review governance.
*   **Rationale:** The founder clarified that the problem was not only generated clutter, but the human-facing folder model. Empty folders made the workspace feel incomplete, and one-file folders added navigation friction. The simplified structure keeps top-level ownership intact while making the actual files easier to see and use.
*   **Source or Evidence:** Founder clarification on 2026-06-12: logos and assets should visibly live under a brand assets folder, and simplification should apply across file and folder types.
*   **Affected Files and Folders:**
    *   `02_founder_context/`
    *   `03_brand_strategy/`
    *   `04_content_system/`
    *   `05_ai_strategy/`
    *   `07_business_build/`
    *   `08_brand_assets/`
    *   `09_reviews/`
    *   `README.md`
    *   `AGENTS.md`
    *   Local `AGENTS.md` files
    *   `06_ai_agent_context/agents/`
    *   `06_ai_agent_context/system_prompts/master_context.md`
    *   `docs/repo_organization_audit.md`
*   **Alternatives Rejected:**
    1.  *Leaving empty asset folders in place:* Rejected because it hides the actual brand materials and makes the repo feel unfinished.
    2.  *Moving website runtime assets completely out of `website/public/assets/`:* Rejected because the Next.js website needs public copies for static serving.
    3.  *Flattening framework folders inside `website/src/`:* Rejected because App Router and API route folders are functional structure, not organizational clutter.
*   **Guardrails:**
    *   Keep top-level numbered ownership folders unless a future decision changes the operating model.
    *   Keep public runtime assets in `website/public/assets/` only when the website actively serves them.
    *   Keep source/reference assets, exports, founder media, and reusable graphics in `08_brand_assets/`.
    *   Avoid `.gitkeep` placeholder folders unless there is a clear near-term reason to preserve an empty category.
*   **Open Questions:**
    *   Which founder-media assets are approved for repeated public use?
    *   Should future social/deck exports get their own subfolder under `08_brand_assets/exports/` once they exist?

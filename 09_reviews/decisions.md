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

### Decision 15: Add KCS - Kramaniti Content Studio Inside the Website App
*   **Date:** 2026-06-13
*   **Area:** Website, Studio tooling, content production
*   **Status:** Implemented (`[Recommendation]`)
*   **Decision:** Add a local `/KCS` route inside the active `website/` app for KCS - Kramaniti Content Studio, a chat-planned and browser-rendered surface for premium Kramaniti infographic videos.
*   **Rationale:** Kramaniti needs a practical way to turn founder ideas, strategic messages, and content briefs into scene-by-scene infographic video plans using the brand design kit. The founder clarified that the existing `/design-studio` surface is a separate prototype and should not be used for this tool. Keeping KCS inside `website/` preserves the one-active-app boundary from Decision 13 while giving the founder a distinct local page for IDE-driven content planning and browser preview.
*   **Source or Evidence:** Founder request on 2026-06-13 to create a separate tool named KCS - Kramaniti Content Studio, plus a reusable IDE skill that first understands the video query, strategizes scene by scene, and chooses diverse premium infographic designs aligned with the brand.
*   **Affected Files:**
    *   `website/src/app/KCS/page.tsx`
    *   `website/src/components/KCS/KcsWorkbench.tsx`
    *   `website/src/components/KCS/KcsWorkbench.module.css`
    *   `website/src/lib/KCS/sceneSequence.ts`
    *   `docs/kcs_content_studio.md`
    *   `docs/kramaniti_site_implementation_plan.md`
    *   `/Users/karanchordia/.codex/skills/kramaniti-content-studio/`
*   **Alternatives Rejected:**
    1.  *Using the `/design-studio` prototype:* Rejected because the founder clarified it was built separately and should not define KCS.
    2.  *Creating a second root-level app:* Rejected because Decision 13 keeps `website/` as the only active web app.
    3.  *Building MP4 export before the KCS model stabilizes:* Rejected because the first useful workflow is a high-quality local strategy, preview, and screen-capture surface.
    4.  *Making the tool a public marketing page:* Rejected because this is an internal production workbench, not a first-impression public sales surface.
*   **Guardrails:**
    *   Do not invent public claims, client names, metrics, testimonials, or proof while creating scenes.
    *   Keep scene language aligned with strategy before tools, systems before scale, and content after clarity.
    *   Make scene designs diverse according to the user's query instead of repeating one visual template.
    *   Keep generated video exports under `08_brand_assets/exports/` unless explicitly serving them from the website.
    *   Do not store secrets, client data, or private source files in scene definitions.
*   **Founder Clarification Update (2026-06-13):**
    *   **Status:** Implemented (`[Fact]`)
    *   **Clarification:** The KCS UI should not show the video brief, strategy notes, scene-planning cards, implementation checklists, capture plan, copied IDE prompt, or similar planning information. The intended workflow is chat-first: the founder opens Codex in this repository, says `Design`, provides the idea, reviews the scene-by-scene draft in Codex chat, approves it, and only then the agent builds the connected premium scene sequence in `/KCS`.
    *   **Implementation Impact:** KCS was revised from an on-screen planning cockpit into a render-only scene player using `website/src/lib/KCS/sceneSequence.ts`. The reusable `kramaniti-content-studio` skill now carries the planning workflow and approval gate.
    *   **Additional Affected Files:**
        *   `website/src/lib/KCS/sceneSequence.ts`
        *   `/Users/karanchordia/.codex/skills/kramaniti-content-studio/SKILL.md`
        *   `/Users/karanchordia/.codex/skills/kramaniti-content-studio/references/storyboard.md`
        *   `/Users/karanchordia/.codex/skills/kramaniti-content-studio/references/visual-diversity.md`
*   **Open Questions:**
    *   Should automated MP4 export use browser frame capture plus `ffmpeg`, Playwright screenshots plus `ffmpeg`, or a dedicated rendering library?
    *   Should KCS later add a real frame timeline, voiceover timing, and audio bed controls?

### Decision 16: Add Clarity Engine as a Focused Public Interactive Tool
*   **Date:** 2026-06-16
*   **Area:** Website, interactive tooling, offer entry point
*   **Status:** Implemented (`[Recommendation]`)
*   **Decision:** Add a standalone `/clarity-engine` route that helps founders, freelancers, and early operators clarify an idea, identify workflow friction, choose a practical AI-assisted system path, and generate initial brand presence directions.
*   **Rationale:** The founder observed that many people in co-working environments want to start companies, freelance around a problem, or use AI to create something, but lack a structured clarity context and operating path. Kramaniti can serve them through an interactive tool that reflects the brand method without forcing them into a cluttered internal Studio surface.
*   **Source or Evidence:** Founder request on 2026-06-16 to create a premium interactive web app with Kramaniti characteristics, crucial questions, clarity context, workflow suggestions, and brand presence ideas. Founder clarification that the tool should not use Studio because Studio is too cluttered.
*   **Affected Files:**
    *   `website/src/app/clarity-engine/page.tsx`
    *   `website/src/app/clarity-engine/ClarityEngine.module.css`
    *   `website/src/components/layout/Navbar.tsx`
    *   `docs/kramaniti_site_implementation_plan.md`
    *   `09_reviews/decisions.md`
*   **Alternatives Rejected:**
    1.  *Extending `/studio`:* Rejected because the founder clarified Studio is too cluttered for this user-facing tool.
    2.  *Waiting for Groq integration before building the UX:* Rejected because the interactive experience, question architecture, and local synthesis can be useful before provider-backed generation is wired.
    3.  *Making it a marketing landing page:* Rejected because the requested value is an interactive working tool, not a static pitch.
*   **Guardrails:**
    *   Keep the tool business-first and aligned to strategy before tools, systems before scale, and content after clarity.
    *   Do not invent client names, testimonials, metrics, case studies, or permission-sensitive proof.
    *   Keep AI as an assistance layer with explicit human judgment gates.
    *   Treat future Groq calls as a generation layer behind the existing intake and blueprint model, not as the product experience itself.
*   **Open Questions:**
    *   Should the first live Groq version save submissions to a database, email the exported brief, or remain browser-local?
    *   Should this become the primary lead magnet before the AI Workflow Audit, or stay a secondary tool in navigation?

### Decision 17: Retire Static Export To Support Clarity Engine AI Runtime
*   **Date:** 2026-06-16
*   **Area:** Website, deployment architecture, AI runtime
*   **Status:** Implemented (`[Recommendation]`)
*   **Decision:** Remove the website's `output: 'export'` static-export setting and treat the site as a standard Next.js deployment so route handlers can power the Clarity Engine assistant.
*   **Rationale:** The redesigned Clarity Engine now depends on a server-side Groq integration. Static export cannot compile or serve route handlers, so keeping the export-only deployment model would make the assistant cosmetic only. The website already had API routes in the codebase, which made the static-only setup an architectural mismatch.
*   **Source or Evidence:** Founder request on 2026-06-16 to implement a genuine AI-driven assistant flow plus Groq integration; build-time failure showing `export const dynamic = "force-dynamic"` cannot be used with `output: export`.
*   **Affected Files:**
    *   `website/next.config.ts`
    *   `vercel.json`
    *   `website/README.md`
    *   `website/CLAUDE.md`
    *   `website/AGENTS.md`
    *   `docs/kramaniti_site_implementation_plan.md`
    *   `09_reviews/decisions.md`
*   **Alternatives Rejected:**
    1.  *Keeping static export and adding a same-repo Groq route:* Rejected because Next.js export mode does not support route handlers.
    2.  *Calling Groq directly from the browser:* Rejected because it would expose credentials and break the repo's no-secrets rule.
    3.  *Leaving the assistant entirely local and heuristic-only:* Rejected because the founder explicitly asked for Groq integration.
*   **Guardrails:**
    *   Keep AI credentials server-side only.
    *   Preserve the custom-domain root deployment path.
    *   Maintain a local fallback interaction path when the runtime endpoint or key is unavailable.
*   **Open Questions:**
    *   Should the production deployment keep all route handlers inside the website app, or should heavier inference move to a separate backend later?
    *   Should the Clarity Engine store sessions, or remain ephemeral by default?

### Decision 18: Simplify Studio Into an Agent Operating Console
*   **Date:** 2026-06-19
*   **Area:** Studio frontend, agent operations, governance
*   **Status:** Implemented (`[Recommendation]`)
*   **Decision:** Replace the planner-plus-Agent-OS Studio workbench with a focused agent operating console that preserves the Studio visual design while simplifying the workflow to Founder Input -> Routing Decision -> Draft Output -> Governance Review -> Founder Approval -> Memory Note.
*   **Rationale:** The earlier Studio direction combined planning dossier generation, project tools, task boards, roster inspection, LM Studio setup, and model prompting in one surface. The founder said the experience felt too complex and asked to keep the design intact while replacing the execution plan with a simpler operating protocol.
*   **Source or Evidence:** Founder request on 2026-06-19 to implement the simplified Studio plan and use the Clarity Engine UX as inspiration.
*   **Affected Files:**
    *   `website/src/app/studio/page.tsx`
    *   `website/src/app/studio/studio.module.css`
    *   `website/src/lib/studio/agentOS.ts`
    *   `docs/kramaniti_site_implementation_plan.md`
    *   `09_reviews/decisions.md`
*   **Alternatives Rejected:**
    1.  *Keeping the full dashboard-style Studio workbench:* Rejected because it created unnecessary complexity for founder-facing agent routing.
    2.  *Keeping LM Studio as a visible first-class tab:* Rejected for this iteration because local model experimentation should not dominate the operating surface.
    3.  *Creating a separate agent dashboard route:* Rejected because Studio can keep the visual language while becoming a focused operating console.
*   **Claim Guardrails:**
    *   Studio may route, draft, summarize, and prepare memory notes.
    *   Studio must not publish, invent proof, change pricing, handle credentials, make client-facing promises, or create external commitments.

### Decision 19: Add Global Kramaniti Website Assistant
*   **Date:** 2026-06-20
*   **Area:** Website, public assistant, AI runtime, knowledge access
*   **Status:** Implemented (`[Recommendation]`)
*   **Decision:** Add a global Kramaniti assistant to the public website as a bottom-right Clarity Engine-inspired blob that expands into a centered premium chat interface.
*   **Rationale:** The public site now needs a lightweight conversational layer that can answer questions about Kramaniti's method, services, founder context, Clarity Engine, Studio direction, proof rules, and current public content without forcing visitors into a separate dashboard or cluttering the homepage.
*   **Source or Evidence:** Founder request on 2026-06-20 to build a Kramaniti chatbot assistant with company and repository knowledge, a premium UI/UX, the Clarity Engine AI blob as character, a fixed bottom-right launcher, and Groq SDK calls using GPT-OSS 120B.
*   **Affected Files:**
    *   `website/src/app/layout.tsx`
    *   `website/src/app/api/chat/route.ts`
    *   `website/src/components/assistant/KramanitiAssistant.tsx`
    *   `website/src/components/assistant/KramanitiAssistant.module.css`
    *   `website/src/lib/kramaniti-assistant/knowledge.ts`
    *   `docs/kramaniti_site_implementation_plan.md`
*   **Alternatives Rejected:**
    1.  *Keeping the old Studio chatbot widget:* Rejected because it was not mounted globally, carried outdated Gemini wording, and did not match the requested Clarity Engine character direction.
    2.  *Calling Groq directly from the browser:* Rejected because it would expose credentials and conflict with the repository's no-secrets rule.
    3.  *Dumping every repository file directly into the browser:* Rejected because a public assistant should use curated server-side context and proof guardrails instead of exposing raw internal workspace material.
*   **Guardrails:**
    *   Keep `GROQ_API_KEY` server-side only.
    *   Default to `openai/gpt-oss-120b`, with `GROQ_CHAT_MODEL` available as an override.
    *   Keep public-facing answers business-first and aligned to strategy before tools, systems before scale, and content after clarity.
    *   Treat vague, greeting-like, or low-signal visitor prompts as a reason to ask one concise clarifying question instead of giving a full method explanation.
    *   Do not invent claims, metrics, testimonials, client permissions, pricing, or project outcomes.
    *   Do not reveal secrets, environment variables, raw internal file dumps, or private implementation details.
*   **Open Questions:**
    *   Should future versions add retrieval indexing instead of curated runtime context?
    *   Should assistant conversations be ephemeral, saved to a CRM, or stored only after explicit visitor consent?
    *   Should the assistant later support lead capture or remain an educational guide until the contact backend is finalized?

*   **2026-06-21 Behavior Update:**
    *   The assistant now carries explicit identity and domain-boundary instructions in its curated runtime context.
    *   It must answer that Karan Chordia is the founder behind Kramaniti when visitors ask who founded Kramaniti, this company, this website, or use likely speech-to-text wording such as "common people" in that context.
    *   It should answer employee/operator workflow questions by explaining Kramaniti's service approach: understand the role, map recurring tasks and handoffs, separate human-led, AI-assisted, and automated steps, define review and override rules, and guide serious prospects toward an AI Workflow Audit.
    *   Local fallback behavior now includes founder and workflow-service answers so the widget remains coherent when Groq is not configured.

### Decision 20: Add Kramaniti Clarity Circle as an Ongoing Public Clarity Ecosystem
*   **Date:** 2026-06-22
*   **Area:** Website, public platform, community strategy, offer entry point
*   **Status:** Implemented (`[Recommendation]`)
*   **Decision:** Add a standalone `/clarity-circle` route for Kramaniti Clarity Circle, a free AI-assisted clarity network for founders and early builders that combines a curated forum, private idea vault, weekly digest, and clarity brief generator.
*   **Rationale:** The founder described a possible company platform for founders who want clarity on harnessing AI and individuals who want to start an idea but lack a clear path. The accepted foundation positions the product as an AI-assisted clarity ecosystem, not a generic AI social network. This route gives the concept a usable v1 while keeping it distinct from Clarity Engine and avoiding premature backend complexity.
*   **Source or Evidence:** Founder request on 2026-06-22 to implement the Clarity Circle foundation plan with two separated tracks, private memory, public learning, weekly AI digest, and clarity brief output.
*   **Affected Files:**
    *   `website/src/app/clarity-circle/page.tsx`
    *   `website/src/app/clarity-circle/ClarityCircle.tsx`
    *   `website/src/app/clarity-circle/ClarityCircle.module.css`
    *   `website/src/components/layout/Navbar.tsx`
    *   `website/src/components/layout/Navbar.module.css`
    *   `website/src/app/sitemap.ts`
    *   `docs/kramaniti_site_implementation_plan.md`
    *   `09_reviews/decisions.md`
*   **Alternatives Rejected:**
    1.  *Building a generic community feed:* Rejected because Kramaniti's value is clarity, workflow thinking, and proof-safe operating direction, not engagement volume.
    2.  *Making v1 a paid membership product:* Rejected because the current role is a free ecosystem and lead path toward AI Workflow Audit and deeper services.
    3.  *Merging the product into Clarity Engine:* Rejected because Clarity Engine is a single diagnostic session, while Clarity Circle is ongoing memory, community engagement, and weekly progress.
    4.  *Adding accounts, emails, or backend persistence immediately:* Rejected because browser-local state is enough to validate the interaction model without handling private user data in production infrastructure.
*   **Guardrails:**
    *   Do not call Clarity Circle an AI social network.
    *   Keep private idea vault entries private by default.
    *   Keep AI as an assistive layer for summaries, sharper questions, digest memos, and briefs; humans own strategy, claims, pricing, and decisions.
    *   Any future external market or tool updates must be source-linked and date-stamped.
    *   Do not add payments, public proof claims, user accounts, CRM storage, or email delivery without a newer decision and privacy/storage model.
*   **Open Questions:**
    *   Should the next iteration add authentication and server-side private vault storage?
    *   Should weekly digests become email-based, in-app only, or opt-in CRM notes?
    *   Should public forum posts be moderated by Kramaniti agents before publishing?

*   **2026-06-22 UX Update:**
    *   The Clarity Circle route was redesigned from a traditional webpage-like surface into a premium dashboard experience.
    *   The canonical UX direction is now an app shell with left navigation, a compact top command bar, track switcher, privacy status, command intake, private vault, public learning, weekly digest, clarity brief, and workflow route panels.
    *   Future Clarity Circle UI work should preserve the dashboard/operating-console model unless the founder explicitly asks to return to a landing-page style.

*   **2026-06-23 Sketch Alignment Update:**
    *   The founder supplied a rough Clarity Circle sketch that clarified the platform model: target audience and problem first, then community/platform, AI-enabled assistance, and founder/individual circle.
    *   The dashboard was updated to show Who/Why, founders harnessing AI, individuals starting out, storage for ideas/projects, intelligent engagement, journey tracking, personalised insights, contribution connection, and engagement/validation loops.
    *   Future Clarity Circle work should treat this sketch model as product structure, not as a literal visual wireframe.

*   **2026-06-23 Sequential UX Update:**
    *   The founder asked for the Clarity Circle experience to stay very simple and unfold sequentially rather than showing every product block on one dashboard screen.
    *   The canonical UX is now: modern entry/sign-in screen, founder vs individual path selection, focused private intent capture, then a saved-context workspace that can progressively introduce digest, public-learning, and Clarity Brief actions.
    *   Future Clarity Circle UI work should preserve this staged flow unless the founder explicitly asks for a dashboard mode again.

*   **2026-06-23 Clarity Engine Handoff Update:**
    *   The Clarity Circle context workspace now prepares a browser-local handoff when the user chooses to continue into Clarity Engine.
    *   Clarity Engine consumes the handoff once, seeds its diagnostic session with the Circle's intent, context, audience, blocker, and desired outcome, then continues from the current workflow question.
    *   This is not authenticated account memory or backend persistence; it is a v1 local bridge between two public diagnostic surfaces.

*   **2026-06-23 Supabase Storage Update:**
    *   The founder asked to connect Clarity Circle to the existing Supabase project without creating a new project and without overlapping with recruiting-company database structures.
    *   Clarity Circle now uses Supabase email/password auth when env vars are configured, and saves completed intent captures as private projects for signed-in users.
    *   The database design uses a dedicated `clarity_circle` schema with `profiles`, `projects`, and `context_entries` tables, RLS policies scoped to `auth.uid()`, and explicit grants only for authenticated users.
    *   Future Clarity Circle storage work must remain inside the `clarity_circle` schema unless a newer database decision explicitly changes that boundary.

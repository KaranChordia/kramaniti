# Kramaniti Agent Operating Rules

Scope: this file applies to the entire repository. More specific `AGENTS.md` files inside subdirectories add local rules for that area.

## Core Positioning

Kramaniti is not an AI automation agency. Kramaniti is a first-principles AI systems partner that connects strategy, operational infrastructure, and cinematic content into one brand growth pipeline.

Default narrative sequence:

1. Strategy before tools.
2. Systems before scale.
3. Content after clarity.

## Read First

Before making strategic, copy, website, offer, content, or agent changes, inspect:

- `docs/Kramaniti Foundation Document.pdf`
- `06_ai_agent_context/system_prompts/master_context.md`
- `06_ai_agent_context/agent_roles/kramaniti_agent_roster.md`
- `09_reviews/decision-log/decisions.md`

For website work, also read:

- `website/AGENTS.md`
- `docs/kramaniti_site_implementation_plan.md`

## Claim Discipline

- Do not invent client names, testimonials, metrics, logos, case studies, or project outcomes.
- Use these labels when recording factual material: `[Fact]`, `[Inference]`, `[Unverified]`, `[Recommendation]`.
- If public proof is not verified and permission-cleared, use category-level language.
- Safe category-level credibility language: "Experience across co-working, hospitality, education, startup, and B2B technology ecosystems."
- WeWork India, Hyatt Centric, and Nexocean may be referenced only as softened, text-only selected experience unless public permission/evidence is confirmed.

## Brand Voice

Use language like:

- strategy
- systems
- workflows
- infrastructure
- clarity
- brand growth
- practical AI
- operating pipeline
- cinematic content
- first-principles thinking
- connected growth system

Avoid generic AI agency language:

- revolutionary AI
- cutting-edge transformation
- unlock the future
- automate everything
- next-gen solutions
- agentic everything
- leverage AI to transform your business

Technical terms can appear in internal docs or deeper technical pages when useful, but the first impression should stay business-first.

## Workspace Behavior

- Keep the workspace human-readable and AI-agent-ready.
- Prefer small, intentional document updates over broad rewrites.
- Preserve existing strategic context unless a newer canonical document clearly supersedes it.
- When a major strategic decision changes, update `09_reviews/decision-log/decisions.md`.
- Do not store secrets, credentials, private API keys, client data, or private personal information in this repository.
- If a task crosses multiple work areas, identify the lead agent from the roster and the supporting agents before editing.

## Directory Ownership

- `02_founder_context/`: founder facts, timeline, skills, verification.
- `03_brand_strategy/`: positioning, offers, narrative, identity, naming.
- `04_content_system/`: content pillars, editorial systems, repurposing logic.
- `05_ai_strategy/`: workflow audits, systems delivery, implementation blueprints.
- `06_ai_agent_context/`: agent definitions, prompts, memory, operating model.
- `07_business_build/`: launch operations, sales, CRM, delivery operations.
- `08_assets/`: brand assets, references, exports, screenshots.
- `09_reviews/`: decisions, governance, review logs.
- `docs/`: implementation plans, handoff notes, cross-functional documentation.
- `website/`: public Next.js website.

## Definition of Done

For meaningful changes:

- The change follows the foundation positioning.
- Claims are labeled or softened.
- Relevant local `AGENTS.md` instructions were followed.
- Affected docs remain easy for another agent to continue.
- Code changes pass available checks.
- Strategic changes are reflected in decision logs or implementation notes when appropriate.

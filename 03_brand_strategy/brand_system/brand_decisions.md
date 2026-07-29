# Brand Decisions

**Purpose:** Track working brand-presence decisions that guide the Digital Presence Orchestrator. This file supports the main decision log; it does not replace `09_reviews/decisions.md`.

**Key Findings:** [Recommendation] Brand decisions should stay close to the brand operating kit so future agents can understand what was accepted, what remains open, and what should not be revived without approval.

**Evidence:** Founder direction on 2026-06-11 to create a Digital Presence Orchestrator and supporting sub-agent system.

**Interpretation:** [Inference] The recurring digital presence role is broad enough to need its own operating kit, but public proof and final publishing authority remain governed.

**Implications:** Small brand-presence choices can live here. Major strategic or structural decisions must also be logged in `09_reviews/decisions.md`.

**Open Questions:** Which social channels should become active first? Which cadence is realistic for the founder to approve?

**Next Steps:** Update this file when the orchestrator makes a reusable brand-system decision that affects future content, website, or campaign work.

---

## Active Brand-Presence Decisions

| Date | Status | Decision | Rationale | Related Files |
| :--- | :--- | :--- | :--- | :--- |
| 2026-06-11 | Implemented `[Recommendation]` | Use Digital Presence Orchestrator as the master agent for Kramaniti's digital presence. | The role mirrors an early brand/growth hire responsible for strategy, brand kit, content, website direction, distribution, and review orchestration. | `06_ai_agent_context/agents/digital_presence_orchestrator.json`, `06_ai_agent_context/agent_roles/kramaniti_agent_roster.md` |
| 2026-06-11 | Implemented `[Recommendation]` | Treat Brand Identity Agent and Distribution & Analytics Agent as recurring specialist sub-agents for the digital presence system. | Existing agents cover strategy, content, narrative, website, and proof; these two functions needed clearer ownership for design-kit maintenance and performance feedback. | `06_ai_agent_context/agents/brand_identity_agent.json`, `06_ai_agent_context/agents/distribution_analytics_agent.json` |
| 2026-07-29 | Drafted `[Recommendation]` | Use the Kramaniti Brand Book v1.0 as the consolidated internal working reference for brand foundation, verbal identity, visual identity, applications, and governance. | The founder requested a highly detailed premium brand book. This edition assembles the current live system and canonical operating rules without treating the supplied reference book as a design template. Public release and the explicitly listed open identity decisions remain founder approval items. | `03_brand_strategy/kramaniti_brand_book.md`, `08_brand_assets/exports/kramaniti_brand_book.pdf`, `scripts/render_kramaniti_brand_book.py` |

## Open Brand-Presence Questions

| Question | Owner | Status | Notes |
| :--- | :--- | :--- | :--- |
| Which channels are active for the first operating cycle? | Digital Presence Orchestrator | Open | Candidate channels should be chosen before filling the content calendar. |
| What approval rhythm should be used for public publishing? | Digital Presence Orchestrator | Open | Weekly batch approval is the simplest starting model. |
| Which visual assets are approved for repeated public use? | Asset Librarian | Open | Track decisions in `08_brand_assets/asset_registry.md`. |
| Should the proposed purpose, vision, and mission in Brand Book v1.0 become canonical? | Brand Strategist / Founder | Open | Approve or revise the working articulation before treating it as final public language. |
| Does Kramaniti need a dedicated wordmark asset? | Brand Identity Agent / Founder | Open | The current system uses the registered symbol plus a functional typeset brand name; do not treat the typeset name as master artwork. |
| What are the final construction, clear-space, minimum-size, and print specifications for the mark? | Brand Identity Agent | Open | Brand Book v1.0 records conservative working recommendations; formal production artwork and physical print proofs are still required. |

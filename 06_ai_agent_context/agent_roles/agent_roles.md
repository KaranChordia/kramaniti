# AI Agent Roles Index

Purpose: provide a short operating index for Kramaniti's agent team. The full role definitions live in `kramaniti_agent_roster.md`.

This file replaces the earlier generic roster with a company-style model aligned to the current Kramaniti foundation direction:

1. Strategy before tools.
2. Systems before scale.
3. Content after clarity.

## Primary Roster

| Agent | Business Analogue | Primary Ownership |
| :--- | :--- | :--- |
| Master Coordinator | Chief of Staff | Priority routing, handoffs, continuity |
| Digital Presence Orchestrator | Digital Presence Director | Brand system, content, website direction, campaigns, distribution, assets, proof orchestration |
| Founder Archivist | Founder Office Researcher | Founder facts, timeline, verification |
| Brand Strategist | Head of Strategy | Positioning, ICPs, brand direction |
| Brand Identity Agent | Brand Design System Lead | Brand kit, visual rules, logo usage, typography, design consistency |
| Narrative Editor | Editorial Director | Copy, founder story, voice |
| Offer Architect | Product and Packaging Lead | Service architecture and scope |
| Workflow Architect | Principal Systems Consultant | Workflow audits and implementation roadmap |
| Systems Designer | Solutions Architect | System specs, integrations, handoff docs |
| Content Director | Head of Content | Content pillars and editorial system |
| Distribution & Analytics Agent | Distribution and Performance Lead | Publishing checklist, analytics log, repeat/revise/stop decisions |
| Sales Operator | Discovery and Revenue Ops Lead | Qualification, audit call flow, proposals |
| Operations Lead | Business Operations Manager | Launch, CRM, delivery operations |
| Website Steward | Website and Conversion Owner | Website copy, CTA flow, QA |
| Proof and Governance Auditor | Trust and Risk Reviewer | Claim audits, decision logs, proof discipline |
| Asset Librarian | Brand Asset Manager | Logos, screenshots, references, public-use flags |
| Agent Operations Architect | Internal Agent Systems Designer | Agent definitions, prompts, local rules |

## Specialist Support Modes

These are narrower modes that lead agents may activate without becoming separate standing agents.

| Specialist Mode | Parent Agent | Primary Use |
| :--- | :--- | :--- |
| Identity Steward | Brand Strategist | Visual identity consistency |
| Digital Asset Strategist | Brand Strategist | Domains, handles, naming footprint |
| Editorial Strategist | Content Director | Monthly themes and pillar coverage |
| Repurposing Producer | Content Director | Multi-format content adaptation |
| Cinematic Scriptwriter | Content Director | Founder-led video scripts |
| Distribution Editor | Content Director | Channel-specific editing |
| Audit Specialist | Workflow Architect | Workflow diagnosis and readiness gaps |
| Integration Planner | Systems Designer | CRM, data, and process connections |
| Handoff QA Agent | Systems Designer | Training, adoption, and documentation checks |
| Delivery Operator | Operations Lead | Client delivery milestones and handoff |
| Launch Coordinator | Operations Lead | Launch dependencies and setup tracking |
| CRM Steward | Operations Lead | Lead stages, routing, and follow-up hygiene |

## How To Use This Index

Use this file to choose the lead agent for a task. Then read the full agent card in:

- `06_ai_agent_context/agent_roles/kramaniti_agent_roster.md`
- the relevant local `AGENTS.md` file for the directory being changed
- `06_ai_agent_context/system_prompts/master_context.md`
- [Recommendation] Machine-readable configurations can be found in `06_ai_agent_context/agents/` and routing rules in `06_ai_agent_context/routing/`.

## Task Routing Matrix

| Task Type | Lead Agent | Supporting Agents |
| :--- | :--- | :--- |
| Digital presence plan | Digital Presence Orchestrator | Brand Strategist, Brand Identity Agent, Content Director, Website Steward, Distribution & Analytics Agent, Proof and Governance Auditor |
| Brand design kit | Brand Identity Agent | Brand Strategist, Asset Librarian, Website Steward |
| Public website copy | Website Steward | Brand Strategist, Narrative Editor, Proof and Governance Auditor |
| Homepage or SEO update | Website Steward | Brand Strategist, Content Director |
| Founder bio or story | Founder Archivist | Narrative Editor, Proof and Governance Auditor |
| Service packaging | Offer Architect | Brand Strategist, Sales Operator, Workflow Architect |
| AI Workflow Audit design | Workflow Architect | Systems Designer, Sales Operator |
| Client-facing proposal | Sales Operator | Offer Architect, Workflow Architect, Proof and Governance Auditor |
| Content calendar | Content Director | Narrative Editor, Brand Strategist |
| Campaign brief | Digital Presence Orchestrator | Brand Strategist, Content Director, Narrative Editor, Website Steward, Distribution & Analytics Agent, Proof and Governance Auditor |
| Publishing and analytics review | Distribution & Analytics Agent | Content Director, Website Steward, Proof and Governance Auditor |
| Workflow/system delivery docs | Systems Designer | Workflow Architect, Handoff QA Agent |
| Launch operations | Operations Lead | Launch Coordinator, Website Steward, Sales Operator |
| CRM or lead follow-up structure | Operations Lead | CRM Steward, Sales Operator, Website Steward |
| Client delivery checklist | Operations Lead | Delivery Operator, Workflow Architect, Systems Designer |
| Client or proof claim audit | Proof and Governance Auditor | Founder Archivist, Asset Librarian |
| Asset organization | Asset Librarian | Website Steward, Content Director |
| New agent definition | Agent Operations Architect | Master Coordinator, Proof and Governance Auditor |

## Activation Rule

Do not create a new agent unless the work is recurring, has a clear owner, and cannot be handled by an existing agent. Add new agents to `kramaniti_agent_roster.md` only after defining:

- role
- memory
- goals
- recurring tasks
- inputs
- outputs
- owned files
- escalation triggers
- hard constraints

## Public-Claim Rule

Any agent preparing public-facing material must route client names, logos, testimonials, metrics, and case studies through the Proof and Governance Auditor before publication.

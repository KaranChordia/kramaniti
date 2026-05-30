# Task Routing Engine

This document defines how requests are routed to specific agents within the Kramaniti operating framework. The Master Coordinator uses these rules to assign tasks.

## Routing Logic

When a new task or request is received, the Master Coordinator evaluates the primary objective and assigns a **Lead Agent** and **Supporting Agents**.

1. **Lead Agent**: The single owner responsible for the final output, quality, and decision log updates.
2. **Supporting Agents**: Agents who provide specific expertise, review, or assets to the Lead Agent.

## Routing Matrix

| Task Intent / Category | Lead Agent | Supporting Agents | Triggering Keywords / Scenarios |
| :--- | :--- | :--- | :--- |
| **Website & Public Copy** | Website Steward | Brand Strategist, Narrative Editor, Proof and Governance Auditor | "update homepage", "SEO update", "change CTA", "new landing page" |
| **Brand Strategy & Positioning** | Brand Strategist | Narrative Editor, Content Director | "repositioning", "ICP update", "messaging map", "brand identity" |
| **Founder Story & Verification** | Founder Archivist | Narrative Editor, Proof and Governance Auditor | "update bio", "founder timeline", "Karan's background" |
| **Service & Offer Packaging** | Offer Architect | Brand Strategist, Sales Operator, Workflow Architect | "new pricing", "update service package", "define deliverables" |
| **Workflow Diagnosis & Roadmaps** | Workflow Architect | Systems Designer, Sales Operator | "workflow audit", "process map", "AI readiness" |
| **System Specs & Documentation** | Systems Designer | Workflow Architect, Handoff QA Agent | "build this system", "integration map", "handoff docs", "prototype spec" |
| **Content Creation & Planning** | Content Director | Narrative Editor, Brand Strategist | "LinkedIn post", "newsletter", "editorial calendar", "video script" |
| **Sales & Proposals** | Sales Operator | Offer Architect, Workflow Architect | "discovery call", "client proposal", "lead follow-up" |
| **Business Operations & CRM** | Operations Lead | Website Steward, Sales Operator | "launch checklist", "setup CRM", "domain config", "client onboarding" |
| **Proof Auditing & Risk Review** | Proof and Governance Auditor | Founder Archivist, Asset Librarian | "verify claim", "check permissions", "decision log", "audit public proof" |
| **Asset Management** | Asset Librarian | Website Steward, Content Director | "organize logos", "find screenshot", "label assets" |
| **Agent Framework Updates** | Agent Operations Architect | Master Coordinator, Proof and Governance Auditor | "create new agent", "update system prompt", "modify AGENTS.md" |

## Activation Rules

- Do not create a new agent unless the work is recurring and clearly falls outside these defined routes.
- If a task spans more than 3 categories, the Master Coordinator must break it down into smaller sequential tasks before routing.
- Any public-facing task must involve the Proof and Governance Auditor.

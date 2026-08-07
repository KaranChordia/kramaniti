# Kramaniti Workflow Intelligence: Product Requirements v0

**Scope:** private, synthetic, development-only foundation. **Source:** `KRAMANITI_SCALABLE_COMPANY_STRATEGY.md` (1 August 2026).

## Product intent

[Recommendation] Kramaniti should test a narrow operating layer that helps a service team make a critical workflow visible, governed, and easier to improve. It is not a generic agent platform, automatic process-discovery tool, or regulatory-compliance product.

The working job to be done is: **when a growing service business needs to improve a recurring workflow, it needs a shared record of how the work moves, where judgment belongs, what evidence is required, what delays or risks exist, and what to improve next.**

## First representative workflow

[Fact] The prototype uses fully synthetic recruitment/staffing data: a retained-search workflow from signed hiring-manager brief through outcome tracking. It contains no Nexocean, client, candidate, employee, or personally identifying data.

The workflow must show:

1. intake;
2. job-description analysis;
3. sourcing preparation;
4. candidate discovery;
5. candidate screening;
6. outreach;
7. recruiter review;
8. shortlist approval;
9. client handoff; and
10. follow-up/outcome tracking.

## Functional requirements

| Requirement | First-slice behaviour | Status |
| --- | --- | --- |
| Organisation and team | Display the synthetic organisation and accountable delivery team. | Implemented locally. |
| Workflow and trigger | Load one named current-state workflow and its start condition. | Implemented locally. |
| Ordered steps and handoffs | Show a 1–10 ordered sequence, owner/approver, systems, inputs/outputs, and next handoff. | Implemented locally. |
| Work classification | Distinguish human-led, AI-assisted, and safely automatable work. | Implemented locally. |
| Controls | Show decision rules, mandatory human checkpoints, evidence, exceptions, and escalation owner. | Implemented locally. |
| Risks | Show a bottleneck, ownership ambiguity, and a risk with severity and step context. | Implemented locally. |
| Measures | Show workflow baseline, target, and review cadence. | Implemented locally. |
| Improvement queue | Display existing items and let an internal user record a proposed local improvement. | Implemented in client-only state. |
| Workflow history | Show version 1 and the change reason. | Implemented locally. |
| Diagnostic output | Generate a concise advisory current-state summary. | Implemented locally; no export/persistence yet. |
| Validation | Reject malformed workflow shape and broken relationships before the UI consumes it. | Implemented in a pure runtime validator. |

## Explicit non-requirements

This slice does not implement agent building/orchestration, automatic workflow execution, process mining, external actions, ATS/CRM integrations, customer-data ingestion, payments, pricing, marketplace features, compliance enforcement, public product navigation, or broad Clarity Square changes.

## Access and data requirements

- The route is unlinked and receives `noindex`, `nofollow`, and `noarchive` metadata.
- It returns not-found in production; it is available only outside production unless explicitly disabled by `WORKFLOW_INTELLIGENCE_PROTOTYPE_ENABLED=false`.
- It is intentionally not a substitute for authentication. The temporary boundary is acceptable only because it holds synthetic in-memory data and no write is sent to a server or third party.
- Any persistent customer-facing phase must use explicit customer/workspace membership, role checks, RLS, data minimisation, retention rules, and a contract/IP review.

## Success criteria for this slice

- A valid synthetic workflow can be loaded end-to-end.
- A malformed workflow is rejected with clear errors.
- The represented workflow shows the required bottleneck, ownership ambiguity, AI assistance, mandatory checkpoint, exception route, and baseline/target measures.
- Improvements remain local and can be recorded without external action.
- Existing public routes and production configuration remain unchanged.

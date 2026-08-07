# Kramaniti Scaling: Product Decision Log

This log records implementation decisions made for the private foundation. It does not close founder-owned business decisions from the strategy document.

## 1 August 2026 — Use a local-only workflow foundation before persistence

- **Status:** Implemented [Recommendation]
- **Decision:** Build a synthetic, production-disabled route and pure domain model before adding any workflow database schema or API.
- **Rationale:** Existing product surfaces prove that Kramaniti has usable framework, design, and Supabase patterns, but they do not resolve customer/workspace ownership, data handling, retention, or the permanent relationship to Clarity Square. A migration would encode those unresolved product decisions too early.
- **Evidence:** `KRAMANITI_SCALABLE_COMPANY_STRATEGY.md`, sections 6, 11, 15, and 16; repository audit in `00-repository-audit.md`.
- **Affected files:** `website/src/app/workflow-intelligence/`, `website/src/lib/workflow-intelligence/`, and this documentation set.
- **Alternatives rejected:**
  1. Extending Clarity Square immediately: rejected because its user-owned founder workspace model is not a confirmed B2B multi-customer model.
  2. Extending Client Hub tables immediately: rejected because its tenancy model is relevant but its collaboration entities do not yet define the required workflow records.
  3. Building a broad agent/orchestration layer: rejected by the strategy and outside the first product wedge.
- **Revisit when:** a paid diagnostic or authorised pilot requires a shared persistent workspace.

## 1 August 2026 — Treat recruitment/staffing as a synthetic lead hypothesis, not an ICP decision

- **Status:** Implemented [Unverified]
- **Decision:** Use a synthetic retained-recruitment workflow solely as the representative prototype workflow.
- **Rationale:** It exercises the specified end-to-end domain and is named in the strategy as the current lead hypothesis. It does not validate willingness to pay, buyer, or final vertical.
- **Evidence:** Strategy sections 4, 9, 14, and 15.
- **Open question:** Is recruitment/staffing the first paid design-partner wedge after comparative vertical scoring?

## Founder-owned open decisions

1. Final ICP and first workflow wedge.
2. Product name and whether Clarity Square is eventually reused, integrated, or kept separate.
3. Customer-data hosting, retention, security review, and contractual reuse rights.
4. Organisation/workspace ownership, member roles, evidence access, and approval-audit requirements.
5. Specific integrations and their read/write authority.
6. Pricing, public positioning, regulatory claims, and fundraising timing.

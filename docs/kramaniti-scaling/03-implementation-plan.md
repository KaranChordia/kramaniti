# Workflow Intelligence: Staged Implementation Plan

## Implemented foundation

1. **Private route:** `website/src/app/workflow-intelligence/` is unlinked, no-index, and unavailable in production.
2. **Pure domain module:** explicit TypeScript types, synthetic data factory, relationship-aware runtime validation, and diagnostic-summary generator live under `website/src/lib/workflow-intelligence/`.
3. **Representative interface:** a current-state summary, ordered workflow map, classifications, controls, findings, measures, local improvement form, version record, and advisory diagnostic summary are rendered without database or network writes.
4. **Focused tests:** Node’s built-in test runner validates the happy path, required ownership-ambiguity failure, and summary content.

## Next implementation sequence

| Stage | Entry criteria | Scope | Exit evidence |
| --- | --- | --- | --- |
| 1. Method validation | Synthetic workflow used by Kramaniti internally. | Test the schema, report layout, evidence checklist, and scoring language with an authorised internal reviewer. | A non-founder can complete the structured record with clear gaps. |
| 2. Data/access decision | A chosen design-partner model and written handling requirements. | Decide organisation/workspace ownership, roles, data retention, contract/IP rights, and whether Client Hub tenancy can be reused. | Approved architecture decision with RLS/authorisation design. |
| 3. Persistent private MVP | At least one paid diagnostic or authorised pilot requires shared records. | Add isolated migration, API boundary, server authentication, tenant RLS, audit history, and export path. | One workspace can persist and retrieve only its authorised records. |
| 4. Repeated workflow evidence | Comparable workflows reveal the same repeated decisions. | Add only repeated templates, report assembly, controlled evidence attachments, and one appropriately demanded integration. | Reuse and adoption measures improve across diagnostics. |

## Guardrails for Stage 3

- Generate any migration through the Supabase CLI after the tenancy model is approved; do not hand-create a migration filename.
- Use a dedicated schema or clearly isolated tables rather than expanding Clarity Square by default.
- Apply RLS and least-privilege grants to every exposed table; test member isolation and role-specific writes.
- Use server-side session verification for every write API; do not trust browser-provided workspace IDs alone.
- Preserve workflow versions and human approvals separately from advisory AI outputs.
- Keep integrations read-only/advisory until explicit action controls, rollback, and exception routes are designed.

## Evidence-linked backlog

| Backlog item | Evidence required before build | Priority |
| --- | --- | --- |
| Standard diagnostic input and evidence checklist | Five comparable diagnostics in one segment. | High |
| Customer workspace persistence | Confirmed tenant/access/data rights decision. | High |
| Exportable diagnostic report | A verified delivery format and customer approval expectations. | Medium |
| Clarity Engine intake mapping | Evidence that its fields improve workflow discovery rather than duplicate it. | Medium |
| ATS/CRM integration | Repeated demand from design partners and permission to access relevant data. | Deferred |
| Automated recommendations | Validated decision rules, advisory boundary, and human-review outcome. | Deferred |

## Verification plan

For every code change, run `npm run lint`, `npx tsc --noEmit`, `npm run test:workflow-intelligence`, and `npm run build` from `website/`. When a preview is used, verify the exact private route in development and confirm the production build remains unavailable.

# Kramaniti Scaling: Repository and Product Audit

**Status:** [Fact] Completed on 1 August 2026 against the repository state observed locally. This is an implementation audit, not a public-product announcement.

## Executive finding

[Fact] The active product surface is the Next.js application in `website/`: Next.js 16 App Router, React 19, TypeScript strict mode, CSS Modules, route handlers, and Supabase client libraries. Its existing private product surfaces provide reusable visual and access-control patterns, but they do not yet expose a shared workflow-intelligence domain model.

[Recommendation] The first slice should remain a synthetic, development-only prototype. It should validate the method and record shape before a customer-data store, a tenant model, or a permanent relationship to Clarity Square is chosen.

## Architecture and dependencies

| Area | Observed implementation | Reuse decision |
| --- | --- | --- |
| Application | `website/` is the deployed application; root `vercel.json` routes to it. Next.js App Router, React, strict TypeScript, CSS Modules. | Retain. No replacement stack is needed. |
| Public routes | Homepage, founder, insights, selected work, Clarity Engine, Clarity Square, Studio, KCS, and related routes are inside `website/src/app/`. | Do not change public routes, navigation, or public positioning. |
| Product routes | `/clarity-square/`, `/client-hub/`, `/hq/`, and `/studio/` already exist. Client Hub is explicitly no-index; Clarity Square has a separate public entry experience. | Reuse visual conventions only in Phase A. |
| Authentication | Clarity Square uses browser Supabase authentication and row ownership. Client Hub authenticates bearer tokens server-side, then checks a profile role. | Client Hub is the more relevant later reference for tenant-aware internal/client workspaces. |
| Database | Supabase migrations contain isolated `clarity_square` and `kramaniti_hub` schemas. Both use RLS. `kramaniti_hub` has workspaces, memberships, roles, and role-aware policies. | Do not add a migration until the product tenant/access decision is made. |
| API boundary | Existing route handlers guard Client Hub server actions with an authenticated bearer token and profile check. Clarity Engine has optional Groq-backed routes and a local fallback. | A later workflow API should follow Client Hub’s server-side user verification and database/RLS pattern. |
| AI integrations | Groq is used for Clarity Engine and selected assistant paths; Studio includes a local LM Studio bridge. | No AI call is required for this prototype. AI is recorded only as a work classification, never as a decision-maker. |
| State and validation | Current product screens have typed client/domain files; the repository does not currently use a shared runtime-schema library or test runner. | Add a small explicit runtime validator instead of introducing a validation dependency. |
| Design system | Global dark premium tokens plus CSS Modules. Existing private surfaces use panels, gold accents, concise controls, and accessible native form elements. | Reuse without changing global styling. |
| Tests and checks | No project test files or generic test script were present. Website scripts include lint, TypeScript check via `npx tsc --noEmit`, and production build. | Add a focused Node test script for the new pure domain module. |
| Deployment | Vercel configuration routes all traffic to `website/`. No deployment action was taken. | Production must continue to exclude this prototype. |

## Existing product concepts

| Concept | Current purpose | Product relationship | Conflict / caution |
| --- | --- | --- | --- |
| Clarity Engine | Guided founder intake and preliminary blueprint. | Possible future structured intake source. | Its output is advisory; it is not evidence-backed workflow audit data. |
| Clarity Square | Auth-backed founder/solopreneur projects, tasks, assistant, and memory. | A useful interaction experiment. | Its single-user founder-productivity model is not a confirmed B2B customer workspace model. |
| Client Hub | Auth-backed multi-workspace client communication, projects, tasks, notes, and reviewed assistant actions. | Strongest existing tenancy and access-control reference. | Its operational data model is collaboration-centric, not workflow-intelligence-centric. |
| Studio | Internal agent-operation console. | Separate internal operating surface. | It must not become a universal workflow dashboard or orchestration layer. |

## Privacy, tenancy, and customer-data assessment

[Fact] `kramaniti_hub` has a workspace/member model and RLS policies; this is the only observed schema with an explicit multi-party workspace model. `clarity_square` is primarily user-owned. Both have established Supabase patterns, but neither has a workflow domain, a customer-data retention policy, or product-specific authorisation rules for the new domain.

[Risk] Reusing either schema now would permanently imply a product boundary before these unresolved decisions are made: customer versus Kramaniti ownership, workspace roles, hosting/data-region needs, evidence retention, and the relationship between delivery artifacts and customer records.

[Decision for this slice] No database migration, live read/write API, integration, customer record, or production route is introduced. The private route is unavailable in production and is populated only by a synthetic staffing workflow. This makes access and data boundaries explicit without pretending that customer tenancy is already decided.

## Safe reusable code

- `website/src/app/client-hub/page.tsx`: no-index metadata pattern for private routes.
- `website/src/lib/client-hub/server.ts`: future server-side bearer/session verification pattern.
- `supabase/migrations/20260713100327_kramaniti_client_hub.sql`: future workspace/member/RLS reference.
- `website/src/app/*/*.module.css` and `website/src/app/globals.css`: existing visual tokens and responsive CSS convention.
- `website/src/lib/clarity-square/supabase.ts`: typed domain client convention, not its single-user model.

## Conclusion and Phase B decision

[Recommendation] Proceed with a local, pure TypeScript domain model and a private development interface. This does not make a material architecture commitment and respects all stop conditions. A persistent, authenticated multi-customer implementation remains intentionally blocked on the decisions in `04-decision-log.md`.

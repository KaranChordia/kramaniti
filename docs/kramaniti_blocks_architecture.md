# Kramaniti Blocks - Architecture Brief and Execution Plan

Status: first vertical slice implemented on 2026-08-17.

## 1. Current repository state

- [Fact] The worktree was clean before implementation.
- [Fact] `website/` is the repository's only active web application. Decision 13 explicitly rejects a second root-level app.
- [Fact] Existing internal product surfaces include Studio, Clarity Engine, Clarity Square, Client Hub, and HQ. They demonstrate useful interaction and visual patterns, but each has a narrower product boundary than Blocks.
- [Fact] The private Foundation PDF is not tracked in this public repository. The canonical Markdown master context and decision log are the portable repository sources.

## 2. Frontend stack and constraints

- Next.js 16 App Router, React 19, TypeScript, CSS Modules, Lucide icons.
- Global Kramaniti tokens already provide obsidian, graphite, charcoal, gold, typography, focus, and theme foundations.
- The public app uses root deployment paths. Internal routes must remain out of the public sitemap and global public assistant.
- Backend services exist for other products, but their schemas and authority must not be assumed for Blocks.

## 3. Gap analysis

The repository has agent routing, business tracking, guided clarity, and client delivery surfaces, but no unified modular-workflow product. Blocks needs:

- a stable product shell and product-specific navigation;
- a catalogue that explains repeatable operating capabilities rather than agents;
- a visible run state with context, ownership, stages, and review gates;
- output and activity records;
- explicit empty, loading, error, and permission patterns;
- a backend contract after the operating model is validated.

## 4. Recommended information architecture

1. Overview - active work, review pressure, recent outputs, and system health.
2. Blocks - searchable catalogue and configuration entry point.
3. Runs - active and historical workflow instances.
4. Context - knowledge sources, scope, and freshness.
5. Reviews - human decisions, evidence, and approval history.
6. Outputs - versioned, exportable results and provenance.
7. Governance - roles, permissions, retention, and integration policy.

The first slice implements Overview, Blocks, Runs, Context, Reviews, and Outputs within one route-level workspace. Governance is represented through visible boundaries and remains a later dedicated screen.

## 5. Core screens and reusable components

- `BlocksShell`: product frame, responsive navigation, workspace identity.
- `StatusPill`: semantic state without relying on color alone.
- `Metric`: operational summary with supporting context.
- `BlockCard`: capability, inputs, outputs, owner, and readiness.
- `RunTimeline`: ordered system, AI-assisted, review, and action stages.
- `ReviewItem`: decision prompt, evidence summary, owner, and due state.
- `ContextSource`: source type, scope, freshness, and availability.
- `OutputRow`: result type, originating run, state, and timestamp.

## 6. Data and state boundaries

- Domain types and demo records live in `website/src/lib/blocks/blocksData.ts`, separate from presentation.
- Local UI state controls navigation, selected block, catalogue filter, and the demo run interaction.
- No repository, client, or third-party data is read or written.
- A future server boundary should expose blocks, runs, run events, reviews, context sources, and outputs through workspace-scoped authorization. Provider calls should sit behind a run executor, not inside components.

## 7. Interaction, workflow, and review model

Canonical lifecycle:

`Draft -> Ready -> Running -> Review required -> Approved -> Completed`

Each run contains ordered stages with one execution mode: `system`, `AI-assisted`, `human review`, or `human action`. Review gates stop downstream action until an authorized person decides. Rejection or revision must preserve the prior output and record a new version.

## 8. Design token strategy

Blocks defines route-scoped semantic aliases over the existing global palette: canvas, surface, raised surface, line, text, muted text, bronze, success, warning, and danger. Spacing uses a 4px base rhythm; radii stay restrained; shadows communicate elevation only. Motion is limited to state transitions and respects `prefers-reduced-motion`.

## 9. Accessibility and responsive requirements

- Semantic navigation, headings, buttons, lists, and live status text.
- Visible `:focus-visible` states and keyboard-operable controls.
- Text/status labels accompany every color state.
- Desktop three-zone shell collapses to a compact top rail and single-column content below 900px.
- Touch targets are at least 44px where controls are primary.
- No essential information depends on hover, animation, or viewport width.

## 10. Implementation phases

### Phase A - Product shell and operating overview (implemented)

Route shell, responsive navigation, overview, typed mock boundary, and semantic tokens.

### Phase B - Catalogue-to-run vertical slice (implemented)

Catalogue filtering, block selection, configuration summary, visible run stages, context, review, and outputs.

### Phase C - Durable domain and authentication

Workspace schema, role policy, persistence, run-event stream, audit history, and error recovery.

### Phase D - Real execution adapters

Provider-neutral executor, context retrieval, tool permissions, cancellation, retries, and usage visibility.

### Phase E - Governance and production hardening

Approval policies, retention, observability, end-to-end tests, security review, and deployment controls.

## 11. Risks, unknowns, and human decisions

- [Decision required] Is Blocks an internal Kramaniti operating product, a client-facing workspace, or both? This changes tenancy and onboarding.
- [Decision required] Which block is the first real executable workflow and what constitutes an approved output?
- [Decision required] Which identity and data boundary should Blocks use: existing Client Hub infrastructure or an isolated schema?
- [Unknown] Provider, model, retrieval, storage, retention, and billing choices.
- [Risk] Studio, HQ, Client Hub, and Blocks can overlap. Blocks should own reusable workflow execution; Studio owns agent routing; HQ owns founder tracking; Client Hub owns client-visible delivery.
- [Risk] A catalogue can become feature theatre. No block should move from `working copy` to `available` until its inputs, output contract, review owner, and failure path are real.

## Execution decomposition

### Unit 1 - Repository and product-boundary audit

- Objective: establish the safe route and reuse boundaries.
- Files/systems: repository rules, decisions, website stack.
- Dependencies: none.
- Acceptance: one-app rule, adjacent-product boundaries, and missing sources recorded.
- Verification: source inspection and clean-worktree check.
- Parallelizable: yes, read-only.

### Unit 2 - Route shell and tokens

- Objective: create the responsive Blocks workspace frame.
- Files/systems: `src/app/blocks/`, route-aware assistant.
- Dependencies: Unit 1.
- Acceptance: semantic navigation, dark-first presentation, mobile adaptation, focus visibility.
- Verification: lint, typecheck, build, viewport QA.
- Parallelizable: no; establishes shared structure.

### Unit 3 - Domain model and catalogue

- Objective: define blocks, runs, sources, reviews, and outputs independently of UI.
- Files/systems: `src/lib/blocks/`, Blocks catalogue components.
- Dependencies: Unit 1.
- Acceptance: typed records, clearly labeled working copy, filter and selection behavior.
- Verification: typecheck and interaction QA.
- Parallelizable: yes after shell contracts are agreed.

### Unit 4 - Run, context, review, and output flow

- Objective: make the operating model visible end to end.
- Files/systems: Blocks client workspace.
- Dependencies: Units 2 and 3.
- Acceptance: stages distinguish execution mode; review is explicit; outputs retain origin/state.
- Verification: keyboard and viewport interaction QA.
- Parallelizable: no; integrates the vertical slice.

### Unit 5 - Production data boundary

- Objective: replace demo records with authenticated persistence and an auditable executor.
- Files/systems: future API routes, database schema, auth and provider adapters.
- Dependencies: founder decisions on tenancy and first executable block.
- Acceptance: workspace isolation, server validation, idempotent run events, versioned reviews, recoverable failures.
- Verification: policy tests, integration tests, failure injection, security review.
- Parallelizable: yes across schema, executor, and test harness after contracts are approved.

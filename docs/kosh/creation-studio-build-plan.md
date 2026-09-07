# Kosh Creation Studio: build specification

Date: 6 September 2026. Version: 1.0.

Status: **Proposed implementation specification, not an implemented product or release authorization.**

Owner: KC. Documentation lead: Documentation Steward. Implementation lead: Website Steward. Supporting responsibilities: Systems Designer (artifact and persistence contracts), Workflow Architect (composition), Agent Operations Architect (portable packages), Brand Identity Agent (visual fidelity), Proof and Governance Auditor (authority and claims). These are responsibilities, not a request to spawn agents.

## 1. How another task must use this document

Read this specification completely before editing. Follow the phases in section 17. Implement a complete skill workflow first, then extend the same system to agents, governance, workflows and plugin packaging. Do not interpret the later phases as permission to build execution infrastructure.

Requirement words: **must** is an acceptance requirement; **proposed default** is an implementation assumption that may proceed in a local prototype; **deferred** is excluded from the initial release. Record material departures in this document rather than silently substituting a different product.

Read the root and relevant local AGENTS.md files, the canonical master context, agent roster, decisions register, website implementation plan, and `docs/kosh/implementation-handoff.md`. Where older handoff text conflicts with a dated later update, preserve the later update and verify current code. Re-check the worktree before starting.

[Fact] KC requested a premium, minimalist, technically rich Kosh platform that creates skills, agents, governance layers and plugin workflows, followed by a detailed plan another task can implement.

[Recommendation] Creation and export come first; connected workflow execution is deferred. KC has not separately selected a runtime strategy. This assumption preserves decisions 32–33, which keep execution outside Kosh and identify Blocks as the execution boundary.

[Recommendation] Initial audience: individual AI practitioners and small teams turning recurring work into reusable systems. Treat this as a validation hypothesis, not established market evidence.

The plan authorizes no database changes, deployment, purchase, external communication or public claim. A future instruction to build this plan can authorize local implementation; release actions follow KC's explicit authorization in that task.

## 2. Product definition and success

**Kosh is a creation studio for reusable AI systems.** Users describe work, create an editable artifact, attach boundaries, test it, revise it and export a version they own.

Proposed product promise: **Turn how you work into systems you can reuse.**

Supporting line: “Create skills, agents and connected workflows, with clear rules and human control.” This describes the target product. Until the corresponding phases work, public copy must name only implemented capabilities.

The core journey is **Describe → Shape → Set boundaries → Try → Refine → Export**. It is one continuous workspace, not six disconnected forms or six permanent panels.

Success means a person can create a useful skill, understand its limits, test it against supplied input, export it, and reuse it in a verified destination. A beautiful generated document alone is insufficient proof.

Validate first with three synthetic tasks: a research brief, a meeting-to-actions method and a content-review skill. Avoid real client data. Evaluate task completion, clarity of boundaries and export usefulness through observed sessions before setting commercial targets. Do not invent success-rate or time-saving claims.

## 3. Current repository baseline

[Fact] Inspected checkout: `main`, commit `4ee52aa`, 6 September 2026. An existing unrelated modification to `website/src/app/library/workspace.module.css` was present and must be preserved. This is a snapshot, not a guarantee for future tasks.

| Existing surface | Implementation | Reuse direction |
| --- | --- | --- |
| Public discovery | `website/src/app/library/LibraryLanding.tsx`, `ResourceCatalogue.tsx`, `ResourceTile.tsx` | Preserve catalogue, filters, resource links and collection discovery |
| Resource reading and adaptation | `website/src/app/library/resources/[id]/page.tsx`, `ResourceWorkbench.tsx` | Keep original reading, manual editing, comparison and source attribution |
| Member workspace | `website/src/app/library/LibraryWorkspace.tsx` | Extend with created systems alongside existing favourites and copies |
| Context and accounts | `KoshAuth.tsx`, account routes, `website/src/lib/kosh/context.ts` | Reuse explicit context choice and account transitions |
| Adaptation endpoint | `website/src/app/api/kosh/adapt/route.ts` | Preserve its behaviour; share safe primitives where appropriate |
| Resource definitions | `website/src/lib/library/libraryData.ts`, `resourceDetails.ts`, `website/src/lib/kosh/resourceContent.ts` | Preserve canonical originals and version provenance |
| Kosh navigation and styling | `KoshNav.tsx`, `editorial.module.css`, `landing.module.css` | Reuse identity and palette, introduce scoped studio styling |

[Fact] The checked code uses Next.js 16.2.6, React 19.2.4, TypeScript, CSS Modules, Supabase and a server-side Groq integration. The existing adaptation route defaults to `openai/gpt-oss-120b` through Groq. KC addressing Astra is not an instruction to replace Kosh's provider or imply Astra API availability.

[Fact] The latest release handoff records that the existing working-copy migration has not been applied. Treat live persistence, quota availability, auth configuration and deployed model behaviour as **unverified until checked**. Earlier local tests do not establish current production functionality.

Preserve public reading, original downloads, guest manual editing, saved-copy provenance and explicit selection of personal/professional/custom context. Never silently replace public templates or migrate user copies into a new format.

## 4. Scope by release

| Release | Required capability | Explicit exclusions |
| --- | --- | --- |
| R1: Skill studio | Blank/template entry, structured skill editing, attached governance, AI draft/refinement, manual sample testing, optional model preview, revision saving, neutral package export | Autonomous tools, live integrations, marketplace, teams, billing, plugin installation |
| R2: Composition | Agent definitions, reusable governance artifacts, ordered workflow definitions, pinned dependencies, portable system package | Scheduled runs, live external actions, graphical execution engine |
| R3: Destination packages | One verified destination adapter, plugin package construction for that destination, package validation and installation documentation | Universal compatibility, auto-installation, unverified badges |
| Later, separately scoped | Blocks handoff or another approved runtime, enforced permission gates, live connectors, team review and permissions | Must not be smuggled into R1–R3 |

All five artifact types belong to the long-term platform. R1 must finish before broadening the visible creation options. Do not show inactive choices that pretend to work. A prototype may demonstrate later concepts only with explicit sample labels.

## 5. Information architecture and routes

Keep existing `/library` URLs; no domain migration or unrelated homepage redesign.

| Route | Behaviour |
| --- | --- |
| `/library` | Existing public discovery; add a restrained Create entry once R1 is functional |
| `/library/create` | New creation arrival; guest manual drafting permitted |
| `/library/create?source=<resource-id>` | Validate source against public resource registry; start a separate skill draft with source/version reference |
| `/library/studio/<artifact-id>` | Owner-only saved artifact; noindex; fetch only through authenticated ownership checks |
| `/library/workspace` | My work: created systems, existing working copies, favourites and context settings |
| Existing resource, collection, standards and account routes | Preserve routes and behaviour |

Proposed Kosh navigation: **Create · Library · My work**. Collections stay discoverable within Library. Preserve a route to the wider Kramaniti site through the brand/navigation context. Product navigation changes must not alter the marketing site's Workflow Audit priority.

Guest drafts live in memory, not a public URL or durable browser storage. Saving or AI use requests sign-in inline. Preserve the draft through an in-page sign-in. If authentication requires a full reload or external redirect, offer download/copy before leaving and clearly explain that unsaved content may be lost. Never promise persistence the implementation cannot provide.

## 6. Visual specification

Use the current Kosh identity and the square-first design decision. The proposed dark studio tokens inherit the existing values:

| Token | Value / requirement |
| --- | --- |
| Canvas | `#0e0e10` |
| Surface | `#171719` |
| Primary text | `#f1eee7` |
| Secondary text | `#aaa69f` |
| Hairline | `rgba(241, 238, 231, 0.16)` |
| Accent | `#d3b65d`; use for current focus and primary action, not body copy everywhere |
| Geometry | 8px maximum common control radius; square connectors; no decorative orbit/dot system |
| Typography | Reuse loaded site fonts; body 16px / 1.6; metadata at least 12px; monospace only for file names and technical values |
| Spacing | 4, 8, 12, 16, 24, 32, 48, 64px scale |
| Motion | 160–220ms for control transitions; 240–320ms for panel transitions; reduced-motion removes spatial transitions |

These tokens are proposed implementation defaults, not a new independent brand system. Preserve usable light-theme behaviour with the existing light token equivalents. Verify contrast rather than assuming colours pass.

Desktop ≥1200px: maximum work area 1280px; 32px outer gutters; 64px header; artifact reading column around 760–840px. An optional right inspector is 320px, separated by a line, and closed initially. At 768–1199px the inspector overlays rather than squeezing the editor. Below 768px use one column, 16px gutters, compact navigation and a full-width details sheet. At 320px every action must remain reachable without horizontal page scrolling.

Avoid persistent dashboard cards, activity charts, model pickers, left-side tool catalogues and giant chat transcripts. Files and technical detail belong in contextual inspectors. Use text labels beside state indicators; colour alone is insufficient. No perpetual animations or animated backgrounds in the editor.

The artifact must visually dominate the session. The user should see the thing being made before the conversation used to make it.

## 7. Screen and interaction specification

### A. Arrival

Headline: **What would you like to make repeatable?**

One generous labelled input, placeholder “Describe the work and the result you want.” Primary action **Shape my skill**. Secondary action **Start with a blank skill**. Three text examples use the synthetic tasks from section 2. Example activation fills the input; it does not submit or consume model quota.

Display a small recent-work list only for signed-in users with saved artifacts. Public Library remains one click away. R1 has no artifact-type chooser because only skills can be created end to end.

### B. Studio

Header: editable title, artifact type, saved/unsaved status, **Save version**, **Export**. Use a clear status such as “Unsaved changes” or “Saved as v3”; never show Saved before server acknowledgement.

Below: compact navigation **Build · Boundaries · Test**. These change the central work view while retaining the same artifact and dirty state. They are not a mandatory wizard. Export is an action with a preview, not a fourth permanently visible panel.

Build opens with editable sections: Purpose; Use when; Inputs; Method; Output; Quality checks; Limitations. Use a readable document layout with section-level edit controls, not a wall of small form cards. Advanced file/schema inspection is optional.

A modest “Ask for a change” composer sits below the active content. It is supplementary: all core fields are manually editable. Suggested requests are relevant to the current section. No conversation is required for renaming, editing boundaries or saving.

Generated content arrives as a candidate. Show **Review changes**, **Apply**, **Discard**. The user can continue editing their artifact while a request runs; a candidate tied to an older revision cannot silently overwrite newer edits. Applying a candidate changes the draft only. Saving remains explicit.

### C. Boundaries

Show allowed inputs/sources, permitted actions, prohibited actions, approval-required actions, missing-information behaviour and escalation owner. Empty approver remains an unresolved field, never an invented person.

Default R1 rules: use only supplied context; draft only; no external tool calls; do not invent evidence; stop or ask when required information is missing; consequential external actions require human approval in the destination runtime.

For each rule show a truthful status: **Instruction only**, **Checked in sample**, or **Enforced by runtime**. R1 cannot claim the final status for exported rules. Model compliance in one sample never promotes a rule to runtime enforcement.

Kosh's own server-enforced restrictions, such as having no tool executor, must be described separately from the authority of an exported artifact.

### D. Test

Each test has a name, sample input, expected characteristics and disallowed behaviour. Offer **Check structure**, **Review sample manually**, and, when configured, **Generate sample output**.

Check structure is deterministic and free of model calls. Manual review allows the user to paste an output and record pass/fail/needs review against a checklist. Model preview invokes only the model with supplied sample data; it cannot fetch URLs, send messages, run code or install packages.

Display input, output, deterministic findings and human assessment separately. A model assessment is labelled as such and cannot turn into a human approval. Missing credentials/quota produces “Sample generation unavailable” while manual testing remains available.

Any content edit invalidates current readiness results. Historical results remain tied to the exact content digest and test-input digest that produced them.

### E. Export review

Show version, file list, destination, unresolved fields, checks performed and limitations before download. R1 destination is **Portable Kosh package**. It is a neutral format, not a tested host integration.

Allow **Download draft** with an explicit draft status even when checks are incomplete. Offer **Download reviewed version** only when required structure passes, at least one sample has a human assessment, and the user acknowledges the remaining limitations for that exact version. Do not call the artifact production-ready or safe merely because it was reviewed.

Unsafe paths, invalid package structure or secrets detected by checks block package export until corrected; pattern checks do not guarantee absence of secrets. Offer safe text recovery if a technical packaging failure prevents download.

### F. My work

Use compact rows: title, type, last saved time, latest version, review state. Search by title; filter by implemented type. Open, duplicate, rename and delete are available. Delete requires a confirmation naming the artifact; preserve an export opportunity. Do not add team settings or collaboration roles in R1.

Keep favourites and legacy working copies distinct from created systems. Reuse existing context settings. No automatic conversion of old saved copies; a future explicit “Create a skill from this” action must create a new artifact with provenance.

## 8. State and failure requirements

Treat editing, generation, persistence and review as separate state dimensions, not one overloaded status.

- Editing: clean / dirty. Generation: idle / pending / candidate / failed / cancelled locally. Persistence: unsaved / saving / saved / conflict / failed. Review: not checked / needs review / reviewed for digest.
- Save failure retains the full draft and offers retry/export. Two-tab updates use optimistic concurrency: a stale expected version returns a conflict, with compare and save-as-copy paths.
- Session expiration preserves the visible draft, blocks remote actions and offers reauthentication. Sign-out/account switch clears private data and candidates after an unsaved-change prompt.
- Cancel ends browser waiting and suppresses late candidate application. Tell users a dispatched model attempt may still count. Never pretend provider cancellation was guaranteed.
- Navigation warns only when unsaved work exists. Refresh must not falsely claim memory-only drafts survive.
- Missing source or deleted private artifact receives a useful not-found/access-unavailable state without leaking another owner's title.
- Every loading state is announced accessibly. Focus moves to the relevant error summary, comparison or dialog and returns to its trigger on close.
- No raw HTML rendering from model output; reject unsafe links and unsupported markup. Imported content is data, never trusted control instructions.

## 9. Artifact contract

Use one versioned domain schema with a discriminated `kind`. Do not make arbitrary Markdown the only source of truth. Render structured fields to editable sections and deterministic export files. R1 can offer a read-only raw representation; unrestricted raw editing is deferred until lossless parsing exists.

Common fields:

| Field | Contract |
| --- | --- |
| `schemaVersion` | Integer, initially 1; separate from artifact revision |
| `id`, `ownerId` | Server-generated identity and authenticated owner; never trust a supplied owner |
| `kind` | `skill`, later `agent`, `governance`, `workflow`, `plugin` |
| `title`, `slug`, `summary` | Title 1–100 chars; summary ≤500; slug validated for export path safety |
| `content` | Validated kind-specific data; proposed total serialized maximum 64KB |
| `governance` | Structured rules plus explicit limits on enforcement claims |
| `source` | Optional public resource id/version or parent artifact id/revision; no copy of unrelated private context |
| `dependencies` | Exact artifact id/revision/digest references, never floating latest |
| `revision`, `contentDigest` | Monotonic server revision and canonical content digest |
| `createdAt`, `updatedAt` | Server timestamps |

Skill content: purpose, use-when, input definitions (name/type/required/description), ordered steps with stable ids, output specification, quality checks, limitations. Example/test data is separate from operational instructions so illustrative facts do not become assertions.

R2 additions: agent content has role, objective, pinned skills, declared tools and handoff rules; governance content has reusable rules and escalation; workflow content has inputs, ordered typed steps, dependencies, human review steps and outputs. R2 workflows are acyclic; reject missing references and cycles. Plugin content is a package manifest referencing exact artifacts and a destination adapter identifier. Declared tools do not mean installed or authenticated tools.

For composed governance, start with deny overriding allow, approval overriding unsupervised action, and unresolved conflicts blocking reviewed export. Child artifacts cannot silently weaken parent restrictions. Show conflicts for human resolution. These are authoring/validation semantics until a verified runtime implements them.

## 10. Persistence and privacy design

[Recommendation] Add Kosh-owned artifact tables rather than changing legacy working-copy rows in place. Proposed logical tables: `artifacts` (identity, owner, latest revision), `artifact_versions` (immutable content snapshots and digest), and `artifact_test_results` (version-bound user-selected test evidence). Final SQL is an implementation deliverable, not supplied or authorized here.

Save must atomically validate ownership, expected latest revision, create a new version and update the artifact pointer. Metadata changes that affect exports create a version. Restore creates a new version from a historical snapshot; it never rewrites history. Delete removes the artifact and its dependent private versions/results, with owned-reference checks and an explicit user confirmation.

Tests remain ephemeral by default. **Save test evidence** is a separate explicit action explaining that sample input and output will be stored privately. Saved evidence must match a persisted version/digest. Removing saved evidence withdraws associated current review proof. Model context is not retained merely because it was sent for a draft.

Owner isolation applies to every private table and every route. Enable RLS on exposed tables; use both row access and ownership-preserving write checks. A child result/version must belong to an artifact owned by the same authenticated user. Database privileges and schema exposure require verification separately from policies.

Kosh project: `sqrhwxjgyuqmjsclgmvt`. Platform project: `bpvbnxqtfwrsmrpvcepc`. Verify destination live before any authorized mutation. Never put Kosh migrations into the Platform `supabase/migrations/` stream. Use an isolated Kosh migration workflow under `docs/kosh/migrations/`, following current CLI guidance and existing handoff conventions without linking or resetting Platform.

Before implementation, read current Supabase changelog/docs and the Supabase skill. Test local schema changes with synthetic users; remote changes require applicable authorization. No new service-role credentials are required in the browser. Do not print secrets. Do not weaken email confirmation or auth policy to make a test pass.

Do not claim a version-history feature is immutable against the owner if direct database grants allow version updates. Enforce snapshot creation/update rules through appropriate policies and transaction entry points, then test direct API attempts as well as UI behaviour.

## 11. AI service contracts

Retain the existing provider until a separately justified change is approved. Build a small server-side adapter for generation, refinement and sample preview. No exposed model picker, arbitrary provider endpoint or client-supplied model name.

Proposed routes, all under `/api/kosh/studio/`:

| Route/action | Input | Output |
| --- | --- | --- |
| `generate` POST | Intent ≤4000 chars, supported kind, optional validated source id, explicit context selection | Validated candidate artifact, unresolved fields, request id |
| `refine` POST | Draft content within size cap, base digest, instruction ≤2000 chars, explicit context choice | Candidate content tied to base digest and readable differences |
| `preview` POST | Validated draft/digest, sample input ≤8000 chars | Output, validation observations, runtime label, request id |
| `artifacts` POST / GET | Create snapshot / list own artifact summaries | Saved identity/version / owner-scoped summaries |
| `artifacts/<id>` GET / DELETE | Owner-authenticated identity | Own artifact / confirmed deletion |
| `artifacts/<id>/versions` POST / GET | Content and expected revision / own identity | Atomic new version / own version history |

These are proposed application contracts, not existing endpoints. Validate requests server-side. Use the verified authenticated user, not a client owner field. Bound outputs and provider timeout; proposed timeout 45 seconds. Reject truncated, malformed or structurally invalid responses without applying partial content. Return readable 400/401/404/409/413/429/503/504 states as appropriate; logs must omit prompt/context/output by default.

Context options: None, Personal, Professional, Custom. Select one explicitly; never merge profiles. Display which context will be sent before a model request. Source instructions and user context remain untrusted data inside the request. The model cannot grant itself permissions, mark human approval complete or change the schema.

Quota: proposed shared budget of ten model attempts per user per UTC day across legacy adaptation and new studio operations. Verify the existing quota implementation before extending it; do not create separate per-route limits that multiply the budget. Consume atomically before dispatch; a dispatched failed attempt counts. An idempotency key prevents duplicate dispatch/charging for the same request and binds to its body digest. No silent retries. Fail closed if shared quota storage is unavailable; manual editing and deterministic export remain available.

Persist only minimal operational request status for deduplication and abuse control; do not persist generated content without explicit Save. An in-flight duplicate returns pending; a completed duplicate without an ephemeral result available must not dispatch again automatically. Explain the state and require a deliberate new attempt. Specify expiry/retention during implementation and test it.

## 12. Export contract and destination compatibility

R1 package layout (proposed neutral Kosh format):

```text
<safe-slug>/
  kosh.json
  README.md
  skill.md
  governance.md
  tests/examples.json
  checks.json
```

`kosh.json` includes schema version, artifact kind, exported revision/digest, source attribution and dependency manifest. `README.md` explains use, inputs, review status and limitations. `skill.md` contains working instructions only. `governance.md` distinguishes author intent from runtime enforcement. `checks.json` records exact-version structural checks and any human review, never fabricated test results.

Sample data is excluded by default. Include `tests/examples.json` only when the user explicitly selects **Include sample data** after reviewing it. No private profile/context text, owner UUID, credentials, provider keys or conversation history is exported implicitly. Inspect the package bytes in tests.

Neutral export must be deterministic for the same snapshot/options except explicitly documented packaging timestamps. Paths must reject traversal, absolute paths and unsafe names. Render Markdown with stable section order. Provide a ZIP plus individual Markdown download/copy recovery. Use a maintained ZIP implementation only if needed and inspect existing dependencies first.

R3 selects one host after reviewing current official host documentation and user priorities. Implement a destination adapter with supported kinds, manifest/schema rules, file layout, validation, limitations and verification evidence. A generic `skill.md` must not be presented as an installable host-specific skill. Do not invent a universal plugin manifest or assume agent/governance files behave identically across hosts.

A compatibility label names the destination, tested version/date and what was exercised: package import, discovery, sample run. Export validation alone is not execution testing. Installation remains user-directed; scripts and connectors are excluded from R1 packages and separately reviewed before later inclusion.

## 13. Composition in R2 and R3

Add new types through the common studio only when their full create/edit/validate/export path exists. An agent lets the user select pinned skills and define responsibility; a workflow presents a readable ordered sequence, not a node canvas. Each step opens its inputs, outputs, dependencies and review rule contextually.

Dependency updates are proposed changes with a diff; never auto-upgrade saved systems. Referenced private artifacts must be owned by the user. Export resolves a complete dependency closure, detects cycles/missing versions and strips private metadata. Deleting a referenced artifact must identify the impact and block breaking references unless the user explicitly resolves them; do not silently substitute latest content.

Plugin authoring packages supported artifacts using the selected adapter. Show required tools, configuration placeholders and destination limitations. No credentials in the package and no simulated “Connected” or “Installed” states.

## 14. Suggested code boundaries

Preserve the existing Next.js app and CSS Modules. Read local Next documentation before choosing current routing/auth/cache APIs. Avoid a separate app or broad framework rewrite.

```text
website/src/app/library/create/page.tsx
website/src/app/library/studio/[id]/page.tsx
website/src/components/kosh/studio/
  CreationEntry.tsx
  StudioShell.tsx
  ArtifactEditor.tsx
  BoundariesEditor.tsx
  TestWorkbench.tsx
  CandidateReview.tsx
  ExportReview.tsx
  VersionHistory.tsx
  studio.module.css
website/src/lib/kosh/studio/
  schema.ts
  validation.ts
  state.ts
  governance.ts
  export.ts
  server/                 # provider, quota and persistence; server-only
website/src/app/api/kosh/studio/...
website/tests/kosh-studio*.test.mjs
```

File names may be adjusted for local conventions; responsibilities and contracts must remain. Extract shared auth/context primitives only where verified behaviour can be retained. Avoid a monolithic component that mixes provider calls, domain validation, ZIP creation and rendering.

## 15. Acceptance scenarios

| ID | Scenario | Required evidence |
| --- | --- | --- |
| A1 | Guest starts blank and edits every required section | No account needed for manual work; unsaved warning works |
| A2 | Existing resource becomes a skill | Separate draft; exact source/version retained; example facts excluded |
| A3 | AI request has no selected profile | No hidden personal/professional context sent |
| A4 | Candidate arrives after user edits | No overwrite; comparison reports stale base and offers deliberate resolution |
| A5 | Save and reopen | Exact snapshot restored; server version shown only after success |
| A6 | Two sessions edit same artifact | Stale save returns conflict; neither silently loses content |
| A7 | Two users and anonymous requests | Cross-user artifact/version/result read/write/delete denied; owner reassignment denied |
| A8 | Structure/sample checks then edit | Current results become stale; historical evidence remains version-bound |
| A9 | Model fails, times out or truncates | Draft retained; no partial apply; readable retry/quota state |
| A10 | Concurrent requests and duplicate request id | Shared limit enforced; one dispatch per id/body; no cross-route budget multiplication |
| A11 | Sign-out, account switch and recovery | Private state cleared correctly; no old-owner data visible; unsaved handling honest |
| A12 | Export with/without samples | Exact file bytes checked; no hidden profile data; downloaded ZIP opens |
| A13 | Export draft versus reviewed | Accurate status; reviewed label tied to exact digest and required review evidence |
| A14 | Unknown/private URL | No private title disclosure; useful access state |
| A15 | Keyboard, zoom and mobile | Complete create/edit/test/export path at 320/390/768/1440px, 200% zoom and reduced motion |
| A16 | Existing library regression | Search/filter, reading, original downloads, favourites, working copies and context choice retained |
| A17 | R2 dependency and governance conflicts | Cycles, missing versions and weakening rules detected; pinned versions stable |
| A18 | R3 destination | Package actually imported and exercised in declared destination; evidence and limitations recorded |

Test meaningful domain boundaries and user outcomes, not CSS implementation details. Use synthetic data for adversarial context instructions, missing facts and approval bypass attempts. Distinguish deterministic checks, mocked provider tests, live model observations and actual destination execution.

## 16. Quality gates

Run repository-required lint, TypeScript and production build checks, plus existing `npm run test:kosh` and added studio domain/route tests. Inspect the package script before relying on its glob; the current `tests/kosh*.test.mjs` pattern can include studio tests. Use a Node runtime supporting the existing experimental module mocks.

Before builds, snapshot generated HQ metadata and unrelated work. Builds invoke `hq:sync`; inspect generated differences and restore only the task's side effects to pre-task bytes, never overwrite another task's work.

Browser QA must include actual rendering, interactive edits, focus/dialog behaviour, mobile overflow, console errors, real downloads and extracted package contents. HTTP 200 and successful builds are not visual QA. Inspect listener ownership and reuse a healthy preview; do not launch duplicate servers. State whether the preview remains open.

Local PostgreSQL or mock tests do not replace live owner-isolation, concurrency, email and provider checks before release. Record unavailable checks as gaps. Do not change production to satisfy a test without authorization.

## 17. Implementation phases and stop conditions

### Phase 0: Verify baseline

Read instructions and source files; inspect status, worktrees, active tasks and existing preview. Confirm the scope does not overlap another active Kosh implementation. Verify current code and documented migration availability without reading private user content. Record the actual starting revision and preserved dirty paths.

Exit: baseline note and bounded file plan. If another task owns overlapping edits, reuse or coordinate with it; do not create a duplicate implementation.

### Phase 1: Complete local manual skill slice

Build schema, deterministic validation/export, arrival, studio sections, boundary editing, manual tests, candidate-comparison fixture and export review. Use clearly labelled synthetic fixtures for design review. No fake saved state or simulated live model success.

Exit: a guest can manually create and download a valid skill package on desktop and mobile; A1/A2/A8/A12/A13/A15 pass where applicable. Show KC the actual rendered route for visual review before applying a broad catalogue/navigation redesign. Review is a concrete checkpoint, not permission needed for every component edit.

### Phase 2: Private persistence

Prepare isolated Kosh schema changes, atomic versioning, owner policies and conflict handling. Wire authenticated save/reopen/history/duplicate/delete. Preserve legacy copies. Test locally with synthetic accounts; leave remote migration reviewable if not authorized.

Exit: local persistence and isolation evidence for A5/A6/A7/A11/A14. Hosted unavailable dependencies are explicitly reported; missing storage must not produce fake success.

### Phase 3: AI drafting and sample preview

Implement provider adapter, validation, context selection, shared quota/idempotency, candidates and stale-result handling. Start with non-streaming complete candidates to reduce partial-application risk. Run mocked route tests, then authorized/configured live checks with synthetic inputs.

Exit: A3/A4/A9/A10 pass; at least one real generation/refinement/sample run observed before claiming live AI functionality. Missing provider access does not block shipping a clearly described manual prototype, but it blocks declaring R1 complete.

### Phase 4: R1 integration and release preparation

Add Create entry, My work integration, accessibility polish and package verification. Run the complete R1 acceptance suite and legacy regressions. Prepare review screenshots, migration diff, changed-file list and release checklist.

Exit: no unresolved R1 acceptance failures; remaining external approvals/configuration explicitly identified. Commit/push/deploy only with applicable KC authorization. Verify the deployed revision and full flow after any authorized release.

### Phase 5: R2 composition

Extend schema and studio for agent/governance/workflow authoring, dependency pinning, conflict validation and complete neutral system export. Preserve R1 skill behaviour.

Exit: A17 and prior regressions pass; a sample multi-artifact system exports with resolved dependencies and honest instruction-only rules.

### Phase 6: R3 plugin and destination adapter

Select and document one destination using current official docs. Implement packaging, validation and setup guidance; test actual import and sample usage.

Exit: A18 passes. Only then expose installable-plugin or tested-destination claims. Live execution and Blocks integration require a separate scope decision.

## 18. Decision and release discipline

This specification is a proposed extension of the current library. Do not mark it as an accepted strategic decision merely because the document exists. When KC authorizes implementation or accepts the direction, append a dated entry to `09_reviews/decisions.md` describing the creation-studio scope while preserving the execution boundary. Link this plan and the implementation evidence.

Settled defaults for local work: existing app, existing routes, skill-first release, manual editing, explicit saving, neutral export, no tool execution, owner-only data, existing provider. Open product choices: first verified destination, commercial terms, team collaboration and any future execution model. Do not block the neutral manual prototype on those choices.

Every phase handoff must include: completed scope; exact revision and dirty files; actual preview route and server status; validation results; unavailable checks; migrations applied or only prepared; next phase; external actions still requiring authorization. Never describe planned capabilities as live.

## 19. Copyable implementation-task prompt

```text
KC wants the Kosh Creation Studio implemented from:
docs/kosh/creation-studio-build-plan.md

Read the entire specification and applicable AGENTS.md files before editing.
Treat the specification as the implementation contract. Start with Phase 0,
then complete the Phase 1 manual skill slice locally and make it visible for
review. Preserve existing Kosh public resources, private-copy behaviour,
unrelated dirty files and the Kosh/Platform isolation boundary.

Build the actual artifact-first Create → Build → Boundaries → Test → Export
experience. Do not substitute a generic chat interface or dashboard. Use
the specified Kosh visual tokens and responsive behaviour. Keep every core
skill field manually editable and implement a real inspectable export.

Creation/export first is the planning assumption. Do not build live workflow
execution or imply exported governance is runtime enforcement. Later phases
cover persistence, AI and composition; do not declare them complete through
fixtures. Continue useful local work when remote configuration is unavailable
and report that limitation accurately.

Use the smallest execution shape. Do not spawn agents unless explicitly
authorized by KC or applicable instructions. Do not commit, push, deploy,
apply remote migrations or purchase services without applicable authorization.

Finish with a working local preview, meaningful acceptance evidence, exact
changed paths and a phase handoff. Record any material deviation from the
specification and why it was necessary.
```


## Founder direction extension, 2026-09-06

KC's later request for premium, connected navigation and an interactive-world experience supersedes the original Phase 1 visual hold on adjoining library navigation. The local implementation includes a shared Explore/Create/My work frame, open resource paths, subtle interruptible transitions, preserved discovery position and tab-memory draft continuity. Manual editing and actual export remain functional. This does not advance private Studio saving or model assistance to completed status; those retain their original acceptance requirements. See `creation-studio-handoff.md` for verified scope and test limits.

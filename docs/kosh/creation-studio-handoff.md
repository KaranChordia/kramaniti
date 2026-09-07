# Creation Studio implementation evidence

Date: 2026-09-06. Local work only.

## Phase 0

[Fact] Starting revision: `4ee52aa4035a8b29901d70423b2fe468a982e006`, detached isolated worktree `/Users/karanchordia/.codex/worktrees/b773/kramaniti`. Initial status and diff check clean. Copied the requested build plan from the primary checkout. Primary `website/src/app/library/workspace.module.css` is outside this task and remains untouched.

[Fact] The active primary task is Design premium Kosh platform, coordinating this implementation. Other Kosh tasks were not active. Port 3000 belongs to the primary checkout; this task uses port 3001. No remote database or user content was inspected.

[Fact] Website Steward leads; Systems Designer, Workflow Architect, Agent Operations Architect, Brand Identity Agent, Proof and Governance Auditor responsibilities are fulfilled within this task. No agents spawned.

[Recommendation] Bounded file plan: new `/library/create` route, isolated components and domain modules under `kosh/studio`, domain and browser evidence, Kosh-only persistence preparation after the manual milestone. The original Phase 1 navigation hold was superseded by KC's subsequent interactive-world direction; see the extension below. No execution infrastructure.

## Phase 1: manual milestone

[Fact] `/library/create` now supports guest description/blank entry, structured skill editing, ordered steps and inputs, instruction-only boundaries, manual sample review, deterministic validation, labelled synthetic candidate comparison, and actual ZIP export. All drafts and samples remain in tab memory. Save/AI availability is honest. Source query parameters resolve only public registry entries and retain version 1.1; working instructions exclude demonstration facts.

[Fact] Lint, TypeScript, production build and 23 existing/new domain and mocked route tests passed. `docs/kosh/evidence/browser-results.json` records the completed Chrome acceptance path. Actual downloaded ZIPs were extracted and checked: five default files; six when samples were explicitly included; review/content digests matched and samples were absent by default. Missing structure permits draft export, not reviewed export. Credential patterns and unsafe paths block downloads.

[Fact] Browser checks exercised manual edits, title focus, ordered steps, tab scroll restoration, keyboard tabs, Escape/focus return, unsaved refresh cancellation, unavailable saving, exact-content review invalidation, stale synthetic candidate blocking, source provenance and unknown-source handling. Inspected desktop and 390/320px screenshots. Layout checks covered 1440/768/390/320 widths, light theme and reduced motion. No browser errors in the completed pass. This is Chromium evidence, not Safari or assistive-technology certification.

[Fact] An initial screenshot operation hid the textarea caret before hydration and caused a test-induced hydration warning. Screenshots now preserve the caret; the complete rerun had no browser errors. A separate active-tab visual lag was identified: the shared border-color transition left the previous tab underline visible briefly while content had already switched. Chapter markers now update immediately. Rapid-switch, reduced-motion and no-native-transition checks pass. Interrupted native transitions also handle the expected rejected ready promise without browser errors.

[Unverified] Live persistence, authenticated ownership/concurrency, model calls, real mobile keyboards and actual browser-menu 200% zoom remain outside this first completed browser pass. No runtime or destination integration is claimed. The local catalogue/navigation extension below is implemented for review.

[Fact] Preview remains open at `http://127.0.0.1:3001/library/create`. The port 3000 primary-checkout preview remains separate. No commit, push, deployment or remote migration was performed.

## Independent R1 preparation after the visual checkpoint

[Fact] Phase 2 is partially prepared, not complete: Kosh-only artifact/version/evidence tables, owner RLS, read-only client grants and narrow transactional RPCs. Atomic version save locks the artifact, checks the expected revision and appends an immutable snapshot. Restore uses the same append path. Owner-confirmed delete checks the expected revision. Evidence requires a matching saved content digest and records its own sample digest; withdrawal deletes evidence instead of rewriting it.

[Fact] The CLI-generated migration is `docs/kosh/migrations/20260906152335_creation_studio.sql`. It was executed and re-executed in isolated PGlite with synthetic users. `evidence/database-results.json` records passing owner isolation, direct version mutation denial, owner reassignment denial, conflict/restore, digest, evidence withdrawal and deletion checks. No remote database was touched. This is not live PostgREST or a multiple-connection concurrency test.

[Fact] Authenticated API preparation covers create/list/read/version-list/version-save/delete. Requests use the authenticated owner; strict schema parsing rejects hidden metadata; byte limits apply to streamed bodies. The server refuses a configured Platform destination. Missing configuration/storage returns a non-success state and never reports Saved. Route tests mock storage and do not establish hosted functionality. The browser still truthfully presents this as a manual milestone; authenticated save/history/account-switch UI is not yet integrated.

[Fact] Current Supabase changelog and RLS/function documentation were checked. The April 2026 change to automatic Data API exposure reinforces explicit grants; this migration grants only client reads, with writes restricted to owner-checked transaction helpers. Sources: https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically, https://supabase.com/docs/guides/database/postgres/row-level-security, https://supabase.com/docs/guides/database/functions.

## Connected Kosh experience: founder direction extension

[Fact] KC subsequently asked for navigation beyond a conventional template, premium transitions, and an interactive-world experience. This supersedes the original Phase 1 hold on adjoining navigation. The bounded local scope is Explore → resource → Create → return, with My work retained as the existing member destination. Backend expansion was paused.

[Fact] Explore now opens with three connected destinations and a spacious resource list. A persistent Kosh header joins the library, resource, collection, Create, account and workspace routes. Search, format and compact mode are represented in the discovery URL. Returning to Explore restores filters and scroll position. The source's public ID and version follow it into a separate editable skill.

[Fact] Create presents a connected chapter path: Shape the method, Set its boundaries, Try it out. Description-to-purpose movement and chapter changes use short, interruptible native transitions where available; route arrivals use a restrained CSS transition. Reduced-motion mode removes these movements. Normal scrolling, links, URLs, browser back/forward and keyboard navigation remain available. No 3D runtime, sound or perpetual animation was added.

[Fact] Manual drafts, sample assessments and local request notes persist in the shared library layout's memory across in-Kosh navigation. They are not saved to a database or browser storage. Leaving Kosh or refreshing after creating a draft is guarded; export remains the recovery mechanism. Authenticated Studio saving, account-switch isolation and session-expiry integration are not complete and remain release gates.

### Final verification and evidence

- `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run test:kosh`: passing; 23 domain and mocked API checks.
- `evidence/browser-results.json`: manual desktop editing, field selection and scroll restoration, real ZIP contents, exact-review invalidation, stale candidate rejection, dialog focus, 1440/768/390/320 layouts, light theme, keyboard and reduced motion.
- `evidence/continuity-results.json`: full 390/320 touch-emulated blank-to-reviewed-export journeys, add/remove focus, interrupted transitions, no-native-transition fallback, custom-context exclusion, and 200% CSS zoom reflow.
- `evidence/world-results.json`: 1440/390/320 discovery → original download → source-backed manual draft → real ZIP → restored discovery; native back/forward, My work/Create continuity and cancelled departure from Explore with an unsaved draft.
- All completed browser passes report no console or page errors. An interrupted-transition rejection was found and fixed before the final continuity pass.
- Actual downloaded Markdown and ZIP evidence is in `evidence/`. `world-arrival-*`, `world-collection-*`, `world-created-*` and Studio screenshots were visually inspected. Mobile arrival captures are viewport images because global offscreen containment intentionally postpones painting distant sections.

[Unverified] These are local Chrome/Chromium tests with synthetic content. Safari, hardware mobile keyboards, screen-reader testing and actual browser-menu zoom have not been tested. CSS zoom is not equivalent to browser-menu zoom. Live model calls, hosted persistence, live PostgREST ownership and multi-connection races remain unverified. No full R1 completion is claimed.

[Fact] Review entry: `http://127.0.0.1:3001/library`; direct Studio: `http://127.0.0.1:3001/library/create`. The worktree preview remains open. Build-generated HQ metadata was restored to its pre-task bytes. Public Markdown originals, the primary checkout and its separate port 3000 preview remain outside the change. No commit, push, deployment or remote migration was performed.

### Changed file map

- `website/src/components/kosh/world/`: shared navigation, route arrival styles, discovery return state, tab-memory draft continuity.
- `website/src/app/library/LibraryLanding.tsx`, `ResourceCatalogue.tsx`, `page.tsx`, `layout.tsx`: connected arrival and URL-backed discovery.
- Library resource, collection, standards, account and workspace pages: shared navigation adoption; source-to-Create link on resource pages.
- `website/src/app/library/create/`, `website/src/components/kosh/studio/`, `website/src/lib/kosh/studio/`: manual Studio, schema/validation/export and isolated persistence preparation.
- `website/src/app/api/kosh/studio/`, `docs/kosh/migrations/20260906152335_creation_studio.sql`: unapplied private persistence preparation.
- `website/tests/kosh-studio*`, `website/tests/kosh-world-browser.mjs`: local acceptance and domain/API/database checks.
- `website/package.json`, lockfile and `tsconfig.json`: ZIP dependency and TypeScript test imports.
- `docs/kosh/creation-studio-build-plan.md`, this handoff, evidence and `09_reviews/decisions.md`: scope and verification record.

## Subsequent focused resource extension

[Fact] On 2026-09-07, KC asked for greater spatial awareness and focused movement inside opened templates. All six resources now use the five-place resource space described in `resource-space-handoff.md`. The existing Explore → resource → Create journey was reverified. This later extension supersedes the earlier conventional resource reading layout; its test suite brings the domain/API total to 24.

## Publication authorization

[Fact] KC authorized commit and publication of this task on 2026-09-07. The manual Studio and connected resource experience are released with private Studio saving and AI assistance visibly unavailable. SQL/API preparation is included without applying a remote migration. Earlier local-only statements describe the verification checkpoint, not a continuing approval hold. Release record: `release-20260907.md`.

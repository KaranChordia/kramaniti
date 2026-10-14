# Spasht: phased improvement plan

Date: 2026-10-12. Lead: Website Steward. Supporting responsibility: Documentation Steward. Implemented in one task.

## Objective

[Fact] KC requested renewed work on Spasht, a homepage floating-navigation entry, and phased improvements covering the current experience, onboarding/workspace simplicity, and assistant/project/task capabilities.

[Recommendation] Make the primary journey useful before expanding it: capture an idea, clarify the next move, save a project, take an action, and return with context intact.

## Phase 1: discovery and baseline

[Fact] The shared public header now includes **Spasht**, beside Kosh, linking to `/spasht/`. The mobile menu includes the same destination and closes on selection. Desktop navigation begins at 1024 px to fit the additional link without crowding the audit action.

[Fact] Navigation validation passed lint, TypeScript, production build, and browser checks at 1440, 1024, 820, 390, and 320 px. Each link opened the Spasht entry screen, with no homepage horizontal overflow, navigation/action overlap, or page errors in those checks. Mobile keyboard activation also reached the destination. Publication is pending KC approval.

Initial findings before implementation, from source and the locally rendered anonymous entry:

- [Fact] Entry asks visitors to create an account or sign in. Signup is email first, followed by track selection, username, and password. Track-specific intent drafts already contain example business/idea content.
- [Fact] The sign-in screen has username and password controls, with no password-recovery control in `Spasht.tsx`.
- [Fact] Desktop navigation exposes Path, Context, Community, Loops, Tasks, Assistant, Memory, and Projects. Mobile primary navigation exposes Home, Projects, Loops, Assistant, and More. These are different navigation hierarchies.
- [Fact] Community posts begin with seeded examples. Posting and engagement handlers update local component state; browser-local persistence applies to anonymous sessions. Signed-in sessions clear that local storage. A shared cross-member community feed is not implemented by these handlers.
- [Inference] The number of concepts and the different navigation hierarchies may make the first useful action harder to identify. This needs user validation rather than a blanket removal of features.
- [Unverified] Live account creation/confirmation, recovery, returning-session behavior, cross-device persistence, assistant execution, project/task writes, and user isolation were not tested in this task. Source presence does not establish live reliability.

Phase 1 completion check: establish the signed-in reliability baseline with a controlled account before describing the platform as launch-ready. Use the existing Platform service boundary; inspect current configuration and migrations before any database work. Keep Kosh separate.

## Phase 2: onboarding and workspace simplicity

[Recommendation] Start with one understandable path: describe the idea or current problem, review the system's understanding, then choose the first action. Treat track choice as a light preference rather than requiring users to learn the product architecture first.

Scope:

- Add recovery and clear confirmation/retry states using existing authentication.
- Distinguish example text from user-supplied context; never silently save examples as a member's real situation.
- Align desktop/mobile navigation around the same primary work: home, projects, and assistant, with supporting surfaces available progressively.
- Give empty states one useful action and returning members a direct continuation of their latest work.
- Clearly label local community examples and local-only actions until shared persistence is deliberately implemented.

Acceptance: a new member can create an account, capture their own context, save a first project, and resume it after sign-out/reload; a returning member can identify the next action on desktop and mobile; recovery and failure paths explain what to do without exposing implementation details.

## Phase 3: assistant, projects, and tasks

[Recommendation] Strengthen continuity around a selected project before adding new autonomous behavior.

Scope:

- Make selected project context and the assistant's proposed action explicit.
- Verify create/update/complete operations against real persisted records and surface failed saves accurately.
- Preserve user review for destructive or consequential actions and distinguish suggestions from completed changes.
- Make saved memory inspectable and editable/deletable through the established private workspace boundary.
- Clarify manual, assistant-created, and starter tasks without implying progress that did not happen.

Acceptance: one conversation can produce a reviewed project and tasks, update them correctly, and resume with the same saved context. Tests must cover save failures, stale context, reload/second-session continuity, and user isolation. Community persistence is a separate later slice, after the private core works reliably.

## Implementation and verification — 2026-10-12

[Fact] The three implementation slices are now present locally:

1. **Reliability:** full private-state cleanup on session changes; owner and stale-response checks; confirmed-row task/project/memory saves; refreshed workspace failures block assistant requests; authenticated assistant API reads the owned server snapshot rather than trusting browser-supplied saved records.
2. **Onboarding:** blank intent inputs; optional audience/blocker/outcome; examples shown separately; direct first-context capture; latest-project continuation; the same Home/Projects/Assistant/More hierarchy across desktop/mobile; password recovery, reset and confirmation/resend controls; clearly labelled local community examples; supporting tools available progressively.
3. **Project continuity:** explicit assistant context choice; concrete action previews; saved draft restoration; stale-workspace rejection; immutable approval receipts and a deterministic primary-key claim to prevent duplicate execution across sessions; partial-save reporting; editable memory; task source labels. Saving a reviewed Clarity Brief creates the actions actually shown in that brief. Assistant project creation does not silently add undisclosed starter tasks.

[Fact] KC approved restoration of the existing Kramaniti Platform Supabase project. The connector subsequently reported `ACTIVE_HEALTHY`; all nine Spasht tables were present with RLS enabled. Kosh remained separate.

[Fact] Live database verification used temporary transaction fixtures and rolled them back: own records readable/writeable, other member projects/tasks hidden, foreign project updates denied, foreign task insertion denied, immutable receipt insertion allowed, and duplicate primary-key claims rejected. No test users or records were retained and no schema migration was applied.

[Fact] Controlled browser tests exercise save failure, confirmed task completion/reload, memory editing, draft restoration, stale-draft rejection, one-time approval, restored approval state, real user text in first-project creation, consistent mobile navigation, sign-out cleanup, confirmation/resend controls, and a simulated recovery-link password replacement. Authentication, emails, and model replies are intercepted in these tests; they do not establish delivery or authenticated hosted-provider behavior.

[Fact] Route tests cover missing/invalid sessions, malformed/oversized requests, foreign project identifiers, failed snapshot reads, rejection of forged persisted browser context, revision changes, deterministic claims, and malformed action contracts. Run `npm --prefix website run test:spasht`.

Browser test command: set `CLARITY_PLAYWRIGHT_MODULE` to the available Playwright package path, then run `node website/tests/spasht-browser.mjs`. The default target is `http://127.0.0.1:3000`; all Supabase/model requests are intercepted. Screenshots default to `/tmp/kramaniti-clarity-phases`.

## Earlier handoff — 2026-10-12

[Fact] Final lint, TypeScript, eight route tests, production build (97 generated pages), and the controlled browser suite against the production-mode preview pass. The unauthenticated assistant endpoint returns HTTP 401. The production preview remains running at `http://127.0.0.1:3000/spasht/`.

[Fact] Code remains local and uncommitted. The homepage navigation entry is included. Existing unrelated contact, Clarity Engine, and Kosh edits in this primary checkout were preserved; exclude them from any scoped release. No public deployment or email was sent.

[Unverified] Remaining launch checks: a real member's email confirmation and password-reset delivery/redirect, authenticated hosted assistant/provider behavior, and real browser sessions on two devices. The live database transaction tests and controlled browser fixtures are different evidence boundaries. Do not describe the platform as launch-ready until those checks pass.

[Recommendation] Review the local implementation, then approve a scoped release and validate those hosted flows with an explicitly selected controlled account. Shared community persistence remains a separate later slice; the current examples are honestly labelled.

Canonical references: `website/src/components/layout/Navbar.tsx`, `website/src/components/layout/Navbar.module.css`, `website/src/app/spasht/Spasht.tsx`, `website/src/lib/spasht/`, `website/src/app/api/spasht/assistant/route.ts`, `docs/kramaniti_site_implementation_plan.md` section 10.5, and Decision 20 and the current restoration decision in `09_reviews/decisions.md`.


## UX simplification review — 2026-10-12

[Fact] KC clarified the primary job: **help someone clarify an idea and move a project forward**. This takes priority over community-led discovery in the next simplification pass.

[Fact] The current built interface was reviewed at desktop and mobile widths using controlled account/project fixtures. No live member records were inspected or changed. The review covered Home, the saved brief, Projects, Assistant, More, Tasks, Memory, Loops, and source-backed account creation.

[Inference] Reducing top-level tabs to four has not sufficiently reduced the concepts users must understand. Context, briefs, projects, tasks, memory, loops, tracks, and community still have separate destinations and overlapping controls.

[Fact] A concrete defect was reproduced at 1440 and 390 px: “Continue latest project” opens the Clarity Brief, and “Open approved project” stays on that brief. `openProject()` sets `activeMenu` to `context`, not `projects`, and does not set `selectedProjectId`. Treat project opening as one canonical navigation action in the next implementation.

[Recommendation] Use two primary destinations: **Home** and **Projects**, with one account menu for profile, settings, privacy, and sign-out. The project becomes the main object; the assistant, details, next steps, and review belong to it.

| Current surface | Recommended simpler treatment |
| --- | --- |
| Home | One idea/problem composer, latest-project continuation, compact recent projects. Remove the overview grid and activation/loop/community counters from the normal journey. |
| Projects | A flat, searchable list and one New project action. Clicking a project opens its workspace. Keep existing folders/data; move grouping and archive controls into an optional menu. |
| Assistant | Embed the conversation in the project; use Home for starting a new idea. Project context follows the opened project without a separate context picker. |
| Tasks | Next steps inside the project. Keep a small aggregate view only if real usage demonstrates a cross-project need. |
| Context and Clarity Brief | Project details and a compact editable summary, rather than separate destinations. Save the summary once and continue in the same workspace. |
| Memory | What’s remembered, accessible from the relevant conversation or account privacy controls. Preserve inspection, edit, archive, and deletion. |
| Loops | One optional Review progress action inside the project; remove the five-loop picker and status vocabulary from daily navigation. |
| Spasht community | Keep outside the core navigation while it remains a local demonstration. No user data or existing feature code needs to be deleted to simplify discovery. |
| Path / Founder / Solopreneur tracks | Optional preferences, not required navigation or an onboarding decision. Ask about the actual idea/problem directly. |
| Profile / Settings / More | One account menu. Remove the separate More directory once work-related tools are contextual. |

[Recommendation] Each project workspace should show its name and compact description, one main Conversation area, Next steps, and a secondary Details control. Rename “Project instruction” to “Project details”; make advanced instruction editing optional. Place detailed Clarity Engine work behind a contextual “Build a detailed plan” action, rather than competing Open/Get Clarity toolbar actions.

[Recommendation] Simplify signup to email and password; make username and role preferences optional later. Keep confirmation/recovery clear. Use Save project and Save changes for routine local workspace writes, with a concrete preview; retain explicit confirmation for destructive actions and established consequential boundaries.

[Recommendation] Show save feedback beside the relevant action. Use Retry for a failed operation. Avoid a persistent generic Project loaded/Welcome back/Refresh row on every surface. Move conversation history and deletion to a compact menu; present draft suggestions only when relevant rather than a standing toolbar of commands.

[Recommendation] Implementation order:

1. Fix canonical project opening; replace primary navigation and remove the More directory from the normal journey.
2. Simplify Projects and create the unified project workspace; consolidate context, brief, tasks, assistant and memories without deleting saved data.
3. Simplify account entry and language; validate first-use, returning, failure, keyboard and mobile journeys with the existing reliability tests adapted to the new structure.

[Unverified] This is a recommendation based on code and rendered review, not a usability study with real members. The navigation defect is reproduced; the expected usability benefits should be checked with a first-time user completing one idea-to-project-to-next-step journey.

## Approved simplification implemented — 2026-10-12

[Fact] KC approved the whole direction and requested implementation. The simplified experience is now implemented locally. This replaces the initial Home/Projects/Assistant/More hierarchy described above:

1. **Home:** one idea/problem conversation and a compact recent-project list. Save as a project requests a concrete draft from the user's conversation; the member reviews and saves it before opening the new project. New projects do not silently create folders.
2. **Projects:** a flat searchable list and New project. Opening a project selects its actual ID and restores the same workspace through back/reload. Conversation, Next steps and Details live together; the assistant uses the opened project's context. Checkboxes and one add-step input replace a separate task dashboard. Project summary is editable; assistant instructions, folders and saved plans are optional supporting controls.
3. **Supporting controls:** one account menu for account/preferences, privacy and sign-out. Signup requires email and password; username and focus preferences are optional. Remembered information remains inspectable, editable, archivable and deletable. Review progress and Build a detailed plan are project actions. Community and the old loop/path directories are outside normal navigation; existing feature code and saved records were preserved.

[Fact] Archive/restore changes the project status while preserving related tasks and messages. Archived projects are excluded from the active assistant revision so a restorable archive does not cause every fresh draft to fail its save check.

[Fact] Final verification: lint, TypeScript, ten route tests, production build (97 pages), and the controlled browser journey against the production preview pass. The anonymous assistant endpoint returns HTTP 401. Desktop and 820/747/390/320 px layouts were inspected; responsive checks found no horizontal overflow or browser page errors. The browser suite covers project navigation/back/reload, task-save failure and confirmed persistence, details and memory edits, draft restoration/staleness/unique claims, failed reads blocking model requests, archive/restore, idea-to-reviewed-project, optional folders, private-state cleanup, email/password signup, confirmation retry, and simulated password recovery.

[Fact] Preview: `http://127.0.0.1:3000/spasht/`, production server owned by this task. Code remains local and uncommitted, with no publication. The shared homepage floating-navigation entry is included.

[Unverified] Browser fixtures intercept auth, email, model and data requests. They prove the implemented interaction under controlled success/failure responses, not real email delivery, authenticated hosted provider responses or two-device sessions. Live RLS/claim transaction evidence remains as documented above. A first-time member usability check and those hosted checks remain useful before declaring launch readiness.

[Recommendation] Review the local experience, approve a scoped release, then validate the hosted flows with a selected controlled account. Preserve unrelated dirty checkout work when preparing that release.


## Feature restoration with progressive access — 2026-10-14

[Fact] KC requested all features available before the simplification to return while retaining simplicity. This supersedes the recommendation to hide the older directories. Home and Projects remain the two primary destinations, with Conversation, Next steps and Details in each project. A secondary Tools button restores the earlier capabilities without expanding the primary navigation.

[Fact] Tools groups nine destinations by purpose: Guided path, Clarity brief and all five Progress loops; All tasks, Workspace assistant and Project organiser; Workspace overview, Remembered information and Community examples. Account overview and Account & preferences remain in the account menu. The prior overlapping More renders are separate Tools, overview and organiser screens.

[Fact] Supporting destinations have canonical URLs, native back/reload behaviour and an owned-project anchor. Returning from a tool preserves the project and selected Conversation/Next steps/Details tab. The standalone assistant retains context selection, thread history, behavior preferences and reviewed actions, grouped inside Conversation actions. Existing ownership, save confirmation, stale-draft rejection and duplicate-approval safeguards remain.

[Fact] Review rhythm is now saved in the existing owner-scoped profile assistant_settings JSON. Updating behavior preferences preserves review rhythm and other stored metadata. This is a saved preference; automated email digests are not connected. Community problems/responses remain a session-local example interface, with explicit labels and no shared backend or publication. No migration, provider provisioning or remote database mutation was made for restoration.

[Fact] Verification: lint, TypeScript, 14 Clarity tests, 35 Kosh tests and a production build with 115 generated pages pass. The controlled browser suite covers all nine restored destinations, project/tool reload and return continuity, five-loop selection and project scan, confirmed aggregate task updates, explicit folder creation, organiser selection/reload, community examples, account overview and persisted review rhythm, alongside the earlier private workspace success/failure and auth UI journeys. Desktop and 820/747/390/320 px were checked for overflow and clipped content; screenshots prompted an additional fix for a legacy mobile header selector. Browser auth, data, provider and email responses are fixtures. These checks do not establish hosted authenticated provider behavior or actual email delivery.

[Fact] Release scope is isolated in work/clarity-restoration on codex/clarity-feature-restoration, based on remote main 96432fa. The primary checkout's approved Clarity reliability/simplification work and navigation entry were carried forward; current Kosh navigation and dependency changes were retained. Unrelated Contact, About and other dirty primary work remains in its original checkout.

[Fact] Local review URL remains http://127.0.0.1:3000/spasht/. This restoration has not been committed, pushed or publicly deployed. Current evidence is in this chat's outputs/clarity-restoration directory. The local preview is deliberately left open for KC's review.

[Recommendation] After review and release authorization, commit this scoped checkout and publish through the existing repository integration. Verify the public route and selected member's hosted assistant, confirmation/reset delivery and two-session continuity separately. Do not reintroduce a shared-community or email-digest claim without implementing and verifying those services.


## Release authorization — 2026-10-14

[Fact] After reviewing the restoration, KC explicitly requested committing and deploying it and ensuring no Spasht work remains pending. This authorizes the scoped release and reconciliation of the older Clarity copies. It does not broaden release scope to the separate Contact, Clarity Engine audit or About work.

[Fact] Existing lint, TypeScript, 14 Clarity tests, 35 Kosh tests, production build and final controlled browser evidence apply to this unchanged application code. The final browser pass includes 747 px and asserts primary navigation remains visible. The actual signed-in local in-app tab was refreshed and displays the restored Tools directory with Home and Projects. No real member write or assistant prompt was submitted during that read-only check.

[Fact] The exact older uncommitted Clarity implementation, tests and historical decision text are preserved in `docs/spasht/archive/2026-10-14-pre-restoration.patch` for lossless reconciliation. This recovery file is historical and is not intended to overwrite current main.

[Recommendation] Use the existing GitHub–Vercel integration for the production release, then verify the exact merged commit's Production status and the public route. Current owning-team CLI/API access was previously unavailable; do not create a replacement Vercel project or change Platform/Kosh credentials to bypass that boundary. Record final deployment and audit evidence in the calling task's outputs.

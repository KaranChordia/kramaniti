# Kramaniti Site Implementation Plan

## 1. Strategic Direction

The website has been refined around the foundation document's central positioning: Kramaniti is a first-principles AI systems partner, not a generic AI automation agency. The homepage now explains the business value in a simple sequence:

1. Strategy before tools.
2. Systems before scale.
3. Content after clarity.

The primary conversion path is "Book an AI Workflow Audit." All major homepage CTAs point to the contact/audit section rather than assuming a live Calendly or backend webhook.

2026-06-11 update: AI Enablement & Adoption is now integrated as a visible capability layer inside the existing three-service architecture. It does not replace the homepage service structure. The public principle is human-collaborative systems: AI should assist, humans should lead, and each workflow should clarify what is automated, AI-assisted, reviewed, or kept human-led.

## 2. Current Website Audit

The project is a Next.js 16 App Router site under `website/`, using React 19, CSS Modules, route handlers, and a root custom-domain deployment path. The existing site already had a strong visual direction: dark premium palette, gold accents, animated section atmospheres, modular homepage sections, a founder page, and an insights area.

The main issues found before refinement:

- The hero did not clearly explain what Kramaniti does in business-first language.
- The homepage began with a broad "Trusted By" marquee containing many names not verified in the foundation document or repo.
- Several homepage sections leaned on technical or agency-like language such as "agentic," "automated," and "AI slop."
- The services were close to the foundation document, but needed clearer alignment to the three official offers.
- The contact section was framed around a generic pipeline call rather than the AI Workflow Audit.

## 3. Current Homepage Section Map

Previous homepage:

- Hero
- Clients marquee
- Story
- Services
- Credibility
- Workflows
- Contact

Updated homepage:

- Hero
- Problem
- Method
- Services
- How It Works
- Founder Preview
- Contact

## 4. Section-by-Section Changes

- Hero: Rewritten with the approved headline, foundation-document subheading, primary audit CTA, and secondary method CTA.
- Problem: Added a new section replacing the client marquee. It explains that most brands have a workflow clarity problem, not an AI problem.
- Method: Reframed the old story/lifecycle section around Strategy, Systems, and Content.
- Services: Rebuilt the offer cards around Foundation Strategy, Systems Engineering, and Complete Lifecycle Retainer. Public pricing remains removed. AI Enablement & Adoption now appears as a supporting layer beneath the three-card architecture, not as a fourth primary card.
- How It Works: Rewrote the old pipeline section into a six-step process: Diagnose, Design, Build, Train, Communicate, Improve. The adoption step now clarifies usage, edge cases, override points, handoffs, and human-led review.
- Credibility: Removed from the homepage in the later selected-work cleanup. Public proof should now be handled through dedicated Work pages and approved assets, not a homepage Proof section.
- Founder Preview: Added a compact founder-led bridge to the full founder page.
- Contact: Rewritten around "Book an AI Workflow Audit" and the first workflow worth systemizing.
- Founder page: Lightly aligned linked founder copy to avoid old technical language immediately after the homepage.

## 5. Files Changed

- `website/src/app/page.tsx`
- `website/src/app/layout.tsx`
- `website/src/app/globals.css`
- `website/src/app/founder/page.tsx`
- `website/src/app/founder/Founder.module.css`
- `website/src/components/layout/Navbar.tsx`
- `website/src/components/layout/Navbar.module.css`
- `website/src/components/sections/Hero.tsx`
- `website/src/components/sections/Hero.module.css`
- `website/src/components/sections/Problem.tsx`
- `website/src/components/sections/Problem.module.css`
- `website/src/components/sections/Clients.tsx`
- `website/src/components/sections/Story.tsx`
- `website/src/components/sections/Story.module.css`
- `website/src/components/sections/Services.tsx`
- `website/src/components/sections/Services.module.css`
- `website/src/components/sections/Workflows.tsx`
- `website/src/components/sections/Workflows.module.css`
- `website/src/components/sections/Credibility.tsx` (removed later)
- `website/src/components/sections/Credibility.module.css` (removed later)
- `website/src/components/sections/FounderPreview.tsx`
- `website/src/components/sections/FounderPreview.module.css`
- `website/src/components/sections/Contact.tsx`
- `website/src/components/sections/Contact.module.css`
- `docs/kramaniti_site_implementation_plan.md`

## 6. Copy Changes Made

Primary homepage language now emphasizes:

- Business clarity
- Workflow audits
- Practical AI infrastructure
- Internal systems
- AI Enablement & Adoption
- Human-collaborative systems
- Connected growth pipelines
- Cinematic communication
- Founder-led, first-principles thinking

Removed or reduced on first-impression surfaces:

- "Agentic"
- "Autonomous"
- "AI slop"
- "Trusted By"
- Broad automation-first positioning
- Technical-first descriptions of delivery
- Fully automated or hands-free outcomes as the default promise

## 7. Credibility and Client-Claim Audit

Removed from the published homepage marquee:

- DigitalOcean
- HackerRank
- Bumble
- Techstars
- Well Ergon
- ClearGlass
- Wolves India
- GoQloak
- Vidhi Centre
- PK Narendra & Co
- Equidor
- Any broad unverified marquee-style implication of client trust

Softened:

- WeWork India, Hyatt Centric, and Nexocean are now presented only as text-based selected experience, not logos, testimonials, or outcome claims.
- Experience is led by category-level language: co-working, hospitality, education, startup, and B2B technology ecosystems.

De-emphasized:

- YouTube subscriber and Instagram follower metrics are not shown on the homepage. They remain useful founder proof signals but should be handled carefully in a fuller proof database.

## 8. Claims Removed, Softened, or Flagged

Removed:

- The public "Trusted By" homepage marquee.
- Unverified brand names from homepage proof.
- Homepage subscriber/follower metric strip.

Softened:

- Named selected experience now uses category and engagement context without implying current client endorsement.
- Nexocean is described as a five-month contract support engagement, not an ownership or broad client-result claim.

Flagged:

- Permission to publish WeWork India, Hyatt Centric, and Nexocean names should still be confirmed before a major public launch.
- A formal proof database should classify each claim as verified, partially verified, internal only, or do not publish yet.

## 9. Remaining Open Questions

- What is the final live booking destination for "Book an AI Workflow Audit"?
- Which email or webhook should the contact form submit to?
- Are WeWork India, Hyatt Centric, and Nexocean approved for public text references on the final production site?
- Should the AI Workflow Audit Blueprint become a downloadable lead magnet in the next iteration?
- Should pricing remain hidden on the homepage, or appear later in a sales page or proposal flow?

## 10. Recommended Next Iteration

- Build a proof database with evidence, permission status, and publishable summaries.
- Wire the contact form to the chosen inbox, CRM, or Make.com webhook.
- Add a real booking link or embedded scheduler when the event type is ready.
- Create the AI Workflow Audit Blueprint lead magnet.
- Add one detailed, verified case-study page once evidence and permission are cleared.
- Review the insights archive separately so technical articles remain useful without shaping the homepage's first impression.

## 10.1 Kramaniti Studio Agent OS

2026-06-11 update: Kramaniti Studio now includes an Agent OS mode inside `/studio`.

2026-06-12 structure update: the superseded root-level `studio/` prototype app was removed. The canonical Studio implementation now lives only inside the active website app under `website/src/app/studio/`, with supporting code under `website/src/lib/studio/` and `website/src/app/api/studio/`.

2026-06-19 simplification update: the earlier planner-plus-Agent-OS workbench has been superseded. Studio is now a focused agent operating console, inspired by the lower-friction Clarity Engine UX while preserving the existing Studio visual language.

[Recommendation] Studio should behave as one operating protocol, not a broad dashboard: Founder Input -> Routing Decision -> Draft Output -> Governance Review -> Founder Approval -> Memory Note.

Current frontend capabilities:

- Single `/studio` console with minimal navigation: Input, Route, Review, Memory.
- Master Coordinator is presented as the routing layer, not the executor.
- Requests route to the relevant lead agent and supporting agents through `website/src/lib/studio/agentOS.ts`.
- Local browser state stores only the current request, route, status, and memory note under `kramaniti-agent-console-v1`.
- Founder approval remains visible before public-facing, proof-sensitive, pricing, client-facing, or irreversible work.
- LM Studio is no longer surfaced as a first-class Studio UI feature. Local model experimentation can return later only if the operating model requires it.

Current status sequence:

- Input
- Routed
- Drafted
- In review
- Approved

[Constraint] The Studio console may route, draft, summarize, and prepare memory notes. It must not publish, invent proof, change pricing, handle credentials, make client-facing promises, or create external commitments.

Related files:

- `website/src/app/studio/page.tsx`
- `website/src/app/studio/studio.module.css`
- `website/src/lib/studio/agentOS.ts`

## 10.2 KCS - Kramaniti Content Studio

2026-06-13 update: KCS now has a local content-production route at `/KCS`.

[Recommendation] KCS should be the intended IDE-assisted workflow for Kramaniti infographic-video creation. It should not use the older `/design-studio` prototype as its source of truth. Planning happens in Codex chat through the reusable skill; the `/KCS` browser route is only the approved scene-rendering surface.

[Fact] The current KCS implementation includes:

- A clean local `/KCS` scene player.
- A narrow Next.js rewrite so `/KCS/` resolves to the uppercase KCS route while preserving the existing global trailing-slash behavior.
- A rendered starter sequence built from `website/src/lib/KCS/sceneSequence.ts`.
- Premium dark Kramaniti visual language with thin technical lines, burnished-gold motion accents, and minimal icon controls.
- A reusable Codex skill at `/Users/karanchordia/.codex/skills/kramaniti-content-studio`.

[Fact] The founder clarified that KCS should not show briefing forms, strategy notes, planning cards, implementation checklists, copied IDE prompts, or capture instructions inside the UI. The intended workflow is:

1. Open Codex in this repository and say `Design`.
2. Provide the video idea or message.
3. Let Codex read the brand design/context docs and propose a scene-by-scene draft in chat.
4. Approve or revise the draft.
5. After approval, Codex builds the connected premium scene sequence in `/KCS`.

[Recommendation] MP4 export should wait until the approved-scene renderer stabilizes. The likely path is deterministic playback, fixed viewport and FPS capture, then `ffmpeg` encoding into MP4. Generated export files should live under `08_brand_assets/exports/` unless a file is meant to be publicly served.

Related files:

- `website/src/app/KCS/page.tsx`
- `website/src/components/KCS/KcsWorkbench.tsx`
- `website/src/components/KCS/KcsWorkbench.module.css`
- `website/src/lib/KCS/sceneSequence.ts`
- `website/next.config.ts`
- `docs/kcs_content_studio.md`

## 10.3 Clarity Engine

2026-06-16 update: the website now includes a separate `/clarity-engine` route for founders, freelancers, and early operators who need to turn a raw idea or AI curiosity into a practical operating blueprint.

[Recommendation] Clarity Engine should stay separate from `/studio`. The founder explicitly rejected using the current Studio surface for this use case because it feels too cluttered. This tool should feel like a focused interactive UX: guided questions, live synthesis, a suggested workflow route, brand presence ideas, and a portable brief.

[Fact] The current implementation includes:

- A standalone route at `/clarity-engine`.
- A full-screen assistant flow that asks one question at a time instead of using a dashboard layout.
- Adaptive follow-up questions shaped by the user's prior answers. The Engine should still collect the essential blueprint inputs: clarity goal, audience/problem, current workflow, friction, human/AI boundary, and proof/presence. The wording should feel specific to the user's first intent, project context, workflow, audience, or blocker rather than like a fixed survey.
- A futuristic conversational surface with an atmospheric background scene, luminous signal paths, and floating synthesis layers.
- A server route at `/api/clarity-engine/chat` for Groq-backed streaming when `GROQ_API_KEY` is configured.
- A local fallback synthesis path so the interaction still works when the server route is unavailable.

[Constraint] The tool must preserve the Kramaniti operating sequence: strategy before tools, systems before scale, and content after clarity. It should not lead with technical language, generic AI agency claims, fake metrics, client logos, testimonials, or unsupported proof.

Related files:

- `website/src/app/clarity-engine/page.tsx`
- `website/src/app/clarity-engine/ClarityEngine.module.css`

- `website/src/app/api/clarity-engine/chat/route.ts`
- `website/src/lib/clarity-engine/assistant.ts`
- `website/src/components/layout/Navbar.tsx`

## 10.4 Global Kramaniti Assistant

2026-06-20 update: the public website now includes a global Kramaniti assistant fixed to the bottom-right corner as a Clarity Engine-inspired liquid blob.

[Fact] The current implementation includes:

- A site-wide assistant mounted from `website/src/app/layout.tsx`.
- A blob-only fixed launcher that expands into a centered cinematic chat layer.
- A passive launcher mode on the motion-heavy KCS route, with mobile animation paused so the assistant stays available without adding continuous visual load.
- A server route at `/api/chat/` powered by the Groq SDK and default model `openai/gpt-oss-120b`.
- A server-side curated repository knowledge context assembled from canonical Kramaniti docs, website rules, proof governance, decision history, and recent public Insights.
- A local fallback response when `GROQ_API_KEY` is not configured.
- Response modes that keep vague prompts short, ask one clarifying question for broad interest, and reserve longer answers for concrete requests.

[Constraint] The assistant must stay proof-safe and public-facing. It can answer from Kramaniti context, explain the method, guide users toward the AI Workflow Audit, and clarify services. It must not reveal secrets, raw internal file dumps, private implementation details, unverified client claims, metrics, testimonials, pricing, or permission-sensitive proof.

2026-06-21 update: the assistant now has explicit identity, scope, and service-response guardrails in the server-side runtime context.

[Fact] The assistant should answer from the Kramaniti repository context only. Its safe public domain covers Kramaniti, Karan Chordia, the website, founder profile, services, public work pages, Clarity Engine, Studio, KCS, Insights, claim rules, and the Kramaniti method.

[Fact] Karan Chordia is the founder behind Kramaniti. If a visitor asks who founded Kramaniti, this company, this website, or uses likely speech-to-text wording such as "common people" while asking about the company, the assistant should answer with that founder fact and clarify that the official brand is Kramaniti.

[Recommendation] When a visitor describes employee duties, operational tasks, manual work, content production, CRM, support, sales follow-up, reporting, hiring, or similar responsibilities, the assistant should explain how Kramaniti would approach the work: clarify the role and current tools, map recurring tasks and bottlenecks, separate human-led, AI-assisted, and safely automated steps, design the support system, add review rules, and guide serious prospects toward an AI Workflow Audit.

[Constraint] The assistant should not answer broad general-knowledge questions as if it has unrestricted world knowledge. It should state that it is the Kramaniti website assistant and connect the conversation back to Kramaniti context when relevant.

Related files:

- `website/src/components/assistant/KramanitiAssistant.tsx`
- `website/src/components/assistant/KramanitiAssistant.module.css`
- `website/src/app/api/chat/route.ts`
- `website/src/lib/kramaniti-assistant/knowledge.ts`
- `docs/kcs_zero_copy_motion_proposal.md`

## 10.5 Kramaniti Clarity Square

2026-06-22 update: the website now includes a public `/clarity-square` route for Kramaniti Clarity Square, a free AI-assisted clarity ecosystem for founders and early builders.

[Recommendation] Clarity Square should not be positioned as an AI social network. It should behave as an ongoing clarity network: private memory, public learning, weekly AI-assisted reflection, and clarity briefs that can lead serious users toward the AI Workflow Audit or deeper Kramaniti services.

[Fact] The current implementation includes:

- A standalone route at `/clarity-square`.
- A premium but simple sequential app flow rather than a dense all-in-one dashboard.
- A modern entry screen with simulated sign in / account creation for the v1 prototype.
- A two-track selector: Building a business / Founder Track, and Exploring an idea / Builder Track.
- A Square community surface with two contribution paths: founders can post problem statements as threads, and solopreneurs can share work, ideas, prototypes, or useful signals.
- The first Square feed implementation is local-first, with seeded founder problem threads and solopreneur shares for product validation before community persistence is added.
- Account creation now treats the selected path as the user's Square role. Founder accounts get the founder problem-statement composer and founder-owned project/context path; solopreneur accounts get the work/idea sharing composer and solopreneur-owned project/context path.
- A focused intent-capture screen that asks for the one-line intent, current context, audience, blocker, and desired outcome.
- A private context workspace that saves the user's starting point locally, then shows the system's understanding, next questions, and suggested sequence.
- Supabase-ready authentication with two-step signup: email first, then username/password, plus private project storage when `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are configured.
- A dedicated Supabase migration for the isolated `clarity_square` schema so Clarity Square data does not overlap with existing recruiting-company tables in the same Supabase project.
- A profile/settings panel placeholder for signed-in users, showing username, email, account, settings, and projects menu surfaces for future expansion.
- A browser-local handoff into `/clarity-engine` so the Engine can use Clarity Square's saved starting context and continue with the current workflow question instead of asking the user to repeat the same initial details.
- A dedicated Clarity Square Assistant available only inside `/clarity-square`, separate from the global public Kramaniti assistant.
- Square Assistant conversations and user-visible memory notes are stored in `clarity_square.assistant_messages` and `clarity_square.assistant_memories` for signed-in users, with browser-local fallback for local sessions.
- The Square Assistant uses the member's supplied context, saved projects, and memory notes, plus Kramaniti's curated repository context, to answer in a Clarity Square-specific way.
- The Square Assistant can create new private projects from a user query while keeping project storage under `clarity_square.projects`.
- The Projects section now uses a Finder-style workspace with folder navigation, project rows, preview details, search, folder creation, and move-to-folder controls.
- Signed-in project folders are stored in `clarity_square.project_folders`; projects reference folders through `clarity_square.projects.folder_id`.
- Projects now include a project-level instruction field that acts as the operating context for future project output.
- New projects can be created directly from Projects by answering what the project is about; assistant-created projects auto-fill that instruction from the assistant conversation.
- Projects now support auto-built starter tasks, manually added tasks, and a selected-project assistant thread that reuses the Clarity Square assistant behavior while staying scoped to the project instruction and task context.
- The Square Assistant now runs one shared intelligent-action path across the main assistant and selected-project assistant: project drafts, folder drafts, task drafts, and memory drafts are saved through the same workspace executor, then reflected in Projects/Memory state.
- Signed-in project tasks are stored in `clarity_square.project_tasks`; project assistant messages continue using `clarity_square.assistant_messages.project_id`.
- Clarity Square now subscribes to realtime workspace changes for projects, folders, context entries, assistant messages, and assistant memories.
- The Square Assistant refreshes the signed-in workspace before answering so manually created projects, folders, project entries, and assistant-created projects use the same context path.
- The Square Assistant supports multiple main chat threads through assistant message metadata, with each main thread treated as a separate conversation session. Project-specific assistant threads remain scoped separately by `project_id`.
- After five completed main assistant exchanges, the thread title should shift from the early prompt label to a compact summary title stored in assistant message metadata.
- The Assistant surface uses an action-first assistant menu bar below the route navigation. Keep it as icon + button text only; do not add visible instruction labels to that bar.
- Assistant settings may collect user response-style preferences such as directness, question style, or reply structure. Treat these as behavior/personality tweaks only, never as replacement system instructions or permission to override Clarity Square boundaries.
- Clarity Square now includes a Loop Board section with five user-facing loops: Signal Loop, Project Loop, Task Loop, Reflection Loop, and Brief Loop. These are not presented as technical internal Kramaniti agents; they are user-visible operating cycles for seeing what is pending, working, waiting for approval, and completed.
- The Loop Board UX is a guided loop runner, not a dense dashboard or creation menu. Selecting a loop triggers a short context-gathering state that refreshes signed-in workspace data when available, shows the context sources being read, then reveals a focused scan report for that loop.
- Loop Board state is derived from existing workspace data: projects, folders, project tasks, assistant pending actions, memories, and context entries. Project Loop scans saved projects and task load; Signal, Task, Reflection, and Brief loops scan their relevant context before offering source navigation or assistant interpretation.
- Clarity Square includes a dedicated Tasks page in the main navigation. It groups `clarity_square.project_tasks` by project, includes project/status filters, shows assistant-created, auto-generated, and manual tasks in the same manager, and lets users add or complete tasks without leaving the task surface.
- The Start screen remains available as the first-time entry/auth surface, but it is no longer a persistent main navigation item. The navigation slot is used for Tasks.
- Memory includes a Delete Data section listing saved context, projects, tasks, memories, folders, and assistant threads. Deletes are item-level, confirmation-gated, update local UI immediately, and persist through the existing signed-in Supabase tables when available.
- Projects now have a project-centered Get Clarity path. The action passes the selected project id, folder id, title, folder name, project instruction, and context into Clarity Engine. When the Engine blueprint agents finish, the Blueprint page can save the Strategy, Systems, and Presence reports as individual `clarity_square.project_reports` records under the originating project.
- New manually created and assistant-created projects must resolve to a folder before being saved. When no explicit folder is selected, the app creates or reuses a folder named from the project title so the project does not remain unfiled by default.
- A progressive product model where future digest, public-learning, and Clarity Brief surfaces should appear after context is captured instead of being visible all at once.
- Navigation and sitemap entries for the new route.

[Recommendation] 2026-06-25 Supabase wiring backlog:

- Square/community posts, replies, interest counts, and feed filters are still local-first. Add dedicated `clarity_square` tables before treating Square activity as cross-device or durable account data.
- Digest rhythm and "keep vault entries private by default" style settings are currently UI-level preferences. Persist them in `clarity_square.profiles.assistant_settings` or a dedicated preferences table before using them as product behavior.
- Assistant pending approvals are transient UI state. Approved actions write through the shared workspace executor, but the approval card itself can be lost on reload. Persist pending assistant actions if approval workflows need to survive refreshes or move across devices.
- Empty assistant thread shells are local until a message exists. If blank named threads must be durable, add a thread table instead of relying only on `assistant_messages.metadata.thread_id`.
- Loop Board scans read existing workspace data but do not store loop run history, generated scan summaries, or completion records. Add loop-run persistence only if users need audit history or recurring loop outputs.
- The active saved signal/current context object is local UI state. Persisted projects and context entries can already be deleted through Memory, but the "saved signal" control should either map clearly to those records or remain framed as clearing the current local workspace view.
- The Clarity Square to Clarity Engine handoff remains browser-local and one-time while the diagnostic session is in progress. Project-originated blueprint outputs are now persisted only when the user chooses "Save all to project".
- Signed-out local session data is not migrated into Supabase on sign-in. Add an explicit import flow before promising continuity from local sessions into accounts.

[Constraint] Clarity Square must stay distinct from Clarity Engine. Clarity Engine is the focused single diagnostic session. Clarity Square is the ongoing ecosystem layer with member memory, community engagement, and recurring progress rhythm.

[Constraint] The social layer should be founder/solopreneur-focused. Founders contribute real problem statements; solopreneurs contribute work, ideas, and experiments. It should not become a generic engagement feed.

[Constraint] Founder and solopreneur capabilities should remain role-gated by the account's saved `preferred_track`. Do not show founder problem-posting controls to solopreneur accounts, and do not show solopreneur share-posting controls to founder accounts unless a newer product decision explicitly merges those roles.

[Constraint] Clarity Square screens should not spend meaningful viewport space on sections that only explain the product. Prefer effective UI density: composers, threads, project/task surfaces, filters, actions, and stateful workspace objects. Explanatory copy should be compact and embedded inside functional controls or empty states.

[Constraint] V1 remains free. Auth-backed storage is allowed only inside the isolated `clarity_square` schema, with RLS scoped to `auth.uid()`. Do not add payments, public claims, external tool recommendations, emails, or market updates without a newer implementation decision and privacy/storage model.

[Constraint] The Clarity Square UX should stay sequential by default: entry, path selection, focused intent capture, then saved-context development. Do not return to an all-panels-at-once dashboard unless the founder explicitly asks for that mode again.

[Constraint] The Clarity Square to Clarity Engine connection remains a temporary browser-local handoff. Do not treat the handoff itself as CRM storage or public sharing.

[Constraint] Supabase-backed Clarity Square storage must remain under the `clarity_square` schema with RLS policies scoped to `auth.uid()`. Do not reuse recruiting tables or add Clarity Square data to existing recruiting-company schemas.

Related files:

- `website/src/app/clarity-square/page.tsx`
- `website/src/app/clarity-square/ClaritySquare.tsx`
- `website/src/app/clarity-square/ClaritySquare.module.css`
- `website/src/app/api/clarity-square/assistant/route.ts`
- `website/src/lib/clarity-square/supabase.ts`
- `supabase/migrations/20260623060000_clarity_square_schema.sql`
- `supabase/migrations/20260623121000_clarity_square_assistant_memory.sql`
- `supabase/migrations/20260623143000_clarity_square_project_folders.sql`
- `supabase/migrations/20260623154500_clarity_square_realtime_workspace.sql`
- `supabase/migrations/20260625120000_clarity_square_project_reports.sql`
- `supabase/migrations/20260624111719_clarity_square_project_tasks.sql`
- `supabase/migrations/20260624130000_clarity_square_assistant_settings.sql`
- `docs/clarity_square_supabase_setup.md`
- `website/src/components/layout/Navbar.tsx`
- `website/src/app/sitemap.ts`

## 11. Nexocean Portfolio Page

- Added a dedicated selected-work page at `/work/nexocean`.
- The page frames Nexocean as a five-month contract engagement across internal recruiter tools and brand content.
- The private Wingman Dashboard repo is treated as reference material only and is not linked publicly from the site.
- Public copy focuses on category-safe delivery: recruiter operating workflows, Wingman Assistants, resume intelligence, JD-to-sourcing workflows, outreach support, talent intelligence, and cinematic brand content.
- YouTube showcases are embedded as public-facing proof assets while avoiding private repo exposure or unsupported performance claims.
- A Kramaniti-channel unlisted walkthrough is featured first to show the internal tools, UI, UX, process flow, and design work without linking the source repository.
- The homepage Proof/Credibility section and its navigation link were removed after the Nexocean work page became the cleaner proof surface.

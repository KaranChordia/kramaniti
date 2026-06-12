# Kramaniti Site Implementation Plan

## 1. Strategic Direction

The website has been refined around the foundation document's central positioning: Kramaniti is a first-principles AI systems partner, not a generic AI automation agency. The homepage now explains the business value in a simple sequence:

1. Strategy before tools.
2. Systems before scale.
3. Content after clarity.

The primary conversion path is "Book an AI Workflow Audit." All major homepage CTAs point to the contact/audit section rather than assuming a live Calendly or backend webhook.

2026-06-11 update: AI Enablement & Adoption is now integrated as a visible capability layer inside the existing three-service architecture. It does not replace the homepage service structure. The public principle is human-collaborative systems: AI should assist, humans should lead, and each workflow should clarify what is automated, AI-assisted, reviewed, or kept human-led.

## 2. Current Website Audit

The project is a Next.js 16 App Router site under `website/`, using React 19, CSS Modules, static export, and a root custom-domain deployment path. The existing site already had a strong visual direction: dark premium palette, gold accents, animated section atmospheres, modular homepage sections, a founder page, and an insights area.

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

[Recommendation] Agent management should stay inside Studio's existing planning workbench rather than becoming a disconnected admin dashboard. The mode keeps the same liquid-glass visual system, rectangular radius scale, and local-first operating pattern established for Studio tools.

Added frontend capabilities:

- Planner / Agents mode switch inside the floating Studio nav.
- Agent OS tabs: Orchestrator, Roster, Tasks, LM Studio, and Runbook.
- Local browser task queue stored under `kramaniti-agent-os-tasks-v1`.
- Agent roster and routing data in `website/src/lib/studio/agentOS.ts`.
- Task composer that routes founder goals to a lead agent, supporting agents, and approval gate.
- Task board with Draft, Routed, In review, and Approved states.
- LM Studio bridge that tests a local OpenAI-compatible server and can send a prompt through `/api/studio/lm-studio/chat/`.
- Runbook panel with local model setup and governance constraints.

Local model direction:

- [Recommendation] The frontend should not try to launch LM Studio. The founder starts the local server from LM Studio's Developer tab or with `lms server start`.
- [Recommendation] The Studio frontend should call the local Studio bridge, and the bridge should call LM Studio at `http://127.0.0.1:1234/v1` once the server is running.
- [Constraint] The Agent OS may draft, route, and summarize, but it must not publish, invent proof, change pricing, or make external commitments.

Related files:

- `website/src/app/studio/page.tsx`
- `website/src/app/studio/studio.module.css`
- `website/src/lib/studio/agentOS.ts`
- `website/src/lib/studio/lmStudio.ts`
- `website/src/app/api/studio/lm-studio/models/route.ts`
- `website/src/app/api/studio/lm-studio/chat/route.ts`
- `docs/lm_studio_agent_os_setup.md`

## 11. Nexocean Portfolio Page

- Added a dedicated selected-work page at `/work/nexocean`.
- The page frames Nexocean as a five-month contract engagement across internal recruiter tools and brand content.
- The private Wingman Dashboard repo is treated as reference material only and is not linked publicly from the site.
- Public copy focuses on category-safe delivery: recruiter operating workflows, Wingman Assistants, resume intelligence, JD-to-sourcing workflows, outreach support, talent intelligence, and cinematic brand content.
- YouTube showcases are embedded as public-facing proof assets while avoiding private repo exposure or unsupported performance claims.
- A Kramaniti-channel unlisted walkthrough is featured first to show the internal tools, UI, UX, process flow, and design work without linking the source repository.
- The homepage Proof/Credibility section and its navigation link were removed after the Nexocean work page became the cleaner proof surface.

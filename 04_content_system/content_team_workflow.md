# Publication-aware content team

Owner: Digital Presence Orchestrator. Implemented at KC's request on 15 October 2026.

This is a reusable, on-demand agent workflow in the repository. Configured roles are not background processes. No social scheduler, automatic posting, API account or daily job is created by this setup.

## Start a run

KC can say: **“Run the content team: review what is published on LinkedIn and Instagram, update the plan, and produce the next post.”** For a narrower request: **“Run the content team for Kosh”**, **“Generate the next approved image”**, or **“Update the published inventory from these links.”**

The lead reads root/local instructions, canonical master context, current decisions, `content_registry.json`, `published_baseline.md`, `production_queue.md`, the calendar, the current brand kit and the latest run record. It preserves previous decisions and uncommitted work. Activate only the smallest useful set of roles. Parallelise only independent read-only research or disjoint asset work. One coordinator owns registry/calendar integration.

## Team and concrete responsibilities

| Role / configured agent | Owns | Handoff |
|---|---|---|
| Content lead / `digital_presence_orchestrator` | Business objective, continuity, prioritisation and review package | A run brief and one next production item |
| Published Content Researcher / mode of `distribution_analytics_agent` | Confirmed account identity, live-post inventory, source coverage, timestamps and observed signals | Verified publications and explicit unknowns |
| Editorial Strategist / mode of `content_director` | A connected plan based on published themes, audience questions, product readiness and available assets | Briefs explaining what each item follows and what it adds |
| Creative Producer / mode of `content_director` | Channel copy, carousel scripts, image prompts and actual requested images, captions and alt text | One complete reviewable package; actual files clearly separated from briefs |
| Brand and proof review / `brand_identity_agent` + `proof_governance_auditor` | Visual consistency, current product facts, claim evidence and approval readiness | Findings and revisions; KC retains publication authority |

These extend existing agent definitions instead of creating duplicate planners, writers or reviewers. Content Director can perform writing and visual modes sequentially without spawning workers. Agent roles are not separate user-owned chats.

## 1. Establish what is really published

- LinkedIn and Instagram are KC-confirmed primary channels. Exact profile URLs are still required; never guess handles from names. A website is a separate publication channel, not evidence of a social post.
- Use public pages, connected read-only tools or KC-authorised exports. Do not create accounts or change permissions to fill a research gap. If access fails twice for the same reason, switch to an export/permalink and state the limit.
- Record canonical URL, brand, channel/account, title/hook, format, thesis, CTA, observed time, source evidence and publication date when actually available. For missing dates/metrics use `null`, never zero or a guessed date.
- Inventory exact and near-duplicate ideas: compare the core thesis, example, opening line, CTA and visual metaphor, not just the title. A legitimate follow-up must add a demonstration, question, application, proof or new audience perspective.
- Use two sources of state: `items` for owned production assets; `publications` for per-channel evidence. One asset can have different publication/approval status on each platform. Never use one global “published” flag for all channels.
- A founder report without a verifiable URL is `reported`, not `verified`. Preserve the report and seek the URL; do not discard it or present it as directly checked.
- Before each plan, refresh recent posts from confirmed accounts. A snapshot older than seven days cannot be presented as current. Seven days is an internal freshness default, not a platform rule. Record exact checked range and coverage; a partial view never establishes that an unseen post does not exist.

## 2. Plan from the evidence

The strategist uses a four-week rolling view, with two primary items per week as an initial proposal rather than an approved schedule. Each item records its product, audience problem, pillar, channel/format, parent content IDs or source URLs, new value, CTA, destination, proof needs, existing asset, owner and dependencies.

Prefer continuity over restarting introductions. Existing Kosh/Spasht images remain generated local assets until social publication is evidenced. Plan alternatives where publication is unknown: use the introduction if absent; otherwise continue with the first application. Do not repeat an introduction just because it is absent from a partial audit.

Current editorial guardrails:

- Kramaniti: strategy, systems and communication in one business-first narrative.
- Kosh: useful patterns/templates for specific work; no automatic execution or unsupported compatibility/savings claim.
- Spasht: thinking through an idea and choosing next steps; verify authenticated functionality before presenting screens as real demonstrations.
- Treat legacy content-pillar examples containing client names or numerical outcomes as ideas requiring evidence, not cleared claims.
- KC owns logo creation in Canva. No further logo exploration, substitution or release. Continue with the previously accepted text-only product endorsements until KC supplies final logos.

## 3. Generate the next item

For an ordinary content-team run, produce the next copy-and-creative package. Image generation happens when KC asks to generate, or explicitly includes it in the run scope. Reuse existing suitable images before generating more. Work one chosen item at a time unless KC requests a batch. Do not fill a month with expensive images before reviewing the direction.

Every package contains:

1. Content ID, objective, relationship to published/source content and what is new.
2. Finished LinkedIn copy and an Instagram adaptation, with account context and one CTA.
3. Exact on-image wording, visual composition, complete image prompt or carousel/script source.
4. Actual image/video/export paths when produced, dimensions, visual inspection outcome and alt text. A script is not a completed video; a prompt is not an image.
5. Proof links, hypothetical-example labels, missing evidence, current destination check and any source limits.
6. Specific next review: concept selection, creative review or publication authorisation. Never conflate them.

Use the imagegen skill and built-in image tool for raster campaign imagery. Use native vector tools for diagrams. Preserve official marks; never ask a generator to invent or approximate an official logo. Save selected project outputs and full prompts to the workspace. Use current fonts/palette and the accepted cinematic style; never treat a historical kit as newer than observed website styling.

## 4. Review, publish and learn

Run brand/voice/proof checks before KC review. Public-facing client stories, outcomes and screenshots require established evidence and permission. Show the exact caption revision, exact final assets, channel/account, destination and proposed action when requesting publication approval. Record approval evidence against that revision/account. A changed claim, asset, URL or CTA requires renewed approval. “Looks good” about an image is creative approval only.

Do not publish or schedule unless KC explicitly authorises the concrete external action. Read back the live post URL and actual state after a send; a click on Publish without confirmation is not proof. Scheduling is `scheduled`, not published. Record failed/unknown outcomes, inspect before retrying, and prevent duplicate sends. Do not delete earlier publication records; retain corrections/retirements as history.

After publication, Distribution & Analytics records sourced metrics at a stated time and recommends repeat/revise/stop. Missing analytics access means unknown performance, not zero engagement. Feed observed audience questions back into the next plan.

## Run record

Each run writes a compact Markdown record under `runs/` with checked accounts/range/time, coverage limits, publication changes, planning decisions, generated files, review result and next action. Link to source artifacts; do not copy the entire history. Keep only professional public material necessary to the task, not private messages or member content.

## Validation

Run `python3 06_ai_agent_context/scripts/validate_content_team.py` after updating the registry/team. It validates config references, evidence gates, approval specificity and existing local assets. Validation is structural; it does not itself verify a URL's contents or establish ownership of a social profile.


## Mandatory parent-logo rule — KC, 15 October 2026

Every finished content image must visibly include the official Kramaniti logo, including all Kosh and Spasht visuals. The product name, product logo or “by Kramaniti” wording does not replace the parent mark. Use the supplied original asset, preserve geometry/proportions/gold, and inspect it before delivery. This supersedes earlier text-only endorsement guidance. KC still owns the separate product-logo creation in Canva.

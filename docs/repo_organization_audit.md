# Repository Organization Audit

**Purpose:** Record the June 12, 2026 cleanup pass so future agents can keep Kramaniti simple, readable, and easy to continue.

**Key Findings:** [Fact] The repo's canonical operating structure is now the numbered workspace plus `docs/`, `website/`, and a populated `08_brand_assets/` library. [Fact] The active Studio implementation lives inside `website/src/app/studio/`. [Inference] The removed root-level `studio/` app was a superseded prototype because later Studio work evolved only the integrated website route. [Recommendation] Keep one active web app unless a future decision explicitly creates a separate product repository.

**Evidence:** `README.md`, `AGENTS.md`, `website/AGENTS.md`, `docs/kramaniti_site_implementation_plan.md`, `09_reviews/decisions.md`, and the current file inventory.

**Interpretation:** [Inference] The repo felt scattered mainly because generated local artifacts, prototype app surfaces, empty asset placeholders, and unnecessary one-file folders were sitting beside the canonical workspace files. The durable knowledge base was mostly sound.

**Implications:** Future cleanup should preserve the agent governance layer and avoid flattening strategic folders. Real deletions should target generated artifacts, superseded prototypes, empty shells, and unreferenced placeholders.

**Open Questions:** Should `08_brand_assets/exports/kramaniti_brochure.pdf` be promoted into a public download or kept internal? Should `website/.env.local` be replaced by a documented local setup template outside secrets?

**Next Steps:** Review the two open questions above, then keep future additions inside the existing ownership map unless a decision log entry approves a new top-level area.

---

## September 4, 2026 Follow-up

**Purpose:** Reconcile the documented structure with the live repository after later product experiments and local development work.

**Key Findings:** [Fact] The usable Kosh website refinements were approved for consolidation into `main`. [Fact] The separate Kosh/Supabase worktree had no unique commits, and both of its modified compatibility files were byte-identical to the versions already on `main`. [Fact] The retired native Kosh macOS experiment is absent even though the README still described it as active. [Fact] The finance-agent experiment and its local finance workspace did not belong in the public product repository. [Fact] `agent-os-simulation/` remains as a tracked experimental application outside the canonical `website/` boundary. [Fact] The private Foundation PDF is available outside the repository, while `06_ai_agent_context/system_prompts/master_context.md` contains the canonical repository positioning and constraints.

**Evidence:** Live Git status, worktree inventory, listener ownership, tracked-file inventory, repository visibility, and the existing Kramaniti task list reviewed on September 4, 2026.

**Interpretation:** [Inference] The numbered operating workspace and `website/` remain the durable repository core. Experimental applications, private administration, generated QA evidence, and final deliverables need explicit lifecycle states instead of accumulating as additional top-level roots.

**Implications:** [Recommendation] Keep Kosh inside the canonical `website/` app and remove auxiliary worktrees only after their changes are proven preserved on `main`. Keep financial administration and private source documents outside this public repository. Use `06_ai_agent_context/system_prompts/master_context.md` as the portable repository foundation. Decide whether `agent-os-simulation/` should be archived, integrated, or retired before removing its source. Reconcile `output/`, `outputs/`, `.codex-audit/`, and tracked `tmp/` material only after identifying the canonical deliverables and evidence worth preserving.

**Open Questions:** Is `agent-os-simulation/` still useful? Which founder-alignment deck versions must remain as historical references?

**Next Steps:** Commit the verified Kosh and cleanup changes together, confirm remote parity, remove the patch-equivalent auxiliary worktree and branch, then review the remaining structural-decision shortlist.

---

## Current Source Structure

| Area | Role |
| :--- | :--- |
| `02_founder_context/` | Founder background, timeline, skills, verification |
| `03_brand_strategy/` | Positioning, offers, narrative, identity, naming |
| `04_content_system/` | Content pillars, calendar, campaigns, backlog, publishing, analytics, drafts |
| `05_ai_strategy/` | Workflow audits and delivery blueprints |
| `06_ai_agent_context/` | Agent configs, roster, memory, protocols, routing, system prompts |
| `07_business_build/` | Launch operations and business setup references |
| `08_brand_assets/` | Logos, founder media, insight graphics, exports, asset registry |
| `09_reviews/` | Decisions, proof register, governance |
| `docs/` | Implementation plans, setup notes, and repo-level audits |
| `website/` | Active Next.js website, public assets, Insights, Studio, and API routes |

## Cleanup Completed

| Item | Status | Reason |
| :--- | :--- | :--- |
| Root `studio/` app | Removed | [Inference] Superseded by `website/src/app/studio/`; later Studio commits and docs reference the integrated website route. |
| `website/src/app/dashboard/` placeholder route | Removed | [Inference] Superseded by Studio Agent OS; Decision 12 rejected a separate dashboard visual system for the current iteration. |
| `.DS_Store` files | Removed | [Fact] macOS metadata, not source. |
| `.vercel/` | Removed | [Fact] Local Vercel state, not source. |
| `studio/node_modules/` and `studio/.next/` | Removed | [Fact] Dependency/build output for the removed prototype app. |
| `website/.next/`, `website/out/`, `website/tsconfig.tsbuildinfo`, `website/next-env.d.ts` | Removed | [Fact] Generated build/type output that can be recreated. |
| Legacy `/kramaniti` PWA paths | Aligned to `/` | [Fact] The active Vercel deployment uses the custom-domain root, so manifest and service-worker paths now match the current website config. |
| Empty asset placeholder folders | Removed | [Fact] `08_assets/logos`, `references`, `screenshots`, and `exports` were only `.gitkeep` shells. They were replaced by populated `08_brand_assets/` folders. |
| One-file knowledge folders | Flattened | [Recommendation] Founder, content, AI strategy, business build, and decision files now live directly in their owning folder unless a subfolder still has a clear purpose. |

## Preserved Intentionally

| Item | Reason |
| :--- | :--- |
| `website/node_modules/` | Preserved so validation can run without reinstalling dependencies. It remains ignored and can be removed later if disk cleanup is the priority. |
| `website/.env.local` | Preserved because it contains a local API key. Do not commit it or print its value. |
| `website/public/assets/brand/` | Preserved because the website serves active runtime logo files from this public folder. Source/reference copies also live in `08_brand_assets/logos/`. |
| `website/public/assets/insights/` | Preserved because live Insights posts render these images from public URLs. Source/reference copies also live in `08_brand_assets/insight_graphics/`. |

## Placement Rules

- Public website code belongs under `website/`.
- Kramaniti Studio code belongs under `website/src/app/studio/`, `website/src/lib/studio/`, and `website/src/app/api/studio/`.
- Website deployment guidance should treat `/` as the active public base path unless a new decision reintroduces a repository subpath.
- Reusable public runtime assets live under `website/public/assets/` only when the website needs to serve them.
- Source/reference brand assets, exports, founder media, and reusable graphics live under `08_brand_assets/`.
- Cross-functional implementation notes live under `docs/`.
- Historical references should stay labeled as historical and should not drive current implementation unless reconciled against `AGENTS.md`, `website/AGENTS.md`, and the current decision log.

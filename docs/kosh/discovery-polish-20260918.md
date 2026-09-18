# Kosh discovery and navigation polish

Date: 2026-09-18. Status: verified implementation; publication authorized by KC.

## Scope and location

[Fact] KC requested a more enjoyable Kosh Library with premium navigation and transitions. Work continues in `/Users/karanchordia/.codex/worktrees/b773/kramaniti`, branch `codex/kosh-spatial-studio`, based on `9e545897`. This worktree was clean at the start and already contained the released resource reader and Creation Studio. The current remote main revision `6c7fc6a3` has no differences in the Library or Kosh component directories compared with that starting revision.

[Fact] Website Steward owns the implementation; visual, accessibility and documentation review were handled within the same task. The primary Kramaniti checkout and the Raju Bafna project remain outside the edits.

## Experience

- A more compact introduction makes the library's primary action clear. A guided research path connects three existing resources on desktop; its collection link remains available on mobile.
- A persistent Kosh header keeps Explore, Create and My work available, with a sliding active marker. Resource maps and Studio chapter navigation account for its height.
- Search matches multiple words across titles, descriptions, outcomes, formats and included material. Three task shortcuts offer useful starting queries; format counts reflect the search.
- Visible reset and clear actions, explicit no-result recovery and the existing compact view support fast browsing. Search, format and view remain in the URL.
- Resource rows expose their format, purpose and selected contents, with a restrained hover reveal. Route arrivals and filtered results use short movement. Reduced motion removes these animations.
- `/` and Command/Control+K focus discovery search when the user is not editing a field. A keyboard skip link transfers focus without changing the resource section's hash.
- Mobile keeps a stable five-column format selector. Desktop blur is capped at 12px, tablet at 6px, and mobile uses an opaque header.

[Fact] Public Markdown, resource identities, source provenance, backend APIs and account behavior were not changed. Existing unavailable Studio saving/AI states remain honest. No remote data or account actions were performed.

## Verification

[Fact] Completed checks:

- `npm run lint`, `npx tsc --noEmit`, `npm run build`, `git diff --check`.
- `npm run test:kosh`: all 24 existing domain and mocked API tests passed.
- `tests/kosh-world-browser.mjs`: desktop/390px/320px search and compact state, original download, source-backed Studio creation, actual ZIP export, discovery return/scroll, browser history and draft continuity passed.
- `tests/kosh-resource-space.mjs`: all six resources; desktop/390px/320px method navigation, subsection recall, hash history, working-copy continuity, original-reader Escape/focus and downloads passed. The suite also checked light theme and CSS zoom.
- `tests/kosh-discovery-browser.mjs`: discovery at 1440px, 768px, 390px and 320px, task shortcuts, multi-word search, clearing/focus, empty recovery, compact mode, sticky navigation, unobscured resource headings, reduced motion, light theme, direct filtered URLs, refresh and keyboard skip-link behavior.

[Fact] The production preview requests Vercel's two deployment-provided analytics scripts. They return 404 locally at `/_vercel/insights/script.js` and `/_vercel/speed-insights/script.js`. The discovery test records these exact local-only notices separately; it still fails on any other console/page error. The development integration passes reported no console/page errors.

[Fact] Build-generated HQ repository metadata was restored to its original bytes. Earlier release screenshots and result files were preserved; the existing browser suites accept `KOSH_EVIDENCE_DIR` for separate evidence output.

[Unverified] Safari, hardware mobile devices, screen readers, real browser-menu zoom, hosted persistence and provider calls were not verified by this UI pass.

## Review and continuation

Preview: `http://127.0.0.1:3003/library`. It serves the production build and is left running for review; edits require a rebuild/restart or switching back to the dev server.

Primary files: `website/src/app/library/LibraryLanding.tsx`, `ResourceCatalogue.tsx`, `discovery.module.css`; shared navigation in `website/src/components/kosh/world/`. Resource/Studio stylesheet edits only align sticky offsets.

Browser evidence: `docs/kosh/evidence/discovery-20260918/`. Set `KOSH_STUDIO_URL` for another preview URL and `KOSH_PLAYWRIGHT_MODULE` to an available Playwright module when rerunning the scripts. `KOSH_EVIDENCE_DIR` should be an existing directory with a trailing slash for the older browser suites.

[Fact] The implementation was initially kept local for review. KC subsequently requested “please commit, push and deploy”; this authorizes publication of the scoped work below.

## Browser review follow-up: floating navigation and text-only formats

[Fact] KC requested removing the emoji-style category icons throughout the library and replacing the edge-to-edge header with a floating navigation bar with a shimmering border. Decorative Bot, Sparkles, Plug and ShieldCheck icons are removed from both the discovery rows and shared ResourceTile used by favourites. Category text remains visible.

[Fact] The shared navigation is now an inset, rounded floating surface with a fine gold border sheen. The border overlay cannot intercept pointer input. Following KC’s next review, its broad highlight now travels continuously around the border in a smooth fourteen-second linear loop, with no fade-out or idle gap; reduced-motion settings leave a static border highlight. Sticky resource/Studio offsets inherit the new total navigation clearance.

[Fact] Production build, full lint, TypeScript and diff checks passed. The discovery browser suite passed at 1440, 768, 521, 390 and 320px, checking inset navigation, icon-free category labels, shimmer/reduced motion, search/filters, focus, resource-map clearance, light theme and overflow. The two known local Vercel analytics notices remain the only recorded console exceptions. New evidence is separate in `evidence/floating-nav-20260918/`.

[Fact] The user's existing in-app preview was reloaded and visually verified. The production preview remains at port 3003.

## Browser review follow-up: tighter corner geometry

[Fact] KC requested a slightly boxier interface. Shared Kosh corner tokens now use 8px for the floating navigation surface and 4px for its active marker, navigation links, buttons, search, filters, resource hover surfaces and numbered research-path nodes. Studio controls and the workspace theme button share the same 4px geometry. Existing square editor/content surfaces remain square. The continuous fourteen-second border shine and all layout dimensions are preserved.

[Fact] The final corner and motion changes passed the production build, lint, TypeScript and whitespace checks. The live local preview was inspected for the 8px/4px geometry and continuously advancing fourteen-second shimmer. The evidence folders above record earlier design checkpoints, before these last corner and motion refinements.

## Authorized publication

[Fact] KC requested commit, push and deployment on 2026-09-18. The release combines these scoped Library changes with the existing remote homepage revision `6c7fc6a3`, preserving that work. No database migrations, account changes or provider configuration are included.

[Fact] GitHub records a successful Vercel Production deployment for remote revision `6c7fc6a3`. Publish through that existing Git integration and verify the resulting commit status and production browser. The Vercel account currently connected to the local CLI and connector is `kramaniti-studio`; it does not expose the production Kramaniti project, so direct project logs may be unavailable. Record the actual new release SHA, deployment URL and verification result in the task's final report.

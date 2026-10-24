# Spasht contextual UI execution plan — 24 October 2026

[Fact] KC requested less text, a stronger product interface, application of the KramanitiUI skill, an executable plan and deployment. Current remote main is ed903e2; the older local Clarity Square preview is stale. Website Steward leads; Documentation Steward and Proof/Governance responsibilities are handled within this task. No parallel editing or data changes are needed.

## Interaction contract

- Primary task: choose the right tool, act on the current project, return without rebuilding context.
- Persistent anchor: Home / Projects / Tools, current tool icon/name and the owned project when one is selected. Keep current Spasht routes and legacy redirects.
- Compact state: one tool bar with Change tool and Exit tools; no directory paragraphs. Expanded state: a searchable icon-and-label palette, grouped into Think / Work / Review. Selection replaces the palette with the actual existing workspace. Nine tools remain reachable.
- Trigger and exit: Tools opens the palette. Change tool expands it above the current workspace; Escape closes the palette and restores trigger focus. Exit tools returns to the originating project/tab or Home. No modal focus trap. A closed palette has no tabbable hidden controls.
- Persistence: domain state remains in the owning Spasht component, outside the palette; switching tools preserves assistant input, task filters, loop state, selected project and pending reviewed actions. Existing URL/back/reload semantics stay intact.
- Keyboard: native buttons and search; Escape closes the innermost palette; tool selection focuses its persistent tool heading; close returns focus to the relevant anchor. No custom listbox.
- Narrow screens: three-column icon controls with short visible labels and full accessible names, no paragraph directory or overlay; wrapping context label and reachable exit. Maintain primary navigation at every breakpoint.
- Empty/loading/error: search has a clear no-match/reset state. Existing real workspace loading/save/error/retry/approval controls remain. Community remains labelled Local preview; automated digests remain unconnected.
- Motion: brief opacity/translation for palette and workspace entry; reduced motion removes movement. Do not animate editors or remount domain state.

## Execution and acceptance

1. [x] Replace the nine-description Tools directory with a shared compact/expanded tool controller and contextual counts.
2. [x] Tighten Home/recent projects, tool page headings and loop workspace chrome; put explanatory material behind explicit disclosures while retaining real content and capabilities.
3. [x] Verify open/switch/close/reopen, draft and project ownership, Escape/focus, search/empty state, rapid switching, all nine tools, saved/failed writes and reviewed actions. Inspect desktop and 820/747/390/320 px, light theme and reduced motion.
4. [x] Run lint, TypeScript, Spasht and Kosh tests and production build. Record fixture versus hosted evidence separately.
5. [x] Commit scoped changes and merge the passing PR (#44). Run the production release through the existing Git integration. Final exact-SHA status, public-route/API/browser verification and the keyboard-focus follow-up are recorded in the calling task release outputs. Do not alter credentials, schema, email delivery or unrelated Kosh PRs.

## Capability preservation

Guided path, brief, all five loops, aggregate tasks, assistant threads/context/settings/actions, organiser/folders/reports/messages, overview, editable memory, local community examples, account settings, Home and project Conversation/Next steps/Details remain functional. This changes access and presentation; it does not delete saved features or records.

## Local execution evidence

[Fact] Lint, TypeScript, 20 Spasht tests, 35 Kosh tests and a 121-page production build passed. The full controlled browser suite passed on the final build, including all nine tools, five loops, owned project/tab continuity, confirmed/failed saves, stale/duplicate action safeguards, search/no-match/reset, Escape/focus return, input preservation, rapid toggles, system light preference and reduced motion. Desktop and 820/747/390/320 px screenshots were inspected; phone tools use a three-by-three grid and fit above fixed navigation in the tested viewport. The product retains its existing dark workspace under the system light preference.

[Fact] Browser auth, data, email and provider responses are fixtures. These checks establish the interface behaviour and preserve existing security checks; they do not establish real email delivery or two-device authenticated member behaviour. No live member write was needed for the UI implementation. Production confirmation is recorded in the task's release outputs.

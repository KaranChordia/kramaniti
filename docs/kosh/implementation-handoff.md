# Kosh resource library: implementation and release handoff

Date: 2026-09-05
Status: local implementation. Not committed, pushed, deployed or migrated.
Lead: Website Steward. Content and review responsibilities: Narrative Editor, Proof and Governance Auditor, Documentation Steward.

## What is implemented

[Fact] Public catalogue with text search, format filtering, compact view, complete resource pages and a three-step Research a decision collection. All six original resources have setup guidance, a working template, an illustrative example, review criteria and limitations. Canonical Markdown drives reading and downloads.

[Fact] The resource page provides an editable working copy, Markdown export, comparison with the original, explicit save/update/delete actions, private favourites, context selection and inline member access. Workspace Saved links reopen the selected copy. Copies retain source version 1.1; later originals do not overwrite them. Unsaved edits receive a navigation warning. Signing out or switching accounts clears private in-memory state. Guest manual edits survive sign-in.

[Fact] Account UI supports sign-in, signup confirmation messaging and recovery-link requests. `/library/account` accepts Supabase PASSWORD_RECOVERY events and offers a password update form. Public reading permits user zoom; account/workspace routes are marked noindex.

[Fact] Adaptation authenticates the session, reads only the selected RLS-scoped saved profile or explicitly supplied per-resource context, excludes demonstration material, and returns an ephemeral draft. No content is saved unless the user chooses Save privately. The model has no tools. Incomplete responses are rejected. The draft always requires human review; structural validation is not a guarantee of factual correctness.

[Recommendation] Initial model limit: 10 attempts per authenticated user per UTC day, shared across server instances. Failed model attempts count. Cancelling browser waiting does not guarantee the server request was cancelled. No streaming or automatic model retries.

## Kosh-only database change, pending approval

Destination must be verified as Kosh project `sqrhwxjgyuqmjsclgmvt`.
Never apply this migration to Platform `bpvbnxqtfwrsmrpvcepc`.

File: `docs/kosh/migrations/20260905_working_copies.sql`.

The SQL creates:

- `kosh.working_copies`: private content, display title, canonical resource id/version, context kind and timestamps. Owner-scoped RLS for select/insert/update/delete. Auth-user deletion cascades to copies.
- `kosh_private.adaptation_usage`: a per-user daily attempt ledger with no stored prompt or context. Direct member access is revoked.
- `kosh.consume_adaptation_attempt()`: an authenticated invoker wrapper around the atomic helper in the non-exposed `kosh_private` schema, with fixed search paths. Returns false after ten attempts that UTC day.

[Fact] The file lives outside `supabase/migrations` to prevent accidental application to Platform. No remote SQL was executed. Generation fails closed with a useful 503 if its quota function is missing. Missing copy storage leaves manual editing and export available and displays an explicit availability message.

## Release sequence

1. Review the local pages and approve the content/UI changes.
2. Verify the connected database destination and apply the migration only to Kosh.
3. With two controlled member accounts, verify each can create, reopen, edit, rename and delete only its own copies and cannot read/write the other's rows. Verify anonymous table access is denied. Exercise concurrent quota calls: exactly ten succeed for a fresh user/day; later calls fail. Ensure public access to the function is revoked and authenticated calls work.
4. Verify the existing Kosh project exposes the `kosh` schema. Verify public Kosh environment variables and the server-only Groq key without printing secrets. No Platform environment changes are needed.
5. Ensure the Kosh Supabase redirect allowlist includes the approved production `/library/account` recovery URL and permitted confirmation return URLs. Use an explicitly authorised test mailbox to verify recovery delivery, valid/expired links, password update, sign-in, refresh, and sign-out. Do not disable confirmation to bypass this check.
6. Test actual adaptation with a clearly labelled, non-sensitive test context. Verify selected context, error recovery, source boundaries, saved version and output review. Test provider failures and limits.
7. Obtain explicit approval before commit/push and publication; deploy the approved revision, then verify its public routes and authenticated flow on the production alias.

Formal reuse/redistribution terms remain a separate founder decision. No compatibility badge or performance claim is asserted. Installable plugin packages, a marketplace, teams and workflow execution are outside this milestone.

## Local verification

- `npm run lint`
- `npx tsc --noEmit`
- `npm run test:kosh` (10 tests; Node 26 used for TypeScript stripping and experimental module mocks)
- `npm run build`
- `git diff --check`

[Fact] Read-only live inspection confirmed the destination is the active Kosh project and that `profiles` and `template_bookmarks` have RLS enabled. The working-copy table, private quota schema and quota function are absent. No user rows or private context were read.

[Fact] The prepared SQL was executed in an isolated local PGlite PostgreSQL runtime using synthetic auth identities. Tests passed for initial execution and re-run, owner create/read/update/delete, cross-user read/update/delete denial, ownership reassignment denial, anonymous table/function denial, private-ledger access denial, the ten-attempt cap and separate user quotas. This is not a live Supabase or multi-connection concurrency test. Re-run with `KOSH_PGLITE_MODULE=/tmp/kosh-db-qa/node_modules/@electric-sql/pglite/dist/index.js node tests/kosh-database.mjs` from `website/`. The test runtime was installed in `/tmp`, not added to application dependencies.

[Fact] Unit and mocked route tests cover every resource's required sections, separation of sample facts, selected profile boundaries, malformed requests, expired sessions, quota errors/exhaustion, custom context, and truncated or structurally incomplete generation. Test doubles do not establish live Supabase RLS correctness or model quality.

[Fact] Desktop and 390px in-app browser checks covered public reading, catalogue search/reset, keyboard resource activation, editable copy state, comparison, unsaved-navigation protection and recovery-form entry. No account was created, recovery email sent or password changed. Saved-copy and live model checks remain pending the release sequence above.

[Unverified] The in-app browser did not produce a file-download event for a client-generated Blob despite the click handler running. The Copy Markdown handler also resolved, but the automation clipboard read did not confirm its content. Verify copy/export in a regular browser before release. Public Markdown assets and their content are covered by resource tests and route checks.

[Fact] The prebuild HQ sync output was restored to its pre-task bytes to avoid bundling unrelated repository-pulse changes. The earlier local `workspace.module.css` changes are preserved; the new workspace uses `editorial.module.css`.

Preview: `http://127.0.0.1:3000/library` (owned local Next dev process; kept running for review).

## Visual refinement, 5 September 2026

[Fact] Applied KC’s requested blend of the earlier tile browsing and the new detailed resources. The homepage uses Kramaniti’s gold circuit geometry and atmospheric background, format shortcut tiles, and a catalogue before the collection feature. Resource tiles are shared by the catalogue, favourites and related resources. Collections, reading navigation and working-copy panels follow the same framed treatment.

[Fact] Format shortcuts carry a shareable query filter; compact browsing remains available. Desktop and narrow mobile previews were visually inspected, including filtering and navigation from a compact tile to its resource. No horizontal overflow was observed on the checked mobile pages. Lint, TypeScript and production build passed. These refinements are local; the database migration and publishing remain pending approval.

## Established design rebalance, 5 September 2026

[Fact] KC requested a stronger return to the established Kosh design while keeping the functional improvements. Compared the committed landing/workspace components and existing styles, then restored the original headline and left alignment, square frames, subdued surfaces, centred resource titles and visible category buttons with counts. Kept the circuit backdrop at reduced opacity, public catalogue, shareable resource routes, collections and working-copy tools.

[Fact] Desktop and narrow mobile previews inspected; category switching returned the expected two Skill resources, and the checked mobile catalogue had no horizontal overflow. Lint, TypeScript, production build and diff checks passed. Preserved the user’s open unsaved resource draft and reviewed in a separate tab. Local changes only.

## Release authorization, 5 September 2026

[Fact] KC authorized committing and pushing the completed Kosh website work. The separate database migration has not been applied: private working-copy persistence and quota-backed AI adaptation remain unavailable until that migration is approved and applied. Public browsing, original downloads and local editing are included in this release. The earlier unused workspace stylesheet edits remain preserved locally outside this commit.

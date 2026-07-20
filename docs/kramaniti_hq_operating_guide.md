# Kramaniti HQ Operating Guide

Date: 2026-07-20  
Route: `/hq`  
Database schema: `kramaniti_hub`

## 1. Purpose

[Fact] Kramaniti HQ is the founder-only tracking centre for Kramaniti's company priorities, client and relationship portfolio, shared tasks, follow-ups, founder actions and sanitized repository activity.

[Fact] HQ is a separate operating experience from Client Hub while reusing its authentication, workspace and Supabase foundation. Client Hub remains the scoped delivery workroom shown to each client. HQ is the cross-workspace company view and is not client-visible.

## 2. Current working surface

[Fact] `/hq` includes:

- an owner-authenticated daily overview;
- a client-focus rail that scopes the interface to one workspace;
- a priority-ordered portfolio covering Kramaniti, Maitri Circle, Basispoint Studio, Trust Data and Raju Bafna;
- read-only operating records for stage, health, priority, current state, next action, external dependency, contact and follow-up timing;
- a read-only owner action list;
- a simple shared task manager backed by the existing Client Hub task table;
- a workspace-scoped natural-language task assistant for creating, modifying, completing, reopening and archiving shared tasks;
- read-only counts from existing Client Hub delivery projects and tasks;
- a sanitized repository pulse for the five explicitly allowlisted local directories;
- Realtime refreshes for HQ portfolio records, founder actions and existing delivery work;
- private `noindex` metadata and suppression of the global public assistant.

[Constraint] HQ may create and update shared workspace tasks only. It does not edit portfolio records, founder-only actions, repositories or publishing state.

[Constraint] Shared tasks are visible to authenticated members of their selected workspace. Clients can view their workspace tasks, while task creation and updates are restricted to owner and collaborator roles. Clients use Client Hub rather than the cross-client HQ route.

[Constraint] The HQ task assistant is owner-only and can act only inside the workspace selected in the client-focus rail. Task and project identifiers are revalidated on the server before every operation, and applied actions are written to the assistant audit trail.

## 3. Privacy and authority boundaries

[Constraint] Only a `kramaniti_hub.profiles` record with the global `owner` role can read or change `hq_portfolio_items` and `hq_actions`. Both tables have RLS enabled and explicit owner-bound select, insert, update and delete policies.

[Constraint] Founder actions are not stored as Client Hub delivery tasks. This prevents commercial notes, relationship follow-ups and cross-client priorities from becoming visible if a client is later added to a delivery workspace.

[Constraint] Repository pulse data is allowlist-first and metadata-only. It excludes file contents, absolute paths, remote URLs, secrets and credentials. Repository truth and business truth remain separate:

- repositories own code, documents, commits and working-tree state;
- HQ owns priority, relationship context, next actions and commercial stage;
- Client Hub owns client-visible delivery tasks, notes, messages and approvals.

## 4. Repository pulse workflow

The source allowlist lives in `kramaniti-hq.config.json`. Paths are stored relative to the Kramaniti repository and generated output never includes resolved machine paths.

Refresh the local pulse:

```bash
cd website
npm run hq:sync
```

For a continuous local refresh every 60 seconds:

```bash
cd website
npm run hq:watch
```

`npm run dev` and `npm run build` refresh the pulse before starting. The generator avoids rewriting the manifest when repository state has not changed.

HQ reads the generated local snapshot directly. There is no publish control in the interface. Starting or building the website runs a fresh scan; `npm run hq:watch` keeps regenerating the local snapshot every 60 seconds while the watcher is running. This is snapshot-based tracking, not a hosted realtime repository connection.

## 5. Daily operating rhythm

1. Open **Today** to regain context on current actions and external dependencies.
2. Open **Projects** to compare recorded stage, signal, next action and repository movement.
3. Open **Repositories** to confirm when the local snapshot was generated and what changed in each allowlisted directory.
4. Make any required change in the appropriate source system or repository, not in HQ.
5. Run `npm run hq:sync` for an immediate local refresh, or keep `npm run hq:watch` running during an active review session.

## 6. Verification completed

[Fact] On 2026-07-20:

- targeted ESLint passed;
- `npx tsc --noEmit` passed;
- `npm run build` passed and generated `/hq`;
- the production `/hq` route returned HTTP 200 with `noindex, nofollow, noarchive`;
- the former HQ repository-publishing endpoint was removed with the read-only product boundary;
- the live Supabase project contained five seeded portfolio records and five starter founder actions;
- both HQ tables reported RLS enabled with four policies each;
- both HQ tables were added to the `supabase_realtime` publication.

## 7. Deliberately deferred

[Recommendation] Use the current HQ daily before adding more surface area. Potential later layers are:

- scheduled follow-up notifications;
- GitHub push and deployment webhooks alongside the local pulse;
- a private daily briefing assistant that drafts but does not silently change records;
- calendar linkage after the operating rhythm proves useful;
- cash-flow or invoice visibility only after finance data has a separate, explicit privacy model.

Do not add generic dashboards, automatic task creation from every code TODO, autonomous relationship messaging, file-content indexing or cross-client analytics merely because the underlying data exists.

# Spasht release and rollback

[Fact] KC approved the spelling Spasht and canonical identifier `spasht`. This task implements the rebrand locally; publishing and hosted schema/configuration changes require separate approval. Website Steward leads with governance and documentation responsibilities handled in one task.

## Owning implementation

[Fact] Base: `80ea3c8`, merged PR #35, includes PR #34's Kosh assistant and the reviewed feature restoration. Remote main matched this commit at inspection. Worktree: `/Users/karanchordia/.codex/worktrees/spasht-rebrand/kramaniti`, branch `codex/spasht-rebrand`. The primary checkout and the restoration checkout were not edited.

[Fact] Read-only hosted metadata on 14 October 2026 confirmed Platform `bpvbnxqtfwrsmrpvcepc` owns nine product tables in `clarity_square`. Kosh `sqrhwxjgyuqmjsclgmvt` remains separate. No member records were read. Hosted exposure includes `kramaniti_hub`; the migration preserves that list.

## Capability inventory

| Capability | Result |
| --- | --- |
| Home and reviewed project creation | Retained; Spasht identity |
| Projects, conversations, details and next steps | Retained; same IDs and records |
| Review receipts and one-time approvals | Retained; immutable hash namespace |
| Guided path, Clarity Brief, five loops and scans | Retained in Tools |
| Cross-project tasks and workspace assistant | Retained in Tools |
| Folders, reports and project organiser | Retained in Tools |
| Memory editing, archive, deletion and privacy controls | Retained |
| Overview, account and assistant preferences | Retained |
| Community examples | Retained; canonical `community` view, local preview disclosure |
| Clarity Engine diagnosis and blueprint save-back | Retained; old saved handoffs and payloads readable |
| Kosh, HQ and Client Hub | Separate boundaries preserved |
| Parent mark, Comfortaa and gold palette | Preserved; existing mark bytes renamed |

## Local migration and compatibility

[Fact] `supabase/migrations/20261014175903_spasht_rebrand.sql` renames the existing schema in a transaction. Tables, UUIDs, ownership, grants, constraints and Realtime publication membership remain attached to existing objects. Function bodies/search paths and product policy/index/trigger names are repaired. New event writes use `community_post`; old `square_post` events remain valid and unchanged.

[Fact] Temporary `clarity_square` invoker views copy existing table grants and enforce underlying RLS; the old login RPC forwards to the renamed function. Old page URLs redirect to `/spasht`; old API URLs rewrite without losing POST bodies. Old browser storage and Engine handoffs migrate on read; original snapshots remain for recovery and all are cleared on sign-out. Saved non-default thread IDs and approval receipts remain immutable. New OAuth token prefixes and scopes use Spasht; existing encrypted tokens/codes and widget resource URIs are accepted.

[Constraint] Invoker views do not provide Realtime subscriptions under the old schema or PostgreSQL `ON CONFLICT` upserts. Cached old tabs must refresh during cutover; this is a coordinated release, not a claim of seamless old-client operation. Existing saved records remain intact. Maintain a short write pause, preserve unsaved drafts, and verify the new build before resuming writes. No compatibility views may be removed until old clients have aged out and hosted checks pass.

## Concrete approval scope and order

1. Approve this local diff, forward migration, rollback and deployment/configuration changes. Take a hosted backup and record table counts, object IDs, RLS policies, grants, publication membership and exposure configuration without exporting private content into Git.
2. Inspect the existing website and manager Vercel project bindings and production SHA. Update their source directories as needed (`website` and `website/spasht-chatgpt-app`). Reuse existing projects; do not create replacement account databases or invent a working new manager domain.
3. Add the canonical `/spasht/` origin URLs to Supabase Auth signup/recovery allowlists, retaining old callbacks. Inspect email templates for product wording and change only approved product text; preserve unrelated Platform/HQ/Kosh settings. Add Spasht metadata to the existing ChatGPT connector. Keep `OAUTH_TOKEN_SECRET` and the current manager `APP_ORIGIN` stable initially so existing tokens retain issuer/audience continuity.
4. Arrange a brief write pause and ask active clients to refresh after cutover. Apply the migration only to Platform, with an authorized role that can rename the `auth.users` profile trigger. Insufficient privilege aborts the transaction; do not silently skip objects. Verify `spasht` is exposed and the other schemas remain exposed in the hosted control plane.
5. Publish the website and existing manager together. The new application requires the migration; publishing first would break account reads. Verify the actual production alias and commit, both old routes, POST API compatibility, OAuth discovery and public metadata.
6. Use explicitly selected disposable accounts to test signup, username login, confirmation, recovery, existing project/save/reload, tasks, conversations, memory, approvals and Engine report save-back. Test a second account for isolation and a second device for persistence/Realtime. Local fixtures do not substitute for these hosted checks.
7. Record hosted verification and residual external wording/registrations. Retire compatibility only in a later approved migration after retention evidence; permanent page redirects stay.

[Unverified] Hosted auth templates, live manager registration/project ownership, custom manager aliases, email delivery, real hosted saves and production cutover were not changed or validated in this task. Proposed `spasht-chatgpt-app.vercel.app` is a target, not a verified live URL. The parent Kramaniti PWA manifest remains Kramaniti; it contains no legacy product name. Its service-worker cache version is bumped to retire cached old branding at activation. Hosted installation/offline behavior remains a release-time check.

## Rollback

[Recommendation] Pause writes, revert application deployments to `80ea3c8`, execute `docs/spasht/rollback.sql` in the same controlled window and refresh clients. The rollback drops only the temporary views/RPC/schema using RESTRICT, renames the same table objects back and repairs functions/policies/indexes/triggers. Unexpected dependencies abort the transaction. Events written with `community_post` remain accepted; member records are never deleted. Restore auth/configuration settings only from the recorded pre-release values. Do not rotate OAuth secrets as part of a brand rollback. The forward migration has been tested after rollback for reapplication; reconcile hosted migration history deliberately before reapplying.

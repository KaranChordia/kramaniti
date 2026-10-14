# Spasht release handoff — 15 October 2026

[Fact] KC approved publication. PR #36 is merged; website and manager are live. Owning worktree: `/Users/karanchordia/.codex/worktrees/spasht-rebrand/kramaniti`. Primary checkout's unrelated changes remain intact.

[Fact] Hosted migration version `20261014184930` matches the repository filename. All nine table object identities, RLS and record hashes were preserved. Auth callbacks are saved; manager production domain and project use Spasht. Keep legacy read adapters, old OAuth origin and the Supabase-managed trigger-name exception.

Read `docs/spasht/production-release-2026-10-15.md`, `docs/spasht/release-plan.md` and rollback before subsequent changes. No private recovery contents or credentials belong in Git. The private logical backup is outside the repository.

[Unverified] Real-user email delivery, ChatGPT OAuth consent/user-specific connector names, two-device authenticated save/return and PWA offline behavior. Production browser fixture was partially blocked by the existing Vercel anti-bot checkpoint; local complete fixtures and hosted rollback-only database checks passed.

[Fact] The fixture-only local preview is no longer needed after publication; retain the public Spasht browser tab.

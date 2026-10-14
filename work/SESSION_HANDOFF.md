# Spasht handoff — 14 October 2026

Worktree: `/Users/karanchordia/.codex/worktrees/spasht-rebrand/kramaniti`; branch `codex/spasht-rebrand`; base `80ea3c8` (restoration PR #35).

Local rebrand implemented across routes, UI, code, browser-state adapters, assets, manager/OAuth, metadata, docs and reversible schema migration. Primary dirty work preserved. No live writes or deployment.

Read `docs/spasht/release-plan.md` and `docs/spasht/verification.md` before release. Existing code targets the renamed schema; do not publish before applying approved migration. Compatibility views retain RLS and ordinary writes; cached clients require refresh for upserts/Realtime. Keep Platform/Kosh distinct.

Local preview: owned Next production server at `127.0.0.1:3017`, fixture-only public key. Hosted account verification is still required after approval. Do not copy this fixture environment to a deployment.

# Spasht verification — 14 October 2026

[Fact] Final local build and lint pass; explicit `npx tsc --noEmit` passes. The standalone manager's typecheck passes and its dependency audit reports zero vulnerabilities after seven compatible dependency updates. Kosh's 35 tests pass unchanged. Spasht has 20 passing unit/route/security/compatibility/OAuth tests.

[Fact] Controlled Chromium browser fixture on the production build passes 50 recorded operations across Home/project creation, conversations, editable project details, tasks, memory, draft reload, stale-draft rejection, one-time approval, failed-save recovery, archive/restore, email/password signup and recovery, nine supporting Tools destinations, five loops, cross-project tasks, explicit folders, organiser navigation, local community examples, account preferences and project-tab return. Widths: 320, 390, 747, 820 and 1440 CSS pixels. Keyboard tabs, native Back, URL continuity and reload were checked. Both page entry names redirect to Spasht; old API POSTs reach the canonical handler without a redirect or dropped method. Canonical metadata, sitemap and llms links use Spasht.

[Fact] The browser fixture blocks/intercepts Supabase HTTP and closes its WebSocket connections. Assistant requests are intercepted. No real account writes, provider prompts or emails are sent. Signup/confirmation/recovery are controlled fixture checks, not hosted delivery claims. Local preview public settings use a synthetic key; do not publish this `.env.local`.

[Fact] A local PGlite PostgreSQL fixture executes the historical product migrations, then the forward migration. It compares rows for all nine tables, retains table object identity, checks new auth signup triggers and the old username-login RPC, checks same-owner old-view writes, blocks another owner's insert, preserves the Client Hub exposure entry, rolls back without deleting records and reapplies the migration. This validates SQL behavior, not hosted control-plane privilege, PostgREST upsert discovery or live Realtime. Those are release gates.

[Fact] Visual inspection covered final desktop Home/project screenshots and narrow project/Tools layouts. The gold product asset has the exact SHA-256 of the predecessor asset: `bc9ced5e3ee6cb8575cd2f7c324e756aa46b45c7c7a5eb2d1e35b5ad078a9b10`. Comfortaa and `#C9A84C` remain intact. The parent PWA retains Kramaniti identity; its cache version changes to retire old offline branding.

[Fact] `python3 scripts/audit-spasht-references.py` inventories legacy text, generic Square/Circle identifiers and historical references with exact matching lines. No unaccounted references remain. Historical migrations, recovery patches and dated decisions were not rewritten. The approved restoration and primary unrelated edits were preserved.

## Reproduce

From `website/`:

```sh
npm run lint
npx tsc --noEmit
npm run build
npm run test:spasht
npm run test:kosh
SPASHT_TEST_ORIGIN=http://127.0.0.1:3017 node tests/spasht-http.mjs
SPASHT_PLAYWRIGHT_MODULE=/absolute/path/to/playwright SPASHT_TEST_ORIGIN=http://127.0.0.1:3017 node tests/spasht-browser.mjs
SPASHT_PGLITE_MODULE=/absolute/path/to/@electric-sql/pglite node tests/spasht-migration.mjs
```

From the manager folder run `npm run typecheck` and `npm audit`. Browser and migration helpers accept external tooling paths so they do not add production dependencies. The browser fixture requires a Chrome installation and the synthetic Platform URL/public key described above.

[Unverified] Real hosted accounts, multi-device persistence, emails, production deployment/configuration, ChatGPT authenticated reads/writes and installed/offline PWA behavior remain to be verified after approval. The compatibility limitation for old cached upserts/Realtime is documented in the release plan.

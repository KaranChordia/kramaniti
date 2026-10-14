# Spasht production release — 15 October 2026

[Fact] KC explicitly approved committing and publishing the complete rebrand. PR #36 merged as `5af5306`, including the reviewed restoration and full product rebrand. The primary checkout's unrelated changes were preserved.

[Fact] The Platform migration succeeded under hosted version `20261014184930`. The repository filename is reconciled to that actual applied version; SQL contents are unchanged. Nine existing tables retained their OIDs, RLS and identical full-row hashes immediately across the rename. All 32 policies and seven Realtime table memberships remain present. The old schema contains nine security-invoker compatibility views, not duplicate account data. The existing exposure list retains `kramaniti_hub` and includes `spasht`.

[Fact] Platform is on the free plan without scheduled backups. A private logical recovery snapshot was saved outside the repository before migration; no private member contents were placed in Git or printed for review. Recovery uses the snapshot plus existing schema history/rollback; this is not a full hosted Auth/database backup.

[Fact] A hosted PostgreSQL transaction with two synthetic, explicitly named fixture accounts checked owned project/task save/update, legacy view ownership and cross-account denial. All fixture records were rolled back. This exercises hosted database policies and triggers; it does not claim persistent browser login, provider email delivery or multi-device behavior.

[Fact] Six exact production Auth callbacks were added for Spasht and both predecessor entry paths, on apex and www origins. The shared default Site URL was left unchanged. The provider currently uses default email templates; there is no custom predecessor product wording to rewrite, and no custom SMTP is configured.

[Fact] The existing Vercel manager project `prj_w32qDDHuA60x8sPEKbVXmeUralr3` was renamed to `spasht-chatgpt-app`, preserving its identity and OAuth secret. Its Supabase configuration is explicitly aligned to Platform's URL and active publishable key. The tested production deployment is `dpl_BacyfEJgt9uk8o71nH82TfP2YRwc`; both the new `spasht-chatgpt-app.vercel.app` alias and existing Circle alias route to it.

## Explicit hosted exceptions

- [Fact] Supabase owns `auth.users`; the migration role cannot rename its cosmetic `clarity_square_create_profile_on_auth_signup` trigger. The hook retains the same function OID, now under `spasht`. Other migration privilege failures still abort.
- [Fact] The existing Circle manager OAuth origin/resource identity remains stable in `APP_ORIGIN` for saved connections. The new canonical host, server name, login wording and scopes use Spasht. Circle/Square scope inputs, token prefixes and widget URIs remain read adapters. This hostname is an integration identity exception, not an unrenamed product label.
- [Constraint] Cached old clients must refresh for new-schema Realtime and conflict-based upserts. Legacy view/API compatibility does not claim seamless stale-client behavior.
- [Unverified] User-specific ChatGPT connector display names/registrations and a real user's OAuth consent/login flow are not asserted changed by the server/project rebrand. Existing connector tokens are supported, but a real connected-client check is still needed.

[Unverified] Real signup/confirmation email delivery, a user's browser save/return on two devices and installed/offline PWA behavior need user-account verification. Local fixtures and hosted rollback-only SQL checks are reported separately.

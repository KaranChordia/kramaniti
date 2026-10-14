# Spasht production release — 15 October 2026

[Fact] KC explicitly approved committing and publishing the complete rebrand. PR #36 merged as `5af5306`, including the reviewed restoration and full product rebrand. The primary checkout's unrelated changes were preserved.

[Fact] The Platform migration succeeded under hosted version `20261014184930`. The repository filename is reconciled to that actual applied version; SQL contents are unchanged. Nine existing tables retained their OIDs, RLS and identical full-row hashes immediately across the rename. All 32 policies and seven Realtime table memberships remain present. The old schema contains nine security-invoker compatibility views, not duplicate account data. The existing exposure list retains `kramaniti_hub` and includes `spasht`.

[Fact] Platform is on the free plan without scheduled backups. A private logical recovery snapshot was saved outside the repository before migration; no private member contents were placed in Git or printed for review. Recovery uses the snapshot plus existing schema history/rollback; this is not a full hosted Auth/database backup.

[Fact] A hosted PostgreSQL transaction with two synthetic, explicitly named fixture accounts checked owned project/task save/update, legacy view ownership and cross-account denial. All fixture records were rolled back. This exercises hosted database policies and triggers; it does not claim persistent browser login, provider email delivery or multi-device behavior.

[Fact] Six exact production Auth callbacks were added for Spasht and both predecessor entry paths, on apex and www origins. The shared default Site URL was left unchanged. The provider currently uses default email templates; there is no custom predecessor product wording to rewrite, and no custom SMTP is configured.

[Fact] The existing Vercel manager project `prj_w32qDDHuA60x8sPEKbVXmeUralr3` was renamed to `spasht-chatgpt-app`, preserving its identity and OAuth secret. Its Supabase configuration is explicitly aligned to Platform's URL and active publishable key. The tested production deployment is `dpl_C5tPQX3SRUEKgxbEojo7fRz3xRTF`; both the new `spasht-chatgpt-app.vercel.app` alias and existing Circle alias route to it.

## Explicit hosted exceptions

- [Fact] Supabase owns `auth.users`; the migration role cannot rename its cosmetic `clarity_square_create_profile_on_auth_signup` trigger. The hook retains the same function OID, now under `spasht`. Other migration privilege failures still abort.
- [Fact] The existing Circle manager OAuth origin/resource identity remains stable in `APP_ORIGIN` for saved connections. The new canonical host, server name, login wording and scopes use Spasht. Circle/Square scope inputs, token prefixes and widget URIs remain read adapters. This hostname is an integration identity exception, not an unrenamed product label.
- [Constraint] Cached old clients must refresh for new-schema Realtime and conflict-based upserts. Legacy view/API compatibility does not claim seamless stale-client behavior.
- [Unverified] User-specific ChatGPT connector display names/registrations and a real user's OAuth consent/login flow are not asserted changed by the server/project rebrand. Existing connector tokens are supported, but a real connected-client check is still needed.

[Unverified] Real signup/confirmation email delivery, a user's browser save/return on two devices and installed/offline PWA behavior need user-account verification. Local fixtures and hosted rollback-only SQL checks are reported separately.

## Public verification

[Fact] The website production alias serves Spasht with canonical metadata, sitemap and llms links. Both predecessor page URLs return permanent redirects preserving view/project query parameters; both predecessor POST API paths reach the authenticated canonical handler without a method-losing redirect. These HTTP checks passed on `www.kramaniti.com`.

[Fact] The canonical manager hostname is registered as a verified production domain on the existing project, not only a protected alias. Anonymous root requests return 200 with Spasht wording. MCP initialization returns `kramaniti-spasht-manager`; the public tool catalogue uses Spasht without Circle/Square display names. The old manager hostname reaches the same production deployment. New and legacy hosted username-login RPCs both return the expected null result for a synthetic nonexistent username, confirming actual Data API exposure.

[Fact] A normal in-app browser verified the public product and account-entry screen. The controlled production-bundle browser fixture completed the project/save/review, all supporting tools and responsive tools checks before Vercel's anti-bot checkpoint interrupted an account-preference reload (Code 21). This is partial production browser evidence; it is not recorded as a fully passing suite. The unchanged complete local fixture suite remains passing. Firewall protections were not disabled.

[Fact] The fixture tests do not send real provider prompts or emails or persist real account writes. The rollout-only hosted database fixture was rolled back. User-specific email/OAuth/two-device checks remain the explicitly stated limits above.

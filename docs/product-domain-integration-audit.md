# Product-Domain Integration Audit

Date: 2026-11-03

Status: Local audit and callback hardening complete. Hosted configuration remains unchanged and unverified.

Related plan: [`product-domain-migration-plan.md`](./product-domain-migration-plan.md)

## Findings

### Kosh

- Kosh uses the product-specific Supabase environment variables `NEXT_PUBLIC_KOSH_SUPABASE_URL` and `NEXT_PUBLIC_KOSH_SUPABASE_PUBLISHABLE_KEY`.
- Password recovery now uses `/account/` on `kosh.kramaniti.com` and `kosh.localhost`, while retaining `/kosh/account/` on the legacy main-site path.
- Signup confirmation continues to use the current page URL, preserving the actual host and route.
- Kosh discovery checks the browser `Origin` header against the incoming public host; this must be rechecked on the canonical domain in preview/production.
- Kosh private workspace state and guest drafts are not assumed to migrate automatically between the main site and Kosh because browser storage is origin-scoped.

### Spasht

- Spasht confirmation, recovery, and resend flows now use `/` on `spasht.kramaniti.com` and `spasht.localhost`, while retaining `/spasht/` on the legacy main-site path.
- Existing Spasht compatibility code handles legacy browser state, saved payloads, thread values, and handoffs. This remains a compatibility layer, not proof that all origin-scoped browser data will transfer.
- The separate Spasht ChatGPT/MCP manager derives its OAuth origin from `APP_ORIGIN` or deployment origin. Its canonical host and existing OAuth authority must be verified together; no secret rotation or connector change is authorized in this phase.

### Shared PWA and browser state

- The shared PWA runtime registers `/sw.js` with root scope and the shared Kramaniti manifest. Kosh and Spasht should not be treated as independently installable products yet.
- Service-worker cache and installation behaviour on the two future product origins remains an open release-time check.
- No token, private context, or user data is copied through a redirect URL.

## Hosted configuration still required

These are production-gated tasks; they were not performed during this audit:

- [ ] Add canonical Kosh recovery and confirmation URLs to the Kosh Supabase Auth allowlist.
- [ ] Add canonical Spasht recovery and confirmation URLs to the Platform Supabase Auth allowlist.
- [ ] Verify whether existing Spasht OAuth/MCP clients should keep the current authority during transition.
- [ ] Add the canonical manager origin only after the deployment/domain exists and the callback contract is reviewed.
- [ ] Confirm the Vercel project, DNS provider, and environment variables for the shared deployment.

## Controlled verification required after preview domain attachment

- [ ] Kosh signup confirmation, sign-in, sign-out, recovery, password update, refresh, and expired-link behaviour.
- [ ] Kosh authenticated API calls and Origin checks.
- [ ] Spasht signup confirmation, sign-in, sign-out, recovery, password update, refresh, and project/session continuity.
- [ ] Spasht assistant API authentication and POST behaviour.
- [ ] Existing Spasht compatibility routes and connector metadata.
- [ ] Browser storage, PWA registration, service-worker scope, and install behaviour on both product hosts.
- [ ] No cross-product cookie or private-state leakage.

## Evidence limits

- This audit is based on repository code and existing handoff documentation.
- No Supabase dashboard, Vercel project, DNS provider, OAuth registration, real user account, email delivery, or production domain was changed or verified.
- Passing local checks does not establish hosted callback allowlists, provider email delivery, OAuth consent, or real-user session continuity.

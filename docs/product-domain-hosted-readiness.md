# Product-Domain Hosted Readiness

Date: 2026-11-03

Status: Domains attached and DNS records added; application deployment and Supabase/Auth changes remain pending.

## Confirmed Vercel project

- Project: `kramaniti`
- Project ID: `prj_RrU88c8YiensRewhArjr2T4YoaXQ`
- Owner/team: `karanchordia's projects` / `team_1vMT59KOyt37gczEFWMoicRX`
- Root directory: `website`
- Framework: Next.js
- Build command: `npm run build` or `next build`
- Current verified project domains: `kramaniti.com`, `www.kramaniti.com`, `kramaniti.vercel.app`, `kosh.kramaniti.com`, and `spasht.kramaniti.com`

## Current production state

- `https://www.kramaniti.com` responds successfully.
- `https://kramaniti.com` redirects to `https://www.kramaniti.com/`.
- `kosh.kramaniti.com` resolves to `76.76.21.21`.
- `spasht.kramaniti.com` resolves to `76.76.21.21`.
- Both product domains are attached to the Kramaniti Vercel project and Vercel reports both as verified.
- HTTPS requests currently fail during TLS negotiation; certificate provisioning/edge readiness remains to be verified after propagation.
- The domain's current nameservers remain Squarespace nameservers, not Vercel nameservers.
- Squarespace now contains only the two required product records: `A kosh 76.76.21.21` and `A spasht 76.76.21.21`. Existing apex, `www`, Google Workspace, SPF, and DKIM records were not changed.

## Required production sequence

This sequence is still approval-gated:

1. Confirm the current production revision contains the hostname proxy and canonical metadata changes.
2. ~~Add `kosh.kramaniti.com` and `spasht.kramaniti.com` to the existing `kramaniti` Vercel project.~~ Complete.
3. ~~Record the exact DNS challenges/records returned by Vercel.~~ Complete: `A kosh 76.76.21.21`; `A spasht 76.76.21.21`.
4. ~~Add only the required subdomain DNS records at the current DNS provider.~~ Complete in Squarespace.
5. Verify domain ownership and TLS for both hosts. DNS and Vercel ownership are verified; HTTPS is still pending edge/certificate readiness.
6. Deploy the approved revision containing hostname-aware routing, then confirm each host serves the intended product from the shared deployment.
7. Update Kosh and Spasht Supabase Auth allowlists with the canonical callback URLs.
8. Verify real controlled signup/recovery/session flows.
9. Review the Spasht MCP/OAuth authority and connector callback contract before changing it.
10. Perform production route, API, redirect, metadata, and PWA checks.

## Required approval before mutation

Before any of steps 2, 4, 7, or 9:

- [x] KC approved attaching both product domains to the existing Vercel project; both are now attached and awaiting DNS verification.
- [x] KC approved adding the exact DNS records returned by Vercel; both records were added.
- [ ] KC approves the exact Kosh Supabase callback allowlist additions.
- [ ] KC approves the exact Spasht Supabase/Auth and OAuth/MCP configuration changes.
- [ ] The target deployment/revision and rollback route are recorded before publication.

## Important constraints

- Do not change the domain's nameservers as part of this migration; use the smallest required subdomain records at the current DNS provider.
- Do not create new Vercel projects or databases.
- Do not rotate Supabase, OAuth, or connector secrets for a hostname change.
- Do not claim that email delivery, OAuth consent, or user-session continuity works until controlled hosted checks pass.
- Keep legacy `/kosh/...`, `/spasht/...`, and existing callback paths during the transition.

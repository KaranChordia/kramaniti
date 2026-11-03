# Product-Domain Migration Inventory

Date: 2026-11-03

Status: Initial repository inventory. No production systems were changed.

Related plan: [`product-domain-migration-plan.md`](./product-domain-migration-plan.md)

## Proposed host map

| Host | Responsibility | Current implementation |
|---|---|---|
| `www.kramaniti.com` | Main Kramaniti marketing site and shared public content | Root `website/src/app/` routes |
| `kosh.kramaniti.com` | Kosh public library and authenticated workspace | Currently under `/kosh/` in the shared Next.js app |
| `spasht.kramaniti.com` | Spasht workspace and assistant | Currently under `/spasht/` in the shared Next.js app |

This is a proposed canonical map, not a live DNS or deployment statement.

## Kosh route inventory

### Page surfaces

- `/kosh/` — public library landing and discovery
- `/kosh/[id]/` — resource pages
- `/kosh/collections/research-a-decision/` — collection page
- `/kosh/standards/` — resource standards
- `/kosh/account/` — account and recovery UI
- `/kosh/create/` — creation flow
- `/kosh/workspace/` — saved/private workspace

### API surfaces

- `/api/kosh/adapt` — authenticated adaptation flow
- `/api/kosh/discover` — discovery assistant flow
- `/api/kosh/studio/artifacts` — authenticated Studio artifact operations
- `/api/kosh/studio/artifacts/[id]` — artifact read/update/delete operations
- `/api/kosh/studio/artifacts/[id]/versions` — artifact version operations

### Public/download surfaces

- Resource Markdown downloads currently use `/kosh/<resource-id>.md`.
- Resource and Studio links are generated in library data, Kosh JSON-LD, Kosh components, and Studio components.

### Kosh integration findings

- Kosh uses product-specific public Supabase variables: `NEXT_PUBLIC_KOSH_SUPABASE_URL` and `NEXT_PUBLIC_KOSH_SUPABASE_PUBLISHABLE_KEY`.
- Account and recovery behaviour is documented as using `/kosh/account/`; the new host will need an approved recovery/callback URL.
- Kosh has private account/workspace boundaries and must not leak state through redirects or public URLs.
- Existing browser behaviour includes in-memory draft continuity; do not assume path-to-host migration preserves browser state automatically.
- Kosh's product JSON-LD currently builds URLs through the shared `absoluteUrl()` helper and therefore needs a product-origin decision before metadata changes.

## Spasht route and integration inventory

### Page surface

- `/spasht/` — Spasht workspace and product entry

### API surface

- `/api/spasht/assistant` — authenticated assistant endpoint

### Related compatibility surfaces

- `/clarity-square/:path*` redirects to `/spasht/:path*`.
- `/clarity-circle/:path*` redirects to `/spasht/:path*`.
- `/api/clarity-square/:path*` rewrites to `/api/spasht/:path*`.
- `/api/clarity-circle/:path*` rewrites to `/api/spasht/:path*`.
- The Spasht compatibility layer handles older browser-state, saved-payload, thread, and approval-receipt values.
- The Clarity Engine blueprint uses Spasht compatibility and Supabase modules, so it must be tested as a cross-surface handoff rather than treated as an isolated page.

### Spasht integration findings

- Spasht uses the Platform Supabase integration rather than the Kosh-specific Supabase project.
- Existing release documentation identifies Auth callback, OAuth/MCP origin, widget URI, token continuity, and legacy-client compatibility as sensitive areas.
- The current manager/connector identity has deliberate compatibility exceptions; changing the public product host must not rotate secrets or break existing token continuity without a separate approved migration.
- Existing compatibility redirects and method-preserving API adapters should remain available during the hostname transition.

## Shared URL and metadata findings

- `website/src/lib/seo.ts` currently defines `SITE_URL` as `https://www.kramaniti.com`.
- Root metadata in `website/src/app/layout.tsx` uses the shared Kramaniti site URL.
- `website/src/app/sitemap.ts`, `robots.ts`, `llms.txt`, and `llms-full.txt` currently use shared absolute URL helpers.
- Kosh JSON-LD uses shared absolute URLs and currently emits `/kosh/` paths.
- The main navbar, footer, homepage preview, and insight content currently link to product paths on the main site.
- `website/next.config.ts` currently contains path-based legacy redirects and rewrites, but no hostname-aware routing.
- `website/vercel.json` defines the build but does not contain product-domain configuration.

## Redirect matrix — initial scope

The following is the initial migration pattern. The exact route list must be completed before implementation.

| Existing URL pattern | Canonical target pattern | Requirement |
|---|---|---|
| `www.kramaniti.com/kosh/` | `kosh.kramaniti.com/` | Permanent redirect |
| `www.kramaniti.com/kosh/<path>` | `kosh.kramaniti.com/<path>` | Preserve path and query string |
| `www.kramaniti.com/kosh/<resource>.md` | `kosh.kramaniti.com/<resource>.md` | Preserve download behaviour |
| `www.kramaniti.com/spasht/` | `spasht.kramaniti.com/` | Permanent redirect |
| `www.kramaniti.com/spasht/<path>` | `spasht.kramaniti.com/<path>` | Preserve path, query string, and supported state |
| `www.kramaniti.com/api/spasht/<path>` | Product API host or compatibility adapter | Must preserve POST method where required |
| `www.kramaniti.com/clarity-square/<path>` | Spasht canonical host/path | Retain legacy compatibility |
| `www.kramaniti.com/clarity-circle/<path>` | Spasht canonical host/path | Retain legacy compatibility |

Hash fragments are browser-managed and are not reliably forwarded by HTTP redirects. Any flow that depends on a hash—especially recovery or client handoff state—needs a dedicated migration test and, if necessary, an application-level handoff.

## Decisions still required

- [ ] Confirm one shared deployment with hostname-aware routing versus separate product deployments.
- [ ] Confirm whether the main-site product links should become absolute product-host links immediately or remain path links until cutover.
- [ ] Confirm the parent-brand navigation and logo treatment on each product host.
- [ ] Confirm the transition period for old routes and authentication callbacks.
- [ ] Confirm the DNS provider and Vercel project/team that will own the new domains.
- [ ] Confirm the authorised test accounts for Kosh and Spasht authentication verification.

## Initial risk register

| Risk | Impact | Mitigation |
|---|---|---|
| Only the product landing page is moved | Authenticated flows or downloads break | Treat every route/API/download as part of the host migration |
| Shared `SITE_URL` remains unchanged for product metadata | Duplicate or incorrect canonical URLs | Add product-aware metadata and sitemap tests |
| Auth callback allowlists are incomplete | Sign-in/recovery fails on the new host | Update and test callbacks before DNS cutover |
| Browser origin changes discard local state | Drafts, handoffs, or preferences appear lost | Audit storage and add a constrained migration only if needed |
| Spasht connector identity changes unexpectedly | Existing integrations stop working | Preserve token/secret continuity and test compatibility |
| Legacy POST redirects lose the method or body | API clients fail silently | Use method-preserving adapters/rewrite strategy and test POST requests |
| DNS points to the wrong project | Product host serves the wrong application | Verify Vercel project/domain binding before DNS cutover |

## Evidence limits

- This inventory is based on repository files and existing handoff documentation.
- It does not verify current DNS, Vercel, Supabase, OAuth, or production state.
- No credentials, private user records, external configuration, or production deployment were accessed or changed during this inventory phase.

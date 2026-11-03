# Kosh and Spasht Product-Domain Migration Plan

Status: Architecture approved; Phase 1 inventory complete; local routing, canonical boundaries, and integration hardening implemented. Hosted readiness inspected read-only; no DNS, deployment, authentication, database, or production changes have been made.

Hosted readiness record: [`product-domain-hosted-readiness.md`](./product-domain-hosted-readiness.md). The product domains are not yet DNS-resolvable or attached to the existing Vercel project.

Owner: Website Steward, with support from Documentation Steward, Product/Systems Delivery, Proof and Governance Auditor, and KC for decisions and production approval.

## Objective

Move Kosh and Spasht from product routes on the main Kramaniti website to independent product origins:

- `https://kosh.kramaniti.com/`
- `https://spasht.kramaniti.com/`

The existing routes should remain available during migration and permanently redirect to the appropriate canonical product URL after the new origins are verified.

## Current repository context

- Kosh currently lives under `website/src/app/kosh/` and includes public resources, account, workspace, creation, discovery, downloads, and adaptation flows.
- Spasht currently lives under `website/src/app/spasht/` and includes workspace, authentication, assistant, project, task, memory, and compatibility flows.
- Both products are currently part of the main `website/` Next.js application.
- Kosh and Spasht use product-specific Supabase integrations and require callback/origin review before a hostname change.
- The main site currently uses `https://www.kramaniti.com` as the canonical site origin.

## Decision gate 0 — Choose the deployment model

- [x] Decide to keep one Next.js/Vercel deployment with hostname-aware routing for the first migration stage.
- [x] Record the decision and rationale in `09_reviews/decisions.md`.
- [x] Confirm that the active `website/` application is the implementation scope; exact Vercel project confirmation remains a production-gate task.
- [x] Confirm that no database split is implied by this hostname migration.

Recommendation: begin with one deployment and hostname-aware routing unless Kosh or Spasht already require independent release ownership, scaling, or access controls.

## Phase 1 — Inventory and route map

Lead: Website Steward

- [x] Inventory every Kosh route, API route, download, auth route, and external integration.
- [x] Inventory every Spasht route, API route, auth route, OAuth/MCP integration, and compatibility path.
- [x] Search for absolute URLs, canonical URLs, metadata bases, product links, callback URLs, and origin checks.
- [x] Record the current legacy routes that must continue working.
- [x] Identify the routes and surfaces that must remain on `www.kramaniti.com` rather than moving to a product host.
- [x] Produce the initial redirect matrix from `/kosh/...` to `kosh.kramaniti.com/...` and from `/spasht/...` to `spasht.kramaniti.com/...`.
- [x] Define initial query-string and hash-fragment preservation requirements.

Inventory record: [`product-domain-migration-inventory.md`](./product-domain-migration-inventory.md).

Deliverable: approved route, integration, and redirect inventory.

## Phase 2 — Define canonical product boundaries

Lead: Brand Strategist / Website Steward

- [x] Confirm Kosh's canonical origin as `https://kosh.kramaniti.com` and retain the existing product page structure.
- [x] Confirm Spasht's canonical origin as `https://spasht.kramaniti.com` and retain the existing product page structure.
- [ ] Define which parent-brand navigation remains visible on each product.
- [x] Define the main-site cross-links to use the canonical Kosh and Spasht origins.
- [ ] Confirm product naming, “by Kramaniti” treatment, and parent-logo requirements.
- [x] Define that each product receives its own sitemap and robots file; manifest and Open Graph asset decisions remain open.

Deliverable: canonical URL and product-boundary brief.

## Phase 3 — Application and routing implementation

Lead: Website Steward

- [x] Implement explicit hostname detection for Kosh, Spasht, and local development aliases; the main site remains the fall-through host.
- [x] Route the product hostname root to the correct existing product experience through Next.js Proxy.
- [ ] Prevent product-only routes from being accidentally rendered on the wrong host where appropriate.
- [x] Preserve direct access to product subroutes through the hostname proxy.
- [x] Add the production-host 308 redirect layer from `/kosh/...` and `/spasht/...` to the canonical product hosts; local and preview hosts intentionally remain non-redirecting.
- [x] Add permanent redirects from legacy product paths to the new canonical origins in the local application layer; production behaviour remains unverified until the canonical host is deployed.
- [ ] Preserve supported path parameters, query parameters, and recovery/project state.
- [x] Keep local development testable with `kosh.localhost` and `spasht.localhost` host resolution.
- [x] Update main-site product links and selected product entry links to use the canonical product origins where an absolute URL is required.

Deliverable: local implementation with route and redirect tests.

## Phase 4 — Metadata, SEO, and machine-facing URLs

Lead: Website Steward / Proof and Governance Auditor

- [x] Give Kosh product pages canonical URLs on `https://kosh.kramaniti.com`.
- [x] Give Spasht its product landing page canonical URLs on `https://spasht.kramaniti.com`.
- [x] Update Kosh JSON-LD and breadcrumb URLs to the Kosh origin.
- [ ] Decide whether the main sitemap should retain only product landing links.
- [x] Add product-specific sitemap output.
- [x] Update product robots rules and sitemap references.
- [x] Update `llms.txt` product links; `llms-full.txt` has no product route entries requiring a boundary change.
- [ ] Check that no unverified product claim is introduced during the URL migration.

Deliverable: metadata and crawl-surface review with representative rendered output.

## Phase 5 — Authentication, storage, and integrations

Lead: Product/Systems Delivery

### Kosh

- [x] Make Kosh recovery callback construction hostname-aware in the application; hosted allowlist update remains pending approval.
- [ ] Add the approved Kosh hostname to the Kosh Supabase Auth redirect allowlist.
- [ ] Verify signup confirmation, sign-in, sign-out, recovery, password update, refresh, and expired-link behaviour.
- [ ] Review Kosh API origin assumptions, downloads, account routes, and environment variables.
- [x] Review browser storage and identify origin-scoped Kosh state; no automatic cross-origin migration is assumed.

### Spasht

- [x] Make Spasht confirmation and recovery callback construction hostname-aware in the application; hosted allowlist update remains pending approval.
- [ ] Add the approved Spasht hostname to the relevant Supabase Auth and OAuth callback allowlists.
- [ ] Verify project, task, memory, assistant, recovery, and session flows.
- [ ] Review MCP/ChatGPT connector origins, widget URLs, token issuer/audience assumptions, and legacy compatibility.
- [ ] Confirm whether existing connector clients need a compatibility period.
- [x] Review browser storage, PWA scope, service-worker scope, and saved project handoffs; hosted verification remains pending.

### Shared

- [ ] Do not place access tokens or private user data in redirect URLs.
- [ ] Define a safe, short-lived state migration only if existing browser state must survive the origin change.
- [ ] Confirm that database schemas and data remain unchanged unless a separate approved migration is required.

Deliverable: integration checklist and controlled authentication test report.

## Phase 6 — Preview verification

Lead: Website Steward

- [ ] Run `git diff --check`.
- [ ] Run `npm run lint`.
- [ ] Run `npx tsc --noEmit`.
- [ ] Run `npm run build`.
- [ ] Run the existing Kosh tests.
- [ ] Run the existing Spasht tests.
- [ ] Add and pass hostname, canonical URL, redirect, and wrong-host boundary tests.
- [ ] Test desktop and mobile layouts for both product hosts.
- [ ] Test direct navigation, refresh, back/forward, query strings, and deep links.
- [ ] Test unauthenticated and authenticated flows with controlled accounts.
- [ ] Test downloads, API calls, recovery links, and error states.
- [ ] Check console errors, horizontal overflow, focus behaviour, and reduced-motion behaviour.

Deliverable: preview QA evidence and a list of unresolved issues.

## Decision gate 1 — Production approval

Before changing DNS, production domains, authentication settings, or deployment configuration:

- [ ] Show KC the final domain map and redirect matrix.
- [ ] Show KC the production change list and rollback plan.
- [ ] Confirm the target Vercel project(s), deployment account/team, and DNS provider.
- [ ] Confirm the Supabase projects and callback changes.
- [ ] Obtain explicit approval for the production cutover.

## Phase 7 — DNS and Vercel configuration

Lead: Deployment owner, with KC approval

- [ ] Add `kosh.kramaniti.com` to the approved Vercel project.
- [ ] Add `spasht.kramaniti.com` to the approved Vercel project.
- [ ] Add the DNS records recommended by Vercel.
- [ ] Verify domain ownership and TLS certificates.
- [ ] Confirm each hostname points to the intended deployment.
- [ ] Confirm the main `www.kramaniti.com` domain remains unaffected.

Deliverable: verified HTTPS domains attached to the intended deployment.

## Phase 8 — Production cutover and verification

Lead: Website Steward / Deployment owner

- [ ] Deploy the approved revision.
- [ ] Verify `https://kosh.kramaniti.com/` and `https://spasht.kramaniti.com/` return the intended products.
- [ ] Verify representative product routes and APIs.
- [ ] Verify legacy `/kosh/...` and `/spasht/...` URLs redirect correctly.
- [ ] Verify canonical tags, Open Graph URLs, robots, sitemap, and JSON-LD.
- [ ] Verify Kosh authentication and private-state boundaries.
- [ ] Verify Spasht authentication, assistant, project state, and connector compatibility.
- [ ] Check analytics, error monitoring, and Vercel logs for unexpected failures.
- [ ] Do not claim adoption, successful email delivery, connector consent, or user migration without direct evidence.

Deliverable: production verification record with evidence and limitations.

## Phase 9 — Search, documentation, and transition monitoring

Lead: Documentation Steward / Distribution & Analytics

- [ ] Submit the product sitemaps to the relevant search properties.
- [ ] Update repository documentation and product handoffs.
- [ ] Update public links, approved social profiles, email templates, and product references.
- [ ] Monitor 404s, redirect volume, auth failures, API errors, and domain-specific traffic.
- [ ] Keep legacy redirects active for an agreed transition period.
- [ ] Review whether old callback URLs can be removed only after evidence supports removal.
- [ ] Record the final production state and any known limitations.

Deliverable: post-cutover monitoring note and final handoff.

## Rollback plan

Rollback must preserve service and avoid unnecessary database changes.

- [ ] Keep the current deployment and domain configuration documented before cutover.
- [ ] Keep legacy routes and authentication callbacks available during transition.
- [ ] If hostname routing fails, restore the previous application routing while leaving old paths live.
- [ ] If DNS configuration is wrong, revert only the affected DNS records.
- [ ] If authentication fails, restore the previous callback configuration and pause the migration.
- [ ] Do not rotate secrets or alter product databases as part of a hostname rollback unless separately approved.

## Definition of done

The migration is complete when:

- Both product hostnames resolve over HTTPS to the intended product experiences.
- Existing Kosh and Spasht links redirect without losing supported state.
- Product metadata, sitemaps, and canonical URLs use the new origins.
- Authentication, recovery, API, download, storage, PWA, and connector flows pass their agreed checks.
- The main Kramaniti website remains correct at `www.kramaniti.com`.
- Rollback information is recorded.
- KC has approved the production result and the remaining limitations are documented.

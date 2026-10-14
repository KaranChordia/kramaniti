# Kosh template discovery assistant

Status: implemented locally on `codex/kosh-template-assistant`, based on `origin/main` at `07c2a0c`. Public release awaits KC approval. Lead: Website Steward, with Documentation Steward and Proof and Governance Auditor responsibilities applied within this task.

## User outcome

A visitor describes the work they need help with, receives a useful starting template with up to two alternatives and reasons, refines the request, and opens the real resource. Library search, category filters, sorting and original downloads remain available underneath.

## Implementation and boundaries

- Entry: `website/src/app/kosh/TemplateGuide.tsx`, above the catalogue in `LibraryLanding.tsx`.
- Server: `POST /api/kosh/discover/`, backed by the existing Groq provider. It reads only canonical public catalogue metadata and the conversation supplied for this request. There is no account, database, private-context, source-document or tool access.
- Grounding: `website/src/lib/kosh/discovery.ts` derives the available templates from `libraryItems` and `resourceDetails`. IDs outside the catalogue, duplicate IDs and malformed output fall back to explicitly labelled catalogue suggestions. Links and titles come from the catalogue rather than provider URLs.
- Model: `KOSH_DISCOVERY_MODEL`, falling back to `GROQ_CHAT_MODEL`, then the app's existing `openai/gpt-oss-120b`. Uses JSON object mode with application validation, following [Groq's current structured-output guidance](https://console.groq.com/docs/structured-outputs). The existing Groq SDK is retained; no new dependency or agent runtime was introduced.
- State: up to eight exchanges, stored only in the mounted Kosh journey. Resource navigation and return preserve completed exchanges. Refresh, leaving Kosh or closing the tab clears them. Start over clears them explicitly. Nothing is written to account storage or browser persistence.
- Privacy: visible disclosure explains provider transmission and asks visitors to avoid sensitive details. Requests and provider payloads are not logged. The server's failure message contains no user data.
- Resilience: missing provider configuration, a disabled guide, malformed provider output, provider errors and incomplete generation return catalogue suggestions. Network and HTTP failures preserve the question for retry. Existing browse/download flows remain usable.
- Limits: same-origin browser requests, bounded streaming body (64 KB), validated alternating history, eight turns, 1,000 characters per user message, bounded output, 20-second provider timeout and no provider retries. Requests have `Cache-Control: no-store`.
- Abuse protection: 12 requests per hashed IP per 10 minutes per warm function instance; expired buckets are removed and the map is capped at 2,000 entries. This is best-effort instance protection, not a distributed usage or spend cap. A platform-wide limit should be configured in the owning Vercel project before opening the public model endpoint at scale.
- Kill switch: `KOSH_DISCOVERY_AI_ENABLED=false` retains the guide in catalogue-only mode. All model settings are server-only.

## Acceptance evidence

[Fact] ESLint, TypeScript, production build and 35 Kosh tests pass, including eight discovery tests for grounding, bad input, proxy origins, unknown IDs, provider failure, fallbacks, topic changes and throttling.

[Fact] A production-style local browser check exercised the real provider: customer enquiries selected the enquiry triage template; a complaints follow-up selected the customer handoff plan. The visitor opened that resource and returned with both completed exchanges intact. Refresh cleared the conversation.

[Fact] Controlled browser checks cover failed-request recovery, visible fallback mode, eight-turn recovery, original Markdown download, collapse/expand, reduced motion and light-theme rendering. Layouts at 320, 390, 768 and 1440 pixels have no horizontal overflow; there were no page errors. Mobile results use responsive browser viewports, not a physical-device usability test.

## Release path and open dependencies

[Fact] Both the connected Vercel tool and the CLI returned 403 for the existing Kramaniti project (`prj_RrU88c8YiensRewhArjr2T4YoaXQ`, owning team `team_1vMT59KOyt37gczEFWMoicRX`). A CLI scope check also failed. Do not create a lookalike project or change teams.

[Fact] The latest remote `main` commit has a successful GitHub Vercel status. [Recommendation] After KC approves the scoped release, use a focused PR and the existing GitHub–Vercel integration. Confirm its resulting deployment environment and public alias rather than assuming the successful check means production.

[Unverified] The production presence of `GROQ_API_KEY`, the new route's real-Origin behaviour on the public domain, and distributed platform abuse controls could not be inspected with current Vercel access. Existing local provider configuration was used only for local verification. No environment values, accounts or databases were changed.

Post-release acceptance: open `https://www.kramaniti.com/kosh/`, obtain an actual `mode: assistant` response, refine it, follow its template link and return; verify existing Markdown download and catalogue controls. Check production mode/configuration and platform request limits in the authorized owning Vercel account. Preserve all unrelated primary-checkout changes.

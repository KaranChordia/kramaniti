# Kramaniti ChatGPT App SDK Setup

## Purpose

[Recommendation] This is the first Kramaniti ChatGPT Apps SDK prototype. It exposes read-only MCP tools for a session-based Kramaniti Clarity Companion and renders a richer interactive mini app inside ChatGPT.

The app follows the Kramaniti sequence:

1. Strategy before tools.
2. Systems before scale.
3. Content after clarity.

## What The MCP Server Is

[Fact] The MCP server is the backend ChatGPT talks to when a user enables the app. It advertises available tools, receives tool-call inputs from ChatGPT, runs the tool logic, and returns structured results.

[Fact] For Apps SDK widgets, the MCP server can also register a UI resource. ChatGPT renders that resource as the mini app iframe and passes the tool result into it.

[Inference] In this repository, the cleanest first version is a separate dev server under `website/chatgpt-app/` rather than modifying the public homepage. The public website can keep running normally while the ChatGPT app is tested through Developer Mode.

## Local Files

- `website/chatgpt-app/package.json`
- `website/chatgpt-app/src/server.ts`
- `website/chatgpt-app/src/mcp.ts`
- `website/chatgpt-app/widgets/clarity-map.html`

## Install And Run

From the repo root:

```bash
cd website/chatgpt-app
npm install
npm run typecheck
npm start
```

The local MCP endpoint is:

```text
http://localhost:8000/mcp
```

## Connect To ChatGPT For Testing

[Fact] ChatGPT needs an HTTPS-accessible MCP URL for local testing through Developer Mode.

1. Start the local server.
2. Expose port `8000` with a tunnel such as ngrok or Cloudflare Tunnel.
3. In ChatGPT, enable Developer Mode if available.
4. Add the app/connector using the public tunnel URL ending in `/mcp`.

Example:

```bash
ngrok http 8000
```

Then connect:

```text
https://YOUR-TUNNEL.ngrok-free.app/mcp
```

## Vercel Fit

[Fact] The Kramaniti website already runs as a Vercel-hosted Next.js project, and this prototype now includes a Vercel-compatible serverless function entrypoint at `website/chatgpt-app/api/mcp.ts`.

[Recommendation] Use Vercel for the MCP HTTPS endpoint once local tool behavior is stable. The deployed connector URL should use:

```text
https://YOUR-VERCEL-PREVIEW-OR-PRODUCTION-DOMAIN/mcp
```

[Fact] The first production deployment is live at:

```text
https://chatgpt-app-six-silk.vercel.app
```

[Fact] The verified ChatGPT connector URL is:

```text
https://chatgpt-app-six-silk.vercel.app/mcp
```

[Fact] The Vercel serverless-compatible `/api/mcp` endpoint also responds correctly, but the Express route `/mcp` is the clearer connector URL for this deployment.

[Inference] Vercel can cover the main hosting layer for this app:

- MCP endpoint hosting through Vercel Functions.
- Environment variables for secrets and provider keys.
- Preview deployments for testing before production.
- Observability through function logs and deployment logs.
- Blob/object storage through Vercel Blob if the app needs files or generated exports later.
- Postgres-style storage through Vercel Marketplace integrations, or Supabase if Clarity Square's existing database path should stay consistent.
- AI/model calls through Vercel AI Gateway or direct provider SDKs if a later version adds model-backed synthesis.

[Constraint] The current app is deployed for testing, but it should not be treated as a finished public submission yet. It still needs ChatGPT Developer Mode testing, privacy/support metadata, final branding assets, and a decision on whether state should live in Vercel storage, Supabase, or remain session-only.

## Vercel Preview Deployment

From the repo root:

```bash
cd website/chatgpt-app
vercel
```

For production, after preview testing:

```bash
vercel --prod
```

The local checkout has Vercel CLI available and is linked to the Vercel project `chatgpt-app`. A deployment creates an external URL, so production updates should be intentional.

## Deployment Verification

2026-06-27:

- Vercel project: `chatgpt-app`
- Production URL: `https://chatgpt-app-six-silk.vercel.app`
- Connector URL: `https://chatgpt-app-six-silk.vercel.app/mcp`
- Initial `tools/list` returned `create_clarity_map`.
- Initial `tools/call` returned structured strategy, systems, content, sequence, and guardrails.

## Clarity Companion Direction

2026-06-27 update:

[Recommendation] The app should not be submitted as a simple one-shot clarity card. It should become a Kramaniti Clarity Companion that uses conversation-provided context and user-confirmed memory-like signals to improve clarity.

[Constraint] The app does not directly read private ChatGPT memories and does not persist personal memory. If ChatGPT includes relevant user-approved context in a tool call, the app can organize it, but the user should be able to correct or reject it.

Current tool split:

- `analyze_clarity_context`: organizes stated goal, conversation context, memory-like signals, friction, and constraints into context signals, clarity gaps, correction prompts, and guardrails.
- `create_operating_map`: turns confirmed context into a Kramaniti strategy, systems, content, human/AI boundary, and next-move map.

Current widget:

- Context Signals
- Clarity Gaps
- Strategy / Systems / Content
- Human / AI Boundary
- Next Moves
- Questions To Ask Yourself
- Correct The Context
- Guardrails

## First Test Prompts

Use prompts like:

- "Create a clarity map for a boutique hotel that has scattered guest follow-up across WhatsApp, email, and spreadsheets."
- "Map the workflow problem for a founder-led B2B services company that wants content after sales clarity."
- "Use Kramaniti to help me clarify a messy onboarding workflow before adding AI."
- "Use what I have shared in this conversation to analyze my clarity gaps before making a plan."
- "Create an operating map from the context I confirmed: I am building a founder-led services business and need a practical content workflow."

## Cost Notes

[Fact] The current prototype does not call the OpenAI API or any paid model API. Its local tool logic is deterministic.

[Recommendation] Do not assume the full project is completely free. Likely cost categories are:

- Hosting the MCP server if it is deployed beyond local testing.
- Tunnel/domain costs if a stable public URL is needed.
- Database or storage costs if the app later saves maps, users, or sessions.
- OAuth/provider costs if the app connects to external client systems.
- Model/API costs only if we later add model calls inside the MCP server.
- Public distribution/review work, privacy policy hosting, and support time.

## Current Guardrails

- The tool is read-only.
- The app is session-only.
- The app does not directly read private ChatGPT memories.
- No private client data should be entered during early testing.
- No client names, testimonials, metrics, or outcomes are generated.
- Human review remains part of the workflow sequence.
- The app should stay business-first and avoid generic AI automation language.

## Next Build Options

[Recommendation] After the local prototype works in ChatGPT, choose one next direction:

1. Add saved sessions and exportable clarity maps.
2. Add a second tool for workflow-audit intake.
3. Add an authenticated private workspace.
4. Deploy the MCP server to a production HTTPS host.
5. Prepare app metadata, logo, screenshots, test prompts, and policy URLs for submission.

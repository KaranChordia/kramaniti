# Kramaniti Clarity Circle Manager App

## Purpose

[Recommendation] This is the second ChatGPT Apps SDK app for Kramaniti. It is a private Clarity Circle manager for signed-in workspace data.

Unlike the first Clarity Companion app, this app should not run as a public No Auth connector once connected to real user data.

## MVP Scope

Current MVP tools:

- `get_workspace_overview`
- `list_projects`
- `get_project_detail`
- `create_project_draft`
- `update_project_draft`
- `list_project_tasks`
- `create_task_draft`
- `update_task_status`
- `list_memories`
- `save_memory_draft`

Loop-related tools are intentionally excluded for this phase.

## Auth Model

[Fact] Clarity Circle data already lives in Supabase under the `clarity_circle` schema with RLS ownership policies.

[Fact] The manager exposes an OAuth 2.1-style bridge for ChatGPT:

- Protected resource metadata: `/.well-known/oauth-protected-resource`
- Authorization server metadata: `/.well-known/oauth-authorization-server`
- Authorization endpoint: `/oauth/authorize`
- Token endpoint: `/oauth/token`
- Dynamic client registration endpoint: `/oauth/register`

[Recommendation] ChatGPT should use OAuth. The OAuth login page accepts the user's Clarity Circle username or email plus password, verifies it through Supabase Auth, then returns a short-lived encrypted app token to ChatGPT.

[Fact] Tool calls use the app token to recover the user's Supabase session token server-side. Supabase RLS remains the authority for which rows can be read or updated.

[Constraint] Do not use a Supabase service-role key in this app. Do not bypass RLS.

## Required Environment Variables

The app needs:

```text
SUPABASE_URL
SUPABASE_ANON_KEY
APP_ORIGIN
OAUTH_TOKEN_SECRET
```

The values can match the existing website's public Supabase URL and anon key.

[Fact] The production Vercel project has these values persisted as encrypted production environment variables. Do not commit the values to the repository.

## Local Run

```bash
cd website/clarity-circle-chatgpt-app
npm install
npm run typecheck
npm start
```

Local endpoint:

```text
http://localhost:8010/mcp
```

## Vercel

[Recommendation] Deploy as its own Vercel project, separate from the existing Clarity Companion app.

[Fact] Current Vercel project:

```text
clarity-circle-chatgpt-app
```

[Fact] Current production MCP URL:

```text
https://clarity-circle-chatgpt-app.vercel.app/mcp
```

Use:

```bash
cd website/clarity-circle-chatgpt-app
vercel --prod
```

If redeploying from a fresh checkout, keep the Vercel project environment variables intact. Rotating `OAUTH_TOKEN_SECRET` invalidates existing ChatGPT app tokens.

## ChatGPT Connector Setup

Use the deployed `/mcp` URL.

Authentication should be:

```text
OAuth
```

The Advanced OAuth settings should become available after entering the MCP server URL because the app publishes OAuth discovery metadata.

Current production URL:

```text
https://clarity-circle-chatgpt-app.vercel.app/mcp
```

## Verification

[Fact] Verified on 2026-06-27:

- `npm run typecheck` passes.
- `npm audit --omit=dev` reports no vulnerabilities.
- Local OAuth metadata, dynamic client registration, OAuth login page, and MCP auth challenge work.
- Production OAuth protected-resource metadata works.
- Production OAuth authorization-server metadata works.
- Production OAuth dynamic client registration works.
- Production OAuth login page renders.
- Production `/mcp` initializes and returns an `mcp/www_authenticate` OAuth challenge when called without an app token.
- Vercel production environment variables are persisted and encrypted.

[Constraint] A real signed-in data read/write test still requires signing in through the ChatGPT OAuth flow with an actual Clarity Circle account.

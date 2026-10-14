# Kramaniti Spasht Manager App

## Purpose

[Recommendation] This is the second ChatGPT Apps SDK app for Kramaniti. It is a private Spasht manager for signed-in workspace data.

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

[Fact] The local manager targets `spasht`. Hosted product data remains in `clarity_square` until the approved migration; RLS policies and records will move with the schema.

[Fact] The manager exposes an OAuth 2.1-style bridge for ChatGPT:

- Protected resource metadata: `/.well-known/oauth-protected-resource`
- Authorization server metadata: `/.well-known/oauth-authorization-server`
- Authorization endpoint: `/oauth/authorize`
- Token endpoint: `/oauth/token`
- Dynamic client registration endpoint: `/oauth/register`

[Recommendation] ChatGPT should use OAuth. The OAuth login page accepts the user's Spasht username or email plus password, verifies it through Supabase Auth, then returns a short-lived encrypted app token to ChatGPT.

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

[Unverified] The predecessor deployment recorded encrypted environment variables. Recheck the existing project binding during release; this task did not verify its current configuration. Do not commit values.

## Local Run

```bash
cd website/spasht-chatgpt-app
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

[Recommendation] Target Vercel project after the rename:

```text
spasht-chatgpt-app
```

[Recommendation] Target production MCP URL after the Vercel project or alias is updated:

```text
https://spasht-chatgpt-app.vercel.app/mcp
```

Use:

```bash
cd website/spasht-chatgpt-app
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

Target production URL after deployment or alias update:

```text
https://spasht-chatgpt-app.vercel.app/mcp
```

## Verification

[Fact] Historical predecessor verification recorded on 2026-06-27 (not verification of this rebrand):

- `npm run typecheck` passes.
- `npm audit --omit=dev` reports no vulnerabilities.
- Local OAuth metadata, dynamic client registration, OAuth login page, and MCP auth challenge work.
- Production OAuth protected-resource metadata works.
- Production OAuth authorization-server metadata works.
- Production OAuth dynamic client registration works.
- Production OAuth login page renders.
- Production `/mcp` initializes and returns an `mcp/www_authenticate` OAuth challenge when called without an app token.
- Vercel production environment variables are persisted and encrypted.

[Constraint] A real signed-in data read/write test still requires signing in through the ChatGPT OAuth flow with an actual Spasht account.

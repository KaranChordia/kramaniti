# Kramaniti Clarity Circle Supabase Setup

[Fact] Clarity Circle uses the existing Supabase project, but stores app data in a separate Postgres schema named `clarity_circle`.

[Recommendation] Keep recruiting-company tables untouched. Do not create Clarity Circle tables in `public`; apply the migration in `supabase/migrations/20260623060000_clarity_circle_schema.sql`.

## Codex MCP

The project reference supplied for the existing Supabase project is:

```bash
codex mcp add supabase --url https://mcp.supabase.com/mcp?project_ref=wqfensgibrvxnoztlzfo
codex mcp login supabase
```

After authentication, verify the MCP connection inside Codex with `/mcp`.

## Website Env Vars

Do not run these lines in the Supabase SQL editor. They are not SQL.

Add these to `website/.env.local` or the Vercel project environment:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://wqfensgibrvxnoztlzfo.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

Do not place service-role keys in the frontend environment.

## Running The Migration

In the Supabase SQL editor, run only the SQL from:

```text
supabase/migrations/20260623060000_clarity_circle_schema.sql
```

The first executable SQL line should be:

```sql
create schema if not exists clarity_circle;
```

The final SQL lines should be the `grant select, insert, update, delete...` statements. Do not paste `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` into the SQL editor.

## Database Isolation

The migrations create:

- `clarity_circle.profiles`
- `clarity_circle.project_folders`
- `clarity_circle.projects`
- `clarity_circle.context_entries`
- `clarity_circle.assistant_messages`
- `clarity_circle.assistant_memories`

All Clarity Circle tables have RLS enabled. Policies limit each authenticated user to their own rows via `auth.uid()`.

## Current App Behavior

- Signup is a two-step flow: email first, then username and password.
- Usernames are stored in `clarity_circle.profiles.username` and must be 3-24 lowercase letters, numbers, or underscores.
- Sign-in accepts the username and password. The app resolves the username to the linked email through `clarity_circle.resolve_login_email`.
- If Supabase email confirmation is enabled, users may still need to confirm their email before first access. Disable email confirmation in Supabase Auth settings if the product should allow immediate username/password access.
- Unsigned sessions continue to work locally in the browser.
- Completed intent capture is saved as a private `clarity_circle.projects` row for signed-in users.
- Project folders are stored in `clarity_circle.project_folders`; projects reference them through `clarity_circle.projects.folder_id`.
- The folder move policy only allows a project to be assigned to a folder owned by the same signed-in user.
- Workspace realtime is enabled for `projects`, `project_folders`, `context_entries`, `assistant_messages`, and `assistant_memories`.
- The dashboard listens for workspace changes and refreshes project counts, folders, assistant memories, and context entries without requiring a page refresh.
- The dedicated Circle Assistant stores signed-in conversation turns in `clarity_circle.assistant_messages`.
- User-visible assistant memory notes are stored in `clarity_circle.assistant_memories` and can be archived from the Memory panel.
- The Circle Assistant can create new private projects from user requests; those projects still use `clarity_circle.projects`.
- Before answering, the Circle Assistant refreshes the signed-in workspace and receives folder names, projects, saved context entries, project questions/actions, selected project, and memory notes.
- The Clarity Circle to Clarity Engine handoff remains browser-local and one-time.

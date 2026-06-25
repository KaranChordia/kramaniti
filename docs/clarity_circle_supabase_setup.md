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
supabase/migrations/20260623121000_clarity_circle_assistant_memory.sql
supabase/migrations/20260623143000_clarity_circle_project_folders.sql
supabase/migrations/20260623154500_clarity_circle_realtime_workspace.sql
supabase/migrations/20260625120000_clarity_circle_project_reports.sql
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
- `clarity_circle.project_tasks`
- `clarity_circle.project_reports`
- `clarity_circle.context_entries`
- `clarity_circle.assistant_messages`
- `clarity_circle.assistant_memories`

All Clarity Circle tables have RLS enabled. Policies limit each authenticated user to their own rows via `auth.uid()`.

The `clarity_circle` schema must also be included in Supabase API "Exposed schemas". The repository migration sets the equivalent PostgREST role configuration for this project:

```sql
alter role authenticator set pgrst.db_schemas = 'public, storage, graphql_public, clarity_circle';
notify pgrst, 'reload config';
notify pgrst, 'reload schema';
```

## Current App Behavior

- Signup is a two-step flow: email first, then username and password.
- Usernames are stored in `clarity_circle.profiles.username` and must be 3-24 lowercase letters, numbers, or underscores.
- Sign-in accepts the username and password. The app resolves the username to the linked email through `clarity_circle.resolve_login_email`; the `anon` role needs schema usage plus execute permission on this function because the lookup happens before password authentication. The resolver also repairs missing profile rows from Supabase Auth metadata when an account was created successfully but the `clarity_circle.profiles` row did not persist.
- If Supabase email confirmation is enabled, users may still need to confirm their email before first access. Disable email confirmation in Supabase Auth settings if the product should allow immediate username/password access.
- Unsigned sessions continue to work locally in the browser.
- Completed intent capture is saved as a private `clarity_circle.projects` row for signed-in users.
- Project rows include `project_instruction`, the saved operating context used by the project assistant and future project output.
- New Projects-created rows are seeded from the "what is this project about?" field; assistant-created rows auto-fill the instruction from the assistant conversation.
- Auto-built and manual tasks are stored in `clarity_circle.project_tasks` and remain user-owned through RLS.
- Project folders are stored in `clarity_circle.project_folders`; projects reference them through `clarity_circle.projects.folder_id`.
- Clarity Engine blueprint reports are stored in `clarity_circle.project_reports`, linked to the originating project. The project folder relationship is inherited through `clarity_circle.projects.folder_id`.
- The folder move policy only allows a project to be assigned to a folder owned by the same signed-in user.
- Workspace realtime is enabled for `projects`, `project_folders`, `project_tasks`, `project_reports`, `context_entries`, `assistant_messages`, and `assistant_memories`.
- The dashboard listens for workspace changes and refreshes project counts, folders, assistant memories, and context entries without requiring a page refresh.
- The dedicated Circle Assistant stores signed-in conversation turns in `clarity_circle.assistant_messages`.
- Main Circle Assistant thread identity and summary titles are stored in `clarity_circle.assistant_messages.metadata`, with project-specific threads still scoped by `project_id`.
- Assistant response-style preferences are stored on `clarity_circle.profiles.assistant_settings`; these are behavior tweaks only, not replacement system instructions.
- Project-specific assistant turns use `clarity_circle.assistant_messages.project_id`, so each project can keep a separate assistant thread while preserving common Circle assistant behavior.
- User-visible assistant memory notes are stored in `clarity_circle.assistant_memories` and can be archived from the Memory panel.
- The Circle Assistant can create new private projects from user requests; those projects still use `clarity_circle.projects`.
- Before answering, the Circle Assistant refreshes the signed-in workspace and receives folder names, projects, saved context entries, project questions/actions, selected project, and memory notes.
- The Clarity Circle to Clarity Engine handoff remains browser-local and one-time during diagnosis. Project reports are saved only when the user explicitly selects "Save all to project" after blueprint generation.

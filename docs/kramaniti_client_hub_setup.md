# Kramaniti Client Hub Setup and Operating Guide

Date: 2026-07-13  
Route: `/client-hub`  
Database schema: `kramaniti_hub`

## 1. Current implementation

[Fact] The Client Hub is a private, account-based workroom for Kramaniti and its clients. It includes:

- isolated client workspaces with founder-created usernames and temporary passwords;
- projects, nested tasks, shared or internal notes, and a workspace message thread;
- a workspace assistant that reads only the signed-in member's visible workspace context;
- automatic task decomposition into reviewable subtasks;
- an approval queue that must be accepted before an assistant draft changes workspace data;
- an explicitly allowlisted repository and directory index that shares metadata, not file contents;
- Supabase Realtime refreshes across projects, tasks, notes, messages, assistant activity, and repository items.

[Fact] The database migrations were applied to Supabase project `wqfensgibrvxnoztlzfo` on 2026-07-13. All ten Client Hub tables have row-level security enabled.

[Fact] The founder account `karancho` was assigned the Client Hub owner role through the connected Supabase project on 2026-07-13. No real client accounts were created during implementation.

[Fact] The `Kramaniti Internal` owner workroom and its three internal-only repository references were seeded, so the founder does not land in an empty Hub after activation.

## 2. Required environment values

Set these in the deployment environment and in `website/.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://wqfensgibrvxnoztlzfo.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-publishable-key"
GROQ_API_KEY="optional-for-model-backed-assistance"
```

The legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` remains supported as a public-key fallback. The protected `client-hub-admin` Supabase Edge Function receives Supabase's server credential through its hosted runtime; the website does not need or receive that credential.

[Constraint] Supabase secret and service-role keys are server-only. Never prefix them with `NEXT_PUBLIC_`, place them in website code, commit them, log them, or send them to the browser.

## 3. Activate the founder account

1. Open `/client-hub` and sign in with the existing founder account.
2. The current founder account is `karancho`; its owner profile is already active in `kramaniti_hub.profiles`.
3. If the page was already open during activation, refresh once or choose **Activate founder access** again so the browser reloads the profile.

[Constraint] There is no public Hub signup or public owner elevation. Additional owners must be assigned through an explicit, audited Supabase administration change.

## 4. Create a client login

1. Sign in as the founder.
2. Choose **Add client**.
3. Enter the workroom name, client display name, username, and a temporary password of at least 12 characters. The request is handled by the authenticated `client-hub-admin` Edge Function.
4. Share the username and temporary password through a secure channel.
5. The client must replace the temporary password at first sign-in.

Client usernames are represented internally as `username@client-hub.kramaniti.com` for Supabase Auth, while the interface accepts the username alone.

[Constraint] The provisioning endpoint never returns the password and the repository never stores it. Because synthetic client emails are used, self-service email recovery is not available; reset a locked-out client through Supabase Auth and communicate the replacement securely.

## 5. Reflect repositories and directories safely

The Hub uses `client-hub.config.json` as an explicit privacy boundary. Add only approved metadata:

```json
{
  "slug": "client-workroom-slug",
  "name": "Client Workroom Name",
  "repositoryLabel": "Approved repository label",
  "items": [
    {
      "path": "approved/relative/directory",
      "title": "Client-facing title",
      "summary": "What this directory represents",
      "visibility": "shared"
    }
  ]
}
```

Then run:

```bash
cd website
npm run client-hub:sync
```

Build or deploy the updated site, sign in as founder, open **Repository**, and choose **Sync curated index**.

[Fact] The generated manifest contains the relative path, label, summary, branch, short revision, and working-tree state. It does not include source-file contents, remote repository URLs, absolute machine paths, secrets, or credentials.

[Constraint] A directory is never shared merely because it exists in the repository. It must be deliberately allowlisted and marked `shared`. Use `internal` for founder/collaborator-only references.

## 6. Assistant operating model

- A manually added task can automatically produce three to six ordered subtask drafts.
- The decomposition covers success criteria, inputs or dependencies, execution, human review, and handoff when relevant.
- The assistant can draft projects, tasks, notes, task-status changes, and messages.
- Every write remains pending until a signed-in workspace member approves it.
- Clients cannot use the assistant to create internal notes.
- When `GROQ_API_KEY` is unavailable or the model request fails, task decomposition and common workspace commands use a deterministic local fallback.

[Constraint] The assistant receives visible workspace records and the curated repository index. It does not receive repository file contents and must not claim otherwise.

## 7. Verification completed

[Fact] On 2026-07-13:

- `npm run lint` passed;
- `npx tsc --noEmit` passed;
- `npm run build` passed and generated `/client-hub` plus all four Hub API routes;
- the local production route returned HTTP 200;
- the route emitted `noindex, nofollow, noarchive` and was absent from the sitemap;
- an anonymous REST request to `kramaniti_hub.tasks` was denied with HTTP 401;
- Supabase's security advisor reported no Client Hub findings;
- the remaining Hub performance notices were unused-index informational notices on empty tables;
- the protected `client-hub-admin` Edge Function was deployed with JWT verification enabled;
- the founder account was promoted without exposing or resetting its password.

## 8. Next operating checks

[Recommendation] Before inviting the first client:

1. create one disposable test client and confirm workspace isolation with two browser sessions;
2. test password replacement, task decomposition, action approval, internal-note invisibility, and repository visibility;
3. delete the disposable account and workspace before provisioning a real client;
4. decide whether phase two needs file attachments, notifications, due-date reminders, or a complete mutation audit log.

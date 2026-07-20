create schema if not exists kramaniti_hub;
create schema if not exists kramaniti_hub_private;

revoke all on schema kramaniti_hub from public;
revoke all on schema kramaniti_hub_private from public;

grant usage on schema kramaniti_hub to anon, authenticated, service_role;
grant usage on schema kramaniti_hub_private to authenticated, service_role;

create table if not exists kramaniti_hub.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  display_name text not null,
  role text not null default 'client' check (role in ('owner', 'collaborator', 'client')),
  must_change_password boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_format check (username ~ '^[a-z0-9_]{3,32}$'),
  constraint profiles_display_name_length check (char_length(btrim(display_name)) between 1 and 100)
);

create unique index if not exists profiles_username_lower_idx
  on kramaniti_hub.profiles (lower(username));

create table if not exists kramaniti_hub.workspaces (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  status text not null default 'active' check (status in ('active', 'paused', 'archived')),
  repository_summary jsonb not null default '{}'::jsonb,
  created_by uuid not null references kramaniti_hub.profiles(user_id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint workspaces_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint workspaces_name_length check (char_length(btrim(name)) between 1 and 120)
);

create table if not exists kramaniti_hub.workspace_members (
  workspace_id uuid not null references kramaniti_hub.workspaces(id) on delete cascade,
  user_id uuid not null references kramaniti_hub.profiles(user_id) on delete cascade,
  role text not null default 'client' check (role in ('owner', 'collaborator', 'client')),
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create index if not exists workspace_members_user_id_idx
  on kramaniti_hub.workspace_members (user_id, workspace_id);

create table if not exists kramaniti_hub.projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references kramaniti_hub.workspaces(id) on delete cascade,
  title text not null,
  description text not null default '',
  status text not null default 'planned' check (status in ('planned', 'active', 'blocked', 'review', 'done', 'archived')),
  source text not null default 'manual' check (source in ('manual', 'assistant', 'repository')),
  repository_path text,
  owner_id uuid references kramaniti_hub.profiles(user_id) on delete set null,
  created_by uuid not null references kramaniti_hub.profiles(user_id) on delete restrict,
  start_date date,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_title_length check (char_length(btrim(title)) between 1 and 180),
  constraint projects_date_order check (due_date is null or start_date is null or due_date >= start_date),
  unique (id, workspace_id)
);

create index if not exists projects_workspace_status_idx
  on kramaniti_hub.projects (workspace_id, status, updated_at desc);
create index if not exists projects_owner_id_idx
  on kramaniti_hub.projects (owner_id) where owner_id is not null;

create table if not exists kramaniti_hub.tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references kramaniti_hub.workspaces(id) on delete cascade,
  project_id uuid,
  parent_task_id uuid,
  title text not null,
  description text not null default '',
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'waiting', 'review', 'done', 'archived')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  source text not null default 'manual' check (source in ('manual', 'assistant', 'repository')),
  assignee_id uuid references kramaniti_hub.profiles(user_id) on delete set null,
  created_by uuid not null references kramaniti_hub.profiles(user_id) on delete restrict,
  due_date date,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tasks_title_length check (char_length(btrim(title)) between 1 and 220),
  constraint tasks_project_scope foreign key (project_id, workspace_id)
    references kramaniti_hub.projects(id, workspace_id) on delete cascade,
  constraint tasks_parent_scope foreign key (parent_task_id, workspace_id)
    references kramaniti_hub.tasks(id, workspace_id) on delete cascade,
  unique (id, workspace_id)
);

create index if not exists tasks_workspace_status_idx
  on kramaniti_hub.tasks (workspace_id, status, updated_at desc);
create index if not exists tasks_project_id_idx
  on kramaniti_hub.tasks (project_id, sort_order, created_at) where project_id is not null;
create index if not exists tasks_parent_task_id_idx
  on kramaniti_hub.tasks (parent_task_id, sort_order, created_at) where parent_task_id is not null;
create index if not exists tasks_assignee_id_idx
  on kramaniti_hub.tasks (assignee_id, status) where assignee_id is not null;

create table if not exists kramaniti_hub.notes (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references kramaniti_hub.workspaces(id) on delete cascade,
  project_id uuid,
  title text not null,
  body text not null,
  visibility text not null default 'shared' check (visibility in ('shared', 'internal')),
  source text not null default 'manual' check (source in ('manual', 'assistant', 'repository')),
  created_by uuid not null references kramaniti_hub.profiles(user_id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint notes_title_length check (char_length(btrim(title)) between 1 and 180),
  constraint notes_body_length check (char_length(btrim(body)) between 1 and 20000),
  constraint notes_project_scope foreign key (project_id, workspace_id)
    references kramaniti_hub.projects(id, workspace_id) on delete cascade
);

create index if not exists notes_workspace_visibility_idx
  on kramaniti_hub.notes (workspace_id, visibility, updated_at desc);
create index if not exists notes_project_id_idx
  on kramaniti_hub.notes (project_id, updated_at desc) where project_id is not null;

create table if not exists kramaniti_hub.messages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references kramaniti_hub.workspaces(id) on delete cascade,
  project_id uuid,
  body text not null,
  created_by uuid not null references kramaniti_hub.profiles(user_id) on delete restrict,
  created_at timestamptz not null default now(),
  constraint messages_body_length check (char_length(btrim(body)) between 1 and 8000),
  constraint messages_project_scope foreign key (project_id, workspace_id)
    references kramaniti_hub.projects(id, workspace_id) on delete cascade
);

create index if not exists messages_workspace_created_at_idx
  on kramaniti_hub.messages (workspace_id, created_at desc);
create index if not exists messages_project_id_idx
  on kramaniti_hub.messages (project_id, created_at desc) where project_id is not null;

create table if not exists kramaniti_hub.assistant_messages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references kramaniti_hub.workspaces(id) on delete cascade,
  project_id uuid,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_by uuid not null references kramaniti_hub.profiles(user_id) on delete restrict,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint assistant_messages_content_length check (char_length(btrim(content)) between 1 and 20000),
  constraint assistant_messages_project_scope foreign key (project_id, workspace_id)
    references kramaniti_hub.projects(id, workspace_id) on delete cascade
);

create index if not exists assistant_messages_workspace_created_at_idx
  on kramaniti_hub.assistant_messages (workspace_id, created_at desc);
create index if not exists assistant_messages_project_id_idx
  on kramaniti_hub.assistant_messages (project_id, created_at desc) where project_id is not null;

create table if not exists kramaniti_hub.assistant_actions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references kramaniti_hub.workspaces(id) on delete cascade,
  project_id uuid,
  requested_by uuid not null references kramaniti_hub.profiles(user_id) on delete cascade,
  reviewed_by uuid references kramaniti_hub.profiles(user_id) on delete set null,
  action_type text not null check (action_type in ('create_project', 'create_task', 'create_note', 'update_task', 'send_message')),
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'applied', 'declined', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint assistant_actions_summary_length check (char_length(btrim(summary)) between 1 and 300),
  constraint assistant_actions_project_scope foreign key (project_id, workspace_id)
    references kramaniti_hub.projects(id, workspace_id) on delete cascade
);

create index if not exists assistant_actions_workspace_status_idx
  on kramaniti_hub.assistant_actions (workspace_id, status, created_at desc);
create index if not exists assistant_actions_requested_by_idx
  on kramaniti_hub.assistant_actions (requested_by, status, created_at desc);
create index if not exists assistant_actions_project_id_idx
  on kramaniti_hub.assistant_actions (project_id, created_at desc) where project_id is not null;

create table if not exists kramaniti_hub.repository_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references kramaniti_hub.workspaces(id) on delete cascade,
  source_key text not null,
  repository_label text not null,
  repository_path text not null,
  item_type text not null check (item_type in ('repository', 'directory', 'project')),
  title text not null,
  summary text not null default '',
  visibility text not null default 'internal' check (visibility in ('shared', 'internal')),
  source_hash text,
  metadata jsonb not null default '{}'::jsonb,
  last_synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint repository_items_source_key_length check (char_length(source_key) between 1 and 300),
  constraint repository_items_title_length check (char_length(btrim(title)) between 1 and 180),
  unique (workspace_id, source_key)
);

create index if not exists repository_items_workspace_visibility_idx
  on kramaniti_hub.repository_items (workspace_id, visibility, last_synced_at desc);

create or replace function kramaniti_hub_private.touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function kramaniti_hub_private.current_user_is_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from kramaniti_hub.profiles
    where user_id = (select auth.uid())
      and role = 'owner'
  );
$$;

create or replace function kramaniti_hub_private.can_access_workspace(
  target_workspace_id uuid,
  allowed_roles text[] default null
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from kramaniti_hub.workspace_members
    where workspace_id = target_workspace_id
      and user_id = (select auth.uid())
      and (allowed_roles is null or role = any(allowed_roles))
  );
$$;

create or replace function kramaniti_hub_private.shares_workspace_with(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select target_user_id = (select auth.uid())
    or exists (
      select 1
      from kramaniti_hub.workspace_members viewer
      join kramaniti_hub.workspace_members target
        on target.workspace_id = viewer.workspace_id
      where viewer.user_id = (select auth.uid())
        and target.user_id = target_user_id
    );
$$;

create or replace function kramaniti_hub_private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  hub_role text;
  profile_username text;
  profile_name text;
begin
  hub_role := coalesce(new.raw_app_meta_data ->> 'client_hub_role', '');
  if hub_role not in ('owner', 'collaborator', 'client') then
    return new;
  end if;

  profile_username := lower(coalesce(new.raw_user_meta_data ->> 'client_hub_username', split_part(new.email, '@', 1)));
  profile_username := regexp_replace(profile_username, '[^a-z0-9_]+', '_', 'g');
  profile_username := left(trim(both '_' from profile_username), 32);
  if char_length(profile_username) < 3 then
    profile_username := 'user_' || left(replace(new.id::text, '-', ''), 8);
  end if;

  profile_name := coalesce(nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''), profile_username);

  insert into kramaniti_hub.profiles (user_id, username, display_name, role, must_change_password)
  values (new.id, profile_username, profile_name, hub_role, hub_role <> 'owner')
  on conflict (user_id) do update
    set username = excluded.username,
        display_name = excluded.display_name,
        role = excluded.role,
        updated_at = now();

  return new;
end;
$$;

revoke all on function kramaniti_hub_private.touch_updated_at() from public;
revoke all on function kramaniti_hub_private.current_user_is_owner() from public;
revoke all on function kramaniti_hub_private.can_access_workspace(uuid, text[]) from public;
revoke all on function kramaniti_hub_private.shares_workspace_with(uuid) from public;
revoke all on function kramaniti_hub_private.handle_new_auth_user() from public;

grant execute on function kramaniti_hub_private.current_user_is_owner() to authenticated, service_role;
grant execute on function kramaniti_hub_private.can_access_workspace(uuid, text[]) to authenticated, service_role;
grant execute on function kramaniti_hub_private.shares_workspace_with(uuid) to authenticated, service_role;

drop trigger if exists kramaniti_hub_auth_user_created on auth.users;
create trigger kramaniti_hub_auth_user_created
  after insert on auth.users
  for each row execute function kramaniti_hub_private.handle_new_auth_user();

drop trigger if exists profiles_touch_updated_at on kramaniti_hub.profiles;
create trigger profiles_touch_updated_at
  before update on kramaniti_hub.profiles
  for each row execute function kramaniti_hub_private.touch_updated_at();

drop trigger if exists workspaces_touch_updated_at on kramaniti_hub.workspaces;
create trigger workspaces_touch_updated_at
  before update on kramaniti_hub.workspaces
  for each row execute function kramaniti_hub_private.touch_updated_at();

drop trigger if exists projects_touch_updated_at on kramaniti_hub.projects;
create trigger projects_touch_updated_at
  before update on kramaniti_hub.projects
  for each row execute function kramaniti_hub_private.touch_updated_at();

drop trigger if exists tasks_touch_updated_at on kramaniti_hub.tasks;
create trigger tasks_touch_updated_at
  before update on kramaniti_hub.tasks
  for each row execute function kramaniti_hub_private.touch_updated_at();

drop trigger if exists notes_touch_updated_at on kramaniti_hub.notes;
create trigger notes_touch_updated_at
  before update on kramaniti_hub.notes
  for each row execute function kramaniti_hub_private.touch_updated_at();

drop trigger if exists assistant_actions_touch_updated_at on kramaniti_hub.assistant_actions;
create trigger assistant_actions_touch_updated_at
  before update on kramaniti_hub.assistant_actions
  for each row execute function kramaniti_hub_private.touch_updated_at();

drop trigger if exists repository_items_touch_updated_at on kramaniti_hub.repository_items;
create trigger repository_items_touch_updated_at
  before update on kramaniti_hub.repository_items
  for each row execute function kramaniti_hub_private.touch_updated_at();

alter table kramaniti_hub.profiles enable row level security;
alter table kramaniti_hub.workspaces enable row level security;
alter table kramaniti_hub.workspace_members enable row level security;
alter table kramaniti_hub.projects enable row level security;
alter table kramaniti_hub.tasks enable row level security;
alter table kramaniti_hub.notes enable row level security;
alter table kramaniti_hub.messages enable row level security;
alter table kramaniti_hub.assistant_messages enable row level security;
alter table kramaniti_hub.assistant_actions enable row level security;
alter table kramaniti_hub.repository_items enable row level security;

create policy profiles_select_shared_workspace
  on kramaniti_hub.profiles for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or (select kramaniti_hub_private.current_user_is_owner())
    or (select kramaniti_hub_private.shares_workspace_with(user_id))
  );

create policy profiles_update_self
  on kramaniti_hub.profiles for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy workspaces_select_members
  on kramaniti_hub.workspaces for select
  to authenticated
  using ((select kramaniti_hub_private.can_access_workspace(id, null)));

create policy workspaces_insert_owners
  on kramaniti_hub.workspaces for insert
  to authenticated
  with check (
    created_by = (select auth.uid())
    and (select kramaniti_hub_private.current_user_is_owner())
  );

create policy workspaces_update_workspace_owners
  on kramaniti_hub.workspaces for update
  to authenticated
  using ((select kramaniti_hub_private.can_access_workspace(id, array['owner']::text[])))
  with check ((select kramaniti_hub_private.can_access_workspace(id, array['owner']::text[])));

create policy workspace_members_select_workspace_members
  on kramaniti_hub.workspace_members for select
  to authenticated
  using ((select kramaniti_hub_private.can_access_workspace(workspace_id, null)));

create policy workspace_members_insert_workspace_owners
  on kramaniti_hub.workspace_members for insert
  to authenticated
  with check ((select kramaniti_hub_private.can_access_workspace(workspace_id, array['owner']::text[])));

create policy workspace_members_update_workspace_owners
  on kramaniti_hub.workspace_members for update
  to authenticated
  using ((select kramaniti_hub_private.can_access_workspace(workspace_id, array['owner']::text[])))
  with check ((select kramaniti_hub_private.can_access_workspace(workspace_id, array['owner']::text[])));

create policy workspace_members_delete_workspace_owners
  on kramaniti_hub.workspace_members for delete
  to authenticated
  using ((select kramaniti_hub_private.can_access_workspace(workspace_id, array['owner']::text[])));

create policy projects_select_members
  on kramaniti_hub.projects for select
  to authenticated
  using ((select kramaniti_hub_private.can_access_workspace(workspace_id, null)));

create policy projects_insert_members
  on kramaniti_hub.projects for insert
  to authenticated
  with check (
    created_by = (select auth.uid())
    and (select kramaniti_hub_private.can_access_workspace(workspace_id, null))
  );

create policy projects_update_members
  on kramaniti_hub.projects for update
  to authenticated
  using ((select kramaniti_hub_private.can_access_workspace(workspace_id, null)))
  with check ((select kramaniti_hub_private.can_access_workspace(workspace_id, null)));

create policy tasks_select_members
  on kramaniti_hub.tasks for select
  to authenticated
  using ((select kramaniti_hub_private.can_access_workspace(workspace_id, null)));

create policy tasks_insert_members
  on kramaniti_hub.tasks for insert
  to authenticated
  with check (
    created_by = (select auth.uid())
    and (select kramaniti_hub_private.can_access_workspace(workspace_id, null))
  );

create policy tasks_update_members
  on kramaniti_hub.tasks for update
  to authenticated
  using ((select kramaniti_hub_private.can_access_workspace(workspace_id, null)))
  with check ((select kramaniti_hub_private.can_access_workspace(workspace_id, null)));

create policy notes_select_by_visibility
  on kramaniti_hub.notes for select
  to authenticated
  using (
    (select kramaniti_hub_private.can_access_workspace(workspace_id, null))
    and (
      visibility = 'shared'
      or (select kramaniti_hub_private.can_access_workspace(workspace_id, array['owner', 'collaborator']::text[]))
    )
  );

create policy notes_insert_by_visibility
  on kramaniti_hub.notes for insert
  to authenticated
  with check (
    created_by = (select auth.uid())
    and (select kramaniti_hub_private.can_access_workspace(workspace_id, null))
    and (
      visibility = 'shared'
      or (select kramaniti_hub_private.can_access_workspace(workspace_id, array['owner', 'collaborator']::text[]))
    )
  );

create policy notes_update_by_visibility
  on kramaniti_hub.notes for update
  to authenticated
  using (
    (select kramaniti_hub_private.can_access_workspace(workspace_id, null))
    and (
      visibility = 'shared'
      or (select kramaniti_hub_private.can_access_workspace(workspace_id, array['owner', 'collaborator']::text[]))
    )
  )
  with check (
    (select kramaniti_hub_private.can_access_workspace(workspace_id, null))
    and (
      visibility = 'shared'
      or (select kramaniti_hub_private.can_access_workspace(workspace_id, array['owner', 'collaborator']::text[]))
    )
  );

create policy messages_select_members
  on kramaniti_hub.messages for select
  to authenticated
  using ((select kramaniti_hub_private.can_access_workspace(workspace_id, null)));

create policy messages_insert_members
  on kramaniti_hub.messages for insert
  to authenticated
  with check (
    created_by = (select auth.uid())
    and (select kramaniti_hub_private.can_access_workspace(workspace_id, null))
  );

create policy assistant_messages_select_members
  on kramaniti_hub.assistant_messages for select
  to authenticated
  using ((select kramaniti_hub_private.can_access_workspace(workspace_id, null)));

create policy assistant_messages_insert_requester
  on kramaniti_hub.assistant_messages for insert
  to authenticated
  with check (
    created_by = (select auth.uid())
    and (select kramaniti_hub_private.can_access_workspace(workspace_id, null))
  );

create policy assistant_actions_select_members
  on kramaniti_hub.assistant_actions for select
  to authenticated
  using ((select kramaniti_hub_private.can_access_workspace(workspace_id, null)));

create policy assistant_actions_insert_requester
  on kramaniti_hub.assistant_actions for insert
  to authenticated
  with check (
    requested_by = (select auth.uid())
    and status = 'pending'
    and (select kramaniti_hub_private.can_access_workspace(workspace_id, null))
  );

create policy assistant_actions_update_requester_or_owner
  on kramaniti_hub.assistant_actions for update
  to authenticated
  using (
    requested_by = (select auth.uid())
    or (select kramaniti_hub_private.can_access_workspace(workspace_id, array['owner']::text[]))
  )
  with check (
    requested_by = (select auth.uid())
    or (select kramaniti_hub_private.can_access_workspace(workspace_id, array['owner']::text[]))
  );

create policy repository_items_select_by_visibility
  on kramaniti_hub.repository_items for select
  to authenticated
  using (
    (select kramaniti_hub_private.can_access_workspace(workspace_id, null))
    and (
      visibility = 'shared'
      or (select kramaniti_hub_private.can_access_workspace(workspace_id, array['owner', 'collaborator']::text[]))
    )
  );

grant select on kramaniti_hub.profiles to authenticated;
grant update (display_name, must_change_password, updated_at) on kramaniti_hub.profiles to authenticated;

grant select, insert on kramaniti_hub.workspaces to authenticated;
grant update (name, status, repository_summary, updated_at) on kramaniti_hub.workspaces to authenticated;
grant select, insert, delete on kramaniti_hub.workspace_members to authenticated;
grant update (role) on kramaniti_hub.workspace_members to authenticated;
grant select, insert on kramaniti_hub.projects to authenticated;
grant update (title, description, status, source, repository_path, owner_id, start_date, due_date, updated_at)
  on kramaniti_hub.projects to authenticated;
grant select, insert on kramaniti_hub.tasks to authenticated;
grant update (project_id, parent_task_id, title, description, status, priority, source, assignee_id, due_date, sort_order, updated_at)
  on kramaniti_hub.tasks to authenticated;
grant select, insert on kramaniti_hub.notes to authenticated;
grant update (project_id, title, body, visibility, source, updated_at)
  on kramaniti_hub.notes to authenticated;
grant select, insert on kramaniti_hub.messages to authenticated;
grant select, insert on kramaniti_hub.assistant_messages to authenticated;
grant select, insert on kramaniti_hub.assistant_actions to authenticated;
grant update (status, reviewed_by, updated_at) on kramaniti_hub.assistant_actions to authenticated;
grant select on kramaniti_hub.repository_items to authenticated;

grant all on all tables in schema kramaniti_hub to service_role;
grant all on all functions in schema kramaniti_hub_private to service_role;

do $$
declare
  relation_name text;
begin
  foreach relation_name in array array[
    'workspaces',
    'workspace_members',
    'projects',
    'tasks',
    'notes',
    'messages',
    'assistant_messages',
    'assistant_actions',
    'repository_items'
  ] loop
    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'kramaniti_hub'
        and tablename = relation_name
    ) then
      execute format('alter publication supabase_realtime add table kramaniti_hub.%I', relation_name);
    end if;
  end loop;
end;
$$;

alter role authenticator set pgrst.db_schemas = 'public, storage, graphql_public, clarity_square, kramaniti_hub';
notify pgrst, 'reload config';
notify pgrst, 'reload schema';

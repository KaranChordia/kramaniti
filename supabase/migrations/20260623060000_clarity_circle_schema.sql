-- Kramaniti Clarity Circle
-- Isolated schema for auth-backed Clarity Circle user context.
-- Keep this separate from existing recruiting-company tables.

create schema if not exists clarity_circle;

grant usage on schema clarity_circle to authenticated;

create or replace function clarity_circle.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists clarity_circle.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  preferred_track text check (preferred_track in ('founder', 'builder')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists clarity_circle.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  track text not null check (track in ('founder', 'builder')),
  title text not null,
  context text not null,
  audience text,
  blocker text,
  outcome text,
  summary text,
  questions jsonb not null default '[]'::jsonb,
  actions jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists clarity_circle.context_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references clarity_circle.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_type text not null check (entry_type in ('intent', 'note', 'digest', 'brief', 'engine_handoff')),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists profiles_updated_at_idx
  on clarity_circle.profiles (updated_at desc);

create index if not exists projects_user_id_updated_at_idx
  on clarity_circle.projects (user_id, updated_at desc);

create index if not exists projects_user_id_status_idx
  on clarity_circle.projects (user_id, status);

create index if not exists context_entries_user_id_created_at_idx
  on clarity_circle.context_entries (user_id, created_at desc);

create index if not exists context_entries_project_id_created_at_idx
  on clarity_circle.context_entries (project_id, created_at desc);

drop trigger if exists set_profiles_updated_at on clarity_circle.profiles;
create trigger set_profiles_updated_at
before update on clarity_circle.profiles
for each row execute function clarity_circle.set_updated_at();

drop trigger if exists set_projects_updated_at on clarity_circle.projects;
create trigger set_projects_updated_at
before update on clarity_circle.projects
for each row execute function clarity_circle.set_updated_at();

alter table clarity_circle.profiles enable row level security;
alter table clarity_circle.projects enable row level security;
alter table clarity_circle.context_entries enable row level security;

create policy "clarity_circle_profiles_select_own"
on clarity_circle.profiles
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "clarity_circle_profiles_insert_own"
on clarity_circle.profiles
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "clarity_circle_profiles_update_own"
on clarity_circle.profiles
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "clarity_circle_projects_select_own"
on clarity_circle.projects
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "clarity_circle_projects_insert_own"
on clarity_circle.projects
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "clarity_circle_projects_update_own"
on clarity_circle.projects
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "clarity_circle_projects_delete_own"
on clarity_circle.projects
for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "clarity_circle_context_entries_select_own"
on clarity_circle.context_entries
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "clarity_circle_context_entries_insert_own"
on clarity_circle.context_entries
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from clarity_circle.projects
    where projects.id = context_entries.project_id
      and projects.user_id = (select auth.uid())
  )
);

create policy "clarity_circle_context_entries_update_own"
on clarity_circle.context_entries
for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from clarity_circle.projects
    where projects.id = context_entries.project_id
      and projects.user_id = (select auth.uid())
  )
);

create policy "clarity_circle_context_entries_delete_own"
on clarity_circle.context_entries
for delete
to authenticated
using ((select auth.uid()) = user_id);

grant select, insert, update, delete on clarity_circle.profiles to authenticated;
grant select, insert, update, delete on clarity_circle.projects to authenticated;
grant select, insert, update, delete on clarity_circle.context_entries to authenticated;

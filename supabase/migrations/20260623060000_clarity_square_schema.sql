-- Kramaniti Clarity Square
-- Isolated schema for auth-backed Clarity Square user context.
-- Keep this separate from existing recruiting-company tables.

create schema if not exists clarity_square;

grant usage on schema clarity_square to authenticated;

create or replace function clarity_square.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists clarity_square.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  preferred_track text check (preferred_track in ('founder', 'builder')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists clarity_square.projects (
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

create table if not exists clarity_square.context_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references clarity_square.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_type text not null check (entry_type in ('intent', 'note', 'digest', 'brief', 'engine_handoff')),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists profiles_updated_at_idx
  on clarity_square.profiles (updated_at desc);

create index if not exists projects_user_id_updated_at_idx
  on clarity_square.projects (user_id, updated_at desc);

create index if not exists projects_user_id_status_idx
  on clarity_square.projects (user_id, status);

create index if not exists context_entries_user_id_created_at_idx
  on clarity_square.context_entries (user_id, created_at desc);

create index if not exists context_entries_project_id_created_at_idx
  on clarity_square.context_entries (project_id, created_at desc);

drop trigger if exists set_profiles_updated_at on clarity_square.profiles;
create trigger set_profiles_updated_at
before update on clarity_square.profiles
for each row execute function clarity_square.set_updated_at();

drop trigger if exists set_projects_updated_at on clarity_square.projects;
create trigger set_projects_updated_at
before update on clarity_square.projects
for each row execute function clarity_square.set_updated_at();

alter table clarity_square.profiles enable row level security;
alter table clarity_square.projects enable row level security;
alter table clarity_square.context_entries enable row level security;

create policy "clarity_square_profiles_select_own"
on clarity_square.profiles
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "clarity_square_profiles_insert_own"
on clarity_square.profiles
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "clarity_square_profiles_update_own"
on clarity_square.profiles
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "clarity_square_projects_select_own"
on clarity_square.projects
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "clarity_square_projects_insert_own"
on clarity_square.projects
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "clarity_square_projects_update_own"
on clarity_square.projects
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "clarity_square_projects_delete_own"
on clarity_square.projects
for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "clarity_square_context_entries_select_own"
on clarity_square.context_entries
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "clarity_square_context_entries_insert_own"
on clarity_square.context_entries
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from clarity_square.projects
    where projects.id = context_entries.project_id
      and projects.user_id = (select auth.uid())
  )
);

create policy "clarity_square_context_entries_update_own"
on clarity_square.context_entries
for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from clarity_square.projects
    where projects.id = context_entries.project_id
      and projects.user_id = (select auth.uid())
  )
);

create policy "clarity_square_context_entries_delete_own"
on clarity_square.context_entries
for delete
to authenticated
using ((select auth.uid()) = user_id);

grant select, insert, update, delete on clarity_square.profiles to authenticated;
grant select, insert, update, delete on clarity_square.projects to authenticated;
grant select, insert, update, delete on clarity_square.context_entries to authenticated;

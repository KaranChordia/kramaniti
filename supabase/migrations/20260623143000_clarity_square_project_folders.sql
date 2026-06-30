-- Kramaniti Clarity Square project folders
-- Adds user-owned Finder-style folders for organizing private projects.

create table if not exists clarity_square.project_folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint project_folders_name_not_blank check (length(trim(name)) between 1 and 80)
);

alter table clarity_square.projects
add column if not exists folder_id uuid references clarity_square.project_folders(id) on delete set null;

create unique index if not exists project_folders_user_id_name_unique_idx
  on clarity_square.project_folders (user_id, lower(trim(name)))
  where status = 'active';

create index if not exists project_folders_user_id_sort_order_idx
  on clarity_square.project_folders (user_id, sort_order, updated_at desc);

create index if not exists projects_user_id_folder_id_idx
  on clarity_square.projects (user_id, folder_id, updated_at desc);

drop trigger if exists set_project_folders_updated_at on clarity_square.project_folders;
create trigger set_project_folders_updated_at
before update on clarity_square.project_folders
for each row execute function clarity_square.set_updated_at();

alter table clarity_square.project_folders enable row level security;

create policy "clarity_square_project_folders_select_own"
on clarity_square.project_folders
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "clarity_square_project_folders_insert_own"
on clarity_square.project_folders
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "clarity_square_project_folders_update_own"
on clarity_square.project_folders
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "clarity_square_project_folders_delete_own"
on clarity_square.project_folders
for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "clarity_square_projects_insert_own" on clarity_square.projects;
create policy "clarity_square_projects_insert_own"
on clarity_square.projects
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and (
    folder_id is null
    or exists (
      select 1
      from clarity_square.project_folders
      where project_folders.id = projects.folder_id
        and project_folders.user_id = (select auth.uid())
        and project_folders.status = 'active'
    )
  )
);

drop policy if exists "clarity_square_projects_update_own" on clarity_square.projects;
create policy "clarity_square_projects_update_own"
on clarity_square.projects
for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and (
    folder_id is null
    or exists (
      select 1
      from clarity_square.project_folders
      where project_folders.id = projects.folder_id
        and project_folders.user_id = (select auth.uid())
        and project_folders.status = 'active'
    )
  )
);

grant select, insert, update, delete on clarity_square.project_folders to authenticated;

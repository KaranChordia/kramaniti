-- Kramaniti Clarity Circle project instructions and tasks
-- Adds user-owned project operating context plus task rows without touching other schemas.

alter table clarity_circle.projects
add column if not exists project_instruction text;

update clarity_circle.projects
set project_instruction = context
where project_instruction is null;

create table if not exists clarity_circle.project_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references clarity_circle.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  detail text,
  source text not null default 'user' check (source in ('auto', 'assistant', 'user')),
  status text not null default 'open' check (status in ('open', 'done', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint project_tasks_title_not_blank check (length(trim(title)) between 1 and 160)
);

create index if not exists project_tasks_project_id_sort_order_idx
  on clarity_circle.project_tasks (project_id, status, sort_order, updated_at desc);

create index if not exists project_tasks_user_id_updated_at_idx
  on clarity_circle.project_tasks (user_id, updated_at desc);

drop trigger if exists set_project_tasks_updated_at on clarity_circle.project_tasks;
create trigger set_project_tasks_updated_at
before update on clarity_circle.project_tasks
for each row execute function clarity_circle.set_updated_at();

alter table clarity_circle.project_tasks enable row level security;

create policy "clarity_circle_project_tasks_select_own"
on clarity_circle.project_tasks
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "clarity_circle_project_tasks_insert_own"
on clarity_circle.project_tasks
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from clarity_circle.projects
    where projects.id = project_tasks.project_id
      and projects.user_id = (select auth.uid())
      and projects.status = 'active'
  )
);

create policy "clarity_circle_project_tasks_update_own"
on clarity_circle.project_tasks
for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from clarity_circle.projects
    where projects.id = project_tasks.project_id
      and projects.user_id = (select auth.uid())
      and projects.status = 'active'
  )
);

create policy "clarity_circle_project_tasks_delete_own"
on clarity_circle.project_tasks
for delete
to authenticated
using ((select auth.uid()) = user_id);

grant select, insert, update, delete on clarity_circle.project_tasks to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'clarity_circle'
      and tablename = 'project_tasks'
  ) then
    alter publication supabase_realtime add table clarity_circle.project_tasks;
  end if;
end $$;

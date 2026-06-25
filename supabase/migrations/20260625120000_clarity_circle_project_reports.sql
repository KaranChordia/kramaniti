-- Kramaniti Clarity Circle project reports
-- Stores Clarity Engine blueprint reports against the originating Circle project.

create table if not exists clarity_circle.project_reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references clarity_circle.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  report_type text not null check (report_type in ('strategy', 'systems', 'presence')),
  title text not null,
  content text not null,
  source text not null default 'clarity_engine' check (source in ('clarity_engine')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint project_reports_title_not_blank check (length(trim(title)) between 1 and 140),
  constraint project_reports_content_not_blank check (length(trim(content)) > 0)
);

create index if not exists project_reports_user_id_created_at_idx
  on clarity_circle.project_reports (user_id, created_at desc);

create index if not exists project_reports_project_id_created_at_idx
  on clarity_circle.project_reports (project_id, created_at desc);

drop trigger if exists set_project_reports_updated_at on clarity_circle.project_reports;
create trigger set_project_reports_updated_at
before update on clarity_circle.project_reports
for each row execute function clarity_circle.set_updated_at();

alter table clarity_circle.project_reports enable row level security;

create policy "clarity_circle_project_reports_select_own"
on clarity_circle.project_reports
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "clarity_circle_project_reports_insert_own"
on clarity_circle.project_reports
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from clarity_circle.projects
    where projects.id = project_reports.project_id
      and projects.user_id = (select auth.uid())
      and projects.status = 'active'
  )
);

create policy "clarity_circle_project_reports_update_own"
on clarity_circle.project_reports
for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from clarity_circle.projects
    where projects.id = project_reports.project_id
      and projects.user_id = (select auth.uid())
      and projects.status = 'active'
  )
);

create policy "clarity_circle_project_reports_delete_own"
on clarity_circle.project_reports
for delete
to authenticated
using ((select auth.uid()) = user_id);

grant select, insert, update, delete on clarity_circle.project_reports to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'clarity_circle'
      and tablename = 'project_reports'
  ) then
    alter publication supabase_realtime add table clarity_circle.project_reports;
  end if;
end $$;

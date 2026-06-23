-- Kramaniti Clarity Circle realtime workspace
-- Enables realtime change events for user-owned Circle workspace tables.

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'clarity_circle'
      and tablename = 'projects'
  ) then
    alter publication supabase_realtime add table clarity_circle.projects;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'clarity_circle'
      and tablename = 'project_folders'
  ) then
    alter publication supabase_realtime add table clarity_circle.project_folders;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'clarity_circle'
      and tablename = 'context_entries'
  ) then
    alter publication supabase_realtime add table clarity_circle.context_entries;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'clarity_circle'
      and tablename = 'assistant_messages'
  ) then
    alter publication supabase_realtime add table clarity_circle.assistant_messages;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'clarity_circle'
      and tablename = 'assistant_memories'
  ) then
    alter publication supabase_realtime add table clarity_circle.assistant_memories;
  end if;
end $$;

-- Kramaniti Clarity Square realtime workspace
-- Enables realtime change events for user-owned Square workspace tables.

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'clarity_square'
      and tablename = 'projects'
  ) then
    alter publication supabase_realtime add table clarity_square.projects;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'clarity_square'
      and tablename = 'project_folders'
  ) then
    alter publication supabase_realtime add table clarity_square.project_folders;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'clarity_square'
      and tablename = 'context_entries'
  ) then
    alter publication supabase_realtime add table clarity_square.context_entries;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'clarity_square'
      and tablename = 'assistant_messages'
  ) then
    alter publication supabase_realtime add table clarity_square.assistant_messages;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'clarity_square'
      and tablename = 'assistant_memories'
  ) then
    alter publication supabase_realtime add table clarity_square.assistant_memories;
  end if;
end $$;

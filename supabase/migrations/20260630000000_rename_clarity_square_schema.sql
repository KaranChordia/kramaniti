-- Kramaniti Clarity Square live schema rename
-- Renames existing Clarity Square workspace storage from the previous schema name
-- while remaining a no-op for fresh databases where earlier migrations already
-- create clarity_square directly.

do $$
begin
  if exists (select 1 from pg_namespace where nspname = 'clarity_circle')
    and not exists (select 1 from pg_namespace where nspname = 'clarity_square') then
    alter schema clarity_circle rename to clarity_square;
  elsif exists (select 1 from pg_namespace where nspname = 'clarity_circle')
    and exists (select 1 from pg_namespace where nspname = 'clarity_square') then
    raise exception 'Both clarity_circle and clarity_square schemas exist. Merge or drop the legacy schema before applying this migration.';
  end if;
end $$;

grant usage on schema clarity_square to anon, authenticated;

alter role authenticator set pgrst.db_schemas = 'public, storage, graphql_public, clarity_square';
notify pgrst, 'reload config';

do $$
begin
  if exists (
    select 1
    from pg_trigger
    where tgname = 'clarity_circle_create_profile_on_auth_signup'
      and tgrelid = 'auth.users'::regclass
  ) then
    alter trigger clarity_circle_create_profile_on_auth_signup
    on auth.users
    rename to clarity_square_create_profile_on_auth_signup;
  end if;
exception
  when insufficient_privilege then
    -- Supabase-managed auth.users ownership can block trigger renames through
    -- remote migration roles. The trigger name is cosmetic; it still calls the
    -- renamed clarity_square.handle_new_auth_user() function after schema rename.
    raise notice 'Skipping auth.users trigger rename because the migration role does not own auth.users.';
end $$;

do $$
declare
  legacy_policy record;
  next_policy_name text;
begin
  for legacy_policy in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'clarity_square'
      and policyname like 'clarity\_circle\_%' escape '\'
  loop
    next_policy_name := replace(legacy_policy.policyname, 'clarity_circle_', 'clarity_square_');
    execute format(
      'alter policy %I on %I.%I rename to %I',
      legacy_policy.policyname,
      legacy_policy.schemaname,
      legacy_policy.tablename,
      next_policy_name
    );
  end loop;
end $$;

do $$
begin
  if to_regprocedure('clarity_square.resolve_login_email(text)') is not null then
    alter function clarity_square.resolve_login_email(text)
    set search_path = pg_catalog, clarity_square, public;
  end if;

  if to_regprocedure('clarity_square.handle_new_auth_user()') is not null then
    alter function clarity_square.handle_new_auth_user()
    set search_path = clarity_square, public;
  end if;
end $$;

do $$
declare
  workspace_table text;
begin
  foreach workspace_table in array array[
    'projects',
    'project_folders',
    'context_entries',
    'assistant_messages',
    'assistant_memories',
    'project_tasks',
    'project_reports'
  ]
  loop
    if exists (
      select 1
      from pg_class
      join pg_namespace on pg_namespace.oid = pg_class.relnamespace
      where pg_namespace.nspname = 'clarity_square'
        and pg_class.relname = workspace_table
    )
      and not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'clarity_square'
          and tablename = workspace_table
      ) then
      execute format('alter publication supabase_realtime add table clarity_square.%I', workspace_table);
    end if;
  end loop;
end $$;

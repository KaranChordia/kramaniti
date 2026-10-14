-- Execute only during an approved rollback, never in the forward migration stream.
begin;
DO $remove_facade$
declare obj record;
begin
  -- RESTRICT is deliberate: unexpected dependencies abort instead of destroying them.
  for obj in select table_name from information_schema.views where table_schema='clarity_square' loop
    execute format('drop view clarity_square.%I',obj.table_name);
  end loop;
end;
$remove_facade$;
drop function clarity_square.resolve_login_email(text);
drop schema clarity_square;
DO $rollback$
declare obj record; schemas text;
begin
  alter schema spasht rename to clarity_square;
  for obj in select p.oid from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='clarity_square' loop
    execute replace(pg_get_functiondef(obj.oid),'spasht','clarity_square');
  end loop;
  for obj in select tablename,policyname from pg_policies where schemaname='clarity_square' and policyname like '%spasht%' loop
    execute format('alter policy %I on clarity_square.%I rename to %I',obj.policyname,obj.tablename,replace(obj.policyname,'spasht','clarity_square'));
  end loop;
  for obj in select c.relname from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='clarity_square' and c.relkind='i' and c.relname like '%spasht%' loop
    execute format('alter index clarity_square.%I rename to %I',obj.relname,replace(obj.relname,'spasht','clarity_square'));
  end loop;
  for obj in select t.tgname,c.relname,n.nspname from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_namespace n on n.oid=c.relnamespace where not t.tgisinternal and t.tgname like '%spasht%' and (n.nspname='clarity_square' or (n.nspname='auth' and c.relname='users')) loop
    execute format('alter trigger %I on %I.%I rename to %I',obj.tgname,obj.nspname,obj.relname,replace(obj.tgname,'spasht','clarity_square'));
  end loop;
  select substring(v from length('pgrst.db_schemas=')+1) into schemas from pg_roles r cross join unnest(r.rolconfig) v where r.rolname='authenticator' and v like 'pgrst.db_schemas=%';
  execute format('alter role authenticator set pgrst.db_schemas = %L',regexp_replace(schemas, ', spasht$', ''));
end;
$rollback$;
-- Keep community_post accepted: a rollback must retain events written by Spasht.
notify pgrst, 'reload config';
notify pgrst, 'reload schema';
commit;

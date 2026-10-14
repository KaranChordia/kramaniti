-- Spasht: rename existing objects in place; no member records are rewritten.
begin;
DO $migration$
declare obj record; definition text; schemas text;
begin
  if to_regnamespace('clarity_square') is null or to_regnamespace('spasht') is not null then
    raise exception 'Expected clarity_square only; stop and inspect schema ownership';
  end if;
  alter schema clarity_square rename to spasht;
  -- Function bodies and explicit search_path strings do not follow a schema rename.
  for obj in select p.oid from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='spasht' loop
    definition := replace(pg_get_functiondef(obj.oid), 'clarity_square', 'spasht');
    execute definition;
  end loop;
  for obj in select tablename,policyname from pg_policies where schemaname='spasht' and policyname like '%clarity_square%' loop
    execute format('alter policy %I on spasht.%I rename to %I', obj.policyname,obj.tablename,replace(obj.policyname,'clarity_square','spasht'));
  end loop;
  for obj in select c.relname from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='spasht' and c.relkind='i' and c.relname like '%clarity_square%' loop
    execute format('alter index spasht.%I rename to %I',obj.relname,replace(obj.relname,'clarity_square','spasht'));
  end loop;
  for obj in select t.tgname,c.relname,n.nspname from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_namespace n on n.oid=c.relnamespace where not t.tgisinternal and t.tgname like '%clarity_square%' and (n.nspname='spasht' or (n.nspname='auth' and c.relname='users')) loop
    execute format('alter trigger %I on %I.%I rename to %I',obj.tgname,obj.nspname,obj.relname,replace(obj.tgname,'clarity_square','spasht'));
  end loop;
  -- Preserve the legacy event value while allowing the new community identifier.
  for obj in select c.conname,pg_get_constraintdef(c.oid) as def from pg_constraint c where c.conrelid='spasht.product_events'::regclass and c.contype='c' and pg_get_constraintdef(c.oid) like '%square_post%' loop
    execute format('alter table spasht.product_events drop constraint %I',obj.conname);
    execute format('alter table spasht.product_events add constraint %I %s',obj.conname,replace(obj.def,'''square_post''::text', '''square_post''::text, ''community_post''::text'));
  end loop;
  -- Preserve every existing exposed schema, including Client Hub.
  select substring(v from length('pgrst.db_schemas=')+1) into schemas from pg_roles r cross join unnest(r.rolconfig) v where r.rolname='authenticator' and v like 'pgrst.db_schemas=%';
  if schemas is null then raise exception 'Missing explicit Data API schema configuration'; end if;
  execute format('alter role authenticator set pgrst.db_schemas = %L',schemas || ', spasht');
end;
$migration$;
-- Temporary compatibility facade for cached clients. Invoker views enforce the
-- underlying table RLS; copy only existing grants, never broaden access.
create schema clarity_square;
grant usage on schema clarity_square to anon,authenticated;
DO $facade$
declare obj record; permission record;
begin
  for obj in select tablename from pg_tables where schemaname='spasht' loop
    execute format('create view clarity_square.%I with (security_invoker=true) as select * from spasht.%I',obj.tablename,obj.tablename);
    for permission in select grantee,privilege_type from information_schema.role_table_grants where table_schema='spasht' and table_name=obj.tablename and grantee in ('anon','authenticated','service_role') loop
      execute format('grant %s on clarity_square.%I to %I',permission.privilege_type,obj.tablename,permission.grantee);
    end loop;
  end loop;
end;
$facade$;
create function clarity_square.resolve_login_email(login text) returns text language sql security invoker set search_path=pg_catalog as $$ select spasht.resolve_login_email(login); $$;
revoke all on function clarity_square.resolve_login_email(text) from public;
grant execute on function clarity_square.resolve_login_email(text) to anon, authenticated;
notify pgrst, 'reload config';
notify pgrst, 'reload schema';
commit;

-- Kramaniti Clarity Square function hardening
-- Fixes mutable search_path warnings on helper functions used by the isolated schema.

create or replace function clarity_square.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function clarity_square.normalized_username(value text)
returns text
language sql
immutable
set search_path = pg_catalog
as $$
  select nullif(regexp_replace(lower(trim(coalesce(value, ''))), '[^a-z0-9_]', '', 'g'), '');
$$;

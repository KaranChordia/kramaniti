-- Kramaniti Clarity Circle usernames
-- Adds username support for Clarity Circle profiles without touching other schemas.

alter table clarity_circle.profiles
add column if not exists username text;

alter table clarity_circle.profiles
drop constraint if exists profiles_username_format;

alter table clarity_circle.profiles
add constraint profiles_username_format
check (
  username is null
  or username ~ '^[a-z0-9_]{3,24}$'
);

create unique index if not exists profiles_username_unique_idx
on clarity_circle.profiles (lower(username))
where username is not null;

create or replace function clarity_circle.resolve_login_email(login text)
returns text
language sql
security definer
set search_path = clarity_circle, public
as $$
  select email
  from clarity_circle.profiles
  where lower(username) = lower(trim(login))
  limit 1;
$$;

revoke all on function clarity_circle.resolve_login_email(text) from public;
grant execute on function clarity_circle.resolve_login_email(text) to anon, authenticated;

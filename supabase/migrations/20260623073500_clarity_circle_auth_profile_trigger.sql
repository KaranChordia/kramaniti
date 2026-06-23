-- Kramaniti Clarity Circle auth profile trigger
-- Ensures every Clarity Circle auth signup creates a matching isolated profile row.

create or replace function clarity_circle.normalized_username(value text)
returns text
language sql
immutable
as $$
  select nullif(regexp_replace(lower(trim(coalesce(value, ''))), '[^a-z0-9_]', '', 'g'), '');
$$;

create or replace function clarity_circle.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = clarity_circle, public
as $$
declare
  requested_username text;
begin
  requested_username := clarity_circle.normalized_username(new.raw_user_meta_data ->> 'username');

  insert into clarity_circle.profiles (user_id, email, username)
  values (
    new.id,
    new.email,
    case
      when requested_username ~ '^[a-z0-9_]{3,24}$' then requested_username
      else null
    end
  )
  on conflict (user_id) do update
  set
    email = excluded.email,
    username = coalesce(clarity_circle.profiles.username, excluded.username),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists clarity_circle_create_profile_on_auth_signup on auth.users;
create trigger clarity_circle_create_profile_on_auth_signup
after insert on auth.users
for each row execute function clarity_circle.handle_new_auth_user();

insert into clarity_circle.profiles (user_id, email, username)
select
  users.id,
  users.email,
  case
    when clarity_circle.normalized_username(users.raw_user_meta_data ->> 'username') ~ '^[a-z0-9_]{3,24}$'
      then clarity_circle.normalized_username(users.raw_user_meta_data ->> 'username')
    else null
  end
from auth.users
where users.raw_user_meta_data ? 'username'
on conflict (user_id) do update
set
  email = excluded.email,
  username = coalesce(clarity_circle.profiles.username, excluded.username),
  updated_at = now();

-- Kramaniti Clarity Square function reference repair
-- Rewrites function bodies that kept explicit clarity_circle references after
-- the live schema rename to clarity_square.

create or replace function clarity_square.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = clarity_square, public
as $$
declare
  requested_username text;
begin
  requested_username := clarity_square.normalized_username(new.raw_user_meta_data ->> 'username');

  insert into clarity_square.profiles (user_id, email, username)
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
    username = coalesce(clarity_square.profiles.username, excluded.username),
    updated_at = now();

  return new;
end;
$$;

create or replace function clarity_square.resolve_login_email(login text)
returns text
language plpgsql
security definer
set search_path = pg_catalog, clarity_square, public
as $$
declare
  normalized_login text;
  matched_user_id uuid;
  matched_email text;
begin
  normalized_login := clarity_square.normalized_username(login);

  if normalized_login is null or normalized_login !~ '^[a-z0-9_]{3,24}$' then
    return null;
  end if;

  select profiles.user_id, profiles.email
  into matched_user_id, matched_email
  from clarity_square.profiles
  where lower(profiles.username) = normalized_login
  limit 1;

  if matched_email is not null then
    return matched_email;
  end if;

  if matched_user_id is not null then
    select users.email
    into matched_email
    from auth.users
    where users.id = matched_user_id
      and users.email is not null
    limit 1;

    if matched_email is not null then
      update clarity_square.profiles
      set email = matched_email
      where user_id = matched_user_id;

      return matched_email;
    end if;
  end if;

  select users.id, users.email
  into matched_user_id, matched_email
  from auth.users
  where clarity_square.normalized_username(users.raw_user_meta_data ->> 'username') = normalized_login
    and users.email is not null
  order by users.created_at asc
  limit 1;

  if matched_user_id is not null and matched_email is not null then
    insert into clarity_square.profiles (user_id, email, username)
    values (matched_user_id, matched_email, normalized_login)
    on conflict (user_id) do update
    set
      email = excluded.email,
      username = coalesce(clarity_square.profiles.username, excluded.username),
      updated_at = now();

    return matched_email;
  end if;

  return null;
end;
$$;

revoke all on function clarity_square.resolve_login_email(text) from public;
grant execute on function clarity_square.resolve_login_email(text) to anon, authenticated;

notify pgrst, 'reload schema';

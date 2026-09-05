-- KOSH PROJECT ONLY: sqrhwxjgyuqmjsclgmvt. Not part of Platform migrations.
-- Review and apply explicitly to Kosh after verifying the destination project.
begin;
create table if not exists kosh.working_copies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id text not null check (length(template_id) between 1 and 120),
  template_version text not null check (length(template_version) between 1 and 30),
  title text not null check (length(trim(title)) between 1 and 160),
  content text not null check (length(trim(content)) between 1 and 24000),
  context_kind text not null check (context_kind in ('personal','professional','custom','manual')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists working_copies_user_updated on kosh.working_copies(user_id, updated_at desc);
alter table kosh.working_copies enable row level security;
revoke all on kosh.working_copies from anon;
grant select, insert, update, delete on kosh.working_copies to authenticated;
drop policy if exists working_copies_owner on kosh.working_copies;
create policy working_copies_owner on kosh.working_copies for all to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Keep the privileged quota implementation outside the exposed API schema.
create schema if not exists kosh_private;
revoke all on schema kosh_private from public, anon;
grant usage on schema kosh_private to authenticated;

-- Server-side, atomic, per-user limit shared by all application instances.
-- Attempts count even when generation fails. No private context is stored here.
create table if not exists kosh_private.adaptation_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_day date not null,
  attempts integer not null default 1 check (attempts between 1 and 10),
  primary key(user_id, usage_day)
);
alter table kosh_private.adaptation_usage enable row level security;
revoke all on kosh_private.adaptation_usage from anon, authenticated;
create or replace function kosh_private.consume_adaptation_attempt() returns boolean
language plpgsql security definer set search_path = '' as $$
declare count_after integer;
begin
  if auth.uid() is null then return false; end if;
  insert into kosh_private.adaptation_usage(user_id, usage_day, attempts)
  values(auth.uid(), (now() at time zone 'UTC')::date, 1)
  on conflict(user_id, usage_day) do update
    set attempts = kosh_private.adaptation_usage.attempts + 1
    where kosh_private.adaptation_usage.attempts < 10
  returning attempts into count_after;
  return count_after is not null;
end;
$$;
revoke all on function kosh_private.consume_adaptation_attempt() from public, anon;
grant execute on function kosh_private.consume_adaptation_attempt() to authenticated;
-- The exposed entrypoint retains caller permissions; only the private helper elevates.
create or replace function kosh.consume_adaptation_attempt() returns boolean
language sql security invoker set search_path = '' as $$
  select kosh_private.consume_adaptation_attempt();
$$;
revoke all on function kosh.consume_adaptation_attempt() from public, anon;
grant execute on function kosh.consume_adaptation_attempt() to authenticated;
commit;

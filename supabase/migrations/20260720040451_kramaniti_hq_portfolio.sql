create table if not exists kramaniti_hub.hq_portfolio_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null unique references kramaniti_hub.workspaces(id) on delete cascade,
  owner_id uuid not null references kramaniti_hub.profiles(user_id) on delete cascade,
  kind text not null default 'client' check (kind in ('company', 'client', 'relationship')),
  stage text not null default 'discovery' check (
    stage in ('internal_build', 'relationship', 'discovery', 'proposal', 'commercial_sent', 'approval', 'delivery', 'paused', 'closed')
  ),
  health text not null default 'steady' check (health in ('moving', 'steady', 'waiting', 'attention')),
  priority smallint not null default 3 check (priority between 1 and 5),
  summary text not null default '',
  next_action text not null default '',
  waiting_on text not null default '',
  primary_contact text not null default '',
  last_contact_at timestamptz,
  next_follow_up_at timestamptz,
  commercial_value text not null default '',
  repository_key text not null default '',
  repository_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hq_portfolio_summary_length check (char_length(summary) <= 6000),
  constraint hq_portfolio_next_action_length check (char_length(next_action) <= 2000),
  constraint hq_portfolio_waiting_on_length check (char_length(waiting_on) <= 1000),
  constraint hq_portfolio_contact_length check (char_length(primary_contact) <= 180),
  constraint hq_portfolio_commercial_value_length check (char_length(commercial_value) <= 180),
  constraint hq_portfolio_repository_key_format check (
    repository_key = '' or repository_key ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  )
);

create index if not exists hq_portfolio_owner_priority_idx
  on kramaniti_hub.hq_portfolio_items (owner_id, priority, updated_at desc);
create index if not exists hq_portfolio_follow_up_idx
  on kramaniti_hub.hq_portfolio_items (owner_id, next_follow_up_at)
  where next_follow_up_at is not null;

create table if not exists kramaniti_hub.hq_actions (
  id uuid primary key default gen_random_uuid(),
  portfolio_item_id uuid not null references kramaniti_hub.hq_portfolio_items(id) on delete cascade,
  owner_id uuid not null references kramaniti_hub.profiles(user_id) on delete cascade,
  title text not null,
  notes text not null default '',
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'waiting', 'done', 'archived')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hq_actions_title_length check (char_length(btrim(title)) between 1 and 240),
  constraint hq_actions_notes_length check (char_length(notes) <= 6000)
);

create index if not exists hq_actions_owner_status_due_idx
  on kramaniti_hub.hq_actions (owner_id, status, due_at, created_at);
create index if not exists hq_actions_portfolio_idx
  on kramaniti_hub.hq_actions (portfolio_item_id, status, created_at);

drop trigger if exists hq_portfolio_items_touch_updated_at on kramaniti_hub.hq_portfolio_items;
create trigger hq_portfolio_items_touch_updated_at
  before update on kramaniti_hub.hq_portfolio_items
  for each row execute function kramaniti_hub_private.touch_updated_at();

drop trigger if exists hq_actions_touch_updated_at on kramaniti_hub.hq_actions;
create trigger hq_actions_touch_updated_at
  before update on kramaniti_hub.hq_actions
  for each row execute function kramaniti_hub_private.touch_updated_at();

alter table kramaniti_hub.hq_portfolio_items enable row level security;
alter table kramaniti_hub.hq_actions enable row level security;

drop policy if exists hq_portfolio_select_owner on kramaniti_hub.hq_portfolio_items;
create policy hq_portfolio_select_owner
  on kramaniti_hub.hq_portfolio_items for select
  to authenticated
  using (
    owner_id = (select auth.uid())
    and (select kramaniti_hub_private.current_user_is_owner())
  );

drop policy if exists hq_portfolio_insert_owner on kramaniti_hub.hq_portfolio_items;
create policy hq_portfolio_insert_owner
  on kramaniti_hub.hq_portfolio_items for insert
  to authenticated
  with check (
    owner_id = (select auth.uid())
    and (select kramaniti_hub_private.current_user_is_owner())
  );

drop policy if exists hq_portfolio_update_owner on kramaniti_hub.hq_portfolio_items;
create policy hq_portfolio_update_owner
  on kramaniti_hub.hq_portfolio_items for update
  to authenticated
  using (
    owner_id = (select auth.uid())
    and (select kramaniti_hub_private.current_user_is_owner())
  )
  with check (
    owner_id = (select auth.uid())
    and (select kramaniti_hub_private.current_user_is_owner())
  );

drop policy if exists hq_portfolio_delete_owner on kramaniti_hub.hq_portfolio_items;
create policy hq_portfolio_delete_owner
  on kramaniti_hub.hq_portfolio_items for delete
  to authenticated
  using (
    owner_id = (select auth.uid())
    and (select kramaniti_hub_private.current_user_is_owner())
  );

drop policy if exists hq_actions_select_owner on kramaniti_hub.hq_actions;
create policy hq_actions_select_owner
  on kramaniti_hub.hq_actions for select
  to authenticated
  using (
    owner_id = (select auth.uid())
    and (select kramaniti_hub_private.current_user_is_owner())
  );

drop policy if exists hq_actions_insert_owner on kramaniti_hub.hq_actions;
create policy hq_actions_insert_owner
  on kramaniti_hub.hq_actions for insert
  to authenticated
  with check (
    owner_id = (select auth.uid())
    and (select kramaniti_hub_private.current_user_is_owner())
  );

drop policy if exists hq_actions_update_owner on kramaniti_hub.hq_actions;
create policy hq_actions_update_owner
  on kramaniti_hub.hq_actions for update
  to authenticated
  using (
    owner_id = (select auth.uid())
    and (select kramaniti_hub_private.current_user_is_owner())
  )
  with check (
    owner_id = (select auth.uid())
    and (select kramaniti_hub_private.current_user_is_owner())
  );

drop policy if exists hq_actions_delete_owner on kramaniti_hub.hq_actions;
create policy hq_actions_delete_owner
  on kramaniti_hub.hq_actions for delete
  to authenticated
  using (
    owner_id = (select auth.uid())
    and (select kramaniti_hub_private.current_user_is_owner())
  );

grant select, insert, delete on kramaniti_hub.hq_portfolio_items to authenticated;
grant update (
  kind,
  stage,
  health,
  priority,
  summary,
  next_action,
  waiting_on,
  primary_contact,
  last_contact_at,
  next_follow_up_at,
  commercial_value,
  repository_key,
  repository_snapshot,
  updated_at
) on kramaniti_hub.hq_portfolio_items to authenticated;

grant select, insert, delete on kramaniti_hub.hq_actions to authenticated;
grant update (
  title,
  notes,
  status,
  priority,
  due_at,
  completed_at,
  updated_at
) on kramaniti_hub.hq_actions to authenticated;

grant all on kramaniti_hub.hq_portfolio_items to service_role;
grant all on kramaniti_hub.hq_actions to service_role;

insert into kramaniti_hub.workspaces (slug, name, status, created_by)
select seed.slug, seed.name, 'active', owner_profile.user_id
from kramaniti_hub.profiles owner_profile
cross join (
  values
    ('kramaniti-internal', 'Kramaniti Internal'),
    ('maitri-circle', 'Maitri Circle'),
    ('basispoint-studio', 'Basispoint Studio'),
    ('trust-data', 'Trust Data'),
    ('raju-bafna', 'Raju Bafna')
) as seed(slug, name)
where owner_profile.role = 'owner'
on conflict (slug) do nothing;

insert into kramaniti_hub.workspace_members (workspace_id, user_id, role)
select workspace.id, owner_profile.user_id, 'owner'
from kramaniti_hub.profiles owner_profile
join kramaniti_hub.workspaces workspace on workspace.created_by = owner_profile.user_id
where owner_profile.role = 'owner'
  and workspace.slug in ('kramaniti-internal', 'maitri-circle', 'basispoint-studio', 'trust-data', 'raju-bafna')
on conflict (workspace_id, user_id) do update set role = excluded.role;

insert into kramaniti_hub.hq_portfolio_items (
  workspace_id,
  owner_id,
  kind,
  stage,
  health,
  priority,
  summary,
  next_action,
  waiting_on,
  primary_contact,
  next_follow_up_at,
  commercial_value,
  repository_key
)
select
  workspace.id,
  owner_profile.user_id,
  seed.kind,
  seed.stage,
  seed.health,
  seed.priority,
  seed.summary,
  seed.next_action,
  seed.waiting_on,
  seed.primary_contact,
  seed.next_follow_up_at,
  seed.commercial_value,
  seed.repository_key
from kramaniti_hub.profiles owner_profile
join (
  values
    (
      'kramaniti-internal', 'company', 'internal_build', 'moving', 1,
      'Primary company operating system, public presence, internal tools and delivery infrastructure.',
      'Stabilise the current product work and make Kramaniti HQ the daily operating surface.',
      '', '', null::timestamptz, '', 'kramaniti'
    ),
    (
      'trust-data', 'client', 'approval', 'waiting', 1,
      'Patient engagement control hub proposal and commercial quotation have been delivered.',
      'Follow up on commercial approval and move only after written acceptance, first milestone and named owners.',
      'Approval from Hemanth Kumar Bothra', 'Ravi', current_date + time '12:00', 'Rs. 7,75,000 plus applicable taxes', 'trust-data'
    ),
    (
      'raju-bafna', 'relationship', 'relationship', 'attention', 1,
      'Multiple research and opportunity reports are complete; the relationship now needs a focused next-step conversation.',
      'Reconnect, acknowledge the missed call and select one opportunity to progress.',
      '', 'Raju Bafna', current_date + time '11:00', '', 'raju-bafna'
    ),
    (
      'basispoint-studio', 'client', 'proposal', 'waiting', 2,
      'The Basispoint Sales OS plan, proposal and implementation backlog have been shared.',
      'Confirm receipt and schedule the role, workflow, security and MVP decision session before final pricing.',
      'Rohan response and discovery decisions', 'Rohan', current_date + time '15:00', '', 'basispoint-studio'
    ),
    (
      'maitri-circle', 'client', 'delivery', 'waiting', 3,
      'Homepage refinement, storybook manufacturing research, logo directions and visiting-card concepts have been delivered.',
      'Collect consolidated feedback before refining the remaining website pages.',
      'Shwetika feedback', 'Shwetika', (current_date + 1) + time '11:00', '', 'maitri-circle'
    )
) as seed(
  slug,
  kind,
  stage,
  health,
  priority,
  summary,
  next_action,
  waiting_on,
  primary_contact,
  next_follow_up_at,
  commercial_value,
  repository_key
) on true
join kramaniti_hub.workspaces workspace
  on workspace.slug = seed.slug and workspace.created_by = owner_profile.user_id
where owner_profile.role = 'owner'
on conflict (workspace_id) do nothing;

insert into kramaniti_hub.hq_actions (
  portfolio_item_id,
  owner_id,
  title,
  notes,
  status,
  priority,
  due_at
)
select portfolio.id, portfolio.owner_id, seed.title, seed.notes, seed.status, seed.priority, seed.due_at
from (
  values
    ('raju-bafna', 'Reconnect with Raju Bafna', 'Acknowledge the missed Friday call and agree one concrete next direction.', 'todo', 'urgent', current_date + time '11:00'),
    ('trust-data', 'Follow up on Trust approval', 'Reference quotation KRA-TRUST-PECH-170726 so the commercial amount is unambiguous.', 'todo', 'urgent', current_date + time '12:00'),
    ('basispoint-studio', 'Check in with Rohan', 'Use his response to schedule discovery and finalise the phase-wise commercial.', 'todo', 'high', current_date + time '15:00'),
    ('maitri-circle', 'Await consolidated Maitri feedback', 'Do not create further design directions until Shwetika responds.', 'waiting', 'normal', (current_date + 1) + time '11:00'),
    ('kramaniti-internal', 'Complete the Kramaniti HQ working tool', 'Verify security, repository pulse, actions and daily operating flow.', 'in_progress', 'urgent', (current_date + 1) + time '18:00')
) as seed(slug, title, notes, status, priority, due_at)
join kramaniti_hub.workspaces workspace on workspace.slug = seed.slug
join kramaniti_hub.hq_portfolio_items portfolio on portfolio.workspace_id = workspace.id
where not exists (
  select 1
  from kramaniti_hub.hq_actions existing
  where existing.portfolio_item_id = portfolio.id
    and existing.title = seed.title
);

do $$
declare
  relation_name text;
begin
  foreach relation_name in array array['hq_portfolio_items', 'hq_actions'] loop
    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'kramaniti_hub'
        and tablename = relation_name
    ) then
      execute format('alter publication supabase_realtime add table kramaniti_hub.%I', relation_name);
    end if;
  end loop;
end;
$$;

notify pgrst, 'reload schema';

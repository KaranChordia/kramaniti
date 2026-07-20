-- Clarity Square activation and return-loop events.
-- Events contain only product interaction names and small structural metadata,
-- never the user's submitted business context or assistant content.

create table if not exists clarity_square.product_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_name text not null check (
    event_name in (
      'page_view',
      'return_visit',
      'path_chosen',
      'context_started',
      'context_completed',
      'assistant_first_message',
      'clarity_brief_produced',
      'project_created',
      'task_drafted',
      'task_approved',
      'square_post',
      'response_saved',
      'loop_completed'
    )
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists product_events_user_id_created_at_idx
  on clarity_square.product_events (user_id, created_at desc);

create index if not exists product_events_user_id_event_name_created_at_idx
  on clarity_square.product_events (user_id, event_name, created_at desc);

alter table clarity_square.product_events enable row level security;

create policy "clarity_square_product_events_select_own"
on clarity_square.product_events
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "clarity_square_product_events_insert_own"
on clarity_square.product_events
for insert
to authenticated
with check ((select auth.uid()) = user_id);

grant select, insert on clarity_square.product_events to authenticated;

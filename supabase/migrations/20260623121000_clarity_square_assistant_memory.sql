-- Kramaniti Clarity Square assistant memory
-- Adds private, user-owned assistant conversations and manageable memory notes.

create table if not exists clarity_square.assistant_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references clarity_square.projects(id) on delete set null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists clarity_square.assistant_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references clarity_square.projects(id) on delete set null,
  memory_type text not null default 'insight' check (memory_type in ('insight', 'preference', 'project_signal', 'boundary')),
  title text not null,
  content text not null,
  source text not null default 'assistant' check (source in ('assistant', 'user')),
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists assistant_messages_user_id_created_at_idx
  on clarity_square.assistant_messages (user_id, created_at desc);

create index if not exists assistant_messages_project_id_created_at_idx
  on clarity_square.assistant_messages (project_id, created_at desc);

create index if not exists assistant_memories_user_id_updated_at_idx
  on clarity_square.assistant_memories (user_id, updated_at desc);

create index if not exists assistant_memories_project_id_updated_at_idx
  on clarity_square.assistant_memories (project_id, updated_at desc);

drop trigger if exists set_assistant_memories_updated_at on clarity_square.assistant_memories;
create trigger set_assistant_memories_updated_at
before update on clarity_square.assistant_memories
for each row execute function clarity_square.set_updated_at();

alter table clarity_square.assistant_messages enable row level security;
alter table clarity_square.assistant_memories enable row level security;

create policy "clarity_square_assistant_messages_select_own"
on clarity_square.assistant_messages
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "clarity_square_assistant_messages_insert_own"
on clarity_square.assistant_messages
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and (
    project_id is null
    or exists (
      select 1
      from clarity_square.projects
      where projects.id = assistant_messages.project_id
        and projects.user_id = (select auth.uid())
    )
  )
);

create policy "clarity_square_assistant_messages_delete_own"
on clarity_square.assistant_messages
for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "clarity_square_assistant_memories_select_own"
on clarity_square.assistant_memories
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "clarity_square_assistant_memories_insert_own"
on clarity_square.assistant_memories
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and (
    project_id is null
    or exists (
      select 1
      from clarity_square.projects
      where projects.id = assistant_memories.project_id
        and projects.user_id = (select auth.uid())
    )
  )
);

create policy "clarity_square_assistant_memories_update_own"
on clarity_square.assistant_memories
for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and (
    project_id is null
    or exists (
      select 1
      from clarity_square.projects
      where projects.id = assistant_memories.project_id
        and projects.user_id = (select auth.uid())
    )
  )
);

create policy "clarity_square_assistant_memories_delete_own"
on clarity_square.assistant_memories
for delete
to authenticated
using ((select auth.uid()) = user_id);

grant select, insert, delete on clarity_square.assistant_messages to authenticated;
grant select, insert, update, delete on clarity_square.assistant_memories to authenticated;

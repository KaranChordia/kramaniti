create index if not exists workspaces_created_by_idx
  on kramaniti_hub.workspaces (created_by);

create index if not exists projects_created_by_idx
  on kramaniti_hub.projects (created_by);

create index if not exists tasks_created_by_idx
  on kramaniti_hub.tasks (created_by);
create index if not exists tasks_project_scope_fk_idx
  on kramaniti_hub.tasks (project_id, workspace_id);
create index if not exists tasks_parent_scope_fk_idx
  on kramaniti_hub.tasks (parent_task_id, workspace_id);

create index if not exists notes_created_by_idx
  on kramaniti_hub.notes (created_by);
create index if not exists notes_project_scope_fk_idx
  on kramaniti_hub.notes (project_id, workspace_id);

create index if not exists messages_created_by_idx
  on kramaniti_hub.messages (created_by);
create index if not exists messages_project_scope_fk_idx
  on kramaniti_hub.messages (project_id, workspace_id);

create index if not exists assistant_messages_created_by_idx
  on kramaniti_hub.assistant_messages (created_by);
create index if not exists assistant_messages_project_scope_fk_idx
  on kramaniti_hub.assistant_messages (project_id, workspace_id);

create index if not exists assistant_actions_reviewed_by_idx
  on kramaniti_hub.assistant_actions (reviewed_by);
create index if not exists assistant_actions_project_scope_fk_idx
  on kramaniti_hub.assistant_actions (project_id, workspace_id);

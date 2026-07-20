drop policy if exists tasks_insert_members on kramaniti_hub.tasks;
create policy tasks_insert_staff
  on kramaniti_hub.tasks for insert
  to authenticated
  with check (
    created_by = (select auth.uid())
    and (select kramaniti_hub_private.can_access_workspace(
      workspace_id,
      array['owner', 'collaborator']::text[]
    ))
  );

drop policy if exists tasks_update_members on kramaniti_hub.tasks;
create policy tasks_update_staff
  on kramaniti_hub.tasks for update
  to authenticated
  using (
    (select kramaniti_hub_private.can_access_workspace(
      workspace_id,
      array['owner', 'collaborator']::text[]
    ))
  )
  with check (
    (select kramaniti_hub_private.can_access_workspace(
      workspace_id,
      array['owner', 'collaborator']::text[]
    ))
  );

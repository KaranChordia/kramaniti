import { createClient } from '@supabase/supabase-js';
import { getSpashtPublicKey, type SpashtDatabase } from './supabase';
import { workspaceRevision } from './workspace';

export async function loadAssistantWorkspace(token: string, selectedProjectId?: string | null) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = getSpashtPublicKey();
  if (!url || !key) return { error: 'Accounts are unavailable. Please try again later.', status: 503 } as const;
  const client = createClient<SpashtDatabase>(url, key, {
    db: { schema: 'spasht' },
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { data: { user }, error: authError } = await client.auth.getUser(token);
  if (authError || !user) return { error: 'Your session ended. Sign in to continue.', status: 401 } as const;
  const database = client.schema('spasht');
  const [projects, folders, tasks, entries, memories, profile] = await Promise.all([
    database.from('projects').select('*').eq('user_id', user.id).eq('status', 'active').order('updated_at', { ascending: false }).limit(120),
    database.from('project_folders').select('*').eq('user_id', user.id).eq('status', 'active').order('sort_order').order('updated_at', { ascending: false }).limit(60),
    database.from('project_tasks').select('*').eq('user_id', user.id).neq('status', 'archived').order('sort_order').order('updated_at', { ascending: false }).limit(240),
    database.from('context_entries').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(120),
    database.from('assistant_memories').select('*').eq('user_id', user.id).eq('status', 'active').order('updated_at', { ascending: false }).limit(20),
    database.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
  ]);
  if ([projects, folders, tasks, entries, memories, profile].some((result) => result.error)) {
    return { error: 'Your saved workspace is unavailable. Please retry before asking the assistant to change it.', status: 503 } as const;
  }
  const ownedProjects = projects.data ?? [];
  const selected = selectedProjectId ? ownedProjects.find((project) => project.id === selectedProjectId) : null;
  if (selectedProjectId && !selected) return { error: 'That project is not available in your workspace.', status: 403 } as const;
  const ownedFolders = folders.data ?? [];
  const ownedTasks = tasks.data ?? [];
  const ownedMemories = memories.data ?? [];
  const settings = profile.data?.assistant_settings;
  return {
    status: 200,
    revision: workspaceRevision({ projects: ownedProjects, folders: ownedFolders, tasks: ownedTasks, memories: ownedMemories }),
    context: {
      track: selected?.track ?? profile.data?.preferred_track ?? 'founder',
      projects: (selected ? [selected] : ownedProjects).map((project) => ({
        ...project, folderName: ownedFolders.find((folder) => folder.id === project.folder_id)?.name ?? 'Unfiled',
      })),
      folders: ownedFolders,
      projectTasks: ownedTasks.filter((task) => !selected || task.project_id === selected.id),
      contextEntries: (entries.data ?? []).filter((entry) => !selected || entry.project_id === selected.id),
      memories: ownedMemories.filter((memory) => !selected || !memory.project_id || memory.project_id === selected.id),
      assistantPreference: typeof settings?.behaviorPreference === 'string' ? settings.behaviorPreference.slice(0, 1500) : null,
      selectedProjectId: selected?.id ?? null,
      savedContext: selected ? {
        track: selected.track, headline: selected.title, context: selected.project_instruction || selected.context,
        audience: selected.audience ?? '', blocker: selected.blocker ?? '', outcome: selected.outcome ?? '', summary: selected.summary ?? '',
      } : null,
    },
  } as const;
}

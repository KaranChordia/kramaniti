export const workspaceViews = ['home', 'projects', 'more', 'overview', 'path', 'context', 'loops', 'tasks', 'assistant', 'memory', 'files', 'community', 'profile', 'settings'] as const;
export type WorkspaceView = typeof workspaceViews[number];

export function parseWorkspaceView(value: unknown): WorkspaceView {
  const aliases: Record<string, WorkspaceView> = { tools: 'more', privacy: 'memory', account: 'settings', circle: 'community', square: 'community' };
  if (typeof value !== 'string') return 'home';
  return (Object.hasOwn(aliases, value) ? aliases[value] : undefined) ?? (workspaceViews.includes(value as WorkspaceView) ? value as WorkspaceView : 'home');
}

export function workspaceViewUrl(pathname: string, view: WorkspaceView, projectId?: string | null, tab?: string | null) {
  const params = new URLSearchParams();
  if (projectId && view !== 'home') params.set('project', projectId);
  if (view !== 'home' && !(view === 'projects' && projectId)) params.set('view', view === 'more' ? 'tools' : view === 'memory' ? 'privacy' : view === 'settings' ? 'account' : view);
  if (projectId && (tab === 'steps' || tab === 'details')) params.set('tab', tab);
  return `${pathname}${params.size ? `?${params}` : ''}`;
}

export const workspaceToolGroups = [
  { title: 'Think it through', detail: 'A little structure when you need it.', items: [
    { id: 'path', title: 'Guided path', detail: 'Choose a focus and work through an idea step by step.' },
    { id: 'context', title: 'Clarity brief', detail: 'Capture a signal, revisit saved context and review the next moves.' },
    { id: 'loops', title: 'Progress loops', detail: 'Review signals, projects, tasks, reflections and briefs.' },
  ] },
  { title: 'Keep work moving', detail: 'Look across your projects.', items: [
    { id: 'tasks', title: 'All tasks', detail: 'See open and completed work grouped by project.' },
    { id: 'assistant', title: 'Workspace assistant', detail: 'Think across your work, with conversations and a choice of context.' },
    { id: 'files', title: 'Project organiser', detail: 'Browse folders, reports and project conversations together.' },
  ] },
  { title: 'Reflect and explore', detail: 'Keep useful context within reach.', items: [
    { id: 'overview', title: 'Workspace overview', detail: 'See the broader picture and pick up recent activity.' },
    { id: 'memory', title: 'Remembered information', detail: 'Inspect, edit, archive or remove what your assistant remembers.' },
    { id: 'community', title: 'Community examples', detail: 'Explore founder problems and builder responses. Local preview only.' },
  ] },
] satisfies { title: string; detail: string; items: { id: WorkspaceView; title: string; detail: string }[] }[];

export function isSupportingView(view: WorkspaceView | 'start') {
  return !['home', 'projects', 'start'].includes(view);
}

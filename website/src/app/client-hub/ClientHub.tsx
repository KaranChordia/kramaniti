'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import {
  Activity,
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Compass,
  Database,
  FileText,
  Folder,
  FolderOpen,
  List,
  LogOut,
  MessageCircle,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
} from 'lucide-react';
import {
  getClientHubSupabase,
  isClientHubSupabaseConfigured,
  normalizeClientHubLogin,
  type ClientHubAssistantAction,
  type ClientHubAssistantMessage,
  type ClientHubMessage,
  type ClientHubNote,
  type ClientHubProfile,
  type ClientHubProject,
  type ClientHubProjectStatus,
  type ClientHubRepositoryItem,
  type ClientHubTask,
  type ClientHubTaskPriority,
  type ClientHubTaskStatus,
  type ClientHubWorkspace,
  type ClientHubWorkspaceMember,
} from '@/lib/client-hub/supabase';
import styles from './ClientHub.module.css';

type HubView = 'overview' | 'projects' | 'tasks' | 'notes' | 'messages' | 'repository' | 'assistant';

type ClientProvisionDraft = {
  workspaceName: string;
  displayName: string;
  username: string;
  password: string;
};

type AssistantResponse = {
  response?: string;
  actions?: ClientHubAssistantAction[];
  error?: string;
};

const NAV_ITEMS: Array<{ id: HubView; label: string; icon: typeof Activity }> = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'tasks', label: 'Tasks', icon: List },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
  { id: 'repository', label: 'Repository', icon: Database },
  { id: 'assistant', label: 'Assistant', icon: Bot },
];

const PROJECT_STATUSES: ClientHubProjectStatus[] = ['planned', 'active', 'blocked', 'review', 'done'];
const TASK_STATUSES: ClientHubTaskStatus[] = ['todo', 'in_progress', 'waiting', 'review', 'done'];
const TASK_PRIORITIES: ClientHubTaskPriority[] = ['low', 'normal', 'high', 'urgent'];

const emptyClientDraft: ClientProvisionDraft = {
  workspaceName: '',
  displayName: '',
  username: '',
  password: '',
};

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
});

const formatDate = (value: string) => dateFormatter.format(new Date(value));

const humanize = (value: string) =>
  value
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const recordText = (record: Record<string, unknown>, key: string, max = 8000) =>
  (typeof record[key] === 'string' ? record[key] : '').trim().slice(0, max);

export function ClientHub() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ClientHubProfile | null>(null);
  const [profiles, setProfiles] = useState<ClientHubProfile[]>([]);
  const [workspaces, setWorkspaces] = useState<ClientHubWorkspace[]>([]);
  const [members, setMembers] = useState<ClientHubWorkspaceMember[]>([]);
  const [projects, setProjects] = useState<ClientHubProject[]>([]);
  const [tasks, setTasks] = useState<ClientHubTask[]>([]);
  const [notes, setNotes] = useState<ClientHubNote[]>([]);
  const [messages, setMessages] = useState<ClientHubMessage[]>([]);
  const [assistantMessages, setAssistantMessages] = useState<ClientHubAssistantMessage[]>([]);
  const [assistantActions, setAssistantActions] = useState<ClientHubAssistantAction[]>([]);
  const [repositoryItems, setRepositoryItems] = useState<ClientHubRepositoryItem[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<HubView>('overview');
  const [authReady, setAuthReady] = useState(!isClientHubSupabaseConfigured());
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showClientPanel, setShowClientPanel] = useState(false);
  const [clientDraft, setClientDraft] = useState<ClientProvisionDraft>(emptyClientDraft);
  const [isProvisioning, setIsProvisioning] = useState(false);

  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskProjectId, setTaskProjectId] = useState('');
  const [taskPriority, setTaskPriority] = useState<ClientHubTaskPriority>('normal');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [autoPlanTask, setAutoPlanTask] = useState(true);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [noteProjectId, setNoteProjectId] = useState('');
  const [noteVisibility, setNoteVisibility] = useState<'shared' | 'internal'>('shared');
  const [messageBody, setMessageBody] = useState('');
  const [messageProjectId, setMessageProjectId] = useState('');
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantProjectId, setAssistantProjectId] = useState('');
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);
  const [savingActionId, setSavingActionId] = useState<string | null>(null);
  const [projectSearch, setProjectSearch] = useState('');
  const [taskSearch, setTaskSearch] = useState('');
  const [isSyncingRepository, setIsSyncingRepository] = useState(false);

  const assistantEndRef = useRef<HTMLDivElement | null>(null);

  const selectedWorkspace = useMemo(
    () => workspaces.find((workspace) => workspace.id === selectedWorkspaceId) ?? null,
    [selectedWorkspaceId, workspaces]
  );
  const selectedMembership = members.find((member) => member.user_id === authUser?.id) ?? null;
  const canSeeInternal = selectedMembership?.role === 'owner' || selectedMembership?.role === 'collaborator';
  const isOwner = profile?.role === 'owner';
  const profileMap = useMemo(() => new Map(profiles.map((item) => [item.user_id, item])), [profiles]);
  const pendingActions = assistantActions.filter((action) => action.status === 'pending');
  const visibleProjects = projects.filter((project) =>
    `${project.title} ${project.description}`.toLowerCase().includes(projectSearch.trim().toLowerCase())
  );
  const visibleTasks = tasks.filter((task) =>
    `${task.title} ${task.description}`.toLowerCase().includes(taskSearch.trim().toLowerCase())
  );
  const openTasks = tasks.filter((task) => !['done', 'archived'].includes(task.status));
  const blockedTasks = openTasks.filter((task) => task.status === 'waiting' || task.priority === 'urgent');
  const rootTasks = visibleTasks.filter((task) => !task.parent_task_id);

  const loadWorkspace = useCallback(async (workspaceId: string, options?: { quiet?: boolean }) => {
    const supabase = getClientHubSupabase();
    if (!supabase) return;
    if (!options?.quiet) setIsLoading(true);

    const [
      projectResult,
      taskResult,
      noteResult,
      messageResult,
      assistantMessageResult,
      actionResult,
      repositoryResult,
      memberResult,
    ] = await Promise.all([
      supabase.from('projects').select('*').eq('workspace_id', workspaceId).neq('status', 'archived').order('updated_at', { ascending: false }),
      supabase.from('tasks').select('*').eq('workspace_id', workspaceId).neq('status', 'archived').order('created_at', { ascending: true }),
      supabase.from('notes').select('*').eq('workspace_id', workspaceId).order('updated_at', { ascending: false }),
      supabase.from('messages').select('*').eq('workspace_id', workspaceId).order('created_at', { ascending: true }).limit(100),
      supabase.from('assistant_messages').select('*').eq('workspace_id', workspaceId).order('created_at', { ascending: true }).limit(100),
      supabase.from('assistant_actions').select('*').eq('workspace_id', workspaceId).order('created_at', { ascending: false }).limit(100),
      supabase.from('repository_items').select('*').eq('workspace_id', workspaceId).order('repository_path', { ascending: true }),
      supabase.from('workspace_members').select('*').eq('workspace_id', workspaceId).order('created_at', { ascending: true }),
    ]);

    const error = [
      projectResult.error,
      taskResult.error,
      noteResult.error,
      messageResult.error,
      assistantMessageResult.error,
      actionResult.error,
      repositoryResult.error,
      memberResult.error,
    ].find(Boolean);

    if (error) {
      setStatus('The workspace could not be refreshed.');
      if (!options?.quiet) setIsLoading(false);
      return;
    }

    setProjects(projectResult.data ?? []);
    setTasks(taskResult.data ?? []);
    setNotes(noteResult.data ?? []);
    setMessages(messageResult.data ?? []);
    setAssistantMessages(assistantMessageResult.data ?? []);
    setAssistantActions(actionResult.data ?? []);
    setRepositoryItems(repositoryResult.data ?? []);
    setMembers(memberResult.data ?? []);

    const memberIds = (memberResult.data ?? []).map((member) => member.user_id);
    if (memberIds.length) {
      const { data: memberProfiles } = await supabase.from('profiles').select('*').in('user_id', memberIds);
      setProfiles(memberProfiles ?? []);
    } else {
      setProfiles([]);
    }

    if (!options?.quiet) setIsLoading(false);
  }, []);

  const loadHub = useCallback(async (user: User, preferredWorkspaceId?: string | null) => {
    const supabase = getClientHubSupabase();
    if (!supabase) return;
    setIsLoading(true);

    const [profileResult, workspaceResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('workspaces').select('*').neq('status', 'archived').order('updated_at', { ascending: false }),
    ]);

    if (profileResult.error) {
      setStatus('Client Hub access could not be checked.');
      setIsLoading(false);
      return;
    }

    setProfile(profileResult.data ?? null);
    setShowPasswordChange(Boolean(profileResult.data?.must_change_password));
    setWorkspaces(workspaceResult.data ?? []);
    const nextWorkspaceId =
      preferredWorkspaceId && workspaceResult.data?.some((workspace) => workspace.id === preferredWorkspaceId)
        ? preferredWorkspaceId
        : workspaceResult.data?.[0]?.id ?? null;
    setSelectedWorkspaceId(nextWorkspaceId);
    if (nextWorkspaceId) await loadWorkspace(nextWorkspaceId, { quiet: true });
    setIsLoading(false);
  }, [loadWorkspace]);

  const resetHubState = useCallback(() => {
    setProfile(null);
    setProfiles([]);
    setWorkspaces([]);
    setMembers([]);
    setProjects([]);
    setTasks([]);
    setNotes([]);
    setMessages([]);
    setAssistantMessages([]);
    setAssistantActions([]);
    setRepositoryItems([]);
    setSelectedWorkspaceId(null);
  }, []);

  useEffect(() => {
    const supabase = getClientHubSupabase();
    if (!supabase) return;

    void supabase.auth.getSession().then(({ data }) => {
      const nextUser = data.session?.user ?? null;
      setAuthUser(nextUser);
      if (nextUser) void loadHub(nextUser);
      else resetHubState();
      setAuthReady(true);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      const nextUser = nextSession?.user ?? null;
      setAuthUser(nextUser);
      if (nextUser) void loadHub(nextUser);
      else resetHubState();
      setAuthReady(true);
    });

    return () => data.subscription.unsubscribe();
  }, [loadHub, resetHubState]);

  useEffect(() => {
    const supabase = getClientHubSupabase();
    if (!supabase || !selectedWorkspaceId || !authUser) return;

    const tables = ['projects', 'tasks', 'notes', 'messages', 'assistant_messages', 'assistant_actions', 'repository_items'] as const;
    const channel = supabase.channel(`client-hub-${selectedWorkspaceId}`);
    tables.forEach((table) => {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'kramaniti_hub', table, filter: `workspace_id=eq.${selectedWorkspaceId}` },
        () => void loadWorkspace(selectedWorkspaceId, { quiet: true })
      );
    });
    channel.subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [authUser, loadWorkspace, selectedWorkspaceId]);

  useEffect(() => {
    if (activeView === 'assistant') assistantEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeView, assistantMessages, assistantActions]);

  const getAccessToken = async () => {
    const supabase = getClientHubSupabase();
    if (!supabase) return '';
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? '';
  };

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    const supabase = getClientHubSupabase();
    if (!supabase) return;
    setIsSigningIn(true);
    setStatus('');

    const { error } = await supabase.auth.signInWithPassword({
      email: normalizeClientHubLogin(login),
      password,
    });

    setIsSigningIn(false);
    if (error) {
      setStatus('Username or password was not accepted.');
      return;
    }
    setPassword('');
  };

  const signOut = async () => {
    const supabase = getClientHubSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
    resetHubState();
    setActiveView('overview');
    setStatus('Signed out.');
  };

  const activateFounderAccess = async () => {
    const token = await getAccessToken();
    setStatus('Activating founder access...');
    const response = await fetch('/api/client-hub/bootstrap', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setStatus(data.error ?? 'Founder access could not be activated.');
      return;
    }
    if (authUser) await loadHub(authUser, selectedWorkspaceId);
    setStatus('Founder access is active.');
  };

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    const supabase = getClientHubSupabase();
    if (!supabase || !profile) return;
    if (newPassword.length < 12 || newPassword !== confirmPassword) {
      setStatus('Use at least 12 characters and make sure both passwords match.');
      return;
    }

    const { error: passwordError } = await supabase.auth.updateUser({ password: newPassword });
    if (passwordError) {
      setStatus('Your password could not be changed.');
      return;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ must_change_password: false })
      .eq('user_id', profile.user_id);

    if (profileError) {
      setStatus('Password changed, but the setup flag could not be cleared.');
      return;
    }

    setProfile({ ...profile, must_change_password: false });
    setShowPasswordChange(false);
    setNewPassword('');
    setConfirmPassword('');
    setStatus('Password changed.');
  };

  const provisionClient = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProvisioning(true);
    const token = await getAccessToken();
    const response = await fetch('/api/client-hub/clients', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientDraft),
    });
    const data = (await response.json()) as { error?: string; workspace?: ClientHubWorkspace; client?: { username: string } };
    setIsProvisioning(false);

    if (!response.ok) {
      setStatus(data.error ?? 'Client access could not be created.');
      return;
    }

    setShowClientPanel(false);
    setClientDraft(emptyClientDraft);
    if (authUser) await loadHub(authUser, data.workspace?.id ?? selectedWorkspaceId);
    if (data.workspace) {
      setSelectedWorkspaceId(data.workspace.id);
      await loadWorkspace(data.workspace.id, { quiet: true });
    }
    setStatus(`Client login @${data.client?.username} is ready. Share the temporary password securely and ask the client to replace it at first sign-in.`);
  };

  const createProject = async (event: React.FormEvent) => {
    event.preventDefault();
    const supabase = getClientHubSupabase();
    if (!supabase || !authUser || !selectedWorkspaceId || !projectTitle.trim()) return;

    const { error } = await supabase.from('projects').insert({
      workspace_id: selectedWorkspaceId,
      title: projectTitle.trim(),
      description: projectDescription.trim(),
      status: 'planned',
      source: 'manual',
      created_by: authUser.id,
    });
    if (error) {
      setStatus('The project could not be created.');
      return;
    }
    setProjectTitle('');
    setProjectDescription('');
    setStatus('Project created.');
    await loadWorkspace(selectedWorkspaceId, { quiet: true });
  };

  const updateProjectStatus = async (project: ClientHubProject, nextStatus: ClientHubProjectStatus) => {
    const supabase = getClientHubSupabase();
    if (!supabase) return;
    const { error } = await supabase.from('projects').update({ status: nextStatus }).eq('id', project.id);
    if (error) setStatus('Project status could not be updated.');
  };

  const requestAssistant = async (body: Record<string, unknown>) => {
    const token = await getAccessToken();
    const response = await fetch('/api/client-hub/assistant', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = (await response.json()) as AssistantResponse;
    if (!response.ok) throw new Error(data.error ?? 'Assistant request failed.');
    return data;
  };

  const createTask = async (event: React.FormEvent) => {
    event.preventDefault();
    const supabase = getClientHubSupabase();
    if (!supabase || !authUser || !selectedWorkspaceId || !taskTitle.trim()) return;

    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        workspace_id: selectedWorkspaceId,
        project_id: taskProjectId || null,
        title: taskTitle.trim(),
        description: taskDescription.trim(),
        priority: taskPriority,
        due_date: taskDueDate || null,
        status: 'todo',
        source: 'manual',
        created_by: authUser.id,
      })
      .select('*')
      .single();

    if (error || !task) {
      setStatus('The task could not be created.');
      return;
    }

    setTaskTitle('');
    setTaskDescription('');
    setTaskDueDate('');
    setStatus(autoPlanTask ? 'Task added. The assistant is analysing it now...' : 'Task added.');
    await loadWorkspace(selectedWorkspaceId, { quiet: true });

    if (autoPlanTask) {
      setIsAssistantThinking(true);
      try {
        const data = await requestAssistant({
          workspaceId: selectedWorkspaceId,
          projectId: task.project_id,
          mode: 'decompose_task',
          task: {
            id: task.id,
            projectId: task.project_id,
            title: task.title,
            description: task.description,
            priority: task.priority,
            dueDate: task.due_date,
          },
        });
        setStatus(data.response ?? 'Subtasks are ready for review.');
        setActiveView('assistant');
        await loadWorkspace(selectedWorkspaceId, { quiet: true });
      } catch (assistantError) {
        setStatus(assistantError instanceof Error ? assistantError.message : 'The task was saved, but automatic planning did not finish.');
      } finally {
        setIsAssistantThinking(false);
      }
    }
  };

  const updateTaskStatus = async (task: ClientHubTask, nextStatus: ClientHubTaskStatus) => {
    const supabase = getClientHubSupabase();
    if (!supabase) return;
    const { error } = await supabase.from('tasks').update({ status: nextStatus }).eq('id', task.id);
    if (error) setStatus('Task status could not be updated.');
  };

  const createNote = async (event: React.FormEvent) => {
    event.preventDefault();
    const supabase = getClientHubSupabase();
    if (!supabase || !authUser || !selectedWorkspaceId || !noteTitle.trim() || !noteBody.trim()) return;

    const visibility = canSeeInternal ? noteVisibility : 'shared';
    const { error } = await supabase.from('notes').insert({
      workspace_id: selectedWorkspaceId,
      project_id: noteProjectId || null,
      title: noteTitle.trim(),
      body: noteBody.trim(),
      visibility,
      source: 'manual',
      created_by: authUser.id,
    });
    if (error) {
      setStatus('The note could not be saved.');
      return;
    }
    setNoteTitle('');
    setNoteBody('');
    setStatus(visibility === 'internal' ? 'Internal note saved.' : 'Shared note saved.');
  };

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    const supabase = getClientHubSupabase();
    if (!supabase || !authUser || !selectedWorkspaceId || !messageBody.trim()) return;
    const { error } = await supabase.from('messages').insert({
      workspace_id: selectedWorkspaceId,
      project_id: messageProjectId || null,
      body: messageBody.trim(),
      created_by: authUser.id,
    });
    if (error) {
      setStatus('The message could not be posted.');
      return;
    }
    setMessageBody('');
    setStatus('Update posted.');
  };

  const sendAssistantMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedWorkspaceId || !assistantInput.trim()) return;
    const prompt = assistantInput.trim();
    setAssistantInput('');
    setIsAssistantThinking(true);
    setStatus('');
    try {
      const data = await requestAssistant({
        workspaceId: selectedWorkspaceId,
        projectId: assistantProjectId || null,
        mode: 'chat',
        message: prompt,
      });
      setStatus(data.actions?.length ? `${data.actions.length} action${data.actions.length === 1 ? '' : 's'} waiting for approval.` : 'Assistant response ready.');
      await loadWorkspace(selectedWorkspaceId, { quiet: true });
    } catch (assistantError) {
      setStatus(assistantError instanceof Error ? assistantError.message : 'The assistant could not respond.');
    } finally {
      setIsAssistantThinking(false);
    }
  };

  const executeAction = async (action: ClientHubAssistantAction, options?: { quiet?: boolean }) => {
    const supabase = getClientHubSupabase();
    if (!supabase || !authUser || !selectedWorkspaceId) return false;
    setSavingActionId(action.id);
    const payload = action.payload;
    let error: { message: string } | null = null;

    if (action.action_type === 'create_project') {
      const result = await supabase.from('projects').insert({
        workspace_id: selectedWorkspaceId,
        title: recordText(payload, 'title', 180),
        description: recordText(payload, 'description', 6000),
        status: (recordText(payload, 'status', 20) as ClientHubProjectStatus) || 'planned',
        source: 'assistant',
        created_by: authUser.id,
      });
      error = result.error;
    } else if (action.action_type === 'create_task') {
      const result = await supabase.from('tasks').insert({
        workspace_id: selectedWorkspaceId,
        project_id: recordText(payload, 'projectId', 80) || null,
        parent_task_id: recordText(payload, 'parentTaskId', 80) || null,
        title: recordText(payload, 'title', 220),
        description: recordText(payload, 'description', 6000),
        priority: (recordText(payload, 'priority', 16) as ClientHubTaskPriority) || 'normal',
        status: (recordText(payload, 'status', 24) as ClientHubTaskStatus) || 'todo',
        due_date: recordText(payload, 'dueDate', 10) || null,
        source: 'assistant',
        created_by: authUser.id,
      });
      error = result.error;
    } else if (action.action_type === 'create_note') {
      const result = await supabase.from('notes').insert({
        workspace_id: selectedWorkspaceId,
        project_id: recordText(payload, 'projectId', 80) || null,
        title: recordText(payload, 'title', 180),
        body: recordText(payload, 'body', 20000),
        visibility: recordText(payload, 'visibility', 20) === 'internal' && canSeeInternal ? 'internal' : 'shared',
        source: 'assistant',
        created_by: authUser.id,
      });
      error = result.error;
    } else if (action.action_type === 'update_task') {
      const result = await supabase
        .from('tasks')
        .update({ status: recordText(payload, 'status', 24) as ClientHubTaskStatus })
        .eq('id', recordText(payload, 'taskId', 80));
      error = result.error;
    } else if (action.action_type === 'send_message') {
      const result = await supabase.from('messages').insert({
        workspace_id: selectedWorkspaceId,
        project_id: recordText(payload, 'projectId', 80) || null,
        body: recordText(payload, 'body', 8000),
        created_by: authUser.id,
      });
      error = result.error;
    }

    if (error) {
      await supabase
        .from('assistant_actions')
        .update({ status: 'failed', reviewed_by: authUser.id })
        .eq('id', action.id);
      setSavingActionId(null);
      setStatus(`Action failed: ${action.summary}`);
      return false;
    }

    await supabase
      .from('assistant_actions')
      .update({ status: 'applied', reviewed_by: authUser.id })
      .eq('id', action.id);

    setSavingActionId(null);
    if (!options?.quiet) {
      setStatus(`Applied: ${action.summary}`);
      await loadWorkspace(selectedWorkspaceId, { quiet: true });
    }
    return true;
  };

  const approveAllPending = async () => {
    for (const action of pendingActions) {
      const applied = await executeAction(action, { quiet: true });
      if (!applied) break;
    }
    if (selectedWorkspaceId) await loadWorkspace(selectedWorkspaceId, { quiet: true });
    setStatus('Approved assistant actions were applied to the workspace.');
  };

  const declineAction = async (action: ClientHubAssistantAction) => {
    const supabase = getClientHubSupabase();
    if (!supabase || !authUser) return;
    const { error } = await supabase
      .from('assistant_actions')
      .update({ status: 'declined', reviewed_by: authUser.id })
      .eq('id', action.id);
    if (error) setStatus('The draft action could not be declined.');
  };

  const syncRepository = async () => {
    setIsSyncingRepository(true);
    const token = await getAccessToken();
    const response = await fetch('/api/client-hub/repository-sync', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = (await response.json()) as { error?: string; workspaceCount?: number; itemCount?: number };
    setIsSyncingRepository(false);
    if (!response.ok) {
      setStatus(data.error ?? 'Repository index could not be synced.');
      return;
    }
    if (authUser) await loadHub(authUser, selectedWorkspaceId);
    if (selectedWorkspaceId) await loadWorkspace(selectedWorkspaceId, { quiet: true });
    setStatus(`Repository index synced across ${data.workspaceCount} workspace${data.workspaceCount === 1 ? '' : 's'} with ${data.itemCount} curated item${data.itemCount === 1 ? '' : 's'}.`);
  };

  const openAssistant = (prompt?: string, projectId?: string | null) => {
    setActiveView('assistant');
    if (prompt) setAssistantInput(prompt);
    if (projectId !== undefined) setAssistantProjectId(projectId ?? '');
  };

  const renderStatus = () =>
    status ? (
      <div className={styles.statusBar} role="status">
        <CircleDot size={14} aria-hidden="true" />
        <span>{status}</span>
        <button type="button" onClick={() => setStatus('')} aria-label="Dismiss status">
          Close
        </button>
      </div>
    ) : null;

  if (!authReady) {
    return (
      <main className={styles.loadingPage}>
        <div className={styles.signalMark}><span /><span /><span /></div>
        <p>Opening the private workroom...</p>
      </main>
    );
  }

  if (!isClientHubSupabaseConfigured()) {
    return (
      <main className={styles.authPage}>
        <section className={styles.setupCard}>
          <div className={styles.signalMark}><span /><span /><span /></div>
          <p className={styles.eyebrow}>Kramaniti Client Hub</p>
          <h1>Private workspace setup is incomplete.</h1>
          <p>Add the Supabase public environment variables and apply the Client Hub migration before opening this route.</p>
        </section>
      </main>
    );
  }

  if (!authUser) {
    return (
      <main className={styles.authPage}>
        <div className={styles.authAtmosphere} aria-hidden="true"><span /><span /><span /></div>
        <section className={styles.authCard}>
          <div className={styles.authBrand}>
            <div className={styles.signalMark}><span /><span /><span /></div>
            <div>
              <p>Kramaniti</p>
              <strong>Client Hub</strong>
            </div>
          </div>
          <div className={styles.authCopy}>
            <p className={styles.eyebrow}>One shared operating thread</p>
            <h1>Projects, decisions, and next actions in one private workroom.</h1>
            <p>Use the username and temporary password created for your client workspace. Every workspace is isolated and every assistant change waits for approval.</p>
          </div>
          <form className={styles.authForm} onSubmit={signIn}>
            <label>
              Username or founder email
              <input value={login} onChange={(event) => setLogin(event.target.value)} autoComplete="username" required />
            </label>
            <label>
              Password
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
            </label>
            <button type="submit" className={styles.primaryButton} disabled={isSigningIn}>
              {isSigningIn ? 'Signing in...' : 'Enter private workroom'}
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </form>
          <div className={styles.authTrust}>
            <ShieldCheck size={17} aria-hidden="true" />
            <span>No public signup. Accounts are provisioned by Kramaniti.</span>
          </div>
          {renderStatus()}
        </section>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className={styles.authPage}>
        <section className={styles.setupCard}>
          <div className={styles.signalMark}><span /><span /><span /></div>
          <p className={styles.eyebrow}>Signed in, access not yet assigned</p>
          <h1>This account does not have a Client Hub profile.</h1>
          <p>If this is the founder account, activate it after setting the server-side owner email. Client accounts should be created from the founder workspace.</p>
          <div className={styles.setupActions}>
            <button type="button" className={styles.primaryButton} onClick={() => void activateFounderAccess()}>
              Activate founder access
              <ShieldCheck size={17} aria-hidden="true" />
            </button>
            <button type="button" className={styles.secondaryButton} onClick={() => void signOut()}>Sign out</button>
          </div>
          {renderStatus()}
        </section>
      </main>
    );
  }

  return (
    <main className={styles.hubPage}>
      <div className={styles.hubAtmosphere} aria-hidden="true"><span /><span /><span /></div>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <div className={styles.signalMark}><span /><span /><span /></div>
          <div><p>Kramaniti</p><strong>Client Hub</strong></div>
        </div>

        <div className={styles.workspaceSection}>
          <div className={styles.sidebarLabel}>
            <span>Workrooms</span>
            {isOwner && (
              <button type="button" onClick={() => setShowClientPanel(true)} aria-label="Add client">
                <Plus size={15} />
              </button>
            )}
          </div>
          <div className={styles.workspaceList}>
            {workspaces.map((workspace) => (
              <button
                type="button"
                key={workspace.id}
                className={workspace.id === selectedWorkspaceId ? styles.workspaceActive : ''}
                onClick={() => {
                  setSelectedWorkspaceId(workspace.id);
                  void loadWorkspace(workspace.id);
                }}
              >
                <span className={styles.workspaceGlyph}>{workspace.name.slice(0, 2).toUpperCase()}</span>
                <span><strong>{workspace.name}</strong><small>{humanize(workspace.status)}</small></span>
                <ChevronRight size={14} />
              </button>
            ))}
          </div>
        </div>

        <nav className={styles.primaryNav} aria-label="Client Hub sections">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.id}
                className={activeView === item.id ? styles.navActive : ''}
                onClick={() => setActiveView(item.id)}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{item.label}</span>
                {item.id === 'assistant' && pendingActions.length > 0 && <em>{pendingActions.length}</em>}
              </button>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.profileChip}>
            <UserRound size={17} aria-hidden="true" />
            <span><strong>{profile.display_name}</strong><small>{humanize(profile.role)}</small></span>
          </div>
          <button type="button" className={styles.iconButton} onClick={() => void signOut()} aria-label="Sign out">
            <LogOut size={17} />
          </button>
        </div>
      </aside>

      <section className={styles.mainShell}>
        <header className={styles.topbar}>
          <div>
            <span className={styles.breadcrumb}>Client Hub <ChevronRight size={13} /> {NAV_ITEMS.find((item) => item.id === activeView)?.label}</span>
            <h1>{selectedWorkspace?.name ?? 'Choose a workroom'}</h1>
          </div>
          <div className={styles.topbarActions}>
            <span className={styles.privacyBadge}><ShieldCheck size={15} /> Private workspace</span>
            {isOwner && (
              <button type="button" className={styles.secondaryButton} onClick={() => setShowClientPanel(true)}>
                <Users size={16} /> Add client
              </button>
            )}
          </div>
        </header>

        <div className={styles.mobileNav}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button type="button" key={item.id} className={activeView === item.id ? styles.navActive : ''} onClick={() => setActiveView(item.id)}>
                <Icon size={17} /><span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {renderStatus()}

        {!selectedWorkspace && !isLoading && (
          <section className={styles.emptyWorkspace}>
            <Folder size={28} />
            <h2>No workroom is connected yet.</h2>
            <p>{isOwner ? 'Create a client login or sync the curated repository index to start.' : 'Ask Kramaniti to assign this account to a client workroom.'}</p>
            {isOwner && (
              <div className={styles.setupActions}>
                <button type="button" className={styles.primaryButton} onClick={() => setShowClientPanel(true)}><Plus size={16} /> Add first client</button>
                <button type="button" className={styles.secondaryButton} onClick={() => void syncRepository()}><RefreshCw size={16} /> Sync repository index</button>
              </div>
            )}
          </section>
        )}

        {selectedWorkspace && (
          <div className={styles.contentArea}>
            {activeView === 'overview' && (
              <section className={styles.screen} aria-label="Workspace overview">
                <div className={styles.overviewHero}>
                  <div>
                    <p className={styles.eyebrow}>Current operating signal</p>
                    <h2>{blockedTasks.length ? `${blockedTasks.length} item${blockedTasks.length === 1 ? '' : 's'} need attention.` : 'The workroom is moving without a visible blocker.'}</h2>
                    <p>Keep decisions, delivery, and client updates in the same operating thread. The assistant can prepare changes, but nothing is written until someone approves it.</p>
                    <div className={styles.heroActions}>
                      <button type="button" className={styles.primaryButton} onClick={() => openAssistant('Review this workspace and tell me what needs attention first.')}>Ask the workspace assistant <ArrowRight size={16} /></button>
                      <button type="button" className={styles.secondaryButton} onClick={() => setActiveView('tasks')}>Open tasks</button>
                    </div>
                  </div>
                  <div className={styles.signalDiagram} aria-hidden="true">
                    <span /><span /><span /><i />
                  </div>
                </div>

                <div className={styles.metricGrid}>
                  <article><FolderOpen size={18} /><span>Active projects</span><strong>{projects.filter((project) => !['done', 'archived'].includes(project.status)).length}</strong><small>{projects.filter((project) => project.status === 'blocked').length} blocked</small></article>
                  <article><List size={18} /><span>Open actions</span><strong>{openTasks.length}</strong><small>{tasks.filter((task) => task.status === 'review').length} in review</small></article>
                  <article><MessageCircle size={18} /><span>Shared updates</span><strong>{messages.length}</strong><small>{members.length} workroom member{members.length === 1 ? '' : 's'}</small></article>
                  <article><Bot size={18} /><span>Draft actions</span><strong>{pendingActions.length}</strong><small>Approval required</small></article>
                </div>

                <div className={styles.overviewGrid}>
                  <article className={styles.panel}>
                    <div className={styles.panelHeader}><div><span>Priority queue</span><h3>What should move next</h3></div><button type="button" onClick={() => setActiveView('tasks')}>View all</button></div>
                    <div className={styles.compactList}>
                      {openTasks.slice(0, 5).map((task) => (
                        <button type="button" key={task.id} onClick={() => setActiveView('tasks')}>
                          <span className={`${styles.priorityDot} ${styles[`priority_${task.priority}`]}`} />
                          <span><strong>{task.title}</strong><small>{projects.find((project) => project.id === task.project_id)?.title ?? 'Workspace task'}</small></span>
                          <em>{humanize(task.status)}</em>
                        </button>
                      ))}
                      {!openTasks.length && <p className={styles.emptyLine}>No open tasks. Add the next concrete action when the work moves.</p>}
                    </div>
                  </article>
                  <article className={styles.panel}>
                    <div className={styles.panelHeader}><div><span>Communication</span><h3>Latest shared thread</h3></div><button type="button" onClick={() => setActiveView('messages')}>Open thread</button></div>
                    <div className={styles.messagePreviewList}>
                      {messages.slice(-4).reverse().map((message) => (
                        <div key={message.id}><span>{profileMap.get(message.created_by)?.display_name?.slice(0, 1) ?? '?'}</span><p><strong>{profileMap.get(message.created_by)?.display_name ?? 'Workspace member'}</strong>{message.body}</p><small>{formatDate(message.created_at)}</small></div>
                      ))}
                      {!messages.length && <p className={styles.emptyLine}>No updates yet. Use the shared thread for decisions, handoffs, and review notes.</p>}
                    </div>
                  </article>
                </div>
              </section>
            )}

            {activeView === 'projects' && (
              <section className={styles.screen} aria-label="Projects">
                <div className={styles.screenHeading}><div><p className={styles.eyebrow}>Delivery structure</p><h2>Projects</h2><p>One project should represent one clear outcome, with its own tasks, notes, updates, and repository reference.</p></div></div>
                <form className={styles.inlineComposer} onSubmit={createProject}>
                  <label><span>Project title</span><input value={projectTitle} onChange={(event) => setProjectTitle(event.target.value)} placeholder="What outcome are we working toward?" required /></label>
                  <label className={styles.composerWide}><span>Working brief</span><input value={projectDescription} onChange={(event) => setProjectDescription(event.target.value)} placeholder="Scope, decision boundary, and expected handoff" /></label>
                  <button type="submit" className={styles.primaryButton}><Plus size={16} /> Create project</button>
                </form>
                <div className={styles.filterRow}>
                  <label className={styles.searchField}><Search size={16} /><input value={projectSearch} onChange={(event) => setProjectSearch(event.target.value)} placeholder="Search projects" /></label>
                  <span>{visibleProjects.length} project{visibleProjects.length === 1 ? '' : 's'}</span>
                </div>
                <div className={styles.projectGrid}>
                  {visibleProjects.map((project) => {
                    const projectTasks = tasks.filter((task) => task.project_id === project.id && task.status !== 'archived');
                    const done = projectTasks.filter((task) => task.status === 'done').length;
                    const progress = projectTasks.length ? Math.round((done / projectTasks.length) * 100) : 0;
                    return (
                      <article key={project.id} className={styles.projectCard}>
                        <div className={styles.projectCardTop}><span className={styles.sourceTag}>{project.source}</span><select value={project.status} onChange={(event) => void updateProjectStatus(project, event.target.value as ClientHubProjectStatus)}>{PROJECT_STATUSES.map((statusOption) => <option key={statusOption} value={statusOption}>{humanize(statusOption)}</option>)}</select></div>
                        <h3>{project.title}</h3><p>{project.description || 'Add the project boundary and expected handoff as the work becomes clearer.'}</p>
                        <div className={styles.progressTrack}><span style={{ width: `${progress}%` }} /></div>
                        <div className={styles.projectMeta}><span>{done}/{projectTasks.length} tasks complete</span><span>{project.due_date ? `Due ${project.due_date}` : 'No due date'}</span></div>
                        <div className={styles.cardActions}><button type="button" onClick={() => { setTaskProjectId(project.id); setActiveView('tasks'); }}>Add task</button><button type="button" onClick={() => openAssistant(`Review the project “${project.title}” and propose the next useful move.`, project.id)}>Ask assistant</button></div>
                      </article>
                    );
                  })}
                  {!visibleProjects.length && <div className={styles.emptyCard}><Compass size={24} /><h3>No matching projects.</h3><p>Create the first outcome above or clear the search.</p></div>}
                </div>
              </section>
            )}

            {activeView === 'tasks' && (
              <section className={styles.screen} aria-label="Tasks">
                <div className={styles.screenHeading}><div><p className={styles.eyebrow}>Reviewed movement</p><h2>Tasks and subtasks</h2><p>Manual tasks can be analysed into a practical sequence. Draft subtasks remain pending until you approve them.</p></div></div>
                <form className={styles.taskComposer} onSubmit={createTask}>
                  <div className={styles.taskComposerMain}>
                    <label><span>Task</span><input value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} placeholder="Add the next meaningful action" required /></label>
                    <label><span>Useful context</span><textarea value={taskDescription} onChange={(event) => setTaskDescription(event.target.value)} placeholder="What does the assistant need to understand before planning this?" rows={3} /></label>
                  </div>
                  <div className={styles.taskComposerOptions}>
                    <label><span>Project</span><select value={taskProjectId} onChange={(event) => setTaskProjectId(event.target.value)}><option value="">Workspace task</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}</select></label>
                    <label><span>Priority</span><select value={taskPriority} onChange={(event) => setTaskPriority(event.target.value as ClientHubTaskPriority)}>{TASK_PRIORITIES.map((priority) => <option key={priority} value={priority}>{humanize(priority)}</option>)}</select></label>
                    <label><span>Due date</span><input type="date" value={taskDueDate} onChange={(event) => setTaskDueDate(event.target.value)} /></label>
                    <label className={styles.checkLabel}><input type="checkbox" checked={autoPlanTask} onChange={(event) => setAutoPlanTask(event.target.checked)} /><span><strong>Analyse into subtasks</strong><small>Assistant drafts a sequence for approval.</small></span></label>
                    <button type="submit" className={styles.primaryButton} disabled={isAssistantThinking}><Plus size={16} /> {isAssistantThinking ? 'Analysing...' : 'Add task'}</button>
                  </div>
                </form>
                <div className={styles.filterRow}>
                  <label className={styles.searchField}><Search size={16} /><input value={taskSearch} onChange={(event) => setTaskSearch(event.target.value)} placeholder="Search tasks" /></label>
                  <span>{openTasks.length} open action{openTasks.length === 1 ? '' : 's'}</span>
                </div>
                <div className={styles.taskList}>
                  {rootTasks.map((task) => {
                    const children = visibleTasks.filter((candidate) => candidate.parent_task_id === task.id);
                    return (
                      <article key={task.id} className={styles.taskGroup}>
                        <div className={styles.taskRow}>
                          <button type="button" className={task.status === 'done' ? styles.taskDoneButton : styles.taskCheckButton} onClick={() => void updateTaskStatus(task, task.status === 'done' ? 'todo' : 'done')} aria-label={task.status === 'done' ? 'Reopen task' : 'Complete task'}><CheckCircle2 size={18} /></button>
                          <div className={styles.taskBody}><div><strong>{task.title}</strong><span className={`${styles.priorityPill} ${styles[`priority_${task.priority}`]}`}>{humanize(task.priority)}</span></div><p>{task.description || 'No additional context yet.'}</p><small>{projects.find((project) => project.id === task.project_id)?.title ?? 'Workspace task'} · {humanize(task.source)}{task.due_date ? ` · Due ${task.due_date}` : ''}</small></div>
                          <select value={task.status} onChange={(event) => void updateTaskStatus(task, event.target.value as ClientHubTaskStatus)}>{TASK_STATUSES.map((statusOption) => <option key={statusOption} value={statusOption}>{humanize(statusOption)}</option>)}</select>
                          <button type="button" className={styles.textButton} onClick={() => openAssistant(`Analyse the task “${task.title}” and propose a practical subtask sequence.`, task.project_id)}>Plan</button>
                        </div>
                        {children.length > 0 && <div className={styles.subtaskList}>{children.map((child, index) => <div key={child.id} className={styles.subtaskRow}><span>{String(index + 1).padStart(2, '0')}</span><button type="button" className={child.status === 'done' ? styles.taskDoneButton : styles.taskCheckButton} onClick={() => void updateTaskStatus(child, child.status === 'done' ? 'todo' : 'done')}><CheckCircle2 size={16} /></button><p><strong>{child.title}</strong><small>{child.description}</small></p><select value={child.status} onChange={(event) => void updateTaskStatus(child, event.target.value as ClientHubTaskStatus)}>{TASK_STATUSES.map((statusOption) => <option key={statusOption} value={statusOption}>{humanize(statusOption)}</option>)}</select></div>)}</div>}
                      </article>
                    );
                  })}
                  {!rootTasks.length && <div className={styles.emptyCard}><List size={24} /><h3>No tasks found.</h3><p>Add a manual task above and let the assistant prepare its first sequence.</p></div>}
                </div>
              </section>
            )}

            {activeView === 'notes' && (
              <section className={styles.screen} aria-label="Notes">
                <div className={styles.screenHeading}><div><p className={styles.eyebrow}>Operating memory</p><h2>Notes and decisions</h2><p>Shared notes are visible to the client. Internal notes stay visible only to Kramaniti owners and collaborators.</p></div></div>
                <form className={styles.noteComposer} onSubmit={createNote}>
                  <div><label><span>Title</span><input value={noteTitle} onChange={(event) => setNoteTitle(event.target.value)} placeholder="Decision, context, or review note" required /></label><label><span>Note</span><textarea value={noteBody} onChange={(event) => setNoteBody(event.target.value)} placeholder="Write the context another person will need later." rows={5} required /></label></div>
                  <div><label><span>Project</span><select value={noteProjectId} onChange={(event) => setNoteProjectId(event.target.value)}><option value="">Whole workspace</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}</select></label>{canSeeInternal && <label><span>Visibility</span><select value={noteVisibility} onChange={(event) => setNoteVisibility(event.target.value as 'shared' | 'internal')}><option value="shared">Shared with client</option><option value="internal">Kramaniti internal</option></select></label>}<button type="submit" className={styles.primaryButton}><Plus size={16} /> Save note</button></div>
                </form>
                <div className={styles.noteGrid}>
                  {notes.map((note) => <article key={note.id} className={styles.noteCard}><div><span className={note.visibility === 'internal' ? styles.internalTag : styles.sharedTag}>{note.visibility === 'internal' ? 'Kramaniti internal' : 'Shared'}</span><small>{formatDate(note.updated_at)}</small></div><h3>{note.title}</h3><p>{note.body}</p><footer><span>{projects.find((project) => project.id === note.project_id)?.title ?? 'Whole workspace'}</span><span>{profileMap.get(note.created_by)?.display_name ?? 'Workspace member'}</span></footer></article>)}
                  {!notes.length && <div className={styles.emptyCard}><FileText size={24} /><h3>No notes yet.</h3><p>Capture the first decision or piece of context above.</p></div>}
                </div>
              </section>
            )}

            {activeView === 'messages' && (
              <section className={`${styles.screen} ${styles.messageScreen}`} aria-label="Messages">
                <div className={styles.screenHeading}><div><p className={styles.eyebrow}>Shared communication</p><h2>Client thread</h2><p>Use this thread for decisions, review requests, blockers, and handoffs—not scattered project chatter.</p></div></div>
                <div className={styles.messageThread}>
                  {messages.map((message) => {
                    const own = message.created_by === authUser.id;
                    return <article key={message.id} className={own ? styles.messageOwn : styles.messageOther}><header><span>{profileMap.get(message.created_by)?.display_name?.slice(0, 1) ?? '?'}</span><strong>{profileMap.get(message.created_by)?.display_name ?? 'Workspace member'}</strong><small>{formatDate(message.created_at)}</small></header><p>{message.body}</p>{message.project_id && <footer>{projects.find((project) => project.id === message.project_id)?.title}</footer>}</article>;
                  })}
                  {!messages.length && <div className={styles.threadEmpty}><MessageCircle size={26} /><h3>Start with a useful update.</h3><p>Name what changed, what needs review, and who owns the next move.</p></div>}
                </div>
                <form className={styles.messageComposer} onSubmit={sendMessage}><select value={messageProjectId} onChange={(event) => setMessageProjectId(event.target.value)} aria-label="Message project"><option value="">Whole workspace</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}</select><textarea value={messageBody} onChange={(event) => setMessageBody(event.target.value)} placeholder="Share a decision, blocker, review request, or handoff..." rows={2} required /><button type="submit" className={styles.primaryButton}><Send size={16} /> Post update</button></form>
              </section>
            )}

            {activeView === 'repository' && (
              <section className={styles.screen} aria-label="Repository index">
                <div className={styles.screenHeading}><div><p className={styles.eyebrow}>Curated source reflection</p><h2>Repository and directories</h2><p>The hub reflects only explicitly allowlisted repository metadata. It does not expose source files, secrets, finance folders, or unapproved client material.</p></div>{isOwner && <button type="button" className={styles.secondaryButton} onClick={() => void syncRepository()} disabled={isSyncingRepository}><RefreshCw size={16} className={isSyncingRepository ? styles.spin : ''} /> {isSyncingRepository ? 'Syncing...' : 'Sync curated index'}</button>}</div>
                <div className={styles.repositorySummary}>
                  <div><Database size={21} /><span><small>Repository</small><strong>{String(selectedWorkspace.repository_summary.repositoryLabel ?? 'Not connected')}</strong></span></div>
                  <div><CircleDot size={18} /><span><small>Branch</small><strong>{String(selectedWorkspace.repository_summary.branch ?? '—')}</strong></span></div>
                  <div><Compass size={18} /><span><small>Revision</small><strong>{String(selectedWorkspace.repository_summary.revision ?? '—')}</strong></span></div>
                  <div><Activity size={18} /><span><small>Working tree</small><strong>{selectedWorkspace.repository_summary.dirty === true ? 'Local changes present' : 'Clean at last sync'}</strong></span></div>
                </div>
                <div className={styles.repositoryList}>
                  {repositoryItems.map((item) => <article key={item.id}><span className={styles.repositoryIcon}><Folder size={19} /></span><div><header><strong>{item.title}</strong><em className={item.visibility === 'internal' ? styles.internalTag : styles.sharedTag}>{item.visibility}</em></header><p>{item.summary || 'Curated directory reference.'}</p><footer><code>{item.repository_path}</code><span>{item.source_hash ? `rev ${item.source_hash}` : 'No revision'}</span><span>Synced {formatDate(item.last_synced_at)}</span></footer></div></article>)}
                  {!repositoryItems.length && <div className={styles.emptyCard}><Database size={24} /><h3>No repository items are shared here.</h3><p>{isOwner ? 'Add explicit entries to client-hub.config.json, run the local sync script, then sync the curated index.' : 'Kramaniti has not shared a repository reference with this workroom.'}</p></div>}
                </div>
              </section>
            )}

            {activeView === 'assistant' && (
              <section className={`${styles.screen} ${styles.assistantScreen}`} aria-label="Workspace assistant">
                <div className={styles.screenHeading}><div><p className={styles.eyebrow}>Read, draft, approve</p><h2>Workspace assistant</h2><p>The assistant reads the workroom you can access and prepares structured changes. Every write is visible and approval-gated.</p></div>{pendingActions.length > 1 && <button type="button" className={styles.primaryButton} onClick={() => void approveAllPending()} disabled={Boolean(savingActionId)}>Approve all {pendingActions.length}</button>}</div>
                <div className={styles.assistantLayout}>
                  <div className={styles.assistantConversation}>
                    <div className={styles.assistantIntro}><div className={styles.assistantOrb}><span /><span /><i /></div><div><strong>Kramaniti workspace assistant</strong><p>I can review projects, tasks, visible notes, shared messages, and the curated repository index. Ask for a plan or a specific change.</p></div></div>
                    <div className={styles.assistantMessages}>
                      {assistantMessages.map((message) => <article key={message.id} className={message.role === 'assistant' ? styles.assistantReply : styles.assistantPrompt}><header>{message.role === 'assistant' ? <Bot size={15} /> : <UserRound size={15} />}<strong>{message.role === 'assistant' ? 'Assistant' : profileMap.get(message.created_by)?.display_name ?? 'You'}</strong><small>{formatDate(message.created_at)}</small></header><p>{message.content}</p></article>)}
                      {!assistantMessages.length && <div className={styles.assistantSuggestions}><button type="button" onClick={() => setAssistantInput('Review this workspace and tell me what needs attention first.')}>Review current blockers</button><button type="button" onClick={() => setAssistantInput('Draft a concise client update from the latest project and task movement.')}>Draft a client update</button><button type="button" onClick={() => setAssistantInput('Which task should be broken down before work starts?')}>Find a task to plan</button></div>}
                      {isAssistantThinking && <article className={styles.assistantReply}><header><Bot size={15} /><strong>Assistant</strong></header><p className={styles.thinkingText}>Reading the workroom and structuring the next move<span>...</span></p></article>}
                      <div ref={assistantEndRef} />
                    </div>
                    <form className={styles.assistantComposer} onSubmit={sendAssistantMessage}><select value={assistantProjectId} onChange={(event) => setAssistantProjectId(event.target.value)} aria-label="Assistant project context"><option value="">Whole workspace</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}</select><textarea value={assistantInput} onChange={(event) => setAssistantInput(event.target.value)} placeholder="Ask about the work or request a reviewable change..." rows={2} required /><button type="submit" className={styles.primaryButton} disabled={isAssistantThinking}><Send size={16} /> Send</button></form>
                  </div>
                  <aside className={styles.actionRail}>
                    <div className={styles.actionRailHeader}><span><ShieldCheck size={16} /> Approval queue</span><strong>{pendingActions.length}</strong></div>
                    <div className={styles.actionList}>
                      {assistantActions.filter((action) => action.status === 'pending').map((action) => <article key={action.id}><header><span>{humanize(action.action_type)}</span><small>{formatDate(action.created_at)}</small></header><h3>{action.summary}</h3><p>{recordText(action.payload, 'description', 240) || recordText(action.payload, 'body', 240) || recordText(action.payload, 'title', 240)}</p>{recordText(action.payload, 'parentTaskId', 80) && <em>Will be added as a subtask</em>}<footer><button type="button" className={styles.primaryButton} onClick={() => void executeAction(action)} disabled={savingActionId === action.id}>{savingActionId === action.id ? 'Applying...' : 'Approve'}</button><button type="button" className={styles.secondaryButton} onClick={() => void declineAction(action)}>Decline</button></footer></article>)}
                      {!pendingActions.length && <div className={styles.actionEmpty}><CheckCircle2 size={22} /><strong>Queue clear</strong><p>No assistant writes are waiting for approval.</p></div>}
                    </div>
                    <div className={styles.actionHistory}><span>Recent decisions</span>{assistantActions.filter((action) => action.status !== 'pending').slice(0, 6).map((action) => <div key={action.id}><CircleDot size={11} /><p><strong>{action.summary}</strong><small>{humanize(action.status)}</small></p></div>)}</div>
                  </aside>
                </div>
              </section>
            )}
          </div>
        )}
      </section>

      {showClientPanel && (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowClientPanel(false); }}>
          <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="client-panel-title">
            <header><div><p className={styles.eyebrow}>Founder control</p><h2 id="client-panel-title">Create a client workroom</h2><p>One client login, one isolated workspace, and a temporary password that must be replaced after first sign-in.</p></div><button type="button" className={styles.iconButton} onClick={() => setShowClientPanel(false)} aria-label="Close client panel">Close</button></header>
            <form onSubmit={provisionClient}>
              <label><span>Client or company name</span><input value={clientDraft.workspaceName} onChange={(event) => setClientDraft((current) => ({ ...current, workspaceName: event.target.value }))} placeholder="Client workroom name" required /></label>
              <label><span>Client display name</span><input value={clientDraft.displayName} onChange={(event) => setClientDraft((current) => ({ ...current, displayName: event.target.value }))} placeholder="Person who will sign in" required /></label>
              <label><span>Username</span><input value={clientDraft.username} onChange={(event) => setClientDraft((current) => ({ ...current, username: event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))} placeholder="client_username" minLength={3} maxLength={32} required /></label>
              <label><span>Temporary password</span><input type="password" value={clientDraft.password} onChange={(event) => setClientDraft((current) => ({ ...current, password: event.target.value }))} placeholder="At least 12 characters" minLength={12} required /></label>
              <aside><ShieldCheck size={17} /><p>Share credentials through a secure channel. The password is sent directly to Supabase Auth, is not stored in this repository, and is never returned by the provisioning endpoint.</p></aside>
              <div className={styles.modalActions}><button type="button" className={styles.secondaryButton} onClick={() => setShowClientPanel(false)}>Cancel</button><button type="submit" className={styles.primaryButton} disabled={isProvisioning}>{isProvisioning ? 'Creating...' : 'Create login and workroom'}<ArrowRight size={16} /></button></div>
            </form>
          </section>
        </div>
      )}

      {showPasswordChange && (
        <div className={styles.modalBackdrop}>
          <section className={`${styles.modal} ${styles.passwordModal}`} role="dialog" aria-modal="true" aria-labelledby="password-title">
            <div className={styles.passwordIcon}><Settings size={22} /></div>
            <p className={styles.eyebrow}>First sign-in</p>
            <h2 id="password-title">Replace the temporary password.</h2>
            <p>This private workroom was provisioned by Kramaniti. Set your own password before accessing client material.</p>
            <form onSubmit={changePassword}><label><span>New password</span><input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={12} autoComplete="new-password" required /></label><label><span>Confirm password</span><input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={12} autoComplete="new-password" required /></label><button type="submit" className={styles.primaryButton}>Set password and continue <ArrowRight size={16} /></button></form>
          </section>
        </div>
      )}
    </main>
  );
}

'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import {
  Activity,
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Check,
  CircleDot,
  Command,
  Database,
  GitBranch,
  ListTodo,
  LogOut,
  Moon,
  Plus,
  Send,
  ShieldCheck,
  Sun,
} from 'lucide-react';
import manifest from '@/data/kramaniti-hq-repositories.generated.json';
import {
  getClientHubSupabase,
  isClientHubSupabaseConfigured,
  normalizeClientHubLogin,
  type ClientHubAssistantMessage,
  type ClientHubProfile,
  type ClientHubProject,
  type ClientHubTask,
  type ClientHubTaskPriority,
  type ClientHubTaskStatus,
  type ClientHubWorkspace,
  type KramanitiHqAction,
  type KramanitiHqHealth,
  type KramanitiHqPortfolioItem,
  type KramanitiHqStage,
} from '@/lib/client-hub/supabase';
import styles from './KramanitiHq.module.css';

type HqView = 'overview' | 'tasks' | 'assistant' | 'projects' | 'repositories';
type Theme = 'dark' | 'light';
type TaskFilter = 'open' | 'done' | 'all';
type HqAssistantMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  applied?: string[];
};

const navigation: Array<{ id: HqView; label: string; icon: typeof Command }> = [
  { id: 'overview', label: 'Today', icon: Command },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'assistant', label: 'Assistant', icon: Bot },
  { id: 'projects', label: 'Projects', icon: BriefcaseBusiness },
  { id: 'repositories', label: 'Repositories', icon: Database },
];

const stageLabels: Record<KramanitiHqStage, string> = {
  internal_build: 'Internal build',
  relationship: 'Relationship',
  discovery: 'Discovery',
  proposal: 'Proposal shared',
  commercial_sent: 'Commercial sent',
  approval: 'Awaiting approval',
  delivery: 'Active delivery',
  paused: 'Paused',
  closed: 'Closed',
};

const healthLabels: Record<KramanitiHqHealth, string> = {
  moving: 'Moving',
  steady: 'Steady',
  waiting: 'Waiting',
  attention: 'Needs attention',
};

const priorityOrder: Record<ClientHubTaskPriority, number> = {
  urgent: 0,
  high: 1,
  normal: 2,
  low: 3,
};

const taskStatusLabels: Record<ClientHubTaskStatus, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  waiting: 'Waiting',
  review: 'In review',
  done: 'Done',
  archived: 'Archived',
};

const formatDate = (value: string | null, includeTime = false) => {
  if (!value) return 'Not set';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not set';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    ...(includeTime ? { hour: 'numeric', minute: '2-digit' } : {}),
  }).format(date);
};

const isOpenAction = (action: KramanitiHqAction) => !['done', 'archived'].includes(action.status);

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={styles.brandLine}>
      <Image src="/assets/brand/kramaniti-mark-gold.png" alt="Kramaniti logo" width={44} height={44} priority />
      {!compact && <div><strong>Kramaniti</strong><small>HQ</small></div>}
    </div>
  );
}

export function KramanitiHq() {
  const [activeView, setActiveView] = useState<HqView>('overview');
  const [theme, setTheme] = useState<Theme>('dark');
  const [authReady, setAuthReady] = useState(() => !isClientHubSupabaseConfigured());
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ClientHubProfile | null>(null);
  const [workspaces, setWorkspaces] = useState<ClientHubWorkspace[]>([]);
  const [portfolio, setPortfolio] = useState<KramanitiHqPortfolioItem[]>([]);
  const [actions, setActions] = useState<KramanitiHqAction[]>([]);
  const [deliveryProjects, setDeliveryProjects] = useState<ClientHubProject[]>([]);
  const [deliveryTasks, setDeliveryTasks] = useState<ClientHubTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [status, setStatus] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState('all');
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('open');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<ClientHubTaskPriority>('normal');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [isSavingTask, setIsSavingTask] = useState(false);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantMessages, setAssistantMessages] = useState<HqAssistantMessage[]>([]);
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);

  const configured = isClientHubSupabaseConfigured();
  const isOwner = profile?.role === 'owner';
  const workspaceMap = useMemo(() => new Map(workspaces.map((workspace) => [workspace.id, workspace])), [workspaces]);
  const portfolioMap = useMemo(() => new Map(portfolio.map((item) => [item.id, item])), [portfolio]);

  const sortedPortfolio = useMemo(
    () => [...portfolio].sort((a, b) => a.priority - b.priority || a.updated_at.localeCompare(b.updated_at)),
    [portfolio]
  );

  const openActions = useMemo(
    () =>
      actions
        .filter(isOpenAction)
        .sort((a, b) => {
          const priorityDifference = priorityOrder[a.priority] - priorityOrder[b.priority];
          if (priorityDifference) return priorityDifference;
          if (!a.due_at) return 1;
          if (!b.due_at) return -1;
          return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
        }),
    [actions]
  );

  const focusedPortfolio = selectedWorkspaceId === 'all'
    ? sortedPortfolio
    : sortedPortfolio.filter((item) => item.workspace_id === selectedWorkspaceId);
  const focusedPortfolioIds = new Set(focusedPortfolio.map((item) => item.id));
  const focusedActions = openActions.filter((action) => focusedPortfolioIds.has(action.portfolio_item_id));
  const focusedTasks = deliveryTasks
    .filter((task) => selectedWorkspaceId === 'all' || task.workspace_id === selectedWorkspaceId)
    .sort((a, b) => {
      if (a.status === 'done' && b.status !== 'done') return 1;
      if (a.status !== 'done' && b.status === 'done') return -1;
      const priorityDifference = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDifference) return priorityDifference;
      return b.updated_at.localeCompare(a.updated_at);
    });
  const visibleTasks = focusedTasks.filter((task) => {
    if (taskFilter === 'open') return !['done', 'archived'].includes(task.status);
    if (taskFilter === 'done') return task.status === 'done';
    return task.status !== 'archived';
  });
  const openSharedTasks = focusedTasks.filter((task) => !['done', 'archived'].includes(task.status));
  const waitingItems = focusedPortfolio.filter((item) => item.health === 'waiting' || item.waiting_on);
  const attentionItems = focusedPortfolio.filter((item) => item.health === 'attention');
  const selectedWorkspace = selectedWorkspaceId === 'all' ? null : workspaceMap.get(selectedWorkspaceId) ?? null;

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('kramaniti-hq-theme');
    const preferredTheme = storedTheme === 'light' || storedTheme === 'dark'
      ? storedTheme
      : window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const frame = window.requestAnimationFrame(() => setTheme(preferredTheme));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem('kramaniti-hq-theme', next);
      return next;
    });
  };

  const selectWorkspace = async (workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId);
    setAssistantMessages([]);
    setStatus('');
    if (workspaceId === 'all') return;

    const supabase = getClientHubSupabase();
    if (!supabase) return;
    const { data, error } = await supabase
      .from('assistant_messages')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('metadata->>surface', 'hq')
      .order('created_at', { ascending: true })
      .limit(40);
    if (error) return;
    const history = (data ?? []) as ClientHubAssistantMessage[];
    setAssistantMessages(history.map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content,
    })));
  };

  const loadHq = useCallback(async (user: User, options?: { quiet?: boolean }) => {
    const supabase = getClientHubSupabase();
    if (!supabase) return;
    if (!options?.quiet) setIsLoading(true);

    const [profileResult, workspaceResult, portfolioResult, actionResult, projectResult, taskResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('workspaces').select('*').neq('status', 'archived').order('updated_at', { ascending: false }),
      supabase.from('hq_portfolio_items').select('*').eq('owner_id', user.id).order('priority', { ascending: true }),
      supabase.from('hq_actions').select('*').eq('owner_id', user.id).neq('status', 'archived').order('created_at', { ascending: false }),
      supabase.from('projects').select('*').neq('status', 'archived').order('updated_at', { ascending: false }),
      supabase.from('tasks').select('*').neq('status', 'archived').order('updated_at', { ascending: false }),
    ]);

    if (profileResult.error) {
      setStatus('HQ access could not be checked.');
      if (!options?.quiet) setIsLoading(false);
      return;
    }

    setProfile(profileResult.data ?? null);
    if (profileResult.data?.role !== 'owner') {
      setWorkspaces([]);
      setPortfolio([]);
      setActions([]);
      setDeliveryProjects([]);
      setDeliveryTasks([]);
      if (!options?.quiet) setIsLoading(false);
      return;
    }

    const dataError = [workspaceResult.error, portfolioResult.error, actionResult.error, projectResult.error, taskResult.error].find(Boolean);
    if (dataError) {
      setStatus('HQ data could not be loaded.');
      if (!options?.quiet) setIsLoading(false);
      return;
    }

    setWorkspaces(workspaceResult.data ?? []);
    setPortfolio(portfolioResult.data ?? []);
    setActions(actionResult.data ?? []);
    setDeliveryProjects(projectResult.data ?? []);
    setDeliveryTasks(taskResult.data ?? []);
    if (!options?.quiet) setIsLoading(false);
  }, []);

  const resetState = useCallback(() => {
    setProfile(null);
    setWorkspaces([]);
    setPortfolio([]);
    setActions([]);
    setDeliveryProjects([]);
    setDeliveryTasks([]);
  }, []);

  useEffect(() => {
    const supabase = getClientHubSupabase();
    if (!supabase) return;

    void supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user ?? null;
      setAuthUser(user);
      if (user) void loadHq(user);
      else resetState();
      setAuthReady(true);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setAuthUser(user);
      if (user) void loadHq(user);
      else resetState();
      setAuthReady(true);
    });

    return () => data.subscription.unsubscribe();
  }, [loadHq, resetState]);

  useEffect(() => {
    const supabase = getClientHubSupabase();
    if (!supabase || !authUser || !isOwner) return;

    const channel = supabase.channel(`kramaniti-hq-${authUser.id}`);
    (['hq_portfolio_items', 'hq_actions', 'projects', 'tasks'] as const).forEach((table) => {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'kramaniti_hub', table },
        () => void loadHq(authUser, { quiet: true })
      );
    });
    channel.subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [authUser, isOwner, loadHq]);

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
      setStatus('Email or password was not accepted.');
      return;
    }
    setPassword('');
  };

  const signOut = async () => {
    const supabase = getClientHubSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
    resetState();
  };

  const createTask = async (event: React.FormEvent) => {
    event.preventDefault();
    const supabase = getClientHubSupabase();
    if (!supabase || !authUser || selectedWorkspaceId === 'all' || !taskTitle.trim()) {
      setStatus('Select one client or project before adding a task.');
      return;
    }

    setIsSavingTask(true);
    setStatus('');
    const { error } = await supabase.from('tasks').insert({
      workspace_id: selectedWorkspaceId,
      title: taskTitle.trim(),
      priority: taskPriority,
      due_date: taskDueDate || null,
      source: 'manual',
      created_by: authUser.id,
    });
    setIsSavingTask(false);

    if (error) {
      setStatus('The task could not be saved.');
      return;
    }

    setTaskTitle('');
    setTaskPriority('normal');
    setTaskDueDate('');
    setStatus(`Task added to ${selectedWorkspace?.name ?? 'the selected workspace'}.`);
    await loadHq(authUser, { quiet: true });
  };

  const updateTaskStatus = async (task: ClientHubTask, nextStatus: ClientHubTaskStatus) => {
    const supabase = getClientHubSupabase();
    if (!supabase || !authUser) return;
    const { error } = await supabase.from('tasks').update({ status: nextStatus }).eq('id', task.id);
    if (error) {
      setStatus('The task status could not be updated.');
      return;
    }
    await loadHq(authUser, { quiet: true });
  };

  const sendAssistantMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    const message = assistantInput.trim();
    const supabase = getClientHubSupabase();
    if (!supabase || !authUser || selectedWorkspaceId === 'all' || !message || isAssistantThinking) {
      if (selectedWorkspaceId === 'all') setStatus('Select one client or project before using the assistant.');
      return;
    }

    const userMessage: HqAssistantMessage = { id: crypto.randomUUID(), role: 'user', content: message };
    setAssistantMessages((current) => [...current, userMessage]);
    setAssistantInput('');
    setIsAssistantThinking(true);
    setStatus('');

    try {
      const { data } = await supabase.auth.getSession();
      const response = await fetch('/api/hq/assistant', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${data.session?.access_token ?? ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workspaceId: selectedWorkspaceId, message }),
      });
      const body = (await response.json().catch(() => ({}))) as {
        response?: string;
        error?: string;
        applied?: Array<{ summary?: string }>;
      };

      if (!response.ok) throw new Error(body.error || 'The assistant could not complete that request.');
      setAssistantMessages((current) => [...current, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: body.response || 'The task request was completed.',
        applied: (body.applied ?? []).map((item) => item.summary ?? '').filter(Boolean),
      }]);
      await loadHq(authUser, { quiet: true });
    } catch (error) {
      setAssistantMessages((current) => [...current, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: error instanceof Error ? error.message : 'The assistant could not complete that request.',
      }]);
    } finally {
      setIsAssistantThinking(false);
    }
  };

  if (!configured) {
    return (
      <main className={styles.centeredState} data-theme={theme}>
        <Brand compact />
        <span className={styles.eyebrow}>Kramaniti HQ</span>
        <h1>Private operating access is not configured.</h1>
        <p>Add the existing public Supabase URL and publishable key to the website environment.</p>
      </main>
    );
  }

  if (!authReady || (authUser && isLoading && !profile)) {
    return (
      <main className={styles.centeredState} data-theme={theme}>
        <div className={styles.loadingOrbit}><span /></div>
        <span className={styles.eyebrow}>Kramaniti HQ</span>
        <h1>Assembling your operating picture.</h1>
      </main>
    );
  }

  if (!authUser) {
    return (
      <main className={styles.loginShell} data-theme={theme}>
        <button className={styles.loginThemeButton} onClick={toggleTheme} aria-label={`Use ${theme === 'dark' ? 'light' : 'dark'} theme`}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className={styles.loginAtmosphere} aria-hidden="true" />
        <section className={styles.loginStory}>
          <Brand />
          <div>
            <span className={styles.eyebrow}>Founder tracking centre</span>
            <h1>One clear picture of the work already in motion.</h1>
            <p>Read-only priorities, project context and repository movement—without publishing or changing the source.</p>
          </div>
          <div className={styles.loginSequence}><span>Observe</span><i /><span>Understand</span><i /><span>Act at source</span></div>
        </section>
        <form className={styles.loginForm} onSubmit={signIn}>
          <div><span className={styles.eyebrow}>Private access</span><h2>Enter HQ</h2></div>
          <label>Email<input type="email" value={login} onChange={(event) => setLogin(event.target.value)} autoComplete="username" required /></label>
          <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
          <button type="submit" className={styles.primaryButton} disabled={isSigningIn}>{isSigningIn ? 'Checking access…' : 'Continue'} <ArrowRight size={18} /></button>
          {status && <p className={styles.formStatus}>{status}</p>}
          <span className={styles.securityNote}><ShieldCheck size={16} /> Uses the existing owner account and row-level access controls.</span>
        </form>
      </main>
    );
  }

  if (profile && !isOwner) {
    return (
      <main className={styles.centeredState} data-theme={theme}>
        <ShieldCheck size={38} />
        <span className={styles.eyebrow}>Owner-only boundary</span>
        <h1>This account belongs in Client Hub.</h1>
        <p>Kramaniti HQ keeps portfolio, commercial and cross-client context visible only to the founder.</p>
        <button className={styles.secondaryButton} onClick={signOut}>Sign out</button>
      </main>
    );
  }

  const renderOverview = () => (
    <>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>{new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}</span>
        <h1 className={styles.shimmerHeading}>Good morning, {profile?.display_name.split(' ')[0] ?? 'Karan'}.</h1>
        <p>{focusedActions.length || openSharedTasks.length ? `${focusedActions.length + openSharedTasks.length} open items are currently being tracked${selectedWorkspace ? ` for ${selectedWorkspace.name}` : ''}.` : 'Nothing is demanding attention in the current focus.'}</p>
      </section>

      <section className={styles.summaryStrip} aria-label="Current operating summary">
        <div><strong>{focusedPortfolio.length}</strong><span>Active projects</span></div>
        <div><strong>{openSharedTasks.length}</strong><span>Shared tasks</span></div>
        <div><strong>{waitingItems.length}</strong><span>Waiting externally</span></div>
        <div><strong>{attentionItems.length}</strong><span>Need attention</span></div>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.sectionHeading}><div><span>01</span><h2>Focus list</h2></div><small>Read-only</small></div>
        <div className={styles.actionStream}>
          {focusedActions.slice(0, 6).map((action, index) => {
            const item = portfolioMap.get(action.portfolio_item_id);
            const workspace = item ? workspaceMap.get(item.workspace_id) : null;
            return (
              <article className={styles.actionRow} key={action.id}>
                <span className={styles.actionIndex}>{String(index + 1).padStart(2, '0')}</span>
                <div className={styles.actionCopy}>
                  <span>{workspace?.name ?? 'Kramaniti'}</span>
                  <h3>{action.title}</h3>
                  {action.notes && <p>{action.notes}</p>}
                </div>
                <div className={styles.actionMeta}><span data-priority={action.priority}>{action.priority}</span><time>{formatDate(action.due_at, true)}</time></div>
              </article>
            );
          })}
          {!focusedActions.length && <div className={styles.emptyLine}>No founder follow-ups in the current focus.</div>}
        </div>
      </section>

      <section className={styles.twoColumn}>
        <div>
          <div className={styles.sectionHeading}><div><span>02</span><h2>Waiting on others</h2></div></div>
          <div className={styles.waitingStream}>
            {waitingItems.map((item) => (
              <article key={item.id} className={styles.waitingRow}>
                <span className={styles.healthDot} data-health={item.health} />
                <div><strong>{workspaceMap.get(item.workspace_id)?.name}</strong><span>{item.waiting_on || 'External response'}</span></div>
                <time>{formatDate(item.next_follow_up_at)}</time>
              </article>
            ))}
            {!waitingItems.length && <div className={styles.emptyLine}>No external dependencies recorded.</div>}
          </div>
        </div>
        <div>
          <div className={styles.sectionHeading}><div><span>03</span><h2>Next signal</h2></div></div>
          <div className={styles.signalStatement}>
            <CircleDot size={20} />
            <p>{attentionItems[0]?.next_action || sortedPortfolio[0]?.next_action || 'Keep Kramaniti primary and review project movement at the source.'}</p>
            <span>Derived from the current HQ snapshot</span>
          </div>
        </div>
      </section>
    </>
  );

  const renderTasks = () => (
    <section className={styles.fullSection}>
      <div className={styles.pageHeading}>
        <span className={styles.eyebrow}>Supabase-backed shared work</span>
        <h1>Tasks</h1>
        <p>{selectedWorkspace ? `Manage the task list for ${selectedWorkspace.name}. These tasks are ready to appear in that client’s own workspace when access is enabled.` : 'Choose one client or project from the focus rail to manage its tasks.'}</p>
      </div>

      {selectedWorkspace ? (
        <form className={styles.quickTaskForm} onSubmit={createTask}>
          <label className={styles.taskTitleField}><span>New task</span><input value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} placeholder={`Add a task for ${selectedWorkspace.name}`} maxLength={220} required /></label>
          <label><span>Priority</span><select value={taskPriority} onChange={(event) => setTaskPriority(event.target.value as ClientHubTaskPriority)}><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select></label>
          <label><span>Due date</span><input type="date" value={taskDueDate} onChange={(event) => setTaskDueDate(event.target.value)} /></label>
          <button className={styles.primaryButton} type="submit" disabled={isSavingTask}>{isSavingTask ? 'Saving…' : <><Plus size={18} /> Add task</>}</button>
          <small><ShieldCheck size={15} /> Shared with members of this workspace. Only Kramaniti staff can manage it.</small>
        </form>
      ) : (
        <div className={styles.selectFocusPrompt}><ListTodo size={24} /><div><strong>Select a workspace first</strong><p>This prevents a task from being added to the wrong client.</p></div></div>
      )}

      <div className={styles.taskToolbar}>
        <div><strong>{visibleTasks.length}</strong><span>{selectedWorkspace?.name ?? 'All workspaces'}</span></div>
        <div>{(['open', 'done', 'all'] as TaskFilter[]).map((filter) => <button key={filter} className={taskFilter === filter ? styles.activeFilter : ''} onClick={() => setTaskFilter(filter)}>{filter}</button>)}</div>
      </div>

      <div className={styles.taskList}>
        {visibleTasks.map((task) => (
          <article className={styles.taskRow} key={task.id}>
            <button className={styles.taskCheck} data-complete={task.status === 'done'} onClick={() => void updateTaskStatus(task, task.status === 'done' ? 'todo' : 'done')} aria-label={task.status === 'done' ? `Reopen ${task.title}` : `Complete ${task.title}`}><Check size={16} /></button>
            <div className={styles.taskCopy}><span>{workspaceMap.get(task.workspace_id)?.name}</span><h2>{task.title}</h2>{task.description && <p>{task.description}</p>}</div>
            <div className={styles.taskMeta}><span data-priority={task.priority}>{task.priority}</span><time>{task.due_date ? `Due ${formatDate(task.due_date)}` : 'No due date'}</time></div>
            <select className={styles.taskStatusSelect} value={task.status} onChange={(event) => void updateTaskStatus(task, event.target.value as ClientHubTaskStatus)} aria-label={`Status for ${task.title}`}>
              {(['todo', 'in_progress', 'waiting', 'review', 'done'] as ClientHubTaskStatus[]).map((taskStatus) => <option key={taskStatus} value={taskStatus}>{taskStatusLabels[taskStatus]}</option>)}
            </select>
          </article>
        ))}
        {!visibleTasks.length && <div className={styles.emptyTaskState}><ListTodo size={24} /><strong>No {taskFilter === 'all' ? '' : taskFilter} tasks here yet.</strong><span>{selectedWorkspace ? 'Use the quick form above to add the first one.' : 'Select a workspace to begin.'}</span></div>}
      </div>
    </section>
  );

  const renderProjects = () => (
    <section className={styles.fullSection}>
      <div className={styles.pageHeading}><span className={styles.eyebrow}>Current operating picture</span><h1>Projects</h1><p>Five workstreams, ordered by priority. HQ shows their recorded state without editing it.</p></div>
      <div className={styles.projectList}>
        {focusedPortfolio.map((item) => {
          const workspace = workspaceMap.get(item.workspace_id);
          const pulse = manifest.workspaces.find((repository) => repository.repositoryKey === item.repository_key);
          const workspaceProjects = deliveryProjects.filter((project) => project.workspace_id === item.workspace_id);
          const workspaceTasks = deliveryTasks.filter((task) => task.workspace_id === item.workspace_id && !['done', 'archived'].includes(task.status));
          return (
            <article key={item.id} className={styles.projectRow}>
              <div className={styles.projectLead}>
                <span className={styles.projectPriority}>P{item.priority}</span>
                <div><span className={styles.projectKind}>{item.kind}</span><h2>{workspace?.name}</h2><p>{item.summary}</p></div>
              </div>
              <div className={styles.projectDetails}>
                <div><span>Stage</span><strong>{stageLabels[item.stage]}</strong></div>
                <div><span>Signal</span><strong className={styles.healthLabel} data-health={item.health}>{healthLabels[item.health]}</strong></div>
                <div><span>Next</span><strong>{item.next_action || 'Not recorded'}</strong></div>
                <div><span>Waiting on</span><strong>{item.waiting_on || 'No external dependency'}</strong></div>
              </div>
              <div className={styles.projectFoot}>
                <span><GitBranch size={15} /> {pulse?.repositorySummary.branch ?? (pulse?.versioned ? 'No commits' : 'Unversioned')}</span>
                <span><Activity size={15} /> {pulse?.repositorySummary.dirtyFileCount ?? 0} local changes</span>
                <span>{workspaceProjects.length} delivery projects</span>
                <span>{workspaceTasks.length} open delivery tasks</span>
                <time>Follow-up {formatDate(item.next_follow_up_at)}</time>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );

  const renderAssistant = () => (
    <section className={styles.assistantSection}>
      <div className={styles.pageHeading}>
        <span className={styles.eyebrow}>Natural-language task control</span>
        <h1>Task assistant</h1>
        <p>{selectedWorkspace ? `The assistant can read and manage tasks only inside ${selectedWorkspace.name}. Every applied change is saved to Supabase and recorded in the assistant audit trail.` : 'Select one workspace from the focus rail before asking the assistant to manage tasks.'}</p>
      </div>

      {selectedWorkspace ? (
        <div className={styles.assistantConsole}>
          <div className={styles.assistantContext}>
            <div><Bot size={19} /><span>Working in</span><strong>{selectedWorkspace.name}</strong></div>
            <div><strong>{openSharedTasks.length}</strong><span>open tasks</span></div>
          </div>
          <div className={styles.assistantConversation}>
            {!assistantMessages.length && (
              <div className={styles.assistantWelcome}>
                <Bot size={28} />
                <h2>Tell me what should change.</h2>
                <p>I can create tasks, change details or deadlines, start work, mark tasks as waiting, complete them, reopen them, or archive them.</p>
                <div className={styles.assistantSuggestions}>
                  {[
                    'What are the most urgent open tasks?',
                    'Create a high-priority task to follow up tomorrow',
                    'Complete the task about the website review',
                  ].map((suggestion) => <button key={suggestion} onClick={() => setAssistantInput(suggestion)}>{suggestion}</button>)}
                </div>
              </div>
            )}
            {assistantMessages.map((message) => (
              <article key={message.id} className={styles.assistantMessage} data-role={message.role}>
                <span>{message.role === 'assistant' ? 'HQ Assistant' : 'You'}</span>
                <p>{message.content}</p>
                {!!message.applied?.length && <div className={styles.appliedActions}>{message.applied.map((item) => <span key={item}><Check size={14} /> {item}</span>)}</div>}
              </article>
            ))}
            {isAssistantThinking && <div className={styles.assistantThinking}><i /><i /><i /><span>Reviewing the current task list</span></div>}
          </div>
          <form className={styles.assistantComposer} onSubmit={sendAssistantMessage}>
            <textarea value={assistantInput} onChange={(event) => setAssistantInput(event.target.value)} placeholder={`Ask the assistant to manage ${selectedWorkspace.name} tasks…`} rows={2} maxLength={2400} required />
            <button type="submit" disabled={isAssistantThinking || !assistantInput.trim()} aria-label="Send task request"><Send size={19} /></button>
            <small><ShieldCheck size={14} /> Task-scoped access · owner authenticated · changes apply immediately</small>
          </form>
        </div>
      ) : (
        <div className={styles.selectFocusPrompt}><Bot size={24} /><div><strong>Select one workspace first</strong><p>The assistant is intentionally prevented from acting across clients in one request.</p></div></div>
      )}
    </section>
  );

  const renderRepositories = () => (
    <section className={styles.fullSection}>
      <div className={styles.pageHeading}><span className={styles.eyebrow}>Local repository snapshots</span><h1>Repositories</h1><p>Code activity is scanned on this machine. HQ reads the generated snapshot; it never writes to a repository or publishes from this screen.</p></div>
      <div className={styles.syncExplainer}>
        <div><span>Current behaviour</span><strong>Snapshot-based</strong><p>The scan runs automatically when the website starts or builds.</p></div>
        <div><span>While developing</span><strong>Optional 60-second watch</strong><p><code>npm run hq:watch</code> keeps the local snapshot fresh while it is running.</p></div>
        <div><span>Not yet enabled</span><strong>True push updates</strong><p>GitHub webhooks or a scheduled hosted sync would be needed for realtime repository updates.</p></div>
      </div>
      <div className={styles.repositoryList}>
        {manifest.workspaces.filter((repository) => selectedWorkspaceId === 'all' || focusedPortfolio.some((item) => item.repository_key === repository.repositoryKey)).map((repository) => (
          <article className={styles.repositoryRow} key={repository.repositoryKey}>
            <div className={styles.repoStatus}><i data-dirty={repository.repositorySummary.dirty} /><span>{repository.available ? (repository.versioned ? 'Connected' : 'Local folder') : 'Unavailable'}</span></div>
            <div className={styles.repoIdentity}><span>{repository.repositorySummary.branch ?? (repository.versioned ? 'No commits' : 'Unversioned')}</span><h2>{repository.name}</h2><p>{repository.repositorySummary.lastCommitSubject ?? 'No Git commit recorded'}</p></div>
            <div className={styles.repoMetrics}>
              <div><strong>{repository.repositorySummary.dirtyFileCount}</strong><span>Local changes</span></div>
              <div><strong>{repository.repositorySummary.trackedFileCount}</strong><span>Tracked files</span></div>
              <div><strong>{repository.repositorySummary.ahead}/{repository.repositorySummary.behind}</strong><span>Ahead / behind</span></div>
            </div>
            <div className={styles.repoRevision}><code>{repository.repositorySummary.revision ?? 'no revision'}</code><time>{formatDate(repository.repositorySummary.lastCommitAt)}</time></div>
          </article>
        ))}
      </div>
      <div className={styles.pulseNote}><CircleDot size={18} /><p>Snapshot generated {formatDate(manifest.generatedAt, true)}. Repository contents, remote URLs, secrets and absolute paths are excluded.</p></div>
    </section>
  );

  return (
    <main className={styles.hqShell} data-theme={theme}>
      <header className={styles.topBar}>
        <Brand />
        <nav aria-label="HQ sections">
          {navigation.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} className={activeView === item.id ? styles.activeNav : ''} onClick={() => setActiveView(item.id)}><Icon size={18} /><span>{item.label}</span></button>;
          })}
        </nav>
        <div className={styles.navActions}>
          <span className={styles.readOnlyStatus}><i /> Tracking + tasks</span>
          <button className={styles.iconButton} onClick={toggleTheme} aria-label={`Use ${theme === 'dark' ? 'light' : 'dark'} theme`}>{theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}</button>
          <button className={styles.iconButton} onClick={signOut} aria-label="Sign out"><LogOut size={19} /></button>
        </div>
      </header>
      <div className={styles.workspace}>
        {status && <p className={styles.statusMessage}>{status}</p>}
        <section className={styles.clientFocus} aria-label="Focus by client or project">
          <span>Focus</span>
          <div>
            <button className={selectedWorkspaceId === 'all' ? styles.activeFocus : ''} onClick={() => void selectWorkspace('all')}>All</button>
            {sortedPortfolio.map((item) => <button key={item.workspace_id} className={selectedWorkspaceId === item.workspace_id ? styles.activeFocus : ''} onClick={() => void selectWorkspace(item.workspace_id)}>{workspaceMap.get(item.workspace_id)?.name}</button>)}
          </div>
        </section>
        {activeView === 'overview' && renderOverview()}
        {activeView === 'tasks' && renderTasks()}
        {activeView === 'assistant' && renderAssistant()}
        {activeView === 'projects' && renderProjects()}
        {activeView === 'repositories' && renderRepositories()}
      </div>
    </main>
  );
}

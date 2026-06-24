'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Activity,
  Archive,
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Compass,
  Database,
  FileText,
  Folder,
  FolderOpen,
  FolderPlus,
  Lightbulb,
  LogOut,
  MessageCircle,
  Moon,
  Search,
  Plus,
  RefreshCw,
  Route,
  Send,
  Settings,
  ShieldCheck,
  Sun,
  UserRound,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import {
  getClarityCircleSupabase,
  type ClarityCircleAssistantMemory,
  type ClarityCircleAssistantMessage,
  type ClarityCircleContextEntry,
  type ClarityCircleProfile,
  type ClarityCircleProject,
  type ClarityCircleProjectFolder,
  type ClarityCircleProjectTask,
} from '@/lib/clarity-circle/supabase';
import styles from './ClarityCircle.module.css';

type Track = 'founder' | 'builder';
type StepId = 'entry' | 'track' | 'intent' | 'context';
type SessionMode = 'signin' | 'signup';
type AuthView = 'signup-email' | 'signup-credentials' | 'signin';
type MenuId = 'home' | 'start' | 'path' | 'context' | 'assistant' | 'memory' | 'projects' | 'profile' | 'settings';

type IntentDraft = {
  headline: string;
  context: string;
  audience: string;
  blocker: string;
  outcome: string;
};

type SavedContext = {
  track: Track;
  savedAt: string;
  intent: IntentDraft;
  summary: string;
  questions: string[];
  actions: string[];
};

type UiAssistantMessage = Pick<ClarityCircleAssistantMessage, 'role' | 'content'> & {
  id: string;
  createdAt: string;
  project_id?: string | null;
};

type AssistantProjectDraft = {
  title: string;
  track: Track;
  context: string;
  projectInstruction?: string;
  audience: string;
  blocker: string;
  outcome: string;
};

type AssistantFolderDraft = {
  name: string;
};

type AssistantMemoryDraft = {
  title: string;
  content: string;
  memory_type: ClarityCircleAssistantMemory['memory_type'];
};

type AssistantTaskDraft = {
  title: string;
  detail?: string;
};

type AssistantResponse = {
  response?: string;
  projectDraft?: AssistantProjectDraft | null;
  folderDraft?: AssistantFolderDraft | null;
  memoryDraft?: AssistantMemoryDraft | null;
  taskDrafts?: AssistantTaskDraft[] | null;
  error?: string;
};

type ProjectFolderFilter = 'all' | 'unfiled' | string;

type WorkspaceSnapshot = {
  projects: ClarityCircleProject[];
  folders: ClarityCircleProjectFolder[];
  tasks: ClarityCircleProjectTask[];
  contextEntries: ClarityCircleContextEntry[];
  messages: UiAssistantMessage[];
  memories: ClarityCircleAssistantMemory[];
};

const STORAGE_KEY = 'kramaniti-clarity-circle-sequence-v1';
const ENGINE_HANDOFF_KEY = 'kramaniti-clarity-circle-engine-handoff-v1';
const ASSISTANT_INPUT_MIN_HEIGHT = 42;
const ASSISTANT_INPUT_MAX_HEIGHT = 132;

const clearCircleLocalStorage = () => {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Browser storage can be blocked; signed-in data still stays database-backed.
  }
};

type EngineHandoff = {
  version: 1;
  createdAt: string;
  track: Track;
  trackLabel: string;
  headline: string;
  context: string;
  audience: string;
  blocker: string;
  outcome: string;
  summary: string;
  questions: string[];
  actions: string[];
};

const TRACKS: Record<
  Track,
  {
    label: string;
    shortLabel: string;
    description: string;
    icon: typeof Building2;
    defaults: IntentDraft;
  }
> = {
  founder: {
    label: 'I am building a business',
    shortLabel: 'Founder Track',
    description: 'Clarify the business, workflow, AI role, human review boundary, and proof-safe next step.',
    icon: Building2,
    defaults: {
      headline: 'Where should AI actually assist this business?',
      context:
        'We have a business direction, but the workflow is scattered. I want clarity on what should stay human-led, what AI can assist, and what should become a repeatable system.',
      audience: 'Founders, operators, or teams trying to adopt practical AI without losing review discipline.',
      blocker: 'Too many tools and ideas, but not enough clarity on the first workflow worth systemizing.',
      outcome: 'A sharper operating route and one proof-safe public explanation.',
    },
  },
  builder: {
    label: 'I am exploring an idea',
    shortLabel: 'Builder Track',
    description: 'Turn a rough idea into a clearer audience, problem, validation path, and first useful version.',
    icon: Lightbulb,
    defaults: {
      headline: 'How do I turn this rough idea into a first useful version?',
      context:
        'I have an idea and a few possible directions, but I am not sure who it is for, what problem matters most, or what to do first.',
      audience: 'Individuals or early builders who have an idea but need a sharper first audience and use case.',
      blocker: 'The audience, first version, and validation move are still unclear.',
      outcome: 'A simple validation plan and one clear explanation of the idea.',
    },
  },
};

const STEPS: Array<{ id: StepId; label: string; detail: string }> = [
  { id: 'entry', label: 'Enter', detail: 'Start the circle' },
  { id: 'track', label: 'Path', detail: 'Choose your context' },
  { id: 'intent', label: 'Intent', detail: 'Capture the signal' },
  { id: 'context', label: 'Context', detail: 'Save and develop' },
];

const MENU_ITEMS: Array<{ id: MenuId; label: string; icon: typeof CircleDot }> = [
  { id: 'start', label: 'Start', icon: CircleDot },
  { id: 'path', label: 'Path', icon: Compass },
  { id: 'context', label: 'Context', icon: FileText },
  { id: 'assistant', label: 'Assistant', icon: MessageCircle },
  { id: 'memory', label: 'Memory', icon: Database },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
];

const createUiMessage = (role: UiAssistantMessage['role'], content: string, projectId?: string | null): UiAssistantMessage => ({
  id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  role,
  content,
  createdAt: new Date().toISOString(),
  project_id: projectId ?? null,
});

const INITIAL_ASSISTANT_MESSAGES: UiAssistantMessage[] = [
  createUiMessage(
    'assistant',
    'I can use your Circle context, projects, and memory to sharpen your next move or create a new project from a rough request.',
  ),
];

const formatProjectDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(value));

const nowLabel = () =>
  new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(new Date());

const cleanSentence = (value: string, fallback: string) => {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (!clean) return fallback;
  return clean.length > 210 ? `${clean.slice(0, 207).trim()}...` : clean;
};

const normalizeUsername = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value.trim());
const getUserMetadataUsername = (user: User | null) => {
  const value = user?.user_metadata?.username;
  return typeof value === 'string' ? normalizeUsername(value) : '';
};

const buildSavedContext = (track: Track, intent: IntentDraft): SavedContext => {
  const trackCopy = TRACKS[track];
  const summary =
    track === 'founder'
      ? `The current founder signal is: ${cleanSentence(
          intent.headline,
          trackCopy.defaults.headline
        )} The Circle should keep focusing on the current workflow, decision owner, human review boundary, and proof-safe next move before tools are selected.`
      : `The current builder signal is: ${cleanSentence(
          intent.headline,
          trackCopy.defaults.headline
        )} The Circle should keep focusing on audience pain, first useful version, validation, and simple proof before building too much.`;

  return {
    track,
    savedAt: nowLabel(),
    intent,
    summary,
    questions:
      track === 'founder'
        ? [
            'Which workflow repeats often enough to deserve a system?',
            'Where does human judgment need to stay final?',
            'What proof can be shown without claiming unverified outcomes?',
          ]
        : [
            'Who has the painful moment most clearly right now?',
            'What is the smallest useful version that can be tested?',
            'What evidence would make this idea worth continuing?',
          ],
    actions:
      track === 'founder'
        ? [
            'Map one workflow into human-led, AI-assisted, reviewed, and automated steps.',
            'Turn the strongest blocker into one focused community question.',
            'Generate a Clarity Brief before publishing content or choosing tools.',
          ]
        : [
            'Choose one audience and one painful moment for the first experiment.',
            'Save two more rough notes so the context layer can compare patterns.',
            'Turn the idea into a short validation prompt before building.',
          ],
  };
};

const savedContextFromProject = (project: ClarityCircleProject): SavedContext => ({
  track: project.track,
  savedAt: nowLabel(),
  intent: {
    headline: project.title,
    context: project.project_instruction || project.context,
    audience: project.audience ?? '',
    blocker: project.blocker ?? '',
    outcome: project.outcome ?? '',
  },
  summary: project.summary ?? buildSavedContext(project.track, TRACKS[project.track].defaults).summary,
  questions: project.questions,
  actions: project.actions,
});

export function ClarityCircle() {
  const [step, setStep] = useState<StepId>('entry');
  const [track, setTrack] = useState<Track>('founder');
  const [intent, setIntent] = useState<IntentDraft>(TRACKS.founder.defaults);
  const [savedContext, setSavedContext] = useState<SavedContext | null>(null);
  const [activeMenu, setActiveMenu] = useState<MenuId>('start');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [sessionMode, setSessionMode] = useState<SessionMode>('signup');
  const [authView, setAuthView] = useState<AuthView>('signup-email');
  const [status, setStatus] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [authLogin, setAuthLogin] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authProfile, setAuthProfile] = useState<ClarityCircleProfile | null>(null);
  const [isAuthBusy, setIsAuthBusy] = useState(false);
  const [isSavingContext, setIsSavingContext] = useState(false);
  const [projects, setProjects] = useState<ClarityCircleProject[]>([]);
  const [projectFolders, setProjectFolders] = useState<ClarityCircleProjectFolder[]>([]);
  const [projectTasks, setProjectTasks] = useState<ClarityCircleProjectTask[]>([]);
  const [contextEntries, setContextEntries] = useState<ClarityCircleContextEntry[]>([]);
  const [activeProjectFolder, setActiveProjectFolder] = useState<ProjectFolderFilter>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectSearch, setProjectSearch] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectBrief, setProjectBrief] = useState('');
  const [projectInstructionDraft, setProjectInstructionDraft] = useState<string | null>(null);
  const [manualTaskTitle, setManualTaskTitle] = useState('');
  const [projectAssistantInput, setProjectAssistantInput] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantMessages, setAssistantMessages] = useState<UiAssistantMessage[]>(INITIAL_ASSISTANT_MESSAGES);
  const [assistantMemories, setAssistantMemories] = useState<ClarityCircleAssistantMemory[]>([]);
  const [isAssistantBusy, setIsAssistantBusy] = useState(false);
  const [isProjectAssistantBusy, setIsProjectAssistantBusy] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [isSavingProjectInstruction, setIsSavingProjectInstruction] = useState(false);
  const assistantInputRef = useRef<HTMLTextAreaElement | null>(null);
  const projectAssistantInputRef = useRef<HTMLTextAreaElement | null>(null);

  const resizeAssistantInput = useCallback((input: HTMLTextAreaElement) => {
    input.style.height = `${ASSISTANT_INPUT_MIN_HEIGHT}px`;
    if (!input.value) {
      input.style.overflowY = 'hidden';
      return;
    }
    const nextHeight = Math.min(Math.max(input.scrollHeight, ASSISTANT_INPUT_MIN_HEIGHT), ASSISTANT_INPUT_MAX_HEIGHT);
    input.style.height = `${nextHeight}px`;
    input.style.overflowY = input.scrollHeight > ASSISTANT_INPUT_MAX_HEIGHT ? 'auto' : 'hidden';
  }, []);

  useEffect(() => {
    if (assistantInputRef.current) {
      resizeAssistantInput(assistantInputRef.current);
    }
  }, [assistantInput, resizeAssistantInput]);

  useEffect(() => {
    if (projectAssistantInputRef.current) {
      resizeAssistantInput(projectAssistantInputRef.current);
    }
  }, [projectAssistantInput, resizeAssistantInput]);

  const upsertProfile = useCallback(async (user: User, username: string, options?: { quiet?: boolean }) => {
    const supabase = getClarityCircleSupabase();
    if (!supabase) return null;

    const normalizedUsername = normalizeUsername(username);
    const { data, error } = await supabase
      .schema('clarity_circle')
      .from('profiles')
      .upsert(
        {
          user_id: user.id,
          email: user.email ?? null,
          username: normalizedUsername,
        },
        { onConflict: 'user_id' }
      )
      .select('*')
      .single();

    if (error) {
      if (!options?.quiet) {
        setStatus(error.code === '23505' ? 'That username is already taken.' : error.message);
      }
      return null;
    }

    setAuthProfile(data);
    return data;
  }, []);

  const loadProfile = useCallback(async (user: User) => {
    const supabase = getClarityCircleSupabase();
    if (!supabase) return null;

    const fallbackUsername = getUserMetadataUsername(user);
    const fallbackProfile: ClarityCircleProfile | null =
      fallbackUsername || user.email
        ? {
            user_id: user.id,
            email: user.email ?? null,
            username: fallbackUsername || null,
            full_name: null,
            preferred_track: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        : null;

    const { data, error } = await supabase
      .schema('clarity_circle')
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      setAuthProfile(fallbackProfile);
      return fallbackProfile;
    }

    if (data) {
      setAuthProfile(data);
      return data;
    }

    if (fallbackUsername) {
      const repairedProfile = await upsertProfile(user, fallbackUsername, { quiet: true });
      if (repairedProfile) return repairedProfile;
    }

    setAuthProfile(fallbackProfile);
    return fallbackProfile;
  }, [upsertProfile]);

  const refreshWorkspace = useCallback(async (user: User, options?: { quiet?: boolean }) => {
    const supabase = getClarityCircleSupabase();
    if (!supabase) return null;

    const [projectResult, folderResult, taskResult, entryResult, messageResult, memoryResult] = await Promise.all([
      supabase
        .schema('clarity_circle')
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('updated_at', { ascending: false })
        .limit(120),
      supabase
        .schema('clarity_circle')
        .from('project_folders')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('sort_order', { ascending: true })
        .order('updated_at', { ascending: false })
        .limit(60),
      supabase
        .schema('clarity_circle')
        .from('project_tasks')
        .select('*')
        .eq('user_id', user.id)
        .neq('status', 'archived')
        .order('sort_order', { ascending: true })
        .order('updated_at', { ascending: false })
        .limit(240),
      supabase
        .schema('clarity_circle')
        .from('context_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(120),
      supabase
        .schema('clarity_circle')
        .from('assistant_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(30),
      supabase
        .schema('clarity_circle')
        .from('assistant_memories')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('updated_at', { ascending: false })
        .limit(20),
    ]);

    if (projectResult.error) {
      if (!options?.quiet) setStatus('Saved projects could not be loaded.');
      return null;
    }

    if (folderResult.error && !options?.quiet) {
      setStatus('Saved folders could not be loaded.');
    }

    if (taskResult.error && !options?.quiet) {
      setStatus('Project tasks could not be loaded. The latest migration may need to be applied.');
    }

    const nextProjects = projectResult.data ?? [];
    const nextFolders = folderResult.error ? [] : folderResult.data ?? [];
    const nextTasks = taskResult.error ? [] : taskResult.data ?? [];
    const nextEntries = entryResult.error ? [] : entryResult.data ?? [];
    const nextMessages =
      !messageResult.error && messageResult.data?.length
        ? messageResult.data.map((message) => ({
            id: message.id,
            role: message.role,
            content: message.content,
            createdAt: message.created_at,
            project_id: message.project_id,
          }))
        : INITIAL_ASSISTANT_MESSAGES;
    const nextMemories = memoryResult.error ? [] : memoryResult.data ?? [];

    setProjects(nextProjects);
    if (!folderResult.error) {
      setProjectFolders(nextFolders);
    }
    if (!taskResult.error) {
      setProjectTasks(nextTasks);
    }
    setContextEntries(nextEntries);
    setAssistantMessages(nextMessages);
    setAssistantMemories(nextMemories);
    setSelectedProjectId((current) => {
      if (current && nextProjects.some((project) => project.id === current)) return current;
      return nextProjects[0]?.id ?? null;
    });

    return {
      projects: nextProjects,
      folders: nextFolders,
      tasks: nextTasks,
      contextEntries: nextEntries,
      messages: nextMessages,
      memories: nextMemories,
    } satisfies WorkspaceSnapshot;
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as Partial<{
            step: StepId;
            track: Track;
            intent: IntentDraft;
            savedContext: SavedContext | null;
            sessionMode: SessionMode;
            activeMenu: MenuId;
            assistantMessages: UiAssistantMessage[];
            assistantMemories: ClarityCircleAssistantMemory[];
            projectFolders: ClarityCircleProjectFolder[];
            activeProjectFolder: ProjectFolderFilter;
            selectedProjectId: string | null;
            projectSearch: string;
          }>;

          if (parsed.track && TRACKS[parsed.track]) setTrack(parsed.track);
          if (parsed.intent) setIntent(parsed.intent);
          if (parsed.savedContext) setSavedContext(parsed.savedContext);
          if (parsed.sessionMode) setSessionMode(parsed.sessionMode);
          if (parsed.activeMenu && MENU_ITEMS.some((item) => item.id === parsed.activeMenu)) {
            setActiveMenu(parsed.activeMenu);
          }
          if (Array.isArray(parsed.assistantMessages) && parsed.assistantMessages.length > 0) {
            setAssistantMessages(parsed.assistantMessages.slice(-12));
          }
          if (Array.isArray(parsed.assistantMemories)) {
            setAssistantMemories(parsed.assistantMemories.slice(0, 10));
          }
          if (Array.isArray(parsed.projectFolders)) {
            setProjectFolders(parsed.projectFolders.slice(0, 24));
          }
          if (typeof parsed.activeProjectFolder === 'string') {
            setActiveProjectFolder(parsed.activeProjectFolder);
          }
          if (typeof parsed.selectedProjectId === 'string' || parsed.selectedProjectId === null) {
            setSelectedProjectId(parsed.selectedProjectId);
          }
          if (typeof parsed.projectSearch === 'string') {
            setProjectSearch(parsed.projectSearch);
          }
          if (parsed.step && STEPS.some((item) => item.id === parsed.step)) setStep(parsed.step);
        }
      } catch {
        setStatus('This session starts fresh.');
      } finally {
        setHasLoaded(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    if (authUser) {
      clearCircleLocalStorage();
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        step,
        track,
        intent,
        savedContext,
        sessionMode,
        activeMenu,
        assistantMessages: assistantMessages.slice(-12),
        assistantMemories: assistantMemories.slice(0, 10),
        projectFolders: projectFolders.slice(0, 24),
        activeProjectFolder,
        selectedProjectId,
        projectSearch,
      }),
    );
  }, [
    activeMenu,
    activeProjectFolder,
    assistantMemories,
    assistantMessages,
    authUser,
    hasLoaded,
    intent,
    projectFolders,
    projectSearch,
    savedContext,
    selectedProjectId,
    sessionMode,
    step,
    track,
  ]);

  useEffect(() => {
    const supabase = getClarityCircleSupabase();
    if (!supabase) return;

    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      const user = data.session?.user ?? null;
      setAuthUser(user);
      if (user && step === 'entry') {
        clearCircleLocalStorage();
        void loadProfile(user);
        setStep('track');
        setActiveMenu('path');
        setStatus('Welcome back.');
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setAuthUser(user);
      if (user) {
        clearCircleLocalStorage();
        void loadProfile(user);
        setStep((current) => {
          if (current === 'entry') {
            setActiveMenu('path');
            return 'track';
          }
          return current;
        });
        setStatus('Welcome back.');
      } else {
        setAuthProfile(null);
        setProjects([]);
        setProjectFolders([]);
      }
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, [loadProfile, step]);

  useEffect(() => {
    const supabase = getClarityCircleSupabase();
    if (!supabase || !authUser) return;

    let isMounted = true;

    const initialRefresh = window.setTimeout(() => {
      if (!isMounted) return;
      void refreshWorkspace(authUser);
    }, 0);

    return () => {
      isMounted = false;
      window.clearTimeout(initialRefresh);
    };
  }, [authUser, refreshWorkspace]);

  useEffect(() => {
    const supabase = getClarityCircleSupabase();
    if (!supabase || !authUser) return;

    let refreshTimer: number | null = null;
    const queueRefresh = () => {
      if (refreshTimer) window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        void refreshWorkspace(authUser, { quiet: true });
      }, 180);
    };

    const channel = supabase
      .channel(`clarity-circle-workspace-${authUser.id}`)
      .on('postgres_changes', { event: '*', schema: 'clarity_circle', table: 'projects', filter: `user_id=eq.${authUser.id}` }, queueRefresh)
      .on(
        'postgres_changes',
        { event: '*', schema: 'clarity_circle', table: 'project_folders', filter: `user_id=eq.${authUser.id}` },
        queueRefresh,
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'clarity_circle', table: 'project_tasks', filter: `user_id=eq.${authUser.id}` },
        queueRefresh,
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'clarity_circle', table: 'context_entries', filter: `user_id=eq.${authUser.id}` },
        queueRefresh,
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'clarity_circle', table: 'assistant_messages', filter: `user_id=eq.${authUser.id}` },
        queueRefresh,
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'clarity_circle', table: 'assistant_memories', filter: `user_id=eq.${authUser.id}` },
        queueRefresh,
      )
      .subscribe();

    return () => {
      if (refreshTimer) window.clearTimeout(refreshTimer);
      void supabase.removeChannel(channel);
    };
  }, [authUser, refreshWorkspace]);

  const selectedTrack = TRACKS[track];
  const metadataUsername = getUserMetadataUsername(authUser);
  const displayUsername = authProfile?.username || metadataUsername;
  const displayEmail = authUser?.email ?? authProfile?.email ?? '';

  const continueSignupWithEmail = () => {
    const supabase = getClarityCircleSupabase();
    if (!supabase) {
      setStatus('Account connection is not available. Please refresh and try again.');
      return;
    }

    if (!isEmail(authEmail)) {
      setStatus('Enter a valid email address to create your account.');
      return;
    }

    setSessionMode('signup');
    setAuthView('signup-credentials');
    setStatus('Create your username and password.');
  };

  const createAccount = async () => {
    const supabase = getClarityCircleSupabase();
    if (!supabase) {
      setStatus('Account connection is not available. Please refresh and try again.');
      return;
    }

    const email = authEmail.trim();
    const username = normalizeUsername(authUsername);
    const password = authPassword.trim();

    if (!isEmail(email)) {
      setAuthView('signup-email');
      setStatus('Enter a valid email address first.');
      return;
    }

    if (!/^[a-z0-9_]{3,24}$/.test(username)) {
      setStatus('Choose a username using 3-24 lowercase letters, numbers, or underscores.');
      return;
    }

    if (password.length < 8) {
      setStatus('Use a password with at least 8 characters.');
      return;
    }

    setIsAuthBusy(true);
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: `${window.location.origin}/clarity-circle`,
      },
    });
    setIsAuthBusy(false);

    if (result.error) {
      setStatus(result.error.message);
      return;
    }

    const user = result.data.user ?? result.data.session?.user ?? null;
    if (user && result.data.session) {
      const profile = await upsertProfile(user, username);
      if (!profile) return;
      clearCircleLocalStorage();
      setAuthUser(user);
      setAuthLogin(username);
      setStep('track');
      setActiveMenu('path');
      setStatus(`Account created. Signed in as ${username}.`);
      return;
    }

    const retry = await supabase.auth.signInWithPassword({ email, password });

    if (retry.error) {
      const message = retry.error.message.toLowerCase();
      if (message.includes('confirm')) {
        setStatus('Account created. Email confirmation is still required before first sign-in.');
        return;
      }

      setStatus('Account could not be opened yet. If this email already exists, use the Sign in tab.');
      return;
    }

    const retryUser = retry.data.user;
    const profile = await upsertProfile(retryUser, username);
    if (!profile) return;

    clearCircleLocalStorage();
    setAuthUser(retryUser);
    setAuthLogin(username);
    setStep('track');
    setActiveMenu('path');
    setStatus(`Signed in as ${username}.`);
  };

  const signIn = async () => {
    const supabase = getClarityCircleSupabase();
    if (!supabase) {
      setStatus('Account connection is not available. Please refresh and try again.');
      return;
    }

    const login = authLogin.trim();
    const password = authPassword.trim();

    if (!login || !password) {
      setStatus('Enter your username and password.');
      return;
    }

    setIsAuthBusy(true);
    let email = login;

    if (!isEmail(login)) {
      const { data, error } = await supabase.schema('clarity_circle').rpc('resolve_login_email', {
        login,
      });

      if (error) {
        setIsAuthBusy(false);
        setStatus('Username sign-in is not available yet. The latest database migration may need to be applied.');
        return;
      }

      if (!data) {
        setIsAuthBusy(false);
        setStatus('No account found for that username.');
        return;
      }

      email = data;
    }

    const result = await supabase.auth.signInWithPassword({ email, password });
    setIsAuthBusy(false);

    if (result.error) {
      setStatus(result.error.message);
      return;
    }

    const user = result.data.user;
    clearCircleLocalStorage();
    setAuthUser(user);
    const profile = await loadProfile(user);
    setStep('track');
    setActiveMenu('path');
    setStatus(`Signed in${profile?.username ? ` as ${profile.username}` : ''}.`);
  };

  const signOut = async () => {
    const supabase = getClarityCircleSupabase();
    if (!supabase) return;

    await supabase.auth.signOut();
    setAuthUser(null);
    setAuthProfile(null);
    setProjects([]);
    setProjectFolders([]);
    setProjectTasks([]);
    setActiveProjectFolder('all');
    setSelectedProjectId(null);
    setProjectSearch('');
    setIsCreatingProject(false);
    setProjectBrief('');
    setProjectInstructionDraft(null);
    setManualTaskTitle('');
    setProjectAssistantInput('');
    setAssistantMessages(INITIAL_ASSISTANT_MESSAGES);
    setAssistantMemories([]);
    setAuthView('signin');
    setActiveMenu('start');
    setStep('entry');
    setStatus('Signed out.');
  };

  const getFolderName = (folderId: string | null | undefined) => {
    if (!folderId) return 'Unfiled';
    return projectFolders.find((folder) => folder.id === folderId)?.name ?? 'Folder';
  };

  const filteredProjects = projects.filter((project) => {
    const search = projectSearch.trim().toLowerCase();
    const matchesFolder =
      activeProjectFolder === 'all' ||
      (activeProjectFolder === 'unfiled' ? !project.folder_id : project.folder_id === activeProjectFolder);
    const matchesSearch =
      !search ||
      [project.title, project.context, project.audience, project.blocker, project.outcome]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search));

    return matchesFolder && matchesSearch;
  });

  const selectedProject =
    filteredProjects.find((project) => project.id === selectedProjectId) || filteredProjects[0] || null;
  const selectedProjectTasks = selectedProject
    ? projectTasks
        .filter((task) => task.project_id === selectedProject.id && task.status !== 'archived')
        .sort((left, right) => left.sort_order - right.sort_order || new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime())
    : [];
  const circleAssistantMessages = assistantMessages.filter((message) => !message.project_id);
  const selectedProjectMessages = selectedProject
    ? assistantMessages.filter((message) => message.project_id === selectedProject.id).slice(-12)
    : [];
  const selectedProjectInstruction = selectedProject?.project_instruction || selectedProject?.context || '';

  const recentProjects = [...projects]
    .sort((left, right) => new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime())
    .slice(0, 3);
  const latestProject = recentProjects[0] ?? null;
  const latestMemory = assistantMemories[0] ?? null;
  const activeSignal = savedContext?.intent.headline || latestProject?.title || intent.headline;
  const activeSignalSummary =
    savedContext?.summary || latestProject?.summary || latestProject?.context || intent.context || 'Save a first signal to build the Circle context.';
  const homeStats = [
    { label: 'Projects', value: projects.length, icon: FolderOpen },
    { label: 'Folders', value: projectFolders.length, icon: Folder },
    { label: 'Memories', value: assistantMemories.length, icon: Database },
    { label: 'Context notes', value: contextEntries.length, icon: FileText },
  ];
  const journeySteps = [
    { label: 'Signal', detail: savedContext || latestProject ? 'Captured' : 'Awaiting input', active: Boolean(savedContext || latestProject) },
    { label: 'Project', detail: projects.length > 0 ? `${projects.length} saved` : 'Not started', active: projects.length > 0 },
    { label: 'Memory', detail: assistantMemories.length > 0 ? 'Assistant aware' : 'Ready to learn', active: assistantMemories.length > 0 },
    { label: 'Digest', detail: 'Mock preview', active: false },
  ];

  const folderProjectCount = (folderId: ProjectFolderFilter) =>
    projects.filter((project) => {
      if (folderId === 'all') return true;
      if (folderId === 'unfiled') return !project.folder_id;
      return project.folder_id === folderId;
    }).length;

  const buildProjectInstruction = (draft: IntentDraft | AssistantProjectDraft | string) => {
    if (typeof draft === 'string') {
      return cleanSentence(draft, 'Use this project context to keep outputs focused, practical, and reviewable.');
    }

    const title = 'headline' in draft ? draft.headline : draft.title;
    return [
      `Project: ${cleanSentence(title, 'New clarity project')}`,
      `Context: ${cleanSentence(draft.context, 'The project context is still being clarified.')}`,
      draft.audience ? `Audience: ${cleanSentence(draft.audience, 'Not stated')}` : '',
      draft.blocker ? `Current blocker: ${cleanSentence(draft.blocker, 'Not stated')}` : '',
      draft.outcome ? `Desired outcome: ${cleanSentence(draft.outcome, 'Not stated')}` : '',
      'Operating rule: answer from this project context first, keep recommendations practical, separate human-led from AI-assisted work, and avoid unsupported claims.',
    ]
      .filter(Boolean)
      .join('\n');
  };

  const buildAutoTasks = (project: Pick<ClarityCircleProject, 'id' | 'track' | 'title' | 'context' | 'project_instruction'>) => {
    const instruction = project.project_instruction || project.context;
    return [
      {
        title: 'Clarify the project brief',
        detail: cleanSentence(instruction, 'Review the project context and tighten the first decision.'),
      },
      project.track === 'founder'
        ? {
            title: 'Map the workflow boundary',
            detail: 'Separate what should stay human-led, what can be AI-assisted, and what needs review before automation.',
          }
        : {
            title: 'Choose the first validation move',
            detail: 'Define the smallest test that proves whether the idea deserves more build time.',
          },
      {
        title: 'Ask the project assistant for the next pass',
        detail: 'Use the scoped assistant thread so future outputs stay tied to this project instruction.',
      },
    ];
  };

  const insertProjectTasks = async (
    project: ClarityCircleProject,
    taskDrafts: Array<{ title: string; detail?: string | null }>,
    source: ClarityCircleProjectTask['source'],
  ) => {
    const supabase = getClarityCircleSupabase();
    if (!supabase || !authUser || taskDrafts.length === 0) return [];

    const existingCount = projectTasks.filter((task) => task.project_id === project.id).length;
    const rows = taskDrafts.slice(0, 8).map((task, index) => ({
      project_id: project.id,
      user_id: authUser.id,
      title: cleanSentence(task.title, 'New task').slice(0, 160),
      detail: task.detail ? cleanSentence(task.detail, '') : null,
      source,
      sort_order: existingCount + index,
    }));

    const { data, error } = await supabase.schema('clarity_circle').from('project_tasks').insert(rows).select('*');

    if (error || !data) {
      setStatus('Tasks could not be saved. The project task migration may need to be applied.');
      return [];
    }

    setProjectTasks((current) => [...current, ...data]);
    return data;
  };

  const openNewProjectFlow = (prefill = '') => {
    setIsCreatingProject(true);
    setProjectBrief(prefill || savedContext?.intent.context || '');
    setProjectInstructionDraft(null);
    setSelectedProjectId(null);
    setActiveMenu('projects');
    setStatus('Describe what the project is about.');
  };

  const createProjectFolder = async (folderName = newFolderName, options?: { source?: 'assistant' | 'user' }) => {
    const name = cleanSentence(folderName, '').slice(0, 80);
    if (!name) {
      setStatus('Name the folder first.');
      return null;
    }

    const supabase = getClarityCircleSupabase();
    if (!authUser) {
      setStatus('Sign in before creating folders.');
      openMenu('start');
      return null;
    }
    if (!supabase) {
      setStatus('Folder could not be saved to your account.');
      return null;
    }

    const { data, error } = await supabase
      .schema('clarity_circle')
      .from('project_folders')
      .insert({
        user_id: authUser.id,
        name,
        sort_order: projectFolders.length,
      })
      .select('*')
      .single();

    if (error || !data) {
      setStatus(error?.code === '23505' ? 'A folder with this name already exists.' : 'Folder could not be saved to your account.');
      return null;
    }

    setProjectFolders((current) => [...current, data]);
    setActiveProjectFolder(data.id);
    setNewFolderName('');
    setIsCreatingFolder(false);
    setStatus(options?.source === 'assistant' ? 'Assistant folder created.' : 'Folder created.');
    void refreshWorkspace(authUser, { quiet: true });
    return data;
  };

  const moveProjectToFolder = async (project: ClarityCircleProject, folderId: string | null) => {
    setProjects((current) =>
      current.map((item) => (item.id === project.id ? { ...item, folder_id: folderId, updated_at: new Date().toISOString() } : item)),
    );
    setStatus(folderId ? `Moved to ${getFolderName(folderId)}.` : 'Moved to Unfiled.');

    const supabase = getClarityCircleSupabase();
    if (!supabase || !authUser || project.id.startsWith('local-project-')) return;

    const { error } = await supabase
      .schema('clarity_circle')
      .from('projects')
      .update({ folder_id: folderId })
      .eq('id', project.id);

    if (error) {
      setStatus('Project move could not be saved.');
      void refreshWorkspace(authUser, { quiet: true });
      return;
    }

    void refreshWorkspace(authUser, { quiet: true });
  };

  const createProjectFromBrief = async () => {
    const brief = projectBrief.trim();
    if (!brief) {
      setStatus('Add what this project is about first.');
      return null;
    }

    const supabase = getClarityCircleSupabase();
    if (!authUser) {
      setStatus('Sign in before creating projects.');
      openMenu('start');
      return null;
    }
    if (!supabase) {
      setStatus('Project could not be saved to your account.');
      return null;
    }

    const projectTitle = cleanSentence(brief.split(/[.!?\n]/)[0] || brief, 'New clarity project').slice(0, 110);
    const projectIntent: IntentDraft = {
      headline: projectTitle,
      context: brief,
      audience: '',
      blocker: 'The project needs a clearer first operating path.',
      outcome: 'A focused project plan with useful tasks and project-specific assistant context.',
    };
    const context = buildSavedContext(track, projectIntent);
    const projectInstruction = buildProjectInstruction(projectIntent);

    setIsSavingProject(true);
    const { data: project, error } = await supabase
      .schema('clarity_circle')
      .from('projects')
      .insert({
        user_id: authUser.id,
        track,
        title: projectTitle,
        context: brief,
        project_instruction: projectInstruction,
        blocker: projectIntent.blocker,
        outcome: projectIntent.outcome,
        summary: context.summary,
        questions: context.questions,
        actions: context.actions,
      })
      .select('*')
      .single();

    if (error || !project) {
      setIsSavingProject(false);
      setStatus('Project could not be saved to your account.');
      return null;
    }

    await supabase.schema('clarity_circle').from('context_entries').insert({
      project_id: project.id,
      user_id: authUser.id,
      entry_type: 'note',
      payload: {
        source: 'manual_project_brief',
        title: project.title,
        project_instruction: project.project_instruction,
        context: project.context,
      },
    });

    setProjects((current) => [project, ...current.filter((item) => item.id !== project.id)].slice(0, 80));
    setSelectedProjectId(project.id);
    setProjectBrief('');
    setProjectInstructionDraft(project.project_instruction || project.context);
    setIsCreatingProject(false);
    setIsSavingProject(false);
    await insertProjectTasks(project, buildAutoTasks(project), 'auto');
    setStatus('Project created with starting tasks.');
    void refreshWorkspace(authUser, { quiet: true });
    return project;
  };

  const saveAssistantMessage = async (message: UiAssistantMessage, projectId?: string | null) => {
    const supabase = getClarityCircleSupabase();
    if (!supabase || !authUser) return;

    await supabase.schema('clarity_circle').from('assistant_messages').insert({
      user_id: authUser.id,
      project_id: projectId ?? null,
      role: message.role,
      content: message.content,
      metadata: { created_at: message.createdAt },
    });
  };

  const createManualTask = async () => {
    if (!selectedProject) return null;
    const title = manualTaskTitle.trim();
    if (!title) {
      setStatus('Name the task first.');
      return null;
    }

    const tasks = await insertProjectTasks(selectedProject, [{ title }], 'user');
    if (tasks.length > 0) {
      setManualTaskTitle('');
      setStatus('Task added.');
    }
    return tasks[0] ?? null;
  };

  const toggleProjectTask = async (task: ClarityCircleProjectTask) => {
    const nextStatus: ClarityCircleProjectTask['status'] = task.status === 'done' ? 'open' : 'done';
    setProjectTasks((current) =>
      current.map((item) => (item.id === task.id ? { ...item, status: nextStatus, updated_at: new Date().toISOString() } : item)),
    );

    const supabase = getClarityCircleSupabase();
    if (!supabase || !authUser) return;

    const { error } = await supabase
      .schema('clarity_circle')
      .from('project_tasks')
      .update({ status: nextStatus })
      .eq('id', task.id);

    if (error) {
      setStatus('Task status could not be saved.');
      void refreshWorkspace(authUser, { quiet: true });
    }
  };

  const saveProjectInstruction = async (project: ClarityCircleProject) => {
    const instruction = (projectInstructionDraft ?? selectedProjectInstruction).trim();
    if (!instruction) {
      setStatus('Add a project instruction first.');
      return;
    }

    setIsSavingProjectInstruction(true);
    setProjects((current) =>
      current.map((item) =>
        item.id === project.id ? { ...item, project_instruction: instruction, updated_at: new Date().toISOString() } : item,
      ),
    );

    const supabase = getClarityCircleSupabase();
    if (!supabase || !authUser) {
      setIsSavingProjectInstruction(false);
      return;
    }

    const { error } = await supabase
      .schema('clarity_circle')
      .from('projects')
      .update({ project_instruction: instruction })
      .eq('id', project.id);

    setIsSavingProjectInstruction(false);

    if (error) {
      setStatus('Project instruction could not be saved.');
      void refreshWorkspace(authUser, { quiet: true });
      return;
    }

    setStatus('Project instruction saved.');
    void refreshWorkspace(authUser, { quiet: true });
  };

  const saveAssistantMemory = async (draft: AssistantMemoryDraft, projectId?: string | null) => {
    const supabase = getClarityCircleSupabase();
    if (!authUser) {
      setStatus('Sign in before saving assistant memory.');
      openMenu('start');
      return null;
    }
    if (!supabase) {
      setStatus('Assistant memory could not be saved to your account.');
      return null;
    }

    const memoryTitle = cleanSentence(draft.title, 'Circle memory');
    const memoryContent = cleanSentence(draft.content, 'Saved assistant context');

    const { data, error } = await supabase
      .schema('clarity_circle')
      .from('assistant_memories')
      .insert({
        user_id: authUser.id,
        project_id: projectId ?? null,
        memory_type: draft.memory_type,
        title: memoryTitle,
        content: memoryContent,
        source: 'assistant',
      })
      .select('*')
      .single();

    if (error || !data) {
      setStatus('Assistant memory could not be saved to your account.');
      return null;
    }

    setAssistantMemories((current) => [data, ...current.filter((item) => item.id !== data.id)].slice(0, 12));
    void refreshWorkspace(authUser, { quiet: true });
    return data;
  };

  const createProjectFromAssistantDraft = async (draft: AssistantProjectDraft) => {
    const supabase = getClarityCircleSupabase();
    if (!authUser) {
      setStatus('Sign in before creating projects.');
      openMenu('start');
      return null;
    }
    if (!supabase) {
      setStatus('Project could not be saved to your account.');
      return null;
    }

    const projectIntent: IntentDraft = {
      headline: cleanSentence(draft.title, 'New clarity project'),
      context: cleanSentence(draft.context, 'A new project created from the Circle assistant.'),
      audience: draft.audience?.trim() || '',
      blocker: draft.blocker?.trim() || 'The first decision is still unclear.',
      outcome: draft.outcome?.trim() || 'A clearer next action.',
    };
    const context = buildSavedContext(draft.track, projectIntent);
    const projectInstruction = draft.projectInstruction?.trim() || buildProjectInstruction(projectIntent);

    setTrack(draft.track);
    setIntent(projectIntent);
    setSavedContext(context);
    setStep('context');

    const { data: project, error } = await supabase
      .schema('clarity_circle')
      .from('projects')
      .insert({
        user_id: authUser.id,
        track: draft.track,
        title: projectIntent.headline,
        context: projectIntent.context,
        project_instruction: projectInstruction,
        audience: projectIntent.audience || null,
        blocker: projectIntent.blocker || null,
        outcome: projectIntent.outcome || null,
        summary: context.summary,
        questions: context.questions,
        actions: context.actions,
      })
      .select('*')
      .single();

    if (error || !project) {
      setStatus('Project could not be saved to your account.');
      return null;
    }

    await supabase.schema('clarity_circle').from('context_entries').insert({
      project_id: project.id,
      user_id: authUser.id,
      entry_type: 'note',
      payload: {
        source: 'circle_assistant',
        title: project.title,
        project_instruction: project.project_instruction,
        context: project.context,
        audience: project.audience,
        blocker: project.blocker,
        outcome: project.outcome,
      },
    });

    setProjects((current) => [project, ...current.filter((item) => item.id !== project.id)].slice(0, 80));
    setSelectedProjectId(project.id);
    setProjectBrief(project.project_instruction || project.context);
    setProjectInstructionDraft(project.project_instruction || project.context);
    await insertProjectTasks(project, buildAutoTasks(project), 'auto');
    setStatus('Project created with assistant context and starting tasks.');
    void refreshWorkspace(authUser, { quiet: true });
    return project;
  };

  const archiveAssistantMemory = async (memory: ClarityCircleAssistantMemory) => {
    setAssistantMemories((current) => current.filter((item) => item.id !== memory.id));

    const supabase = getClarityCircleSupabase();
    if (!supabase || !authUser || memory.id.startsWith('local-memory-')) return;

    await supabase
      .schema('clarity_circle')
      .from('assistant_memories')
      .update({ status: 'archived' })
      .eq('id', memory.id);
  };

  const sendAssistantMessage = async () => {
    const prompt = assistantInput.trim();
    if (!prompt || isAssistantBusy) return;

    const userMessage = createUiMessage('user', prompt);
    const nextMessages = [...circleAssistantMessages, userMessage].slice(-12);

    setAssistantMessages((current) => [...current.filter((message) => message.project_id), ...nextMessages]);
    setAssistantInput('');
    setIsAssistantBusy(true);
    void saveAssistantMessage(userMessage);

    try {
      const liveWorkspace = authUser ? await refreshWorkspace(authUser, { quiet: true }) : null;
      const assistantProjects = liveWorkspace?.projects ?? projects;
      const assistantFolders = liveWorkspace?.folders ?? projectFolders;
      const assistantTasks = liveWorkspace?.tasks ?? projectTasks;
      const assistantEntries = liveWorkspace?.contextEntries ?? contextEntries;
      const assistantMemoriesForRequest = liveWorkspace?.memories ?? assistantMemories;

      const response = await fetch('/api/clarity-circle/assistant/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({ role: message.role, content: message.content })),
          track,
          savedContext: savedContext
            ? {
                track: savedContext.track,
                headline: savedContext.intent.headline,
                context: savedContext.intent.context,
                audience: savedContext.intent.audience,
                blocker: savedContext.intent.blocker,
                outcome: savedContext.intent.outcome,
                summary: savedContext.summary,
              }
            : null,
          projects: assistantProjects.map((project) => ({
            id: project.id,
            folder_id: project.folder_id,
            folderName: project.folder_id
              ? assistantFolders.find((folder) => folder.id === project.folder_id)?.name ?? 'Folder'
              : 'Unfiled',
            title: project.title,
            track: project.track,
            context: project.context,
            project_instruction: project.project_instruction,
            audience: project.audience,
            blocker: project.blocker,
            outcome: project.outcome,
            summary: project.summary,
            questions: project.questions,
            actions: project.actions,
          })),
          projectTasks: assistantTasks.map((task) => ({
            project_id: task.project_id,
            title: task.title,
            detail: task.detail,
            source: task.source,
            status: task.status,
          })),
          folders: assistantFolders.map((folder) => ({
            id: folder.id,
            name: folder.name,
          })),
          contextEntries: assistantEntries.map((entry) => ({
            project_id: entry.project_id,
            entry_type: entry.entry_type,
            payload: entry.payload,
            created_at: entry.created_at,
          })),
          selectedProjectId,
          memories: assistantMemoriesForRequest.map((memory) => ({
            title: memory.title,
            content: memory.content,
            memory_type: memory.memory_type,
          })),
        }),
      });

      const data = (await response.json()) as AssistantResponse;
      const reply = data.response || data.error || 'The Circle assistant could not respond yet.';
      const assistantMessage = createUiMessage('assistant', reply);

      setAssistantMessages((current) => [...current, assistantMessage].slice(-12));
      void saveAssistantMessage(assistantMessage);

      let projectId: string | null = null;
      if (data.projectDraft) {
        const project = await createProjectFromAssistantDraft(data.projectDraft);
        projectId = project?.id ?? null;
      }

      if (data.folderDraft) {
        await createProjectFolder(data.folderDraft.name, { source: 'assistant' });
      }

      if (data.taskDrafts?.length && selectedProject) {
        await insertProjectTasks(selectedProject, data.taskDrafts, 'assistant');
      }

      if (data.memoryDraft) {
        await saveAssistantMemory(data.memoryDraft, projectId);
      }
    } catch {
      const fallbackMessage = createUiMessage(
        'assistant',
        'I could not reach the Circle assistant just now. Your context is still available here, and you can try again.',
      );
      setAssistantMessages((current) => [...current, fallbackMessage].slice(-12));
    } finally {
      setIsAssistantBusy(false);
    }
  };

  const sendProjectAssistantMessage = async () => {
    if (!selectedProject) return;
    const prompt = projectAssistantInput.trim();
    if (!prompt || isProjectAssistantBusy) return;

    const userMessage = createUiMessage('user', prompt, selectedProject.id);
    const nextMessages = [...selectedProjectMessages, userMessage].slice(-12);

    setAssistantMessages((current) => [...current.filter((message) => message.project_id !== selectedProject.id), ...nextMessages]);
    setProjectAssistantInput('');
    setIsProjectAssistantBusy(true);
    void saveAssistantMessage(userMessage, selectedProject.id);

    try {
      const liveWorkspace = authUser ? await refreshWorkspace(authUser, { quiet: true }) : null;
      const assistantProjects = liveWorkspace?.projects ?? projects;
      const assistantFolders = liveWorkspace?.folders ?? projectFolders;
      const assistantTasks = liveWorkspace?.tasks ?? projectTasks;
      const assistantEntries = liveWorkspace?.contextEntries ?? contextEntries;
      const assistantMemoriesForRequest = liveWorkspace?.memories ?? assistantMemories;

      const response = await fetch('/api/clarity-circle/assistant/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({ role: message.role, content: message.content })),
          track: selectedProject.track,
          savedContext: {
            track: selectedProject.track,
            headline: selectedProject.title,
            context: selectedProject.project_instruction || selectedProject.context,
            audience: selectedProject.audience || '',
            blocker: selectedProject.blocker || '',
            outcome: selectedProject.outcome || '',
            summary: selectedProject.summary || selectedProject.context,
          },
          projects: assistantProjects.map((project) => ({
            id: project.id,
            folder_id: project.folder_id,
            folderName: project.folder_id
              ? assistantFolders.find((folder) => folder.id === project.folder_id)?.name ?? 'Folder'
              : 'Unfiled',
            title: project.title,
            track: project.track,
            context: project.context,
            project_instruction: project.project_instruction,
            audience: project.audience,
            blocker: project.blocker,
            outcome: project.outcome,
            summary: project.summary,
            questions: project.questions,
            actions: project.actions,
          })),
          projectTasks: assistantTasks.map((task) => ({
            project_id: task.project_id,
            title: task.title,
            detail: task.detail,
            source: task.source,
            status: task.status,
          })),
          folders: assistantFolders.map((folder) => ({
            id: folder.id,
            name: folder.name,
          })),
          contextEntries: assistantEntries.map((entry) => ({
            project_id: entry.project_id,
            entry_type: entry.entry_type,
            payload: entry.payload,
            created_at: entry.created_at,
          })),
          selectedProjectId: selectedProject.id,
          memories: assistantMemoriesForRequest
            .filter((memory) => !memory.project_id || memory.project_id === selectedProject.id)
            .map((memory) => ({
              title: memory.title,
              content: memory.content,
              memory_type: memory.memory_type,
            })),
        }),
      });

      const data = (await response.json()) as AssistantResponse;
      const reply = data.response || data.error || 'The project assistant could not respond yet.';
      const assistantMessage = createUiMessage('assistant', reply, selectedProject.id);

      setAssistantMessages((current) => [...current, assistantMessage].slice(-60));
      void saveAssistantMessage(assistantMessage, selectedProject.id);

      if (data.taskDrafts?.length) {
        await insertProjectTasks(selectedProject, data.taskDrafts, 'assistant');
      }

      if (data.memoryDraft) {
        await saveAssistantMemory(data.memoryDraft, selectedProject.id);
      }
    } catch {
      const fallbackMessage = createUiMessage(
        'assistant',
        'I could not reach the project assistant just now. The project instruction and tasks are still saved here.',
        selectedProject.id,
      );
      setAssistantMessages((current) => [...current, fallbackMessage].slice(-60));
    } finally {
      setIsProjectAssistantBusy(false);
    }
  };

  const chooseTrack = (nextTrack: Track) => {
    setTrack(nextTrack);
    setIntent(TRACKS[nextTrack].defaults);
    setStep('intent');
    setActiveMenu('context');
    setStatus(`${TRACKS[nextTrack].shortLabel} selected.`);
  };

  const saveIntent = async () => {
    if (!intent.headline.trim() || !intent.context.trim()) {
      setStatus('Add a short headline and enough context before saving this signal.');
      return;
    }

    const supabase = getClarityCircleSupabase();
    if (!authUser) {
      setStatus('Sign in before saving context.');
      openMenu('start');
      return;
    }
    if (!supabase) {
      setStatus('Context could not be saved to your account.');
      return;
    }

    const context = buildSavedContext(track, {
      headline: intent.headline.trim(),
      context: intent.context.trim(),
      audience: intent.audience.trim(),
      blocker: intent.blocker.trim(),
      outcome: intent.outcome.trim(),
    });
    const projectInstruction = buildProjectInstruction(context.intent);

    setSavedContext(context);
    setStep('context');
    setActiveMenu('context');

    setIsSavingContext(true);
    const { data: project, error: projectError } = await supabase
      .schema('clarity_circle')
      .from('projects')
      .insert({
        user_id: authUser.id,
        track,
        title: context.intent.headline,
        context: context.intent.context,
        project_instruction: projectInstruction,
        audience: context.intent.audience || null,
        blocker: context.intent.blocker || null,
        outcome: context.intent.outcome || null,
        summary: context.summary,
        questions: context.questions,
        actions: context.actions,
      })
      .select('*')
      .single();

    if (projectError || !project) {
      setIsSavingContext(false);
      setStatus('Context could not be saved to your account.');
      return;
    }

    await supabase.schema('clarity_circle').from('context_entries').insert({
      project_id: project.id,
      user_id: authUser.id,
      entry_type: 'intent',
      payload: {
        headline: context.intent.headline,
        project_instruction: projectInstruction,
        context: context.intent.context,
        audience: context.intent.audience,
        blocker: context.intent.blocker,
        outcome: context.intent.outcome,
        saved_at: context.savedAt,
      },
    });

    setProjects((current) => [project, ...current.filter((item) => item.id !== project.id)].slice(0, 80));
    setSelectedProjectId(project.id);
    setProjectBrief(project.project_instruction || project.context);
    setProjectInstructionDraft(project.project_instruction || project.context);
    await insertProjectTasks(project, buildAutoTasks(project), 'auto');
    setIsSavingContext(false);
    setStatus('Context saved with starting tasks.');
    void refreshWorkspace(authUser, { quiet: true });
  };

  const openProject = (project: ClarityCircleProject) => {
    setTrack(project.track);
    setIntent({
      headline: project.title,
      context: project.context,
      audience: project.audience ?? '',
      blocker: project.blocker ?? '',
      outcome: project.outcome ?? '',
    });
    setSavedContext(savedContextFromProject(project));
    setStep('context');
    setActiveMenu('context');
    setProjectBrief(project.project_instruction || project.context);
    setProjectInstructionDraft(project.project_instruction || project.context);
    setStatus('Project loaded.');
  };

  const refineAgain = () => {
    setStep('intent');
    setActiveMenu('context');
    setStatus('Refine the signal.');
  };

  const restart = () => {
    setStep('entry');
    setActiveMenu('start');
    setStatus('Started a fresh Clarity Circle sequence.');
  };

  const prepareEngineHandoff = () => {
    if (!savedContext) return;

    const handoff: EngineHandoff = {
      version: 1,
      createdAt: new Date().toISOString(),
      track: savedContext.track,
      trackLabel: TRACKS[savedContext.track].shortLabel,
      headline: savedContext.intent.headline,
      context: savedContext.intent.context,
      audience: savedContext.intent.audience,
      blocker: savedContext.intent.blocker,
      outcome: savedContext.intent.outcome,
      summary: savedContext.summary,
      questions: savedContext.questions,
      actions: savedContext.actions,
    };

    window.localStorage.setItem(ENGINE_HANDOFF_KEY, JSON.stringify(handoff));
    setStatus('Clarity Engine connection prepared with this private Circle context.');
  };

  const openMenu = (menuId: MenuId) => {
    setActiveMenu(menuId);
    if (menuId === 'start') setStep('entry');
    if (menuId === 'path') setStep('track');
    if (menuId === 'context' && step === 'entry') setStep(savedContext ? 'context' : 'intent');
  };

  return (
    <main className={`${styles.page} ${themeMode === 'light' ? styles.lightTheme : ''}`}>
      <section className={styles.shell} aria-label="Kramaniti Clarity Circle">
        <header
          className={styles.rail}
          style={{ backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' }}
          aria-label="Clarity Circle navigation"
        >
          <button
            type="button"
            className={`${styles.productLabel} ${activeMenu === 'home' ? styles.productLabelActive : ''}`}
            onClick={() => openMenu('home')}
            aria-label="Open Clarity Circle home"
            aria-pressed={activeMenu === 'home'}
          >
            <Image
              src="/assets/brand/clarity-circle-mark-gold.png"
              alt=""
              width={34}
              height={34}
              className={styles.productLogo}
              priority
            />
            <span>Clarity Circle</span>
          </button>

          <nav className={styles.menu} aria-label="Clarity Circle sections">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={activeMenu === item.id ? styles.menuActive : ''}
                  onClick={() => openMenu(item.id)}
                  aria-label={item.label}
                  aria-pressed={activeMenu === item.id}
                  title={item.label}
                >
                  <Icon size={16} aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className={styles.navUtilities} aria-label="Account and display controls">
            <button
              type="button"
              className={`${styles.navIconButton} ${activeMenu === 'profile' ? styles.navIconActive : ''}`}
              onClick={() => openMenu('profile')}
              aria-label="Open profile"
              aria-pressed={activeMenu === 'profile'}
              title="Profile"
            >
              <UserRound size={17} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={`${styles.navIconButton} ${activeMenu === 'settings' ? styles.navIconActive : ''}`}
              onClick={() => openMenu('settings')}
              aria-label="Open settings"
              aria-pressed={activeMenu === 'settings'}
              title="Settings"
            >
              <Settings size={17} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.navIconButton}
              onClick={() => setThemeMode((current) => (current === 'dark' ? 'light' : 'dark'))}
              aria-label={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={themeMode === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {themeMode === 'dark' ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
            </button>
          </div>
        </header>

        <section
          className={`${styles.stage} ${activeMenu === 'start' ? styles.entryStage : ''} ${
            activeMenu === 'assistant' ? styles.assistantStage : ''
          }`}
          aria-live="polite"
        >

          {activeMenu === 'home' && (
            <section className={`${styles.screen} ${styles.homeScreen}`} aria-labelledby="home-title">
              <div className={styles.homeHero}>
                <div>
                  <span>{selectedTrack.shortLabel}</span>
                  <h1 id="home-title">Clarity Circle Home</h1>
                  <p>{activeSignalSummary}</p>
                </div>
                <button type="button" className={styles.primaryButton} onClick={() => openMenu('assistant')}>
                  Open assistant
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
              </div>

              <div className={styles.homeStatsGrid} aria-label="Workspace summary">
                {homeStats.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.label} className={styles.homeStatCard}>
                      <Icon size={17} aria-hidden="true" />
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </article>
                  );
                })}
              </div>

              <div className={styles.homeBentoGrid}>
                <article className={`${styles.homePanel} ${styles.homePanelWide}`}>
                  <div className={styles.homePanelHeader}>
                    <span>Current signal</span>
                    <Activity size={17} aria-hidden="true" />
                  </div>
                  <h2>{activeSignal}</h2>
                  <p>{activeSignalSummary}</p>
                  <div className={styles.homePanelActions}>
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() => (latestProject && !savedContext ? openProject(latestProject) : openMenu('context'))}
                    >
                      Open context
                    </button>
                    <button type="button" className={styles.textButton} onClick={() => openMenu('path')}>
                      Start new
                    </button>
                  </div>
                </article>

                <article className={styles.homePanel}>
                  <div className={styles.homePanelHeader}>
                    <span>Projects</span>
                    <FolderOpen size={17} aria-hidden="true" />
                  </div>
                  <strong className={styles.homeLargeMetric}>{projects.length}</strong>
                  <p>{latestProject ? `Latest: ${latestProject.title}` : 'No project has been created yet.'}</p>
                  <button type="button" className={styles.textButton} onClick={() => openMenu('projects')}>
                    View projects
                  </button>
                </article>

                <article className={`${styles.homePanel} ${styles.homeJourneyPanel}`}>
                  <div className={styles.homePanelHeader}>
                    <span>Mock journey</span>
                    <Route size={17} aria-hidden="true" />
                  </div>
                  <div className={styles.homeJourneyTrack} aria-label="Mock journey progress">
                    {journeySteps.map((item) => (
                      <div key={item.label} className={item.active ? styles.homeJourneyActive : ''}>
                        <span />
                        <strong>{item.label}</strong>
                        <small>{item.detail}</small>
                      </div>
                    ))}
                  </div>
                </article>

                <article className={styles.homePanel}>
                  <div className={styles.homePanelHeader}>
                    <span>Memory</span>
                    <Database size={17} aria-hidden="true" />
                  </div>
                  <h2>{latestMemory?.title ?? 'No saved assistant memory yet'}</h2>
                  <p>{latestMemory?.content ?? 'Ask the assistant to remember a preference, decision boundary, or useful project signal.'}</p>
                  <button type="button" className={styles.textButton} onClick={() => openMenu('memory')}>
                    Manage memory
                  </button>
                </article>

                <article className={styles.homePanel}>
                  <div className={styles.homePanelHeader}>
                    <span>Proof-safe next move</span>
                    <ShieldCheck size={17} aria-hidden="true" />
                  </div>
                  <h2>{savedContext || latestProject ? 'Turn context into a brief' : 'Capture the first signal'}</h2>
                  <p>
                    {savedContext || latestProject
                      ? 'Use the saved context to shape a clearer brief, project route, or Clarity Engine handoff.'
                      : 'Choose a path and add the first business or idea signal before the assistant starts building context.'}
                  </p>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => {
                      if (latestProject && !savedContext) {
                        openProject(latestProject);
                        return;
                      }
                      openMenu(savedContext ? 'context' : 'path');
                    }}
                  >
                    Continue
                  </button>
                </article>

                <article className={`${styles.homePanel} ${styles.homePanelWide}`}>
                  <div className={styles.homePanelHeader}>
                    <span>Recent workspace</span>
                    <BarChart3 size={17} aria-hidden="true" />
                  </div>
                  <div className={styles.homeRecentList}>
                    {recentProjects.length > 0 ? (
                      recentProjects.map((project) => (
                        <button key={project.id} type="button" onClick={() => openProject(project)}>
                          <FileText size={16} aria-hidden="true" />
                          <span>
                            <strong>{project.title}</strong>
                            <small>{project.track === 'founder' ? 'Founder Track' : 'Builder Track'} - {formatProjectDate(project.updated_at)}</small>
                          </span>
                          <ChevronRight size={15} aria-hidden="true" />
                        </button>
                      ))
                    ) : (
                      <p>No recent projects yet. Save a context or ask the assistant to create one.</p>
                    )}
                  </div>
                </article>
              </div>
            </section>
          )}

          {activeMenu === 'start' && (
            <section className={`${styles.screen} ${styles.entryScreen}`} aria-labelledby="entry-title">
              <h1 id="entry-title">Kramaniti&apos;s Clarity Circle</h1>
              <p className={styles.lead}>
                A focused workspace for founders and builders to turn rough thinking into clearer next steps.
              </p>

              <div className={styles.authTabs} aria-label="Authentication mode">
                <button
                  type="button"
                  className={authView !== 'signin' ? styles.authTabActive : ''}
                  onClick={() => {
                    setSessionMode('signup');
                    setAuthView('signup-email');
                    setStatus('Enter your email to begin account creation.');
                  }}
                >
                  Create account
                </button>
                <button
                  type="button"
                  className={authView === 'signin' ? styles.authTabActive : ''}
                  onClick={() => {
                    setSessionMode('signin');
                    setAuthView('signin');
                    setStatus('Sign in with your username and password.');
                  }}
                >
                  Sign in
                </button>
              </div>

              <p className={styles.authStatus} aria-live="polite">
                {status ||
                  (authView === 'signin'
                    ? 'Enter your username and password to continue.'
                    : 'Create an account to save projects, tasks, and project assistant memory.')}
              </p>

              {authView === 'signup-email' && (
                <div className={styles.entryActions}>
                  <label className={styles.authField}>
                    <span>Email</span>
                    <input
                      type="email"
                      value={authEmail}
                      onChange={(event) => setAuthEmail(event.target.value)}
                      placeholder="you@company.com"
                      autoComplete="email"
                      disabled={Boolean(authUser) || isAuthBusy}
                    />
                  </label>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={continueSignupWithEmail}
                    disabled={isAuthBusy}
                  >
                    {isAuthBusy ? 'Checking...' : 'Continue'}
                    <ArrowRight size={17} aria-hidden="true" />
                  </button>
                </div>
              )}

              {authView === 'signup-credentials' && (
                <div className={styles.entryActions}>
                  <label className={styles.authField}>
                    <span>Email</span>
                    <input type="email" value={authEmail} readOnly />
                  </label>
                  <label className={styles.authField}>
                    <span>Username</span>
                    <input
                      value={authUsername}
                      onChange={(event) => setAuthUsername(normalizeUsername(event.target.value))}
                      placeholder="karan_builder"
                      autoComplete="username"
                      disabled={Boolean(authUser) || isAuthBusy}
                    />
                  </label>
                  <label className={styles.authField}>
                    <span>Password</span>
                    <input
                      type="password"
                      value={authPassword}
                      onChange={(event) => setAuthPassword(event.target.value)}
                      placeholder="Minimum 8 characters"
                      autoComplete="new-password"
                      disabled={Boolean(authUser) || isAuthBusy}
                    />
                  </label>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={() => void createAccount()}
                    disabled={isAuthBusy}
                  >
                    {isAuthBusy ? 'Creating...' : 'Create account'}
                    <ArrowRight size={17} aria-hidden="true" />
                  </button>
                  <button type="button" className={styles.textButton} onClick={() => setAuthView('signup-email')}>
                    Change email
                  </button>
                </div>
              )}

              {authView === 'signin' && (
                <div className={styles.entryActions}>
                  <label className={styles.authField}>
                    <span>Username</span>
                    <input
                      value={authLogin}
                      onChange={(event) => setAuthLogin(event.target.value)}
                      placeholder="your_username"
                      autoComplete="username"
                      disabled={Boolean(authUser) || isAuthBusy}
                    />
                  </label>
                  <label className={styles.authField}>
                    <span>Password</span>
                    <input
                      type="password"
                      value={authPassword}
                      onChange={(event) => setAuthPassword(event.target.value)}
                      placeholder="Your password"
                      autoComplete="current-password"
                      disabled={Boolean(authUser) || isAuthBusy}
                    />
                  </label>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={() => void signIn()}
                    disabled={isAuthBusy}
                  >
                    {isAuthBusy ? 'Signing in...' : 'Sign in'}
                    <ArrowRight size={17} aria-hidden="true" />
                  </button>
                </div>
              )}
            </section>
          )}

          {activeMenu === 'path' && (
            <section className={styles.screen} aria-label="Choose your path">
              <div className={styles.trackChoices}>
                {(Object.keys(TRACKS) as Track[]).map((key) => {
                  const item = TRACKS[key];
                  const Icon = item.icon;
                  return (
                    <button key={key} type="button" className={styles.trackChoice} onClick={() => chooseTrack(key)}>
                      <Icon size={22} aria-hidden="true" />
                      <span>{item.label}</span>
                      <small>{item.description}</small>
                      <ArrowRight size={17} aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {activeMenu === 'context' && step !== 'context' && (
            <section className={styles.screen} aria-label={track === 'founder' ? 'Capture the business signal' : 'Capture the idea signal'}>
              <div className={styles.intentForm}>
                <label>
                  One-line intent
                  <input
                    value={intent.headline}
                    onChange={(event) => setIntent((current) => ({ ...current, headline: event.target.value }))}
                    placeholder="What are you trying to clarify?"
                  />
                </label>
                <label>
                  Current context
                  <textarea
                    value={intent.context}
                    onChange={(event) => setIntent((current) => ({ ...current, context: event.target.value }))}
                    placeholder="Describe the business, idea, workflow, or starting confusion."
                  />
                </label>
                <div className={styles.formGrid}>
                  <label>
                    Audience
                    <input
                      value={intent.audience}
                      onChange={(event) => setIntent((current) => ({ ...current, audience: event.target.value }))}
                      placeholder="Who is this for?"
                    />
                  </label>
                  <label>
                    Current blocker
                    <input
                      value={intent.blocker}
                      onChange={(event) => setIntent((current) => ({ ...current, blocker: event.target.value }))}
                      placeholder="What is unclear right now?"
                    />
                  </label>
                  <label>
                    Desired outcome
                    <input
                      value={intent.outcome}
                      onChange={(event) => setIntent((current) => ({ ...current, outcome: event.target.value }))}
                      placeholder="What should become clearer?"
                    />
                  </label>
                </div>
              </div>

              <div className={styles.screenActions}>
                <button type="button" className={styles.secondaryButton} onClick={() => setStep('track')}>
                  Back
                </button>
                <button type="button" className={styles.primaryButton} onClick={saveIntent}>
                  {isSavingContext ? 'Saving...' : 'Save context'}
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
              </div>
            </section>
          )}

          {activeMenu === 'context' && step === 'context' && savedContext && (
            <section className={styles.screen} aria-label="Saved context">
              <div className={styles.contextPanel}>
                <div className={styles.contextHeader}>
                  <span>{selectedTrack.shortLabel}</span>
                  <small>Saved {savedContext.savedAt}</small>
                </div>
                <h2>{savedContext.intent.headline}</h2>
                <p>{savedContext.summary}</p>
              </div>

              <div className={styles.contextGrid}>
                <article>
                  <FileText size={17} aria-hidden="true" />
                  <h2>Next questions</h2>
                  <ul>
                    {savedContext.questions.map((question) => (
                      <li key={question}>{question}</li>
                    ))}
                  </ul>
                </article>
                <article>
                  <Compass size={17} aria-hidden="true" />
                  <h2>Suggested sequence</h2>
                  <ul>
                    {savedContext.actions.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                </article>
              </div>

              <div className={styles.screenActions}>
                <button type="button" className={styles.secondaryButton} onClick={refineAgain}>
                  <RefreshCw size={16} aria-hidden="true" />
                  Refine context
                </button>
                <Link href="/clarity-engine?from=clarity-circle" className={styles.primaryLink} onClick={prepareEngineHandoff}>
                  Continue in Clarity Engine
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
                <button type="button" className={styles.textButton} onClick={restart}>
                  Start again
                </button>
                {authUser && (
                  <button type="button" className={styles.textButton} onClick={() => void signOut()}>
                    <LogOut size={16} aria-hidden="true" />
                    Sign out
                  </button>
                )}
              </div>
            </section>
          )}

          {activeMenu === 'context' && step === 'context' && !savedContext && (
            <section className={styles.screen} aria-labelledby="context-empty-title">
              <h1 id="context-empty-title">No context yet.</h1>
              <div className={styles.screenActions}>
                <button type="button" className={styles.primaryButton} onClick={() => openMenu('path')}>
                  Choose path
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
              </div>
            </section>
          )}

          {activeMenu === 'assistant' && (
            <section className={`${styles.screen} ${styles.assistantScreen}`} aria-label="Circle Assistant">
              <div className={styles.assistantLayout}>
                <section className={styles.chatPanel} aria-label="Circle assistant conversation">
                  <div className={styles.chatMessages}>
                    {circleAssistantMessages.map((message) => (
                      <article
                        key={message.id}
                        className={message.role === 'assistant' ? styles.assistantBubble : styles.userBubble}
                      >
                        <span className={styles.chatAvatar} aria-label={message.role === 'assistant' ? 'Circle Assistant' : 'You'}>
                          {message.role === 'assistant' ? (
                            <Image
                              src="/assets/brand/clarity-circle-mark-gold.png"
                              alt=""
                              width={24}
                              height={24}
                              aria-hidden="true"
                            />
                          ) : (
                            (displayUsername || displayEmail || 'U').slice(0, 1).toUpperCase()
                          )}
                        </span>
                        <span className={styles.chatDivider} aria-hidden="true" />
                        <p>{message.content}</p>
                      </article>
                    ))}
                    {isAssistantBusy && (
                      <article className={styles.assistantBubble}>
                        <span className={styles.chatAvatar} aria-label="Circle Assistant">
                          <Image
                            src="/assets/brand/clarity-circle-mark-gold.png"
                            alt=""
                            width={24}
                            height={24}
                            aria-hidden="true"
                          />
                        </span>
                        <span className={styles.chatDivider} aria-hidden="true" />
                        <p>Thinking through your Circle context...</p>
                      </article>
                    )}
                  </div>

                  <form
                    className={styles.assistantComposer}
                    onSubmit={(event) => {
                      event.preventDefault();
                      void sendAssistantMessage();
                    }}
                  >
                    <textarea
                      ref={assistantInputRef}
                      value={assistantInput}
                      onChange={(event) => {
                        setAssistantInput(event.target.value);
                        resizeAssistantInput(event.currentTarget);
                      }}
                      onInput={(event) => resizeAssistantInput(event.currentTarget)}
                      placeholder="Ask, create, or save context..."
                      rows={1}
                      disabled={isAssistantBusy}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                          event.preventDefault();
                          void sendAssistantMessage();
                        }
                      }}
                    />
                    <button type="submit" className={styles.iconPrimaryButton} disabled={isAssistantBusy || !assistantInput.trim()}>
                      <Send size={17} aria-hidden="true" />
                      <span>Send</span>
                    </button>
                  </form>
                </section>

              </div>
            </section>
          )}

          {activeMenu === 'memory' && (
            <section className={styles.screen} aria-label="Memory">
              <div className={styles.memoryList} aria-label="Assistant memories">
                {assistantMemories.length > 0 ? (
                  assistantMemories.map((memory) => (
                    <article key={memory.id} className={styles.memoryItem}>
                      <div>
                        <span>{memory.memory_type.replace('_', ' ')}</span>
                        <h2>{memory.title}</h2>
                        <p>{memory.content}</p>
                      </div>
                      <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() => void archiveAssistantMemory(memory)}
                        aria-label={`Archive ${memory.title}`}
                        title="Archive memory"
                      >
                        <Archive size={16} aria-hidden="true" />
                      </button>
                    </article>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <Database size={18} aria-hidden="true" />
                    <strong>No assistant memories yet.</strong>
                    <p>Ask the assistant to remember a preference, decision boundary, or useful project signal.</p>
                  </div>
                )}
              </div>

              <div className={styles.screenActions}>
                <button type="button" className={styles.primaryButton} onClick={() => openMenu('assistant')}>
                  <Plus size={16} aria-hidden="true" />
                  Add through assistant
                </button>
              </div>
            </section>
          )}

          {activeMenu === 'projects' && (
            <section className={`${styles.screen} ${styles.projectsScreen}`} aria-label="Projects">
              <div className={styles.finderShell} aria-label="Project finder">
                <aside className={styles.folderPane} aria-label="Project folders">
                  <div className={styles.finderWindowDots} aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className={styles.folderGroup}>
                    <span>Locations</span>
                    <button
                      type="button"
                      className={activeProjectFolder === 'all' ? styles.folderActive : ''}
                      onClick={() => setActiveProjectFolder('all')}
                    >
                      <FolderOpen size={16} aria-hidden="true" />
                      <strong>All Projects</strong>
                      <small>{folderProjectCount('all')}</small>
                    </button>
                    <button
                      type="button"
                      className={activeProjectFolder === 'unfiled' ? styles.folderActive : ''}
                      onClick={() => setActiveProjectFolder('unfiled')}
                    >
                      <Folder size={16} aria-hidden="true" />
                      <strong>Unfiled</strong>
                      <small>{folderProjectCount('unfiled')}</small>
                    </button>
                  </div>

                  <div className={styles.folderGroup}>
                    <span>Folders</span>
                    {projectFolders.map((folder) => (
                      <button
                        key={folder.id}
                        type="button"
                        className={activeProjectFolder === folder.id ? styles.folderActive : ''}
                        onClick={() => setActiveProjectFolder(folder.id)}
                      >
                        <Folder size={16} aria-hidden="true" />
                        <strong>{folder.name}</strong>
                        <small>{folderProjectCount(folder.id)}</small>
                      </button>
                    ))}

                    {isCreatingFolder ? (
                      <form
                        className={styles.newFolderForm}
                        onSubmit={(event) => {
                          event.preventDefault();
                          void createProjectFolder();
                        }}
                      >
                        <input
                          value={newFolderName}
                          onChange={(event) => setNewFolderName(event.target.value)}
                          placeholder="Folder name"
                          autoFocus
                        />
                        <button type="submit">Create</button>
                      </form>
                    ) : (
                      <button type="button" className={styles.folderGhostButton} onClick={() => setIsCreatingFolder(true)}>
                        <FolderPlus size={16} aria-hidden="true" />
                        <strong>Add folder</strong>
                      </button>
                    )}
                  </div>
                </aside>

                <section className={styles.filePane} aria-label="Projects in selected folder">
                  <div className={styles.fileToolbar}>
                    <div className={styles.fileToolbarSummary}>
                      <span>{activeProjectFolder === 'all' ? 'All Projects' : activeProjectFolder === 'unfiled' ? 'Unfiled' : getFolderName(activeProjectFolder)}</span>
                      <strong>{filteredProjects.length} item{filteredProjects.length === 1 ? '' : 's'}</strong>
                    </div>
                    <div className={styles.fileToolbarControls}>
                      <label className={styles.projectSearch}>
                        <Search size={15} aria-hidden="true" />
                        <input
                          value={projectSearch}
                          onChange={(event) => setProjectSearch(event.target.value)}
                          placeholder="Search"
                        />
                      </label>
                      <button
                        type="button"
                        className={`${styles.secondaryButton} ${styles.projectToolbarButton}`}
                        onClick={() => setIsCreatingFolder(true)}
                      >
                        <span className={styles.projectToolbarPlus}>+</span>
                        New folder
                      </button>
                      <button
                        type="button"
                        className={`${styles.secondaryButton} ${styles.projectToolbarButton}`}
                        onClick={() => openNewProjectFlow()}
                      >
                        <span className={styles.projectToolbarPlus}>+</span>
                        New project
                      </button>
                    </div>
                  </div>

                  {isCreatingProject && (
                    <form
                      className={styles.projectCreatePanel}
                      onSubmit={(event) => {
                        event.preventDefault();
                        void createProjectFromBrief();
                      }}
                    >
                      <label>
                        <span>What is this project about?</span>
                        <textarea
                          value={projectBrief}
                          onChange={(event) => setProjectBrief(event.target.value)}
                          placeholder="Describe the project, idea, workflow, or outcome. This becomes the project instruction for future outputs."
                          autoFocus
                        />
                      </label>
                      <div className={styles.projectCreateActions}>
                        <button type="submit" className={styles.primaryButton} disabled={isSavingProject}>
                          {isSavingProject ? 'Creating...' : 'Create project'}
                          <ArrowRight size={16} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className={styles.textButton}
                          onClick={() => {
                            setIsCreatingProject(false);
                            setProjectBrief(selectedProjectInstruction);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  <div className={styles.projectRows} role="list" aria-label="Project list">
                    {filteredProjects.length > 0 ? (
                      filteredProjects.map((project) => (
                        <button
                          key={project.id}
                          type="button"
                          className={selectedProject?.id === project.id ? styles.projectRowActive : ''}
                          onClick={() => {
                            setSelectedProjectId(project.id);
                            setProjectInstructionDraft(project.project_instruction || project.context);
                            setIsCreatingProject(false);
                          }}
                        >
                          <span className={styles.projectFileIcon}>
                            <FileText size={16} aria-hidden="true" />
                          </span>
                          <span className={styles.projectRowMain}>
                            <strong>{project.title}</strong>
                            <small>{project.context}</small>
                          </span>
                          <span className={styles.projectRowMeta}>
                            <span>{project.track === 'founder' ? 'Founder' : 'Builder'}</span>
                            <span>{getFolderName(project.folder_id)}</span>
                            <span>{formatProjectDate(project.updated_at)}</span>
                          </span>
                          <ChevronRight className={styles.projectRowChevron} size={15} aria-hidden="true" />
                        </button>
                      ))
                    ) : (
                      <div className={styles.finderEmpty}>
                        <FolderOpen size={20} aria-hidden="true" />
                        <strong>No projects here.</strong>
                        <p>Create a project or move an existing one into this folder.</p>
                      </div>
                    )}
                  </div>
                </section>

                <aside className={styles.previewPane} aria-label="Project preview">
                  {selectedProject ? (
                    <>
                      <div className={styles.previewHeader}>
                        <span className={styles.previewIcon}>
                          <FileText size={22} aria-hidden="true" />
                        </span>
                        <div>
                          <h2>{selectedProject.title}</h2>
                          <p>{selectedProject.track === 'founder' ? 'Founder Track' : 'Builder Track'}</p>
                        </div>
                      </div>

                      <dl className={styles.previewMeta}>
                        <div>
                          <dt>Folder</dt>
                          <dd>{getFolderName(selectedProject.folder_id)}</dd>
                        </div>
                        <div>
                          <dt>Updated</dt>
                          <dd>{formatProjectDate(selectedProject.updated_at)}</dd>
                        </div>
                      </dl>

                      <div className={styles.previewBody}>
                        <span>Context</span>
                        <p>{selectedProject.summary || selectedProject.context}</p>
                      </div>

                      <div className={styles.projectInstructionPanel}>
                        <label>
                          <span>Project instruction</span>
                          <textarea
                            value={projectInstructionDraft ?? selectedProjectInstruction}
                            onChange={(event) => setProjectInstructionDraft(event.target.value)}
                            placeholder="Set how this project should behave and what future outputs should stay anchored to."
                          />
                        </label>
                        <button
                          type="button"
                          className={styles.secondaryButton}
                          onClick={() => void saveProjectInstruction(selectedProject)}
                          disabled={isSavingProjectInstruction}
                        >
                          {isSavingProjectInstruction ? 'Saving...' : 'Save instruction'}
                        </button>
                      </div>

                      <section className={styles.projectTaskPanel} aria-label="Project tasks">
                        <div className={styles.projectSubheader}>
                          <span>Tasks</span>
                          <small>{selectedProjectTasks.filter((task) => task.status !== 'done').length} open</small>
                        </div>
                        <div className={styles.projectTaskList}>
                          {selectedProjectTasks.length > 0 ? (
                            selectedProjectTasks.map((task) => (
                              <button
                                key={task.id}
                                type="button"
                                className={task.status === 'done' ? styles.projectTaskDone : ''}
                                onClick={() => void toggleProjectTask(task)}
                              >
                                <CheckCircle2 size={16} aria-hidden="true" />
                                <span>
                                  <strong>{task.title}</strong>
                                  {task.detail && <small>{task.detail}</small>}
                                </span>
                              </button>
                            ))
                          ) : (
                            <p>No tasks yet. Add one manually or ask the project assistant.</p>
                          )}
                        </div>
                        <form
                          className={styles.manualTaskForm}
                          onSubmit={(event) => {
                            event.preventDefault();
                            void createManualTask();
                          }}
                        >
                          <input
                            value={manualTaskTitle}
                            onChange={(event) => setManualTaskTitle(event.target.value)}
                            placeholder="Add a manual task"
                          />
                          <button type="submit">Add</button>
                        </form>
                      </section>

                      <section className={styles.projectAssistantPanel} aria-label="Project assistant">
                        <div className={styles.projectSubheader}>
                          <span>Project assistant</span>
                          <small>Uses this instruction</small>
                        </div>
                        <div className={styles.projectAssistantMessages}>
                          {selectedProjectMessages.length > 0 ? (
                            selectedProjectMessages.map((message) => (
                              <article
                                key={message.id}
                                className={message.role === 'assistant' ? styles.assistantBubble : styles.userBubble}
                              >
                                <span className={styles.chatAvatar} aria-label={message.role === 'assistant' ? 'Project assistant' : 'You'}>
                                  {message.role === 'assistant' ? (
                                    <Image
                                      src="/assets/brand/clarity-circle-mark-gold.png"
                                      alt=""
                                      width={24}
                                      height={24}
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    (displayUsername || displayEmail || 'U').slice(0, 1).toUpperCase()
                                  )}
                                </span>
                                <span className={styles.chatDivider} aria-hidden="true" />
                                <p>{message.content}</p>
                              </article>
                            ))
                          ) : (
                            <p>Ask from this project&apos;s context. Replies, tasks, and memories stay scoped to this project.</p>
                          )}
                          {isProjectAssistantBusy && (
                            <article className={styles.assistantBubble}>
                              <span className={styles.chatAvatar} aria-label="Project assistant">
                                <Image
                                  src="/assets/brand/clarity-circle-mark-gold.png"
                                  alt=""
                                  width={24}
                                  height={24}
                                  aria-hidden="true"
                                />
                              </span>
                              <span className={styles.chatDivider} aria-hidden="true" />
                              <p>Thinking from this project instruction...</p>
                            </article>
                          )}
                        </div>
                        <form
                          className={styles.assistantComposer}
                          onSubmit={(event) => {
                            event.preventDefault();
                            void sendProjectAssistantMessage();
                          }}
                        >
                          <textarea
                            ref={projectAssistantInputRef}
                            value={projectAssistantInput}
                            onChange={(event) => {
                              setProjectAssistantInput(event.target.value);
                              resizeAssistantInput(event.currentTarget);
                            }}
                            onInput={(event) => resizeAssistantInput(event.currentTarget)}
                            placeholder="Ask this project assistant..."
                            rows={1}
                            disabled={isProjectAssistantBusy}
                          />
                          <button type="submit" className={styles.iconPrimaryButton} disabled={isProjectAssistantBusy || !projectAssistantInput.trim()}>
                            <Send size={17} aria-hidden="true" />
                            <span>Send</span>
                          </button>
                        </form>
                      </section>

                      <label className={styles.moveControl}>
                        <span>Move to</span>
                        <select
                          value={selectedProject.folder_id ?? 'unfiled'}
                          onChange={(event) =>
                            void moveProjectToFolder(
                              selectedProject,
                              event.target.value === 'unfiled' ? null : event.target.value,
                            )
                          }
                        >
                          <option value="unfiled">Unfiled</option>
                          {projectFolders.map((folder) => (
                            <option key={folder.id} value={folder.id}>
                              {folder.name}
                            </option>
                          ))}
                        </select>
                      </label>

                      <div className={styles.previewActions}>
                        <button type="button" className={styles.primaryButton} onClick={() => openProject(selectedProject)}>
                          Open project
                          <ArrowRight size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className={styles.finderEmpty}>
                      <FileText size={20} aria-hidden="true" />
                      <strong>Select a project.</strong>
                      <p>Your project details will appear here.</p>
                    </div>
                  )}
                </aside>
              </div>
            </section>
          )}

          {activeMenu === 'profile' && (
            <section className={styles.screen} aria-label="Profile">
              <div className={styles.profileDetail}>
                <div className={styles.profileAvatarLarge}>
                  {(displayUsername || displayEmail || 'U').slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <span>Username</span>
                  <strong>{displayUsername || 'Username syncing'}</strong>
                </div>
                <div>
                  <span>Email</span>
                  <strong>{displayEmail || 'Not signed in'}</strong>
                </div>
                <div>
                  <span>Path</span>
                  <strong>{selectedTrack.shortLabel}</strong>
                </div>
              </div>

              <div className={styles.screenActions}>
                <button type="button" className={styles.secondaryButton} onClick={() => openMenu('settings')}>
                  Settings
                </button>
                {authUser && (
                  <button type="button" className={styles.textButton} onClick={() => void signOut()}>
                    <LogOut size={16} aria-hidden="true" />
                    Sign out
                  </button>
                )}
              </div>
            </section>
          )}

          {activeMenu === 'settings' && (
            <section className={styles.screen} aria-label="Settings">
              <div className={styles.settingsList}>
                <label>
                  <span>Preferred path</span>
                  <select
                    value={track}
                    onChange={(event) => {
                      const nextTrack = event.target.value as Track;
                      setTrack(nextTrack);
                      setIntent(TRACKS[nextTrack].defaults);
                      setStatus(`${TRACKS[nextTrack].shortLabel} selected.`);
                    }}
                  >
                    <option value="founder">Founder Track</option>
                    <option value="builder">Individual Track</option>
                  </select>
                </label>
                <label>
                  <span>Digest rhythm</span>
                  <select defaultValue="weekly">
                    <option value="weekly">Weekly</option>
                    <option value="paused">Paused</option>
                  </select>
                </label>
                <label className={styles.toggleRow}>
                  <input type="checkbox" defaultChecked />
                  <span>Keep vault entries private by default</span>
                </label>
              </div>
            </section>
          )}
        </section>
      </section>
    </main>
  );
}

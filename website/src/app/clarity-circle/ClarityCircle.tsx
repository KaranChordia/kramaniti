'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import {
  Archive,
  ArrowRight,
  Bot,
  Brain,
  Building2,
  ChevronRight,
  CircleDot,
  Compass,
  FileText,
  Folder,
  FolderOpen,
  FolderPlus,
  Lightbulb,
  LogOut,
  Search,
  Plus,
  RefreshCw,
  Send,
  Settings,
  Sparkles,
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
} from '@/lib/clarity-circle/supabase';
import styles from './ClarityCircle.module.css';

type Track = 'founder' | 'builder';
type StepId = 'entry' | 'track' | 'intent' | 'context';
type SessionMode = 'signin' | 'signup';
type AuthView = 'signup-email' | 'signup-credentials' | 'signin';
type MenuId = 'start' | 'path' | 'context' | 'assistant' | 'memory' | 'projects' | 'profile' | 'settings';

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
};

type AssistantProjectDraft = {
  title: string;
  track: Track;
  context: string;
  audience: string;
  blocker: string;
  outcome: string;
};

type AssistantMemoryDraft = {
  title: string;
  content: string;
  memory_type: ClarityCircleAssistantMemory['memory_type'];
};

type AssistantResponse = {
  response?: string;
  projectDraft?: AssistantProjectDraft | null;
  memoryDraft?: AssistantMemoryDraft | null;
  error?: string;
};

type ProjectFolderFilter = 'all' | 'unfiled' | string;

type WorkspaceSnapshot = {
  projects: ClarityCircleProject[];
  folders: ClarityCircleProjectFolder[];
  contextEntries: ClarityCircleContextEntry[];
  messages: UiAssistantMessage[];
  memories: ClarityCircleAssistantMemory[];
};

const STORAGE_KEY = 'kramaniti-clarity-circle-sequence-v1';
const ENGINE_HANDOFF_KEY = 'kramaniti-clarity-circle-engine-handoff-v1';

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
  { id: 'assistant', label: 'Assistant', icon: Bot },
  { id: 'memory', label: 'Memory', icon: Brain },
  { id: 'projects', label: 'Projects', icon: Sparkles },
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const createUiMessage = (role: UiAssistantMessage['role'], content: string): UiAssistantMessage => ({
  id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  role,
  content,
  createdAt: new Date().toISOString(),
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
    context: project.context,
    audience: project.audience ?? '',
    blocker: project.blocker ?? '',
    outcome: project.outcome ?? '',
  },
  summary: project.summary ?? buildSavedContext(project.track, TRACKS[project.track].defaults).summary,
  questions: project.questions,
  actions: project.actions,
});

const localProjectFromContext = (context: SavedContext, userId = 'local'): ClarityCircleProject => ({
  id: `local-project-${Date.now()}`,
  user_id: userId,
  folder_id: null,
  track: context.track,
  title: context.intent.headline,
  context: context.intent.context,
  audience: context.intent.audience || null,
  blocker: context.intent.blocker || null,
  outcome: context.intent.outcome || null,
  summary: context.summary,
  questions: context.questions,
  actions: context.actions,
  status: 'active',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

export function ClarityCircle() {
  const [step, setStep] = useState<StepId>('entry');
  const [track, setTrack] = useState<Track>('founder');
  const [intent, setIntent] = useState<IntentDraft>(TRACKS.founder.defaults);
  const [savedContext, setSavedContext] = useState<SavedContext | null>(null);
  const [activeMenu, setActiveMenu] = useState<MenuId>('start');
  const [sessionMode, setSessionMode] = useState<SessionMode>('signup');
  const [authView, setAuthView] = useState<AuthView>('signup-email');
  const [status, setStatus] = useState('Start with one clear signal.');
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
  const [contextEntries, setContextEntries] = useState<ClarityCircleContextEntry[]>([]);
  const [activeProjectFolder, setActiveProjectFolder] = useState<ProjectFolderFilter>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectSearch, setProjectSearch] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantMessages, setAssistantMessages] = useState<UiAssistantMessage[]>(INITIAL_ASSISTANT_MESSAGES);
  const [assistantMemories, setAssistantMemories] = useState<ClarityCircleAssistantMemory[]>([]);
  const [isAssistantBusy, setIsAssistantBusy] = useState(false);

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

    const [projectResult, folderResult, entryResult, messageResult, memoryResult] = await Promise.all([
      supabase
        .schema('clarity_circle')
        .from('projects')
        .select('*')
        .eq('status', 'active')
        .order('updated_at', { ascending: false })
        .limit(120),
      supabase
        .schema('clarity_circle')
        .from('project_folders')
        .select('*')
        .eq('status', 'active')
        .order('sort_order', { ascending: true })
        .order('updated_at', { ascending: false })
        .limit(60),
      supabase
        .schema('clarity_circle')
        .from('context_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(120),
      supabase
        .schema('clarity_circle')
        .from('assistant_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(30),
      supabase
        .schema('clarity_circle')
        .from('assistant_memories')
        .select('*')
        .eq('status', 'active')
        .order('updated_at', { ascending: false })
        .limit(20),
    ]);

    if (projectResult.error) {
      if (!options?.quiet) setStatus('Saved projects could not be loaded.');
      return null;
    }

    const nextProjects = projectResult.data ?? [];
    const nextFolders = folderResult.error ? [] : folderResult.data ?? [];
    const nextEntries = entryResult.error ? [] : entryResult.data ?? [];
    const nextMessages =
      !messageResult.error && messageResult.data?.length
        ? messageResult.data.map((message) => ({
            id: message.id,
            role: message.role,
            content: message.content,
            createdAt: message.created_at,
          }))
        : INITIAL_ASSISTANT_MESSAGES;
    const nextMemories = memoryResult.error ? [] : memoryResult.data ?? [];

    setProjects(nextProjects);
    setProjectFolders(nextFolders);
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
      setStep('track');
      setActiveMenu('path');
      setStatus('Continue locally for now.');
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
      setStep('track');
      setActiveMenu('path');
      setStatus('Continue locally for now.');
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

    setAuthUser(retryUser);
    setAuthLogin(username);
    setStep('track');
    setActiveMenu('path');
    setStatus(`Signed in as ${username}.`);
  };

  const signIn = async () => {
    const supabase = getClarityCircleSupabase();
    if (!supabase) {
      setStep('track');
      setActiveMenu('path');
      setStatus('Continue locally for now.');
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

      if (error || !data) {
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
    setAuthUser(user);
    const profile = await loadProfile(user);
    setStep('track');
    setActiveMenu('path');
    setStatus(`Signed in${profile?.username ? ` as ${profile.username}` : ''}.`);
  };

  const continueLocally = () => {
    setStep('track');
    setActiveMenu('path');
    setStatus('Continue locally.');
  };

  const signOut = async () => {
    const supabase = getClarityCircleSupabase();
    if (!supabase) return;

    await supabase.auth.signOut();
    setAuthUser(null);
    setAuthProfile(null);
    setProjects([]);
    setProjectFolders([]);
    setActiveProjectFolder('all');
    setSelectedProjectId(null);
    setProjectSearch('');
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

  const folderProjectCount = (folderId: ProjectFolderFilter) =>
    projects.filter((project) => {
      if (folderId === 'all') return true;
      if (folderId === 'unfiled') return !project.folder_id;
      return project.folder_id === folderId;
    }).length;

  const createProjectFolder = async () => {
    const name = cleanSentence(newFolderName, '').slice(0, 80);
    if (!name) {
      setStatus('Name the folder first.');
      return;
    }

    const localFolder: ClarityCircleProjectFolder = {
      id: `local-folder-${Date.now()}`,
      user_id: authUser?.id ?? 'local',
      name,
      sort_order: projectFolders.length,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const supabase = getClarityCircleSupabase();
    if (!supabase || !authUser) {
      setProjectFolders((current) => [...current, localFolder]);
      setActiveProjectFolder(localFolder.id);
      setNewFolderName('');
      setIsCreatingFolder(false);
      setStatus('Folder created locally.');
      return;
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
      setStatus(error?.code === '23505' ? 'A folder with this name already exists.' : 'Folder could not be created.');
      return;
    }

    setProjectFolders((current) => [...current, data]);
    setActiveProjectFolder(data.id);
    setNewFolderName('');
    setIsCreatingFolder(false);
    setStatus('Folder created.');
    void refreshWorkspace(authUser, { quiet: true });
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

  const saveAssistantMemory = async (draft: AssistantMemoryDraft, projectId?: string | null) => {
    const localMemory: ClarityCircleAssistantMemory = {
      id: `local-memory-${Date.now()}`,
      user_id: authUser?.id ?? 'local',
      project_id: projectId ?? null,
      memory_type: draft.memory_type,
      title: cleanSentence(draft.title, 'Circle memory'),
      content: cleanSentence(draft.content, 'Saved assistant context'),
      source: 'assistant',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const supabase = getClarityCircleSupabase();
    if (!supabase || !authUser) {
      setAssistantMemories((current) => [localMemory, ...current].slice(0, 12));
      return localMemory;
    }

    const { data, error } = await supabase
      .schema('clarity_circle')
      .from('assistant_memories')
      .insert({
        user_id: authUser.id,
        project_id: projectId ?? null,
        memory_type: draft.memory_type,
        title: localMemory.title,
        content: localMemory.content,
        source: 'assistant',
      })
      .select('*')
      .single();

    if (error || !data) {
      setAssistantMemories((current) => [localMemory, ...current].slice(0, 12));
      return localMemory;
    }

    setAssistantMemories((current) => [data, ...current.filter((item) => item.id !== data.id)].slice(0, 12));
    void refreshWorkspace(authUser, { quiet: true });
    return data;
  };

  const createProjectFromAssistantDraft = async (draft: AssistantProjectDraft) => {
    const projectIntent: IntentDraft = {
      headline: cleanSentence(draft.title, 'New clarity project'),
      context: cleanSentence(draft.context, 'A new project created from the Circle assistant.'),
      audience: draft.audience?.trim() || '',
      blocker: draft.blocker?.trim() || 'The first decision is still unclear.',
      outcome: draft.outcome?.trim() || 'A clearer next action.',
    };
    const context = buildSavedContext(draft.track, projectIntent);

    setTrack(draft.track);
    setIntent(projectIntent);
    setSavedContext(context);
    setStep('context');

    const supabase = getClarityCircleSupabase();
    if (!supabase || !authUser) {
      const localProject = localProjectFromContext(context, authUser?.id ?? 'local');
      setProjects((current) => [localProject, ...current.filter((item) => item.id !== localProject.id)].slice(0, 80));
      setSelectedProjectId(localProject.id);
      setStatus('Project drafted locally.');
      return null;
    }

    const { data: project, error } = await supabase
      .schema('clarity_circle')
      .from('projects')
      .insert({
        user_id: authUser.id,
        track: draft.track,
        title: projectIntent.headline,
        context: projectIntent.context,
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
      setStatus('Project drafted locally. Account save failed.');
      return null;
    }

    await supabase.schema('clarity_circle').from('context_entries').insert({
      project_id: project.id,
      user_id: authUser.id,
      entry_type: 'note',
      payload: {
        source: 'circle_assistant',
        title: project.title,
        context: project.context,
        audience: project.audience,
        blocker: project.blocker,
        outcome: project.outcome,
      },
    });

    setProjects((current) => [project, ...current.filter((item) => item.id !== project.id)].slice(0, 80));
    setSelectedProjectId(project.id);
    setStatus('Project created.');
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
    const nextMessages = [...assistantMessages, userMessage].slice(-12);

    setAssistantMessages(nextMessages);
    setAssistantInput('');
    setIsAssistantBusy(true);
    void saveAssistantMessage(userMessage);

    try {
      const liveWorkspace = authUser ? await refreshWorkspace(authUser, { quiet: true }) : null;
      const assistantProjects = liveWorkspace?.projects ?? projects;
      const assistantFolders = liveWorkspace?.folders ?? projectFolders;
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
            audience: project.audience,
            blocker: project.blocker,
            outcome: project.outcome,
            summary: project.summary,
            questions: project.questions,
            actions: project.actions,
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

    const context = buildSavedContext(track, {
      headline: intent.headline.trim(),
      context: intent.context.trim(),
      audience: intent.audience.trim(),
      blocker: intent.blocker.trim(),
      outcome: intent.outcome.trim(),
    });

    setSavedContext(context);
    setStep('context');
    setActiveMenu('context');

    const supabase = getClarityCircleSupabase();
    if (!supabase || !authUser) {
      const localProject = localProjectFromContext(context, authUser?.id ?? 'local');
      setProjects((current) => [localProject, ...current].slice(0, 80));
      setSelectedProjectId(localProject.id);
      setStatus('Context saved locally.');
      return;
    }

    setIsSavingContext(true);
    const { data: project, error: projectError } = await supabase
      .schema('clarity_circle')
      .from('projects')
      .insert({
        user_id: authUser.id,
        track,
        title: context.intent.headline,
        context: context.intent.context,
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
      setStatus('Context saved locally. Cloud save failed.');
      return;
    }

    await supabase.schema('clarity_circle').from('context_entries').insert({
      project_id: project.id,
      user_id: authUser.id,
      entry_type: 'intent',
      payload: {
        headline: context.intent.headline,
        context: context.intent.context,
        audience: context.intent.audience,
        blocker: context.intent.blocker,
        outcome: context.intent.outcome,
        saved_at: context.savedAt,
      },
    });

    setProjects((current) => [project, ...current.filter((item) => item.id !== project.id)].slice(0, 80));
    setSelectedProjectId(project.id);
    setIsSavingContext(false);
    setStatus('Context saved.');
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
    <main className={styles.page}>
      <section className={styles.shell} aria-label="Kramaniti Clarity Circle">
        <aside className={styles.rail} aria-label="Clarity Circle progress">
          <Link href="/" className={styles.brandMark} aria-label="Kramaniti home">
            <span>K</span>
            <strong>Kramaniti</strong>
          </Link>

          <div className={styles.productLabel}>
            <CircleDot size={12} aria-hidden="true" />
            <span>Clarity Circle</span>
          </div>

          <nav className={styles.menu} aria-label="Clarity Circle sections">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={activeMenu === item.id ? styles.menuActive : ''}
                  onClick={() => openMenu(item.id)}
                >
                  <Icon size={16} aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {authUser && (
            <div className={styles.profilePanel} aria-label="Profile and settings">
              <div className={styles.profileAvatar}>
                {(displayUsername || displayEmail || 'U').slice(0, 1).toUpperCase()}
              </div>
              <div>
                <span>Profile</span>
                <strong>{displayUsername || 'Username syncing'}</strong>
                <small>{displayEmail}</small>
              </div>
              <nav aria-label="Account sections">
                <button type="button" onClick={() => openMenu('profile')}>
                  <UserRound size={15} aria-hidden="true" />
                  Profile
                </button>
                <button type="button" onClick={() => openMenu('settings')}>
                  <Settings size={15} aria-hidden="true" />
                  Settings
                </button>
                <button type="button" onClick={() => openMenu('projects')}>
                  <FileText size={15} aria-hidden="true" />
                  Projects
                </button>
              </nav>
            </div>
          )}
        </aside>

        <section className={styles.stage} aria-live="polite">
          <div className={styles.topBar}>
            <div>
              <span>{MENU_ITEMS.find((item) => item.id === activeMenu)?.label ?? 'Start'}</span>
              <strong>{status}</strong>
            </div>
            {authUser && (
              <button type="button" className={styles.iconButton} onClick={() => void signOut()} aria-label="Sign out">
                <LogOut size={17} aria-hidden="true" />
              </button>
            )}
          </div>

          {activeMenu === 'start' && (
            <section className={styles.screen} aria-labelledby="entry-title">
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
                    Continue
                    <ArrowRight size={17} aria-hidden="true" />
                  </button>
                  <button type="button" className={styles.textButton} onClick={continueLocally}>
                    Continue locally
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
                    Create account
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
                    Sign in
                    <ArrowRight size={17} aria-hidden="true" />
                  </button>
                  <button type="button" className={styles.textButton} onClick={continueLocally}>
                    Continue locally
                  </button>
                </div>
              )}
            </section>
          )}

          {activeMenu === 'path' && (
            <section className={styles.screen} aria-labelledby="track-title">
              <h1 id="track-title">Choose your path.</h1>
              <p className={styles.lead}>
                Founder clarity and early idea exploration need different questions.
              </p>

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
            <section className={styles.screen} aria-labelledby="intent-title">
              <h1 id="intent-title">
                {track === 'founder' ? 'Capture the business signal.' : 'Capture the idea signal.'}
              </h1>
              <p className={styles.lead}>
                Keep it rough. The first version only needs enough shape to develop.
              </p>

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
            <section className={styles.screen} aria-labelledby="context-title">
              <h1 id="context-title">Starting point saved.</h1>
              <p className={styles.lead}>
                Use this as the working context for projects, briefs, and the Clarity Engine.
              </p>

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
                  <Sparkles size={17} aria-hidden="true" />
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
              <p className={styles.lead}>Choose a path and save the first signal.</p>
              <div className={styles.screenActions}>
                <button type="button" className={styles.primaryButton} onClick={() => openMenu('path')}>
                  Choose path
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
              </div>
            </section>
          )}

          {activeMenu === 'assistant' && (
            <section className={`${styles.screen} ${styles.assistantScreen}`} aria-labelledby="assistant-title">
              <div>
                <h1 id="assistant-title">Circle Assistant</h1>
                <p className={styles.lead}>
                  Ask from your saved context, create a project, or save a useful memory.
                </p>
              </div>

              <div className={styles.assistantLayout}>
                <section className={styles.chatPanel} aria-label="Circle assistant conversation">
                  <div className={styles.chatMessages}>
                    {assistantMessages.map((message) => (
                      <article
                        key={message.id}
                        className={message.role === 'assistant' ? styles.assistantBubble : styles.userBubble}
                      >
                        <span>{message.role === 'assistant' ? 'Circle Assistant' : displayUsername || 'You'}</span>
                        <p>{message.content}</p>
                      </article>
                    ))}
                    {isAssistantBusy && (
                      <article className={styles.assistantBubble}>
                        <span>Circle Assistant</span>
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
                      value={assistantInput}
                      onChange={(event) => setAssistantInput(event.target.value)}
                      placeholder="Ask to sharpen this, remember a preference, or create a project..."
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

                <aside className={styles.assistantSidePanel} aria-label="Assistant context">
                  <div>
                    <span>Active context</span>
                    <strong>{savedContext?.intent.headline || 'No saved context yet'}</strong>
                    <p>{savedContext?.summary || 'Save the first signal so the assistant has a better starting point.'}</p>
                  </div>
                  <div>
                    <span>Projects</span>
                    <strong>{projects.length || (savedContext ? 1 : 0)}</strong>
                    <p>Ask “create a project for...” and the assistant will draft it into your project list.</p>
                  </div>
                  <div>
                    <span>Memory</span>
                    <strong>{assistantMemories.length}</strong>
                    <p>Saved assistant memories are visible and manageable from the Memory section.</p>
                  </div>
                </aside>
              </div>
            </section>
          )}

          {activeMenu === 'memory' && (
            <section className={styles.screen} aria-labelledby="memory-title">
              <h1 id="memory-title">Memory</h1>
              <p className={styles.lead}>Review what the Circle Assistant keeps as context for future answers.</p>

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
                    <Brain size={18} aria-hidden="true" />
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
            <section className={`${styles.screen} ${styles.projectsScreen}`} aria-labelledby="projects-title">
              <div className={styles.projectsIntro}>
                <div>
                  <h1 id="projects-title">Projects</h1>
                  <p className={styles.lead}>Organize saved contexts into a focused project workspace.</p>
                </div>
                <div className={styles.projectsToolbar}>
                  <button type="button" className={styles.secondaryButton} onClick={() => setIsCreatingFolder(true)}>
                    <FolderPlus size={16} aria-hidden="true" />
                    New folder
                  </button>
                  <button type="button" className={styles.primaryButton} onClick={() => openMenu('path')}>
                    <Plus size={16} aria-hidden="true" />
                    New project
                  </button>
                </div>
              </div>

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
                    <div>
                      <span>{activeProjectFolder === 'all' ? 'All Projects' : activeProjectFolder === 'unfiled' ? 'Unfiled' : getFolderName(activeProjectFolder)}</span>
                      <strong>{filteredProjects.length} item{filteredProjects.length === 1 ? '' : 's'}</strong>
                    </div>
                    <label className={styles.projectSearch}>
                      <Search size={15} aria-hidden="true" />
                      <input
                        value={projectSearch}
                        onChange={(event) => setProjectSearch(event.target.value)}
                        placeholder="Search"
                      />
                    </label>
                  </div>

                  <div className={styles.projectRows} role="list" aria-label="Project list">
                    {filteredProjects.length > 0 ? (
                      filteredProjects.map((project) => (
                        <button
                          key={project.id}
                          type="button"
                          className={selectedProject?.id === project.id ? styles.projectRowActive : ''}
                          onClick={() => setSelectedProjectId(project.id)}
                        >
                          <span className={styles.projectFileIcon}>
                            <FileText size={16} aria-hidden="true" />
                          </span>
                          <span>
                            <strong>{project.title}</strong>
                            <small>{project.context}</small>
                          </span>
                          <span>{project.track === 'founder' ? 'Founder' : 'Builder'}</span>
                          <span>{getFolderName(project.folder_id)}</span>
                          <span>{formatProjectDate(project.updated_at)}</span>
                          <ChevronRight size={15} aria-hidden="true" />
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
            <section className={styles.screen} aria-labelledby="profile-title">
              <h1 id="profile-title">Profile</h1>
              <p className={styles.lead}>Your account identity and preferred working path.</p>

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
            <section className={styles.screen} aria-labelledby="settings-title">
              <h1 id="settings-title">Settings</h1>
              <p className={styles.lead}>Simple defaults for how the Circle develops your context.</p>

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

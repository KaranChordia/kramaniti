'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  CircleDot,
  Compass,
  FileText,
  Lightbulb,
  Lock,
  LogOut,
  Mail,
  KeyRound,
  RefreshCw,
  Settings,
  Sparkles,
  UserRound,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import {
  getClarityCircleSupabase,
  isClarityCircleSupabaseConfigured,
  type ClarityCircleProfile,
  type ClarityCircleProject,
} from '@/lib/clarity-circle/supabase';
import styles from './ClarityCircle.module.css';

type Track = 'founder' | 'builder';
type StepId = 'entry' | 'track' | 'intent' | 'context';
type SessionMode = 'signin' | 'signup';
type AuthView = 'signup-email' | 'signup-credentials' | 'signin';

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

export function ClarityCircle() {
  const [step, setStep] = useState<StepId>('entry');
  const [track, setTrack] = useState<Track>('founder');
  const [intent, setIntent] = useState<IntentDraft>(TRACKS.founder.defaults);
  const [savedContext, setSavedContext] = useState<SavedContext | null>(null);
  const [sessionMode, setSessionMode] = useState<SessionMode>('signup');
  const [authView, setAuthView] = useState<AuthView>('signup-email');
  const [status, setStatus] = useState('Your private idea context stays on this browser in v1.');
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

  const isSupabaseReady = isClarityCircleSupabaseConfigured();

  const loadProfile = async (user: User) => {
    const supabase = getClarityCircleSupabase();
    if (!supabase) return null;

    const { data } = await supabase
      .schema('clarity_circle')
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    setAuthProfile(data ?? null);
    return data ?? null;
  };

  const upsertProfile = async (user: User, username: string) => {
    const supabase = getClarityCircleSupabase();
    if (!supabase) return null;

    const normalizedUsername = normalizeUsername(username);
    const { data, error } = await supabase
      .schema('clarity_circle')
      .from('profiles')
      .upsert(
        {
          user_id: user.id,
          email: user.email ?? authEmail.trim(),
          username: normalizedUsername,
        },
        { onConflict: 'user_id' }
      )
      .select('*')
      .single();

    if (error) {
      setStatus(error.code === '23505' ? 'That username is already taken.' : error.message);
      return null;
    }

    setAuthProfile(data);
    return data;
  };

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
          }>;

          if (parsed.track && TRACKS[parsed.track]) setTrack(parsed.track);
          if (parsed.intent) setIntent(parsed.intent);
          if (parsed.savedContext) setSavedContext(parsed.savedContext);
          if (parsed.sessionMode) setSessionMode(parsed.sessionMode);
          if (parsed.step && STEPS.some((item) => item.id === parsed.step)) setStep(parsed.step);
        }
      } catch {
        setStatus('Local context could not be restored, so this session starts fresh.');
      } finally {
        setHasLoaded(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, track, intent, savedContext, sessionMode }));
  }, [hasLoaded, intent, savedContext, sessionMode, step, track]);

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
        setStatus('Signed in. Your Clarity Circle projects can now be saved to Supabase.');
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setAuthUser(user);
      if (user) {
        void loadProfile(user);
        setStep((current) => (current === 'entry' ? 'track' : current));
        setStatus('Signed in. Your Clarity Circle projects can now be saved to Supabase.');
      } else {
        setAuthProfile(null);
        setProjects([]);
      }
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, [step]);

  useEffect(() => {
    const supabase = getClarityCircleSupabase();
    if (!supabase || !authUser) return;

    let isMounted = true;

    supabase
      .schema('clarity_circle')
      .from('projects')
      .select('*')
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
      .limit(5)
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (error) {
          setStatus('Signed in, but saved projects could not be loaded from Supabase.');
          return;
        }
        setProjects(data ?? []);
      });

    return () => {
      isMounted = false;
    };
  }, [authUser]);

  const activeIndex = useMemo(() => STEPS.findIndex((item) => item.id === step), [step]);
  const selectedTrack = TRACKS[track];
  const TrackIcon = selectedTrack.icon;

  const continueSignupWithEmail = () => {
    const supabase = getClarityCircleSupabase();
    if (!supabase) {
      setStep('track');
      setStatus('Supabase is not configured locally yet, so this session is using browser-local storage.');
      return;
    }

    if (!isEmail(authEmail)) {
      setStatus('Enter a valid email address to create your account.');
      return;
    }

    setSessionMode('signup');
    setAuthView('signup-credentials');
    setStatus('Now create a username and password for this email.');
  };

  const createAccount = async () => {
    const supabase = getClarityCircleSupabase();
    if (!supabase) {
      setStep('track');
      setStatus('Supabase is not configured locally yet, so this session is using browser-local storage.');
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
      setStatus(`Account created. Signed in as ${username}.`);
      return;
    }

    setStatus('Account created, but Supabase email confirmation is still enabled. Disable email confirmation for instant access.');
  };

  const signIn = async () => {
    const supabase = getClarityCircleSupabase();
    if (!supabase) {
      setStep('track');
      setStatus('Supabase is not configured locally yet, so this session is using browser-local storage.');
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
    setStatus(`Signed in${profile?.username ? ` as ${profile.username}` : ''}.`);
  };

  const continueLocally = () => {
    setStep('track');
    setStatus('Continuing locally. Supabase will not store this context until you sign in.');
  };

  const signOut = async () => {
    const supabase = getClarityCircleSupabase();
    if (!supabase) return;

    await supabase.auth.signOut();
    setAuthUser(null);
    setAuthProfile(null);
    setProjects([]);
    setAuthView('signin');
    setStatus('Signed out. You can still continue locally on this browser.');
  };

  const chooseTrack = (nextTrack: Track) => {
    setTrack(nextTrack);
    setIntent(TRACKS[nextTrack].defaults);
    setStep('intent');
    setStatus(`${TRACKS[nextTrack].shortLabel} selected. The next screen captures only your intent.`);
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

    const supabase = getClarityCircleSupabase();
    if (!supabase || !authUser) {
      setStatus('Context saved locally. Sign in with Supabase to store it as a private project.');
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
      setStatus('Context saved locally, but Supabase project storage failed. Check the migration and env setup.');
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

    setProjects((current) => [project, ...current.filter((item) => item.id !== project.id)].slice(0, 5));
    setIsSavingContext(false);
    setStatus('Context saved privately to the clarity_circle Supabase schema.');
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
    setStatus('Loaded a private Supabase project into this Clarity Circle session.');
  };

  const refineAgain = () => {
    setStep('intent');
    setStatus('Refine the saved signal without exposing it publicly.');
  };

  const restart = () => {
    setStep('entry');
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

          <ol className={styles.steps}>
            {STEPS.map((item, index) => {
              const isActive = item.id === step;
              const isComplete = index < activeIndex;
              return (
                <li key={item.id} className={isActive ? styles.stepActive : isComplete ? styles.stepComplete : ''}>
                  <span>{isComplete ? <CheckCircle2 size={16} aria-hidden="true" /> : index + 1}</span>
                  <div>
                    <strong>{item.label}</strong>
                    <small>{item.detail}</small>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className={styles.privacyNote}>
            <Lock size={17} aria-hidden="true" />
            <div>
              <strong>{authUser ? 'Supabase private storage' : 'Private memory first'}</strong>
              <p>
                {authUser
                  ? 'Signed-in projects are stored in the isolated clarity_circle schema.'
                : 'Unsigned sessions stay local in your browser. Public sharing remains a separate choice.'}
              </p>
            </div>
          </div>

          {authUser && (
            <div className={styles.profilePanel} aria-label="Profile and settings">
              <div className={styles.profileAvatar}>
                {(authProfile?.username || authUser.email || 'U').slice(0, 1).toUpperCase()}
              </div>
              <div>
                <span>Profile</span>
                <strong>{authProfile?.username ?? 'Username pending'}</strong>
                <small>{authUser.email}</small>
              </div>
              <nav aria-label="Future profile menus">
                <button type="button">
                  <UserRound size={15} aria-hidden="true" />
                  Account
                </button>
                <button type="button">
                  <Settings size={15} aria-hidden="true" />
                  Settings
                </button>
                <button type="button">
                  <FileText size={15} aria-hidden="true" />
                  Projects
                </button>
              </nav>
            </div>
          )}
        </aside>

        <section className={styles.stage} aria-live="polite">
          <div className={styles.statusBar}>
            <span>{status}</span>
            <i aria-hidden="true" />
          </div>

          {step === 'entry' && (
            <section className={styles.screen} aria-labelledby="entry-title">
              <div className={styles.eyebrow}>
                <Sparkles size={15} aria-hidden="true" />
                <span>AI-assisted clarity ecosystem</span>
              </div>
              <h1 id="entry-title">Kramaniti&apos;s Clarity Circle</h1>
              <p className={styles.lead}>
                A simple guided space for founders and early builders to save rough thinking, clarify direction,
                and turn scattered ideas into sharper next steps.
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
              <p className={styles.authNotice}>{status}</p>

              <div className={styles.entryFooter}>
                <span>
                  <Mail size={14} aria-hidden="true" />
                  {isSupabaseReady
                    ? authUser
                      ? `Signed in as ${authProfile?.username ?? authUser.email ?? 'Supabase user'}`
                      : 'Create an account with email, username, and password.'
                    : 'Supabase env vars are not configured locally yet.'}
                </span>
                <span>
                  <KeyRound size={14} aria-hidden="true" />
                  Sign in with your username and password after registration.
                </span>
                <span>
                  <Lock size={14} aria-hidden="true" />
                  Clarity Circle app data uses the separate clarity_circle schema.
                </span>
                <span>
                  <Compass size={14} aria-hidden="true" />
                  Strategy before tools. Systems before scale. Content after clarity.
                </span>
              </div>
            </section>
          )}

          {step === 'track' && (
            <section className={styles.screen} aria-labelledby="track-title">
              <div className={styles.eyebrow}>
                <UserRound size={15} aria-hidden="true" />
                <span>{sessionMode === 'signin' ? 'Welcome back' : 'Start your circle'}</span>
              </div>
              <h1 id="track-title">Choose the path that fits you today.</h1>
              <p className={styles.lead}>
                The Circle separates founder clarity from early idea exploration so the AI can ask better questions
                and keep the right context.
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

          {step === 'intent' && (
            <section className={styles.screen} aria-labelledby="intent-title">
              <div className={styles.eyebrow}>
                <TrackIcon size={15} aria-hidden="true" />
                <span>{selectedTrack.shortLabel}</span>
              </div>
              <h1 id="intent-title">
                {track === 'founder'
                  ? 'Tell the Circle what you are trying to build.'
                  : 'Tell the Circle what idea you are exploring.'}
              </h1>
              <p className={styles.lead}>
                This is the private context layer. Keep it rough, but make the intent specific enough that the system
                can develop it over time.
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

          {step === 'context' && savedContext && (
            <section className={styles.screen} aria-labelledby="context-title">
              <div className={styles.eyebrow}>
                <CheckCircle2 size={15} aria-hidden="true" />
                <span>Private context saved</span>
              </div>
              <h1 id="context-title">Your Circle now has a starting point.</h1>
              <p className={styles.lead}>
                From here the product should progressively offer a digest, a community prompt, and a Clarity Brief
                instead of showing every module at once.
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

              {projects.length > 0 && (
                <div className={styles.projectList} aria-label="Saved Supabase projects">
                  <span>Private Supabase projects</span>
                  <div>
                    {projects.map((project) => (
                      <button key={project.id} type="button" onClick={() => openProject(project)}>
                        <strong>{project.title}</strong>
                        <small>{project.track === 'founder' ? 'Founder Track' : 'Builder Track'}</small>
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
        </section>
      </section>
    </main>
  );
}

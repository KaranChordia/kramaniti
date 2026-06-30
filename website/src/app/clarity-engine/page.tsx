'use client';

import Link from 'next/link';
import { startTransition, useDeferredValue, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CornerDownLeft,
  Download,
  Home,
  Loader2,
  Moon,
  RefreshCw,
  Sun,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Wand2
} from 'lucide-react';
import styles from './ClarityEngine.module.css';
import {
  DEFAULT_ANSWERS,
  INITIAL_ASSISTANT_REPLY,
  INITIAL_SYNTHESIS,
  buildFallbackResponse,
  buildPersonalizedQuestion,
  createInitialSessionEnvelope,
  type AssistantEnvelope,
  type ClarityAnswers,
  type ConversationTurn,
  type QuestionId,
} from '@/lib/clarity-engine/assistant';
import { type MockScenario } from '@/lib/clarity-engine/mockData';
import { useKramanitiTheme } from '@/hooks/useKramanitiTheme';

type SessionState = {
  answers: ClarityAnswers;
  assistantReply: string;
  currentQuestion: string;
  currentQuestionKey: QuestionId;
  currentQuestionLabel: string;
  currentQuestionPlaceholder: string;
  transcript: ConversationTurn[];
  contextLog: string[];
  aiTasks: { label: string; question: string }[];
  synthesis: Omit<
    AssistantEnvelope,
    'assistantReply' | 'nextQuestion' | 'nextQuestionKey' | 'nextQuestionLabel' | 'nextQuestionPlaceholder' | 'source'
  >;
  source: 'groq' | 'local';
  mockScenarioId?: string;
  squareProject?: {
    projectId: string;
    folderId?: string | null;
    projectTitle: string;
    folderName?: string;
    projectInstruction?: string | null;
  } | null;
};

const STORAGE_KEY = 'kramaniti-clarity-engine-v2';
const SQUARE_HANDOFF_KEY = 'kramaniti-clarity-square-engine-handoff-v1';
const LEGACY_SQUARE_HANDOFF_KEY = 'kramaniti-clarity-circle-engine-handoff-v1';

type ClaritySquareHandoff = {
  version: 1;
  createdAt: string;
  source?: 'clarity_square_project' | 'clarity_square_context';
  projectId?: string;
  folderId?: string | null;
  projectTitle?: string;
  folderName?: string;
  projectInstruction?: string | null;
  track: 'founder' | 'builder';
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

const SAMPLE_ANSWER =
  'We have a founder-led business with strong expertise, but the offer, workflow, and content system feel scattered. I want to clarify what should happen first before adding more AI tools.';

const DIAGNOSTIC_SEQUENCE: QuestionId[] = [
  'phase1_clarity_goal',
  'phase2_audience_problem',
  'phase3_current_workflow',
  'phase4_main_friction',
  'phase5_ai_boundary',
  'phase6_presence_proof',
];

const createInitialSession = (): SessionState => {
  const initial = createInitialSessionEnvelope();

  return {
    answers: { ...DEFAULT_ANSWERS },
    assistantReply: initial.assistantReply,
    currentQuestion: initial.nextQuestion,
    currentQuestionKey: initial.nextQuestionKey,
    currentQuestionLabel: initial.nextQuestionLabel || 'Core Question',
    currentQuestionPlaceholder: initial.nextQuestionPlaceholder || 'Provide your thoughts...',
    transcript: [
      {
        role: 'assistant',
        content: INITIAL_ASSISTANT_REPLY,
        createdAt: new Date().toISOString(),
      },
    ],
    contextLog: [],
    aiTasks: [],
    synthesis: { ...INITIAL_SYNTHESIS },
    source: 'local',
  };
};

const cleanHandoffValue = (value: unknown) =>
  typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';

const isClaritySquareHandoff = (value: unknown): value is ClaritySquareHandoff => {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<ClaritySquareHandoff>;

  return (
    candidate.version === 1 &&
    (candidate.track === 'founder' || candidate.track === 'builder') &&
    typeof candidate.headline === 'string' &&
    typeof candidate.context === 'string'
  );
};

const readClaritySquareHandoff = (): ClaritySquareHandoff | null => {
  if (typeof window === 'undefined') return null;

  try {
    const stored =
      window.localStorage.getItem(SQUARE_HANDOFF_KEY) || window.localStorage.getItem(LEGACY_SQUARE_HANDOFF_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as unknown;
    window.localStorage.removeItem(SQUARE_HANDOFF_KEY);
    window.localStorage.removeItem(LEGACY_SQUARE_HANDOFF_KEY);

    return isClaritySquareHandoff(parsed) ? parsed : null;
  } catch {
    window.localStorage.removeItem(SQUARE_HANDOFF_KEY);
    window.localStorage.removeItem(LEGACY_SQUARE_HANDOFF_KEY);
    return null;
  }
};

const buildSquareHandoffAnswer = (handoff: ClaritySquareHandoff) => {
  const lines = [
    handoff.projectTitle ? `Project: ${cleanHandoffValue(handoff.projectTitle)}` : '',
    handoff.folderName ? `Folder: ${cleanHandoffValue(handoff.folderName)}` : '',
    `Clarity Square path: ${cleanHandoffValue(handoff.trackLabel) || handoff.track}`,
    `Intent: ${cleanHandoffValue(handoff.headline)}`,
    handoff.projectInstruction ? `Project instruction: ${cleanHandoffValue(handoff.projectInstruction)}` : '',
    `Context: ${cleanHandoffValue(handoff.context)}`,
    `Audience: ${cleanHandoffValue(handoff.audience) || 'Not clearly named yet.'}`,
    `Current blocker: ${cleanHandoffValue(handoff.blocker) || 'Not clearly named yet.'}`,
    `Desired outcome: ${cleanHandoffValue(handoff.outcome) || 'Not clearly named yet.'}`,
  ].filter(Boolean);

  return lines.join('\n');
};

const createSessionFromSquareHandoff = (handoff: ClaritySquareHandoff): SessionState => {
  const base = createInitialSession();
  const handoffAnswer = buildSquareHandoffAnswer(handoff);
  const audienceAnswer = cleanHandoffValue(handoff.audience);
  const phase1Answer = [
    cleanHandoffValue(handoff.headline),
    cleanHandoffValue(handoff.context),
    cleanHandoffValue(handoff.outcome) ? `Desired outcome: ${cleanHandoffValue(handoff.outcome)}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');
  const answers: ClarityAnswers = {
    phase1_clarity_goal: phase1Answer || handoffAnswer,
  };

  if (audienceAnswer) {
    answers.phase2_audience_problem = audienceAnswer;
  }

  const nextQuestion = buildPersonalizedQuestion('phase3_current_workflow', answers);

  return {
    ...base,
    answers,
    assistantReply:
      'I have the Clarity Square context, so we do not need to repeat the starting point. Next, I need the current workflow so the diagnosis can separate strategy, systems, and proof-safe presence.',
    currentQuestion: nextQuestion.nextQuestion,
    currentQuestionKey: 'phase3_current_workflow',
    currentQuestionLabel: nextQuestion.nextQuestionLabel || 'Current Path',
    currentQuestionPlaceholder: nextQuestion.nextQuestionPlaceholder || 'Walk through the current path, even if it is messy...',
    transcript: [
      ...base.transcript,
      {
        role: 'user',
        content: handoffAnswer,
        createdAt: handoff.createdAt,
      },
      {
        role: 'assistant',
        content:
          'I have the Clarity Square context, so we do not need to repeat the starting point. Next, I need the current workflow so the diagnosis can separate strategy, systems, and proof-safe presence.',
        createdAt: new Date().toISOString(),
      },
    ],
    contextLog: [
      cleanHandoffValue(handoff.summary) || 'Clarity Square handoff loaded into the diagnostic session.',
      cleanHandoffValue(handoff.blocker) ? `Current blocker: ${cleanHandoffValue(handoff.blocker)}` : '',
      cleanHandoffValue(handoff.outcome) ? `Desired outcome: ${cleanHandoffValue(handoff.outcome)}` : '',
    ].filter(Boolean),
    synthesis: {
      completion: audienceAnswer ? 34 : 17,
      statusLabel: 'Square context loaded',
      clarityContext:
        cleanHandoffValue(handoff.summary) ||
        'The starting intent from Clarity Square is loaded. The next step is to map workflow reality.',
      workflowDirection:
        'The Engine should now map the current path, then identify friction, human judgment boundaries, and the proof direction.',
      presenceIdeas: [
        cleanHandoffValue(handoff.outcome) || 'Turn the clarified direction into one proof-safe public artifact.',
        'Show the before-state, decision route, and next move without unsupported claims.',
        'Let content follow the clarified workflow instead of leading the strategy.',
      ],
      signalTrail: ['Clarity Square intake', 'Strategy before tools', 'Systems before scale'],
      focusTags: ['square', handoff.track, 'private'],
    },
    source: 'local',
    squareProject:
      handoff.projectId && handoff.projectTitle
        ? {
            projectId: handoff.projectId,
            folderId: handoff.folderId ?? null,
            projectTitle: cleanHandoffValue(handoff.projectTitle),
            folderName: cleanHandoffValue(handoff.folderName),
            projectInstruction: cleanHandoffValue(handoff.projectInstruction),
          }
        : null,
  };
};

const readStoredSession = (): SessionState => {
  if (typeof window === 'undefined') return createInitialSession();

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) return createInitialSession();

    const parsed = JSON.parse(stored) as Partial<SessionState>;
    const base = createInitialSession();

    return {
      ...base,
      ...parsed,
      answers: { ...base.answers, ...(parsed.answers ?? {}) },
      synthesis: { ...base.synthesis, ...(parsed.synthesis ?? {}) },
      contextLog: Array.isArray(parsed.contextLog) ? parsed.contextLog : base.contextLog,
      aiTasks: Array.isArray(parsed.aiTasks) ? parsed.aiTasks : base.aiTasks,
      transcript:
        Array.isArray(parsed.transcript) && parsed.transcript.length > 0
          ? parsed.transcript
          : base.transcript,
    };
  } catch {
    return createInitialSession();
  }
};

const exportBrief = (session: SessionState) => {
  const blob = new Blob(
    [
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          source: session.source,
          answers: session.answers,
          transcript: session.transcript,
          synthesis: session.synthesis,
        },
        null,
        2
      ),
    ],
    { type: 'application/json' }
  );

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'kramaniti-clarity-engine-brief.json';
  anchor.click();
  URL.revokeObjectURL(url);
};

// --- Custom Blur Typing Text Component ---
function BlurTypingText({ text, activeKey }: { text: string, activeKey: string }) {
  // We split by space to get individual words
  const words = text.split(' ');

  return (
    <h1 className={styles.questionTitle} key={activeKey} aria-label={text}>
      {words.map((word, index) => (
        <span
          key={`${index}-${word}`}
          className={styles.word}
          style={{ animationDelay: `${index * 80}ms` }}
        >
          {word}
        </span>
      ))}
    </h1>
  );
}

import { useAudioEngine } from '@/hooks/useAudioEngine';

export default function ClarityEnginePage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionState>(createInitialSession);
  const [draft, setDraft] = useState('');
  const [streamedAssistant, setStreamedAssistant] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [statusText, setStatusText] = useState('Awaiting your signal.');
  const [stagePhase, setStagePhase] = useState<'idle' | 'exit' | 'enter'>('idle');
  const [isInputActive, setIsInputActive] = useState(false);
  const [isTypingPulse, setIsTypingPulse] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [isBlobLoaded, setIsBlobLoaded] = useState(false);
  const [isIntroActive, setIsIntroActive] = useState(true);
  const transitionTimers = useRef<number[]>([]);
  const typingTimer = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const submitAnswerRef = useRef<(overrideAnswer?: string) => Promise<void>>(async () => {});

  const { startAmbient, playIntro, playClick, isAmbientMuted, toggleAmbientMute } = useAudioEngine();
  const { theme, toggleTheme } = useKramanitiTheme();
  const [hasLoadedStoredSession, setHasLoadedStoredSession] = useState(false);

  useEffect(() => {
    playIntro();

    const introTimer = window.setTimeout(() => {
      setIsIntroActive(false);
      setIsBlobLoaded(true);
      startAmbient();
    }, 10000);

    return () => window.clearTimeout(introTimer);
  }, [playIntro, startAmbient]);

  const deferredDraft = useDeferredValue(draft);
  const completion = session.synthesis.completion;
  const hasExport = completion >= 35 || session.transcript.length > 1;

  const hasSynthesis = completion > 0 || session.transcript.length > 1;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const squareHandoff = readClaritySquareHandoff();
      if (squareHandoff) {
        setSession(createSessionFromSquareHandoff(squareHandoff));
        setStatusText('Clarity Square context loaded.');
        setIsInputActive(true);
      } else {
        setSession(readStoredSession());
      }
      setHasLoadedStoredSession(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredSession) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [hasLoadedStoredSession, session]);

  useEffect(() => {
    return () => {
      transitionTimers.current.forEach((timer) => window.clearTimeout(timer));
      if (typingTimer.current) window.clearTimeout(typingTimer.current);
    };
  }, []);

  useEffect(() => {
    if (isInputActive && textareaRef.current) {
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isInputActive]);

  const handleDraftChange = (value: string) => {
    setDraft(value);

    // Trigger realtime pulse feedback
    if (value.trim().length > 0) {
      setIsTypingPulse(true);
      if (typingTimer.current) window.clearTimeout(typingTimer.current);
      typingTimer.current = window.setTimeout(() => {
        setIsTypingPulse(false);
      }, 300); // Pulse decays after 300ms of no typing
    }
  };

  const applyEnvelope = (
    nextTranscript: ConversationTurn[],
    envelope: AssistantEnvelope,
    nextAnswers: ClarityAnswers
  ) => {
    const assistantTurn: ConversationTurn = {
      role: 'assistant',
      content: envelope.assistantReply,
      createdAt: new Date().toISOString(),
    };

    setStreamedAssistant('');
    setIsStreaming(false);
    setStatusText('Framing the next question...');
    setStagePhase('exit');
    setIsInputActive(false);

    transitionTimers.current.forEach((timer) => window.clearTimeout(timer));
    transitionTimers.current = [];

    const swapTimer = window.setTimeout(() => {
      startTransition(() => {
        setSession((prev) => {
          const newContextLog = envelope.latestSummary
            ? [...prev.contextLog, envelope.latestSummary]
            : prev.contextLog;

          return {
            answers: nextAnswers,
            assistantReply: envelope.assistantReply,
            currentQuestion: envelope.nextQuestion,
            currentQuestionKey: envelope.nextQuestionKey,
            currentQuestionLabel: envelope.nextQuestionLabel || 'Next Step',
            currentQuestionPlaceholder: envelope.nextQuestionPlaceholder || 'Provide your thoughts...',
            transcript: [...nextTranscript, assistantTurn],
            contextLog: newContextLog,
            aiTasks: prev.aiTasks,
            synthesis: {
              completion: envelope.completion,
              statusLabel: envelope.statusLabel,
              clarityContext: envelope.clarityContext,
              workflowDirection: envelope.workflowDirection,
              presenceIdeas: envelope.presenceIdeas,
              signalTrail: envelope.signalTrail,
              focusTags: envelope.focusTags,
            },
            source: envelope.source,
            mockScenarioId: prev.mockScenarioId,
            squareProject: prev.squareProject ?? null,
          };
        });
      });

      setStagePhase('enter');
      setStatusText(
        envelope.nextQuestionKey === 'complete'
          ? 'Blueprint signal is ready.'
          : 'Next question ready.'
      );

      const settleTimer = window.setTimeout(() => {
        setStagePhase('idle');
      }, 1000); // Wait for the enter animation

      transitionTimers.current.push(settleTimer);
    }, 600); // Wait for exit animation

    transitionTimers.current.push(swapTimer);
  };

  const [isDemoMode, setIsDemoMode] = useState(false);
  const demoScenarioRef = useRef<MockScenario | null>(null);

  const resetSession = (preserveMockId?: string) => {
    transitionTimers.current.forEach((timer) => window.clearTimeout(timer));
    transitionTimers.current = [];
    const next = createInitialSession();
    if (preserveMockId) {
      next.mockScenarioId = preserveMockId;
    }
    setSession(next);
    setDraft('');
    setStreamedAssistant('');
    setIsStreaming(false);
    setIsInputActive(false);
    setIsTypingPulse(false);
    setStagePhase('enter');
    setStatusText('Session reset.');
    const resetTimer = window.setTimeout(() => {
      setStagePhase('idle');
    }, 1000);
    transitionTimers.current.push(resetTimer);
  };

  const loadSample = () => {
    import('@/lib/clarity-engine/mockData').then(({ mockScenarios }) => {
      const randomScenario = mockScenarios[Math.floor(Math.random() * mockScenarios.length)];
      demoScenarioRef.current = randomScenario;
      setIsDemoMode(true);
      resetSession(randomScenario.id);
    });
  };

  async function submitAnswer(overrideAnswer?: string) {
    const answer = (overrideAnswer || draft).trim();

    if (!answer || isStreaming || session.currentQuestionKey === 'complete') return;

    const isAiTask = answer.startsWith('[AI Task]');

    const nextAnswers: ClarityAnswers = {
      ...session.answers,
      [session.currentQuestionKey]: answer,
    };

    const userTurn: ConversationTurn = {
      role: 'user',
      content: answer,
      createdAt: new Date().toISOString(),
    };

    const nextTranscript = [...session.transcript, userTurn];

    setSession((current) => {
      const updatedTasks = isAiTask
        ? [...current.aiTasks, { label: current.currentQuestionLabel, question: current.currentQuestion }]
        : current.aiTasks;

      return {
        ...current,
        answers: nextAnswers,
        transcript: nextTranscript,
        aiTasks: updatedTasks,
      };
    });
    setDraft('');
    setStreamedAssistant('');
    setIsStreaming(true);
    setStatusText('Listening through the answer...');
    setIsInputActive(false);

    try {
      let finalEnvelope: AssistantEnvelope | null = null;

      if (isDemoMode && demoScenarioRef.current) {
        // -------------------------
        // MOCK STREAMING (Demo Mode)
        // -------------------------
        const scenario = demoScenarioRef.current;
        const currentIndex = DIAGNOSTIC_SEQUENCE.indexOf(session.currentQuestionKey);
        const nextQKey: QuestionId =
          currentIndex >= 0 && currentIndex < DIAGNOSTIC_SEQUENCE.length - 1
            ? DIAGNOSTIC_SEQUENCE[currentIndex + 1]
            : 'complete';
        const nextStep = scenario.questions[nextQKey];
        const nextQ = nextStep.question;

        const tokens = nextQ.split(' ');
        for (let i = 0; i < tokens.length; i++) {
          setStatusText('Thinking through the route...');
          setStreamedAssistant(curr => curr + (i === 0 ? '' : ' ') + tokens[i]);
          await new Promise(r => setTimeout(r, 40));
        }

        finalEnvelope = {
          assistantReply: nextStep.assistantReply,
          nextQuestionKey: nextQKey,
          nextQuestion: nextQ,
          nextQuestionLabel: nextStep.label,
          nextQuestionPlaceholder: nextStep.placeholder,
          latestSummary: answer.slice(0, 180),
          completion:
            nextQKey === 'complete'
              ? 100
              : Math.min(95, Math.round(((currentIndex + 1) / DIAGNOSTIC_SEQUENCE.length) * 100)),
          statusLabel: nextQKey === 'complete' ? 'Blueprint ready' : currentIndex >= 2 ? 'Opportunity mapping' : 'Pattern recognition',
          clarityContext: 'Demo signal is moving through Kramaniti’s diagnostic sequence.',
          workflowDirection: 'The route is being mapped from business clarity into workflow reality and AI boundaries.',
          presenceIdeas: [
            'Make the operating change visible.',
            'Use proof-safe examples instead of broad claims.',
            'Let content follow the clarified workflow.',
          ],
          signalTrail: ['Strategy before tools', 'Systems before scale', 'Content after clarity'],
          focusTags: ['diagnostic', 'workflow', 'presence'],
          source: 'local'
        };
      } else {
        // -------------------------
        // REAL API CALL
        // -------------------------
        const response = await fetch('/api/clarity-engine/chat/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answers: nextAnswers,
            transcript: nextTranscript,
            currentQuestionKey: session.currentQuestionKey,
            currentQuestion: session.currentQuestion,
            latestAnswer: answer,
          }),
        });

        if (!response.ok || !response.body) {
          throw new Error('Stream unavailable');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.trim()) continue;

            const event = JSON.parse(line) as
              | { type: 'token'; value: string }
              | { type: 'final'; data: AssistantEnvelope };

            if (event.type === 'token') {
              setStatusText('Thinking through the route...');
              setStreamedAssistant((current) => current + event.value);
            }

            if (event.type === 'final') {
              finalEnvelope = event.data;
            }
          }

          if (done) break;
        }
      }

      if (!finalEnvelope) {
        throw new Error('No final state returned');
      }

      applyEnvelope(nextTranscript, finalEnvelope, nextAnswers);
    } catch {
      const fallback = buildFallbackResponse({
        answers: nextAnswers,
        currentQuestionKey: session.currentQuestionKey,
        latestAnswer: answer,
      });

      applyEnvelope(nextTranscript, fallback, nextAnswers);
    }
  }

  useEffect(() => {
    submitAnswerRef.current = submitAnswer;
  });

  // Demo Mode Automation Driver
  useEffect(() => {
    let timeoutId: number;

    if (!isDemoMode || isStreaming || session.currentQuestionKey === 'complete') {
      if (session.currentQuestionKey === 'complete' && isDemoMode) {
        timeoutId = window.setTimeout(() => setIsDemoMode(false), 0);
      }
      return () => window.clearTimeout(timeoutId);
    }

    const scenario = demoScenarioRef.current;
    if (!scenario) return;

    const key = session.currentQuestionKey;
    const targetAnswer = scenario.answers[key] || '';
    if (!targetAnswer) return;

    setIsInputActive(true);
    let i = 0;

    const typeChar = () => {
      if (i < targetAnswer.length) {
        setDraft(targetAnswer.substring(0, i + 3)); // Type 3 chars at a time
        i += 3;
        timeoutId = window.setTimeout(typeChar, 10);
      } else {
        timeoutId = window.setTimeout(() => {
          void submitAnswerRef.current(targetAnswer);
        }, 500);
      }
    };

    timeoutId = window.setTimeout(typeChar, 1000);
    return () => window.clearTimeout(timeoutId);
  }, [isDemoMode, isStreaming, session.currentQuestionKey]);

  const seedExample = () => {
    setDraft(SAMPLE_ANSWER);
    setStatusText('Example response loaded.');
    setIsInputActive(true);
  };

  // Determine Character State
  let charStateClass = styles.charIdle;
  if (isIntroActive) {
    charStateClass = styles.charIntro;
  } else if (isStreaming) {
    charStateClass = styles.charThinking;
  } else if (isTypingPulse) {
    charStateClass = styles.charTypingPulse;
  } else if (isInputActive) {
    charStateClass = styles.charListening;
  } else if (stagePhase === 'exit' || stagePhase === 'enter') {
    charStateClass = styles.charThinking; // Keep it active while moving layers
  }

  const panelClassName = [
    styles.glassPanel,
    stagePhase === 'exit' ? styles.stageExit : '',
    stagePhase === 'enter' ? styles.stageEnter : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleMorphClick = () => {
    if (!isInputActive) {
      setIsInputActive(true);
    }
  };

  return (
    <div className={`${styles.canvas} ${isIntroActive ? styles.introActive : ''}`} onClick={startAmbient}>
      {/* Background Ambience */}
      <div className={styles.canvasBgGlow} />
      <div className={styles.canvasNoise} />

      {/* Header */}
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          <Home size={14} />
          <span>Kramaniti</span>
          <strong>Clarity Engine</strong>
        </Link>
        <div className={styles.headerActions}>
          <button
            className={`${styles.actionBtn} shockwave-btn`}
            onClick={(e) => { e.stopPropagation(); playClick(); loadSample(); }}
            disabled={isDemoMode}
            style={{ borderColor: 'rgba(201, 168, 76, 0.4)', color: '#C9A84C' }}
          >
            <Wand2 size={14} />
            Load Sample
          </button>
          <div className={styles.controlDock} onClick={playClick}>
            <button
              className={`${styles.controlIconBtn} ${styles.actionBtn}`}
              onClick={(e) => {
                e.stopPropagation();
                playClick();
                toggleTheme();
              }}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button
              className={`${styles.controlIconBtn} ${styles.actionBtn}`}
              onClick={(e) => {
                e.stopPropagation();
                playClick();
                toggleAmbientMute();
              }}
              title={isAmbientMuted ? "Unmute Ambient Audio" : "Mute Ambient Audio"}
              aria-label={isAmbientMuted ? "Unmute Ambient Audio" : "Mute Ambient Audio"}
            >
              {isAmbientMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <button
              className={`${styles.controlIconBtn} ${styles.actionBtn} no-shockwave`}
              onClick={(e) => { e.stopPropagation(); playClick(); resetSession(); }}
              disabled={isDemoMode}
              title="Reset diagnostic"
              aria-label="Reset diagnostic"
            >
              <RefreshCw size={14} />
            </button>
            {hasSynthesis && (
              <>
                <span className={styles.controlDivider} aria-hidden="true" />
              <div className={styles.progressBarWrapper}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${Math.min(100, Math.max(10, completion))}%` }}
                />
              </div>
              <button
                className={`${styles.actionBtn} ${styles.synthesisBtn} ${completion > 10 ? styles.synthesisBtnPulse : ''}`}
              >
                Synthesis ({completion}%)
              </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Dual Column Layout */}
      <div className={styles.layoutWrapper}>

        {/* Left Column: Interaction */}
        <div className={styles.interactionColumn}>
          {/* Central Character Entity */}
          <div className={styles.characterContainer}>
            <div className={`${styles.blobWrapper} ${charStateClass}`}>
              <div className={styles.introHalo} aria-hidden="true" />
              <div className={styles.introScanLine} aria-hidden="true" />
              <div className={`${styles.introPrinciple} ${styles.introPrincipleStrategy}`} aria-hidden="true">
                Strategy
              </div>
              <div className={`${styles.introPrinciple} ${styles.introPrincipleSystems}`} aria-hidden="true">
                Systems
              </div>
              <div className={`${styles.introPrinciple} ${styles.introPrinciplePresence}`} aria-hidden="true">
                Presence
              </div>
              <div className={styles.orbit1} />
              <div className={styles.orbit2} />
              <div className={styles.assistantBlob} />
            </div>
            <div className={styles.introCaption} aria-hidden={!isIntroActive}>
              <span>Kramaniti Clarity Engine</span>
              <strong>Strategy before tools.</strong>
              <p>Systems before scale. Content after clarity.</p>
            </div>
          </div>

          {/* Main Stage (Glass Panel with Questions & Input) */}
          <section className={styles.mainStage} style={{ opacity: isBlobLoaded && !isIntroActive ? 1 : 0, transition: 'opacity 0.8s ease', pointerEvents: isBlobLoaded && !isIntroActive ? 'auto' : 'none' }}>
            <div className={panelClassName}>

              {/* Active Question with Blur-Typing Effect */}
              <div className={styles.questionBlock}>
                <div className={styles.questionContentWrapper}>
                  <span className={styles.questionLabel}>
                    {session.currentQuestionLabel || 'Next Step'}
                  </span>
                  <BlurTypingText
                    text={session.currentQuestion}
                    activeKey={session.currentQuestionKey}
                  />
                </div>
              </div>

              {/* Morphing Input */}
              {session.currentQuestionKey !== 'complete' && (
                <div className={styles.morphContainer}>
                  <div className={styles.actionRow}>

                    {/* Primary Signal Button / Input Field */}
                    {!isInputActive && (
                      <button
                        type="button"
                        className={`${styles.morphElement} shockwave-btn ${styles.morphStateBtn}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          playClick();
                          handleMorphClick();
                        }}
                      >
                        <span className={styles.btnContent}>Provide Signal</span>
                      </button>
                    )}

                    {isInputActive && (
                      <div className={`${styles.morphElement} ${styles.morphStateField}`}>
                        <div className={styles.fieldContent}>
                          <textarea
                            ref={textareaRef}
                            className={styles.glassInput}
                            value={draft}
                            onChange={(event) => handleDraftChange(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' && !event.shiftKey) {
                                event.preventDefault();
                                playClick();
                                void submitAnswer();
                              }
                            }}
                            placeholder={session.currentQuestionPlaceholder || 'Provide your thoughts...'}
                          />
                          <div className={styles.inputFooter}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(201, 168, 76, 0.8)' }} />
                              {deferredDraft ? `${deferredDraft.length}/900` : statusText}
                            </div>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                              <button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); playClick(); seedExample(); }}>
                                Load example
                              </button>
                              <button className={styles.submitBtn} onClick={(e) => { e.stopPropagation(); playClick(); void submitAnswer(); }} disabled={isStreaming || !draft.trim()}>
                                {isStreaming ? 'Mapping...' : 'Submit'}
                                {isStreaming ? <Loader2 size={12} className={styles.spin} /> : null}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Secondary AI Task Button */}
                    {!isInputActive && (
                      <button
                        className={`${styles.morphElement} ${styles.secondaryActionBtn}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          playClick();
                          void submitAnswer("[AI Task] I am not sure about this yet. Please mark this as a task for the AI to figure out and move to the next step.");
                        }}
                      >
                        <span>I don&apos;t know</span>
                      </button>
                    )}

                  </div>
                </div>
              )}

              {session.currentQuestionKey === 'complete' && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
                  <button
                    className={styles.submitBtn}
                    style={{ height: '48px', padding: '0 32px', fontSize: '14px', borderRadius: '24px' }}
                    onClick={() => {
                      playClick();
                      const payload = {
                        answers: session.answers,
                        transcript: session.transcript,
                        aiTasks: session.aiTasks,
                        contextLog: session.contextLog,
                        mockScenarioId: session.mockScenarioId,
                        squareProject: session.squareProject ?? null,
                      };
                      sessionStorage.setItem('kramaniti-blueprint-session', JSON.stringify(payload));
                      router.push('/clarity-engine/blueprint');
                    }}
                  >
                    Generate Blueprint
                  </button>
                </div>
              )}

            </div>
          </section>
        </div>

        {/* Right Column: Context Gathering */}
        <aside className={styles.contextSidebar}>
          <div className={styles.contextHeader}>
            <span className={styles.contextTitle}>Gathered Context</span>
            <div className={styles.focusTags}>
              {session.synthesis.focusTags.map(tag => (
                <span key={tag} className={styles.tagBadge}>{tag}</span>
              ))}
            </div>
          </div>

          <div className={styles.contextBody}>
            <p className={styles.assistantCopy}>
              {streamedAssistant || session.assistantReply}
              {isStreaming && <span className={styles.cursor} />}
            </p>

            <div className={styles.signalList}>
              {session.contextLog.map((log, idx) => (
                <div key={idx} className={styles.signalItem}>
                  <span>{log}</span>
                </div>
              ))}
            </div>

            {session.aiTasks.length > 0 && (
              <div className={styles.tasksAccordion}>
                <button
                  className={styles.tasksHeader}
                  onClick={() => setIsTasksOpen(!isTasksOpen)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>AI Tasks ({session.aiTasks.length})</span>
                  </div>
                  {isTasksOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {isTasksOpen && (
                  <div className={styles.tasksBody}>
                    {session.aiTasks.map((task, idx) => (
                      <div key={idx} className={styles.taskItem}>
                        <span className={styles.taskLabel}>{task.label}</span>
                        <p className={styles.taskQuestion}>{task.question}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>

      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <span className={styles.footerText}>
            <CornerDownLeft size={12} />
            Your clarity stays private inside this session.
          </span>
        </div>
        <div className={styles.footerRight}>
          {hasExport && (
            <button className={styles.actionBtn} onClick={() => exportBrief(session)}>
              <Download size={14} />
              Export Brief
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

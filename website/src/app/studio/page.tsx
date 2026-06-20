'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BadgeCheck,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GitBranch,
  Loader2,
  Moon,
  RefreshCw,
  Route,
  Send,
  ShieldCheck,
  Sun,
} from 'lucide-react';
import styles from './studio.module.css';
import {
  AGENT_CONSOLE_NAV,
  AGENT_CONSOLE_STORAGE_KEY,
  DEFAULT_CONSOLE_STATE,
  createDefaultAgentTasks,
  getRouteById,
  routeFounderRequest,
} from '../../lib/studio/agentOS';
import type { AgentConsoleState, AgentRoute, AgentTaskStatus, StudioAgentTask } from '../../lib/studio/agentOS';

type Theme = 'dark' | 'light';

type StudioStreamEvent =
  | { type: 'route'; route: AgentRoute; source: 'groq' | 'local' }
  | { type: 'agents_planned'; tasks: StudioAgentTask[] }
  | { type: 'agent_started'; index: number }
  | { type: 'agent_completed'; index: number; task: StudioAgentTask }
  | {
      type: 'complete';
      content?: string;
      tasks?: StudioAgentTask[];
      source?: 'groq' | 'local';
      memoryNote?: string;
      approvalGate?: string;
    }
  | { type: 'error'; error?: string };

const STATUS_SEQUENCE: AgentTaskStatus[] = ['Input', 'Routed', 'Drafted', 'In review', 'Approved'];

const statusActions: Record<AgentTaskStatus, string> = {
  Input: 'Ask Studio',
  Routed: 'Generate Draft',
  Drafted: 'Send to Review',
  'In review': 'Approve',
  Approved: 'Approved',
};

const PROCESS_STEPS = [
  {
    title: 'Read Request',
    detail: 'Understanding what kind of work this is.',
  },
  {
    title: 'Create Agents',
    detail: 'Selecting the lead and support agents.',
  },
  {
    title: 'Assign Tasks',
    detail: 'Giving every agent one clear task.',
  },
  {
    title: 'Run Agents',
    detail: 'Each agent completes its own output.',
  },
  {
    title: 'Show Outputs',
    detail: 'Combining the short completed work.',
  },
];

const readStoredConsoleState = (): AgentConsoleState => {
  if (typeof window === 'undefined') return DEFAULT_CONSOLE_STATE;

  try {
    const storedState = window.localStorage.getItem(AGENT_CONSOLE_STORAGE_KEY);
    if (!storedState) return DEFAULT_CONSOLE_STATE;

    const parsedState = JSON.parse(storedState) as Partial<AgentConsoleState>;
    const route = parsedState.routeId ? getRouteById(parsedState.routeId) : routeFounderRequest(parsedState.request ?? '');

    return {
      request: parsedState.request ?? DEFAULT_CONSOLE_STATE.request,
      context: parsedState.context ?? DEFAULT_CONSOLE_STATE.context,
      routeId: route.id,
      status: parsedState.status ?? DEFAULT_CONSOLE_STATE.status,
      draftResponse: parsedState.draftResponse ?? DEFAULT_CONSOLE_STATE.draftResponse,
      responseSource: parsedState.responseSource ?? DEFAULT_CONSOLE_STATE.responseSource,
      agentTasks: Array.isArray(parsedState.agentTasks) ? parsedState.agentTasks : DEFAULT_CONSOLE_STATE.agentTasks,
      memoryNote: parsedState.memoryNote ?? DEFAULT_CONSOLE_STATE.memoryNote,
      updatedAt: parsedState.updatedAt ?? DEFAULT_CONSOLE_STATE.updatedAt,
    };
  } catch (storageError) {
    console.warn('Could not load Studio console state from local storage.', storageError);
    return DEFAULT_CONSOLE_STATE;
  }
};

export default function KramanitiStudio() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [consoleState, setConsoleState] = useState<AgentConsoleState>(DEFAULT_CONSOLE_STATE);
  const [hasLoadedStoredState, setHasLoadedStoredState] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeProcessStep, setActiveProcessStep] = useState(0);
  const [activeAgentIndex, setActiveAgentIndex] = useState(-1);
  const [error, setError] = useState('');

  const route = useMemo<AgentRoute>(
    () => getRouteById(consoleState.routeId) ?? routeFounderRequest(consoleState.request),
    [consoleState.request, consoleState.routeId]
  );

  const currentStatusIndex = STATUS_SEQUENCE.findIndex((status) => status === consoleState.status);
  const nextAction = statusActions[consoleState.status];
  const hasRequest = consoleState.request.trim().length > 0;
  const hasStartedRun = isGenerating || consoleState.status !== 'Input' || Boolean(consoleState.draftResponse);
  const visibleAgentTasks = hasStartedRun ? consoleState.agentTasks : [];

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setConsoleState(readStoredConsoleState());
      setHasLoadedStoredState(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredState) return;

    try {
      window.localStorage.setItem(AGENT_CONSOLE_STORAGE_KEY, JSON.stringify(consoleState));
    } catch (storageError) {
      console.warn('Could not save Studio console state to local storage.', storageError);
    }
  }, [consoleState, hasLoadedStoredState]);

  const updateConsoleState = (updates: Partial<AgentConsoleState>) => {
    setConsoleState((current) => ({
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  };

  const submitRequest = async () => {
    if (!hasRequest) return;
    setError('');

    const nextRoute = routeFounderRequest(consoleState.request, consoleState.context);
    const plannedTasks = createDefaultAgentTasks(nextRoute, consoleState.request);
    updateConsoleState({
      routeId: nextRoute.id,
      status: 'Routed',
      draftResponse: '',
      responseSource: '',
      agentTasks: plannedTasks,
      memoryNote: buildMemoryNote(consoleState.request, nextRoute),
    });
    setActiveProcessStep(0);
    setActiveAgentIndex(-1);
    setIsGenerating(true);

    try {
      const responsePromise = fetch('/api/studio/route/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request: consoleState.request,
          context: consoleState.context,
          routeId: nextRoute.id,
          stream: true,
        }),
      });

      const response = await responsePromise;

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? 'Studio route failed.');
      }

      if (!response.body) {
        throw new Error('Studio route did not return an orchestration stream.');
      }

      await readStudioStream(response, (event) => {
        if (event.type === 'route') {
          updateConsoleState({
            routeId: event.route.id,
            responseSource: event.source,
          });
          setActiveProcessStep(1);
          return;
        }

        if (event.type === 'agents_planned') {
          updateConsoleState({
            status: 'Routed',
            agentTasks: event.tasks,
          });
          setActiveProcessStep(2);
          return;
        }

        if (event.type === 'agent_started') {
          setActiveAgentIndex(event.index);
          setActiveProcessStep(3);
          return;
        }

        if (event.type === 'agent_completed') {
          setConsoleState((current) => {
            const nextTasks = [...current.agentTasks];
            nextTasks[event.index] = event.task;

            return {
              ...current,
              agentTasks: nextTasks,
              updatedAt: new Date().toISOString(),
            };
          });
          setActiveAgentIndex(event.index + 1);
          return;
        }

        if (event.type === 'complete') {
          updateConsoleState({
            routeId: nextRoute.id,
            status: 'Drafted',
            draftResponse: event.content ?? '',
            responseSource: event.source ?? 'local',
            agentTasks: event.tasks ?? plannedTasks,
            memoryNote: event.memoryNote || buildMemoryNote(consoleState.request, nextRoute, event.content),
          });
          setActiveProcessStep(PROCESS_STEPS.length - 1);
          setActiveAgentIndex((event.tasks ?? plannedTasks).length);
          return;
        }

        if (event.type === 'error') {
          throw new Error(event.error ?? 'Studio orchestration failed.');
        }
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Studio could not generate a response.');
      updateConsoleState({ status: 'Routed' });
    } finally {
      setIsGenerating(false);
    }
  };

  const advanceStatus = () => {
    if (!hasRequest || isGenerating) return;

    if (consoleState.status === 'Input' || consoleState.status === 'Routed') {
      void submitRequest();
      return;
    }

    const nextStatus = STATUS_SEQUENCE[Math.min(currentStatusIndex + 1, STATUS_SEQUENCE.length - 1)];
    updateConsoleState({ status: nextStatus });
  };

  const resetConsole = () => {
    setConsoleState({
      ...DEFAULT_CONSOLE_STATE,
      updatedAt: new Date().toISOString(),
    });
    setActiveAgentIndex(-1);
    setActiveProcessStep(0);
    setError('');
  };

  const routeAfterTyping = (request: string, context = consoleState.context) => {
    const nextRoute = routeFounderRequest(request, context);
    updateConsoleState({
      request,
      routeId: nextRoute.id,
      status: request.trim() ? 'Input' : 'Input',
      draftResponse: '',
      responseSource: '',
      agentTasks: [],
      memoryNote: request.trim() ? buildMemoryNote(request, nextRoute) : '',
    });
    setActiveAgentIndex(-1);
    setActiveProcessStep(0);
  };

  return (
    <div className={styles.layoutContainer} data-theme={theme}>
      <div className={styles.floatingNavContainer}>
        <nav className={styles.floatingPill}>
          <div className={styles.pillLeft}>
            <button className={styles.brandName} onClick={resetConsole}>
              Kramaniti <span className={styles.studioBadge}>Studio</span>
            </button>
            <button
              className={styles.themeToggle}
              onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className={styles.progressContainer}>
              {AGENT_CONSOLE_NAV.map((item, index) => (
                <div
                  key={item.id}
                  className={`${styles.progressSegment} ${index <= currentStatusIndex ? styles.completed : ''} ${
                    item.status === consoleState.status ? styles.active : ''
                  }`}
                />
              ))}
            </div>
          </div>

          <div className={styles.pillCenter}>
            {AGENT_CONSOLE_NAV.map((item) => (
              <a key={item.id} className={styles.navItem} href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
          </div>

          <div className={styles.pillRight}>
            <button className={styles.contextualAction} onClick={advanceStatus} disabled={!hasRequest}>
              {isGenerating ? (
                <Loader2 size={14} className={styles.spin} />
              ) : consoleState.status === 'Approved' ? (
                <CheckCircle2 size={14} />
              ) : (
                <Send size={14} />
              )}
              {isGenerating ? 'Working' : nextAction}
            </button>
            <div className={styles.clientLogoContainer}>
              <div className={styles.clientLogo} title={route.leadAgent.name}>
                {route.leadAgent.name.slice(0, 1)}
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div className={styles.workspaceGrid}>
        <main className={styles.mainContent}>
          <div className={styles.pageContainer}>
            <div className={styles.studioConsoleWrapper}>
              <div className={styles.consoleAtmosphere} aria-hidden="true">
                <div className={styles.consoleOrb} />
                <div className={styles.consoleRing} />
              </div>
              <section id="input" className={styles.consoleHero}>
                <div className={styles.intakeHero}>
                  <Brain size={28} />
                  <h1>Ask once. Watch agents do the work.</h1>
                  <p>
                    Studio reads your request, creates the right agent team, assigns one task to each agent, and
                    shows the short output from each one.
                  </p>
                  <div className={styles.heroActions}>
                    <button className={styles.primaryButton} onClick={advanceStatus} disabled={!hasRequest}>
                      {isGenerating ? <Loader2 size={16} className={styles.spin} /> : <GitBranch size={16} />}
                      {isGenerating ? 'Working' : nextAction}
                    </button>
                    <button className={styles.secondaryButton} onClick={resetConsole}>
                      <RefreshCw size={16} />
                      Reset
                    </button>
                  </div>
                </div>

                <div className={styles.intakeForm}>
                  <div className={styles.consoleSignal}>
                    <span>Live route</span>
                    <strong>{route.label}</strong>
                    <p>{route.leadAgent.name}</p>
                  </div>
                  <label>
                    Ask Studio
                    <textarea
                      className={styles.textarea}
                      value={consoleState.request}
                      onChange={(event) => routeAfterTyping(event.target.value)}
                      placeholder="Example: Help me plan a LinkedIn content workflow for Kramaniti, with approval gates before anything public."
                    />
                  </label>
                  <label>
                    Context, constraints, or source notes
                    <textarea
                      className={styles.textarea}
                      value={consoleState.context}
                      onChange={(event) => routeAfterTyping(consoleState.request, event.target.value)}
                      placeholder="Add constraints, target audience, source material, current state, or what approval should depend on."
                    />
                  </label>
                  <div className={styles.processPanel} aria-live="polite">
                    <div className={styles.processPanelHeader}>
                      <span>After you submit</span>
                      <strong>
                        {!hasStartedRun
                          ? 'No agents created yet'
                          : isGenerating
                          ? PROCESS_STEPS[activeProcessStep].title
                          : consoleState.draftResponse
                            ? '3 agents completed their tasks'
                            : 'Creating the agent team'}
                      </strong>
                    </div>
                    {hasStartedRun ? (
                      <div className={styles.agentBlueprintHub}>
                        <div className={styles.hubBlob}>
                          <Brain size={18} />
                        </div>
                        <div>
                          <span>Master Coordinator</span>
                          <strong>Creates the agent team and delegates the work</strong>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.agentEmptyState}>
                        <strong>Type a request, then press Ask Studio.</strong>
                        <p>Studio will decide which agents are needed and show task delegation here.</p>
                      </div>
                    )}
                    {visibleAgentTasks.length > 0 && (
                      <>
                        <div className={styles.agentWorkbenchHeader}>
                          <span>Created agents</span>
                          <strong>{consoleState.draftResponse ? 'Outputs completed' : 'Delegation in progress'}</strong>
                        </div>
                        <div className={styles.delegationFlow}>
                          {visibleAgentTasks.map((task, index) => (
                            <div key={`${task.agentName}-delegation-${index}`}>
                              <span>{index === 0 ? 'Lead' : `Support ${index}`}</span>
                              <strong>{task.agentName}</strong>
                            </div>
                          ))}
                        </div>
                        <div className={styles.subAgentGrid}>
                          {visibleAgentTasks.map((task, index) => {
                            const isDone = Boolean(task.output) && !task.output.toLowerCase().startsWith('awaiting');
                            const isWorking = isGenerating && index === activeAgentIndex;

                            return (
                              <article
                                key={`${task.agentName}-${index}`}
                                className={`${styles.subAgentCard} ${isWorking ? styles.workingSubAgent : ''} ${
                                  isDone ? styles.doneSubAgent : ''
                                }`}
                              >
                                <span>{isDone ? 'Done' : isWorking ? 'Working' : 'Created'}</span>
                                <h3>{task.agentName}</h3>
                                <small>Assigned task</small>
                                <p>{task.task}</p>
                                {isDone ? (
                                  <div className={styles.agentShortOutput}>
                                    <small>Agent output</small>
                                    <p>{task.output}</p>
                                  </div>
                                ) : (
                                  <div className={styles.agentPendingOutput}>
                                    <small>Waiting for output</small>
                                    <p>{isWorking ? 'This agent is working now.' : 'Queued after delegation.'}</p>
                                  </div>
                                )}
                              </article>
                            );
                          })}
                        </div>
                      </>
                    )}
                    <div className={styles.processSteps}>
                      {PROCESS_STEPS.map((step, index) => {
                        const isComplete =
                          consoleState.draftResponse && !isGenerating
                            ? true
                            : isGenerating
                              ? index < activeProcessStep
                              : false;
                        const isActive = isGenerating ? index === activeProcessStep : index === 0 && !consoleState.draftResponse;

                        return (
                          <div
                            key={step.title}
                            className={`${styles.processStep} ${isActive ? styles.activeProcessStep : ''} ${
                              isComplete ? styles.completeProcessStep : ''
                            }`}
                          >
                            <span>{index + 1}</span>
                            <div>
                              <strong>{step.title}</strong>
                              <p>{step.detail}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {error && <div className={styles.errorBox}>{error}</div>}
                </div>
              </section>

              <section id="route" className={styles.consoleSection}>
                <Header eyebrow="Routing Decision" title="Master Coordinator routes the work." subtitle={route.reason} />
                <div className={styles.consoleRouteGrid}>
                  <article className={styles.systemCard}>
                    <div className={styles.systemIcon}>
                      <Route size={22} />
                    </div>
                    <span className={styles.orderLabel}>Lead agent</span>
                    <h3>{route.leadAgent.name}</h3>
                    <p>{route.leadAgent.description}</p>
                    <div className={styles.systemMeta}>
                      <strong>Role</strong>
                      {route.leadAgent.analogue}
                    </div>
                  </article>

                  <article className={styles.card}>
                    <div className={styles.cardGlow} />
                    <div className={styles.cardTitle}>Supporting agents</div>
                    <div className={styles.agentRail}>
                      {route.supportingAgents.map((agent) => (
                        <span key={agent.id}>{agent.name}</span>
                      ))}
                    </div>
                    <div className={styles.readOnlyHighlight}>{route.approvalGate}</div>
                  </article>
                </div>
              </section>

              <section id="review" className={styles.consoleSection}>
                <Header
                  eyebrow="Draft and Review"
                  title="The agent prepares, governance protects."
                  subtitle="The console separates useful drafting from decisions that need founder approval."
                />
                <div className={styles.consoleReviewGrid}>
                  <article className={styles.card}>
                    <div className={styles.cardGlow} />
                    <div className={styles.cardTitle}>
                      Studio response
                      {consoleState.responseSource && (
                        <span className={styles.sourceBadge}>
                          {consoleState.responseSource === 'groq' ? 'Groq' : 'Local fallback'}
                        </span>
                      )}
                    </div>
                    {consoleState.draftResponse && consoleState.agentTasks.length > 0 ? (
                      <div className={styles.agentOutputList}>
                        {consoleState.agentTasks.map((task, index) => (
                          <article key={`${task.agentName}-output-${index}`}>
                            <span>{task.agentName}</span>
                            <strong>{task.role}</strong>
                            <p>{task.output}</p>
                          </article>
                        ))}
                      </div>
                    ) : consoleState.draftResponse ? (
                      <pre className={styles.draftResponse}>{consoleState.draftResponse}</pre>
                    ) : (
                      <div className={styles.draftList}>
                        {route.draftOutputs.map((output) => (
                          <div key={output}>
                            <FileText size={16} />
                            <span>{output}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>

                  <article className={styles.card}>
                    <div className={styles.cardGlow} />
                    <div className={styles.cardTitle}>Governance check</div>
                    <div className={styles.governanceChecklist}>
                      {route.governanceChecks.map((check) => (
                        <div key={check}>
                          <ShieldCheck size={16} />
                          <span>{check}</span>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>

                <div className={styles.approvalBar}>
                  <div>
                    <span>Status</span>
                    <strong>{consoleState.status}</strong>
                    <p>{route.nextAction}</p>
                  </div>
                  <button className={styles.primaryButton} onClick={advanceStatus} disabled={!hasRequest}>
                    {isGenerating ? <Loader2 size={16} className={styles.spin} /> : <ClipboardCheck size={16} />}
                    {isGenerating ? 'Generating' : nextAction}
                  </button>
                </div>
              </section>

              <section id="memory" className={styles.consoleSection}>
                <Header
                  eyebrow="Memory Note"
                  title="Leave the next agent a clean record."
                  subtitle="This is browser-local operating memory only. Canonical repo updates still belong in the right docs and decision logs."
                />
                <div className={styles.memoryGrid}>
                  <article className={styles.intakeForm}>
                    <label>
                      Memory summary
                      <textarea
                        className={styles.textarea}
                        value={consoleState.memoryNote}
                        onChange={(event) => updateConsoleState({ memoryNote: event.target.value })}
                        placeholder="What changed, what was decided, what remains unresolved, and what the next agent should know."
                      />
                    </label>
                  </article>

                  <article className={styles.card}>
                    <div className={styles.cardGlow} />
                    <div className={styles.cardTitle}>Approval boundaries</div>
                    <div className={styles.governanceChecklist}>
                      {[
                        'No direct publishing from Studio.',
                        'No invented proof, testimonials, metrics, or outcomes.',
                        'No pricing, contracts, credentials, or external commitments without founder approval.',
                        'Public claims route through Proof and Governance.',
                      ].map((item) => (
                        <div key={item}>
                          <BadgeCheck size={16} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Header({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className={styles.header}>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
}

function buildMemoryNote(request: string, route: AgentRoute, response?: string) {
  const trimmedRequest = request.trim() || 'No founder request captured yet.';

  return [
    `[Fact] Founder request captured in Studio: ${trimmedRequest}`,
    `[Recommendation] Route through ${route.leadAgent.name} with ${route.supportingAgents.map((agent) => agent.name).join(', ')} as support.`,
    `[Recommendation] Approval gate: ${route.approvalGate}`,
    `[Recommendation] Next action: ${route.nextAction}`,
    response ? `[Inference] Draft response prepared: ${response.slice(0, 240)}${response.length > 240 ? '...' : ''}` : '',
  ].filter(Boolean).join('\n');
}

async function readStudioStream(response: Response, onEvent: (event: StudioStreamEvent) => void) {
  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.trim()) continue;
      onEvent(JSON.parse(line) as StudioStreamEvent);
    }
  }

  if (buffer.trim()) {
    onEvent(JSON.parse(buffer) as StudioStreamEvent);
  }
}

'use client';

import type { FormEvent, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Bot,
  Cable,
  BadgeCheck,
  Brain,
  CheckCircle2,
  CircleAlert,
  ClipboardCheck,
  ClipboardList,
  Compass,
  FileText,
  FolderKanban,
  Gauge,
  GitBranch,
  Layers3,
  Loader2,
  Moon,
  PenLine,
  Play,
  Plus,
  RadioTower,
  RefreshCw,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  Terminal,
  Users,
} from 'lucide-react';
import styles from './studio.module.css';
import { ChatbotWidget } from '../../components/studio/ChatbotWidget';
import {
  AGENT_OS_ROSTER,
  AGENT_OS_SEED_TASKS,
  AGENT_OS_STORAGE_KEY,
  AGENT_STATUS_COLUMNS,
  AGENT_TASK_TYPES,
  DEFAULT_LM_STUDIO_BASE_URL,
  DEFAULT_LM_STUDIO_MODEL,
  LM_STUDIO_CONFIG_STORAGE_KEY,
  LM_STUDIO_PROMPT_TEMPLATE,
  LM_STUDIO_SETUP_STEPS,
  getAgentById,
  getTaskTypeById,
} from '../../lib/studio/agentOS';
import { normalizeLMStudioBaseUrl } from '../../lib/studio/lmStudio';
import type { AgentOSAgent, AgentTask, AgentTaskStatus } from '../../lib/studio/agentOS';
import type { StudioIntake, StudioLayerId, StudioPlan } from '../../lib/studio/types';

const DEFAULT_INTAKE: StudioIntake = {
  companyName: '',
  website: '',
  industry: '',
  companyStage: '',
  knownContext: '',
  currentTools: '',
  priorityQuestion: '',
  researchMode: 'manual',
};

const SAMPLE_INTAKE: StudioIntake = {
  companyName: 'Nexocean',
  website: 'https://nexocean.com',
  industry: 'Recruitment operations and B2B talent services',
  companyStage: 'Growth-stage service business',
  knownContext:
    'Recruiters work across resume PDFs, job descriptions, outreach messages, and founder-led relationship context. The planning need is to identify where intelligence support would reduce manual review without removing human judgment.',
  currentTools: 'PDF resumes, spreadsheets, email, LinkedIn, internal candidate notes',
  priorityQuestion:
    'Which workflow should Kramaniti clarify first before proposing an AI-enabled recruiting support system?',
  researchMode: 'mock-web',
};

const GENERATION_STEPS = [
  'Reading company context',
  'Mapping operating friction',
  'Designing practical systems',
  'Translating into content direction',
  'Assembling planning dossier',
];

type StudioProcessKey = 'clarity' | 'systems' | 'content' | 'delivery';

type ProjectEntry = {
  id: string;
  process: StudioProcessKey;
  title: string;
  note: string;
  status: 'Open' | 'In review' | 'Approved';
};

type StudioProject = {
  id: string;
  name: string;
  branch: string;
  company: string;
  objective: string;
  updatedAt: string;
  entries: ProjectEntry[];
};

type StudioMode = 'planner' | 'agent-os';

type AgentTabKey = 'orchestrator' | 'roster' | 'tasks' | 'lm-studio' | 'runbook';

type LMStudioConfig = {
  baseUrl: string;
  model: string;
};

type LMStudioStatus = {
  state: 'idle' | 'checking' | 'ready' | 'error' | 'generating';
  message: string;
};

type AgentTaskDraft = {
  title: string;
  goal: string;
  context: string;
};

const STORAGE_KEY = 'kramaniti-studio-projects-v1';

const AGENT_TABS: Array<{
  id: AgentTabKey;
  shortLabel: string;
  label: string;
  description: string;
}> = [
  {
    id: 'orchestrator',
    shortLabel: 'Plan',
    label: 'Plan',
    description: 'Scope goals, select agents, and keep approvals visible.',
  },
  {
    id: 'roster',
    shortLabel: 'Roster',
    label: 'Agent Roster',
    description: 'Inspect standing agents, ownership, memory, and constraints.',
  },
  {
    id: 'tasks',
    shortLabel: 'Tasks',
    label: 'Task Queue',
    description: 'Route requests and move work through review states.',
  },
  {
    id: 'lm-studio',
    shortLabel: 'Model',
    label: 'Model',
    description: 'Connect to the LM Studio localhost server.',
  },
];

const PROCESS_LABELS: Record<StudioProcessKey, string> = {
  clarity: 'Clarity',
  systems: 'Systems',
  content: 'Content',
  delivery: 'Delivery',
};

const PROJECT_SEED: StudioProject[] = [
  {
    id: 'project-nexocean',
    name: 'Nexocean planning pass',
    branch: 'nexocean-recruiter-workflow',
    company: 'Nexocean',
    objective: 'Clarify recruiter workflow bottlenecks before designing internal intelligence tools.',
    updatedAt: '2026-06-09T00:00:00.000Z',
    entries: [
      {
        id: 'entry-clarity-1',
        process: 'clarity',
        title: 'Resume review friction',
        note: 'Map where recruiters lose time between PDF review, role matching, and outreach decisions.',
        status: 'Open',
      },
      {
        id: 'entry-systems-1',
        process: 'systems',
        title: 'Workflow blueprint',
        note: 'Plan intake, scoring, outreach drafting, and human approval points before any build.',
        status: 'In review',
      },
      {
        id: 'entry-content-1',
        process: 'content',
        title: 'Founder-led operating story',
        note: 'Frame the work as practical recruiting infrastructure, not automation for its own sake.',
        status: 'Open',
      },
    ],
  },
];

const readStoredProjects = () => {
  if (typeof window === 'undefined') return PROJECT_SEED;

  try {
    const storedProjects = window.localStorage.getItem(STORAGE_KEY);
    if (!storedProjects) return PROJECT_SEED;

    const parsedProjects = JSON.parse(storedProjects) as StudioProject[];
    return Array.isArray(parsedProjects) && parsedProjects.length > 0 ? parsedProjects : PROJECT_SEED;
  } catch (storageError) {
    console.warn('Could not load Studio projects from local storage.', storageError);
    return PROJECT_SEED;
  }
};

const readStoredAgentTasks = () => {
  if (typeof window === 'undefined') return AGENT_OS_SEED_TASKS;

  try {
    const storedTasks = window.localStorage.getItem(AGENT_OS_STORAGE_KEY);
    if (!storedTasks) return AGENT_OS_SEED_TASKS;

    const parsedTasks = JSON.parse(storedTasks) as AgentTask[];
    return Array.isArray(parsedTasks) && parsedTasks.length > 0 ? parsedTasks : AGENT_OS_SEED_TASKS;
  } catch (storageError) {
    console.warn('Could not load Agent OS tasks from local storage.', storageError);
    return AGENT_OS_SEED_TASKS;
  }
};

const readStoredLMStudioConfig = (): LMStudioConfig => {
  if (typeof window === 'undefined') {
    return { baseUrl: DEFAULT_LM_STUDIO_BASE_URL, model: DEFAULT_LM_STUDIO_MODEL };
  }

  try {
    const storedConfig = window.localStorage.getItem(LM_STUDIO_CONFIG_STORAGE_KEY);
    if (!storedConfig) return { baseUrl: DEFAULT_LM_STUDIO_BASE_URL, model: DEFAULT_LM_STUDIO_MODEL };

    const parsedConfig = JSON.parse(storedConfig) as Partial<LMStudioConfig>;
    const storedBaseUrl = parsedConfig.baseUrl?.includes('localhost:1234')
      ? DEFAULT_LM_STUDIO_BASE_URL
      : parsedConfig.baseUrl;

    return {
      baseUrl: storedBaseUrl || DEFAULT_LM_STUDIO_BASE_URL,
      model: parsedConfig.model || DEFAULT_LM_STUDIO_MODEL,
    };
  } catch (storageError) {
    console.warn('Could not load LM Studio config from local storage.', storageError);
    return { baseUrl: DEFAULT_LM_STUDIO_BASE_URL, model: DEFAULT_LM_STUDIO_MODEL };
  }
};

const createAgentTaskId = () => `agent-task-${Date.now()}`;

const formatAgentName = (agentId: string) => getAgentById(agentId)?.name ?? agentId.replace(/_/g, ' ');

const LAYERS: Array<{
  id: StudioLayerId;
  label: string;
  shortLabel: string;
  description: string;
}> = [
  {
    id: 'intake',
    label: 'Company Intake',
    shortLabel: 'Intake',
    description: 'Capture the founder brief and research boundary.',
  },
  {
    id: 'clarity',
    label: 'Layer 1: Clarity',
    shortLabel: 'Clarity',
    description: 'Find bottlenecks, gaps, assumptions, and operating logic.',
  },
  {
    id: 'systems',
    label: 'Layer 2: Systems',
    shortLabel: 'Systems',
    description: 'Plan practical intelligence systems around the bottlenecks.',
  },
  {
    id: 'content',
    label: 'Layer 3: Content',
    shortLabel: 'Content',
    description: 'Turn clarity and systems into aligned brand communication.',
  },
  {
    id: 'tools',
    label: 'Studio Tools',
    shortLabel: 'Tools',
    description: 'Maintain projects, entry points, research queues, and approval gates.',
  },
  {
    id: 'dossier',
    label: 'Planning Dossier',
    shortLabel: 'Dossier',
    description: 'Package the plan for proposal, audit, or next action.',
  },
];

export default function KramanitiStudio() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mode, setMode] = useState<StudioMode>('planner');
  const [activeLayer, setActiveLayer] = useState<StudioLayerId>('intake');
  const [activeAgentTab, setActiveAgentTab] = useState<AgentTabKey>('orchestrator');
  const [intake, setIntake] = useState<StudioIntake>(DEFAULT_INTAKE);
  const [plan, setPlan] = useState<StudioPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationIndex, setGenerationIndex] = useState(0);
  const [approvedLayers, setApprovedLayers] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');
  const [projects, setProjects] = useState<StudioProject[]>(readStoredProjects);
  const [activeProjectId, setActiveProjectId] = useState(() => readStoredProjects()[0]?.id ?? PROJECT_SEED[0].id);
  const [newProjectName, setNewProjectName] = useState('');
  const [newEntry, setNewEntry] = useState({
    process: 'clarity' as StudioProcessKey,
    title: '',
    note: '',
  });
  const [agentTasks, setAgentTasks] = useState<AgentTask[]>(readStoredAgentTasks);
  const [selectedAgentId, setSelectedAgentId] = useState('digital_presence_orchestrator');
  const [selectedTaskTypeId, setSelectedTaskTypeId] = useState('digital_presence_plan');
  const [agentTaskDraft, setAgentTaskDraft] = useState({
    title: 'Plan Kramaniti digital presence for the next month',
    goal: 'Create a practical operating plan with owner agents, proof gates, and publishing approval steps.',
    context: 'Start from the Digital Presence Orchestrator structure. Keep strategy before tools, systems before scale, and content after clarity.',
  });
  const [lmConfig, setLmConfig] = useState<LMStudioConfig>(readStoredLMStudioConfig);
  const [lmApiKey, setLmApiKey] = useState('');
  const [lmStatus, setLmStatus] = useState<LMStudioStatus>({
    state: 'idle',
    message: 'LM Studio server has not been checked in this browser session.',
  });
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [lmPrompt, setLmPrompt] = useState(
    'Route this goal through the Kramaniti agent team and give me a concise operating plan.'
  );
  const [lmResponse, setLmResponse] = useState('');

  const isAgentMode = mode === 'agent-os';
  const activeLayerIndex = LAYERS.findIndex((layer) => layer.id === activeLayer);
  const completedCount = plan ? 5 : activeLayer === 'intake' ? 0 : activeLayerIndex;

  const currentStep = useMemo(
    () => GENERATION_STEPS[Math.min(generationIndex, GENERATION_STEPS.length - 1)],
    [generationIndex]
  );

  const activeProject = projects.find((project) => project.id === activeProjectId) ?? projects[0];
  const selectedAgent = getAgentById(selectedAgentId) ?? AGENT_OS_ROSTER[0];
  const selectedTaskType = getTaskTypeById(selectedTaskTypeId) ?? AGENT_TASK_TYPES[0];
  const routedTaskCount = agentTasks.filter((task) => task.status !== 'Draft').length;
  const proofReviewCount = agentTasks.filter((task) =>
    task.supportingAgentIds.includes('proof_governance_auditor')
  ).length;

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (storageError) {
      console.warn('Could not save Studio projects to local storage.', storageError);
    }
  }, [projects]);

  useEffect(() => {
    try {
      window.localStorage.setItem(AGENT_OS_STORAGE_KEY, JSON.stringify(agentTasks));
    } catch (storageError) {
      console.warn('Could not save Agent OS tasks to local storage.', storageError);
    }
  }, [agentTasks]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        LM_STUDIO_CONFIG_STORAGE_KEY,
        JSON.stringify({
          baseUrl: normalizeLMStudioBaseUrl(lmConfig.baseUrl),
          model: lmConfig.model,
        })
      );
    } catch (storageError) {
      console.warn('Could not save LM Studio config to local storage.', storageError);
    }
  }, [lmConfig]);

  const updateIntake = (key: keyof StudioIntake, value: string) => {
    setIntake((current) => ({ ...current, [key]: value }));
  };

  const switchMode = (nextMode: StudioMode) => {
    setMode(nextMode);
    if (nextMode === 'agent-os') {
      setActiveAgentTab('orchestrator');
    }
  };

  const runMockPlanner = async (event?: FormEvent) => {
    event?.preventDefault();
    setError('');
    setIsGenerating(true);
    setGenerationIndex(0);
    setApprovedLayers({});
    setActiveLayer('clarity');

    const interval = window.setInterval(() => {
      setGenerationIndex((current) => Math.min(current + 1, GENERATION_STEPS.length - 1));
    }, 520);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 2200));
      const response = await fetch('/api/studio/plan/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(intake),
      });

      if (!response.ok) {
        throw new Error('Studio planner failed.');
      }

      const data = (await response.json()) as { plan: StudioPlan };
      setPlan(data.plan);
      setActiveLayer('clarity');
    } catch (plannerError) {
      console.error(plannerError);
      setError('The mock planning engine could not assemble a dossier. Please retry the planning pass.');
      setActiveLayer('intake');
    } finally {
      window.clearInterval(interval);
      setIsGenerating(false);
      setGenerationIndex(0);
    }
  };

  const approveLayer = (layer: StudioLayerId) => {
    setApprovedLayers((current) => ({ ...current, [layer]: true }));
  };

  const loadSample = () => {
    setIntake(SAMPLE_INTAKE);
    setPlan(null);
    setApprovedLayers({});
    setActiveLayer('intake');
    setError('');
  };

  const addProject = () => {
    const name = newProjectName.trim();
    if (!name) return;

    const id = `project-${Date.now()}`;
    const project: StudioProject = {
      id,
      name,
      branch: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'new-project',
      company: intake.companyName || name,
      objective: intake.priorityQuestion || 'Clarify the company before planning systems or content.',
      updatedAt: new Date().toISOString(),
      entries: [],
    };

    setProjects((current) => [project, ...current]);
    setActiveProjectId(id);
    setNewProjectName('');
    setActiveLayer('tools');
  };

  const addEntry = () => {
    if (!activeProject || !newEntry.title.trim()) return;

    const entry: ProjectEntry = {
      id: `entry-${Date.now()}`,
      process: newEntry.process,
      title: newEntry.title.trim(),
      note: newEntry.note.trim() || 'Manual entry added from Studio tools.',
      status: 'Open',
    };

    setProjects((current) =>
      current.map((project) =>
        project.id === activeProject.id
          ? { ...project, entries: [entry, ...project.entries], updatedAt: new Date().toISOString() }
          : project
      )
    );
    setNewEntry({ process: 'clarity', title: '', note: '' });
  };

  const updateEntryStatus = (entryId: string, status: ProjectEntry['status']) => {
    if (!activeProject) return;

    setProjects((current) =>
      current.map((project) =>
        project.id === activeProject.id
          ? {
              ...project,
              entries: project.entries.map((entry) => (entry.id === entryId ? { ...entry, status } : entry)),
              updatedAt: new Date().toISOString(),
            }
          : project
      )
    );
  };

  const routeAgentTask = () => {
    const task: AgentTask = {
      id: createAgentTaskId(),
      title: agentTaskDraft.title.trim() || selectedTaskType.label,
      goal: agentTaskDraft.goal.trim() || 'Route this request through the Kramaniti agent team.',
      context: agentTaskDraft.context.trim() || 'No additional context supplied.',
      taskTypeId: selectedTaskType.id,
      leadAgentId: selectedTaskType.leadAgentId,
      supportingAgentIds: selectedTaskType.supportingAgentIds,
      status: 'Routed',
      createdAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    };

    setAgentTasks((current) => [task, ...current]);
    setSelectedAgentId(task.leadAgentId);
    setActiveAgentTab('tasks');
  };

  const updateAgentTaskStatus = (taskId: string, status: AgentTaskStatus) => {
    setAgentTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
              lastUpdatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  };

  const buildAgentPrompt = (agent: AgentOSAgent) => {
    const taskContext = `${agentTaskDraft.title}\n\nGoal: ${agentTaskDraft.goal}\n\nContext: ${agentTaskDraft.context}`;
    const routeLead = formatAgentName(selectedTaskType.leadAgentId);
    const routeSupport = selectedTaskType.supportingAgentIds.map(formatAgentName).join(', ');

    return `${LM_STUDIO_PROMPT_TEMPLATE}

Active agent: ${agent.name}
Agent role: ${agent.description}
Hard constraints: ${agent.constraints.join('; ')}
Selected route: ${selectedTaskType.label}
Route lead agent: ${routeLead}
Supporting agents: ${routeSupport}
Approval gate: ${selectedTaskType.approvalGate}

Use exact Kramaniti agent names from the selected route. Do not invent alternate role names.

Founder request:
${taskContext}`;
  };

  const testLMStudioServer = async () => {
    const baseUrl = normalizeLMStudioBaseUrl(lmConfig.baseUrl);
    setLmConfig((current) => ({ ...current, baseUrl }));
    setLmStatus({ state: 'checking', message: `Checking ${baseUrl}/models` });
    setAvailableModels([]);

    try {
      const response = await fetch('/api/studio/lm-studio/models/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseUrl, apiKey: lmApiKey.trim() || undefined }),
      });

      const data = (await response.json()) as {
        error?: string;
        models?: string[];
      };

      if (!response.ok) {
        throw new Error(data.error ?? `LM Studio returned ${response.status}`);
      }

      const modelIds = data.models ?? [];

      setAvailableModels(modelIds as string[]);
      setLmStatus({
        state: 'ready',
        message: modelIds.length > 0 ? `Connected. Found ${modelIds.length} model entries.` : 'Connected. No models were listed yet.',
      });
      if (!lmConfig.model && modelIds[0]) {
        setLmConfig((current) => ({ ...current, model: modelIds[0] as string }));
      }
    } catch (serverError) {
      setLmStatus({
        state: 'error',
        message:
          serverError instanceof Error
            ? `${serverError.message}. Start the LM Studio server in the Developer tab and confirm the base URL.`
            : 'Could not reach LM Studio. Start the local server and retry.',
      });
    }
  };

  const sendLMStudioPrompt = async () => {
    const baseUrl = normalizeLMStudioBaseUrl(lmConfig.baseUrl);
    const model = lmConfig.model.trim();

    if (!model) {
      setLmStatus({ state: 'error', message: 'Enter the loaded LM Studio model identifier before running a prompt.' });
      return;
    }

    setLmConfig((current) => ({ ...current, baseUrl }));
    setLmStatus({ state: 'generating', message: `Sending prompt to ${model}` });
    setLmResponse('');

    try {
      const response = await fetch('/api/studio/lm-studio/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseUrl,
          apiKey: lmApiKey.trim() || undefined,
          model,
          messages: [
            {
              role: 'system',
              content: buildAgentPrompt(selectedAgent),
            },
            {
              role: 'user',
              content: lmPrompt,
            },
          ],
        }),
      });

      const data = (await response.json()) as {
        content?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? `LM Studio returned ${response.status}`);
      }

      const content = data.content ?? 'LM Studio responded, but no assistant content was returned.';
      setLmResponse(content);
      setLmStatus({ state: 'ready', message: 'Local model response received.' });
    } catch (promptError) {
      setLmStatus({
        state: 'error',
        message:
          promptError instanceof Error
            ? `${promptError.message}. Confirm the server, model identifier, and browser access to localhost.`
            : 'Could not complete the local model request.',
      });
    }
  };

  const renderContextualAction = () => {
    if (isAgentMode) {
      return (
        <button className={styles.contextualAction} onClick={() => setActiveAgentTab('tasks')}>
          <GitBranch size={14} />
          Route Task
        </button>
      );
    }

    if (isGenerating) {
      return (
        <div className={styles.contextualAction}>
          <Loader2 size={14} className={styles.spin} />
          Planning
        </div>
      );
    }

    if (!plan) {
      return (
        <button className={styles.contextualAction} onClick={() => void runMockPlanner()}>
          <Sparkles size={14} />
          Run Mock Plan
        </button>
      );
    }

    return (
      <button className={styles.contextualAction} onClick={() => setActiveLayer('dossier')}>
        <FileText size={14} />
        View Dossier
      </button>
    );
  };

  return (
    <div className={`${styles.layoutContainer} ${isAgentMode ? styles.agentModeContainer : ''}`} data-theme={theme}>
      <div className={styles.floatingNavContainer}>
        <nav className={styles.floatingPill}>
          <div className={styles.pillLeft}>
            <button className={styles.brandName} onClick={() => setActiveLayer('intake')}>
              Kramaniti <span className={styles.studioBadge}>Studio</span>
            </button>

            <div className={styles.roleSwitcher}>
              <button
                className={`${styles.roleOption} ${mode === 'planner' ? styles.activeRole : ''}`}
                onClick={() => switchMode('planner')}
              >
                Planner
              </button>
              <button
                className={`${styles.roleOption} ${mode === 'agent-os' ? styles.activeRole : ''}`}
                onClick={() => switchMode('agent-os')}
              >
                Agents
              </button>
            </div>

            <button
              className={styles.themeToggle}
              onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <div className={styles.progressContainer}>
              {(isAgentMode ? AGENT_TABS : LAYERS.slice(1)).map((item, index) => (
                  <div
                    key={item.id}
                    className={`${styles.progressSegment} ${
                      !isAgentMode && index < completedCount ? styles.completed : ''
                    } ${item.id === (isAgentMode ? activeAgentTab : activeLayer) ? styles.active : ''}`}
                  />
                ))}
            </div>
          </div>

          <div className={styles.pillCenter}>
            {isAgentMode
              ? AGENT_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    className={`${styles.navItem} ${activeAgentTab === tab.id ? styles.active : ''}`}
                    onClick={() => setActiveAgentTab(tab.id)}
                  >
                    {tab.shortLabel}
                  </button>
                ))
              : LAYERS.slice(1).map((layer) => (
                  <button
                    key={layer.id}
                    className={`${styles.navItem} ${activeLayer === layer.id ? styles.active : ''}`}
                    onClick={() => setActiveLayer(layer.id)}
                    disabled={!plan && layer.id !== 'tools' && layer.id !== 'intake'}
                  >
                    {layer.shortLabel}
                  </button>
                ))}
          </div>

          <div className={styles.pillRight}>
            {renderContextualAction()}
            <div className={styles.clientLogoContainer}>
              <div className={styles.clientLogo} title={intake.companyName || 'New plan'}>
                {(intake.companyName || 'K').slice(0, 1).toUpperCase()}
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div
        className={`${styles.workspaceGrid} ${activeLayer === 'tools' || isAgentMode ? styles.toolsWorkspaceGrid : ''} ${
          isAgentMode ? styles.agentWorkspaceGrid : ''
        }`}
      >
        {activeLayer !== 'tools' && !isAgentMode && (
          <aside className={styles.contextSidebar}>
            <div className={styles.sidebarHeader}>Planning Flow</div>
            <div className={styles.sidebarMenu}>
              {LAYERS.map((layer) => {
                const isLocked = layer.id !== 'intake' && layer.id !== 'tools' && !plan;
                return (
                  <button
                    key={layer.id}
                    className={`${styles.sidebarItem} ${activeLayer === layer.id ? styles.activeSubMenu : ''}`}
                    onClick={() => setActiveLayer(layer.id)}
                    disabled={isLocked}
                  >
                    <span className={styles.sidebarItemIcon}>
                      {approvedLayers[layer.id] ? <CheckCircle2 size={16} /> : <Layers3 size={16} />}
                    </span>
                    <span>
                      {layer.label}
                      <small>{layer.description}</small>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className={styles.sidebarPanel}>
              <div className={styles.sidebarHeader}>Inference Mode</div>
              <button
                className={`${styles.modeCard} ${intake.researchMode === 'manual' ? styles.activeModeCard : ''}`}
                onClick={() => updateIntake('researchMode', 'manual')}
              >
                <PenLine size={16} />
                Manual brief
              </button>
              <button
                className={`${styles.modeCard} ${intake.researchMode === 'mock-web' ? styles.activeModeCard : ''}`}
                onClick={() => updateIntake('researchMode', 'mock-web')}
              >
                <RadioTower size={16} />
                Mock web pass
              </button>
            </div>
          </aside>
        )}

        <main className={`${styles.mainContent} ${activeLayer === 'tools' || isAgentMode ? styles.toolsMainContent : ''}`}>
          <div className={`${styles.pageContainer} ${isAgentMode ? styles.agentPageContainer : ''}`}>
            <div
              className={`${styles.contentWrapper} ${
                activeLayer === 'tools' || isAgentMode ? styles.toolsContentWrapper : ''
              } ${isAgentMode ? styles.agentContentWrapper : ''}`}
            >
              {isGenerating && (
                <div className={styles.generationOverlay}>
                  <div className={styles.orbitalLoader}>
                    <Brain size={28} />
                  </div>
                  <h2>{currentStep}</h2>
                  <p>Mock intelligence pass in progress. The real provider layer can later swap in Groq, Cerebras, web search, and routed agents.</p>
                  <div className={styles.generationSteps}>
                    {GENERATION_STEPS.map((step, index) => (
                      <div key={step} className={index <= generationIndex ? styles.stepComplete : ''}>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!isGenerating && isAgentMode && (
                <AgentOSScreen
                  activeTab={activeAgentTab}
                  selectedAgent={selectedAgent}
                  selectedAgentId={selectedAgentId}
                  selectedTaskTypeId={selectedTaskTypeId}
                  selectedTaskType={selectedTaskType}
                  agentTasks={agentTasks}
                  routedTaskCount={routedTaskCount}
                  proofReviewCount={proofReviewCount}
                  availableModels={availableModels}
                  lmConfig={lmConfig}
                  lmApiKey={lmApiKey}
                  lmPrompt={lmPrompt}
                  lmResponse={lmResponse}
                  lmStatus={lmStatus}
                  agentTaskDraft={agentTaskDraft}
                  onSelectAgent={setSelectedAgentId}
                  onSelectTaskType={setSelectedTaskTypeId}
                  onTaskDraftChange={setAgentTaskDraft}
                  onRouteTask={routeAgentTask}
                  onUpdateTaskStatus={updateAgentTaskStatus}
                  onLMConfigChange={setLmConfig}
                  onLMApiKeyChange={setLmApiKey}
                  onLMPromptChange={setLmPrompt}
                  onTestLMStudio={testLMStudioServer}
                  onSendLMStudioPrompt={sendLMStudioPrompt}
                  onSwitchTab={setActiveAgentTab}
                />
              )}

              {!isAgentMode && !isGenerating && activeLayer === 'intake' && (
                <section className={styles.screenGrid}>
                  <div className={styles.intakeHero}>
                    <Search size={28} />
                    <h1>
                      Build the planning layer before building the system.
                    </h1>
                    <p>
                      Capture company context, create a mock clarity diagnosis, then turn that into systems and content plans.
                    </p>
                    <div className={styles.heroActions}>
                      <button className={styles.primaryButton} onClick={() => void runMockPlanner()}>
                        <Sparkles size={16} />
                        Run Mock Plan
                      </button>
                      <button className={styles.secondaryButton} onClick={loadSample}>
                        <RefreshCw size={16} />
                        Load Sample
                      </button>
                    </div>
                  </div>

                  <form className={styles.intakeForm} onSubmit={runMockPlanner}>
                    <div className={styles.formRow}>
                      <label>
                        Company
                        <input
                          className={styles.input}
                          value={intake.companyName}
                          onChange={(event) => updateIntake('companyName', event.target.value)}
                          placeholder="Company name"
                        />
                      </label>
                      <label>
                        Website
                        <input
                          className={styles.input}
                          value={intake.website}
                          onChange={(event) => updateIntake('website', event.target.value)}
                          placeholder="https://"
                        />
                      </label>
                    </div>
                    <div className={styles.formRow}>
                      <label>
                        Industry
                        <input
                          className={styles.input}
                          value={intake.industry}
                          onChange={(event) => updateIntake('industry', event.target.value)}
                          placeholder="Hospitality, recruiting, SaaS, education..."
                        />
                      </label>
                      <label>
                        Stage
                        <input
                          className={styles.input}
                          value={intake.companyStage}
                          onChange={(event) => updateIntake('companyStage', event.target.value)}
                          placeholder="Early, growth, mature, turnaround..."
                        />
                      </label>
                    </div>
                    <label>
                      Founder Context
                      <textarea
                        className={styles.textarea}
                        value={intake.knownContext}
                        onChange={(event) => updateIntake('knownContext', event.target.value)}
                        placeholder="What do you already know about the company, workflow, team, clients, or constraints?"
                      />
                    </label>
                    <label>
                      Current Tools / Surfaces
                      <input
                        className={styles.input}
                        value={intake.currentTools}
                        onChange={(event) => updateIntake('currentTools', event.target.value)}
                        placeholder="CRM, spreadsheets, WhatsApp, email, PDFs, Notion..."
                      />
                    </label>
                    <label>
                      Priority Question
                      <input
                        className={styles.input}
                        value={intake.priorityQuestion}
                        onChange={(event) => updateIntake('priorityQuestion', event.target.value)}
                        placeholder="What should this planning pass answer?"
                      />
                    </label>
                    {error && <div className={styles.errorBox}>{error}</div>}
                    <button className={styles.primaryButton} type="submit">
                      <Send size={16} />
                      Create Planning Dossier
                    </button>
                  </form>
                </section>
              )}

              {!isAgentMode && !isGenerating && activeLayer === 'clarity' && plan && (
                <section className={styles.layerScreen}>
                  <Header eyebrow="Layer 1" title="Clarity Diagnosis" subtitle={plan.clarity.summary} />
                  <div className={styles.signalGrid}>
                    {plan.researchSignals.map((signal) => (
                      <article key={signal.label} className={styles.signalCard}>
                        <span>{signal.confidence}</span>
                        <h3>{signal.label}</h3>
                        <p>{signal.detail}</p>
                      </article>
                    ))}
                  </div>
                  <div className={styles.card}>
                    <div className={styles.cardGlow} />
                    <div className={styles.cardTitle}>Operating Bottlenecks</div>
                    <div className={styles.bottleneckList}>
                      {plan.clarity.bottlenecks.map((bottleneck) => (
                        <article key={bottleneck.title} className={styles.bottleneckItem}>
                          <div>
                            <span>{bottleneck.priority}</span>
                            <h3>{bottleneck.title}</h3>
                          </div>
                          <p>{bottleneck.observation}</p>
                          <strong>{bottleneck.impact}</strong>
                        </article>
                      ))}
                    </div>
                  </div>
                  <ApprovalBar layer="clarity" approved={approvedLayers.clarity} onApprove={() => approveLayer('clarity')} onNext={() => setActiveLayer('systems')} />
                </section>
              )}

              {!isAgentMode && !isGenerating && activeLayer === 'systems' && plan && (
                <section className={styles.layerScreen}>
                  <Header eyebrow="Layer 2" title="Systems Blueprint" subtitle={plan.systems.thesis} />
                  <div className={styles.systemGrid}>
                    {plan.systems.blueprints.map((system) => (
                      <article key={system.name} className={styles.systemCard}>
                        <div className={styles.systemIcon}>
                          <Brain size={22} />
                        </div>
                        <span className={styles.orderLabel}>Build {system.buildOrder}</span>
                        <h3>{system.name}</h3>
                        <p>{system.purpose}</p>
                        <div className={styles.systemMeta}>
                          <strong>Workflow change</strong>
                          {system.workflowChange}
                        </div>
                        <div className={styles.systemMeta}>
                          <strong>Human approval</strong>
                          {system.humanApproval}
                        </div>
                      </article>
                    ))}
                  </div>
                  <div className={styles.card}>
                    <div className={styles.cardTitle}>Build Sequence</div>
                    <ol className={styles.sequenceList}>
                      {plan.systems.sequence.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  <ApprovalBar layer="systems" approved={approvedLayers.systems} onApprove={() => approveLayer('systems')} onNext={() => setActiveLayer('content')} />
                </section>
              )}

              {!isAgentMode && !isGenerating && activeLayer === 'content' && plan && (
                <section className={styles.layerScreen}>
                  <Header eyebrow="Layer 3" title="Content Alignment" subtitle={plan.content.narrative} />
                  <div className={styles.contentDirectionGrid}>
                    {plan.content.directions.map((direction) => (
                      <article key={direction.title} className={styles.contentCard}>
                        <ClipboardList size={20} />
                        <h3>{direction.title}</h3>
                        <p>{direction.angle}</p>
                        <div className={styles.formatRow}>
                          {direction.formats.map((format) => (
                            <span key={format}>{format}</span>
                          ))}
                        </div>
                        <strong>{direction.proofNeeded}</strong>
                      </article>
                    ))}
                  </div>
                  <div className={styles.readOnlyHighlight}>{plan.content.approvalGate}</div>
                  <ApprovalBar layer="content" approved={approvedLayers.content} onApprove={() => approveLayer('content')} onNext={() => setActiveLayer('dossier')} />
                </section>
              )}

              {!isAgentMode && !isGenerating && activeLayer === 'tools' && (
                <section className={styles.layerScreen}>
                  <Header
                    eyebrow="Studio Tools"
                    title="Project Operating Tools"
                    subtitle="Use local browser storage to maintain planning projects, entry points, bottlenecks, proof checks, approvals, and content seeds before a real database is selected."
                  />
                  <div className={styles.toolsShell}>
                    <aside className={styles.projectPlanner}>
                      <div className={styles.toolHeader}>
                        <FolderKanban size={20} />
                        <div>
                          <h3>Project Planner</h3>
                          <p>Select a planning branch and maintain the crucial process entries.</p>
                        </div>
                      </div>

                      <label className={styles.toolLabel}>
                        Project branch
                        <select
                          className={styles.input}
                          value={activeProject?.id ?? ''}
                          onChange={(event) => setActiveProjectId(event.target.value)}
                        >
                          {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                              {project.name}
                            </option>
                          ))}
                        </select>
                      </label>

                      <div className={styles.projectMetaCard}>
                        <span>{activeProject?.branch}</span>
                        <h3>{activeProject?.company}</h3>
                        <p>{activeProject?.objective}</p>
                      </div>

                      <div className={styles.inlineCreate}>
                        <input
                          className={styles.input}
                          value={newProjectName}
                          onChange={(event) => setNewProjectName(event.target.value)}
                          placeholder="New project name"
                        />
                        <button className={styles.iconButton} onClick={addProject} title="Create project">
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className={styles.entryComposer}>
                        <label className={styles.toolLabel}>
                          Process
                          <select
                            className={styles.input}
                            value={newEntry.process}
                            onChange={(event) =>
                              setNewEntry((current) => ({ ...current, process: event.target.value as StudioProcessKey }))
                            }
                          >
                            {Object.entries(PROCESS_LABELS).map(([key, label]) => (
                              <option key={key} value={key}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <input
                          className={styles.input}
                          value={newEntry.title}
                          onChange={(event) => setNewEntry((current) => ({ ...current, title: event.target.value }))}
                          placeholder="Crucial entry point"
                        />
                        <textarea
                          className={styles.textarea}
                          value={newEntry.note}
                          onChange={(event) => setNewEntry((current) => ({ ...current, note: event.target.value }))}
                          placeholder="Why this matters, what is blocked, or what should be clarified."
                        />
                        <button className={styles.primaryButton} onClick={addEntry}>
                          <Plus size={16} />
                          Add Entry
                        </button>
                      </div>
                    </aside>

                    <div className={styles.toolWorkspace}>
                      <div className={styles.toolGrid}>
                        <MiniToolCard
                          icon={<Gauge size={20} />}
                          title="Bottleneck Radar"
                          value={`${activeProject?.entries.filter((entry) => entry.process === 'clarity').length ?? 0} clarity signals`}
                          detail="Tracks what must be diagnosed before systems are planned."
                        />
                        <MiniToolCard
                          icon={<Search size={20} />}
                          title="Research Queue"
                          value={`${activeProject?.entries.filter((entry) => entry.status === 'Open').length ?? 0} open items`}
                          detail="Holds manual research questions until web research is connected."
                        />
                        <MiniToolCard
                          icon={<ShieldCheck size={20} />}
                          title="Proof Guardrails"
                          value="Claim-safe"
                          detail="Keeps unverified claims behind review before content or proposals."
                        />
                        <MiniToolCard
                          icon={<Target size={20} />}
                          title="Approval Queue"
                          value={`${activeProject?.entries.filter((entry) => entry.status === 'In review').length ?? 0} in review`}
                          detail="Models the human gate before any future agentic action."
                        />
                      </div>

                      <div className={styles.entryBoard}>
                        {Object.entries(PROCESS_LABELS).map(([process, label]) => {
                          const entries = activeProject?.entries.filter((entry) => entry.process === process) ?? [];
                          return (
                            <section key={process} className={styles.entryColumn}>
                              <div className={styles.entryColumnHeader}>
                                <h3>{label}</h3>
                                <span>{entries.length}</span>
                              </div>
                              {entries.length === 0 ? (
                                <p className={styles.emptyEntry}>No entries yet.</p>
                              ) : (
                                entries.map((entry) => (
                                  <article key={entry.id} className={styles.entryCard}>
                                    <div>
                                      <h4>{entry.title}</h4>
                                      <p>{entry.note}</p>
                                    </div>
                                    <select
                                      className={styles.statusSelect}
                                      value={entry.status}
                                      onChange={(event) => updateEntryStatus(entry.id, event.target.value as ProjectEntry['status'])}
                                    >
                                      <option>Open</option>
                                      <option>In review</option>
                                      <option>Approved</option>
                                    </select>
                                  </article>
                                ))
                              )}
                            </section>
                          );
                        })}
                      </div>

                      <div className={styles.agentFoundation}>
                        <h3>Mini Tools Roadmap</h3>
                        <p>
                          Next deployable tools should include a source collector, workflow map canvas, prompt/spec builder, content calendar, proposal assembler, and agent task queue. The local project model is the bridge to those tools.
                        </p>
                        <div className={styles.agentRail}>
                          {['Source Collector', 'Workflow Map', 'Spec Builder', 'Content Calendar', 'Proposal Assembler'].map((tool) => (
                            <span key={tool}>{tool}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {!isAgentMode && !isGenerating && activeLayer === 'dossier' && plan && (
                <section className={styles.layerScreen}>
                  <Header eyebrow="Final Plan" title="Planning Dossier" subtitle={plan.dossier.executiveSummary} />
                  <div className={styles.dossierGrid}>
                    <article className={styles.dossierCard}>
                      <BadgeCheck size={22} />
                      <span>Recommended Offer</span>
                      <h3>{plan.dossier.recommendedOffer}</h3>
                    </article>
                    <article className={styles.dossierCard}>
                      <FileText size={22} />
                      <span>Next Step</span>
                      <h3>{plan.dossier.nextStep}</h3>
                    </article>
                  </div>
                  <div className={styles.agentFoundation}>
                    <h3>Future Agent Foundation</h3>
                    <p>
                      This dossier can later trigger proposal drafting, content generation, agreement preparation, invoice creation, and delivery handoff agents. Each action should remain behind a human approval gate.
                    </p>
                    <div className={styles.agentRail}>
                      {['Proposal Agent', 'Content Agent', 'Agreement Agent', 'Invoice Agent'].map((agent) => (
                        <span key={agent}>{agent}</span>
                      ))}
                    </div>
                  </div>
                  <div className={styles.actionBar}>
                    <button className={styles.primaryButton} onClick={() => setActiveLayer('intake')}>
                      Start New Plan
                    </button>
                    <button className={styles.secondaryButton} onClick={() => void runMockPlanner()}>
                      Regenerate Mock
                    </button>
                  </div>
                </section>
              )}
            </div>
          </div>
        </main>
      </div>

      {!isAgentMode && <ChatbotWidget />}
    </div>
  );
}

function AgentOSScreen({
  activeTab,
  selectedAgent,
  selectedAgentId,
  selectedTaskTypeId,
  selectedTaskType,
  agentTasks,
  routedTaskCount,
  proofReviewCount,
  availableModels,
  lmConfig,
  lmApiKey,
  lmPrompt,
  lmResponse,
  lmStatus,
  agentTaskDraft,
  onSelectAgent,
  onSelectTaskType,
  onTaskDraftChange,
  onRouteTask,
  onUpdateTaskStatus,
  onLMConfigChange,
  onLMApiKeyChange,
  onLMPromptChange,
  onTestLMStudio,
  onSendLMStudioPrompt,
  onSwitchTab,
}: {
  activeTab: AgentTabKey;
  selectedAgent: AgentOSAgent;
  selectedAgentId: string;
  selectedTaskTypeId: string;
  selectedTaskType: (typeof AGENT_TASK_TYPES)[number];
  agentTasks: AgentTask[];
  routedTaskCount: number;
  proofReviewCount: number;
  availableModels: string[];
  lmConfig: LMStudioConfig;
  lmApiKey: string;
  lmPrompt: string;
  lmResponse: string;
  lmStatus: LMStudioStatus;
  agentTaskDraft: AgentTaskDraft;
  onSelectAgent: (agentId: string) => void;
  onSelectTaskType: (taskTypeId: string) => void;
  onTaskDraftChange: (draft: AgentTaskDraft) => void;
  onRouteTask: () => void;
  onUpdateTaskStatus: (taskId: string, status: AgentTaskStatus) => void;
  onLMConfigChange: (config: LMStudioConfig) => void;
  onLMApiKeyChange: (apiKey: string) => void;
  onLMPromptChange: (prompt: string) => void;
  onTestLMStudio: () => void;
  onSendLMStudioPrompt: () => void;
  onSwitchTab: (tab: AgentTabKey) => void;
}) {
  return (
    <section className={`${styles.layerScreen} ${styles.agentLayerScreen}`}>
      <div className={styles.agentOpsShell}>
        <aside className={styles.agentCommandPanel}>
          <div className={styles.toolHeader}>
            <Bot size={20} />
            <div>
              <h3>Agent Control</h3>
            </div>
          </div>

          <label className={styles.toolLabel}>
            Active agent
            <select className={styles.input} value={selectedAgentId} onChange={(event) => onSelectAgent(event.target.value)}>
              {AGENT_OS_ROSTER.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </label>

          <div className={styles.agentIdentityCard}>
            <div className={styles.agentAvatar}>{getAgentInitials(selectedAgent.name)}</div>
            <div>
              <span>{selectedAgent.layer}</span>
              <h3>{selectedAgent.name}</h3>
              <p>{selectedAgent.analogue}</p>
            </div>
          </div>

          <div className={styles.agentStatGrid}>
            <div>
              <span>Tasks</span>
              <strong>{agentTasks.length}</strong>
            </div>
            <div>
              <span>Routed</span>
              <strong>{routedTaskCount}</strong>
            </div>
            <div>
              <span>Proof</span>
              <strong>{proofReviewCount}</strong>
            </div>
            <div>
              <span>Model</span>
              <strong>{lmConfig.model ? 'Set' : 'Open'}</strong>
            </div>
          </div>

          <div className={styles.agentTabStack}>
            {AGENT_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.sidebarItem} ${activeTab === tab.id ? styles.activeSubMenu : ''}`}
                onClick={() => onSwitchTab(tab.id)}
              >
                <span className={styles.sidebarItemIcon}>{getAgentTabIcon(tab.id)}</span>
                <span>{tab.shortLabel}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className={styles.agentOpsWorkspace}>
          {activeTab === 'orchestrator' && (
            <>
              <div className={styles.agentOverviewStrip}>
                {[
                  ['Route', selectedTaskType.label],
                  ['Lead', formatAgentName(selectedTaskType.leadAgentId)],
                  ['Support', `${selectedTaskType.supportingAgentIds.length} agents`],
                  ['Gate', 'Founder approval'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>

              <TaskComposer
                selectedTaskTypeId={selectedTaskTypeId}
                draft={agentTaskDraft}
                onSelectTaskType={onSelectTaskType}
                onDraftChange={onTaskDraftChange}
                onRouteTask={onRouteTask}
              />
            </>
          )}

          {activeTab === 'roster' && (
            <div className={styles.agentRosterGrid}>
              {AGENT_OS_ROSTER.map((agent) => (
                <button
                  key={agent.id}
                  className={`${styles.agentRosterCard} ${agent.id === selectedAgentId ? styles.activeAgentCard : ''}`}
                  onClick={() => onSelectAgent(agent.id)}
                >
                  <div className={styles.agentRosterHeader}>
                    <div className={styles.agentAvatar}>{getAgentInitials(agent.name)}</div>
                    <div>
                      <span>{agent.layer}</span>
                      <h3>{agent.name}</h3>
                    </div>
                    <strong>{agent.status}</strong>
                  </div>
                  <p>{agent.description}</p>
                  <div className={styles.agentMiniList}>
                    {agent.outputs.slice(0, 3).map((output) => (
                      <span key={output}>{output}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'tasks' && (
            <>
              <TaskComposer
                selectedTaskTypeId={selectedTaskTypeId}
                draft={agentTaskDraft}
                onSelectTaskType={onSelectTaskType}
                onDraftChange={onTaskDraftChange}
                onRouteTask={onRouteTask}
              />
              <AgentTaskBoard tasks={agentTasks} onUpdateTaskStatus={onUpdateTaskStatus} />
            </>
          )}

          {activeTab === 'lm-studio' && (
            <div className={styles.localModelGrid}>
              <div className={styles.localModelPanel}>
                <div className={styles.toolHeader}>
                  <Cable size={20} />
                  <div>
                    <h3>LM Studio Bridge</h3>
                  </div>
                </div>

                <label className={styles.toolLabel}>
                  Base URL
                  <input
                    className={styles.input}
                    value={lmConfig.baseUrl}
                    onChange={(event) => onLMConfigChange({ ...lmConfig, baseUrl: event.target.value })}
                    placeholder={DEFAULT_LM_STUDIO_BASE_URL}
                  />
                </label>

                <label className={styles.toolLabel}>
                  Model identifier
                  <input
                    className={styles.input}
                    value={lmConfig.model}
                    onChange={(event) => onLMConfigChange({ ...lmConfig, model: event.target.value })}
                    placeholder="Copy from LM Studio"
                  />
                </label>

                <label className={styles.toolLabel}>
                  Optional API token
                  <input
                    className={styles.input}
                    value={lmApiKey}
                    onChange={(event) => onLMApiKeyChange(event.target.value)}
                    placeholder="Leave blank unless LM Studio auth is enabled"
                    type="password"
                  />
                </label>

                <div className={`${styles.localModelStatus} ${styles[lmStatus.state] ?? ''}`}>
                  {getLMStatusIcon(lmStatus.state)}
                  <span>{lmStatus.message}</span>
                </div>

                <div className={styles.agentHeroActions}>
                  <button className={styles.secondaryButton} onClick={onTestLMStudio}>
                    <Activity size={16} />
                    Test Server
                  </button>
                  <button className={styles.primaryButton} onClick={onSendLMStudioPrompt}>
                    <Play size={16} />
                    Run Agent Prompt
                  </button>
                </div>

                {availableModels.length > 0 && (
                  <div className={styles.modelList}>
                    {availableModels.slice(0, 6).map((model) => (
                      <button key={model} onClick={() => onLMConfigChange({ ...lmConfig, model })}>
                        {model}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.localPromptPanel}>
                <div className={styles.toolHeader}>
                  <Terminal size={20} />
                  <div>
                    <h3>Agent Prompt Console</h3>
                  </div>
                </div>
                <textarea className={styles.textarea} value={lmPrompt} onChange={(event) => onLMPromptChange(event.target.value)} />
                <div className={styles.localResponse}>
                  {lmResponse ? <pre>{lmResponse}</pre> : <p>Local model output will appear here after the LM Studio server responds.</p>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'runbook' && (
            <div className={styles.runbookGrid}>
              <div className={styles.runbookPanel}>
                <div className={styles.toolHeader}>
                  <Settings2 size={20} />
                  <div>
                    <h3>LM Studio Setup</h3>
                    <p>Use the GUI Developer tab first. The frontend uses the server after it is running.</p>
                  </div>
                </div>
                <ol className={styles.setupList}>
                  {LM_STUDIO_SETUP_STEPS.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className={styles.runbookPanel}>
                <div className={styles.toolHeader}>
                  <ClipboardCheck size={20} />
                  <div>
                    <h3>Governance Gate</h3>
                    <p>Local inference can draft and route. Public action stays approval-gated.</p>
                  </div>
                </div>
                <div className={styles.governanceChecklist}>
                  {[
                    'No direct publishing from the Agent OS.',
                    'No invented proof, testimonials, metrics, or outcomes.',
                    'No pricing, contracts, credentials, or external commitments without approval.',
                    'Public claims route through Proof and Governance.',
                    'Private client data stays out unless explicitly approved.',
                  ].map((item) => (
                    <div key={item}>
                      <CheckCircle2 size={16} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function TaskComposer({
  selectedTaskTypeId,
  draft,
  onSelectTaskType,
  onDraftChange,
  onRouteTask,
}: {
  selectedTaskTypeId: string;
  draft: AgentTaskDraft;
  onSelectTaskType: (taskTypeId: string) => void;
  onDraftChange: (draft: AgentTaskDraft) => void;
  onRouteTask: () => void;
}) {
  const route = getTaskTypeById(selectedTaskTypeId) ?? AGENT_TASK_TYPES[0];

  return (
    <div className={styles.taskComposer}>
      <div className={styles.toolHeader}>
        <GitBranch size={20} />
        <div>
          <h3>Route Task</h3>
        </div>
      </div>

      <div className={styles.taskComposerGrid}>
        <label className={styles.toolLabel}>
          Task route
          <select className={styles.input} value={selectedTaskTypeId} onChange={(event) => onSelectTaskType(event.target.value)}>
            {AGENT_TASK_TYPES.map((taskType) => (
              <option key={taskType.id} value={taskType.id}>
                {taskType.label}
              </option>
            ))}
          </select>
        </label>
        <div className={styles.routePreview}>
          <span>Lead</span>
          <strong>{formatAgentName(route.leadAgentId)}</strong>
          <p>{route.approvalGate}</p>
        </div>
      </div>

      <label className={styles.toolLabel}>
        Task title
        <input
          className={styles.input}
          value={draft.title}
          onChange={(event) => onDraftChange({ ...draft, title: event.target.value })}
          placeholder="Task title"
        />
      </label>
      <label className={styles.toolLabel}>
        Goal
        <textarea
          className={styles.textarea}
          value={draft.goal}
          onChange={(event) => onDraftChange({ ...draft, goal: event.target.value })}
          placeholder="What should the agent team achieve?"
        />
      </label>
      <label className={styles.toolLabel}>
        Context
        <textarea
          className={styles.textarea}
          value={draft.context}
          onChange={(event) => onDraftChange({ ...draft, context: event.target.value })}
          placeholder="Context, constraints, and approval needs"
        />
      </label>

      <div className={styles.supportingAgentStrip}>
        {route.supportingAgentIds.map((agentId) => (
          <span key={agentId}>{formatAgentName(agentId)}</span>
        ))}
      </div>

      <button className={styles.primaryButton} onClick={onRouteTask}>
        <GitBranch size={16} />
        Route Task
      </button>
    </div>
  );
}

function AgentTaskBoard({
  tasks,
  onUpdateTaskStatus,
}: {
  tasks: AgentTask[];
  onUpdateTaskStatus: (taskId: string, status: AgentTaskStatus) => void;
}) {
  return (
    <div className={styles.agentTaskBoard}>
      {AGENT_STATUS_COLUMNS.map((status) => {
        const matchingTasks = tasks.filter((task) => task.status === status);
        return (
          <section key={status} className={styles.entryColumn}>
            <div className={styles.entryColumnHeader}>
              <h3>{status}</h3>
              <span>{matchingTasks.length}</span>
            </div>
            {matchingTasks.length === 0 ? (
              <p className={styles.emptyEntry}>No tasks in this state.</p>
            ) : (
              matchingTasks.map((task) => (
                <article key={task.id} className={styles.agentTaskCard}>
                  <div>
                    <span>{formatAgentName(task.leadAgentId)}</span>
                    <h4>{task.title}</h4>
                    <p>{task.goal}</p>
                  </div>
                  <div className={styles.supportingAgentStrip}>
                    {task.supportingAgentIds.slice(0, 3).map((agentId) => (
                      <span key={agentId}>{formatAgentName(agentId)}</span>
                    ))}
                  </div>
                  <select
                    className={styles.statusSelect}
                    value={task.status}
                    onChange={(event) => onUpdateTaskStatus(task.id, event.target.value as AgentTaskStatus)}
                  >
                    {AGENT_STATUS_COLUMNS.map((column) => (
                      <option key={column}>{column}</option>
                    ))}
                  </select>
                </article>
              ))
            )}
          </section>
        );
      })}
    </div>
  );
}

function getAgentInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function getAgentTabIcon(tabId: AgentTabKey) {
  const iconProps = { size: 16 };
  switch (tabId) {
    case 'orchestrator':
      return <Compass {...iconProps} />;
    case 'roster':
      return <Users {...iconProps} />;
    case 'tasks':
      return <GitBranch {...iconProps} />;
    case 'lm-studio':
      return <Cable {...iconProps} />;
    case 'runbook':
      return <ClipboardCheck {...iconProps} />;
  }
}

function getLMStatusIcon(state: LMStudioStatus['state']) {
  if (state === 'checking' || state === 'generating') return <Loader2 size={16} className={styles.spin} />;
  if (state === 'ready') return <CheckCircle2 size={16} />;
  if (state === 'error') return <CircleAlert size={16} />;
  return <Activity size={16} />;
}

function Header({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <header className={styles.header}>
      <div className={styles.eyebrow}>{eyebrow}</div>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </header>
  );
}

function ApprovalBar({
  layer,
  approved,
  onApprove,
  onNext,
}: {
  layer: StudioLayerId;
  approved?: boolean;
  onApprove: () => void;
  onNext: () => void;
}) {
  return (
    <div className={styles.approvalBar}>
      <div>
        <span>{approved ? 'Approved' : 'Human approval required'}</span>
        <p>{approved ? `${layer} layer is ready for the next planning step.` : 'Keep the plan reviewable before any future agent takes action.'}</p>
      </div>
      <div className={styles.approvalActions}>
        <button className={styles.secondaryButton} onClick={onApprove}>
          <CheckCircle2 size={16} />
          Approve
        </button>
        <button className={styles.primaryButton} onClick={onNext}>
          Continue
        </button>
      </div>
    </div>
  );
}

function MiniToolCard({
  icon,
  title,
  value,
  detail,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <article className={styles.miniToolCard}>
      <div className={styles.miniToolIcon}>{icon}</div>
      <span>{title}</span>
      <h3>{value}</h3>
      <p>{detail}</p>
    </article>
  );
}

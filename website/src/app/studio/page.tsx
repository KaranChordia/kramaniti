'use client';

import type { FormEvent, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  BadgeCheck,
  Brain,
  CheckCircle2,
  ClipboardList,
  FileText,
  FolderKanban,
  Gauge,
  Layers3,
  Loader2,
  Moon,
  PenLine,
  Plus,
  RadioTower,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
} from 'lucide-react';
import styles from './studio.module.css';
import { ChatbotWidget } from '../../components/studio/ChatbotWidget';
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

const STORAGE_KEY = 'kramaniti-studio-projects-v1';

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
  const [mode, setMode] = useState<'planner' | 'agent-foundation'>('planner');
  const [activeLayer, setActiveLayer] = useState<StudioLayerId>('intake');
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

  const activeLayerIndex = LAYERS.findIndex((layer) => layer.id === activeLayer);
  const completedCount = plan ? 5 : activeLayer === 'intake' ? 0 : activeLayerIndex;

  const currentStep = useMemo(
    () => GENERATION_STEPS[Math.min(generationIndex, GENERATION_STEPS.length - 1)],
    [generationIndex]
  );

  const activeProject = projects.find((project) => project.id === activeProjectId) ?? projects[0];

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (storageError) {
      console.warn('Could not save Studio projects to local storage.', storageError);
    }
  }, [projects]);

  const updateIntake = (key: keyof StudioIntake, value: string) => {
    setIntake((current) => ({ ...current, [key]: value }));
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

  const renderContextualAction = () => {
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
    <div className={styles.layoutContainer} data-theme={theme}>
      <div className={styles.floatingNavContainer}>
        <nav className={styles.floatingPill}>
          <div className={styles.pillLeft}>
            <button className={styles.brandName} onClick={() => setActiveLayer('intake')}>
              Kramaniti <span className={styles.studioBadge}>Studio</span>
            </button>

            <div className={styles.roleSwitcher}>
              <button
                className={`${styles.roleOption} ${mode === 'planner' ? styles.activeRole : ''}`}
                onClick={() => setMode('planner')}
              >
                Planner
              </button>
              <button
                className={`${styles.roleOption} ${mode === 'agent-foundation' ? styles.activeRole : ''}`}
                onClick={() => setMode('agent-foundation')}
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
            {LAYERS.slice(1).map((layer, index) => (
                <div
                  key={layer.id}
                  className={`${styles.progressSegment} ${index < completedCount ? styles.completed : ''} ${
                    layer.id === activeLayer ? styles.active : ''
                  }`}
                />
              ))}
            </div>
          </div>

          <div className={styles.pillCenter}>
            {LAYERS.slice(1).map((layer) => (
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

      <div className={`${styles.workspaceGrid} ${activeLayer === 'tools' ? styles.toolsWorkspaceGrid : ''}`}>
        {activeLayer !== 'tools' && (
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

        <main className={`${styles.mainContent} ${activeLayer === 'tools' ? styles.toolsMainContent : ''}`}>
          <div className={styles.pageContainer}>
            <div className={`${styles.contentWrapper} ${activeLayer === 'tools' ? styles.toolsContentWrapper : ''}`}>
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

              {!isGenerating && activeLayer === 'intake' && (
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

              {!isGenerating && activeLayer === 'clarity' && plan && (
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

              {!isGenerating && activeLayer === 'systems' && plan && (
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

              {!isGenerating && activeLayer === 'content' && plan && (
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

              {!isGenerating && activeLayer === 'tools' && (
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

              {!isGenerating && activeLayer === 'dossier' && plan && (
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

      <ChatbotWidget />
    </div>
  );
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

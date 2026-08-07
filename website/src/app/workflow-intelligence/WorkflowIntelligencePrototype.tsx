'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, ArrowRight, Bot, CheckCircle2, ClipboardCheck, FileText, ShieldCheck, Users } from 'lucide-react';
import {
  createDiagnosticSummary,
  createSyntheticRecruitmentWorkflow,
  getActorName,
  type WorkflowImprovement,
  type WorkClassification,
} from '@/lib/workflow-intelligence/workflowDomain';
import styles from './WorkflowIntelligence.module.css';

const classificationLabel: Record<WorkClassification, string> = {
  human_led: 'Human-led',
  ai_assisted: 'AI-assisted',
  safely_automatable: 'Safely automatable',
};

const classificationClass: Record<WorkClassification, string> = {
  human_led: styles.human,
  ai_assisted: styles.ai,
  safely_automatable: styles.automated,
};

export function WorkflowIntelligencePrototype() {
  const [workspace] = useState(createSyntheticRecruitmentWorkflow);
  const [improvements, setImprovements] = useState(workspace.workflow.improvements);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftRationale, setDraftRationale] = useState('');
  const [summaryVisible, setSummaryVisible] = useState(false);
  const summary = useMemo(() => createDiagnosticSummary({ ...workspace, workflow: { ...workspace.workflow, improvements } }), [improvements, workspace]);

  const recordImprovement = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draftTitle.trim() || !draftRationale.trim()) return;
    const item: WorkflowImprovement = {
      id: `improvement-${improvements.length + 1}`,
      title: draftTitle.trim(),
      rationale: draftRationale.trim(),
      ownerId: 'actor-recruiter',
      status: 'proposed',
    };
    setImprovements((current) => [...current, item]);
    setDraftTitle('');
    setDraftRationale('');
  };

  const { workflow } = workspace;
  const checkpoints = workflow.steps.filter((step) => step.humanCheckpoint);

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Internal development route · synthetic data only</p>
            <h1>Workflow Intelligence</h1>
            <p className={styles.lede}>A governed current-state view of one recruitment workflow—built to test the structured method, not to promise orchestration.</p>
          </div>
          <div className={styles.accessNote}><ShieldCheck size={17} /><span>Disabled in production. No customer data, integrations, or external actions.</span></div>
        </header>

        <section className={styles.hero} aria-labelledby="workflow-title">
          <div>
            <p className={styles.kicker}>{workspace.organisation.name}</p>
            <h2 id="workflow-title">{workflow.name}</h2>
            <p>{workflow.description}</p>
          </div>
          <div className={styles.trigger}><span>Trigger</span><strong>{workflow.trigger}</strong></div>
        </section>

        <section className={styles.summaryGrid} aria-label="Workflow summary">
          <article><span className={styles.summaryIcon}><Users size={18} /></span><span>Team</span><strong>{workspace.team.name}</strong><small>{workspace.team.purpose}</small></article>
          <article><span className={styles.summaryIcon}><ArrowRight size={18} /></span><span>Route</span><strong>{workflow.steps.length} ordered steps</strong><small>{workflow.steps.filter((step) => step.handoffToStepId).length} explicit handoffs</small></article>
          <article><span className={styles.summaryIcon}><ClipboardCheck size={18} /></span><span>Human controls</span><strong>{checkpoints.length} checkpoints</strong><small>{workflow.exceptions.length} exception route</small></article>
          <article><span className={styles.summaryIcon}><AlertTriangle size={18} /></span><span>Attention</span><strong>{workflow.issues.filter((issue) => issue.severity === 'high').length} high-severity issue</strong><small>{workflow.issues.length} findings recorded</small></article>
        </section>

        <section className={styles.section} aria-labelledby="steps-heading">
          <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Current state</p><h2 id="steps-heading">Steps, owners, systems, and handoffs</h2></div><div className={styles.legend}>{(['human_led', 'ai_assisted', 'safely_automatable'] as WorkClassification[]).map((classification) => <span key={classification} className={`${styles.badge} ${classificationClass[classification]}`}>{classificationLabel[classification]}</span>)}</div></div>
          <ol className={styles.steps}>{workflow.steps.map((step) => <li key={step.id} className={styles.step}><div className={styles.stepNumber}>{String(step.sequence).padStart(2, '0')}</div><div className={styles.stepContent}><div className={styles.stepHeader}><div><h3>{step.name}</h3><p>{step.purpose}</p></div><span className={`${styles.badge} ${classificationClass[step.classification]}`}>{classificationLabel[step.classification]}</span></div><div className={styles.details}><span><b>Owner</b>{getActorName(workspace, step.ownerId)}</span><span><b>Approver</b>{getActorName(workspace, step.approverId)}</span><span><b>Systems</b>{step.systems.join(' · ')}</span><span><b>Handoff</b>{step.handoffToStepId ? workflow.steps.find((candidate) => candidate.id === step.handoffToStepId)?.name : 'Workflow outcome'}</span></div><p className={styles.rule}><b>Rule</b>{step.decisionRule}</p>{step.humanCheckpoint && <p className={styles.checkpoint}><CheckCircle2 size={16} /><span><b>Mandatory human checkpoint</b>{step.humanCheckpoint}</span></p>}<p className={styles.evidence}><FileText size={15} /><span><b>Evidence</b>{step.evidenceRequired.join(' · ')}</span></p></div></li>)}</ol>
        </section>

        <div className={styles.twoColumn}>
          <section className={styles.section} aria-labelledby="findings-heading"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Operating signal</p><h2 id="findings-heading">Bottlenecks and risks</h2></div></div><div className={styles.findings}>{workflow.issues.map((issue) => <article key={issue.id} className={`${styles.finding} ${styles[issue.severity]}`}><span>{issue.type.replace('_', ' ')}</span><h3>{issue.title}</h3><p>{issue.detail}</p><small>Observed at: {workflow.steps.find((step) => step.id === issue.stepId)?.name}</small></article>)}</div></section>
          <section className={styles.section} aria-labelledby="controls-heading"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Control design</p><h2 id="controls-heading">Escalation and measures</h2></div></div><div className={styles.controlStack}>{workflow.exceptions.map((exception) => <article key={exception.id} className={styles.exception}><Bot size={18} /><div><span>Exception trigger</span><h3>{exception.trigger}</h3><p>{exception.route}</p><small>Escalation owner: {getActorName(workspace, exception.escalationOwnerId)}</small></div></article>)}{workflow.metrics.map((metric) => <article key={metric.id} className={styles.metric}><span>{metric.name}</span><div><strong>{metric.baseline}</strong><ArrowRight size={16} /><strong>{metric.target}</strong></div><small>{metric.cadence} review</small></article>)}</div></section>
        </div>

        <div className={styles.twoColumn}>
          <section className={styles.section} aria-labelledby="improvements-heading"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Improvement queue</p><h2 id="improvements-heading">Record one next experiment</h2></div></div><form className={styles.form} onSubmit={recordImprovement}><label>Improvement title<input value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} placeholder="e.g. Add a decision-follow-up SLA" /></label><label>Why it matters<textarea value={draftRationale} onChange={(event) => setDraftRationale(event.target.value)} placeholder="State the workflow friction this addresses." rows={3} /></label><button type="submit">Record improvement</button></form><div className={styles.improvementList}>{improvements.map((item) => <article key={item.id}><span className={styles.status}>{item.status}</span><h3>{item.title}</h3><p>{item.rationale}</p><small>Owner: {getActorName(workspace, item.ownerId)}</small></article>)}</div></section>
          <section className={styles.section} aria-labelledby="history-heading"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Version history</p><h2 id="history-heading">A living operating record</h2></div></div><div className={styles.history}>{workflow.versions.map((version) => <article key={version.version}><span>v{version.version}</span><div><h3>{version.changeSummary}</h3><p>{new Date(version.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · {version.author}</p></div></article>)}</div><button type="button" className={styles.summaryButton} onClick={() => setSummaryVisible((visible) => !visible)}>{summaryVisible ? 'Hide diagnostic summary' : 'Generate diagnostic summary'}</button>{summaryVisible && <div className={styles.diagnostic}><p className={styles.eyebrow}>Diagnostic summary</p><p>{summary}</p><small>Advisory internal output only. It is not a customer report or an automated audit.</small></div>}</section>
        </div>
      </div>
    </main>
  );
}

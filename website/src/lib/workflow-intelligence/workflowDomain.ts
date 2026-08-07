export const WORK_CLASSIFICATIONS = ['human_led', 'ai_assisted', 'safely_automatable'] as const;
export const WORKFLOW_RISK_LEVELS = ['low', 'medium', 'high'] as const;

export type WorkClassification = (typeof WORK_CLASSIFICATIONS)[number];
export type WorkflowRiskLevel = (typeof WORKFLOW_RISK_LEVELS)[number];

export type WorkflowActor = {
  id: string;
  name: string;
  role: string;
  teamId: string;
};

export type WorkflowStep = {
  id: string;
  sequence: number;
  name: string;
  purpose: string;
  classification: WorkClassification;
  ownerId: string | null;
  approverId?: string | null;
  systems: string[];
  inputs: string[];
  outputs: string[];
  decisionRule: string;
  handoffToStepId: string | null;
  humanCheckpoint?: string;
  evidenceRequired: string[];
};

export type WorkflowIssue = {
  id: string;
  type: 'bottleneck' | 'risk' | 'ownership_ambiguity';
  title: string;
  detail: string;
  severity: WorkflowRiskLevel;
  stepId: string;
};

export type WorkflowException = {
  id: string;
  trigger: string;
  route: string;
  escalationOwnerId: string;
  stepId: string;
};

export type WorkflowMetric = {
  id: string;
  name: string;
  baseline: string;
  target: string;
  cadence: string;
};

export type WorkflowImprovement = {
  id: string;
  title: string;
  rationale: string;
  ownerId: string;
  status: 'proposed' | 'approved' | 'complete';
};

export type WorkflowVersion = {
  version: number;
  createdAt: string;
  changeSummary: string;
  author: string;
};

export type Workflow = {
  id: string;
  organisationId: string;
  teamId: string;
  name: string;
  description: string;
  trigger: string;
  steps: WorkflowStep[];
  issues: WorkflowIssue[];
  exceptions: WorkflowException[];
  metrics: WorkflowMetric[];
  improvements: WorkflowImprovement[];
  versions: WorkflowVersion[];
};

export type WorkflowWorkspace = {
  organisation: { id: string; name: string };
  team: { id: string; name: string; purpose: string };
  actors: WorkflowActor[];
  workflow: Workflow;
};

export type ValidationResult<T> = { value: T; errors: string[] };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string' && item.trim().length > 0);

const hasText = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

const hasId = (value: unknown, label: string, errors: string[]) => {
  if (!hasText(value)) errors.push(`${label} must be a non-empty string.`);
};

export const validateWorkflowWorkspace = (input: unknown): ValidationResult<WorkflowWorkspace | null> => {
  const errors: string[] = [];
  if (!isRecord(input) || !isRecord(input.organisation) || !isRecord(input.team) || !isRecord(input.workflow)) {
    return { value: null, errors: ['A workspace must include organisation, team, and workflow records.'] };
  }

  const { organisation, team, workflow } = input;
  hasId(organisation.id, 'Organisation id', errors);
  hasId(organisation.name, 'Organisation name', errors);
  hasId(team.id, 'Team id', errors);
  hasId(team.name, 'Team name', errors);
  hasId(team.purpose, 'Team purpose', errors);
  hasId(workflow.id, 'Workflow id', errors);
  hasId(workflow.organisationId, 'Workflow organisationId', errors);
  hasId(workflow.teamId, 'Workflow teamId', errors);
  hasId(workflow.name, 'Workflow name', errors);
  hasId(workflow.description, 'Workflow description', errors);
  hasId(workflow.trigger, 'Workflow trigger', errors);

  const actors = Array.isArray(input.actors) ? input.actors : [];
  if (!actors.length) errors.push('At least one actor is required.');
  const actorIds = new Set<string>();
  actors.forEach((actor, index) => {
    if (!isRecord(actor)) {
      errors.push(`Actor ${index + 1} must be an object.`);
      return;
    }
    hasId(actor.id, `Actor ${index + 1} id`, errors);
    hasId(actor.name, `Actor ${index + 1} name`, errors);
    hasId(actor.role, `Actor ${index + 1} role`, errors);
    hasId(actor.teamId, `Actor ${index + 1} teamId`, errors);
    if (typeof actor.id === 'string') actorIds.add(actor.id);
  });

  if (workflow.organisationId !== organisation.id) errors.push('Workflow must belong to the declared organisation.');
  if (workflow.teamId !== team.id) errors.push('Workflow must belong to the declared team.');

  const steps = Array.isArray(workflow.steps) ? workflow.steps : [];
  if (!steps.length) errors.push('At least one ordered workflow step is required.');
  const stepIds = new Set<string>();
  let expectedSequence = 1;
  steps.forEach((step, index) => {
    if (!isRecord(step)) {
      errors.push(`Step ${index + 1} must be an object.`);
      return;
    }
    hasId(step.id, `Step ${index + 1} id`, errors);
    hasId(step.name, `Step ${index + 1} name`, errors);
    hasId(step.purpose, `Step ${index + 1} purpose`, errors);
    if (step.sequence !== expectedSequence) errors.push('Workflow steps must use a complete, ordered sequence starting at 1.');
    expectedSequence += 1;
    if (!WORK_CLASSIFICATIONS.includes(step.classification as WorkClassification)) {
      errors.push(`Step ${index + 1} has an invalid work classification.`);
    }
    if (step.ownerId !== null && !actorIds.has(String(step.ownerId))) errors.push(`Step ${index + 1} references an unknown owner.`);
    if (step.approverId && !actorIds.has(String(step.approverId))) errors.push(`Step ${index + 1} references an unknown approver.`);
    if (!isStringArray(step.systems) || !isStringArray(step.inputs) || !isStringArray(step.outputs)) {
      errors.push(`Step ${index + 1} must define non-empty systems, inputs, and outputs.`);
    }
    if (!hasText(step.decisionRule)) errors.push(`Step ${index + 1} requires a decision rule.`);
    if (!isStringArray(step.evidenceRequired)) errors.push(`Step ${index + 1} requires at least one evidence requirement.`);
    if (typeof step.id === 'string') stepIds.add(step.id);
  });
  steps.forEach((step, index) => {
    if (isRecord(step) && step.handoffToStepId !== null && !stepIds.has(String(step.handoffToStepId))) {
      errors.push(`Step ${index + 1} hands off to an unknown step.`);
    }
  });

  const issues = Array.isArray(workflow.issues) ? workflow.issues : [];
  if (!issues.some((issue) => isRecord(issue) && issue.type === 'bottleneck')) errors.push('The prototype requires at least one bottleneck.');
  if (!issues.some((issue) => isRecord(issue) && issue.type === 'ownership_ambiguity')) errors.push('The prototype requires at least one ownership ambiguity.');
  issues.forEach((issue, index) => {
    if (!isRecord(issue) || !stepIds.has(String(issue.stepId)) || !WORKFLOW_RISK_LEVELS.includes(issue.severity as WorkflowRiskLevel)) {
      errors.push(`Issue ${index + 1} must reference a known step and valid severity.`);
    }
  });

  const exceptions = Array.isArray(workflow.exceptions) ? workflow.exceptions : [];
  if (!exceptions.length) errors.push('The prototype requires at least one exception and escalation route.');
  exceptions.forEach((exception, index) => {
    if (!isRecord(exception) || !stepIds.has(String(exception.stepId)) || !actorIds.has(String(exception.escalationOwnerId))) {
      errors.push(`Exception ${index + 1} must reference a known step and escalation owner.`);
    }
  });

  const metrics = Array.isArray(workflow.metrics) ? workflow.metrics : [];
  if (!metrics.length) errors.push('The prototype requires at least one baseline and target metric.');
  metrics.forEach((metric, index) => {
    if (!isRecord(metric) || !hasText(metric.name) || !hasText(metric.baseline) || !hasText(metric.target) || !hasText(metric.cadence)) {
      errors.push(`Metric ${index + 1} must define a name, baseline, target, and cadence.`);
    }
  });

  const versions = Array.isArray(workflow.versions) ? workflow.versions : [];
  if (!versions.length || !isRecord(versions[0]) || versions[0].version !== 1) errors.push('Workflow history must begin with version 1.');

  return { value: errors.length ? null : (input as WorkflowWorkspace), errors };
};

export const createSyntheticRecruitmentWorkflow = (): WorkflowWorkspace => ({
  organisation: { id: 'org-northstar', name: 'Northstar Talent Partners (synthetic)' },
  team: { id: 'team-delivery', name: 'Recruitment delivery', purpose: 'Run retained search workflow with visible human controls.' },
  actors: [
    { id: 'actor-account-lead', name: 'Asha Rao', role: 'Account lead', teamId: 'team-delivery' },
    { id: 'actor-recruiter', name: 'Dev Shah', role: 'Recruiter', teamId: 'team-delivery' },
    { id: 'actor-researcher', name: 'Mina Patel', role: 'Researcher', teamId: 'team-delivery' },
    { id: 'actor-client', name: 'Hiring manager', role: 'Client approver', teamId: 'team-delivery' },
  ],
  workflow: {
    id: 'workflow-recruitment-v1', organisationId: 'org-northstar', teamId: 'team-delivery',
    name: 'Retained recruitment: intake to outcome',
    description: 'Synthetic current-state workflow for a specialist recruitment engagement. No client or candidate records are included.',
    trigger: 'A signed retained-search brief is received from a hiring manager.',
    steps: [
      { id: 'intake', sequence: 1, name: 'Client or hiring-manager intake', purpose: 'Confirm the search context, decision criteria, and route.', classification: 'human_led', ownerId: 'actor-account-lead', approverId: 'actor-client', systems: ['Structured intake form', 'CRM'], inputs: ['Signed brief', 'Hiring context'], outputs: ['Approved search brief'], decisionRule: 'Do not open a search until role scope, evaluation criteria, and client approver are named.', handoffToStepId: 'jd-analysis', humanCheckpoint: 'Account lead confirms completeness with the hiring manager.', evidenceRequired: ['Signed brief', 'Intake notes'] },
      { id: 'jd-analysis', sequence: 2, name: 'Job-description analysis', purpose: 'Translate the brief into a clear candidate scorecard.', classification: 'ai_assisted', ownerId: 'actor-recruiter', approverId: 'actor-account-lead', systems: ['AI drafting workspace', 'Scorecard template'], inputs: ['Approved search brief'], outputs: ['Candidate scorecard'], decisionRule: 'AI may draft criteria; recruiter must confirm all must-have and exclusion criteria.', handoffToStepId: 'sourcing-prep', humanCheckpoint: 'Recruiter approves the scorecard before sourcing begins.', evidenceRequired: ['Approved scorecard', 'AI draft review note'] },
      { id: 'sourcing-prep', sequence: 3, name: 'Sourcing preparation', purpose: 'Set search channels, market hypotheses, and outreach constraints.', classification: 'human_led', ownerId: 'actor-researcher', systems: ['ATS', 'Research brief'], inputs: ['Candidate scorecard'], outputs: ['Sourcing plan'], decisionRule: 'Use only approved search channels and candidate criteria.', handoffToStepId: 'discovery', evidenceRequired: ['Sourcing plan'] },
      { id: 'discovery', sequence: 4, name: 'Candidate discovery', purpose: 'Identify possible candidates against the scorecard.', classification: 'safely_automatable', ownerId: 'actor-researcher', systems: ['ATS', 'Talent database'], inputs: ['Sourcing plan'], outputs: ['Longlist'], decisionRule: 'Potential matches must be tagged against scorecard evidence before screen invitation.', handoffToStepId: 'screening', evidenceRequired: ['Longlist with source references'] },
      { id: 'screening', sequence: 5, name: 'Candidate screening', purpose: 'Assess motivation, capability, availability, and fit.', classification: 'human_led', ownerId: 'actor-recruiter', systems: ['ATS', 'Call notes'], inputs: ['Longlist'], outputs: ['Screened candidate record'], decisionRule: 'No candidate advances without a structured screening record.', handoffToStepId: 'outreach', humanCheckpoint: 'Recruiter records reasoning and candidate consent.', evidenceRequired: ['Screening notes', 'Candidate consent'] },
      { id: 'outreach', sequence: 6, name: 'Outreach', purpose: 'Invite suitable candidates into the process and track responses.', classification: 'ai_assisted', ownerId: 'actor-researcher', systems: ['Email sequence tool', 'ATS'], inputs: ['Screened candidate record'], outputs: ['Response status'], decisionRule: 'AI may tailor a draft; recruiter remains responsible for message approval and opt-out handling.', handoffToStepId: 'recruiter-review', humanCheckpoint: 'Recruiter approves every message template and exception reply.', evidenceRequired: ['Approved outreach template', 'Response record'] },
      { id: 'recruiter-review', sequence: 7, name: 'Recruiter review', purpose: 'Compare evidence and decide who meets the shortlist threshold.', classification: 'human_led', ownerId: 'actor-recruiter', systems: ['ATS', 'Scorecard template'], inputs: ['Screened candidate record', 'Response status'], outputs: ['Shortlist recommendation'], decisionRule: 'Advance only candidates with complete evidence for each agreed criterion.', handoffToStepId: 'shortlist-approval', humanCheckpoint: 'Recruiter explicitly records pass, hold, or decline.', evidenceRequired: ['Completed scorecard', 'Recommendation note'] },
      { id: 'shortlist-approval', sequence: 8, name: 'Shortlist approval', purpose: 'Obtain an accountable client decision before submission.', classification: 'human_led', ownerId: null, approverId: 'actor-client', systems: ['Client review pack', 'CRM'], inputs: ['Shortlist recommendation'], outputs: ['Approved shortlist'], decisionRule: 'Only the named hiring manager may approve a shortlist; otherwise escalate.', handoffToStepId: 'client-handoff', humanCheckpoint: 'Hiring manager approval is mandatory.', evidenceRequired: ['Approval record', 'Shortlist rationale'] },
      { id: 'client-handoff', sequence: 9, name: 'Client handoff', purpose: 'Submit the approved shortlist and interview guidance.', classification: 'human_led', ownerId: 'actor-account-lead', systems: ['CRM', 'Client email'], inputs: ['Approved shortlist'], outputs: ['Client submission'], decisionRule: 'Send only the latest approved shortlist and retain version reference.', handoffToStepId: 'outcome-tracking', evidenceRequired: ['Submission record', 'Shortlist version'] },
      { id: 'outcome-tracking', sequence: 10, name: 'Follow-up and outcome tracking', purpose: 'Capture interview progression, closure, and learning.', classification: 'human_led', ownerId: 'actor-account-lead', systems: ['CRM', 'ATS'], inputs: ['Client submission'], outputs: ['Outcome record', 'Improvement signal'], decisionRule: 'Follow up within the agreed cadence; log outcome or next escalation action.', handoffToStepId: null, evidenceRequired: ['Outcome status', 'Follow-up record'] },
    ],
    issues: [
      { id: 'issue-response-delay', type: 'bottleneck', title: 'Outreach response follow-up is delayed', detail: 'Responses are reviewed in batches, creating an average 36-hour delay before a recruiter decision.', severity: 'high', stepId: 'outreach' },
      { id: 'issue-shortlist-owner', type: 'ownership_ambiguity', title: 'Shortlist approval has no confirmed internal owner', detail: 'The client approver is named, but internal responsibility for chasing or escalating a missing decision is not explicit.', severity: 'medium', stepId: 'shortlist-approval' },
      { id: 'issue-scorecard-drift', type: 'risk', title: 'Scorecard changes can drift after sourcing starts', detail: 'Late changes are not consistently versioned against the original approved brief.', severity: 'medium', stepId: 'jd-analysis' },
    ],
    exceptions: [
      { id: 'exception-approval-delay', trigger: 'No shortlist decision within two business days.', route: 'Account lead sends a decision recap; on day three, escalate to the named hiring manager and pause submissions until response.', escalationOwnerId: 'actor-account-lead', stepId: 'shortlist-approval' },
    ],
    metrics: [
      { id: 'metric-response-time', name: 'Candidate response-to-review time', baseline: '36 hours', target: 'Under 12 hours', cadence: 'Weekly' },
      { id: 'metric-approval-delay', name: 'Shortlist approval cycle time', baseline: '4.5 business days', target: '2 business days', cadence: 'Per search' },
    ],
    improvements: [{ id: 'improvement-follow-up-queue', title: 'Create a daily response-review queue', rationale: 'Reduce the outreach bottleneck without automating candidate decisions.', ownerId: 'actor-recruiter', status: 'proposed' }],
    versions: [{ version: 1, createdAt: '2026-08-01T09:00:00.000Z', changeSummary: 'Synthetic current-state workflow created for product validation.', author: 'Kramaniti internal prototype' }],
  },
});

export const getActorName = (workspace: WorkflowWorkspace, actorId: string | null | undefined) =>
  workspace.actors.find((actor) => actor.id === actorId)?.name ?? 'Unassigned';

export const createDiagnosticSummary = (workspace: WorkflowWorkspace) => {
  const { workflow } = workspace;
  const classificationCounts = WORK_CLASSIFICATIONS.map((classification) => ({
    classification,
    count: workflow.steps.filter((step) => step.classification === classification).length,
  }));
  const criticalIssues = workflow.issues.filter((issue) => issue.severity === 'high').map((issue) => issue.title);
  return [
    `${workflow.name} is a ${workflow.steps.length}-step, current-state workflow for ${workspace.team.name.toLowerCase()}.`,
    `It begins when ${workflow.trigger.toLowerCase()}`,
    `Work is deliberately classified as ${classificationCounts.map(({ classification, count }) => `${count} ${classification.replace('_', '-')} step${count === 1 ? '' : 's'}`).join(', ')}.`,
    criticalIssues.length ? `Priority bottleneck: ${criticalIssues.join('; ')}.` : 'No high-severity bottleneck is currently recorded.',
    `${workflow.exceptions.length} escalation route and ${workflow.metrics.length} measurable improvement metric${workflow.metrics.length === 1 ? '' : 's'} are defined.`,
  ].join(' ');
};

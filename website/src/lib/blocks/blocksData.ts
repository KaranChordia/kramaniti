export type BlockStatus = 'Ready' | 'Working copy' | 'Needs setup';
export type RunStageStatus = 'Complete' | 'Active' | 'Waiting' | 'Queued';
export type ExecutionMode = 'System' | 'AI-assisted' | 'Human review' | 'Human action';

export type DelegationAgent = {
  id: string;
  coordinate: string;
  name: string;
  role: string;
  mode: ExecutionMode;
  description: string;
  handoff: string;
};

export const delegationAgents: DelegationAgent[] = [
  {
    id: 'master-coordinator',
    coordinate: '01',
    name: 'Master Coordinator',
    role: 'Frame the question and route the work.',
    mode: 'Human action',
    description: 'Holds the operating intent, names the decision owner, and sends each question to the right specialist.',
    handoff: 'Routes a clear brief to Workflow Architect.',
  },
  {
    id: 'workflow-architect',
    coordinate: '02',
    name: 'Workflow Architect',
    role: 'Map the work before choosing tools.',
    mode: 'AI-assisted',
    description: 'Turns scattered steps, friction, and handoffs into a visible workflow with a smallest useful intervention.',
    handoff: 'Returns the friction map to Systems Engineer.',
  },
  {
    id: 'systems-engineer',
    coordinate: '03',
    name: 'Systems Engineer',
    role: 'Shape the practical support layer.',
    mode: 'AI-assisted',
    description: 'Designs the support route, data boundary, override rule, and write-back path without hiding the human owner.',
    handoff: 'Prepares a reviewable system brief.',
  },
  {
    id: 'governance-reviewer',
    coordinate: '04',
    name: 'Governance Reviewer',
    role: 'Protect the decision before action.',
    mode: 'Human review',
    description: 'Checks evidence, claims, permissions, and downstream consequences before the work can move forward.',
    handoff: 'Returns an approved or revised next action to the owner.',
  },
];

export type BlockDefinition = {
  id: string;
  name: string;
  summary: string;
  category: string;
  status: BlockStatus;
  owner: string;
  inputs: string[];
  outputs: string[];
};

export const blocks: BlockDefinition[] = [
  {
    id: 'workflow-diagnostic',
    name: 'Workflow diagnostic',
    summary: 'Turn an unclear operating process into a scoped map of friction, ownership, and improvement opportunities.',
    category: 'Strategy',
    status: 'Ready',
    owner: 'Workflow Architect',
    inputs: ['Operating goal', 'Current steps', 'Known constraints'],
    outputs: ['Workflow map', 'Friction register', 'Recommended next move'],
  },
  {
    id: 'decision-brief',
    name: 'Decision brief',
    summary: 'Organise evidence and trade-offs into a reviewable decision with an explicit owner and approval gate.',
    category: 'Operations',
    status: 'Working copy',
    owner: 'Master Coordinator',
    inputs: ['Decision question', 'Evidence', 'Constraints'],
    outputs: ['Options', 'Recommendation', 'Decision record'],
  },
  {
    id: 'content-system',
    name: 'Content system',
    summary: 'Translate approved strategic context into a repeatable content sequence with review before release.',
    category: 'Content',
    status: 'Needs setup',
    owner: 'Content Director',
    inputs: ['Approved message', 'Audience', 'Source material'],
    outputs: ['Content brief', 'Draft sequence', 'Review pack'],
  },
];

export const runStages: Array<{ name: string; detail: string; mode: ExecutionMode; status: RunStageStatus }> = [
  { name: 'Frame the operating goal', detail: 'Scope, owner, and success condition confirmed.', mode: 'Human action', status: 'Complete' },
  { name: 'Structure current context', detail: 'Sources organised into the run boundary.', mode: 'System', status: 'Complete' },
  { name: 'Diagnose friction', detail: 'Patterns and dependencies are being synthesised.', mode: 'AI-assisted', status: 'Active' },
  { name: 'Review recommendation', detail: 'A named reviewer must approve or request revision.', mode: 'Human review', status: 'Waiting' },
  { name: 'Create action plan', detail: 'Approved decisions become sequenced owner actions.', mode: 'System', status: 'Queued' },
];

export const contextSources = [
  { name: 'Founder operating note', type: 'Document', scope: 'This run', freshness: 'Updated today', state: 'Available' },
  { name: 'Current workflow interview', type: 'Conversation', scope: 'This run', freshness: '18 min ago', state: 'Available' },
  { name: 'Team constraints', type: 'Structured input', scope: 'Workspace', freshness: 'Needs confirmation', state: 'Review' },
];

export const reviews = [
  { title: 'Confirm the primary bottleneck', run: 'Workflow diagnostic / 0042', owner: 'KC', due: 'Ready now', state: 'Needs review' },
  { title: 'Approve the action sequence', run: 'Decision brief / 0039', owner: 'KC', due: 'Reviewed yesterday', state: 'Approved' },
];

export const outputs = [
  { title: 'Workflow friction map', type: 'Operating map', run: 'Workflow diagnostic / 0041', time: 'Today, 11:40', state: 'Approved' },
  { title: 'Decision options and trade-offs', type: 'Decision brief', run: 'Decision brief / 0039', time: 'Yesterday, 18:10', state: 'Approved' },
  { title: 'Recommended operating sequence', type: 'Action plan', run: 'Workflow diagnostic / 0042', time: 'In progress', state: 'Draft' },
];

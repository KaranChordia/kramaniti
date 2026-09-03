export type LibraryKind = 'Agent' | 'Skill' | 'Plugin guide' | 'Governance';

export type LibraryItem = {
  id: string;
  kind: LibraryKind;
  title: string;
  summary: string;
  useWhen: string;
  includes: string[];
  format: string;
  download: string;
  status: 'Starter template';
};

export const libraryKinds: LibraryKind[] = ['Agent', 'Skill', 'Plugin guide', 'Governance'];

export const libraryItems: LibraryItem[] = [
  {
    id: 'research-synthesis-agent',
    kind: 'Agent',
    title: 'Research & synthesis agent',
    summary: 'Turn source-backed research into a brief for a real decision.',
    useWhen: 'You need a reliable research pass before a decision, rather than a confident-looking answer with no trail.',
    includes: ['Role and outcome', 'Source boundary', 'Output contract', 'Escalation rule'],
    format: 'Markdown',
    download: '/library/research-synthesis-agent.md',
    status: 'Starter template',
  },
  {
    id: 'workflow-diagnostic-skill',
    kind: 'Skill',
    title: 'Workflow diagnostic',
    summary: 'Map a messy process, its friction, and the next useful move.',
    useWhen: 'A team says a process is slow or unclear, but no one has yet named where it actually breaks.',
    includes: ['Interview prompts', 'Friction map', 'Opportunity filter', 'Human review step'],
    format: 'Markdown',
    download: '/library/workflow-diagnostic-skill.md',
    status: 'Starter template',
  },
  {
    id: 'source-checking-skill',
    kind: 'Skill',
    title: 'Source-checking skill',
    summary: 'Separate facts, inferences, and claims that still need checking.',
    useWhen: 'You are preparing strategy, research, or public copy where unsupported claims would create avoidable risk.',
    includes: ['Evidence labels', 'Verification sequence', 'Claim stop signs', 'Review output'],
    format: 'Markdown',
    download: '/library/source-checking-skill.md',
    status: 'Starter template',
  },
  {
    id: 'plugin-evaluation-guide',
    kind: 'Plugin guide',
    title: 'Plugin evaluation guide',
    summary: 'Assess a plugin’s permissions, risks, and fit before connecting it.',
    useWhen: 'A new plugin looks useful, but its permissions, failure modes, and owner are not yet clear.',
    includes: ['Permission inventory', 'Data boundary', 'Failure path', 'Approval record'],
    format: 'Markdown',
    download: '/library/plugin-evaluation-guide.md',
    status: 'Starter template',
  },
  {
    id: 'agent-brief-template',
    kind: 'Agent',
    title: 'Agent brief template',
    summary: 'Define an agent’s job, context, owner, and handoff.',
    useWhen: 'You are tempted to create an agent because it sounds impressive, rather than because a recurring job needs accountable support.',
    includes: ['Job definition', 'Inputs and outputs', 'Constraints', 'Handoff protocol'],
    format: 'Markdown',
    download: '/library/agent-brief-template.md',
    status: 'Starter template',
  },
  {
    id: 'human-review-gate',
    kind: 'Governance',
    title: 'Human review gate',
    summary: 'Pause consequential work for a named human decision.',
    useWhen: 'An AI-assisted workflow reaches a point where speed is less valuable than a named person making the call.',
    includes: ['Decision prompt', 'Evidence needed', 'Approver', 'Next-state rule'],
    format: 'Markdown',
    download: '/library/human-review-gate.md',
    status: 'Starter template',
  },
];

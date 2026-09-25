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
    includes: ['Process inputs', 'Friction map', 'Opportunity filter', 'Human review step'],
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
    useWhen: 'A recurring job needs a clear scope, reliable inputs, and an accountable handoff before you choose tools.',
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
  {
    id: 'exception-log',
    kind: 'Governance',
    title: 'Keep a record of when the AI gets it wrong',
    summary: 'Write down each time someone has to correct the AI, then fix repeat problems at the source.',
    useWhen: 'Your team keeps correcting, overriding or explaining the same kind of AI output by hand.',
    includes: ['What to record', 'Types of problem', 'Review questions', 'How to close each entry'],
    format: 'Markdown',
    download: '/library/exception-log.md',
    status: 'Starter template',
  },
  {
    id: 'enquiry-triage-agent',
    kind: 'Agent',
    title: 'Sort and answer customer enquiries on WhatsApp and email',
    summary: 'Sort incoming enquiries, draft routine replies and hand the rest to the right person.',
    useWhen: 'Customer enquiries arrive on WhatsApp and email faster than one person can answer them, and the same questions keep coming back.',
    includes: ['Answers it may use', 'Types of enquiry', 'When a person takes over', 'Trial run before going live'],
    format: 'Markdown',
    download: '/library/enquiry-triage-agent.md',
    status: 'Starter template',
  },
  {
    id: 'builder-exit-handover-test',
    kind: 'Governance',
    title: 'Check your team can run it without the person who built it',
    summary: 'Find out whether your team can run, pause and fix a new process when the person who set it up is not around.',
    useWhen: 'The person who set up a process or tool is moving on, or everyone still asks them when something breaks.',
    includes: ['Who does what', 'Questions to answer', 'What to do when it breaks', 'Practice runs'],
    format: 'Markdown',
    download: '/library/builder-exit-handover-test.md',
    status: 'Starter template',
  },
  {
    id: 'founder-memory-sop-agent',
    kind: 'Agent',
    title: 'Turn the founder’s know-how into written steps',
    summary: 'Record the founder explaining a task, then turn it into steps the team can follow.',
    useWhen: 'A routine task still depends on the founder explaining it each time, and nothing written down matches how it is really done.',
    includes: ['What the draft may use', 'Step-by-step layout', 'Judgment calls', 'Founder sign-off'],
    format: 'Markdown',
    download: '/library/founder-memory-sop-agent.md',
    status: 'Starter template',
  },
  {
    id: 'adoption-packet-skill',
    kind: 'Skill',
    title: 'One-page AI rules for your team',
    summary: 'One page that tells your team what an AI tool is for, what stays with people and who to ask for help.',
    useWhen: 'Your agency or firm is about to start using an AI tool for client work, or people already use one without agreed rules.',
    includes: ['What it may be used for', 'What client information can go in', 'When to ignore the AI', 'Who to ask for help'],
    format: 'Markdown',
    download: '/library/adoption-packet-skill.md',
    status: 'Starter template',
  },
];

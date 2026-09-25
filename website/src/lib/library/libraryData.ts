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

/** Plain-language labels shown to readers. The internal kind values stay unchanged. */
export const kindLabels: Record<LibraryKind, string> = {
  Agent: 'AI assistant setup',
  Skill: 'How-to guide',
  'Plugin guide': 'Tool setup guide',
  Governance: 'Checklist',
};

export const libraryItems: LibraryItem[] = [
  {
    id: 'research-synthesis-agent',
    kind: 'Agent',
    title: 'Research a decision with sources you can check',
    summary: 'Turn research into a short brief, with sources, for a decision you need to make.',
    useWhen: 'You need research you can trust before a decision, not a confident answer with no sources behind it.',
    includes: ['Role and outcome', 'Source boundary', 'Output contract', 'Escalation rule'],
    format: 'Markdown',
    download: '/library/research-synthesis-agent.md',
    status: 'Starter template',
  },
  {
    id: 'workflow-diagnostic-skill',
    kind: 'Skill',
    title: 'Find where a process gets stuck',
    summary: 'Map a messy process, see where it slows down and choose the next small fix.',
    useWhen: 'A team says a process is slow or unclear, but no one has yet named where it actually breaks.',
    includes: ['Process inputs', 'Friction map', 'Opportunity filter', 'Human review step'],
    format: 'Markdown',
    download: '/library/workflow-diagnostic-skill.md',
    status: 'Starter template',
  },
  {
    id: 'source-checking-skill',
    kind: 'Skill',
    title: 'Check the facts before you publish',
    summary: 'Separate what is proven from guesses and claims that still need checking.',
    useWhen: 'You are preparing strategy, research, or public copy where unsupported claims would create avoidable risk.',
    includes: ['Evidence labels', 'Verification sequence', 'Claim stop signs', 'Review output'],
    format: 'Markdown',
    download: '/library/source-checking-skill.md',
    status: 'Starter template',
  },
  {
    id: 'plugin-evaluation-guide',
    kind: 'Plugin guide',
    title: 'Check a new app before you connect it',
    summary: 'See what a new app can access, what could go wrong and who looks after it before you connect it.',
    useWhen: 'A new app or plugin looks useful, but what it can access, how it could fail and who looks after it are not yet clear.',
    includes: ['Permission inventory', 'Data boundary', 'Failure path', 'Approval record'],
    format: 'Markdown',
    download: '/library/plugin-evaluation-guide.md',
    status: 'Starter template',
  },
  {
    id: 'agent-brief-template',
    kind: 'Agent',
    title: 'Write clear instructions for an AI assistant',
    summary: 'Set out what an AI assistant should do, what it can use and who takes over from it.',
    useWhen: 'You want an AI assistant to help with a regular task and need its job, inputs and handover agreed before you choose a tool.',
    includes: ['Job definition', 'Inputs and outputs', 'Constraints', 'Handoff protocol'],
    format: 'Markdown',
    download: '/library/agent-brief-template.md',
    status: 'Starter template',
  },
  {
    id: 'human-review-gate',
    kind: 'Governance',
    title: 'Get sign-off before anything important goes out',
    summary: 'Pause important work until a named person decides.',
    useWhen: 'AI-assisted work reaches a point where it matters more that the right person decides than that it moves fast.',
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

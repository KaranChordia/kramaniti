export type LibraryKind = 'Agent' | 'Skill' | 'Plugin guide' | 'Governance';

export type LibraryItem = {
  id: string;
  kind: LibraryKind;
  category: 'Research & evidence' | 'Workflow design' | 'Tools & connections' | 'Human oversight' | 'Client work';
  title: string;
  summary: string;
  useWhen: string;
  includes: string[];
  format: string;
  download: string;
  status: 'Starter template';
  /**
   * Date the template was first published, as 'YYYY-MM-DD' (IST). Required for
   * every new template: use the date of the commit that first adds it.
   */
  created: string;
};

export const libraryKinds: LibraryKind[] = ['Agent', 'Skill', 'Plugin guide', 'Governance'];

/** Plain-language labels shown to readers. The internal kind values stay unchanged. */
export const kindLabels: Record<LibraryKind, string> = {
  Agent: 'AI assistant setup',
  Skill: 'How-to guide',
  'Plugin guide': 'Tool setup guide',
  Governance: 'Checklist',
};

const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Formats a 'YYYY-MM-DD' created date as '4 Oct 2026'. Parses the string by hand
 * so the output never depends on the server or browser locale or timezone.
 */
export function formatCreatedDate(created: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(created);
  if (!match) throw new Error(`Invalid created date: ${created}`);
  const [, year, month, day] = match;
  const monthIndex = Number(month) - 1;
  const dayNumber = Number(day);
  if (monthIndex < 0 || monthIndex > 11 || dayNumber < 1 || dayNumber > 31) {
    throw new Error(`Invalid created date: ${created}`);
  }
  return `${dayNumber} ${shortMonths[monthIndex]} ${year}`;
}

export const libraryItems: LibraryItem[] = [
  {
    id: 'research-synthesis-agent',
    category: 'Research & evidence',
    kind: 'Agent',
    title: 'Research a decision with sources you can check',
    summary: 'Turn research into a short brief, with sources, for a decision you need to make.',
    useWhen: 'You need research you can trust before a decision, not a confident answer with no sources behind it.',
    includes: ['Role and outcome', 'Source boundary', 'Output contract', 'Escalation rule'],
    format: 'Markdown',
    download: '/library/research-synthesis-agent.md',
    status: 'Starter template',
    created: '2026-08-29',
  },
  {
    id: 'workflow-diagnostic-skill',
    category: 'Workflow design',
    kind: 'Skill',
    title: 'Find where a process gets stuck',
    summary: 'Map a messy process, see where it slows down and choose the next small fix.',
    useWhen: 'A team says a process is slow or unclear, but no one has yet named where it actually breaks.',
    includes: ['Process inputs', 'Friction map', 'Opportunity filter', 'Human review step'],
    format: 'Markdown',
    download: '/library/workflow-diagnostic-skill.md',
    status: 'Starter template',
    created: '2026-08-29',
  },
  {
    id: 'source-checking-skill',
    category: 'Research & evidence',
    kind: 'Skill',
    title: 'Check the facts before you publish',
    summary: 'Separate what is proven from guesses and claims that still need checking.',
    useWhen: 'You are preparing strategy, research, or public copy where unsupported claims would create avoidable risk.',
    includes: ['Evidence labels', 'Verification sequence', 'Claim stop signs', 'Review output'],
    format: 'Markdown',
    download: '/library/source-checking-skill.md',
    status: 'Starter template',
    created: '2026-08-29',
  },
  {
    id: 'plugin-evaluation-guide',
    category: 'Tools & connections',
    kind: 'Plugin guide',
    title: 'Check a new app before you connect it',
    summary: 'See what a new app can access, what could go wrong and who looks after it before you connect it.',
    useWhen: 'A new app or plugin looks useful, but what it can access, how it could fail and who looks after it are not yet clear.',
    includes: ['Permission inventory', 'Data boundary', 'Failure path', 'Approval record'],
    format: 'Markdown',
    download: '/library/plugin-evaluation-guide.md',
    status: 'Starter template',
    created: '2026-08-29',
  },
  {
    id: 'agent-brief-template',
    category: 'Workflow design',
    kind: 'Agent',
    title: 'Write clear instructions for an AI assistant',
    summary: 'Set out what an AI assistant should do, what it can use and who takes over from it.',
    useWhen: 'You want an AI assistant to help with a regular task and need its job, inputs and handover agreed before you choose a tool.',
    includes: ['Job definition', 'Inputs and outputs', 'Constraints', 'Handoff protocol'],
    format: 'Markdown',
    download: '/library/agent-brief-template.md',
    status: 'Starter template',
    created: '2026-08-29',
  },
  {
    id: 'human-review-gate',
    category: 'Human oversight',
    kind: 'Governance',
    title: 'Get sign-off before anything important goes out',
    summary: 'Pause important work until a named person decides.',
    useWhen: 'AI-assisted work reaches a point where it matters more that the right person decides than that it moves fast.',
    includes: ['Decision prompt', 'Evidence needed', 'Approver', 'Next-state rule'],
    format: 'Markdown',
    download: '/library/human-review-gate.md',
    status: 'Starter template',
    created: '2026-08-29',
  },
  {
    id: 'exception-log',
    category: 'Human oversight',
    kind: 'Governance',
    title: 'Keep a record of when the AI gets it wrong',
    summary: 'Write down each time someone has to correct the AI, then fix repeat problems at the source.',
    useWhen: 'Your team keeps correcting, overriding or explaining the same kind of AI output by hand.',
    includes: ['What to record', 'Types of problem', 'Review questions', 'How to close each entry'],
    format: 'Markdown',
    download: '/library/exception-log.md',
    status: 'Starter template',
    created: '2026-09-25',
  },
  {
    id: 'enquiry-triage-agent',
    category: 'Client work',
    kind: 'Agent',
    title: 'Sort and answer customer enquiries on WhatsApp and email',
    summary: 'Sort incoming enquiries, draft routine replies and hand the rest to the right person.',
    useWhen: 'Customer enquiries arrive on WhatsApp and email faster than one person can answer them, and the same questions keep coming back.',
    includes: ['Answers it may use', 'Types of enquiry', 'When a person takes over', 'Trial run before going live'],
    format: 'Markdown',
    download: '/library/enquiry-triage-agent.md',
    status: 'Starter template',
    created: '2026-09-25',
  },
  {
    id: 'builder-exit-handover-test',
    category: 'Workflow design',
    kind: 'Governance',
    title: 'Check your team can run it without the person who built it',
    summary: 'Find out whether your team can run, pause and fix a new process when the person who set it up is not around.',
    useWhen: 'The person who set up a process or tool is moving on, or everyone still asks them when something breaks.',
    includes: ['Who does what', 'Questions to answer', 'What to do when it breaks', 'Practice runs'],
    format: 'Markdown',
    download: '/library/builder-exit-handover-test.md',
    status: 'Starter template',
    created: '2026-09-25',
  },
  {
    id: 'founder-memory-sop-agent',
    category: 'Workflow design',
    kind: 'Agent',
    title: 'Turn the founder’s know-how into written steps',
    summary: 'Record the founder explaining a task, then turn it into steps the team can follow.',
    useWhen: 'A routine task still depends on the founder explaining it each time, and nothing written down matches how it is really done.',
    includes: ['What the draft may use', 'Step-by-step layout', 'Judgment calls', 'Founder sign-off'],
    format: 'Markdown',
    download: '/library/founder-memory-sop-agent.md',
    status: 'Starter template',
    created: '2026-09-25',
  },
  {
    id: 'adoption-packet-skill',
    category: 'Human oversight',
    kind: 'Skill',
    title: 'One-page AI rules for your team',
    summary: 'One page that tells your team what an AI tool is for, what stays with people and who to ask for help.',
    useWhen: 'Your agency or firm is about to start using an AI tool for client work, or people already use one without agreed rules.',
    includes: ['What it may be used for', 'What client information can go in', 'When to ignore the AI', 'Who to ask for help'],
    format: 'Markdown',
    download: '/library/adoption-packet-skill.md',
    status: 'Starter template',
    created: '2026-09-25',
  },
  {
    id: 'client-onboarding-handoff-brief',
    category: 'Client work',
    kind: 'Agent',
    title: 'Hand a new client from sales to delivery without gaps',
    summary: 'Set out what sales must pass to delivery, and what an AI assistant may and may not do along the way.',
    useWhen: 'A new client deal has closed and delivery keeps chasing sales for scope, contacts, approvals or files.',
    includes: ['What sales must hand over', 'What was and was not sold', 'What the AI assistant may and may not do', 'Who owns each step'],
    format: 'Markdown',
    download: '/library/client-onboarding-handoff-brief.md',
    status: 'Starter template',
    created: '2026-09-28',
  },
  {
    id: 'non-build-list-register',
    category: 'Workflow design',
    kind: 'Governance',
    title: 'Decide which AI ideas to build, help with, or leave alone',
    summary: 'Sort each AI idea into build, assist, keep with people, defer or reject, with a reason and a named owner.',
    useWhen: 'A startup or SMB has a pile of AI ideas and needs a clear yes, no or not-now before anyone spends time or money.',
    includes: ['Decision options', 'Reason codes', 'Named owner', 'Review date'],
    format: 'Markdown',
    download: '/library/non-build-list-register.md',
    status: 'Starter template',
    created: '2026-09-29',
  },
  {
    id: 'conditional-founder-review-rules',
    category: 'Human oversight',
    kind: 'Governance',
    title: 'Decide when the founder needs to review work',
    summary: 'Set clear rules for what the founder must sign off and what can move with a lighter check.',
    useWhen: 'The founder is the permanent review queue for proposals, copy, hires or tool changes, and work waits on them even when someone else could safely decide.',
    includes: ['Work categories', 'Founder-only triggers', 'Lighter review paths', 'Stop rules'],
    format: 'Markdown',
    download: '/library/conditional-founder-review-rules.md',
    status: 'Starter template',
    created: '2026-09-30',
  },
  {
    id: 'bottleneck-interview-guide',
    category: 'Workflow design',
    kind: 'Skill',
    title: 'Find where work waits by asking the people who do it',
    summary: 'A short interview that shows where work waits, repeats or depends on one person, before you decide what to build.',
    useWhen: 'A family business or small team knows something is slow, but nobody has yet asked the people who do the work where it actually sticks.',
    includes: ['Who to ask', 'Waiting and repeats', 'One-person bottlenecks', 'What to fix first'],
    format: 'Markdown',
    download: '/library/bottleneck-interview-guide.md',
    status: 'Starter template',
    created: '2026-10-01',
  },
  {
    id: 'constraint-pick-sheet',
    category: 'Workflow design',
    kind: 'Skill',
    title: 'Pick the one problem to fix before you build',
    summary: 'Name the single constraint to fix first, with evidence and an owner, before anyone chooses a tool.',
    useWhen: 'Your team keeps jumping to apps and builds before naming the one delay or handoff that actually limits the work.',
    includes: ['Constraint statement', 'Evidence', 'Named owner', 'Stop rules'],
    format: 'Markdown',
    download: '/library/constraint-pick-sheet.md',
    status: 'Starter template',
    created: '2026-10-02',
  },
  {
    id: 'proposal-quote-drafting-brief',
    category: 'Client work',
    kind: 'Agent',
    title: 'Draft proposals and quotes without promising what you can’t deliver',
    summary: 'Put a draft proposal or quote together from agreed scope notes and your own rates, then have a named person check every price and promise before it goes out.',
    useWhen: 'The founder ends up rewriting every proposal because drafts guess at prices, mix up what is included or promise dates nobody agreed.',
    includes: ['Agreed inputs only', 'Price and terms review', 'Named reviewer', 'Hold rules'],
    format: 'Markdown',
    download: '/library/proposal-quote-drafting-brief.md',
    status: 'Starter template',
    created: '2026-10-05',
  },
  {
    id: 'ai-tool-subscription-audit',
    category: 'Tools & connections',
    kind: 'Skill',
    title: 'See which AI tools you pay for and what each one is for',
    summary: 'List every AI tool the team uses, the job it does, who looks after it and what data it sees, then decide what to keep, merge or stop.',
    useWhen: 'People have signed up for AI apps on their own, and nobody can say for sure which ones are still used, who pays for them or what they can see.',
    includes: ['Tool list', 'Job and owner', 'Data each tool sees', 'Keep, merge or stop'],
    format: 'Markdown',
    download: '/library/ai-tool-subscription-audit.md',
    status: 'Starter template',
    created: '2026-10-06',
  },
  {
    id: 'digital-readiness-baseline',
    category: 'Workflow design',
    kind: 'Skill',
    title: 'See where your business information lives before you go digital',
    summary: 'Write down where each piece of business information is kept and who holds it, see what stops if they are away, then pick one small, safe first step before buying any software.',
    useWhen: 'You want to move off paper registers, notebooks or WhatsApp, but nobody has yet written down what is kept where, or which person the business depends on to find it.',
    includes: ['Where information lives', 'Who holds each piece', 'Risk if someone is away', 'First safe step'],
    format: 'Markdown',
    download: '/library/digital-readiness-baseline.md',
    status: 'Starter template',
    created: '2026-10-07',
  },
  {
    id: 'test-before-build-sheet',
    category: 'Workflow design',
    kind: 'Skill',
    title: 'Agree how you’ll know it works before you build',
    summary: 'Write what working looks like for one workflow, with safe examples, fail conditions and an owner, before anyone builds or buys a tool.',
    useWhen: 'The team is ready to pick an app, bot or build, but nobody has yet agreed how you will know the workflow is working in real day-to-day use.',
    includes: ['What done looks like', 'Safe sample inputs', 'Fail and stop conditions', 'Named owner'],
    format: 'Markdown',
    download: '/library/test-before-build-sheet.md',
    status: 'Starter template',
    created: '2026-10-09',
  },
];

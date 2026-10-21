// Service copy for the home cards and the service pages.
// Every line below is wording already published on kramaniti.com (home page and llms-full.txt).
// Do not add prices, durations, results or new claims here.

export type ServiceStep = { index: string; title: string; copy: string };

export type Service = {
  id: number;
  slug: 'audit' | 'build' | 'retainer';
  title: string;
  label: string;
  coordinate: string;
  summary: string;
  deliverables: string[];
  outputs: string;
  ctaText: string;
  isPopular: boolean;
  steps: ServiceStep[];
  extra?: { heading: string; copy: string; points: string[] };
};

const steps: Record<string, ServiceStep> = {
  understand: { index: '01', title: 'Understand', copy: 'See how the work actually happens today.' },
  bottleneck: { index: '02', title: 'Find the bottleneck', copy: 'Choose the one delay, handoff, or decision worth fixing first.' },
  design: { index: '03', title: 'Design', copy: 'Shape the simplest useful system around the real work.' },
  build: { index: '04', title: 'Build', copy: 'Create the workflow, tools, and clear instructions.' },
  use: { index: '05', title: 'Put it into use', copy: 'Help the team use it, review it, and know when to step in.' },
  communicate: { index: '06', title: 'Story', copy: 'Explain the value in language customers can understand.' },
  improve: { index: '07', title: 'Improve', copy: 'Learn from real use and make the system better over time.' },
};

export const services: Service[] = [
  {
    id: 1,
    slug: 'audit',
    title: 'Foundation Strategy',
    label: 'CLARITY',
    coordinate: '[01/CLARITY]',
    summary: 'For teams that need to see what is slowing the work before choosing a solution.',
    deliverables: ['Workflow audit', 'The bottleneck worth fixing', 'Where AI can genuinely help', 'What should stay human-led', 'A practical next-step plan'],
    outputs: 'Typical outputs include a workflow audit, a clear bottleneck, a people-and-AI boundary, and a practical next-step plan.',
    ctaText: 'Start with an Audit',
    isPopular: true,
    steps: [steps.understand, steps.bottleneck],
    extra: {
      heading: 'Start with a workflow audit',
      copy: 'The audit looks at how the work happens now, where it gets stuck, and what would make a useful first change.',
      points: ['A clear view of the current workflow', 'The bottleneck worth fixing first', 'A practical next step'],
    },
  },
  {
    id: 2,
    slug: 'build',
    title: 'Systems Engineering',
    label: 'BUILD',
    coordinate: '[02/BUILD]',
    summary: 'For teams that know which workflow to improve and need practical support built around it.',
    deliverables: ['A clearer workflow', 'Practical internal tools', 'Useful AI support', 'Connections between existing tools', 'Simple handover and review rules'],
    outputs: 'Typical outputs include a clearer workflow, practical AI support, internal tools, connections between existing tools, simple instructions, and human review points.',
    ctaText: 'Discuss the Workflow',
    isPopular: false,
    steps: [steps.design, steps.build, steps.use],
  },
  {
    id: 3,
    slug: 'retainer',
    title: 'Complete Lifecycle Retainer',
    label: 'KEEP IMPROVING',
    coordinate: '[03/CONTINUITY]',
    summary: 'For teams that want their strategy, systems and story to improve together.',
    deliverables: ['System care', 'Workflow improvements', 'Team support', 'Story and content direction', 'Regular reviews'],
    outputs: 'Typical outputs include system care, workflow improvements, team support, story direction, and regular reviews.',
    ctaText: 'Explore Ongoing Work',
    isPopular: false,
    steps: [steps.use, steps.communicate, steps.improve],
  },
];

export const servicePath = (slug: Service['slug']) => `/${slug}/`;

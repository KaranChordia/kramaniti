export type KcsVisualMode =
  | 'scatter'
  | 'signal'
  | 'gates'
  | 'layers'
  | 'rhythm';

export interface KcsRenderedScene {
  id: string;
  number: string;
  kicker: string;
  headline: string;
  support: string;
  microCopy: [string, string, string];
  atmosphere: [string, string];
  visualMode: KcsVisualMode;
  durationMs: number;
}

export const kcsSceneSequence: KcsRenderedScene[] = [
  {
    id: 'scattered-work',
    number: '01',
    kicker: 'The hidden problem',
    headline: 'Work is moving. The system is not.',
    support:
      'Most teams do not need more motion. They need one route that makes the motion useful.',
    microCopy: ['Unclear handoffs', 'Tool noise', 'Content drift'],
    atmosphere: ['Noise', 'Drift'],
    visualMode: 'scatter',
    durationMs: 5200,
  },
  {
    id: 'signal-route',
    number: '02',
    kicker: 'The first shift',
    headline: 'Find the signal before adding the tool.',
    support:
      'Kramaniti starts by locating the decision, the bottleneck, and the smallest workflow worth clarifying.',
    microCopy: ['Decision', 'Bottleneck', 'Route'],
    atmosphere: ['Signal', 'Route'],
    visualMode: 'signal',
    durationMs: 5600,
  },
  {
    id: 'human-led-gates',
    number: '03',
    kicker: 'The operating rule',
    headline: 'Some work stays human. Some work gets assistance.',
    support:
      'The system becomes credible when each step knows what should be human-led, AI-assisted, or automated.',
    microCopy: ['Human-led', 'AI-assisted', 'Automated'],
    atmosphere: ['Judgment', 'Control'],
    visualMode: 'gates',
    durationMs: 5800,
  },
  {
    id: 'connected-layers',
    number: '04',
    kicker: 'The Kramaniti method',
    headline: 'Strategy, systems, and content start moving together.',
    support:
      'Clarity turns into infrastructure. Infrastructure turns into a more coherent public presence.',
    microCopy: ['Strategy', 'Systems', 'Content'],
    atmosphere: ['Clarity', 'System'],
    visualMode: 'layers',
    durationMs: 5800,
  },
  {
    id: 'operating-rhythm',
    number: '05',
    kicker: 'The final frame',
    headline: 'One operating rhythm for brand growth.',
    support:
      'The output is calmer than the input: a repeatable loop that helps the brand think, build, and communicate clearly.',
    microCopy: ['Think', 'Build', 'Communicate'],
    atmosphere: ['Rhythm', 'Growth'],
    visualMode: 'rhythm',
    durationMs: 6400,
  },
];

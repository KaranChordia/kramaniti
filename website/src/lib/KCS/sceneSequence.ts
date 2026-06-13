export type KcsVisualMode =
  | 'divergingPaths'
  | 'routeConstellation'
  | 'signalExtraction'
  | 'layeredOrbit'
  | 'feedbackLoop';

export interface KcsRenderedScene {
  id: string;
  number: string;
  eyebrow: string;
  headline: string;
  supporting: string;
  beats: [string, string, string];
  labels: string[];
  atmosphere: [string, string];
  visualMode: KcsVisualMode;
  durationMs?: number;
}

export const kcsSceneSequence: KcsRenderedScene[] = [
  {
    id: 'audit-the-drift',
    number: '01',
    eyebrow: 'Scene one',
    headline: 'Audit the drift before you automate.',
    supporting:
      'When operations, tools, and public message split apart, more output only accelerates confusion.',
    beats: ['Operational friction', 'Tool sprawl', 'Message lag'],
    labels: ['Operations drift', 'Tool sprawl', 'Message lag'],
    atmosphere: ['Drift', 'Split'],
    visualMode: 'divergingPaths',
    durationMs: 5200,
  },
  {
    id: 'trace-the-handoffs',
    number: '02',
    eyebrow: 'Scene two',
    headline: 'Trace the handoff chain.',
    supporting:
      'A useful system exposes where input changes hands, where judgment matters, and where delivery slows down.',
    beats: ['Input capture', 'Judgment points', 'Delivery route'],
    labels: ['Input', 'Judgment', 'Approval', 'Delivery'],
    atmosphere: ['Route', 'Flow'],
    visualMode: 'routeConstellation',
    durationMs: 5600,
  },
  {
    id: 'extract-the-signal',
    number: '03',
    eyebrow: 'Scene three',
    headline: 'Separate noise from the decision.',
    supporting:
      'The visual should compress scattered context into one priority path instead of showing everything at once.',
    beats: ['Raw inputs', 'Priority filter', 'Decision signal'],
    labels: ['Inputs', 'Priority', 'Decision'],
    atmosphere: ['Signal', 'Focus'],
    visualMode: 'signalExtraction',
    durationMs: 5200,
  },
  {
    id: 'align-the-layers',
    number: '04',
    eyebrow: 'Scene four',
    headline: 'Build layers that reinforce each other.',
    supporting:
      'The operating layer, intelligence layer, and public layer should move as one system instead of competing for attention.',
    beats: ['Operating layer', 'Intelligence layer', 'Presence layer'],
    labels: ['Operations', 'Intelligence', 'Presence'],
    atmosphere: ['Layers', 'Method'],
    visualMode: 'layeredOrbit',
    durationMs: 5600,
  },
  {
    id: 'close-the-loop',
    number: '05',
    eyebrow: 'Scene five',
    headline: 'Close the loop into a repeatable rhythm.',
    supporting:
      'The final output should feel like one connected motion system: audit, build, train, communicate, then improve.',
    beats: ['Audit', 'Build', 'Train'],
    labels: ['Audit', 'Build', 'Train', 'Communicate'],
    atmosphere: ['Loop', 'Rhythm'],
    visualMode: 'feedbackLoop',
    durationMs: 6000,
  },
];

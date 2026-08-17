export const SIGNAL_STATES = {
  dormant: {
    label: 'Dormant',
    meaning: 'Available context, not currently affecting the decision.',
  },
  input: {
    label: 'Input received',
    meaning: 'New information has entered the operating path.',
  },
  handoff: {
    label: 'Handoff',
    meaning: 'Context is moving between two consequential stages.',
  },
  focus: {
    label: 'In focus',
    meaning: 'The current decision or interaction is active.',
  },
  complete: {
    label: 'Complete',
    meaning: 'The active stage has produced a usable outcome.',
  },
} as const;

export type SignalState = keyof typeof SIGNAL_STATES;

export function getSignalLabel(state: SignalState) {
  return SIGNAL_STATES[state].label;
}

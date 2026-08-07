import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { WorkflowIntelligencePrototype } from './WorkflowIntelligencePrototype';

export const metadata: Metadata = {
  title: 'Workflow Intelligence Prototype | Internal',
  description: 'Synthetic local-only product foundation for structured workflow diagnostics.',
  robots: { index: false, follow: false, noarchive: true },
};

export default function WorkflowIntelligencePage() {
  const enabled = process.env.NODE_ENV !== 'production' && process.env.WORKFLOW_INTELLIGENCE_PROTOTYPE_ENABLED !== 'false';
  if (!enabled) notFound();

  return <WorkflowIntelligencePrototype />;
}

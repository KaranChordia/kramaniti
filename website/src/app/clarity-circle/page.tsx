import type { Metadata } from 'next';
import { ClarityCircle } from './ClarityCircle';

export const metadata: Metadata = {
  title: 'Kramaniti Clarity Circle | AI-Assisted Founder Clarity',
  description:
    'A free AI-assisted clarity ecosystem for founders and builders who need sharper thinking before tools, systems before scale, and content after clarity.',
  alternates: {
    canonical: '/clarity-circle/',
  },
};

export default function ClarityCirclePage() {
  return <ClarityCircle />;
}

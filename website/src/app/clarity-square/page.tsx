import type { Metadata } from 'next';
import { ClaritySquare } from './ClaritySquare';

export const metadata: Metadata = {
  title: 'Kramaniti Clarity Square | AI-Assisted Founder Clarity',
  description:
    'A free AI-assisted clarity ecosystem for founders and solopreneurs who need sharper thinking before tools, systems before scale, and content after clarity.',
  alternates: {
    canonical: '/clarity-square/',
  },
};

export default function ClaritySquarePage() {
  return <ClaritySquare />;
}

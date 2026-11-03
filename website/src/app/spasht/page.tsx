import type { Metadata } from 'next';
import { Spasht } from './Spasht';
import { SPASHT_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Kramaniti Spasht | AI-Assisted Founder Clarity',
  description:
    'A free AI-assisted clarity ecosystem for founders and solopreneurs who need sharper thinking before tools, systems before scale, and content after clarity.',
  openGraph: { title: 'Spasht | Kramaniti', description: 'Your private workspace for clearer ideas, projects and next steps.', url: `${SPASHT_URL}/`, type: 'website' },
  twitter: { card: 'summary', title: 'Spasht | Kramaniti', description: 'Your private workspace for clearer ideas, projects and next steps.' },
  alternates: {
    canonical: `${SPASHT_URL}/`,
  },
};

export default function SpashtPage() {
  return <Spasht />;
}

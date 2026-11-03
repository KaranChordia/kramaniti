import type { Metadata } from 'next';
import { Spasht } from './Spasht';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_URL, SPASHT_URL, OG_BASE } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Kramaniti Spasht | AI-Assisted Founder Clarity',
  description:
    'A free AI-assisted clarity ecosystem for founders and solopreneurs who need sharper thinking before tools, systems before scale, and content after clarity.',
  openGraph: { title: 'Spasht | Kramaniti', description: 'Your private workspace for clearer ideas, projects and next steps.', url: `${SPASHT_URL}/`, type: 'website', images: OG_BASE.images },
  twitter: { card: 'summary', title: 'Spasht | Kramaniti', description: 'Your private workspace for clearer ideas, projects and next steps.' },
  alternates: {
    canonical: `${SPASHT_URL}/`,
  },
};

const spashtJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Kramaniti Spasht',
  url: `${SPASHT_URL}/`,
  description:
    'A free AI-assisted clarity ecosystem for founders and solopreneurs who need sharper thinking before tools, systems before scale, and content after clarity.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  isAccessibleForFree: true,
  audience: { '@type': 'Audience', audienceType: 'Founders and solopreneurs' },
  publisher: { '@type': 'Organization', name: 'Kramaniti', url: SITE_URL },
};

export default function SpashtPage() {
  return (
    <>
      <JsonLd data={spashtJsonLd} />
      <Spasht />
    </>
  );
}

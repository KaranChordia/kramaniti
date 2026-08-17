import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '../../lib/seo';
import { KramanitiExperience } from './KramanitiExperience';

export const metadata: Metadata = {
  title: 'Enter the System | Kramaniti',
  description:
    'An interactive Kramaniti experience connecting strategy, systems, and practical insight through one visible operating signal.',
  alternates: {
    canonical: absoluteUrl('/experience/'),
  },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/experience/'),
    siteName: SITE_NAME,
    title: 'Enter the System | Kramaniti',
    description:
      'Move from scattered signals to a connected system for growth through Kramaniti\'s strategy-first operating sequence.',
    images: [
      {
        url: absoluteUrl(DEFAULT_OG_IMAGE),
        width: 512,
        height: 512,
        alt: `${SITE_NAME} mark`,
      },
    ],
  },
};

export default function ExperiencePage() {
  return <KramanitiExperience />;
}

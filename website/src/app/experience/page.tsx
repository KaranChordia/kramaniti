import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '../../lib/seo';
import { KramanitiExperience } from './KramanitiExperience';

export const metadata: Metadata = {
  title: 'How Kramaniti Works | Interactive Experience',
  description:
    'Follow one simple Kramaniti path: understand the work, build what helps, keep people in control, and communicate clearly.',
  alternates: {
    canonical: absoluteUrl('/experience/'),
  },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/experience/'),
    siteName: SITE_NAME,
    title: 'How Kramaniti Works | Interactive Experience',
    description:
      'See how Kramaniti moves from stuck work to a useful system and clearer communication.',
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

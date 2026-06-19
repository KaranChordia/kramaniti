import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '../../lib/seo';

export const metadata: Metadata = {
  title: 'Clarity Engine | Kramaniti',
  description:
    'A Kramaniti diagnostic experience for founders and teams who want clearer strategy, workflows, AI boundaries, and public presence before adding more tools.',
  alternates: {
    canonical: absoluteUrl('/clarity-engine/'),
  },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/clarity-engine/'),
    siteName: SITE_NAME,
    title: 'Clarity Engine | Kramaniti',
    description:
      'A diagnostic experience for clarifying strategy, workflows, AI boundaries, and public presence before adding more tools.',
    images: [
      {
        url: absoluteUrl(DEFAULT_OG_IMAGE),
        width: 512,
        height: 512,
        alt: `${SITE_NAME} mark`,
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Clarity Engine | Kramaniti',
    description:
      'Clarify strategy, workflows, AI boundaries, and public presence before adding more tools.',
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
};

export default function ClarityEngineLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

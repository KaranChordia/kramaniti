import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '../../lib/seo';

export const metadata: Metadata = {
  title: 'Clarity Engine | Kramaniti',
  description:
    'Think through one piece of work: what matters, where it gets stuck, where AI can help, and what people should decide.',
  alternates: {
    canonical: absoluteUrl('/clarity-engine/'),
  },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/clarity-engine/'),
    siteName: SITE_NAME,
    title: 'Clarity Engine | Kramaniti',
    description:
      'A focused way to understand the work, find the friction, use AI carefully, and make the next step clear.',
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
      'Understand the work, find the friction, and decide where AI can genuinely help.',
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

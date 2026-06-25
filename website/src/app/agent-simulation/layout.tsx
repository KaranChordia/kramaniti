import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '../../lib/seo';

export const metadata: Metadata = {
  title: 'Agent Simulation | Kramaniti',
  description:
    'An experimental Kramaniti operating-canvas that simulates a lead agent delegating work to specialist sub-agents, monitoring live execution, and reviewing the final result.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: absoluteUrl('/agent-simulation/'),
  },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/agent-simulation/'),
    siteName: SITE_NAME,
    title: 'Agent Simulation | Kramaniti',
    description:
      'A fixed-screen experimental operating canvas with delegation, voice, HUD traces, and review flow.',
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
    title: 'Agent Simulation | Kramaniti',
    description: 'An experimental fixed-screen agent orchestration simulation.',
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
};

export default function AgentSimulationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

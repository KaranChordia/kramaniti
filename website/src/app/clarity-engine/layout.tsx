import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clarity Engine | Kramaniti',
  description:
    'A Kramaniti diagnostic experience for founders and teams who want clearer strategy, workflows, AI boundaries, and public presence before adding more tools.',
};

export default function ClarityEngineLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

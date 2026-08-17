import type { Metadata } from 'next';
import { BlocksWorkspace } from './BlocksWorkspace';

export const metadata: Metadata = {
  title: 'Kramaniti Blocks',
  description: 'A modular workspace for structured, reviewable intelligent work.',
  robots: { index: false, follow: false, noarchive: true },
};

export default function BlocksPage() {
  return <BlocksWorkspace />;
}

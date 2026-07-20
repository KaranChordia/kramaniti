import type { Metadata } from 'next';
import { KramanitiHq } from './KramanitiHq';

export const metadata: Metadata = {
  title: 'Kramaniti HQ',
  description: 'Private founder command centre for Kramaniti priorities, portfolio, follow-ups and repository activity.',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

export default function KramanitiHqPage() {
  return <KramanitiHq />;
}

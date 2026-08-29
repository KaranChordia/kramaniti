import type { Metadata } from 'next';
import { LibraryLanding } from './LibraryLanding';

export const metadata: Metadata = {
  title: 'Kramaniti Kosh',
  description: 'Open starter templates for practical agents, skills, plugins, and human review.',
};

export default function LibraryPage() {
  return <LibraryLanding />;
}

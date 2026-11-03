import type { Metadata } from 'next';
import { KOSH_URL } from '@/lib/seo';
import { LibraryWorkspace } from '../LibraryWorkspace';

export const metadata: Metadata = {
  alternates: { canonical: null },
  openGraph: { url: `${KOSH_URL}/workspace/` },
  title: 'My Kosh | Saved templates and context',
  robots: { index: false, follow: false },
  description: 'Saved templates, working copies and private context for Kosh.',
};

export default function LibraryWorkspacePage() {
  return <LibraryWorkspace />;
}

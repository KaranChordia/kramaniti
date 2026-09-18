import type { Metadata } from 'next';
import { LibraryWorkspace } from '../LibraryWorkspace';

export const metadata: Metadata = {
  title: 'My Kosh | Saved templates and context',
  robots: { index: false, follow: false },
  description: 'Saved templates, working copies and private context for Kosh.',
};

export default function LibraryWorkspacePage() {
  return <LibraryWorkspace />;
}

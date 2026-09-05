import type { Metadata } from 'next';
import { LibraryWorkspace } from '../LibraryWorkspace';

export const metadata: Metadata = {
  title: 'Kramaniti Kosh | Workspace',
  robots: { index: false, follow: false },
  description: 'Browse and download practical operating-pattern templates.',
};

export default function LibraryWorkspacePage() {
  return <LibraryWorkspace />;
}

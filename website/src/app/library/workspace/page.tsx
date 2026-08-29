import type { Metadata } from 'next';
import { LibraryWorkspace } from '../LibraryWorkspace';

export const metadata: Metadata = {
  title: 'Kramaniti Kosh | Workspace',
  description: 'Browse and download practical operating-pattern templates.',
};

export default function LibraryWorkspacePage() {
  return <LibraryWorkspace />;
}

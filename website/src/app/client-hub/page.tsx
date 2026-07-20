import type { Metadata } from 'next';
import { ClientHub } from './ClientHub';

export const metadata: Metadata = {
  title: 'Kramaniti Client Hub',
  description: 'Private communication, project tracking, notes, tasks, and reviewed assistant actions for Kramaniti clients.',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

export default function ClientHubPage() {
  return <ClientHub />;
}

import type { Metadata } from 'next';
import { KcsWorkbench } from '../../components/KCS/KcsWorkbench';

export const metadata: Metadata = {
  title: 'KCS | Kramaniti Content Studio',
  description:
    'A local Kramaniti scene-rendering surface for approved premium infographic video sequences.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function KcsPage() {
  return <KcsWorkbench />;
}

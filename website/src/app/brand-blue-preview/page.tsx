import type { Metadata } from 'next';
import { HomepageSequence } from '@/components/home/HomepageSequence';
import styles from './BrandBluePreview.module.css';

export const metadata: Metadata = {
  title: 'Dark Blue Accent Preview | Kramaniti',
  robots: {
    index: false,
    follow: false,
  },
};

export default function BrandBluePreviewPage() {
  return (
    <div className={`${styles.previewTheme} brand-blue-preview`}>
      <HomepageSequence />
    </div>
  );
}

'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './KoshPreview.module.css';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';
import { kindLabels, type LibraryKind } from '@/lib/library/libraryData';

const KOSH_SHELF: { kind: LibraryKind; title: string }[] = [
  { kind: 'Agent', title: 'Research a decision with sources you can check' },
  { kind: 'Skill', title: 'Find where a process gets stuck' },
  { kind: 'Plugin guide', title: 'Check a new app before you connect it' },
  { kind: 'Governance', title: 'Get sign-off before anything important goes out' },
];

export function KoshPreview() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.18 });

  return (
    <section className={styles.kosh} id="kosh" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className="micro-label">Kramaniti Kosh</span>
          <AnimatedHeading isVisible={isVisible}>
            A practical starting point for better AI work.
          </AnimatedHeading>
          <p className="text-secondary">
            Kosh is a focused library of how-to guides, checklists, AI assistant setups and tool setup guides. Start with a useful pattern, then make it fit your work.
          </p>
          <Link href="/library" className={styles.link}>
            Explore Kosh
            <ArrowRight size={17} strokeWidth={1.8} aria-hidden="true" />
          </Link>
        </div>

        <div className={styles.libraryObject} aria-label="A preview of the Kramaniti Kosh library">
          <div className={styles.objectHeader}>
            <span>Kramaniti Kosh</span>
            <span>Working library</span>
          </div>
          <div className={styles.shelf}>
            {KOSH_SHELF.map((item, index) => (
              <div className={styles.shelfItem} key={item.kind}>
                <span className={styles.index}>0{index + 1}</span>
                <span className={styles.itemTitle}>{item.title}</span>
                <span className={styles.itemType}>{kindLabels[item.kind]}</span>
              </div>
            ))}
          </div>
          <p className={styles.objectNote}>Built to be useful before it is impressive.</p>
        </div>
      </div>
    </section>
  );
}

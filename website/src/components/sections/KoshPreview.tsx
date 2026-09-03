'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './KoshPreview.module.css';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';

const KOSH_SHELF = [
  { type: 'Agent', title: 'Research & synthesis' },
  { type: 'Skill', title: 'Workflow diagnostic' },
  { type: 'Plugin guide', title: 'Evaluate before connecting' },
  { type: 'Governance', title: 'Human review gate' },
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
            Kosh is a focused library of clear agents, skills, plugin guides, and review templates. Start with a useful pattern, then make it fit your work.
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
              <div className={styles.shelfItem} key={item.type}>
                <span className={styles.index}>0{index + 1}</span>
                <span className={styles.itemTitle}>{item.title}</span>
                <span className={styles.itemType}>{item.type}</span>
              </div>
            ))}
          </div>
          <p className={styles.objectNote}>Built to be useful before it is impressive.</p>
        </div>
      </div>
    </section>
  );
}

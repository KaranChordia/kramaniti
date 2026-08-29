'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './FounderPreview.module.css';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';

export function FounderPreview() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.18 });

  return (
    <section className={styles.founder} id="founder-preview" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Founder</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Sequence</span>
      </div>

      <div className={styles.container}>
        <div className={`glass-border-layer ${styles.imageWrap}`}>
          <Image
            src="/assets/founder_real.jpg"
            alt="Karan Chordia, founder of Kramaniti"
            fill
            sizes="(min-width: 900px) 360px, 100vw"
            className={styles.image}
          />
        </div>

        <div className={styles.content}>
          <span className="micro-label">Founder-led</span>
          <AnimatedHeading isVisible={isVisible}>Built by someone who sees the work and the story together.</AnimatedHeading>
          <p className="text-secondary">
            Karan Chordia&apos;s background spans commercial media, workflow design, and practical AI systems. It shaped a simple belief: a business should communicate from what it genuinely does well.
          </p>
          <p className="text-secondary">
            Kramaniti starts with the work, builds only what helps, and communicates the result clearly.
          </p>
          <Link href="/founder" className={styles.link}>
            Meet the founder
          </Link>
        </div>
      </div>
    </section>
  );
}

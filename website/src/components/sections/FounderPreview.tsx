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
          <AnimatedHeading isVisible={isVisible}>Built by a strategist who understands systems and storytelling.</AnimatedHeading>
          <p className="text-secondary">
            Karan Chordia&apos;s background spans commercial media, workflow design, and practical AI systems. That experience shapes a simple belief: how a business communicates should reflect how it actually creates value.
          </p>
          <p className="text-secondary">
            Kramaniti therefore begins with the business, builds only what is useful, and communicates the result clearly.
          </p>
          <Link href="/founder" className={styles.link}>
            Meet Karan
          </Link>
        </div>
      </div>
    </section>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './FounderPreview.module.css';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';

export function FounderPreview() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.18, freezeOnceVisible: true });

  return (
    <section className={styles.founder} id="founder-preview" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Founder</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Sequence</span>
      </div>

      <div className={styles.container}>
        <div className={styles.imageWrap}>
          <Image
            src="/kramaniti/assets/founder_real.jpg"
            alt="Karan Chordia, founder of Kramaniti"
            fill
            sizes="(min-width: 900px) 360px, 100vw"
            className={styles.image}
          />
        </div>

        <div className={styles.content}>
          <span className="micro-label">Founder-led</span>
          <AnimatedHeading isVisible={isVisible}>Built by a strategist who understands systems and cinematic communication.</AnimatedHeading>
          <p className="text-secondary">
            Kramaniti is shaped by Karan Chordia&apos;s path from commercial media and spatial storytelling into workflow design and practical AI infrastructure. The work stays grounded in first-principles thinking: understand the business, build what matters, and communicate clearly.
          </p>
          <Link href="/founder" className={styles.link}>
            Read the Founder Story
          </Link>
        </div>
      </div>
    </section>
  );
}

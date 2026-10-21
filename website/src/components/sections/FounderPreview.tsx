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
          <span className="micro-label">Founder-Architected · System-Multiplied</span>
          <AnimatedHeading isVisible={isVisible}>Built at the intersection of computational logic and cinematic narrative.</AnimatedHeading>
          <p className="text-secondary">
            Karan Chordia&apos;s background spans commercial media across co-working, hospitality, startup, and B2B technology ecosystems, quantitative systems R&amp;D, and full-stack AI architecture.
          </p>
          <p className="text-secondary">
            Instead of scaling through agency headcount bloat, Kramaniti runs on its own governed agent and delivery infrastructure—pairing bespoke workflow engineering with proprietary software like <strong>Spasht</strong> and <strong>Kosh</strong>.
          </p>
          <Link href="/founder" className={styles.link}>
            Read the founder &amp; operating thesis
          </Link>
        </div>
      </div>
    </section>
  );
}

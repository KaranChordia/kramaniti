'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './FounderPreview.module.css';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';
import { SectionKicker } from '../ui/SectionKicker';

export function FounderPreview() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.18 });

  return (
    <section className={`${styles.founder} home-section`} id="founder-preview" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Founder</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Sequence</span>
      </div>

      <div className={`${styles.container} home-container`}>
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
          <SectionKicker>Founder-led</SectionKicker>
          <AnimatedHeading isVisible={isVisible}>Built by a strategist who understands systems and storytelling.</AnimatedHeading>
          <p className="home-lede">
            Karan Chordia&apos;s background spans commercial media, workflow design, and practical AI systems. That experience shapes a simple belief: how a business communicates should reflect how it actually creates value.
          </p>
          <p className="home-lede">
            Kramaniti therefore begins with the business, builds only what is useful, and communicates the result clearly.
          </p>
          <Link href="/founder" className="text-cta">
            Meet Karan
            <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

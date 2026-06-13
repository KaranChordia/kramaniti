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
          <AnimatedHeading isVisible={isVisible}>Founder-led by someone who understands both systems and perception.</AnimatedHeading>
          <p className="text-secondary">
            Kramaniti is shaped by Karan Chordia&apos;s path from commercial media and spatial storytelling into workflow design and practical AI infrastructure. That combination matters: the work is not only about making businesses more efficient, but making sure the brand&apos;s external presence reflects how the business actually creates value.
          </p>
          <p className="text-secondary">
            The approach stays grounded in first-principles thinking: understand the business, clarify the operating logic, build only what matters, and communicate with precision.
          </p>
          <Link href="/founder" className={styles.link}>
            Read the Founder Story
          </Link>
        </div>
      </div>
    </section>
  );
}

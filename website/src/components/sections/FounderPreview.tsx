import Image from 'next/image';
import Link from 'next/link';
import styles from './FounderPreview.module.css';

export function FounderPreview() {
  return (
    <section className={styles.founder} id="founder-preview">
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
          <h2>Built by a strategist who understands systems and cinematic communication.</h2>
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

import Image from 'next/image';
import Link from 'next/link';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Sequence</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Clarity</span>
      </div>

      <div className={styles.container}>
        <div className={styles.shell}>
          <div className={styles.brandCard}>
            <div className={styles.brandInner}>
              <div className={styles.brandTop}>
                <Link href="/" className={styles.logoLink} aria-label="Kramaniti home">
                  <Image
                    src="/assets/brand/kramaniti-mark-gold.png"
                    alt="Kramaniti logo"
                    width={72}
                    height={72}
                    className={styles.logoMark}
                  />
                </Link>
                <div className={styles.brandText}>
                  <span className={styles.brandName}>Kramaniti</span>
                  <span className={styles.brandLabel}>The logic of sequence</span>
                </div>
              </div>

              <div className={styles.ctaNote}>
                <span className={styles.ctaEyebrow}>Start with clarity</span>
                <p>The first useful step is finding the workflow worth designing properly.</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.bottomNote}>Built for brands that need clarity before scale.</p>
          <p className={styles.copyright}>© {new Date().getFullYear()} Kramaniti. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

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
        <div className={styles.grid}>
          <div className={styles.leftSection}>
            <Link href="/" className={styles.logoGroup} aria-label="Kramaniti home">
              <Image
                src="/assets/brand/kramaniti-mark-gold.png"
                alt="Kramaniti logo"
                width={70}
                height={70}
                className={styles.logoMark}
              />
            </Link>
            <div className={styles.brandText}>
              <span className={styles.brandName}>Kramaniti</span>
              <span className={styles.brandLabel}>Logic in Sequence.</span>
            </div>
          </div>

          <div className={styles.rightSection}>
            <div className={styles.contactItem}>
              <span className={styles.label}>Address</span>
              <span className={styles.value}>43, Residency Rd, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560025</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.label}>Contact</span>
              <span className={styles.value}>+91-8088709808</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.label}>Email</span>
              <a href="mailto:ask@kramaniti.com" className={styles.linkValue}>ask@kramaniti.com</a>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.label}>Founder</span>
              <a href="mailto:karan@kramaniti.com" className={styles.linkValue}>karan@kramaniti.com</a>
            </div>
            <div className={styles.legalLinks}>
              <Link href="/privacy" className={styles.legalLink}>Privacy Policy</Link>
              <span className={styles.separator}>•</span>
              <Link href="/terms" className={styles.legalLink}>Terms & Conditions</Link>
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

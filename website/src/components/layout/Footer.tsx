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
              <span className={styles.brandLabel}>Clearer work. Clearer communication.</span>
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
            <div className={styles.contactItem}>
              <span className={styles.label}>Explore</span>
              <div className={styles.legalLinks}>
                <Link href="/work" className={styles.legalLink}>Work</Link>
                <span className={styles.separator}>•</span>
                <Link href="/founder" className={styles.legalLink}>Founder</Link>
                <span className={styles.separator}>•</span>
                <Link href="/insights" className={styles.legalLink}>Insights</Link>
                <span className={styles.separator}>•</span>
                <Link href="/clarity-engine" className={styles.legalLink}>Clarity Engine</Link>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.bottomNote}>Practical systems. Human judgment. Clear communication.</p>
          <p className={styles.copyright}>© {new Date().getFullYear()} Kramaniti. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

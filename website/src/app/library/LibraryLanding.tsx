import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './landing.module.css';

const elements = ['Agents', 'Skills', 'Plugins', 'Governance'];

export function LibraryLanding() {
  return (
    <main className={styles.page} data-disable-global-shockwave="true">
      <nav className={styles.floatingNav} aria-label="Kosh guide navigation">
        <Link href="/" className={styles.brand}>
          <Image src="/assets/brand/kramaniti-kosh-mark.png" alt="" width={52} height={52} className={styles.brandMark} priority />
          <strong>Kramaniti</strong><span>Kosh</span>
        </Link>
        <span className={styles.navLabel}>Guide</span>
        <Link href="/library/workspace" className={styles.navAction}>Sign in to Kosh <ArrowRight size={15} /></Link>
      </nav>

      <section className={styles.hero} aria-labelledby="kosh-title">
        <p className={styles.eyebrow}>Kramaniti Kosh</p>
        <h1 id="kosh-title">A practical library for human-led systems.</h1>
        <p className={styles.intro}>Start with a useful pattern. Make it fit the work. Keep the consequential call with people.</p>
        <Link href="/library/workspace" className={styles.primaryAction}>Sign in to enter Kosh <ArrowRight size={18} /></Link>
        <div className={styles.elements} aria-label="What Kosh contains">
          {elements.map((element, index) => <span key={element}><small>0{index + 1}</small>{element}</span>)}
        </div>
      </section>
    </main>
  );
}

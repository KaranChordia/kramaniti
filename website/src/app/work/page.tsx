import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '../../lib/seo';
import styles from './Work.module.css';

export const metadata: Metadata = {
  title: 'Selected Work | Kramaniti',
  description:
    'See how Kramaniti understands the work, builds practical systems, and communicates the value clearly.',
  alternates: {
    canonical: absoluteUrl('/work/'),
  },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/work/'),
    siteName: SITE_NAME,
    title: 'Selected Work | Kramaniti',
    description:
      'Selected Kramaniti work across strategy, systems and story.',
    images: [
      {
        url: absoluteUrl(DEFAULT_OG_IMAGE),
        width: 512,
        height: 512,
        alt: `${SITE_NAME} mark`,
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Selected Work | Kramaniti',
    description:
      'Selected work that shows how Kramaniti moves from strategy to practical systems and story.',
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
};

const workFolders = [
  {
    title: 'Nexocean',
    href: '/work/nexocean',
    labels: ['5-month contract', '6 internal AI modules', '6 brand & adoption films'],
    copy: 'Designed and shipped the six-module Wingman recruiter workflow suite alongside six brand and adoption films—connecting daily recruitment operations with a coherent brand story.',
    footer: 'View Nexocean architecture & films',
    status: 'Selected work',
  },
  {
    title: 'Maitri',
    href: '/work/maitri',
    labels: ['Consumer brand', 'Product + validation system', 'Live Manu demo'],
    copy: 'Active foundation retainer turning a broad story-world vision into one focused first product box, character system, demand validation plan, and live consumer demo.',
    footer: 'View Maitri foundation work',
    status: 'Active work',
  },
];

const velocitySignals = [
  {
    metric: '2 Live Products',
    label: 'Proprietary Software IP',
    detail: 'Kramaniti Spasht (/spasht) and Kramaniti Kosh (/kosh), designed and shipped in-house.',
  },
  {
    metric: '25+ Patterns',
    label: 'Governed Operating Templates',
    detail: 'Context-adaptable agents, skills, plugin evaluation guides, and human review gates.',
  },
  {
    metric: '6 AI Modules',
    label: 'Enterprise Tooling Velocity',
    detail: 'Six specialized recruiter workflow tools + six brand films delivered inside a 5-month contract.',
  },
  {
    metric: '46+ Essays',
    label: 'Published Systems Research',
    detail: 'Original first-principles writing on workflow architecture, human-AI boundaries, and clarity.',
  },
];

export default function WorkIndexPage() {
  const workIndexJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Kramaniti selected work',
    url: absoluteUrl('/work/'),
    description:
      'Selected Kramaniti work across strategy, systems and story.',
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: absoluteUrl('/'),
    },
  };

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(workIndexJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>Selected Work</span>
              <h1>See how clearer work becomes a useful system.</h1>
              <p className={styles.lead}>
                Each project starts with the real work: what matters, where it gets stuck, what should be built, and how the value should be explained.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-label="Selected work folders">
          <div className={styles.container}>
            <div className={styles.folderGrid}>
              {workFolders.map((folder) => (
                <Link key={folder.title} href={folder.href} className={styles.folderCard}>
                  <div className={styles.folderTop}>
                    <div className={styles.folderMeta}>
                      {folder.labels.map((label) => (
                        <span key={label}>{label}</span>
                      ))}
                    </div>
                    <h2>{folder.title}</h2>
                    <p>{folder.copy}</p>
                  </div>
                  <div className={styles.folderFooter}>
                    <span>{folder.footer}</span>
                    <span>{folder.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.velocitySection} aria-labelledby="velocity-heading">
          <div className={styles.container}>
            <div className={styles.velocityHeader}>
              <span className="micro-label">Execution Footprint · Verified Output</span>
              <h2 id="velocity-heading">Software products, internal tooling, and systems research built in-house.</h2>
            </div>
            <ul className={styles.velocityGrid} role="list">
              {velocitySignals.map((item) => (
                <li key={item.label} className={styles.velocityCard}>
                  <span className={styles.velocityMetric}>{item.metric}</span>
                  <span className={styles.velocityLabel}>{item.label}</span>
                  <p className={styles.velocityDetail}>{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

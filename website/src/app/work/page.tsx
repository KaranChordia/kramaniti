import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '../../lib/seo';
import styles from './Work.module.css';

export const metadata: Metadata = {
  title: 'Selected Work | Kramaniti',
  description:
    'Selected Kramaniti work across strategy, systems, workflow infrastructure, brand growth, and public-facing digital presence.',
  alternates: {
    canonical: absoluteUrl('/work/'),
  },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/work/'),
    siteName: SITE_NAME,
    title: 'Selected Work | Kramaniti',
    description:
      'A folder-style view of selected Kramaniti work across internal systems, product strategy, content, and public-facing digital presence.',
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
      'Selected Kramaniti work across strategy, systems, workflow infrastructure, and content.',
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
};

const workFolders = [
  {
    title: 'Nexocean',
    href: '/work/nexocean',
    labels: ['Recruitment operations', 'Internal tools', 'Brand content'],
    copy: 'A five-month contract engagement focused on recruiter workflow tooling, practical AI support, and cinematic brand presence.',
    footer: 'Open Nexocean folder',
    status: 'Selected work',
  },
  {
    title: 'Maitri',
    href: '/work/maitri',
    labels: ['Consumer brand', 'Product strategy', 'Content systems'],
    copy: 'A foundation retainer shaping a story-first companion doll universe through strategy, the Manu character system, validation, content, and a live pre-launch demo.',
    footer: 'Open Maitri folder',
    status: 'Work in progress',
  },
];

export default function WorkIndexPage() {
  const workIndexJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Kramaniti selected work',
    url: absoluteUrl('/work/'),
    description:
      'A selected-work index for Kramaniti projects across strategy, systems, content, and brand growth.',
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
              <h1>Project folders for strategy, systems, and brand growth work.</h1>
              <p className={styles.lead}>
                A concise view into Kramaniti work where clarity, operating infrastructure, and content systems are built together instead of treated as separate efforts.
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
      </main>
      <Footer />
    </>
  );
}

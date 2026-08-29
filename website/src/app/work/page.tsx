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
      'Selected Kramaniti work across workflow clarity, practical systems, and communication.',
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
      'Selected work that shows how Kramaniti moves from a real problem to a useful system and clearer communication.',
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
};

const workFolders = [
  {
    title: 'Nexocean',
    href: '/work/nexocean',
    labels: ['Recruitment work', 'Internal tools', 'Communication'],
    copy: 'A five-month contract focused on clearer recruiter workflows, practical AI support, and brand communication.',
    footer: 'View Nexocean work',
    status: 'Selected work',
  },
  {
    title: 'Maitri',
    href: '/work/maitri',
    labels: ['Consumer brand', 'Product direction', 'Communication'],
    copy: 'Active foundation work shaping a story-led companion doll world through product direction, validation, content, and a live demo.',
    footer: 'View Maitri work',
    status: 'Active work',
  },
];

export default function WorkIndexPage() {
  const workIndexJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Kramaniti selected work',
    url: absoluteUrl('/work/'),
    description:
      'Selected Kramaniti work across workflow clarity, practical systems, and communication.',
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
      </main>
      <Footer />
    </>
  );
}

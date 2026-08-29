import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '../../../lib/seo';
import styles from './Maitri.module.css';

export const metadata: Metadata = {
  title: 'Maitri Selected Work | Kramaniti',
  description:
    'Active Kramaniti foundation work for Maitri: one clear product direction, a Manu-first story world, validation, communication, and a live demo.',
  alternates: {
    canonical: absoluteUrl('/work/maitri/'),
  },
  openGraph: {
    type: 'article',
    url: absoluteUrl('/work/maitri/'),
    siteName: SITE_NAME,
    title: 'Maitri Selected Work | Kramaniti',
    description:
      'See how Kramaniti is helping Maitri turn a large story-world idea into one focused product, validation plan, communication system, and live demo.',
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
    title: 'Maitri Selected Work | Kramaniti',
    description:
      'Active foundation work for Maitri across product direction, validation, communication, and a live Manu-first demo.',
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
};

const workModules = [
  {
    title: 'Strategy and positioning',
    label: 'Clear direction',
    copy: 'Focused Maitri on a simple starting point: let children befriend the character before the doll becomes the purchase moment.',
  },
  {
    title: 'Manu character system',
    label: 'First character',
    copy: 'Made Manu the first anchor, with a clear character guide, story direction, parent prompts, value themes, and child-safe emotional framing.',
  },
  {
    title: 'The first box',
    label: 'Product direction',
    copy: 'Shaped one complete Manu box: doll, 32-page storybook, character letter, activities, and stickers before adding more products.',
  },
  {
    title: 'Test before expanding',
    label: 'Real feedback',
    copy: 'Defined a waitlist, parent survey, beta-reader feedback, school-interest checks, preorder questions, and a simple monthly review.',
  },
  {
    title: 'A clear communication rhythm',
    label: 'Communication',
    copy: 'Created the first Instagram, YouTube Shorts, newsletter, and story-prompt rhythm so communication grows from the character world.',
  },
  {
    title: 'Organized internal work',
    label: 'Workflows',
    copy: 'Mapped focused ChatGPT Projects and reusable support so strategy, product, communication, and validation stay organized with human review.',
  },
];

const outcomes = [
  'Kept the launch narrow: emotional attachment to Manu first, ecosystem expansion later.',
  'Connected the product, story, communication, waitlist, and internal work into one clear foundation.',
  'Built a live Maitri Circle demo and Manu-first character page to make the strategy tangible.',
  'Protected product, safety, history, and preorder claims behind review instead of premature public promises.',
];

export default function MaitriWorkPage() {
  const selectedWorkJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: 'Maitri selected work',
    url: absoluteUrl('/work/maitri/'),
    description:
      'Active Maitri foundation work across product direction, a Manu-first story world, validation, communication, and a live demo.',
    creator: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: absoluteUrl('/'),
    },
    about: [
      'brand strategy',
      'product strategy',
      'character universe',
      'content systems',
      'demand validation',
      'workflow design',
    ],
  };

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(selectedWorkJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.atmosphere} aria-hidden="true">
            <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Maitri</span>
            <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Manu</span>
          </div>

          <div className={styles.container}>
            <div className={styles.heroLayout}>
              <div className={styles.heroCopy}>
                <span className={styles.eyebrow}>Selected Work / Maitri</span>
                <h1>Turning a large story-world idea into one clear first product.</h1>
                <p className={styles.lead}>
                  Kramaniti is helping Maitri shape its first product, character world, validation plan, communication, and live demo—starting with Manu and one focused box.
                </p>
                <div className={styles.metaGrid} aria-label="Project summary">
                  <div>
                    <span>Engagement</span>
                    <strong>Foundation retainer</strong>
                  </div>
                  <div>
                    <span>Scope</span>
                    <strong>Product + systems + communication</strong>
                  </div>
                  <div>
                    <span>Environment</span>
                    <strong>Consumer product launch</strong>
                  </div>
                </div>
              </div>

              <aside className={styles.heroPanel}>
                <span className="micro-label">Starting point</span>
                <p>
                  Maitri should not scale a full ecosystem on day one. The first job is to help parents see educational and cultural value while helping children fall in love with Manu.
                </p>
                <Link href="#demo" className={styles.panelLink}>
                  View the demo work
                </Link>
              </aside>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className="micro-label">What we clarified</span>
              <h2>One plan for the product, story, feedback, and communication.</h2>
              <p>
                The work turns a large idea into focused next steps: build attachment to Manu, define the first box, gather real feedback, and communicate from an approved story system.
              </p>
            </div>

            <div className={styles.moduleGrid}>
              {workModules.map((module, index) => (
                <article key={module.title} className={styles.moduleCard}>
                  <div className={styles.moduleTop}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span className="micro-label">{module.label}</span>
                  </div>
                  <h3>{module.title}</h3>
                  <p>{module.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.splitSection}>
              <div>
                <span className="micro-label">The approach</span>
                <h2>Start with Manu. Test the idea. Build from what families value.</h2>
              </div>
              <div className={styles.outcomeList}>
                {outcomes.map((outcome) => (
                  <div key={outcome} className={styles.outcomeItem}>
                    <span aria-hidden="true"></span>
                    <p>{outcome}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} id="demo">
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className="micro-label">Live demo</span>
              <h2>A pre-launch world where families can meet Manu.</h2>
              <p>
                The current demo introduces the Maitri world, brings Manu forward as the first character, and creates a place to test future waitlist, parent, reader, school, and preorder interest.
              </p>
            </div>

            <article className={styles.demoPanel}>
              <div>
                <span className="micro-label">What families can see</span>
                <h3>Consumer-facing website and Manu character world</h3>
                <p>
                  The live demo gives families a simple way to explore the Maitri world, meet Manu, and understand the emotional promise before the product is ready to launch.
                </p>
              </div>
              <div className={styles.demoLinks}>
                <Link href="https://karanchordia.github.io/Maitri/" className={styles.demoLink}>
                  Open Maitri Circle
                </Link>
                <Link href="https://karanchordia.github.io/Maitri/characters.html" className={styles.demoLink}>
                  Open Manu page
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section className={styles.closing}>
          <div className={styles.container}>
            <div className={styles.closingCard}>
              <span className="micro-label">Current status</span>
              <h2>Maitri is still active foundation work.</h2>
              <p>
                This page shows the current direction and live demo. It does not present Maitri as a finished product or claim launch, sales, approval, or manufacturing results.
              </p>
              <div className={styles.demoLinks}>
                <Link href="/#contact" className={styles.closingLink}>Start with a workflow audit</Link>
                <Link href="/work" className={styles.closingLink}>Back to selected work</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

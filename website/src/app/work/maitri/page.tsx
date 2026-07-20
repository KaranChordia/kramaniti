import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '../../../lib/seo';
import styles from './Maitri.module.css';

export const metadata: Metadata = {
  title: 'Maitri Selected Work | Kramaniti',
  description:
    'A Kramaniti selected-work page on the Maitri foundation retainer: strategy, Manu-first product direction, content systems, validation, and a pre-launch demo.',
  alternates: {
    canonical: absoluteUrl('/work/maitri/'),
  },
  openGraph: {
    type: 'article',
    url: absoluteUrl('/work/maitri/'),
    siteName: SITE_NAME,
    title: 'Maitri Selected Work | Kramaniti',
    description:
      'Selected work covering strategy, product architecture, Manu character development, validation systems, content planning, and digital demo work for Maitri.',
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
      'Strategy, systems, content, validation, and demo work for the Maitri story-first companion doll universe.',
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
};

const workModules = [
  {
    title: 'Strategy and positioning',
    label: 'Foundation clarity',
    copy: 'Organized Maitri around a story-first companion universe: children should befriend the character before the doll becomes the purchase moment.',
  },
  {
    title: 'Manu character system',
    label: 'Character universe',
    copy: 'Built Manu as the first anchor with a reusable character bible, story direction, parent prompts, value themes, and child-safe emotional framing.',
  },
  {
    title: 'First box architecture',
    label: 'Product strategy',
    copy: 'Shaped the first product around one complete Manu box: doll, 32-page storybook, character letter, activities, and stickers before scaling add-ons.',
  },
  {
    title: 'Validation and signal design',
    label: 'Demand proof',
    copy: 'Defined the waitlist, parent survey, beta-reader signals, school-interest checks, preorder objections, and monthly signal report structure.',
  },
  {
    title: 'Content operating rhythm',
    label: 'Brand presence',
    copy: 'Created month-one Instagram, YouTube Shorts, newsletter, and story-prompt systems so public communication grows from the character world.',
  },
  {
    title: 'ChatGPT Business setup',
    label: 'Internal workflows',
    copy: 'Mapped focused ChatGPT Projects and reusable agents so Maitri can keep strategy, product, content, and validation work organized with human review.',
  },
];

const outcomes = [
  'Kept the launch narrow: emotional attachment to Manu first, ecosystem expansion later.',
  'Connected product, story, content, waitlist, and operating workflows into one foundation retainer.',
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
      'A selected-work page about Maitri strategy, product direction, character-universe development, validation systems, content planning, and demo work.',
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
                <h1>Building a story-led companion doll world around Manu.</h1>
                <p className={styles.lead}>
                  Kramaniti is helping Maitri shape its first product, character world, validation plan, content system, and pre-launch experience—starting with one clear character and one focused box.
                </p>
                <div className={styles.metaGrid} aria-label="Project summary">
                  <div>
                    <span>Engagement</span>
                    <strong>Foundation retainer</strong>
                  </div>
                  <div>
                    <span>Scope</span>
                    <strong>Strategy + content + systems</strong>
                  </div>
                  <div>
                    <span>Environment</span>
                    <strong>Consumer product launch</strong>
                  </div>
                </div>
              </div>

              <aside className={styles.heroPanel}>
                <span className="micro-label">Project Thesis</span>
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
              <span className="micro-label">Foundation Built</span>
              <h2>One clear plan for the product, story, validation, and content.</h2>
              <p>
                The work turns a large brand idea into focused next steps: build attachment to Manu, define the first box, gather real feedback, and create content from an approved story system.
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
                <span className="micro-label">Kramaniti Pattern</span>
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
              <span className="micro-label">Digital Experience</span>
              <h2>A pre-launch world where families can meet Manu.</h2>
              <p>
                The current demo introduces Maitri as a story-first companion universe, brings Manu forward as the first character anchor, and supports future waitlist, parent survey, beta reader, school, and preorder validation flows.
              </p>
            </div>

            <article className={styles.demoPanel}>
              <div>
                <span className="micro-label">Prototype Surface</span>
                <h3>Consumer-facing website and Manu character world</h3>
                <p>
                  The live prototype work moved away from internal planning language and toward a polished, child-facing experience where families can explore the Maitri world, meet Manu, and understand the emotional promise before product launch.
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
              <span className="micro-label">Selected Work Note</span>
              <h2>A public snapshot of active foundation work.</h2>
              <p>
                This page presents the business-facing shape of the Maitri engagement without claiming launch outcomes, sales numbers, product approvals, or final manufacturing readiness.
              </p>
              <Link href="/work" className={styles.closingLink}>
                Back to work folders
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

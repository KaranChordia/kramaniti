import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '../../../lib/seo';
import styles from './Nexocean.module.css';

export const metadata: Metadata = {
  title: 'Nexocean Selected Work | Kramaniti',
  description:
    'A Kramaniti selected-work page on a five-month Nexocean contract engagement involving internal recruiter workflow tools and brand content.',
  alternates: {
    canonical: absoluteUrl('/work/nexocean/'),
  },
  openGraph: {
    type: 'article',
    url: absoluteUrl('/work/nexocean/'),
    siteName: SITE_NAME,
    title: 'Nexocean Selected Work | Kramaniti',
    description:
      'Selected work covering internal recruiter workflow tools, practical AI support, and brand content for a five-month Nexocean contract engagement.',
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
    title: 'Nexocean Selected Work | Kramaniti',
    description:
      'Internal workflow tooling and brand-content support from a five-month Nexocean contract engagement.',
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
};

const systemModules = [
  {
    title: 'Wingman Launchpad',
    label: 'Operating entry point',
    copy: 'A central access layer for recruiters to move between the Wingman tools, shared workspace, assistant surfaces, and tool-specific workflows.'
  },
  {
    title: 'Wingmanager',
    label: 'Recruiter workspace',
    copy: 'A day-to-day workspace for tasks, notes, files, conversations, and shared context so recruiter follow-through could stay organized.'
  },
  {
    title: 'Atlas',
    label: 'Resume intelligence',
    copy: 'A resume analysis assistant for PDF and text intake, structured scoring, ATS-oriented suggestions, recruiter notes, and follow-up planning.'
  },
  {
    title: 'Blaze',
    label: 'JD to sourcing pack',
    copy: 'A job-description workflow that converts raw role input into company context, role summaries, skill priorities, candidate explanations, and boolean/X-ray search strings.'
  },
  {
    title: 'Zephyr',
    label: 'Outreach copilot',
    copy: 'A communication system for email, WhatsApp, and LinkedIn drafting, reusable templates, tone control, call examples, and recruiter learning resources.'
  },
  {
    title: 'Radar',
    label: 'Talent intelligence',
    copy: 'An AI-talent database concept focused on resume extraction, role and skill tagging, AI-relevance review, candidate filtering, shortlist exports, and profile-quality checks.'
  }
];

const outcomes = [
  'Connected intake, analysis, sourcing, outreach, and follow-up into a clearer recruiter operating flow.',
  'Translated AI capability into practical tools recruiters could understand through named assistants and focused workflows.',
  'Built brand-facing content alongside internal infrastructure so the digital presence and product story could move together.'
];

const featuredWalkthrough = {
  id: 'cfRzZO1UDEU',
  title: 'Nexocean Internal Tools Portfolio',
  type: 'Portfolio walkthrough',
  copy: 'A screen-recorded walkthrough of the Wingman Assistant ecosystem, showing the internal tools, UI decisions, product flow, and recruiter-facing experience across the operating layer.'
};

const videos = [
  {
    id: 'EKnkY0vO0sw',
    title: 'Introducing Wingman Assistants',
    type: 'System showcase',
    copy: 'Introduces the assistant ecosystem and the idea of giving recruiters focused Wingman support across daily workflows.'
  },
  {
    id: 'rmFfTZcY1V8',
    title: 'Embracing AI | Wingman Assistants',
    type: 'Adoption narrative',
    copy: 'Frames practical AI adoption for the recruitment team without making the system feel abstract or overly technical.'
  },
  {
    id: '8Po5MElNfD4',
    title: 'Introducing Radar',
    type: 'Product showcase',
    copy: 'Shows the dedicated talent intelligence layer built around cleaner AI candidate discovery and recruiter-ready signals.'
  },
  {
    id: 'hNgzGDUBErI',
    title: 'Nexocean Impact 2025',
    type: 'Brand presence',
    copy: 'A broader brand-impact film for Nexocean, connecting the company story to a more polished public presence.'
  },
  {
    id: 'fH0McDMkKCc',
    title: 'Great Hire Begins Here',
    type: 'Cinematic brand film',
    copy: 'A key content showcase: cinematic recruiting communication designed to make Nexocean feel sharper, more human, and more memorable.'
  },
  {
    id: 'hYqmTED3DVs',
    title: 'WAVES by Nexocean',
    type: 'Event brand system',
    copy: 'Positions the Waves event experience as part of Nexocean&apos;s digital presence and talent-community communication.'
  }
];

export default function NexoceanWorkPage() {
  const selectedWorkJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: 'Nexocean selected work',
    url: absoluteUrl('/work/nexocean/'),
    description:
      'A selected-work page about internal recruiter workflow tools and brand content support during a five-month Nexocean contract engagement.',
    creator: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: absoluteUrl('/'),
    },
    about: [
      'recruiter workflow tools',
      'internal AI support',
      'brand content',
      'workflow systems',
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
            <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Wingman</span>
            <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Nexocean</span>
          </div>

          <div className={styles.container}>
            <div className={styles.heroLayout}>
              <div className={styles.heroCopy}>
                <span className={styles.eyebrow}>Selected Work / Nexocean</span>
                <h1>Building practical tools for recruiter workflows.</h1>
                <p className={styles.lead}>
                  During a five-month contract, Kramaniti supported Nexocean with internal recruiter tools and brand content—helping connect everyday recruitment work with clearer AI support.
                </p>
                <div className={styles.metaGrid} aria-label="Project summary">
                  <div>
                    <span>Engagement</span>
                    <strong>5-month contract</strong>
                  </div>
                  <div>
                    <span>Scope</span>
                    <strong>Internal tools + content</strong>
                  </div>
                  <div>
                    <span>Environment</span>
                    <strong>Recruitment operations</strong>
                  </div>
                </div>
              </div>

              <aside className={styles.heroPanel}>
                <span className="micro-label">Project Thesis</span>
                <p>
                  Recruiters need tools that support the way they already work—from intake and analysis to sourcing, outreach, and follow-up.
                </p>
                <Link href="#videos" className={styles.panelLink}>
                  View the showcases
                </Link>
              </aside>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className="micro-label">System Built</span>
              <h2>A connected set of tools for everyday recruiter work.</h2>
              <p>
                Wingman Assistants supported different parts of the recruitment process while keeping each tool focused and easy to understand.
              </p>
            </div>

            <div className={styles.moduleGrid}>
              {systemModules.map((module, index) => (
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
                <h2>Strategy before tools. Systems before scale. Content after clarity.</h2>
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

        <section className={styles.section} id="videos">
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className="micro-label">Video Showcases</span>
              <h2>Internal tools and brand content, shown through video.</h2>
              <p>
                These videos show both sides of the engagement: a deeper internal-tools walkthrough, plus the cinematic content layer that helped shape Nexocean&apos;s public-facing communication.
              </p>
            </div>

            <article className={styles.featuredVideoCard}>
              <div className={styles.featuredVideoFrame}>
                <iframe
                  src={`https://www.youtube.com/embed/${featuredWalkthrough.id}`}
                  title={featuredWalkthrough.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <div className={styles.featuredVideoBody}>
                <span className="micro-label">{featuredWalkthrough.type}</span>
                <h3>{featuredWalkthrough.title}</h3>
                <p>{featuredWalkthrough.copy}</p>
              </div>
            </article>

            <div className={styles.videoGrid}>
              {videos.map((video) => (
                <article key={video.id} className={styles.videoCard}>
                  <div className={styles.videoFrame}>
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div className={styles.videoBody}>
                    <span className="micro-label">{video.type}</span>
                    <h3>{video.title}</h3>
                    <p>{video.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.closing}>
          <div className={styles.container}>
            <div className={styles.closingCard}>
              <span className="micro-label">Selected Work Note</span>
              <h2>Private internal infrastructure, presented with public-safe clarity.</h2>
              <p>
                The internal repository remains reference-only. This page focuses on the business-facing shape of the work: practical AI systems for recruiters, supported by premium brand communication.
              </p>
              <div className={styles.closingActions}>
                <Link href="/#contact" className={styles.closingLink}>
                  Discuss a workflow audit
                </Link>
                <Link href="/work" className={styles.closingLink}>
                  Back to work folders
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

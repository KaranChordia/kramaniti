import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '../../../lib/seo';
import styles from './Nexocean.module.css';

export const metadata: Metadata = {
  title: 'Nexocean Selected Work | Kramaniti',
  description:
    'Selected Kramaniti work from a five-month Nexocean contract: practical tools for recruiter workflows and clearer brand communication.',
  alternates: {
    canonical: absoluteUrl('/work/nexocean/'),
  },
  openGraph: {
    type: 'article',
    url: absoluteUrl('/work/nexocean/'),
    siteName: SITE_NAME,
    title: 'Nexocean Selected Work | Kramaniti',
    description:
      'See practical internal tools and brand communication from a five-month Nexocean contract focused on everyday recruiter work.',
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
      'Practical recruiter tools and brand communication from a five-month Nexocean contract.',
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
};

const systemModules = [
  {
    title: 'Wingman Launchpad',
    label: 'One starting point',
    copy: 'A central place for recruiters to open the Wingman tools, shared work, assistant support, and focused workflows.'
  },
  {
    title: 'Wingmanager',
    label: 'Recruiter workspace',
    copy: 'A day-to-day place for tasks, notes, files, conversations, and shared context so follow-ups could stay organized.'
  },
  {
    title: 'Atlas',
    label: 'Resume review',
    copy: 'Support for reading resumes, organizing key details, adding recruiter notes, and planning the next step.'
  },
  {
    title: 'Blaze',
    label: 'Role to search plan',
    copy: 'A workflow that turns a raw job description into company context, a clear role summary, skill priorities, candidate notes, and search strings.'
  },
  {
    title: 'Zephyr',
    label: 'Outreach support',
    copy: 'Support for drafting email, WhatsApp, and LinkedIn messages, with reusable examples, tone choices, and recruiter learning notes.'
  },
  {
    title: 'Radar',
    label: 'Talent search',
    copy: 'A talent database concept for reading resumes, tagging roles and skills, filtering candidates, preparing shortlists, and checking profile quality.'
  }
];

const outcomes = [
  'Brought intake, review, sourcing, outreach, and follow-up into a clearer recruiter workflow.',
  'Turned AI capability into focused tools that were easier for recruiters to understand.',
  'Built brand communication alongside the internal tools so the work and the story could move together.'
];

const featuredWalkthrough = {
  id: 'cfRzZO1UDEU',
  title: 'Nexocean Internal Tools Portfolio',
  type: 'Portfolio walkthrough',
  copy: 'A screen-recorded walkthrough of the Wingman tools, their interface, and the recruiter workflow they were designed to support.'
};

const videos = [
  {
    id: 'EKnkY0vO0sw',
    title: 'Introducing Wingman Assistants',
    type: 'System showcase',
    copy: 'Introduces the Wingman tools and how they support different parts of a recruiter’s day.'
  },
  {
    id: 'rmFfTZcY1V8',
    title: 'Embracing AI | Wingman Assistants',
    type: 'Adoption narrative',
    copy: 'Explains practical AI support for the recruitment team in clear, non-technical language.'
  },
  {
    id: '8Po5MElNfD4',
    title: 'Introducing Radar',
    type: 'Product showcase',
    copy: 'Shows the talent-search concept for finding and reviewing relevant candidates.'
  },
  {
    id: 'hNgzGDUBErI',
    title: 'Nexocean Impact 2025',
    type: 'Brand presence',
    copy: 'A broader Nexocean film that presents the company story through polished brand communication.'
  },
  {
    id: 'fH0McDMkKCc',
    title: 'Great Hire Begins Here',
    type: 'Cinematic brand film',
    copy: 'Cinematic recruiting communication designed to present Nexocean with a clear, human voice.'
  },
  {
    id: 'hYqmTED3DVs',
    title: 'WAVES by Nexocean',
    type: 'Event brand system',
    copy: 'Presents the Waves event as part of Nexocean’s communication with its talent community.'
  }
];

export default function NexoceanWorkPage() {
  const selectedWorkJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: 'Nexocean selected work',
    url: absoluteUrl('/work/nexocean/'),
    description:
      'Selected work from a five-month Nexocean contract focused on practical recruiter tools and brand communication.',
    creator: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: absoluteUrl('/'),
    },
    about: [
      'recruiter workflow tools',
      'internal AI support',
      'brand communication',
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
                <h1>Making everyday recruiter work easier to follow.</h1>
                <p className={styles.lead}>
                  During a five-month contract, Kramaniti supported Nexocean with internal tools and brand communication—connecting everyday recruitment work with practical AI support.
                </p>
                <div className={styles.metaGrid} aria-label="Project summary">
                  <div>
                    <span>Engagement</span>
                    <strong>5-month contract</strong>
                  </div>
                  <div>
                    <span>Scope</span>
                    <strong>Internal tools + communication</strong>
                  </div>
                  <div>
                    <span>Environment</span>
                    <strong>Recruitment operations</strong>
                  </div>
                </div>
              </div>

              <aside className={styles.heroPanel}>
                <span className="micro-label">Starting point</span>
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
              <span className="micro-label">What was built</span>
              <h2>Focused tools for the main parts of recruiter work.</h2>
              <p>
                Each Wingman tool supported a clear part of the recruitment process, from reading a role to following up with candidates.
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
                <span className="micro-label">The approach</span>
                <h2>Understand the work. Build what helps. Communicate it clearly.</h2>
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
              <span className="micro-label">Watch the work</span>
              <h2>Internal tools and brand communication, shown through video.</h2>
              <p>
                These videos show both sides of the engagement: the internal tools and the brand communication built around them.
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
              <span className="micro-label">What this page shows</span>
              <h2>The public view of private internal work.</h2>
              <p>
                The internal repository is not public. The videos and descriptions here show the practical recruiter tools and the communication built around them, without claiming business results.
              </p>
              <div className={styles.closingActions}>
                <Link href="/#contact" className={styles.closingLink}>
                  Start with a workflow audit
                </Link>
                <Link href="/work" className={styles.closingLink}>
                  Back to selected work
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

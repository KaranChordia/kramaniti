import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '../../lib/seo';
import styles from './Founder.module.css';

export const metadata: Metadata = {
  title: 'Founder | Kramaniti',
  description:
    'Meet Karan Chordia, founder of Kramaniti, and the thinking behind clearer work, practical AI systems, and stronger communication.',
  alternates: {
    canonical: absoluteUrl('/founder/'),
  },
  openGraph: {
    type: 'profile',
    url: absoluteUrl('/founder/'),
    siteName: SITE_NAME,
    title: 'Founder | Kramaniti',
    description:
      'Karan Chordia founded Kramaniti to make businesses easier to run and easier to understand.',
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
    title: 'Founder | Kramaniti',
    description:
      'Meet Karan Chordia and the simple principles behind Kramaniti.',
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
};

const timeline = [
  {
    title: 'Strategy',
    copy: 'Understand how the work happens and which problem is worth solving before recommending a tool.',
    tags: ['The current work', 'The real bottleneck', 'A clear plan']
  },
  {
    title: 'Systems',
    copy: 'Build practical workflows, tools, and AI support that make the business easier to run.',
    tags: ['Useful systems', 'Simple tools', 'Practical AI']
  },
  {
    title: 'Communication',
    copy: 'Turn clearer work into useful content and a message that reflects the value being created.',
    tags: ['Founder story', 'Useful content', 'Clear message']
  }
];

const advisoryTeam = [
  {
    name: 'Karan Chordia',
    role: 'Founder',
    initials: 'KC',
    image: '/assets/founder_real.jpg',
    copy: 'Karan leads Kramaniti’s strategy, workflow reviews, practical system design, and communication. He identifies the work and decisions that matter, then builds useful support around them.'
  },
  {
    name: 'Kashiesh Chordia',
    role: 'Legal & Compliance Advisor',
    initials: 'KC',
    image: null,
    copy: 'Kashiesh advises Kramaniti on agreements, documentation, compliance, filings, and regulatory matters. Her role helps keep engagements clear and responsibly structured.'
  },
  {
    name: 'Sachin Chougule',
    role: 'Business & Strategy Advisor',
    initials: 'SC',
    image: null,
    copy: 'Sachin advises Kramaniti on business direction and commercial judgment. He helps Karan assess opportunities and shape how the practice grows.'
  }
];

const principles = [
  {
    title: 'One connected view',
    copy: 'The way a business works should guide what it builds and how it communicates.'
  },
  {
    title: 'Useful over impressive',
    copy: 'A good system reduces friction and supports better decisions. Extra complexity proves nothing.'
  },
  {
    title: 'People stay in control',
    copy: 'AI can prepare, organize, and support. People closest to the context should make the important calls.'
  },
  {
    title: 'Communication follows clarity',
    copy: 'Content should make the business easier to understand and reflect the value it genuinely creates.'
  }
];

export default function FounderPage() {
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Karan Chordia',
    jobTitle: 'Founder',
    worksFor: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: absoluteUrl('/'),
    },
    url: absoluteUrl('/founder/'),
    image: absoluteUrl('/assets/founder_real.jpg'),
    description:
      'Karan Chordia leads Kramaniti across business strategy, workflow reviews, practical system design, and communication.',
    knowsAbout: [
      'workflow strategy',
      'AI systems',
      'business communication',
      'cinematic content',
      'business operations',
    ],
  };

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className={styles.atmosphere} aria-hidden="true">
            <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Founder</span>
            <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Sequence</span>
            <span className={`${styles.atmosRing} ${styles.atmosRingOne}`}></span>
            <span className={`${styles.atmosRing} ${styles.atmosRingTwo}`}></span>
          </div>

          <div className={styles.container}>
            <div className={styles.heroIntro}>
              <span className={styles.eyebrow}>Founder</span>
              <h1>Make the work clearer. Build what helps. Explain the value well.</h1>
              <p className={styles.lead}>
                Karan Chordia founded Kramaniti to make businesses easier to run and easier to understand. The work begins with how a business really operates, then builds what it needs and helps it explain its value.
              </p>
              <div className={styles.heroPills}>
                <span className={styles.heroPill}>Strategy</span>
                <span className={styles.heroPill}>Systems</span>
                <span className={styles.heroPill}>Communication</span>
              </div>
            </div>

            <div className={styles.heroGrid}>
              <div className={styles.visualColumn}>
                <div className={styles.imageCard}>
                  <div className={styles.imageFrame}>
                    <Image
                      src="/assets/founder_real.jpg"
                      alt="Karan Chordia"
                      fill
                      priority
                      sizes="(min-width: 1024px) 420px, 100vw"
                      className={styles.portrait}
                    />
                  </div>
                  <div className={styles.imageMeta}>
                    <span className={styles.metaLabel}>Karan Chordia</span>
                    <span className={styles.metaValue}>Founder / AI systems partner</span>
                  </div>
                </div>

              </div>

              <div className={styles.contentColumn}>
                <article className={styles.storyCard}>
                  <span className="micro-label">Background</span>
                  <h2>From telling the story to improving the work behind it.</h2>
                  <div className={styles.bio}>
                    <p>
                      Karan began in commercial media, helping brands shape how they were seen.
                    </p>
                    <p>
                      That work revealed a recurring problem: strong content cannot make up for unclear operations.
                    </p>
                    <p>
                      Kramaniti was built from that realization.
                    </p>
                    <p>
                      Today, Karan helps businesses understand their workflows, build practical systems, and communicate more clearly.
                    </p>
                  </div>
                </article>

                <div className={styles.statRow}>
                  <div className={styles.statCard}>
                    <span className={styles.statValue}>Story</span>
                    <span className={styles.statLabel}>Commercial media and brand storytelling</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statValue}>Systems</span>
                    <span className={styles.statLabel}>Workflows, practical AI, and internal tools</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statValue}>One practice</span>
                    <span className={styles.statLabel}>Clearer work and clearer communication</span>
                  </div>
                </div>

                <article className={styles.summaryCard}>
                  <span className="micro-label">Current Focus</span>
                  <h3>Make the business and its message work together.</h3>
                  <p className="text-secondary caption" style={{ marginBottom: '1rem' }}>
                    Kramaniti closes the gap between how a business works and how it communicates.
                  </p>
                  <p className="text-secondary caption">
                    We begin with the current workflow, find what matters most, build practical support, and turn that clarity into a stronger message.
                  </p>
                  <Link href="/#contact" className={styles.summaryLink}>Start with a workflow audit</Link>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.sectionBlock}>
          <div className={styles.atmosphere} aria-hidden="true">
            <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Strategy</span>
            <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Communication</span>
          </div>

          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className="micro-label">How the work moves</span>
              <h2>Understand. Build. Communicate.</h2>
              <p className={styles.sectionLead}>
                Understand the work first. Build the right support. Then communicate the value clearly.
              </p>
            </div>

            <div className={styles.timelineGrid}>
              {timeline.map((item, index) => (
                <article key={item.title} className={styles.timelineCard}>
                  <div className={styles.timelineTop}>
                    <span className={styles.timelineIndex}>{`0${index + 1}`}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p className="text-secondary caption">{item.copy}</p>
                  <div className={styles.tagRow}>
                    {item.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.sectionBlock}>
          <div className={styles.atmosphere} aria-hidden="true">
            <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Founder</span>
            <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Advisory</span>
          </div>

          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className="micro-label">Team</span>
              <h2>A small, focused team.</h2>
              <p className={styles.sectionLead}>
                Kramaniti is founder-led. Strategy, system design, and client delivery stay close to Karan from the first review to the final handover.
              </p>
            </div>

            <div className={styles.proofGrid}>
              {advisoryTeam.map((member) => (
                <article key={member.name} className={styles.proofCard}>
                  <div className={styles.teamPhotoFrame}>
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="(min-width: 900px) 320px, 100vw"
                        className={styles.teamPhoto}
                      />
                    ) : (
                      <span className={styles.teamInitials}>{member.initials}</span>
                    )}
                  </div>
                  <span className="micro-label">{member.role}</span>
                  <h3>{member.name}</h3>
                  <p className="text-secondary caption">{member.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.sectionBlock}>
          <div className={styles.atmosphere} aria-hidden="true">
            <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Alignment</span>
            <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Clarity</span>
          </div>

          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className="micro-label">Working principles</span>
              <h2>Simple rules for useful work.</h2>
              <p className={styles.sectionLead}>
                Every engagement aims to make the business easier to run and easier to understand.
              </p>
            </div>

            <div className={styles.principleGrid}>
              {principles.map((principle, index) => (
                <article key={principle.title} className={styles.principleCard}>
                  <div className={styles.cardAccent}></div>
                  <span className={styles.principleIndex}>{`0${index + 1}`}</span>
                  <h3>{principle.title}</h3>
                  <p className="text-secondary caption">{principle.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

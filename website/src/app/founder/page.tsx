import type { Metadata } from 'next';
import Image from 'next/image';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '../../lib/seo';
import styles from './Founder.module.css';

export const metadata: Metadata = {
  title: 'Founder | Kramaniti',
  description:
    'Meet Karan Chordia, founder of Kramaniti, and learn how he connects business strategy, practical AI systems, and clear communication.',
  alternates: {
    canonical: absoluteUrl('/founder/'),
  },
  openGraph: {
    type: 'profile',
    url: absoluteUrl('/founder/'),
    siteName: SITE_NAME,
    title: 'Founder | Kramaniti',
    description:
      'Karan Chordia founded Kramaniti to connect business strategy, practical systems, and clear communication.',
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
      'The founder profile and operating principles behind Kramaniti.',
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
};

const timeline = [
  {
    title: 'Strategy',
    copy: 'Understand the business, its workflows, and the problem worth solving before recommending a tool.',
    tags: ['Workflow review', 'Business priorities', 'Action plan']
  },
  {
    title: 'Systems',
    copy: 'Build practical workflows, internal tools, and AI support that make the business easier to run.',
    tags: ['Practical systems', 'Internal tools', 'AI support']
  },
  {
    title: 'Communication',
    copy: 'Turn business clarity into useful content and a message that reflects the value being created.',
    tags: ['Founder story', 'Content direction', 'Clear message']
  }
];

const advisoryTeam = [
  {
    name: 'Karan Chordia',
    role: 'Founder',
    initials: 'KC',
    image: '/assets/founder_real.jpg',
    copy: 'Karan leads Kramaniti’s strategy, operating diagnosis, intelligence-system design, and brand-presence direction. His role is to identify the workflows and decisions that matter, then design practical systems and communication around them.'
  },
  {
    name: 'Kashiesh Chordia',
    role: 'Legal & Compliance Advisor',
    initials: 'KC',
    image: null,
    copy: 'Kashiesh supports Kramaniti on agreements, documentation, compliance structure, governance practices, company-secretarial matters, filings, and regulatory paperwork. Her advisory role brings legal and operational discipline to the way engagements are structured and delivered.'
  },
  {
    name: 'Sachin Chougule',
    role: 'Business & Strategy Advisor',
    initials: 'SC',
    image: null,
    copy: 'Sachin supports Kramaniti on business direction, strategic judgment, and advisory perspective as the practice grows. His role strengthens the commercial thinking behind how opportunities are assessed, structured, and developed.'
  }
];

const principles = [
  {
    title: 'One Foundation',
    copy: 'Strategy, systems, and communication should support one another. The way the business works should guide what it builds and how it communicates.'
  },
  {
    title: 'Practical Leverage',
    copy: 'Systems should reduce friction, support better decisions, and preserve human judgment. Complexity is not a sign of sophistication.'
  },
  {
    title: 'Human-Collaborative Systems',
    copy: 'AI should assist. Humans should lead. Some steps can be automated, some should be AI-assisted, and some must stay with the people closest to the context.'
  },
  {
    title: 'Clear Communication',
    copy: 'Content should not exist for volume alone. It should make the business easier to understand and reflect the value being created.'
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
      'brand presence',
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
              <span className={styles.eyebrow}>Founder Profile</span>
              <h1>Helping businesses improve how they work and how they are understood.</h1>
              <p className={styles.lead}>
                Karan Chordia founded Kramaniti to connect practical systems with clear communication. The work begins by understanding how a business operates, then building what it needs and helping it explain its value.
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
                    <span className={styles.metaValue}>Founder / Systems Partner</span>
                  </div>
                </div>

              </div>

              <div className={styles.contentColumn}>
                <article className={styles.storyCard}>
                  <span className="micro-label">Background</span>
                  <h2>From brand storytelling to business systems.</h2>
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
                      Today, Karan helps businesses clarify their workflows, build practical systems, and communicate with greater confidence.
                    </p>
                  </div>
                </article>

                <div className={styles.statRow}>
                  <div className={styles.statCard}>
                    <span className={styles.statValue}>8+ Years</span>
                    <span className={styles.statLabel}>Commercial media and brand storytelling</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statValue}>3+ Years</span>
                    <span className={styles.statLabel}>Workflow systems, AI tools, and operating design</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statValue}>1 Practice</span>
                    <span className={styles.statLabel}>Built around operations, intelligence, and presence</span>
                  </div>
                </div>

                <article className={styles.summaryCard}>
                  <span className="micro-label">Current Focus</span>
                  <h3>Making the business and its message work together.</h3>
                  <p className="text-secondary caption" style={{ marginBottom: '1rem' }}>
                    Kramaniti helps businesses close the gap between how they work and how they communicate.
                  </p>
                  <p className="text-secondary caption">
                    We begin with the current workflow, identify what matters most, build practical support, and turn that clarity into a stronger message.
                  </p>
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
              <span className="micro-label">The Approach</span>
              <h2>Strategy, systems, and communication.</h2>
              <p className={styles.sectionLead}>
                Kramaniti understands the work first, builds the right support, and then helps the business communicate its value clearly.
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
              <span className="micro-label">Working Style</span>
              <h2>The principles behind the work.</h2>
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

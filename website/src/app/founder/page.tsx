import type { Metadata } from 'next';
import Image from 'next/image';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '../../lib/seo';
import styles from './Founder.module.css';

export const metadata: Metadata = {
  title: 'Founder | Kramaniti',
  description:
    'Meet Karan Chordia, founder of Kramaniti, and the operating principles behind strategy-first AI systems, workflow clarity, and coherent brand presence.',
  alternates: {
    canonical: absoluteUrl('/founder/'),
  },
  openGraph: {
    type: 'profile',
    url: absoluteUrl('/founder/'),
    siteName: SITE_NAME,
    title: 'Founder | Kramaniti',
    description:
      'Karan Chordia founded Kramaniti to connect operational clarity, practical intelligence systems, and brand presence.',
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
    title: 'Operations',
    copy: 'Understanding the brand, team rhythm, workflows, bottlenecks, decisions, and handoffs before recommending any tool or system.',
    tags: ['Workflow clarity', 'Business logic', 'Priority map']
  },
  {
    title: 'Intelligence',
    copy: 'Designing practical AI-assisted workflows, internal tools, documentation, and decision-support systems that make the business easier to run.',
    tags: ['Practical systems', 'Internal tools', 'Decision support']
  },
  {
    title: 'Presence',
    copy: 'Turning operational clarity into sharper communication, useful content, and a brand narrative that reflects how the business actually creates value.',
    tags: ['Founder narrative', 'Content direction', 'Brand coherence']
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
    copy: 'Operations, intelligence, and presence should not be built separately. The way the business works should inform the systems it uses and the way it communicates.'
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
    title: 'Coherent Presence',
    copy: 'Content should not exist for volume alone. It should make the brand easier to understand, easier to trust, and more accurately connected to the value being created inside the business.'
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
      'Karan Chordia leads Kramaniti across strategy, operating diagnosis, intelligence-system design, and brand-presence direction.',
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
              <h1>Building alignment between how brands work and how they are seen.</h1>
              <p className={styles.lead}>
                Karan Chordia founded Kramaniti to help brands connect their internal operating reality with their external presence by turning workflows, systems, and communication into one coherent growth foundation.
              </p>
              <div className={styles.heroPills}>
                <span className={styles.heroPill}>Operations</span>
                <span className={styles.heroPill}>Intelligence</span>
                <span className={styles.heroPill}>Presence</span>
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
                  <h2>Seeing both sides of brand growth.</h2>
                  <div className={styles.bio}>
                    <p>
                      Karan is a Bengaluru-based strategist and systems partner who began his work in commercial media, helping brands shape how they were seen.
                    </p>
                    <p>
                      That experience revealed a deeper problem: strong content cannot compensate for unclear operations. When the internal workflow is scattered, the external message eventually becomes scattered too.
                    </p>
                    <p>
                      Kramaniti was built from that realization.
                    </p>
                    <p>
                      Today, Karan helps founder-led brands clarify how they operate, design practical intelligence systems around that reality, and translate the resulting clarity into a more coherent brand presence.
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
                  <h3>Making the inside and outside of the brand match.</h3>
                  <p className="text-secondary caption" style={{ marginBottom: '1rem' }}>
                    Kramaniti helps brands close the gap between internal reality and external perception.
                  </p>
                  <p className="text-secondary caption">
                    The work begins with how the business actually operates: its workflows, decisions, handoffs, bottlenecks, tools, and team rhythm. From there, Kramaniti builds practical intelligence systems and translates that clarity into a more coherent brand presence.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.sectionBlock}>
          <div className={styles.atmosphere} aria-hidden="true">
            <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Operations</span>
            <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Presence</span>
          </div>

          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className="micro-label">The Approach</span>
              <h2>Three layers, one foundation.</h2>
              <p className={styles.sectionLead}>
                Kramaniti’s work is built around alignment: understanding how the business operates, designing intelligence systems around that reality, and shaping a brand presence that reflects the value being created inside.
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
              <h2>A focused structure for serious work.</h2>
              <p className={styles.sectionLead}>
                Kramaniti is founder-led by design. Strategy, system architecture, and client execution stay close to the founder so the work remains coherent from diagnosis to delivery.
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
                Every Kramaniti engagement is designed to create alignment, not noise. The goal is to make the business clearer internally and more coherent externally.
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

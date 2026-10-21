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
    'Meet Karan Chordia, founder of Kramaniti, and the thinking behind strategy, systems and story.',
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
    title: 'Story',
    copy: 'Turn clearer work into useful content and a story that reflects the value being created.',
    tags: ['Founder story', 'Useful content', 'Clear message']
  }
];

const advisoryTeam = [
  {
    name: 'Karan Chordia',
    role: 'Founder & Systems Architect',
    initials: 'KC',
    image: '/assets/founder_real.jpg',
    copy: 'Karan architects Kramaniti’s strategy, workflow diagnostics, AI product ecosystem (Spasht, Kosh, Clarity Engine), and cinematic brand story—combining computational systems logic with narrative clarity.'
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

const marketTimingWaves = [
  {
    phase: 'Wave 01 · 2023–2025',
    title: 'Blind Automation & Tool Sprawl',
    copy: 'Most early AI adoption added disconnected chat wrappers, unreviewed automations, and generic content on top of broken workflows—scaling noise instead of clarity.',
    tags: ['Tool-first', 'Unreviewed outputs', 'Fragmented context']
  },
  {
    phase: 'Wave 02 · 2026 & Beyond',
    title: 'Accountable Human-Led Systems',
    copy: 'Enduring operational value comes from mapping how work actually moves, separating what is automated, AI-assisted, and human-led, and codifying context into durable workflows.',
    tags: ['Workflow-first', 'Explicit human gates', 'Compounding context']
  },
  {
    phase: 'The Kramaniti Wedge',
    title: 'Services-to-Software Flywheel',
    copy: 'High-conviction workflow audits and custom builds uncover real operational bottlenecks across teams—which are then standardized into Kosh templates and Spasht workspace loops.',
    tags: ['Bespoke systems', 'Kosh library', 'Spasht workspace']
  }
];

const internalLeverage = [
  {
    code: '01 / GOVERNED ROSTER',
    title: '17-Role Internal Agent Operating System',
    copy: 'Kramaniti runs on role-based AI contributors across strategy, workflow diagnostics, systems specs, editorial distribution, and proof governance—with human approval required before any public or client-facing commitment.'
  },
  {
    code: '02 / DELIVERY INFRASTRUCTURE',
    title: 'Client Hub & HQ Command Centre',
    copy: 'Multi-tenant delivery workrooms (/client-hub) and founder portfolio tracking (/hq) keep project state, task decomposition, approval queues, and repository movement structured without administrative bloat.'
  },
  {
    code: '03 / MODULAR EXECUTION',
    title: 'Kramaniti Blocks & Content Studio',
    copy: 'Reusable workflow blocks with explicit input/output contracts and an internal infographic video engine (/KCS) allow complex systems and cinema-grade communication to ship in weeks, not quarters.'
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
    title: 'Story follows clarity',
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
      'Karan Chordia leads Kramaniti across strategy, systems and story.',
    knowsAbout: [
      'workflow strategy',
      'AI systems',
      'brand story',
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
                <span className={styles.heroPill}>Story</span>
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
                  <span className="micro-label">Founder-Market Fit</span>
                  <h2>Bridging computational rigor, operational clarity, and cinematic narrative.</h2>
                  <div className={styles.bio}>
                    <p>
                      Karan began in commercial media across co-working, hospitality, education, startup, and B2B technology ecosystems—including selected work with WeWork India, Hyatt Centric, and Nexocean.
                    </p>
                    <p>
                      Between 2020 and 2023, he dedicated a focused R&amp;D and incubation phase to algorithmic systems, quantitative risk logic, and structured decision frameworks.
                    </p>
                    <p>
                      That dual foundation exposed a structural gap in modern enterprises: technical AI consultants build pipelines that lack narrative coherence, while creative agencies produce content disconnected from how the business actually operates.
                    </p>
                    <p>
                      Kramaniti was architected to close that gap—combining first-principles workflow engineering, proprietary AI products (<strong>Spasht</strong>, <strong>Kosh</strong>, <strong>Clarity Engine</strong>), and high-resonance brand communication into one connected growth system.
                    </p>
                  </div>
                </article>

                <div className={styles.statRow}>
                  <div className={styles.statCard}>
                    <span className={styles.statValue}>Narrative</span>
                    <span className={styles.statLabel}>Commercial media across co-working, hospitality &amp; B2B ecosystems</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statValue}>Systems R&amp;D</span>
                    <span className={styles.statLabel}>Algorithmic logic, workflow diagnostics &amp; human-AI boundaries</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statValue}>Products + Builds</span>
                    <span className={styles.statLabel}>Spasht, Kosh &amp; bespoke internal AI operating systems</span>
                  </div>
                </div>

                <article className={styles.summaryCard}>
                  <span className="micro-label">The Hybrid Advantage</span>
                  <h3>High-conviction services that compound into scalable software.</h3>
                  <p className="text-secondary caption" style={{ marginBottom: '1rem' }}>
                    Kramaniti operates at the intersection of forward-deployed systems engineering and productized AI infrastructure.
                  </p>
                  <p className="text-secondary caption">
                    Every client engagement sharpens our understanding of where real work gets stuck—directly informing our public products, <strong>Kramaniti Spasht</strong> and <strong>Kramaniti Kosh</strong>.
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
            <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Story</span>
          </div>

          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className="micro-label">How the work moves</span>
              <h2>Strategy, systems and story.</h2>
              <p className={styles.sectionLead}>
                Understand the work first. Build the right support. Then tell the story clearly.
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

        <section className={styles.sectionBlock} id="why-now">
          <div className={styles.atmosphere} aria-hidden="true">
            <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Timing</span>
            <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Thesis</span>
          </div>

          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className="micro-label">Why Now · Market Thesis</span>
              <h2>From blind automation hype to accountable operating infrastructure.</h2>
              <p className={styles.sectionLead}>
                The first wave of enterprise AI failed because companies automated broken workflows. The next wave belongs to systems that preserve context and keep human judgment in control.
              </p>
            </div>

            <div className={styles.timelineGrid}>
              {marketTimingWaves.map((wave) => (
                <article key={wave.title} className={styles.timelineCard}>
                  <div className={styles.timelineTop}>
                    <span className={styles.timelineIndex}>{wave.phase}</span>
                  </div>
                  <h3>{wave.title}</h3>
                  <p className="text-secondary caption">{wave.copy}</p>
                  <div className={styles.tagRow}>
                    {wave.tags.map((tag) => (
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

        <section className={styles.sectionBlock} id="operating-leverage">
          <div className={styles.atmosphere} aria-hidden="true">
            <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Founder</span>
            <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Leverage</span>
          </div>

          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className="micro-label">Operating Model · System-Multiplied</span>
              <h2>Founder-architected. System-multiplied.</h2>
              <p className={styles.sectionLead}>
                Kramaniti scales through software and governed internal systems rather than traditional agency headcount bloat. Karan owns the strategic architecture, system design, and final quality bar—multiplied by Kramaniti’s own internal operating stack and advisory leadership.
              </p>
            </div>

            <div className={styles.timelineGrid} style={{ marginBottom: '28px' }}>
              {internalLeverage.map((item) => (
                <article key={item.title} className={styles.timelineCard}>
                  <div className={styles.timelineTop}>
                    <span className={styles.timelineIndex}>{item.code}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p className="text-secondary caption">{item.copy}</p>
                </article>
              ))}
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

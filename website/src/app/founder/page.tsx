import Image from 'next/image';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import styles from './Founder.module.css';

const timeline = [
  {
    year: 'Phase One',
    title: 'Business Clarity',
    copy: 'Understanding the brand, operations, and team rhythm before deciding what should be built.',
    tags: ['Workflow audit', 'AI readiness', 'Priority map']
  },
  {
    year: 'Phase Two',
    title: 'Practical Infrastructure',
    copy: 'Designing custom workflows and internal tools that support daily operations without adding unnecessary complexity.',
    tags: ['Custom workflows', 'Internal tools', 'System logic']
  },
  {
    year: 'Phase Three',
    title: 'Cinematic Content',
    copy: 'Turning the clarity from those systems into premium communication that feels useful, human, and aligned.',
    tags: ['Design thinking', 'High-end production', 'Authenticity']
  }
];

const advisoryTeam = [
  {
    name: 'Karan Chordia',
    role: 'Founder',
    copy: 'Karan leads Kramaniti’s strategy, AI workflow design, digital systems thinking, and client execution. He focuses on identifying meaningful operational workflows for brands and building practical AI-enabled systems around them.'
  },
  {
    name: 'Kashiesh Chordia',
    role: 'Legal & Compliance Advisor',
    copy: 'Supports Kramaniti on agreements, documentation, compliance structure, governance practices, company-secretarial matters, filings, and regulatory paperwork. Her role helps ensure that client engagements and internal operations are supported with proper legal and compliance discipline.'
  }
];

const principles = [
  {
    title: 'A Single Pipeline',
    copy: 'Unifying strategy, operational infrastructure, and final creative output so the brand presence stays coherent.'
  },
  {
    title: 'Practical Leverage',
    copy: 'Building the systems that remove friction while preserving human judgment, taste, and authentic voice.'
  },
  {
    title: 'Cinematic Standard',
    copy: 'Refusing to settle for generic output. Every asset is held to a high standard of design thinking.'
  }
];

export default function FounderPage() {
  return (
    <>
      <Navbar />
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
              <h1>Building One Connected Growth System.</h1>
              <p className={styles.lead}>
                Karan Chordia builds from the intersection of deep strategy, algorithmic systems, and cinematic storytelling.
              </p>
              <div className={styles.heroPills}>
                <span className={styles.heroPill}>Strategy</span>
                <span className={styles.heroPill}>Infrastructure</span>
                <span className={styles.heroPill}>Cinematic Content</span>
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
                  <h2>Bridging strategy, code, and cinema.</h2>
                  <div className={styles.bio}>
                    <p>
                      Karan is a Bengaluru-based strategist and systems partner who believes that true scale requires treating operations and creative as a single pipeline.
                    </p>
                    <p>
                      He started in commercial videography, documenting the rise of the Indian co-working ecosystem. But he realized that beautiful content without operational leverage couldn&apos;t scale.
                    </p>
                    <p>
                      After a multi-year incubation period focused on workflow design and systems thinking, he now builds connected pipelines that help brands improve operations while maintaining a premium, cinematic voice.
                    </p>
                  </div>
                </article>

                <div className={styles.statRow}>
                  <div className={styles.statCard}>
                    <span className={styles.statValue}>4+</span>
                    <span className={styles.statLabel}>Years B2B media</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statValue}>3+</span>
                    <span className={styles.statLabel}>Years R&D</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statValue}>1</span>
                    <span className={styles.statLabel}>System-led practice</span>
                  </div>
                </div>

                <article className={styles.summaryCard}>
                  <span className="micro-label">Current Focus</span>
                  <h3>Building pipelines that are practical, clear, and deeply authentic.</h3>
                  <p className="text-secondary caption">
                    When strategy, operational infrastructure, and final content are driven by the same vision, a brand&apos;s digital presence remains coherent and useful.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.sectionBlock}>
          <div className={styles.atmosphere} aria-hidden="true">
            <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Capture</span>
            <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Build</span>
          </div>

          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className="micro-label">The Pipeline</span>
              <h2>Three phases, one unified approach.</h2>
              <p className={styles.sectionLead}>
                The philosophy remains consistent: lay a clear strategic foundation, build practical systems, and craft cinematic output.
              </p>
            </div>

            <div className={styles.timelineGrid}>
              {timeline.map((item, index) => (
                <article key={item.year} className={styles.timelineCard}>
                  <div className={styles.timelineTop}>
                    <span className={styles.timelineIndex}>{`0${index + 1}`}</span>
                    <span className="micro-label">{item.year}</span>
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
            <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Advisory</span>
            <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Structure</span>
          </div>

          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className="micro-label">Founder & Advisory</span>
              <h2>A small, serious structure around the founder.</h2>
              <p className={styles.sectionLead}>
                Founder-led execution with targeted advisory support for legal and compliance discipline.
              </p>
            </div>

            <div className={styles.proofGrid}>
              {advisoryTeam.map((member) => (
                <article key={member.name} className={styles.proofCard}>
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
            <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Flow</span>
            <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Logic</span>
          </div>

          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className="micro-label">Working Style</span>
              <h2>The philosophy behind the architecture.</h2>
              <p className={styles.sectionLead}>
                These core principles ensure that every system built creates practical leverage without compromising on premium quality.
              </p>
            </div>

            <div className={styles.principleGrid}>
              {principles.map((principle) => (
                <article key={principle.title} className={styles.principleCard}>
                  <div className={styles.cardAccent}></div>
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

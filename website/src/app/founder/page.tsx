import Image from 'next/image';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import styles from './Founder.module.css';

const timeline = [
  {
    year: 'Phase One',
    title: 'Deep Strategy',
    copy: 'Laying the true foundation for AI implementation by diving deep into the core vision and operations.',
    tags: ['Brand Audit', 'AI Readiness', 'Vision Mapping']
  },
  {
    year: 'Phase Two',
    title: 'Agentic Infrastructure',
    copy: 'Engineering custom workflows, agentic tools, and automated systems to seamlessly enhance daily operations.',
    tags: ['Custom Workflows', 'Agentic Tools', 'System logic']
  },
  {
    year: 'Phase Three',
    title: 'Cinematic Content',
    copy: 'Applying rigorous design thinking to the system\'s raw output to craft premium content that never feels like AI slop.',
    tags: ['Design Thinking', 'High-End Production', 'Authenticity']
  }
];

const proofPoints = [
  {
    title: 'WeWork India',
    label: 'Commercial video vendor',
    copy: 'Directed inaugurals and spatial coverage for Galaxy, Vaishnavi Signature, ITI Limited, and RMZ Latitude locations across Bengaluru.'
  },
  {
    title: 'Hyatt Centric',
    label: 'Hospitality content',
    copy: 'Produced cinematic brand footage and drone assets shaped for premium hospitality distribution.'
  },
  {
    title: 'Nexocean',
    label: 'Internal automation',
    copy: 'Built internal workflow tools and produced content assets over a five-month contract engagement.'
  }
];

const principles = [
  {
    title: 'A Single Pipeline',
    copy: 'Unifying strategy, operational tech, and final creative output under one roof to ensure a totally coherent digital presence.'
  },
  {
    title: 'Agentic Leverage',
    copy: 'Deploying custom AI systems to handle operational scale without ever losing the human touch or authentic voice.'
  },
  {
    title: 'Cinematic Standard',
    copy: 'Refusing to settle for generic automated output. Every asset is held to the highest standard of rigorous design thinking.'
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
              <h1>The Architect of the Pipeline.</h1>
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
                      src="/kramaniti/assets/founder_real.jpg"
                      alt="Karan Chordia"
                      fill
                      priority
                      sizes="(min-width: 1024px) 420px, 100vw"
                      className={styles.portrait}
                    />
                  </div>
                  <div className={styles.imageMeta}>
                    <span className={styles.metaLabel}>Karan Chordia</span>
                    <span className={styles.metaValue}>AI Architect / Founder</span>
                  </div>
                </div>

                <div className={styles.galleryRow}>
                  <div className={styles.galleryCard}>
                    <div className={styles.galleryFrame}>
                      <Image
                        src="/kramaniti/assets/founder_cinematic_1.png"
                        alt="Karan in a cinematic environment"
                        fill
                        sizes="(min-width: 1024px) 220px, 45vw"
                        className={styles.galleryImage}
                      />
                    </div>
                    <span className={styles.galleryTag}>Strategy</span>
                  </div>

                  <div className={styles.galleryCard}>
                    <div className={styles.galleryFrame}>
                      <Image
                        src="/kramaniti/assets/founder_cinematic_2.png"
                        alt="Karan at work"
                        fill
                        sizes="(min-width: 1024px) 220px, 45vw"
                        className={styles.galleryImage}
                      />
                    </div>
                    <span className={styles.galleryTag}>Systems</span>
                  </div>
                </div>
              </div>

              <div className={styles.contentColumn}>
                <article className={styles.storyCard}>
                  <span className="micro-label">Background</span>
                  <h2>Bridging strategy, code, and cinema.</h2>
                  <div className={styles.bio}>
                    <p>
                      Karan is a Bengaluru-based AI Architect and strategist who believes that true scale requires treating operations and creative as a single pipeline.
                    </p>
                    <p>
                      He started in commercial videography, documenting the rise of the Indian co-working ecosystem. But he realized that beautiful content without operational leverage couldn't scale.
                    </p>
                    <p>
                      After a multi-year incubation period focused on workflow design and agentic systems, he now architects unified pipelines that allow brands to automate their operations while maintaining a premium, cinematic voice.
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
                  <h3>Engineering pipelines that are highly automated, yet deeply authentic.</h3>
                  <p className="text-secondary caption">
                    When strategy, operational tech, and final content are driven by the exact same vision, a brand&apos;s digital presence remains completely coherent and undeniably impactful.
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
                The philosophy remains consistent: lay a deep strategic foundation, engineer the agentic systems, and craft cinematic output.
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
            <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Proof</span>
            <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Trust</span>
          </div>

          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className="micro-label">Selected Proof</span>
              <h2>Client signals across the pipeline.</h2>
              <p className={styles.sectionLead}>
                A track record of executing both high-end commercial media and complex internal automation.
              </p>
            </div>

            <div className={styles.proofGrid}>
              {proofPoints.map((proof) => (
                <article key={proof.title} className={styles.proofCard}>
                  <span className="micro-label">{proof.label}</span>
                  <h3>{proof.title}</h3>
                  <p className="text-secondary caption">{proof.copy}</p>
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
                These core principles ensure that every system built delivers maximum operational leverage without compromising on premium quality.
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

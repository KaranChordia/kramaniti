import Image from 'next/image';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import styles from './Founder.module.css';

const timeline = [
  {
    year: '2017 - 2019',
    title: 'Spatial capture',
    copy: 'Built commercial media for WeWork India and Hyatt Centric while the Indian co-working market was expanding quickly.',
    tags: ['Commercial media', 'Drone mapping', 'Visual systems']
  },
  {
    year: '2020 - 2023',
    title: 'Systems R&D',
    copy: 'Used the gap as an incubation period to study logic, automation, and the structure behind repeatable digital work.',
    tags: ['Process study', 'Automation', 'System logic']
  },
  {
    year: '2023 - Present',
    title: 'Autonomous architecture',
    copy: 'Now building AI workflows, custom agents, and content engines for founders and teams that need sharper delivery.',
    tags: ['AI workflows', 'Custom agents', 'Delivery systems']
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
    title: 'Quantitative creative',
    copy: 'Use systems thinking to make creative output more repeatable, measurable, and commercially useful.'
  },
  {
    title: 'Spatial transition',
    copy: 'Move from physical-space capture to digital-space architecture without losing narrative quality.'
  },
  {
    title: 'Editorial precision',
    copy: 'Keep the work premium, direct, and evidence-led instead of generic or overdesigned.'
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
              <h1>The Logic of Sequence</h1>
              <p className={styles.lead}>
                Karan Chordia builds from the intersection of cinematic capture, algorithmic systems, and AI delivery.
              </p>
              <div className={styles.heroPills}>
                <span className={styles.heroPill}>Commercial media</span>
                <span className={styles.heroPill}>Systems R&D</span>
                <span className={styles.heroPill}>AI architecture</span>
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
                    <span className={styles.galleryTag}>Capture</span>
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
                    <span className={styles.galleryTag}>Build</span>
                  </div>
                </div>
              </div>

              <div className={styles.contentColumn}>
                <article className={styles.storyCard}>
                  <span className="micro-label">Background</span>
                  <h2>From spatial capture to computational systems.</h2>
                  <div className={styles.bio}>
                    <p>
                      Karan is a Bengaluru-based AI Architect, storyteller, and systems consultant with a track record at the edge of media and automation.
                    </p>
                    <p>
                      He started in commercial videography and digital marketing, documenting the rise of the Indian co-working ecosystem for brands like WeWork India and Hyatt Centric.
                    </p>
                    <p>
                      He then moved into a multi-year incubation period focused on logic, workflow design, and automated systems. That progression now shapes the AI infrastructure he builds for clients.
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
                  <h3>Build systems that are useful, repeatable, and visually coherent.</h3>
                  <p className="text-secondary caption">
                    The founder page follows the same design language as the homepage: dark editorial surfaces, gold accent lines, centered lead copy, and small atmospheric motion.
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
              <span className="micro-label">Trajectory</span>
              <h2>Three phases, one through-line.</h2>
              <p className={styles.sectionLead}>
                The founder narrative stays consistent: capture real-world systems, study how they work, then build the automation layer on top.
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
              <h2>Client signals that support the repositioning.</h2>
              <p className={styles.sectionLead}>
                The page keeps evidence tight and readable, using smaller cards rather than oversized imagery.
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
              <h2>The founder lens behind the brand.</h2>
              <p className={styles.sectionLead}>
                These principles help keep the founder page aligned with the same visual identity, tone, and pacing as the main website.
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

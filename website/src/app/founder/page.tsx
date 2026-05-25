import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import styles from './Founder.module.css';

export default function FounderPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className={styles.container}>
            <div className={styles.grid}>
              <div className={styles.imageColumn}>
                <div className={styles.imageWrapper}>
                  <img src="/kramaniti/assets/founder_real.jpg" alt="Karan Chordia - AI Architect" className={styles.portrait} />
                  <div className={styles.glassLabel}>Karan Chordia — AI Architect</div>
                </div>

                <div className={styles.gallery}>
                  <div className={styles.galleryImageWrapper}>
                    <img src="/kramaniti/assets/founder_cinematic_1.png" alt="Karan in server room" className={styles.galleryImage} />
                  </div>
                  <div className={styles.galleryImageWrapper}>
                    <img src="/kramaniti/assets/founder_cinematic_2.png" alt="Karan at desk" className={styles.galleryImage} />
                  </div>
                </div>
              </div>
              
              <div className={styles.contentColumn}>
                <h1 className={styles.title}>The Logic of Sequence</h1>
                <h2 className={styles.subtitle}>From cinematic capture to computational systems.</h2>
                
                <div className={styles.bio}>
                  <p>Karan Chordia is a Bengaluru-based AI Architect, storyteller, and systems consultant with a decade-long track record of operating at the frontier of emerging technologies.</p>
                  
                  <p>His career began in the commercial videography and digital marketing sectors, where he established himself as a premier media vendor. Under his creative brand, he captured the aggressive expansion of the Indian co-working ecosystem, directing inaugurals for WeWork India and developing visual campaigns for tier-one hospitality names like Hyatt Centric.</p>
                  
                  <p>As technologies shifted, Karan embarked on a multi-year deep dive into complex algorithmic environments. He spent years mastering backend systems, data architecture, and autonomous logic, developing the technical systems-thinking that would define his next chapter.</p>
                  
                  <p>With the rise of generative artificial intelligence, Karan transitioned this computational rigor into tool-building. As AI Architect at Aimpact Space, he designed custom GPT architectures and became an active contributor to OpenAI developer discussions on knowledge retrieval and automation workflows. Following a successful engagement building internal automation tools and brand assets for Nexocean, Karan launched a productized consultancy via kramaniti.</p>
                  
                  <p>Today, he partners with scaling founders, B2B SaaS firms, and real estate developers to audit their operations, build bespoke AI agents, and implement automated content engines that drive inbound growth and efficiency.</p>
                </div>
                
                <div className={styles.anglesGrid}>
                  <div className={styles.angleCard}>
                    <span className={styles.angleIcon}>⚖️</span>
                    <h4>The Quantitative Creative</h4>
                    <p className="text-secondary caption">Bridging systems architecture and narrative empathy to build workflows that are both robust and compelling.</p>
                  </div>
                  
                  <div className={styles.angleCard}>
                    <span className={styles.angleIcon}>🏢</span>
                    <h4>The Spatial Transition</h4>
                    <p className="text-secondary caption">From drone mapping WeWork offices to automating real estate marketing and operations.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

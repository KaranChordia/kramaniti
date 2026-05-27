import Link from 'next/link';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { insights } from '../../data/insights';
import styles from './Insights.module.css';

export default function InsightsPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className={styles.atmosphere} aria-hidden="true">
            <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Logic</span>
            <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Scale</span>
          </div>

          <div className={styles.container}>
            <div className={styles.heroIntro}>
              <span className={styles.eyebrow}>Insights</span>
              <h1>The Logic Behind the Pipeline.</h1>
              <p className={styles.lead}>
                Deep dives into strategy, agentic infrastructure, and the cinematic standard. Exploring why unified operations create true scale.
              </p>
            </div>

            <div className={styles.insightsGrid}>
              {insights.map((insight) => (
                <Link href={`/insights/${insight.slug}`} key={insight.slug} className={styles.insightCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.focus}>{insight.focus}</span>
                    <span className={styles.date}>{insight.date}</span>
                  </div>
                  <h2>{insight.title}</h2>
                  <p className={styles.summary}>{insight.summary}</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.readTime}>{insight.readTime}</span>
                    <span className={styles.readMore}>
                      Read Essay
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

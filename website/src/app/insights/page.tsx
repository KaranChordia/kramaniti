import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { insights } from '../../data/insights';
import { InsightsArchive } from './InsightsArchive';
import styles from './Insights.module.css';

export default function InsightsPage() {
  const archiveInsights = insights.map((insight) => ({
    slug: insight.slug,
    title: insight.title,
    category: insight.category,
    focus: insight.focus,
    date: insight.date,
    author: insight.author,
    publishedAt: insight.publishedAt,
    readTime: insight.readTime,
    summary: insight.summary,
  }));

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
                Deep dives into strategy, systems, adoption, governance, and content after clarity. Search the archive by business problem, operating layer, or topic.
              </p>
            </div>

            <InsightsArchive insights={archiveInsights} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

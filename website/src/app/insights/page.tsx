import type { Metadata } from 'next';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { insights } from '../../data/insights';
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '../../lib/seo';
import { InsightsArchive } from './InsightsArchive';
import styles from './Insights.module.css';

export const metadata: Metadata = {
  title: 'Insights | Kramaniti',
  description: 'Kramaniti insights on strategy, systems, adoption, governance, AI infrastructure, and content after clarity.',
  alternates: {
    canonical: absoluteUrl('/insights/'),
  },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/insights/'),
    siteName: SITE_NAME,
    title: 'Insights | Kramaniti',
    description: 'Strategy-first essays on practical AI systems, operating infrastructure, governance, and content after clarity.',
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
    title: 'Insights | Kramaniti',
    description: 'Strategy-first essays on practical AI systems, operating infrastructure, governance, and content after clarity.',
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
};

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

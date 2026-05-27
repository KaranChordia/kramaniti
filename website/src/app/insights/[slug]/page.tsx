import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { insights } from '../../../data/insights';
import { TechStackInfographic } from '../../../components/ui/Infographics';
import styles from './Article.module.css';

export function generateStaticParams() {
  return insights.map((post) => ({
    slug: post.slug,
  }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = insights.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <article className={styles.articleSection}>
          <div className={styles.container}>
            <Link href="/insights" className={styles.backLink}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to Insights
            </Link>

            <header className={styles.articleHeader}>
              <div className={styles.meta}>
                <span className={styles.focus}>{post.focus}</span>
                <span className={styles.metaInfo}>{post.date} &middot; {post.readTime}</span>
              </div>
              <h1 className={styles.title}>{post.title}</h1>
              <p className={styles.summary}>{post.summary}</p>
            </header>

            <div className={styles.articleContent}>
              {post.content.map((paragraph, index) => {
                if (paragraph === '[infographic:tech-stack]') {
                  return <TechStackInfographic key={index} />;
                }
                
                // Parse gold highlights
                const processedHtml = paragraph.replace(/<gold>(.*?)<\/gold>/g, `<span class="${styles.goldText}">$1</span>`);
                
                return (
                  <p 
                    key={index} 
                    className={styles.paragraph} 
                    dangerouslySetInnerHTML={{ __html: processedHtml }} 
                  />
                );
              })}
            </div>

            <div className={styles.ctaBox}>
              <h3>Ready to engineer your pipeline?</h3>
              <p>Align your strategy, operational tech, and content under one roof.</p>
              <Link href="/#contact" className={styles.ctaLink}>
                Reach Out
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

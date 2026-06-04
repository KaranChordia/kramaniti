import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { insights } from '../../../data/insights';
import { 
  TechStackInfographic, 
  DisconnectedOpsInfographic, 
  AgenticWorkflowsInfographic, 
  CinematicStandardInfographic,
  SpatialAcquisitionInfographic,
  WorkflowRedesignGapInfographic,
  AgentOversightGapInfographic,
  ReinventionPressureInfographic,
  OperatingReadinessStackInfographic,
  ReadinessBalanceInfographic,
  OperatingSpineInfographic,
  GovernanceSidecarGapInfographic,
  WorkflowGovernanceLoopInfographic
} from '../../../components/ui/Infographics';
import styles from './Article.module.css';

function formatPublishedMeta(date: string, publishedAt?: string) {
  if (!publishedAt) {
    return date;
  }

  const value = new Date(publishedAt);
  const displayDate = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(value);
  const displayTime = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(value);

  return `${displayDate} · ${displayTime} IST`;
}

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
                <span className={styles.metaInfo}>{formatPublishedMeta(post.date, post.publishedAt)} &middot; {post.readTime}</span>
              </div>
              {post.author ? <p className={styles.author}>By {post.author}</p> : null}
              <h1 className={styles.title}>{post.title}</h1>
              <p className={styles.summary}>{post.summary}</p>
            </header>

            <div className={styles.articleContent}>
              {post.content.map((paragraph, index) => {
                if (paragraph === '[infographic:tech-stack]') {
                  return <TechStackInfographic key={index} />;
                }
                if (paragraph === '[infographic:disconnected-ops]') {
                  return <DisconnectedOpsInfographic key={index} />;
                }
                if (paragraph === '[infographic:agentic-workflows]') {
                  return <AgenticWorkflowsInfographic key={index} />;
                }
                if (paragraph === '[infographic:cinematic-standard]') {
                  return <CinematicStandardInfographic key={index} />;
                }
                if (paragraph === '[infographic:spatial-acquisition]') {
                  return <SpatialAcquisitionInfographic key={index} />;
                }
                if (paragraph === '[infographic:workflow-redesign-gap]') {
                  return <WorkflowRedesignGapInfographic key={index} />;
                }
                if (paragraph === '[infographic:agent-oversight-gap]') {
                  return <AgentOversightGapInfographic key={index} />;
                }
                if (paragraph === '[infographic:reinvention-pressure-trap]') {
                  return <ReinventionPressureInfographic key={index} />;
                }
                if (paragraph === '[infographic:operating-readiness-stack]') {
                  return <OperatingReadinessStackInfographic key={index} />;
                }
                if (paragraph === '[infographic:readiness-balance]') {
                  return <ReadinessBalanceInfographic key={index} />;
                }
                if (paragraph === '[infographic:operating-spine]') {
                  return <OperatingSpineInfographic key={index} />;
                }
                if (paragraph === '[infographic:governance-sidecar-gap]') {
                  return <GovernanceSidecarGapInfographic key={index} />;
                }
                if (paragraph === '[infographic:workflow-governance-loop]') {
                  return <WorkflowGovernanceLoopInfographic key={index} />;
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

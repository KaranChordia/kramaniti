import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { insights } from '../../../data/insights';
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  absoluteUrl,
  getInsightKeywords,
  getInsightPublishedDate,
  getInsightUrl,
  getRelatedInsights,
  stripInlineMarkup,
} from '../../../lib/seo';
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
  WorkflowGovernanceLoopInfographic,
  ReviewCapacityGapInfographic,
  ReviewOperatingLoopInfographic,
  PromptSprawlVsOrchestrationInfographic,
  OrchestrationControlPlaneInfographic,
  TokenomicsTradeoffInfographic,
  CostControlLoopInfographic,
  AgentObservabilityGapInfographic,
  TraceToTrustLoopInfographic,
  ContextSprawlVsEngineeringInfographic,
  ContextQualityLoopInfographic,
  WorkAsDoneAuditInfographic,
  AuditToAdoptionMapInfographic,
  PresenceReadinessGateInfographic,
  IntelligenceToPresenceBriefInfographic,
  AdoptionPacketChecklistInfographic,
  AssistLeadOverrideMapInfographic,
  FrontstageBackstageBridgeInfographic,
  AlignmentReviewRhythmInfographic,
  DecisionRouteMapInfographic,
  DecisionRecordCardInfographic,
  OperatingSignalLedgerInfographic,
  PresenceBriefCanvasInfographic,
  ShadowAiRouteInfographic,
  WorkflowAdoptionRhythmInfographic,
  EscalationClarityMapInfographic,
  ServiceRecoveryLoopInfographic,
  FounderMemoryInfrastructureInfographic,
  MemoryWritebackLoopInfographic,
  SystemAcceptanceTestInfographic,
  BuildReadinessGateInfographic
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

type ArticlePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return insights.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = insights.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Insight Not Found | Kramaniti',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const url = getInsightUrl(post);
  const title = `${post.title} | Kramaniti Insights`;
  const description = stripInlineMarkup(post.summary);
  const publishedTime = getInsightPublishedDate(post);
  const authors = post.author ? [post.author] : ['Kramaniti'];

  return {
    title,
    description,
    keywords: getInsightKeywords(post),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      url,
      siteName: SITE_NAME,
      title,
      description,
      publishedTime,
      authors,
      section: post.category,
      tags: [post.category, post.focus],
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
      title,
      description,
      images: [absoluteUrl(DEFAULT_OG_IMAGE)],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = insights.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedInsights = getRelatedInsights(post, insights);
  const articleUrl = getInsightUrl(post);
  const publishedDate = getInsightPublishedDate(post);
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: stripInlineMarkup(post.summary),
    author: {
      '@type': 'Person',
      name: post.author ?? 'Kramaniti',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: absoluteUrl('/'),
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(DEFAULT_OG_IMAGE),
      },
    },
    datePublished: publishedDate,
    dateModified: publishedDate,
    mainEntityOfPage: articleUrl,
    url: articleUrl,
    articleSection: post.category,
    keywords: getInsightKeywords(post).join(', '),
    citation: post.sourceLinks?.map((source) => source.url),
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: absoluteUrl('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Insights',
        item: absoluteUrl('/insights/'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <article className={styles.articleSection}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c'),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c'),
            }}
          />
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
                if (paragraph === '[infographic:review-capacity-gap]') {
                  return <ReviewCapacityGapInfographic key={index} />;
                }
                if (paragraph === '[infographic:review-operating-loop]') {
                  return <ReviewOperatingLoopInfographic key={index} />;
                }
                if (paragraph === '[infographic:prompt-sprawl-vs-orchestration]') {
                  return <PromptSprawlVsOrchestrationInfographic key={index} />;
                }
                if (paragraph === '[infographic:orchestration-control-plane]') {
                  return <OrchestrationControlPlaneInfographic key={index} />;
                }
                if (paragraph === '[infographic:tokenomics-tradeoff]') {
                  return <TokenomicsTradeoffInfographic key={index} />;
                }
                if (paragraph === '[infographic:cost-control-loop]') {
                  return <CostControlLoopInfographic key={index} />;
                }
                if (paragraph === '[infographic:agent-observability-gap]') {
                  return <AgentObservabilityGapInfographic key={index} />;
                }
                if (paragraph === '[infographic:trace-to-trust-loop]') {
                  return <TraceToTrustLoopInfographic key={index} />;
                }
                if (paragraph === '[infographic:context-sprawl-vs-engineering]') {
                  return <ContextSprawlVsEngineeringInfographic key={index} />;
                }
                if (paragraph === '[infographic:context-quality-loop]') {
                  return <ContextQualityLoopInfographic key={index} />;
                }
                if (paragraph === '[infographic:work-as-done-audit]') {
                  return <WorkAsDoneAuditInfographic key={index} />;
                }
                if (paragraph === '[infographic:audit-to-adoption-map]') {
                  return <AuditToAdoptionMapInfographic key={index} />;
                }
                if (paragraph === '[infographic:presence-readiness-gate]') {
                  return <PresenceReadinessGateInfographic key={index} />;
                }
                if (paragraph === '[infographic:intelligence-to-presence-brief]') {
                  return <IntelligenceToPresenceBriefInfographic key={index} />;
                }
                if (paragraph === '[infographic:adoption-packet-checklist]') {
                  return <AdoptionPacketChecklistInfographic key={index} />;
                }
                if (paragraph === '[infographic:assist-lead-override-map]') {
                  return <AssistLeadOverrideMapInfographic key={index} />;
                }
                if (paragraph === '[infographic:frontstage-backstage-bridge]') {
                  return <FrontstageBackstageBridgeInfographic key={index} />;
                }
                if (paragraph === '[infographic:alignment-review-rhythm]') {
                  return <AlignmentReviewRhythmInfographic key={index} />;
                }
                if (paragraph === '[infographic:decision-route-map]') {
                  return <DecisionRouteMapInfographic key={index} />;
                }
        if (paragraph === '[infographic:decision-record-card]') {
          return <DecisionRecordCardInfographic key={index} />;
        }
        if (paragraph === '[infographic:operating-signal-ledger]') {
          return <OperatingSignalLedgerInfographic key={index} />;
        }
        if (paragraph === '[infographic:presence-brief-canvas]') {
          return <PresenceBriefCanvasInfographic key={index} />;
        }
        if (paragraph === '[infographic:shadow-ai-route]') {
          return <ShadowAiRouteInfographic key={index} />;
        }
        if (paragraph === '[infographic:workflow-adoption-rhythm]') {
          return <WorkflowAdoptionRhythmInfographic key={index} />;
        }
        if (paragraph === '[infographic:escalation-clarity-map]') {
          return <EscalationClarityMapInfographic key={index} />;
        }
        if (paragraph === '[infographic:service-recovery-loop]') {
          return <ServiceRecoveryLoopInfographic key={index} />;
        }
        if (paragraph === '[infographic:founder-memory-infrastructure]') {
          return <FounderMemoryInfrastructureInfographic key={index} />;
        }
        if (paragraph === '[infographic:memory-writeback-loop]') {
          return <MemoryWritebackLoopInfographic key={index} />;
        }
        if (paragraph === '[infographic:system-acceptance-test]') {
          return <SystemAcceptanceTestInfographic key={index} />;
        }
        if (paragraph === '[infographic:build-readiness-gate]') {
          return <BuildReadinessGateInfographic key={index} />;
        }

        const headingMatch = paragraph.match(/^<h3>(.*?)<\/h3>$/);
                if (headingMatch) {
                  return (
                    <h3
                      key={index}
                      className={styles.articleSubheading}
                      dangerouslySetInnerHTML={{ __html: headingMatch[1] }}
                    />
                  );
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

            {post.sourceLinks?.length ? (
              <aside className={styles.sourceBox} aria-labelledby="source-links-heading">
                <h3 id="source-links-heading">Source links</h3>
                <ul>
                  {post.sourceLinks.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} target="_blank" rel="noreferrer">
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </aside>
            ) : null}

            <aside className={styles.relatedBox} aria-labelledby="related-insights-heading">
              <h3 id="related-insights-heading">Related insights</h3>
              <div className={styles.relatedGrid}>
                {relatedInsights.map((insight) => (
                  <Link href={`/insights/${insight.slug}`} key={insight.slug} className={styles.relatedCard}>
                    <span>{insight.category}</span>
                    <strong>{insight.title}</strong>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

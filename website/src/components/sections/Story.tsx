'use client';
import React from 'react';
import styles from './Story.module.css';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

const epochs = [
  {
    number: '01',
    years: 'Strategy',
    title: 'Understand the business first',
    flow: 'Foundation',
    description: 'We map the brand, team, workflows, bottlenecks, and growth goals before recommending any tool.',
    tags: ['Business clarity', 'Workflow audit', 'Priority map']
  },
  {
    number: '02',
    years: 'Systems',
    title: 'Build only what matters',
    flow: 'Infrastructure',
    description: 'We design practical AI workflows and internal tools around the processes with the clearest business value.',
    tags: ['Internal tools', 'Process support', 'Team handoff']
  },
  {
    number: '03',
    years: 'Content',
    title: 'Cinematic Content',
    flow: 'Communication',
    description: 'We turn the clarity and system output into useful brand communication that sounds human and aligned.',
    tags: ['Founder narrative', 'Content systems', 'Clear distribution']
  }
];

function StageIcon({ kind }: { kind: 'camera' | 'gear' | 'spark' }) {
  if (kind === 'camera') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="7" width="18" height="12" rx="2" />
        <path d="M8 7l1.5-3h5L16 7" />
        <circle cx="12" cy="13" r="3.5" />
      </svg>
    );
  }

  if (kind === 'gear') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2.5v3M12 18.5v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2.5 12h3M18.5 12h3M4.9 19.1l2.1-2.1M17 7l2.1-2.1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l2.9 5.9L21 10l-4.5 4.4L17.6 21 12 18l-5.6 3 1.1-6.6L3 10l6.1-1.1L12 3z" />
    </svg>
  );
}

export function Story() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1, freezeOnceVisible: true });

  return (
    <section className={styles.story} id="method" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Sequence</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Clarity</span>
      </div>
      <div className={styles.container}>
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <span className="micro-label">The method</span>
          <h2>Kramaniti connects the thinking, tools, and communication work into one operating pipeline.</h2>
          <div className={styles.legend}>
            <span className={styles.legendPill}>Strategy</span>
            <span className={styles.legendArrow}>→</span>
            <span className={styles.legendPill}>Systems</span>
            <span className={styles.legendArrow}>→</span>
            <span className={styles.legendPill}>Content</span>
          </div>
        </div>

        <div className={styles.processDiagram}>
          <div className={`${styles.rail} ${isVisible ? styles.railVisible : ''}`}></div>

          <div className={styles.stageGrid}>
            {epochs.map((epoch, index) => (
              <article
                key={epoch.number}
                className={`${styles.stage} ${isVisible ? styles.visible : ''}`}
                style={{ transitionDelay: `${index * 180}ms` }}
              >
                <div className={styles.stageHeader}>
                  <div className={styles.stageMarker}>
                    <span className={styles.stageNumber}>{epoch.number}</span>
                  </div>
                  <span className="micro-label">{epoch.years}</span>
                </div>

                <div className={styles.flowChip}>{epoch.flow}</div>

                <div className={styles.iconBadge}>
                  <StageIcon kind={index === 0 ? 'camera' : index === 1 ? 'gear' : 'spark'} />
                </div>

                <h4>{epoch.title}</h4>
                <p className="text-secondary caption">{epoch.description}</p>

                <div className={styles.tagRow}>
                  {epoch.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className={styles.metricRail}>
                  <span className={styles.metricBar}></span>
                  <span className={styles.metricBarShort}></span>
                  <span className={styles.metricBar}></span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

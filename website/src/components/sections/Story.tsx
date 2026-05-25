'use client';
import React from 'react';
import styles from './Story.module.css';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

const epochs = [
  {
    number: '01',
    years: '2017 – 2019',
    title: 'Spatial Capture',
    flow: 'Capture',
    description: 'Built commercial media for WeWork India and Hyatt Centric while growing a public audience around Bengaluru\'s co-working boom.',
    tags: ['Commercial media', 'Drone mapping', 'Audience growth']
  },
  {
    number: '02',
    years: '2020 – 2023',
    title: 'Systems R&D',
    flow: 'Study',
    description: 'Spent this period studying systems, logic, and automation instead of public content creation.',
    tags: ['Process study', 'Systems logic', 'Automation']
  },
  {
    number: '03',
    years: '2023 – Present',
    title: 'Autonomous Architecture',
    flow: 'Build',
    description: 'Now building AI workflows, custom agents, and content engines for scaling startups and enterprise teams.',
    tags: ['AI workflows', 'Custom agents', 'Content engines']
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
    <section className={styles.story} id="story" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Capture</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Build</span>
      </div>
      <div className={styles.container}>
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <h2>The System Behind the Story</h2>
          <p className="text-secondary">Three phases. One through-line: narrative plus systems.</p>
          <div className={styles.legend}>
            <span className={styles.legendPill}>Capture</span>
            <span className={styles.legendArrow}>→</span>
            <span className={styles.legendPill}>Study</span>
            <span className={styles.legendArrow}>→</span>
            <span className={styles.legendPill}>Build</span>
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

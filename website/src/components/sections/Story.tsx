'use client';
import React from 'react';
import styles from './Story.module.css';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';

const epochs = [
  {
    number: '01',
    years: 'Strategy',
    title: 'Understand the business first',
    description: 'We map the brand, team, workflows, bottlenecks, and growth goals before recommending any tool.',
    tags: ['Business clarity', 'Workflow audit', 'Priority map']
  },
  {
    number: '02',
    years: 'Systems',
    title: 'Build only what matters',
    description: 'We design practical AI workflows and internal tools around the processes with the clearest business value.',
    tags: ['Internal tools', 'Process support', 'Team handoff']
  },
  {
    number: '03',
    years: 'Content',
    title: 'Cinematic Content',
    description: 'We turn the clarity and system output into useful brand communication that sounds human and aligned.',
    tags: ['Founder narrative', 'Content systems', 'Clear distribution']
  }
];

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
          <AnimatedHeading isVisible={isVisible}>Kramaniti connects the thinking, tools, and communication work into one operating pipeline.</AnimatedHeading>
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

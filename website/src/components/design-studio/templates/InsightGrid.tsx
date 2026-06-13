'use client';

import type { SceneTemplateProps, InsightGridData } from '../../../lib/design-studio/types';
import styles from './InsightGrid.module.css';

export function InsightGrid({ data, animation, isPlaying }: SceneTemplateProps<'insight-grid'>) {
  const { atmosphereLeft = 'Logic', atmosphereRight = 'Scale', title, subtitle, insights } = data as InsightGridData;

  const durationStr = `${animation?.duration ?? 800}ms`;
  const staggerBase = animation?.stagger ?? 300;

  return (
    <div
      className={`${styles.container} ${isPlaying ? styles.isPlaying : ''}`}
      style={
        {
          '--anim-duration': durationStr,
          '--anim-stagger-base': `${staggerBase}ms`,
        } as React.CSSProperties
      }
    >
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>{atmosphereLeft}</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>{atmosphereRight}</span>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        <div className={styles.insightsGrid}>
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`${styles.insightCard} ${isPlaying ? styles.cardVisible : ''}`}
              style={{ '--card-delay': index } as React.CSSProperties}
            >
              <div className={styles.cardHeader}>
                <span className={styles.focus}>{insight.focus}</span>
                <span className={styles.date}>{insight.date}</span>
              </div>
              <h3 className={styles.cardTitle}>{insight.title}</h3>
              <p className={styles.summary}>{insight.summary}</p>
              <div className={styles.cardFooter}>
                <span className={styles.readTime}>
                  {insight.author ? `${insight.author} · ${insight.readTime}` : insight.readTime}
                </span>
                <span className={styles.readMore}>
                  Read Essay
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

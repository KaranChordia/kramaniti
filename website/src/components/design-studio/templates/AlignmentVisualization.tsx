'use client';

import type { SceneTemplateProps, AlignmentVisualizationData } from '../../../lib/design-studio/types';
import styles from './AlignmentVisualization.module.css';

export function AlignmentVisualization({ data, animation, isPlaying }: SceneTemplateProps<'alignment-visualization'>) {
  const { operations, intelligence, presence } = data as AlignmentVisualizationData;

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
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Alignment</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Engine</span>
      </div>

      <div className={styles.content}>
        <div className={`${styles.alignmentStage} ${isPlaying ? styles.stageVisible : ''}`}>
          
          {/* Layer 1: Operations */}
          <div className={`${styles.node} ${styles.nodeOperations}`}>
            <div className={styles.nodeIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className={styles.nodeText}>
              <span className={styles.nodeLabel}>Layer 01</span>
              <h3 className={styles.nodeTitle}>{operations.title}</h3>
              <p className={styles.nodeDesc}>{operations.description}</p>
            </div>
            {/* Outbound connection */}
            <div className={`${styles.connection} ${styles.connToIntel}`}>
              <div className={styles.beam} />
            </div>
          </div>

          {/* Layer 2: Intelligence */}
          <div className={`${styles.node} ${styles.nodeIntelligence}`}>
            <div className={styles.nodeIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <div className={styles.coreGlow} />
            </div>
            <div className={styles.nodeText}>
              <span className={styles.nodeLabel}>Layer 02</span>
              <h3 className={styles.nodeTitle}>{intelligence.title}</h3>
              <p className={styles.nodeDesc}>{intelligence.description}</p>
            </div>
            {/* Outbound connection */}
            <div className={`${styles.connection} ${styles.connToPresence}`}>
              <div className={styles.beam} />
            </div>
          </div>

          {/* Layer 3: Presence */}
          <div className={`${styles.node} ${styles.nodePresence}`}>
            <div className={styles.nodeIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            </div>
            <div className={styles.nodeText}>
              <span className={styles.nodeLabel}>Layer 03</span>
              <h3 className={styles.nodeTitle}>{presence.title}</h3>
              <p className={styles.nodeDesc}>{presence.description}</p>
            </div>
            
            {/* Projection Effect */}
            <div className={styles.projectionRings}>
              <div className={styles.ring} />
              <div className={styles.ring} />
              <div className={styles.ring} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

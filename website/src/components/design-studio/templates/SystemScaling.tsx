'use client';

import type { SceneTemplateProps, SystemScalingData } from '../../../lib/design-studio/types';
import styles from './SystemScaling.module.css';

export function SystemScaling({ data, animation, isPlaying }: SceneTemplateProps<'system-scaling'>) {
  const { headline, subtitle, nodes } = data as SystemScalingData;

  const durationStr = `${animation?.duration ?? 800}ms`;
  const staggerBase = animation?.stagger ?? 200;

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
      <div className={styles.expandingRing} style={{ animationDelay: `0ms` }} />
      <div className={styles.expandingRing} style={{ animationDelay: `400ms` }} />

      <div className={styles.textContainer}>
        <h2 className={styles.headline}>{headline}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <div className={styles.systemStage}>
        {nodes.map((node, i) => (
          <div key={i} className={`${styles.systemCard} ${styles[`card${i}`]}`}>
            <div className={styles.cardHeader}>
              <div className={styles.cardDot} />
              <div className={styles.cardLine} />
            </div>
            <div className={styles.cardBody}>
              <h4 className={styles.cardTitle}>{node}</h4>
              <div className={styles.skeletonBlock} />
              <div className={styles.skeletonBlock} style={{ width: '60%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

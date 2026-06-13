'use client';

import type { SceneTemplateProps, WorkflowChaosData } from '../../../lib/design-studio/types';
import styles from './WorkflowChaos.module.css';

export function WorkflowChaos({ data, animation, isPlaying }: SceneTemplateProps<'workflow-chaos'>) {
  const { headline, subtitle, nodes } = data as WorkflowChaosData;

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
      <div className={styles.textContainer}>
        <h2 className={styles.headline}>{headline}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <div className={styles.chaosStage}>
        {/* SVG background lines simulating chaotic broken paths */}
        <svg className={styles.chaosLines} viewBox="0 0 1000 600" preserveAspectRatio="none">
          <path d="M 100 500 Q 300 100 400 300 T 700 200 T 900 500" className={styles.line} />
          <path d="M 150 100 Q 200 400 500 200 T 800 400 T 950 150" className={styles.line} />
          <path d="M 50 300 Q 400 600 600 100 T 900 300" className={styles.line} />
          
          {/* Glitching nodes at intersections */}
          <circle cx="400" cy="300" r="4" className={styles.glitchDot} />
          <circle cx="500" cy="200" r="4" className={styles.glitchDot} />
          <circle cx="600" cy="100" r="4" className={styles.glitchDot} />
          <circle cx="700" cy="200" r="4" className={styles.glitchDot} />
          <circle cx="800" cy="400" r="4" className={styles.glitchDot} />
        </svg>

        {nodes.map((node, i) => (
          <div key={i} className={`${styles.toolNode} ${styles[`pos${i}`]}`}>
            <div className={styles.nodeIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <span>{node}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

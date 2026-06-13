'use client';

import type { SceneTemplateProps, LogicFrameworkData } from '../../../lib/design-studio/types';
import styles from './LogicFramework.module.css';

export function LogicFramework({ data, animation, isPlaying }: SceneTemplateProps<'logic-framework'>) {
  const { headline, subtitle, nodes } = data as LogicFrameworkData;

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
      <div className={styles.gridBackground}>
        {/* Strict golden grid lines drawing in */}
        <div className={styles.vLine} style={{ left: '25%' }} />
        <div className={styles.vLine} style={{ left: '50%' }} />
        <div className={styles.vLine} style={{ left: '75%' }} />
        <div className={styles.hLine} style={{ top: '33%' }} />
        <div className={styles.hLine} style={{ top: '66%' }} />
      </div>

      <div className={styles.textContainer}>
        <h2 className={styles.headline}>{headline}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <div className={styles.frameworkStage}>
        {/* Perfect paths connecting the nodes */}
        <svg className={styles.logicPaths} viewBox="0 0 1000 400" preserveAspectRatio="none">
          <path d="M 200 200 L 500 200 L 800 200" className={styles.pathLine} />
          <path d="M 500 200 L 500 350" className={styles.pathLine} />
          
          <circle cx="200" cy="200" r="6" className={styles.logicDot} />
          <circle cx="500" cy="200" r="6" className={styles.logicDot} />
          <circle cx="800" cy="200" r="6" className={styles.logicDot} />
          <circle cx="500" cy="350" r="6" className={styles.logicDot} />
        </svg>

        <div className={styles.nodesGrid}>
          {nodes.map((node, i) => (
            <div key={i} className={`${styles.logicNode} ${styles[`gridPos${i}`]}`}>
              <div className={styles.nodeCore} />
              <span>{node}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

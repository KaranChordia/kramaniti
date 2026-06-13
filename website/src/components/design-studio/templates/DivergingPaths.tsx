'use client';

import type { SceneTemplateProps, DivergingPathsData } from '../../../lib/design-studio/types';
import styles from './DivergingPaths.module.css';

export function DivergingPaths({ data, animation, isPlaying }: SceneTemplateProps<'diverging-paths'>) {
  const { originLabel, paths } = data as DivergingPathsData;

  const durationStr = `${animation?.duration ?? 600}ms`;
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
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Diverge</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Paths</span>
      </div>

      <div className={styles.content}>
        <div className={`${styles.divergeStage} ${isPlaying ? styles.stageVisible : ''}`}>
          <svg className={styles.divergeSvg} viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="softGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="dotGlow">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Origin label */}
            <text x="56" y="206" className={styles.originLabel} textAnchor="middle">{originLabel}</text>

            {/* Origin dot */}
            <circle cx="56" cy="220" r="24" className={styles.originRing} />
            <circle cx="56" cy="220" r="5" className={styles.originDot} filter="url(#dotGlow)" />

            {/* Stem */}
            <line x1="56" y1="220" x2="180" y2="220" className={styles.stemLine} />
            <circle cx="180" cy="220" r="3.5" className={styles.forkDot} filter="url(#dotGlow)" />

            {/* Path 1 — up (assuming at least 1 path) */}
            {paths.length > 0 && (
              <>
                <path d="M 180 220 C 260 220, 280 60, 380 60 L 540 60" className={styles.branchPath} style={{ '--branch-delay': '0' } as React.CSSProperties} filter="url(#softGlow)" />
                <circle cx="540" cy="60" r="4" className={styles.terminalDot} style={{ '--dot-delay': '0' } as React.CSSProperties} filter="url(#dotGlow)" />
                <path d="M 180 220 C 260 220, 280 60, 380 60 L 540 60" className={styles.beamPath} style={{ '--beam-delay': '0' } as React.CSSProperties} />
              </>
            )}

            {/* Path 2 — straight (if >= 2 paths) */}
            {paths.length > 1 && (
              <>
                <path d="M 180 220 L 540 220" className={styles.branchPath} style={{ '--branch-delay': '1' } as React.CSSProperties} filter="url(#softGlow)" />
                <circle cx="540" cy="220" r="4" className={styles.terminalDot} style={{ '--dot-delay': '1' } as React.CSSProperties} filter="url(#dotGlow)" />
                <path d="M 180 220 L 540 220" className={styles.beamPath} style={{ '--beam-delay': '1' } as React.CSSProperties} />
              </>
            )}

            {/* Path 3 — down (if >= 3 paths) */}
            {paths.length > 2 && (
              <>
                <path d="M 180 220 C 260 220, 280 370, 380 370 L 540 370" className={styles.branchPath} style={{ '--branch-delay': '2' } as React.CSSProperties} filter="url(#softGlow)" />
                <circle cx="540" cy="370" r="4" className={styles.terminalDot} style={{ '--dot-delay': '2' } as React.CSSProperties} filter="url(#dotGlow)" />
                <path d="M 180 220 C 260 220, 280 370, 380 370 L 540 370" className={styles.beamPath} style={{ '--beam-delay': '2' } as React.CSSProperties} />
              </>
            )}
          </svg>

          <div className={styles.textLayer}>
            {paths.map((path, index) => (
              <div
                key={index}
                className={`${styles.flowText} ${styles[`flowText${index + 1}`]} ${isPlaying ? styles.flowTextVisible : ''}`}
                style={{ '--text-delay': index } as React.CSSProperties}
              >
                <span className={styles.flowTitle}>{path.title}</span>
                <span className={styles.flowDesc}>{path.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

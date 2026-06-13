'use client';

import type { SceneTemplateProps, OrbitLayersData } from '../../../lib/design-studio/types';
import styles from './OrbitLayers.module.css';

export function OrbitLayers({ data, animation, isPlaying }: SceneTemplateProps<'orbit-layers'>) {
  const { title, layers } = data as OrbitLayersData;

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
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Orbit</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Layers</span>
      </div>

      <div className={styles.content}>
        {title && (
          <div className={styles.header}>
            <span className="micro-label">System</span>
            <h2 className={styles.title}>{title}</h2>
          </div>
        )}

        <div className={`${styles.orbitStage} ${isPlaying ? styles.stageVisible : ''}`}>
          {/* SVG Rings */}
          <div className={styles.orbitVisual}>
            <svg className={styles.orbitSvg} viewBox="0 0 500 500" aria-hidden="true">
              <defs>
                <filter id="ringGlow">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="coreGlow">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Ring 1 — Outermost */}
              <circle cx="250" cy="250" r="210" className={`${styles.ring} ${styles.ring1}`} />
              <circle cx="250" cy="250" r="210" className={`${styles.ringBeam} ${styles.ringBeam1}`} />
              <circle r="5" className={`${styles.orbitDot} ${styles.orbitDot1}`} filter="url(#ringGlow)">
                <animateMotion dur="12s" repeatCount="indefinite" begin="0s">
                  <mpath href="#orbitPath1" />
                </animateMotion>
              </circle>
              <circle cx="250" cy="250" r="210" id="orbitPath1" fill="none" stroke="none" />

              {/* Ring 2 — Middle */}
              <circle cx="250" cy="250" r="155" className={`${styles.ring} ${styles.ring2}`} />
              <circle cx="250" cy="250" r="155" className={`${styles.ringBeam} ${styles.ringBeam2}`} />
              <circle r="5" className={`${styles.orbitDot} ${styles.orbitDot2}`} filter="url(#ringGlow)">
                <animateMotion dur="9s" repeatCount="indefinite" begin="-3s">
                  <mpath href="#orbitPath2" />
                </animateMotion>
              </circle>
              <circle cx="250" cy="250" r="155" id="orbitPath2" fill="none" stroke="none" />

              {/* Ring 3 — Innermost */}
              <circle cx="250" cy="250" r="100" className={`${styles.ring} ${styles.ring3}`} />
              <circle cx="250" cy="250" r="100" className={`${styles.ringBeam} ${styles.ringBeam3}`} />
              <circle r="4" className={`${styles.orbitDot} ${styles.orbitDot3}`} filter="url(#ringGlow)">
                <animateMotion dur="7s" repeatCount="indefinite" begin="-1s">
                  <mpath href="#orbitPath3" />
                </animateMotion>
              </circle>
              <circle cx="250" cy="250" r="100" id="orbitPath3" fill="none" stroke="none" />

              {/* Center core */}
              <circle cx="250" cy="250" r="38" className={styles.corePulse} />
              <circle cx="250" cy="250" r="24" className={styles.coreOuter} filter="url(#coreGlow)" />
              <circle cx="250" cy="250" r="14" className={styles.coreInner} />
              <text x="250" y="254" className={styles.coreLabel} textAnchor="middle" dominantBaseline="middle">Core</text>
            </svg>

            {/* Ring labels directly on the visual */}
            {layers.map((layer, idx) => (
              <span key={idx} className={`${styles.ringLabel} ${styles[`ringLabel${idx + 1}`]} ${isPlaying ? styles.ringLabelVisible : ''}`}>
                {layer.title}
              </span>
            ))}
          </div>

          {/* Text descriptions */}
          <div className={styles.layerTexts}>
            {layers.map((layer, index) => (
              <div
                key={layer.number}
                className={`${styles.layerRow} ${isPlaying ? styles.layerRowVisible : ''}`}
                style={{ '--row-delay': index } as React.CSSProperties}
              >
                <span className={styles.layerNumber}>{layer.number}</span>
                <div className={styles.layerContent}>
                  <span className={styles.layerTitle}>{layer.title}</span>
                  <span className={styles.layerDesc}>{layer.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

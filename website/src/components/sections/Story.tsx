'use client';
import React from 'react';
import styles from './Story.module.css';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';

const layers = [
  {
    number: '01',
    label: 'Strategy',
    title: 'Strategy',
    description: 'Understand the business, its workflows, and the most important problem to solve.',
  },
  {
    number: '02',
    label: 'Systems',
    title: 'Systems',
    description: 'Build practical tools and processes that make the work easier to run.',
  },
  {
    number: '03',
    label: 'Communication',
    title: 'Communication',
    description: 'Turn that clarity into stronger content and a clearer brand message.',
  }
];

export function Story() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section className={styles.story} id="method" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Method</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Layers</span>
      </div>
      <div className={styles.container}>
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <span className="micro-label">The method</span>
          <AnimatedHeading isVisible={isVisible}>Understand the work. Build the right system. Communicate it clearly.</AnimatedHeading>
          <p className="text-secondary">
            Kramaniti connects three parts of the business so improvements are useful, practical, and easier to maintain.
          </p>
        </div>

        {/* Layered Orbit Visualization */}
        <div className={`${styles.orbitStage} ${isVisible ? styles.stageVisible : ''}`}>
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

              {/* Ring 1 — Operations (outermost) */}
              <circle cx="250" cy="250" r="210" className={`${styles.ring} ${styles.ring1}`} />
              <circle cx="250" cy="250" r="210" className={`${styles.ringBeam} ${styles.ringBeam1}`} />
              {/* Orbiting dot */}
              <circle r="5" className={`${styles.orbitDot} ${styles.orbitDot1}`} filter="url(#ringGlow)">
                <animateMotion dur="12s" repeatCount="indefinite" begin="0s">
                  <mpath href="#orbitPath1" />
                </animateMotion>
              </circle>
              <circle cx="250" cy="250" r="210" id="orbitPath1" fill="none" stroke="none" />

              {/* Ring 2 — Intelligence (middle) */}
              <circle cx="250" cy="250" r="155" className={`${styles.ring} ${styles.ring2}`} />
              <circle cx="250" cy="250" r="155" className={`${styles.ringBeam} ${styles.ringBeam2}`} />
              <circle r="5" className={`${styles.orbitDot} ${styles.orbitDot2}`} filter="url(#ringGlow)">
                <animateMotion dur="9s" repeatCount="indefinite" begin="-3s">
                  <mpath href="#orbitPath2" />
                </animateMotion>
              </circle>
              <circle cx="250" cy="250" r="155" id="orbitPath2" fill="none" stroke="none" />

              {/* Ring 3 — Presence (innermost) */}
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
              <text x="250" y="254" className={styles.coreLabel} textAnchor="middle" dominantBaseline="middle">Foundation</text>
            </svg>

            {/* Ring labels directly on the visual */}
            <span className={`${styles.ringLabel} ${styles.ringLabel1} ${isVisible ? styles.ringLabelVisible : ''}`}>Strategy</span>
            <span className={`${styles.ringLabel} ${styles.ringLabel2} ${isVisible ? styles.ringLabelVisible : ''}`}>Systems</span>
            <span className={`${styles.ringLabel} ${styles.ringLabel3} ${isVisible ? styles.ringLabelVisible : ''}`}>Communication</span>
          </div>

          {/* Text descriptions — no cards, just flowing text */}
          <div className={styles.layerTexts}>
            {layers.map((layer, index) => (
              <div
                key={layer.number}
                className={`${styles.layerRow} ${isVisible ? styles.layerRowVisible : ''}`}
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
    </section>
  );
}

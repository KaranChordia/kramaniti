'use client';
import React from 'react';
import styles from './Story.module.css';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';

const layers = [
  {
    number: '01',
    label: 'Operations',
    title: 'Operations',
    description: 'Understand how the business actually works: workflows, handoffs, bottlenecks, decisions, people, and priorities.',
  },
  {
    number: '02',
    label: 'Intelligence',
    title: 'Intelligence',
    description: 'Design practical systems, AI support, internal tools, documentation, and decision loops around the work that matters.',
  },
  {
    number: '03',
    label: 'Presence',
    title: 'Presence',
    description: 'Translate the brand\u2019s internal clarity into content, narrative, and communication that accurately reflects its value.',
  }
];

export function Story() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1, freezeOnceVisible: true });

  return (
    <section className={styles.story} id="method" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Method</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Layers</span>
      </div>
      <div className={styles.container}>
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <span className="micro-label">The method</span>
          <AnimatedHeading isVisible={isVisible}>One foundation. Three connected layers.</AnimatedHeading>
          <p className="text-secondary">
            Kramaniti aligns the operating layer, intelligence layer, and presence layer of a brand so every system, tool, and piece of communication is tied back to how the business actually creates value.
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
            <span className={`${styles.ringLabel} ${styles.ringLabel1} ${isVisible ? styles.ringLabelVisible : ''}`}>Operations</span>
            <span className={`${styles.ringLabel} ${styles.ringLabel2} ${isVisible ? styles.ringLabelVisible : ''}`}>Intelligence</span>
            <span className={`${styles.ringLabel} ${styles.ringLabel3} ${isVisible ? styles.ringLabelVisible : ''}`}>Presence</span>
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

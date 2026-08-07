'use client';
import React from 'react';
import styles from './Story.module.css';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';
import { KramanitiOrb } from '../ui/KramanitiOrb';

const layers = [
  {
    number: '01',
    label: 'Strategy',
    title: 'Strategy',
    description: 'Audit your business workflows to identify high-leverage opportunities and the most critical bottlenecks to solve.',
    orbState: 'shaping' as const,
  },
  {
    number: '02',
    label: 'Systems',
    title: 'Systems',
    description: 'Engineer practical internal infrastructure and AI-assisted processes that streamline daily operations.',
    orbState: 'working' as const,
  },
  {
    number: '03',
    label: 'Communication',
    title: 'Communication',
    description: 'Translate operational clarity into premium brand narratives and a consistent content distribution engine.',
    orbState: 'composing' as const,
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
          <AnimatedHeading isVisible={isVisible}>Strategy before tools. Systems before scale. Content after clarity.</AnimatedHeading>
          <p className="text-secondary">
            Kramaniti connects the three foundational layers of your business, ensuring that operational improvements are practical, scalable, and easy to maintain.
          </p>
        </div>

        {/* Layered Orbit Visualization */}
        <div className={`${styles.orbitStage} ${isVisible ? styles.stageVisible : ''}`}>
          {/* SVG Rings */}
          <div className={styles.orbitVisual}>
            <svg className={styles.orbitSvg} viewBox="0 0 500 500" aria-hidden="true">
              {/* Ring 1 — Operations (outermost) */}
              <circle cx="250" cy="250" r="210" className={`${styles.ring} ${styles.ring1}`} />
              <circle cx="250" cy="250" r="210" className={`${styles.ringBeam} ${styles.ringBeam1}`} />
              {/* Orbiting dot */}
              <circle r="5" className={`${styles.orbitDot} ${styles.orbitDot1}`}>
                <animateMotion dur="12s" repeatCount="indefinite" begin="0s">
                  <mpath href="#orbitPath1" />
                </animateMotion>
              </circle>
              <circle cx="250" cy="250" r="210" id="orbitPath1" fill="none" stroke="none" />

              {/* Ring 2 — Intelligence (middle) */}
              <circle cx="250" cy="250" r="155" className={`${styles.ring} ${styles.ring2}`} />
              <circle cx="250" cy="250" r="155" className={`${styles.ringBeam} ${styles.ringBeam2}`} />
              <circle r="5" className={`${styles.orbitDot} ${styles.orbitDot2}`}>
                <animateMotion dur="9s" repeatCount="indefinite" begin="-3s">
                  <mpath href="#orbitPath2" />
                </animateMotion>
              </circle>
              <circle cx="250" cy="250" r="155" id="orbitPath2" fill="none" stroke="none" />

              {/* Ring 3 — Presence (innermost) */}
              <circle cx="250" cy="250" r="100" className={`${styles.ring} ${styles.ring3}`} />
              <circle cx="250" cy="250" r="100" className={`${styles.ringBeam} ${styles.ringBeam3}`} />
              <circle r="4" className={`${styles.orbitDot} ${styles.orbitDot3}`}>
                <animateMotion dur="7s" repeatCount="indefinite" begin="-1s">
                  <mpath href="#orbitPath3" />
                </animateMotion>
              </circle>
              <circle cx="250" cy="250" r="100" id="orbitPath3" fill="none" stroke="none" />

              {/* Center core */}
              <circle cx="250" cy="250" r="38" className={styles.corePulse} />
              <circle cx="250" cy="250" r="24" className={styles.coreOuter} />
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
                <KramanitiOrb
                  state={layer.orbState}
                  size={20}
                  paused={!isVisible}
                  className={styles.layerOrb}
                />
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

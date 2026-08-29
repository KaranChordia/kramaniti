'use client';
import React from 'react';
import styles from './Story.module.css';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';
import { KramanitiOrb } from '../ui/KramanitiOrb';

const layers = [
  {
    number: '01',
    label: 'Work clarity',
    title: 'See the work clearly',
    description: 'Follow how work really moves, where it slows down, and which problem is worth solving first.',
    orbState: 'shaping' as const,
  },
  {
    number: '02',
    label: 'Useful systems',
    title: 'Build what helps',
    description: 'Simplify the bottleneck, connect the right tools, and automate the repeatable parts with care.',
    orbState: 'working' as const,
  },
  {
    number: '03',
    label: 'Coherent brand',
    title: 'Make the value coherent',
    description: 'Let the clearer business show up through a message people can understand, trust, and act on.',
    orbState: 'composing' as const,
  }
];

export function Story() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section className={styles.story} id="method" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Inside</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Out</span>
      </div>
      <div className={styles.container}>
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <span className="micro-label">The method</span>
          <AnimatedHeading isVisible={isVisible}>First understand the work. Then build what helps. Then communicate it clearly.</AnimatedHeading>
          <p className="text-secondary">
            One connected route: clarity in the work, useful systems around it, and a brand that reflects it.
          </p>
        </div>

        {/* Layered Orbit Visualization */}
        <div className={`${styles.orbitStage} ${isVisible ? styles.stageVisible : ''}`}>
          <div className={styles.orbitVisual}>
            <svg className={styles.orbitSvg} viewBox="0 0 500 500" aria-hidden="true">
              <path d="M-20 92H112V154H198" className={styles.routeGuide} />
              <path d="M-20 230H92V292H214" className={styles.routeGuide} />
              <path d="M302 44V116H430V184H520" className={styles.routeGuide} />
              <path d="M18 424H138V360H236" className={styles.routeGuide} />
              <path d="M286 312H400V390H520" className={styles.routeGuide} />
              <path pathLength="1" d="M26 414H118V332H250V250H382V168H474" className={styles.signalRoute} />
              <rect x="113" y="327" width="10" height="10" className={`${styles.routeNode} ${styles.routeNodeOne}`} />
              <rect x="245" y="245" width="10" height="10" className={`${styles.routeNode} ${styles.routeNodeTwo}`} />
              <rect x="377" y="163" width="10" height="10" className={`${styles.routeNode} ${styles.routeNodeThree}`} />
              <rect x="456" y="150" width="36" height="36" className={styles.routeOutcomeHalo} />
              <rect x="466" y="160" width="16" height="16" className={styles.routeOutcome} />
            </svg>
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

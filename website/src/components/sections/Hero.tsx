'use client';

import type { CSSProperties } from 'react';
import styles from './Hero.module.css';

type HeroProps = { isActive?: boolean };

const headlineLines = [
  [
    { text: 'Turn', index: 0 },
    { text: 'scattered', index: 1 },
    { text: 'operations', index: 2 },
  ],
  [
    { text: 'into', index: 3 },
    { text: 'a', index: 4 },
    { text: 'connected', index: 5, accent: true },
    { text: 'system', index: 6, accent: true },
  ],
  [
    { text: 'for', index: 7 },
    { text: 'growth.', index: 8 },
  ],
] as const;

export function Hero({ isActive = true }: HeroProps) {
  return (
    <section
      className={`${styles.heroSection} ${isActive ? styles.isActive : ''}`}
      id="hero"
      aria-labelledby="hero-heading"
    >
      <div className={styles.lineField} aria-hidden="true">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <path d="M-20 214 H252 V126 H410" />
          <path d="M1032 124 H1194 V294 H1460" />
          <path d="M-20 700 H304 V790 H462" />
          <path d="M1038 726 H1248 V920" />
          <path d="M520 -20 V106 H666" />
          <path d="M842 900 V798 H972" />
          <path className={`${styles.signalRoute} ${styles.signalRouteOne}`} pathLength="1" d="M-20 214 H252 V126 H410" />
          <path className={`${styles.signalRoute} ${styles.signalRouteTwo}`} pathLength="1" d="M1032 124 H1194 V294 H1460" />
          <path className={`${styles.signalRoute} ${styles.signalRouteThree}`} pathLength="1" d="M-20 700 H304 V790 H462" />
          <path className={`${styles.signalRoute} ${styles.signalRouteFour}`} pathLength="1" d="M1038 726 H1248 V920" />
          <path className={`${styles.signalRoute} ${styles.signalRouteFive}`} pathLength="1" d="M520 -20 V106 H666" />
          <path className={`${styles.signalRoute} ${styles.signalRouteSix}`} pathLength="1" d="M842 900 V798 H972" />
          <rect className={`${styles.connector} ${styles.connectorOne}`} x="248.5" y="210.5" width="7" height="7" />
          <rect className={`${styles.connector} ${styles.connectorTwo}`} x="1190.5" y="290.5" width="7" height="7" />
          <rect className={`${styles.connector} ${styles.connectorThree}`} x="300.5" y="696.5" width="7" height="7" />
          <rect className={`${styles.connector} ${styles.connectorFour}`} x="1244.5" y="722.5" width="7" height="7" />
          <rect className={`${styles.connector} ${styles.connectorFive}`} x="516.5" y="102.5" width="7" height="7" />
          <rect className={`${styles.connector} ${styles.connectorSix}`} x="838.5" y="794.5" width="7" height="7" />
        </svg>
      </div>

      <div className={styles.container}>
        <div className={styles.copy}>
          <h1 className={styles.headline} id="hero-heading">
            {headlineLines.map((line, lineIndex) => (
              <span className={styles.headlineLine} key={`headline-line-${lineIndex}`}>
                {line.map((word, wordIndex) => (
                  <span
                    className={`${styles.headlineWord} ${'accent' in word ? styles.headlineAccent : ''}`}
                    key={`${word.text}-${word.index}`}
                    style={{ '--word-index': word.index } as CSSProperties}
                  >
                    {word.text}
                    {wordIndex < line.length - 1 ? '\u00a0' : ''}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p className={styles.subheading}>
            We audit your workflows, build practical AI-assisted infrastructure, and translate
            operational clarity into premium brand communication.
          </p>

          <div className={styles.actions} aria-label="Hero actions">
            <a href="#contact" className={styles.primaryAction}>
              <span>Book a Workflow Audit</span>
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 6l4 4-4 4" /></svg>
            </a>
            <a href="#method" className={styles.secondaryAction}>
              See the method <span aria-hidden="true">↘</span>
            </a>
          </div>

          <p className={styles.credibility}>
            Experience across co-working, hospitality, education, startup, and B2B technology ecosystems.
          </p>
        </div>
      </div>

      <a href="#problem" className={styles.scrollCue} aria-label="Continue to the problem">
        <span>Continue</span>
        <span className={styles.scrollTrack} aria-hidden="true"><span /></span>
      </a>
    </section>
  );
}

'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from './Hero.module.css';

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [isIntroVisible, setIsIntroVisible] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsIntroVisible(true), 80);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const updateScroll = () => {
      const rect = hero.getBoundingClientRect();
      const scrollProgress = Math.min(Math.max((-rect.top) / 260, 0), 1);

      hero.style.setProperty('--hero-scroll', `${scrollProgress.toFixed(3)}`);
    };

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);

    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, []);

  return (
    <section ref={heroRef} className={styles.hero} id="hero">
      <div className={styles.background} aria-hidden="true">
        <div className={styles.grid}></div>
        <div className={`${styles.glow} ${styles.glowLeft}`}></div>
        <div className={`${styles.glow} ${styles.glowRight}`}></div>
        <div className={styles.scanline}></div>
        <div className={styles.motifs}>
          <span className={`${styles.motifRing} ${styles.motifRingOne}`}></span>
          <span className={`${styles.motifRing} ${styles.motifRingTwo}`}></span>
          <span className={`${styles.motifLine} ${styles.motifLineOne}`}></span>
          <span className={`${styles.motifLine} ${styles.motifLineTwo}`}></span>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.split}>
          <div className={`${styles.content} ${isIntroVisible ? styles.visible : ''}`}>
            <span className={styles.heroBrandText} data-text="Kramaniti">Kramaniti</span>
            <div className={styles.networkStage} aria-hidden="true">
              <span className={`${styles.networkWord} ${styles.networkWordSystems}`} data-text="Systems">Systems</span>
              <span className={`${styles.networkWord} ${styles.networkWordStrategy}`} data-text="Strategy">Strategy</span>
              <span className={`${styles.networkWord} ${styles.networkWordContent}`} data-text="Content">Content</span>
              <svg viewBox="0 0 900 240" className={styles.connectorSvg}>
                <defs>
                  <linearGradient id="connectorFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(201,168,76,0)" />
                    <stop offset="45%" stopColor="rgba(201,168,76,0.15)" />
                    <stop offset="55%" stopColor="rgba(255,236,173,0.95)" />
                    <stop offset="65%" stopColor="rgba(201,168,76,0.2)" />
                    <stop offset="100%" stopColor="rgba(201,168,76,0)" />
                  </linearGradient>
                </defs>
                <path pathLength="1" className={`${styles.connectorPathBase} ${styles.connectorStemBase}`} d="M 450 8 L 450 88" />
                <path pathLength="1" className={`${styles.connectorPathBase} ${styles.connectorOneBase}`} d="M 450 88 C 520 82, 628 70, 770 58" />
                <path pathLength="1" className={`${styles.connectorPathBase} ${styles.connectorTwoBase}`} d="M 450 88 C 378 102, 268 116, 132 128" />
                <path pathLength="1" className={`${styles.connectorPathBase} ${styles.connectorThreeBase}`} d="M 450 88 C 528 122, 634 156, 770 188" />

                <path pathLength="1" className={`${styles.connectorPathFlow} ${styles.connectorStem}`} d="M 450 8 L 450 88" />
                <path pathLength="1" className={`${styles.connectorPathFlow} ${styles.connectorOne}`} d="M 450 88 C 520 82, 628 70, 770 58" />
                <path pathLength="1" className={`${styles.connectorPathFlow} ${styles.connectorTwo}`} d="M 450 88 C 378 102, 268 116, 132 128" />
                <path pathLength="1" className={`${styles.connectorPathFlow} ${styles.connectorThree}`} d="M 450 88 C 528 122, 634 156, 770 188" />

                <path pathLength="1" className={`${styles.connectorPathPulse} ${styles.connectorStemPulse}`} d="M 450 8 L 450 88" />
                <path pathLength="1" className={`${styles.connectorPathPulse} ${styles.connectorOnePulse}`} d="M 450 88 C 520 82, 628 70, 770 58" />
                <path pathLength="1" className={`${styles.connectorPathPulse} ${styles.connectorTwoPulse}`} d="M 450 88 C 378 102, 268 116, 132 128" />
                <path pathLength="1" className={`${styles.connectorPathPulse} ${styles.connectorThreePulse}`} d="M 450 88 C 528 122, 634 156, 770 188" />
              </svg>
            </div>
            <span className={styles.eyebrow}>Strategy / Systems / Cinematic Content</span>
            <h1 className={styles.headline}>
              <span className={styles.headlineLine}>Strategy before tools.</span>
              <span className={styles.headlineLine}>Systems before scale.</span>
              <span className={styles.headlineLine}>Content after clarity.</span>
            </h1>
            <p className={styles.subheading}>
              We turn strategic clarity into practical systems and cinematic communication that scales.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.heroFooter}>
        <div className={styles.scrollIndicator}>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
    </section>
  );
}

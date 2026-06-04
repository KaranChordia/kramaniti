'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from './Hero.module.css';

const heroHeadline = 'We build practical AI systems for growing brands.';
const heroHeadlineWords = heroHeadline.split(' ');

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
              <span className={styles.networkWord}>Strategy</span>
              <span className={styles.networkConnector}></span>
              <span className={styles.networkWord}>Systems</span>
              <span className={styles.networkConnector}></span>
              <span className={styles.networkWord}>Content</span>
            </div>
            <span className={styles.eyebrow}>AI systems partner for brand growth</span>
            <h1 className={styles.headline}>
              {heroHeadlineWords.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  className={styles.headlineWord}
                  style={{ '--word-index': index } as React.CSSProperties}
                >
                  {word}
                  {index < heroHeadlineWords.length - 1 ? '\u00a0' : ''}
                </span>
              ))}
            </h1>
            <p className={styles.subheading}>
              Kramaniti helps founders find the right workflows, build useful internal tools, and turn that clarity into stronger brand communication.
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

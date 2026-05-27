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
      const scrollProgress = Math.min(
        Math.max((-rect.top + window.innerHeight * 0.6) / (rect.height + window.innerHeight * 0.5), 0),
        1
      );

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
          <span className={`${styles.motif} ${styles.motifStrategy}`} data-text="Strategy">Strategy</span>
          <span className={`${styles.motif} ${styles.motifAutomation}`} data-text="Automation">Automation</span>
          <span className={`${styles.motif} ${styles.motifContent}`} data-text="Content">Content</span>
          <span className={`${styles.motifRing} ${styles.motifRingOne}`}></span>
          <span className={`${styles.motifRing} ${styles.motifRingTwo}`}></span>
          <span className={`${styles.motifLine} ${styles.motifLineOne}`}></span>
          <span className={`${styles.motifLine} ${styles.motifLineTwo}`}></span>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.split}>
          <div className={`${styles.content} ${isIntroVisible ? styles.visible : ''}`}>
            <span className={styles.eyebrow}>Strategy / Infrastructure / Cinematic Content</span>
            <h1 className={styles.headline}>We engineer brand growth as a single, connected pipeline.</h1>
          </div>
        </div>
      </div>

      <div className={styles.heroFooter}>
        <div className={styles.scrollIndicator}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        <div className={styles.footerNote}>Scroll to trace the system</div>
      </div>
    </section>
  );
}

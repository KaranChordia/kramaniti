'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from './Hero.module.css';

const heroHeadline = 'We turn messy workflows into practical AI systems for growing brands.';
const heroHeadlineWords = heroHeadline.split(' ');

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [isIntroVisible, setIsIntroVisible] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsIntroVisible(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const updateScroll = () => {
      const rect = hero.getBoundingClientRect();
      const maxScroll = Math.max(hero.offsetHeight - window.innerHeight, 1);
      const rawProgress = Math.min(Math.max((-rect.top) / maxScroll, 0), 1);
      // Keep scroll-driven motion continuous, but slightly slower than a 1:1 mapping.
      const scrollProgress = Math.pow(rawProgress, 1.14);

      hero.style.setProperty('--hero-scroll', `${scrollProgress.toFixed(4)}`);
      document.documentElement.style.setProperty('--global-hero-scroll', `${scrollProgress.toFixed(4)}`);
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
    <section ref={heroRef} className={styles.heroSection} id="hero">
      <div className={styles.stickyContainer}>
        
        {/* Background Effects */}
        <div className={styles.background} aria-hidden="true">
          <div className={`${styles.glow} ${styles.glowLeft}`}></div>
          <div className={`${styles.glow} ${styles.glowRight}`}></div>
          
          <div className={`${styles.layerStack} ${isIntroVisible ? styles.stackVisible : ''}`}>
            {/* Layer 1: Strategy */}
            <div className={`${styles.layer} ${styles.layerStrategy}`}>
              <div className={styles.layerGrid}></div>
            </div>
            
            {/* Layer 2: Systems */}
            <div className={`${styles.layer} ${styles.layerSystems}`}>
              <div className={styles.layerNodes}></div>
              <div className={styles.layerNodesActive}></div>
            </div>

            {/* Layer 3: Content */}
            <div className={`${styles.layer} ${styles.layerContent}`}>
              <div className={styles.layerGlow}></div>
            </div>
          </div>
        </div>

        {/* 2D Floating Text Stage (Chronological) */}
        <div className={styles.scrollTextStage} aria-hidden="true">
          <div
            className={styles.scrollTextItem}
            style={{
              '--stage': 0,
              '--phase-start': 0.22,
              '--title-exit': 0.38,
              '--desc-exit': 0.44,
              '--copy-y': '-4px',
            } as React.CSSProperties}
          >
            <div className={styles.scrollStageTitle}>Strategy</div>
            <p className={styles.scrollStageDesc}>Find the workflows worth fixing first.</p>
          </div>
          <div
            className={styles.scrollTextItem}
            style={{
              '--stage': 1,
              '--phase-start': 0.48,
              '--title-exit': 0.66,
              '--desc-exit': 0.72,
              '--copy-y': '-28px',
            } as React.CSSProperties}
          >
            <div className={styles.scrollStageTitle}>Systems</div>
            <p className={styles.scrollStageDesc}>Build internal tools that reduce operational drag.</p>
          </div>
          <div
            className={styles.scrollTextItem}
            style={{
              '--stage': 2,
              '--phase-start': 0.74,
              '--title-exit': 0.88,
              '--desc-exit': 0.91,
              '--copy-y': '-54px',
            } as React.CSSProperties}
          >
            <div className={styles.scrollStageTitle}>Content</div>
            <p className={styles.scrollStageDesc}>Turn operational clarity into stronger brand communication.</p>
          </div>
        </div>

        {/* Foreground Content (Fades out completely) */}
        <div className={styles.container}>
          <div className={styles.split}>
            <div className={`${styles.content} ${isIntroVisible ? styles.visible : ''}`}>
              <span className={styles.heroBrandText} data-text="Kramaniti">Kramaniti</span>
              <span className={styles.eyebrow}>Strategy, systems, and content for brand growth</span>
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
                Kramaniti helps founders identify what to fix, build the internal systems that reduce operational drag, and turn that clarity into stronger brand communication.
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

      </div>
    </section>
  );
}

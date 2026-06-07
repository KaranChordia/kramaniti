'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from './Hero.module.css';

const heroHeadline = 'We build the foundation and systems your brand needs to scale intelligently.';
const heroHeadlineWords = heroHeadline.split(' ');

const COMET_DELAYS = [0, 0.5, 1.0];
const MOBILE_COMET_DELAYS = [0, 0.72];
const MOBILE_PERFORMANCE_QUERY = '(max-width: 768px), (pointer: coarse)';

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [isIntroVisible, setIsIntroVisible] = useState(false);
  const [isSystemsActive, setIsSystemsActive] = useState(false);
  const [isMobilePerformanceMode, setIsMobilePerformanceMode] = useState(false);
  const isSystemsActiveRef = useRef(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsIntroVisible(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let frameId: number | null = null;
    let lastScrollProgress = '';

    const updateScroll = () => {
      frameId = null;
      const rect = hero.getBoundingClientRect();
      const maxScroll = Math.max(hero.offsetHeight - window.innerHeight, 1);
      const rawProgress = Math.min(Math.max((-rect.top) / maxScroll, 0), 1);
      // Keep scroll-driven motion continuous, but slightly slower than a 1:1 mapping.
      const scrollProgress = Math.pow(rawProgress, 1.14);
      const nextScrollProgress = scrollProgress.toFixed(4);

      if (scrollProgress >= 0.40 && !isSystemsActiveRef.current) {
        isSystemsActiveRef.current = true;
        setIsSystemsActive(true);
      } else if (scrollProgress < 0.35 && isSystemsActiveRef.current) {
        isSystemsActiveRef.current = false;
        setIsSystemsActive(false);
      }

      if (nextScrollProgress === lastScrollProgress) return;

      lastScrollProgress = nextScrollProgress;
      hero.style.setProperty('--hero-scroll', nextScrollProgress);
      document.documentElement.style.setProperty('--global-hero-scroll', nextScrollProgress);
    };

    const scheduleScrollUpdate = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateScroll);
    };

    updateScroll();
    window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
    window.addEventListener('resize', scheduleScrollUpdate);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener('scroll', scheduleScrollUpdate);
      window.removeEventListener('resize', scheduleScrollUpdate);
      document.documentElement.style.removeProperty('--global-hero-scroll');
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_PERFORMANCE_QUERY);
    const updatePerformanceMode = () => setIsMobilePerformanceMode(mediaQuery.matches);

    updatePerformanceMode();
    mediaQuery.addEventListener('change', updatePerformanceMode);

    return () => {
      mediaQuery.removeEventListener('change', updatePerformanceMode);
    };
  }, []);

  const cometDelays = isMobilePerformanceMode ? MOBILE_COMET_DELAYS : COMET_DELAYS;

  return (
    <section
      ref={heroRef}
      className={styles.heroSection}
      id="hero"
      data-mobile-performance={isMobilePerformanceMode ? 'true' : undefined}
    >
      <div className={styles.stickyContainer}>
        
        {/* Background Effects */}
        <div className={styles.background} aria-hidden="true">
          <div className={`${styles.glow} ${styles.glowLeft}`}></div>
          <div className={`${styles.glow} ${styles.glowRight}`}></div>
          
          <div className={`${styles.layerStack} ${isIntroVisible ? styles.stackVisible : ''}`}>
            {/* Golden Flow Trace for Layer 1 */}
            <svg className={styles.goldenBorderSvg} viewBox="0 0 1000 1000" preserveAspectRatio="none">
              <rect x="4" y="4" width="992" height="992" rx="64" className={styles.goldenBorderBase} />
              <rect x="4" y="4" width="992" height="992" rx="64" className={styles.goldenBorderHead} />
            </svg>

            {/* Layer 1: Strategy */}
            <div className={`${styles.layer} ${styles.layerStrategy}`}>
              <div className={styles.layerGrid}></div>
            </div>
            
            {/* Layer 2: Systems */}
            <div className={`${styles.layer} ${styles.layerSystems}`}>
              <div className={styles.layerNodes}></div>
              <svg className={`${styles.systemsNodesSvg} ${isSystemsActive ? styles.running : ''}`} preserveAspectRatio="none">
                {/* Base tracks (faint guide lines) */}
                <path d="M 32 32 L 32 208 Q 32 224 48 224 L 208 224 Q 224 224 224 240 L 224 400 Q 224 416 240 416 L 464 416 Q 480 416 480 400 L 480 288" className={styles.nodeTrack} />
                <path d="M 96 480 L 96 368 Q 96 352 112 352 L 336 352 Q 352 352 352 336 L 352 112 Q 352 96 336 96 L 160 96" className={styles.nodeTrack} />
                
                {/* Path 1 Beams (3 Comets) */}
                {cometDelays.map((cDelay, cIdx) => (
                  <path 
                    key={`p1-${cIdx}`}
                    d="M 32 32 L 32 208 Q 32 224 48 224 L 208 224 Q 224 224 224 240 L 224 400 Q 224 416 240 416 L 464 416 Q 480 416 480 400 L 480 288" 
                    className={`${styles.nodeBeam} ${styles.path1Beam}`} 
                    style={{ animationDelay: `${cDelay}s` }}
                  />
                ))}

                {/* Path 2 Beams */}
                {cometDelays.map((cDelay, cIdx) => (
                  <path 
                    key={`p2-${cIdx}`}
                    d="M 96 480 L 96 368 Q 96 352 112 352 L 336 352 Q 352 352 352 336 L 352 112 Q 352 96 336 96 L 160 96" 
                    className={`${styles.nodeBeam} ${styles.path2Beam}`} 
                    style={{ animationDelay: `${cDelay}s` }}
                  />
                ))}

                {/* Glowing Nodes Path 1 */}
                <rect x="28" y="28" width="8" height="8" className={styles.glowNode} style={{ animationDelay: '0s' }} />
                <rect x="28" y="220" width="8" height="8" className={styles.glowNode} style={{ animationDelay: '0.74s' }} />
                <rect x="220" y="220" width="8" height="8" className={styles.glowNode} style={{ animationDelay: '1.49s' }} />
                <rect x="220" y="412" width="8" height="8" className={styles.glowNode} style={{ animationDelay: '2.23s' }} />
                <rect x="476" y="412" width="8" height="8" className={styles.glowNode} style={{ animationDelay: '3.22s' }} />
                <rect x="476" y="284" width="8" height="8" className={styles.glowNode} style={{ animationDelay: '3.72s' }} />

                {/* Glowing Nodes Path 2 */}
                <rect x="92" y="476" width="8" height="8" className={styles.glowNode} style={{ animationDelay: '0s' }} />
                <rect x="92" y="348" width="8" height="8" className={styles.glowNode} style={{ animationDelay: '0.50s' }} />
                <rect x="348" y="348" width="8" height="8" className={styles.glowNode} style={{ animationDelay: '1.49s' }} />
                <rect x="348" y="92" width="8" height="8" className={styles.glowNode} style={{ animationDelay: '2.48s' }} />
                <rect x="156" y="92" width="8" height="8" className={styles.glowNode} style={{ animationDelay: '3.22s' }} />
              </svg>
            </div>

            {/* Layer 3: Content */}
            <div className={`${styles.layer} ${styles.layerContent}`}>
              <div className={styles.layerGlow}></div>
            </div>
          </div>

          {/* 2D Flat Tracking Text Stage */}
          <div className={`${styles.scrollTextStage} ${isIntroVisible ? styles.stackVisible : ''}`} aria-hidden="true">
            <div className={styles.layerTextItem} style={{ 
              '--stage': 0,
              '--phase-start': 0.20,
              '--title-exit': 0.36,
              '--desc-exit': 0.38,
              '--copy-y': 'calc(150px * var(--spread-unit))'
            } as React.CSSProperties}>
              <div className={styles.layerStageTitle}>Clarity</div>
              <p className={styles.layerStageDesc}>Identifying operational bottlenecks and establishing a first-principles foundation.</p>
            </div>

            <div className={styles.layerTextItem} style={{ 
              '--stage': 1,
              '--phase-start': 0.48,
              '--title-exit': 0.64,
              '--desc-exit': 0.66,
              '--copy-y': 'calc(-20px * var(--spread-unit))'
            } as React.CSSProperties}>
              <div className={styles.layerStageTitle}>Design</div>
              <p className={styles.layerStageDesc}>Architecting intelligent workflows around core business processes.</p>
            </div>

            <div className={styles.layerTextItem} style={{ 
              '--stage': 2,
              '--phase-start': 0.76,
              '--title-exit': 0.84,
              '--desc-exit': 0.86,
              '--copy-y': 'calc(-190px * var(--spread-unit))'
            } as React.CSSProperties}>
              <div className={styles.layerStageTitle}>Growth</div>
              <p className={styles.layerStageDesc}>Scaling your brand presence through a connected, high-leverage growth system.</p>
            </div>
          </div>
        </div>

        {/* Foreground Content (Fades out completely) */}
        <div className={styles.container}>
          <div className={styles.split}>
            <div className={`${styles.content} ${isIntroVisible ? styles.visible : ''}`}>
              <span className={styles.heroBrandText} data-text="Kramaniti">Kramaniti</span>
              <span className={styles.eyebrow}>Strategy before tools. Systems before scale.</span>
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
                Kramaniti partners with founders to fix broken operations, design simpler daily workflows, and create content that drives real business growth.
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

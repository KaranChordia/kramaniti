'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from './Hero.module.css';

const heroHeadline = 'Align how your brand operates, thinks, and shows up.';
const heroHeadlineWords = heroHeadline.split(' ');

const COMET_DELAYS = [0, 0.5, 1.0];

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [isIntroVisible, setIsIntroVisible] = useState(false);
  const [isSystemsActive, setIsSystemsActive] = useState(false);
  const isSystemsActiveRef = useRef(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsIntroVisible(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let isListenerBound = false;

    const updateScroll = () => {
      const rect = hero.getBoundingClientRect();
      const maxScroll = Math.max(hero.offsetHeight - window.innerHeight, 1);
      const rawProgress = Math.min(Math.max((-rect.top) / maxScroll, 0), 1);
      // Keep scroll-driven motion continuous, but slightly slower than a 1:1 mapping.
      const scrollProgress = Math.pow(rawProgress, 1.14);

      if (scrollProgress >= 0.40 && !isSystemsActiveRef.current) {
        isSystemsActiveRef.current = true;
        setIsSystemsActive(true);
      } else if (scrollProgress < 0.35 && isSystemsActiveRef.current) {
        isSystemsActiveRef.current = false;
        setIsSystemsActive(false);
      }

      hero.style.setProperty('--hero-scroll', `${scrollProgress.toFixed(4)}`);
      document.documentElement.style.setProperty('--global-hero-scroll', `${scrollProgress.toFixed(4)}`);
    };

    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        if (isListenerBound) {
          window.removeEventListener('scroll', updateScroll);
          isListenerBound = false;
        }
        hero.style.setProperty('--hero-scroll', '0');
        document.documentElement.style.setProperty('--global-hero-scroll', '0');
      } else {
        if (!isListenerBound) {
          window.addEventListener('scroll', updateScroll, { passive: true });
          isListenerBound = true;
        }
        updateScroll();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (isListenerBound) {
        window.removeEventListener('scroll', updateScroll);
      }
    };
  }, []);

  return (
    <section ref={heroRef} className={styles.heroSection} id="hero">
      <div className={styles.stickyContainer}>
        
        {/* Background Effects */}
        <div className={styles.background} aria-hidden="true">
          <div className={`${styles.glow} ${styles.glowLeft}`}></div>
          <div className={`${styles.glow} ${styles.glowRight}`}></div>
          
          <div className={styles.atmosphere} aria-hidden="true">
            <div className={`${styles.flowLine} ${styles.flowHorizontal} ${styles.flowPos1}`}></div>
            <div className={`${styles.flowLine} ${styles.flowHorizontal} ${styles.flowPos2}`}></div>
            <div className={`${styles.flowLine} ${styles.flowHorizontal} ${styles.flowPos3}`}></div>
            <div className={`${styles.flowLine} ${styles.flowHorizontal} ${styles.flowPos4}`}></div>
            <div className={`${styles.flowLine} ${styles.flowVertical} ${styles.flowPos5}`}></div>
            <div className={`${styles.flowLine} ${styles.flowVertical} ${styles.flowPos6}`}></div>
            <div className={`${styles.flowLine} ${styles.flowVertical} ${styles.flowPos7}`}></div>
            <div className={`${styles.flowLine} ${styles.flowVertical} ${styles.flowPos8}`}></div>
          </div>
          
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
                {COMET_DELAYS.map((cDelay, cIdx) => (
                  <path 
                    key={`p1-${cIdx}`}
                    d="M 32 32 L 32 208 Q 32 224 48 224 L 208 224 Q 224 224 224 240 L 224 400 Q 224 416 240 416 L 464 416 Q 480 416 480 400 L 480 288" 
                    className={`${styles.nodeBeam} ${styles.path1Beam}`} 
                    style={{ animationDelay: `${cDelay}s` }}
                  />
                ))}

                {/* Path 2 Beams */}
                {COMET_DELAYS.map((cDelay, cIdx) => (
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
              <span className={styles.eyebrow}>Kramaniti</span>
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
                Kramaniti helps founder-led brands turn operational reality into clearer systems, sharper intelligence, and a more coherent market presence—so what the business does and what the brand stands for move in the same direction.
              </p>
              <a href="#contact" className={styles.heroCta}>Book a Strategic Audit</a>
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

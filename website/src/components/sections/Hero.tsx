'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from './Hero.module.css';

const heroHeadline = 'Align how your brand operates, thinks, and shows up.';
const heroHeadlineWords = heroHeadline.split(' ');

const COMET_DELAYS = [0, 0.5, 1.0];
const ENABLE_HERO_SCROLL_SEQUENCE = false;
const HERO_SIGNAL_NODES = [
  { x: 76, y: 116, c1x: 222, c1y: 76, c2x: 350, c2y: 220, delay: '0s', duration: '7.2s', radius: 3.5 },
  { x: 156, y: 238, c1x: 272, c1y: 214, c2x: 360, c2y: 252, delay: '0.45s', duration: '6.8s', radius: 3 },
  { x: 116, y: 438, c1x: 244, c1y: 420, c2x: 362, c2y: 340, delay: '0.9s', duration: '7.6s', radius: 3.5 },
  { x: 284, y: 74, c1x: 368, c1y: 92, c2x: 424, c2y: 170, delay: '1.35s', duration: '7s', radius: 3 },
  { x: 310, y: 492, c1x: 384, c1y: 458, c2x: 430, c2y: 364, delay: '1.8s', duration: '7.4s', radius: 3 },
  { x: 498, y: 52, c1x: 500, c1y: 138, c2x: 500, c2y: 212, delay: '2.25s', duration: '6.9s', radius: 3 },
  { x: 646, y: 502, c1x: 588, c1y: 454, c2x: 542, c2y: 374, delay: '2.7s', duration: '7.7s', radius: 3.5 },
  { x: 704, y: 80, c1x: 628, c1y: 98, c2x: 574, c2y: 174, delay: '0.22s', duration: '7.1s', radius: 3 },
  { x: 858, y: 146, c1x: 764, c1y: 134, c2x: 658, c2y: 230, delay: '0.72s', duration: '7.5s', radius: 3.5 },
  { x: 930, y: 310, c1x: 774, c1y: 306, c2x: 650, c2y: 288, delay: '1.18s', duration: '6.8s', radius: 3 },
  { x: 832, y: 446, c1x: 724, c1y: 438, c2x: 624, c2y: 352, delay: '1.66s', duration: '7.3s', radius: 3.5 },
  { x: 918, y: 474, c1x: 756, c1y: 466, c2x: 644, c2y: 366, delay: '3.05s', duration: '7.9s', radius: 3 },
];
const HERO_TRAVEL_NODES = HERO_SIGNAL_NODES.filter((_, index) => index % 2 === 0);

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

    if (!ENABLE_HERO_SCROLL_SEQUENCE) {
      hero.style.setProperty('--hero-scroll', '0');
      document.documentElement.style.setProperty('--global-hero-scroll', '0');
      return;
    }

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
    <section
      ref={heroRef}
      className={`${styles.heroSection} ${!ENABLE_HERO_SCROLL_SEQUENCE ? styles.sequenceDisabled : ''}`}
      id="hero"
    >
      <div className={styles.stickyContainer}>
        
        {/* Background Effects */}
        <div className={styles.background} aria-hidden="true">
          <div className={`${styles.glow} ${styles.glowLeft}`}></div>
          <div className={`${styles.glow} ${styles.glowRight}`}></div>
          
          {ENABLE_HERO_SCROLL_SEQUENCE && (
            <>
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
                  '--copy-y': 'calc(150px * var(--spread-unit))',
                } as React.CSSProperties}>
                  <div className={styles.layerStageTitle}>Clarity</div>
                  <p className={styles.layerStageDesc}>Identifying operational bottlenecks and establishing a first-principles foundation.</p>
                </div>

                <div className={styles.layerTextItem} style={{
                  '--stage': 1,
                  '--phase-start': 0.48,
                  '--title-exit': 0.64,
                  '--desc-exit': 0.66,
                  '--copy-y': 'calc(-20px * var(--spread-unit))',
                } as React.CSSProperties}>
                  <div className={styles.layerStageTitle}>Design</div>
                  <p className={styles.layerStageDesc}>Architecting intelligent workflows around core business processes.</p>
                </div>

                <div className={styles.layerTextItem} style={{
                  '--stage': 2,
                  '--phase-start': 0.76,
                  '--title-exit': 0.84,
                  '--desc-exit': 0.86,
                  '--copy-y': 'calc(-190px * var(--spread-unit))',
                } as React.CSSProperties}>
                  <div className={styles.layerStageTitle}>Growth</div>
                  <p className={styles.layerStageDesc}>Scaling your brand presence through a connected, high-leverage growth system.</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Foreground Content (Fades out completely) */}
        <div className={styles.container}>
          <div className={`${styles.heroSignal} ${isIntroVisible ? styles.heroSignalVisible : ''}`} aria-hidden="true">
            <svg className={styles.signalSvg} viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet">
              <defs>
                <radialGradient id="heroSignalCoreGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(255, 240, 180, 0.98)" />
                  <stop offset="24%" stopColor="rgba(201, 168, 76, 0.42)" />
                  <stop offset="100%" stopColor="rgba(201, 168, 76, 0)" />
                </radialGradient>
                <linearGradient id="heroSignalFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(201, 168, 76, 0)" />
                  <stop offset="42%" stopColor="rgba(201, 168, 76, 0.52)" />
                  <stop offset="54%" stopColor="rgba(255, 240, 180, 0.92)" />
                  <stop offset="100%" stopColor="rgba(201, 168, 76, 0)" />
                </linearGradient>
                <filter id="heroSignalSoftGlow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <g className={styles.signalPaths}>
                {HERO_SIGNAL_NODES.map((node, index) => (
                  <path
                    key={`signal-path-${index}`}
                    id={`heroSignalPath${index}`}
                    d={`M ${node.x} ${node.y} C ${node.c1x} ${node.c1y} ${node.c2x} ${node.c2y} 500 280`}
                    pathLength={1}
                    style={{ '--signal-delay': node.delay } as React.CSSProperties}
                  />
                ))}
              </g>

              <g className={styles.signalBeams} filter="url(#heroSignalSoftGlow)">
                {HERO_SIGNAL_NODES.map((node, index) => (
                  <path
                    key={`signal-beam-${index}`}
                    d={`M ${node.x} ${node.y} C ${node.c1x} ${node.c1y} ${node.c2x} ${node.c2y} 500 280`}
                    pathLength={1}
                    style={{ '--signal-delay': node.delay } as React.CSSProperties}
                  />
                ))}
              </g>

              <g className={styles.signalAnchors} filter="url(#heroSignalSoftGlow)">
                {HERO_SIGNAL_NODES.map((node, index) => (
                  <circle
                    key={`signal-anchor-${index}`}
                    cx={node.x}
                    cy={node.y}
                    r={node.radius}
                    style={{ '--signal-delay': node.delay } as React.CSSProperties}
                  />
                ))}
              </g>

              <g className={styles.signalTravelDots} filter="url(#heroSignalSoftGlow)">
                {HERO_TRAVEL_NODES.map((node, index) => (
                  <circle key={`signal-travel-${index}`} r={node.radius + 0.8} className={styles.signalTravelDot}>
                    <animateMotion dur={node.duration} repeatCount="indefinite" begin={node.delay}>
                      <mpath href={`#heroSignalPath${index * 2}`} />
                    </animateMotion>
                  </circle>
                ))}
              </g>

              <circle className={styles.signalCoreHalo} cx="500" cy="280" r="106" />
              <circle className={styles.signalCoreOuter} cx="500" cy="280" r="58" />
              <g className={styles.signalCoreOrbit} filter="url(#heroSignalSoftGlow)">
                <path d="M 444 280 A 56 56 0 0 1 500 224" />
                <path d="M 556 280 A 56 56 0 0 1 500 336" />
                <path d="M 500 238 A 42 42 0 0 1 542 280" />
                <path d="M 500 322 A 42 42 0 0 1 458 280" />
              </g>
              <circle className={styles.signalCoreInner} cx="500" cy="280" r="18" />
              <circle className={styles.signalCoreDot} cx="500" cy="280" r="7" filter="url(#heroSignalSoftGlow)" />
            </svg>
          </div>

          <div className={styles.split}>
            <div className={`${styles.content} ${isIntroVisible ? styles.visible : ''}`}>
              <span className={styles.heroBrandText} data-text="Kramaniti">Kramaniti</span>
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
                Kramaniti aligns your operations, intelligence systems, and brand presence into one coherent growth pipeline.
              </p>
              <a href="#contact" className={styles.heroCta}>Book a Strategic Audit</a>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}

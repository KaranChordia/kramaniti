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
const HERO_AMBIENT_DOTS = [
  { x: 42, y: 54, r: 1.8, delay: '-1.2s', duration: '7.4s' },
  { x: 118, y: 96, r: 1.2, delay: '-4.3s', duration: '8.8s' },
  { x: 214, y: 42, r: 1.5, delay: '-2.7s', duration: '6.9s' },
  { x: 332, y: 86, r: 1.1, delay: '-5.5s', duration: '9.3s' },
  { x: 438, y: 34, r: 1.7, delay: '-0.6s', duration: '7.8s' },
  { x: 592, y: 76, r: 1.3, delay: '-3.9s', duration: '8.4s' },
  { x: 728, y: 48, r: 1.8, delay: '-6.1s', duration: '9.7s' },
  { x: 884, y: 92, r: 1.2, delay: '-2.1s', duration: '7.1s' },
  { x: 956, y: 42, r: 1.5, delay: '-4.8s', duration: '8.9s' },
  { x: 64, y: 178, r: 1.4, delay: '-5.9s', duration: '9.1s' },
  { x: 174, y: 228, r: 1.9, delay: '-1.7s', duration: '7.6s' },
  { x: 284, y: 170, r: 1.3, delay: '-3.2s', duration: '8.2s' },
  { x: 392, y: 232, r: 1.6, delay: '-0.4s', duration: '6.8s' },
  { x: 514, y: 156, r: 1.1, delay: '-4.6s', duration: '9.6s' },
  { x: 632, y: 214, r: 1.7, delay: '-2.8s', duration: '7.9s' },
  { x: 756, y: 168, r: 1.3, delay: '-6.4s', duration: '8.7s' },
  { x: 848, y: 236, r: 1.8, delay: '-1.1s', duration: '7.3s' },
  { x: 948, y: 188, r: 1.2, delay: '-3.7s', duration: '9s' },
  { x: 96, y: 338, r: 1.6, delay: '-2.4s', duration: '7.7s' },
  { x: 226, y: 404, r: 1.2, delay: '-5.2s', duration: '8.5s' },
  { x: 346, y: 324, r: 1.8, delay: '-0.9s', duration: '9.2s' },
  { x: 456, y: 392, r: 1.4, delay: '-4.1s', duration: '7.2s' },
  { x: 578, y: 330, r: 1.9, delay: '-6.7s', duration: '9.8s' },
  { x: 704, y: 414, r: 1.3, delay: '-1.5s', duration: '8.1s' },
  { x: 812, y: 336, r: 1.6, delay: '-3.4s', duration: '7.5s' },
  { x: 928, y: 396, r: 1.4, delay: '-5.7s', duration: '9.4s' },
  { x: 52, y: 508, r: 1.2, delay: '-3.1s', duration: '8.6s' },
  { x: 156, y: 542, r: 1.7, delay: '-0.8s', duration: '7s' },
  { x: 298, y: 494, r: 1.5, delay: '-4.9s', duration: '9.5s' },
  { x: 424, y: 548, r: 1.1, delay: '-2.2s', duration: '7.8s' },
  { x: 558, y: 502, r: 1.6, delay: '-6.2s', duration: '8.9s' },
  { x: 688, y: 538, r: 1.2, delay: '-1.9s', duration: '7.6s' },
  { x: 824, y: 492, r: 1.8, delay: '-4.4s', duration: '9.1s' },
  { x: 960, y: 532, r: 1.3, delay: '-2.9s', duration: '8.3s' },
];
const HERO_AMBIENT_LINES = [
  { x1: 42, y1: 54, x2: 214, y2: 42, delay: '-2.1s', duration: '10.2s' },
  { x1: 118, y1: 96, x2: 284, y2: 170, delay: '-6.4s', duration: '12.4s' },
  { x1: 332, y1: 86, x2: 514, y2: 156, delay: '-4.8s', duration: '9.8s' },
  { x1: 592, y1: 76, x2: 756, y2: 168, delay: '-1.3s', duration: '11.6s' },
  { x1: 728, y1: 48, x2: 948, y2: 188, delay: '-7.2s', duration: '13.1s' },
  { x1: 64, y1: 178, x2: 174, y2: 228, delay: '-3.6s', duration: '10.8s' },
  { x1: 284, y1: 170, x2: 392, y2: 232, delay: '-8.1s', duration: '12s' },
  { x1: 632, y1: 214, x2: 848, y2: 236, delay: '-5.3s', duration: '9.4s' },
  { x1: 96, y1: 338, x2: 226, y2: 404, delay: '-0.9s', duration: '11.2s' },
  { x1: 346, y1: 324, x2: 456, y2: 392, delay: '-6.8s', duration: '10.5s' },
  { x1: 578, y1: 330, x2: 704, y2: 414, delay: '-3.9s', duration: '12.8s' },
  { x1: 812, y1: 336, x2: 928, y2: 396, delay: '-9.2s', duration: '11.7s' },
  { x1: 52, y1: 508, x2: 156, y2: 542, delay: '-4.5s', duration: '9.9s' },
  { x1: 298, y1: 494, x2: 424, y2: 548, delay: '-1.8s', duration: '12.2s' },
  { x1: 558, y1: 502, x2: 688, y2: 538, delay: '-7.7s', duration: '10.7s' },
  { x1: 824, y1: 492, x2: 960, y2: 532, delay: '-2.7s', duration: '13.4s' },
  { x1: 214, y1: 42, x2: 174, y2: 228, delay: '-5.9s', duration: '12.7s' },
  { x1: 756, y1: 168, x2: 704, y2: 414, delay: '-0.4s', duration: '11.3s' },
];

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
          <svg className={styles.ambientNetwork} viewBox="0 0 1000 600" preserveAspectRatio="none">
            <g className={styles.ambientLines}>
              {HERO_AMBIENT_LINES.map((line, index) => (
                <line
                  key={`ambient-line-${index}`}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  style={{
                    '--ambient-delay': line.delay,
                    '--ambient-duration': line.duration,
                  } as React.CSSProperties}
                />
              ))}
            </g>
            <g className={styles.ambientDots}>
              {HERO_AMBIENT_DOTS.map((dot, index) => (
                <circle
                  key={`ambient-dot-${index}`}
                  cx={dot.x}
                  cy={dot.y}
                  r={dot.r}
                  style={{
                    '--ambient-delay': dot.delay,
                    '--ambient-duration': dot.duration,
                  } as React.CSSProperties}
                />
              ))}
            </g>
          </svg>
          
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

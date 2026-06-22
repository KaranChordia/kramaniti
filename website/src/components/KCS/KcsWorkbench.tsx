'use client';

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import {
  kcsSceneSequence,
  type KcsRenderedScene,
  type KcsVisualMode,
} from '../../lib/KCS/sceneSequence';
import styles from './KcsWorkbench.module.css';

const visualClassMap: Record<KcsVisualMode, string> = {
  scatter: styles.visualScatter,
  signal: styles.visualSignal,
  gates: styles.visualGates,
  layers: styles.visualLayers,
  rhythm: styles.visualRhythm,
};

const signalNodes = Array.from({ length: 18 }, (_, index) => index);

function AmbientField() {
  return (
    <div className={styles.ambientField} aria-hidden="true">
      <span className={`${styles.flowLine} ${styles.flowLineOne}`} />
      <span className={`${styles.flowLine} ${styles.flowLineTwo}`} />
      <span className={`${styles.flowLine} ${styles.flowLineThree}`} />
      <span className={`${styles.flowLineVertical} ${styles.flowLineFour}`} />
      <span className={`${styles.flowLineVertical} ${styles.flowLineFive}`} />
    </div>
  );
}

function MotionSystem({ scene }: { scene: KcsRenderedScene }) {
  return (
    <div className={`${styles.motionSystem} ${visualClassMap[scene.visualMode]}`} aria-hidden="true">
      <div className={styles.noiseField}>
        {signalNodes.map((node) => (
          <span key={node} className={`${styles.noiseNode} ${styles[`noiseNode${node + 1}`]}`} />
        ))}
      </div>

      <svg className={styles.systemSvg} viewBox="0 0 980 620" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="kcs-gold-glow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="kcs-route-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(160, 125, 58, 0)" />
            <stop offset="45%" stopColor="rgba(201, 168, 76, 0.92)" />
            <stop offset="100%" stopColor="rgba(246, 223, 157, 0)" />
          </linearGradient>
        </defs>

        <path
          className={styles.gridPath}
          d="M 132 128 H 848 M 132 310 H 848 M 132 492 H 848 M 220 82 V 538 M 490 82 V 538 M 760 82 V 538"
        />

        <path
          className={styles.scatterPath}
          d="M 140 154 C 284 88 342 240 490 184 C 628 132 706 110 846 162"
        />
        <path
          className={styles.scatterPath}
          d="M 144 466 C 248 360 370 518 490 430 C 608 342 744 380 842 484"
        />
        <path
          className={styles.scatterPath}
          d="M 166 312 C 284 304 362 248 490 310 C 600 362 708 300 820 312"
        />

        <path
          className={styles.mainRoute}
          d="M 126 474 C 232 430 262 322 366 310 C 468 298 510 188 612 184 C 724 180 768 292 856 252"
          pathLength="1"
        />
        <path
          className={styles.routeBeam}
          d="M 126 474 C 232 430 262 322 366 310 C 468 298 510 188 612 184 C 724 180 768 292 856 252"
          pathLength="1"
          filter="url(#kcs-gold-glow)"
        />

        <g className={styles.gateSet}>
          <rect className={styles.gateBox} x="308" y="250" width="126" height="74" rx="8" />
          <rect className={styles.gateBox} x="518" y="124" width="126" height="74" rx="8" />
          <rect className={styles.gateBox} x="712" y="220" width="126" height="74" rx="8" />
        </g>

        <g className={styles.layerSet}>
          <rect className={styles.layerBox} x="268" y="158" width="438" height="72" rx="8" />
          <rect className={styles.layerBox} x="316" y="274" width="342" height="72" rx="8" />
          <rect className={styles.layerBox} x="366" y="390" width="242" height="72" rx="8" />
        </g>

        <circle className={styles.loopRingOuter} cx="490" cy="310" r="176" />
        <circle className={styles.loopRingInner} cx="490" cy="310" r="104" />
        <path
          className={styles.loopBeam}
          d="M 490 134 a 176 176 0 1 1 0 352 a 176 176 0 1 1 0 -352"
          pathLength="1"
          filter="url(#kcs-gold-glow)"
        />

        <circle className={styles.coreOuter} cx="490" cy="310" r="62" />
        <circle className={styles.coreInner} cx="490" cy="310" r="19" filter="url(#kcs-gold-glow)" />
      </svg>

      <div className={styles.microStack}>
        {scene.microCopy.map((item, index) => (
          <span key={item} className={styles[`microItem${index + 1}`]}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function KcsWorkbench() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const activeScene = kcsSceneSequence[activeIndex];
  const sceneDuration = activeScene.durationMs;

  const activeProgressStyle = useMemo(
    () => ({ animationDuration: `${sceneDuration}ms` }),
    [sceneDuration],
  );

  const goToScene = useCallback((index: number) => {
    setActiveIndex((index + kcsSceneSequence.length) % kcsSceneSequence.length);
  }, []);

  const goToPrevious = useCallback(() => {
    goToScene(activeIndex - 1);
  }, [activeIndex, goToScene]);

  const goToNext = useCallback(() => {
    goToScene(activeIndex + 1);
  }, [activeIndex, goToScene]);

  useEffect(() => {
    if (!isPlaying) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % kcsSceneSequence.length);
    }, sceneDuration);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, isPlaying, sceneDuration]);

  return (
    <main className={styles.shell}>
      <AmbientField />

      <section className={styles.stage} aria-label="Kramaniti Content Studio scene output">
        <article
          key={activeScene.id}
          className={styles.scene}
          style={{ '--scene-duration': `${sceneDuration}ms` } as CSSProperties}
        >
          <header className={styles.brandBar}>
            <div className={styles.wordmark}>
              <span>K</span>RAMANITI
            </div>
            <div className={styles.sceneMeta}>
              <span>{activeScene.kicker}</span>
              <strong>{activeScene.number}</strong>
            </div>
          </header>

          <div className={styles.sceneCanvas}>
            <div className={styles.sceneAtmosphere} aria-hidden="true">
              <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>
                {activeScene.atmosphere[0]}
              </span>
              <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>
                {activeScene.atmosphere[1]}
              </span>
            </div>

            <MotionSystem scene={activeScene} />

            <div className={styles.copyRail}>
              <p>{activeScene.kicker}</p>
              <h1>{activeScene.headline}</h1>
              <span>{activeScene.support}</span>
            </div>
          </div>

          <footer className={styles.footerRail}>
            <div className={styles.timeline} aria-hidden="true">
              {kcsSceneSequence.map((scene, index) => (
                <span key={scene.id} className={styles.timelineSegment}>
                  <span
                    className={[
                      styles.timelineFill,
                      index < activeIndex ? styles.timelineDone : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  />
                  {index === activeIndex && isPlaying ? (
                    <span
                      key={`${scene.id}-progress`}
                      className={styles.timelineActive}
                      style={activeProgressStyle}
                    />
                  ) : null}
                </span>
              ))}
            </div>

            <nav className={styles.controls} aria-label="Scene controls">
              <button type="button" onClick={goToPrevious} aria-label="Previous scene">
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying((current) => !current)}
                aria-label={isPlaying ? 'Pause sequence' : 'Play sequence'}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button type="button" onClick={goToNext} aria-label="Next scene">
                <ChevronRight size={18} />
              </button>
            </nav>
          </footer>
        </article>
      </section>
    </main>
  );
}

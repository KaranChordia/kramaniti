'use client';

import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import {
  kcsSceneSequence,
  type KcsRenderedScene,
} from '../../lib/KCS/sceneSequence';
import styles from './KcsWorkbench.module.css';

const DEFAULT_SCENE_DURATION_MS = 5600;

function MotionField() {
  return (
    <div className={styles.globalAtmosphere} aria-hidden="true">
      <span className={`${styles.flowLine} ${styles.flowLineOne}`} />
      <span className={`${styles.flowLine} ${styles.flowLineTwo}`} />
      <span className={`${styles.flowLine} ${styles.flowLineThree}`} />
      <span className={`${styles.flowLine} ${styles.flowLineFour}`} />
      <span className={`${styles.flowLineVertical} ${styles.flowLineFive}`} />
      <span className={`${styles.flowLineVertical} ${styles.flowLineSix}`} />
    </div>
  );
}

function DivergingPathsVisual({ scene }: { scene: KcsRenderedScene }) {
  return (
    <div className={`${styles.visual} ${styles.divergingPaths}`} aria-hidden="true">
      <svg className={styles.visualSvg} viewBox="0 0 900 520" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="kcs-soft-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx="88" cy="260" r="26" className={styles.originRing} />
        <circle cx="88" cy="260" r="5" className={styles.originDot} filter="url(#kcs-soft-glow)" />
        <line x1="88" y1="260" x2="210" y2="260" className={styles.traceStem} />
        <path d="M 210 260 C 300 260, 338 96, 434 96 L 634 96" className={styles.tracePath} />
        <path d="M 210 260 L 652 260" className={styles.tracePath} />
        <path d="M 210 260 C 300 260, 338 424, 434 424 L 634 424" className={styles.tracePath} />
        <path d="M 210 260 C 300 260, 338 96, 434 96 L 634 96" className={styles.traceBeam} />
        <path d="M 210 260 L 652 260" className={styles.traceBeam} />
        <path d="M 210 260 C 300 260, 338 424, 434 424 L 634 424" className={styles.traceBeam} />
      </svg>

      <div className={`${styles.callout} ${styles.calloutOne}`}>{scene.labels[0]}</div>
      <div className={`${styles.callout} ${styles.calloutTwo}`}>{scene.labels[1]}</div>
      <div className={`${styles.callout} ${styles.calloutThree}`}>{scene.labels[2]}</div>
      <div className={styles.visualCaption}>one input can split into three disconnected outcomes</div>
    </div>
  );
}

function RouteConstellationVisual({ scene }: { scene: KcsRenderedScene }) {
  return (
    <div className={`${styles.visual} ${styles.routeConstellation}`} aria-hidden="true">
      <svg className={styles.visualSvg} viewBox="0 0 900 520" preserveAspectRatio="xMidYMid meet">
        <path
          d="M 132 122 L 132 272 Q 132 300 160 300 L 354 300 Q 386 300 386 268 L 386 142 Q 386 110 418 110 L 636 110"
          className={styles.routeTrack}
        />
        <path
          d="M 196 380 L 196 330 Q 196 298 228 298 L 520 298 Q 550 298 550 266 L 550 196 Q 550 164 582 164 L 720 164"
          className={styles.routeTrack}
        />
        <path
          d="M 354 300 L 354 420 Q 354 448 382 448 L 666 448"
          className={styles.routeTrack}
        />

        <path
          d="M 132 122 L 132 272 Q 132 300 160 300 L 354 300 Q 386 300 386 268 L 386 142 Q 386 110 418 110 L 636 110"
          className={`${styles.routeBeam} ${styles.routeBeamOne}`}
        />
        <path
          d="M 196 380 L 196 330 Q 196 298 228 298 L 520 298 Q 550 298 550 266 L 550 196 Q 550 164 582 164 L 720 164"
          className={`${styles.routeBeam} ${styles.routeBeamTwo}`}
        />
        <path
          d="M 354 300 L 354 420 Q 354 448 382 448 L 666 448"
          className={`${styles.routeBeam} ${styles.routeBeamThree}`}
        />
      </svg>

      <div className={`${styles.routeChip} ${styles.routeChipOne}`}>{scene.labels[0]}</div>
      <div className={`${styles.routeChip} ${styles.routeChipTwo}`}>{scene.labels[1]}</div>
      <div className={`${styles.routeChip} ${styles.routeChipThree}`}>{scene.labels[2]}</div>
      <div className={`${styles.routeChip} ${styles.routeChipFour}`}>{scene.labels[3]}</div>
    </div>
  );
}

function SignalExtractionVisual({ scene }: { scene: KcsRenderedScene }) {
  return (
    <div className={`${styles.visual} ${styles.signalExtraction}`} aria-hidden="true">
      <div className={`${styles.signalBand} ${styles.signalBandOne}`} />
      <div className={`${styles.signalBand} ${styles.signalBandTwo}`} />
      <div className={`${styles.signalBand} ${styles.signalBandThree}`} />
      <div className={styles.signalBeam} />
      <div className={styles.signalCore}>
        <span>{scene.number}</span>
      </div>
      <div className={`${styles.signalLabel} ${styles.signalLabelOne}`}>{scene.labels[0]}</div>
      <div className={`${styles.signalLabel} ${styles.signalLabelTwo}`}>{scene.labels[1]}</div>
      <div className={`${styles.signalLabel} ${styles.signalLabelThree}`}>{scene.labels[2]}</div>
      <div className={styles.visualCaption}>compress many inputs into one clear decision path</div>
    </div>
  );
}

function LayeredOrbitVisual({ scene }: { scene: KcsRenderedScene }) {
  return (
    <div className={`${styles.visual} ${styles.layeredOrbit}`} aria-hidden="true">
      <svg className={styles.visualSvg} viewBox="0 0 720 520" preserveAspectRatio="xMidYMid meet">
        <circle cx="360" cy="260" r="188" className={styles.orbitRingOuter} />
        <circle cx="360" cy="260" r="138" className={styles.orbitRingMid} />
        <circle cx="360" cy="260" r="88" className={styles.orbitRingInner} />
        <circle cx="360" cy="260" r="34" className={styles.orbitCoreOuter} />
        <circle cx="360" cy="260" r="18" className={styles.orbitCoreInner} />
        <path d="M 360 72 a 188 188 0 1 1 0 376 a 188 188 0 1 1 0 -376" className={styles.orbitBeamOuter} />
        <path d="M 360 122 a 138 138 0 1 1 0 276 a 138 138 0 1 1 0 -276" className={styles.orbitBeamMid} />
        <path d="M 360 172 a 88 88 0 1 1 0 176 a 88 88 0 1 1 0 -176" className={styles.orbitBeamInner} />
      </svg>

      <div className={`${styles.orbitLabel} ${styles.orbitLabelOne}`}>{scene.labels[0]}</div>
      <div className={`${styles.orbitLabel} ${styles.orbitLabelTwo}`}>{scene.labels[1]}</div>
      <div className={`${styles.orbitLabel} ${styles.orbitLabelThree}`}>{scene.labels[2]}</div>
    </div>
  );
}

function FeedbackLoopVisual({ scene }: { scene: KcsRenderedScene }) {
  return (
    <div className={`${styles.visual} ${styles.feedbackLoop}`} aria-hidden="true">
      <svg className={styles.visualSvg} viewBox="0 0 900 520" preserveAspectRatio="xMidYMid meet">
        <path
          d="M 238 124 H 626 Q 708 124 708 206 V 316 Q 708 398 626 398 H 274 Q 192 398 192 316 V 184 Q 192 124 238 124 Z"
          className={styles.loopTrack}
        />
        <path
          d="M 238 124 H 626 Q 708 124 708 206 V 316 Q 708 398 626 398 H 274 Q 192 398 192 316 V 184 Q 192 124 238 124 Z"
          className={styles.loopBeam}
        />
      </svg>

      <div className={`${styles.loopNode} ${styles.loopNodeOne}`}>{scene.labels[0]}</div>
      <div className={`${styles.loopNode} ${styles.loopNodeTwo}`}>{scene.labels[1]}</div>
      <div className={`${styles.loopNode} ${styles.loopNodeThree}`}>{scene.labels[2]}</div>
      <div className={`${styles.loopNode} ${styles.loopNodeFour}`}>{scene.labels[3]}</div>
      <div className={styles.loopCore}>improve</div>
    </div>
  );
}

function SceneVisual({ scene }: { scene: KcsRenderedScene }) {
  switch (scene.visualMode) {
    case 'divergingPaths':
      return <DivergingPathsVisual scene={scene} />;
    case 'routeConstellation':
      return <RouteConstellationVisual scene={scene} />;
    case 'signalExtraction':
      return <SignalExtractionVisual scene={scene} />;
    case 'layeredOrbit':
      return <LayeredOrbitVisual scene={scene} />;
    case 'feedbackLoop':
      return <FeedbackLoopVisual scene={scene} />;
    default:
      return null;
  }
}

export function KcsWorkbench() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const activeScene = kcsSceneSequence[activeIndex];
  const sceneDuration = activeScene.durationMs ?? DEFAULT_SCENE_DURATION_MS;

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
  }, [isPlaying, sceneDuration, activeIndex]);

  return (
    <main className={styles.shell}>
      <MotionField />

      <section className={styles.stage} aria-label="Kramaniti Content Studio scene output">
        <article
          key={activeScene.id}
          className={`${styles.scene} ${styles[activeScene.visualMode]}`}
          style={{ '--scene-duration': `${sceneDuration}ms` } as CSSProperties}
        >
          <header className={styles.brandBar}>
            <div className={styles.wordmark}>
              <span>K</span>RAMANITI
            </div>
            <div className={styles.sceneMeta}>
              <span>{activeScene.eyebrow}</span>
              <strong>{activeScene.number}</strong>
            </div>
          </header>

          <div className={styles.sceneViewport}>
            <div className={styles.sceneAtmosphere} aria-hidden="true">
              <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>
                {activeScene.atmosphere[0]}
              </span>
              <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>
                {activeScene.atmosphere[1]}
              </span>
            </div>

            <div className={styles.copyBlock}>
              <p>{activeScene.eyebrow}</p>
              <h1>{activeScene.headline}</h1>
              <span>{activeScene.supporting}</span>

              <div className={styles.beatList}>
                {activeScene.beats.map((beat) => (
                  <div key={beat} className={styles.beatItem}>
                    <i />
                    <small>{beat}</small>
                  </div>
                ))}
              </div>
            </div>

            <SceneVisual scene={activeScene} />

            <div className={styles.timeline} aria-hidden="true">
              {kcsSceneSequence.map((scene, index) => (
                <span key={scene.id} className={styles.timelineSegment}>
                  <span
                    className={[
                      styles.timelineSegmentFill,
                      index < activeIndex ? styles.timelineSegmentDone : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  />
                  {index === activeIndex && isPlaying ? (
                    <span
                      key={`${scene.id}-progress`}
                      className={styles.timelineSegmentActive}
                      style={{
                        animationDuration: `${scene.durationMs ?? DEFAULT_SCENE_DURATION_MS}ms`,
                      }}
                    />
                  ) : null}
                </span>
              ))}
            </div>
          </div>
        </article>

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
      </section>
    </main>
  );
}

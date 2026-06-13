'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { SceneTemplateProps } from '../../../lib/design-studio/types';
import type { ProcessPipelineData } from '../../../lib/design-studio/types';
import styles from './ProcessPipeline.module.css';

/* ── Entrance → CSS animation name mapping ────────────── */
const ENTRANCE_MAP: Record<string, string> = {
  'fade-up': 'fadeUp',
  'blur-in': 'blurIn',
  'scale-in': 'scaleIn',
  'slide-left': 'slideLeft',
};

export function ProcessPipeline({
  data,
  animation,
  isPlaying,
  onAnimationComplete,
}: SceneTemplateProps<'process-pipeline'>) {
  const { steps } = data as ProcessPipelineData;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Resolve animation config ─────────────────────────── */
  const entranceAnim = ENTRANCE_MAP[animation.entrance] ?? 'fadeUp';
  const duration = animation.duration ?? 700;
  const stagger = animation.stagger ?? 140;
  const easing =
    animation.easing || 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  const connectorDuration = Math.max(duration * 0.45, 350);

  /* ── Timing calculations ───────────────────────────────── */
  // Pattern: step[0] appears → connector[0] draws → step[1] appears → ...
  const getStepDelay = useCallback(
    (index: number) => {
      // Each step waits for all previous steps + connectors
      return index * (stagger + connectorDuration * 0.6);
    },
    [stagger, connectorDuration],
  );

  const getConnectorDelay = useCallback(
    (index: number) => {
      // Connector starts after its left step has partially appeared
      return getStepDelay(index) + duration * 0.35;
    },
    [getStepDelay, duration],
  );

  const totalAnimTime = useMemo(() => {
    const lastIndex = steps.length - 1;
    return getStepDelay(lastIndex) + duration + 100; // small buffer
  }, [steps.length, getStepDelay, duration]);

  const handleComplete = useCallback(() => {
    onAnimationComplete?.();
  }, [onAnimationComplete]);

  /* ── Toggle animation on isPlaying ─────────────────────── */
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (isPlaying) {
      timerRef.current = setTimeout(handleComplete, totalAnimTime);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, handleComplete, totalAnimTime]);

  /* ── CSS custom properties on wrapper ──────────────────── */
  const rootVars = {
    '--entrance-anim': entranceAnim,
    '--anim-duration': `${duration}ms`,
    '--anim-easing': easing,
    '--connector-duration': `${connectorDuration}ms`,
  } as React.CSSProperties;

  const isLast = (i: number) => i === steps.length - 1;

  return (
    <div
      ref={wrapperRef}
      className={`${styles.wrapper} ${isPlaying ? styles.animate : ''}`}
      style={rootVars}
    >
      <div className={styles.pipeline}>
        {steps.map((step, i) => (
          <div key={i} className={styles.stepGroup}>
            {/* ── Step card ─────────────────────────────── */}
            <div
              className={`${styles.step} ${isLast(i) ? styles.destination : ''}`}
              style={
                {
                  '--delay': `${getStepDelay(i)}ms`,
                } as React.CSSProperties
              }
            >
              <span className={styles.badge}>{step.number}</span>
              <span className={styles.stepTitle}>{step.title}</span>
              {step.description && (
                <span className={styles.stepDescription}>
                  {step.description}
                </span>
              )}
            </div>

            {/* ── Connector (not after the last step) ──── */}
            {!isLast(i) && (
              <div className={styles.connector}>
                <div
                  className={styles.connectorLine}
                  style={
                    {
                      '--connector-delay': `${getConnectorDelay(i)}ms`,
                    } as React.CSSProperties
                  }
                />
                <div
                  className={styles.connectorGlow}
                  style={
                    {
                      '--connector-delay': `${getConnectorDelay(i)}ms`,
                    } as React.CSSProperties
                  }
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

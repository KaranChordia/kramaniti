'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { SceneTemplateProps } from '../../../lib/design-studio/types';
import type { MetricShowcaseData } from '../../../lib/design-studio/types';
import styles from './MetricShowcase.module.css';

/* ── Entrance-class map ────────────────────────────────────── */

const entranceClassMap: Record<string, string> = {
  'fade-up': styles.entranceFadeUp,
  'blur-in': styles.entranceBlurIn,
  'scale-in': styles.entranceScaleIn,
  'slide-left': styles.entranceSlideLeft,
};

/* ── Component ─────────────────────────────────────────────── */

export function MetricShowcase({
  data,
  animation,
  isPlaying,
  onAnimationComplete,
}: SceneTemplateProps<'metric-showcase'>) {
  const { metrics } = data as MetricShowcaseData;
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  /* Determine entrance CSS class */
  const entranceClass = entranceClassMap[animation.entrance] ?? styles.entranceFadeUp;

  /* Use 2×2 grid for exactly 4 metrics, row layout otherwise */
  const useGrid = metrics.length === 4;

  /* Clean up any running timeouts */
  const clearTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
  }, []);

  /* Toggle animation based on isPlaying */
  useEffect(() => {
    clearTimeouts();
    if (isPlaying) {

      /* Calculate total animation duration to fire onAnimationComplete */
      const totalElements = metrics.length;
      /* Card entrance + value pop + underline + label/description fade */
      const lastElementDelay = (totalElements - 1) * animation.stagger;
      const totalDuration = lastElementDelay + animation.duration + 800; // +800 for underline+label

      const completeTimeout = setTimeout(() => {
        onAnimationComplete?.();
      }, totalDuration);

      timeoutRefs.current.push(completeTimeout);
    }

    return clearTimeouts;
  }, [isPlaying, animation, metrics.length, clearTimeouts, onAnimationComplete]);

  /* ── Style helpers ───────────────────────────────────────── */

  const getCardStyle = (index: number): React.CSSProperties => ({
    animationDuration: `${animation.duration}ms`,
    animationDelay: `${index * animation.stagger}ms`,
    animationTimingFunction: animation.easing,
  });

  const getValueStyle = (index: number): React.CSSProperties => ({
    animationDuration: `${animation.duration * 0.8}ms`,
    animationDelay: `${index * animation.stagger + animation.duration * 0.3}ms`,
    animationTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  });

  const getUnderlineDelay = (index: number): React.CSSProperties => ({
    animationDelay: `${index * animation.stagger + animation.duration * 0.6}ms`,
  });

  const getLabelStyle = (index: number): React.CSSProperties => ({
    animationDuration: `${animation.duration * 0.5}ms`,
    animationDelay: `${index * animation.stagger + animation.duration * 0.7}ms`,
    animationTimingFunction: animation.easing,
  });

  const getDescriptionStyle = (index: number): React.CSSProperties => ({
    animationDuration: `${animation.duration * 0.5}ms`,
    animationDelay: `${index * animation.stagger + animation.duration * 0.85}ms`,
    animationTimingFunction: animation.easing,
  });

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${isPlaying ? styles.animate : ''}`}
    >
      <div className={useGrid ? styles.metricsGrid : styles.metricsRow}>
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`${styles.metricCard} ${entranceClass}`}
            style={getCardStyle(index)}
          >
            <span
              className={styles.value}
              style={{
                ...getValueStyle(index),
                ...getUnderlineDelay(index),
              }}
            >
              {metric.value}
            </span>

            <div
              className={styles.label}
              style={getLabelStyle(index)}
            >
              {metric.label}
            </div>

            {metric.description && (
              <div
                className={styles.description}
                style={getDescriptionStyle(index)}
              >
                {metric.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

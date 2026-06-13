'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { SceneTemplateProps } from '../../../lib/design-studio/types';
import type { ComparisonFlowData } from '../../../lib/design-studio/types';
import styles from './ComparisonFlow.module.css';

/* ── Entrance → CSS animation name mapping ────────────── */
const ENTRANCE_MAP: Record<string, string> = {
  'fade-up': 'fadeUp',
  'blur-in': 'blurIn',
  'scale-in': 'scaleIn',
  'slide-left': 'slideLeft',
};

export function ComparisonFlow({
  data,
  animation,
  isPlaying,
  onAnimationComplete,
}: SceneTemplateProps<'comparison-flow'>) {
  const {
    leftTitle,
    leftLabel,
    leftSteps,
    rightTitle,
    rightLabel,
    rightSteps,
  } = data as ComparisonFlowData;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Resolve animation config ─────────────────────────── */
  const entranceAnim = ENTRANCE_MAP[animation.entrance] ?? 'fadeUp';
  const duration = animation.duration ?? 700;
  const stagger = animation.stagger ?? 100;
  const easing =
    animation.easing || 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';

  /* ── Total element count for completion timer ──────────── */
  const leftCount = leftSteps.length + 1; // +1 header
  const rightCount = rightSteps.length + 1;

  /* Phase offsets:
     Left header → left steps → divider → right header → right steps */
  const dividerDelay = (leftCount) * stagger + duration * 0.3;
  const dividerDuration = Math.max(duration * 0.6, 400);
  const rightStartDelay = dividerDelay + dividerDuration * 0.5;

  const totalAnimTime = useMemo(() => {
    const lastRightStepDelay =
      rightStartDelay + rightCount * stagger;
    return lastRightStepDelay + duration;
  }, [rightStartDelay, rightCount, stagger, duration]);

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
    '--divider-delay': `${dividerDelay}ms`,
    '--divider-duration': `${dividerDuration}ms`,
  } as React.CSSProperties;

  return (
    <div
      ref={wrapperRef}
      className={`${styles.wrapper} ${isPlaying ? styles.animate : ''}`}
      style={rootVars}
    >
      <div className={styles.grid}>
        {/* ── LEFT COLUMN ────────────────────────────────── */}
        <div className={styles.columnLeft}>
          <div
            className={styles.headerBlock}
            style={{ '--delay': `${0}ms` } as React.CSSProperties}
          >
            <p className={styles.microLabelDanger}>{leftLabel}</p>
            <h3 className={styles.columnTitleDanger}>{leftTitle}</h3>
          </div>

          <ul className={styles.stepList}>
            {leftSteps.map((step, i) => (
              <li
                key={`l-${i}`}
                className={styles.stepDanger}
                style={
                  {
                    '--delay': `${(i + 1) * stagger}ms`,
                  } as React.CSSProperties
                }
              >
                {step}
              </li>
            ))}
          </ul>
        </div>

        {/* ── DIVIDER ────────────────────────────────────── */}
        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <div className={styles.dividerGlow} />
        </div>

        {/* ── RIGHT COLUMN ───────────────────────────────── */}
        <div className={styles.columnRight}>
          <div
            className={styles.headerBlock}
            style={
              {
                '--delay': `${rightStartDelay}ms`,
              } as React.CSSProperties
            }
          >
            <p className={styles.microLabelSuccess}>{rightLabel}</p>
            <h3 className={styles.columnTitleSuccess}>{rightTitle}</h3>
          </div>

          <ul className={styles.stepList}>
            {rightSteps.map((step, i) => (
              <li
                key={`r-${i}`}
                className={styles.stepSuccess}
                style={
                  {
                    '--delay': `${rightStartDelay + (i + 1) * stagger}ms`,
                  } as React.CSSProperties
                }
              >
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

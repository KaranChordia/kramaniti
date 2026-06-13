'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { SceneTemplateProps } from '../../../lib/design-studio/types';
import type { TitleCardData } from '../../../lib/design-studio/types';
import styles from './TitleCard.module.css';

/**
 * TitleCard – cinematic title card with staggered entrance animation.
 *
 * Elements: micro-label → headline → gold divider → subtitle → tagline
 * Each element enters sequentially with configurable animation type.
 */
export function TitleCard({
  data,
  animation,
  isPlaying,
  onAnimationComplete,
}: SceneTemplateProps<'title-card'>) {
  const { headline, subtitle, label, tagline } = data as TitleCardData;
  const containerRef = useRef<HTMLDivElement>(null);
  const completionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const entrance = animation.entrance;
  const durationMs = animation.duration;
  const staggerMs = animation.stagger;
  const easing = animation.easing;
  const isStaggerWords = entrance === 'stagger-words';

  // Split headline into words for stagger-words entrance
  const headlineWords = useMemo(() => headline.split(/\s+/), [headline]);

  // Count the sequentially-animated elements
  const elementCount = useMemo(() => {
    let count = 0;
    if (label) count++;
    // For stagger-words: each word is an element; otherwise headline = 1
    count += isStaggerWords ? headlineWords.length : 1;
    if (subtitle) count++; // divider shares timing with subtitle slot
    if (subtitle) count++; // subtitle itself
    if (tagline) count++;
    return count;
  }, [label, subtitle, tagline, isStaggerWords, headlineWords.length]);

  // Total animation duration for onAnimationComplete callback
  const totalDuration = useMemo(
    () => durationMs + staggerMs * (elementCount - 1) + 100,
    [durationMs, staggerMs, elementCount],
  );


  // Fire onAnimationComplete
  useEffect(() => {
    if (isPlaying && onAnimationComplete) {
      completionTimer.current = setTimeout(onAnimationComplete, totalDuration);
    }
    return () => {
      if (completionTimer.current) clearTimeout(completionTimer.current);
    };
  }, [isPlaying, totalDuration, onAnimationComplete]);

  /**
   * Build inline style for a given sequential element index.
   * Returns animation-duration, animation-delay, and animation-timing-function.
   */
  const getElementStyle = useCallback(
    (index: number): React.CSSProperties => ({
      animationDuration: `${durationMs}ms`,
      animationDelay: `${staggerMs * index}ms`,
      animationTimingFunction: easing,
    }),
    [durationMs, staggerMs, easing],
  );

  // Calculate sequential index tracker
  let seq = 0;

  // Compute indices for each element
  const labelIndex = label ? seq++ : -1;

  // Headline words (stagger-words) or headline block
  const headlineStartIndex = seq;
  if (isStaggerWords) {
    seq += headlineWords.length;
  } else {
    seq++;
  }

  const dividerIndex = subtitle ? seq++ : -1;
  const subtitleIndex = subtitle ? seq++ : -1;
  const taglineIndex = tagline ? seq++ : -1;

  const containerClass = [
    styles.container,
    isPlaying ? styles.animate : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={containerRef}
      className={containerClass}
      data-entrance={entrance}
    >
      {/* ── Micro-label ─────────────────────────────────── */}
      {label && (
        <span
          className={styles.label}
          style={getElementStyle(labelIndex)}
        >
          {label}
        </span>
      )}

      {/* ── Headline ────────────────────────────────────── */}
      {isStaggerWords ? (
        <h1
          className={styles.headline}
          style={{ opacity: isPlaying ? 1 : 0 }}
        >
          {headlineWords.map((word, i) => (
            <span key={i}>
              <span
                className={`${styles.headlineWord} ${styles.goldShimmer}`}
                style={getElementStyle(headlineStartIndex + i)}
              >
                {word}
              </span>
              {i < headlineWords.length - 1 && (
                <span className={styles.headlineWordSpace}> </span>
              )}
            </span>
          ))}
        </h1>
      ) : (
        <h1
          className={styles.headline}
          style={getElementStyle(headlineStartIndex)}
        >
          {headline}
        </h1>
      )}

      {/* ── Gold divider ────────────────────────────────── */}
      {subtitle && (
        <div
          className={styles.divider}
          style={getElementStyle(dividerIndex)}
        />
      )}

      {/* ── Subtitle ────────────────────────────────────── */}
      {subtitle && (
        <p
          className={styles.subtitle}
          style={getElementStyle(subtitleIndex)}
        >
          {subtitle}
        </p>
      )}

      {/* ── Tagline ─────────────────────────────────────── */}
      {tagline && (
        <p
          className={styles.tagline}
          style={getElementStyle(taglineIndex)}
        >
          {tagline}
        </p>
      )}
    </div>
  );
}

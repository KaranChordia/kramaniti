'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { SceneTemplateProps } from '../../../lib/design-studio/types';
import type { QuoteHighlightData } from '../../../lib/design-studio/types';
import styles from './QuoteHighlight.module.css';

/**
 * QuoteHighlight – cinematic quote/statement card.
 *
 * Features:
 * - Decorative oversized gold quotation mark
 * - Ambient radial glow behind the quote
 * - Quote text with per-word stagger-words support
 * - Attribution (gold, small-caps) and role (tertiary)
 */
export function QuoteHighlight({
  data,
  animation,
  isPlaying,
  onAnimationComplete,
}: SceneTemplateProps<'quote-highlight'>) {
  const { quote, attribution, role } = data as QuoteHighlightData;
  const containerRef = useRef<HTMLDivElement>(null);
  const completionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const entrance = animation.entrance;
  const durationMs = animation.duration;
  const staggerMs = animation.stagger;
  const easing = animation.easing;
  const isStaggerWords = entrance === 'stagger-words';

  // Split quote into words
  const quoteWords = useMemo(() => quote.split(/\s+/), [quote]);

  // Count sequentially-animated elements
  const elementCount = useMemo(() => {
    let count = 1; // decorative mark
    count += isStaggerWords ? quoteWords.length : 1; // quote
    if (attribution) count++;
    if (role) count++;
    return count;
  }, [attribution, role, isStaggerWords, quoteWords.length]);

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
   * Inline style builder for sequential element index.
   */
  const getElementStyle = useCallback(
    (index: number): React.CSSProperties => ({
      animationDuration: `${durationMs}ms`,
      animationDelay: `${staggerMs * index}ms`,
      animationTimingFunction: easing,
    }),
    [durationMs, staggerMs, easing],
  );

  // Sequential index tracker
  let seq = 0;

  // Decorative mark always leads
  const markIndex = seq++;

  // Quote words or block
  const quoteStartIndex = seq;
  if (isStaggerWords) {
    seq += quoteWords.length;
  } else {
    seq++;
  }

  const attributionIndex = attribution ? seq++ : -1;
  const roleIndex = role ? seq++ : -1;

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
      {/* ── Ambient glow ────────────────────────────────── */}
      <div className={styles.ambientGlow} aria-hidden="true" />

      {/* ── Quote content wrapper ───────────────────────── */}
      <div className={styles.quoteWrapper}>
        {/* ── Decorative quotation mark ───────────────── */}
        <span
          className={styles.decorativeMark}
          style={getElementStyle(markIndex)}
          aria-hidden="true"
        >
          &ldquo;
        </span>

        {/* ── Quote text ──────────────────────────────── */}
        {isStaggerWords ? (
          <blockquote className={styles.quoteText}>
            {quoteWords.map((word, i) => (
              <span key={i}>
                <span
                  className={styles.quoteWord}
                  style={getElementStyle(quoteStartIndex + i)}
                >
                  {word}
                </span>
                {i < quoteWords.length - 1 && (
                  <span className={styles.quoteWordSpace}> </span>
                )}
              </span>
            ))}
          </blockquote>
        ) : (
          <blockquote
            className={`${styles.quoteText} ${styles.quoteBlock}`}
            style={getElementStyle(quoteStartIndex)}
          >
            {quote}
          </blockquote>
        )}
      </div>

      {/* ── Attribution ─────────────────────────────────── */}
      {attribution && (
        <p
          className={styles.attribution}
          style={getElementStyle(attributionIndex)}
        >
          {attribution}
        </p>
      )}

      {/* ── Role / title ────────────────────────────────── */}
      {role && (
        <p
          className={styles.role}
          style={getElementStyle(roleIndex)}
        >
          {role}
        </p>
      )}
    </div>
  );
}

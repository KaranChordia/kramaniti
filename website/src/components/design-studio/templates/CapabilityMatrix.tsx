'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { SceneTemplateProps } from '../../../lib/design-studio/types';
import type { CapabilityMatrixData } from '../../../lib/design-studio/types';
import styles from './CapabilityMatrix.module.css';

/* ── Entrance-class map ────────────────────────────────────── */

const entranceClassMap: Record<string, string> = {
  'fade-up': styles.entranceFadeUp,
  'blur-in': styles.entranceBlurIn,
  'scale-in': styles.entranceScaleIn,
  'slide-left': styles.entranceSlideLeft,
};

/* ── Component ─────────────────────────────────────────────── */

export function CapabilityMatrix({
  data,
  animation,
  isPlaying,
  onAnimationComplete,
}: SceneTemplateProps<'capability-matrix'>) {
  const { columns, rows, highlightColumn = 1 } = data as CapabilityMatrixData;
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  /* Determine entrance CSS class */
  const entranceClass = entranceClassMap[animation.entrance] ?? styles.entranceFadeUp;

  /* Clean up any running timeouts */
  const clearTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
  }, []);

  /* Toggle animation based on isPlaying */
  useEffect(() => {
    clearTimeouts();

    if (isPlaying) {

      /* Total rows = 1 header + N body rows */
      const totalRows = 1 + rows.length;
      const lastRowDelay = (totalRows - 1) * animation.stagger;
      const totalDuration = lastRowDelay + animation.duration;

      const completeTimeout = setTimeout(() => {
        onAnimationComplete?.();
      }, totalDuration);

      timeoutRefs.current.push(completeTimeout);
      timeoutRefs.current.push(completeTimeout);
    }

    return clearTimeouts;
  }, [isPlaying, animation, rows.length, clearTimeouts, onAnimationComplete]);

  /* ── Style helper ────────────────────────────────────────── */

  const getRowStyle = (index: number): React.CSSProperties => ({
    animationDuration: `${animation.duration}ms`,
    animationDelay: `${index * animation.stagger}ms`,
    animationTimingFunction: animation.easing,
  });

  /* Helper to determine cell classes for a given column index */
  const getValueCellClass = (colIndex: number): string => {
    return colIndex === highlightColumn
      ? `${styles.valueCell} ${styles.valueCellHighlight}`
      : styles.valueCell;
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${isPlaying ? styles.animate : ''}`}
    >
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr
              className={`${styles.headerRow} ${entranceClass}`}
              style={getRowStyle(0)}
            >
              {/* Empty corner cell for dimension column */}
              <th className={styles.headerCorner} aria-hidden="true" />

              {columns.map((col, colIndex) => (
                <th
                  key={colIndex}
                  className={`${styles.headerCell} ${
                    colIndex === highlightColumn ? styles.headerCellHighlight : ''
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${styles.bodyRow} ${entranceClass}`}
                style={getRowStyle(rowIndex + 1)}
              >
                {/* Dimension label */}
                <td className={styles.dimensionCell}>
                  {row.dimension}
                </td>

                {/* Value cells */}
                {row.values.map((val, colIndex) => (
                  <td
                    key={colIndex}
                    className={getValueCellClass(colIndex)}
                  >
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

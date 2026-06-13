'use client';

import { useEffect, useRef } from 'react';
import type { SceneTemplateProps, ValueEquationData } from '../../../lib/design-studio/types';
import styles from './ValueEquation.module.css';

export function ValueEquation({
  data,
  animation,
  isPlaying,
  onAnimationComplete,
}: SceneTemplateProps<'value-equation'>) {
  const eqData = data as ValueEquationData;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (isPlaying) {
      // 5 elements: A → + → B → = → C
      const totalElements = 5;
      const totalDuration = totalElements * animation.stagger + animation.duration;

      timeoutRef.current = setTimeout(() => {
        onAnimationComplete?.();
      }, totalDuration);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isPlaying, animation, onAnimationComplete]);

  const entranceClass = styles[animation.entrance] ?? styles['fade-up'];

  const renderCard = (
    term: { title: string; points: string[] },
    index: number,
    isResult: boolean,
  ) => (
    <div
      className={`${styles.card} ${entranceClass} ${isResult ? styles.resultCard : ''}`}
      style={{
        '--element-delay': `${index * animation.stagger}ms`,
      } as React.CSSProperties}
    >
      <span className={styles.cardLabel}>
        {isResult ? 'Result' : index === 0 ? 'Input A' : 'Input B'}
      </span>
      <h3 className={styles.cardTitle}>{term.title}</h3>
      <ul className={styles.cardPoints}>
        {term.points.map((point, i) => (
          <li key={i} className={styles.cardPoint}>
            <span className={styles.pointDot} aria-hidden="true" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className={`${styles.container} ${isPlaying ? styles.animate : ''}`}
      style={{
        '--anim-duration': `${animation.duration}ms`,
        '--anim-easing': animation.easing,
        '--anim-stagger': `${animation.stagger}ms`,
      } as React.CSSProperties}
    >
      <div className={styles.equationRow}>
        {/* Term A */}
        {eqData.termA && renderCard(eqData.termA, 0, false)}

        {/* Plus operator */}
        <span
          className={`${styles.operator} ${entranceClass}`}
          style={{ '--element-delay': `${1 * animation.stagger}ms` } as React.CSSProperties}
          aria-hidden="true"
        >
          +
        </span>

        {/* Term B */}
        {eqData.termB && renderCard(eqData.termB, 2, false)}

        {/* Equals operator */}
        <span
          className={`${styles.operator} ${entranceClass}`}
          style={{ '--element-delay': `${3 * animation.stagger}ms` } as React.CSSProperties}
          aria-hidden="true"
        >
          =
        </span>

        {/* Result */}
        {eqData.result && renderCard(eqData.result, 4, true)}
      </div>
    </div>
  );
}

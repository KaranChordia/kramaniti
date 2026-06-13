'use client';
import type { SceneTemplateProps } from '../../../lib/design-studio/types';
import styles from './DataBreakdown.module.css';

export function DataBreakdown({ data, animation, isPlaying }: SceneTemplateProps<'data-breakdown'>) {


  const getAnimStyle = (index: number) => {
    if (!isPlaying) return { opacity: 0 };
    return {
      animationName: styles[animation.entrance] || styles['fade-up'],
      animationDuration: `${animation.duration}ms`,
      animationDelay: `${index * animation.stagger}ms`,
      animationTimingFunction: animation.easing,
      animationFillMode: 'forwards',
      opacity: 0,
    };
  };

  const getBarAnimStyle = (index: number, width: number) => {
    if (!isPlaying) return { width: 0, opacity: 0 };
    return {
      animationName: styles['grow-bar'],
      animationDuration: `${animation.duration * 1.5}ms`,
      animationDelay: `${index * animation.stagger + (animation.duration / 2)}ms`,
      animationTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)',
      animationFillMode: 'forwards',
      opacity: 0,
      width: 0,
      '--target-width': `${width}%`,
    } as React.CSSProperties;
  };

  return (
    <div className={styles.container}>
      <div className={styles.chartWrapper}>
        {data.title && (
          <h2 className={styles.chartTitle} style={getAnimStyle(0)}>{data.title}</h2>
        )}
        
        <div className={styles.segments}>
          {data.segments.map((segment, i) => {
            const isHighlight = i === 0; // Highlight the first/largest one
            return (
              <div key={i} className={styles.segmentRow} style={getAnimStyle(i + 1)}>
                <div className={styles.labelCol}>
                  <div className={isHighlight ? styles.labelHighlight : styles.label}>{segment.label}</div>
                  {segment.description && <div className={styles.description}>{segment.description}</div>}
                </div>
                
                <div className={styles.barCol}>
                  <div className={styles.barTrack}>
                    <div 
                      className={`${styles.barFill} ${isHighlight ? styles.barHighlight : ''}`} 
                      style={getBarAnimStyle(i + 1, segment.value)} 
                    />
                  </div>
                </div>
                
                <div className={styles.valueCol}>
                  <div className={isHighlight ? styles.valueHighlight : styles.value}>{segment.value}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

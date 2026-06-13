'use client';
import type { SceneTemplateProps } from '../../../lib/design-studio/types';
import styles from './Timeline.module.css';

export function Timeline({ data, animation, isPlaying }: SceneTemplateProps<'timeline'>) {


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

  const getLineAnimStyle = () => {
    if (!isPlaying) return { width: 0, opacity: 0 };
    return {
      animationName: styles['draw-line'],
      animationDuration: `${data.events.length * animation.stagger + animation.duration}ms`,
      animationTimingFunction: 'linear',
      animationFillMode: 'forwards',
      opacity: 0,
      width: 0,
    };
  };

  return (
    <div className={styles.container}>
      <div className={styles.timelineWrapper}>
        <div className={styles.lineTrack}>
          <div className={styles.lineFill} style={getLineAnimStyle()} />
        </div>
        
        <div className={styles.events}>
          {data.events.map((event, i) => (
            <div key={i} className={styles.eventItem}>
              <div className={styles.markerPoint} style={getAnimStyle(i)}>
                <div className={styles.markerInner} />
              </div>
              <div className={styles.eventContent} style={getAnimStyle(i)}>
                <div className={styles.markerLabel}>{event.marker}</div>
                <h3 className={styles.title}>{event.title}</h3>
                <p className={styles.description}>{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

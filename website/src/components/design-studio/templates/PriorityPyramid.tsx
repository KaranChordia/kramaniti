'use client';

import { useEffect, useRef } from 'react';
import type { SceneTemplateProps } from '../../../lib/design-studio/types';
import type { PriorityPyramidData } from '../../../lib/design-studio/types';
import styles from './PriorityPyramid.module.css';

export function PriorityPyramid({
  data,
  animation,
  isPlaying,
  onAnimationComplete,
}: SceneTemplateProps<'priority-pyramid'>) {
  const pyramidData = data as PriorityPyramidData;
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (isPlaying) {

      const totalLayers = pyramidData.layers?.length ?? 3;
      // Line draws first, then layers stagger in bottom-to-top
      const lineDrawDuration = animation.duration * 0.6;
      const totalDuration = lineDrawDuration + totalLayers * animation.stagger + animation.duration;

      timeoutRef.current = setTimeout(() => {
        onAnimationComplete?.();
      }, totalDuration);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isPlaying, animation, pyramidData.layers?.length, onAnimationComplete]);

  const layers = pyramidData.layers ?? [];
  // Reverse so bottom layer (index 0) is at the bottom visually
  const reversedLayers = [...layers].reverse();
  const entranceClass = styles[animation.entrance] ?? styles['fade-up'];
  const lineDrawDuration = animation.duration * 0.6;

  // Width tiers: bottom = widest, top = narrowest
  const widthMap: Record<number, string> = { 0: '42%', 1: '62%', 2: '82%' };

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${isPlaying ? styles.animate : ''}`}
      style={{
        '--anim-duration': `${animation.duration}ms`,
        '--anim-easing': animation.easing,
        '--anim-stagger': `${animation.stagger}ms`,
        '--line-draw-duration': `${lineDrawDuration}ms`,
      } as React.CSSProperties}
    >
      {/* Vertical connecting line */}
      <div className={styles.connectorWrapper}>
        <svg
          className={styles.connectorLine}
          viewBox="0 0 2 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line
            x1="1" y1="0" x2="1" y2="100"
            className={styles.connectorStroke}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Layers — rendered top-to-bottom in DOM, animated bottom-to-top */}
      <div className={styles.layerStack}>
        {reversedLayers.map((layer, visualIndex) => {
          // visualIndex 0 = top, last = bottom
          // Animation order: bottom first → top last
          const animIndex = reversedLayers.length - 1 - visualIndex;
          const layerWidth = widthMap[visualIndex] ?? '60%';
          const isFoundation = visualIndex === reversedLayers.length - 1;

          return (
            <div
              key={layer.number}
              className={`${styles.layer} ${entranceClass} ${isFoundation ? styles.foundation : ''}`}
              style={{
                '--layer-width': layerWidth,
                '--layer-delay': `${lineDrawDuration + animIndex * animation.stagger}ms`,
              } as React.CSSProperties}
            >
              <div className={styles.layerContent}>
                <span className={styles.numberBadge}>{layer.number}</span>
                <div className={styles.layerText}>
                  <h3 className={styles.layerTitle}>{layer.title}</h3>
                  <p className={styles.layerDescription}>{layer.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useRef } from 'react';
import styles from './Hero.module.css';

const heroHeadline = 'Align how your brand operates, thinks, and shows up.';
const heroHeadlineWords = heroHeadline.split(' ');
const flowLines = [
  { left: '8%', top: '18%', width: '24%', rotate: '0deg', opacity: 0.34, duration: '5.8s', delay: '-1.2s' },
  { left: '28%', top: '16%', width: '22%', rotate: '90deg', opacity: 0.28, duration: '6.4s', delay: '-3.4s' },
  { left: '42%', top: '31%', width: '20%', rotate: '0deg', opacity: 0.3, duration: '5.9s', delay: '-0.8s' },
  { left: '54%', top: '28%', width: '24%', rotate: '90deg', opacity: 0.33, duration: '6.8s', delay: '-4.6s' },
  { left: '68%', top: '36%', width: '22%', rotate: '0deg', opacity: 0.31, duration: '6.2s', delay: '-2.3s' },
  { left: '8%', top: '52%', width: '31%', rotate: '0deg', opacity: 0.32, duration: '7.1s', delay: '-5.1s' },
  { left: '33%', top: '48%', width: '22%', rotate: '90deg', opacity: 0.28, duration: '6.6s', delay: '-1.7s' },
  { left: '49%', top: '67%', width: '28%', rotate: '0deg', opacity: 0.34, duration: '7.4s', delay: '-6s' },
  { left: '74%', top: '56%', width: '24%', rotate: '90deg', opacity: 0.29, duration: '6.9s', delay: '-3s' },
  { left: '16%', top: '76%', width: '20%', rotate: '0deg', opacity: 0.27, duration: '6.1s', delay: '-4.1s' },
  { left: '57%', top: '18%', width: '18%', rotate: '90deg', opacity: 0.27, duration: '5.7s', delay: '-2.6s' },
  { left: '78%', top: '48%', width: '18%', rotate: '0deg', opacity: 0.3, duration: '6.3s', delay: '-0.9s' },
];

const signalDots = [
  { x: '8%', y: '17%', size: 2, delay: '-0.4s', duration: '5.8s' },
  { x: '18%', y: '38%', size: 3, delay: '-2.1s', duration: '6.6s' },
  { x: '27%', y: '24%', size: 2, delay: '-4.2s', duration: '7.1s' },
  { x: '34%', y: '68%', size: 4, delay: '-1.5s', duration: '6.2s' },
  { x: '42%', y: '31%', size: 3, delay: '-3.6s', duration: '7.6s' },
  { x: '49%', y: '79%', size: 2, delay: '-5.2s', duration: '6.9s' },
  { x: '57%', y: '22%', size: 4, delay: '-1.1s', duration: '7.8s' },
  { x: '63%', y: '54%', size: 2, delay: '-4.7s', duration: '6.4s' },
  { x: '71%', y: '35%', size: 3, delay: '-2.8s', duration: '7.4s' },
  { x: '82%', y: '63%', size: 2, delay: '-0.9s', duration: '6.8s' },
  { x: '91%', y: '28%', size: 3, delay: '-3.3s', duration: '7.2s' },
  { x: '14%', y: '73%', size: 2, delay: '-5.6s', duration: '6.5s' },
  { x: '22%', y: '84%', size: 3, delay: '-1.9s', duration: '7.7s' },
  { x: '37%', y: '47%', size: 2, delay: '-4.9s', duration: '6.1s' },
  { x: '53%', y: '42%', size: 3, delay: '-2.5s', duration: '7s' },
  { x: '66%', y: '76%', size: 2, delay: '-0.6s', duration: '6.7s' },
  { x: '78%', y: '18%', size: 4, delay: '-4.4s', duration: '7.9s' },
  { x: '88%', y: '81%', size: 2, delay: '-2.2s', duration: '6.3s' },
  { x: '6%', y: '51%', size: 3, delay: '-3.8s', duration: '7.3s' },
  { x: '31%', y: '12%', size: 2, delay: '-1.3s', duration: '6.6s' },
  { x: '46%', y: '59%', size: 4, delay: '-5.1s', duration: '7.5s' },
  { x: '59%', y: '87%', size: 2, delay: '-3.1s', duration: '6.2s' },
  { x: '73%', y: '49%', size: 3, delay: '-0.7s', duration: '7.6s' },
  { x: '95%', y: '46%', size: 2, delay: '-4.1s', duration: '6.9s' },
  { x: '11%', y: '30%', size: 2, delay: '-2.9s', duration: '7.4s' },
  { x: '25%', y: '58%', size: 4, delay: '-0.2s', duration: '6.4s' },
  { x: '68%', y: '11%', size: 2, delay: '-5.8s', duration: '7.8s' },
  { x: '86%', y: '39%', size: 3, delay: '-1.8s', duration: '6.7s' },
];

type HeroProps = {
  isActive?: boolean;
};

export function Hero({ isActive = true }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let frame = 0;

    const updateScrollDepth = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height * 0.72, 1)));
        hero.style.setProperty('--hero-scroll', progress.toFixed(4));
      });
    };

    const updatePointerDepth = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      hero.style.setProperty('--hero-pointer-x', x.toFixed(3));
      hero.style.setProperty('--hero-pointer-y', y.toFixed(3));
    };

    const resetPointerDepth = () => {
      hero.style.setProperty('--hero-pointer-x', '0');
      hero.style.setProperty('--hero-pointer-y', '0');
    };

    updateScrollDepth();
    window.addEventListener('scroll', updateScrollDepth, { passive: true });
    hero.addEventListener('pointermove', updatePointerDepth, { passive: true });
    hero.addEventListener('pointerleave', resetPointerDepth);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateScrollDepth);
      hero.removeEventListener('pointermove', updatePointerDepth);
      hero.removeEventListener('pointerleave', resetPointerDepth);
    };
  }, []);

  return (
    <section ref={heroRef} className={styles.heroSection} id="hero">
      <div className={styles.background} aria-hidden="true">
        <div className={`${styles.glow} ${styles.glowLeft}`} />
        <div className={`${styles.glow} ${styles.glowRight}`} />
        <div className={styles.grid} />
        <div className={styles.scrollArchitecture}>
          <span className={`${styles.architectureWave} ${styles.architectureWaveOuter}`} />
          <span className={`${styles.architectureWave} ${styles.architectureWaveMiddle}`} />
          <span className={`${styles.architectureWave} ${styles.architectureWaveInner}`} />
          <span className={styles.architectureAxis} />
          <span className={styles.architectureSignal} />
        </div>
        <div className={styles.flowField}>
          {flowLines.map((line) => (
            <span
              key={`flow-line-${line.left}-${line.top}`}
              className={styles.flowLine}
              style={{
                '--line-left': line.left,
                '--line-top': line.top,
                '--line-width': line.width,
                '--line-rotate': line.rotate,
                '--line-opacity': line.opacity,
                '--line-duration': line.duration,
                '--line-delay': line.delay,
              } as React.CSSProperties}
            />
          ))}
          {signalDots.map((dot, index) => (
            <span
              key={`signal-dot-${dot.x}-${dot.y}`}
              className={`${styles.signalDot} ${index > 19 ? styles.mobileOptional : ''}`}
              style={{
                '--dot-x': dot.x,
                '--dot-y': dot.y,
                '--dot-size': `${dot.size + 1.2}px`,
                '--dot-delay': dot.delay,
                '--dot-duration': dot.duration,
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      <div className={styles.container}>
        <div className={`${styles.content} ${isActive ? styles.visible : ''}`}>
          <span className={styles.heroBrandText} data-text="Kramaniti">
            Kramaniti
          </span>
          <h1 className={styles.headline}>
            {heroHeadlineWords.map((word, index) => (
              <span
                key={`${word}-${index}`}
                className={styles.headlineWord}
                style={{ '--word-index': index } as React.CSSProperties}
              >
                {word}
                {index < heroHeadlineWords.length - 1 ? '\u00a0' : ''}
              </span>
            ))}
          </h1>
          <p className={styles.subheading}>
            Kramaniti aligns your operations, intelligence systems, and brand presence into one coherent growth pipeline.
          </p>
          <a href="#contact" className={styles.heroCta}>
            Book a Strategic Audit
          </a>
        </div>
      </div>
    </section>
  );
}

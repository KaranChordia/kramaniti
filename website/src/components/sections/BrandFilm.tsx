'use client';

import React from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';
import styles from './BrandFilm.module.css';

const YOUTUBE_VIDEO_ID = 'M-X2wtTJLHQ';

export function BrandFilm() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.16 });

  return (
    <section className={styles.brandFilm} id="brand-film" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Clarity</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Scale</span>
      </div>

      <div className={styles.container}>
        <div className={`${styles.layout} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.copy}>
            <span className="micro-label">Short film</span>
            <AnimatedHeading isVisible={isVisible}>Why clarity comes first.</AnimatedHeading>
            <p className="text-secondary">
              See why Kramaniti starts with the work, chooses the right system, and communicates only after the direction is clear.
            </p>
            <a className={styles.inlineLink} href="#contact">
              Start with a workflow audit
            </a>
          </div>

          <div className={styles.videoShell}>
            <div className={styles.videoFrame}>
              <iframe
                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
                title="Clarity Before Scale | Introducing Kramaniti"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
              <a
                className={styles.mobileVideoLink}
                href={`https://www.youtube.com/watch?v=${YOUTUBE_VIDEO_ID}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Watch Clarity Before Scale on YouTube"
              >
                <span>Watch the film</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

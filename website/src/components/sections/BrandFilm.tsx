'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';
import { SectionKicker } from '../ui/SectionKicker';
import styles from './BrandFilm.module.css';

const YOUTUBE_VIDEO_ID = 'M-X2wtTJLHQ';

export function BrandFilm() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.16 });

  return (
    <section className={`${styles.brandFilm} home-section`} id="brand-film" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Clarity</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Scale</span>
      </div>

      <div className={`${styles.container} home-container`}>
        <div className={`${styles.layout} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.copy}>
            <SectionKicker>Brand Film</SectionKicker>
            <AnimatedHeading isVisible={isVisible}>Clarity before scale.</AnimatedHeading>
            <p className="home-lede">
              See why Kramaniti starts with the business, chooses the right system, and uses content only after the direction is clear.
            </p>
            <a className="text-cta" href="#contact">
              See how we work
              <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

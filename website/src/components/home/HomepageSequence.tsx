'use client';

import { useCallback, useEffect, useState } from 'react';
import styles from './HomepageSequence.module.css';
import { OpeningFilm } from './OpeningFilm';
import { Navbar } from '../layout/Navbar';
import { Hero } from '../sections/Hero';
import { Problem } from '../sections/Problem';
import { Story } from '../sections/Story';
import { BrandFilm } from '../sections/BrandFilm';
import { Services } from '../sections/Services';
import { Workflows } from '../sections/Workflows';
import { FounderPreview } from '../sections/FounderPreview';
import { Contact } from '../sections/Contact';
import { Footer } from '../layout/Footer';

type IntroPhase = 'film' | 'done';

const OPENING_FILM_MS = 7800;
const ENABLE_OPENING_FILM = false;
const ENABLE_NAV_HERO_SEQUENCE_SYNC = false;

export function HomepageSequence() {
  const [phase, setPhase] = useState<IntroPhase>(ENABLE_OPENING_FILM ? 'film' : 'done');

  const finishIntro = useCallback(() => setPhase('done'), []);

  useEffect(() => {
    if (!ENABLE_OPENING_FILM) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      const reducedMotionTimer = window.setTimeout(finishIntro, 1100);
      return () => window.clearTimeout(reducedMotionTimer);
    }

    const doneTimer = window.setTimeout(finishIntro, OPENING_FILM_MS);

    return () => window.clearTimeout(doneTimer);
  }, [finishIntro]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const body = document.body;

    const previous = {
      rootOverflowY: root.style.overflowY,
      bodyOverflowY: body.style.overflowY,
    };

    if (ENABLE_NAV_HERO_SEQUENCE_SYNC) {
      root.dataset.homeSequence = 'true';
    }

    return () => {
      if (previous.rootOverflowY) root.style.overflowY = previous.rootOverflowY;
      else root.style.removeProperty('overflow-y');

      if (previous.bodyOverflowY) body.style.overflowY = previous.bodyOverflowY;
      else body.style.removeProperty('overflow-y');

      delete root.dataset.homeSequence;
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (phase === 'done') {
      root.style.removeProperty('overflow-y');
      body.style.removeProperty('overflow-y');
    } else {
      root.style.overflowY = 'hidden';
      body.style.overflowY = 'hidden';
    }
  }, [phase]);

  const showContent = phase === 'done';
  const showOverlay = phase !== 'done';

  return (
    <div className={`${styles.shell} ${showOverlay ? styles.introActive : ''}`}>
      <Navbar isVisible={showContent} />

      {showOverlay && <OpeningFilm onSkip={finishIntro} />}

      <div
        className={`${styles.chrome} ${showContent ? styles.chromeVisible : ''}`}
        aria-hidden={!showContent}
      >
        <main className={styles.main}>
          <Hero isActive={showContent} />
          <Problem />
          <Story />
          <BrandFilm />
          <Services />
          <Workflows />
          <FounderPreview />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}

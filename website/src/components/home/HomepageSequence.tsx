'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './HomepageSequence.module.css';
import { Navbar } from '../layout/Navbar';
import { Hero } from '../sections/Hero';
import { Problem } from '../sections/Problem';
import { Story } from '../sections/Story';
import { Services } from '../sections/Services';
import { Workflows } from '../sections/Workflows';
import { FounderPreview } from '../sections/FounderPreview';
import { Contact } from '../sections/Contact';
import { Footer } from '../layout/Footer';

type IntroPhase = 'dark' | 'logo-in' | 'logo-out' | 'done';

const DARK_PHASE_MS = 500;
const LOGO_IN_MS = 1200;
const LOGO_OUT_MS = 900;

export function HomepageSequence() {
  const [phase, setPhase] = useState<IntroPhase>('dark');

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      const reducedMotionTimer = window.setTimeout(() => setPhase('done'), 0);
      return () => window.clearTimeout(reducedMotionTimer);
    }

    const logoInTimer = window.setTimeout(() => setPhase('logo-in'), DARK_PHASE_MS);
    const logoOutTimer = window.setTimeout(() => setPhase('logo-out'), DARK_PHASE_MS + LOGO_IN_MS);
    const doneTimer = window.setTimeout(() => setPhase('done'), DARK_PHASE_MS + LOGO_IN_MS + LOGO_OUT_MS);

    return () => {
      window.clearTimeout(logoInTimer);
      window.clearTimeout(logoOutTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const body = document.body;

    const previous = {
      rootOverflowY: root.style.overflowY,
      bodyOverflowY: body.style.overflowY,
    };

    root.dataset.homeSequence = 'true';

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
    <div className={styles.shell}>
      <Navbar isVisible={showContent} />

      {showOverlay && (
        <div
          className={[
            styles.overlay,
            phase === 'dark' ? styles.overlayDark : '',
            phase === 'logo-in' ? styles.overlayLogoIn : '',
            phase === 'logo-out' ? styles.overlayLogoOut : '',
          ].join(' ')}
          aria-hidden="true"
        >
          <div className={styles.logoStage}>
            <div className={styles.stageLight}></div>
            <div className={styles.logoHalo}></div>
            <Image
              src="/kramaniti/assets/brand/kramaniti-mark-gold.png"
              alt=""
              width={176}
              height={176}
              priority
              className={styles.logoMark}
            />
          </div>
        </div>
      )}

      {showContent && (
        <div className={styles.chrome}>
          <main className={styles.main}>
            <Hero />
            <Problem />
            <Story />
            <Services />
            <Workflows />
            <FounderPreview />
            <Contact />
          </main>
          <Footer />
        </div>
      )}
    </div>
  );
}

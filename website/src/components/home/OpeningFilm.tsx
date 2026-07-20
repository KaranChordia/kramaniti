'use client';

import Image from 'next/image';
import styles from './OpeningFilm.module.css';

type OpeningFilmProps = {
  onSkip: () => void;
};

export function OpeningFilm({ onSkip }: OpeningFilmProps) {
  return (
    <div className={styles.stage} aria-label="Kramaniti introduction">
      <div className={styles.atmosphere} aria-hidden="true">
        <div className={styles.grid} />
        <div className={styles.horizon} />
        <div className={styles.grain} />
        <div className={styles.vignette} />
      </div>

      <div className={styles.field} aria-hidden="true">
        <svg className={styles.fieldSvg} viewBox="0 0 600 600">
          <defs>
            <radialGradient id="opening-field-inner" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#FFF0B4" stopOpacity="0.12" />
              <stop offset="0.52" stopColor="#C9A84C" stopOpacity="0.045" />
              <stop offset="1" stopColor="#C9A84C" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="opening-field-stroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#7A5C2E" stopOpacity="0.08" />
              <stop offset="0.38" stopColor="#C9A84C" stopOpacity="0.66" />
              <stop offset="0.62" stopColor="#FFF0B4" stopOpacity="0.88" />
              <stop offset="1" stopColor="#A07D3A" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          <path
            className={`${styles.layerShape} ${styles.layerInner}`}
            pathLength="1"
            d="M212 205 H388 M412 229 V371 M388 395 H212 M188 371 V229"
          />
          <path
            className={`${styles.layerShape} ${styles.layerMiddle}`}
            pathLength="1"
            d="M164 145 H436 M466 175 V425 M436 455 H164 M134 425 V175"
          />
          <path
            className={`${styles.layerShape} ${styles.layerOuter}`}
            pathLength="1"
            d="M108 84 H492 M530 122 V478 M492 516 H108 M70 478 V122"
          />

          <path
            className={`${styles.layerPulse} ${styles.pulseInner}`}
            pathLength="1"
            d="M212 205 H388 M412 229 V371 M388 395 H212 M188 371 V229"
          />
          <path
            className={`${styles.layerPulse} ${styles.pulseMiddle}`}
            pathLength="1"
            d="M164 145 H436 M466 175 V425 M436 455 H164 M134 425 V175"
          />
          <path
            className={`${styles.layerPulse} ${styles.pulseOuter}`}
            pathLength="1"
            d="M108 84 H492 M530 122 V478 M492 516 H108 M70 478 V122"
          />

          <path className={`${styles.waveEcho} ${styles.echoOne}`} d="M246 228 H354 M372 246 V354 M354 372 H246 M228 354 V246" />
          <path className={`${styles.waveEcho} ${styles.echoTwo}`} d="M246 228 H354 M372 246 V354 M354 372 H246 M228 354 V246" />
          <path className={`${styles.waveEcho} ${styles.echoThree}`} d="M246 228 H354 M372 246 V354 M354 372 H246 M228 354 V246" />
          <rect className={styles.fieldGlow} x="115" y="115" width="370" height="370" fill="url(#opening-field-inner)" />
        </svg>

        <div className={styles.coreSeed}>
          <span className={styles.seedLight} />
          <Image
            src="/assets/brand/kramaniti-mark-gold.png"
            alt=""
            width={126}
            height={126}
            priority
            className={styles.coreMark}
          />
        </div>

        <div className={styles.layerReadout}>
          <div className={`${styles.readout} ${styles.strategyReadout}`}>
            <span>01 / Clarity</span>
            <strong>Strategy</strong>
            <small>before tools</small>
          </div>
          <div className={`${styles.readout} ${styles.systemsReadout}`}>
            <span>02 / Infrastructure</span>
            <strong>Systems</strong>
            <small>before scale</small>
          </div>
          <div className={`${styles.readout} ${styles.contentReadout}`}>
            <span>03 / Presence</span>
            <strong>Content</strong>
            <small>after clarity</small>
          </div>
        </div>

        <div className={styles.resolution}>
          <span>Kramaniti</span>
          <p>One connected growth system.</p>
        </div>
      </div>

      <div className={styles.progress} aria-hidden="true">
        <span />
      </div>

      <button type="button" className={styles.skip} onClick={onSkip}>
        Skip intro
      </button>
    </div>
  );
}

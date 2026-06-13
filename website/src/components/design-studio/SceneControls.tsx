'use client';

import { useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize,
  Minimize,
  Gauge,
  Eye,
  EyeOff,
} from 'lucide-react';
import styles from './SceneControls.module.css';

interface SceneControlsProps {
  isPlaying: boolean;
  speed: number;
  isFullscreen: boolean;
  showWatermark: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onToggleFullscreen: () => void;
  onToggleWatermark: () => void;
}

const SPEED_OPTIONS = [0.5, 1, 2];

export function SceneControls({
  isPlaying,
  speed,
  isFullscreen,
  showWatermark,
  onTogglePlay,
  onReset,
  onSpeedChange,
  onToggleFullscreen,
  onToggleWatermark,
}: SceneControlsProps) {
  const cycleSpeed = useCallback(() => {
    const currentIndex = SPEED_OPTIONS.indexOf(speed);
    const nextIndex = (currentIndex + 1) % SPEED_OPTIONS.length;
    onSpeedChange(SPEED_OPTIONS[nextIndex]);
  }, [speed, onSpeedChange]);

  return (
    <div className={styles.controls}>
      {/* Left group — playback */}
      <div className={styles.group}>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={onTogglePlay}
          title={isPlaying ? 'Pause' : 'Play'}
          aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <button
          className={styles.btn}
          onClick={onReset}
          title="Reset animation"
          aria-label="Reset animation"
        >
          <RotateCcw size={15} />
        </button>

        <div className={styles.divider} />

        <button
          className={`${styles.btn} ${styles.btnSpeed}`}
          onClick={cycleSpeed}
          title={`Speed: ${speed}× (click to cycle)`}
          aria-label={`Animation speed: ${speed}x`}
        >
          <Gauge size={14} />
          <span className={styles.speedLabel}>{speed}×</span>
        </button>
      </div>

      {/* Center — scene info badge */}
      <div className={styles.centerBadge}>
        <span className={styles.badgeLabel}>16:9</span>
        <span className={styles.badgeDot} />
        <span className={styles.badgeLabel}>Scene Builder</span>
      </div>

      {/* Right group — view controls */}
      <div className={styles.group}>
        <button
          className={styles.btn}
          onClick={onToggleWatermark}
          title={showWatermark ? 'Hide watermark' : 'Show watermark'}
          aria-label={showWatermark ? 'Hide watermark' : 'Show watermark'}
        >
          {showWatermark ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>

        <div className={styles.divider} />

        <button
          className={`${styles.btn} ${styles.btnPresentation}`}
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit presentation' : 'Presentation mode (F)'}
          aria-label={isFullscreen ? 'Exit presentation mode' : 'Enter presentation mode'}
        >
          {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
          <span className={styles.presentationLabel}>
            {isFullscreen ? 'Exit' : 'Present'}
          </span>
        </button>
      </div>
    </div>
  );
}

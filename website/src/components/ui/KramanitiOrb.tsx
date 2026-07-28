'use client';

import { CSSProperties } from 'react';
import {
  ThinkingOrb,
  type OrbSize,
  type OrbState,
} from 'thinking-orbs';
import styles from './KramanitiOrb.module.css';

type KramanitiOrbProps = {
  state: OrbState;
  size?: OrbSize;
  speed?: number;
  paused?: boolean;
  className?: string;
  label?: string;
  decorative?: boolean;
};

export function KramanitiOrb({
  state,
  size = 64,
  speed,
  paused,
  className,
  label,
  decorative = true,
}: KramanitiOrbProps) {
  const style = {
    '--kramaniti-orb-size': `${size}px`,
  } as CSSProperties;

  return (
    <span
      className={`${styles.orb} ${className ?? ''}`}
      data-orb-size={size}
      data-orb-state={state}
      style={style}
      aria-hidden={decorative || undefined}
    >
      <ThinkingOrb
        state={state}
        size={size}
        theme="auto"
        speed={speed}
        paused={paused}
        aria-label={decorative ? undefined : label}
        className={styles.canvas}
      />
    </span>
  );
}

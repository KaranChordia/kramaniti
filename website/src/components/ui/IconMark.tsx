import React from 'react';
import styles from './IconMark.module.css';

type IconMarkProps = {
  children: React.ReactNode;
  className?: string;
  label?: string;
};

export function IconMark({ children, className = '', label }: IconMarkProps) {
  return (
    <span
      className={`${styles.mark} ${className}`.trim()}
      aria-hidden={label ? undefined : true}
      aria-label={label}
    >
      {children}
    </span>
  );
}

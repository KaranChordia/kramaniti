import React from 'react';
import styles from './SectionKicker.module.css';

type SectionKickerProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionKicker({ children, className = '' }: SectionKickerProps) {
  return <span className={`${styles.kicker} ${className}`.trim()}>{children}</span>;
}

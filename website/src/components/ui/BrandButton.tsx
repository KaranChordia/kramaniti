import React from 'react';
import styles from './Button.module.css';

type BrandButtonVariant = 'primary' | 'secondary' | 'ghost';

type BrandButtonProps = {
  variant?: BrandButtonVariant;
  href?: string;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

export function BrandButton({
  variant = 'primary',
  href,
  className = '',
  children,
  type = 'button',
  ...props
}: BrandButtonProps) {
  const classes = `${styles.button} ${styles[variant]} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}

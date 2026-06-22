'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from './ThemeToggle.module.css';

type ThemeMode = 'light' | 'dark';

const getSystemTheme = (): ThemeMode =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }

    const currentTheme = document.documentElement.getAttribute('data-theme') as ThemeMode | null;
    return currentTheme ?? getSystemTheme();
  });

  // Track whether the toggle handler already applied the theme to the DOM
  // so the useEffect doesn't redundantly call setAttribute (which triggers
  // a full style recalculation and can flash animated-heading elements).
  const appliedByToggle = useRef(false);

  useEffect(() => {
    if (appliedByToggle.current) {
      appliedByToggle.current = false;
      return;
    }
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const syncWithSystemTheme = () => {
      const systemTheme = mediaQuery.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', systemTheme);
      setTheme(systemTheme);
    };

    mediaQuery.addEventListener('change', syncWithSystemTheme);

    return () => {
      mediaQuery.removeEventListener('change', syncWithSystemTheme);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    const root = document.documentElement;

    // Signal that a theme transition is starting so global CSS can
    // apply smooth transition rules to every element.
    root.setAttribute('data-theme-transitioning', '');

    // Apply the new theme on the next frame so the browser picks up
    // the transitioning attribute first, enabling the CSS transitions
    // before any property values actually change.
    requestAnimationFrame(() => {
      // Apply theme SYNCHRONOUSLY to the DOM right here — this is
      // critical.  React's useEffect is async (runs after paint) so
      // deferring to it causes a second style recalculation one frame
      // later, which re-triggers colour transitions on text elements.
      appliedByToggle.current = true;
      root.setAttribute('data-theme', newTheme);

      // Update React state so the icon re-renders.
      setTheme(newTheme);

      // Remove the transitioning flag after the longest staggered
      // transition completes (950 ms duration + 450 ms text delay + buffer).
      // To prevent the text "double-shift" glitch, we briefly suppress
      // all transitions before removing the attribute so that component-
      // level transition rules don't re-trigger a color animation.
      setTimeout(() => {
        root.style.setProperty('--theme-transition-lock', '1');
        root.setAttribute('data-theme-settling', '');
        root.removeAttribute('data-theme-transitioning');

        // Allow one frame for the browser to apply the settled state
        // with transitions suppressed, then remove the lock.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            root.removeAttribute('data-theme-settling');
            root.style.removeProperty('--theme-transition-lock');
          });
        });
      }, 1800);
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className={styles.toggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      )}
    </button>
  );
}

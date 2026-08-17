'use client';

import { useEffect, useState } from 'react';

type ThemeMode = 'dark' | 'light';

const TRANSITION_MS = 850;
const SETTLE_MS = 1100;

export function useKramanitiTheme() {
  const [theme, setTheme] = useState<ThemeMode>('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  const setThemeMode = () => {
    const root = document.documentElement;

    root.setAttribute('data-theme-transitioning', 'true');
    root.removeAttribute('data-theme-settling');
    root.setAttribute('data-theme', 'dark');
    setTheme('dark');

    window.setTimeout(() => {
      root.removeAttribute('data-theme-transitioning');
      root.setAttribute('data-theme-settling', 'true');

      window.setTimeout(() => {
        root.removeAttribute('data-theme-settling');
      }, 80);
    }, Math.min(TRANSITION_MS, SETTLE_MS));
  };

  const toggleTheme = () => {
    setThemeMode();
  };

  return { theme, toggleTheme };
}

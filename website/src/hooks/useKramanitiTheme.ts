'use client';

import { useEffect, useState } from 'react';

type ThemeMode = 'dark' | 'light';

const TRANSITION_MS = 850;
const SETTLE_MS = 1100;

const getSystemTheme = (): ThemeMode =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export function useKramanitiTheme() {
  const [theme, setTheme] = useState<ThemeMode>('dark');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const systemTheme = getSystemTheme();
      setTheme(systemTheme);
      document.documentElement.setAttribute('data-theme', systemTheme);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const syncWithSystemTheme = () => {
      const systemTheme = mediaQuery.matches ? 'dark' : 'light';
      setTheme(systemTheme);
      document.documentElement.setAttribute('data-theme', systemTheme);
    };

    mediaQuery.addEventListener('change', syncWithSystemTheme);

    return () => {
      mediaQuery.removeEventListener('change', syncWithSystemTheme);
    };
  }, []);

  const setThemeMode = (nextTheme: ThemeMode) => {
    const root = document.documentElement;

    root.setAttribute('data-theme-transitioning', 'true');
    root.removeAttribute('data-theme-settling');
    root.setAttribute('data-theme', nextTheme);
    setTheme(nextTheme);

    window.setTimeout(() => {
      root.removeAttribute('data-theme-transitioning');
      root.setAttribute('data-theme-settling', 'true');

      window.setTimeout(() => {
        root.removeAttribute('data-theme-settling');
      }, 80);
    }, Math.min(TRANSITION_MS, SETTLE_MS));
  };

  const toggleTheme = () => {
    setThemeMode(theme === 'dark' ? 'light' : 'dark');
  };

  return { theme, toggleTheme };
}

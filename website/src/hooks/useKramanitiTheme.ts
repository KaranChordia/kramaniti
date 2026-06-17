'use client';

import { useEffect, useState } from 'react';

type ThemeMode = 'dark' | 'light';

const STORAGE_KEY = 'kramaniti-theme';
const TRANSITION_MS = 850;
const SETTLE_MS = 1100;

export function useKramanitiTheme() {
  const [theme, setTheme] = useState<ThemeMode>('dark');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const storedTheme = window.localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
      setTheme(storedTheme);
      document.documentElement.setAttribute('data-theme', storedTheme);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const setThemeMode = (nextTheme: ThemeMode) => {
    const root = document.documentElement;

    root.setAttribute('data-theme-transitioning', 'true');
    root.removeAttribute('data-theme-settling');
    root.setAttribute('data-theme', nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
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

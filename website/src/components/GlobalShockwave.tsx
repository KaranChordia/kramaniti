'use client';

import { useEffect } from 'react';

export function GlobalShockwave() {
  useEffect(() => {
    if (window.matchMedia('(max-width: 768px)').matches) {
      return;
    }

    const handleClick = (e: MouseEvent) => {
      // Find closest button or a link acting as a button
      const target = e.target as HTMLElement;
      if (target.closest('[data-disable-global-shockwave="true"]')) {
        return;
      }

      const button = target.closest(
        'button:not(.no-shockwave), [role="button"]:not(.no-shockwave), .shockwave-btn:not(.no-shockwave)'
      ) as HTMLElement;

      if (button) {
        // Remove class if it exists to allow re-triggering asynchronously without forced reflow
        button.classList.remove('shockwave-active');

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            button.classList.add('shockwave-active');

            setTimeout(() => {
              button.classList.remove('shockwave-active');
            }, 600);
          });
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}

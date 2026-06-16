'use client';

import { useEffect } from 'react';

export function GlobalShockwave() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Find closest button or a link acting as a button
      const target = e.target as HTMLElement;
      const button = target.closest('button:not(.no-shockwave), [role="button"]:not(.no-shockwave), .shockwave-btn:not(.no-shockwave)') as HTMLElement;
      
      if (button) {
        // Remove class if it exists to allow re-triggering
        button.classList.remove('shockwave-active');
        
        // Force a browser reflow so the removal registers before re-adding
        void button.offsetWidth;
        
        button.classList.add('shockwave-active');
        
        // Remove after animation completes (600ms) to clean up DOM
        setTimeout(() => {
          button.classList.remove('shockwave-active');
        }, 600);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}

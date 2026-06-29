'use client';

import { useState, useEffect } from 'react';

/**
 * Custom React hook to check if a specific CSS media query matches the viewport.
 * Useful for responsive client-side layout adjustments.
 * 
 * Example: const isMobile = useMediaQuery('(max-width: 768px)')
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add event listener (handles older and newer browser APIs)
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}
export default useMediaQuery;

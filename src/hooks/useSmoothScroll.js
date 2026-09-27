/**
 * SmoothScroll — Lenis-like smooth scroll using native CSS + JS.
 * Sets up smooth scrolling behaviour via a lightweight implementation
 * without requiring an additional package.
 * Also exposes a scroll progress value for the progress bar.
 */
import { useEffect } from 'react';

export default function useSmoothScroll() {
  useEffect(() => {
    // Update CSS variable for scroll progress bar
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;

      const bar = document.querySelector('.alc-scroll-progress');
      if (bar) {
        bar.style.transform = `scaleX(${progress})`;
      }
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);
}

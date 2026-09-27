/**
 * useReveal — IntersectionObserver-based scroll reveal hook.
 * Returns a ref to attach to any element.
 * When the element enters the viewport, adds `is-visible` to its class list.
 *
 * Usage:
 *   const ref = useReveal();
 *   <div ref={ref} className="reveal reveal--up">...</div>
 */
import { useEffect, useRef, useCallback } from 'react';

const defaultOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px',
  once: true,         // only trigger once (default)
};

export default function useReveal(options = {}) {
  const opts = { ...defaultOptions, ...options };
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion — immediately show
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          if (opts.once) observer.unobserve(entry.target);
        } else if (!opts.once) {
          entry.target.classList.remove('is-visible');
        }
      },
      {
        threshold: opts.threshold,
        rootMargin: opts.rootMargin,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [opts.threshold, opts.rootMargin, opts.once]);

  return ref;
}

/**
 * useRevealGroup — reveals multiple children staggered.
 * Returns a ref for the parent container.
 * Each direct child with class `reveal` will be triggered staggered.
 */
export function useRevealGroup(options = {}) {
  const opts = { ...defaultOptions, ...options };
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      container.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          if (opts.once) observer.unobserve(entry.target);
        }
      },
      {
        threshold: opts.threshold,
        rootMargin: opts.rootMargin,
      }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [opts.threshold, opts.rootMargin, opts.once]);

  return ref;
}

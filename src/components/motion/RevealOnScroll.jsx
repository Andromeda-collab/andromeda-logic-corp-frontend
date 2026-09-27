/**
 * RevealOnScroll — wraps any content and triggers a CSS reveal
 * when the element enters the viewport.
 *
 * Props:
 *   variant: 'up' | 'fade' | 'left' | 'right' | 'scale' | 'clip' (default 'up')
 *   delay: 0-8 (maps to reveal-delay-N class)
 *   className: additional classes
 *   as: element type (default 'div')
 *   threshold: IntersectionObserver threshold
 */
import React, { useEffect, useRef } from 'react';

export default function RevealOnScroll({
  children,
  variant = 'up',
  delay = 0,
  className = '',
  as: Tag = 'div',
  threshold = 0.12,
  rootMargin = '0px 0px -60px 0px',
  ...props
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const variantClass = variant ? `reveal--${variant}` : 'reveal';
  const delayClass = delay > 0 ? `reveal-delay-${delay}` : '';

  return (
    <Tag
      ref={ref}
      className={[variantClass, delayClass, className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </Tag>
  );
}

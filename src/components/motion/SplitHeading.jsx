/**
 * SplitHeading — splits heading text into lines for cinematic clip-path reveal.
 * Each line slides up from behind a mask.
 *
 * Props:
 *   as: 'h1' | 'h2' | 'h3' etc.
 *   children: string or array of strings / elements
 *   className: additional classes
 */
import React, { useEffect, useRef } from 'react';

export default function SplitHeading({
  children,
  as: Tag = 'h2',
  className = '',
  threshold = 0.1,
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
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  // If children is a string, split by <br> or newline into lines
  const renderContent = () => {
    if (typeof children === 'string') {
      const lines = children.split(/\n|<br\s*\/?>/).filter(Boolean);
      return lines.map((line, i) => (
        <span key={i} className="split-text__line">
          <span className="split-text__inner" style={{ transitionDelay: `${i * 0.1}s` }}>
            {line}
          </span>
        </span>
      ));
    }

    // React children — wrap in single line
    return (
      <span className="split-text__line">
        <span className="split-text__inner">{children}</span>
      </span>
    );
  };

  return (
    <Tag
      ref={ref}
      className={['split-text', className].filter(Boolean).join(' ')}
      {...props}
    >
      {renderContent()}
    </Tag>
  );
}

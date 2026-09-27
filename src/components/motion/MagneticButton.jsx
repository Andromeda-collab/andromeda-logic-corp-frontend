/**
 * MagneticButton — applies a subtle magnetic pull to any button/link on hover.
 * On mobile/touch, disabled automatically.
 *
 * Props:
 *   children: button content
 *   className: class names
 *   strength: magnetic pull strength (default 0.4)
 *   as: element type or component (default 'button')
 *   All other props passed through (onClick, href, to, etc.)
 */
import React, { useRef, useCallback } from 'react';

export default function MagneticButton({
  children,
  className = '',
  strength = 0.4,
  as: Tag = 'button',
  ...props
}) {
  const ref = useRef(null);
  const frameRef = useRef(null);
  const currentX = useRef(0);
  const currentY = useRef(0);

  // Detect touch device once
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  const onMouseMove = useCallback((e) => {
    if (isTouch) return;
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;

    // Lerp toward target
    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    const animate = () => {
      currentX.current += (dx - currentX.current) * 0.15;
      currentY.current += (dy - currentY.current) * 0.15;
      el.style.transform = `translate(${currentX.current.toFixed(2)}px, ${currentY.current.toFixed(2)}px)`;

      if (Math.abs(dx - currentX.current) > 0.1 || Math.abs(dy - currentY.current) > 0.1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
  }, [isTouch, strength]);

  const onMouseLeave = useCallback(() => {
    if (isTouch) return;
    const el = ref.current;
    if (!el) return;

    const animateBack = () => {
      currentX.current += (0 - currentX.current) * 0.12;
      currentY.current += (0 - currentY.current) * 0.12;
      el.style.transform = `translate(${currentX.current.toFixed(2)}px, ${currentY.current.toFixed(2)}px)`;

      if (Math.abs(currentX.current) > 0.05 || Math.abs(currentY.current) > 0.05) {
        frameRef.current = requestAnimationFrame(animateBack);
      } else {
        el.style.transform = '';
      }
    };

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(animateBack);
  }, [isTouch]);

  return (
    <Tag
      ref={ref}
      className={['alc-magnetic', className].filter(Boolean).join(' ')}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      {children}
    </Tag>
  );
}

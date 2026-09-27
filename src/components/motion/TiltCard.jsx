/**
 * TiltCard — 3D perspective tilt on hover.
 * Disabled automatically on touch devices.
 */
import React, { useRef, useCallback } from 'react';

export default function TiltCard({
  children,
  className = '',
  maxTilt = 8,
  scale = 1.02,
  as: Tag = 'div',
  ...props
}) {
  const ref = useRef(null);
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  const onMouseMove = useCallback((e) => {
    if (isTouch) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rotateX = (-y * maxTilt).toFixed(2);
    const rotateY = (x * maxTilt).toFixed(2);
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
  }, [isTouch, maxTilt, scale]);

  const onMouseLeave = useCallback(() => {
    if (isTouch) return;
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
  }, [isTouch]);

  return (
    <Tag
      ref={ref}
      className={['alc-tilt alc-card-shine', className].filter(Boolean).join(' ')}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' }}
      {...props}
    >
      {children}
    </Tag>
  );
}

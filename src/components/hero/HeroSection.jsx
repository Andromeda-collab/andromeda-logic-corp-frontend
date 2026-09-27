import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import InteractiveA from './InteractiveA';

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);
    const handler = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const motionHandler = (e) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionHandler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
      motionQuery.removeEventListener('change', motionHandler);
    };
  }, []);

  return (
    <section className="alc-hero-section">
      <div className="alc-hero-bg">
        {/* Render 3D Canvas unless reduced motion is preferred */}
        {!prefersReducedMotion ? (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <Suspense fallback={<div className="alc-image-placeholder"><span>Loading Telemetry...</span></div>}>
                <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                  <ambientLight intensity={0.5} />
                  <InteractiveA isMobile={isMobile} />
                </Canvas>
              </Suspense>
            </div>
        ) : (
            <div className="alc-image-placeholder">
              <span>[Static Andromeda A Fallback]</span>
            </div>
        )}
        <div className="alc-hero-overlay"></div>
      </div>
      
      <div className="alc-container alc-hero-content">
        <div className="alc-telemetry-box">
          <h1 className="alc-hero-title">
            Intelligent Systems for the<br/>
            <span className="alc-text-gradient">Deep Space Era.</span>
          </h1>
          <p className="alc-hero-subtitle">
            Autonomous intelligence, radiation-resilient computing, and advanced simulation for systems that must think, adapt, and operate beyond Earth.
          </p>
          <div className="alc-hero-actions">
            <button className="alc-button alc-button--primary">Request Mission Consultation</button>
            <button className="alc-button alc-button--secondary">Explore Technology</button>
          </div>
        </div>
      </div>
    </section>
  );
}

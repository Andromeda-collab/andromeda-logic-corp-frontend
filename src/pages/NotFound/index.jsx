import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import './NotFound.css';

export default function NotFound() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.coming-soon-title', 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );
      gsap.fromTo('.coming-soon-text', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, delay: 0.2, ease: 'power3.out' }
      );
      gsap.fromTo('.coming-soon-button', 
        { scale: 0.9, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.8, delay: 0.4, ease: 'back.out(1.7)' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="alc-coming-soon" ref={containerRef}>
      <div className="alc-container alc-coming-soon__inner">
        <h1 className="coming-soon-title">Coming Soon</h1>
        <p className="coming-soon-text">
          We are currently deploying updates to this sector. 
          Mission control expects full systems online shortly.
        </p>
        <Link to="/" className="alc-button alc-button--primary coming-soon-button">
          Return to Base
        </Link>
      </div>
    </section>
  );
}

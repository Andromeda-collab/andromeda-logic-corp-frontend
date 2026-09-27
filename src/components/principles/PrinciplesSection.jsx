import React, { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PrinciplePanel from './PrinciplePanel';
import PrincipleVisual from './PrincipleVisual';
import PrincipleProgress from './PrincipleProgress';

gsap.registerPlugin(ScrollTrigger);

const principlesData = [
  {
    id: '01',
    title: 'Autonomous Navigation & Deep-Space AI',
    description: 'Decision-making algorithms enabling real-time hazard avoidance, course correction, and mission adaptation without waiting on Earth-based instructions.',
    visual: 'orbit',
  },
  {
    id: '02',
    title: 'Extreme-Environment Edge Computing',
    description: 'Processing logic optimized for high radiation, thermal extremes, and strict power budgets — enabling ML inference on radiation-hardened hardware.',
    visual: 'radiation',
  },
  {
    id: '03',
    title: 'High-Volume Cosmic Data & Signal Processing',
    description: 'Intelligent pipelines that compress, filter, and analyze scientific data in orbit, transmitting only high-value insight to Earth.',
    visual: 'data',
  },
  {
    id: '04',
    title: 'Research Technology & Simulation Frameworks',
    description: 'HITL simulation environments for aerospace engineers, academic institutions, and defense research programs.',
    visual: 'simulation',
  },
];

export default function PrinciplesSection() {
  const containerRef = useRef();
  const panelsRef = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const panels = panelsRef.current;
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${panels.length * 100}%`,
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            let index = Math.floor(progress * panels.length);
            if (index >= panels.length) index = panels.length - 1;
            
            setActiveIndex(prevIndex => {
               if (prevIndex !== index) return index;
               return prevIndex;
            });
          },
        }
      });

      panels.forEach((panel, i) => {
        // Initial state for all panels except first
        if (i > 0) {
          gsap.set(panel, { y: window.innerHeight, scale: 0.92, opacity: 0 });
          
          tl.to(panel, {
            y: 0,
            scale: 1,
            opacity: 1,
            ease: 'none',
            duration: 1
          }, i); // Position in timeline is 'i'
        }

        // Animate previous panel out
        const prevPanel = panels[i - 1];
        if (prevPanel) {
          tl.to(prevPanel, {
            scale: 1.04,
            opacity: 0.15,
            y: -60,
            ease: 'none',
            duration: 1
          }, i); // Same time as next panel enters
        }
      });
      
    }, containerRef);
    
    return () => ctx.revert();
  }, []); // Run only once to avoid re-creating ScrollTrigger on state change // Re-run effect if activeIndex matters for re-creation, usually empty is fine for simple scrolltriggers

  return (
    <section ref={containerRef} className="alc-section alc-section--indigo alc-principles-scroll">
      <div className="alc-principles-sticky">
        <div className="alc-container alc-principles-layout">
          {/* Left Side: Storytelling Text & Panels */}
          <div className="alc-principles-text-side">
            <div className="alc-principles-heading">
              <span className="alc-telemetry-label">OUR CORE PRINCIPLES</span>
              <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Engineering Intelligence<br/>for Environments That Don't Forgive Error.</h2>
            </div>
            
            <div className="alc-principles-stage">
              {principlesData.map((principle, i) => (
                <div 
                    key={principle.id} 
                    ref={(el) => (panelsRef.current[i] = el)} 
                    className="alc-principle-panel-wrapper"
                    style={{ zIndex: principlesData.length - i }}
                >
                  <PrinciplePanel data={principle} isActive={activeIndex === i} />
                </div>
              ))}
            </div>
            
            <PrincipleProgress total={principlesData.length} current={activeIndex} />
          </div>

          {/* Right Side: Central Visual Storytelling */}
          <div className="alc-principles-visual-side">
             <PrincipleVisual activeIndex={activeIndex} />
          </div>
        </div>
      </div>
    </section>
  );
}

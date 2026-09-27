import React from 'react';

export default function PrincipleVisual({ activeIndex }) {
  // We'll create abstract CSS-based visualizations that morph based on the active index
  return (
    <div className="alc-principle-visual-container">
      <div className={`alc-visual-state alc-visual-state--${activeIndex}`}>
        
        {/* Abstract Spacecraft/Core */}
        <div className="alc-visual-core"></div>
        
        {/* State 0: Orbit Lines */}
        <div className="alc-visual-layer alc-visual-orbit">
          <div className="alc-orbit-ring alc-orbit-ring-1"></div>
          <div className="alc-orbit-ring alc-orbit-ring-2"></div>
          <div className="alc-orbit-node"></div>
        </div>

        {/* State 1: Radiation Field */}
        <div className="alc-visual-layer alc-visual-radiation">
           <div className="alc-radiation-wave"></div>
           <div className="alc-radiation-shield"></div>
        </div>

        {/* State 2: Data Filtering */}
        <div className="alc-visual-layer alc-visual-data">
           <div className="alc-data-stream-in">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="alc-data-particle" style={{ animationDelay: `${Math.random() * 2}s` }}></div>
              ))}
           </div>
           <div className="alc-data-filter"></div>
           <div className="alc-data-stream-out">
              <div className="alc-data-signal"></div>
              <div className="alc-data-signal"></div>
           </div>
        </div>

        {/* State 3: Digital Twin */}
        <div className="alc-visual-layer alc-visual-twin">
          <div className="alc-twin-grid"></div>
          <div className="alc-twin-model"></div>
        </div>
        
      </div>
    </div>
  );
}

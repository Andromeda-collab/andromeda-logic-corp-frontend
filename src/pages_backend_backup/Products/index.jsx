import './Products.css';
import React from 'react';
import { Link } from 'react-router-dom';

const platforms = [
  {
    id: 'edge-payload',
    name: 'EDGE Payload',
    pitch: 'Onboard processing of camera, optical, and telemetry data; noise filtering and downlink prioritization.',
    status: 'Flight-Proven',
    statusClass: 'alc-status-badge--flight-proven'
  },
  {
    id: 'gnc-autonomy-stack',
    name: 'GNC Autonomy Stack',
    pitch: 'Real-time hazard detection, autonomous landing, and orbital station-keeping without ground telemetry.',
    status: 'Flight-Proven',
    statusClass: 'alc-status-badge--flight-proven'
  },
  {
    id: 'swarm-orchestrator',
    name: 'Swarm Orchestrator',
    pitch: 'Multi-agent decision engines for satellite constellations, lunar habitats, power grids, and rover swarms.',
    status: 'In Development',
    statusClass: 'alc-status-badge--in-development'
  },
  {
    id: 'hitl-digital-twin-suite',
    name: 'HITL Digital Twin Suite',
    pitch: 'High-fidelity orbital and deep-space simulation for pre-deployment validation.',
    status: 'Flight-Proven',
    statusClass: 'alc-status-badge--flight-proven'
  },
  {
    id: 'radiation-tolerant-inference-engine',
    name: 'Radiation-Tolerant Inference Engine',
    pitch: 'Neural networks and inference engines optimized for low-power, radiation-hardened hardware.',
    status: 'Roadmap',
    statusClass: 'alc-status-badge--roadmap'
  }
];

export default function Products() {
  return (
    <div className="alc-products-hub">
      <div className="alc-products-container">
        
        {/* Dynamic Background */}
        <div className="alc-products-bg">
          <div className="alc-products-grid-lines" />
          <div className="alc-products-glow" />
        </div>

        {/* Hero */}
        <div className="alc-products-hero">
          <span className="alc-products-eyebrow">LICENSABLE CORE PLATFORMS</span>
          <h1>Products &<br />Platforms</h1>
          <p>Our packaged, flight-proven platforms powering the next generation of deep space exploration and autonomous systems.</p>
        </div>

        {/* Content Grid */}
        <div className="alc-products-layout">
          <div className="alc-products-grid">
            {platforms.map((platform, index) => (
              <Link to={`/products/${platform.id}`} key={platform.id} className="alc-products-card">
                <div className="alc-products-card-header">
                  <span className="alc-products-id">PLATFORM_NODE // 0{index + 1}</span>
                  <span className={`alc-products-badge ${platform.statusClass}`}>{platform.status}</span>
                </div>
                
                <h2>{platform.name}</h2>
                <p className="alc-products-pitch">{platform.pitch}</p>
                
                <div className="alc-products-card-footer">
                  <span className="alc-products-btn">Explore Platform Specs →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

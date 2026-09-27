import './Research.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getResearchContent,
  submitResearchAccessRequest,
} from '../../services/researchService.js';
import useApiResource from '../../hooks/useApiResource.js';
import ApiState from '../../components/common/ApiState.jsx';
import researchHeroBg from '../../assets/images/simulationpage_bg.jpg';

const EMPTY_ACCESS_FORM = {
  name: '',
  institution: '',
  email: '',
  research_area: '',
  message: '',
};

const whitepapers = [
  { title: 'Sparse Neural Execution at the Radiation Boundary', type: 'Whitepaper', specialty: 'Radiation-Tolerant AI', audience: 'Research', gated: false, date: 'July 2026' },
  { title: 'Autonomous GNC in Communication-Denied Deep-Space Environments', type: 'Technical Brief', specialty: 'GNC', audience: 'Agencies', gated: false, date: 'May 2026' },
  { title: 'HITL Simulation Methodology for Lunar Descent Validation', type: 'Whitepaper', specialty: 'HITL Simulation', audience: 'Research', gated: true, date: 'March 2026' },
  { title: 'Multi-Agent Station-Keeping: Distributed Consensus in LEO Constellations', type: 'Whitepaper', specialty: 'Swarm Infrastructure', audience: 'Research', gated: false, date: 'January 2026' },
];

const partnershipFeatures = [
  { icon: '⬡', title: 'HITL Simulation Access', desc: 'Use the HITL Digital Twin Suite for mission validation, algorithm testing, and peer-reviewed research in a high-fidelity orbital simulation environment.' },
  { icon: '◈', title: 'Joint Publication Program', desc: 'Co-author technical papers with Andromeda Logic Corp engineering team. We support research partnerships through publication co-authorship across IEEE, AIAA, and domain journals.' },
  { icon: '◇', title: 'Algorithm Co-Development', desc: 'Collaborate directly with our GNC, swarm, and ML research teams on algorithm development programs that bridge academia and flight-readiness.' },
  { icon: '⬟', title: 'Research Data Access', desc: 'Access telemetry and simulation datasets from validated mission programs — subject to our data governance and export-control framework.' },
];

export default function Research() {
  // Optional CMS-managed overview / partnership copy (404 until seeded).
  const { data: content } = useApiResource(() => getResearchContent(), []);

  return (
    <div className="alc-research">

      {/* Hero */}
      <section className="alc-research__hero">
        <img 
          src={researchHeroBg} 
          alt="Simulation Background" 
          className="alc-research__hero-bg" 
        />
        <div className="alc-container">
          <div className="alc-research__hero-label">RESEARCH & INNOVATION</div>
          <h1 className="alc-research__hero-title">
            Simulation Frameworks &amp;<br />
            <span className="alc-research__hero-accent">Research Partnerships</span>
          </h1>
          <p className="alc-research__hero-desc">
            {content?.overview ||
              "Andromeda Logic Corp's research division drives Pillar IV — Research Technology & Simulation Frameworks. We operate one of India's most capable HITL simulation environments for deep-space mission validation, and maintain active research partnerships with academic institutions and national laboratories."}
          </p>
          <div className="alc-research__hero-actions">
            <Link to="/contact" className="alc-btn-primary">Request Research Access</Link>
            <Link to="/library" className="alc-btn-ghost">Browse Technical Library</Link>
          </div>
        </div>
      </section>

      {/* HITL Overview */}
      <section className="alc-research__hitl">
        <div className="alc-container">
          <div className="alc-research__hitl-inner">
            <div>
              <span className="alc-research__section-label">SIMULATION ENVIRONMENTS</span>
              <h2>Hardware-in-the-Loop Digital Twins</h2>
              <p>
                Before a line of autonomy code flies, it runs through the HITL Digital
                Twin Suite. We provide research partners access to the exact simulation
                infrastructure used to validate our flight-ready GNC systems.
              </p>
              <ul className="alc-research__feature-list">
                <li>Strap-down flight computer integration with simulated optical/star-tracker inputs.</li>
                <li>Deterministic mission replay and synthetic fault injection.</li>
                <li>Real-time orbital mechanics engine running on multi-node HPC clusters.</li>
              </ul>
              <div className="alc-research__status-badge">
                <span className="alc-research__badge alc-research__badge--flight">Status: Operational</span>
              </div>
            </div>
            <div>
              <div className="alc-research__sim-card">
                <span className="alc-research__sim-label">SIMULATION NODES ACTIVE</span>
                <div className="alc-research__sim-item">
                  <div className="alc-research__sim-dot" /> Lunar Descent & Landing (L-7)
                </div>
                <div className="alc-research__sim-item">
                  <div className="alc-research__sim-dot" /> Multi-Agent Swarm Orchestrator
                </div>
                <div className="alc-research__sim-item">
                  <div className="alc-research__sim-dot" /> Radiation Fault-Tolerance Engine
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Program */}
      <section className="alc-research__partnership">
        <div className="alc-container">
          <span className="alc-research__section-label">PARTNERSHIP MODELS</span>
          <h2>Academic &amp; Agency Engagement</h2>
          <p className="alc-research__section-desc">
            {content?.partnership_program ||
              "We partner with space agencies, national laboratories, and academic institutions to push the boundaries of deep-space autonomy. Our engagement models are structured to support both foundational research and mission-specific technology maturation."}
          </p>
          <div className="alc-research__features-grid">
            {partnershipFeatures.map((f, i) => (
              <div className="alc-research__feature-card" key={i}>
                <div className="alc-research__feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Whitepapers Feed */}
      <section className="alc-research__papers">
        <div className="alc-container">
          <div className="alc-research__section-label">PUBLISHED RESEARCH</div>
          <h2>Technical Whitepapers & Briefings</h2>
          <div className="alc-research__papers-grid">
            {whitepapers.map((p, i) => (
              <div className="alc-research__paper-card" key={i}>
                <div className="alc-research__paper-meta">
                  <span className="alc-research__paper-type">{p.type}</span>
                  <span className="alc-research__paper-date">{p.date}</span>
                </div>
                <h3 className="alc-research__paper-title">{p.title}</h3>
                <div className="alc-research__paper-tags">
                  <span>{p.specialty}</span>
                  <span>{p.audience}</span>
                </div>
                {p.gated ? (
                  <div className="alc-research__paper-gated">
                    <span>⬡</span> Requires organization verification
                  </div>
                ) : (
                  <button className="alc-research__paper-download">Download →</button>
                )}
              </div>
            ))}
          </div>
          <div className="alc-research__papers-more">
            <Link to="/library" className="alc-btn-ghost">View Full Technical Library →</Link>
          </div>
        </div>
      </section>

    </div>
  );
}

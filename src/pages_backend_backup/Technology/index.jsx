import './Technology.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const specialties = [
  {
    id: 'gnc',
    title: 'Autonomous Spacecraft Guidance & Navigation (GNC)',
    narrative: 'Real-time hazard detection, autonomous landing, orbital station-keeping, and trajectory adjustment without ground telemetry.',
    capabilities: [
      'Real-time hazard avoidance',
      'Autonomous landing',
      'Orbital station-keeping',
      'Trajectory adjustment'
    ],
    products: ['GNC Autonomy Stack', 'EDGE Payload'],
    mission: 'Mission Prarambh'
  },
  {
    id: 'ai',
    title: 'Radiation-Tolerant AI & Machine Learning',
    narrative: 'Neural networks and inference engines optimized for low-power, radiation-hardened hardware.',
    capabilities: [
      'Radiation resilience',
      'Low-power inference',
      'Fault tolerance'
    ],
    products: ['Radiation-Tolerant Inference Engine'],
    mission: 'Deep Space Probes'
  },
  {
    id: 'edge',
    title: 'In-Orbit Edge Computing & Data Reduction',
    narrative: 'Onboard processing of camera, optical, and telemetry data; noise filtering and downlink prioritization.',
    capabilities: [
      'Onboard processing',
      'Noise filtering',
      'Downlink prioritization'
    ],
    products: ['EDGE Payload'],
    mission: 'Lunar Survey'
  },
  {
    id: 'swarm',
    title: 'Autonomous Outpost & Swarm Infrastructure',
    narrative: 'Multi-agent decision engines for satellite constellations, lunar habitats, power grids, and rover swarms.',
    capabilities: [
      'Multi-agent decision engines',
      'Swarm orchestration',
      'Habitat management'
    ],
    products: ['Swarm Orchestrator'],
    mission: 'Constellation Alpha'
  },
  {
    id: 'hitl',
    title: 'Hardware-in-the-Loop (HITL) Simulation & Digital Twins',
    narrative: 'High-fidelity orbital and deep-space simulation for pre-deployment validation.',
    capabilities: [
      'High-fidelity simulation',
      'Pre-deployment validation',
      'Digital twins'
    ],
    products: ['HITL Digital Twin Suite'],
    mission: 'Pre-flight Validation'
  }
];

const faqs = [
  {
    question: 'What security clearances do your systems support?',
    answer: 'Our systems are designed for defense-adjacent programs requiring resilient, autonomous systems for contested or communication-denied environments. Quantum-resistant cryptography secures all telemetry.'
  },
  {
    question: 'Are your technologies subject to export control?',
    answer: 'Yes, certain technical assets and platforms are subject to ITAR/EAR regulations and require organization/identity verification prior to access.'
  },
  {
    question: 'How do we integrate your platforms into our existing stack?',
    answer: 'We provide comprehensive integration documentation and support through our Mission Consultation and Joint Mission Development programs. Our APIs are designed for zero-trust environments.'
  }
];

export default function Technology() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeSection, setActiveSection] = useState('gnc');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const spec of specialties) {
        const element = document.getElementById(spec.id);
        if (element && element.offsetTop <= scrollPosition && element.offsetTop + element.offsetHeight > scrollPosition) {
          setActiveSection(spec.id);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="alc-tech-hub">
      <div className="alc-tech-container">
        
        {/* Hero */}
        <div className="alc-tech-hero">
          <span className="alc-tech-hero-eyebrow">Technology Hub</span>
          <h1>Quantum-Driven<br />Space Architecture</h1>
          <p>The authoritative destination for our Core Specialties. Next-generation systems engineered for autonomous survival and peak computation beyond Earth.</p>
        </div>

        {/* Layout */}
        <div className="alc-tech-layout">
          
          {/* Sidebar Nav */}
          <aside className="alc-tech-sidebar">
            <ul className="alc-tech-nav">
              {specialties.map((spec, index) => (
                <li key={spec.id}>
                  <a 
                    href={`#${spec.id}`} 
                    className={activeSection === spec.id ? 'active' : ''}
                    onClick={(e) => scrollToSection(e, spec.id)}
                  >
                    <span className="alc-tech-nav-index">0{index + 1}</span>
                    {spec.title.split(' (')[0].split(' &')[0]}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* Content */}
          <div className="alc-tech-content">
            {specialties.map((spec, index) => (
              <section key={spec.id} id={spec.id} className="alc-tech-card">
                <div className="alc-tech-card-header">
                  <span className="alc-tech-id">TECH_NODE // 0{index + 1}</span>
                  <h2>{spec.title}</h2>
                </div>
                
                <p className="alc-tech-narrative">{spec.narrative}</p>
                
                <div className="alc-tech-caps">
                  {spec.capabilities.map((cap, i) => (
                    <div key={i} className="alc-tech-cap-item">
                      {cap}
                    </div>
                  ))}
                </div>

                <div className="alc-tech-actions">
                  <Link to={`/technology/${spec.id}`} className="alc-tech-btn alc-tech-btn--primary">
                    Explore Details
                  </Link>
                  <Link to={`/library/${spec.id}-whitepaper`} className="alc-tech-btn alc-tech-btn--ghost">
                    Whitepaper
                  </Link>
                  <Link to={`/missions/${spec.mission.toLowerCase().replace(' ', '-')}`} className="alc-tech-btn alc-tech-btn--ghost">
                    {spec.mission}
                  </Link>
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <section className="alc-tech-faq">
          <h2>Procurement & Evaluator FAQ</h2>
          <div className="alc-faq-list">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`alc-faq-item ${activeFaq === index ? 'active' : ''}`}
              >
                <div 
                  className="alc-faq-question"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  {faq.question}
                </div>
                <div className="alc-faq-answer">
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Conversion */}
        <div className="alc-tech-conversion">
          <h2>Ready to Deploy?</h2>
          <Link to="/contact" className="alc-tech-btn alc-tech-btn--primary" style={{ padding: '16px 32px', fontSize: '16px' }}>
            Request Mission Consultation
          </Link>
        </div>

      </div>
    </div>
  );
}

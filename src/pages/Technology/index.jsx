import './Technology.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSpecialties } from '../../services/technologyService.js';
import techHeroBg from '../../assets/images/technology_page_bg.png';

function parseJsonList(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

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
  const [specialties, setSpecialties] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    getSpecialties()
      .then((res) => {
        const list = res.data.map((s) => ({
          id: s.slug,
          title: s.name,
          narrative: s.short_description,
          capabilities: parseJsonList(s.capabilities),
          products: parseJsonList(s.related_products),
          mission: s.mission_tag || '',
        }));
        setSpecialties(list);
        setActiveSection(list.length ? list[0].id : null);
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setActiveSection(id);
    if (window.innerWidth <= 1024) {
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 50);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="alc-tech-hub">

      {/* Hero */}
      <div className="alc-tech-hero">
        <img 
          src={techHeroBg} 
          alt="Technology Background" 
          className="alc-tech-hero-bg" 
        />
        <div className="alc-tech-hero-content alc-tech-container">
          <span className="alc-tech-hero-eyebrow">Technology Hub</span>
          <h1>Quantum-Driven<br />Space Architecture</h1>
          <p>The authoritative destination for our Core Specialties. Next-generation systems engineered for autonomous survival and peak computation beyond Earth.</p>

          <div className="alc-tech-scroll-hint">
            <span>Scroll to explore</span>
            <div className="alc-tech-scroll-arrow" />
          </div>
        </div>
      </div>

      <div className="alc-tech-container">

        {status === 'loading' && <p style={{ padding: '40px 0' }}>Loading specialties…</p>}
        {status === 'error' && (
          <p className="alc-form__error" style={{ padding: '40px 0' }}>
            Couldn't load specialties. Is the backend running?
          </p>
        )}
        {status === 'success' && specialties.length === 0 && (
          <p style={{ padding: '40px 0' }}>No specialties added yet.</p>
        )}

        {status === 'success' && specialties.length > 0 && (
          <>
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
                  <section key={spec.id} id={spec.id} className="alc-tech-card" style={{ display: activeSection === spec.id ? 'block' : 'none' }}>
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
                      <Link to="/library" className="alc-tech-btn alc-tech-btn--ghost">
                        Whitepaper
                      </Link>
                      {spec.mission && (
                        <Link to="/missions" className="alc-tech-btn alc-tech-btn--ghost">
                          {spec.mission}
                        </Link>
                      )}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </>
        )}

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

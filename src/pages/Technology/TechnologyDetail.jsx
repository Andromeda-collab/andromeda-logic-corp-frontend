import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import './TechnologyDetail.css';
import bgImage from '../../assets/images/black_substitute.jpg';
import { getSpecialtyBySlug } from '../../services/technologyService.js';

const STATUS_LABELS = {
  'flight-proven': 'Flight-Proven',
  'in-development': 'In Development',
  'roadmap': 'Roadmap',
};

function parseJsonList(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function TechnologyDetail() {
  const { specialtySlug } = useParams();
  const [tech, setTech] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | success | error
  const pageRef = useRef(null);

  useEffect(() => {
    setStatus('loading');
    getSpecialtyBySlug(specialtySlug)
      .then((res) => {
        const s = res.data;
        setTech({
          name: s.name,
          badge: STATUS_LABELS[s.status] || '',
          desc: s.short_description,
          capabilities: parseJsonList(s.capabilities),
          products: parseJsonList(s.related_products),
          mission: s.mission_tag || '',
        });
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }, [specialtySlug]);

  useEffect(() => {
    if (status !== 'success') return;
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo('.alc-td-hero__title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
      gsap.fromTo('.alc-td-hero__desc', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power3.out' });
      gsap.fromTo('.alc-td-feature', { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.4, ease: 'power2.out' });
    }, pageRef);
    return () => ctx.revert();
  }, [specialtySlug, status]);

  if (status === 'loading') {
    return (
      <section className="alc-container" style={{ paddingTop: '150px', paddingBottom: '150px' }}>
        <p>Loading…</p>
      </section>
    );
  }

  if (status === 'error' || !tech) {
    return (
      <section className="alc-container" style={{ paddingTop: '150px', paddingBottom: '150px' }}>
        <h1>Technology Not Found</h1>
        <p>Details coming soon.</p>
        <Link to="/technology" className="alc-button alc-button--primary" style={{ marginTop: '20px', display: 'inline-block' }}>Return to Technology</Link>
      </section>
    );
  }

  return (
    <div
      className="alc-technology-detail"
      ref={pageRef}
      style={{
        background: `linear-gradient(rgba(5, 7, 13, 0.75), rgba(5, 7, 13, 0.75)), url(${bgImage}) no-repeat center center fixed`,
        backgroundSize: 'cover'
      }}
    >
      {/* Hero Section */}
      <section className="alc-td-hero">
        <div className="alc-container">
          <Link to="/technology" className="alc-td-back">&larr; Back to Technology</Link>
          {tech.badge && <div className="alc-td-badge">{tech.badge}</div>}
          <h1 className="alc-td-hero__title">{tech.name}</h1>
          <p className="alc-td-hero__desc">{tech.desc}</p>
        </div>
      </section>

      <div className="alc-td-middle-content">
      {/* Capabilities Section */}
      <section className="alc-td-capabilities">
        <div className="alc-container">
          <div className="alc-td-section-title">Core Capabilities</div>
          <div className="alc-td-grid">
            {tech.capabilities.map((feature, i) => (
              <div key={i} className="alc-td-feature">
                <h3>{feature}</h3>
                <p>Advanced algorithmic approach optimizing performance for {feature.toLowerCase()} in hostile deep-space environments.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Section */}
      <section className="alc-td-related">
        <div className="alc-container">
          <div className="alc-td-section-title">Ecosystem Integration</div>
          <div className="alc-td-related-grid">
            <div className="alc-td-related-box">
              <h3>Related Platforms</h3>
              <ul>
                {tech.products.map((prod, i) => (
                  <li key={i}>{prod}</li>
                ))}
              </ul>
            </div>
            {tech.mission && (
              <div className="alc-td-related-box">
                <h3>Mission Heritage</h3>
                <p>Demonstrated in <strong>{tech.mission}</strong></p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>

      {/* CTA Section */}
      <section className="alc-td-cta">
        <div className="alc-container">
          <h2>Request Architecture Review</h2>
          <p>Consult with our engineering team on integrating {tech.name} into your mission framework.</p>
          <div className="alc-td-cta-buttons">
            <Link to="/contact" className="alc-button alc-button--primary">Request Consultation</Link>
            <Link to="/library" className="alc-button alc-button--outline" style={{ marginLeft: '16px' }}>View Technical Library</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

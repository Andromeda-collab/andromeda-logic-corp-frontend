import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import './ProductDetail.css';
import bgImage from '../../assets/images/black_substitute.jpg';
import { getPlatformBySlug } from '../../services/productsService.js';

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

export default function ProductDetail() {
  const { platformSlug } = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | success | error
  const pageRef = useRef(null);

  useEffect(() => {
    setStatus('loading');
    getPlatformBySlug(platformSlug)
      .then((res) => {
        const p = res.data;
        setProduct({
          name: p.name,
          badge: STATUS_LABELS[p.status] || '',
          desc: p.one_line_pitch,
          features: parseJsonList(p.capability_blocks),
          specs: p.spec_summary || '',
        });
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }, [platformSlug]);

  useEffect(() => {
    if (status !== 'success') return;
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo('.alc-pd-hero__title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
      gsap.fromTo('.alc-pd-hero__desc', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power3.out' });
      gsap.fromTo('.alc-pd-feature', { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.4, ease: 'power2.out' });
    }, pageRef);
    return () => ctx.revert();
  }, [platformSlug, status]);

  if (status === 'loading') {
    return (
      <section className="alc-container" style={{ paddingTop: '150px' }}>
        <p>Loading…</p>
      </section>
    );
  }

  if (status === 'error' || !product) {
    return (
      <section className="alc-container" style={{ paddingTop: '150px' }}>
        <h1>Product Not Found</h1>
        <Link to="/products">Return to Products</Link>
      </section>
    );
  }

  return (
    <div className="alc-product-detail" ref={pageRef} style={{ background: `linear-gradient(rgba(5, 7, 13, 0.75), rgba(5, 7, 13, 0.75)), url(${bgImage}) no-repeat center center fixed`, backgroundSize: 'cover' }}>
      {/* Hero Section */}
      <section className="alc-pd-hero">
        <div className="alc-container">
          <Link to="/products" className="alc-pd-back">&larr; Back to Products</Link>
          {product.badge && <div className="alc-pd-badge">{product.badge}</div>}
          <h1 className="alc-pd-hero__title">{product.name}</h1>
          <p className="alc-pd-hero__desc">{product.desc}</p>
        </div>
      </section>

      <div className="alc-pd-middle-content">
      {/* Capabilities Section */}
      <section className="alc-pd-capabilities">
        <div className="alc-container">
          <div className="alc-pd-section-title">Capabilities</div>
          <div className="alc-pd-grid">
            {product.features.map((feature, i) => (
              <div key={i} className="alc-pd-feature">
                <h3>{feature}</h3>
                <p>Advanced implementations ensuring reliability and performance in deep-space environments.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specs Section */}
      {product.specs && (
        <section className="alc-pd-specs">
          <div className="alc-container">
            <div className="alc-pd-section-title">Technical Specifications</div>
            <div className="alc-pd-spec-box">
              <p>{product.specs}</p>
            </div>
          </div>
        </section>
      )}
    </div>

      {/* CTA Section */}
      <section className="alc-pd-cta">
        <div className="alc-container">
          <h2>Deploy this technology</h2>
          <p>Integrate {product.name} into your mission architecture.</p>
          <div className="alc-pd-cta-buttons">
            <Link to="/contact" className="alc-button alc-button--primary">Contact Sales</Link>
            <Link to="/library" className="alc-button alc-button--outline" style={{ marginLeft: '16px' }}>View Whitepapers</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

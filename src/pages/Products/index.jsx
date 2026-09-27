import './Products.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlatforms } from '../../services/productsService.js';
import productsHeroBg from '../../assets/images/products page _bg.png';

const STATUS_LABELS = {
  'flight-proven': 'Flight-Proven',
  'in-development': 'In Development',
  'roadmap': 'Roadmap',
};

const STATUS_CLASSES = {
  'flight-proven': 'alc-status-badge--flight-proven',
  'in-development': 'alc-status-badge--in-development',
  'roadmap': 'alc-status-badge--roadmap',
};

export default function Products() {
  const [platforms, setPlatforms] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | success | error

  useEffect(() => {
    getPlatforms()
      .then((res) => {
        const list = res.data.map((p) => ({
          id: p.slug,
          name: p.name,
          pitch: p.one_line_pitch,
          status: STATUS_LABELS[p.status] || p.status,
          statusClass: STATUS_CLASSES[p.status] || '',
        }));
        setPlatforms(list);
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }, []);

  return (
    <div className="alc-products-hub">
      {/* Dynamic Background */}
      <div className="alc-products-bg">
        <div className="alc-products-grid-lines" />
        <div className="alc-products-glow" />
      </div>

      {/* Hero */}
      <div className="alc-products-hero">
        <img 
          src={productsHeroBg} 
          alt="Products Background" 
          className="alc-products-hero-bg" 
        />
        <div className="alc-products-hero-content alc-products-container">
          <span className="alc-products-eyebrow">LICENSABLE CORE PLATFORMS</span>
          <h1>Products &<br />Platforms</h1>
          <p>Our packaged, flight-proven platforms powering the next generation of deep space exploration and autonomous systems.</p>

          {/* Scroll indicator */}
          <div className="alc-products-scroll-hint">
            <span>Scroll to explore</span>
            <div className="alc-products-scroll-arrow" />
          </div>
        </div>
      </div>

      <div className="alc-products-container">

        {status === 'loading' && <p style={{ padding: '40px 0' }}>Loading platforms…</p>}
        {status === 'error' && (
          <p className="alc-form__error" style={{ padding: '40px 0' }}>
            Couldn't load platforms. Is the backend running?
          </p>
        )}
        {status === 'success' && platforms.length === 0 && (
          <p style={{ padding: '40px 0' }}>No platforms added yet.</p>
        )}

        {/* Content Grid */}
        {status === 'success' && platforms.length > 0 && (
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
        )}

      </div>
    </div>
  );
}

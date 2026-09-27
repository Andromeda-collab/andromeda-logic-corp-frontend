import './Investors.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { getInvestorsContent } from '../../services/investorsService.js';
import useApiResource from '../../hooks/useApiResource.js';
import ApiState from '../../components/common/ApiState.jsx';

// Static fallback copy — shown until CMS content exists at GET /api/v1/investors/.
const FALLBACK = {
  company_snapshot:
    'Andromeda Logic Corp builds autonomous, radiation-tolerant computing systems for deep-space missions — spanning guidance & navigation autonomy, in-orbit edge computing, swarm infrastructure, and hardware-in-the-loop simulation. Our platforms have been validated across orbital and simulation programs with space agencies and commercial operators.',
  partner_program:
    'We work with strategic partners, primes, and co-investment programs aligned with deep-space autonomy and resilient computing. Partnership tracks include technology licensing, joint mission development, and research collaboration with institutions and national laboratories.',
  disclosures:
    'Forward-looking statements on this page reflect current expectations and are subject to change. Specific financial disclosures and partnership terms are shared directly with qualified parties under NDA.',
};

// Render a possibly-multi-paragraph text block.
function TextBlock({ value }) {
  const paras = String(value || '')
    .split(/\r?\n\r?\n|\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <>
      {paras.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </>
  );
}

export default function Investors() {
  const { data, loading, error, reload } = useApiResource(
    () => getInvestorsContent(),
    []
  );
  const content = data || FALLBACK;

  return (
    <div className="alc-investors">
      <div className="alc-investors__hero">
        <div className="alc-container">
          <div className="alc-investors__hero-label">INVESTORS &amp; PARTNERS</div>
          <h1>Investors &amp; Partners</h1>
          <p>
            Company snapshot, partnership programs, and disclosures for
            prospective investors and strategic partners.
          </p>
        </div>
      </div>

      <div className="alc-investors__body alc-container">
        <ApiState loading={loading} error={error} onRetry={reload} label="investor information" />

        <section className="alc-investors__section">
          <div className="alc-investors__section-label">COMPANY SNAPSHOT</div>
          <TextBlock value={content.company_snapshot} />
        </section>

        <section className="alc-investors__section">
          <div className="alc-investors__section-label">PARTNER PROGRAM</div>
          <TextBlock value={content.partner_program} />
        </section>

        {content.disclosures && (
          <section className="alc-investors__section">
            <div className="alc-investors__section-label">DISCLOSURES</div>
            <TextBlock value={content.disclosures} />
          </section>
        )}

        <section className="alc-investors__cta">
          <h2>Explore a Partnership</h2>
          <p>
            Submit a Mission Consultation to connect with our business
            development team.
          </p>
          <Link to="/contact" className="alc-btn-primary">
            Request Mission Consultation
          </Link>
        </section>
      </div>
    </div>
  );
}

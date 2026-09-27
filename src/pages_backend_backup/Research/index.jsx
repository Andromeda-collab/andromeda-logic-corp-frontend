import './Research.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getResearchContent,
  submitResearchAccessRequest,
} from '../../services/researchService.js';
import useApiResource from '../../hooks/useApiResource.js';
import ApiState from '../../components/common/ApiState.jsx';

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
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_ACCESS_FORM);
  const [submitState, setSubmitState] = useState({
    sending: false,
    error: null,
    done: false,
  });

  // Optional CMS-managed overview / partnership copy (404 until seeded).
  const { data: content } = useApiResource(() => getResearchContent(), []);

  const closeForm = () => {
    setFormOpen(false);
    setForm(EMPTY_ACCESS_FORM);
    setSubmitState({ sending: false, error: null, done: false });
  };

  const updateField = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleAccessSubmit = (e) => {
    e.preventDefault();
    setSubmitState({ sending: true, error: null, done: false });
    const payload = {
      name: form.name,
      institution: form.institution,
      email: form.email,
      research_area: form.research_area || null,
      message: form.message || null,
    };
    submitResearchAccessRequest(payload)
      .then(() => setSubmitState({ sending: false, error: null, done: true }))
      .catch((err) =>
        setSubmitState({
          sending: false,
          error: err?.uiMessage || 'Submission failed. Please try again.',
          done: false,
        })
      );
  };

  return (
    <div className="alc-research">

      {/* Hero */}
      <section className="alc-research__hero">
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
            <button className="alc-btn-primary" onClick={() => setFormOpen(true)}>Request Research Access</button>
            <Link to="/library" className="alc-btn-ghost">Browse Technical Library</Link>
          </div>
        </div>
      </section>

      {/* HITL Overview */}
      <section className="alc-research__hitl">
        <div className="alc-container">
          <div className="alc-research__hitl-inner">
            <div>
              <div className="alc-research__section-label">HITL SIMULATION & DIGITAL TWINS</div>
              <h2>The HITL Digital Twin Suite</h2>
              <p>High-fidelity orbital and deep-space simulation for pre-deployment validation — integrating real flight hardware in the test loop, not just software models. Our simulation environment covers:</p>
              <ul className="alc-research__feature-list">
                <li>LEO, lunar orbit, and interplanetary trajectory simulation</li>
                <li>Radiation environment emulation including solar particle events and galactic cosmic ray (GCR) flux</li>
                <li>Sensor-degradation injection for cameras, IMUs, and star trackers</li>
                <li>Multi-satellite constellation dynamics and inter-satellite link simulation</li>
                <li>Lunar and planetary surface terrain models for descent/landing validation</li>
              </ul>
              <div className="alc-research__status-badge">
                <span className="alc-research__badge alc-research__badge--active">In Development → v2.0</span>
                <span className="alc-research__badge alc-research__badge--flight">v1.x Flight-Proven</span>
              </div>
            </div>
            <div className="alc-research__hitl-visual">
              <div className="alc-research__sim-card">
                <div className="alc-research__sim-label">SIMULATION CAPABILITIES</div>
                {['Lunar Descent', 'LEO Constellation', 'Deep Space GNC', 'Radiation Events', 'Sensor Failure Injection', 'Swarm Coordination'].map((c, i) => (
                  <div className="alc-research__sim-item" key={i}>
                    <span className="alc-research__sim-dot" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Program */}
      <section className="alc-research__partnership">
        <div className="alc-container">
          <div className="alc-research__section-label">RESEARCH PARTNERSHIP PROGRAM</div>
          <h2>Collaborate with Andromeda Logic</h2>
          <p className="alc-research__section-desc">
            {content?.partnership_program ||
              'Our Research Partnership Program is designed for universities, national laboratories, and independent institutions seeking deep technical collaboration — not just access to documentation.'}
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

      {/* Access Form Modal — POST /api/v1/research/access-request */}
      {formOpen && (
        <div className="alc-research__modal-overlay" onClick={closeForm}>
          <div className="alc-research__modal" onClick={e => e.stopPropagation()}>
            <button className="alc-research__modal-close" onClick={closeForm}>×</button>
            <div className="alc-research__modal-label">ACADEMIC / AGENCY ACCESS REQUEST</div>
            <h3>Request Research Partnership Access</h3>

            {submitState.done ? (
              <>
                <p>
                  Thank you — your research access request has been received. Our
                  team reviews all requests within 5 business days and will follow
                  up at the email you provided.
                </p>
                <button
                  type="button"
                  className="alc-btn-primary"
                  style={{ border: 'none', cursor: 'pointer' }}
                  onClick={closeForm}
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <p>Submit your institution and research scope. We review all requests within 5 business days.</p>
                <form className="alc-research__access-form" onSubmit={handleAccessSubmit}>
                  <input
                    type="text" name="name" placeholder="Full Name *" required
                    value={form.name} onChange={updateField}
                  />
                  <input
                    type="text" name="institution" placeholder="Institution / University *" required
                    value={form.institution} onChange={updateField}
                  />
                  <input
                    type="email" name="email" placeholder="Institutional Email *" required
                    value={form.email} onChange={updateField}
                  />
                  <select name="research_area" value={form.research_area} onChange={updateField}>
                    <option value="">Research scope...</option>
                    <option>HITL Simulation Access</option>
                    <option>Joint Publication Program</option>
                    <option>Algorithm Co-Development</option>
                    <option>Research Data Access</option>
                  </select>
                  <textarea
                    name="message" rows={4}
                    placeholder="Brief research description and objectives..."
                    value={form.message} onChange={updateField}
                  />
                  {submitState.error && (
                    <div className="alc-research__paper-gated" role="alert">
                      <span>⚠</span> {submitState.error}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="alc-btn-primary"
                    disabled={submitState.sending}
                    style={{ width: '100%', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
                  >
                    {submitState.sending ? 'Submitting…' : 'Submit Research Access Request'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

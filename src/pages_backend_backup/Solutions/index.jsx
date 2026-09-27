import './Solutions.css';
import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPersonas } from '../../services/solutionsService.js';
import useApiResource from '../../hooks/useApiResource.js';
import ApiState from '../../components/common/ApiState.jsx';

/*
 * Static design metadata (icon / colour / subtitle / tags). The backend
 * `PersonaPage` model carries slug + name + narrative + engagement_paths;
 * `slug` uses the same taxonomy as below, so live records from
 * GET /api/v1/solutions/ are merged onto this list by slug.
 */
const personas = [
  {
    slug: 'space-agencies',
    icon: '🛸',
    title: 'Space Agencies',
    subtitle: 'NASA · ESA · ISRO · National Programs',
    pitch: 'Rigorous technical documentation, flight-heritage evidence, and a procurement-friendly mission-consultation path for lunar, Mars, and deep-space programs.',
    tags: ['GNC Systems', 'HITL Validation', 'Radiation-Tolerant AI', 'RFP Support'],
    color: '#6c4ce3',
  },
  {
    slug: 'commercial',
    icon: '🛰',
    title: 'Commercial Space Operators',
    subtitle: 'Satellite Constellations · Launch Providers · In-Orbit Services',
    pitch: 'Licensed autonomy software, swarm orchestration, and edge-compute payloads with clear spec sheets, integration documentation, and flexible licensing models.',
    tags: ['Swarm Orchestrator', 'Edge Payload', 'Licensing', 'API Integration'],
    color: '#29e3d9',
  },
  {
    slug: 'defense',
    icon: '⬡',
    title: 'Defense & National Security',
    subtitle: 'Defense Programs · Contested Environments · Secure Operations',
    pitch: 'Resilient autonomous systems for communication-denied environments, with a defense-adjacent security posture, export-control clarity, and ITAR/EAR awareness built in from day one.',
    tags: ['ITAR/EAR Posture', 'Secure Architecture', 'Export Control', 'Resilient Autonomy'],
    color: '#e63c8c',
  },
  {
    slug: 'research',
    icon: '◈',
    title: 'Research Institutions & Academia',
    subtitle: 'Universities · National Labs · Independent Research',
    pitch: 'HITL simulation access, joint research programs, citable technical publications, and research-partnership inquiry paths — designed for the academic and laboratory environment.',
    tags: ['HITL Simulation', 'Joint Research', 'Publications', 'Academic Access'],
    color: '#ffb648',
  },
];

export default function Solutions() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const navigate = useNavigate();

  const { data, loading, error, reload } = useApiResource(() => getPersonas(), []);

  const personaCards = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return personas;
    const bySlug = new Map(data.map((p) => [p.slug, p]));
    // Keep the designed order; overlay live copy where the slug matches.
    const merged = personas.map((design) => {
      const live = bySlug.get(design.slug);
      return live
        ? { ...design, title: live.name || design.title, pitch: live.narrative || design.pitch }
        : design;
    });
    // Surface any extra personas the CMS added that aren't in the design list.
    data.forEach((live) => {
      if (!personas.some((d) => d.slug === live.slug)) {
        merged.push({
          slug: live.slug,
          icon: '◈',
          title: live.name,
          subtitle: '',
          pitch: live.narrative,
          tags: [],
          color: '#6c4ce3',
        });
      }
    });
    return merged;
  }, [data]);

  return (
    <div className="alc-solutions">

      {/* Hero */}
      <section className="alc-solutions__hero">
        <div className="alc-container">
          <div className="alc-solutions__hero-label">SOLUTIONS BY AUDIENCE</div>
          <h1 className="alc-solutions__hero-title">
            Your Mission.<br />
            <span className="alc-solutions__hero-accent">Your Entry Point.</span>
          </h1>
          <p className="alc-solutions__hero-desc">
            Andromeda Logic Corp serves four distinct audiences — each with different proof points, engagement paths, and conversion needs. Select your category to see the technologies, products, and partnerships tailored to your mission.
          </p>
        </div>
        <div className="alc-solutions__hero-grid-bg" />
      </section>

      {/* Persona Grid */}
      <section className="alc-solutions__personas">
        <div className="alc-container">
          <ApiState loading={loading} error={error} onRetry={reload} label="audience segments" />
          <div className="alc-solutions__persona-grid">
            {personaCards.map((p, i) => (
              <div
                key={p.slug}
                className={`alc-solutions__persona-card ${hoveredIdx === i ? 'is-hovered' : ''}`}
                style={{ '--persona-color': p.color }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => navigate(`/solutions/${p.slug}`)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && navigate(`/solutions/${p.slug}`)}
              >
                <div className="alc-solutions__persona-icon">{p.icon}</div>
                <div className="alc-solutions__persona-body">
                  <div className="alc-solutions__persona-sub">{p.subtitle}</div>
                  <h2 className="alc-solutions__persona-title">{p.title}</h2>
                  <p className="alc-solutions__persona-pitch">{p.pitch}</p>
                  <div className="alc-solutions__persona-tags">
                    {p.tags.map(t => <span key={t}>{t}</span>)}
                  </div>
                </div>
                <div className="alc-solutions__persona-arrow">
                  <span>Explore →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Paths */}
      <section className="alc-solutions__engagement">
        <div className="alc-container">
          <div className="alc-solutions__section-header">
            <span className="alc-solutions__section-tag">HOW WE WORK TOGETHER</span>
            <h2>Engagement Paths</h2>
            <p>Andromeda Logic Corp offers three primary engagement models, each tailored to how your organization wants to integrate our technology.</p>
          </div>
          <div className="alc-solutions__engagement-grid">
            <div className="alc-solutions__eng-card">
              <div className="alc-solutions__eng-num">01</div>
              <h3>Technology Licensing</h3>
              <p>License our flagship platforms — GNC Autonomy Stack, EDGE Payload, Swarm Orchestrator, HITL Digital Twin Suite, or Radiation-Tolerant Inference Engine — for integration into your mission architecture.</p>
              <Link to="/contact" className="alc-solutions__eng-link">Request Licensing Info →</Link>
            </div>
            <div className="alc-solutions__eng-card">
              <div className="alc-solutions__eng-num">02</div>
              <h3>Joint Mission Development</h3>
              <p>Co-develop mission-specific autonomous systems with our engineering team embedded alongside yours — from concept through deployment validation in the HITL simulation environment.</p>
              <Link to="/contact" className="alc-solutions__eng-link">Start a Conversation →</Link>
            </div>
            <div className="alc-solutions__eng-card">
              <div className="alc-solutions__eng-num">03</div>
              <h3>Research Partnership</h3>
              <p>Formal partnerships with academic institutions and national labs — including HITL simulation access, joint publication programs, and co-authorship of technical whitepapers.</p>
              <Link to="/research" className="alc-solutions__eng-link">Explore Research Programs →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="alc-solutions__cta">
        <div className="alc-container">
          <div className="alc-solutions__cta-inner">
            <h2>Not Sure Where to Start?</h2>
            <p>Use NOVA or submit a Mission Consultation form — we'll route you to the right team based on your mission phase, target orbit, and organizational context.</p>
            <div className="alc-solutions__cta-btns">
              <Link to="/contact" className="alc-btn-primary">Request Mission Consultation</Link>
              <Link to="/trust" className="alc-btn-ghost">View Trust &amp; Compliance</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

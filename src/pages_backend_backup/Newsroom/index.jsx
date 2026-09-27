import './Newsroom.css';
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPressItems } from '../../services/newsroomService.js';
import useApiResource from '../../hooks/useApiResource.js';
import ApiState from '../../components/common/ApiState.jsx';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];

function formatPressDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

// Map a live PressItemOut record onto the shape the card markup expects.
function fromApi(p) {
  const d = p.published_date ? new Date(p.published_date) : null;
  return {
    id: p.slug || p.id,
    slug: p.slug,
    type: p.is_external ? 'external' : 'self',
    date: formatPressDate(p.published_date),
    year: d && !Number.isNaN(d.getTime()) ? String(d.getFullYear()) : '',
    tag: p.is_external ? null : 'Press Release',
    title: p.title,
    summary: p.body || '',
    outlet: p.source_outlet || (p.is_external ? 'External Coverage' : 'Andromeda Logic Corp Press Release'),
  };
}

const pressReleases = [
  {
    id: 1, type: 'self', date: 'August 2026', year: '2026',
    tag: 'Product Launch',
    title: 'Andromeda Logic Corp Announces HITL Digital Twin Suite v2.0 — Expanded Deep-Space Simulation Environments',
    summary: 'HITL Digital Twin Suite v2.0 introduces high-fidelity lunar surface simulation, interplanetary trajectory modeling, and expanded radiation-environment emulation for pre-flight software validation.',
    outlet: 'Andromeda Logic Corp Press Release',
  },
  {
    id: 2, type: 'self', date: 'July 2026', year: '2026',
    tag: 'Research',
    title: 'Andromeda Logic Corp Publishes Whitepaper on Radiation-Tolerant Inference: "Sparse Neural Execution at the Radiation Boundary"',
    summary: 'New whitepaper details architectural patterns for deploying sparse neural networks on radiation-hardened embedded processors with sub-100ms inference latency under simulated GCR conditions.',
    outlet: 'Andromeda Logic Corp Research',
  },
  {
    id: 3, type: 'self', date: 'June 2026', year: '2026',
    tag: 'Partnership',
    title: 'Andromeda Logic Corp Enters Research Partnership with National Aerospace Simulation Laboratory',
    summary: 'Formal joint research program announced covering HITL simulation methodology, autonomous GNC validation frameworks, and co-authorship of peer-reviewed publications.',
    outlet: 'Andromeda Logic Corp Press Release',
  },
  {
    id: 4, type: 'self', date: 'March 2026', year: '2026',
    tag: 'Mission',
    title: 'Swarm Orchestrator Demonstrates 6-Satellite Autonomous Station-Keeping in LEO Validation Program',
    summary: 'Multi-agent constellation coordination without ground intervention validated over a 72-hour autonomous operation window. Collision avoidance, coverage optimization, and fault-tolerance demonstrated.',
    outlet: 'Andromeda Logic Corp Press Release',
  },
];

const externalCoverage = [
  {
    id: 5, type: 'external', date: 'August 2026', year: '2026',
    outlet: 'The Orbit Report',
    title: 'Indian Deep-Space AI Startups Are Quietly Building the Infrastructure Layer for Lunar Autonomy',
    summary: 'Feature on emerging Indian deep-space technology companies developing autonomous computing systems for future lunar and Mars mission architectures.',
  },
  {
    id: 6, type: 'external', date: 'July 2026', year: '2026',
    outlet: 'SpaceTech Digest',
    title: 'Radiation-Tolerant AI: The Quiet Revolution in Onboard Space Computing',
    summary: 'Analysis of the growing field of radiation-hardened AI inference, including coverage of emerging platforms targeting deep-space deployment profiles.',
  },
  {
    id: 7, type: 'external', date: 'May 2026', year: '2026',
    outlet: 'Aerospace India Review',
    title: 'The Next Generation of Indian Aerospace Software: From Earth Observation to Deep Space Autonomy',
    summary: 'Sector overview covering the transition from LEO applications to deep-space autonomous systems, featuring emerging platforms and research institutions.',
  },
];

const staticAllItems = [...pressReleases, ...externalCoverage].sort((a, b) => b.id - a.id);

export default function Newsroom() {
  const [filter, setFilter] = useState('All');

  const { data, loading, error, reload } = useApiResource(() => getPressItems(), []);

  const { releases, external, allItems } = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return { releases: pressReleases, external: externalCoverage, allItems: staticAllItems };
    }
    const mapped = data.map(fromApi);
    return {
      releases: mapped.filter((m) => m.type === 'self'),
      external: mapped.filter((m) => m.type === 'external'),
      // GET /newsroom is already ordered newest-first by the backend.
      allItems: mapped,
    };
  }, [data]);

  const featured = releases[0] || allItems[0] || null;

  const filters = ['All', 'Press Releases', 'External Coverage'];
  const filtered = filter === 'All' ? allItems
    : filter === 'Press Releases' ? releases
    : external;

  return (
    <div className="alc-newsroom">

      {/* Hero */}
      <section className="alc-newsroom__hero">
        <div className="alc-container">
          <div className="alc-newsroom__hero-label alc-eyebrow-reveal">NEWSROOM &amp; PRESS</div>
          <h1 className="alc-newsroom__hero-title split-text">
            <span className="split-text__line"><span className="split-text__inner">Latest News &amp;</span></span>
            <span className="split-text__line"><span className="split-text__inner" style={{transitionDelay:'0.12s'}}><span className="alc-newsroom__hero-accent">Press Coverage</span></span></span>
          </h1>
          <p className="alc-newsroom__hero-desc reveal--up reveal-delay-3">
            Self-published announcements and aggregated external coverage. Every external mention is attributed to its source outlet.
          </p>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="alc-newsroom__featured">
          <div className="alc-container">
            <div className="alc-newsroom__featured-card reveal--scale">
              <div className="alc-newsroom__featured-label">LATEST RELEASE</div>
              {featured.tag && <div className="alc-newsroom__featured-tag">{featured.tag}</div>}
              <h2 className="alc-newsroom__featured-title">{featured.title}</h2>
              <p className="alc-newsroom__featured-summary">{featured.summary}</p>
              <div className="alc-newsroom__featured-meta">
                <span className="alc-newsroom__outlet">{featured.outlet}</span>
                <span className="alc-newsroom__date">{featured.date}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filter + Grid */}
      <section className="alc-newsroom__feed">
        <div className="alc-container">
          <ApiState loading={loading} error={error} onRetry={reload} label="press items" />
          <div className="alc-newsroom__filter-bar">
            {filters.map(f => (
              <button
                key={f}
                className={`alc-newsroom__filter-btn ${filter === f ? 'is-active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="alc-newsroom__grid">
            {filtered.map((item, idx) => (
              <div
                className={`alc-newsroom__card reveal--up reveal-delay-${Math.min(idx % 4 + 1, 5)} ${item.type === 'external' ? 'alc-newsroom__card--external' : ''} alc-card-shine`}
                key={item.id}
              >
                {item.type === 'external' && (
                  <div className="alc-newsroom__external-badge">External Coverage</div>
                )}
                {item.tag && (
                  <div className="alc-newsroom__card-tag">{item.tag}</div>
                )}
                <h3 className="alc-newsroom__card-title">{item.title}</h3>
                <p className="alc-newsroom__card-summary">{item.summary}</p>
                <div className="alc-newsroom__card-meta">
                  <span className="alc-newsroom__outlet">{item.outlet}</span>
                  <span className="alc-newsroom__date">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="alc-newsroom__media-kit">
        <div className="alc-container">
          <div className="alc-newsroom__media-kit-inner reveal--up">
            <div>
              <div className="alc-newsroom__section-label alc-eyebrow-reveal">MEDIA RESOURCES</div>
              <h2 className="split-text"><span className="split-text__line"><span className="split-text__inner">Media Kit</span></span></h2>
              <p>Logos, brand guidelines, executive headshots, and company boilerplate for press use. The media kit does not contain technical data and does not require export-control gating.</p>
            </div>
            <div className="alc-newsroom__media-actions">
              <button className="alc-newsroom__download-btn">Download Media Kit</button>
              <div className="alc-newsroom__press-contact">
                <div className="alc-newsroom__section-label">PRESS CONTACT</div>
                <div className="alc-newsroom__press-email">hr@andromedalc.com</div>
                <p>For interview requests and technical embargoed briefings.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

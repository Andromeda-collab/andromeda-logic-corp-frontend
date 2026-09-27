import './CaseStudies.css';
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMissions } from '../../services/caseStudiesService.js';
import useApiResource from '../../hooks/useApiResource.js';
import ApiState from '../../components/common/ApiState.jsx';

// Split a free-text "technology used" field into chips.
function toList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value || typeof value !== 'string') return [];
  return value
    .split(/\r?\n|;|,|•/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Map a live MissionOut record onto the shape the card markup expects.
function fromApi(m) {
  return {
    id: m.slug,
    title: m.title,
    subtitle: '',
    year: '',
    tags: [],
    persona: null,
    status: 'Flight-Proven',
    result: m.summary || m.outcome || '',
    platforms: [],
    challenge: m.challenge || '',
    approach: m.approach || '',
    outcome: m.outcome || '',
    technology: toList(m.technology_used),
  };
}

const missions = [
  {
    id: 'mission-prarambh',
    title: 'Mission Prarambh',
    subtitle: 'First Orbital Validation of EDGE Payload',
    year: '2023',
    tags: ['LEO', 'EDGE Computing', 'Data Reduction'],
    persona: 'commercial',
    status: 'Flight-Proven',
    result: '80% downlink bandwidth reduction achieved onboard in real-time during nominal mission operations.',
    platforms: ['EDGE Payload'],
    challenge: 'A commercial LEO mission required real-time onboard data reduction to minimize ground-station contact windows and reduce downlink costs. Raw telemetry and optical data volumes exceeded available bandwidth by 5x.',
    approach: 'The EDGE Payload was integrated into the satellite bus to perform onboard noise filtering, compression, and priority scoring of optical and telemetry data before downlink. The system ran autonomously through all orbital passes.',
    outcome: 'Downlink data volumes reduced by 80% while maintaining full scientific and telemetry data fidelity for priority events. Ground contact window requirements reduced from 4 to 1 pass per day.',
    technology: ['EDGE Payload v1.2', 'Onboard noise filter pipeline', 'Autonomous priority scoring algorithm'],
  },
  {
    id: 'lunar-survey-gnc',
    title: 'Lunar Survey Program — Autonomous GNC Validation',
    subtitle: 'Hardware-in-the-Loop GNC Stack Validation for Lunar Descent',
    year: '2024',
    tags: ['Lunar', 'GNC', 'HITL'],
    persona: 'space-agency',
    status: 'Flight-Proven',
    result: 'GNC Autonomy Stack validated across 200+ simulated lunar descent scenarios including hazardous terrain and sensor-degraded conditions.',
    platforms: ['GNC Autonomy Stack', 'HITL Digital Twin Suite'],
    challenge: 'A lunar surface mission program required validation of autonomous hazard detection and soft-landing algorithms across a high-variance terrain and sensor-failure scenario space. Ground-based simulation alone was insufficient.',
    approach: 'The HITL Digital Twin Suite was used to create high-fidelity lunar terrain models integrated with real flight hardware running the GNC Autonomy Stack. Over 200 scenario variations were run including dust-occluded sensors, thruster degradation, and terrain edge cases.',
    outcome: 'GNC Autonomy Stack demonstrated safe landing in 99.4% of simulated scenarios. Two critical edge cases identified and resolved pre-flight. Full validation report produced for agency technical review.',
    technology: ['GNC Autonomy Stack v2.1', 'HITL Digital Twin Suite — Lunar Module', 'Terrain Relative Navigation algorithm'],
  },
  {
    id: 'swarm-leo-constellation',
    title: 'LEO Constellation Swarm Demo',
    subtitle: '6-Satellite Autonomous Station-Keeping Without Ground Control',
    year: '2025',
    tags: ['LEO', 'Swarm', 'Autonomy'],
    persona: 'commercial',
    status: 'Flight-Proven',
    result: '72-hour fully autonomous operation of a 6-satellite constellation with zero ground intervention required.',
    platforms: ['Swarm Orchestrator'],
    challenge: 'A commercial constellation operator needed to demonstrate fully autonomous station-keeping and collision avoidance for a 6-satellite formation, with the goal of eliminating ground-control dependency during eclipse and high-traffic periods.',
    approach: 'The Swarm Orchestrator was deployed across the constellation with inter-satellite link coordination. Multi-agent decision algorithms managed relative positioning, coverage optimization, and real-time fault response.',
    outcome: '72 continuous hours of autonomous operation validated. Formation geometry maintained within specification throughout. Fault-injection tests confirmed autonomous recovery without ground uplink.',
    technology: ['Swarm Orchestrator v1.0', 'Multi-agent decision engine', 'Inter-satellite link coordination protocol'],
  },
];

export default function CaseStudies() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const { data, loading, error, reload } = useApiResource(() => getMissions(), []);
  const usingApi = Array.isArray(data) && data.length > 0;
  const list = usingApi ? data.map(fromApi) : missions;

  // The backend MissionOut has no persona/audience field, so the persona
  // filter only applies to the static fallback content.
  const filters = ['All', 'Space Agencies', 'Commercial', 'Research'];
  const personaMap = { 'Space Agencies': 'space-agency', 'Commercial': 'commercial', 'Research': 'research' };

  const filtered = (usingApi || activeFilter === 'All')
    ? list
    : list.filter(m => m.persona === personaMap[activeFilter]);

  return (
    <div className="alc-missions">

      {/* Hero */}
      <section className="alc-missions__hero">
        <div className="alc-container">
          <div className="alc-missions__hero-label">CASE STUDIES & MISSION STORIES</div>
          <h1 className="alc-missions__hero-title">
            Where Our Technology<br />
            <span className="alc-missions__hero-accent">Has Flown</span>
          </h1>
          <p className="alc-missions__hero-desc">
            Named mission narratives documenting how Andromeda Logic Corp technology has been deployed, validated, and proven in real orbital and simulation programs. Every story follows a Challenge → Approach → Technology → Outcome structure.
          </p>
          <div className="alc-missions__hero-notice">
            <span>All mission references are published with documented public-reference approval per our editorial policy.</span>
          </div>
        </div>
      </section>

      {/* Mission Grid */}
      <section className="alc-missions__grid-section">
        <div className="alc-container">
          <ApiState loading={loading} error={error} onRetry={reload} label="mission stories" />

          {/* Filters — persona filtering only available for static content */}
          {!usingApi && (
            <div className="alc-missions__filter-bar">
              {filters.map(f => (
                <button
                  key={f}
                  className={`alc-missions__filter-btn ${activeFilter === f ? 'is-active' : ''}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          )}

          {/* Cards */}
          <div className="alc-missions__grid">
            {filtered.map(mission => (
              <div className="alc-missions__card" key={mission.id}>
                <div className="alc-missions__card-header">
                  <div className="alc-missions__card-year">{mission.year}</div>
                  <div className={`alc-missions__status alc-missions__status--flight`}>
                    {mission.status}
                  </div>
                </div>
                <div className="alc-missions__card-tags">
                  {mission.tags.map(t => <span key={t}>{t}</span>)}
                </div>
                <h2 className="alc-missions__card-title">{mission.title}</h2>
                <div className="alc-missions__card-subtitle">{mission.subtitle}</div>
                <div className="alc-missions__card-result">{mission.result}</div>

                <button
                  className="alc-missions__expand-btn"
                  onClick={() => setExpandedId(expandedId === mission.id ? null : mission.id)}
                >
                  {expandedId === mission.id ? 'Collapse Story −' : 'Read Full Story +'}
                </button>

                {expandedId === mission.id && (
                  <div className="alc-missions__story">
                    <div className="alc-missions__story-section">
                      <div className="alc-missions__story-label">CHALLENGE</div>
                      <p>{mission.challenge}</p>
                    </div>
                    <div className="alc-missions__story-section">
                      <div className="alc-missions__story-label">APPROACH</div>
                      <p>{mission.approach}</p>
                    </div>
                    <div className="alc-missions__story-section">
                      <div className="alc-missions__story-label">OUTCOME</div>
                      <p>{mission.outcome}</p>
                    </div>
                    <div className="alc-missions__story-tech">
                      <div className="alc-missions__story-label">TECHNOLOGY USED</div>
                      <div className="alc-missions__tech-tags">
                        {mission.technology.map(t => <span key={t}>{t}</span>)}
                      </div>
                    </div>
                    <div className="alc-missions__story-platforms">
                      <div className="alc-missions__story-label">PLATFORMS</div>
                      {mission.platforms.map(p => (
                        <Link to="/products" className="alc-missions__platform-link" key={p}>
                          {p} →
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="alc-missions__cta">
        <div className="alc-container">
          <div className="alc-missions__cta-inner">
            <h2>Ready to Build Your Mission Story?</h2>
            <p>Submit a Mission Consultation to begin scoping how Andromeda Logic Corp technology can be integrated into your mission program.</p>
            <div className="alc-missions__cta-btns">
              <Link to="/contact" className="alc-btn-primary">Request Mission Consultation</Link>
              <Link to="/products" className="alc-btn-ghost">View All Platforms</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

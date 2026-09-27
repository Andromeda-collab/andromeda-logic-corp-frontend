import './Careers.css';
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRequisitions } from '../../services/careersService.js';
import useApiResource from '../../hooks/useApiResource.js';
import ApiState from '../../components/common/ApiState.jsx';

// Map a live JobRequisitionOut record onto the shape the role card expects.
function fromApi(r) {
  return {
    id: r.slug,
    title: r.title,
    department: r.discipline || 'General',
    location: r.location || '—',
    type: 'Full-Time',
    clearance: r.requires_clearance ? 'Clearance Required' : 'None Required',
    description: r.description || '',
    requirements: [], // backend requisition has no structured requirements list
  };
}

const openRoles = [
  {
    id: 'GNC-001',
    title: 'Senior GNC Engineer',
    department: 'Guidance, Navigation & Control',
    location: 'Bengaluru, India',
    type: 'Full-Time',
    clearance: 'None Required',
    description: 'Design and validate autonomous GNC algorithms for deep-space mission profiles including hazard detection, autonomous landing, and orbital station-keeping without ground telemetry.',
    requirements: [
      'M.Tech / PhD in Aerospace Engineering, Control Systems, or related field',
      '5+ years of experience in spacecraft GNC algorithm development',
      'Proficiency in MATLAB/Simulink and embedded C for flight software',
      'Experience with hardware-in-the-loop (HITL) simulation environments',
    ],
  },
  {
    id: 'ML-002',
    title: 'ML Research Engineer — Radiation-Tolerant AI',
    department: 'AI & Machine Learning',
    location: 'Bengaluru, India',
    type: 'Full-Time',
    clearance: 'None Required',
    description: 'Research and develop neural network architectures and inference engines optimized for low-power, radiation-hardened hardware. Work on quantization, pruning, and fault-tolerant model design.',
    requirements: [
      'M.Tech / PhD in Machine Learning, Computer Science, or Electrical Engineering',
      'Strong background in model compression and hardware-aware ML',
      'Experience with TensorFlow Lite, ONNX, or edge inference frameworks',
      'Familiarity with radiation-effects on silicon is a strong plus',
    ],
  },
  {
    id: 'SWE-003',
    title: 'Embedded Systems Engineer — Space Software',
    department: 'Embedded & Flight Software',
    location: 'Pune, India',
    type: 'Full-Time',
    clearance: 'None Required',
    description: 'Develop and validate fault-tolerant embedded software for mission-critical space payloads. Build real-time operating system integrations, watchdog logic, and power-management software for the EDGE Payload platform.',
    requirements: [
      'B.Tech / M.Tech in Electronics, Computer Science, or Aerospace',
      '3+ years in embedded C/C++ development for real-time systems',
      'Experience with RTOS (FreeRTOS, VxWorks, or similar)',
      'Knowledge of space-grade hardware interfaces (SpaceWire, CAN, I2C)',
    ],
  },
  {
    id: 'SIM-004',
    title: 'HITL Simulation Engineer',
    department: 'Research & Simulation',
    location: 'Bengaluru, India',
    type: 'Full-Time',
    clearance: 'None Required',
    description: 'Build and maintain the HITL Digital Twin Suite. Develop high-fidelity orbital and deep-space simulation environments for pre-deployment validation of GNC, swarm, and edge computing systems.',
    requirements: [
      'M.Tech in Aerospace, Mechanical, or Computer Science',
      'Experience in simulation framework development (Simulink, Gazebo, or custom)',
      'Understanding of orbital mechanics and spacecraft dynamics',
      'Strong software engineering skills — Python, C++, or Julia',
    ],
  },
  {
    id: 'DATA-005',
    title: 'Swarm Autonomy Researcher',
    department: 'Autonomy & Swarm Systems',
    location: 'Remote / Bengaluru',
    type: 'Full-Time',
    clearance: 'None Required',
    description: 'Research and implement multi-agent decision algorithms for satellite constellation coordination, autonomous station-keeping, and swarm-level fault tolerance for the Swarm Orchestrator platform.',
    requirements: [
      'PhD or strong research background in multi-agent systems, robotics, or distributed algorithms',
      'Publications in relevant conferences (ICRA, RSS, IROS, or aerospace venues) preferred',
      'Proficiency in Python and ROS or similar robotics/autonomy middleware',
      'Passion for real-world deployment in extremely constrained environments',
    ],
  },
];

const cultureCards = [
  {
    icon: '⬡',
    title: 'Mission-Driven Work',
    desc: 'Every line of code you write at Andromeda Logic has the potential to fly in orbit. Your work directly advances the frontier of autonomous space exploration.',
    tag: 'CULTURE',
  },
  {
    icon: '◈',
    title: 'Deep Technical Excellence',
    desc: 'We are a team of engineers, researchers, and scientists who care obsessively about correctness. We peer-review everything, simulate everything, and validate before we ship.',
    tag: 'ENGINEERING',
  },
  {
    icon: '◇',
    title: 'Small Team, High Impact',
    desc: 'You will not be one of a thousand engineers maintaining a feature. You will be one of a few dozen people building systems that have never been built before.',
    tag: 'TEAM',
  },
];

export default function Careers() {
  const [expandedRole, setExpandedRole] = useState(null);
  const [filter, setFilter] = useState('All');

  const { data, loading, error, reload } = useApiResource(() => getRequisitions(), []);
  const roles = useMemo(
    () => (Array.isArray(data) && data.length ? data.map(fromApi) : openRoles),
    [data]
  );

  const departments = ['All', ...new Set(roles.map(r => r.department))];
  const filtered = filter === 'All' ? roles : roles.filter(r => r.department === filter);
  const disciplineCount = new Set(roles.map(r => r.department)).size;
  const locationCount = new Set(roles.map(r => r.location).filter(l => l && l !== '—')).size;

  return (
    <div className="alc-careers">

      {/* Hero */}
      <section className="alc-careers__hero">
        <div className="alc-container">
          <div className="alc-careers__hero-label alc-eyebrow-reveal">CAREERS AT ANDROMEDA LOGIC CORP</div>
          <h1 className="alc-careers__hero-title split-text">
            <span className="split-text__line"><span className="split-text__inner">Build Systems That</span></span>
            <span className="split-text__line"><span className="split-text__inner" style={{transitionDelay:'0.12s'}}><span className="alc-careers__hero-accent">Operate Beyond Earth</span></span></span>
          </h1>
          <p className="alc-careers__hero-desc reveal--up reveal-delay-3">
            We're looking for aerospace engineers, AI researchers, and embedded-systems specialists who want to build autonomous intelligence for the most demanding environments humanity has ever reached. If you care deeply about correctness, reliability, and doing things that matter — you belong here.
          </p>
          <div className="alc-careers__hero-stats stagger-children">
            <div className="alc-careers__hero-stat">
              <span className="alc-careers__stat-num">{roles.length}</span>
              <span className="alc-careers__stat-label">Open Positions</span>
            </div>
            <div className="alc-careers__hero-stat">
              <span className="alc-careers__stat-num">{disciplineCount || 3}</span>
              <span className="alc-careers__stat-label">Disciplines</span>
            </div>
            <div className="alc-careers__hero-stat">
              <span className="alc-careers__stat-num">{locationCount || 2}</span>
              <span className="alc-careers__stat-label">Office Locations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Culture Cards */}
      <section className="alc-careers__culture">
        <div className="alc-container">
          <div className="alc-careers__section-label alc-eyebrow-reveal">ENGINEERING CULTURE</div>
          <h2 className="split-text"><span className="split-text__line"><span className="split-text__inner">Why Join Andromeda Logic</span></span></h2>
          <div className="alc-careers__culture-grid stagger-children">
            {cultureCards.map((c, i) => (
              <div className="alc-careers__culture-card alc-card-shine" key={i}>
                <div className="alc-careers__culture-tag">{c.tag}</div>
                <div className="alc-careers__culture-icon">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Value */}
      <section className="alc-careers__values">
        <div className="alc-container">
          <div className="alc-careers__values-inner reveal--up">
            <div>
              <div className="alc-careers__section-label alc-eyebrow-reveal">WHAT WE LOOK FOR</div>
              <h2 className="split-text"><span className="split-text__line"><span className="split-text__inner">The Andromeda Logic Engineer</span></span></h2>
              <p>Our strongest candidates have one thing in common: they care deeply about systems that <em>cannot fail</em>. Whether your background is in GNC, machine learning, embedded software, or simulation — we want people who are rigorous, curious, and motivated by difficult, consequential work.</p>
              <ul className="alc-careers__values-list">
                <li>Comfort with deep uncertainty and first-principles reasoning</li>
                <li>A track record of shipping production-grade work, not just research demos</li>
                <li>Willingness to operate at the hardware-software boundary</li>
                <li>Passion for the mission itself — not just the technology</li>
              </ul>
            </div>
            <div className="alc-careers__perks">
              <div className="alc-careers__section-label">WHAT WE OFFER</div>
              <div className="alc-careers__perks-grid">
                {['Competitive CTC + ESOPs', 'HITL Lab Access', 'Conference & Publications Budget', 'Flexible Remote Policy', 'Mission Sabbaticals', 'Health & Wellness Coverage'].map((p, i) => (
                  <div className="alc-careers__perk-item" key={i}>
                    <span>◈</span><span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="alc-careers__roles">
        <div className="alc-container">
          <div className="alc-careers__section-label">OPEN POSITIONS</div>
          <h2>Join the Mission</h2>

          <ApiState loading={loading} error={error} onRetry={reload} label="open roles" />

          {/* Filter */}
          <div className="alc-careers__filter">
            {departments.map(d => (
              <button
                key={d}
                className={`alc-careers__filter-btn ${filter === d ? 'is-active' : ''}`}
                onClick={() => setFilter(d)}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Role List */}
          <div className="alc-careers__role-list">
            {filtered.map((role, idx) => (
              <div className={`alc-careers__role-card reveal--up reveal-delay-${Math.min(idx+1,5)}`} key={role.id}>
                <div className="alc-careers__role-header" onClick={() => setExpandedRole(expandedRole === role.id ? null : role.id)}>
                  <div>
                    <div className="alc-careers__role-id">{role.id}</div>
                    <h3 className="alc-careers__role-title">{role.title}</h3>
                    <div className="alc-careers__role-meta">
                      <span>{role.department}</span>
                      <span>·</span>
                      <span>{role.location}</span>
                      <span>·</span>
                      <span>{role.type}</span>
                    </div>
                  </div>
                  <div className="alc-careers__role-toggle">
                    {expandedRole === role.id ? '−' : '+'}
                  </div>
                </div>
                {expandedRole === role.id && (
                  <div className="alc-careers__role-body">
                    <p className="alc-careers__role-desc">{role.description}</p>
                    <div className="alc-careers__role-req-label">Requirements</div>
                    <ul className="alc-careers__role-reqs">
                      {role.requirements.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                    <div className="alc-careers__role-clearance">
                      Clearance: <span>{role.clearance}</span>
                    </div>
                    <Link to={`/careers/${role.id}`} className="alc-careers__apply-btn">
                      View Role &amp; Apply →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="alc-careers__cta">
        <div className="alc-container">
          <div className="alc-careers__cta-inner reveal--scale">
            <h2 className="split-text"><span className="split-text__line"><span className="split-text__inner">Don't See the Right Role?</span></span></h2>
            <p>We're always interested in hearing from exceptional aerospace engineers, AI researchers, and embedded-systems specialists. Send a speculative application via the Mission Consultation form.</p>
            <Link to="/contact" className="alc-btn-primary">Submit a Speculative Application</Link>
          </div>
        </div>
      </section>

    </div>
  );
}

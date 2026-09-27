import './Solutions.css';
import './SolutionDetail.css';
import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getPersonaBySlug } from '../../services/solutionsService.js';
import useApiResource from '../../hooks/useApiResource.js';
import bgImage from '../../assets/images/black_substitute.jpg';

const personaData = {
  'space-agencies': {
    icon: '🛸',
    color: '#6c4ce3',
    title: 'Space Agencies',
    subtitle: 'NASA · ESA · ISRO · National Programs',
    badge: null,
    heroDesc: 'National and multinational agencies evaluating autonomous GNC, radiation-tolerant compute, or HITL simulation partners for lunar, Mars, or deep-space programs. We provide rigorous technical documentation, flight-heritage evidence, and a procurement-friendly mission-consultation path.',
    valueProps: [
      { title: 'Flight-Heritage Evidence', desc: 'Our GNC Autonomy Stack and EDGE Payload have been validated across orbital missions — providing the documented flight heritage your procurement process requires.' },
      { title: 'Rigorous Technical Documentation', desc: 'Comprehensive system architecture documentation, interface control documents, and technical performance specifications for every platform.' },
      { title: 'HITL Validation Rigor', desc: 'Pre-deployment hardware-in-the-loop simulation against your mission environment, with documented test results that meet agency standards.' },
      { title: 'RFP / Consultation Path', desc: 'Upload your RFP or mission requirement document directly in our Mission Consultation form — we route it to the right technical team within 48 hours.' },
    ],
    platforms: ['GNC Autonomy Stack', 'EDGE Payload', 'HITL Digital Twin Suite', 'Radiation-Tolerant Inference Engine'],
    faq: [
      { q: 'Do your systems meet agency-grade documentation standards?', a: 'Yes — every platform ships with architecture documentation, ICD specifications, and test reports. We work within standard agency-procurement frameworks and can produce additional documentation per program requirements.' },
      { q: 'What mission phases do you support?', a: 'We operate across all four mission phases: Concept, Formulation, Development, and Operations. HITL simulation is most engaged during Formulation and Development; GNC stack licensing is active through Operations.' },
      { q: 'Can your systems operate without ground communication?', a: 'That is our core differentiator. All five platforms are designed for autonomous operation in communication-denied or high-latency environments — including deep-space, lunar, and Mars mission profiles.' },
    ],
  },
  'commercial': {
    icon: '🛰',
    color: '#29e3d9',
    title: 'Commercial Space Operators',
    subtitle: 'Satellite Constellations · Launch Providers · In-Orbit Services',
    badge: null,
    heroDesc: 'Satellite constellation operators, private launch providers, and in-orbit servicing companies seeking licensed autonomy software, swarm orchestration, and edge-compute payloads. We offer product spec sheets, integration documentation, and clear licensing models.',
    valueProps: [
      { title: 'Licensing-Ready Platforms', desc: 'All five flagship platforms are available for technology licensing — with integration APIs, SDK documentation, and onboarding support included.' },
      { title: 'Swarm Orchestration at Scale', desc: 'The Swarm Orchestrator handles multi-agent coordination across satellite constellations — station-keeping, coverage optimization, and fault-tolerance without ground intervention.' },
      { title: 'Edge Payload Integration', desc: 'EDGE Payload integrates with standard satellite bus architectures — reducing downlink bandwidth by up to 80% through onboard data reduction.' },
      { title: 'Clear Engagement Models', desc: 'Technology Licensing, Joint Mission Development, or embedded engineering support — choose the commercial relationship that fits your program.' },
    ],
    platforms: ['EDGE Payload', 'Swarm Orchestrator', 'GNC Autonomy Stack', 'Radiation-Tolerant Inference Engine'],
    faq: [
      { q: 'What does the technology licensing process look like?', a: 'After a Mission Consultation submission, our BD team will prepare a platform-specific licensing proposal. Typical agreements cover the source license, integration support, maintenance updates, and optional HITL simulation validation.' },
      { q: 'Can EDGE Payload integrate with our existing bus?', a: 'EDGE Payload is designed for modular integration — we support standard serial and SpaceWire interfaces. Full ICD documentation is available under NDA for qualified operators.' },
      { q: 'What is the status of your Swarm Orchestrator?', a: 'The Swarm Orchestrator has been demonstrated across a 6-satellite LEO constellation. It is currently In Development toward flight qualification and is available for early-adopter licensing programs.' },
    ],
  },
  'defense': {
    icon: '⬡',
    color: '#e63c8c',
    title: 'Defense & National Security',
    subtitle: 'Defense Programs · Contested Environments · Secure Operations',
    badge: 'DEFENSE-ADJACENT POSTURE',
    heroDesc: 'Defense-adjacent programs requiring resilient, autonomous systems for contested or communication-denied environments. Andromeda Logic Corp maintains a defense-adjacent security and data-handling posture by default — ITAR/EAR awareness, gated technical content, and a conservative approach to public mission disclosure.',
    valueProps: [
      { title: 'Resilient Autonomy in Denied Environments', desc: 'Our GNC and swarm systems are designed to operate without any communication with ground — making them inherently suitable for contested, jammed, or communication-denied operation profiles.' },
      { title: 'ITAR/EAR Awareness Built In', desc: 'Export-control posture is integrated from day one — not added as an afterthought. Technical content is gated appropriately, and our public website never publishes controlled information.' },
      { title: 'Defensible Security Architecture', desc: 'All gated technical assets use signed, time-limited access URLs. System architecture documentation requires organization/identity verification before download.' },
      { title: 'Trust Center Transparency', desc: 'Our Trust, Compliance & Export Control Center provides a plain-language public statement of our data handling, security practices, and export-control posture.' },
    ],
    platforms: ['GNC Autonomy Stack', 'Swarm Orchestrator', 'EDGE Payload', 'Radiation-Tolerant Inference Engine'],
    faq: [
      { q: 'What is your ITAR/EAR registration status?', a: 'See the Trust, Compliance & Export Control Center for our current posture statement. Specific registration details are available to qualified program representatives through the Mission Consultation path.' },
      { q: 'How do you handle technical data for defense programs?', a: 'Technical data for defense-adjacent programs is handled through our gated-download framework — no controlled information is publicly accessible. Program-specific NDAs are required before detailed technical exchange.' },
      { q: 'Are your systems cleared for use in contested environments?', a: 'Our platforms are designed for communication-denied, high-radiation, and extreme-environment operation profiles that align with contested-environment requirements. Specific clearance questions should be directed through the Mission Consultation form.' },
    ],
    trustLink: true,
  },
  'research': {
    icon: '◈',
    color: '#ffb648',
    title: 'Research Institutions & Academia',
    subtitle: 'Universities · National Labs · Independent Research',
    badge: null,
    heroDesc: 'Universities, national laboratories, and independent research institutions seeking HITL simulation access, joint research programs, or citable technical publications. Research partnerships convert through inquiry forms rather than commercial sales paths.',
    valueProps: [
      { title: 'HITL Simulation Access', desc: 'Access the HITL Digital Twin Suite for mission validation, algorithm testing, and academic research in a high-fidelity orbital and deep-space simulation environment.' },
      { title: 'Joint Research Programs', desc: 'Formal joint research partnerships including simulation access, publication co-authorship, and technical collaboration with Andromeda Logic Corp engineering teams.' },
      { title: 'Technical Library & Whitepapers', desc: 'Access our growing library of technical whitepapers covering autonomous GNC, radiation-tolerant ML, swarm orchestration, and edge computing — filterable by specialty and format.' },
      { title: 'Research Partnership Inquiry Path', desc: 'Dedicated inquiry path for research institutions — separate from commercial licensing, with a focus on collaborative programs and academic co-publication.' },
    ],
    platforms: ['HITL Digital Twin Suite', 'GNC Autonomy Stack', 'Radiation-Tolerant Inference Engine'],
    faq: [
      { q: 'How do we request HITL simulation access?', a: 'Submit a Research Partnership inquiry through our Mission Consultation form (select Research Institutions in the persona selector). We will review your program requirements and propose an access agreement.' },
      { q: 'Can we co-author technical publications?', a: 'Yes — joint publication is a standard element of our Research Partnership program. Contact our Head of Research through the consultation form to discuss scope and terms.' },
      { q: 'Are your whitepapers freely accessible?', a: 'Many whitepapers are open access. Some highly technical assets related to export-sensitive systems require organization/identity verification per our gated-content policy — this is flagged on each resource.' },
    ],
  },
};

const faqs = {
  'space-agencies': [],
  'commercial': [],
  'defense': [],
  'research': [],
};

export default function SolutionDetail() {
  const { slug } = useParams();
  const staticData = personaData[slug];
  const [openFaq, setOpenFaq] = useState(null);

  // Overlay CMS copy (name / narrative) from GET /api/v1/solutions/{slug}
  // onto the curated design content; everything else stays design-managed.
  const { data: live } = useApiResource(() => getPersonaBySlug(slug), [slug]);

  if (!staticData) return <Navigate to="/solutions" replace />;

  const data = {
    ...staticData,
    title: live?.name || staticData.title,
    heroDesc: live?.narrative || staticData.heroDesc,
  };

  return (
    <div className="alc-sol-detail" style={{ '--persona-color': data.color, background: `linear-gradient(rgba(5, 7, 13, 0.75), rgba(5, 7, 13, 0.75)), url(${bgImage}) no-repeat center center fixed`, backgroundSize: 'cover' }}>

      {/* Hero */}
      <section className="alc-sol-detail__hero">
        <div className="alc-container">
          <Link to="/solutions" className="alc-sol-detail__back">← All Solutions</Link>
          <div className="alc-sol-detail__hero-icon">{data.icon}</div>
          <div className="alc-sol-detail__hero-sub">{data.subtitle}</div>
          <h1 className="alc-sol-detail__hero-title">{data.title}</h1>
          <p className="alc-sol-detail__hero-desc">{data.heroDesc}</p>
        </div>
      </section>

      {/* Value Props */}
      <section className="alc-sol-detail__values">
        <div className="alc-container">
          <div className="alc-sol-detail__section-label">WHY ANDROMEDA LOGIC</div>
          <div className="alc-sol-detail__values-grid">
            {data.valueProps.map((v, i) => (
              <div className="alc-sol-detail__value-card" key={i}>
                <div className="alc-sol-detail__value-num">{String(i+1).padStart(2,'0')}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="alc-sol-detail__middle-content">
        {/* Relevant Platforms */}
      <section className="alc-sol-detail__platforms">
        <div className="alc-container">
          <div className="alc-sol-detail__section-label">RELEVANT PLATFORMS</div>
          <h2>Technologies Built for Your Mission</h2>
          <div className="alc-sol-detail__platform-grid">
            {data.platforms.map((p, i) => (
              <Link to="/products" className="alc-sol-detail__platform-card" key={i}>
                <span>{p}</span>
                <span className="alc-sol-detail__platform-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Paths */}
      <section className="alc-sol-detail__engagement">
        <div className="alc-container">
          <div className="alc-sol-detail__section-label">ENGAGEMENT PATHS</div>
          <div className="alc-sol-detail__eng-grid">
            <div className="alc-sol-detail__eng-card">
              <div className="alc-sol-detail__eng-label">Technology Licensing</div>
              <p>License platforms directly for integration into your mission architecture with full integration support.</p>
            </div>
            <div className="alc-sol-detail__eng-card">
              <div className="alc-sol-detail__eng-label">Joint Mission Development</div>
              <p>Embedded engineering team co-development from concept through HITL deployment validation.</p>
            </div>
            <div className="alc-sol-detail__eng-card">
              <div className="alc-sol-detail__eng-label">Research Partnership</div>
              <p>HITL simulation access, joint publications, and academic co-programs for institutions and laboratories.</p>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* Defense Trust Link */}
      {data.trustLink && (
        <section className="alc-sol-detail__trust-band">
          <div className="alc-container">
            <div className="alc-sol-detail__trust-inner">
              <span className="alc-sol-detail__trust-icon">⬡</span>
              <div>
                <h3>Our Security & Compliance Posture</h3>
                <p>Visit the Trust, Compliance & Export Control Center for our full public statement on ITAR/EAR awareness, data handling, security practices, and responsible disclosure.</p>
              </div>
              <Link to="/trust" className="alc-btn-primary" style={{ flexShrink: 0 }}>View Trust Center →</Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="alc-sol-detail__cta">
        <div className="alc-container">
          <div className="alc-sol-detail__cta-inner">
            <h2>Start Your Mission Conversation</h2>
            <p>Submit a Mission Consultation request and we'll route you to the right technical team within 48 hours.</p>
            <div className="alc-sol-detail__cta-btns">
              <Link to="/contact" className="alc-btn-primary">Request Mission Consultation</Link>
              <Link to="/library" className="alc-btn-ghost">Technical Library</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}





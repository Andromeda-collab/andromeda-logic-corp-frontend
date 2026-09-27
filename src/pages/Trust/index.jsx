import './Trust.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getTrustContent } from '../../services/trustService.js';
import useApiResource from '../../hooks/useApiResource.js';

const certifications = [
  { name: 'SOC 2 Type II', desc: 'Trust Services Criteria', status: 'Implemented', category: 'Security' },
  { name: 'ISO/IEC 27001', desc: 'Information Security Management', status: 'Implemented', category: 'Security' },
  { name: 'ITAR Registered', desc: 'Int\'l Traffic in Arms Regulations', status: 'Implemented', category: 'Export Control' },
  { name: 'NIST 800-171', desc: 'Protecting CUI in Nonfederal Systems', status: 'Implemented', category: 'Defense Compliance' },
  { name: 'GDPR Compliance', desc: 'General Data Protection Regulation', status: 'Implemented', category: 'Data Privacy' },
  { name: 'WCAG 2.2 AA', desc: 'Web Accessibility Standard', status: 'Implemented', category: 'Accessibility' },
];

const securityPractices = [
  { icon: '', title: 'Data Sovereignty & Encryption', desc: 'All data at rest is encrypted using AES-256 standards, with our roadmap incorporating quantum-safe encryption protocols. We enforce strict data sovereignty policies based on client region.' },
  { icon: '-^', title: 'Supply Chain Audit Policies', desc: 'Rigorous vendor risk management and continuous supply chain auditing ensure hardware and software components meet defense-grade integrity standards.' },
  { icon: '-', title: 'Incident Response & Uptime SLA', desc: 'Backed by aggressive Uptime SLA commitments, our 24/7 Security Operations Center follows a formalized incident response protocol to guarantee mission continuity.' },
  { icon: 'Y', title: 'Gated Technical Assets', desc: 'Export-sensitive technical assets (spec sheets, architecture documents) require organization and identity verification before download.' },
];

const gatingRules = [
  { tier: 'Public', examples: 'Technology overviews, product capabilities, case study summaries', access: 'Open — no gate' },
  { tier: 'Gated Basic', examples: 'Whitepapers, technical briefings, media kit', access: 'Name + email + organization' },
  { tier: 'Gated Verified', examples: 'Spec sheets, architecture documents, integration documentation', access: 'Identity + organization verification + export-control screening' },
  { tier: 'Program-Level', examples: 'Program-specific technical data, ICD documentation', access: 'NDA + legal review required' },
];

export default function Trust() {
  const [openSection, setOpenSection] = useState(null);

  // CMS-managed Trust content (GET /api/v1/trust/). 404 until seeded — the
  // page then renders from the static copy below.
  const { data: trust } = useApiResource(() => getTrustContent(), []);
  const disclosureEmail =
    trust?.responsible_disclosure_email || 'hr@andromedalc.com';

  return (
    <div className="alc-trust">

      {/* Hero */}
      <section className="alc-trust__hero">
        <div className="alc-container">
          <div className="alc-trust__hero-label">TRUST · COMPLIANCE · EXPORT CONTROL</div>
          <h1 className="alc-trust__hero-title">
            Our Public<br />
            <span className="alc-trust__hero-accent">Trust Posture</span>
          </h1>
          <p className="alc-trust__hero-desc">
            Andromeda Logic Corp serves space agencies, defense programs, and research institutions operating in regulated environments. This page is our plain-language, audit-ready public statement of how we handle data, manage export-control obligations, and maintain a defensible security posture.
          </p>
          <div className="alc-trust__hero-notice">
            <span className="alc-trust__notice-icon">⬡</span>
            <span>This page describes our content-handling posture only — it is not legal guidance. Specific export-control classifications should be reviewed with qualified counsel.</span>
          </div>
        </div>
      </section>

      {/* Compliance Matrix */}
      <section className="alc-trust__certs">
        <div className="alc-container">
          <div className="alc-trust__section-label">COMPLIANCE & CERTIFICATIONS</div>
          <h2>Standards & Regulatory Framework</h2>
          <p className="alc-trust__section-desc">Our compliance posture is a first-class part of our public identity — not buried in a legal footnote. The matrix below reflects current status as of August 2026.</p>
          <div className="alc-trust__cert-grid">
            {certifications.map((c, i) => (
              <div className="alc-trust__cert-card" key={i}>
                <div className="alc-trust__cert-category">{c.category}</div>
                <div className="alc-trust__cert-name">{c.name}</div>
                <div className="alc-trust__cert-desc">{c.desc}</div>
                <div className={`alc-trust__cert-status alc-trust__cert-status--${c.status.toLowerCase().replace(' ', '-')}`}>
                  {c.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Export Control */}
      <section className="alc-trust__export">
        <div className="alc-container">
          <div className="alc-trust__export-inner">
            <div>
              <div className="alc-trust__section-label">EXPORT CONTROL POSTURE</div>
              <h2>ITAR / EAR Awareness Statement</h2>
              <p>{trust?.export_control_posture || 'Andromeda Logic Corp develops technology that may be subject to U.S. International Traffic in Arms Regulations (ITAR) and Export Administration Regulations (EAR). Our public website and content-handling framework is designed around this reality:'}</p>
              <ul className="alc-trust__export-list">
                <li>Technical content that may be subject to export control is <strong>never</strong> placed behind a simple email-capture form alone</li>
                <li>Sensitive technical assets require organization and identity verification appropriate to their classification sensitivity</li>
                <li>NOVA, our AI assistant, is bound by the same gating rules as direct page access — it cannot serve as an alternate ungated path to controlled information</li>
                <li>The Trust Center is the single authoritative public statement of our posture — no other page improvises its own compliance language</li>
              </ul>
              <div className="alc-trust__export-disclaimer">
                {trust?.gated_content_policy || 'Export control classification of specific technical assets is reviewed with qualified export-control counsel before any public release decision is made. Program-specific questions should be directed through the Mission Consultation form.'}
              </div>
            </div>
            <div className="alc-trust__export-visual">
              <div className="alc-trust__tier-stack">
                {gatingRules.map((g, i) => (
                  <div className="alc-trust__tier-card" key={i}>
                    <div className="alc-trust__tier-label">{g.tier}</div>
                    <div className="alc-trust__tier-examples">{g.examples}</div>
                    <div className="alc-trust__tier-access">{g.access}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="alc-trust__security">
        <div className="alc-container">
          <div className="alc-trust__section-label">DATA PRIVACY & SECURITY</div>
          <h2>Security Practices</h2>
          <div className="alc-trust__security-grid">
            {securityPractices.map((s, i) => (
              <div className="alc-trust__security-card" key={i}>
                <div className="alc-trust__security-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Privacy */}
      <section className="alc-trust__privacy">
        <div className="alc-container">
          <div className="alc-trust__privacy-grid">
            <div className="alc-trust__privacy-card">
              <div className="alc-trust__section-label">DATA RETENTION</div>
              <h3>Mission Consultation & Downloads</h3>
              <p>{trust?.data_privacy_practices || 'Mission Consultation submissions and gated-download lead captures are retained only as long as necessary for the business purpose disclosed at the time of collection — per the Privacy Policy linked in our footer. No cross-session data is shared between organizations in our NOVA AI system.'}</p>
            </div>
            <div className="alc-trust__privacy-card">
              <div className="alc-trust__section-label">COOKIE CONSENT</div>
              <h3>Granular Preference Management</h3>
              <p>Our consent gate offers granular preferences (Necessary / Analytics / Marketing) — never a blanket Accept-All. All consent choices are logged server-side for audit. Analytics-category tracking only fires after explicit opt-in is recorded.</p>
            </div>
            <div className="alc-trust__privacy-card">
              <div className="alc-trust__section-label">HOSTING & DATA RESIDENCY</div>
              <h3>Infrastructure & Access Control</h3>
              <p>Gated technical assets are stored on separately access-controlled infrastructure with signed, time-limited download URLs. CDN-fronted marketing pages use edge caching with origin region selection that accounts for the data-residency expectations of our defense-adjacent audience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Responsible Disclosure */}
      <section className="alc-trust__disclosure">
        <div className="alc-container">
          <div className="alc-trust__disclosure-inner">
            <div className="alc-trust__disclosure-label">RESPONSIBLE DISCLOSURE</div>
            <h2>Security Vulnerability Reporting</h2>
            <p>If you discover a security vulnerability in our public systems, we encourage responsible coordinated disclosure. Please contact our security team before public disclosure to allow for remediation.</p>
            <div className="alc-trust__disclosure-contact">
              <div className="alc-trust__contact-item">
                <span className="alc-trust__contact-label">Security Contact</span>
                <span className="alc-trust__contact-value">{disclosureEmail}</span>
              </div>
              <div className="alc-trust__contact-item">
                <span className="alc-trust__contact-label">Response SLA</span>
                <span className="alc-trust__contact-value">48 hours initial acknowledgment</span>
              </div>
              <div className="alc-trust__contact-item">
                <span className="alc-trust__contact-label">PGP Key</span>
                <span className="alc-trust__contact-value">Available on request</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Links */}
      <section className="alc-trust__legal">
        <div className="alc-container">
          <div className="alc-trust__legal-grid">
            <a href="#" className="alc-trust__legal-link">Privacy Policy</a>
            <a href="#" className="alc-trust__legal-link">Terms of Service</a>
            <a href="#" className="alc-trust__legal-link">Cookie Policy</a>
            <a href="#" className="alc-trust__legal-link">Export Control Statement</a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="alc-trust__cta">
        <div className="alc-container">
          <div className="alc-trust__cta-inner">
            <h2>Defense Program or Agency?</h2>
            <p>Submit a Mission Consultation to connect directly with our technical and compliance teams for program-specific questions.</p>
            <div className="alc-trust__cta-btns">
              <Link to="/contact" className="alc-btn-primary">Request Mission Consultation</Link>
              <Link to="/solutions/defense" className="alc-btn-ghost">Defense Solutions</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}


import './Contact.css';
import React, { useState } from 'react';
import { submitMissionConsultation } from '../../services/contactService.js';

const personas = [
  { value: 'space-agency', label: 'Space Agency / National Program' },
  { value: 'commercial', label: 'Commercial Space Operator' },
  { value: 'defense', label: 'Defense & National Security Program' },
  { value: 'research', label: 'Research Institution / Academia' },
  { value: 'other', label: 'Other / General Inquiry' },
];

const missionPhases = [
  { value: 'concept', label: 'Concept / Feasibility' },
  { value: 'formulation', label: 'Mission Formulation' },
  { value: 'development', label: 'Development & Validation' },
  { value: 'operations', label: 'Active Operations' },
  { value: 'not-applicable', label: 'Not Applicable' },
];

const destinations = [
  'Low Earth Orbit (LEO)', 'Medium Earth Orbit (MEO)', 'Geostationary (GEO)',
  'Lunar Orbit / Surface', 'Mars Orbit / Surface', 'Deep Space / Interplanetary',
  'Suborbital', 'Multiple / TBD',
];

const inquiryTypes = [
  { value: 'licensing', label: 'Technology Licensing' },
  { value: 'joint-dev', label: 'Joint Mission Development' },
  { value: 'research', label: 'Research Partnership' },
  { value: 'rfp', label: 'RFP / Procurement Inquiry' },
  { value: 'general', label: 'General Technical Inquiry' },
];

export default function Contact() {
  const [form, setForm] = useState({
    persona: '', name: '', org: '', role: '', email: '', country: '',
    phase: '', destination: '', inquiryType: '', message: '', consent: false,
  });
  const [submitted, setSubmitted] = useState(null); // holds the created record
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [exportNotice, setExportNotice] = useState(false);

  const sensitivePhrases = ['defense', 'national security'];

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'persona' && sensitivePhrases.some(p => value.includes(p.split(' ')[0]))) {
      setExportNotice(true);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitError(null);

    if (!form.persona || !form.name || !form.org || !form.email || !form.country) {
      setSubmitError('Please complete organization type, name, organization, email, and country.');
      return;
    }
    if (!form.consent) {
      setSubmitError('Please confirm the privacy / export-control acknowledgement to continue.');
      return;
    }

    // Map the UI form onto the backend MissionConsultationCreate schema.
    // Fields with no backend column (role note, inquiry type, free-text
    // message, RFP file) are folded into rfp_document_url-adjacent context
    // where sensible and otherwise omitted — see integration notes.
    const payload = {
      persona: form.persona,
      mission_phase: form.phase || null,
      target_orbit_or_destination: form.destination || null,
      timeframe: null,
      name: form.name,
      organization: form.org,
      role: form.role || null,
      email: form.email,
      country: form.country,
      rfp_document_url: null,
      consent_given: form.consent,
    };

    setSending(true);
    submitMissionConsultation(payload)
      .then(res => setSubmitted(res.data))
      .catch(err =>
        setSubmitError(err?.uiMessage || 'Could not submit your request. Please try again.')
      )
      .finally(() => setSending(false));
  };

  if (submitted) {
    return (
      <div className="alc-contact">
        <div className="alc-contact__success">
          <div className="alc-contact__success-icon">◈</div>
          <h2>Mission Consultation Request Submitted</h2>
          <p>Your request has been received. Our team will review your mission profile and respond within 48 hours. You'll receive a confirmation at the email address provided.</p>
          <div className="alc-contact__success-detail">
            <span>Ref: ALC-{String(submitted.id ?? Date.now()).padStart(8, '0').slice(-8)}</span>
            <span>Response SLA: 48 hours</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="alc-contact">

      {/* Hero */}
      <section className="alc-contact__hero">
        <div className="alc-container">
          <div className="alc-contact__hero-label">MISSION CONSULTATION</div>
          <h1 className="alc-contact__hero-title">
            Request a<br />
            <span className="alc-contact__hero-accent">Mission Consultation</span>
          </h1>
          <p className="alc-contact__hero-desc">
            This form is the single structured lead-capture surface for all engagement paths — technology licensing, joint mission development, or research partnership. Share your mission context and we'll route you to the right team.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="alc-contact__form-section">
        <div className="alc-container">
          <div className="alc-contact__layout">

            {/* Sidebar */}
            <aside className="alc-contact__sidebar">
              <div className="alc-contact__sidebar-card">
                <div className="alc-contact__sidebar-label">RESPONSE SLA</div>
                <div className="alc-contact__sidebar-value">48 Hours</div>
                <p>Initial acknowledgment and routing to the appropriate technical team.</p>
              </div>
              <div className="alc-contact__sidebar-card">
                <div className="alc-contact__sidebar-label">ENGAGEMENT PATHS</div>
                <ul className="alc-contact__sidebar-list">
                  <li>Technology Licensing</li>
                  <li>Joint Mission Development</li>
                  <li>Research Partnership</li>
                  <li>RFP / Procurement</li>
                </ul>
              </div>
              <div className="alc-contact__sidebar-card alc-contact__sidebar-card--notice">
                <div className="alc-contact__sidebar-label">PRESS CONTACT</div>
                <p>For media inquiries, contact <strong>hr@andromedalc.com</strong></p>
              </div>
              <div className="alc-contact__sidebar-card alc-contact__sidebar-card--notice">
                <div className="alc-contact__sidebar-label">SECURITY CONTACT</div>
                <p>Responsible disclosure: <strong>hr@andromedalc.com</strong></p>
              </div>
            </aside>

            {/* Main Form */}
            <form className="alc-contact__form" onSubmit={handleSubmit} noValidate>

              {/* Step 1: Who are you */}
              <div className="alc-contact__form-section-header">
                <span className="alc-contact__step">01</span>
                <h3>Your Organization Type</h3>
              </div>

              <div className="alc-contact__persona-grid">
                {personas.map(p => (
                  <label
                    key={p.value}
                    className={`alc-contact__persona-option ${form.persona === p.value ? 'is-selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="persona"
                      value={p.value}
                      checked={form.persona === p.value}
                      onChange={handleChange}
                    />
                    {p.label}
                  </label>
                ))}
              </div>

              {exportNotice && (
                <div className="alc-contact__export-notice">
                  <span>⬡</span>
                  <span>Defense-adjacent inquiries are subject to our export-control posture. See the <a href="/trust">Trust Center</a> for details on how we handle technical data for defense programs.</span>
                </div>
              )}

              {/* Step 2: Contact Info */}
              <div className="alc-contact__form-section-header" style={{ marginTop: 40 }}>
                <span className="alc-contact__step">02</span>
                <h3>Contact Information</h3>
              </div>

              <div className="alc-contact__fields-grid">
                <div className="alc-contact__field">
                  <label>Full Name *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Dr. Arjun Kapoor" />
                </div>
                <div className="alc-contact__field">
                  <label>Organization *</label>
                  <input type="text" name="org" value={form.org} onChange={handleChange} required placeholder="NASA JPL / ISRO / ESA..." />
                </div>
                <div className="alc-contact__field">
                  <label>Role / Title</label>
                  <input type="text" name="role" value={form.role} onChange={handleChange} placeholder="Mission Director, Chief Engineer..." />
                </div>
                <div className="alc-contact__field">
                  <label>Email Address *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="name@organization.gov" />
                </div>
                <div className="alc-contact__field">
                  <label>Country *</label>
                  <input type="text" name="country" value={form.country} onChange={handleChange} required placeholder="India, USA, Germany..." />
                </div>
              </div>

              {/* Step 3: Mission Context */}
              <div className="alc-contact__form-section-header" style={{ marginTop: 40 }}>
                <span className="alc-contact__step">03</span>
                <h3>Mission Context</h3>
              </div>

              <div className="alc-contact__fields-grid">
                <div className="alc-contact__field">
                  <label>Mission Phase</label>
                  <select name="phase" value={form.phase} onChange={handleChange}>
                    <option value="">Select phase...</option>
                    {missionPhases.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>
                <div className="alc-contact__field">
                  <label>Target Orbit / Destination</label>
                  <select name="destination" value={form.destination} onChange={handleChange}>
                    <option value="">Select destination...</option>
                    {destinations.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="alc-contact__field">
                  <label>Inquiry Type</label>
                  <select name="inquiryType" value={form.inquiryType} onChange={handleChange}>
                    <option value="">Select type...</option>
                    {inquiryTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="alc-contact__field" style={{ marginTop: 16 }}>
                <label>Mission Description / Requirements</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Describe your mission objectives, technical requirements, timeline, and any specific questions for our engineering team..."
                  rows={6}
                />
              </div>

              {/* Step 4: File Upload */}
              <div className="alc-contact__form-section-header" style={{ marginTop: 40 }}>
                <span className="alc-contact__step">04</span>
                <h3>Attach RFP or Technical Requirement Document <span className="alc-contact__optional">(Optional)</span></h3>
              </div>
              <div className="alc-contact__upload-zone">
                <input type="file" id="rfp-upload" accept=".pdf,.doc,.docx" style={{ display: 'none' }} />
                <label htmlFor="rfp-upload" className="alc-contact__upload-label">
                  <span className="alc-contact__upload-icon">⬡</span>
                  <span>Drop RFP or spec document here, or <u>browse to upload</u></span>
                  <span className="alc-contact__upload-sub">PDF, DOC, DOCX · Max 20MB</span>
                </label>
              </div>

              {/* Consent */}
              <div className="alc-contact__consent">
                <label className="alc-contact__consent-label">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={form.consent}
                    onChange={handleChange}
                    required
                  />
                  <span>
                    I have read and agree to the <a href="/trust">Privacy Policy</a> and understand that my submission may be subject to export-control screening. I confirm the information provided is accurate.
                  </span>
                </label>
              </div>

              {submitError && (
                <div
                  role="alert"
                  style={{
                    margin: '16px 0 0',
                    padding: '10px 14px',
                    borderRadius: 8,
                    fontSize: 13,
                    color: 'var(--alc-signal-white, #f5f7ff)',
                    border: '1px solid var(--alc-nebula-magenta, #e63c8c)',
                    background: 'rgba(230,60,140,0.08)',
                  }}
                >
                  {submitError}
                </div>
              )}

              <button type="submit" className="alc-contact__submit" disabled={sending}>
                {sending ? 'Submitting…' : 'Submit Mission Consultation Request →'}
              </button>

            </form>
          </div>
        </div>
      </section>

    </div>
  );
}

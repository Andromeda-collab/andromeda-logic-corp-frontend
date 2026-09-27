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
  'Low Earth Orbit (LEO)',
  'Medium Earth Orbit (MEO)',
  'Geostationary (GEO)',
  'Lunar Orbit / Surface',
  'Mars Orbit / Surface',
  'Deep Space / Interplanetary',
  'Suborbital',
  'Multiple / TBD',
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
    persona: '',
    name: '',
    org: '',
    role: '',
    email: '',
    country: '',
    phase: '',
    destination: '',
    inquiryType: '',
    message: '',
    consent: false,
  });

  const [submitted, setSubmitted] = useState(null);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [exportNotice, setExportNotice] = useState(false);

  const sensitivePhrases = ['defense', 'national security'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (
      name === 'persona' &&
      sensitivePhrases.some((phrase) =>
        value.includes(phrase.split(' ')[0])
      )
    ) {
      setExportNotice(true);
    } else if (name === 'persona') {
      setExportNotice(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (
      !form.persona ||
      !form.name ||
      !form.org ||
      !form.email ||
      !form.country
    ) {
      setSubmitError(
        'Please complete organization type, name, organization, email, and country.'
      );
      return;
    }

    if (!form.consent) {
      setSubmitError(
        'Please confirm the privacy / export-control acknowledgement to continue.'
      );
      return;
    }

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
      .then((res) => setSubmitted(res.data))
      .catch((err) =>
        setSubmitError(
          err?.uiMessage ||
            'Could not submit your request. Please try again.'
        )
      )
      .finally(() => setSending(false));
  };

  if (submitted) {
    return (
      <div className="alc-contact">
        <div className="alc-contact__success">
          <div className="alc-contact__success-icon">◈</div>

          <h2>Mission Consultation Request Submitted</h2>

          <p>
            Your request has been received. Our team will review your mission
            profile and respond within 48 hours. You'll receive a confirmation
            at the email address provided.
          </p>

          <div className="alc-contact__success-detail">
            <span>
              Ref: ALC-
              {String(submitted.id ?? Date.now())
                .padStart(8, '0')
                .slice(-8)}
            </span>

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
          <div className="alc-contact__hero-label">
            MISSION CONSULTATION
          </div>

          <h1 className="alc-contact__hero-title">
            Request a
            <br />
            <span className="alc-contact__hero-accent">
              Mission Consultation
            </span>
          </h1>

          <p className="alc-contact__hero-desc">
            This form is the single structured lead-capture surface for all
            engagement paths — technology licensing, joint mission
            development, or research partnership. Share your mission context
            and we'll route you to the right team.
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
                <div className="alc-contact__sidebar-label">
                  RESPONSE SLA
                </div>
                <div className="alc-contact__sidebar-value">
                  48 Hours
                </div>
                <p>
                  Initial acknowledgment and routing to the appropriate
                  technical team.
                </p>
              </div>

              <div className="alc-contact__sidebar-card">
                <div className="alc-contact__sidebar-label">
                  ENGAGEMENT PATHS
                </div>

                <ul className="alc-contact__sidebar-list">
                  <li>Technology Licensing</li>
                  <li>Joint Mission Development</li>
                  <li>Research Partnership</li>
                  <li>RFP / Procurement</li>
                </ul>
              </div>

              <div className="alc-contact__sidebar-card alc-contact__sidebar-card--notice">
                <div className="alc-contact__sidebar-label">
                  PRESS CONTACT
                </div>

                <p>
                  For media inquiries, contact{' '}
                  <strong>hr@andromedalc.com</strong>
                </p>
              </div>

              <div className="alc-contact__sidebar-card alc-contact__sidebar-card--notice">
                <div className="alc-contact__sidebar-label">
                  SECURITY CONTACT
                </div>

                <p>
                  Responsible disclosure:{' '}
                  <strong>hr@andromedalc.com</strong>
                </p>
              </div>
            </aside>

            {/* Main Form */}
            <form
              className="alc-contact__form"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Step 1 */}
              <div className="alc-contact__form-section-header">
                <span className="alc-contact__step">01</span>
                <h3>Your Organization Type</h3>
              </div>

              <div className="alc-contact__persona-grid">
                {personas.map((persona) => (
                  <label
                    key={persona.value}
                    className={`alc-contact__persona-option ${
                      form.persona === persona.value
                        ? 'is-selected'
                        : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="persona"
                      value={persona.value}
                      checked={form.persona === persona.value}
                      onChange={handleChange}
                    />

                    {persona.label}
                  </label>
                ))}
              </div>

              {exportNotice && (
                <div className="alc-contact__export-notice">
                  <span aria-hidden="true">⬡</span>
                  <span>
                    Defense-adjacent inquiries are subject to our
                    export-control posture. See the{' '}
                    <a href="/trust">Trust Center</a> for details on how we
                    handle technical data for defense programs.
                  </span>
                </div>
              )}

              {/* Step 2 */}
              <div className="alc-contact__form-section-header alc-contact__form-section-header--spaced">
                <span className="alc-contact__step">02</span>
                <h3>Contact Information</h3>
              </div>

              <div className="alc-contact__fields-grid">
                <div className="alc-contact__field">
                  <label htmlFor="contact-name">Full Name *</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Dr. Arjun Kapoor"
                  />
                </div>

                <div className="alc-contact__field">
                  <label htmlFor="contact-org">Organization *</label>
                  <input
                    id="contact-org"
                    type="text"
                    name="org"
                    value={form.org}
                    onChange={handleChange}
                    required
                    placeholder="NASA JPL / ISRO / ESA..."
                  />
                </div>

                <div className="alc-contact__field">
                  <label htmlFor="contact-role">Role / Title</label>
                  <input
                    id="contact-role"
                    type="text"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    placeholder="Mission Director, Chief Engineer..."
                  />
                </div>

                <div className="alc-contact__field">
                  <label htmlFor="contact-email">Email Address *</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="name@organization.gov"
                  />
                </div>

                <div className="alc-contact__field">
                  <label htmlFor="contact-country">Country *</label>
                  <input
                    id="contact-country"
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    required
                    placeholder="India, USA, Germany..."
                  />
                </div>
              </div>

              {/* Step 3 */}
              <div className="alc-contact__form-section-header alc-contact__form-section-header--spaced">
                <span className="alc-contact__step">03</span>
                <h3>Mission Context</h3>
              </div>

              <div className="alc-contact__fields-grid">
                <div className="alc-contact__field">
                  <label htmlFor="contact-phase">Mission Phase</label>
                  <select
                    id="contact-phase"
                    name="phase"
                    value={form.phase}
                    onChange={handleChange}
                  >
                    <option value="">Select phase...</option>

                    {missionPhases.map((phase) => (
                      <option key={phase.value} value={phase.value}>
                        {phase.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="alc-contact__field">
                  <label htmlFor="contact-destination">
                    Target Orbit / Destination
                  </label>
                  <select
                    id="contact-destination"
                    name="destination"
                    value={form.destination}
                    onChange={handleChange}
                  >
                    <option value="">Select destination...</option>

                    {destinations.map((destination) => (
                      <option
                        key={destination}
                        value={destination}
                      >
                        {destination}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="alc-contact__field">
                  <label htmlFor="contact-inquiry">
                    Inquiry Type
                  </label>
                  <select
                    id="contact-inquiry"
                    name="inquiryType"
                    value={form.inquiryType}
                    onChange={handleChange}
                  >
                    <option value="">Select type...</option>

                    {inquiryTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="alc-contact__field alc-contact__message-field">
                <label htmlFor="contact-message">
                  Mission Description / Requirements
                </label>

                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Describe your mission objectives, technical requirements, timeline, and any specific questions for our engineering team..."
                  rows={6}
                />
              </div>

              {/* Step 4 */}
              <div className="alc-contact__form-section-header alc-contact__form-section-header--spaced">
                <span className="alc-contact__step">04</span>

                <h3>
                  Attach RFP or Technical Requirement Document{' '}
                  <span className="alc-contact__optional">
                    (Optional)
                  </span>
                </h3>
              </div>

              <div className="alc-contact__upload-zone">
                <input
                  type="file"
                  id="rfp-upload"
                  accept=".pdf,.doc,.docx"
                  style={{ display: 'none' }}
                />

                <label
                  htmlFor="rfp-upload"
                  className="alc-contact__upload-label"
                >
                  <span className="alc-contact__upload-icon">⬡</span>

                  <span>
                    Drop RFP or spec document here, or{' '}
                    <u>browse to upload</u>
                  </span>

                  <span className="alc-contact__upload-sub">
                    PDF, DOC, DOCX · Max 20MB
                  </span>
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
                    I have read and agree to the{' '}
                    <a href="/trust">Privacy Policy</a> and understand
                    that my submission may be subject to export-control
                    screening. I confirm the information provided is
                    accurate.
                  </span>
                </label>
              </div>

              {submitError && (
                <div
                  className="alc-contact__error"
                  role="alert"
                >
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                className="alc-contact__submit"
                disabled={sending}
              >
                {sending
                  ? 'Submitting…'
                  : 'Submit Mission Consultation Request →'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

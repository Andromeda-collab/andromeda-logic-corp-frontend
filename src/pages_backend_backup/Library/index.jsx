import './Library.css';
import React, { useMemo, useState } from 'react';
import {
  getLibraryResources,
  requestGatedDownload,
} from '../../services/libraryService.js';
import useApiResource from '../../hooks/useApiResource.js';
import ApiState from '../../components/common/ApiState.jsx';

const ASSET_TYPES = [
  { value: '', label: 'All formats' },
  { value: 'whitepaper', label: 'Whitepaper' },
  { value: 'spec_sheet', label: 'Spec Sheet' },
  { value: 'briefing', label: 'Briefing' },
  { value: 'case_study', label: 'Case Study' },
];

function prettyType(t) {
  const found = ASSET_TYPES.find((a) => a.value === t);
  return found ? found.label : t || 'Resource';
}

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? String(value)
    : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
}

// One card + its inline "request access" form for gated resources.
function ResourceCard({ resource }) {
  const [form, setForm] = useState({ name: '', email: '', organization: '' });
  const [state, setState] = useState({ sending: false, error: null, done: null });

  const submit = (e) => {
    e.preventDefault();
    setState({ sending: true, error: null, done: null });
    requestGatedDownload(resource.slug, form)
      .then((res) => setState({ sending: false, error: null, done: res.data }))
      .catch((err) =>
        setState({
          sending: false,
          error: err?.uiMessage || 'Request failed.',
          done: null,
        })
      );
  };

  return (
    <article className="alc-library__card">
      <div className="alc-library__card-meta">
        <span className="alc-library__card-type">{prettyType(resource.asset_type)}</span>
        {resource.published_date && <span>· {formatDate(resource.published_date)}</span>}
      </div>
      <h3>{resource.title}</h3>
      {(resource.specialty_tag || resource.persona_tag) && (
        <div className="alc-library__tags">
          {resource.specialty_tag && <span>{resource.specialty_tag}</span>}
          {resource.persona_tag && <span>{resource.persona_tag}</span>}
        </div>
      )}

      <div className="alc-library__card-footer">
        {!resource.is_gated && resource.file_url && (
          <a
            className="alc-library__btn"
            href={resource.file_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download →
          </a>
        )}
        {!resource.is_gated && !resource.file_url && (
          <span className="alc-library__gated">Download link pending</span>
        )}

        {resource.is_gated && !state.done && (
          <>
            <div className="alc-library__gated">⬡ Requires organization verification</div>
            <form className="alc-library__reqform" onSubmit={submit}>
              <input
                type="text"
                placeholder="Full name *"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Work email *"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Organization *"
                required
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
              />
              <button
                type="submit"
                className="alc-library__btn"
                disabled={state.sending}
              >
                {state.sending ? 'Submitting…' : 'Request Access'}
              </button>
              {state.error && (
                <span className="alc-library__gated">{state.error}</span>
              )}
            </form>
          </>
        )}

        {resource.is_gated && state.done && (
          <div className="alc-library__reqmsg">
            Request received — status: {state.done.status || 'pending_review'}.
            Our team will review and follow up by email.
          </div>
        )}
      </div>
    </article>
  );
}

export default function Library() {
  const [assetType, setAssetType] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [persona, setPersona] = useState('');

  const params = useMemo(() => {
    const p = {};
    if (assetType) p.asset_type = assetType;
    if (specialty) p.specialty = specialty;
    if (persona) p.persona = persona;
    return p;
  }, [assetType, specialty, persona]);

  const { data, loading, error, reload } = useApiResource(
    () => getLibraryResources(params),
    [assetType, specialty, persona]
  );

  const resources = Array.isArray(data) ? data : [];

  // Build filter options from whatever tags the returned resources carry.
  const specialtyOptions = useMemo(
    () => Array.from(new Set(resources.map((r) => r.specialty_tag).filter(Boolean))),
    [resources]
  );
  const personaOptions = useMemo(
    () => Array.from(new Set(resources.map((r) => r.persona_tag).filter(Boolean))),
    [resources]
  );

  return (
    <div className="alc-library">
      <div className="alc-library__hero">
        <h1>Technical Library</h1>
        <p>
          Whitepapers, spec sheets, briefings, and case studies. Export-sensitive
          assets are gated and require organization verification before download.
        </p>
      </div>

      <div className="alc-library__body">
        <div className="alc-library__filters">
          <label>
            Format
            <select value={assetType} onChange={(e) => setAssetType(e.target.value)}>
              {ASSET_TYPES.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </label>
          <label>
            Specialty
            <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
              <option value="">All specialties</option>
              {specialtyOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Audience
            <select value={persona} onChange={(e) => setPersona(e.target.value)}>
              <option value="">All audiences</option>
              {personaOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </label>
        </div>

        <ApiState loading={loading} error={error} onRetry={reload} label="library resources" />

        {!loading && !error && resources.length === 0 && (
          <p className="alc-library__empty">
            No resources published yet. Once the CMS is seeded, they will appear here.
          </p>
        )}

        <div className="alc-library__grid">
          {resources.map((r) => (
            <ResourceCard key={r.slug || r.id} resource={r} />
          ))}
        </div>
      </div>
    </div>
  );
}

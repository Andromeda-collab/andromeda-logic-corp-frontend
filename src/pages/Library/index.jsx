import './Library.css';
import React, { useMemo, useState } from 'react';
import { getLibraryResources, requestGatedDownload } from '../../services/libraryService.js';
import useApiResource from '../../hooks/useApiResource.js';
import resolveFileUrl from '../../utils/resolveFileUrl.js';

const ASSET_TYPES = [
  { value: '', label: 'All formats' },
  { value: 'whitepaper', label: 'Whitepaper' },
  { value: 'spec_sheet', label: 'Spec Sheet' },
  { value: 'briefing', label: 'Briefing' },
  { value: 'case_study', label: 'Case Study' },
];

const DUMMY_RESOURCES = [
  {
    id: 1,
    title: 'Autonomous Navigation in High-Radiation Environments',
    asset_type: 'whitepaper',
    specialty_tag: 'Autonomy',
    persona_tag: 'Space Agencies',
    published_date: '2026-08-15',
    is_gated: false,
    file_url: '#',
    desc: 'An overview of GNC strategies utilizing the Andromeda radiation-tolerant inference engine.'
  },
  {
    id: 2,
    title: 'HITL Simulation Suite Architecture',
    asset_type: 'spec_sheet',
    specialty_tag: 'Simulation',
    persona_tag: 'Commercial',
    published_date: '2026-07-22',
    is_gated: false,
    file_url: '#',
    desc: 'Technical specifications and I/O capabilities for the hardware-in-the-loop simulation environment.'
  },
  {
    id: 3,
    title: 'EDGE Payload Integration Guide',
    asset_type: 'briefing',
    specialty_tag: 'Edge Compute',
    persona_tag: 'Defense',
    published_date: '2026-06-10',
    is_gated: true,
    file_url: null,
    desc: 'Export-controlled integration parameters for the Andromeda EDGE Payload system.'
  },
  {
    id: 4,
    title: 'Lunar Swarm Orchestration Study',
    asset_type: 'case_study',
    specialty_tag: 'Swarm',
    persona_tag: 'Research',
    published_date: '2026-09-01',
    is_gated: false,
    file_url: '#',
    desc: 'Performance metrics from the recent simulated lunar rover swarm deployment.'
  }
];

function prettyType(t) {
  const found = ASSET_TYPES.find((a) => a.value === t);
  return found ? found.label : t || 'Resource';
}

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
}

function ResourceCard({ resource }) {
  const [form, setForm] = useState({ name: '', email: '', organization: '' });
  const [state, setState] = useState({ sending: false, error: null, done: null });

  const submit = (e) => {
    e.preventDefault();
    setState({ sending: true, error: null, done: null });
    requestGatedDownload(resource.slug || resource.id, form)
      .then((res) => setState({ sending: false, error: null, done: res.data || { status: 'pending_review' } }))
      .catch((err) => setState({ sending: false, error: 'Demo mode: request simulated successfully.', done: { status: 'pending_review' } }));
  };

  return (
    <article className="alc-library-card">
      <div className="alc-library-card-header">
        <span className="alc-library-type">{prettyType(resource.asset_type)}</span>
        <span className={resource.is_gated ? "alc-library-gated" : "alc-library-open"}>
          {resource.is_gated ? 'GATED ACCESS' : 'OPEN ACCESS'}
        </span>
      </div>
      <h2>{resource.title}</h2>
      <p className="alc-library-desc">{resource.desc || 'Technical documentation for Andromeda Logic systems.'}</p>
      
      <div className="alc-library-meta">
        {resource.specialty_tag && <span className="alc-meta-tag">{resource.specialty_tag}</span>}
        {resource.persona_tag && <span className="alc-meta-tag">{resource.persona_tag}</span>}
        {resource.published_date && <span className="alc-meta-date">{formatDate(resource.published_date)}</span>}
      </div>

      <div className="alc-library-card-footer">
        {!resource.is_gated ? (
          <a className="alc-library-btn" href={(resource.file_url && resource.file_url !== '#') ? resolveFileUrl(resource.file_url) : '#'} target="_blank" rel="noopener noreferrer">Download PDF &rarr;</a>
        ) : (
          !state.done ? (
            <form onSubmit={submit} style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
              <input type="email" placeholder="Work email" required style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px', borderRadius: '4px' }} value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              <button type="submit" className="alc-library-btn" disabled={state.sending}>{state.sending ? 'Submitting...' : 'Request Access &rarr;'}</button>
              {state.error && <span style={{ color: '#29e3d9', fontSize: '12px' }}>{state.error}</span>}
            </form>
          ) : (
            <span style={{ color: '#29e3d9', fontSize: '12px' }}>Request received. Under review.</span>
          )
        )}
      </div>
    </article>
  );
}

export default function Library() {
  const [assetType, setAssetType] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [persona, setPersona] = useState('');
  const [search, setSearch] = useState('');

  const params = useMemo(() => {
    const p = {};
    if (assetType) p.asset_type = assetType;
    if (specialty) p.specialty = specialty;
    if (persona) p.persona = persona;
    return p;
  }, [assetType, specialty, persona]);

  const { data, loading, error } = useApiResource(() => getLibraryResources(params), [assetType, specialty, persona]);

  let resources = Array.isArray(data) && data.length > 0 ? data : DUMMY_RESOURCES;
  
  // Apply local filtering for dummy data or if API didn't filter
  resources = resources.filter(r => {
    if (assetType && r.asset_type !== assetType) return false;
    if (specialty && r.specialty_tag !== specialty) return false;
    if (persona && r.persona_tag !== persona) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const specialtyOptions = useMemo(() => Array.from(new Set(resources.map(r => r.specialty_tag).filter(Boolean))), [resources]);
  const personaOptions = useMemo(() => Array.from(new Set(resources.map(r => r.persona_tag).filter(Boolean))), [resources]);

  return (
    <div className="alc-library">
      <div className="alc-library-bg">
        <div className="alc-library-grid-lines" />
        <div className="alc-library-glow" />
      </div>

      <div className="alc-library-container">
        <div className="alc-library-hero">
          <span className="alc-library-eyebrow">Technical Library</span>
          <h1>Mission Intelligence</h1>
          <p>
            Whitepapers, spec sheets, briefings, and case studies. Export-sensitive
            assets are gated and require organization verification before download.
          </p>
        </div>

        <div className="alc-library-layout">
          <div className="alc-library-toolbar">
            <div className="alc-library-search">
              <span className="alc-search-icon">&#9906;</span>
              <input type="text" placeholder="Search resources..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            
            <div className="alc-library-filters">
              <div className="alc-filter-group">
                <label>Format</label>
                <select value={assetType} onChange={(e) => setAssetType(e.target.value)}>
                  {ASSET_TYPES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
              </div>
              <div className="alc-filter-group">
                <label>Specialty</label>
                <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
                  <option value="">All specialties</option>
                  {specialtyOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="alc-filter-group">
                <label>Audience</label>
                <select value={persona} onChange={(e) => setPersona(e.target.value)}>
                  <option value="">All audiences</option>
                  {personaOptions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="alc-library-grid">
            {resources.map(r => (
              <ResourceCard key={r.slug || r.id} resource={r} />
            ))}
          </div>

          {resources.length === 0 && (
            <div className="alc-library-empty">
              <p>No resources found matching your criteria.</p>
              <button onClick={() => { setAssetType(''); setSpecialty(''); setPersona(''); setSearch(''); }}>Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

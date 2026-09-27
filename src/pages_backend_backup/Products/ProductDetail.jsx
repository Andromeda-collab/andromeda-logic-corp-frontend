import './Products.css';
import { useParams, Link } from "react-router-dom";
import { getPlatformBySlug } from "../../services/productsService.js";
import useApiResource from "../../hooks/useApiResource.js";
import ApiState from "../../components/common/ApiState.jsx";

const STATUS_META = {
  'flight-proven': { label: 'Flight-Proven', className: 'status-flight-proven' },
  'in-development': { label: 'In Development', className: 'status-in-development' },
  'roadmap': { label: 'Roadmap', className: 'status-roadmap' },
};

// Product detail page — /products/{platformSlug} — Section 9.3.
export default function ProductDetail() {
  const { platformSlug } = useParams();
  const { data, loading, error, reload } = useApiResource(
    () => getPlatformBySlug(platformSlug),
    [platformSlug]
  );

  const meta = data ? STATUS_META[data.status] : null;
  // capability_blocks is a free-text / JSON string field on the backend.
  let capabilities = [];
  if (data?.capability_blocks) {
    try {
      const parsed = JSON.parse(data.capability_blocks);
      capabilities = Array.isArray(parsed) ? parsed : [];
    } catch {
      capabilities = String(data.capability_blocks)
        .split(/\r?\n|;|,/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  return (
    <div className="alc-products">
      <div className="alc-products__hero">
        <Link to="/products" className="btn-ghost">← All Platforms</Link>
        <h1>{data?.name || (loading ? "Loading…" : "Platform")}</h1>
        {data?.one_line_pitch && <p>{data.one_line_pitch}</p>}
      </div>

      <div className="alc-products__grid" style={{ display: "block" }}>
        <ApiState loading={loading} error={error} onRetry={reload} label="platform" />

        {data && (
          <div className="platform-card">
            {meta && (
              <div className="platform-card__header">
                <span className={`status-badge ${meta.className}`}>{meta.label}</span>
              </div>
            )}
            {capabilities.length > 0 && (
              <ul>
                {capabilities.map((c, i) => (
                  <li key={i}>{typeof c === "string" ? c : c.title || JSON.stringify(c)}</li>
                ))}
              </ul>
            )}
            {data.is_export_controlled && (
              <p style={{ color: "var(--alc-solar-amber, #ffb648)", fontSize: 13 }}>
                ⬡ Export-controlled — spec sheet access requires organization verification.
              </p>
            )}
            <div className="platform-card__footer">
              {data.spec_sheet_url ? (
                <a className="btn-secondary" href={data.spec_sheet_url} target="_blank" rel="noopener noreferrer">
                  Spec Sheet →
                </a>
              ) : (
                <Link to="/library" className="btn-secondary">Technical Library</Link>
              )}
              <Link to="/contact" className="btn-primary">Request Licensing Info</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

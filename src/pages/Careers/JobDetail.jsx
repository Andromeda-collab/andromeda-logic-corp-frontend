import './Careers.css';
import { useParams, Link } from "react-router-dom";
import { getRequisitionBySlug } from "../../services/careersService.js";
import useApiResource from "../../hooks/useApiResource.js";
import ApiState from "../../components/common/ApiState.jsx";

// Job Requisition detail — /careers/{jobSlug} — Section 9.8.
export default function JobDetail() {
  const { jobSlug } = useParams();
  const { data, loading, error, reload } = useApiResource(
    () => getRequisitionBySlug(jobSlug),
    [jobSlug]
  );

  return (
    <div className="alc-careers">
      <section className="alc-careers__hero">
        <div className="alc-container">
          <Link to="/careers" className="alc-btn-ghost">← All Roles</Link>
          <h1 className="alc-careers__hero-title">
            {data?.title || (loading ? "Loading…" : "Role")}
          </h1>
          {data && (
            <div className="alc-careers__role-meta">
              <span>{data.discipline}</span>
              {data.location && (<><span>·</span><span>{data.location}</span></>)}
              <span>·</span>
              <span>{data.requires_clearance ? "Clearance Required" : "No Clearance Required"}</span>
              {!data.is_open && (<><span>·</span><span>Closed</span></>)}
            </div>
          )}
        </div>
      </section>

      <section className="alc-careers__roles">
        <div className="alc-container">
          <ApiState loading={loading} error={error} onRetry={reload} label="role" />

          {data && (
            <div className="alc-careers__role-body">
              {data.description && <p className="alc-careers__role-desc">{data.description}</p>}
              <div className="alc-careers__role-clearance">
                Clearance: <span>{data.requires_clearance ? "Required" : "None Required"}</span>
              </div>
              <Link to="/contact" className="alc-careers__apply-btn">
                Apply via Mission Consultation →
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

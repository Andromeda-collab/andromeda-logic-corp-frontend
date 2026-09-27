import './CaseStudies.css';
import { useParams, Link } from "react-router-dom";
import { getMissionBySlug } from "../../services/caseStudiesService.js";
import useApiResource from "../../hooks/useApiResource.js";
import ApiState from "../../components/common/ApiState.jsx";

// Mission detail page — /missions/{missionSlug} — Section 9.6.
export default function CaseStudyDetail() {
  const { missionSlug } = useParams();
  const { data, loading, error, reload } = useApiResource(
    () => getMissionBySlug(missionSlug),
    [missionSlug]
  );

  const tech = (data?.technology_used || "")
    .split(/\r?\n|;|,|•/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="alc-missions">
      <section className="alc-missions__hero">
        <div className="alc-container">
          <Link to="/missions" className="alc-btn-ghost">← All Case Studies</Link>
          <h1 className="alc-missions__hero-title">
            {data?.title || (loading ? "Loading…" : "Mission")}
          </h1>
          {data?.summary && <p className="alc-missions__hero-desc">{data.summary}</p>}
        </div>
      </section>

      <section className="alc-missions__grid-section">
        <div className="alc-container">
          <ApiState loading={loading} error={error} onRetry={reload} label="mission story" />

          {data && (
            <div className="alc-missions__story">
              {data.challenge && (
                <div className="alc-missions__story-section">
                  <div className="alc-missions__story-label">CHALLENGE</div>
                  <p>{data.challenge}</p>
                </div>
              )}
              {data.approach && (
                <div className="alc-missions__story-section">
                  <div className="alc-missions__story-label">APPROACH</div>
                  <p>{data.approach}</p>
                </div>
              )}
              {data.outcome && (
                <div className="alc-missions__story-section">
                  <div className="alc-missions__story-label">OUTCOME</div>
                  <p>{data.outcome}</p>
                </div>
              )}
              {tech.length > 0 && (
                <div className="alc-missions__story-tech">
                  <div className="alc-missions__story-label">TECHNOLOGY USED</div>
                  <div className="alc-missions__tech-tags">
                    {tech.map((t, i) => <span key={i}>{t}</span>)}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="alc-missions__cta-btns" style={{ marginTop: 32 }}>
            <Link to="/contact" className="alc-btn-primary">Request Mission Consultation</Link>
            <Link to="/products" className="alc-btn-ghost">View All Platforms</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

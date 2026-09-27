import './Technology.css';
import { useParams, Link } from "react-router-dom";
import { getSpecialtyBySlug } from "../../services/technologyService.js";
import useApiResource from "../../hooks/useApiResource.js";
import ApiState from "../../components/common/ApiState.jsx";

// Specialty Deep-Dive detail page — /technology/{specialtySlug} — Section 9.2.
export default function TechnologyDetail() {
  const { specialtySlug } = useParams();
  const { data, loading, error, reload } = useApiResource(
    () => getSpecialtyBySlug(specialtySlug),
    [specialtySlug]
  );

  return (
    <div className="alc-technology">
      <div className="alc-technology__hero">
        <Link to="/technology" className="btn-ghost">← All Specialties</Link>
        <h1>{data?.name || (loading ? "Loading…" : "Specialty")}</h1>
        {data?.short_description && <p>{data.short_description}</p>}
      </div>

      <div className="alc-technology__content">
        <ApiState loading={loading} error={error} onRetry={reload} label="specialty" />

        {data && (
          <section className="alc-technology__block">
            <p className="alc-technology__narrative">
              {data.long_description || data.short_description}
            </p>
            <div className="alc-technology__explore">
              <Link to="/products" className="btn-secondary">Related Products</Link>
              <Link to="/missions" className="btn-ghost">Mission Stories</Link>
              <Link to="/contact" className="btn-primary">Request Mission Consultation</Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

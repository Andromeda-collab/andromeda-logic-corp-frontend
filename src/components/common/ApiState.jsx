/**
 * Small, design-neutral status strip for API-backed sections.
 * - Shows a subtle "Loading…" line while a request is in flight.
 * - Shows a dismissible-looking error notice with a Retry action on failure.
 * Renders nothing once data has loaded successfully.
 *
 * Styling uses the project's CSS custom properties (see styles/tokens.css)
 * with safe fallbacks, so it blends into any page without new stylesheets.
 */
export default function ApiState({ loading, error, onRetry, label = "content" }) {
  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          margin: "12px 0",
          fontSize: 13,
          letterSpacing: "0.04em",
          color: "var(--alc-slate, #8A93B8)",
          border: "1px solid var(--alc-hairline, rgba(138,147,184,0.2))",
          borderRadius: 8,
          background: "var(--alc-deep-space-indigo, #0b1026)",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--alc-ion-cyan, #29E3D9)",
            animation: "alc-pulse 1s ease-in-out infinite",
          }}
        />
        <span>Loading {label}…</span>
        <style>{`@keyframes alc-pulse{0%,100%{opacity:.3}50%{opacity:1}}`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          padding: "10px 14px",
          margin: "12px 0",
          fontSize: 13,
          color: "var(--alc-signal-white, #F5F7FF)",
          border: "1px solid var(--alc-nebula-magenta, #E63C8C)",
          borderRadius: 8,
          background: "rgba(230,60,140,0.08)",
        }}
      >
        <span>
          Couldn&rsquo;t load live {label}: {error}
        </span>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            style={{
              flexShrink: 0,
              padding: "6px 12px",
              fontSize: 12,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--alc-signal-white, #F5F7FF)",
              background: "transparent",
              border: "1px solid currentColor",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return null;
}

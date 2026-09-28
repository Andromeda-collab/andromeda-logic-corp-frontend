// NOVA slide-in panel — Section 10.7 (UI/UX Placement & States).
// States to implement: Collapsed / Expanded / Thinking-Retrieving / Cited Answer / Handoff.
// Backend contact: POST /api/v1/nova/chat (see backend/app/api/v1/endpoints/nova.py).
export default function NovaPanel({ onClose }) {
  return (
    <div className="alc-nova-panel" role="dialog" aria-label="NOVA AI Mission Assistant">
      <div className="alc-nova-panel__header">
        <span>ALC — AI Mission Assistant</span>
        <button onClick={onClose} aria-label="Close NOVA panel">
          &times;
        </button>
      </div>
      <div className="alc-nova-panel__body">
        {/* TODO: message list, citation cards, "Talk to a human" exit path (10.8) */}
        <p>Ask about Technology, Products, Solutions, or Mission Consultation.</p>
      </div>
      <div className="alc-nova-panel__input">
        {/* TODO: controlled input + submit, wired to services/novaService.js */}
        <input type="text" placeholder="Ask NOVA..." />
      </div>
    </div>
  );
}

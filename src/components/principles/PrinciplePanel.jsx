import React from 'react';

export default function PrinciplePanel({ data, isActive }) {
  return (
    <div className={`alc-principle-card ${isActive ? 'is-active' : ''}`}>
      <div className="alc-pillar-number">{data.id}</div>
      <h3>{data.title}</h3>
      <p>{data.description}</p>
      <a href="#" className="alc-link-pulse">
        Explore Technology <span className="alc-link-line"></span>
      </a>
    </div>
  );
}

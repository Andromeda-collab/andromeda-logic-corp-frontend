import React from 'react';

export default function PrincipleProgress({ total, current }) {
  return (
    <div className="alc-principle-progress">
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <div className={`alc-progress-node ${current >= i ? 'is-active' : ''}`}>
            0{i + 1}
          </div>
          {i < total - 1 && (
            <div className={`alc-progress-line ${current > i ? 'is-active' : ''}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

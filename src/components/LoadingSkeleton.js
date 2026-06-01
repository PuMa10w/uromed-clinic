import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="loading-skeleton">
      <div className="skeleton-title" />
      <div className="skeleton-subtitle" />
      <div className="skeleton-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-icon" />
            <div className="skeleton-line skeleton-line-wide" />
            <div className="skeleton-line skeleton-line-narrow" />
            <div className="skeleton-text" />
            <div className="skeleton-tags">
              <span className="skeleton-tag" />
              <span className="skeleton-tag" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

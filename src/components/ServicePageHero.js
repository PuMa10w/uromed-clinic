import React from 'react';
import PropTypes from 'prop-types';

const ServicePageHero = ({
  eyebrow,
  title,
  subtitle,
  trustPills = [],
  stats = [],
  highlights = [],
  actions = [],
}) => {
  return (
    <div className="service-page-hero">
      <div className="service-page-intro service-page-intro-enhanced">
        {eyebrow ? <span className="service-eyebrow">{eyebrow}</span> : null}
        <h2 className="section-title">{title}</h2>
        {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}

        {trustPills.length > 0 ? (
          <div className="service-hero-trust-row" aria-label="Service trust signals">
            {trustPills.map((pill) => (
              <span key={pill} className="service-hero-trust-pill">
                {pill}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {(stats.length > 0 || highlights.length > 0 || actions.length > 0) ? (
        <div className="service-hero-grid">
          {stats.length > 0 ? (
            <div className="service-hero-panel">
              <span className="service-mini-kicker">Clinical context</span>
              <div className="service-hero-stats">
                {stats.map((stat) => (
                  <div key={`${stat.label}-${stat.value}`} className="service-hero-stat">
                    <span className="service-hero-stat-value">{stat.value}</span>
                    <span className="service-hero-stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {highlights.length > 0 ? (
            <div className="service-hero-panel">
              <span className="service-mini-kicker">What this page helps with</span>
              <ul className="service-hero-highlight-list">
                {highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {actions.length > 0 ? (
            <div className="service-hero-panel">
              <span className="service-mini-kicker">Next routes</span>
              <div className="service-hero-actions">
                {actions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    className="service-hero-action"
                    onClick={action.onClick}
                  >
                    <span className="service-hero-action-title">{action.label}</span>
                    {action.meta ? <span className="service-hero-action-meta">{action.meta}</span> : null}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

ServicePageHero.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  trustPills: PropTypes.arrayOf(PropTypes.string),
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  highlights: PropTypes.arrayOf(PropTypes.string),
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      meta: PropTypes.string,
      onClick: PropTypes.func.isRequired,
    }),
  ),
};

export default ServicePageHero;

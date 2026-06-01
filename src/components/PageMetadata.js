import React from 'react';
import PropTypes from 'prop-types';

const PageMetadata = ({ title, description, keywords, canonical, noIndex = false }) => {
  if (noIndex) {
    return (
      <meta name="robots" content="noindex, nofollow" />
    );
  }

  return (
    <>
      {title && <meta property="og:title" content={title} />}
      {description && (
        <>
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
        </>
      )}
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
};

PageMetadata.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  canonical: PropTypes.string,
  noIndex: PropTypes.bool,
};

PageMetadata.defaultProps = {
  title: '',
  description: '',
  keywords: '',
  canonical: '',
  noIndex: false,
};

const SectionHeader = ({ 
  title, 
  subtitle, 
  icon, 
  badge, 
  action, 
  actionLabel 
}) => {
  return (
    <div className="section-header">
      <div className="section-header-left">
        {icon && <span className="section-header-icon">{icon}</span>}
        <div className="section-header-text">
          <h1 className="section-header-title">{title}</h1>
          {subtitle && <p className="section-header-subtitle">{subtitle}</p>}
        </div>
      </div>
      <div className="section-header-right">
        {badge && <span className="section-header-badge">{badge}</span>}
        {action && actionLabel && (
          <button className="section-header-action" onClick={action}>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.string,
  badge: PropTypes.string,
  action: PropTypes.func,
  actionLabel: PropTypes.string,
};

SectionHeader.defaultProps = {
  subtitle: '',
  icon: '',
  badge: '',
  action: null,
  actionLabel: '',
};

export { PageMetadata, SectionHeader };

export default {
  PageMetadata,
  SectionHeader,
};
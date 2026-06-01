import React from 'react';

function ClinicalPageShell({
  as: Element = 'section',
  className = '',
  eyebrow,
  title,
  subtitle,
  trustPills = [],
  actions = null,
  rail = null,
  children,
  ...rest
}) {
  return (
    <Element className={`clinical-page-shell ${className}`.trim()} data-v20-clinical-page-shell="true" data-v21-workbench-shell="true" {...rest}>
      {(eyebrow || title || subtitle || trustPills.length > 0 || actions) && (
        <header className="clinical-page-shell-head">
          <div className="clinical-page-shell-copy">
            {eyebrow && <span className="service-eyebrow">{eyebrow}</span>}
            {title && <h2 className="section-title">{title}</h2>}
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
            {trustPills.length > 0 && (
              <div className="service-hero-trust-row">
                {trustPills.map((pill) => <span key={pill} className="service-hero-trust-pill">{pill}</span>)}
              </div>
            )}
          </div>
          {actions && <div className="clinical-page-shell-actions">{actions}</div>}
        </header>
      )}
      {rail && <div className="clinical-page-shell-rail">{rail}</div>}
      <div className="clinical-page-shell-body">{children}</div>
    </Element>
  );
}

export default React.memo(ClinicalPageShell);

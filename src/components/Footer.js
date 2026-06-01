import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  onNavigate: PropTypes.func,
  activeSection: PropTypes.string,
};

const defaultProps = {
  onNavigate: () => {},
  activeSection: 'home',
};

const Footer = ({ onNavigate, activeSection }) => {
  const links = [
    { label: 'Урология', section: 'urology' },
    { label: 'Андрология', section: 'andrology' },
    { label: 'Калькуляторы', section: 'calculators' },
    { label: 'Опросники', section: 'tools' },
  ];
  const isHome = activeSection === 'home';

  return (
    <footer className={`footer ${isHome ? 'footer-compact' : ''}`}>
      <div className="footer-topline">
        <div className="footer-brand-block">
          <div className="footer-brand-lockup"><span>Uro</span><span>Med</span></div>
          <p className="footer-brand-copy">
            {isHome
              ? 'Короткий путь к ключевым клиническим сценариям.'
              : 'Практичный клинический справочник по урологии и андрологии с быстрым доступом к ключевым сценариям.'}
          </p>
        </div>
      </div>
      <div className="footer-links">
        {links.map((link, i) => (
          <React.Fragment key={link.section}>
            <button className="footer-link-btn" onClick={() => onNavigate && onNavigate(link.section)}>
              {link.label}
            </button>
            {i < links.length - 1 && <span className="footer-sep" aria-hidden="true" />}
          </React.Fragment>
        ))}
      </div>
      <div className="footer-external-links">
        <a href="https://uroweb.org/guidelines" target="_blank" rel="noopener noreferrer">EAU Guidelines</a>
        <a href="https://www.auanet.org/guidelines" target="_blank" rel="noopener noreferrer">AUA Guidelines</a>
        <a href="https://cr.minzdrav.gov.ru" target="_blank" rel="noopener noreferrer">Российские рекомендации</a>
      </div>
      <p className="footer-copyright">
        © 2026 UroMed by PuMa10w — Справочник по доказательной медицине
      </p>
    </footer>
  );
};

export default React.memo(Footer);
Footer.propTypes = propTypes;
Footer.defaultProps = defaultProps;

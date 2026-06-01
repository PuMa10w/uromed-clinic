import React from 'react';
import PropTypes from 'prop-types';

const BreadcrumbItem = ({ label, href, isActive, onClick, icon }) => {
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  if (isActive) {
    return (
      <span className="breadcrumb-item breadcrumb-item-current" aria-current="page">
        {icon && <span className="breadcrumb-icon">{icon}</span>}
        {label}
      </span>
    );
  }

  return (
    <a 
      href={href || '#'} 
      className="breadcrumb-item breadcrumb-link"
      onClick={handleClick}
    >
      {icon && <span className="breadcrumb-icon">{icon}</span>}
      {label}
    </a>
  );
};

BreadcrumbItem.propTypes = {
  label: PropTypes.string.isRequired,
  href: PropTypes.string,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  icon: PropTypes.string,
};

BreadcrumbItem.defaultProps = {
  href: '#',
  isActive: false,
  onClick: null,
  icon: '',
};

const Breadcrumb = ({ items, separator = '›', className = '' }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav 
      className={`breadcrumb-nav ${className}`}
      aria-label="Навигация"
      role="navigation"
    >
      <ol className="breadcrumb-list">
        {items.map((item, index) => (
          <li key={item.id || index} className="breadcrumb-list-item">
            {index > 0 && (
              <span className="breadcrumb-separator" aria-hidden="true">
                {separator}
              </span>
            )}
            <BreadcrumbItem
              label={item.label}
              href={item.href}
              isActive={item.isActive || index === items.length - 1}
              onClick={item.onClick}
              icon={item.icon}
            />
          </li>
        ))}
      </ol>
    </nav>
  );
};

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      isActive: PropTypes.bool,
      onClick: PropTypes.func,
      icon: PropTypes.string,
    })
  ).isRequired,
  separator: PropTypes.string,
  className: PropTypes.string,
};

Breadcrumb.defaultProps = {
  separator: '›',
  className: '',
};

export { Breadcrumb, BreadcrumbItem };

export default Breadcrumb;
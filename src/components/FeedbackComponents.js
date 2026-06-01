import React from 'react';
import PropTypes from 'prop-types';

const EmptyState = ({ 
  icon = '📭', 
  title = 'Нет данных', 
  message = 'Попробуйте изменить параметры поиска',
  action = null,
  actionLabel = '',
}) => {
  return (
    <div className="empty-state" role="status">
      <span className="empty-state-icon">{icon}</span>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {action && actionLabel && (
        <button className="empty-state-action" onClick={action}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  message: PropTypes.string,
  action: PropTypes.func,
  actionLabel: PropTypes.string,
};

EmptyState.defaultProps = {
  icon: '📭',
  title: 'Нет данных',
  message: 'Попробуйте изменить параметры поиска',
  action: null,
  actionLabel: '',
};

const LoadingSpinner = ({ 
  size = 'medium', 
  label = 'Загрузка...',
  centered = true 
}) => {
  const sizeMap = {
    small: '20px',
    medium: '40px',
    large: '60px',
  };

  const spinnerStyle = {
    width: sizeMap[size],
    height: sizeMap[size],
    border: '3px solid rgba(201, 168, 76, 0.2)',
    borderTopColor: 'var(--gold)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  return (
    <div 
      className={`loading-spinner ${centered ? 'centered' : ''}`}
      role="status"
      aria-live="polite"
    >
      <div style={spinnerStyle} />
      {label && <span className="loading-label">{label}</span>}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .loading-spinner.centered {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          gap: 1rem;
        }
        .loading-label {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  label: PropTypes.string,
  centered: PropTypes.bool,
};

LoadingSpinner.defaultProps = {
  size: 'medium',
  label: 'Загрузка...',
  centered: true,
};

const Toast = ({ 
  message, 
  type = 'info', 
  onClose,
  duration = 5000 
}) => {
  React.useEffect(() => {
    if (duration > 0 && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeStyles = {
    info: { bg: 'rgba(59, 130, 246, 0.9)', border: '#3b82f6' },
    success: { bg: 'rgba(22, 199, 154, 0.9)', border: '#16c79a' },
    warning: { bg: 'rgba(245, 158, 11, 0.9)', border: '#f59e0b' },
    error: { bg: 'rgba(239, 68, 68, 0.9)', border: '#ef4444' },
  };

  const style = typeStyles[type] || typeStyles.info;

  return (
    <div 
      className="toast-notification"
      role="alert"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: style.bg,
        color: '#fff',
        padding: '12px 20px',
        borderRadius: '8px',
        borderLeft: `4px solid ${style.border}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        zIndex: 9999,
        maxWidth: '350px',
        animation: 'slideIn 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <span>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '16px',
              padding: '0',
              lineHeight: 1,
            }}
            aria-label="Закрыть"
          >
            ✕
          </button>
        )}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  onClose: PropTypes.func,
  duration: PropTypes.number,
};

Toast.defaultProps = {
  type: 'info',
  onClose: null,
  duration: 5000,
};

export { EmptyState, LoadingSpinner, Toast };

const FeedbackComponents = {
  EmptyState,
  LoadingSpinner,
  Toast,
};

export default FeedbackComponents;

import React from 'react';
import PropTypes from 'prop-types';
import { captureException, addBreadcrumb } from '../utils/sentry';

const propTypes = {
  children: PropTypes.node.isRequired,
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary: error caught:', error, errorInfo);
    captureException(error, {
      componentStack: errorInfo.componentStack,
      ...errorInfo,
    });
    addBreadcrumb({
      category: 'error',
      message: error?.message || 'Unknown error',
      level: 'error',
    });

    if (this.isChunkLoadError(error)) {
      this.recoverFromChunkError();
    }
  }

  isChunkLoadError = (error) => {
    if (!error) return false;
    const message = String(error.message || '');
    return message.includes('ChunkLoadError')
      || message.includes('Loading chunk')
      || message.includes('Failed to fetch dynamically imported module');
  };

  recoverFromChunkError = async () => {
    const guardKey = 'uromed_chunk_recovery_done';
    if (window.sessionStorage.getItem(guardKey)) return;
    window.sessionStorage.setItem(guardKey, '1');

    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
      }

      if ('caches' in window) {
        const cacheNames = await window.caches.keys();
        await Promise.all(cacheNames.map((cacheName) => window.caches.delete(cacheName)));
      }
    } catch (_) {
      // best-effort recovery
    } finally {
      window.location.reload();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.assign('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h1>Что-то пошло не так</h1>
            <p>При загрузке приложения произошла ошибка. Попробуйте перезагрузить страницу.</p>
            {this.isChunkLoadError(this.state.error) && (
              <p>Похоже, кэш устарел после обновления. Нажмите «Перезагрузить».</p>
            )}
            {this.state.error && process.env.NODE_ENV === 'development' && (
              <pre className="error-details">{this.state.error.message}</pre>
            )}
            <div className="error-actions">
              <button onClick={this.handleReload} className="error-btn primary">
                Перезагрузить
              </button>
              <button onClick={this.handleGoHome} className="error-btn secondary">
                На главную
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
ErrorBoundary.propTypes = propTypes;

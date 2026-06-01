const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN;

let sentryModule = null;
let sentryPromise = null;

function loadSentry() {
  if (!SENTRY_DSN) {
    return Promise.resolve(null);
  }

  if (sentryModule) {
    return Promise.resolve(sentryModule);
  }

  if (!sentryPromise) {
    sentryPromise = import('@sentry/browser')
      .then((module) => {
        sentryModule = module;
        return module;
      })
      .catch(() => null);
  }

  return sentryPromise;
}

export const initSentry = () => {
  if (!SENTRY_DSN) {
    return;
  }

  loadSentry().then((Sentry) => {
    if (!Sentry) {
      return;
    }

    Sentry.init({
      dsn: SENTRY_DSN,
      environment: process.env.NODE_ENV,
      release: `uromed@${process.env.npm_package_version}`,
      sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      beforeSend(event, hint) {
        const error = hint.originalException;
        if (error?.message?.includes('ResizeObserver')) {
          return null;
        }
        return event;
      },
    });
  });
};

export const ErrorBoundary = ({ children }) => children;

export const captureException = (error, context = {}) => {
  loadSentry().then((Sentry) => {
    Sentry?.captureException(error, { extra: context });
  });
};

export const captureMessage = (message, level = 'info', context = {}) => {
  loadSentry().then((Sentry) => {
    Sentry?.captureMessage(message, { level, extra: context });
  });
};

export const setUser = (user) => {
  loadSentry().then((Sentry) => {
    Sentry?.setUser(user);
  });
};

export const addBreadcrumb = (breadcrumb) => {
  loadSentry().then((Sentry) => {
    Sentry?.addBreadcrumb(breadcrumb);
  });
};

export const withSentry = (callback) => {
  return (error, errorInfo) => {
    captureException(error, { componentStack: errorInfo.componentStack });
    if (callback) {
      callback(error, errorInfo);
    }
  };
};

export const withErrorBoundary = (Component) => Component;

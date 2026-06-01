import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initSentry } from './utils/sentry';

function runWhenBrowserIsIdle(task) {
  if (typeof window === 'undefined') {
    task();
    return;
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => task(), { timeout: 2500 });
    return;
  }

  window.setTimeout(task, 1500);
}

function initializeObservability() {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  runWhenBrowserIsIdle(() => {
    initSentry();

    reportWebVitals((metric) => {
      window.dispatchEvent(new CustomEvent('uromed-web-vital', { detail: metric }));
    });
  });
}

function showAppUpdateBanner(onRefresh) {
  const existingBanner = document.getElementById('app-update-banner');
  if (existingBanner) {
    return;
  }

  const banner = document.createElement('div');
  banner.id = 'app-update-banner';
  banner.className = 'app-update-banner';
  banner.setAttribute('role', 'status');
  banner.setAttribute('aria-live', 'polite');

  const copy = document.createElement('div');
  copy.className = 'app-update-copy';

  const title = document.createElement('strong');
  title.textContent = 'Доступно обновление UroMed';

  const description = document.createElement('span');
  description.textContent = 'Можно обновить приложение сейчас без ручной перезагрузки.';

  copy.append(title, description);

  const actions = document.createElement('div');
  actions.className = 'app-update-actions';

  const dismissButton = document.createElement('button');
  dismissButton.type = 'button';
  dismissButton.className = 'app-update-dismiss';
  dismissButton.textContent = 'Позже';

  const confirmButton = document.createElement('button');
  confirmButton.type = 'button';
  confirmButton.className = 'app-update-confirm';
  confirmButton.textContent = 'Обновить';

  actions.append(dismissButton, confirmButton);
  banner.append(copy, actions);

  dismissButton.addEventListener('click', () => banner.remove(), { once: true });
  confirmButton.addEventListener(
    'click',
    () => {
      banner.remove();
      onRefresh();
    },
    { once: true },
  );

  document.body.appendChild(banner);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(React.StrictMode, null, React.createElement(App)));

async function unregisterDevelopmentServiceWorkers() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));

  if ('caches' in window) {
    const cacheNames = await window.caches.keys();
    await Promise.all(cacheNames.map((cacheName) => window.caches.delete(cacheName)));
  }
}

function registerProductionServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  let isRefreshing = false;
  let pendingWorker = null;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (isRefreshing) {
      return;
    }

    isRefreshing = true;
    window.location.reload();
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        if (registration.waiting) {
          pendingWorker = registration.waiting;
          showAppUpdateBanner(() => {
            pendingWorker?.postMessage({ type: 'SKIP_WAITING' });
          });
        }

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) {
            return;
          }

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              pendingWorker = newWorker;
              showAppUpdateBanner(() => {
                pendingWorker?.postMessage({ type: 'SKIP_WAITING' });
              });
            }
          });
        });
      })
      .catch(() => {});
  });
}

if (process.env.NODE_ENV === 'development') {
  unregisterDevelopmentServiceWorkers().catch(() => {});
} else {
  registerProductionServiceWorker();
}

initializeObservability();

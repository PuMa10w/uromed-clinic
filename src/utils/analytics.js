const ANALYTICS_ID = process.env.REACT_APP_GA_ID;
const DEBUG_MODE = process.env.NODE_ENV === 'development';
const TELEMETRY_STORAGE_KEY = 'uro_telemetry_events';
const MAX_TELEMETRY_EVENTS = 200;

export const AnalyticsEvent = {
  PAGE_VIEW: 'page_view',
  SEARCH: 'search',
  SEARCH_SELECT: 'search_select',
  SYMPTOM_ROUTE: 'symptom_route',
  HISTORY_REOPEN: 'history_reopen',
  FAVORITE_TOGGLE: 'favorite_toggle',
  MODAL_OPEN: 'modal_open',
  SECTION_ENTER: 'section_enter',
  SECTION_PATHWAY: 'section_pathway',
  CALCULATOR_USE: 'calculator_use',
  GAME_START: 'game_start',
  ERROR: 'error',
};

const safeParseTelemetry = (value) => {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getCachedTelemetry = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  if (!Array.isArray(window.__uroTelemetryEvents)) {
    window.__uroTelemetryEvents = safeParseTelemetry(window.sessionStorage?.getItem(TELEMETRY_STORAGE_KEY));
  }

  return window.__uroTelemetryEvents;
};

const persistTelemetry = (events) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.__uroTelemetryEvents = events;

  try {
    window.sessionStorage?.setItem(TELEMETRY_STORAGE_KEY, JSON.stringify(events));
  } catch {}

  window.dispatchEvent(new CustomEvent('uro-telemetry-update', { detail: { count: events.length } }));
};

const recordTelemetry = (category, action, label = '', value = null, extra = {}) => {
  if (typeof window === 'undefined') {
    return;
  }

  const nextEvents = [
    ...getCachedTelemetry(),
    {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ts: new Date().toISOString(),
      category,
      action,
      label,
      value,
      ...extra,
    },
  ].slice(-MAX_TELEMETRY_EVENTS);

  persistTelemetry(nextEvents);
};

const logEvent = (category, action, label = '', value = null, extra = {}) => {
  recordTelemetry(category, action, label, value, extra);

  if (DEBUG_MODE) {
    console.log(`[Analytics] ${category}: ${action}`, { label, value, ...extra });
  }

  if (ANALYTICS_ID && typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...extra,
    });
  }
};

export const getTelemetryEvents = () => getCachedTelemetry();

export const clearTelemetryEvents = () => {
  persistTelemetry([]);
};

const getTopEntries = (entries, metricKey, limit = 5) => (
  [...entries]
    .sort((left, right) => {
      if ((right[metricKey] || 0) !== (left[metricKey] || 0)) {
        return (right[metricKey] || 0) - (left[metricKey] || 0);
      }

      return String(left.label || '').localeCompare(String(right.label || ''));
    })
    .slice(0, limit)
);

export const getTelemetrySnapshot = () => {
  const events = getTelemetryEvents();
  const sectionSteps = events.filter((event) => event.category === AnalyticsEvent.SECTION_PATHWAY);
  const modalOpens = events.filter((event) => event.category === AnalyticsEvent.MODAL_OPEN && event.action === 'open');

  const pathwayTotals = sectionSteps.reduce((acc, event, index) => {
    const key = `${event.section || 'unknown'}|${event.subsection || 'none'}|${event.action}|${event.source || 'direct'}`;
    const current = acc[key] || {
      key,
      label: `${event.section || 'unknown'} / ${event.subsection || 'none'}`,
      step: event.action,
      source: event.source || 'direct',
      retained: event.retained || 'default',
      count: 0,
      progressed: 0,
    };

    current.count += 1;

    if (event.action === 'focus_cta' || event.action === 'subsection_card') {
      const progressed = sectionSteps.slice(index + 1).some((candidate) => (
        candidate.action === 'disease_recommendation'
        && candidate.section === event.section
        && candidate.subsection === event.subsection
      ));

      if (progressed) {
        current.progressed += 1;
      }
    }

    acc[key] = current;
    return acc;
  }, {});

  const recommendationTotals = sectionSteps
    .filter((event) => event.action === 'disease_recommendation')
    .reduce((acc, event, index) => {
      const key = `${event.target_id || 'unknown'}|${event.source || 'direct'}`;
      const current = acc[key] || {
        key,
        label: `${event.section || 'unknown'} / ${event.subsection || 'none'} -> ${event.target_id || 'unknown'}`,
        targetId: event.target_id || 'unknown',
        source: event.source || 'direct',
        retained: event.retained || 'default',
        recommendations: 0,
        modalOpens: 0,
      };

      current.recommendations += 1;

      const converted = modalOpens.slice(index).some((modalEvent) => (
        modalEvent.target_id === event.target_id
        && modalEvent.source === event.source
      ));

      if (converted) {
        current.modalOpens += 1;
      }

      acc[key] = current;
      return acc;
    }, {});

  const topPathways = getTopEntries(
    Object.values(pathwayTotals).map((item) => ({
      ...item,
      progressRate: item.count > 0 ? Math.round((item.progressed / item.count) * 100) : 0,
    })),
    'count',
  );

  const topRecommendations = getTopEntries(
    Object.values(recommendationTotals).map((item) => ({
      ...item,
      modalRate: item.recommendations > 0 ? Math.round((item.modalOpens / item.recommendations) * 100) : 0,
    })),
    'recommendations',
  );

  const weakestDropoffs = [...Object.values(pathwayTotals)]
    .filter((item) => item.step !== 'disease_recommendation' && item.count > 0)
    .map((item) => ({
      ...item,
      dropoffRate: 100 - Math.round((item.progressed / item.count) * 100),
    }))
    .sort((left, right) => {
      if (right.dropoffRate !== left.dropoffRate) {
        return right.dropoffRate - left.dropoffRate;
      }

      return (right.count || 0) - (left.count || 0);
    })
    .slice(0, 5);

  return {
    totalEvents: events.length,
    sectionPathwayEvents: sectionSteps.length,
    modalOpenEvents: modalOpens.length,
    topPathways,
    topRecommendations,
    weakestDropoffs,
    lastUpdatedAt: events[events.length - 1]?.ts || null,
  };
};

export const trackPageView = (pagePath, pageTitle) => {
  logEvent(AnalyticsEvent.PAGE_VIEW, pagePath, pageTitle);

  if (ANALYTICS_ID && typeof window !== 'undefined') {
    if (!window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', ANALYTICS_ID, {
        page_path: pagePath,
        page_title: pageTitle,
      });
    } else {
      window.gtag('config', ANALYTICS_ID, {
        page_path: pagePath,
        page_title: pageTitle,
      });
    }
  }
};

export const trackSearch = (query, resultsCount) => {
  logEvent(
    AnalyticsEvent.SEARCH,
    query,
    `${resultsCount} results`,
    resultsCount,
    {
      query_length: query.trim().length,
      results_count: resultsCount,
      result_state: resultsCount > 0 ? 'results' : 'zero_results',
    },
  );
};

export const trackSearchSelect = (query, diseaseId, source = 'search') => {
  logEvent(
    AnalyticsEvent.SEARCH_SELECT,
    source,
    `${query} -> ${diseaseId}`,
    null,
    {
      query,
      target_id: diseaseId,
      source,
      conversion_type: 'search_to_disease',
    },
  );
};

export const trackSymptomRoute = (routeName, targetId, source = 'search_overlay') => {
  logEvent(
    AnalyticsEvent.SYMPTOM_ROUTE,
    source,
    `${routeName} -> ${targetId}`,
    null,
    {
      complaint: routeName,
      target_id: targetId,
      source,
      conversion_type: 'complaint_to_pathway',
    },
  );
};

export const trackHistoryReopen = (diseaseId, previousSource, openCount) => {
  logEvent(
    AnalyticsEvent.HISTORY_REOPEN,
    'history_panel',
    `${previousSource || 'unknown'} -> ${diseaseId}`,
    openCount,
    {
      target_id: diseaseId,
      previous_source: previousSource || 'unknown',
      open_count: openCount,
      conversion_type: 'history_reopen',
    },
  );
};

export const trackFavorite = (diseaseId, isAdded) => {
  logEvent(AnalyticsEvent.FAVORITE_TOGGLE, isAdded ? 'add' : 'remove', diseaseId);
};

export const trackModal = (diseaseId, action, source = 'direct', extra = {}) => {
  logEvent(AnalyticsEvent.MODAL_OPEN, action, diseaseId, null, {
    target_id: diseaseId,
    source,
    ...extra,
  });
};

export const trackSection = (section, subsection) => {
  const path = subsection ? `${section}/${subsection}` : section;
  logEvent(AnalyticsEvent.SECTION_ENTER, path);
};

export const trackSectionPathway = ({ step, section, subsection = null, targetId = null, source = 'direct', retained = false }) => {
  const path = subsection ? `${section}/${subsection}` : section;
  const label = targetId ? `${path} -> ${targetId}` : path;

  logEvent(
    AnalyticsEvent.SECTION_PATHWAY,
    step,
    label,
    null,
    {
      step,
      section,
      subsection: subsection || '',
      target_id: targetId || '',
      source,
      retained: retained ? 'retained' : 'default',
      conversion_type: 'section_pathway_step',
    },
  );
};

export const trackCalculator = (calculatorName, score) => {
  logEvent(AnalyticsEvent.CALCULATOR_USE, calculatorName, `score: ${score}`);
};

export const trackGame = (gameId, action) => {
  logEvent(AnalyticsEvent.GAME_START, action, gameId);
};

export const trackError = (errorType, errorMessage) => {
  logEvent(AnalyticsEvent.ERROR, errorType, errorMessage);
};

export const initAnalytics = () => {
  if (!ANALYTICS_ID) {
    console.log('[Analytics] GA ID not configured - running in demo mode');
    return;
  }

  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
    document.head.appendChild(script);
  }
};

export default {
  trackPageView,
  trackSearch,
  trackSearchSelect,
  trackSymptomRoute,
  trackHistoryReopen,
  trackFavorite,
  trackModal,
  trackSection,
  trackSectionPathway,
  getTelemetryEvents,
  getTelemetrySnapshot,
  clearTelemetryEvents,
  trackCalculator,
  trackGame,
  trackError,
  initAnalytics,
};

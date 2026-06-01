const reportWebVitals = (onPerfEntry) => {
  if (!onPerfEntry || !(onPerfEntry instanceof Function)) {
    return;
  }

  import('web-vitals').then((webVitals) => {
    const reportMetric = (metric) => {
      onPerfEntry(metric);
    };

    webVitals.getCLS?.(reportMetric);
    webVitals.getFID?.(reportMetric);
    webVitals.getFCP?.(reportMetric);
    webVitals.getLCP?.(reportMetric);
    webVitals.getTTFB?.(reportMetric);
    webVitals.getINP?.(reportMetric);
    webVitals.onINP?.(reportMetric);
  });
};

export default reportWebVitals;

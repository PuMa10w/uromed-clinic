import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { clearTelemetryEvents, getTelemetrySnapshot } from '../utils/analytics';

const DEBUG_ENABLED = process.env.NODE_ENV !== 'production';

const panelStyles = {
  toggle: {
    position: 'fixed',
    bottom: '10px',
    left: '10px',
    zIndex: 9999,
    padding: '8px 12px',
    background: 'rgba(201, 168, 76, 0.2)',
    border: '1px solid rgba(201, 168, 76, 0.4)',
    borderRadius: '8px',
    color: '#f1cc7a',
    fontSize: '12px',
    cursor: 'pointer',
  },
  panel: {
    position: 'fixed',
    bottom: '50px',
    left: '10px',
    width: '360px',
    maxHeight: '72vh',
    overflow: 'auto',
    background: 'rgba(10, 10, 26, 0.96)',
    border: '1px solid rgba(201, 168, 76, 0.3)',
    borderRadius: '12px',
    padding: '12px',
    zIndex: 9999,
    fontSize: '12px',
    color: '#c5d4e8',
    boxShadow: '0 18px 40px rgba(0, 0, 0, 0.35)',
  },
  section: {
    marginBottom: '12px',
    paddingBottom: '10px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  pre: {
    margin: '4px 0',
    fontSize: '10px',
    maxHeight: '150px',
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  list: {
    margin: '6px 0 0',
    paddingLeft: '16px',
  },
  item: {
    marginBottom: '6px',
    lineHeight: 1.45,
  },
  controls: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },
  button: {
    padding: '4px 8px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: '6px',
    color: '#d7e1ef',
    cursor: 'pointer',
  },
};

function formatTelemetrySummary(snapshot) {
  if (!snapshot) {
    return 'Telemetry snapshot is empty.';
  }

  const lines = [
    'UroMed telemetry snapshot',
    `Total events: ${snapshot.totalEvents}`,
    `Section pathway events: ${snapshot.sectionPathwayEvents}`,
    `Modal open events: ${snapshot.modalOpenEvents}`,
    `Last updated: ${snapshot.lastUpdatedAt || 'No events yet'}`,
    '',
    'Top subsection pathways:',
  ];

  if (snapshot.topPathways.length) {
    snapshot.topPathways.forEach((item, index) => {
      lines.push(
        `${index + 1}. ${item.label} | ${item.source} | ${item.retained} | ${item.count} opens | ${item.progressRate}% progressed`,
      );
    });
  } else {
    lines.push('None');
  }

  lines.push('', 'Top disease recommendations:');

  if (snapshot.topRecommendations.length) {
    snapshot.topRecommendations.forEach((item, index) => {
      lines.push(
        `${index + 1}. ${item.label} | ${item.source} | ${item.retained} | ${item.recommendations} recommendations | ${item.modalRate}% modal conversion`,
      );
    });
  } else {
    lines.push('None');
  }

  lines.push('', 'Weakest dropoff points:');

  if (snapshot.weakestDropoffs.length) {
    snapshot.weakestDropoffs.forEach((item, index) => {
      lines.push(
        `${index + 1}. ${item.label} | ${item.source} | ${item.retained} | ${item.count} entries | ${item.dropoffRate}% dropoff`,
      );
    });
  } else {
    lines.push('None');
  }

  return lines.join('\n');
}

function buildTelemetryExport(snapshot, exportContext = {}) {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      snapshot,
      context: exportContext,
    },
    null,
    2,
  );
}

function compareTelemetryExports(baseExport, compareExport) {
  const baseSnapshot = baseExport?.snapshot || {};
  const compareSnapshot = compareExport?.snapshot || {};
  const baseContext = baseExport?.context || {};
  const compareContext = compareExport?.context || {};
  const baseHistory = baseContext?.retention?.viewHistory || [];
  const compareHistory = compareContext?.retention?.viewHistory || [];

  return {
    totalEventsDelta: (compareSnapshot.totalEvents || 0) - (baseSnapshot.totalEvents || 0),
    sectionPathwayDelta: (compareSnapshot.sectionPathwayEvents || 0) - (baseSnapshot.sectionPathwayEvents || 0),
    modalOpenDelta: (compareSnapshot.modalOpenEvents || 0) - (baseSnapshot.modalOpenEvents || 0),
    topPathwayShift: {
      base: baseSnapshot.topPathways?.[0]?.label || 'None',
      compare: compareSnapshot.topPathways?.[0]?.label || 'None',
    },
    topRecommendationShift: {
      base: baseSnapshot.topRecommendations?.[0]?.label || 'None',
      compare: compareSnapshot.topRecommendations?.[0]?.label || 'None',
    },
    weakestDropoffShift: {
      base: baseSnapshot.weakestDropoffs?.[0]?.label || 'None',
      compare: compareSnapshot.weakestDropoffs?.[0]?.label || 'None',
    },
    retentionHistoryDelta: compareHistory.length - baseHistory.length,
    favoritesDelta:
      ((compareContext?.retention?.favoritesCount) || 0)
      - ((baseContext?.retention?.favoritesCount) || 0),
    weakestDropoffDelta:
      ((compareSnapshot.weakestDropoffs?.[0]?.dropoffRate) || 0)
      - ((baseSnapshot.weakestDropoffs?.[0]?.dropoffRate) || 0),
    activeSectionShift: {
      base: baseContext?.appState?.activeSection || 'unknown',
      compare: compareContext?.appState?.activeSection || 'unknown',
    },
  };
}

function getCompareVerdict(compareSummary) {
  if (!compareSummary) {
    return { status: 'neutral', label: 'Neutral', reason: 'No comparison loaded.' };
  }

  const score =
    (compareSummary.modalOpenDelta || 0) * 2
    + (compareSummary.sectionPathwayDelta || 0)
    - Math.max(0, -(compareSummary.totalEventsDelta || 0))
    - Math.max(0, compareSummary.weakestDropoffDelta || 0);

  if (score >= 2) {
    return { status: 'improved', label: 'Improved', reason: 'Higher downstream conversion with acceptable pathway quality.' };
  }

  if (score <= -2) {
    return { status: 'regressed', label: 'Regressed', reason: 'Weaker downstream conversion or more dropoff than the baseline.' };
  }

  return { status: 'neutral', label: 'Neutral', reason: 'Mixed movement across conversion and dropoff signals.' };
}

function renderPathwayItems(items = [], metricLabel) {
  if (!items.length) {
    return <div style={{ opacity: 0.72 }}>No telemetry yet.</div>;
  }

  return (
    <ul style={panelStyles.list}>
      {items.map((item) => (
        <li key={`${item.label}-${item.source}-${item.step || metricLabel}`} style={panelStyles.item}>
          <strong>{item.label}</strong>
          <div>{item.source} · {item.retained}</div>
          <div>
            {metricLabel === 'pathways'
              ? `${item.count} opens · ${item.progressRate}% progressed`
              : `${item.recommendations} recommendations · ${item.modalRate}% modal conversion`}
          </div>
        </li>
      ))}
    </ul>
  );
}

const DebugPanel = ({
  showRoutes = false,
  showPerformance = false,
  showState = false,
  showTelemetry = false,
  initialState = {},
  exportContext = {},
  routes = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [performanceData, setPerformanceData] = useState(null);
  const [telemetryVersion, setTelemetryVersion] = useState(0);
  const [copyState, setCopyState] = useState('idle');
  const [exportState, setExportState] = useState('idle');
  const [compareState, setCompareState] = useState('idle');
  const [compareSummary, setCompareSummary] = useState(null);

  useEffect(() => {
    if (!DEBUG_ENABLED || !showPerformance) return undefined;

    const timer = setInterval(() => {
      if (window.performance && window.performance.memory) {
        setPerformanceData({
          memory: Math.round(window.performance.memory.usedJSHeapSize / 1048576),
          total: Math.round(window.performance.memory.totalJSHeapSize / 1048576),
        });
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [showPerformance]);

  useEffect(() => {
    if (!DEBUG_ENABLED || !showTelemetry) return undefined;

    const handleTelemetryUpdate = () => setTelemetryVersion((value) => value + 1);
    window.addEventListener('uro-telemetry-update', handleTelemetryUpdate);

    return () => window.removeEventListener('uro-telemetry-update', handleTelemetryUpdate);
  }, [showTelemetry]);

  const telemetrySnapshot = useMemo(() => {
    if (!showTelemetry) {
      return null;
    }

    return getTelemetrySnapshot();
  }, [showTelemetry, telemetryVersion]);
  const compareVerdict = useMemo(() => getCompareVerdict(compareSummary), [compareSummary]);

  const handleCopySummary = async () => {
    if (!telemetrySnapshot) {
      return;
    }

    const summary = formatTelemetrySummary(telemetrySnapshot);

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(summary);
      } else {
        throw new Error('Clipboard unavailable');
      }

      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  };

  const handleExportJson = () => {
    if (!telemetrySnapshot || typeof document === 'undefined' || typeof URL === 'undefined') {
      setExportState('failed');
      return;
    }

    try {
      const payload = buildTelemetryExport(telemetrySnapshot, exportContext);
      const blob = new Blob([payload], { type: 'application/json' });
      const objectUrl = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const link = document.createElement('a');

      link.href = objectUrl;
      link.download = `uromed-telemetry-${timestamp}.json`;
      link.click();
      URL.revokeObjectURL(objectUrl);
      setExportState('exported');
    } catch {
      setExportState('failed');
    }
  };

  const handleCompareFile = (event) => {
    const file = event.target.files?.[0];

    if (!file || !telemetrySnapshot || typeof FileReader === 'undefined') {
      setCompareState('failed');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const baseExport = JSON.parse(buildTelemetryExport(telemetrySnapshot, exportContext));
        setCompareSummary(compareTelemetryExports(baseExport, parsed));
        setCompareState('ready');
      } catch {
        setCompareSummary(null);
        setCompareState('failed');
      }
    };
    reader.onerror = () => {
      setCompareSummary(null);
      setCompareState('failed');
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  if (!DEBUG_ENABLED) return null;

  return (
    <>
      <button
        className="debug-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open debug panel"
        style={panelStyles.toggle}
      >
        Debug
      </button>

      {isOpen && (
        <div className="debug-panel" style={panelStyles.panel}>
          <h4 style={{ margin: '0 0 12px', color: '#f1cc7a' }}>Debug Panel</h4>

          {showTelemetry && telemetrySnapshot && (
            <div style={panelStyles.section}>
              <strong>Telemetry snapshot</strong>
              <div style={{ marginTop: '6px', lineHeight: 1.5 }}>
                <div>Total events: {telemetrySnapshot.totalEvents}</div>
                <div>Section pathway events: {telemetrySnapshot.sectionPathwayEvents}</div>
                <div>Modal open events: {telemetrySnapshot.modalOpenEvents}</div>
                <div>Last updated: {telemetrySnapshot.lastUpdatedAt || 'No events yet'}</div>
              </div>

              <div style={{ marginTop: '10px' }}>
                <strong>Top subsection pathways</strong>
                {renderPathwayItems(telemetrySnapshot.topPathways, 'pathways')}
              </div>

              <div style={{ marginTop: '10px' }}>
                <strong>Top disease recommendations</strong>
                {renderPathwayItems(telemetrySnapshot.topRecommendations, 'recommendations')}
              </div>

              <div style={{ marginTop: '10px' }}>
                <strong>Weakest dropoff points</strong>
                {telemetrySnapshot.weakestDropoffs.length ? (
                  <ul style={panelStyles.list}>
                    {telemetrySnapshot.weakestDropoffs.map((item) => (
                      <li key={`${item.label}-${item.source}-dropoff`} style={panelStyles.item}>
                        <strong>{item.label}</strong>
                        <div>{item.source} · {item.retained}</div>
                        <div>{item.count} entries · {item.dropoffRate}% dropoff</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ opacity: 0.72, marginTop: '6px' }}>No dropoff data yet.</div>
                )}
              </div>
              {copyState === 'copied' && (
                <div style={{ marginTop: '10px', color: '#9ad7b0' }}>Summary copied.</div>
              )}
              {copyState === 'failed' && (
                <div style={{ marginTop: '10px', color: '#f1b7a8' }}>Clipboard unavailable.</div>
              )}
              {exportState === 'exported' && (
                <div style={{ marginTop: '10px', color: '#9ad7b0' }}>JSON exported.</div>
              )}
              {exportState === 'failed' && (
                <div style={{ marginTop: '10px', color: '#f1b7a8' }}>Export unavailable.</div>
              )}
              {compareState === 'ready' && compareSummary && (
                <div style={{ marginTop: '10px' }}>
                  <strong>Compare export</strong>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontWeight: 700,
                      marginTop: '8px',
                      background:
                        compareVerdict.status === 'improved'
                          ? 'rgba(76, 175, 124, 0.18)'
                          : compareVerdict.status === 'regressed'
                            ? 'rgba(205, 92, 92, 0.18)'
                            : 'rgba(201, 168, 76, 0.18)',
                      color:
                        compareVerdict.status === 'improved'
                          ? '#9ad7b0'
                          : compareVerdict.status === 'regressed'
                            ? '#f1b7a8'
                            : '#f1cc7a',
                    }}
                  >
                    Verdict: {compareVerdict.label}
                  </div>
                  <div style={{ marginTop: '6px', opacity: 0.86 }}>{compareVerdict.reason}</div>
                  <ul style={panelStyles.list}>
                    <li style={panelStyles.item}>Events delta: {compareSummary.totalEventsDelta}</li>
                    <li style={panelStyles.item}>Section pathway delta: {compareSummary.sectionPathwayDelta}</li>
                    <li style={panelStyles.item}>Modal open delta: {compareSummary.modalOpenDelta}</li>
                    <li style={panelStyles.item}>Weakest dropoff delta: {compareSummary.weakestDropoffDelta}</li>
                    <li style={panelStyles.item}>Top pathway: {compareSummary.topPathwayShift.base} {'->'} {compareSummary.topPathwayShift.compare}</li>
                    <li style={panelStyles.item}>Top recommendation: {compareSummary.topRecommendationShift.base} {'->'} {compareSummary.topRecommendationShift.compare}</li>
                    <li style={panelStyles.item}>Weakest dropoff: {compareSummary.weakestDropoffShift.base} {'->'} {compareSummary.weakestDropoffShift.compare}</li>
                    <li style={panelStyles.item}>View history delta: {compareSummary.retentionHistoryDelta}</li>
                    <li style={panelStyles.item}>Favorites delta: {compareSummary.favoritesDelta}</li>
                    <li style={panelStyles.item}>Active section: {compareSummary.activeSectionShift.base} {'->'} {compareSummary.activeSectionShift.compare}</li>
                  </ul>
                </div>
              )}
              {compareState === 'failed' && (
                <div style={{ marginTop: '10px', color: '#f1b7a8' }}>Compare unavailable.</div>
              )}
            </div>
          )}

          {showPerformance && performanceData && (
            <div style={panelStyles.section}>
              <strong>Performance</strong>
              <pre style={panelStyles.pre}>
                Memory: {performanceData.memory}MB / {performanceData.total}MB
              </pre>
            </div>
          )}

          {showState && initialState && (
            <div style={panelStyles.section}>
              <strong>State</strong>
              <pre style={panelStyles.pre}>
                {JSON.stringify(initialState, null, 2)}
              </pre>
            </div>
          )}

          {showRoutes && routes.length > 0 && (
            <div style={panelStyles.section}>
              <strong>Routes</strong>
              <ul style={panelStyles.list}>
                {routes.map((route, index) => (
                  <li key={`${route.path}-${index}`} style={panelStyles.item}>
                    {route.path} {'->'} {route.component}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={panelStyles.controls}>
            {showTelemetry && (
              <label style={panelStyles.button}>
                Compare export
                <input
                  type="file"
                  accept="application/json,.json"
                  aria-label="Compare export file"
                  onChange={handleCompareFile}
                  style={{ display: 'none' }}
                />
              </label>
            )}
            {showTelemetry && (
              <button onClick={handleExportJson} style={panelStyles.button}>
                Export JSON
              </button>
            )}
            {showTelemetry && (
              <button onClick={handleCopySummary} style={panelStyles.button}>
                Copy summary
              </button>
            )}
            {showTelemetry && (
              <button
                onClick={() => {
                  clearTelemetryEvents();
                  setTelemetryVersion((value) => value + 1);
                  setCopyState('idle');
                  setExportState('idle');
                  setCompareState('idle');
                  setCompareSummary(null);
                }}
                style={panelStyles.button}
              >
                Clear telemetry
              </button>
            )}
            <button onClick={() => setIsOpen(false)} style={panelStyles.button}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

DebugPanel.propTypes = {
  showRoutes: PropTypes.bool,
  showPerformance: PropTypes.bool,
  showState: PropTypes.bool,
  showTelemetry: PropTypes.bool,
  initialState: PropTypes.object,
  exportContext: PropTypes.object,
  routes: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string,
    component: PropTypes.string,
  })),
};

DebugPanel.defaultProps = {
  showRoutes: false,
  showPerformance: false,
  showState: false,
  showTelemetry: false,
  initialState: {},
  exportContext: {},
  routes: [],
};

export default DebugPanel;
export { buildTelemetryExport, compareTelemetryExports, formatTelemetrySummary, getCompareVerdict };

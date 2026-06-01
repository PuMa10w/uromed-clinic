import React from 'react';
import { diseaseIcons } from './diseaseIcons';
import { trackHistoryReopen } from '../utils/analytics';

const historySourceLabels = {
  search: 'Search',
  search_overlay_symptom: 'Symptom search',
  landing_quick_access: 'Landing shortcut',
  landing_symptom_entry: 'Landing symptom',
  section_grid: 'Section grid',
  modal_adjacent: 'Adjacent article',
  modal_related_journey: 'Related journey',
  modal_pathway_action: 'Pathway action',
  modal_symptom_entry: 'Symptom route',
  history_reopen: 'History reopen',
  retention_recommendation: 'Retention recommendation',
  direct_url: 'Direct link',
  direct_navigation: 'Direct open',
};

function getHistorySourceLabel(source) {
  if (!source) return '';
  return historySourceLabels[source] || source.replace(/_/g, ' ');
}

function getOpenCountLabel(openCount) {
  if (!openCount || openCount <= 1) return '1 open';
  return `${openCount} opens`;
}

function getTopRetainedItem(history) {
  return [...history].sort((left, right) => (right.openCount || 0) - (left.openCount || 0))[0] || null;
}

function getTopRetainedSource(history) {
  const sourceTotals = history.reduce((acc, item) => {
    Object.entries(item.sourceCounts || {}).forEach(([source, count]) => {
      acc[source] = (acc[source] || 0) + count;
    });
    return acc;
  }, {});

  const [source, count] = Object.entries(sourceTotals).sort((left, right) => right[1] - left[1])[0] || [];
  if (!source) return null;

  return {
    source,
    count,
    label: getHistorySourceLabel(source),
  };
}

function getRetentionRecommendations(history, topRetainedItem, topRetainedSource) {
  const filtered = history.filter((item) => item.id !== topRetainedItem?.id);
  const prioritized = filtered.sort((left, right) => {
    const leftSourceMatch = left.lastSource === topRetainedSource?.source ? 1 : 0;
    const rightSourceMatch = right.lastSource === topRetainedSource?.source ? 1 : 0;

    if (leftSourceMatch !== rightSourceMatch) return rightSourceMatch - leftSourceMatch;
    return (right.openCount || 0) - (left.openCount || 0);
  });

  return prioritized.slice(0, 2);
}

const HistoryPanel = ({ history = [], onNavigate, onClear }) => {
  if (history.length === 0) return null;

  const topRetainedItem = getTopRetainedItem(history);
  const topRetainedSource = getTopRetainedSource(history);
  const retentionRecommendations = getRetentionRecommendations(history, topRetainedItem, topRetainedSource);

  return (
    <div className="history-panel service-card-shell">
      <div className="history-header">
        <div className="service-heading-stack">
          <span className="service-eyebrow">Recent views</span>
          <h4>Недавние открытия</h4>
        </div>
        <button className="history-clear-btn" onClick={onClear}>Очистить</button>
      </div>

      {(topRetainedItem || topRetainedSource) && (
        <div className="history-list">
          {topRetainedItem && (
            <div className="history-item" role="note" aria-label="Most revisited condition">
              <span className="history-icon">{diseaseIcons[topRetainedItem.id] || topRetainedItem.icon || '📈'}</span>
              <div className="history-info">
                <span className="history-name">Most revisited: {topRetainedItem.name}</span>
                <span className="history-time">{getOpenCountLabel(topRetainedItem.openCount || 1)}</span>
              </div>
            </div>
          )}
          {topRetainedSource && (
            <div className="history-item" role="note" aria-label="Top retained source">
              <span className="history-icon">🧭</span>
              <div className="history-info">
                <span className="history-name">Top retained source: {topRetainedSource.label}</span>
                <span className="history-time">{topRetainedSource.count} retained opens</span>
              </div>
            </div>
          )}
        </div>
      )}

      {retentionRecommendations.length > 0 && (
        <div className="history-list">
          <div className="history-item" role="note" aria-label="Retention-aware recommendations">
            <div className="history-info">
              <span className="history-name">Retention-aware next reads</span>
              <span className="history-time">Based on your strongest returning pathways</span>
            </div>
          </div>
          {retentionRecommendations.map((item) => (
            <button
              key={`retention-${item.id}`}
              className="history-item"
              onClick={() => onNavigate(item.section, item.subsection, item.id, { source: 'retention_recommendation' })}
            >
              <span className="history-icon">
                {diseaseIcons[item.id] || item.icon || '📘'}
              </span>
              <div className="history-info">
                <span className="history-name">{item.name}</span>
                {item.lastSource && <span className="history-time">{getHistorySourceLabel(item.lastSource)}</span>}
                {item.openCount && <span className="history-time">{getOpenCountLabel(item.openCount)}</span>}
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="history-list">
        {history.slice(0, 8).map((item, index) => (
          <button
            key={item.id + index}
            className="history-item"
            onClick={() => {
              trackHistoryReopen(item.id, item.lastSource || item.source, item.openCount || 1);
              onNavigate(item.section, item.subsection, item.id, { source: 'history_reopen' });
            }}
          >
            <span className="history-icon">
              {diseaseIcons[item.id] || item.icon || '📋'}
            </span>
            <div className="history-info">
              <span className="history-name">{item.name}</span>
              {item.lastSource && <span className="history-time">{getHistorySourceLabel(item.lastSource)}</span>}
              {item.openCount && <span className="history-time">{getOpenCountLabel(item.openCount)}</span>}
              <span className="history-time">{item.time}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;

import React from 'react';
import PropTypes from 'prop-types';
import { sectionNames, subsectionLabels } from '../data/navigationMeta';

const osActions = [
  { id: 'search', label: 'Поиск', meta: 'Ctrl/⌘ K', target: null },
  { id: 'emergency', label: 'Urgent', meta: 'красные флаги', target: 'emergency' },
  { id: 'drugs', label: 'Препараты', meta: 'риски и мониторинг', target: 'drugs' },
  { id: 'sperm', label: 'Спермограмма', meta: 'fertility tree', target: 'calculators', tool: 'sperm-tree' },
  { id: 'atlas', label: '3D', meta: 'clinical atlas', target: 'atlas' },
];

function ClinicalOperatingSystem({
  activeSection,
  activeSubsection,
  favoritesCount,
  historyCount,
  onNavigate,
}) {
  const sectionLabel = sectionNames[activeSection] || 'UroMed';
  const subsectionLabel = activeSubsection ? subsectionLabels[activeSubsection] : 'рабочий контекст';

  const handleAction = (action) => {
    if (!action.target) {
      window.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'k',
        code: 'KeyK',
        ctrlKey: true,
        bubbles: true,
      }));
      return;
    }

    onNavigate(action.target, null, null, {
      source: 'v20_clinical_os',
      tool: action.tool,
    });
  };

  return (
    <section
      className="clinical-os-strip"
      data-v20-clinical-os="true"
      data-v21-clinical-os="true"
      aria-label="Clinical Operating System"
    >
      <div className="clinical-os-context">
        <span className="clinical-os-kicker">Clinical OS</span>
        <strong>{sectionLabel}</strong>
        <span>{subsectionLabel}</span>
      </div>
      <div className="clinical-os-signal" aria-label="Контекст работы">
        <span>{favoritesCount} избранных</span>
        <span>{historyCount} последних</span>
        <span>local-only tools</span>
      </div>
      <div className="clinical-os-actions home-workbench-actions" data-scrollable="x" aria-label="Быстрые действия">
        {osActions.map((action) => (
          <button
            key={action.id}
            type="button"
            className="clinical-os-action"
            onClick={() => handleAction(action)}
          >
            <span>{action.label}</span>
            <small>{action.meta}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

ClinicalOperatingSystem.propTypes = {
  activeSection: PropTypes.string.isRequired,
  activeSubsection: PropTypes.string,
  favoritesCount: PropTypes.number,
  historyCount: PropTypes.number,
  onNavigate: PropTypes.func.isRequired,
};

ClinicalOperatingSystem.defaultProps = {
  activeSubsection: null,
  favoritesCount: 0,
  historyCount: 0,
};

export default React.memo(ClinicalOperatingSystem);

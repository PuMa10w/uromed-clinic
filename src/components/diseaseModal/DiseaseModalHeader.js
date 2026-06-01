import React from 'react';
import PropTypes from 'prop-types';
import { diseaseIcons } from '../diseaseIcons';
import { getHeaderTags } from '../../utils/cardMetadata';
import { sectionNames, subsectionLabels } from '../../data';

const getLeadText = (disease) => {
  const source =
    disease.description
    || disease.quickSummary?.firstLine
    || disease.definition
    || '';

  if (!source) return '';
  return source.length > 220 ? `${source.slice(0, 217).trim()}...` : source;
};

const getClinicalSignals = (disease) => {
  const signals = [];

  if (Array.isArray(disease.redFlags) && disease.redFlags.length > 0) {
    signals.push('Есть красные флаги');
  }

  if (disease.subsection === 'fertility') {
    signals.push('Фертильность в фокусе');
  } else if (disease.subsection === 'oncology') {
    signals.push('Нужна стратификация риска');
  } else if (disease.subsection === 'infections') {
    signals.push('Требует быстрой эскалации');
  } else if (disease.subsection === 'stones') {
    signals.push('Контроль обструкции');
  } else if (disease.subsection === 'sexual') {
    signals.push('Функциональный и сосудистый контекст');
  } else if (disease.subsection === 'endocrine') {
    signals.push('Гормональная интерпретация');
  }

  // Review date display removed per Russian localization requirements

  return signals.slice(0, 3);
};

const getRiskMarkers = (disease) => {
  const markers = [];

  if (Array.isArray(disease.redFlags) && disease.redFlags.length > 0) {
    markers.push({ tone: 'urgent', label: 'Срочный обзор' });
  }

  if (disease.subsection === 'oncology') {
    markers.push({ tone: 'oncology', label: 'Онконастороженность' });
  }

  if (disease.subsection === 'fertility') {
    markers.push({ tone: 'fertility', label: 'Фертильность' });
  }

  if (disease.subsection === 'infections') {
    markers.push({ tone: 'infection', label: 'Инфекционный риск' });
  }

  if (disease.subsection === 'stones' || disease.section === 'nephrology') {
    markers.push({ tone: 'renal', label: 'Почечный контекст' });
  }

  if (disease.followUp || disease.subsection === 'functional' || disease.subsection === 'endocrine') {
    markers.push({ tone: 'monitoring', label: 'Нуждается в наблюдении' });
  }

  return markers.slice(0, 3);
};

const getPathwayMarkers = (disease) => {
  const markers = [];

  if (disease.subsection === 'endocrine' || disease.whenToRefer?.toEndocrinology?.length) {
    markers.push({ tone: 'endocrine', label: 'Эндокринный обзор' });
  }

  if (disease.subsection === 'fertility' || disease.whenToRefer?.toReproductiveSpecialist?.length) {
    markers.push({ tone: 'couple', label: 'Парный маршрут' });
  }

  if (disease.whenToRefer?.toGenetics?.length || disease.id === 'azoospermia') {
    markers.push({ tone: 'genetics', label: 'Генетический маршрут' });
  }

  if (disease.subsection === 'sexual' || disease.whenToRefer?.toCardiology?.length) {
    markers.push({ tone: 'cardio', label: 'Кардиометаболический обзор' });
  }

  return markers.slice(0, 4);
};

const getPatientSummary = (disease) => (
  disease.quickSummary?.firstLine
  || disease.definition
  || disease.description
  || 'Материал помогает быстро понять суть состояния, уровень риска и следующий клинический шаг.'
);

const getClinicalFocus = (disease) => {
  if (disease.subsection === 'stones') return 'Оценить обструкцию, инфекцию, необходимость визуализации и тактику декомпрессии.';
  if (disease.subsection === 'infections') return 'Разделить амбулаторный и ургентный сценарий, исключить сепсис и обструкцию.';
  if (disease.subsection === 'oncology') return 'Уточнить риск, стадирование и маршрут дообследования без задержек.';
  if (disease.subsection === 'sexual') return 'Оценить сосудистые, психогенные и эндокринные факторы, не теряя patient-safe tone.';
  if (disease.subsection === 'fertility') return 'Сопоставить спермограмму, гормональный контур и репродуктивный маршрут пары.';
  if (disease.subsection === 'endocrine') return 'Интерпретировать гормональный профиль в связке с симптомами и репродуктивными планами.';

  return 'Используйте карточку как клинический dossier: симптомы, red flags, диагностика, лечение и follow-up в одном потоке.';
};

export default function DiseaseModalHeader({
  disease,
  isMobile,
  allDiseases,
  currentIndex,
  onNavigate,
  onClose,
}) {
  const leadText = getLeadText(disease);
  const clinicalSignals = getClinicalSignals(disease);
  const riskMarkers = getRiskMarkers(disease);
  const pathwayMarkers = getPathwayMarkers(disease);
  const patientSummary = getPatientSummary(disease);
  const clinicalFocus = getClinicalFocus(disease);
  const sectionLabel = (sectionNames || {})[disease.section] || disease.section;
  const subsectionLabel = (subsectionLabels || {})[disease.subsection] || disease.subsection;

  return (
    <div className="modal-header">
      <div className="modal-header-main">
        {isMobile && <button className="modal-back-btn" onClick={onClose}>Назад</button>}
        <div className="modal-header-identity">
          <div className="modal-header-icon">
            {diseaseIcons[disease.id] || <span style={{ fontSize: '3rem' }}>{disease.icon}</span>}
          </div>
          <div className="modal-header-copy">
            <div className="modal-header-eyebrow">
              <span className="modal-header-section">{sectionLabel}</span>
              {subsectionLabel && <span className="modal-header-subsection">{subsectionLabel}</span>}
            </div>
            <h2 className="modal-title" id="modal-title">{disease.name}</h2>
            <div className="modal-header-meta">
              <div className="modal-header-icd">МКБ-10: {disease.icd}</div>
              {disease.evidenceVersion && (
                <div className="modal-header-evidence">{disease.evidenceVersion}</div>
              )}
            </div>
            <div className="modal-header-badges">
              {getHeaderTags(disease).map((tag, i) => (
                <span key={i} className={`badge ${i === 0 ? 'badge-eau' : i === 1 ? 'badge-aua' : 'badge-ru'}`}>
                  {tag}
                </span>
              ))}
            </div>
            {riskMarkers.length > 0 && (
              <div className="modal-risk-row">
                {riskMarkers.map((marker) => (
                  <span key={marker.label} className={`modal-risk-badge modal-risk-${marker.tone}`}>
                    {marker.label}
                  </span>
                ))}
              </div>
            )}
            {pathwayMarkers.length > 0 && (
              <div className="modal-pathway-row">
                {pathwayMarkers.map((marker) => (
                  <span key={marker.label} className={`modal-pathway-badge modal-pathway-${marker.tone}`}>
                    {marker.label}
                  </span>
                ))}
              </div>
            )}
            {clinicalSignals.length > 0 && (
              <div className="modal-header-signal-row">
                {clinicalSignals.map((signal) => (
                  <span key={signal} className="modal-header-signal">
                    {signal}
                  </span>
                ))}
              </div>
            )}
            {leadText && <p className="modal-header-lead">{leadText}</p>}
            <div className="modal-summary-grid">
              <div className="modal-summary-card">
                <span className="modal-summary-kicker">КРАТКО</span>
                <p>{patientSummary}</p>
              </div>
              <div className="modal-summary-card modal-summary-card-accent">
                <span className="modal-summary-kicker">ФОКУС</span>
                <p>{clinicalFocus}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-header-actions">
        {allDiseases.length > 1 && (
          <>
            <button className="modal-nav-btn" onClick={() => onNavigate(-1)} disabled={currentIndex <= 0} aria-label="Предыдущая статья">←</button>
            <span className="modal-nav-counter" aria-live="polite">{currentIndex + 1} из {allDiseases.length}</span>
            <button className="modal-nav-btn" onClick={() => onNavigate(1)} disabled={currentIndex >= allDiseases.length - 1} aria-label="Следующая статья">→</button>
          </>
        )}
        <button className="modal-close" onClick={onClose} aria-label="Закрыть">✕</button>
      </div>
    </div>
  );
}

DiseaseModalHeader.propTypes = {
  disease: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icd: PropTypes.string,
    icon: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    section: PropTypes.string,
    subsection: PropTypes.string,
    description: PropTypes.string,
    definition: PropTypes.string,
    quickSummary: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    evidenceVersion: PropTypes.string,
    lastReviewed: PropTypes.string,
    redFlags: PropTypes.array,
    whenToRefer: PropTypes.object,
  }).isRequired,
  isMobile: PropTypes.bool.isRequired,
  allDiseases: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentIndex: PropTypes.number.isRequired,
  onNavigate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

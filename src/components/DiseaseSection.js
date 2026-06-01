import React, { useEffect, useMemo, useState } from 'react';
import DiseaseModal from './DiseaseModal';
import { diseaseIcons } from './diseaseIcons';
import VirtualizedDiseaseGrid from './VirtualizedDiseaseGrid';
import { LoadingSpinner } from './FeedbackComponents';
import { preloadDiseaseData } from '../data/lazyData';
import { getCardDescription, getCardTags } from '../utils/cardMetadata';
import { trackSectionPathway } from '../utils/analytics';

// react-window grid currently causes runtime crashes for some sections in production;
// keep classic grid rendering until virtualization is stabilized.
const VIRTUALIZATION_THRESHOLD = Number.MAX_SAFE_INTEGER;

const parseIcd = (icd = '') => {
  const normalized = String(icd).trim().toUpperCase();
  const match = normalized.match(/^([A-Z])(\d{1,2})(?:\.(\d+))?/);

  if (!match) {
    return {
      letter: 'Z',
      number: Number.MAX_SAFE_INTEGER,
      decimal: Number.MAX_SAFE_INTEGER,
      raw: normalized,
    };
  }

  return {
    letter: match[1],
    number: Number(match[2]),
    decimal: match[3] ? Number(match[3]) : -1,
    raw: normalized,
  };
};

const compareIcd = (a, b) => {
  const left = parseIcd(a.icd);
  const right = parseIcd(b.icd);

  if (left.letter !== right.letter) return left.letter.localeCompare(right.letter, 'ru');
  if (left.number !== right.number) return left.number - right.number;
  if (left.decimal !== right.decimal) return left.decimal - right.decimal;
  return a.name.localeCompare(b.name, 'ru');
};

const DiseaseSection = React.memo(({
  data,
  title,
  subtitle,
  allDiseases = [],
  onToggleFavorite = () => {},
  favorites = {},
  onNavigate,
  onCloseDisease,
  selectedDiseaseId = null,
  viewHistory = [],
}) => {
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [sortBy, setSortBy] = useState('icd');
  const [loadingDiseaseId, setLoadingDiseaseId] = useState(null);

  const sortedData = useMemo(() => {
    const sorted = [...data];

    if (sortBy === 'name') {
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    }

    if (sortBy === 'icd' || sortBy === 'default') {
      return sorted.sort(compareIcd);
    }

    return sorted;
  }, [data, sortBy]);

  const getVisibleTags = (disease) => getCardTags(disease).slice(0, 2);

  const pathwayRecommendations = useMemo(() => (
    sortedData.slice(0, Math.min(3, sortedData.length)).map((disease) => ({
      disease,
      retained: false,
      meta: disease.icd ? `МКБ-10: ${disease.icd}` : disease.subsection || disease.section,
    }))
  ), [sortedData]);

  const handleCardClick = async (disease, idx) => {
    setSelectedIdx(idx);
    setLoadingDiseaseId(disease.id);

    onNavigate?.(disease.section, disease.subsection, disease.id, {
      preserveScroll: true,
      source: 'section_grid',
    });

    try {
      const fullDisease = await preloadDiseaseData(disease.id);
      setSelectedDisease(fullDisease || disease);
    } finally {
      setLoadingDiseaseId(null);
    }
  };

  const handleCardPrefetch = (diseaseId) => {
    preloadDiseaseData(diseaseId);
  };

  const handleRecommendationClick = (recommendation) => {
    const source = recommendation.retained
      ? 'section_retained_disease_recommendation'
      : 'section_disease_recommendation';
    const target = recommendation.disease;

    onNavigate?.(target.section, target.subsection, target.id, {
      preserveScroll: true,
      source,
    });

    trackSectionPathway({
      step: 'disease_recommendation',
      section: target.section,
      subsection: target.subsection,
      targetId: target.id,
      source,
      retained: recommendation.retained,
    });
  };

  const navigateModal = async (direction) => {
    const newIdx = selectedIdx + direction;

    if (newIdx < 0 || newIdx >= sortedData.length) {
      return;
    }

    setSelectedIdx(newIdx);
    setLoadingDiseaseId(sortedData[newIdx].id);

    const fullDisease = await preloadDiseaseData(sortedData[newIdx].id);
    setSelectedDisease(fullDisease || sortedData[newIdx]);
    setLoadingDiseaseId(null);

    onNavigate?.(
      sortedData[newIdx].section,
      sortedData[newIdx].subsection,
      sortedData[newIdx].id,
      {
        preserveScroll: true,
        source: 'modal_adjacent',
      },
    );
  };

  useEffect(() => {
    if (!selectedDiseaseId) {
      setSelectedDisease(null);
      return;
    }

    const idx = sortedData.findIndex((disease) => disease.id === selectedDiseaseId);

    if (idx < 0) {
      setSelectedDisease(null);
      setLoadingDiseaseId(null);
      return;
    }

    setSelectedIdx(idx);
    setLoadingDiseaseId(sortedData[idx].id);
    preloadDiseaseData(sortedData[idx].id).then((fullDisease) => {
      setSelectedDisease(fullDisease || sortedData[idx]);
      setLoadingDiseaseId(null);
    });
  }, [selectedDiseaseId, sortedData]);

  const handleModalClose = () => {
    setSelectedDisease(null);
    if (selectedDiseaseId) {
      onCloseDisease?.({ fallbackSection: 'home' });
    }
  };

  return (
    <section className="section" aria-label={title}>
      <h2 className="section-title">{title}</h2>

      <p className="section-subtitle">
        {subtitle || 'Выберите карточку, чтобы быстро перейти к диагностике, лечению, красным флагам и маршрутизации.'}
      </p>

      <div className="sort-controls" role="toolbar" aria-label="Сортировка" data-scrollable="x">
        <button
          className={`sort-btn ${sortBy === 'default' ? 'active' : ''}`}
          onClick={() => setSortBy('default')}
          aria-pressed={sortBy === 'default'}
        >
          Клинический порядок
        </button>
        <button
          className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`}
          onClick={() => setSortBy('name')}
          aria-pressed={sortBy === 'name'}
        >
          А-Я
        </button>
        <button
          className={`sort-btn ${sortBy === 'icd' ? 'active' : ''}`}
          onClick={() => setSortBy('icd')}
          aria-pressed={sortBy === 'icd'}
        >
          По МКБ
        </button>
      </div>

      {pathwayRecommendations.length > 0 && (
        <div className="pathway-recommendations" aria-label="Pathway recommendations">
          <h3 className="sr-only">Pathway recommendations</h3>
          {pathwayRecommendations.map((recommendation) => (
            <button
              key={recommendation.disease.id}
              type="button"
              className={`pathway-recommendation-btn ${recommendation.retained ? 'is-retained' : ''}`}
              onClick={() => handleRecommendationClick(recommendation)}
              onMouseEnter={() => handleCardPrefetch(recommendation.disease.id)}
              onFocus={() => handleCardPrefetch(recommendation.disease.id)}
            >
              <span className="pathway-recommendation-title">{recommendation.disease.name}</span>
              <span className="pathway-recommendation-meta">{recommendation.meta}</span>
            </button>
          ))}
        </div>
      )}

      {sortedData.length === 0 ? (
        <div className="no-data" role="status">
          В этом разделе пока нет материалов для отображения.
        </div>
      ) : sortedData.length >= VIRTUALIZATION_THRESHOLD ? (
        <VirtualizedDiseaseGrid
          data={sortedData}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
          onCardClick={(disease) => handleCardClick(disease, sortedData.indexOf(disease))}
          onCardPrefetch={handleCardPrefetch}
        />
      ) : (
        <div className="cards-grid" role="list">
          {sortedData.map((disease, index) => (
            <div
              key={disease.id}
              className="disease-card"
              onClick={() => handleCardClick(disease, index)}
              onMouseEnter={() => handleCardPrefetch(disease.id)}
              onFocus={() => handleCardPrefetch(disease.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  handleCardClick(disease, index);
                }
              }}
              aria-label={`${disease.name}, ${disease.icd}`}
            >
              <button
                className="fav-btn"
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleFavorite(disease.id);
                }}
                aria-label={favorites[disease.id] ? 'Убрать из избранного' : 'Добавить в избранное'}
              >
                {favorites[disease.id] ? '★' : '☆'}
              </button>

              <div className="card-header">
                <div className="card-icon" style={{ pointerEvents: 'none' }}>
                  {diseaseIcons[disease.id] || <span style={{ fontSize: '1.5rem' }}>{disease.icon}</span>}
                </div>
                <div style={{ pointerEvents: 'none' }}>
                  <div className="card-meta-row">
                    <span className="card-kicker">{disease.subsection || disease.section}</span>
                    <span className="card-icd">МКБ-10: {disease.icd}</span>
                  </div>
                  <h3 className="card-title">{disease.name}</h3>
                </div>
              </div>

              <p className="card-description" style={{ pointerEvents: 'none' }}>
                {getCardDescription(disease)}
              </p>

              <div className="card-tags" style={{ pointerEvents: 'none' }}>
                {getVisibleTags(disease).map((tag, idx) => (
                  <span key={idx} className={`tag ${idx === 0 ? 'eau' : ''}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedDisease && (
        <DiseaseModal
          disease={selectedDisease}
          allDiseases={allDiseases.length ? allDiseases : sortedData}
          currentIndex={selectedIdx}
          onNavigate={navigateModal}
          onClose={handleModalClose}
          onNavigateToDisease={onNavigate}
        />
      )}

      {loadingDiseaseId && !selectedDisease && (
        <div className="modal-overlay" role="status" aria-live="polite">
          <div
            className="modal-content"
            style={{ minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <LoadingSpinner label="Загрузка статьи..." />
          </div>
        </div>
      )}
    </section>
  );
});

export default DiseaseSection;

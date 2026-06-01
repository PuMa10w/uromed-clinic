import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'react-window';
import { diseaseIcons } from './diseaseIcons';
import { getCardDescription, getCardTags } from '../utils/cardMetadata';

const CARD_WIDTH = 280;
const CARD_HEIGHT = 280;
const GAP = 24;

const DiseaseCard = React.memo(({
  disease,
  favorites,
  onToggleFavorite,
  onCardClick,
  onCardPrefetch,
  style,
}) => {
  return (
    <div
      style={style}
      className="disease-card"
      onClick={() => onCardClick(disease)}
      onMouseEnter={() => onCardPrefetch(disease.id)}
      onFocus={() => onCardPrefetch(disease.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          onCardClick(disease);
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
          <h3 className="card-title">{disease.name}</h3>
          <div className="card-icd">МКБ-10: {disease.icd}</div>
        </div>
      </div>

      <p className="card-description" style={{ pointerEvents: 'none' }}>
        {getCardDescription(disease)}
      </p>

      <div className="card-tags" style={{ pointerEvents: 'none' }}>
        {getCardTags(disease).slice(0, 4).map((tag, idx) => (
          <span key={idx} className={`tag ${idx === 0 ? 'eau' : ''} ${idx === 3 ? 'australian' : ''}`}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
});

DiseaseCard.propTypes = {
  disease: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icd: PropTypes.string,
    icon: PropTypes.string,
    description: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  favorites: PropTypes.objectOf(PropTypes.bool).isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  onCardClick: PropTypes.func.isRequired,
  onCardPrefetch: PropTypes.func.isRequired,
  style: PropTypes.object,
};

DiseaseCard.displayName = 'DiseaseCard';

const VirtualizedDiseaseGrid = React.memo(({
  data,
  favorites,
  onToggleFavorite,
  onCardClick,
  onCardPrefetch,
}) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 600 });
  const [columnCount, setColumnCount] = useState(4);

  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) {
        return;
      }

      const { width, height } = containerRef.current.getBoundingClientRect();
      const cols = Math.max(1, Math.floor((width + GAP) / (CARD_WIDTH + GAP)));
      setColumnCount(cols);
      setDimensions({ width, height: Math.max(400, height) });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const rowCount = Math.ceil(data.length / columnCount);
  const columnWidth = Math.min(CARD_WIDTH, (dimensions.width - GAP) / columnCount);

  const Cell = useCallback(({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= data.length) {
      return null;
    }

    const adjustedStyle = {
      ...style,
      left: style.left + GAP / 2,
      top: style.top + GAP / 2,
      width: style.width - GAP,
      height: style.height - GAP,
    };

    return (
      <DiseaseCard
        disease={data[index]}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onCardClick={onCardClick}
        onCardPrefetch={onCardPrefetch}
        style={adjustedStyle}
      />
    );
  }, [columnCount, data, favorites, onCardClick, onCardPrefetch, onToggleFavorite]);

  if (data.length === 0) {
    return <div className="no-data">В этом разделе пока нет материалов для отображения.</div>;
  }

  return (
    <div ref={containerRef} className="virtualized-grid-container" style={{ height: dimensions.height }}>
      <Grid
        columnCount={columnCount}
        columnWidth={columnWidth + GAP}
        height={dimensions.height}
        rowCount={rowCount}
        rowHeight={CARD_HEIGHT + GAP}
        width={dimensions.width}
        itemData={data}
      >
        {Cell}
      </Grid>
    </div>
  );
});

VirtualizedDiseaseGrid.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  favorites: PropTypes.objectOf(PropTypes.bool).isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  onCardClick: PropTypes.func.isRequired,
  onCardPrefetch: PropTypes.func.isRequired,
};

VirtualizedDiseaseGrid.displayName = 'VirtualizedDiseaseGrid';

export default VirtualizedDiseaseGrid;

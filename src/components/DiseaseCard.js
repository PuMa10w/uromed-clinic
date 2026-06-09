import React from 'react';
import { diseaseIcons } from './diseaseIcons';

const DiseaseCard = React.memo(({ 
  disease, 
  onClick, 
  isFavorite, 
  onToggleFavorite,
  isLoading = false 
}) => {
  const handleClick = () => {
    if (!isLoading && onClick) {
      onClick(disease);
    }
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading && onToggleFavorite) {
      onToggleFavorite(disease.id);
    }
  };

  const IconComponent = diseaseIcons[disease.section] || diseaseIcons.default;

  return (
    <article
      className="disease-card group cursor-pointer relative overflow-hidden"
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      tabIndex={0}
      role="button"
      aria-label={`Открыть карточку: ${disease.name}. МКБ-10: ${disease.icd}`}
    >
      <div className="flex flex-col h-full relative">
        {/* Status indicator bar */}
        {disease.risk && (
          <div 
            className={`absolute top-0 left-0 right-0 h-0.5 ${
              disease.risk === 'high' ? 'bg-red-500' : 
              disease.risk === 'moderate' ? 'bg-amber-500' : 
              'bg-emerald-500'
            }`}
          />
        )}

        {/* Header with icon and favorite */}
        <div className="flex items-start justify-between mb-sm">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
              {IconComponent && <IconComponent className="w-5 h-5 text-brand-primary" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-text-primary leading-snug m-0 truncate">
                {disease.name}
              </h3>
              {disease.icd && (
                <span className="text-xs text-text-tertiary font-medium">
                  МКБ-10: {disease.icd}
                </span>
              )}
            </div>
          </div>
          
          <button
            onClick={handleFavorite}
            className={`favorite-btn flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isFavorite ? 'text-brand-accent' : 'text-text-tertiary'
            }`}
            aria-label={isFavorite ? `Удалить из избранного` : `Добавить в избранное`}
            aria-pressed={isFavorite}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.043 16.057L10 15l1.057.943L10 15l-.957.943z" />
              <path d="M10 2l2.9 5.93 6.3.94-4.6 4.5.1 6.13L10 16.67l-5.7.4 0.1-6.1L.8 8.9l6.3-.94L10 2z" />
            </svg>
          </button>
        </div>

        {/* Description */}
        {disease.description && (
          <p className="text-sm text-text-secondary leading-relaxed mb-md line-clamp-2">
            {disease.description}
          </p>
        )}

        {/* Key metrics chips */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {disease.prevalence && (
            <span className="chip-chip text-xs px-2 py-1 rounded-full bg-surface-tertiary text-text-secondary">
              Распространённость: {disease.prevalence}
            </span>
          )}
          {disease.mortality && (
            <span className="chip-chip text-xs px-2 py-1 rounded-full bg-surface-tertiary text-text-secondary">
              Смертность: {disease.mortality}
            </span>
          )}
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="loading-shimmer absolute inset-0 rounded-lg" />
        )}
      </div>
    </article>
  );
});

DiseaseCard.displayName = 'DiseaseCard';

export default DiseaseCard;
import React from 'react';
import '../styles/servicePages.css';
import { diseaseIcons } from './diseaseIcons';
import { allDiseases } from '../data';
import { sectionNames, sectionIcons } from '../data/navigationMeta';
import { getFavoriteDescription, getFavoriteTags } from '../utils/cardMetadata';

const FavoritesPage = ({ favorites = {}, onNavigate }) => {
  const favoriteIds = Object.keys(favorites).filter((id) => favorites[id]);
  const favoriteDiseases = favoriteIds
    .map((id) => allDiseases.find((disease) => disease.id === id))
    .filter(Boolean);

  const grouped = {};
  favoriteDiseases.forEach((disease) => {
    const section = disease.section || 'other';
    if (!grouped[section]) grouped[section] = [];
    grouped[section].push(disease);
  });

  if (favoriteDiseases.length === 0) {
    return (
      <div className="empty-favorites service-empty-state service-page-shell">
        <span className="empty-icon" aria-hidden="true">☆</span>
        <span className="service-eyebrow">Saved knowledge</span>
        <h2>Избранное пока пустое</h2>
        <p>
          Сохраняйте важные нозологии, чтобы собирать свой быстрый clinical shortlist без
          лишнего поиска.
        </p>
        <button className="go-home-btn" onClick={() => onNavigate('home')}>
          На главную
        </button>
      </div>
    );
  }

  return (
    <section className="favorites-page service-page-shell">
      <div className="service-page-intro">
        <span className="service-eyebrow">Personal workspace</span>
        <h2 className="section-title">Избранное ({favoriteDiseases.length})</h2>
        <p className="section-subtitle">
          Личный clinical shortlist для быстрых возвратов к тем темам, которые вы открываете
          чаще всего.
        </p>
      </div>

      {Object.keys(grouped).map((section) => (
        <div key={section} className="favorites-group">
          <h3 className="group-title">
            {sectionIcons[section] || '📋'} {sectionNames[section] || section}
            <span className="group-count">{grouped[section].length}</span>
          </h3>
          <div className="favorites-grid">
            {grouped[section].map((disease) => (
              <article key={disease.id} className="fav-card">
                <button
                  className="fav-remove-btn"
                  type="button"
                  aria-label={`Удалить из избранного: ${disease.name}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onNavigate('remove-fav', disease.id);
                  }}
                >
                  ✕
                </button>
                <button
                  type="button"
                  className="fav-card-button"
                  onClick={() => onNavigate(disease.section, disease.subsection, disease.id)}
                  aria-label={`Открыть карточку: ${disease.name}`}
                >
                  <div className="fav-card-header">
                    <div className="fav-card-icon">
                      {diseaseIcons[disease.id] || <span>{disease.icon}</span>}
                    </div>
                    <div>
                      <h4>{disease.name}</h4>
                      <span className="fav-icd">МКБ-10: {disease.icd}</span>
                    </div>
                  </div>
                  <p className="fav-desc">{getFavoriteDescription(disease)}</p>
                  <div className="fav-tags">
                    {getFavoriteTags(disease).map((tag, tagIndex) => (
                      <span key={tagIndex} className={`fav-tag ${tagIndex === 0 ? 'eau' : ''}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default FavoritesPage;

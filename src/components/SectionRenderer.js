import React, { lazy } from 'react';
import PropTypes from 'prop-types';
import LazySection from './LazySection';
import { getSectionTitle, getSectionSubtitle, SUBSECTION_TITLES } from '../config/routes';

const LandingPage = lazy(() => import('./LandingPage'));
const ToolsSection = lazy(() => import('./ToolsSection'));
const FavoritesPage = lazy(() => import('./FavoritesPage'));
const EmergencyPage = lazy(() => import('./EmergencyPage'));
const SitemapPage = lazy(() => import('./SitemapPage'));
const CalculatorsPage = lazy(() => import('./CalculatorsPage'));
const SurgeryPage = lazy(() => import('./SurgeryPage'));
const MetaphylaxisPage = lazy(() => import('./MetaphylaxisPage'));
const UroHumorPage = lazy(() => import('./UroHumorPage'));
const PediatricUrology = lazy(() => import('../sections/PediatricUrology'));
const Clinical3DAtlas = lazy(() => import('./Clinical3DAtlas'));

const lazySections = {
  urology: {
    stones: lazy(() => import('../sections/UrologyStones')),
    infections: lazy(() => import('../sections/UrologyInfections')),
    oncology: lazy(() => import('../sections/UrologyOncology')),
    functional: lazy(() => import('../sections/UrologyFunctional')),
    reconstructive: lazy(() => import('../sections/UrologyReconstructive')),
    nephrology: lazy(() => import('../sections/UrologyNephrology')),
    pain: lazy(() => import('../sections/UrologyPain')),
  },
  andrology: {
    sexual: lazy(() => import('../sections/AndrologySexual')),
    fertility: lazy(() => import('../sections/AndrologyFertility')),
    endocrine: lazy(() => import('../sections/AndrologyEndocrine')),
  },
};

function renderSubsectionSelector(section, onNavigate) {
  const subsectionEntries = Object.entries(SUBSECTION_TITLES[section] || {});

  return (
    <div className="subsection-selector">
      <h2 className="section-title">{getSectionTitle(section)}</h2>
      <p className="section-subtitle">{getSectionSubtitle(section)}</p>
      <div className="subsection-grid">
        {subsectionEntries.map(([key, data]) => (
            <button
              key={key}
              className="subsection-card"
              onClick={() => onNavigate(section, key, null, { source: 'section_subsection' })}
            >
              <span className="subsection-icon">{data.icon}</span>
              <h3>{data.title}</h3>
              <p>{data.desc}</p>
            </button>
        ))}
      </div>
    </div>
  );
}

function renderLazyPage(Component, props = {}) {
  return (
    <LazySection>
      <Component {...props} />
    </LazySection>
  );
}

export default function SectionRenderer({
  activeSection,
  activeSubsection,
  selectedDiseaseId,
  favorites,
  toggleFavorite,
  viewHistory,
  onCloseDisease,
  onNavigate,
}) {
  const sectionProps = { favorites, onToggleFavorite: toggleFavorite, onCloseDisease, viewHistory };

  if (activeSection === 'home') {
    return renderLazyPage(LandingPage, { onNavigate, viewHistory, favorites });
  }

  if (activeSection === 'favorites') {
    return renderLazyPage(FavoritesPage, {
      favorites,
      onNavigate,
    });
  }

  if (activeSection === 'emergency') return renderLazyPage(EmergencyPage, { onNavigate });
  if (activeSection === 'sitemap') return renderLazyPage(SitemapPage, { onNavigate });
  if (activeSection === 'calculators') return renderLazyPage(CalculatorsPage, { onNavigate });
  if (activeSection === 'surgery') return renderLazyPage(SurgeryPage, { onNavigate });
  if (activeSection === 'metaphylaxis') return renderLazyPage(MetaphylaxisPage);
  if (activeSection === 'humor') return renderLazyPage(UroHumorPage);
  if (activeSection === 'atlas') return renderLazyPage(Clinical3DAtlas, { onNavigate });

  if (activeSection === 'urology') {
    if (activeSubsection && SUBSECTION_TITLES.urology[activeSubsection]) {
      const SectionComponent = lazySections.urology[activeSubsection];
      if (SectionComponent) {
        return renderLazyPage(SectionComponent, {
          ...sectionProps,
          selectedDiseaseId,
          onNavigate,
        });
      }
    }
    return renderSubsectionSelector('urology', onNavigate);
  }

  if (activeSection === 'andrology') {
    if (activeSubsection && SUBSECTION_TITLES.andrology[activeSubsection]) {
      const SectionComponent = lazySections.andrology[activeSubsection];
      if (SectionComponent) {
        return renderLazyPage(SectionComponent, {
          ...sectionProps,
          selectedDiseaseId,
          onNavigate,
        });
      }
    }
    return renderSubsectionSelector('andrology', onNavigate);
  }

  if (activeSection === 'pediatric') {
    return renderLazyPage(PediatricUrology, {
      ...sectionProps,
      selectedDiseaseId,
      onNavigate,
    });
  }

  if (activeSection === 'tools') return renderLazyPage(ToolsSection, { onNavigate });
  if (activeSection === 'drugs') return renderLazyPage(ToolsSection, { showDrugs: true, onNavigate });
  if (activeSection === 'glossary') return renderLazyPage(ToolsSection, { showGlossary: true, onNavigate });

  return null;
}

SectionRenderer.propTypes = {
  activeSection: PropTypes.string.isRequired,
  activeSubsection: PropTypes.string,
  selectedDiseaseId: PropTypes.string,
  favorites: PropTypes.objectOf(PropTypes.bool).isRequired,
  toggleFavorite: PropTypes.func.isRequired,
  viewHistory: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCloseDisease: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

SectionRenderer.defaultProps = {
  activeSubsection: null,
  selectedDiseaseId: null,
};

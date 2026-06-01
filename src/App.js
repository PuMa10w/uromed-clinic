import React, { useState, useEffect, useRef } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import './styles/ultraPremiumContract.css';
import './styles/v22WorkbenchLock.css';
import './styles/v23ClinicalWorkbench.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SeoHelmet from './components/SeoHelmet';
import SectionRenderer from './components/SectionRenderer';
import DebugPanel from './components/DebugPanel';
import ClinicalOperatingSystem from './components/ClinicalOperatingSystem';
import { sectionNames, subsectionLabels } from './data/navigationMeta';
import { useFavorites, useViewHistory } from './hooks/useLocalStorage';
import useAppNavigationState from './hooks/useAppNavigationState';
import ErrorBoundary from './components/ErrorBoundary';
import { trackModal } from './utils/analytics';

function App() {
  const showDebugPanel = process.env.NODE_ENV === 'development'
    && window.location.search.includes('debug=1');
  const [favorites, setFavorites, toggleFavorite] = useFavorites();
  const [viewHistory, addToHistory, clearHistory] = useViewHistory();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMobileShell, setIsMobileShell] = useState(() => window.innerWidth <= 900);
  const {
    activeSection,
    activeSubsection,
    selectedDiseaseId,
    navigationSource,
    setActiveSection,
    setActiveSubsection,
    closeDisease,
    handleNavigate,
  } = useAppNavigationState({ addToHistory, setFavorites });

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobileShell(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleMobileBack = () => {
    if (selectedDiseaseId) {
      closeDisease();
      return;
    }

    if (activeSubsection) {
      handleNavigate(activeSection, null, null, { skipHistory: true });
      return;
    }

    if (activeSection !== 'home') {
      handleNavigate('home', null, null, { skipHistory: true });
      return;
    }

    scrollToTop();
  };

  const getPageKeywords = () => {
    if (activeSection === 'home') return 'урология, андрология, медицина, мочеполовая система, простатит, цистит, эректильная дисфункция, бесплодие';
    if (activeSection === 'urology') return 'урология, мочекаменная болезнь, инфекции мочевыводящих путей, онкология, нефрология';
    if (activeSection === 'andrology') return 'андрология, мужское здоровье, фертильность, эректильная дисфункция, гипогонадизм';
    if (activeSection === 'pediatric') return 'детская урология, фимоз, гипоспадия, крипторхизм, энурез';
    if (activeSection === 'emergency') return 'урологическая помощь, экстренные состояния, почечная колика';
    return 'урология, андрология, медицина';
  };

  const [isOnline, setIsOnline] = useState(true);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const lastTrackedDiseaseOpenRef = useRef('');

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!selectedDiseaseId) {
      setSelectedDisease(null);
      return () => {
        cancelled = true;
      };
    }

    import('./data')
      .then(({ getDiseaseById }) => {
        if (!cancelled) {
          setSelectedDisease(getDiseaseById(selectedDiseaseId));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSelectedDisease(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDiseaseId]);

  useEffect(() => {
    if (!selectedDisease?.id) {
      lastTrackedDiseaseOpenRef.current = '';
      return;
    }

    const source = navigationSource || 'direct_url';
    const trackingKey = `${selectedDisease.id}:${source}`;
    if (lastTrackedDiseaseOpenRef.current === trackingKey) {
      return;
    }

    trackModal(selectedDisease.id, 'open', source, {
      section: selectedDisease.section,
      subsection: selectedDisease.subsection,
    });
    lastTrackedDiseaseOpenRef.current = trackingKey;
  }, [navigationSource, selectedDisease]);

  const pageTitle = activeSection === 'home'
    ? 'UroMed — Урология и Андрология | Доказательная медицина'
    : activeSection === 'favorites'
      ? 'Избранное | UroMed'
      : activeSection === 'emergency'
        ? 'Экстренные состояния | UroMed'
        : activeSection === 'sitemap'
          ? 'Карта сайта | UroMed'
          : activeSection === 'calculators'
            ? 'Калькуляторы уролога | UroMed'
            : activeSection === 'games'
              ? 'Обучение | UroMed'
              : selectedDisease
                ? `${selectedDisease.name} (${selectedDisease.icd}) | UroMed`
                : `${sectionNames[activeSection] || activeSection} | UroMed`;

  const pageDescription = activeSection === 'home'
    ? 'UroMed — современный медицинский справочник по урологии и андрологии. Доказательные клинические рекомендации EAU, AUA, РКР. Диагностика, лечение, калькуляторы.'
    : selectedDisease
      ? `${selectedDisease.name} — подробная информация о диагностике, лечении и профилактике. Коды МКБ-10: ${selectedDisease.icd}. Рекомендации EAU/AUA.`
      : `${sectionNames[activeSection] || activeSection} — справочник по урологии и андрологии. Доказательная медицина, клинические рекомендации, калькуляторы.`;

  const renderBreadcrumbs = () => {
    if (activeSection === 'home') return null;

    const items = [{ label: 'Главная', action: () => handleNavigate('home') }];

    if (activeSection !== 'home') {
      items.push({
        label: sectionNames[activeSection] || activeSection,
        action: activeSubsection ? () => handleNavigate(activeSection) : null,
      });
    }

    if (activeSubsection) {
      items.push({ label: subsectionLabels[activeSubsection] || activeSubsection, action: null });
    }

    return (
      <div className="breadcrumb-bar">
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {item.action ? (
              <button className="breadcrumb-item" onClick={item.action}>{item.label}</button>
            ) : (
              <span className="breadcrumb-current">{item.label}</span>
            )}
            {i < items.length - 1 && <span className="breadcrumb-sep">›</span>}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <HelmetProvider>
      <SeoHelmet
        pageTitle={pageTitle}
        pageDescription={pageDescription}
        keywords={getPageKeywords()}
        selectedDisease={selectedDisease}
        activeSection={activeSection}
        activeSubsection={activeSubsection}
      />

      <ErrorBoundary>
        <div className={`App ${isMobileShell ? 'has-mobile-shell' : ''}`} role="main" data-v23-workbench="true">
          <a href="#main-content" className="skip-link">Перейти к основному контенту</a>
          {!isOnline && (
            <div className="offline-indicator" role="alert">
              Вы сейчас офлайн. Часть функций может быть недоступна.
            </div>
          )}
          <Navbar
            activeSection={activeSection}
            activeSubsection={activeSubsection}
            setActiveSection={setActiveSection}
            setActiveSubsection={setActiveSubsection}
            onNavigate={handleNavigate}
            favorites={favorites}
            viewHistory={viewHistory}
          />
          {renderBreadcrumbs()}
          {!selectedDiseaseId && (
            <ClinicalOperatingSystem
              activeSection={activeSection}
              activeSubsection={activeSubsection}
              favoritesCount={Object.values(favorites).filter(Boolean).length}
              historyCount={viewHistory.length}
              onNavigate={handleNavigate}
            />
          )}
          <div
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: 0,
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0,0,0,0)',
              border: 0,
            }}
          >
            {pageTitle}
          </div>
          <div
            id="main-content"
            className="page-content"
            key={activeSection + '-' + activeSubsection}
            role="region"
            aria-label={sectionNames[activeSection] || activeSection}
          >
            <SectionRenderer
              activeSection={activeSection}
              activeSubsection={activeSubsection}
              selectedDiseaseId={selectedDiseaseId}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              viewHistory={viewHistory}
              clearHistory={clearHistory}
              onCloseDisease={closeDisease}
              onNavigate={handleNavigate}
            />
          </div>
          <Footer onNavigate={handleNavigate} activeSection={activeSection} />
          {showDebugPanel && (
            <DebugPanel
              showPerformance
              showState
              showTelemetry
              initialState={{
                activeSection,
                activeSubsection,
                selectedDiseaseId,
                navigationSource,
                favoritesCount: Object.values(favorites).filter(Boolean).length,
                viewHistorySize: viewHistory.length,
              }}
              exportContext={{
                appState: {
                  activeSection,
                  activeSubsection,
                  selectedDiseaseId,
                  navigationSource,
                },
                retention: {
                  viewHistory,
                  favoritesCount: Object.values(favorites).filter(Boolean).length,
                },
              }}
              routes={[
                { path: 'home', component: 'LandingPage' },
                { path: 'urology/:subsection?', component: 'SectionRenderer' },
                { path: 'andrology/:subsection?', component: 'SectionRenderer' },
                { path: 'pediatric', component: 'PediatricUrology' },
              ]}
            />
          )}
          {isMobileShell && activeSection !== 'home' && !selectedDiseaseId && (
            <div className="mobile-shell-nav" role="navigation" aria-label="Быстрая навигация">
              <button className="mobile-shell-btn" onClick={handleMobileBack} aria-label="Назад">
                <span className="mobile-shell-icon" aria-hidden="true">‹</span>
                <span className="mobile-shell-label">Назад</span>
              </button>
              <button
                className={`mobile-shell-btn ${activeSection === 'home' ? 'active' : ''}`}
                onClick={() => handleNavigate('home', null, null, { skipHistory: true })}
                aria-label="Главная"
              >
                <span className="mobile-shell-icon" aria-hidden="true">⌂</span>
                <span className="mobile-shell-label">Домой</span>
              </button>
              <button
                className={`mobile-shell-btn ${activeSection === 'favorites' ? 'active' : ''}`}
                onClick={() => handleNavigate('favorites', null, null, { skipHistory: true })}
                aria-label="Избранное"
              >
                <span className="mobile-shell-icon" aria-hidden="true">★</span>
                <span className="mobile-shell-label">Сохранено</span>
              </button>
              <button className="mobile-shell-btn" onClick={scrollToTop} aria-label="Наверх">
                <span className="mobile-shell-icon" aria-hidden="true">↑</span>
                <span className="mobile-shell-label">Вверх</span>
              </button>
            </div>
          )}
          {showScrollTop && (
            <button className="scroll-top-btn" onClick={scrollToTop} aria-label="Наверх">↑</button>
          )}
        </div>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;

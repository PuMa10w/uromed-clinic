import { useState, useEffect, useCallback } from 'react';
import { SUBSECTION_TITLES } from '../config/routes';
import { parseLocation, buildPath } from '../utils';

function buildNavigationPath(section, subsection, diseaseId, options = {}) {
  const path = buildPath(section, subsection, diseaseId);

  if (section === 'calculators' && options.tool) {
    return `${path}?tool=${encodeURIComponent(options.tool)}`;
  }

  return path;
}

export default function useAppNavigationState({ addToHistory, setFavorites }) {
  const initialRoute = parseLocation(window.location.pathname, window.location.hash, SUBSECTION_TITLES);
  const [activeSection, setActiveSection] = useState(() => initialRoute.section);
  const [activeSubsection, setActiveSubsection] = useState(() => initialRoute.subsection);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState(() => initialRoute.diseaseId);
  const [navigationSource, setNavigationSource] = useState(() => (initialRoute.diseaseId ? 'direct_url' : null));
  const [diseaseOrigin, setDiseaseOrigin] = useState(() => (
    initialRoute.diseaseId
      ? { section: initialRoute.section, subsection: initialRoute.subsection || null }
      : null
  ));

  useEffect(() => {
    const nextPath = buildPath(activeSection, activeSubsection, selectedDiseaseId);
    if (window.location.hash) {
      window.history.replaceState(null, '', nextPath);
    }
  }, [activeSection, activeSubsection, selectedDiseaseId]);

  useEffect(() => {
    const syncFromUrl = () => {
      const { section, subsection, diseaseId } = parseLocation(
        window.location.pathname,
        window.location.hash,
        SUBSECTION_TITLES,
      );
      setActiveSection(section);
      setActiveSubsection(subsection);
      setSelectedDiseaseId(diseaseId);
      setNavigationSource(diseaseId ? 'direct_url' : null);
      setDiseaseOrigin(diseaseId ? { section, subsection: subsection || null } : null);
    };

    window.addEventListener('hashchange', syncFromUrl);
    window.addEventListener('popstate', syncFromUrl);
    return () => {
      window.removeEventListener('hashchange', syncFromUrl);
      window.removeEventListener('popstate', syncFromUrl);
    };
  }, []);

  const handleNavigate = useCallback((section, subsection, diseaseId, options = {}) => {
    if (section === 'remove-fav') {
      setFavorites((prev) => ({
        ...prev,
        [subsection]: false,
      }));
      return;
    }

    const nextSubsection = subsection || null;

    if (diseaseId) {
      const nextOrigin = options.origin
        || (selectedDiseaseId ? diseaseOrigin : { section: activeSection, subsection: activeSubsection || null })
        || { section, subsection: nextSubsection };
      setDiseaseOrigin(nextOrigin);
      setNavigationSource(options.source || 'internal_navigation');
    } else if (!options.keepDiseaseOrigin) {
      setDiseaseOrigin(null);
      setNavigationSource(options.source || null);
    }

    const nextPath = buildNavigationPath(section, nextSubsection, diseaseId, options);
    if (options.replaceState) {
      window.history.replaceState(null, '', nextPath);
    } else {
      window.history.pushState(null, '', nextPath);
    }

    setActiveSection(section);
    setActiveSubsection(nextSubsection);
    setSelectedDiseaseId(diseaseId || null);

    if (!options.preserveScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (!options.skipHistory && (diseaseId || subsection)) {
      import('../data')
        .then(({ allDiseases: loadedDiseases, diseaseById }) => {
          const disease =
            diseaseById[diseaseId]
            || loadedDiseases.find((item) => item.section === section && item.subsection === nextSubsection);

          if (disease) {
            addToHistory({
              id: disease.id,
              name: disease.name,
              section: disease.section,
              subsection: disease.subsection,
              source: options.source || navigationSource || 'direct_navigation',
            });
          }
        })
        .catch(() => {});
    }
  }, [activeSection, activeSubsection, addToHistory, diseaseOrigin, navigationSource, selectedDiseaseId, setFavorites]);

  const closeDisease = useCallback((options = {}) => {
    const fallbackSection = options.fallbackSection || 'home';
    const origin = diseaseOrigin?.section
      ? diseaseOrigin
      : { section: fallbackSection, subsection: null };
    const targetPath = buildPath(origin.section, origin.subsection || null, null);

    if (options.replaceState) {
      window.history.replaceState(null, '', targetPath);
    } else {
      window.history.pushState(null, '', targetPath);
    }

    setActiveSection(origin.section);
    setActiveSubsection(origin.subsection || null);
    setSelectedDiseaseId(null);
    setDiseaseOrigin(null);
    setNavigationSource(null);

    if (!options.preserveScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [diseaseOrigin]);

  return {
    activeSection,
    activeSubsection,
    selectedDiseaseId,
    navigationSource,
    setActiveSection,
    setActiveSubsection,
    setSelectedDiseaseId,
    closeDisease,
    handleNavigate,
  };
}

import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

const PreloadIndicator = ({ progress }) => {
  if (progress === null || progress === 0) return null;
  
  return (
    <div className="preload-indicator" role="status" aria-live="polite">
      <div className="preload-bar">
        <div className="preload-fill" style={{ width: `${progress}%` }} />
      </div>
      <span className="preload-text">Загрузка данных...</span>
    </div>
  );
};

PreloadIndicator.propTypes = {
  progress: PropTypes.number,
};

PreloadIndicator.defaultProps = {
  progress: null,
};

const useSectionPreloader = (sections) => {
  const [preloading, setPreloading] = useState(false);
  const [progress, setProgress] = useState(null);
  const loadedRef = useRef(new Set());

  const preloadSections = useCallback(async (sectionIds) => {
    const toLoad = sectionIds.filter(id => !loadedRef.current.has(id));
    if (toLoad.length === 0) return;

    setPreloading(true);
    setProgress(0);

    let loaded = 0;
    for (const sectionId of toLoad) {
      try {
        await sections[sectionId]?.();
        loadedRef.current.add(sectionId);
        loaded++;
        setProgress(Math.round((loaded / toLoad.length) * 100));
      } catch (e) {
        console.warn(`Failed to preload section: ${sectionId}`, e);
      }
    }

    setPreloading(false);
    setProgress(null);
  }, [sections]);

  const preloadOnHover = useCallback((sectionId) => {
    return (e) => {
      if (e.type === 'mouseenter' && !loadedRef.current.has(sectionId)) {
        preloadSections([sectionId]);
      }
    };
  }, [preloadSections]);

  return { preloadSections, preloadOnHover, preloading, progress, loadedSections: loadedRef.current };
};

export { PreloadIndicator, useSectionPreloader };
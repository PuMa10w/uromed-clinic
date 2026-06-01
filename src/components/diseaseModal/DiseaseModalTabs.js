import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export default function DiseaseModalTabs({ tabs, activeTab, onTabChange }) {
  const tabsRef = useRef(null);
  const tabRefs = useRef({});
  const dragState = useRef({ startX: 0, startY: 0, lastX: 0, moved: false });

  useEffect(() => {
    const activeElement = tabRefs.current[activeTab];
    if (activeElement && typeof activeElement.scrollIntoView === 'function') {
      activeElement.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    }
  }, [activeTab]);

  const handleTouchStart = (event) => {
    if (!tabsRef.current) return;
    dragState.current = {
      startX: event.touches[0].clientX,
      startY: event.touches[0].clientY,
      lastX: event.touches[0].clientX,
      moved: false,
    };
  };

  const handleTouchMove = (event) => {
    if (!tabsRef.current) return;
    const deltaX = event.touches[0].clientX - dragState.current.startX;
    const deltaY = event.touches[0].clientY - dragState.current.startY;
    if (Math.abs(deltaX) > 4 && Math.abs(deltaX) > Math.abs(deltaY)) {
      event.preventDefault();
      event.stopPropagation();
      dragState.current.moved = true;
      tabsRef.current.scrollBy({
        left: dragState.current.lastX - event.touches[0].clientX,
        behavior: 'instant',
      });
      dragState.current.lastX = event.touches[0].clientX;
    }
  };

  const handleWheel = (event) => {
    if (!tabsRef.current || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    tabsRef.current.scrollBy({ left: event.deltaY, behavior: 'instant' });
  };

  const handleTouchEnd = () => {
    if (!dragState.current.moved) return;
    window.setTimeout(() => {
      dragState.current.moved = false;
    }, 120);
  };

  const handleTabClick = (event, tabId) => {
    if (dragState.current.moved) {
      event.preventDefault();
      return;
    }
    onTabChange(tabId);
  };

  return (
    <div className="tabs-shell">
      <div
        ref={tabsRef}
        className="tabs"
        role="tablist"
        data-scrollable="x"
        aria-label="Разделы информации о болезни"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(element) => {
              if (element) {
                tabRefs.current[tab.id] = element;
              }
            }}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={(event) => handleTabClick(event, tab.id)}
            role="tab"
            aria-label={tab.label}
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
          >
            <span className="tab-index">{String(index + 1).padStart(2, '0')}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

DiseaseModalTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

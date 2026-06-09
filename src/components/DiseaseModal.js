import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import '../styles/diseaseModalPremium.css';
import '../styles/v21ModalVisualLock.css';
import '../styles/v22WorkbenchLock.css';
import '../styles/v23ClinicalWorkbench.css';
import '../styles/modalStack11.css';
import '../styles/diseaseModal13Lock.css';
import '../styles/diseaseModal14Lock.css';
import { normalizeDisease } from './diseaseModal/normalizeDisease';
import { getDiseaseModalTabs, DEFAULT_TAB } from './diseaseModal/tabs';
import DiseaseModalHeader from './diseaseModal/DiseaseModalHeader';
import DiseaseModalTabs from './diseaseModal/DiseaseModalTabs';
import DiseaseModalContent from './diseaseModal/DiseaseModalContent';
import { preloadDiseaseBatch } from '../data/lazyData';

const DRAG_CLOSE_THRESHOLD = 96;
const IPHONE_SHELL_MAX_WIDTH = 980;

function isTypingTarget(target) {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tagName = target.tagName;
  return target.isContentEditable || tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT';
}

const propTypes = {
  disease: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icd: PropTypes.string,
    section: PropTypes.string,
    subsection: PropTypes.string,
    icon: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    definition: PropTypes.string,
    epidemiology: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    etiology: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    symptoms: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    complications: PropTypes.array,
    differentialDiagnosis: PropTypes.array,
    redFlags: PropTypes.array,
    quickSummary: PropTypes.object,
    classification: PropTypes.object,
    diagnostics: PropTypes.object,
    treatment: PropTypes.object,
    guidelines: PropTypes.object,
    whenToRefer: PropTypes.object,
    followUp: PropTypes.object,
    prognosis: PropTypes.object,
    clinicalCases: PropTypes.array,
    patientQuestions: PropTypes.array,
    drugDoses: PropTypes.array,
    labNorms: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    differentialTable: PropTypes.array,
    lifestyleAdvice: PropTypes.array,
    nutritionAdvice: PropTypes.array,
    patientRecommendations: PropTypes.array,
    relatedIds: PropTypes.array,
    pathogenesis: PropTypes.string,
  }).isRequired,
  allDiseases: PropTypes.arrayOf(PropTypes.object),
  currentIndex: PropTypes.number,
  onNavigate: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  onNavigateToDisease: PropTypes.func,
};

const defaultProps = {
  allDiseases: [],
  currentIndex: 0,
  onNavigate: () => {},
  onNavigateToDisease: () => {},
};

const DiseaseModal = ({ disease, allDiseases = [], currentIndex = 0, onNavigate = () => {}, onClose, onNavigateToDisease }) => {
  console.log('DiseaseModal render:', { id: disease?.id, name: disease?.name, hasDisease: !!disease });
  const normalizedDisease = normalizeDisease(disease);
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);
  const [isMobile, setIsMobile] = useState(false);
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  const touchStartY = useRef(0);
  const touchDeltaY = useRef(0);
  const canDragClose = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    if (!modalRef.current) return undefined;

    const modalElement = modalRef.current;
    const headerElement = modalElement.querySelector('.modal-header');
    if (!headerElement) return undefined;

    const updateHeaderOffset = () => {
      const headerHeight = Math.ceil(headerElement.getBoundingClientRect().height);
      modalElement.style.setProperty('--modal-header-offset', `${headerHeight}px`);
    };

    updateHeaderOffset();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateHeaderOffset, { passive: true });
      return () => window.removeEventListener('resize', updateHeaderOffset);
    }

    const resizeObserver = new ResizeObserver(() => updateHeaderOffset());
    resizeObserver.observe(headerElement);
    window.addEventListener('resize', updateHeaderOffset, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeaderOffset);
    };
  }, [activeTab, disease.id, isMobile]);

  useEffect(() => {
    previousFocusRef.current = document.activeElement;
    document.body.classList.add('modal-open');
    const focusScope = overlayRef.current || modalRef.current;
    if (focusScope) {
      const focusableElements = focusScope.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        setTimeout(() => focusableElements[0].focus(), 100);
      }
    }
    return () => {
      document.body.classList.remove('modal-open');
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, []);

  const tabs = getDiseaseModalTabs(normalizedDisease);

  useEffect(() => {
    if (!tabs.length) return;
    if (!tabs.some((tab) => tab.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [activeTab, tabs]);

  useEffect(() => {
    if (!allDiseases.length) return;

    const adjacentIds = [];
    if (currentIndex > 0) {
      adjacentIds.push(allDiseases[currentIndex - 1]?.id);
    }
    if (currentIndex < allDiseases.length - 1) {
      adjacentIds.push(allDiseases[currentIndex + 1]?.id);
    }

    preloadDiseaseBatch(adjacentIds);
  }, [allDiseases, currentIndex]);

  useEffect(() => {
    setIsMobile(window.innerWidth <= IPHONE_SHELL_MAX_WIDTH);
    const handleResize = () => setIsMobile(window.innerWidth <= IPHONE_SHELL_MAX_WIDTH);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile || !modalRef.current) return undefined;

    const applyMobileStackLock = () => {
      const modalElement = modalRef.current;
      if (!modalElement) return;

      const tabsShell = document.querySelector('.modal-tabs-fixed-layer .tabs-shell')
        || modalElement.querySelector('.tabs-shell');
      const tabsRail = tabsShell?.querySelector('.tabs');
      const quickbar = document.querySelector('.modal-mobile-quickbar.is-fixed');
      const isLandscape = window.matchMedia('(orientation: landscape)').matches;
      const modalTopOffset = isLandscape
        ? 'calc(env(safe-area-inset-top, 0px) + var(--disease-tabs-safe-height, 3.45rem))'
        : 'calc(env(safe-area-inset-top, 0px) + var(--disease-tabs-safe-height, 4.65rem))';
      const modalBottomOffset = isLandscape
        ? 'calc(3.7rem + env(safe-area-inset-bottom, 0px))'
        : 'calc(var(--cp13-bottom-action-height, 84px) + 12px)';
      const modalMaxHeight = isLandscape
        ? 'calc(100dvh - var(--disease-tabs-safe-height, 3.45rem) - 3.7rem - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))'
        : 'calc(100dvh - var(--disease-tabs-safe-height, 4.65rem) - var(--cp13-bottom-action-height, 84px) - env(safe-area-inset-top, 0px) - 12px)';

      modalElement.style.setProperty('position', 'fixed', 'important');
      modalElement.style.removeProperty('inset');
      modalElement.style.setProperty('top', modalTopOffset, 'important');
      modalElement.style.setProperty('right', '0', 'important');
      modalElement.style.setProperty('bottom', modalBottomOffset, 'important');
      modalElement.style.setProperty('left', '0', 'important');
      modalElement.style.setProperty('width', '100vw', 'important');
      modalElement.style.setProperty('max-width', '100vw', 'important');
      modalElement.style.setProperty('height', 'auto', 'important');
      modalElement.style.setProperty('min-height', '0', 'important');
      modalElement.style.setProperty('max-height', modalMaxHeight, 'important');
      modalElement.style.setProperty('overflow-x', 'clip', 'important');
      modalElement.style.setProperty('overflow-y', 'auto', 'important');
      modalElement.style.setProperty('contain', 'none', 'important');
      modalElement.style.setProperty('transform', 'none', 'important');
      modalElement.style.setProperty(
        'scroll-padding-bottom',
        'calc(var(--cp13-bottom-action-height, 84px) + 2rem)',
        'important'
      );

      if (tabsShell) {
        tabsShell.style.setProperty('position', 'fixed', 'important');
        tabsShell.style.setProperty('top', 'env(safe-area-inset-top, 0px)', 'important');
        tabsShell.style.setProperty('left', '0px', 'important');
        tabsShell.style.setProperty('right', '0px', 'important');
        tabsShell.style.setProperty('width', '100vw', 'important');
        tabsShell.style.setProperty('max-width', '100vw', 'important');
        tabsShell.style.setProperty('margin', '0', 'important');
        tabsShell.style.setProperty('margin-inline', '0', 'important');
        tabsShell.style.setProperty('transform', 'none', 'important');
        tabsShell.style.setProperty('z-index', '2147483600', 'important');
      }

      if (tabsRail) {
        tabsRail.style.setProperty('width', '100%', 'important');
        tabsRail.style.setProperty('max-width', '100%', 'important');
        tabsRail.style.setProperty('min-width', '0', 'important');
        tabsRail.style.setProperty('overflow-x', 'auto', 'important');
        tabsRail.style.setProperty('overflow-y', 'hidden', 'important');
      }

      if (quickbar) {
        quickbar.style.setProperty('position', 'fixed', 'important');
        quickbar.style.setProperty('top', 'auto', 'important');
        quickbar.style.setProperty('bottom', 'max(0.62rem, calc(env(safe-area-inset-bottom, 0px) + 0.62rem))', 'important');
        quickbar.style.setProperty('z-index', '2147483700', 'important');
        quickbar.style.setProperty('transform', 'translate3d(0, 0, 0)', 'important');
      }
    };

    applyMobileStackLock();
    const frame = window.requestAnimationFrame(applyMobileStackLock);
    window.addEventListener('resize', applyMobileStackLock, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', applyMobileStackLock);
    };
  }, [activeTab, disease.id, isMobile]);

  useEffect(() => {
    if (modalRef.current) {
      if (typeof modalRef.current.scrollTo === 'function') {
        modalRef.current.scrollTo({ top: 0, behavior: 'auto' });
      } else {
        modalRef.current.scrollTop = 0;
      }
      setReadingProgress(0);
    }

    const handleScroll = () => {
      if (!modalRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = modalRef.current;
      const progress = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100) || 0;
      setReadingProgress(Math.min(progress, 100));
    };
    const ref = modalRef.current;
    if (ref) ref.addEventListener('scroll', handleScroll, { passive: true });
    return () => { if (ref) ref.removeEventListener('scroll', handleScroll); };
  }, [activeTab, isMobile]);

  const handleScrollToTop = () => {
    if (!modalRef.current) return;
    if (typeof modalRef.current.scrollTo === 'function') {
      modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    modalRef.current.scrollTop = 0;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isTypingTarget(e.target)) {
        return;
      }

      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onNavigate(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNavigate(1);
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusScope = overlayRef.current || modalRef.current;
        const focusableElements = focusScope.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements.length) return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNavigate]);

  const handleTouchStart = (e) => {
    const startTarget = e.target;
    const startedFromHeader = startTarget instanceof HTMLElement && Boolean(startTarget.closest('.modal-header'));
    touchStartY.current = e.touches[0].clientY;
    canDragClose.current = Boolean(isMobile && startedFromHeader && modalRef.current?.scrollTop === 0);
  };

  const handleTouchMove = (e) => {
    if (!canDragClose.current) return;

    const currentY = e.touches[0].clientY;
    touchDeltaY.current = currentY - touchStartY.current;
    if (touchDeltaY.current > 0 && modalRef.current) {
      const scrollTop = modalRef.current.scrollTop;
      if (scrollTop === 0) setDragOffset(touchDeltaY.current * 0.5);
    }
  };

  const handleTouchEnd = () => {
    if (dragOffset > DRAG_CLOSE_THRESHOLD) onClose();
    setDragOffset(0);
    touchStartY.current = 0;
    touchDeltaY.current = 0;
    canDragClose.current = false;
  };

  const modalNode = (
      <div
        ref={overlayRef}
        className="modal-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 'var(--z-modal, 2147482000)',
          width: '100vw',
          height: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(20px)',
        }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          ref={modalRef}
          className="modal-content"
          style={{
            position: 'relative',
            zIndex: 'var(--z-modal-content, 2147482100)',
            maxWidth: 'min(56rem, calc(100vw - 2rem))',
            maxHeight: 'calc(100dvh - 4rem)',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            backgroundColor: 'var(--surface-overlay)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-premium)',
            margin: '2rem',
            transform: isMobile && dragOffset > 0 ? `translateY(${dragOffset}px)` : undefined,
          }}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--gradient-teal)', width: `${readingProgress}%` }} />
                  <DiseaseModalHeader
          disease={normalizedDisease}
          isMobile={isMobile}
          allDiseases={allDiseases}
          currentIndex={currentIndex}
          onNavigate={onNavigate}
          onClose={onClose}
        />

        <div className="modal-body">
          {!isMobile && <DiseaseModalTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />}
          <div
            key={activeTab}
            className="modal-tabpanel"
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            id={`tabpanel-${activeTab}`}
          >
            <DiseaseModalContent
              activeTab={activeTab}
              disease={disease}
              normalizedDisease={normalizedDisease}
              onClose={onClose}
              onTabChange={setActiveTab}
              onNavigateToDisease={onNavigateToDisease}
            />
          </div>
        </div>

      </div>

      {isMobile && (
        <div className="modal-tabs-fixed-layer" onClick={(e) => e.stopPropagation()}>
          <DiseaseModalTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      )}

      {isMobile && (
        <div className="modal-mobile-quickbar is-fixed" onClick={(e) => e.stopPropagation()}>
          <button className="modal-mobile-quickbtn" onClick={handleScrollToTop} aria-label="Наверх">
            Наверх
          </button>
          <button className="modal-mobile-quickbtn primary" onClick={onClose} aria-label="Закрыть карточку">
            Закрыть
          </button>
        </div>
      )}
    </div>
  );

  return typeof document === 'undefined' ? modalNode : createPortal(modalNode, document.body);
};

export default DiseaseModal;
DiseaseModal.propTypes = propTypes;
DiseaseModal.defaultProps = defaultProps;

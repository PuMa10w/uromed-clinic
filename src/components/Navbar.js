import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDarkMode, useSearchHistory } from '../hooks/useLocalStorage';
import { trackSearch, trackSearchSelect, trackSymptomRoute } from '../utils/analytics';

const propTypes = {
  activeSection: PropTypes.string.isRequired,
  activeSubsection: PropTypes.string,
  setActiveSection: PropTypes.func.isRequired,
  setActiveSubsection: PropTypes.func,
  onNavigate: PropTypes.func,
  favorites: PropTypes.objectOf(PropTypes.bool),
  viewHistory: PropTypes.arrayOf(PropTypes.object),
};

const defaultProps = {
  activeSubsection: null,
  setActiveSubsection: () => {},
  onNavigate: () => {},
  favorites: {},
  viewHistory: [],
};

const uiGlyphs = {
  search: '⌕',
  moon: '◐',
  sun: '☼',
  menu: '☰',
  close: '×',
  star: '★',
  chevronDown: '▾',
  clock: '◷',
  arrowUp: '↑',
  arrowDown: '↓',
};

function IconGlyph({ glyph, className = '', ...restProps }) {
  return (
    <span className={className} aria-hidden="true" {...restProps}>
      {glyph}
    </span>
  );
}

const FaClock = (props) => <IconGlyph glyph={uiGlyphs.clock} {...props} />;
const FaArrowUp = (props) => <IconGlyph glyph={uiGlyphs.arrowUp} {...props} />;
const FaArrowDown = (props) => <IconGlyph glyph={uiGlyphs.arrowDown} {...props} />;

const navGroups = [
  {
    label: 'Ещё разделы',
    items: [
      { id: 'pediatric', label: 'Детская', icon: '👶' },
      { id: 'emergency', label: 'Экстренные', icon: '🚨' },
    ],
  },
  {
    label: 'Инструменты',
    items: [
      { id: 'favorites', label: 'Избранное', icon: '★' },
      { id: 'surgery', label: 'Хирургия', icon: '🔪' },
      { id: 'metaphylaxis', label: 'Диеты при МКБ', icon: '🥗' },
      { id: 'calculators', label: 'Калькуляторы', icon: '🧮' },
      { id: 'tools', label: 'Опросники', icon: '📊' },
      { id: 'drugs', label: 'Препараты', icon: '💊' },
      { id: 'atlas', label: '3D Атлас', icon: '◈' },
      { id: 'sitemap', label: 'Карта сайта', icon: '🗺️' },
    ],
  },
];

const sectionMeta = {
  urology: 'Урология',
  andrology: 'Андрология',
  pediatric: 'Детская урология',
  emergency: 'Экстренные состояния',
  favorites: 'Избранное',
  home: 'Главная',
  tools: 'Клинические инструменты',
  games: 'Игровой раздел',
  drugs: 'Справочник препаратов',
  atlas: '3D Атлас нозологий',
  glossary: 'Глоссарий',
  calculators: 'Калькуляторы',
  surgery: 'Хирургия',
  metaphylaxis: 'Метафилактика',
  sitemap: 'Навигация',
};

const andrologySymptomSearchEntries = [
  {
    id: 'symptom-renal-colic',
    name: 'Острая боль в боку',
    meta: 'Почечная колика / камень',
    section: 'urology',
    subsection: 'stones',
    targetId: 'renal-colic',
    icon: '◇',
  },
  {
    id: 'symptom-dysuria',
    name: 'Жжение при мочеиспускании',
    meta: 'Цистит / инфекция мочевых путей',
    section: 'urology',
    subsection: 'infections',
    targetId: 'cystitis',
    icon: '◍',
  },
  {
    id: 'symptom-hematuria',
    name: 'Кровь в моче',
    meta: 'Гематурия: маршрут диагностики',
    section: 'urology',
    subsection: 'reconstructive',
    targetId: 'hematuria',
    icon: '◈',
  },
  {
    id: 'symptom-urinary-retention',
    name: 'Не могу помочиться',
    meta: 'Острая задержка мочи',
    section: 'urology',
    subsection: 'functional',
    targetId: 'urinary-retention',
    icon: '◓',
  },
  {
    id: 'symptom-low-libido',
    name: 'Снижение либидо',
    meta: 'Гормональный путь',
    section: 'andrology',
    subsection: 'endocrine',
    targetId: 'hypogonadism',
    icon: '◔',
  },
  {
    id: 'symptom-bad-spermogram',
    name: 'Плохая спермограмма',
    meta: 'Фертильность',
    section: 'andrology',
    subsection: 'fertility',
    targetId: 'male-infertility',
    icon: '◌',
  },
  {
    id: 'symptom-morning-erections',
    name: 'Ухудшились утренние эрекции',
    meta: 'Сексуальная функция',
    section: 'andrology',
    subsection: 'sexual',
    targetId: 'erectile-dysfunction',
    icon: '◑',
  },
  {
    id: 'symptom-scrotal-heaviness',
    name: 'Тяжесть или вены в мошонке',
    meta: 'Потенциально устранимая причина',
    section: 'andrology',
    subsection: 'fertility',
    targetId: 'varicocele',
    icon: '◒',
  },
];

const commandSearchEntryDefaults = {
  workflowIntent: 'open_clinical_workspace',
  nextStep: 'Открыть профильный клинический экран',
  riskLevel: 'routine',
  linkedTools: [],
  linkedDrugs: [],
  linkedModels: [],
};

const commandSearchEntriesBase = [
  {
    id: 'urology',
    category: 'diagnosis',
    label: 'Урология',
    meta: 'Нозологии, диагностика, лечение, маршруты',
    section: 'urology',
    icon: '01',
    keywords: ['камни', 'цистит', 'простата', 'почки', 'мочевой', 'мкб', 'гематурия'],
  },
  {
    id: 'andrology',
    category: 'diagnosis',
    label: 'Андрология',
    meta: 'Эрекция, фертильность, гормоны, мужское здоровье',
    section: 'andrology',
    icon: '02',
    keywords: ['эрекция', 'эякуляция', 'спермограмма', 'тестостерон', 'бесплодие'],
  },
  {
    id: 'drugs',
    category: 'drug',
    label: 'Препараты',
    meta: 'Фармакодинамика, риски, мониторинг, противопоказания',
    section: 'drugs',
    icon: '03',
    keywords: ['лекарства', 'антибиотики', 'доза', 'qt', 'фармакология', 'риски'],
  },
  {
    id: 'calculators',
    category: 'calculator',
    label: 'Калькуляторы',
    meta: 'IPSS, IIEF, PSA, PEDT и клинические шкалы',
    section: 'calculators',
    icon: '04',
    keywords: ['шкалы', 'опросники', 'ipss', 'iief', 'psa', 'pedt', 'калькулятор'],
  },
  {
    id: 'spermogram',
    category: 'calculator',
    label: 'Спермограмма',
    meta: 'Fertility decision tree: OAT, азооспермия, DFI, MAR и ART-маршрут',
    section: 'calculators',
    tool: 'sperm-tree',
    icon: '04A',
    keywords: ['спермограмма', 'spermogram', 'эякулят', 'фертильность', 'бесплодие', 'azoospermia', 'oat', 'dfi', 'mar'],
  },
  {
    id: 'tools',
    category: 'calculator',
    label: 'Опросники',
    meta: 'Быстрая первичная оценка симптомов',
    section: 'tools',
    icon: '05',
    keywords: ['анкеты', 'тесты', 'симптомы', 'скрининг'],
  },
  {
    id: 'surgery',
    category: 'algorithm',
    label: 'Хирургия',
    meta: 'Операции, подготовка, наблюдение, послеоперационный маршрут',
    section: 'surgery',
    icon: '06',
    keywords: ['операции', 'тур', 'лапароскопия', 'робот', 'послеоперационный'],
  },
  {
    id: 'emergency',
    category: 'redFlag',
    label: 'Неотложные',
    meta: 'Красные флаги и срочные урологические сценарии',
    section: 'emergency',
    icon: '07',
    keywords: ['срочно', 'колика', 'сепсис', 'задержка мочи', 'боль'],
  },
  {
    id: 'sitemap',
    category: 'algorithm',
    label: 'Карта сайта',
    meta: 'Все разделы UroMed в одном клиническом меню',
    section: 'sitemap',
    icon: '08',
    keywords: ['меню', 'разделы', 'навигация', 'структура'],
  },
  {
    id: 'drug-qt-risk',
    category: 'drug',
    label: 'QT / лекарственные риски',
    meta: 'Фильтр препаратов по QT, взаимодействиям и мониторингу безопасности',
    section: 'drugs',
    icon: 'Rx',
    keywords: ['qt', 'qtc', 'удлинение qt', 'аритмия', 'макролиды', 'фторхинолоны', 'риск'],
  },
  {
    id: 'drug-fertility-risk',
    category: 'drug',
    label: 'Фертильность и препараты',
    meta: 'Поиск влияния лекарств на сперматогенез, либидо и гормональный контекст',
    section: 'drugs',
    icon: 'F',
    keywords: ['фертильность', 'сперматогенез', 'тестостерон', 'андрогены', 'либидо', 'беременность партнерши'],
  },
  {
    id: 'algorithm-stones',
    category: 'algorithm',
    label: 'Камни: маршрут решения',
    meta: 'Быстрый переход к мочекаменной болезни и клиническому маршруту',
    section: 'urology',
    icon: 'A1',
    keywords: ['камни', 'мкб', 'мочекаменная', 'колика', 'метафилактика'],
  },
  {
    id: 'clinical-3d-atlas',
    category: 'model3d',
    label: '3D Атлас нозологий',
    meta: 'Почка, мочеточник, простата, яичко, тазовое дно и clinical hotspots',
    section: 'atlas',
    icon: '3D',
    keywords: ['3d', '3д', 'атлас', 'модель', 'почка', 'простата', 'мочеточник', 'варикоцеле', 'тазовое дно'],
  },
  {
    id: 'ai-clinical-assistant',
    category: 'assistant',
    label: 'AI clinical navigator',
    meta: 'Безопасный поиск по нозологиям, препаратам, калькуляторам, красным флагам и источникам',
    section: 'atlas',
    icon: 'AI',
    keywords: ['ai', 'аи', 'ассистент', 'помощник', 'поиск', 'источники', 'алгоритм', 'красные флаги'],
  },
  {
    id: 'algorithm-ed-risk',
    category: 'algorithm',
    label: 'ЭД и кардиориск',
    meta: 'Переход к сексуальной медицине, IIEF и сосудистому контексту',
    section: 'andrology',
    icon: 'A2',
    keywords: ['эд', 'эрекция', 'кардиориск', 'iief', 'pde5', 'сексуальная функция'],
  },
];

const commandSearchEntries = commandSearchEntriesBase.map((entry) => ({
  ...commandSearchEntryDefaults,
  ...entry,
  workflowIntent: entry.workflowIntent || commandSearchEntryDefaults.workflowIntent,
  nextStep: entry.nextStep || commandSearchEntryDefaults.nextStep,
  riskLevel: entry.riskLevel || (entry.category === 'redFlag' ? 'urgent' : commandSearchEntryDefaults.riskLevel),
  linkedTools: entry.linkedTools || (entry.tool ? [entry.tool] : []),
  linkedDrugs: entry.linkedDrugs || [],
  linkedModels: entry.linkedModels || (entry.category === 'model3d' ? [entry.id] : []),
}));

const commandGroupMeta = {
  diagnosis: { label: 'Нозологии', caption: 'clinical library' },
  drug: { label: 'Препараты', caption: 'drug intelligence' },
  calculator: { label: 'Калькуляторы', caption: 'scores and trees' },
  algorithm: { label: 'Алгоритмы', caption: 'clinical routes' },
  redFlag: { label: 'Красные флаги', caption: 'urgent triage' },
  model3d: { label: '3D модели', caption: 'clinical anatomy' },
  assistant: { label: 'AI ассистент', caption: 'retrieval navigator' },
};

function getRetainedSearchClusters(viewHistory = []) {
  const clusterMap = viewHistory.reduce((acc, item) => {
    if (!item.section || !item.subsection) return acc;

    const key = `${item.section}:${item.subsection}`;
    if (!acc[key]) {
      acc[key] = {
        key,
        section: item.section,
        subsection: item.subsection,
        label: `${item.section} / ${item.subsection}`,
        totalOpens: 0,
      };
    }

    acc[key].totalOpens += item.openCount || 1;
    return acc;
  }, {});

  return Object.values(clusterMap)
    .sort((left, right) => right.totalOpens - left.totalOpens)
    .slice(0, 2);
}

const Navbar = ({ activeSection, setActiveSection, setActiveSubsection, onNavigate, favorites = {}, viewHistory = [] }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [darkMode, toggleDarkMode] = useDarkMode();
  const safeUseSearchHistory = useSearchHistory || (() => [[], () => {}, () => {}]);
  const [searchHistory, addSearchQuery, clearSearchHistory] = safeUseSearchHistory();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchResults, setSearchResults] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const activeSectionLabel = sectionMeta[activeSection] || 'Навигация';
  const isPrimarySection = activeSection === 'urology' || activeSection === 'andrology';

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery('');
    setSelectedIndex(-1);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setSearchOpen((prev) => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    closeSearch();
    setActiveDropdown(null);
    setMobileMenuOpen((prev) => !prev);
  }, [closeSearch]);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    document.body.classList.toggle('nav-overlay-open', searchOpen || mobileMenuOpen);
    return () => document.body.classList.remove('nav-overlay-open');
  }, [searchOpen, mobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        closeSearch();
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeSearch]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    let cancelled = false;

    if (debouncedQuery.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setSearchLoading(true);
    import('../data')
      .then(({ searchDiseases }) => {
        if (!cancelled) {
          const results = searchDiseases(debouncedQuery) || [];
          setSearchResults(results.slice(0, 15));
          trackSearch(debouncedQuery, results.length);
          setSearchLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSearchResults([]);
          setSearchLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const displayItems = useMemo(() => {
    if (debouncedQuery.length >= 2) {
      return searchResults;
    }

    return searchHistory.slice(0, 5).map((query) => ({
      id: `history-${query}`,
      name: query,
      isHistory: true,
    }));
  }, [debouncedQuery, searchResults, searchHistory]);

  const symptomSearchItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return andrologySymptomSearchEntries.slice(0, 6);
    }

    return andrologySymptomSearchEntries
      .filter((item) => `${item.name} ${item.meta}`.toLowerCase().includes(normalizedQuery))
      .slice(0, 6);
  }, [searchQuery]);

  const commandSearchItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return commandSearchEntries.slice(0, 6);
    }

    return commandSearchEntries
      .filter((item) => `${item.label} ${item.meta} ${item.keywords.join(' ')}`.toLowerCase().includes(normalizedQuery))
      .slice(0, 6);
  }, [searchQuery]);

  const groupedCommandSearchItems = useMemo(() => (
    commandSearchItems.reduce((groups, item) => {
      const key = item.category || 'algorithm';
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
      return groups;
    }, {})
  ), [commandSearchItems]);

  const retainedSearchItems = useMemo(() => (
    [...viewHistory]
      .filter((item) => item.id && item.section && item.subsection)
      .sort((left, right) => (right.openCount || 0) - (left.openCount || 0))
      .slice(0, 3)
  ), [viewHistory]);

  const retainedSearchClusters = useMemo(() => (
    getRetainedSearchClusters(viewHistory)
  ), [viewHistory]);

  const normalizedSearchQuery = searchQuery.trim();
  const hasTypedSearch = normalizedSearchQuery.length >= 2;
  const isAwaitingDebounce = hasTypedSearch && normalizedSearchQuery !== debouncedQuery;
  const isSearchPending = searchLoading || isAwaitingDebounce;
  const hasAnySearchSurface = displayItems.length > 0
    || symptomSearchItems.length > 0
    || commandSearchItems.length > 0
    || (searchQuery.length < 2 && (retainedSearchItems.length > 0 || retainedSearchClusters.length > 0));

  const handleSearchSelect = useCallback((disease) => {
    if (disease.isHistory) {
      setSearchQuery(disease.name);
      return;
    }

    addSearchQuery(disease.name);
    trackSearchSelect(searchQuery.trim() || disease.name, disease.id);
    if (onNavigate) {
      onNavigate(disease.section, disease.subsection, disease.id, { source: 'search' });
    } else {
      setActiveSection(disease.section);
      setActiveSubsection(disease.subsection);
    }
    closeSearch();
  }, [addSearchQuery, closeSearch, onNavigate, searchQuery, setActiveSection, setActiveSubsection]);

  const handleSymptomSearchSelect = useCallback((item) => {
    addSearchQuery(item.name);
    trackSymptomRoute(item.name, item.targetId, 'search_overlay');
    if (onNavigate) {
      onNavigate(item.section, item.subsection, item.targetId, { source: 'search_overlay_symptom' });
    } else {
      setActiveSection(item.section);
      setActiveSubsection(item.subsection);
    }
    closeSearch();
  }, [addSearchQuery, closeSearch, onNavigate, setActiveSection, setActiveSubsection]);

  const handleCommandSearchSelect = useCallback((item) => {
    addSearchQuery(item.label);
    if (onNavigate) {
      onNavigate(item.section, null, null, { source: 'search_command', tool: item.tool });
    } else {
      setActiveSection(item.section);
      setActiveSubsection(null);
    }
    closeSearch();
    closeMobileMenu();
    setActiveDropdown(null);
  }, [addSearchQuery, closeMobileMenu, closeSearch, onNavigate, setActiveSection, setActiveSubsection]);

  const handleKeyDown = useCallback((event) => {
    const isCommandSearchShortcut = (event.ctrlKey || event.metaKey)
      && !event.altKey
      && (event.key?.toLowerCase() === 'k' || event.code === 'KeyK');

    if (isCommandSearchShortcut) {
      event.preventDefault();
      event.stopPropagation();
      setMobileMenuOpen(false);
      setActiveDropdown(null);
      setSearchOpen(true);
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }

    if (!searchOpen) {
      return;
    }

    if (event.key === 'Escape') {
      closeSearch();
      setActiveDropdown(null);
      setMobileMenuOpen(false);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, displayItems.length - 1));
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    }

    if (event.key === 'Enter' && selectedIndex >= 0 && displayItems[selectedIndex]) {
      event.preventDefault();
      const item = displayItems[selectedIndex];
      if (item.isHistory) {
        setSearchQuery(item.name);
        setSelectedIndex(-1);
      } else {
        handleSearchSelect(item);
      }
    }
  }, [closeSearch, displayItems, handleSearchSelect, searchOpen, selectedIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [handleKeyDown]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [debouncedQuery]);

  const handleNavClick = (sectionId) => {
    if (sectionId === 'favorites') {
      handleFavoritesClick();
      return;
    }

    closeSearch();
    if (onNavigate) {
      onNavigate(sectionId, null, null, { skipHistory: true });
    } else {
      setActiveSection(sectionId);
      setActiveSubsection(null);
    }
    closeMobileMenu();
    setActiveDropdown(null);
  };

  const handleFavoritesClick = () => {
    closeSearch();
    closeMobileMenu();
    if (onNavigate) {
      onNavigate('favorites', null, null, { skipHistory: true });
    } else {
      setActiveSection('favorites');
      setActiveSubsection(null);
    }
  };

  const favCount = Object.values(favorites).filter(Boolean).length;

  return (
    <>
      <nav className={`navbar ${mobileMenuOpen ? 'mobile-open' : ''}`} role="navigation" aria-label="Главная навигация">
        <div className="navbar-left">
          <button
            className="hamburger-btn"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={mobileMenuOpen}
          >
            <IconGlyph glyph={mobileMenuOpen ? uiGlyphs.close : uiGlyphs.menu} />
          </button>
          <button className="navbar-brand" onClick={() => handleNavClick('home')}>
            <span className="navbar-brand-lockup">
              <span className="navbar-brand-uro">Uro</span><span className="navbar-brand-accent">Med</span>
            </span>
          </button>
        </div>

        <div className="navbar-primary-switch" role="tablist" aria-label="Основные разделы">
          <button
            className={`navbar-section-btn ${activeSection === 'urology' ? 'active' : ''}`}
            onClick={() => handleNavClick('urology')}
            role="tab"
            aria-selected={activeSection === 'urology'}
          >
            Урология
          </button>
          <button
            className={`navbar-section-btn ${activeSection === 'andrology' ? 'active' : ''}`}
            onClick={() => handleNavClick('andrology')}
            role="tab"
            aria-selected={activeSection === 'andrology'}
          >
            Андрология
          </button>
        </div>

        {activeSection !== 'home' && !isPrimarySection && (
          <div className="navbar-active-pill" aria-hidden="true">{activeSectionLabel}</div>
        )}

        <div className="navbar-center" role="menubar" ref={dropdownRef}>
          {navGroups.map((group, groupIndex) => (
            <div key={group.label} className="nav-group">
              <button
                className={`nav-group-btn ${activeDropdown === groupIndex ? 'active' : ''}`}
                onClick={() => setActiveDropdown(activeDropdown === groupIndex ? null : groupIndex)}
                aria-expanded={activeDropdown === groupIndex}
              >
                {group.label} <IconGlyph glyph={uiGlyphs.chevronDown} className="nav-chevron" />
              </button>
              {activeDropdown === groupIndex && (
                <div className="nav-dropdown">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      className={`nav-dropdown-item ${activeSection === item.id ? 'active' : ''}`}
                      onClick={() => handleNavClick(item.id)}
                      role="menuitem"
                      aria-current={activeSection === item.id ? 'page' : undefined}
                    >
                      <span className="nav-dropdown-icon">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="navbar-right">
          <div className="search-container" ref={searchRef} role="search" aria-label="Поиск болезней">
            <button
              className="search-toggle"
              onClick={toggleSearch}
              aria-label={searchOpen ? 'Закрыть поиск' : 'Открыть поиск'}
              aria-expanded={searchOpen}
            >
              <IconGlyph glyph={uiGlyphs.search} />
            </button>
            {searchOpen && (
              <div className="search-dropdown" role="dialog" aria-label="Поиск по заболеваниям">
                <div className="search-header-row">
                  <span className="search-title">Клинический поиск</span>
                  <button className="search-close-btn" onClick={closeSearch} aria-label="Закрыть поиск">
                    <IconGlyph glyph={uiGlyphs.close} />
                  </button>
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Диагноз, МКБ, симптом или аббревиатура"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="search-input"
                  aria-label="Поиск по названию, МКБ, симптому, аббревиатуре или идентификатору"
                />
                {isSearchPending && (
                  <div className="search-loading" role="status">
                    <span className="search-loading-dot" aria-hidden="true" />
                    Ищем по диагнозам, МКБ и клиническим словам...
                  </div>
                )}
                {commandSearchItems.length > 0 && (
                  <div className="search-results search-command-results" aria-label="Быстрые переходы">
                    <div className="search-section-label">
                      <span>Быстрые переходы</span>
                      <span className="search-section-caption">command center</span>
                    </div>
                    <div className="search-command-groups">
                      {Object.entries(groupedCommandSearchItems).map(([groupKey, items]) => {
                        const group = commandGroupMeta[groupKey] || commandGroupMeta.algorithm;
                        return (
                          <div key={groupKey} className="search-command-group" data-command-group={groupKey}>
                            <div className="search-command-group-head">
                              <span>{group.label}</span>
                              <small>{group.caption}</small>
                            </div>
                            <div className="search-command-grid">
                              {items.map((item) => (
                                <button
                                  key={`command-${item.id}`}
                                  type="button"
                                  className="search-command-card"
                                  onClick={() => handleCommandSearchSelect(item)}
                                  data-command-id={item.id}
                                  data-command-type={groupKey}
                                  data-workflow-intent={item.workflowIntent}
                                  data-risk-level={item.riskLevel}
                                  aria-describedby={`command-next-step-${item.id}`}
                                >
                                  <span className="search-command-index">{item.icon}</span>
                                  <span className="search-command-copy">
                                    <span className="search-result-name">{item.label}</span>
                                    <span className="search-result-meta">{item.meta}</span>
                                    <span id={`command-next-step-${item.id}`} className="search-result-next-step">
                                      {item.nextStep}
                                    </span>
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {displayItems.length > 0 && (
                  <div className="search-results" role="listbox" aria-label="Результаты поиска">
                    {debouncedQuery.length >= 2 && (
                      <div className="search-section-label">
                        <span>{`Диагнозы: ${searchResults.length}`}</span>
                        <span className="search-section-caption">поиск по смыслу</span>
                      </div>
                    )}
                    {debouncedQuery.length < 2 && searchHistory.length > 0 && (
                      <div className="search-section-label">
                        <FaClock /> Недавние
                        <button className="search-clear-btn" onClick={clearSearchHistory}>Очистить</button>
                      </div>
                    )}
                    {displayItems.map((disease, index) => (
                      <button
                        key={disease.id}
                        className={`search-result-item ${index === selectedIndex ? 'selected' : ''} ${disease.isHistory ? 'is-history' : ''}`}
                        onClick={() => handleSearchSelect(disease)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        role="option"
                        aria-selected={index === selectedIndex}
                      >
                        {disease.isHistory ? (
                          <FaClock className="search-result-icon" />
                        ) : (
                          <span className="search-result-icon">{disease.icon}</span>
                        )}
                        <div className="search-result-text">
                          <span className="search-result-name">{disease.name}</span>
                          {!disease.isHistory && (
                            <span className="search-result-meta">{sectionMeta[disease.section] || disease.section} · {disease.icd}</span>
                          )}
                          {disease.isHistory && <span className="search-result-meta">История поиска</span>}
                        </div>
                        {index === selectedIndex && (
                          <span className="search-result-hint">
                            {disease.isHistory ? 'Enter для поиска' : 'Enter для перехода'}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
                {symptomSearchItems.length > 0 && (
                  <div className="search-results" role="listbox" aria-label="Поиск по симптомам">
                    <div className="search-section-label">По симптомам</div>
                    {symptomSearchItems.map((item) => (
                      <button
                        key={item.id}
                        className="search-result-item"
                        onClick={() => handleSymptomSearchSelect(item)}
                        role="option"
                        aria-selected="false"
                      >
                        <span className="search-result-icon">{item.icon}</span>
                        <div className="search-result-text">
                          <span className="search-result-name">{item.name}</span>
                          <span className="search-result-meta">{item.meta}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {searchQuery.length < 2 && retainedSearchItems.length > 0 && (
                  <div className="search-results" role="listbox" aria-label="Из истории">
                    <div className="search-section-label">История</div>
                    {retainedSearchItems.map((item) => (
                      <button
                        key={`retained-${item.id}`}
                        className="search-result-item"
                        onClick={() => onNavigate(item.section, item.subsection, item.id, { source: 'search_retention' })}
                        role="option"
                        aria-selected="false"
                      >
                        <span className="search-result-icon">{item.icon || '↺'}</span>
                        <div className="search-result-text">
                          <span className="search-result-name">{item.name}</span>
                          <span className="search-result-meta">{`${item.openCount || 1} откр.`}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {searchQuery.length < 2 && retainedSearchClusters.length > 0 && (
                  <div className="search-results" role="listbox" aria-label="Группы по истории">
                    <div className="search-section-label">Группы по истории</div>
                    {retainedSearchClusters.map((cluster) => (
                      <button
                        key={`cluster-${cluster.key}`}
                        className="search-result-item"
                        onClick={() => onNavigate(cluster.section, cluster.subsection, null, { source: 'search_retention_cluster' })}
                        role="option"
                        aria-selected="false"
                      >
                        <span className="search-result-icon">◎</span>
                        <div className="search-result-text">
                          <span className="search-result-name">{cluster.label}</span>
                          <span className="search-result-meta">{`${cluster.totalOpens} откр. из истории`}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {hasTypedSearch && !isSearchPending && !hasAnySearchSurface && (
                  <div className="search-no-results" role="status">Ничего не найдено</div>
                )}
                {hasAnySearchSurface && (
                  <div className="search-footer-hint">
                    <span><FaArrowUp /><FaArrowDown /> навигация</span>
                    <span>Enter выбор</span>
                    <span>Esc закрыть</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {favCount > 0 && (
            <button
              className="nav-fav-btn"
              onClick={handleFavoritesClick}
              title={`Избранное (${favCount})`}
              aria-label={`Избранное: ${favCount} нозологий`}
            >
              <IconGlyph glyph={uiGlyphs.star} />
              <span className="fav-badge">{favCount}</span>
            </button>
          )}

          <button
            className={`theme-toggle ${darkMode ? 'is-dark' : 'is-light'}`}
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Светлая тема' : 'Тёмная тема'}
            title={darkMode ? 'Светлая тема' : 'Тёмная тема'}
          >
            <IconGlyph glyph={darkMode ? uiGlyphs.sun : uiGlyphs.moon} />
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <button
          type="button"
          className="mobile-overlay"
          onClick={closeMobileMenu}
          aria-label="Закрыть меню"
          tabIndex={-1}
        />
      )}

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-header">
            <div className="mobile-menu-brand">
              <span className="navbar-brand-lockup"><span className="navbar-brand-uro">Uro</span><span className="navbar-brand-accent">Med</span></span>
              <span className="mobile-menu-caption">Клиническая навигация</span>
            </div>
            <div className="mobile-menu-actions">
              <button className="mobile-menu-utility" onClick={toggleSearch}>
                <IconGlyph glyph={uiGlyphs.search} /> Поиск
              </button>
              <button className="mobile-menu-utility" onClick={handleFavoritesClick}>
                <IconGlyph glyph={uiGlyphs.star} /> Избранное{favCount > 0 ? ` (${favCount})` : ''}
              </button>
            </div>
          </div>
          <div className="mobile-menu-content">
            {navGroups.map((group) => (
              <div key={group.label} className="mobile-menu-group">
                <div className="mobile-menu-group-label">{group.label}</div>
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    className={`mobile-menu-item ${activeSection === item.id ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <span className="mobile-menu-icon">{item.icon}</span>
                    {item.label}
                    {activeSection === item.id && <span className="mobile-menu-active-dot" />}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
Navbar.propTypes = propTypes;
Navbar.defaultProps = defaultProps;

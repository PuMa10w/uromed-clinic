import React from 'react';

const quickAccess = [
  { id: 'urolithiasis', name: 'Мочекаменная болезнь', icon: '01', meta: 'камни и колика', section: 'urology', subsection: 'stones' },
  { id: 'bph', name: 'ДГПЖ', icon: '02', meta: 'симптомы нижних мочевых путей', section: 'urology', subsection: 'functional' },
  { id: 'erectile-dysfunction', name: 'Эректильная дисфункция', icon: '03', meta: 'сексуальная медицина', section: 'andrology', subsection: 'sexual' },
  { id: 'male-infertility', name: 'Мужское бесплодие', icon: '04', meta: 'фертильность и спермограмма', section: 'andrology', subsection: 'fertility' },
  { id: 'pyelonephritis', name: 'Пиелонефрит', icon: '05', meta: 'инфекции и риски', section: 'urology', subsection: 'infections' },
  { id: 'kidney-cancer', name: 'Рак почки', icon: '06', meta: 'онкоурология', section: 'urology', subsection: 'oncology' },
  { id: 'drugs', name: 'Препараты', icon: '07', meta: 'фармакодинамика и риски', section: 'drugs' },
];

const guidelines = [
  { name: 'EAU', full: 'European Association of Urology', url: 'https://uroweb.org/guidelines', accent: 'eau' },
  { name: 'AUA', full: 'American Urological Association', url: 'https://www.auanet.org/guidelines', accent: 'aua' },
  { name: 'РКР', full: 'Российские клинические рекомендации', url: 'https://cr.minzdrav.gov.ru', accent: 'rkr' },
];

const workbenchActions = [
  { id: 'urgent', label: 'Ургентно', meta: 'красные флаги и маршруты', target: 'emergency' },
  { id: 'drugs', label: 'Препараты', meta: 'риски, дозы, мониторинг', target: 'drugs' },
  { id: 'sperm', label: 'Спермограмма', meta: 'fertility decision tree', target: 'calculators', tool: 'sperm-tree' },
  { id: 'atlas', label: '3D атлас', meta: 'модели + hotspots', target: 'atlas' },
];

const workbenchLanes = [
  {
    id: 'diagnose',
    index: '01',
    title: 'Открыть диагноз',
    text: 'Поиск, МКБ-разделы и избранное ведут сразу к карточке без лишнего лендинга.',
    points: ['Red flags сверху', 'Диагностика таблицами', 'Связанные препараты'],
  },
  {
    id: 'decide',
    index: '02',
    title: 'Принять решение',
    text: 'Карточка показывает, что исключить срочно, чем подтвердить и какой первый шаг выбрать.',
    points: ['Next step', 'Follow-up', 'Источники'],
  },
  {
    id: 'support',
    index: '03',
    title: 'Поддержать расчётом',
    text: 'Калькуляторы, препараты и 3D-модели связаны с клиническим маршрутом, а не живут отдельно.',
    points: ['Local-only', 'iPhone-safe', 'Reduced motion'],
  },
];

const LandingPage = ({ onNavigate, viewHistory = [], favorites = {} }) => {
  const recentItems = viewHistory
    .filter((item) => item?.id && item?.section)
    .slice(0, 4);
  const favoriteCount = Object.values(favorites).filter(Boolean).length;

  return (
    <div className="home-shell">
      <section className="home-workbench" aria-label="Clinical Workbench" data-v19-workbench="true" data-v20-workbench="true" data-v21-workbench="true">
        <div className="home-workbench-head">
          <span className="home-panel-kicker">Clinical Workbench</span>
          <h1 className="home-workbench-title">Рабочий старт врача</h1>
          <p className="home-workbench-subtitle">
            Быстрый вход в диагноз, препараты, калькуляторы и 3D-модели без визуального шума: открыть, подтвердить, выбрать следующий шаг.
          </p>
          <div className="home-workbench-status" data-v20-start="true">
            <span><strong>{favoriteCount}</strong> избранных</span>
            <span><strong>{recentItems.length}</strong> последних</span>
            <span>Strict iPhone visual QA</span>
          </div>
        </div>
        <div className="home-workbench-actions" aria-label="Быстрые действия врача" data-scrollable="x">
          {workbenchActions.map((action) => (
            <button
              key={action.id}
              type="button"
              className="home-workbench-action"
              onClick={() => onNavigate(action.target, null, null, {
                source: 'v19_clinical_workbench',
                tool: action.tool,
              })}
            >
              <span>{action.label}</span>
              <small>{action.meta}</small>
            </button>
          ))}
        </div>
        <div className="home-workbench-grid">
          {workbenchLanes.map((lane) => (
            <article key={lane.id} className="home-workbench-lane">
              <span className="home-workbench-index">{lane.index}</span>
              <h2>{lane.title}</h2>
              <p>{lane.text}</p>
              <div className="home-workbench-points">
                {lane.points.map((point) => <span key={point}>{point}</span>)}
              </div>
            </article>
          ))}
        </div>
        {recentItems.length > 0 && (
          <div className="home-workbench-recent" aria-label="Продолжить работу">
            <div className="home-workbench-recent-head">
              <span>Продолжить</span>
              <small>последние открытые карточки</small>
            </div>
            <div className="home-workbench-recent-row" data-scrollable="x">
              {recentItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="home-workbench-recent-card"
                  onClick={() => onNavigate(item.section, item.subsection, item.id, { source: 'v20_home_continue' })}
                >
                  <strong>{item.name || item.id}</strong>
                  <span>{item.icd || item.subsection || item.section}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Destination Cards */}
      <section className="home-destination-grid" aria-label="Основные разделы">
        <button
          type="button"
          className="home-destination-card is-urology"
          onClick={() => onNavigate('urology')}
        >
          <div className="destination-head">
            <span className="destination-kicker">Клиническая библиотека</span>
            <span className="destination-index">01</span>
          </div>
          <div className="destination-main">
            <h2 className="home-destination-title">Урология</h2>
            <p className="home-destination-description">
              Нозологии, диагностика, лечение и маршруты ведения: от камней и инфекций до онкоурологии и функциональных нарушений.
            </p>
          </div>
          <div className="destination-preview">
            <span className="destination-preview-item">ДГПЖ</span>
            <span className="destination-preview-item">Камни</span>
            <span className="destination-preview-item">Инфекции</span>
            <span className="destination-preview-item">Онкоурология</span>
          </div>
          <div className="destination-footer">
            <div className="destination-tags">
              <span className="destination-tag">60+ нозологий</span>
              <span className="destination-tag">7 категорий</span>
            </div>
            <span className="destination-arrow">→</span>
          </div>
        </button>

        <button
          type="button"
          className="home-destination-card is-andrology"
          onClick={() => onNavigate('andrology')}
        >
          <div className="destination-head">
            <span className="destination-kicker">Андрологический фокус</span>
            <span className="destination-index">02</span>
          </div>
          <div className="destination-main">
            <h2 className="home-destination-title">Андрология</h2>
            <p className="home-destination-description">
              Сексуальная функция, фертильность, эндокринные нарушения и клинические сценарии для мужского здоровья.
            </p>
          </div>
          <div className="destination-preview">
            <span className="destination-preview-item">ЭД</span>
            <span className="destination-preview-item">Фертильность</span>
            <span className="destination-preview-item">Гипогонадизм</span>
            <span className="destination-preview-item">Болезнь Пейрони</span>
          </div>
          <div className="destination-footer">
            <div className="destination-tags">
              <span className="destination-tag">30+ нозологий</span>
              <span className="destination-tag">3 категории</span>
            </div>
            <span className="destination-arrow">→</span>
          </div>
        </button>
      </section>

      {/* Quick Access */}
      <section className="home-panel" aria-label="Быстрый доступ">
        <div className="home-panel-head">
          <span className="home-panel-kicker">Clinical shortcuts</span>
          <h2 className="home-panel-title">Частые маршруты</h2>
          <p className="home-panel-subtitle">Собраны как рабочая полка врача: открыть, уточнить, принять решение.</p>
        </div>
        <div className="quick-grid">
          {quickAccess.map((item) => (
            <button
              key={item.id}
              type="button"
              className="quick-btn"
              onClick={() => item.section === 'drugs'
                ? onNavigate('drugs', null, null, { source: 'landing_quick_access' })
                : onNavigate(item.section, item.subsection, item.id, { source: 'landing_quick_access' })}
            >
              <span className="quick-icon">{item.icon}</span>
              <span className="quick-copy">
                <span className="quick-name">{item.name}</span>
                <span className="quick-meta">{item.meta}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Guidelines */}
      <section className="home-panel" aria-label="Источники">
        <div className="home-panel-head">
          <span className="home-panel-kicker">Evidence layer</span>
          <h2 className="home-panel-title">Источники</h2>
          <p className="home-panel-subtitle">Короткий доступ к ключевым рекомендациям без перегруза интерфейса.</p>
        </div>
        <div className="guidelines-grid">
          {guidelines.map((g) => (
            <a
              key={g.name}
              href={g.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`guideline-card guideline-card-${g.accent}`}
            >
              <span className="guideline-badge">{g.name}</span>
              <span className="guideline-name">{g.full}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="disclaimer-section">
        <p>Для медицинских специалистов. Не заменяет клиническое решение врача.</p>
      </section>
    </div>
  );
};

export default React.memo(LandingPage);

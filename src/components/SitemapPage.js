import React, { useState } from 'react';
import '../styles/servicePages.css';
import { allDiseases, searchDiseases } from '../data';
import { sectionNames, sectionIcons } from '../data/navigationMeta';

const allDiseasesNav = allDiseases.map((disease) => ({
  id: disease.id,
  name: disease.name,
  icd: disease.icd,
  section: disease.section,
  subsection: disease.subsection,
  icon: disease.icon,
}));

const serviceLinks = [
  { id: 'drugs', name: 'Справочник препаратов', meta: 'Поиск по препаратам, фармакодинамике, рискам и мониторингу', icon: '💊' },
  { id: 'calculators', name: 'Калькуляторы', meta: 'IPSS, шкалы, клинические расчёты', icon: '🧮' },
  { id: 'spermogram', section: 'calculators', tool: 'sperm-tree', name: 'Спермограмма', meta: 'Fertility decision tree: WHO-пороги, OAT, азооспермия, DFI, MAR и ART-маршрут', icon: '🧬' },
  { id: 'tools', name: 'Опросники', meta: 'Рабочие инструменты первичной оценки', icon: '📊' },
  { id: 'surgery', name: 'Хирургия', meta: 'Операции, доступы, периоперационные маршруты', icon: '🔪' },
  { id: 'metaphylaxis', name: 'Диеты при МКБ', meta: 'Метафилактика и пищевые сценарии', icon: '🥗' },
  { id: 'atlas', name: '3D Атлас', meta: 'Клинические модели нозологий, hotspots и быстрые переходы в карточки', icon: '◈' },
  { id: 'glossary', name: 'Глоссарий', meta: 'Короткие определения и термины', icon: '📖' },
];

const SitemapPage = ({ onNavigate }) => {
  const [search, setSearch] = useState('');

  const filtered = search.trim().length >= 2 ? searchDiseases(search) : allDiseasesNav;
  const filteredServiceLinks = serviceLinks.filter((item) => (
    [item.name, item.meta].join(' ').toLowerCase().includes(search.trim().toLowerCase())
  ));

  const grouped = {};
  filtered.forEach((disease) => {
    const key = disease.section;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(disease);
  });

  const sectionInfo = {};
  Object.keys(sectionNames).forEach((key) => {
    if (
      key !== 'home'
      && key !== 'emergency'
      && key !== 'tools'
      && key !== 'drugs'
      && key !== 'glossary'
      && key !== 'calculators'
      && key !== 'sitemap'
    ) {
      sectionInfo[key] = {
        name: sectionNames[key],
        icon: sectionIcons[key] || '📋',
        color: key === 'urology' ? '#16c79a' : key === 'andrology' ? '#c9a84c' : '#6495ed',
      };
    }
  });

  return (
    <section className="sitemap-page service-page-shell">
      <div className="service-page-intro">
        <span className="service-eyebrow">Full navigation</span>
        <h2 className="section-title">Карта сайта</h2>
        <p className="section-subtitle">
          Быстрый доступ ко всем нозологиям и разделам через единый индекс с поиском по названию и МКБ-коду.
        </p>
      </div>

      <div className="sitemap-search service-card-shell">
        <label className="sr-only" htmlFor="sitemap-search-input">Поиск по карте сайта</label>
        <input
          id="sitemap-search-input"
          type="text"
          placeholder="Поиск по названию или МКБ..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-describedby="sitemap-search-count"
        />
        <span id="sitemap-search-count" className="sitemap-count">
          {filtered.length} нозологий
        </span>
      </div>

      {filteredServiceLinks.length > 0 && (
        <div className="sitemap-group sitemap-services-group">
          <h3 className="sitemap-group-title">
            Сервисные разделы
            <span className="sitemap-group-count">{filteredServiceLinks.length}</span>
          </h3>
          <div className="sitemap-list sitemap-service-list">
            {filteredServiceLinks.map((item) => (
              <button
                key={item.id}
                className="sitemap-item sitemap-service-item"
                onClick={() => onNavigate(item.section || item.id, null, null, item.tool ? { source: 'sitemap_spermogram_entry', tool: item.tool } : { source: 'sitemap_service' })}
                data-sitemap-service={item.id}
              >
                <span className="sitemap-item-icon">{item.icon}</span>
                <span className="sitemap-item-name">{item.name}</span>
                <span className="sitemap-item-icd">{item.meta}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {Object.keys(grouped).map((section) => {
        const info = sectionInfo[section] || { name: section, icon: '📋', color: '#888' };
        return (
          <div key={section} className="sitemap-group">
            <h3 className="sitemap-group-title" style={{ color: info.color }}>
              {info.icon} {info.name}
              <span className="sitemap-group-count">{grouped[section].length}</span>
            </h3>
            <div className="sitemap-list">
              {grouped[section].map((disease) => (
                <button
                  key={disease.id}
                  className="sitemap-item"
                  onClick={() => onNavigate(disease.section, disease.subsection, disease.id)}
                >
                  <span className="sitemap-item-icon">{disease.icon}</span>
                  <span className="sitemap-item-name">{disease.name}</span>
                  <span className="sitemap-item-icd">{disease.icd}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default SitemapPage;

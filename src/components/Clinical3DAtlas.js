import React, { useMemo, useState } from 'react';
import { anatomyModels, clinicalAssistantCards, icdCoverageTargets } from '../data/clinicalAtlasData';
import '../styles/servicePages.css';

function ClinicalModelFigure({ model, activeHotspot }) {
  return (
    <div className={`clinical-model-figure tone-${model.tone}`} data-model-id={model.modelId}>
      <div className="clinical-model-orbit" aria-hidden="true">
        <span className="clinical-model-organ organ-primary" />
        <span className="clinical-model-organ organ-secondary" />
        <span className="clinical-model-duct" />
        <span className={`clinical-model-focus hotspot-${activeHotspot || model.hotspots[0]?.id || 'core'}`} />
      </div>
      <div className="clinical-model-caption">
        <span>{model.organ}</span>
        <strong>{model.performanceBudget}</strong>
      </div>
    </div>
  );
}

function Clinical3DAtlas({ onNavigate }) {
  const [activeModelId, setActiveModelId] = useState(anatomyModels[0].modelId);
  const [activeHotspots, setActiveHotspots] = useState({});
  const activeModel = useMemo(
    () => anatomyModels.find((model) => model.modelId === activeModelId) || anatomyModels[0],
    [activeModelId],
  );
  const activeHotspot = activeHotspots[activeModel.modelId] || activeModel.hotspots[0]?.id;

  const openModelRoute = (model) => {
    if (!model.route || !onNavigate) return;
    onNavigate(model.route.section, model.route.subsection, model.route.diseaseId, {
      source: 'clinical_3d_atlas',
    });
  };

  return (
    <section className="section clinical-atlas-page service-page-shell" data-v21-atlas="true">
      <div className="service-page-hero clinical-atlas-hero">
        <div className="service-page-intro service-page-intro-enhanced">
          <span className="service-eyebrow">Clinical 3D Atlas</span>
          <h2 className="section-title">3D Атлас нозологий</h2>
          <div className="service-hero-trust-row" aria-label="3D atlas trust signals">
            <span className="service-hero-trust-pill">iPhone-safe</span>
            <span className="service-hero-trust-pill">Hotspots + маршруты</span>
            <span className="service-hero-trust-pill">Fallback без WebGL</span>
          </div>
        </div>
        <div className="service-hero-grid">
          <div className="service-hero-panel">
            <span className="service-mini-kicker">Coverage</span>
            <div className="service-hero-stats">
              <div className="service-hero-stat">
                <span className="service-hero-stat-value">{anatomyModels.length}</span>
                <span className="service-hero-stat-label">моделей</span>
              </div>
              <div className="service-hero-stat">
                <span className="service-hero-stat-value">{anatomyModels.reduce((sum, model) => sum + model.hotspots.length, 0)}</span>
                <span className="service-hero-stat-label">hotspots</span>
              </div>
              <div className="service-hero-stat">
                <span className="service-hero-stat-value">0</span>
                <span className="service-hero-stat-label">обязательных WebGL блокировок</span>
              </div>
            </div>
          </div>
          <div className="service-hero-panel">
            <span className="service-mini-kicker">Assistant layer</span>
            <div className="clinical-assistant-stack">
              {clinicalAssistantCards.map((card) => (
                <article key={card.id} className="clinical-assistant-card">
                  <strong>{card.title}</strong>
                  <p>{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="clinical-atlas-layout">
        <aside className="clinical-atlas-rail" aria-label="Модели атласа">
          {anatomyModels.map((model) => (
            <button
              key={model.modelId}
              type="button"
              className={`clinical-atlas-rail-card ${activeModel.modelId === model.modelId ? 'active' : ''}`}
              onClick={() => setActiveModelId(model.modelId)}
              data-atlas-model={model.modelId}
            >
              <span>{model.organ}</span>
              <strong>{model.title}</strong>
            </button>
          ))}
        </aside>

        <article className="clinical-atlas-stage service-card-shell">
          <div className="atlas-fallback-policy" data-v19-atlas-fallback="true" data-v20-atlas-performance="true">
            <span>Progressive 3D</span>
            <strong>{activeModel.activationPolicy}</strong>
            <p>
              Fallback: {activeModel.fallbackAsset}. Reduced motion: {activeModel.reducedMotionBehavior}.
              Модель не блокирует чтение карточки и работает как клиническая навигация по hotspots.
            </p>
          </div>

          <div className="clinical-atlas-stage-head">
            <div>
              <span className="service-eyebrow">{activeModel.organ}</span>
              <h3>{activeModel.title}</h3>
              <p>{activeModel.subtitle}</p>
            </div>
            <button type="button" className="service-hero-action atlas-open-route" onClick={() => openModelRoute(activeModel)}>
              <span className="service-hero-action-title">Открыть карточку</span>
              <span className="service-hero-action-meta">нозология + алгоритм</span>
            </button>
          </div>

          <ClinicalModelFigure model={activeModel} activeHotspot={activeHotspot} />

          <div className="clinical-hotspot-grid">
            {activeModel.hotspots.map((hotspot) => (
              <button
                key={hotspot.id}
                type="button"
                className={`clinical-hotspot-card ${activeHotspot === hotspot.id ? 'active' : ''}`}
                onClick={() => setActiveHotspots((prev) => ({ ...prev, [activeModel.modelId]: hotspot.id }))}
              >
                <span>{hotspot.label}</span>
                <p>{hotspot.clinicalMeaning}</p>
              </button>
            ))}
          </div>
        </article>
      </div>

      <div className="icd-coverage-panel service-card-shell" data-icd-coverage="v14">
        <div className="clinical-atlas-stage-head">
          <div>
            <span className="service-eyebrow">ICD-10 coverage</span>
            <h3>Паспорт покрытия МКБ</h3>
            <p>Этот слой фиксирует, какие группы уже закрыты ядром сайта, а какие идут в следующую волну экспертного наполнения.</p>
          </div>
        </div>
        <div className="icd-coverage-grid">
          {icdCoverageTargets.map((target) => (
            <div key={target.range} className={`icd-coverage-card status-${target.status}`}>
              <span>{target.range}</span>
              <strong>{target.label}</strong>
              <small>Priority {target.priority} · {target.status}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Clinical3DAtlas;

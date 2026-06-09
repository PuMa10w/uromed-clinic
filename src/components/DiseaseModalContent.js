import React from 'react';

const PremiumDiseaseModalContent = ({ disease, activeTab }) => {
  const renderQuickSummary = () => {
    if (!disease.quickSummary) return null;

    return (
      <section className="modal-section">
        <h2 className="modal-section-title">
          <span className="mr-2">⚡</span>
          Быстрая сводка
        </h2>
        <div className="premium-summary-grid grid grid-cols-2 md:grid-cols-3 gap-md">
          {disease.icd && (
            <div className="summary-item">
              <span className="summary-label">МКБ-10</span>
              <span className="summary-value">{disease.icd}</span>
            </div>
          )}
          {disease.prevalence && (
            <div className="summary-item">
              <span className="summary-label">Распространённость</span>
              <span className="summary-value">{disease.prevalence}</span>
            </div>
          )}
          {disease.mortality && (
            <div className="summary-item">
              <span className="summary-label">Смертность</span>
              <span className="summary-value">{disease.mortality}</span>
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderSymptoms = () => {
    const symptoms = typeof disease.symptoms === 'string' ? disease.symptoms : 
                   Array.isArray(disease.symptoms) ? disease.symptoms.join(', ') : '';
    
    if (!symptoms) return null;

    return (
      <section className="modal-section">
        <h2 className="modal-section-title">
          <span className="mr-2">🔍</span>
          Симптомы
        </h2>
        <div className="content-block">
          <p className="leading-relaxed">{symptoms}</p>
        </div>
      </section>
    );
  };

  const renderDiagnosis = () => {
    if (!disease.differentialDiagnosis?.length) return null;

    return (
      <section className="modal-section">
        <h2 className="modal-section-title">
          <span className="mr-2">📋</span>
          Диагностика
        </h2>
        <div className="content-block">
          {disease.redFlags && (
            <div className="alert-box alert-warning mb-md">
              <strong>Красные флаги:</strong> {disease.redFlags.join(', ')}
            </div>
          )}
          <p className="leading-relaxed">{disease.differentialDiagnosis.join(', ')}</p>
        </div>
      </section>
    );
  };

  const renderTreatment = () => {
    if (!disease.treatment?.conservative && !disease.treatment?.invasive) return null;

    return (
      <section className="modal-section">
        <h2 className="modal-section-title">
          <span className="mr-2">💊</span>
          Лечение
        </h2>
        <div className="content-block">
          {disease.treatment.conservative && (
            <div className="mb-md">
              <h3 className="text-base font-semibold mb-sm">Консервативное</h3>
              <p className="text-secondary">{disease.treatment.conservative}</p>
            </div>
          )}
          {disease.treatment.invasive && (
            <div>
              <h3 className="text-base font-semibold mb-sm">Инвазивное</h3>
              <p className="text-secondary">{disease.treatment.invasive}</p>
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderPrevention = () => {
    if (!disease.lifestyleAdvice?.length && !disease.nutritionAdvice?.length) return null;

    return (
      <section className="modal-section">
        <h2 className="modal-section-title">
          <span className="mr-2">🛡️</span>
          Профилактика
        </h2>
        <div className="content-block">
          {disease.lifestyleAdvice?.length && (
            <div className="mb-md">
              <h3 className="text-base font-semibold mb-sm">Образ жизни</h3>
              <ul className="list-disc pl-lg">
                {disease.lifestyleAdvice.map((item, i) => (
                  <li key={i} className="mb-1">{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderRecommendations = () => {
    if (!disease.patientRecommendations?.length) return null;

    return (
      <section className="modal-section">
        <h2 className="modal-section-title">
          <span className="mr-2">📝</span>
          Рекомендации
        </h2>
        <div className="content-block">
          <ul className="list-disc pl-lg space-y-2">
            {disease.patientRecommendations.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            {renderQuickSummary()}
            {renderSymptoms()}
            {renderDiagnosis()}
            {renderTreatment()}
          </>
        );
      case 'details':
        return (
          <>
            {renderSymptoms()}
            {renderPrevention()}
            {renderRecommendations()}
          </>
        );
      case 'references':
        return (
          <section className="modal-section">
            <h2 className="modal-section-title">
              <span className="mr-2">📚</span>
              Источники
            </h2>
            <div className="content-block">
              <p className="text-secondary">Клинические рекомендации разрабатываются на основе актуальных международных guidelines.</p>
            </div>
          </section>
        );
      default:
        return renderTabContent();
    }
  };

  return (
    <div className="premium-modal-content">
      {disease.name && (
        <p className="text-primary text-md font-medium mb-md">{disease.name}</p>
      )}
      {renderTabContent()}
    </div>
  );
};

PremiumDiseaseModalContent.displayName = 'PremiumDiseaseModalContent';

export default PremiumDiseaseModalContent;
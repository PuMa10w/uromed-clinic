export function getDiseaseModalTabs(normalizedDisease) {
  const hasClassification = Boolean(
    normalizedDisease.classification
    && typeof normalizedDisease.classification === 'object'
    && Object.keys(normalizedDisease.classification).length
  );

  return [
    { id: 'overview', label: 'Обзор', show: true },
    { id: 'classification', label: 'Классификация', show: hasClassification },
    { id: 'symptoms', label: 'Симптомы', show: true },
    { id: 'redflags', label: 'Флаги', show: true },
    { id: 'diagnostics', label: 'Диагностика', show: true },
    { id: 'differential', label: 'Дифференциал', show: true },
    { id: 'ultrasound', label: 'УЗИ', show: true },
    { id: 'treatment', label: 'Лечение', show: true },
    { id: 'followup', label: 'Наблюдение', show: true },
    { id: 'prognosis', label: 'Прогноз', show: true },
    { id: 'cases', label: 'Клинические случаи', show: true },
    { id: 'guidelines', label: 'Источники', show: Boolean(normalizedDisease.guidelines) },
  ].filter((tab) => tab.show !== false);
}

export const DEFAULT_TAB = 'overview';

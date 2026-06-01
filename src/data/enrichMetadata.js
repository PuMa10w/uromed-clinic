import { sectionNames, subsectionLabels } from './index';

const SUBSECTION_PROFILES = {
  stones: {
    summary: 'симптомы, диагностика камней, тактика купирования боли и профилактика рецидива',
    tags: ['МКБ', 'Камни', 'Диагностика', 'Профилактика'],
  },
  infections: {
    summary: 'клиническая оценка, антибактериальная тактика, контроль осложнений и follow-up',
    tags: ['Инфекции', 'Антибиотики', 'Красные флаги', 'Контроль'],
  },
  oncology: {
    summary: 'стратификация риска, стадирование, маршрутизация и наблюдение по онконастороженности',
    tags: ['Онко', 'Стадирование', 'Риск', 'Наблюдение'],
  },
  functional: {
    summary: 'оценка симптомов, шкалы жалоб, поведенческая терапия и подбор дальнейшей тактики',
    tags: ['Симптомы', 'LUTS', 'Поведенческая терапия', 'Качество жизни'],
  },
  reconstructive: {
    summary: 'анатомическая оценка, показания к реконструкции, этапность лечения и послеоперационный контроль',
    tags: ['Реконструкция', 'Анатомия', 'Показания', 'Контроль'],
  },
  nephrology: {
    summary: 'лабораторный профиль, стратификация риска почечной дисфункции и план динамического наблюдения',
    tags: ['Почки', 'Лаборатория', 'Риск', 'Мониторинг'],
  },
  pain: {
    summary: 'дифференциальная диагностика боли, красные флаги и первичная тактика ведения',
    tags: ['Боль', 'Дифференциал', 'Красные флаги', 'Тактика'],
  },
  sexual: {
    summary: 'оценка сексуальной функции, факторов риска, психосоматических триггеров и маршрута лечения',
    tags: ['Сексуальная функция', 'Андрология', 'Оценка риска', 'Лечение'],
  },
  fertility: {
    summary: 'репродуктивная оценка, интерпретация спермограммы, дообследование и тактика для пары',
    tags: ['Фертильность', 'Спермограмма', 'Дообследование', 'Маршрутизация'],
  },
  endocrine: {
    summary: 'гормональный профиль, метаболические факторы и план безопасного долгосрочного контроля',
    tags: ['Гормоны', 'Метаболизм', 'Контроль', 'Долгосрочно'],
  },
};

const SECTION_TAGS = {
  urology: ['Урология'],
  andrology: ['Андрология'],
  pediatric: ['Педиатрия'],
};

function getSectionLabel(section) {
  return sectionNames[section] || 'Справочник';
}

function getSubsectionLabel(subsection) {
  return subsection ? subsectionLabels[subsection] || subsection : null;
}

function buildDescription(disease) {
  const sectionLabel = getSectionLabel(disease.section);
  const subsectionLabel = getSubsectionLabel(disease.subsection);
  const profile = disease.subsection ? SUBSECTION_PROFILES[disease.subsection] : null;

  if (subsectionLabel && profile) {
    return `${sectionLabel}: ${subsectionLabel}. Карточка по теме «${disease.name}» включает ${profile.summary}.`;
  }

  if (subsectionLabel) {
    return `${sectionLabel}: ${subsectionLabel}. Карточка по теме «${disease.name}» с переходом к полной статье, диагностике и клинической тактике.`;
  }

  return `${sectionLabel}. Карточка по теме «${disease.name}» с краткой клинической выжимкой и переходом к полной статье.`;
}

function buildTags(disease) {
  const subsectionTags = disease.subsection ? SUBSECTION_PROFILES[disease.subsection]?.tags || [] : [];
  const sectionTags = SECTION_TAGS[disease.section] || [];
  const icdTag = disease.icd ? [`МКБ ${disease.icd}`] : [];

  return [...new Set([...sectionTags, ...subsectionTags, ...icdTag])].slice(0, 4);
}

export function enrichDiseaseMetadata(disease) {
  return {
    ...disease,
    description: disease.description || buildDescription(disease),
    tags: Array.isArray(disease.tags) && disease.tags.length > 0 ? disease.tags : buildTags(disease),
  };
}

export function enrichDiseaseMetadataList(diseases) {
  return diseases.map(enrichDiseaseMetadata);
}

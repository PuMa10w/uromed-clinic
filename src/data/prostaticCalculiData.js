const prostaticCalculiData = {
  id: 'prostatic-calculi',
  name: 'Камни простаты',
  icd: 'N42.0',
  icon: '🔬',
  description: 'Конкременты в ткани и протоках предстательной железы, чаще ассоциированные с хроническим воспалением и застоем секрета.',
  tags: ['EAU 2025', 'AUA 2025', 'РКР 2024', 'UA 2025'],
  relatedIds: ['prostatitis', 'chronic-bacterial-prostatitis', 'prostatic-cyst', 'bph'],
  definition: 'Камни простаты — кальцификаты в ацинусах или выводных протоках простаты, выявляемые случайно или при хронической тазовой боли и инфекционном рецидивировании.',
  epidemiology: 'Часто встречаются у мужчин среднего и старшего возраста как incidental finding на ТРУЗИ или КТ; клиническое значение выше при хроническом простатите и persistent symptoms.',
  classification: ['Первичные эндогенные кальцификаты', 'Вторичные камни при рефлюксе мочи в протоки', 'Бессимптомные', 'Симптомные на фоне хронического воспаления'],
  etiology: ['Застой секрета простаты', 'Хроническое воспаление', 'Рефлюкс мочи в протоки', 'Возрастные дегенеративные изменения'],
  symptoms: ['Часто бессимптомно', 'Хроническая тазовая боль', 'Дизурия', 'Рецидивирующий простатит', 'Дискомфорт при эякуляции'],
  diagnostics: {
    primary: ['ТРУЗИ простаты', 'Оценка симптомов хронического простатита', 'ОАМ/посев по показаниям'],
    additional: ['МРТ простаты или КТ при сложном дифференциале'],
    keyFindings: 'Большинство кальцификатов не требует лечения само по себе; важна связь с симптомами и рецидивирующей инфекцией.'
  },
  treatment: [
    'Бессимптомные кальцификаты обычно не лечат.',
    'При хроническом воспалительном болевом синдроме лечат основной синдром, а не изображение.',
    'При рецидивирующем бактериальном простатите камни могут поддерживать bacterial persistence и осложнять eradication.',
    'Инвазивное удаление обсуждается редко, при строго отобранных симптомных пациентах.'
  ],
  guidelines: {
    eau: { title: 'EAU Chronic Pelvic Pain / Prostatitis principles 2025', keyPoints: ['Imaging findings alone should not drive treatment.', 'Symptoms and recurrent infection pattern determine clinical relevance.', 'Multimodal management is preferred in chronic pelvic pain contexts.'] },
    aua: { title: 'AUA male pelvic pain practice principles 2025', keyPoints: ['Do not overmedicalize incidental calcifications.', 'Persistent bacterial prostatitis may warrant attention to obstructive or calcific niches.', 'Treatment decisions should be symptom-based.'] },
    ru: { title: 'Российские рекомендации по хроническому простатиту 2024', keyPoints: ['Кальцинаты сами по себе не являются показанием к операции.', 'При бактериальном рецидивировании необходимо оценить, поддерживают ли они хроническое воспаление.', 'Тактика строится по доминирующему клиническому синдрому.'] },
    ua: { title: 'Australasian chronic prostatitis guidance 2025', keyPoints: ['Incidental calcifications are common and often benign.', 'Patient counselling should reduce unnecessary anxiety from imaging reports.', 'Escalation beyond conservative care should be rare and individualized.'] }
  },
  quickSummary: 'Камни простаты часто находка, а не диагноз; лечат симптомы и хроническую инфекцию, если она действительно есть.',
  redFlags: ['Рецидивирующий подтверждённый бактериальный простатит', 'Выраженная тазовая боль с исключёнными альтернативными причинами', 'Подозрение на другой процесс по данным визуализации'],
  followUp: 'Контроль нужен по симптомам и инфекционным рецидивам, а не по факту существования кальцификатов.',
  prognosis: 'У большинства пациентов течение доброкачественное; прогноз определяется основным воспалительным или болевым синдромом, а не самими кальцинатами.',
};

export default prostaticCalculiData;

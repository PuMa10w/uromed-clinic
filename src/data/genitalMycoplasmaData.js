const genitalMycoplasmaData = {
  id: "genital-mycoplasma",
  name: "Микоплазменная инфекция мочеполовая",
  icd: "A49.3",
  icon: "🔥",
  description: "ИППП, вызываемая Mycoplasma genitalium и hominis. Причина негонококкового уретрита, бесплодия.",
  tags: ["IUSTI 2024", "CDC 2024", "РКР 2024"],
  relatedIds: ["urethritis", "chronic-prostatitis-cpps"],
  quickSummary: { prevalence: '1-3% взрослых, ↑ при множественных партнёрах', genderRatio: 'М = Ж', goldStandard: 'ПЦР (NAAT) на M. genitalium', firstLine: 'Моксифлоксацин 400 мг × 7 дн', surgery: 'Не требуется', recurrence: '5-10% (резистентность)' },
  epidemiology: 'M. genitalium — 15-20% негонококковых уретритов. ↑ резистентность к макролидам (до 50%).',
  definition: 'Микоплазменная инфекция — ИППП, вызываемая M. genitalium/hominis — мельчайшие бактерии без клеточной стенки.',
  classification: { title: 'Классификация', byCourse: ['Острый уретрит', 'Хронический уретрит', 'Бессимптомное носительство'] },
  etiology: ['Mycoplasma genitalium — основная патогенная', 'Mycoplasma hominis — условно-патогенная', 'Передача: половой путь'],
  symptoms: ['Уретрит (скудные выделения)', 'Дизурия', 'Бессимптомно (до 50%)', 'При хроническом: боль в промежности, бесплодие'],
  diagnostics: { title: 'Диагностика', steps: [{ step: 1, text: 'ПЦР (NAAT) на M. genitalium — золотой стандарт', main: true }, { step: 2, text: 'Тест на резистентность к макролидам (при наличии)', main: false }], imaging: 'Не требуется.', labs: 'ПЦР — чувствительность 95-99%' },
  treatment: { conservative: [{ title: 'Медикаментозная терапия', items: ['Моксифлоксацин 400 мг × 7 дн — первая линия (резистентность к макролидам растёт)', 'Азитромицин 1 г → 500 мг × 3 дн — при чувствительности', 'Доксициклин 100 мг × 7 дн — ↓ бактериальной нагрузки перед основным лечением', 'Лечение партнёра', 'Половой покой 7 дней'] }], surgical: [] },
  guidelines: { ru: { title: "РКР по ИППП 2024", keyPoints: ["ПЦР на M. genitalium при негонококковом уретрите", "Моксифлоксацин — при резистентности"], url: "https://cr.minzdrav.gov.ru" } },
  redFlags: [{ text: 'Резистентность к макролидам', urgent: false, action: 'Моксифлоксацин' }],
  whenToRefer: { toUrologist: ['Хронический уретрит — исключить M. genitalium'], toEmergency: [] },
  followUp: { schedule: ['ПЦР через 3-4 нед (test of cure)', 'При симптомах — раньше'], monitoring: ['ПЦР', 'Симптомы'] },
  prognosis: { shortTerm: 'Излечение 90-95% моксифлоксацином.', longTerm: 'Резистентность растёт. Реинфекция.', factors: ['↑ Резистентность к макролидам — худший прогноз'], statistics: 'Моксифлоксацин: 90-95% излечение.' },
  clinicalCases: [{ title: 'Клинический случай №1', patient: 'Мужчина, 32 года', complaint: 'Уретрит 3 мес, не отвечающий на азитромицин.', findings: 'ПЦР: M. genitalium +. Резистентность к макролидам.', diagnosis: 'Хронический уретрит (M. genitalium, макролид-резистентный).', treatment: 'Доксициклин 100 мг × 7 дн → моксифлоксацин 400 мг × 7 дн.', outcome: 'ПЦР через 4 нед — отрицательная.', lesson: 'При неэффективности азитромицина — моксифлоксацин!' }],
  patientQuestions: [{ q: 'Опасно ли это?', a: 'При своевременном лечении — нет. Хронический — риск бесплодия.' }, { q: 'Почему не помог азитромицин?', a: 'Резистентность M. genitalium к макролидам достигает 50%.' }, { q: 'Нужно ли лечить партнёра?', a: 'ДА! Обязательное обследование и лечение.' }],
  drugDoses: [{ name: 'Моксифлоксацин', dose: '400 мг × 1 р/д × 7 дн', note: 'Первая линия при резистентности' }, { name: 'Доксициклин', dose: '100 мг × 2 р/д × 7 дн', note: 'Прелоад перед моксифлоксацином' }],
  labNorms: { 'ПЦР на M. genitalium': { normal: 'Отрицательно', note: 'Положительный = инфекция' } },
  differentialTable: [{ condition: 'Хламидийный уретрит', distinguishingFeature: 'Похожая клиника, другой возбудитель', investigation: 'ПЦР на C. trachomatis' }, { condition: 'Гонорейный уретрит', distinguishingFeature: 'Обильные гнойные выделения', investigation: 'ПЦР на N. gonorrhoeae' }]
};

export default genitalMycoplasmaData;

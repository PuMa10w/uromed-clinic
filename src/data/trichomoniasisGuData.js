const trichomoniasisGuData = {
  id: "trichomoniasis-gu",
  name: "Трихомониаз мочеполовой",
  icd: "A59.0",
  icon: "🔥",
  description: "ИППП, вызываемая Trichomonas vaginalis. У мужчин — уретрит, простатит. У женщин — вагинит.",
  tags: ["ВОЗ 2024", "CDC 2024", "РКР 2024"],
  relatedIds: ["urethritis", "prostatitis"],
  quickSummary: { prevalence: '278 млн случаев/год в мире', genderRatio: 'М = Ж, у мужчин чаще бессимптомно', goldStandard: 'ПЦР мочи/мазка', firstLine: 'Метронидазол 2 г однократно', surgery: 'Не требуется', recurrence: '5-10% (реинфекция)' },
  epidemiology: 'Самая распространённая невирусная ИППП. У мужчин 70-85% бессимптомны. ↑ риск ВИЧ × 2.',
  definition: 'Трихомониаз — ИППП, вызываемая простейшим Trichomonas vaginalis.',
  classification: { title: 'Классификация', byCourse: ['Бессимптомное носительство', 'Острый уретрит', 'Хронический уретрит/простатит'] },
  etiology: ['Trichomonas vaginalis — простейшее жгутиконосец', 'Передача: половой путь'],
  symptoms: ['Выделения из уретры (скудные)', 'Дизурия', 'Зуд уретры', 'Бессимптомно (70-85% мужчин)'],
  diagnostics: { title: 'Диагностика', steps: [{ step: 1, text: 'ПЦР мочи или мазка — золотой стандарт', main: true }, { step: 2, text: 'Микроскопия нативного препарата — подвижные трихомонады', main: false }, { step: 3, text: 'Культура — при отрицательной ПЦР', main: false }], imaging: 'Не требуется.', labs: 'ПЦР — чувствительность 95-100%' },
  treatment: { conservative: [{ title: 'Медикаментозная терапия', items: ['Метронидазол 2 г однократно <span class="badge badge-grade-a">Grade A</span>', 'Тинидазол 2 г однократно — альтернатива', 'Лечение партнёра ОБЯЗАТЕЛЬНО', 'Половой покой до окончания лечения'] }], surgical: [] },
  guidelines: { ru: { title: "РКР по ИППП 2024", keyPoints: ["Метронидазол 2 г однократно (УУР — A)", "Лечение партнёра (УУР — A)"], url: "https://cr.minzdrav.gov.ru" } },
  redFlags: [{ text: 'Трихомониаз + ВИЧ-положительный', urgent: false, action: '↑ риск передачи ВИЧ — лечение обязательно' }],
  whenToRefer: { toUrologist: ['Хронический уретрит — исключить трихомониаз'], toEmergency: [] },
  followUp: { schedule: ['Контроль через 3 мес — ПЦР'], monitoring: ['ПЦР', 'Симптомы'] },
  prognosis: { shortTerm: 'Излечение 90-95% за однократный приём.', longTerm: 'Реинфекция при незащищённом контакте.', factors: ['↑ Лечение партнёра — ↓ реинфекция'], statistics: 'Излечение: 90-95%.' },
  clinicalCases: [{ title: 'Клинический случай №1', patient: 'Мужчина, 30 лет', complaint: 'Выделения из уретры 1 нед. Партнёрша с трихомониазом.', findings: 'ПЦР: T. vaginalis +.', diagnosis: 'Трихомониаз.', treatment: 'Метронидазол 2 г однократно. Лечение партнёрши.', outcome: 'Через 3 мес: ПЦР отрицательная.', lesson: 'Лечение ОБАИХ партнёров обязательно!' }],
  patientQuestions: [{ q: 'Как передаётся?', a: 'Половым путём. Презерватив — защита.' }, { q: 'Нужно ли лечить партнёра?', a: 'ДА! Обязательно, даже без симптомов.' }, { q: 'Можно ли пить алкоголь?', a: 'НЕТ с метронидазолом! Дисульфирамоподобная реакция.' }],
  drugDoses: [{ name: 'Метронидазол', dose: '2 г однократно', note: 'НЕ с алкоголем!' }, { name: 'Тинидазол', dose: '2 г однократно', note: 'Альтернатива' }],
  labNorms: { 'ПЦР на T. vaginalis': { normal: 'Отрицательно', note: 'Положительный = инфекция' } },
  differentialTable: [{ condition: 'Гонорейный уретрит', distinguishingFeature: 'Обильные гнойные выделения', investigation: 'ПЦР на N. gonorrhoeae' }, { condition: 'Хламидийный уретрит', distinguishingFeature: 'Скудные выделения, постепенное начало', investigation: 'ПЦР на C. trachomatis' }]
};

export default trichomoniasisGuData;

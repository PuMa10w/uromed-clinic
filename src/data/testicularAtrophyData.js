const testicularAtrophyData = {
  id: 'testicular-atrophy',
  name: 'Атрофия яичка',
  icd: 'N50.0',
  icon: '⚡',
  description: 'Уменьшение объёма и функции яичка после перекрута, варикоцеле, воспаления, травмы или эндокринных нарушений.',
  tags: ['EAU 2025', 'AUA 2025', 'РКР 2024', 'UA 2025'],
  relatedIds: ['testicular-torsion', 'varicocele', 'male-infertility', 'hypogonadism'],
  definition: 'Атрофия яичка — уменьшение объёма тестикулы с риском снижения сперматогенной и эндокринной функции.',
  epidemiology: 'Часто является следствием ранее перенесённого перекрута, крипторхизма, варикоцеле, орхоэпидидимита, травмы или токсического/эндокринного воздействия.',
  classification: ['Односторонняя атрофия', 'Двусторонняя атрофия', 'Постишемическая', 'Поствоспалительная', 'Эндокринно-метаболическая'],
  etiology: ['Перекрут яичка', 'Варикоцеле', 'Орхит/эпидидимоорхит', 'Крипторхизм', 'Травма', 'Анаболические препараты и эндокринные нарушения'],
  symptoms: ['Уменьшение объёма яичка', 'Снижение фертильности', 'Иногда тупая боль или чувство тяжести', 'Признаки гипогонадизма при двустороннем поражении'],
  diagnostics: {
    primary: ['Осмотр и орхидометрия/УЗИ мошонки', 'Гормональный профиль: тестостерон, ЛГ, ФСГ по показаниям', 'Спермограмма при репродуктивном запросе'],
    additional: ['Оценка причины атрофии и перенесённых событий'],
    keyFindings: 'Нужно определить не только факт атрофии, но и сохранность функции второго яичка, репродуктивные планы и необходимость эндокринной коррекции.'
  },
  treatment: [
    'Лечат причину или последствия: варикоцеле, воспаление, эндокринные нарушения, бесплодие.',
    'При репродуктивном запросе важны спермограмма, обсуждение fertility preservation и коррекция обратимых факторов.',
    'При симптомном гипогонадизме оценивают показания к гормональной терапии с учётом фертильности.',
    'Изолированная безболевая односторонняя атрофия без онкориска чаще требует наблюдения, а не операции.'
  ],
  guidelines: {
    eau: { title: 'EAU Sexual and Reproductive Health 2025', keyPoints: ['Testicular volume matters as a marker of spermatogenic reserve.', 'Assessment should include fertility intent and endocrine status.', 'Management is cause-oriented, not volume-oriented alone.'] },
    aua: { title: 'AUA male infertility and hypogonadism principles 2025', keyPoints: ['Do not start testosterone blindly in men desiring fertility.', 'Ultrasound and hormonal workup help define unilateral vs global testicular dysfunction.', 'Prior torsion and orchitis should be documented as potential causes.'] },
    ru: { title: 'Российские рекомендации по андрологии 2024', keyPoints: ['Обследование должно включать гормоны и спермограмму по показаниям.', 'Тактика определяется причиной, двусторонностью и репродуктивными планами пациента.', 'Заместительная гормональная терапия требует взвешенной оценки фертильности.'] },
    ua: { title: 'Australasian men’s health guidance 2025', keyPoints: ['Functional counselling is as important as imaging findings.', 'Fertility planning should be addressed early in younger men.', 'Follow-up should focus on symptoms, hormones and semen parameters when relevant.'] }
  },
  quickSummary: 'Атрофия яичка — это не только про размер, а про фертильность, тестостерон и причину, которую нельзя пропустить.',
  redFlags: ['Плотное образование или подозрение на опухоль', 'Быстрое уменьшение объёма', 'Двустороннее поражение с признаками гипогонадизма', 'Нарушение фертильности'],
  followUp: 'Контроль по клинике, УЗИ при сомнениях, гормонам и спермограмме при репродуктивном запросе.',
  prognosis: 'При одностороннем процессе функция часто компенсируется вторым яичком; двустороннее поражение повышает риск бесплодия и андрогенной недостаточности.',
};

export default testicularAtrophyData;

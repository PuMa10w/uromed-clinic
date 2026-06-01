const underactiveBladderData = {
  id: 'underactive-bladder',
  name: 'Гипоактивный мочевой пузырь',
  icd: 'N31.2',
  icon: '💧',
  description: 'Синдром замедленного и неэффективного опорожнения мочевого пузыря, часто связанный с детрузорной недостаточностью и высокой остаточной мочой.',
  tags: ['EAU 2025', 'AUA 2025', 'РКР 2024', 'UA 2025'],
  relatedIds: ['urinary-retention', 'neurogenic-bladder', 'bladder-outlet-obstruction', 'stress-incontinence'],
  definition: 'Гипоактивный мочевой пузырь — клинический синдром, при котором опорожнение мочевого пузыря замедлено или неполно вследствие сниженной сократимости детрузора и/или некоординированного мочеиспускания.',
  epidemiology: 'Чаще встречается у пожилых пациентов, при диабете, неврологических заболеваниях, после операций на органах таза и при длительной инфравезикальной обструкции.',
  classification: ['Идиопатический вариант', 'Неврогенный вариант', 'Послеобструктивная детрузорная недостаточность', 'Ятрогенная гипоконрактильность'],
  etiology: ['Диабетическая автономная нейропатия', 'Поражения спинного мозга и периферической нервной системы', 'Длительная BOO', 'Антихолинергические и седативные препараты', 'Возрастное снижение сократимости детрузора'],
  symptoms: ['Слабая струя мочи', 'Необходимость натуживания', 'Чувство неполного опорожнения', 'Редкие мочеиспускания', 'Рецидивирующие ИМП из-за остаточной мочи'],
  diagnostics: {
    primary: ['Дневник мочеиспусканий и оценка симптомов', 'УЗИ остаточной мочи', 'Урофлоуметрия', 'Оценка лекарств и неврологического статуса'],
    additional: ['Уродинамика для подтверждения детрузорной недостаточности', 'Креатинин/СКФ', 'Цистоскопия при подозрении на сопутствующую BOO'],
    keyFindings: 'Ключевая задача — отделить истинную детрузорную недостаточность от механической обструкции и смешанных вариантов.'
  },
  treatment: [
    'Коррекция провоцирующих препаратов и факторов задержки мочи.',
    'Поведенческие меры: timed voiding, двойное мочеиспускание, контроль запоров.',
    'Интермиттирующая катетеризация рассматривается при высокой остаточной моче и осложнениях.',
    'Если доминирует BOO, лечить обструкцию; изолированная фармакотерапия детрузорной недостаточности имеет ограниченную доказательную базу.'
  ],
  guidelines: {
    eau: { title: 'EAU Non-neurogenic LUTS 2025', keyPoints: ['Residual urine and complications matter more than symptom score alone.', 'Urodynamics useful when diagnosis will change management.', 'Intermittent catheterization preferred over chronic indwelling catheter when feasible.'] },
    aua: { title: 'AUA LUTS and chronic retention principles 2025', keyPoints: ['Differentiate impaired contractility from outlet obstruction.', 'Management focuses on bladder emptying safety and complication prevention.', 'Patient education on catheter options is essential when emptying remains inadequate.'] },
    ru: { title: 'Российские рекомендации по нарушениям мочеиспускания 2024', keyPoints: ['Остаточная моча и осложнения определяют необходимость активной тактики.', 'Уродинамика помогает уточнить механизм нарушения у сложных пациентов.', 'При хронической задержке важно защищать верхние мочевые пути.'] },
    ua: { title: 'Australasian LUTS guidance 2025', keyPoints: ['The goal is safe emptying, not merely symptom reduction.', 'Conservative measures and catheter strategy should be individualized.', 'Monitoring of UTIs and renal impact is required in long-term cases.'] }
  },
  quickSummary: 'Нельзя автоматически считать слабую струю только обструкцией: иногда проблема в самом детрузоре.',
  redFlags: ['Большая остаточная моча', 'Рецидивирующие ИМП', 'Рост креатинина', 'Эпизоды полной задержки мочи'],
  followUp: 'Контроль остаточной мочи, ИМП, функции почек и эффективности стратегии опорожнения.',
  prognosis: 'Зависит от причины; при правильном ведении можно снизить риск ИМП и повреждения верхних мочевых путей, но полное восстановление сократимости бывает не всегда.',
};

export default underactiveBladderData;

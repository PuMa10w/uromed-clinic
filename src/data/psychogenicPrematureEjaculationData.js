const psychogenicPrematureEjaculationData = {
  id: 'psychogenic-premature-ejaculation',
  name: 'Психогенная преждевременная эякуляция',
  icd: 'F52.4',
  icon: 'Brain',
  description:
    'Психогенный вариант преждевременной эякуляции с выраженным дистрессом и снижением контроля эякуляторного рефлекса.',
  tags: ['МКБ-10 F52.4', 'EAU Sexual and Reproductive Health', 'психосексуальная медицина'],
  relatedIds: ['premature-ejaculation', 'psychogenic-ed', 'delayed-ejaculation', 'erectile-dysfunction'],

  definition:
    'F52.4 - преждевременная эякуляция, где ключевую роль играют психологические механизмы, тревога и поведенческие паттерны.',
  symptoms: [
    'Стабильно короткая латентность интравагинальной эякуляции',
    'Ощущение потери контроля',
    'Дистресс у пациента и/или пары, избегание половых контактов',
  ],
  diagnostics: {
    title: 'Диагностика',
    steps: [
      { step: 1, text: 'Оценка IELT и валидизированных опросников ПЭ', main: true },
      { step: 2, text: 'Исключение органических причин и сопутствующей ЭД', main: true },
      { step: 3, text: 'Психосоциальная оценка (стресс, конфликт, тревога)', main: true },
    ],
  },
  treatment: {
    conservative: [
      {
        title: 'Терапевтическая стратегия',
        items: [
          'Поведенческие техники и психосексуальная терапия.',
          'Фармакотерапия по показаниям (например, дапоксетин, топические анестетики).',
          'Совместное ведение пары для устойчивого результата.',
        ],
      },
    ],
  },
};

export default psychogenicPrematureEjaculationData;

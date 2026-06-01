import React, { useEffect, useMemo, useState } from 'react';
import { drugList as premiumDrugList, drugReferenceMeta, drugSearchHints } from '../data/drugReferenceData';
import '../styles/servicePages.css';

const COLORS = {
  blue: '#3b82f6',
  green: '#16c79a',
  red: '#ef4444',
  gold: '#f59e0b',
  teal: '#22c7b8',
  violet: '#8b5cf6',
};

const drugRiskFilters = [
  { id: 'all', label: 'Все', query: '' },
  { id: 'qt', label: 'QT', query: 'QT qtc аритм' },
  { id: 'nephro', label: 'Нефротоксичность', query: 'нефро почек креатинин хбп' },
  { id: 'fertility', label: 'Фертильность', query: 'фертиль сперматогенез либидо тестостерон' },
  { id: 'partner-pregnancy', label: 'Беременность партнёрши', query: 'беремен партнерш тератоген' },
  { id: 'anticoagulants', label: 'Антикоагулянты', query: 'антикоагулян кровотеч' },
  { id: 'ckd', label: 'ХБП', query: 'хбп почек egfr креатинин' },
  { id: 'esbl', label: 'ESBL', query: 'esbl резистент' },
  { id: 'androgens', label: 'Андрогены', query: 'андроген тестостерон гипогонадизм' },
];

const drugCockpitSteps = [
  { id: 'task', title: 'Клиническая задача', text: 'ДГПЖ, ИМП, камни, боль, ЭД, фертильность, онко или ургентный сценарий.' },
  { id: 'group', title: 'Группа', text: 'Сужение до класса без простыни фильтров и случайных чипов.' },
  { id: 'drug', title: 'Препарат', text: 'МНН, синонимы, режим и показания в одном readable-блоке.' },
  { id: 'risk', title: 'Риски', text: 'QT, ХБП, фертильность, антикоагулянты, ESBL и взаимодействия.' },
  { id: 'monitoring', title: 'Мониторинг', text: 'Что проверить до старта, во время терапии и при follow-up.' },
];

function getDrugSearchHaystack(item) {
  return [
    item.name,
    item.aliases?.join(' '),
    item.group,
    item.className,
    item.indications,
    item.positivePharmacodynamics,
    item.negativePharmacodynamics,
    item.monitoring,
    item.contraindications,
    item.inn,
    item.tradeNames?.join(' '),
    item.riskTags?.join(' '),
    item.ckdAdjustment,
    item.fertilityImpact,
    item.interactions,
    item.sourceIds?.join(' '),
    item.tags?.join(' '),
  ].filter(Boolean).join(' ').toLowerCase();
}

function getDrugClinicalTask(item) {
  const haystack = getDrugSearchHaystack(item);
  if (haystack.includes('эрекц') || haystack.includes('тестостерон') || haystack.includes('фертиль')) return 'андрология';
  if (haystack.includes('esbl') || haystack.includes('антибиот') || haystack.includes('имп')) return 'инфекции';
  if (haystack.includes('камн') || haystack.includes('цитрат') || haystack.includes('колик')) return 'камни';
  if (haystack.includes('дгпж') || haystack.includes('задержк') || haystack.includes('лутс')) return 'СНМП / ДГПЖ';
  if (haystack.includes('онко') || haystack.includes('рак') || haystack.includes('bсg')) return 'онкоурология';
  return item.group || 'урология';
}

function getDrugMonitoringPriority(item) {
  const haystack = getDrugSearchHaystack(item);
  if (haystack.includes('qt') || haystack.includes('нефро') || haystack.includes('креатинин') || haystack.includes('антикоагулян')) return 'high';
  if (haystack.includes('контроль') || haystack.includes('монитор')) return 'watch';
  return 'routine';
}

const frequency5 = [
  { value: 0, label: 'Никогда' },
  { value: 1, label: 'Редко' },
  { value: 2, label: 'Иногда' },
  { value: 3, label: 'Часто' },
  { value: 4, label: 'Почти всегда' },
];

const ipssOptions = [
  { value: 0, label: '0' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
];

const yesNo = [
  { value: 0, label: 'Нет' },
  { value: 1, label: 'Да' },
];

const impact5 = [
  { value: 0, label: 'Нет' },
  { value: 1, label: 'Слабо' },
  { value: 2, label: 'Умеренно' },
  { value: 3, label: 'Сильно' },
  { value: 4, label: 'Крайне' },
];

function scoreSeverity(total, ranges) {
  return ranges.find((range) => total <= range.max) || ranges[ranges.length - 1];
}

const toolDefinitions = [
  {
    id: 'ipss',
    category: 'LUTS',
    title: 'IPSS',
    subtitle: 'Симптомы нижних мочевых путей',
    color: COLORS.blue,
    scale: '0-35',
    options: ipssOptions,
    questions: [
      'Неполное опорожнение после мочеиспускания',
      'Повторное мочеиспускание менее чем через 2 часа',
      'Прерывистая струя',
      'Трудно отложить мочеиспускание',
      'Слабая струя',
      'Необходимость натуживаться',
      'Никтурия: сколько раз за ночь',
    ],
    interpret: (total) => scoreSeverity(total, [
      { max: 7, label: 'Лёгкие симптомы', tone: 'low' },
      { max: 19, label: 'Умеренные симптомы', tone: 'mid' },
      { max: 35, label: 'Тяжёлые симптомы', tone: 'high' },
    ]),
  },
  {
    id: 'iief5',
    category: 'Андрология',
    title: 'IIEF-5',
    subtitle: 'Скрининг эректильной функции',
    color: COLORS.green,
    scale: '5-25',
    options: [
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4' },
      { value: 5, label: '5' },
    ],
    questions: [
      'Уверенность в достижении и поддержании эрекции',
      'Эрекция достаточна для проникновения',
      'Удаётся поддерживать эрекцию после проникновения',
      'Трудность удержания эрекции до завершения акта',
      'Удовлетворённость половым актом',
    ],
    interpret: (total) => scoreSeverity(total, [
      { max: 7, label: 'Выраженная ЭД', tone: 'high' },
      { max: 11, label: 'Умеренная ЭД', tone: 'mid' },
      { max: 16, label: 'Лёгко-умеренная ЭД', tone: 'mid' },
      { max: 21, label: 'Лёгкая ЭД', tone: 'low' },
      { max: 25, label: 'Клинически значимой ЭД не видно', tone: 'good' },
    ]),
  },
  {
    id: 'pedt',
    category: 'Андрология',
    title: 'PEDT',
    subtitle: 'Преждевременная эякуляция',
    color: COLORS.red,
    scale: '0-20',
    options: frequency5,
    questions: [
      'Трудно задержать эякуляцию',
      'Эякуляция происходит раньше желаемого',
      'Эякуляция бывает при минимальной стимуляции',
      'Ситуация беспокоит пациента',
      'Партнёр недоволен продолжительностью акта',
    ],
    interpret: (total) => scoreSeverity(total, [
      { max: 8, label: 'ПЭ не подтверждается по опроснику', tone: 'good' },
      { max: 10, label: 'ПЭ возможна', tone: 'mid' },
      { max: 20, label: 'ПЭ вероятна', tone: 'high' },
    ]),
  },
  {
    id: 'nih-cpsi',
    category: 'Боль',
    title: 'NIH-CPSI',
    subtitle: 'Хронический простатит / CPPS',
    color: COLORS.violet,
    scale: '0-43',
    options: ipssOptions,
    questions: [
      'Боль в промежности',
      'Боль в яичках',
      'Боль над лоном',
      'Боль при мочеиспускании',
      'Боль при эякуляции',
      'Частота боли за последнюю неделю',
      'Средняя интенсивность боли',
      'Неполное опорожнение',
      'Частые мочеиспускания',
      'Влияние симптомов на качество жизни',
    ],
    interpret: (total) => scoreSeverity(total, [
      { max: 14, label: 'Лёгкая симптоматика', tone: 'low' },
      { max: 29, label: 'Умеренная симптоматика', tone: 'mid' },
      { max: 43, label: 'Тяжёлая симптоматика', tone: 'high' },
    ]),
  },
  {
    id: 'oab-v8',
    category: 'LUTS',
    title: 'OAB-V8',
    subtitle: 'Гиперактивный мочевой пузырь',
    color: COLORS.teal,
    scale: '0-40',
    options: impact5.concat({ value: 5, label: 'Максимально' }),
    questions: [
      'Частое мочеиспускание днём',
      'Ургентность',
      'Внезапный позыв с риском не удержать мочу',
      'Ночное мочеиспускание',
      'Потеря мочи при сильном позыве',
      'Ограничение активности',
      'Снижение уверенности вне дома',
      'Нарушение сна',
    ],
    interpret: (total) => scoreSeverity(total, [
      { max: 7, label: 'Низкая вероятность клинически значимого ГАМП', tone: 'good' },
      { max: 16, label: 'Симптомы требуют уточнения', tone: 'mid' },
      { max: 40, label: 'Высокая выраженность симптомов ГАМП', tone: 'high' },
    ]),
  },
  {
    id: 'iciq-ui',
    category: 'Недержание',
    title: 'ICIQ-UI SF',
    subtitle: 'Недержание мочи',
    color: COLORS.blue,
    scale: '0-21',
    options: [
      { value: 0, label: '0' },
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4' },
      { value: 5, label: '5' },
      { value: 6, label: '6' },
    ],
    questions: [
      'Частота эпизодов потери мочи',
      'Объём потери мочи',
      'Влияние недержания на повседневную жизнь',
    ],
    interpret: (total) => scoreSeverity(total, [
      { max: 5, label: 'Лёгкое влияние', tone: 'low' },
      { max: 12, label: 'Умеренное влияние', tone: 'mid' },
      { max: 21, label: 'Выраженное влияние', tone: 'high' },
    ]),
  },
  {
    id: 'adam',
    category: 'Андрология',
    title: 'ADAM',
    subtitle: 'Скрининг андрогенного дефицита',
    color: COLORS.gold,
    scale: '0-10',
    options: yesNo,
    questions: [
      'Снижение либидо',
      'Недостаток энергии',
      'Снижение силы или выносливости',
      'Уменьшение роста',
      'Снижение удовольствия от жизни',
      'Печаль или раздражительность',
      'Слабее эрекции',
      'Снижение спортивной активности',
      'Сонливость после еды',
      'Снижение работоспособности',
    ],
    interpret: (total, answers) => {
      const sexualSignal = answers[1] === 1 || answers[7] === 1;
      if (sexualSignal || total >= 3) return { label: 'Скрининг положительный, нужны утренний тестостерон и контекст', tone: 'mid' };
      return { label: 'Скрининг отрицательный', tone: 'good' };
    },
  },
  {
    id: 'ams',
    category: 'Андрология',
    title: 'AMS-screen',
    subtitle: 'Возрастные мужские симптомы',
    color: COLORS.gold,
    scale: '8-40',
    options: [
      { value: 1, label: 'Нет' },
      { value: 2, label: 'Слабо' },
      { value: 3, label: 'Умеренно' },
      { value: 4, label: 'Сильно' },
      { value: 5, label: 'Очень сильно' },
    ],
    questions: [
      'Снижение общего самочувствия',
      'Боли в суставах или мышцах',
      'Потливость или приливы',
      'Нарушение сна',
      'Раздражительность',
      'Тревожность',
      'Снижение либидо',
      'Снижение эрекций',
    ],
    interpret: (total) => scoreSeverity(total, [
      { max: 16, label: 'Низкая выраженность', tone: 'good' },
      { max: 26, label: 'Умеренная выраженность', tone: 'mid' },
      { max: 40, label: 'Высокая выраженность', tone: 'high' },
    ]),
  },
  {
    id: 'mshq-ejd',
    category: 'Андрология',
    title: 'MSHQ-EjD short',
    subtitle: 'Эякуляторная функция',
    color: COLORS.green,
    scale: '0-20',
    options: frequency5,
    questions: [
      'Снижение объёма эякулята',
      'Снижение силы выброса',
      'Болезненность эякуляции',
      'Снижение удовлетворённости эякуляцией',
      'Беспокойство из-за эякуляторной функции',
    ],
    interpret: (total) => scoreSeverity(total, [
      { max: 5, label: 'Минимальные жалобы', tone: 'good' },
      { max: 12, label: 'Умеренные жалобы', tone: 'mid' },
      { max: 20, label: 'Выраженные жалобы', tone: 'high' },
    ]),
  },
  {
    id: 'udi6',
    category: 'Недержание',
    title: 'UDI-6',
    subtitle: 'Дистресс от мочевых симптомов',
    color: COLORS.teal,
    scale: '0-18',
    options: [
      { value: 0, label: 'Нет' },
      { value: 1, label: 'Слабо' },
      { value: 2, label: 'Умеренно' },
      { value: 3, label: 'Сильно' },
    ],
    questions: [
      'Частое мочеиспускание',
      'Подтекание при ургентности',
      'Подтекание при кашле/чихании/нагрузке',
      'Малые порции мочи',
      'Трудность опорожнения',
      'Боль или дискомфорт внизу живота/гениталиях',
    ],
    interpret: (total) => scoreSeverity(total, [
      { max: 5, label: 'Лёгкий дистресс', tone: 'low' },
      { max: 11, label: 'Умеренный дистресс', tone: 'mid' },
      { max: 18, label: 'Выраженный дистресс', tone: 'high' },
    ]),
  },
  {
    id: 'stone',
    category: 'Камни',
    title: 'STONE score',
    subtitle: 'Вероятность мочекаменной болезни при боли в боку',
    color: COLORS.blue,
    scale: '0-13',
    questions: [
      { text: 'Пол', options: [{ value: 0, label: 'Женщина' }, { value: 2, label: 'Мужчина' }] },
      { text: 'Длительность боли', options: [{ value: 0, label: '>24 ч' }, { value: 1, label: '6-24 ч' }, { value: 3, label: '<6 ч' }] },
      { text: 'Тошнота/рвота', options: [{ value: 0, label: 'Нет' }, { value: 1, label: 'Тошнота' }, { value: 2, label: 'Рвота' }] },
      { text: 'Гематурия', options: [{ value: 0, label: 'Нет' }, { value: 3, label: 'Есть' }] },
      { text: 'Раса/анамнестический риск', options: [{ value: 0, label: 'Низкий' }, { value: 3, label: 'Высокий' }] },
    ],
    interpret: (total) => scoreSeverity(total, [
      { max: 5, label: 'Низкая вероятность камня', tone: 'low' },
      { max: 9, label: 'Средняя вероятность', tone: 'mid' },
      { max: 13, label: 'Высокая вероятность', tone: 'high' },
    ]),
  },
  {
    id: 'capra',
    category: 'Онко',
    title: 'CAPRA',
    subtitle: 'Риск рецидива рака простаты',
    color: COLORS.red,
    scale: '0-10',
    questions: [
      { text: 'PSA', options: [{ value: 0, label: '<6' }, { value: 1, label: '6-10' }, { value: 2, label: '10-20' }, { value: 3, label: '>20' }] },
      { text: 'Gleason/ISUP', options: [{ value: 0, label: '<=6' }, { value: 1, label: '3+4' }, { value: 2, label: '4+3' }, { value: 3, label: '8-10' }] },
      { text: 'Клиническая стадия', options: [{ value: 0, label: 'T1/T2a' }, { value: 1, label: 'T2b' }, { value: 2, label: 'T2c/T3a' }] },
      { text: 'Позитивные биоптаты', options: [{ value: 0, label: '<34%' }, { value: 1, label: '34-50%' }, { value: 2, label: '>50%' }] },
      { text: 'Возраст', options: [{ value: 0, label: '<50' }, { value: 1, label: '>=50' }] },
    ],
    interpret: (total) => scoreSeverity(total, [
      { max: 2, label: 'Низкий риск', tone: 'good' },
      { max: 5, label: 'Промежуточный риск', tone: 'mid' },
      { max: 10, label: 'Высокий риск', tone: 'high' },
    ]),
  },
  {
    id: 'renal',
    category: 'Онко',
    title: 'R.E.N.A.L.',
    subtitle: 'Нефрометрия опухоли почки',
    color: COLORS.teal,
    scale: '4-12',
    questions: [
      { text: 'Размер опухоли', options: [{ value: 1, label: '<=4 см' }, { value: 2, label: '4-7 см' }, { value: 3, label: '>7 см' }] },
      { text: 'Экзофитность', options: [{ value: 1, label: '>=50%' }, { value: 2, label: '<50%' }, { value: 3, label: 'Эндофитная' }] },
      { text: 'Близость к синусу/системе', options: [{ value: 1, label: '>7 мм' }, { value: 2, label: '4-7 мм' }, { value: 3, label: '<=4 мм' }] },
      { text: 'Расположение относительно полюсных линий', options: [{ value: 1, label: 'Вне линий' }, { value: 2, label: 'Пересекает' }, { value: 3, label: '>50% между' }] },
    ],
    interpret: (total) => scoreSeverity(total, [
      { max: 6, label: 'Низкая сложность', tone: 'good' },
      { max: 9, label: 'Средняя сложность', tone: 'mid' },
      { max: 12, label: 'Высокая сложность', tone: 'high' },
    ]),
  },
  {
    id: 'qsofa',
    category: 'Неотложно',
    title: 'qSOFA',
    subtitle: 'Скрининг риска сепсиса',
    color: COLORS.red,
    scale: '0-3',
    questions: [
      { text: 'ЧДД >= 22/мин', options: yesNo },
      { text: 'САД <= 100 мм рт. ст.', options: yesNo },
      { text: 'Изменение сознания', options: yesNo },
    ],
    interpret: (total) => total >= 2
      ? { label: 'Высокий риск неблагоприятного исхода, нужна срочная оценка', tone: 'high' }
      : { label: 'qSOFA < 2, оценивать клинику и полные критерии сепсиса', tone: 'low' },
  },
];

function ToolTable({ tool }) {
  const storageKey = `uromed-tool-result:${tool.id}`;
  const [answers, setAnswers] = useState(() => {
    if (typeof window === 'undefined') return {};
    try {
      return JSON.parse(window.localStorage.getItem(storageKey) || '{}');
    } catch {
      return {};
    }
  });
  const rows = tool.questions.map((question, index) => (
    typeof question === 'string'
      ? { id: index + 1, text: question, options: tool.options }
      : { id: index + 1, options: tool.options, ...question }
  ));
  const answeredCount = Object.keys(answers).length;
  const total = Object.values(answers).reduce((sum, value) => sum + value, 0);
  const result = answeredCount === rows.length ? tool.interpret(total, answers) : null;
  const progress = Math.round((answeredCount / rows.length) * 100);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(answers));
    } catch {
      // Local persistence is only a convenience; questionnaires remain fully usable without it.
    }
  }, [answers, storageKey]);

  return (
    <article className="tool-section premium-tool-card" style={{ '--tool-color': tool.color }}>
      <div className="premium-tool-head">
        <div>
          <span className="premium-tool-kicker">{tool.category}</span>
          <h3 className="tool-title">{tool.title}</h3>
          <p>{tool.subtitle}</p>
        </div>
        <div className="premium-tool-score">
          <strong>{result ? total : `${answeredCount}/${rows.length}`}</strong>
          <span>{result ? tool.scale : 'заполнено'}</span>
        </div>
      </div>

      <div className="premium-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="premium-tool-table" role="table" aria-label={tool.title}>
        <div className="premium-tool-row premium-tool-row-head" role="row">
          <span>Пункт</span>
          <span>Оценка</span>
        </div>
        {rows.map((row) => (
          <div className="premium-tool-row" role="row" key={row.id}>
            <div className="premium-tool-question">
              <span>{String(row.id).padStart(2, '0')}</span>
              <p>{row.text}</p>
            </div>
            <div className="premium-tool-options">
              {row.options.map((option) => (
                <button
                  key={`${row.id}-${option.value}-${option.label}`}
                  type="button"
                  className={`premium-score-btn ${answers[row.id] === option.value ? 'selected' : ''}`}
                  onClick={() => setAnswers((prev) => ({ ...prev, [row.id]: option.value }))}
                >
                  <strong>{option.value}</strong>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={`premium-result ${result ? `is-${result.tone}` : ''}`}>
        <div>
          <span>Итог</span>
          <strong>{result ? result.label : 'Заполните все пункты для расчёта'}</strong>
          {answeredCount > 0 && <small className="premium-local-save">Сохранено локально на устройстве</small>}
        </div>
        {answeredCount > 0 && (
          <button type="button" className="reset-btn" onClick={() => setAnswers({})}>
            Сбросить
          </button>
        )}
      </div>
    </article>
  );
}

function PSAForm() {
  const [form, setForm] = useState({ age: '', psa: '', freePsa: '', volume: '' });
  const [result, setResult] = useState(null);

  const calculate = () => {
    const age = Number(form.age);
    const psa = Number(form.psa);
    const freePsa = Number(form.freePsa || 0);
    const volume = Number(form.volume || 0);
    if (!age || !psa) return;

    const norm = age < 50 ? 2.5 : age < 60 ? 3.5 : age < 70 ? 4.5 : 6.5;
    const freeRatio = freePsa ? (freePsa / psa) * 100 : null;
    const density = volume ? psa / volume : null;
    const elevated = psa > norm || (density !== null && density > 0.15) || (freeRatio !== null && freeRatio < 10);
    setResult({ norm, psa, freeRatio, density, elevated });
  };

  return (
    <article className="tool-section premium-tool-card premium-form-card" style={{ '--tool-color': COLORS.gold }}>
      <div className="premium-tool-head">
        <div>
          <span className="premium-tool-kicker">Онко</span>
          <h3 className="tool-title">PSA risk</h3>
          <p>Возрастная норма, свободный PSA и плотность PSA.</p>
        </div>
      </div>
      <div className="premium-form-grid">
        <label>Возраст<input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="55" /></label>
        <label>PSA общий<input type="number" step="0.1" value={form.psa} onChange={(e) => setForm({ ...form, psa: e.target.value })} placeholder="3.2" /></label>
        <label>PSA свободный<input type="number" step="0.1" value={form.freePsa} onChange={(e) => setForm({ ...form, freePsa: e.target.value })} placeholder="0.6" /></label>
        <label>Объём простаты<input type="number" step="0.1" value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })} placeholder="35" /></label>
      </div>
      <button className="calc-button premium-calc-btn" onClick={calculate}>Рассчитать</button>
      {result && (
        <div className={`premium-result ${result.elevated ? 'is-high' : 'is-good'}`}>
          <div>
            <span>Итог</span>
            <strong>{result.elevated ? 'Есть факторы настороженности' : 'Базово без выраженной настороженности'}</strong>
            <p>Норма: &lt; {result.norm} нг/мл. {result.freeRatio !== null ? `Св./общ.: ${result.freeRatio.toFixed(1)}%. ` : ''}{result.density !== null ? `Плотность: ${result.density.toFixed(2)}.` : ''}</p>
          </div>
        </div>
      )}
    </article>
  );
}

function VoidingDiary() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ volume: '', urgency: '1', incontinence: '0' });

  const addEntry = () => {
    const volume = Number(form.volume);
    if (!volume) return;
    setEntries((prev) => [...prev, { id: Date.now(), volume, urgency: Number(form.urgency), incontinence: Number(form.incontinence) }]);
    setForm({ volume: '', urgency: '1', incontinence: '0' });
  };

  const totalVolume = entries.reduce((sum, entry) => sum + entry.volume, 0);
  const averageVolume = entries.length ? Math.round(totalVolume / entries.length) : 0;

  return (
    <article className="tool-section premium-tool-card premium-form-card" style={{ '--tool-color': COLORS.blue }}>
      <div className="premium-tool-head">
        <div>
          <span className="premium-tool-kicker">LUTS</span>
          <h3 className="tool-title">Дневник мочеиспусканий</h3>
          <p>Быстрая фиксация объёма, ургентности и подтекания.</p>
        </div>
        <div className="premium-tool-score">
          <strong>{entries.length}</strong>
          <span>эпизодов</span>
        </div>
      </div>
      <div className="premium-form-grid">
        <label>Объём, мл<input type="number" value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })} placeholder="250" /></label>
        <label>Ургентность<select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })}><option value="1">1 - нет</option><option value="2">2 - лёгкая</option><option value="3">3 - умеренная</option><option value="4">4 - сильная</option></select></label>
        <label>Подтекание<select value={form.incontinence} onChange={(e) => setForm({ ...form, incontinence: e.target.value })}><option value="0">Нет</option><option value="1">Да</option></select></label>
      </div>
      <button className="calc-button premium-calc-btn" onClick={addEntry}>Добавить запись</button>
      {entries.length > 0 && (
        <div className="premium-result is-low">
          <div>
            <span>Сводка</span>
            <strong>{totalVolume} мл суммарно, {averageVolume} мл в среднем</strong>
            <p>Эпизоды недержания: {entries.filter((entry) => entry.incontinence).length}. Максимальная ургентность: {Math.max(...entries.map((entry) => entry.urgency))}.</p>
          </div>
          <button type="button" className="reset-btn" onClick={() => setEntries([])}>Очистить</button>
        </div>
      )}
    </article>
  );
}

const glossaryTerms = [
  { term: 'IPSS', def: 'International Prostate Symptom Score - шкала оценки симптомов мочеиспускания.' },
  { term: 'IIEF-5', def: 'Краткий индекс эректильной функции для скрининговой оценки ЭД.' },
  { term: 'PEDT', def: 'Опросник для оценки вероятности преждевременной эякуляции.' },
  { term: 'СНМП', def: 'Симптомы нижних мочевых путей: накопления, опорожнения и постмикционные симптомы.' },
  { term: 'ДГПЖ', def: 'Доброкачественная гиперплазия предстательной железы.' },
  { term: 'ГАМП', def: 'Гиперактивный мочевой пузырь с ургентностью и/или ургентным недержанием.' },
  { term: 'MET', def: 'Medical expulsive therapy - медикаментозная поддержка отхождения камня.' },
  { term: 'PSA', def: 'Простат-специфический антиген, требующий клинической интерпретации.' },
];

function DrugReference() {
  const [search, setSearch] = useState('');
  const [activeRisk, setActiveRisk] = useState('all');

  const grouped = useMemo(() => {
    const map = premiumDrugList.reduce((acc, item) => {
      if (!acc[item.group]) acc[item.group] = [];
      acc[item.group].push(item);
      return acc;
    }, {});
    return Object.fromEntries(Object.entries(map).sort((a, b) => a[0].localeCompare(b[0], 'ru')));
  }, []);

  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    const riskQuery = drugRiskFilters.find((filter) => filter.id === activeRisk)?.query.toLowerCase() || '';
    const riskTokens = riskQuery.split(/\s+/).filter(Boolean);
    return Object.entries(grouped).reduce((acc, [group, items]) => {
      const nextItems = items.filter((item) => {
        const haystack = getDrugSearchHaystack(item);
        const matchesText = !q || haystack.includes(q);
        const matchesRisk = activeRisk === 'all' || riskTokens.some((token) => haystack.includes(token));
        return matchesText && matchesRisk;
      });
      if (nextItems.length) acc[group] = nextItems;
      return acc;
    }, {});
  }, [activeRisk, grouped, search]);

  const totalResults = Object.values(filteredGroups).reduce((sum, items) => sum + items.length, 0);

  return (
    <section className="section drug-reference service-page-shell" data-v20-drug-cockpit="true" data-v21-drug-cockpit="true">
      <div className="drug-reference-hero service-card-shell">
        <span className="service-eyebrow">UroMed PharmacoMap</span>
        <h2 className="section-title">Справочник препаратов</h2>
        <p className="section-subtitle">
          Расширенный клинический каталог по урологии и андрологии: поиск по названию, группе, показаниям,
          положительной фармакодинамике, рискам, противопоказаниям и мониторингу.
        </p>
        <div className="drug-reference-stats">
          <span><strong>{premiumDrugList.length}</strong> препаратов и классов</span>
          <span><strong>{Object.keys(grouped).length}</strong> клинических групп</span>
          <span><strong>500+</strong> Drug Intelligence v15</span>
          <span>Обновлено: {drugReferenceMeta.lastReviewed}</span>
        </div>
      </div>

      <div className="drug-cockpit-flow service-card-shell" data-v19-drug-cockpit="true" data-v20-drug-flow="true" aria-label="Drug cockpit workflow">
        {drugCockpitSteps.map((step, index) => (
          <div key={step.id} className="drug-cockpit-step">
            <span className="drug-cockpit-index">{String(index + 1).padStart(2, '0')}</span>
            <strong>{step.title}</strong>
            <p>{step.text}</p>
          </div>
        ))}
      </div>

      <div className="drug-search drug-command-cockpit">
        <div className="drug-command-head">
          <div>
            <span className="drug-command-kicker">Drug Command</span>
            <div className="drug-command-title">Клиническая задача → препарат</div>
          </div>
          <div className="drug-command-meta">Риск, дозирование, фертильность, ХБП, взаимодействия и мониторинг в одном клиническом cockpit.</div>
        </div>
        <label className="drug-search-label" htmlFor="drug-search-input">Поиск по МНН, торговому названию, эффекту или риску</label>
        <input
          id="drug-search-input"
          type="text"
          placeholder="Например: эрекция, QT, ESBL, задержка мочи, нефротоксичность..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="drug-search-input"
        />
        <div className="drug-search-hints" aria-label="Быстрые поисковые подсказки">
          {drugSearchHints.map((hint) => (
            <button key={hint} type="button" className="drug-hint-chip" onClick={() => setSearch(hint)}>
              {hint}
            </button>
          ))}
        </div>
      </div>

      <div className="drug-risk-filters" aria-label="Clinical drug risk filters">
        {drugRiskFilters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`drug-risk-chip ${activeRisk === filter.id ? 'active' : ''}`}
            data-risk-filter={filter.id}
            onClick={() => setActiveRisk(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="drug-count">Найдено: <strong>{totalResults}</strong> из {premiumDrugList.length} <span data-active-risk={activeRisk}>{drugRiskFilters.find((filter) => filter.id === activeRisk)?.label}</span></div>

      {Object.keys(filteredGroups).length > 0 ? Object.entries(filteredGroups).map(([group, items]) => (
        <div key={group} className="drug-group">
          <div className="drug-group-title">{group} <span className="drug-group-count">{items.length}</span></div>
          <div className="drug-list">
            {items.map((drug) => (
              <div
                key={drug.name}
                className="drug-card"
                data-clinical-task={getDrugClinicalTask(drug)}
                data-monitoring-priority={getDrugMonitoringPriority(drug)}
              >
                <div className="drug-card-topline">
                  <div>
                    <h3 className="drug-card-name">{drug.name}</h3>
                    <div className="drug-card-group">{drug.className || drug.group}</div>
                  </div>
                  <span className="drug-class-badge">{drug.group}</span>
                </div>
                {drug.tags?.length > 0 && (
                  <div className="drug-tag-row">
                    {drug.tags.slice(0, 5).map((tag) => <span key={tag} className="drug-tag">{tag}</span>)}
                  </div>
                )}
                <div className="drug-card-details">
                  <div className="drug-detail"><span className="drug-detail-label">Режим / ориентир</span><div className="drug-detail-value">{drug.dose}</div></div>
                  <div className="drug-detail"><span className="drug-detail-label">Показания</span><div className="drug-detail-value">{drug.indications}</div></div>
                  <div className="drug-detail positive"><span className="drug-detail-label">Положительная фармакодинамика</span><div className="drug-detail-value">{drug.positivePharmacodynamics}</div></div>
                  <div className="drug-detail negative"><span className="drug-detail-label">Риски / отрицательная фармакодинамика</span><div className="drug-detail-value">{drug.negativePharmacodynamics}</div></div>
                  <div className="drug-detail"><span className="drug-detail-label">Мониторинг</span><div className="drug-detail-value">{drug.monitoring}</div></div>
                  <div className="drug-detail"><span className="drug-detail-label">ХБП / renal-dose</span><div className="drug-detail-value">{drug.ckdAdjustment}</div></div>
                  <div className="drug-detail"><span className="drug-detail-label">Фертильность</span><div className="drug-detail-value">{drug.fertilityImpact}</div></div>
                  <div className="drug-detail"><span className="drug-detail-label">Взаимодействия</span><div className="drug-detail-value">{drug.interactions}</div></div>
                  <div className="drug-detail"><span className="drug-detail-label">Ограничения</span><div className="drug-detail-value">{drug.contraindications}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )) : <p className="service-empty-state">Ничего не найдено. Попробуйте искать по эффекту: «эрекция», «QT», «камни», «задержка мочи», «ESBL».</p>}
    </section>
  );
}

function Glossary() {
  const [search, setSearch] = useState('');
  const filtered = glossaryTerms.filter((item) => [item.term, item.def].join(' ').toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <section className="section glossary-page service-page-shell">
      <h2 className="section-title">Глоссарий</h2>
      <p className="section-subtitle">Быстрые определения ключевых терминов и аббревиатур.</p>
      <div className="drug-search">
        <input type="text" placeholder="Поиск термина..." value={search} onChange={(e) => setSearch(e.target.value)} className="drug-search-input" />
      </div>
      <div className="glossary-grid">
        {filtered.map((item) => (
          <div key={item.term} className="glossary-item">
            <h3 className="glossary-term">{item.term}</h3>
            <p className="glossary-def">{item.def}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ToolsSectionExport({ showDrugs, showGlossary, onNavigate }) {
  if (showDrugs) return <DrugReference />;
  if (showGlossary) return <Glossary />;

  const openSpermogramTree = () => {
    onNavigate?.('calculators', null, null, {
      source: 'tools_spermogram_entry',
      tool: 'sperm-tree',
    });
  };

  return (
    <section className="section tools-section service-page-shell premium-tools-shell" data-v20-tool-flow="true" data-v21-tool-flow="true">
      <div className="premium-tools-hero">
        <span className="service-eyebrow">Clinical questionnaires</span>
        <p>Премиум-таблицы для быстрого заполнения, мгновенного подсчёта и понятного результата по урологии и андрологии.</p>
        <div>
          <span><strong>{toolDefinitions.length + 2}</strong> инструментов</span>
          <span>LUTS</span>
          <span>Андрология</span>
          <span>Онко</span>
          <span>Камни</span>
        </div>
      </div>

      <button
        type="button"
        className="spermogram-entry-card service-card-shell"
        onClick={openSpermogramTree}
        data-tool-entry="sperm-tree"
      >
        <span className="spermogram-entry-kicker">Fertility decision tree</span>
        <strong>Спермограмма</strong>
        <span>WHO-пороги, OAT / азооспермия / DFI / MAR, ART-маршрут и follow-up в одном клиническом дереве.</span>
      </button>

      <div className="premium-tools-grid">
        {toolDefinitions.map((tool) => <ToolTable key={tool.id} tool={tool} />)}
        <PSAForm />
        <VoidingDiary />
      </div>
    </section>
  );
}

export default React.memo(ToolsSectionExport);

const SOURCE_PACK = {
  WHO: {
    label: 'WHO 2021',
    note: '6-е издание лабораторного руководства ВОЗ: стандартизация анализа эякулята и контроль качества.',
  },
  EAU: {
    label: 'EAU 2026',
    note: 'Sexual and Reproductive Health Guidelines: мужское бесплодие, гипогонадизм и андрологическая маршрутизация.',
  },
  AUA_ASRM: {
    label: 'AUA/ASRM 2024',
    note: 'Male Infertility Guideline, amended 2024: обследование пары, азооспермия, генетика и ART.',
  },
  ESHRE: {
    label: 'ESHRE 2023',
    note: 'Good practice по повторным неудачам имплантации: осторожная оценка male-factor add-ons.',
  },
  RU: {
    label: 'RU',
    note: 'Актуальная локальная сверка через рубрикатор клинических рекомендаций Минздрава РФ.',
  },
};

const SOURCE_ALL = ['WHO', 'EAU', 'AUA_ASRM', 'ESHRE', 'RU'];
const SOURCE_BASE = ['WHO', 'EAU', 'AUA_ASRM', 'RU'];
const SOURCE_ART = ['EAU', 'AUA_ASRM', 'ESHRE', 'RU'];

const toNumber = (value) => {
  if (value === '' || value === null || value === undefined) return 0;
  const parsed = Number.parseFloat(String(value).replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
};

const hasValue = (form, field) => form?.[field] !== '' && form?.[field] !== undefined && form?.[field] !== null;

const makeNode = ({
  id,
  parentId = null,
  level,
  title,
  status = 'neutral',
  condition,
  clinicalMeaning,
  diagnostics = [],
  treatment = [],
  nextStep,
  avoid,
  sources = SOURCE_BASE,
}) => ({
  id,
  parentId,
  level,
  title,
  status,
  condition,
  clinicalMeaning,
  diagnostics,
  treatment,
  nextStep,
  avoid,
  sources,
});

const sourceLabels = (sources) => sources.map((key) => SOURCE_PACK[key]?.label || key);

export function buildSpermogramAssessment(form = {}) {
  const concentration = toNumber(form.concentration);
  const motility = toNumber(form.motility);
  const morphology = toNumber(form.morphology);
  const volume = toNumber(form.volume);
  const leukocytes = toNumber(form.leukocytes);
  const fsh = toNumber(form.fsh);
  const testosterone = toNumber(form.testosterone);
  const testicularVolume = toNumber(form.testicularVolume);
  const ph = toNumber(form.ph);
  const dfi = toNumber(form.dfi);
  const mar = toNumber(form.mar);
  const tmc = toNumber(form.tmc);
  const partnerAge = toNumber(form.partnerAge);
  const artFailures = toNumber(form.artFailures);

  const abnormalities = [];
  const azo = hasValue(form, 'concentration') && concentration === 0;
  if (azo) abnormalities.push('azo');
  else if (concentration > 0 && concentration < 16) abnormalities.push('oligo');
  if (motility > 0 && motility < 42) abnormalities.push('astheno');
  if (morphology > 0 && morphology < 4) abnormalities.push('terato');
  if (leukocytes > 1) abnormalities.push('leuko');
  if (volume > 0 && volume < 1.4) abnormalities.push('lowVolume');
  if (dfi > 25) abnormalities.push('highDfi');
  if (mar >= 50) abnormalities.push('immuneFactor');
  if (form.varicocele === 'yes') abnormalities.push('varicocele');
  if ((testosterone > 0 && testosterone < 10) || (fsh > 0 && fsh <= 3)) abnormalities.push('endocrine');
  if (partnerAge >= 35 || artFailures >= 2) abnormalities.push('coupleArt');

  const primaryPattern = azo
    ? 'azo'
    : abnormalities.filter((item) => ['oligo', 'astheno', 'terato'].includes(item)).length >= 2
      ? 'combined'
      : abnormalities.find((item) => ['oligo', 'astheno', 'terato', 'lowVolume', 'leuko', 'highDfi', 'immuneFactor'].includes(item)) || 'normal';

  const severity = primaryPattern === 'azo' || (concentration > 0 && concentration < 5)
    ? 'severe'
    : concentration >= 5 && concentration < 10
      ? 'moderate'
      : primaryPattern === 'combined' || abnormalities.length >= 3
        ? 'moderate'
        : 'mild';

  const azoSubtype = primaryPattern !== 'azo'
    ? null
    : (testosterone > 0 && testosterone < 10 && fsh > 0 && fsh <= 3)
      ? 'HH possible'
      : (volume > 0 && volume < 1.4 && ph > 0 && ph < 7.2 && form.fructose === 'low')
        ? 'OA / EDO likely'
        : (fsh >= 7.6 || (testicularVolume > 0 && testicularVolume < 12))
          ? 'NOA likely'
          : 'Undifferentiated azoospermia';

  const nodes = [
    makeNode({
      id: 'pre-analytics',
      level: 1,
      title: 'Преаналитика и повторяемость',
      status: 'base',
      condition: 'Любая спермограмма начинается с качества образца.',
      clinicalMeaning: 'Один анализ не должен превращаться в диагноз без оценки сбора, воздержания, лихорадки, лекарств и повторяемости.',
      diagnostics: [
        'Подтвердить срок воздержания, полноту сбора и время доставки образца.',
        'При отклонениях повторить анализ через 2-12 недель с учетом клинической срочности.',
        'Сопоставить параметры с жалобами, анамнезом пары и физикальным осмотром.',
      ],
      treatment: ['Не начинать длительные эмпирические курсы до подтверждения клинического паттерна.'],
      nextStep: 'Перейти к WHO-порогам и определить ведущую ветку.',
      avoid: 'Не трактовать изолированное пограничное значение как окончательное бесплодие.',
      sources: ['WHO', 'AUA_ASRM', 'RU'],
    }),
    makeNode({
      id: 'who-thresholds',
      parentId: 'pre-analytics',
      level: 2,
      title: 'WHO-пороговые параметры',
      status: abnormalities.length ? 'attention' : 'good',
      condition: 'Объем >= 1,4 мл, концентрация >= 16 млн/мл, общая подвижность >= 42%, морфология >= 4%.',
      clinicalMeaning: abnormalities.length
        ? 'Есть отклонения, но их сила выше при сочетании нескольких параметров.'
        : 'Введенные значения выглядят как нормозооспермия по базовым WHO-порогам.',
      diagnostics: [
        'Оценить концентрацию, подвижность, морфологию, объем, pH и round cells/лейкоциты.',
        'При множественных отклонениях расширить мужской фактор, а не лечить один показатель.',
      ],
      treatment: ['Коррекция направляется ведущим паттерном, репродуктивным окном пары и обратимыми факторами.'],
      nextStep: abnormalities.length ? 'Открыть активные ветки дерева ниже.' : 'Если беременность не наступает, обследовать пару параллельно.',
      avoid: 'Не обещать фертильность только по нормальным цифрам спермограммы.',
      sources: SOURCE_BASE,
    }),
  ];

  if (primaryPattern === 'normal') {
    nodes.push(makeNode({
      id: 'normal-borderline',
      parentId: 'who-thresholds',
      level: 3,
      title: 'Нормозооспермия или пограничный профиль',
      status: 'good',
      condition: 'Нет выраженного WHO-паттерна мужского фактора по введенным значениям.',
      clinicalMeaning: 'Нормальная спермограмма не исключает couple-factor, сексуальную дисфункцию, эндокринный фактор или женский фактор.',
      diagnostics: ['Параллельная оценка пары, овуляции, трубного фактора и времени бесплодия.', 'Повторить анализ при изменении клиники или после лихорадки/токсического воздействия.'],
      treatment: ['Оптимизация образа жизни, фертильного окна, коррекция сексуальной функции по показаниям.'],
      nextStep: 'Если возраст партнерши >=35 лет или бесплодие длительное, не затягивать fertility-консультацию.',
      avoid: 'Не закрывать диагностический поиск фразой “мужской фактор исключен”.',
      sources: SOURCE_ALL,
    }));
  }

  if (abnormalities.includes('oligo') || primaryPattern === 'combined') {
    nodes.push(makeNode({
      id: 'oligo-branch',
      parentId: 'who-thresholds',
      level: 3,
      title: concentration < 5 ? 'Тяжелая олигозооспермия' : 'Олигозооспермия',
      status: concentration < 5 ? 'critical' : 'attention',
      condition: `Концентрация: ${concentration || 'не указана'} млн/мл.`,
      clinicalMeaning: 'Чем ниже концентрация и чем больше сопутствующих отклонений, тем выше вероятность клинически значимого male factor.',
      diagnostics: [
        'Анамнез крипторхизма, операций, инфекций, токсинов, лекарств, анаболиков.',
        'Физикальный осмотр, объем яичек, варикоцеле, ФСГ, ЛГ, тестостерон, пролактин по показаниям.',
        concentration < 5 ? 'Кариотип; AZF-делеции особенно при признаках нарушенного сперматогенеза.' : 'Повторная спермограмма и гормональный профиль при стойком снижении.',
      ],
      treatment: ['Коррекция обратимых факторов; лечение клинического варикоцеле по показаниям; ART-стратегия с учетом TMC и пары.'],
      nextStep: concentration < 5 ? 'Ранний genetics + ART route.' : 'Оценить обратимые причины и динамику через один цикл сперматогенеза.',
      avoid: 'Не назначать тестостерон мужчине с репродуктивным запросом без отдельного fertility-плана.',
      sources: SOURCE_BASE,
    }));
  }

  if (abnormalities.includes('astheno') || primaryPattern === 'combined') {
    nodes.push(makeNode({
      id: 'astheno-branch',
      parentId: 'who-thresholds',
      level: 3,
      title: 'Астенозооспермия',
      status: 'attention',
      condition: `Подвижность: ${motility || 'не указана'}%.`,
      clinicalMeaning: 'Снижение подвижности часто связано с оксидативным стрессом, варикоцеле, воспалением, лихорадкой, токсинами или лабораторной преаналитикой.',
      diagnostics: ['Проверить жизнеспособность при полной неподвижности.', 'Искать варикоцеле, инфекцию/воспаление, heat exposure, курение, ожирение.', 'При тяжелой форме и респираторном анамнезе думать о нарушениях жгутика/цилиарной функции.'],
      treatment: ['Лечение причины; снижение тепловой нагрузки; обсуждение ART при тяжелом или смешанном профиле.'],
      nextStep: 'Сопоставить с концентрацией, морфологией и TMC.',
      avoid: 'Не объяснять всю проблему одним “плохим движением” без оценки остальных параметров.',
      sources: SOURCE_BASE,
    }));
  }

  if (abnormalities.includes('terato') || primaryPattern === 'combined') {
    nodes.push(makeNode({
      id: 'terato-branch',
      parentId: 'who-thresholds',
      level: 3,
      title: 'Тератозооспермия',
      status: 'attention',
      condition: `Нормальные формы: ${morphology || 'не указано'}%.`,
      clinicalMeaning: 'Изолированная морфология слабее предсказывает исход, но в сочетании с другими отклонениями усиливает male-factor.',
      diagnostics: ['Повторить морфологию в лаборатории с контролем качества.', 'Исключить варикоцеле, токсические факторы, лихорадку и выраженный oxidative stress.', 'При типичных моногенных фенотипах направить к репродуктологу/генетику.'],
      treatment: ['Коррекция обратимых причин; при тяжелом смешанном факторе чаще обсуждается ICSI.'],
      nextStep: 'Оценить, изолированная ли морфология или часть OAT-профиля.',
      avoid: 'Не делать вывод о невозможности естественного зачатия только по одному показателю морфологии.',
      sources: SOURCE_BASE,
    }));
  }

  if (primaryPattern === 'combined') {
    nodes.push(makeNode({
      id: 'combined-oat',
      parentId: 'who-thresholds',
      level: 4,
      title: 'Смешанный OAT-профиль',
      status: 'critical',
      condition: 'Одновременно снижены количество, подвижность и/или морфология.',
      clinicalMeaning: 'Множественные отклонения имеют большую клиническую значимость, чем один изолированный параметр.',
      diagnostics: ['Полный мужской фактор: осмотр, гормоны, УЗИ мошонки по показаниям, genetics при тяжелой олигозооспермии.', 'Оценить окно пары: возраст партнерши, длительность бесплодия, прежние ART-циклы.'],
      treatment: ['Коррекция обратимых факторов параллельно с обсуждением ART, если TMC низкий или время ограничено.'],
      nextStep: 'Собрать план на 8-12 недель и одновременно определить ART-порог.',
      avoid: 'Не тратить месяцы на последовательные эмпирические добавки при тяжелом смешанном профиле.',
      sources: SOURCE_ALL,
    }));
  }

  if (primaryPattern === 'azo') {
    nodes.push(makeNode({
      id: 'azo-triage',
      parentId: 'who-thresholds',
      level: 3,
      title: 'Азооспермия: OA / NOA / HH',
      status: 'critical',
      condition: `Предварительная ветка: ${azoSubtype}.`,
      clinicalMeaning: 'Азооспермия требует подтверждения pellet-анализом и быстрого разделения обструкции, нарушения сперматогенеза и гипогонадотропного сценария.',
      diagnostics: [
        'Повторить спермограмму с центрифугированием осадка и поиском редких сперматозоидов.',
        'Физикальный осмотр, семявыносящие протоки, объем яичек, ФСГ, тестостерон, объем эякулята, pH.',
        'При NOA-профиле: кариотип и AZF; при подозрении на обструкцию/CBAVD: CFTR и оценка партнерши.',
      ],
      treatment: ['OA: реконструкция или sperm retrieval + ICSI; NOA: микро-TESE + ICSI по показаниям; HH: этиотропная гормональная индукция сперматогенеза.'],
      nextStep: 'Развернуть подветку по гормонам, объему эякулята, pH и физикальному осмотру.',
      avoid: 'Не назначать “курсы для улучшения спермы” до подтверждения типа азооспермии.',
      sources: ['WHO', 'AUA_ASRM', 'EAU', 'RU'],
    }));
  }

  if (abnormalities.includes('lowVolume')) {
    nodes.push(makeNode({
      id: 'low-volume',
      parentId: primaryPattern === 'azo' ? 'azo-triage' : 'who-thresholds',
      level: primaryPattern === 'azo' ? 4 : 3,
      title: 'Низкий объем эякулята',
      status: 'attention',
      condition: `Объем: ${volume || 'не указан'} мл; pH: ${ph || 'не указан'}; фруктоза: ${form.fructose || 'не указана'}.`,
      clinicalMeaning: 'Низкий объем может отражать неполный сбор, ретроградную эякуляцию, гипоандрогению или дистальную обструкцию.',
      diagnostics: ['Уточнить полноту сбора и воздержание.', 'Постэякуляторная моча при подозрении на ретроградную эякуляцию.', 'TRUS/УЗИ при кислой реакции, низкой фруктозе или подозрении на EDO.'],
      treatment: ['Лечить причину: ретроградный маршрут, EDO, эндокринный фактор или техника сбора.'],
      nextStep: ph > 0 && ph < 7.2 && form.fructose === 'low' ? 'Сильнее думать об EDO/семенных пузырьках.' : 'Сначала подтвердить преаналитику и ретроградный сценарий.',
      avoid: 'Не считать низкий объем самостоятельным диагнозом.',
      sources: ['WHO', 'AUA_ASRM', 'EAU', 'RU'],
    }));
  }

  if (abnormalities.includes('leuko')) {
    nodes.push(makeNode({
      id: 'leukocytospermia',
      parentId: 'who-thresholds',
      level: 3,
      title: 'Лейкоцитоспермия / round cells',
      status: 'attention',
      condition: `Лейкоциты: ${leukocytes} млн/мл.`,
      clinicalMeaning: 'Round cells нужно отличать от germ cells; антибиотик нужен не цифре, а подтвержденной инфекции.',
      diagnostics: ['Подтвердить лейкоциты пероксидазным тестом или другим валидным методом.', 'Посев/ПЦР и оценка простатита/эпидидимита по клинике.', 'Исключить стерильное воспаление и контаминацию.'],
      treatment: ['Терапия по подтвержденному возбудителю и клинике; контроль спермограммы после лечения.'],
      nextStep: 'Верифицировать инфекцию перед антибактериальной стратегией.',
      avoid: 'Не лечить “лейкоциты в спермограмме” автоматически антибиотиком.',
      sources: ['WHO', 'AUA_ASRM', 'EAU', 'RU'],
    }));
  }

  if (abnormalities.includes('highDfi')) {
    nodes.push(makeNode({
      id: 'high-dfi',
      parentId: 'who-thresholds',
      level: 4,
      title: 'Высокая фрагментация ДНК сперматозоидов',
      status: artFailures >= 2 ? 'critical' : 'attention',
      condition: `DFI: ${dfi}%.`,
      clinicalMeaning: 'DFI может быть полезен при повторных потерях, неудачах ART и выраженном oxidative-stress контексте, но не должен быть рутинным первым тестом.',
      diagnostics: ['Искать варикоцеле, курение, ожирение, лихорадку, воспаление, токсическое и тепловое воздействие.', 'При повторных ART failure/RPL обсуждать расширенную male-factor оценку.'],
      treatment: ['Коррекция обратимых факторов; лечение клинического варикоцеле по показаниям; ART-стратегия индивидуально.'],
      nextStep: artFailures >= 2 ? 'Связать DFI с ART-историей и эмбриологическим отчетом.' : 'Использовать как дополнительный, а не единственный драйвер решения.',
      avoid: 'Не предлагать дорогостоящие add-ons без ясной клинической причины.',
      sources: SOURCE_ART,
    }));
  }

  if (abnormalities.includes('immuneFactor')) {
    nodes.push(makeNode({
      id: 'immune-factor',
      parentId: 'who-thresholds',
      level: 4,
      title: 'Иммунологический фактор / MAR',
      status: 'attention',
      condition: `MAR-test: ${mar}%.`,
      clinicalMeaning: 'Высокий MAR может снижать естественное оплодотворение и усиливать аргументы в пользу ICSI при клинически значимом бесплодии пары.',
      diagnostics: ['Проверить контекст: травма, воспаление, операции, варикоцеле, обструкция.', 'Повторить/подтвердить при несоответствии клинике.'],
      treatment: ['Обсуждать ICSI route при стойком высоком MAR и неэффективности менее инвазивной стратегии.'],
      nextStep: 'Сопоставить MAR с TMC, длительностью бесплодия и возрастом партнерши.',
      avoid: 'Не строить длительное лечение только вокруг антител без репродуктивной стратегии пары.',
      sources: ['AUA_ASRM', 'EAU', 'RU'],
    }));
  }

  if (form.varicocele === 'yes') {
    nodes.push(makeNode({
      id: 'varicocele-route',
      parentId: 'who-thresholds',
      level: 4,
      title: 'Варикоцеле и фертильность',
      status: abnormalities.some((item) => ['oligo', 'astheno', 'terato', 'highDfi'].includes(item)) ? 'attention' : 'neutral',
      condition: 'Клиническое варикоцеле указано в форме.',
      clinicalMeaning: 'Польза коррекции выше при клиническом варикоцеле, бесплодии пары и отклонениях спермограммы.',
      diagnostics: ['Подтвердить клиническую значимость, сторону, степень, объем яичек и боль.', 'Оценить женский фактор и репродуктивное окно.'],
      treatment: ['Микрохирургическая коррекция по показаниям; контроль спермограммы через 3-6 месяцев.'],
      nextStep: 'Решать вместе с возрастом партнерши, длительностью бесплодия и тяжестью male-factor.',
      avoid: 'Не оперировать субклиническое варикоцеле только из-за находки на УЗИ.',
      sources: ['EAU', 'AUA_ASRM', 'RU'],
    }));
  }

  if (abnormalities.includes('endocrine')) {
    nodes.push(makeNode({
      id: 'endocrine-route',
      parentId: primaryPattern === 'azo' ? 'azo-triage' : 'who-thresholds',
      level: 4,
      title: 'Эндокринная ветка',
      status: 'attention',
      condition: `Тестостерон: ${testosterone || 'не указан'} нмоль/л; ФСГ: ${fsh || 'не указан'} МЕ/л.`,
      clinicalMeaning: 'Низкий тестостерон или низко-нормальный ФСГ могут указывать на гипогонадотропный сценарий, особенно при азооспермии.',
      diagnostics: ['Повторить утренний тестостерон, ЛГ, ФСГ, пролактин, ТТГ по показаниям.', 'Исключить анаболики, опиоиды, гиперпролактинемию, ожирение, системные заболевания.'],
      treatment: ['При репродуктивной цели избегать экзогенного тестостерона; рассмотреть стимуляцию оси у профильного специалиста.'],
      nextStep: 'Отделить функциональный дефицит от органического гипогонадизма.',
      avoid: 'Не назначать TRT мужчине, который планирует зачатие, без сохранения/стимуляции фертильности.',
      sources: ['EAU', 'AUA_ASRM', 'RU'],
    }));
  }

  nodes.push(makeNode({
    id: 'art-route',
    parentId: 'who-thresholds',
    level: 5,
    title: 'ART-маршрут и сроки',
    status: severity === 'severe' || partnerAge >= 35 || artFailures >= 2 ? 'critical' : 'neutral',
    condition: `TMC: ${tmc || 'не указан'} млн; возраст партнерши: ${partnerAge || 'не указан'}; ART failure: ${artFailures || 0}.`,
    clinicalMeaning: 'Маршрут IUI/IVF/ICSI зависит от TMC, тяжести male-factor, возраста партнерши, длительности бесплодия и предыдущих циклов.',
    diagnostics: ['Собрать female/couple factor параллельно.', 'При повторных ART failures оценить эмбриологический отчет, RPL/RIF-контекст и male-factor add-ons с осторожностью.'],
    treatment: [
      tmc >= 10 && severity === 'mild' ? 'IUI можно обсуждать при благоприятном female factor.' : 'IVF/ICSI вероятнее при низком TMC, тяжелом или смешанном male-factor.',
      primaryPattern === 'azo' ? 'При азооспермии обсуждать sperm retrieval + ICSI или donor route по типу азооспермии.' : 'Коррекцию обратимых факторов вести параллельно с репродуктивным планом.',
    ],
    nextStep: partnerAge >= 35 || artFailures >= 2 ? 'Сократить окно наблюдения и быстрее собрать multidisciplinary fertility route.' : 'Переоценка через 8-12 недель после коррекции обратимых факторов.',
    avoid: 'Не противопоставлять лечение мужчины и ART, если время пары ограничено.',
    sources: SOURCE_ALL,
  }));

  const redFlags = nodes
    .filter((node) => node.status === 'critical')
    .map((node) => node.title);

  const nextNodeHints = nodes
    .filter((node) => node.level >= 3 && node.status !== 'neutral')
    .map((node) => `${node.title}: ${node.nextStep}`);

  const summary = primaryPattern === 'normal'
    ? 'Критичных отклонений по введенным WHO-параметрам нет; решение зависит от пары и длительности бесплодия.'
    : primaryPattern === 'azo'
      ? `Азооспермия: подтвердить pellet-анализом и разделить OA/NOA/HH (${azoSubtype}).`
      : primaryPattern === 'combined'
        ? 'Смешанный OAT-профиль: параллельно искать обратимые причины и определять ART-маршрут.'
        : 'Есть изолированная ведущая ветка; проверьте подтверждение, обратимые причины и репродуктивное окно пары.';

  return {
    primaryPattern,
    primaryPatternLabel: {
      normal: 'Нормозооспермия / пограничный профиль',
      oligo: 'Олигозооспермия',
      astheno: 'Астенозооспермия',
      terato: 'Тератозооспермия',
      leuko: 'Лейкоцитоспермия',
      lowVolume: 'Низкий объем эякулята',
      highDfi: 'Высокий DFI',
      immuneFactor: 'Иммунологический фактор',
      combined: 'Смешанный OAT-профиль',
      azo: 'Азооспермия',
    }[primaryPattern] || primaryPattern,
    severity,
    abnormalities,
    azoSubtype,
    redFlags,
    nextNodeHints,
    lowVolumePathway: nodes.find((node) => node.id === 'low-volume')?.diagnostics || [],
    dfiPathway: nodes.find((node) => node.id === 'high-dfi')?.diagnostics || [],
    marPathway: nodes.find((node) => node.id === 'immune-factor')?.diagnostics || [],
    artRecommendation: nodes.find((node) => node.id === 'art-route')?.treatment.join(' '),
    coupleFactorPathway: nodes.find((node) => node.id === 'art-route')?.diagnostics || [],
    varicocelePathway: nodes.find((node) => node.id === 'varicocele-route')?.diagnostics || [],
    referenceBadges: sourceLabels(SOURCE_ALL),
    immuneLossPathway: nodes
      .filter((node) => ['high-dfi', 'immune-factor', 'art-route'].includes(node.id))
      .map((node) => node.clinicalMeaning),
    patientSummary: [
      summary,
      severity === 'severe' ? 'Не затягивать углубленное обследование и обсуждение репродуктивного маршрута.' : 'Переоценивать динамику после коррекции обратимых факторов.',
      partnerAge >= 35 ? 'Возраст партнерши делает время самостоятельным клиническим фактором.' : 'Срок наблюдения можно держать в рамках одного цикла сперматогенеза, если нет срочных факторов.',
    ],
    summary,
    nodes,
    sources: SOURCE_PACK,
  };
}

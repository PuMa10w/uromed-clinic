export const asArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return [value];
  return [];
};

const asObjectArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'object') return Object.values(value);
  return [];
};

const normalizeQuickSummary = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return { firstLine: value };
  return value;
};

const normalizeEpidemiology = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  const parts = [value.prevalence, value.age].filter(Boolean);
  if (Array.isArray(value.riskFactors) && value.riskFactors.length) {
    parts.push(`Факторы риска: ${value.riskFactors.join(', ')}`);
  }
  return parts.join('. ');
};

const normalizeClassification = (value) => {
  if (!value) return null;
  if (Array.isArray(value)) {
    return { title: 'Классификация', items: value };
  }
  return value;
};

const normalizeDiagnostics = (value) => {
  if (!value) return null;
  if (value.steps) return value;
  const steps = [];
  if (Array.isArray(value.primary) && value.primary.length) {
    steps.push({ step: 1, text: value.primary.join('; '), main: true });
  }
  if (Array.isArray(value.additional) && value.additional.length) {
    steps.push({ step: steps.length + 1, text: value.additional.join('; ') });
  }
  return {
    title: 'Диагностика',
    steps,
    imaging: value.imaging || value.keyFindings || 'Уточняется по клинической ситуации.',
    labs: value.labs || value.keyFindings || 'Лабораторный блок зависит от клинического сценария.',
  };
};

const normalizeTreatment = (value) => {
  if (!value) return null;
  if (value.conservative || value.surgical) return value;
  if (Array.isArray(value)) {
    return {
      conservative: [{ title: 'Основные подходы', items: value }],
      surgical: [],
    };
  }
  return null;
};

const guidelineSourcePresets = {
  eauUrolithiasis: {
    key: 'eau',
    title: 'EAU Guidelines on Urolithiasis 2026',
    url: 'https://uroweb.org/guidelines/urolithiasis',
    keyPoints: [
      'Ежегодное обновление EAU: в 2026 пересмотрены renal colic, MET, SWL, URS, PCNL и метафилактика.',
      'Для камней важны стратификация риска рецидива, анализ состава и метаболическая оценка.',
    ],
  },
  eauInfections: {
    key: 'eau',
    title: 'EAU Guidelines on Urological Infections 2026',
    url: 'https://uroweb.org/guidelines/urological-infections',
    keyPoints: [
      'Фокус 2026: цистит, антимикробная терапия, fungal UTI и периоперационная антибиотикопрофилактика.',
      'Антимикробная stewardship-логика важнее эмпирического продления курса без показаний.',
    ],
  },
  eauSexual: {
    key: 'eau',
    title: 'EAU Sexual and Reproductive Health Guidelines 2026',
    url: 'https://uroweb.org/guidelines/sexual-and-reproductive-health',
    keyPoints: [
      'В 2026 обновлены разделы гипогонадизма, расстройств эякуляции, искривления полового члена и приапизма.',
      'Андрологические решения требуют оценки сосудистого, эндокринного, репродуктивного и психосексуального контекста.',
    ],
  },
  eauMaleLuts: {
    key: 'eau',
    title: 'EAU Guidelines on Non-neurogenic Male LUTS 2026',
    url: 'https://uroweb.org/guidelines/management-of-non-neurogenic-male-luts',
    keyPoints: [
      'В 2026 полностью обновлены главы диагностики, консервативной терапии и хирургии BPO/LUTS.',
      'BPH трактуется как гистологический термин; клиническое решение строится вокруг LUTS/BPO и риска осложнений.',
    ],
  },
  eauPaediatric: {
    key: 'eau',
    title: 'EAU Paediatric Urology Guidelines 2026',
    url: 'https://uroweb.org/guidelines/paediatric-urology',
    keyPoints: [
      'В 2026 обновлены UTI у детей, энурез, PUJ obstruction, ureterocele/ectopic ureter и fetal urology.',
      'Сложные детские случаи требуют маршрутизации в специализированный pediatric urology центр.',
    ],
  },
  eauTrauma: {
    key: 'eau',
    title: 'EAU Guidelines on Urological Trauma 2026',
    url: 'https://uroweb.org/guidelines/urological-trauma',
    keyPoints: [
      'Версия 2026 полностью реструктурирована относительно 2025 и служит базой для травматологических сценариев.',
      'При травме ключевы гемодинамика, стадирование повреждения и своевременная реконструктивная маршрутизация.',
    ],
  },
  auaMaleInfertility: {
    key: 'aua',
    title: 'AUA/ASRM Male Infertility Guideline, amended 2024',
    url: 'https://www.auanet.org/guidelines-and-quality/guidelines/male-infertility',
    keyPoints: [
      'Amendment 2024 обновил оценку мужского фактора, Y-chromosome microdeletion thresholds, pelvic MRI и использование testicular sperm.',
      'Оценка проводится в контексте пары и репродуктивных целей, а не только одной спермограммы.',
    ],
  },
  auaStones: {
    key: 'aua',
    title: 'AUA/Endourology Society Surgical Management of Stones Guideline',
    url: 'https://www.auanet.org/guidelines-and-quality/guidelines/kidney-stones-surgical-management-guideline',
    keyPoints: [
      'AUA/Endourology Society используется как дополнительная сверка хирургических решений при камнях почки и мочеточника.',
      'Выбор наблюдения, MET, SWL, URS или PCNL должен зависеть от локализации, размера, инфекции, анатомии и целей пациента.',
    ],
  },
  whoSemen: {
    key: 'who',
    title: 'WHO laboratory manual for semen examination, 6th ed. 2021',
    url: 'https://www.who.int/publications/i/item/9789240030787',
    keyPoints: [
      'WHO 6th edition задает стандартизированную лабораторную методику анализа и обработки эякулята.',
      'Семенная оценка помогает клиническому решению, но не заменяет комплексную андрологическую интерпретацию.',
    ],
  },
  eseAdrenalIncidentaloma: {
    key: 'ese',
    title: 'ESE/ENSAT Adrenal Incidentaloma Guideline 2023',
    url: 'https://www.ese-hormones.org/publications/directory/ese-clinical-practice-guideline-on-the-management-of-adrenal-incidentalomas-in-collaboration-with-the-european-network-for-the-study-of-adrenal-tumors/',
    keyPoints: [
      'Каждая инциденталома требует оценки гормональной активности и риска злокачественности.',
      'У молодых, беременных и при неопределенной визуализации нужна более срочная экспертная маршрутизация.',
    ],
  },
  ruPortal: {
    key: 'ru',
    title: 'Клинические рекомендации Минздрава РФ',
    url: 'https://cr.minzdrav.gov.ru/',
    keyPoints: [
      'Российские клинические рекомендации применяются по актуальной версии рубрикатора Минздрава.',
      'Для практики важно сверять лекарственные режимы, маршрутизацию и сроки пересмотра с локальной редакцией.',
    ],
  },
  usanzPortal: {
    key: 'ua',
    title: 'USANZ / Australian urology guideline portals',
    url: 'https://www.urology.org.au/guidelines',
    keyPoints: [
      'Региональные материалы полезны для сравнения маршрутов и patient-facing документов.',
      'Используются как дополнительная сверка, когда нет узкоспециализированной австралийской рекомендации по нозологии.',
    ],
  },
};

const guidelineKeywordMap = [
  { test: (text) => /who|semen|сперм/i.test(text), preset: guidelineSourcePresets.whoSemen },
  { test: (text) => /adrenal incidentaloma|incidentaloma|инцидентал/i.test(text), preset: guidelineSourcePresets.eseAdrenalIncidentaloma },
  { test: (text) => /aua.*stone|stone.*aua|kidney stones|surgical management of stones/i.test(text), preset: guidelineSourcePresets.auaStones },
  { test: (text) => /asrm|male infertility|aua.*infertility|infertility.*aua/i.test(text), preset: guidelineSourcePresets.auaMaleInfertility },
  { test: (text) => /urolithiasis|stone|кам|гиперкальциур|гиперурикозур|гипероксалур|cystinuria/i.test(text), preset: guidelineSourcePresets.eauUrolithiasis },
  { test: (text) => /infection|uti|cystitis|prostatitis|epididym|orchitis|балан|кандид|герпес|трихомон|микоплазм/i.test(text), preset: guidelineSourcePresets.eauInfections },
  { test: (text) => /sexual|reproductive|infertility|hypogonad|ejaculat|peyronie|priapism|androlog|fertility|varicocele|sperm|эрект|эякуляц|бесплод/i.test(text), preset: guidelineSourcePresets.eauSexual },
  { test: (text) => /paediatric|pediatric|child|children|hypospadias|exstrophy|cryptorchid|enuresis|дет/i.test(text), preset: guidelineSourcePresets.eauPaediatric },
  { test: (text) => /trauma|fracture|rupture|травм/i.test(text), preset: guidelineSourcePresets.eauTrauma },
  { test: (text) => /luts|bph|incontinence|overactive|underactive|retention|дгпж|задерж/i.test(text), preset: guidelineSourcePresets.eauMaleLuts },
  { test: (text) => /минздрав|россий|ркр|клинические рекомендации/i.test(text), preset: guidelineSourcePresets.ruPortal },
  { test: (text) => /australia|usanz|urology\.org\.au/i.test(text), preset: guidelineSourcePresets.usanzPortal },
];

function mergeGuidelineSource(current, preset) {
  if (!preset) return current;
  return {
    ...(current || {}),
    title: current?.title || preset.title,
    url: current?.url || preset.url,
    keyPoints: [...new Set([...(current?.keyPoints || []), ...(preset.keyPoints || [])])],
  };
}

function buildGuidelineSourcesFromList(items = []) {
  return items.reduce((acc, item) => {
    const text = String(item || '');
    guidelineKeywordMap.forEach(({ test, preset }) => {
      if (test(text)) {
        acc[preset.key] = mergeGuidelineSource(acc[preset.key], preset);
      }
    });
    return acc;
  }, {});
}

const normalizeGuidelines = (value) => {
  if (!value) return null;
  if (Array.isArray(value)) {
    return {
      consensus: value,
      ...buildGuidelineSourcesFromList(value),
    };
  }
  return value;
};

const normalizeWhenToRefer = (value) => {
  if (!value) return null;
  if (typeof value === 'string') {
    return { toUrologist: [value] };
  }
  return value;
};

const normalizeFollowUp = (value) => {
  if (!value) return null;
  if (typeof value === 'string') {
    return { schedule: [value] };
  }
  return value;
};

const normalizePrognosis = (value) => {
  if (!value) return null;
  if (typeof value === 'string') {
    return { shortTerm: value };
  }
  return value;
};

const normalizeClinicalCases = (value) => {
  if (!Array.isArray(value)) return [];
  return value.map((item, index) => {
    if (item.case) {
      return {
        title: item.title || `Клинический случай №${index + 1}`,
        findings: item.case,
      };
    }
    return item;
  });
};

const normalizeDrugDoses = (value) => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => ({
    name: item.name || item.drug || 'Препарат',
    dose: item.dose || '—',
    note: item.note || '',
  }));
};

const normalizeLabNorms = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => ({
      name: item.test || item.name || 'Параметр',
      normal: item.norm || item.normal || '—',
      note: item.note || '',
    }));
  }
  return Object.entries(value).map(([key, val]) => ({
    name: key,
    normal: val.normal || val.norm || '—',
    note: val.note || '',
  }));
};

const normalizeDifferentialTable = (value) => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => ({
    condition: item.condition || item.diagnosis || '—',
    distinguishingFeature: item.distinguishingFeature || item.feature || item.desc || '—',
    investigation: item.investigation || item.test || '—',
  }));
};

const ultrasoundTemplates = {
  'urology:stones': {
    overview: 'УЗ-признаки камнеобразования и/или обструкции верхних мочевых путей.',
    findings: [
      'Гиперэхогенные включения с акустической тенью в чашечно-лоханочной системе или мочеточнике.',
      'Расширение ЧЛС и мочеточника проксимальнее уровня обструкции.',
      'Косвенные признаки воспалительного ответа при длительной обструкции.',
    ],
  },
  'urology:infections': {
    overview: 'УЗ-оценка воспалительных изменений паренхимы и мочевых путей, исключение осложнений.',
    findings: [
      'Неоднородность эхоструктуры пораженного органа, локальная болезненность при компрессии датчиком.',
      'Утолщение стенки мочевого пузыря/простатической зоны при воспалении нижних путей.',
      'Поиск абсцессов, эмфизематозных изменений, признаков обструкции и остаточной мочи.',
    ],
  },
  'urology:oncology': {
    overview: 'Сонографическая стратификация объемного образования и признаков местного распространения.',
    findings: [
      'Фокальное образование с оценкой размеров, контуров, эхогенности и инвазии соседних структур.',
      'Оценка васкуляризации по ЦДК/ЭДК и признаков неоангиогенеза.',
      'Скрининг гидронефроза, увеличенных лимфоузлов и остаточной мочи.',
    ],
  },
  'urology:functional': {
    overview: 'УЗ-функциональная оценка нижних мочевых путей до и после мочеиспускания.',
    findings: [
      'Измерение объема мочевого пузыря и остаточной мочи (PVR).',
      'Признаки гипертрофии детрузора/трабекулярности, дивертикулов, внутрипузырных образований.',
      'Оценка простаты, верхних мочевых путей и осложнений хронической задержки.',
    ],
  },
  'urology:reconstructive': {
    overview: 'УЗ-картина структурных изменений и последствий нарушения оттока.',
    findings: [
      'Дилатация выше уровня стриктуры/обструкции, стеночные и рубцовые изменения.',
      'Оценка толщины стенки и деформаций мочевого пузыря, дивертикулов, свищевых зон.',
      'Контроль дренажей/стентов и остаточной мочи в динамике.',
    ],
  },
  'urology:nephrology': {
    overview: 'УЗ-оценка размеров, кортико-медуллярной дифференцировки и сосудистых характеристик почек.',
    findings: [
      'Изменение размеров и эхогенности паренхимы, истончение коркового слоя.',
      'Наличие кист, очаговых образований, инфарктных/склеротических участков.',
      'Допплер-оценка кровотока при подозрении на сосудистый компонент.',
    ],
  },
  'urology:pain': {
    overview: 'УЗ-диагностика причин тазовой/урологической боли и исключение неотложных состояний.',
    findings: [
      'Исключение обструкции, камней, объемных образований и выраженного воспаления.',
      'Оценка стенки мочевого пузыря, остаточной мочи и локальной болезненности.',
      'При необходимости — расширение до УЗИ органов мошонки/простаты.',
    ],
  },
  'andrology:sexual': {
    overview: 'УЗ-оценка структур полового члена, простаты и органов мошонки по клиническому сценарию.',
    findings: [
      'Для болезни Пейрони: гиперэхогенные бляшки/кальцинаты белочной оболочки.',
      'Для хронической боли/воспаления: признаки венозного застоя, воспалительных изменений придатков/семенных пузырьков.',
      'Для ЭД по показаниям: допплерография сосудов полового члена после фармакопробы.',
    ],
  },
  'andrology:fertility': {
    overview: 'УЗ-маршрут при нарушении фертильности: мошонка + ТРУЗИ по показаниям.',
    findings: [
      'Оценка объема и эхоструктуры яичек, придатков, вен семенного канатика.',
      'Признаки варикоцеле (диаметр вен и рефлюкс на пробе Вальсальвы).',
      'ТРУЗИ при подозрении на обструкцию семявыбрасывающих путей.',
    ],
  },
  'andrology:endocrine': {
    overview: 'УЗ-картина вторичных изменений гонад при эндокринной патологии.',
    findings: [
      'Оценка объема яичек, эхоструктуры и очаговых изменений.',
      'Признаки атрофии/гипоплазии и косвенные маркеры длительного гипогонадизма.',
      'По показаниям — УЗИ щитовидной железы/надпочечников в рамках междисциплинарной оценки.',
    ],
  },
  'pediatric:default': {
    overview: 'Возраст-адаптированное УЗИ мочевых путей у детей с учетом врожденной аномалии и функциональных нарушений.',
    findings: [
      'Измерение размеров почек и оценка паренхимы в возрастных референсах.',
      'Оценка дилатации ЧЛС, мочеточников и толщины стенки мочевого пузыря.',
      'Контроль остаточной мочи и признаков инфравезикальной обструкции.',
    ],
  },
  default: {
    overview: 'Базовая УЗ-оценка пораженного органа и смежных мочевых путей.',
    findings: [
      'Описание размеров, контуров, эхогенности и очаговых изменений.',
      'Оценка признаков обструкции, воспаления и остаточной мочи.',
      'Допплер-оценка кровотока по клиническим показаниям.',
    ],
  },
};

const idSpecificUltrasound = {
  'prostate-cancer': {
    findings: [
      'ТРУЗИ: гипоэхогенные очаги периферической зоны, асимметрия контуров, признаки экстракапсулярного распространения.',
      'Оценка объема простаты и вовлечения семенных пузырьков.',
      'УЗИ используется как морфологический ориентир и навигация для биопсии.',
    ],
  },
  'bladder-cancer': {
    findings: [
      'Внутрипузырное образование, фиксированное к стенке, с неровным контуром.',
      'Оценка толщины стенки, шейки пузыря и устьев мочеточников.',
      'Проверка верхних мочевых путей на гидроуретеронефроз.',
    ],
  },
  'kidney-cancer': {
    findings: [
      'Солидное образование почки, неоднородная эхоструктура, псевдокапсула по периферии.',
      'ЦДК: патологическая васкуляризация внутри узла.',
      'Оценка тромбоза почечной/нижней полой вены по допплеру.',
    ],
  },
  'bph': {
    findings: [
      'Увеличение объема простаты, преимущественно переходной зоны.',
      'Оценка внутрипузырной протрузии простаты (IPP) и остаточной мочи.',
      'Косвенные признаки хронической инфравезикальной обструкции со стороны мочевого пузыря.',
    ],
  },
  'pyelonephritis': {
    findings: [
      'Увеличение почки, снижение кортико-медуллярной дифференцировки, участки пониженной перфузии.',
      'Оценка обструкции и осложнений (абсцесс, паранефрит).',
      'Динамический УЗ-контроль при осложненном течении.',
    ],
  },
  'varicocele': {
    findings: [
      'Расширение вен лозовидного сплетения и ретроградный рефлюкс на пробе Вальсальвы.',
      'Сравнительная оценка объема яичек с двух сторон.',
      'Признаки хронической венозной перегрузки мошонки.',
    ],
  },
  'testicular-torsion': {
    findings: [
      'Отсутствие/критическое снижение интратестикулярного кровотока по ЦДК.',
      'Увеличение и неоднородность яичка, реактивный гидроцеле, утолщение оболочек.',
      'Сонографический признак «whirlpool» семенного канатика.',
    ],
  },
  'posterior-urethral-valves': {
    findings: [
      'Двусторонний гидроуретеронефроз и утолщенная стенка мочевого пузыря.',
      'Трабекулярность, большой объем остаточной мочи, расширение задней уретры.',
      'Динамическое наблюдение почек и мочевого пузыря в детском профиле.',
    ],
  },
};

const normalizeUltrasound = (value, disease) => {
  if (value && typeof value === 'object') {
    return {
      overview: value.overview || value.summary || 'УЗ-картина определяется клиническим сценарием.',
      findings: asArray(value.findings || value.items || value.keyFindings),
      doppler: asArray(value.doppler),
      protocol: asArray(value.protocol),
      report: asArray(value.report || value.reportTemplate),
      limitations: asArray(value.limitations),
    };
  }

  const key = `${disease.section}:${disease.subsection || 'default'}`;
  const base =
    ultrasoundTemplates[key] ||
    ultrasoundTemplates[`${disease.section}:default`] ||
    ultrasoundTemplates.default;

  const override = idSpecificUltrasound[disease.id] || {};
  const findings = override.findings || base.findings;

  return {
    overview: base.overview,
    findings,
    doppler: [
      'Цветовое/энергетическое допплеровское картирование выполняется при подозрении на ишемию, воспаление или опухолевую неоваскуляризацию.',
    ],
    protocol: [
      'Исследование в серошкальном режиме + ЦДК по показаниям.',
      'Сравнение с контралатеральной стороной или предыдущими исследованиями при наличии.',
      'Обязательная фиксация размеров, остаточной мочи и признаков обструкции/осложнений.',
    ],
    report: [
      'Локализация и размеры очага/изменений.',
      'Эхогенность, контуры, акустические эффекты, васкуляризация.',
      'Признаки осложнений и рекомендации по дообследованию (КТ/МРТ/эндоскопия) при необходимости.',
    ],
    limitations: [
      'Ограничения метода: зависимость от окна визуализации, конституции пациента и оператора.',
    ],
  };
};

export const normalizeDisease = (disease) => {
  return {
    ...disease,
    tags: asArray(disease.tags),
    etiology: asArray(disease.etiology),
    symptoms: asArray(disease.symptoms),
    complications: asArray(disease.complications),
    differentialDiagnosis: asArray(disease.differentialDiagnosis),
    redFlags: Array.isArray(disease.redFlags)
      ? disease.redFlags.map((item) => (typeof item === 'string' ? { text: item } : item))
      : [],
    quickSummary: normalizeQuickSummary(disease.quickSummary),
    epidemiology: normalizeEpidemiology(disease.epidemiology),
    classification: normalizeClassification(disease.classification),
    diagnostics: normalizeDiagnostics(disease.diagnostics),
    treatment: normalizeTreatment(disease.treatment),
    guidelines: normalizeGuidelines(disease.guidelines),
    whenToRefer: normalizeWhenToRefer(disease.whenToRefer),
    followUp: normalizeFollowUp(disease.followUp),
    prognosis: normalizePrognosis(disease.prognosis),
    clinicalCases: normalizeClinicalCases(disease.clinicalCases),
    patientQuestions: asObjectArray(disease.patientQuestions),
    drugDoses: normalizeDrugDoses(disease.drugDoses),
    labNorms: normalizeLabNorms(disease.labNorms),
    differentialTable: normalizeDifferentialTable(disease.differentialTable),
    ultrasound: normalizeUltrasound(disease.ultrasound, disease),
  };
};

export const buildLifestyleFallback = (disease) => {
  const advice = [];
  const nutrition = [];
  const patient = [];

  if (disease.section === 'urology' && disease.subsection === 'stones') {
    advice.push('Поддерживать достаточную гидратацию в течение суток и ориентироваться на светлую мочу.', 'Сохранять данные о перенесённых камнях и анализе состава, если он выполнялся.');
    nutrition.push('Ограничить избыток соли и ультраобработанных продуктов.', 'Не ограничивать кальций самостоятельно без обсуждения с врачом.');
    patient.push('При температуре, ознобе, анурии или некупируемой боли обращаться срочно.', 'Контроль рецидива строится не только на УЗИ, но и на образе жизни.');
  }

  if (disease.section === 'urology' && disease.subsection === 'infections') {
    advice.push('Не терпеть мочеиспускание длительное время и избегать переохлаждения.', 'Соблюдать режим лечения до конца курса.');
    nutrition.push('Поддерживать адекватное потребление жидкости при отсутствии противопоказаний.', 'Снизить алкоголь и раздражающие мочевой пузырь напитки при дизурии.');
    patient.push('Не начинать и не менять антибиотики самостоятельно.', 'При лихорадке и боли в боку обращаться экстренно.');
  }

  if (disease.section === 'urology' && disease.subsection === 'functional') {
    advice.push('Вести дневник мочеиспусканий и отслеживать провоцирующие факторы.', 'Регулярно оценивать симптомы и качество жизни на терапии.');
    nutrition.push('Ограничить поздний приём жидкости, кофеин и алкоголь при ноктурии и urgency.', 'При запорах скорректировать пищевое волокно и водный режим.');
    patient.push('Не отменять терапию без оценки эффекта у врача.', 'При нарастании остаточной мочи или задержке мочи обращаться раньше.');
  }

  if (disease.section === 'urology' && disease.subsection === 'nephrology') {
    advice.push('Контролировать давление, массу тела и функцию почек.', 'Избегать нефротоксичных препаратов без необходимости.');
    nutrition.push('Ограничить избыток соли; при снижении функции почек корректировать рацион индивидуально.', 'Не использовать белковые и БАД-нагрузки без обсуждения при ХБП.');
    patient.push('Следить за креатинином, СКФ и белком в моче по плану наблюдения.');
  }

  if (disease.section === 'urology' && disease.subsection === 'oncology') {
    advice.push('Соблюдать график онкологического наблюдения без пропусков.', 'Поддерживать физическую активность в переносимом объёме.');
    nutrition.push('Рацион должен поддерживать массу тела и белковый статус во время лечения.', 'При системной терапии коррекция питания обсуждается индивидуально.');
    patient.push('Любое ухудшение самочувствия на фоне лечения обсуждать с командой сразу, не ждать контрольного визита.');
  }

  if (disease.section === 'andrology' && disease.subsection === 'sexual') {
    advice.push('Нормализовать сон, вес, физическую активность и сосудистые факторы риска.', 'Снижать стресс и избегать самовольного приёма препаратов “для потенции”.');
    nutrition.push('Средиземноморский тип питания полезен для сосудистого и сексуального здоровья.', 'Ограничить алкоголь и курение как факторы ухудшения сексуальной функции.');
    patient.push('Резкое изменение сексуальной функции требует оценки не только симптомов, но и кардиометаболических рисков.');
  }

  if (disease.section === 'andrology' && disease.subsection === 'fertility') {
    advice.push('Снизить перегрев мошонки, нормализовать сон и вес.', 'Ограничить никотин и анаболические препараты.');
    nutrition.push('Поддерживать достаточное поступление белка, овощей и омега-3 в рамках общего здорового рациона.', 'Не увлекаться строгими дефицитными диетами при планировании фертильности.');
    patient.push('Бесплодие — это вопрос пары, а не только одного пациента.', 'Не откладывать обследование при отсутствии беременности более 12 месяцев.');
  }

  if (disease.section === 'andrology' && disease.subsection === 'endocrine') {
    advice.push('Повторять гормональные анализы в правильное время и при стабильном состоянии здоровья.', 'Корректировать сон, массу тела и метаболические факторы до решения о гормональной терапии.');
    nutrition.push('Контроль массы тела и дефицитов питания помогает стабилизировать гормональный фон.', 'Избегать самоназначения тестостерона и “гормональных бустеров”.');
    patient.push('Один анализ редко является основанием для окончательных решений.', 'При эндокринных нарушениях важна системная, а не только симптоматическая коррекция.');
  }

  return { advice, nutrition, patient };
};

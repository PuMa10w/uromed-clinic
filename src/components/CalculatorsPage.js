import React, { useEffect, useId, useMemo, useState } from 'react';
import '../styles/servicePages.css';
import { buildSpermogramAssessment } from '../utils/spermogramPathway';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ServicePageHero from './ServicePageHero';

const COLORS = {
  blue: '#3b82f6',
  green: '#16c79a',
  red: '#ef4444',
  gold: '#f0c96a',
  violet: '#8b5cf6',
  indigo: '#6366f1',
};

const ipssQuestions = [
  { id: 1, text: 'Ощущение неполного опорожнения после мочеиспускания?', night: false },
  { id: 2, text: 'Повторное мочеиспускание менее чем через 2 часа?', night: false },
  { id: 3, text: 'Прерывистая струя мочи?', night: false },
  { id: 4, text: 'Трудно начать мочеиспускание?', night: false },
  { id: 5, text: 'Слабая струя мочи?', night: false },
  { id: 6, text: 'Приходится натуживаться для начала мочеиспускания?', night: false },
  { id: 7, text: 'Сколько раз за ночь вы встаете для мочеиспускания?', night: true },
];

const ipssOptions = [
  { value: 0, label: 'Никогда' },
  { value: 1, label: 'Редко' },
  { value: 2, label: 'Менее половины' },
  { value: 3, label: 'Около половины' },
  { value: 4, label: 'Более половины' },
  { value: 5, label: 'Почти всегда' },
];

const nocturiaOptions = [
  { value: 0, label: '0 раз' },
  { value: 1, label: '1 раз' },
  { value: 2, label: '2 раза' },
  { value: 3, label: '3 раза' },
  { value: 4, label: '4 раза' },
  { value: 5, label: '5 и более' },
];

const iiefQuestions = [
  { id: 1, text: 'Насколько вы уверены, что сможете достичь и поддержать эрекцию?' },
  { id: 2, text: 'Как часто эрекция была достаточной для проникновения?' },
  { id: 3, text: 'Как часто удавалось поддерживать эрекцию после проникновения?' },
  { id: 4, text: 'Насколько трудно было сохранять эрекцию до завершения акта?' },
  { id: 5, text: 'Как часто половой акт был удовлетворительным?' },
];

const iiefOptions = [
  { value: 1, label: 'Очень низко' },
  { value: 2, label: 'Низко' },
  { value: 3, label: 'Умеренно' },
  { value: 4, label: 'Высоко' },
  { value: 5, label: 'Очень высоко' },
];

const pedtQuestions = [
  { id: 1, text: 'Насколько легко вам удается задержать эякуляцию?' },
  { id: 2, text: 'Как часто эякуляция происходит раньше, чем хотелось бы?' },
  { id: 3, text: 'Происходит ли эякуляция при минимальной стимуляции?' },
  { id: 4, text: 'Насколько вас беспокоит преждевременная эякуляция?' },
  { id: 5, text: 'Насколько партнер доволен продолжительностью акта?' },
];

const pedtOptions = [
  { value: 0, label: 'Никогда' },
  { value: 1, label: 'Редко' },
  { value: 2, label: 'Иногда' },
  { value: 3, label: 'Часто' },
  { value: 4, label: 'Почти всегда' },
];

const nihQuestions = [
  { id: 1, text: 'Боль или дискомфорт в промежности?', options: [0, 1, 2, 3, 4, 5] },
  { id: 2, text: 'Боль или дискомфорт в яичках?', options: [0, 1, 2, 3, 4, 5] },
  { id: 3, text: 'Боль над лобком?', options: [0, 1, 2, 3, 4, 5] },
  { id: 4, text: 'Боль при мочеиспускании?', options: [0, 1, 2, 3, 4, 5] },
  { id: 5, text: 'Боль при эякуляции?', options: [0, 1, 2, 3, 4, 5] },
  { id: 6, text: 'Как часто была боль за последнюю неделю?', options: [0, 1, 2, 3, 4, 5] },
  { id: 7, text: 'Средняя интенсивность боли?', options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { id: 8, text: 'Ощущение неполного опорожнения?', options: [0, 1, 2, 3, 4, 5] },
  { id: 9, text: 'Частое мочеиспускание менее чем через 2 часа?', options: [0, 1, 2, 3, 4, 5] },
  { id: 10, text: 'Насколько симптомы снижают качество жизни?', options: [0, 2, 4, 6, 8, 10, 12] },
];

const capraFields = [
  { id: 'psa', label: 'ПСА', options: [{ value: 0, label: '< 4' }, { value: 1, label: '4-6' }, { value: 2, label: '6,1-10' }, { value: 3, label: '10,1-20' }, { value: 4, label: '> 20' }] },
  { id: 'gleason', label: 'Сумма Глисона', options: [{ value: 0, label: '<= 6' }, { value: 1, label: '3+4=7' }, { value: 2, label: '4+3=7' }, { value: 3, label: '8' }, { value: 4, label: '9-10' }] },
  { id: 'tstage', label: 'Стадия T', options: [{ value: 0, label: 'T1c-T2a' }, { value: 1, label: 'T2b' }, { value: 2, label: 'T2c-T3a' }] },
  { id: 'biopsyCores', label: 'Позитивные биоптаты', options: [{ value: 0, label: '< 34%' }, { value: 1, label: '34-50%' }, { value: 2, label: '> 50%' }] },
  { id: 'age', label: 'Возраст', options: [{ value: 0, label: '< 60' }, { value: 1, label: '>= 60' }] },
];

const renalFields = [
  { id: 'radius', label: 'R - размер', options: [{ value: 1, label: '<= 4 см' }, { value: 2, label: '4-7 см' }, { value: 3, label: '> 7 см' }] },
  { id: 'exophytic', label: 'E - экзофитность', options: [{ value: 1, label: '>= 50%' }, { value: 2, label: '< 50%' }, { value: 3, label: 'Эндофитная' }] },
  { id: 'nearness', label: 'N - близость к синусу', options: [{ value: 1, label: '> 7 мм' }, { value: 2, label: '<= 7 мм' }, { value: 3, label: 'Контакт' }] },
  { id: 'location', label: 'L - локализация', options: [{ value: 1, label: 'Полюс' }, { value: 2, label: 'Через экватор' }, { value: 3, label: 'Хилярная' }] },
];

const initialSpermForm = {
  concentration: '',
  motility: '',
  morphology: '',
  volume: '',
  leukocytes: '',
  fsh: '',
  testosterone: '',
  testicularVolume: '',
  ph: '',
  fructose: 'unknown',
  varicocele: 'unknown',
  dfi: '',
  mar: '',
  tmc: '',
  partnerAge: '',
  artFailures: '',
};

const calcSeverity = (total, ranges) => ranges.find((item) => total <= item.max) || ranges[ranges.length - 1];

const ResultPanel = ({ color, children }) => (
  <div className="result-panel premium-result-panel" style={{ borderColor: `${color}44` }}>
    {children}
  </div>
);

const OptionButton = ({ selected, color, children, onClick }) => (
  <button
    className={`option-btn ${selected ? 'selected' : ''}`}
    onClick={onClick}
    style={{ borderColor: selected ? color : `${color}33` }}
  >
    {children}
  </button>
);

const SimpleQuestionnaire = ({ title, kicker, color, questions, getOptions, getResult }) => {
  const [answers, setAnswers] = useState({});
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  return (
    <article className="tool-section premium-questionnaire-panel" style={{ borderColor: `${color}33`, '--tool-color': color }}>
      <div className="premium-questionnaire-head">
        <div>
          <span className="premium-questionnaire-kicker">{kicker}</span>
          <h3 className="tool-title" style={{ color }}>{title}</h3>
        </div>
        <div className="premium-questionnaire-counter" aria-label="Progress">
          <strong>{answeredCount}</strong>
          <span>/{questions.length}</span>
        </div>
      </div>
      <div className="progress-bar premium-questionnaire-progress" style={{ borderColor: `${color}33` }}>
        <div className="progress-fill" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
        <span className="progress-text">{answeredCount}/{questions.length}</span>
      </div>
      <div className="questions-list premium-questionnaire-table">
        {questions.map((question, index) => (
          <div key={question.id} className="question-card premium-questionnaire-row" style={{ borderColor: `${color}22` }}>
            <div className="question-number" style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)` }}>{index + 1}</div>
            <div className="question-content">
              <p className="question-text">{question.text}</p>
              <div className="options-grid">
                {getOptions(question).map((option) => (
                  <OptionButton
                    key={`${question.id}-${option.value}`}
                    selected={answers[question.id] === option.value}
                    color={color}
                    onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: option.value }))}
                  >
                    {option.label}
                  </OptionButton>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={`premium-questionnaire-result ${answeredCount === questions.length ? 'is-ready' : ''}`}>
        {answeredCount === questions.length ? (
          <ResultPanel color={color}>{getResult(answers, () => setAnswers({}))}</ResultPanel>
        ) : (
          <div className="premium-questionnaire-placeholder">
            <strong>{questions.length - answeredCount}</strong>
            <span>осталось до результата</span>
          </div>
        )}
      </div>
    </article>
  );
};

const Field = ({ label, children }) => {
  const generatedId = useId();
  const controlId = React.isValidElement(children) && children.props.id ? children.props.id : generatedId;
  const control = React.isValidElement(children) ? React.cloneElement(children, { id: controlId }) : children;

  return (
    <div className="form-group">
      <label htmlFor={controlId}>{label}</label>
      {control}
    </div>
  );
};

const PSACalculator = () => {
  const [form, setForm] = useState({ age: '', psa: '', freePsa: '', volume: '' });
  const age = Number(form.age);
  const psa = Number(form.psa);
  const freePsa = Number(form.freePsa || 0);
  const prostateVolume = Number(form.volume || 0);
  const norms = age < 50 ? 2.5 : age < 60 ? 3.5 : age < 70 ? 4.5 : 6.5;
  const freeRatio = psa && freePsa ? (freePsa / psa) * 100 : null;
  const density = psa && prostateVolume ? psa / prostateVolume : null;
  const highRisk = psa > norms || (freeRatio !== null && freeRatio < 10) || (density !== null && density > 0.15);

  return (
    <article className="tool-section premium-form-card" style={{ borderColor: `${COLORS.gold}33` }}>
      <h3 className="tool-title" style={{ color: COLORS.gold }}>ПСА: базовая оценка риска</h3>
      <div className="form-grid premium-form-grid">
        <Field label="Возраст"><input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="55" /></Field>
        <Field label="ПСА общий, нг/мл"><input type="number" step="0.1" value={form.psa} onChange={(e) => setForm({ ...form, psa: e.target.value })} placeholder="3.2" /></Field>
        <Field label="ПСА свободный, нг/мл"><input type="number" step="0.1" value={form.freePsa} onChange={(e) => setForm({ ...form, freePsa: e.target.value })} placeholder="0.6" /></Field>
        <Field label="Объем простаты, см3"><input type="number" step="0.1" value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })} placeholder="35" /></Field>
      </div>
      {age && psa ? (
        <ResultPanel color={COLORS.gold}>
          <div className="result-item"><span>Возрастная граница:</span><strong>&lt; {norms} нг/мл</strong></div>
          <div className="result-item"><span>Свободный/общий:</span><strong>{freeRatio === null ? 'не указан' : `${freeRatio.toFixed(1)}%`}</strong></div>
          <div className="result-item"><span>Плотность ПСА:</span><strong>{density === null ? 'не указана' : density.toFixed(2)}</strong></div>
          <div className={`premium-result ${highRisk ? 'is-high' : 'is-good'}`}><strong>{highRisk ? 'Нужна клиническая маршрутизация' : 'Нет явного высокого риска по введенным данным'}</strong></div>
        </ResultPanel>
      ) : null}
    </article>
  );
};

const EGFRCalculator = () => {
  const [form, setForm] = useState({ creatinine: '', age: '', sex: 'male' });
  const creatinineUmol = Number(form.creatinine);
  const age = Number(form.age);
  const scr = creatinineUmol ? creatinineUmol / 88.4 : 0;
  const k = form.sex === 'male' ? 0.9 : 0.7;
  const alpha = form.sex === 'male' ? -0.302 : -0.241;
  const sexMultiplier = form.sex === 'female' ? 1.012 : 1;
  const egfr = creatinineUmol && age
    ? Math.round(142 * Math.pow(Math.min(scr / k, 1), alpha) * Math.pow(Math.max(scr / k, 1), -1.2) * Math.pow(0.9938, age) * sexMultiplier)
    : null;
  const stage = egfr === null ? null : egfr >= 90 ? 'G1' : egfr >= 60 ? 'G2' : egfr >= 45 ? 'G3a' : egfr >= 30 ? 'G3b' : egfr >= 15 ? 'G4' : 'G5';

  return (
    <article className="tool-section premium-form-card" style={{ borderColor: `${COLORS.indigo}33` }}>
      <h3 className="tool-title" style={{ color: COLORS.indigo }}>eGFR CKD-EPI 2021</h3>
      <div className="form-grid premium-form-grid">
        <Field label="Креатинин, мкмоль/л"><input type="number" value={form.creatinine} onChange={(e) => setForm({ ...form, creatinine: e.target.value })} placeholder="90" /></Field>
        <Field label="Возраст"><input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="55" /></Field>
        <Field label="Пол"><select value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value })}><option value="male">Мужской</option><option value="female">Женский</option></select></Field>
      </div>
      {egfr !== null ? (
        <ResultPanel color={COLORS.indigo}>
          <div className="result-score"><span className="score-value">{egfr}</span><span className="score-label">мл/мин/1,73 м2</span></div>
          <div className="result-item"><span>Стадия:</span><strong>{stage}</strong></div>
        </ResultPanel>
      ) : null}
    </article>
  );
};

const ScoreGrid = ({ title, color, fields, resultLabel }) => {
  const [answers, setAnswers] = useState({});
  const total = fields.reduce((sum, field) => sum + (answers[field.id] || 0), 0);

  return (
    <article className="tool-section premium-questionnaire-panel" style={{ borderColor: `${color}33`, '--tool-color': color }}>
      <h3 className="tool-title" style={{ color }}>{title}</h3>
      <div className="questions-list premium-questionnaire-table">
        {fields.map((field, index) => (
          <div key={field.id} className="question-card premium-questionnaire-row">
            <div className="question-number">{index + 1}</div>
            <div className="question-content">
              <p className="question-text">{field.label}</p>
              <div className="options-grid">
                {field.options.map((option) => (
                  <OptionButton
                    key={option.label}
                    selected={answers[field.id] === option.value}
                    color={color}
                    onClick={() => setAnswers((prev) => ({ ...prev, [field.id]: option.value }))}
                  >
                    {option.label}
                  </OptionButton>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {Object.keys(answers).length === fields.length ? (
        <ResultPanel color={color}>
          <div className="result-score"><span className="score-value">{total}</span><span className="score-label">баллов</span></div>
          <div className="result-item"><span>Интерпретация:</span><strong>{resultLabel(total)}</strong></div>
        </ResultPanel>
      ) : null}
    </article>
  );
};

const VoidingDiary = () => {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ volume: '', urgency: '1', incontinence: '0' });
  const totalVolume = entries.reduce((sum, entry) => sum + entry.volume, 0);
  const averageVolume = entries.length ? Math.round(totalVolume / entries.length) : 0;

  const addEntry = () => {
    const volume = Number(form.volume);
    if (!volume) return;
    setEntries((prev) => [...prev, { id: Date.now(), volume, urgency: Number(form.urgency), incontinence: form.incontinence === '1' }]);
    setForm({ volume: '', urgency: '1', incontinence: '0' });
  };

  return (
    <article className="tool-section premium-form-card" style={{ borderColor: `${COLORS.blue}33` }}>
      <h3 className="tool-title" style={{ color: COLORS.blue }}>Дневник мочеиспусканий</h3>
      <div className="form-grid premium-form-grid">
        <Field label="Объем, мл"><input type="number" value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })} placeholder="250" /></Field>
        <Field label="Позыв"><select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })}><option value="1">1 - нет</option><option value="2">2 - легкий</option><option value="3">3 - умеренный</option><option value="4">4 - сильный</option></select></Field>
        <Field label="Подтекание"><select value={form.incontinence} onChange={(e) => setForm({ ...form, incontinence: e.target.value })}><option value="0">Нет</option><option value="1">Да</option></select></Field>
      </div>
      <button className="calc-button premium-calc-btn" onClick={addEntry}>Добавить запись</button>
      {entries.length > 0 ? (
        <ResultPanel color={COLORS.blue}>
          <div className="result-item"><span>Эпизодов:</span><strong>{entries.length}</strong></div>
          <div className="result-item"><span>Суммарный объем:</span><strong>{totalVolume} мл</strong></div>
          <div className="result-item"><span>Средний объем:</span><strong>{averageVolume} мл</strong></div>
        </ResultPanel>
      ) : null}
    </article>
  );
};

const SpermogramPathway = ({ onNavigate }) => {
  const [form, setForm] = useLocalStorage('spermogramPathwayForm', initialSpermForm);
  const assessment = useMemo(() => buildSpermogramAssessment(form), [form]);
  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const reset = () => setForm(initialSpermForm);

  const inputFields = [
    ['concentration', 'Концентрация, млн/мл', '16'],
    ['motility', 'Общая подвижность, %', '42'],
    ['morphology', 'Нормальные формы, %', '4'],
    ['volume', 'Объем эякулята, мл', '1.5'],
    ['leukocytes', 'Лейкоциты, млн/мл', '1'],
    ['fsh', 'ФСГ, МЕ/л', '7.6'],
    ['testosterone', 'Тестостерон, нмоль/л', '12'],
    ['testicularVolume', 'Объем яичка, мл', '15'],
    ['ph', 'pH эякулята', '7.2'],
    ['dfi', 'DFI, %', '25'],
    ['mar', 'MAR-test, %', '50'],
    ['tmc', 'TMC, млн', '10'],
    ['partnerAge', 'Возраст партнерши', '35'],
    ['artFailures', 'Неудачные ART циклы', '0'],
  ];

  const quickLinks = [
    ['Мужское бесплодие', () => onNavigate?.('andrology', 'fertility', 'male-infertility')],
    ['Варикоцеле', () => onNavigate?.('andrology', 'fertility', 'varicocele')],
    ['Гипогонадизм', () => onNavigate?.('andrology', 'endocrine', 'hypogonadism')],
    ['Азооспермия', () => onNavigate?.('andrology', 'fertility', 'azoospermia')],
    ['Олигозооспермия', () => onNavigate?.('andrology', 'fertility', 'oligospermia')],
    ['Астенозооспермия', () => onNavigate?.('andrology', 'fertility', 'asthenozoospermia')],
    ['Тератозооспермия', () => onNavigate?.('andrology', 'fertility', 'teratozoospermia')],
    ['Препараты', () => onNavigate?.('drugs')],
  ];

  const activeNodes = assessment.nodes.filter((node) => node.status !== 'neutral');
  const focusNodes = activeNodes.length ? activeNodes : assessment.nodes.slice(0, 4);
  const pickUnique = (items) => [...new Set(items.filter(Boolean))].slice(0, 4);
  const diagnosticsRoute = pickUnique(focusNodes.flatMap((node) => node.diagnostics || []));
  const treatmentRoute = pickUnique(focusNodes.flatMap((node) => node.treatment || []));
  const nextStepsRoute = pickUnique(focusNodes.map((node) => node.nextStep));
  const decisionStages = [
    {
      step: '01',
      title: 'Качество образца',
      badge: 'до интерпретации',
      text: 'Сначала убедиться, что анализ можно клинически использовать, и не строить лечение по случайному единичному отклонению.',
      items: ['Проверить полноту введённых параметров', 'Сопоставить с анамнезом пары и сроком бесплодия', 'При пограничном профиле — повторить анализ в валидной лаборатории'],
    },
    {
      step: '02',
      title: 'Паттерн анализа',
      badge: assessment.severity,
      text: assessment.primaryPatternLabel,
      items: [assessment.summary],
    },
    {
      step: '03',
      title: 'Дообследование',
      badge: 'что проверить',
      text: 'Маршрут дообследования строится от ведущего паттерна, а не от одного числа в спермограмме.',
      items: diagnosticsRoute.length ? diagnosticsRoute : ['Анамнез, осмотр, гормоны, УЗИ/ТРУЗИ и генетика по клиническому сценарию'],
    },
    {
      step: '04',
      title: 'Коррекция / лечение',
      badge: 'первый шаг',
      text: 'Показывает, что можно корректировать до ART, и где нужно сразу направлять к репродуктивному урологу.',
      items: treatmentRoute.length ? treatmentRoute : ['Коррекция факторов риска, лечение причины и совместное планирование с репродуктологом'],
    },
    {
      step: '05',
      title: 'ART и follow-up',
      badge: 'решение пары',
      text: 'Финальный маршрут: наблюдение, IUI/IVF/ICSI, sperm retrieval или донорские опции обсуждаются как клинические варианты.',
      items: nextStepsRoute.length ? nextStepsRoute : ['Контроль динамики, консультация пары и выбор репродуктивного маршрута'],
    },
  ];

  return (
    <article className="tool-section spermogram-premium-shell" style={{ borderColor: '#e7c06b55' }}>
      <div className="spermogram-head">
        <div>
          <span className="premium-questionnaire-kicker">WHO + EAU + AUA/ASRM + ESHRE + RU</span>
          <h3 className="tool-title" style={{ color: '#e7c06b' }}>Спермограмма: дерево решений</h3>
        </div>
        <button className="calc-button premium-calc-btn sperm-reset-btn" onClick={reset}>Сбросить</button>
      </div>

      <div className="spermogram-summary-card" data-status={assessment.severity}>
        <span>Ведущий паттерн</span>
        <strong>{assessment.primaryPatternLabel}</strong>
        <p>{assessment.summary}</p>
        <div className="sperm-source-row">
          {assessment.referenceBadges.map((badge) => <span key={badge}>{badge}</span>)}
        </div>
      </div>

      <div className="spermogram-decision-board" aria-label="Практическое дерево решений по спермограмме">
        {decisionStages.map((stage) => (
          <section key={stage.step} className={`spermogram-board-stage is-${assessment.severity}`}>
            <div className="spermogram-board-head">
              <span>{stage.step}</span>
              <small>{stage.badge}</small>
            </div>
            <h4>{stage.title}</h4>
            <p>{stage.text}</p>
            <ul>
              {stage.items.map((item) => <li key={`${stage.step}-${item}`}>{item}</li>)}
            </ul>
          </section>
        ))}
      </div>

      <div className="spermogram-route-note">
        <strong>Как пользоваться:</strong> идите слева направо по этапам, затем раскрывайте подробные узлы ниже. Это не ставит диагноз автоматически, а помогает выбрать дообследование, лечение и ART-маршрут по современным рекомендациям.
      </div>

      <div className="form-grid premium-form-grid spermogram-input-grid">
        {inputFields.map(([field, label, placeholder]) => (
          <Field key={field} label={label}>
            <input type="number" step="0.1" value={form[field]} onChange={(e) => updateField(field, e.target.value)} placeholder={placeholder} />
          </Field>
        ))}
        <Field label="Фруктоза">
          <select value={form.fructose} onChange={(e) => updateField('fructose', e.target.value)}>
            <option value="unknown">Не указана</option>
            <option value="normal">Норма</option>
            <option value="low">Снижена</option>
          </select>
        </Field>
        <Field label="Клиническое варикоцеле">
          <select value={form.varicocele} onChange={(e) => updateField('varicocele', e.target.value)}>
            <option value="unknown">Не указано</option>
            <option value="no">Нет</option>
            <option value="yes">Да</option>
          </select>
        </Field>
      </div>

      <div className="sperm-tree-map" aria-label="Полное дерево решений по спермограмме">
        {assessment.nodes.map((node) => (
          <details key={node.id} className={`sperm-tree-node level-${node.level} is-${node.status}`} open={node.status !== 'neutral'}>
            <summary>
              <span className="sperm-node-level">L{node.level}</span>
              <span className="sperm-node-title">{node.title}</span>
              <span className="sperm-node-status">{node.status}</span>
            </summary>
            <div className="sperm-node-body">
              <p><strong>Условие:</strong> {node.condition}</p>
              <p><strong>Клинический смысл:</strong> {node.clinicalMeaning}</p>
              <div className="sperm-node-grid">
                <div>
                  <h4>Проверить</h4>
                  <ul>{node.diagnostics.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
                <div>
                  <h4>Действие</h4>
                  <ul>{node.treatment.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              </div>
              <div className="sperm-node-next"><strong>Следующий шаг:</strong> {node.nextStep}</div>
              <div className="sperm-node-avoid"><strong>Не пропустить:</strong> {node.avoid}</div>
              <div className="sperm-source-row">
                {node.sources.map((source) => <span key={`${node.id}-${source}`}>{assessment.sources[source]?.label || source}</span>)}
              </div>
            </div>
          </details>
        ))}
      </div>

      <div className="sperm-tree-linkbar">
        {quickLinks.map(([label, action]) => (
          <button key={label} className="sperm-tree-linkbtn" onClick={action}>{label}</button>
        ))}
      </div>
    </article>
  );
};

const calculators = [
  { id: 'ipss', name: 'IPSS', desc: 'СНМП / ДГПЖ', category: 'questionnaire' },
  { id: 'iief', name: 'IIEF-5', desc: 'Эректильная функция', category: 'questionnaire' },
  { id: 'pedt', name: 'PEDT', desc: 'Эякуляция', category: 'questionnaire' },
  { id: 'nih-cpsi', name: 'NIH-CPSI', desc: 'Хронический простатит', category: 'questionnaire' },
  { id: 'psa', name: 'ПСА', desc: 'Онкориск', category: 'calculator' },
  { id: 'egfr', name: 'eGFR', desc: 'Функция почек', category: 'calculator' },
  { id: 'capra', name: 'CAPRA', desc: 'Рак простаты', category: 'calculator' },
  { id: 'renal', name: 'R.E.N.A.L.', desc: 'Нефрометрия', category: 'calculator' },
  { id: 'diary', name: 'Дневник', desc: 'Мочеиспускания', category: 'tool' },
  { id: 'sperm-tree', name: 'Спермограмма', desc: 'Fertility tree', category: 'tool' },
];

const categories = [
  { id: 'questionnaire', label: 'Опросники' },
  { id: 'calculator', label: 'Калькуляторы' },
  { id: 'tool', label: 'Инструменты' },
];

function getCalculatorFromLocation() {
  if (typeof window === 'undefined') return 'sperm-tree';

  const requestedTool = new URLSearchParams(window.location.search).get('tool');
  return calculators.some((item) => item.id === requestedTool) ? requestedTool : 'sperm-tree';
}

const CalculatorsPage = ({ onNavigate }) => {
  const [activeCalc, setActiveCalc] = useState(getCalculatorFromLocation);
  const activeCategory = calculators.find((item) => item.id === activeCalc)?.category || 'tool';
  const activeTool = calculators.find((item) => item.id === activeCalc);

  useEffect(() => {
    const syncToolFromLocation = () => setActiveCalc(getCalculatorFromLocation());
    syncToolFromLocation();
    window.addEventListener('popstate', syncToolFromLocation);
    return () => window.removeEventListener('popstate', syncToolFromLocation);
  }, []);

  const selectCalculator = (calculatorId) => {
    setActiveCalc(calculatorId);
    if (typeof window !== 'undefined' && window.location.pathname === '/calculators') {
      const nextPath = `/calculators?tool=${encodeURIComponent(calculatorId)}`;
      if (`${window.location.pathname}${window.location.search}` !== nextPath) {
        window.history.replaceState(null, '', nextPath);
      }
    }
  };

  const heroActions = [
    { label: 'Маршрут по спермограмме', meta: 'Fertility decision tree', onClick: () => selectCalculator('sperm-tree') },
    { label: 'IIEF-5 для ЭД', meta: 'Sexual function screening', onClick: () => selectCalculator('iief') },
    { label: 'ПСА риск', meta: 'Oncology triage', onClick: () => selectCalculator('psa') },
    { label: 'Открыть андрологию', meta: 'Перейти к нозологиям', onClick: () => onNavigate('andrology', 'fertility', null, { source: 'service_calculators_hero' }) },
  ];

  return (
    <section className="section calculators-page service-page-shell" data-v20-calculator-flow="true" data-v21-tool-flow="true">
      <ServicePageHero
        eyebrow="Interactive toolkit"
        title="Калькуляторы и опросники"
        trustPills={['Questionnaires + calculators', 'Route-aware tools', 'Decision support']}
        stats={[
          { label: 'Инструментов', value: String(calculators.length) },
          { label: 'Активный фокус', value: activeTool?.name || 'Спермограмма' },
          { label: 'Роль', value: 'Clinical support' },
        ]}
        highlights={[
          'Опросники по LUTS, ЭД, простатиту и эякуляторным жалобам',
          'Калькуляторы для ПСА, eGFR, CAPRA и нефрометрии',
          'Полное дерево решений по спермограмме для fertility-маршрута',
        ]}
        actions={heroActions}
      />

      <div className="calc-tabs calculator-category-tabs">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`calc-tab calculator-category-tab ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => selectCalculator(calculators.find((item) => item.category === category.id)?.id || activeCalc)}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="calc-tabs calculator-tool-tabs">
        {calculators.filter((item) => item.category === activeCategory).map((item) => (
          <button key={item.id} className={`calc-tab calculator-tool-tab ${activeCalc === item.id ? 'active' : ''}`} onClick={() => selectCalculator(item.id)}>
            <span>{item.name}</span>
            <span className="calc-tab-desc">{item.desc}</span>
          </button>
        ))}
      </div>

      <div className="calculator-workbench-hint" data-v19-calculator-flow="true" data-v20-local-tool-result="true" data-local-only="true">
        <span>Local-only clinical support</span>
        <strong>Ввод → прогресс → интерпретация → следующий шаг</strong>
        <p>Инструменты помогают структурировать решение, не сохраняют персональные данные и не заменяют клиническую оценку врача.</p>
      </div>

      {activeCalc === 'ipss' && (
        <SimpleQuestionnaire
          title="IPSS - симптомы мочеиспускания"
          kicker="LUTS score"
          color={COLORS.blue}
          questions={ipssQuestions}
          getOptions={(question) => (question.night ? nocturiaOptions : ipssOptions)}
          getResult={(answers) => {
            const total = Object.values(answers).reduce((sum, value) => sum + value, 0);
            const result = calcSeverity(total, [
              { max: 7, label: 'Легкие симптомы', color: COLORS.green },
              { max: 19, label: 'Умеренные симптомы', color: COLORS.blue },
              { max: 35, label: 'Тяжелые симптомы', color: COLORS.red },
            ]);
            return <><div className="result-score"><span className="score-value">{total}</span><span className="score-label">из 35</span></div><div className="result-item"><span>Категория:</span><strong style={{ color: result.color }}>{result.label}</strong></div></>;
          }}
        />
      )}
      {activeCalc === 'iief' && (
        <SimpleQuestionnaire
          title="IIEF-5 - эректильная функция"
          kicker="Sexual function"
          color={COLORS.gold}
          questions={iiefQuestions}
          getOptions={() => iiefOptions}
          getResult={(answers) => {
            const total = Object.values(answers).reduce((sum, value) => sum + value, 0);
            const result = calcSeverity(total, [
              { max: 7, label: 'Тяжелая ЭД', color: COLORS.red },
              { max: 11, label: 'Умеренная ЭД', color: COLORS.gold },
              { max: 16, label: 'Легко-умеренная ЭД', color: COLORS.blue },
              { max: 21, label: 'Легкая ЭД', color: COLORS.green },
              { max: 25, label: 'Норма', color: COLORS.green },
            ]);
            return <><div className="result-score"><span className="score-value">{total}</span><span className="score-label">из 25</span></div><div className="result-item"><span>Категория:</span><strong style={{ color: result.color }}>{result.label}</strong></div></>;
          }}
        />
      )}
      {activeCalc === 'pedt' && (
        <SimpleQuestionnaire
          title="PEDT - преждевременная эякуляция"
          kicker="Ejaculation score"
          color={COLORS.violet}
          questions={pedtQuestions}
          getOptions={() => pedtOptions}
          getResult={(answers) => {
            const total = Object.values(answers).reduce((sum, value) => sum + value, 0);
            const result = total <= 8 ? 'Маловероятно' : total <= 10 ? 'Вероятно' : 'Высокая вероятность';
            return <><div className="result-score"><span className="score-value">{total}</span><span className="score-label">из 20</span></div><div className="result-item"><span>Интерпретация:</span><strong>{result}</strong></div></>;
          }}
        />
      )}
      {activeCalc === 'nih-cpsi' && (
        <SimpleQuestionnaire
          title="NIH-CPSI - хронический простатит"
          kicker="Pain + LUTS + QoL"
          color={COLORS.red}
          questions={nihQuestions}
          getOptions={(question) => question.options.map((value) => ({ value, label: String(value) }))}
          getResult={(answers) => {
            const total = Object.values(answers).reduce((sum, value) => sum + value, 0);
            return <><div className="result-score"><span className="score-value">{total}</span><span className="score-label">баллов</span></div><div className="result-item"><span>Фокус:</span><strong>Оценить боль, мочевые симптомы и влияние на качество жизни</strong></div></>;
          }}
        />
      )}
      {activeCalc === 'psa' && <PSACalculator />}
      {activeCalc === 'egfr' && <EGFRCalculator />}
      {activeCalc === 'capra' && <ScoreGrid title="CAPRA - риск рака простаты" color={COLORS.red} fields={capraFields} resultLabel={(total) => (total <= 2 ? 'Низкий риск' : total <= 4 ? 'Умеренный риск' : total <= 6 ? 'Высокий риск' : 'Очень высокий риск')} />}
      {activeCalc === 'renal' && <ScoreGrid title="R.E.N.A.L. - нефрометрия" color={COLORS.green} fields={renalFields} resultLabel={(total) => (total <= 6 ? 'Низкая сложность' : total <= 9 ? 'Умеренная сложность' : 'Высокая сложность')} />}
      {activeCalc === 'diary' && <VoidingDiary />}
      {activeCalc === 'sperm-tree' && <SpermogramPathway onNavigate={onNavigate} />}
    </section>
  );
};

export default CalculatorsPage;

import React, { useEffect, useMemo, useState } from 'react';
import '../styles/servicePages.css';
import { useGameProgress } from '../hooks/useLocalStorage';

const gameCatalog = [
  {
    id: 'diagnosis-duel',
    progressKey: 'diagnosisDuel',
    title: 'Diagnosis Duel',
    genre: 'Клинический кейс',
    badge: 'Интерактивный модуль',
    objective: 'Выбрать полезные исследования и подтвердить диагноз без лишних действий.',
    learning: 'Дифференциальная диагностика и клиническое мышление.',
    accent: 'gold',
  },
  {
    id: 'stone-crusher',
    progressKey: 'stoneCrusher',
    title: 'Stone Crusher',
    genre: 'Аркадная симуляция',
    badge: 'Интерактивный модуль',
    objective: 'Разрушить камень, сохранив безопасный уровень нагрузки на ткани.',
    learning: 'Логика выбора инструмента и контроль рисков.',
    accent: 'teal',
  },
  {
    id: 'prostate-defender',
    progressKey: 'prostateDefender',
    title: 'Prostate Defender',
    genre: 'Тактическая игра',
    badge: 'Интерактивный модуль',
    objective: 'Сдержать клиническую угрозу и сохранить резерв терапии.',
    learning: 'Приоритеты лечения и тайминг вмешательств.',
    accent: 'violet',
  },
  {
    id: 'uro-endo-sim',
    progressKey: 'uroEndoSim',
    title: 'Uro-Endo Sim',
    genre: 'Процедурный тренажёр',
    badge: 'Интерактивный модуль',
    objective: 'Держать инструмент в безопасном коридоре и завершить этап без потери контроля.',
    learning: 'Плавность движений и procedural safety.',
    accent: 'cyan',
  },
];

const duelCases = [
  {
    id: 'renal-colic',
    title: 'Боль в пояснице и гематурия',
    prompt: 'Мужчина 42 лет. Острая боль в пояснице с иррадиацией в пах, микрогематурия, температуры нет.',
    symptoms: ['Коликообразная боль', 'Иррадиация в пах', 'Микрогематурия'],
    investigations: [
      { id: 'ct', label: 'КТ без контраста', useful: true, text: 'Конкремент 6 мм в дистальном отделе мочеточника.' },
      { id: 'urine', label: 'Общий анализ мочи', useful: true, text: 'Эритроцитурия без выраженной лейкоцитурии.' },
      { id: 'cystoscopy', label: 'Цистоскопия', useful: false, text: 'Инвазивно и не относится к исследованиям первой линии.' },
    ],
    diagnoses: ['Почечная колика', 'Острый пиелонефрит', 'Рак мочевого пузыря'],
    correct: 'Почечная колика',
    rationale: 'Картина типична для уретеролитиаза: колика, гематурия и отсутствие системной воспалительной реакции.',
  },
  {
    id: 'pyelonephritis',
    title: 'Лихорадка и боль в боку',
    prompt: 'Женщина 31 года. Температура 38.9, озноб, боль в пояснице, дизурия, лейкоцитоз.',
    symptoms: ['Лихорадка', 'Боль в боку', 'Дизурия'],
    investigations: [
      { id: 'culture', label: 'Посев мочи', useful: true, text: 'Рост E. coli более 10^5 КОЕ/мл.' },
      { id: 'cbc', label: 'Общий анализ крови', useful: true, text: 'Лейкоцитоз и повышение CRP.' },
      { id: 'psa', label: 'ПСА', useful: false, text: 'Не даёт диагностической ценности в этом сценарии.' },
    ],
    diagnoses: ['Острый пиелонефрит', 'Интерстициальный цистит', 'Почечная колика'],
    correct: 'Острый пиелонефрит',
    rationale: 'Системная воспалительная реакция и локальная симптоматика делают пиелонефрит наиболее вероятным диагнозом.',
  },
  {
    id: 'bph',
    title: 'Симптомы нижних мочевых путей',
    prompt: 'Мужчина 68 лет. Никтурия, слабая струя, затруднённое начало мочеиспускания, без боли и температуры.',
    symptoms: ['Никтурия', 'Слабая струя', 'Затруднённое мочеиспускание'],
    investigations: [
      { id: 'ipss', label: 'IPSS', useful: true, text: 'Высокий балл симптомов, выраженные СНМП.' },
      { id: 'ultrasound', label: 'УЗИ с остаточной мочой', useful: true, text: 'Увеличение простаты, остаточная моча 90 мл.' },
      { id: 'biopsy', label: 'Биопсия почки', useful: false, text: 'Не соответствует клинической задаче первой линии.' },
    ],
    diagnoses: ['ДГПЖ', 'Острый простатит', 'Рак почки'],
    correct: 'ДГПЖ',
    rationale: 'Набор симптомов типичен для ДГПЖ и обструктивных СНМП.',
  },
];

const stoneLevels = [
  {
    id: 'distal-ureter',
    title: 'Дистальный камень мочеточника',
    composition: 'Урат',
    size: '5 мм',
    density: 38,
    tissueLimit: 78,
    bestTools: ['endoscope', 'lithotripter'],
    educational: 'Для уратных камней важны щадящие режимы и последующая метафилактика.',
  },
  {
    id: 'oxalate',
    title: 'Плотный оксалатный камень',
    composition: 'Оксалат кальция',
    size: '9 мм',
    density: 62,
    tissueLimit: 72,
    bestTools: ['laser'],
    educational: 'Оксалатные камни плотнее, поэтому растут требования к мощности и контролю перегрева.',
  },
  {
    id: 'staghorn',
    title: 'Коралловидный фрагмент',
    composition: 'Фосфатный / mixed',
    size: '18 мм',
    density: 86,
    tissueLimit: 68,
    bestTools: ['laser', 'lithotripter'],
    educational: 'Коралловидные и инфекционные камни требуют дальнейшей профилактики рецидива и контроля инфекции.',
  },
];

const stoneTools = [
  { id: 'laser', label: 'Лазер', power: 26, heat: 16 },
  { id: 'lithotripter', label: 'Литотриптер', power: 21, heat: 10 },
  { id: 'endoscope', label: 'Эндоскоп', power: 16, heat: 7 },
];

const defenderWaves = [
  {
    id: 'infectious-wave',
    title: 'Острый инфекционный эпизод',
    enemies: 'E. coli / воспалительная волна',
    hp: 74,
    educational: 'Ранний контроль инфекции и декомпрессия дают максимальный выигрыш.',
  },
  {
    id: 'bph-wave',
    title: 'Прогрессирующая гиперплазия',
    enemies: 'Давление ДГПЖ / симптоматическая обструкция',
    hp: 88,
    educational: 'При хроническом процессе важна комбинация symptomatic relief и долгосрочного контроля.',
  },
  {
    id: 'tumor-wave',
    title: 'Опухолевое давление T3',
    enemies: 'Locally advanced tumor',
    hp: 108,
    educational: 'Высокое опухолевое давление требует сочетания контроля симптомов и быстрой диагностики.',
  },
];

const defenderTools = [
  { id: 'antibiotic', label: 'Антибиотики', damage: 22, reserveCost: 12, recovery: 0, note: 'Сильнее против инфекционной волны.' },
  { id: 'alpha-blocker', label: 'Альфа-блокаторы', damage: 16, reserveCost: 10, recovery: 4, note: 'Снижают динамическую обструкцию.' },
  { id: 'immunotherapy', label: 'Иммунотерапия', damage: 18, reserveCost: 14, recovery: 0, note: 'Подходит для опухолевого сценария.' },
  { id: 'diagnostics', label: 'Диагностика', damage: 10, reserveCost: 8, recovery: 8, note: 'Снижает неопределённость и возвращает контроль.' },
];

const endoStages = [
  {
    id: 'cystoscopy',
    title: 'Цистоскопия',
    idealRange: [44, 62],
    educational: 'Плавное движение даёт лучшую визуализацию и снижает риск травмы.',
  },
  {
    id: 'ureteroscopy',
    title: 'Уретероскопия',
    idealRange: [48, 60],
    educational: 'Точность и спокойная коррекция курса важнее агрессивного продвижения.',
  },
  {
    id: 'stenting',
    title: 'Стентирование',
    idealRange: [40, 58],
    educational: 'Контроль глубины и темпа движения уменьшает травматичность.',
  },
];

const difficultyPresets = {
  standard: { label: 'Базовый', scoreBoost: 1, riskMultiplier: 1, reservePenalty: 0 },
  expert: { label: 'Экспертный', scoreBoost: 1.2, riskMultiplier: 1.15, reservePenalty: 6 },
  board: { label: 'Сложный разбор', scoreBoost: 1.35, riskMultiplier: 1.3, reservePenalty: 12 },
};

const HeroMetric = ({ value, label }) => (
  <div className="games-hero-metric">
    <strong>{value}</strong>
    <span>{label}</span>
  </div>
);

const DifficultySwitcher = ({ difficulty, setDifficulty, disabled }) => (
  <div className="game-difficulty-switcher">
    {Object.entries(difficultyPresets).map(([key, preset]) => (
      <button
        key={key}
        className={`game-difficulty-btn ${difficulty === key ? 'active' : ''}`}
        onClick={() => setDifficulty(key)}
        disabled={disabled}
      >
        {preset.label}
      </button>
    ))}
  </div>
);

const GameStageShell = ({ kicker, title, description, difficulty, setDifficulty, scoreLabel, score, onBack, disabledDifficulty, children }) => (
  <div className="game-stage">
    <div className="game-stage-head">
      <div>
        <span className="game-stage-kicker">{kicker}</span>
        <h2>{title}</h2>
        <p>{description}</p>
        <DifficultySwitcher difficulty={difficulty} setDifficulty={setDifficulty} disabled={disabledDifficulty} />
      </div>
      <div className="game-stage-actions">
        <div className="duel-score-card">
          <span className="duel-score-label">{scoreLabel}</span>
          <strong>{score}</strong>
        </div>
        <button className="game-stage-back" onClick={onBack}>К хабу игр</button>
      </div>
    </div>
    {children}
  </div>
);

const DiagnosisDuelGame = ({ onBack, onRecordScore }) => {
  const [caseIndex, setCaseIndex] = useState(0);
  const [revealed, setRevealed] = useState([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState('');
  const [resolved, setResolved] = useState(false);
  const [score, setScore] = useState(100);
  const [difficulty, setDifficulty] = useState('standard');

  const currentCase = duelCases[caseIndex];
  const revealedSet = useMemo(() => new Set(revealed), [revealed]);

  const revealInvestigation = (investigation) => {
    if (resolved || revealedSet.has(investigation.id)) return;
    const preset = difficultyPresets[difficulty];
    const penalty = investigation.useful ? 8 : 16;
    setRevealed((prev) => [...prev, investigation.id]);
    setScore((prev) => Math.max(prev - Math.round(penalty * preset.riskMultiplier), 0));
  };

  const submitDiagnosis = () => {
    if (!selectedDiagnosis || resolved) return;
    const preset = difficultyPresets[difficulty];
    const isCorrect = selectedDiagnosis === currentCase.correct;
    const delta = Math.round((isCorrect ? 24 : -20) * preset.scoreBoost);
    const finalScore = Math.max(score + delta, 0);
    setScore(finalScore);
    setResolved(true);
    onRecordScore?.('diagnosisDuel', finalScore, isCorrect);
  };

  const nextCase = () => {
    setCaseIndex((prev) => (prev + 1) % duelCases.length);
    setRevealed([]);
    setSelectedDiagnosis('');
    setResolved(false);
    setScore(100);
  };

  return (
    <GameStageShell
      kicker="Игровая симуляция"
      title="Diagnosis Duel"
      description="Открывай только полезные исследования и подтверждай диагноз до того, как клинический счёт просядет."
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      scoreLabel="Клинический счёт"
      score={score}
      onBack={onBack}
      disabledDifficulty={revealed.length > 0 || resolved}
    >
      <div className="duel-grid">
        <div className="duel-case-card">
          <span className="duel-case-index">Case {caseIndex + 1}</span>
          <h3>{currentCase.title}</h3>
          <p>{currentCase.prompt}</p>
          <div className="duel-chip-group">
            {currentCase.symptoms.map((symptom) => (
              <span key={symptom} className="duel-chip">{symptom}</span>
            ))}
          </div>
        </div>

        <div className="duel-board-card">
          <div className="duel-board-section">
            <div className="duel-board-title">Исследования</div>
            <div className="duel-investigation-list">
              {currentCase.investigations.map((investigation) => (
                <button
                  key={investigation.id}
                  className={`duel-investigation-btn ${revealedSet.has(investigation.id) ? 'revealed' : ''}`}
                  onClick={() => revealInvestigation(investigation)}
                >
                  <span>{investigation.label}</span>
                  <small>{revealedSet.has(investigation.id) ? investigation.text : 'Открыть результат исследования'}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="duel-board-section">
            <div className="duel-board-title">Диагноз</div>
            <div className="duel-diagnosis-list">
              {currentCase.diagnoses.map((diagnosis) => (
                <button
                  key={diagnosis}
                  className={`duel-diagnosis-btn ${selectedDiagnosis === diagnosis ? 'active' : ''}`}
                  onClick={() => setSelectedDiagnosis(diagnosis)}
                  disabled={resolved}
                >
                  {diagnosis}
                </button>
              ))}
            </div>
            <button className="duel-submit-btn" onClick={submitDiagnosis} disabled={!selectedDiagnosis || resolved}>
              Подтвердить диагноз
            </button>
          </div>
        </div>
      </div>

      {resolved && (
        <div className="duel-result-card">
          <div className="duel-result-topline">
            <span className={`duel-result-status ${selectedDiagnosis === currentCase.correct ? 'success' : 'danger'}`}>
              {selectedDiagnosis === currentCase.correct ? 'Диагноз подтверждён' : 'Диагноз неверный'}
            </span>
            <strong>Правильный ответ: {currentCase.correct}</strong>
          </div>
          <p>{currentCase.rationale}</p>
          <div className="duel-result-actions">
            <button className="duel-next-btn" onClick={nextCase}>Следующий кейс</button>
          </div>
        </div>
      )}
    </GameStageShell>
  );
};

const StoneCrusherGame = ({ onBack, onRecordScore }) => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [selectedTool, setSelectedTool] = useState('laser');
  const [stoneIntegrity, setStoneIntegrity] = useState(100);
  const [tissueHeat, setTissueHeat] = useState(16);
  const [energy, setEnergy] = useState(100);
  const [renalStress, setRenalStress] = useState(0);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('idle');
  const [difficulty, setDifficulty] = useState('standard');

  const level = stoneLevels[levelIndex];
  const tool = stoneTools.find((item) => item.id === selectedTool);

  const resetLevel = () => {
    setStoneIntegrity(100);
    setTissueHeat(16);
    setEnergy(100);
    setRenalStress(0);
    setCombo(0);
    setScore(0);
    setStatus('idle');
    setSelectedTool('laser');
  };

  const nextLevel = () => {
    setLevelIndex((prev) => (prev + 1) % stoneLevels.length);
    resetLevel();
  };

  const strike = () => {
    if (status !== 'idle') return;
    const preset = difficultyPresets[difficulty];
    const optimalTool = level.bestTools.includes(tool.id);
    const damage = Math.round(tool.power * (optimalTool ? 1.1 : 0.88) * preset.scoreBoost);
    const heatGain = Math.round(tool.heat * preset.riskMultiplier);
    const energyCost = 10 + (tool.id === 'laser' ? 3 : 0) + preset.reservePenalty;
    const nextIntegrity = Math.max(stoneIntegrity - damage, 0);
    const nextHeat = Math.min(tissueHeat + heatGain, 100);
    const nextEnergy = Math.max(energy - energyCost, 0);
    const nextStress = Math.min(renalStress + Math.round(heatGain / 2), 100);
    const nextCombo = combo + 1;
    const nextScore = score + damage + nextCombo * 4;

    setStoneIntegrity(nextIntegrity);
    setTissueHeat(nextHeat);
    setEnergy(nextEnergy);
    setRenalStress(nextStress);
    setCombo(nextCombo);
    setScore(nextScore);

    if (nextIntegrity === 0) {
      const finalScore = nextScore + nextEnergy;
      setScore(finalScore);
      setStatus('completed');
      onRecordScore?.('stoneCrusher', finalScore, true);
      return;
    }

    if (nextHeat >= level.tissueLimit || nextEnergy === 0 || nextStress >= 85) {
      setStatus('failed');
      onRecordScore?.('stoneCrusher', nextScore, false);
    }
  };

  const coolDown = () => {
    if (status !== 'idle') return;
    setTissueHeat((prev) => Math.max(prev - 18, 0));
    setEnergy((prev) => Math.max(prev - 6, 0));
    setRenalStress((prev) => Math.max(prev - 10, 0));
    setCombo(0);
  };

  return (
    <GameStageShell
      kicker="Аркадная симуляция"
      title="Stone Crusher"
      description="Подбирай инструмент, следи за перегревом и не трать ресурс системы впустую."
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      scoreLabel="Счёт дробления"
      score={score}
      onBack={onBack}
      disabledDifficulty={status !== 'idle' || combo > 0}
    >
      <div className="stone-grid">
        <div className="stone-panel stone-panel-level">
          <span className="duel-case-index">Level {levelIndex + 1}</span>
          <h3>{level.title}</h3>
          <p>{level.composition} · {level.size}</p>

          <div className="stone-metrics">
            <div className="stone-metric"><span>Плотность</span><strong>{level.density}%</strong></div>
            <div className="stone-metric"><span>Предел тканей</span><strong>{level.tissueLimit}%</strong></div>
            <div className="stone-metric"><span>Комбо</span><strong>x{combo}</strong></div>
          </div>

          <div className="stone-visual-shell">
            <div className="stone-visual-core" style={{ width: `${Math.max(stoneIntegrity, 16)}%`, opacity: Math.max(stoneIntegrity / 100, 0.25) }} />
            <div className="stone-visual-ring" />
          </div>

          <div className="stone-bars">
            <div className="stone-bar-group">
              <span>Целостность камня</span>
              <div className="stone-bar"><div className="stone-bar-fill stone-bar-fill-gold" style={{ width: `${stoneIntegrity}%` }} /></div>
            </div>
            <div className="stone-bar-group">
              <span>Перегрев тканей</span>
              <div className="stone-bar"><div className="stone-bar-fill stone-bar-fill-danger" style={{ width: `${tissueHeat}%` }} /></div>
            </div>
            <div className="stone-bar-group">
              <span>Энергия системы</span>
              <div className="stone-bar"><div className="stone-bar-fill stone-bar-fill-teal" style={{ width: `${energy}%` }} /></div>
            </div>
            <div className="stone-bar-group">
              <span>Нагрузка на почку</span>
              <div className="stone-bar"><div className="stone-bar-fill stone-bar-fill-danger" style={{ width: `${renalStress}%` }} /></div>
            </div>
          </div>
        </div>

        <div className="stone-panel stone-panel-controls">
          <div className="duel-board-title">Инструменты</div>
          <div className="stone-tool-grid">
            {stoneTools.map((item) => (
              <button
                key={item.id}
                className={`stone-tool-btn ${selectedTool === item.id ? 'active' : ''}`}
                onClick={() => setSelectedTool(item.id)}
                disabled={status !== 'idle'}
              >
                <strong>{item.label}</strong>
                <small>Мощность {item.power} · Нагрев {item.heat}</small>
              </button>
            ))}
          </div>

          <div className="stone-action-grid">
            <button className="duel-submit-btn stone-strike-btn" onClick={strike} disabled={status !== 'idle'}>
              Импульс дробления
            </button>
            <button className="game-stage-back stone-cool-btn" onClick={coolDown} disabled={status !== 'idle'}>
              Охладить и стабилизировать
            </button>
          </div>

          <div className="stone-status-card">
            <span className="game-learning-label">Подсказка</span>
            <p>
              {status === 'completed'
                ? 'Камень успешно фрагментирован. Теперь важны разбор кейса и профилактика рецидива.'
                : status === 'failed'
                  ? 'Сеанс прерван: вышли за пределы безопасной нагрузки.'
                  : level.bestTools.includes(tool.id)
                    ? `${tool.label} сейчас выглядит оптимальным выбором для этого состава.`
                    : `${tool.label} допустим, но следите за нагревом и чаще охлаждайте систему.`}
            </p>
          </div>
        </div>
      </div>

      {(status === 'completed' || status === 'failed') && (
        <div className="duel-result-card stone-result-card">
          <div className="duel-result-topline">
            <span className={`duel-result-status ${status === 'completed' ? 'success' : 'danger'}`}>
              {status === 'completed' ? 'Камень разрушен' : 'Сеанс прерван'}
            </span>
            <strong>{level.title}</strong>
          </div>
          <p>{level.educational}</p>
          <div className="stone-result-actions">
            <button className="game-stage-back stone-cool-btn" onClick={resetLevel}>Повторить уровень</button>
            <button className="duel-next-btn" onClick={nextLevel}>Следующий кейс</button>
          </div>
        </div>
      )}
    </GameStageShell>
  );
};

const ProstateDefenderGame = ({ onBack, onRecordScore }) => {
  const [waveIndex, setWaveIndex] = useState(0);
  const [selectedDefense, setSelectedDefense] = useState('antibiotic');
  const [prostateHp, setProstateHp] = useState(100);
  const [threatHp, setThreatHp] = useState(defenderWaves[0].hp);
  const [clinicalReserve, setClinicalReserve] = useState(100);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('idle');
  const [difficulty, setDifficulty] = useState('standard');

  const wave = defenderWaves[waveIndex];
  const defense = defenderTools.find((item) => item.id === selectedDefense);

  useEffect(() => {
    setThreatHp(wave.hp);
    setProstateHp(100);
    setClinicalReserve(100);
    setScore(0);
    setStatus('idle');
    setSelectedDefense('antibiotic');
  }, [wave]);

  const deployDefense = () => {
    if (status !== 'idle') return;
    const preset = difficultyPresets[difficulty];
    const nextThreat = Math.max(threatHp - Math.round(defense.damage * preset.scoreBoost), 0);
    const nextReserve = Math.max(clinicalReserve - defense.reserveCost - preset.reservePenalty, 0);
    const nextProstate = Math.max(Math.min(prostateHp - Math.round(8 * preset.riskMultiplier) + defense.recovery, 100), 0);
    const nextScore = score + defense.damage * 3 + Math.max(nextProstate - 80, 0);

    setThreatHp(nextThreat);
    setClinicalReserve(nextReserve);
    setProstateHp(nextProstate);
    setScore(nextScore);

    if (nextThreat === 0) {
      const finalScore = nextScore + nextReserve;
      setScore(finalScore);
      setStatus('completed');
      onRecordScore?.('prostateDefender', finalScore, true);
      return;
    }

    if (nextReserve === 0 || nextProstate === 0) {
      setStatus('failed');
      onRecordScore?.('prostateDefender', nextScore, false);
    }
  };

  const stabilize = () => {
    if (status !== 'idle') return;
    setProstateHp((prev) => Math.min(prev + 10, 100));
    setClinicalReserve((prev) => Math.max(prev - 8, 0));
    setScore((prev) => Math.max(prev - 4, 0));
  };

  const nextWave = () => {
    setWaveIndex((prev) => (prev + 1) % defenderWaves.length);
  };

  return (
    <GameStageShell
      kicker="Стратегическая симуляция"
      title="Prostate Defender"
      description="Выстраивай тактику лечения, сдерживай клиническую угрозу и сохраняй резерв решений."
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      scoreLabel="Счёт защиты"
      score={score}
      onBack={onBack}
      disabledDifficulty={status !== 'idle' || score > 0}
    >
      <div className="stone-grid defender-grid">
        <div className="stone-panel stone-panel-level defender-arena">
          <span className="duel-case-index">Wave {waveIndex + 1}</span>
          <h3>{wave.title}</h3>
          <p>{wave.enemies}</p>

          <div className="stone-bars defender-bars">
            <div className="stone-bar-group">
              <span>Стабильность простаты</span>
              <div className="stone-bar"><div className="stone-bar-fill stone-bar-fill-teal" style={{ width: `${prostateHp}%` }} /></div>
            </div>
            <div className="stone-bar-group">
              <span>Давление угрозы</span>
              <div className="stone-bar"><div className="stone-bar-fill stone-bar-fill-danger" style={{ width: `${(threatHp / wave.hp) * 100}%` }} /></div>
            </div>
            <div className="stone-bar-group">
              <span>Клинический резерв</span>
              <div className="stone-bar"><div className="stone-bar-fill stone-bar-fill-gold" style={{ width: `${clinicalReserve}%` }} /></div>
            </div>
          </div>
        </div>

        <div className="stone-panel stone-panel-controls">
          <div className="duel-board-title">Инструменты ответа</div>
          <div className="stone-tool-grid">
            {defenderTools.map((item) => (
              <button
                key={item.id}
                className={`stone-tool-btn ${selectedDefense === item.id ? 'active' : ''}`}
                onClick={() => setSelectedDefense(item.id)}
                disabled={status !== 'idle'}
              >
                <strong>{item.label}</strong>
                <small>{item.note}</small>
              </button>
            ))}
          </div>

          <div className="stone-action-grid">
            <button className="duel-submit-btn stone-strike-btn" onClick={deployDefense} disabled={status !== 'idle'}>
              Применить тактику
            </button>
            <button className="game-stage-back stone-cool-btn" onClick={stabilize} disabled={status !== 'idle'}>
              Стабилизировать состояние
            </button>
          </div>

          <div className="stone-status-card">
            <span className="game-learning-label">Фокус этапа</span>
            <p>{wave.educational}</p>
          </div>
        </div>
      </div>

      {(status === 'completed' || status === 'failed') && (
        <div className="duel-result-card stone-result-card">
          <div className="duel-result-topline">
            <span className={`duel-result-status ${status === 'completed' ? 'success' : 'danger'}`}>
              {status === 'completed' ? 'Волна сдержана' : 'Угроза вышла из-под контроля'}
            </span>
            <strong>{wave.title}</strong>
          </div>
          <p>{wave.educational}</p>
          <div className="stone-result-actions">
            <button className="game-stage-back stone-cool-btn" onClick={() => setWaveIndex(waveIndex)}>Повторить волну</button>
            <button className="duel-next-btn" onClick={nextWave}>Следующая волна</button>
          </div>
        </div>
      )}
    </GameStageShell>
  );
};

const UroEndoSimGame = ({ onBack, onRecordScore }) => {
  const [stageIndex, setStageIndex] = useState(0);
  const [alignment, setAlignment] = useState(50);
  const [progress, setProgress] = useState(0);
  const [precision, setPrecision] = useState(100);
  const [safety, setSafety] = useState(100);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('idle');
  const [difficulty, setDifficulty] = useState('standard');

  const stage = endoStages[stageIndex];

  useEffect(() => {
    setAlignment(50);
    setProgress(0);
    setPrecision(100);
    setSafety(100);
    setScore(0);
    setStatus('idle');
  }, [stage]);

  const nudge = (delta) => {
    if (status !== 'idle') return;
    const preset = difficultyPresets[difficulty];
    const nextAlignment = Math.min(Math.max(alignment + delta, 0), 100);
    const [min, max] = stage.idealRange;
    const withinRange = nextAlignment >= min && nextAlignment <= max;
    const nextProgress = Math.min(progress + (withinRange ? 24 : 12), 100);
    const nextPrecision = Math.max(precision - (withinRange ? 4 : Math.round(12 * preset.riskMultiplier)), 0);
    const nextSafety = Math.max(safety - (withinRange ? 3 : Math.round(14 * preset.riskMultiplier)), 0);
    const nextScore = score + Math.round((withinRange ? 26 : 10) * preset.scoreBoost);

    setAlignment(nextAlignment);
    setProgress(nextProgress);
    setPrecision(nextPrecision);
    setSafety(nextSafety);
    setScore(nextScore);

    if (nextProgress >= 100) {
      const finalScore = nextScore + nextSafety;
      setScore(finalScore);
      setStatus('completed');
      onRecordScore?.('uroEndoSim', finalScore, true);
      return;
    }

    if (nextPrecision <= 0 || nextSafety <= 0) {
      setStatus('failed');
      onRecordScore?.('uroEndoSim', nextScore, false);
    }
  };

  const stabilizeScope = () => {
    if (status !== 'idle') return;
    setPrecision((prev) => Math.min(prev + 10, 100));
    setSafety((prev) => Math.min(prev + 8, 100));
    setAlignment((prev) => Math.min(Math.max(prev + (50 - prev) * 0.35, 0), 100));
  };

  const nextStage = () => {
    setStageIndex((prev) => (prev + 1) % endoStages.length);
  };

  return (
    <GameStageShell
      kicker="Тренажёр процедуры"
      title="Uro-Endo Sim"
      description="Держи курсор в безопасном коридоре и заверши этап без потери точности и контроля."
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      scoreLabel="Счёт процедуры"
      score={score}
      onBack={onBack}
      disabledDifficulty={status !== 'idle' || progress > 0}
    >
      <div className="stone-grid uro-endo-grid">
        <div className="stone-panel stone-panel-level uro-endo-arena">
          <span className="duel-case-index">Stage {stageIndex + 1}</span>
          <h3>{stage.title}</h3>
          <p>Оптимальный коридор: {stage.idealRange[0]}-{stage.idealRange[1]}% стабильности движения.</p>

          <div className="endo-track-shell">
            <div className="endo-track-zone endo-track-zone-optimal" style={{ left: `${stage.idealRange[0]}%`, width: `${stage.idealRange[1] - stage.idealRange[0]}%` }} />
            <div className="endo-track-cursor" style={{ left: `${alignment}%` }} />
          </div>

          <div className="stone-bars">
            <div className="stone-bar-group">
              <span>Прогресс процедуры</span>
              <div className="stone-bar"><div className="stone-bar-fill stone-bar-fill-gold" style={{ width: `${progress}%` }} /></div>
            </div>
            <div className="stone-bar-group">
              <span>Точность инструмента</span>
              <div className="stone-bar"><div className="stone-bar-fill stone-bar-fill-teal" style={{ width: `${precision}%` }} /></div>
            </div>
            <div className="stone-bar-group">
              <span>Безопасность тканей</span>
              <div className="stone-bar"><div className="stone-bar-fill stone-bar-fill-danger" style={{ width: `${safety}%` }} /></div>
            </div>
          </div>
        </div>

        <div className="stone-panel stone-panel-controls">
          <div className="duel-board-title">Управление эндоскопом</div>
          <div className="endo-controls-grid">
            <button className="stone-tool-btn" onClick={() => nudge(-12)} disabled={status !== 'idle'}>
              <strong>Сместиться влево</strong>
              <small>Мягкая коррекция траектории</small>
            </button>
            <button className="stone-tool-btn" onClick={() => nudge(12)} disabled={status !== 'idle'}>
              <strong>Сместиться вправо</strong>
              <small>Мягкая коррекция траектории</small>
            </button>
            <button className="duel-submit-btn stone-strike-btn" onClick={() => nudge(0)} disabled={status !== 'idle'}>
              Продвинуться по оси
            </button>
            <button className="game-stage-back stone-cool-btn" onClick={stabilizeScope} disabled={status !== 'idle'}>
              Стабилизировать обзор
            </button>
          </div>

          <div className="stone-status-card">
            <span className="game-learning-label">Подсказка тренажёра</span>
            <p>
              {status === 'completed'
                ? 'Процедура завершена в безопасном коридоре. Это ключ к атравматичному выполнению.'
                : status === 'failed'
                  ? 'Симуляция прервана: точность или безопасность упали ниже рабочего порога.'
                  : 'Короткие стабильные движения обычно лучше, чем агрессивные коррекции.'}
            </p>
          </div>
        </div>
      </div>

      {(status === 'completed' || status === 'failed') && (
        <div className="duel-result-card stone-result-card">
          <div className="duel-result-topline">
            <span className={`duel-result-status ${status === 'completed' ? 'success' : 'danger'}`}>
              {status === 'completed' ? 'Процедура выполнена' : 'Процедура прервана'}
            </span>
            <strong>{stage.title}</strong>
          </div>
          <p>{stage.educational}</p>
          <div className="stone-result-actions">
            <button className="game-stage-back stone-cool-btn" onClick={() => setStageIndex(stageIndex)}>Повторить этап</button>
            <button className="duel-next-btn" onClick={nextStage}>Следующий этап</button>
          </div>
        </div>
      )}
    </GameStageShell>
  );
};

const GamesHub = ({ gameProgress, onNavigate }) => {
  const totalCompletions = Object.values(gameProgress).reduce((sum, game) => sum + (game?.completions || 0), 0);
  const bestOverallScore = Math.max(0, ...Object.values(gameProgress).map((game) => game?.bestScore || 0));
  const achievements = [
    { id: 'first-win', label: 'Первый успех', unlocked: totalCompletions >= 1 },
    { id: 'triple-core', label: 'Тройной контур', unlocked: ['diagnosisDuel', 'stoneCrusher', 'prostateDefender'].every((id) => (gameProgress[id]?.completions || 0) > 0) },
    { id: 'precision-run', label: 'Точная рука', unlocked: (gameProgress.uroEndoSim?.bestScore || 0) >= 150 },
  ];

  return (
    <section className="section games-page">
      <div className="games-hero">
        <div className="games-hero-copy">
          <span className="games-kicker">Интерактивное обучение</span>
          <h1 className="games-title">UroMed PlayLab</h1>
          <p className="games-subtitle">
            Учебный игровой контур для урологии и андрологии: кейсы, тренажёры и короткие тактические сценарии,
            которые усиливают клиническое мышление, а не отвлекают от него.
          </p>
          <div className="games-hero-actions">
            <button className="hero-primary-btn" onClick={() => onNavigate('games', null, 'diagnosis-duel')}>
              Открыть Diagnosis Duel
            </button>
            <button className="hero-secondary-btn" onClick={() => onNavigate('calculators')}>
              К клиническим инструментам
            </button>
          </div>
        </div>

        <div className="games-hero-panel">
          <HeroMetric value={gameCatalog.length} label="Игровые сценарии" />
          <HeroMetric value={totalCompletions} label="Завершённые миссии" />
          <HeroMetric value={bestOverallScore} label="Лучший результат" />
          <HeroMetric value="4" label="Форматы обучения" />
          <div className="games-hero-note">
            Здесь мы держим только те сценарии, которые помогают быстрее думать, выбирать тактику и замечать клинические риски.
          </div>
        </div>
      </div>

      <div className="games-meta-strip">
        <div className="games-daily-card">
          <span className="game-learning-label">Задание дня</span>
          <h3>Пройди Stone Crusher без выхода за предел безопасности тканей</h3>
          <p>Цель дня: завершить уровень и сохранить не менее 35% энергии системы.</p>
          <button className="game-open-btn live" onClick={() => onNavigate('games', null, 'stone-crusher')}>
            Открыть задание
          </button>
        </div>

        <div className="games-achievements-card">
          <span className="game-learning-label">Бейджи прогресса</span>
          <div className="games-achievement-list">
            {achievements.map((achievement) => (
              <span key={achievement.id} className={`games-achievement ${achievement.unlocked ? 'unlocked' : ''}`}>
                {achievement.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="games-grid">
        {gameCatalog.map((game) => (
          <div key={game.id} className={`game-card game-card-${game.accent}`}>
            <div className="game-card-head">
              <span className="game-badge">{game.badge}</span>
              <span className="game-genre">{game.genre}</span>
            </div>
            <h3>{game.title}</h3>
            <p>{game.objective}</p>
            <div className="game-learning-block">
              <span className="game-learning-label">Образовательный фокус</span>
              <p>{game.learning}</p>
            </div>
            <div className="game-progress-inline">
              <span>Best: {gameProgress[game.progressKey]?.bestScore || 0}</span>
              <span>Runs: {gameProgress[game.progressKey]?.completions || 0}</span>
            </div>
            <button className="game-open-btn live" onClick={() => onNavigate('games', null, game.id)}>
              Открыть сценарий
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

const GamesPage = ({ activeGameId, onNavigate }) => {
  const [gameProgress, recordGameScore] = useGameProgress();

  if (activeGameId === 'diagnosis-duel') {
    return (
      <section className="section games-page">
        <DiagnosisDuelGame onBack={() => onNavigate('games')} onRecordScore={recordGameScore} />
      </section>
    );
  }

  if (activeGameId === 'stone-crusher') {
    return (
      <section className="section games-page">
        <StoneCrusherGame onBack={() => onNavigate('games')} onRecordScore={recordGameScore} />
      </section>
    );
  }

  if (activeGameId === 'prostate-defender') {
    return (
      <section className="section games-page">
        <ProstateDefenderGame onBack={() => onNavigate('games')} onRecordScore={recordGameScore} />
      </section>
    );
  }

  if (activeGameId === 'uro-endo-sim') {
    return (
      <section className="section games-page">
        <UroEndoSimGame onBack={() => onNavigate('games')} onRecordScore={recordGameScore} />
      </section>
    );
  }

  return <GamesHub gameProgress={gameProgress} onNavigate={onNavigate} />;
};

export default GamesPage;

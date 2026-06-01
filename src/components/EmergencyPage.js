import React, { useState } from 'react';
import '../styles/servicePages.css';
import ServicePageHero from './ServicePageHero';

const emergencyConditions = [
  {
    id: 'testicular-torsion',
    name: 'Перекрут яичка',
    icon: '⚠️',
    color: '#ef4444',
    time: 'Окно спасения: первые 6 часов',
    section: 'urology',
    subsection: 'reconstructive',
    diseaseId: 'testicular-torsion',
    steps: [
      { step: 1, text: 'Клинически подозревать перекрут при внезапной боли и высоком положении яичка.', action: true },
      { step: 2, text: 'Не задерживать операцию ради УЗИ, если клиника типична.' },
      { step: 3, text: 'Срочная ревизия мошонки и деторсия.', action: true },
      { step: 4, text: 'Оценить жизнеспособность яичка после восстановления кровотока.' },
      { step: 5, text: 'Орхипексия с обеих сторон обязательна при сохраненном органе.', action: true },
      { step: 6, text: 'Орхиэктомия показана при некрозе и отсутствии восстановления.' },
    ],
    tip: 'Самая частая ошибка здесь - потеря времени на лишние обследования. При типичной картине важнее быстрый операционный доступ.',
  },
  {
    id: 'priapism',
    name: 'Приапизм',
    icon: '⚠️',
    color: '#ef4444',
    time: 'Эскалация нужна после 4 часов',
    section: 'andrology',
    subsection: 'sexual',
    diseaseId: 'priapism',
    steps: [
      { step: 1, text: 'Разделить ишемический и неишемический вариант: анамнез, осмотр, газовый состав кавернозной крови.', action: true },
      { step: 2, text: 'При ишемическом приапизме не откладывать декомпрессию.' },
      { step: 3, text: 'Аспирация крови из кавернозных тел и промывание физиологическим раствором.', action: true },
      { step: 4, text: 'Интракавернозный фенилэфрин под мониторингом АД и пульса.', action: true },
      { step: 5, text: 'Если эффекта нет - переход к шунтирующим вмешательствам.' },
      { step: 6, text: 'При неишемической форме возможны наблюдение или селективная эмболизация.' },
    ],
    tip: 'Ишемический приапизм - это угроза эректильной функции. Чем дольше задержка, тем выше риск необратимого фиброза.',
  },
  {
    id: 'fournier-gangrene',
    name: 'Гангрена Фурнье',
    icon: '🔥',
    color: '#dc2626',
    time: 'Молниеносное прогрессирование',
    section: 'urology',
    subsection: 'infections',
    diseaseId: 'fournier-gangrene',
    steps: [
      { step: 1, text: 'Диагноз клинический: не задерживать операцию ожиданием визуализации.', action: true },
      { step: 2, text: 'Немедленно начать широкую антибактериальную терапию и интенсивную поддержку.', action: true },
      { step: 3, text: 'Радикальная хирургическая некрэктомия - как можно раньше.', action: true },
      { step: 4, text: 'Планировать повторные ревизии каждые 24-48 часов.' },
      { step: 5, text: 'Контролировать источник инфекции, сахар крови, гемодинамику и признаки сепсиса.' },
      { step: 6, text: 'Реконструкцию тканей проводить после стабилизации и очищения раны.' },
    ],
    tip: 'Опаснее всего недооценить глубину поражения. Если есть подозрение, лучше ранняя агрессивная хирургическая тактика, чем выжидание.',
  },
  {
    id: 'acute-urinary-retention',
    name: 'Острая задержка мочи',
    icon: '⚠️',
    color: '#f59e0b',
    time: 'Нужна быстрая декомпрессия',
    section: 'urology',
    subsection: 'functional',
    diseaseId: 'urinary-retention',
    steps: [
      { step: 1, text: 'Подтвердить переполнение мочевого пузыря и выраженный дискомфорт.', action: true },
      { step: 2, text: 'Немедленная катетеризация - первый шаг в большинстве случаев.', action: true },
      { step: 3, text: 'Если трансуретральный катетер не проходит, не усиливать травму повторными попытками.' },
      { step: 4, text: 'При сложной катетеризации - уролог, проводник или цистостомия по показаниям.', action: true },
      { step: 5, text: 'После декомпрессии искать причину: ДГПЖ, стриктура, неврология, лекарства, инфекция.' },
      { step: 6, text: 'Определить дальнейший маршрут: trial without catheter, альфа-блокатор, операция или дообследование.' },
    ],
    tip: 'Ошибка - считать задержку мочи только симптомом ДГПЖ. Здесь важно быстро снять обструкцию и сразу понять причину.',
  },
];

const EmergencyPage = ({ onNavigate }) => {
  const [selected, setSelected] = useState(null);

  const heroActions = [
    {
      label: 'Перекрут яичка',
      meta: 'Сразу к time-critical маршруту',
      onClick: () => onNavigate('urology', 'reconstructive', 'testicular-torsion', { source: 'service_emergency_hero' }),
    },
    {
      label: 'Приапизм',
      meta: 'Sexual emergency pathway',
      onClick: () => onNavigate('andrology', 'sexual', 'priapism', { source: 'service_emergency_hero' }),
    },
    {
      label: 'Острая задержка мочи',
      meta: 'Functional obstruction route',
      onClick: () => onNavigate('urology', 'functional', 'urinary-retention', { source: 'service_emergency_hero' }),
    },
  ];

  return (
    <section className="emergency-page service-page-shell">
      <ServicePageHero
        eyebrow="Urgent reference"
        title="Экстренные состояния"
        subtitle="Короткие алгоритмы для ситуаций, где критичны первые минуты и часы: что не пропустить, когда эскалировать и куда вести пациента дальше."
        trustPills={['Time-critical pathways', 'Short actionable steps', 'Urgency-first UX']}
        stats={[
          { label: 'Критических сценария', value: String(emergencyConditions.length) },
          { label: 'Приоритет', value: 'Первые часы' },
          { label: 'Фокус', value: 'Triage + routing' },
        ]}
        highlights={[
          'Быстрый ориентир в самых опасных урологических и андрологических сценариях',
          'Четкий переход от triage к профильной нозологии',
          'Минимум текста, максимум urgency-context и next steps',
        ]}
        actions={heroActions}
      />

      <div className="emergency-grid">
        {emergencyConditions.map((condition) => (
          <div
            key={condition.id}
            className="emergency-card service-card-shell"
            onClick={() => setSelected(selected === condition.id ? null : condition.id)}
            onKeyDown={(e) => e.key === 'Enter' && setSelected(selected === condition.id ? null : condition.id)}
            role="button"
            tabIndex="0"
            aria-label={`${condition.name}: нажмите для подробностей`}
          >
            <div className="emergency-card-header" style={{ borderTopColor: condition.color }}>
              <span className="emergency-icon">{condition.icon}</span>
              <div>
                <span className="service-mini-kicker">Emergency protocol</span>
                <h3>{condition.name}</h3>
                <span className="emergency-time" style={{ color: condition.color }}>
                  {condition.time}
                </span>
              </div>
            </div>

            {selected === condition.id ? (
              <div className="emergency-steps">
                {condition.steps.map((step) => (
                  <div key={step.step} className={`emergency-step ${step.action ? 'step-action' : ''}`}>
                    <span className="step-number">{step.step}</span>
                    <span className="step-text">{step.text}</span>
                  </div>
                ))}
                <div className="emergency-tip" style={{ borderColor: condition.color }}>
                  <strong>Важно:</strong> {condition.tip}
                </div>
                <button
                  className="emergency-detail-btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    onNavigate(condition.section, condition.subsection, condition.diseaseId, {
                      source: 'service_emergency_detail',
                    });
                  }}
                >
                  Открыть полную нозологию
                </button>
              </div>
            ) : (
              <p className="emergency-hint">Нажмите, чтобы раскрыть алгоритм и увидеть следующий маршрут</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default EmergencyPage;

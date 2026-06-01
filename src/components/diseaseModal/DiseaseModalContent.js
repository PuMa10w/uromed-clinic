import PropTypes from 'prop-types';
import SafeClinicalMarkup from '../SafeClinicalMarkup';
import { diseaseById } from '../../data';
import { buildFollowUpFallback, buildRedFlagsFallback } from '../../data/clinicalFallbacks';
import { asArray, buildLifestyleFallback } from './normalizeDisease';

function renderClinicalMinimumNote(note) {
  if (!note) return null;
  return (
    <div className="clinical-minimum-note">
      <span className="clinical-minimum-kicker">Клинический минимум</span>
      <span>{note}</span>
    </div>
  );
}

const quickSummaryItems = [
  ['prevalence', 'Распространённость'],
  ['genderRatio', 'Соотношение'],
  ['goldStandard', 'Золотой стандарт'],
  ['firstLine', 'Первая линия'],
  ['surgery', 'Хирургия'],
  ['recurrence', 'Рецидив'],
];

function renderQuickSummary(normalizedDisease) {
  const qs = normalizedDisease.quickSummary;
  if (!qs) return null;
  const items = quickSummaryItems.filter(([key]) => qs[key]);
  return (
    <div className="quick-summary-card">
      <h3 className="quick-summary-title">Клиническое резюме</h3>
      <div className="quick-summary-grid">
        {items.map(([key, label], index) => (
          <div key={key} className="qs-item">
            <span className="qs-index">{String(index + 1).padStart(2, '0')}</span>
            <span className="qs-label">{label}</span>
            <span className="qs-value">{qs[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function pickClinicalText(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.text || value.desc || value.name || value.action || value.note || '';
}

function getFirstPathwayItem(items) {
  return asArray(items)
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item?.items?.length) return pickClinicalText(item.items[0]);
      return pickClinicalText(item);
    })
    .find(Boolean) || '';
}

function buildClinicalActionItems(normalizedDisease) {
  const redFlag = asArray(normalizedDisease.redFlags)[0]?.text
    || asArray(normalizedDisease.complications)[0]
    || buildRedFlagsFallback(normalizedDisease).items?.[0]?.text;
  const confirm = getFirstPathwayItem(normalizedDisease.diagnostics?.steps)
    || normalizedDisease.diagnostics?.labs
    || normalizedDisease.quickSummary?.goldStandard;
  const firstLine = normalizedDisease.quickSummary?.firstLine
    || getFirstPathwayItem(normalizedDisease.treatment?.conservative)
    || getFirstPathwayItem(normalizedDisease.treatment?.surgical);
  const refer = getFirstPathwayItem(normalizedDisease.whenToRefer?.toEmergency)
    || getFirstPathwayItem(normalizedDisease.whenToRefer?.toUrologist)
    || getFirstPathwayItem(normalizedDisease.followUp?.schedule);

  return [
    ['exclude', 'Исключить срочно', redFlag],
    ['confirm', 'Подтвердить', confirm],
    ['first', 'Первый шаг', firstLine],
    ['refer', 'Когда направлять', refer],
  ].filter(([, , text]) => Boolean(text));
}

function renderClinicalActionHeader(normalizedDisease) {
  const items = buildClinicalActionItems(normalizedDisease);
  if (!items.length) return null;

  return (
    <div className="clinical-action-header" data-clinical-action-ready="true">
      <div className="clinical-action-headline">
        <span>Clinical Action</span>
        <strong>{normalizedDisease.icd ? `МКБ-10: ${normalizedDisease.icd}` : 'быстрый маршрут'}</strong>
      </div>
      <div className="clinical-action-grid">
        {items.map(([key, label, text], index) => (
          <div key={key} className={`clinical-action-item action-${key}`}>
            <span className="clinical-action-index">{String(index + 1).padStart(2, '0')}</span>
            <span className="clinical-action-label">{label}</span>
            <SafeClinicalMarkup as="p" html={pickClinicalText(text)} sourceId={`clinical-action-${key}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function renderRedFlags(normalizedDisease) {
  const fallback = buildRedFlagsFallback(normalizedDisease);
  const rf = normalizedDisease.redFlags?.length ? normalizedDisease.redFlags : fallback.items;
  return (
    <div className={`content-block ${fallback.items === rf ? 'clinical-minimum-block' : ''}`}>
      <h3 className="red-flags-title">
        {fallback.items === rf ? fallback.title : 'Красные флаги — требуют немедленного действия'}
      </h3>
      {fallback.items === rf && renderClinicalMinimumNote(fallback.note)}
      <ul className="red-flags-list">
        {rf.map((item, i) => (
          <li key={i} className={`red-flag-item ${item.urgent ? 'urgent' : ''}`}>
            <span className="red-flag-icon">{item.urgent ? '!' : 'i'}</span>
            <SafeClinicalMarkup className="red-flag-text" html={item.text} sourceId={`red-flag-${i}`} />
            {item.action && <span className="red-flag-action">{item.action}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function renderReferralCard(title, items, tone = 'default') {
  if (!items || items.length === 0) return null;
  return (
    <article className={`referral-card referral-card-${tone}`}>
      <h4 className="referral-card-title">{title}</h4>
      <ul className="referral-list">
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </article>
  );
}

function renderWhenToRefer(normalizedDisease) {
  const ref = normalizedDisease.whenToRefer;
  if (!ref) return null;
  return (
    <div className="content-block">
      <h3>Когда направлять к специалисту</h3>
      <div className="referral-grid">
        {renderReferralCard('К урологу', ref.toUrologist, 'urology')}
        {renderReferralCard('К нефрологу', ref.toNephrologist, 'nephrology')}
        {renderReferralCard('К онкологу', ref.toOncologist, 'oncology')}
        {renderReferralCard('Срочно / приёмный покой', ref.toEmergency, 'emergency')}
      </div>
    </div>
  );
}

function renderPrognosis(normalizedDisease) {
  const p = normalizedDisease.prognosis;
  if (!p) return <p className="text-muted">Нет данных</p>;
  return (
    <div className="content-block">
      {p.shortTerm && <><h3>Краткосрочный прогноз (1-5 лет)</h3><p>{p.shortTerm}</p></>}
      {p.longTerm && <><h3>Долгосрочный прогноз (5-10+ лет)</h3><p>{p.longTerm}</p></>}
      {p.factors && p.factors.length > 0 && (
        <>
          <h3>Факторы прогноза</h3>
          <ul>{p.factors.map((item, i) => <li key={i}>{item}</li>)}</ul>
        </>
      )}
      {p.statistics && <><h3>Статистика</h3><p>{p.statistics}</p></>}
    </div>
  );
}

function renderFollowUp(normalizedDisease) {
  const fallback = buildFollowUpFallback(normalizedDisease);
  const f = normalizedDisease.followUp || fallback;
  return (
    <div className={`content-block ${f.isFallback ? 'clinical-minimum-block' : ''}`}>
      <h3>{f.title || 'График наблюдения'}</h3>
      {f.isFallback && renderClinicalMinimumNote(f.note)}
      {f.schedule && renderClinicalPathwayTable('График визитов', f.schedule, 'followup')}
      {f.monitoring && (
        <>
          <h4>Что мониторить:</h4>
          {renderClinicalPathwayTable('Контрольные точки', f.monitoring, 'monitoring')}
        </>
      )}
    </div>
  );
}

function renderClinicalCases(normalizedDisease) {
  const cases = normalizedDisease.clinicalCases;
  if (!cases || !cases.length) return <p className="text-muted">Нет данных</p>;
  return (
    <div className="content-block">
      <h3>Клинические случаи</h3>
      {cases.map((c, i) => (
        <div key={i} className="clinical-case-card">
          <div className="case-header">
            <span className="case-number">{String(i + 1).padStart(2, '0')}</span>
            <h4 className="case-title">{c.title}</h4>
          </div>
          <div className="case-timeline">
            {c.patient && <div className="case-field"><strong>Пациент</strong><span>{c.patient}</span></div>}
            {c.complaint && <div className="case-field"><strong>Жалобы</strong><span>{c.complaint}</span></div>}
            {c.findings && <div className="case-field"><strong>Находки</strong><span>{c.findings}</span></div>}
            {c.diagnosis && <div className="case-field"><strong>Диагноз</strong><span>{c.diagnosis}</span></div>}
            {c.treatment && <div className="case-field"><strong>Лечение</strong><span>{c.treatment}</span></div>}
            {c.outcome && <div className="case-field"><strong>Исход</strong><span>{c.outcome}</span></div>}
          </div>
          {c.lesson && <div className="case-lesson"><strong>Вывод</strong><span>{c.lesson}</span></div>}
        </div>
      ))}
    </div>
  );
}

function renderGuidelineSourceCard(key, source) {
  if (!source) return null;
  const keyPoints = asArray(source.keyPoints);
  return (
    <article key={key} className={`guideline-source-card guideline-source-${key}`}>
      <div className="guideline-source-head">
        <span className={`badge badge-${key}`}>{key.toUpperCase()}</span>
        <strong>{source.title || key.toUpperCase()}</strong>
      </div>
      {keyPoints.length > 0 && (
        <ul className="guideline-keypoints">
          {keyPoints.map((point, i) => <li key={i}>{point}</li>)}
        </ul>
      )}
      {source.url && (
        <a className="guideline-source-link" href={source.url} target="_blank" rel="noopener noreferrer">
          Открыть источник
        </a>
      )}
    </article>
  );
}

function renderGuidelinesPanel(normalizedDisease) {
  const guidelines = normalizedDisease.guidelines || {};
  const sources = ['eau', 'aua', 'asrm', 'who', 'ese', 'cdc', 'ru', 'ua', 'nice']
    .map((key) => renderGuidelineSourceCard(key, guidelines[key]))
    .filter(Boolean);

  return (
    <div className="content-block">
      {(normalizedDisease.lastReviewed || normalizedDisease.evidenceVersion) && (
        <div className="guidelines-freshness">
          {normalizedDisease.lastReviewed && (
            <span className="guidelines-freshness-item">Обновлено: {normalizedDisease.lastReviewed}</span>
          )}
          {normalizedDisease.evidenceVersion && (
            <span className="guidelines-freshness-item">Источник: {normalizedDisease.evidenceVersion}</span>
          )}
        </div>
      )}

      <div className="guidelines-premium-panel">
        <h3>Сравнение рекомендаций</h3>
        {guidelines.consensus?.length > 0 && (
          <div className="guidelines-consensus">
            <span className="guidelines-consensus-label">Консенсус</span>
            <ul>
              {guidelines.consensus.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        )}
        <div className="guideline-source-grid">
          {sources.length > 0 ? sources : <p className="text-muted">Нет данных</p>}
        </div>
      </div>
    </div>
  );
}

function renderFAQ(normalizedDisease) {
  const faq = normalizedDisease.patientQuestions;
  if (!faq || !faq.length) return <p className="text-muted">Нет данных</p>;
  return (
    <div className="content-block">
      <h3>Частые вопросы пациентов</h3>
      <div className="faq-list">
        {faq.map((item, i) => (
          <details key={i} className="faq-item">
            <summary className="faq-question">{item.q}</summary>
            <SafeClinicalMarkup as="div" className="faq-answer" html={item.a} sourceId={`faq-${i}`} />
          </details>
        ))}
      </div>
    </div>
  );
}

function renderDrugDoses(normalizedDisease) {
  const drugs = normalizedDisease.drugDoses;
  if (!drugs || !drugs.length) return <p className="text-muted">Нет данных</p>;
  return (
    <div className="clinical-table-card drug-doses-card">
      <h3>Препараты и дозировки</h3>
      <table className="styled-table premium-clinical-table drug-doses-table">
        <thead>
          <tr>
            <th>Препарат</th>
            <th>Дозировка</th>
            <th>Примечание</th>
          </tr>
        </thead>
        <tbody>
          {drugs.map((d, i) => (
            <tr key={i}>
              <td data-label="Препарат"><strong>{d.name}</strong></td>
              <td data-label="Дозировка"><code>{d.dose}</code></td>
              <td data-label="Примечание">{d.note || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderLifestyleAdvice(disease) {
  const fallback = buildLifestyleFallback(disease);
  const unique = (arr) => arr.filter((item, index) => arr.indexOf(item) === index);
  const lifestyle = unique([...asArray(disease.lifestyleAdvice), ...fallback.advice]);
  const nutrition = unique([...asArray(disease.nutritionAdvice), ...fallback.nutrition]);
  const patientCare = unique([...asArray(disease.patientRecommendations), ...fallback.patient]);
  if (!lifestyle.length && !nutrition.length && !patientCare.length) return <p className="text-muted">Нет данных</p>;
  return (
    <div className="content-block">
      {lifestyle.length > 0 && (
        <>
          <h3>Рекомендации по образу жизни</h3>
          <ul>{lifestyle.map((item, i) => <li key={i}>{item}</li>)}</ul>
        </>
      )}
      {nutrition.length > 0 && (
        <>
          <h3>Питание и гидратация</h3>
          <ul>{nutrition.map((item, i) => <li key={i}>{item}</li>)}</ul>
        </>
      )}
      {patientCare.length > 0 && (
        <>
          <h3>Памятка пациенту</h3>
          <ul>{patientCare.map((item, i) => <li key={i}>{item}</li>)}</ul>
        </>
      )}
    </div>
  );
}

function renderLabNorms(normalizedDisease) {
  const labs = normalizedDisease.labNorms;
  if (!labs || !labs.length) return null;
  return (
    <div className="clinical-table-card">
      <h3>Лабораторные нормы</h3>
      <table className="styled-table premium-clinical-table lab-norms-table">
        <thead><tr><th>Параметр</th><th>Норма</th><th>Примечание</th></tr></thead>
        <tbody>
          {labs.map((lab, index) => (
            <tr key={index}>
              <td data-label="Параметр"><strong>{lab.name}</strong></td>
              <td data-label="Норма">{lab.normal}</td>
              <td data-label="Примечание">{lab.note || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderDifferentialTable(normalizedDisease) {
  const dt = normalizedDisease.differentialTable;
  if (!dt || !dt.length) return null;
  return (
    <div className="clinical-table-card">
      <h3>Дифференциальная диагностика</h3>
      <table className="styled-table premium-clinical-table differential-table">
        <thead><tr><th>Заболевание</th><th>Отличительные черты</th><th>Исследование</th></tr></thead>
        <tbody>
          {dt.map((item, i) => (
            <tr key={i}>
              <td data-label="Нозология"><strong>{item.condition}</strong></td>
              <td data-label="Отличия">{item.distinguishingFeature}</td>
              <td data-label="Проверка">{item.investigation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function splitClinicalText(text) {
  if (!text || typeof text !== 'string') return [];
  return text
    .split(/(?<=[.!?])\s+|;\s+/u)
    .map((item) => item.trim())
    .filter(Boolean);
}

function renderDifferentialListTable(items) {
  const rows = asArray(items).filter(Boolean);
  if (!rows.length) return null;
  return (
    <div className="clinical-table-card">
      <table className="styled-table premium-clinical-table differential-list-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Нозология / сценарий</th>
            <th>Клиническая подсказка</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item, i) => {
            const text = typeof item === 'string' ? item : item.text || String(item);
            const parts = text.split(/\s+[—-]\s+/);
            return (
              <tr key={i}>
                <td data-label="№"><span className="table-step-badge">{i + 1}</span></td>
                <td data-label="Сценарий"><strong>{parts[0] || text}</strong></td>
                <td data-label="Подсказка">{parts.slice(1).join(' — ') || text}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function renderClinicalTextTable(title, text, variant = 'default') {
  const rows = splitClinicalText(text);
  if (!rows.length) return null;
  return (
    <div className={`clinical-table-card clinical-table-card-${variant}`}>
      <h3>{title}</h3>
      <table className="styled-table premium-clinical-table clinical-text-table">
        <thead>
          <tr>
            <th>Блок</th>
            <th>Что оценить</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td data-label="Блок"><span className="table-step-badge">{i + 1}</span></td>
              <td data-label="Что оценить">{row}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderDiagnosticsTable(diagnostics) {
  const steps = asArray(diagnostics?.steps);
  if (!steps.length) return null;
  return (
    <div className="diagnostic-flow-table-wrap">
      <table className="styled-table premium-clinical-table diagnostic-flow-table">
        <thead>
          <tr>
            <th>Шаг</th>
            <th>Действие</th>
            <th>Маршрут</th>
          </tr>
        </thead>
        <tbody>
          {steps.map((step, i) => (
            <tr key={i} className={step.main ? 'is-main-step' : ''}>
              <td data-label="Шаг"><span className="table-step-badge">{step.step || i + 1}</span></td>
              <td data-label="Действие">{step.text}</td>
              <td data-label="Маршрут">{i < steps.length - 1 ? <span className="table-flow-arrow">→</span> : <span className="table-flow-done">итог</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderClinicalPathwayTable(title, items, variant = 'default') {
  const rows = asArray(items).filter(Boolean);
  if (!rows.length) return null;
  return (
    <div className={`clinical-table-card clinical-pathway-card clinical-pathway-card-${variant}`}>
      {title && <h3>{title}</h3>}
      <table className="styled-table premium-clinical-table clinical-pathway-table">
        <thead>
          <tr>
            <th>Шаг</th>
            <th>Клиническое действие</th>
            <th>Дальше</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item, i) => {
            const text = typeof item === 'string' ? item : item.text || item.desc || item.name || String(item);
            return (
              <tr key={i}>
                <td data-label="Шаг"><span className="table-step-badge">{i + 1}</span></td>
                <td data-label="Действие"><SafeClinicalMarkup className="clinical-pathway-text" html={text} sourceId={`pathway-${variant}-${i}`} /></td>
                <td data-label="Дальше">{i < rows.length - 1 ? <span className="table-flow-arrow">→</span> : <span className="table-flow-done">готово</span>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const classificationSections = [
  ['items', 'Клиническая группа'],
  ['byComposition', 'По составу'],
  ['byLocation', 'По локализации'],
  ['byType', 'По типу'],
  ['byCourse', 'По течению'],
  ['byGrade', 'По степени'],
  ['byEtiology', 'По этиологии'],
  ['byStage', 'По стадии'],
  ['byIPSS', 'По IPSS'],
  ['byLevel', 'По уровню'],
  ['byOnset', 'По времени возникновения'],
  ['byPhase', 'По фазе'],
  ['byCurvature', 'По кривизне'],
  ['bySize', 'По размеру'],
  ['gradeGroup', 'Grade Group / ISUP'],
];

function normalizeClassificationRow(item, index) {
  if (typeof item === 'string') {
    const parts = item.split(/\s+[—-]\s+/u);
    return {
      title: parts[0] || `Пункт ${index + 1}`,
      detail: parts.slice(1).join(' — ') || item,
    };
  }

  return {
    title: item.type || item.name || item.code || item.stage || `Пункт ${index + 1}`,
    detail: item.desc || item.text || item.feature || item.criteria || item.note || '',
  };
}

function renderClassificationTable(title, items, variant = 'default') {
  const rows = asArray(items).filter(Boolean);
  if (!rows.length) return null;

  return (
    <div key={variant} className={`clinical-table-card classification-table-card classification-table-card-${variant}`}>
      <h3>{title}</h3>
      <table className="styled-table premium-clinical-table classification-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Группа</th>
            <th>Критерий / клинический смысл</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item, i) => {
            const row = normalizeClassificationRow(item, i);
            return (
              <tr key={`${variant}-${i}`}>
                <td data-label="№"><span className="table-step-badge">{i + 1}</span></td>
                <td data-label="Группа"><strong>{row.title}</strong></td>
                <td data-label="Критерий">{row.detail || 'Уточнить по клиническому контексту'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function renderTnmClassification(tnm) {
  if (!tnm) return [];
  const labels = {
    T: 'T — первичная опухоль',
    N: 'N — лимфоузлы',
    M: 'M — метастазы',
  };

  return ['T', 'N', 'M']
    .map((key) => {
      const rows = asArray(tnm[key]);
      if (!rows.length) return null;
      return (
        <div key={key} className="clinical-table-card classification-table-card classification-table-card-tnm">
          <h3>{labels[key]}</h3>
          <table className="styled-table premium-clinical-table classification-table tnm-premium-table">
            <thead>
              <tr>
                <th>Код</th>
                <th>Описание</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, i) => (
                <tr key={`${key}-${i}`}>
                  <td data-label="Код"><strong>{item.code || `${key}${i}`}</strong></td>
                  <td data-label="Описание">{item.desc || item.text || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    })
    .filter(Boolean);
}

function renderClassification(normalizedDisease) {
  const classification = normalizedDisease.classification;
  if (!classification) return <p className="text-muted">Нет данных</p>;

  const renderedSections = classificationSections
    .map(([key, title]) => renderClassificationTable(title, classification[key], key))
    .filter(Boolean);
  const renderedTnm = renderTnmClassification(classification.tnm);

  return (
    <div className="content-block classification-content-block">
      {classification.title && <h3>{classification.title}</h3>}
      {renderedSections}
      {renderedTnm}
      {renderedSections.length === 0 && renderedTnm.length === 0 && <p className="text-muted">Нет данных</p>}
    </div>
  );
}

function renderUltrasound(normalizedDisease) {
  const us = normalizedDisease.ultrasound;
  if (!us || (!us.overview && !us.findings?.length)) return null;

  return (
    <div className="content-block ultrasound-section">
      <h3>УЗ-исследование</h3>
      {us.overview && <p className="ultrasound-overview">{us.overview}</p>}

      {us.findings?.length > 0 && (
        <>
          <h4>Типичная УЗ-картина</h4>
          <ul>{us.findings.map((item, i) => <li key={i}>{item}</li>)}</ul>
        </>
      )}

      {us.doppler?.length > 0 && (
        <>
          <h4>Допплерография</h4>
          <ul>{us.doppler.map((item, i) => <li key={i}>{item}</li>)}</ul>
        </>
      )}

      {us.protocol?.length > 0 && (
        <>
          <h4>Минимальный протокол</h4>
          <ul>{us.protocol.map((item, i) => <li key={i}>{item}</li>)}</ul>
        </>
      )}

      {us.report?.length > 0 && (
        <>
          <h4>Что указать в заключении</h4>
          <ul>{us.report.map((item, i) => <li key={i}>{item}</li>)}</ul>
        </>
      )}

      {us.limitations?.length > 0 && (
        <>
          <h4>Ограничения метода</h4>
          <ul>{us.limitations.map((item, i) => <li key={i}>{item}</li>)}</ul>
        </>
      )}
    </div>
  );
}

export default function DiseaseModalContent({
  activeTab,
  disease,
  normalizedDisease,
  onClose,
  onNavigateToDisease,
}) {
  switch (activeTab) {
    case 'overview':
      return (
        <div className="content-block">
          {renderClinicalActionHeader(normalizedDisease)}
          {renderQuickSummary(normalizedDisease)}
          <h3>Определение</h3>
          <p>{normalizedDisease.definition}</p>
          <h3>Эпидемиология</h3>
          <p>{normalizedDisease.epidemiology}</p>
          <h3>Этиология и факторы риска</h3>
          <ul>{normalizedDisease.etiology.map((item, i) => <li key={i}>{item}</li>)}</ul>
          <h3>Клиническая картина</h3>
          <ul>{normalizedDisease.symptoms.map((item, i) => <li key={i}>{item}</li>)}</ul>
          {normalizedDisease.pathogenesis && <><h3>Патогенез</h3><p>{normalizedDisease.pathogenesis}</p></>}
          {normalizedDisease.complications.length > 0 && <><h3>Осложнения</h3><ul>{normalizedDisease.complications.map((item, i) => <li key={i}>{item}</li>)}</ul></>}
          {renderDifferentialTable(normalizedDisease)}
          {normalizedDisease.differentialDiagnosis.length > 0 && normalizedDisease.differentialTable.length === 0 && (
            <><h3>Дифференциальная диагностика</h3>{renderDifferentialListTable(normalizedDisease.differentialDiagnosis)}</>
          )}
          {renderLabNorms(normalizedDisease)}
          {renderWhenToRefer(normalizedDisease)}
          {normalizedDisease.relatedIds && normalizedDisease.relatedIds.length > 0 && onNavigateToDisease && (
            <>
              <h3>Связанные нозологии</h3>
              <div className="related-diseases">
                {normalizedDisease.relatedIds.map((rid, i) => {
                  const relatedDisease = diseaseById[rid];
                  if (!relatedDisease) return null;
                  return (
                    <button key={i} className="related-disease-btn" onClick={() => { onClose(); onNavigateToDisease(relatedDisease.section, relatedDisease.subsection, rid); }}>
                      <span className="related-disease-title">{relatedDisease.name}</span>
                      <span className="related-disease-meta">
                        {relatedDisease.icd ? `МКБ-10: ${relatedDisease.icd}` : relatedDisease.subsection || relatedDisease.section}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      );

    case 'symptoms':
      return (
        <div className="content-block">
          <h3>Симптомы и клиническая картина</h3>
          <ul>{asArray(normalizedDisease.symptoms).map((item, i) => <li key={i}>{typeof item === 'string' ? item : item.text || item}</li>)}</ul>
          {normalizedDisease.pathogenesis && <><h3>Патогенез</h3><p>{normalizedDisease.pathogenesis}</p></>}
          {asArray(normalizedDisease.complications).length > 0 && <><h3>Осложнения</h3><ul>{asArray(normalizedDisease.complications).map((item, i) => <li key={i}>{typeof item === 'string' ? item : item.text || item}</li>)}</ul></>}
        </div>
      );

    case 'differential':
      return (
        <div className="content-block">
          <h3>Дифференциальная диагностика</h3>
          {normalizedDisease.differentialDiagnosis && asArray(normalizedDisease.differentialDiagnosis).length > 0 && renderDifferentialListTable(normalizedDisease.differentialDiagnosis)}
          {renderDifferentialTable(normalizedDisease)}
        </div>
      );

    case 'classification':
      return renderClassification(normalizedDisease);

    case 'diagnostics':
      return (
        <div className="content-block">
          <h3>{normalizedDisease.diagnostics?.title || 'Диагностика'}</h3>
          {renderDiagnosticsTable(normalizedDisease.diagnostics)}
          {renderClinicalTextTable('Визуализация', normalizedDisease.diagnostics?.imaging, 'imaging')}
          {renderClinicalTextTable('Лабораторная диагностика', normalizedDisease.diagnostics?.labs, 'labs')}
        </div>
      );

    case 'ultrasound':
      return renderUltrasound(normalizedDisease);

    case 'treatment':
      return (
        <div className="content-block">
          {normalizedDisease.treatment?.conservative?.map((section, i) => (
            <div key={i} className="treatment-pathway-section">
              {renderClinicalPathwayTable(section.title, section.items, 'conservative')}
            </div>
          ))}
          {normalizedDisease.treatment?.surgical && normalizedDisease.treatment.surgical.length > 0 && normalizedDisease.treatment.surgical.map((section, i) => (
            <div key={i} className="treatment-pathway-section">
              {renderClinicalPathwayTable(section.title, section.items, 'surgical')}
            </div>
          ))}
          {normalizedDisease.treatment?.metaphylaxis && renderClinicalPathwayTable('Профилактика и наблюдение', normalizedDisease.treatment.metaphylaxis, 'metaphylaxis')}
        </div>
      );

    case 'guidelines':
      return renderGuidelinesPanel(normalizedDisease);

    case 'redflags':
      return renderRedFlags(normalizedDisease);

    case 'prognosis':
      return renderPrognosis(normalizedDisease);

    case 'followup':
      return renderFollowUp(normalizedDisease);

    case 'cases':
      return renderClinicalCases(normalizedDisease);

    case 'faq':
      return renderFAQ(normalizedDisease);

    case 'lifestyle':
      return renderLifestyleAdvice(disease);

    case 'drugs':
      return renderDrugDoses(normalizedDisease);

    default:
      return null;
  }
}

DiseaseModalContent.propTypes = {
  activeTab: PropTypes.string.isRequired,
  disease: PropTypes.object.isRequired,
  normalizedDisease: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onNavigateToDisease: PropTypes.func,
};

DiseaseModalContent.defaultProps = {
  onNavigateToDisease: null,
};

# V6 Content Execution Backlog

Дата: 2026-05-01  
Статус: execution-ready  
База: `v6-content-plan.md`, `content/icd10-gap-register-v6.csv`

## Wave A (critical, current sprint)

## A1. Infections and urgent pathways

- [x] `acute-cystitis`: добавить клинические кейсы и блок консенсуса по гайдлайнам.
- [x] `recurrent-uti`: углубить прогноз и anti-recurrence follow-up.
- [x] `device-associated-uti`: усилить маршрут эскалации и блок наблюдения.
- [ ] `pyelonephritis`: структурировать differential и urgent-триггеры.
- [ ] `urosepsis`: унифицировать алгоритм действий first hour/24h.
- [ ] `renal-tuberculosis`: допаковать source-pack и клинический маршрут.

Definition of done:
- карточка имеет `guideline-verified` или `in_progress + reviewDate`;
- нет пустых вкладок;
- red flags и referral имеют actionable формулировки.

## A2. Stones and obstruction

- [ ] `kidney-ureter-stones`: расширить метафилаксию и сценарии рецидива.
- [ ] `renal-colic`: усилить алгоритм маршрутизации по тяжести.
- [ ] `hydronephrosis`: уточнить пороги декомпрессии и follow-up.

Definition of done:
- диагностика в формате шагов;
- лечение и наблюдение в формате клинических таблиц;
- есть короткий case-based вывод.

## A3. Functional urology

- [ ] `overactive-bladder`: уточнить escalation pathway и контроль результата.
- [ ] `urge-incontinence`: усилить differential и реабилитационный блок.
- [ ] `urinary-retention`: формализовать urgent vs planned pathway.

Definition of done:
- пациентский маршрут читается за 30-60 секунд;
- есть критерии переоценки тактики.

## A4. Andrology sexual medicine

- [ ] `erectile-dysfunction`: оформить расхождения EAU/AUA/RU в отдельный блок.
- [ ] `psychogenic-ed`: усилить психогенный маршрут и follow-up.
- [ ] `premature-ejaculation`: углубить этапы терапии первой/второй линии.
- [ ] `psychogenic-premature-ejaculation`: структурировать комбинированный маршрут.

Definition of done:
- клинический минимум + source-pack закрыт;
- есть practical treatment path и мониторинг ответа.

---

## Wave B (next sprint)

## B1. Oncology and prostate

- [ ] `elevated-psa`
- [ ] `prostate-cancer`
- [ ] `bladder-cancer`

Цель: углубить risk-stratified decision logic и follow-up интервалы.

## B2. Reconstructive

- [ ] `urethral-stricture`
- [ ] `postprocedural-urethral-stricture`
- [ ] `bladder-neck-obstruction`

Цель: унификация хирургических/нехирургических маршрутов и критериев эскалации.

## B3. Fertility and endocrine andrology

- [ ] `male-infertility`
- [ ] `azoospermia`
- [ ] `hypogonadism`

Цель: стандартизировать work-up, treatment milestones и long-term monitoring.

---

## QA and governance

- [ ] Еженедельный content-review (Content Lead + Guideline Editor + Medical QA).
- [ ] Актуализировать `reviewStatus` и `lastReviewed` по закрытым карточкам.
- [ ] Проверять связность вкладок (`overview -> diagnostics -> treatment -> followUp`).
- [ ] Перед релизом волны запускать: `npm run content:audit` и выборочный визуальный smoke карточек.

---

## Owners

- `content-lead`: клиническая структура и полнота карточек.
- `guideline-editor`: evidence pack, консенсус и расхождения.
- `medical-qa`: практическая применимость, risk/urgent маршруты.
- `frontend-qa`: корректность рендера таблиц и вкладок на iPhone.

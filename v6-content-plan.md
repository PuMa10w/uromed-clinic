# V6 Ultra-Premium Content Plan - UroMed

## 1) Цель V6

Довести информационную часть сайта до ultra-premium уровня для практикующего врача:

- единый клинический стандарт карточек по всем нозологиям;
- полное покрытие ключевых разделов урологии и андрологии;
- прозрачная и актуальная доказательная база (EAU, AUA, RU, AU при наличии);
- отсутствие пустых или формально заполненных вкладок.

Фокус V6: сначала контентная полнота и доказательность, затем editorial depth и экспертные нюансы.

---

## 2) KPI и критерии приемки

### Контентная полнота

- `100%` карточек имеют обязательные вкладки:
  - `overview`, `diagnostics`, `treatment`, `redFlags`, `followUp`.
- `>=95%` карточек имеют заполненные расширенные вкладки:
  - `differential`, `guidelines`, `prognosis`, `cases`.
- `0` карточек с пустым рендером вкладки (пустой экран/заглушка без смысла).

### Доказательная база

- `100%` карточек имеют `sourcePack` (минимум 1 валидный источник + дата ревью).
- `>=80%` high-priority карточек имеют сравнение минимум 2 гайдлайнов (например, EAU/AUA).
- Для всех high-priority карточек есть поле `lastReviewed` и статус:
  - `guideline-verified` / `needs-update`.

### Практическая применимость

- `100%` high-priority карточек содержат:
  - чёткие диагностические алгоритмы;
  - критерии маршрутизации;
  - follow-up интервалы;
  - красные флаги и urgent-action.

---

## 3) Gold Template карточки (единый стандарт)

Каждая карточка проходит чек на обязательные блоки:

1. `Overview`
- определение;
- эпидемиология;
- патогенез (кратко, практично);
- ключевые факторы риска;
- quick clinical summary.

2. `Diagnostics`
- шаги диагностики (алгоритм);
- критерии подтверждения;
- лабораторная диагностика;
- визуализация;
- диагностические пороги и исключения.

3. `Differential`
- структурная таблица:
  - сценарий/нозология;
  - что отличает;
  - чем подтвердить.

4. `Treatment`
- первая линия;
- альтернативы/эскалация;
- хирургические опции (когда и зачем);
- противопоказания/ограничения;
- профилактика и метафилаксия.

5. `Follow-Up`
- интервалы наблюдения;
- что мониторить;
- критерии рецидива/эскалации;
- когда менять тактику.

6. `Red Flags`
- urgent признаки;
- что делать сразу;
- куда направлять.

7. `Guidelines`
- консенсус;
- расхождения;
- источник и дата последнего пересмотра.

8. `Cases`
- минимум 1 короткий типовой клинический сценарий для high-priority карточек;
- вывод с практическим правилом.

---

## 4) Приоритизация по волнам

## Wave A (критично и часто, Sprint 1-2)

### Urology - Infections
- `acute-cystitis`
- `recurrent-uti`
- `device-associated-uti`
- `pyelonephritis`
- `urosepsis`
- `renal-tuberculosis`

### Urology - Stones / Urgent
- `kidney-ureter-stones`
- `renal-colic`
- `hydronephrosis`
- `bladder-stones`

### Urology - Functional
- `overactive-bladder`
- `urge-incontinence`
- `urinary-retention`

### Andrology - Sexual
- `erectile-dysfunction`
- `psychogenic-ed`
- `premature-ejaculation`
- `psychogenic-premature-ejaculation`

## Wave B (высокая амбулаторная нагрузка, Sprint 3)

### Urology - Oncology / Prostate
- `elevated-psa`
- `prostate-cancer`
- `bladder-cancer`

### Urology - Reconstructive
- `urethral-stricture`
- `postprocedural-urethral-stricture`
- `bladder-neck-obstruction`

### Andrology - Fertility / Endocrine
- `male-infertility`
- `azoospermia`
- `hypogonadism`

## Wave C (редкие и сложные, Sprint 4)

- Редкие нозологии с неполным source pack;
- карточки с editorial-status `needs-update`;
- карточки с конфликтом между рекомендациями.

---

## 5) Реестр пробелов по МКБ-10 (Gap Register)

Создать и поддерживать файл:

- `content/icd10-gap-register-v6.csv`

Минимальные колонки:

- `section`
- `subsection`
- `diseaseId`
- `icd10`
- `priority` (`A/B/C`)
- `missingBlocks` (через `;`)
- `sourceCoverage` (`none/minimal/full`)
- `reviewStatus` (`new/in_progress/guideline-verified/needs-update`)
- `owner`
- `dueDate`

Правило: карточка считается закрытой только при заполнении обязательного минимума + source pack.

---

## 6) Редакционный workflow

Для каждой карточки:

1. Черновик структуры по Gold Template.
2. Заполнение практических блоков (диагностика, лечение, follow-up).
3. Сверка с источниками и фиксация `lastReviewed`.
4. Внутренний клинический review:
   - полнота;
   - непротиворечивость;
   - применимость на приёме.
5. Технический QA рендера:
   - табы;
   - таблицы;
   - мобильная читаемость;
   - корректные ссылки.
6. Перевод статуса в `guideline-verified`.

---

## 7) Definition of Done (карточка)

Карточка принимается только если:

- заполнены обязательные вкладки;
- нет пустых блоков и заглушек без клинического смысла;
- есть хотя бы один клинический кейс (для priority A);
- есть source pack и дата проверки;
- вкладки корректно читаются на iPhone-ширинах;
- поиском карточка находится по ключевым синонимам.

---

## 8) Проверки и контроль качества

На каждую итерацию:

- `npm run content:audit`
- `npm run build`
- smoke-проверка карточек приоритета A:
  - `/urology/...`
  - `/andrology/...`
- точечная проверка:
  - источники открываются;
  - таблицы не ломают адаптив;
  - нет дублирующих/конфликтующих формулировок.

Еженедельный контроль:

- dashboard покрытия по разделам;
- список карточек `needs-update`;
- средний возраст ревью (days since `lastReviewed`).

---

## 9) План спринтов V6

## Sprint 1 (1 неделя) - Template + Wave A старт

- Зафиксировать Gold Template как обязательный стандарт.
- Поднять `icd10-gap-register-v6.csv`.
- Закрыть 30-40% карточек Wave A до `guideline-verified`.

## Sprint 2 (1 неделя) - Wave A completion

- Довести Wave A до `>=90%` по критериям DoD.
- Закрыть источник/консенсус для high-risk карточек.

## Sprint 3 (1 неделя) - Wave B

- Массовое закрытие амбулаторных/частых сценариев Wave B.
- Единый editorial pass для разделов oncology/reconstructive/andrology fertility.

## Sprint 4 (1 неделя) - Wave C + final QA

- Закрыть редкие пробелы и конфликтные карточки.
- Финальный аудит качества и freeze.

---

## 10) Роли и ответственность

- `Content Lead`: структура и клиническая логика карточек.
- `Guideline Editor`: источники, консенсус, расхождения.
- `Medical QA`: валидация практической применимости.
- `Frontend QA`: корректность рендера и мобильной читаемости.

---

## 11) Риски и mitigation

- Риск: формальное заполнение без практической ценности.
  - Mitigation: DoD с обязательным clinical-use критерием.

- Риск: устаревание источников.
  - Mitigation: ревизия high-priority карточек по расписанию.

- Риск: неравномерность по разделам.
  - Mitigation: coverage dashboard и weekly cap по отстающим разделам.

---

## 12) Результат V6 (целевое состояние)

UroMed после V6:

- клинически полный;
- доказательно прозрачный;
- быстро сканируемый в реальной практике;
- единый по качеству во всех разделах урологии и андрологии.

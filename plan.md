# План дальнейшего улучшения дизайна и насыщения информацией сайта по урологии и андрологии

Дата обновления: 2026-04-23  
Статус: рабочий master-plan  
Формат: детальный план + матрица контентного насыщения по всем разделам

## 1. Главная цель следующего этапа

Следующий этап развития сайта должен решить сразу три задачи:

- сделать интерфейс цельным, премиальным и клинически понятным во всех разделах;
- довести ключевые нозологии, symptom-hubs и service pages до уровня полноценной medical platform;
- собрать единый контентный контур, где поиск, разделы, модалки, калькуляторы, emergency и retention-навигация работают как связанная система.

Итоговое состояние, к которому идем:

- пользователь может войти в маршрут от жалобы, диагноза или процедуры;
- каждый раздел выглядит как самостоятельный clinical hub, а не как каталог карточек;
- каждая приоритетная нозология содержит patient-safe summary, clinical summary, red flags, decision logic и follow-up;
- доверие, evidence и дата клинического пересмотра видны в каждом важном экране;
- дизайн остается спокойным и чистым, но ощущается как premium digital product.

## 2. Дизайн: дальнейший roadmap

### 2.1 Unified visual system

Нужно окончательно собрать единый визуальный язык:

- унифицировать hero-блоки разделов;
- привести к общей системе badges, pills, CTA, cards, trust-panels, quick-actions;
- стандартизировать цветовые состояния для:
  - urgent,
  - caution,
  - evidence,
  - fertility,
  - endocrine,
  - infection,
  - oncology;
- сделать 3-4 стабильных layout-паттерна:
  - clinical hero,
  - subsection grid,
  - disease dossier,
  - evidence/trust panel.

### 2.2 Section UX

Каждый раздел должен получить собственный section-shell:

- hero с клиническим promise;
- retained/adaptive context;
- symptom-first входы;
- pathway recommendations;
- понятный переход к нозологиям, процедурам и калькуляторам.

### 2.3 Mobile-first polish

Нужно отдельно добить мобильный опыт:

- увеличить читаемость длинных clinical sections;
- упростить вертикальный ритм;
- сделать CTA, quick tasks и symptom-entry удобными для пальца;
- уменьшить перегрузку в длинных disease modals;
- проверить весь путь: landing -> search -> section -> disease modal.

### 2.4 Premium micro-UX

Добавить контролируемую премиальность без визуального шума:

- более чистую типографическую иерархию;
- аккуратные микроанимации на открытие секций и pathway-cards;
- единое оформление trust/evidence слоев;
- последовательную подачу retention-aware блоков.

## 3. Единая модель насыщения контентом

Для всех ключевых нозологий должен быть единый обязательный формат.

### 3.1 Базовый clinical template

- `Patient summary`
- `Clinical summary`
- `Key symptoms`
- `Red flags`
- `When to refer / urgency`
- `Diagnostics`
- `Treatment pathway`
- `Follow-up`
- `Prognosis`
- `Patient questions`
- `Related journeys`
- `Sources / last reviewed / evidence`

### 3.2 Следующий уровень насыщения

- `What to do today`
- `What not to miss`
- `Common routing mistakes`
- `Preparation for tests / procedures`
- `Long-term monitoring`
- `Lifestyle / prevention`
- `Pair / family / fertility context`, если применимо

## 4. Приоритеты по разделам: матрица насыщения

Ниже матрица по всем ключевым разделам проекта.

### 4.1 Урология

**Текущее состояние**

- раздел уже выглядит как сильное ядро платформы;
- есть хорошие точки роста через stones, infections, retention и subsection-pathways;
- структура позволяет развивать symptom-first и disease-first навигацию параллельно.

**Что уже сильное**

- камни и почечная колика как showcase-направление;
- связка section -> disease -> modal;
- pathway recommendations;
- retention-aware навигация.

**Что среднее**

- не все урологические кластеры одинаково насыщены;
- мало symptom-hubs высокого качества;
- не везде есть одинаково сильный trust/evidence слой;
- functional urology пока слабее по product depth.

**Что делать первым**

- довести stones cluster до эталона;
- собрать infections cluster как decision-first раздел;
- поднять symptom hubs: hematuria, dysuria, flank pain, urinary retention;
- усилить functional urology;
- сделать единый urgency-layer для всей урологии.

### 4.2 Андрология

**Текущее состояние**

- раздел уже заметно продвинулся: есть curated premium-layer, symptom-entry, pathway badges и quick tasks;
- сильнее всего выглядит fertility/endocrine/ED направление;
- раздел начинает ощущаться как отдельная цифровая clinical line.

**Что уже сильное**

- erectile dysfunction;
- male infertility;
- hypogonadism;
- varicocele;
- azoospermia;
- symptom-first входы по жалобам;
- section/search/landing entry points.

**Что среднее**

- sexual cluster еще неполный;
- endocrine hub можно сделать глубже;
- не все маршруты разворачиваются в pair-centered logic;
- не хватает procedural и test-prep контента.

**Что делать первым**

- достроить sexual cluster;
- углубить fertility cluster;
- собрать endocrine hub;
- добавить interpretation flows для гормонов и спермограммы;
- усилить patient-safe и couple-centered блоки.

### 4.3 Детская урология

**Текущее состояние**

- важный раздел, но должен ощущаться иначе, чем взрослая урология;
- сейчас его стоит развивать как отдельный parent-guided experience.

**Что уже сильное**

- логически раздел уже присутствует в архитектуре;
- можно быстро встроить в существующий section-shell.

**Что среднее**

- недостаточно родительской навигации;
- не хватает объяснений "когда наблюдать / когда срочно ехать";
- мало preparation и aftercare контента для семей.

**Что делать первым**

- сделать section-hero для родителей;
- приоритизировать cryptorchidism, hypospadias, enuresis, VUR;
- добавить emergency logic для детских urgent states;
- переписать язык в более понятный и спокойный.

### 4.4 Emergency

**Текущее состояние**

- это один из самых ценных разделов для сайта;
- его можно превратить в очень сильный triage-hub.

**Что уже сильное**

- архитектура сайта уже поддерживает быстрые маршруты;
- retention и symptom-first подход сюда отлично ложатся.

**Что среднее**

- emergency нуждается в отдельном ultra-clear UX;
- не хватает time-critical routing;
- мало явных urgent CTA и short-format blocks.

**Что делать первым**

- выделить urgent shell;
- сделать приоритетные emergency pages:
  - torsion,
  - priapism,
  - Fournier,
  - obstructed infected stone,
  - acute urinary retention,
  - gross hematuria with clots;
- минимизировать текст и усилить triage clarity.

### 4.5 Calculators

**Текущее состояние**

- калькуляторы уже есть, но должны стать частью clinical pathways, а не отдельным utility-блоком.

**Что уже сильное**

- раздел существует как сервисный слой;
- хорошо подходит для связки с modal content.

**Что среднее**

- результаты не всегда встроены в маршрут пользователя;
- мало пояснений, что означают значения и куда идти дальше.

**Что делать первым**

- связать каждый калькулятор с релевантными нозологиями;
- добавить интерпретацию результата;
- после расчета предлагать pathway recommendations;
- показывать related disease and next-step actions.

### 4.6 Surgery / Procedures

**Текущее состояние**

- раздел должен стать procedural hub;
- пока потенциал выше, чем фактическая глубина.

**Что уже сильное**

- раздел можно органично связать с disease modal;
- surgical pages хорошо ложатся на premium design system.

**Что среднее**

- недостаточно контента о подготовке, рисках и aftercare;
- мало связи с показаниями и смежными нозологиями.

**Что делать первым**

- выделить шаблон procedural page;
- добавить показания, противопоказания, preparation, recovery, follow-up;
- связать surgical pages с disease pathways и FAQ;
- сделать patient-safe summaries для частых вмешательств.

### 4.7 Favorites / History / Retention

**Текущее состояние**

- этот слой уже стал сильной продуктовой особенностью проекта;
- дальше его нужно перевести из "интересной функции" в "навигационный интеллект продукта".

**Что уже сильное**

- history с source-tracking;
- retention-aware recommendations;
- retained clusters;
- adaptive landing/search/section ordering.

**Что среднее**

- пока мало явных long-term reading journeys;
- нет grouped saved pathways;
- нет явного progress-state по длинным clinical routes.

**Что делать первым**

- ввести saved pathways;
- добавить continue-reading markers;
- поднимать retained symptom hubs и procedures;
- интегрировать retention с контентной приоритизацией.

## 5. Контентный roadmap по урологии

### 5.1 Stones cluster

Приоритет: очень высокий.

Что включить:

- urolithiasis;
- renal colic;
- infected obstruction;
- recurrent stones;
- metaphylaxis;
- stone prevention.

Что нужно добавить:

- size/location decision logic;
- imaging choice;
- urgent decompression routing;
- recurrence-risk board;
- diet/metabolic follow-up;
- common mistakes in management.

### 5.2 Infections cluster

Приоритет: очень высокий.

Что включить:

- cystitis;
- recurrent UTI;
- pyelonephritis;
- prostatitis;
- epididymo-orchitis;
- catheter-associated infection;
- urosepsis.

Что нужно добавить:

- outpatient vs inpatient logic;
- obstruction and sepsis red flags;
- referral timing;
- diagnostic pitfalls;
- follow-up после лечения;
- связку с emergency.

### 5.3 Symptom hubs

Приоритет: очень высокий.

Что включить:

- hematuria;
- dysuria;
- flank pain;
- scrotal pain;
- urinary retention;
- nocturia.

Что нужно добавить:

- symptom-first входы;
- ветвление по риску;
- urgent vs planned care;
- онкологические и инфекционные красные флаги;
- pathway-routing к нозологиям и процедурам.

### 5.4 Functional urology

Приоритет: высокий.

Что включить:

- OAB;
- incontinence;
- neurogenic bladder;
- BPH / BOO;
- urinary retention;
- nocturia.

Что нужно добавить:

- symptom burden layer;
- diary/questionnaire prep;
- conservative vs medication vs intervention logic;
- long-term monitoring.

## 6. Контентный roadmap по андрологии

### 6.1 Sexual cluster

Приоритет: высокий.

Что включить:

- erectile dysfunction;
- premature ejaculation;
- delayed ejaculation;
- retrograde ejaculation;
- priapism;
- Peyronie disease.

Что нужно добавить:

- psychogenic vs organic logic;
- cardiometabolic context;
- endocrine context;
- partner-sensitive explanation;
- questionnaire-led next steps.

### 6.2 Fertility cluster

Приоритет: очень высокий.

Что включить:

- male infertility;
- varicocele;
- azoospermia;
- oligozoospermia;
- asthenozoospermia;
- teratozoospermia;
- leukocytospermia;
- fertility preservation;
- ejaculatory duct obstruction.

Что нужно добавить:

- spermogram pathway;
- couple-centered routing;
- genetic pathway;
- ART handoff logic;
- pre-test preparation;
- follow-up after intervention.

### 6.3 Endocrine cluster

Приоритет: высокий.

Что включить:

- hypogonadism;
- hyperprolactinemia;
- Klinefelter syndrome;
- androgen resistance;
- male climacteric states.

Что нужно добавить:

- hormonal workup logic;
- TRT and fertility caveats;
- metabolic and bone-health layer;
- overtreatment risks;
- long-term endocrine follow-up.

## 7. Trust layer по всем разделам

Это must-have, а не дополнительная опция.

Нужно стандартизировать:

- автора и рецензента;
- дату последнего пересмотра;
- references;
- evidence label;
- urgent-care advice;
- disclaimer;
- review status.

В UI:

- единый evidence panel;
- consistent trust badge system;
- единая зона "Когда срочно обращаться";
- видимые ссылки на источники без перегрузки интерфейса.

## 8. Симптомные и маршрутные хабы

Нужно развивать не только disease pages, но и symptom/pathway pages.

Приоритетные symptom hubs:

- кровь в моче;
- дизурия;
- боль в боку;
- боль в мошонке;
- задержка мочи;
- проблемы с эрекцией;
- снижение либидо;
- плохая спермограмма;
- повышенный ПСА.

Приоритетные pathway hubs:

- маршрут при почечной колике;
- маршрут при инфекциях мочевых путей;
- интерпретация спермограммы;
- гормональный workup у мужчины;
- алгоритм при гемaturии;
- первичный прием андролога.

## 9. Поэтапный roadmap внедрения

### Волна 1. Дизайн-система и унификация экранов

- section heroes;
- subsection cards;
- trust/evidence panels;
- procedure page shell;
- calculators shell;
- mobile polish.

### Волна 2. Насыщение флагманских кластеров

- stones;
- infections;
- ED;
- male infertility;
- hypogonadism;
- hematuria;
- poor spermogram.

### Волна 3. Расширение clinical network

- sexual cluster;
- endocrine cluster;
- pediatric cluster;
- emergency shell;
- surgery/procedure pages.

### Волна 4. Product intelligence

- retention-aware saved pathways;
- continue reading;
- stronger calculator routing;
- content prioritization by telemetry;
- улучшение search suggestions по данным.

## 10. Что делать в следующем спринте

Если приземлить план в ближайшую практическую работу, порядок такой:

1. Утвердить unified visual system для section-shell и service pages.
2. Переписать `plan.md` и контентные стандарты в рабочие templates для редакции.
3. Насытить еще 10-15 приоритетных нозологий по premium-template.
4. Сделать три symptom hubs:
   - hematuria,
   - dysuria,
   - poor spermogram.
5. Довести trust/evidence слой до всех флагманских страниц.
6. Связать calculators и procedures с disease pathways.
7. Отполировать mobile UX на landing, section и disease modal.

## 11. KPI следующего этапа

### Продуктовые

- рост переходов из symptom-entry в нозологии;
- рост modal opens из retained recommendations;
- рост переходов по related journeys;
- снижение пустых запросов в поиске;
- рост возвратов к saved и retained pathways.

### UX

- быстрее вход в нужный clinical path;
- меньше тупиков в search и section-level navigation;
- лучше читаемость длинных clinical pages;
- меньше потерь между subsection и disease open.

### Контентные

- флагманские нозологии покрыты premium-template на 100%;
- symptom hubs покрывают основные entry scenarios;
- evidence / reviewed / sources видны на всех ключевых страницах;
- меньше пустых или слабых разделов в pediatric, emergency, surgery.

## 12. Definition of Done для этого этапа

Этап можно считать завершенным, если одновременно выполнены условия:

- разделы сайта визуально собраны в одну design-system;
- все ключевые кластеры имеют symptom-first и disease-first входы;
- урология и андрология насыщены до уровня clinical hubs;
- emergency и calculators встроены в основные пользовательские маршруты;
- trust/evidence слой унифицирован;
- контентная глубина выросла не точечно, а системно по разделам;
- telemetry показывает, что пользователи чаще доходят до нужной нозологии и возвращаются к сильным маршрутам.

## 13. Краткий итог

Главная задача следующего этапа не просто добавить больше текста или больше экранов.  
Нужно сделать так, чтобы весь сайт работал как единая цифровая медицинская платформа:

- красивый, но ясный интерфейс;
- клинически правильные маршруты;
- сильные symptom hubs;
- глубокие disease dossiers;
- связка урологии, андрологии, pediatric, emergency, procedures и calculators в одном пользовательском контуре.

Именно это даст ощущение top-tier продукта, а не просто большого медицинского справочника.

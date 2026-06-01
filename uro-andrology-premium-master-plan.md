# UroMed: Premium Master Plan for Urology and Andrology

Дата: 2026-04-23
Статус: продуктовый и UX roadmap
Цель: превратить сайт по урологии и андрологии из расширенного справочника в цельную clinical platform уровня premium digital product

## 1. Executive Summary

Сайт уже имеет сильную базу:

- крупный каталог нозологий;
- деление на урологию, андрологию, детскую урологию;
- модальную модель чтения;
- поиск, избранное, историю, emergency, calculators, surgery;
- премиальную визуальную базу;
- технический фундамент на React/Vite с lazy-loading и тестами.

Следующий этап развития не в том, чтобы просто "добавить еще контента", а в том, чтобы:

- собрать весь продукт в единую clinical UX-систему;
- перестроить карточки нозологий в формат медицинского workflow;
- усилить trust layer, SEO и deep-link архитектуру;
- добавить symptom-first маршруты;
- развести контент для врача и пациента без потери клинической строгости;
- превратить урологию и андрологию в платформу навигации, а не только чтения.

## 2. Product Vision

### 2.1 Целевая роль сайта

Сайт должен работать одновременно как:

- clinical reference для уролога и андролога;
- понятный patient guidance layer для пациента;
- decision support entry point по симптомам;
- hub для связанных сценариев: urgent states, surgery, calculators, metaphylaxis, follow-up.

### 2.2 Продуктовое обещание

Пользователь должен за 10-20 секунд понимать:

- где он находится;
- насколько ситуация срочная;
- какие нозологии и сценарии ему релевантны;
- какой следующий шаг логичен;
- где доказательная основа и когда контент обновлялся.

## 3. Core Product Pillars

### 3.1 Clinical Encyclopedia

Ядро платформы:

- нозологии;
- синдромы;
- ургентные состояния;
- диагностические пути;
- follow-up и прогноз.

### 3.2 Decision Support

Практическая навигация:

- вход по симптому;
- red flags;
- urgent vs outpatient logic;
- "что делать сегодня";
- "что нельзя пропустить".

### 3.3 Patient Guidance

Понятная подача:

- summary простым языком;
- FAQ;
- подготовка к исследованиям;
- рекомендации по образу жизни;
- пояснение рисков без запугивания.

### 3.4 Trust and Governance

Системная медицинская надежность:

- дата пересмотра;
- источники;
- authorship/review;
- evidence badges;
- referral logic;
- явные дисклеймеры.

## 4. Target Audiences

### 4.1 Врач

Ключевые ожидания:

- быстрое извлечение клинической пользы;
- понятные алгоритмы;
- удобная перелинковка;
- высокая плотность смысла без визуального шума.

### 4.2 Пациент

Ключевые ожидания:

- безопасное объяснение;
- понимание срочности;
- понятный следующий шаг;
- доступный язык;
- доверие к медицинской точности.

### 4.3 Пара при репродуктивных проблемах

Особенно важно для андрологии:

- не только мужской, но и парный сценарий;
- отдельный fertility layer;
- объяснение маршрута обследования;
- деликатная коммуникация.

## 5. Strategic Gaps in Current Product

### 5.1 Контент местами структурирован как база данных, а не как clinical flow

Это снижает скорость чтения и ощущение премиального медицинского продукта.

### 5.2 Не все разделы связаны в один пользовательский сценарий

Emergency, calculators, surgery, metaphylaxis и disease catalog должны работать как части одной системы.

### 5.3 Недостаточно symptom-first входов

Сейчас доминирует вход через диагноз, но реальный пользователь часто приходит с симптомом.

### 5.4 Trust layer пока не систематизирован

Источники, дата пересмотра, статус срочности, уровень риска и physician-grade markers должны стать обязательной частью опыта.

### 5.5 Есть риск текстовой деградации из-за проблем кодировки

Это P0, потому что влияет и на UX, и на SEO, и на доверие.

## 6. Target Information Architecture

### 6.1 Уровень платформы

Главные сущности:

- `Home`
- `Section hubs`
- `Symptom hubs`
- `Disease pages/modals`
- `Clinical pathways`
- `Emergency`
- `Calculators`
- `Questionnaires`
- `Surgery`
- `Metaphylaxis`
- `Glossary`
- `Drugs`
- `Favorites`
- `History`

### 6.2 Типы маршрутов

Нужно развивать три равноправных входа:

- вход по разделу;
- вход по симптому;
- вход по целевому клиническому сценарию.

### 6.3 Приоритетные symptom hubs

Для урологии:

- кровь в моче;
- дизурия;
- почечная колика;
- тазовая боль;
- боль в мошонке;
- задержка мочи;
- ночное мочеиспускание.

Для андрологии:

- эректильная дисфункция;
- преждевременная эякуляция;
- снижение либидо;
- бесплодие у мужчин;
- плохая спермограмма;
- гипогонадизм;
- болезненная эрекция/приапизм.

## 7. Gold Standard Disease Card Model

Каждая нозология должна иметь единую структуру.

### 7.1 Обязательные блоки

1. `Overview`
- определение;
- TL;DR;
- МКБ;
- распространенность;
- urgency level;
- risk level.

2. `Кому особенно релевантно`
- возраст;
- пол;
- факторы риска;
- fertility-sensitive / oncologic-alert / renal-risk и т.д.

3. `Симптомы`
- типичные;
- ранние;
- поздние;
- нетипичные;
- когда срочно обращаться.

4. `Red Flags`
- что требует неотложной помощи;
- что нельзя пропустить;
- что требует срочной визуализации или стационара.

5. `Причины и патогенез`
- коротко;
- структурно;
- желательно с инфографической логикой.

6. `Диагностика`
- первый шаг;
- лаборатория;
- визуализация;
- подтверждение;
- что исключать.

7. `Дифференциальная диагностика`
- наиболее важные альтернативы;
- таблица или decision format.

8. `Лечение`
- консервативно;
- медикаментозно;
- хирургически;
- наблюдение;
- когда менять тактику.

9. `Follow-up`
- контроль;
- сроки повторного визита;
- критерии ответа;
- критерии эскалации.

10. `Прогноз`
- исход;
- риск рецидива;
- влияние на почку, сексуальную функцию, фертильность, онкориск.

11. `Пациенту`
- простое объяснение;
- что можно делать;
- что нельзя;
- как подготовиться к обследованию.

12. `FAQ`
- реальные короткие вопросы.

13. `Related journeys`
- не только related diseases, но и related pathways.

14. `Sources and review`
- дата;
- рецензент;
- ссылки;
- версия evidence.

### 7.2 Два режима чтения

Для premium-уровня каждая важная нозология должна иметь:

- `Patient summary`
- `Clinical summary`

Это не значит два отдельных сайта. Это значит два слоя подачи внутри одной карточки.

## 8. Urology-Specific Upgrade Plan

### 8.1 Основной принцип

Урология должна читаться через decision-making.

### 8.2 Ключевые клинические контуры

#### Камни

Нужно усилить:

- size/location decision matrix;
- infection + obstruction urgency;
- когда УЗИ, когда КТ;
- путь от колики к наблюдению или вмешательству;
- metaphylaxis как естественное продолжение.

#### Инфекции

Нужно усилить:

- red flags сепсиса;
- outpatient vs inpatient logic;
- катетер-ассоциированные сценарии;
- быстрые caution markers;
- тактику при сочетании инфекции и обструкции.

#### Гематурия

Нужно усилить:

- symptom-first routing;
- distinction macro/micro;
- pain/no pain logic;
- обязательный онкологический маршрут;
- связку с цистоскопией, КТ и нефрологией.

#### Функциональная урология

Нужно усилить:

- symptom clusters;
- опросники как часть clinical pathway;
- связь с BPH, OAB, neurogenic bladder, incontinence;
- быстрый вход через IPSS и LUTS.

#### Онкоурология

Нужно усилить:

- PSA pathways;
- тревожные признаки;
- логика staging;
- мягкое объяснение пациенту;
- связку с surgery и follow-up.

### 8.3 Showcase Urinary Stone Experience

Раздел мочекаменной болезни стоит сделать эталонным.

В нем должны быть:

- summary по типам камней;
- size/location urgency board;
- block "what to do today";
- diet/metaphylaxis integration;
- recurrence risk view;
- linked calculators and urine guidance.

## 9. Andrology-Specific Upgrade Plan

### 9.1 Основной принцип

Андрология требует более деликатного UX и особой логики конфиденциальности, фертильности и долгосрочного наблюдения.

### 9.2 Ключевые клинические контуры

#### Эректильная дисфункция

Нужно усилить:

- organic vs psychogenic vs endocrine logic;
- привязку к IIEF-5;
- cardiovascular risk context;
- patient-safe explanation;
- next-step workup.

#### Эякуляторные расстройства

Нужно усилить:

- distinction premature / delayed / retrograde / anejaculation;
- связь с fertility;
- маршруты первичного обследования.

#### Мужское бесплодие

Нужно усилить:

- вход через спермограмму;
- clear spermogram pathway;
- варикоцеле, азооспермия, гормоны, genetics;
- partner pathway;
- ART/fertility preservation links.

#### Гипогонадизм и эндокринология

Нужно усилить:

- hormonal pathway;
- distinction total/free testosterone;
- SHBG, prolactin, pituitary context;
- fertility planning before therapy;
- monitoring safety.

### 9.3 Showcase Male Infertility Experience

Это должен быть флагманский раздел андрологии.

В нем нужны:

- "как читать спермограмму";
- decision tree по azoospermia/oligo/astheno/terato;
- male + couple pathway;
- fertility-sensitive badges;
- reproductive timeline;
- preserved fertility options.

## 10. Screen-by-Screen Roadmap

### 10.1 Home

Цель:
сделать главную не просто красивым entry point, а интеллектуальным маршрутизатором.

Что изменить:

- усилить message hierarchy;
- после hero дать symptom-first entrance;
- вывести 5-6 основных клинических входов;
- добавить блок "what are you dealing with?";
- сократить конкуренцию между feature blocks;
- показать product proof: примеры disease card, emergency path, calculator use.

### 10.2 Navbar and Global Search

Цель:
навигация уровня enterprise medical product.

Что изменить:

- привести меню к одной строгой логике;
- усилить search overlay;
- добавить recent/favorites/top conditions;
- показывать labels по категориям;
- показывать urgency markers прямо в поиске;
- ввести быстрые пути в symptom hubs.

### 10.3 Section Hubs

Цель:
каждый раздел должен быть самостоятельным клиническим хабом.

Что изменить:

- вверху раздела дать top scenarios;
- показывать curated pathways;
- группировать болезни не только по каталогу, но и по практическим сценариям;
- усилить educational and decision blocks.

### 10.4 Disease Grid

Цель:
ощущение curated clinical catalog, а не просто grid карточек.

Что изменить:

- сократить визуальный шум;
- оставить 1 главный title, 1 meta-row и 1 summary row;
- стандартизировать pills;
- добавить risk/urgency markers;
- выровнять hover/focus/loading behavior.

### 10.5 Disease Modal

Цель:
сделать модалку главным центром ценности продукта.

Что изменить:

- redesign header в формат clinical dossier;
- добавить summary strip;
- добавить evidence and last-reviewed layer;
- добавить sticky TOC на desktop;
- mobile quick bar;
- split layout на desktop;
- distinction between major and minor blocks;
- reusable layouts for tables, alerts, FAQ, evidence, follow-up.

### 10.6 Emergency Page

Цель:
максимально быстрый urgent reference.

Что изменить:

- сделать выраженную triage hierarchy;
- дать color-coded urgency;
- связать emergency protocols с нозологиями;
- добавить quick transfer into relevant disease cards;
- унифицировать visual urgency grammar.

### 10.7 Calculators and Questionnaires

Цель:
инструменты должны быть встроены в clinical pathways.

Что изменить:

- встроить calculators в related journeys;
- после расчета предлагать следующий клинический шаг;
- сохранить history by scenario;
- дать links в релевантные нозологии;
- создать patient-safe interpretation layer.

### 10.8 Surgery

Цель:
сделать раздел хирургии не отдельным каталогом, а продолжением disease logic.

Что изменить:

- связать операции с показаниями из disease cards;
- добавить pre-op / post-op pathways;
- связать с осложнениями и follow-up;
- вывести уровень доказательности и place in treatment algorithm.

### 10.9 Metaphylaxis

Цель:
превратить в логическое продолжение stone pathway.

Что изменить:

- вход из мочекаменной болезни;
- привязать рекомендации к типу камней и риску рецидива;
- добавить actionable routine plans;
- дать printable lifestyle checklist.

### 10.10 Favorites and History

Цель:
закрепить ощущение персональной рабочей платформы.

Что изменить:

- показывать последние disease journeys;
- разделять saved diseases / tools / pathways;
- дать "continue where you left off";
- ввести lightweight personalization.

## 11. Functional Roadmap

### 11.1 P1 Features

- symptom hubs;
- dual summaries for patient and clinician;
- risk badges;
- better related journeys;
- preparedness guides before tests.

### 11.2 P2 Features

- interactive decision trees;
- body maps and pain entry;
- personalized recommendations by age/risk/fertility;
- smart follow-up reminders in UI;
- integrated pathway from calculators to diseases.

### 11.3 P3 Features

- AI assistant as explainer and navigator;
- telemedicine integration;
- personalized user workspace;
- doctor mode / patient mode toggle at platform level.

## 12. Trust Layer Plan

### 12.1 Обязательные trust blocks

На каждой важной disease card:

- дата последнего клинического пересмотра;
- автор или рецензент;
- ключевые источники;
- уровень срочности;
- для кого особенно важно;
- блок "когда срочно обращаться";
- patient-safe disclaimer.

### 12.2 Статусы и badges

Единая система:

- `urgent`
- `oncologic-alert`
- `fertility-sensitive`
- `renal-risk`
- `infection-risk`
- `chronic-monitoring`
- `post-op-relevant`

### 12.3 Тональность

Нужно строго избегать:

- стигматизирующего языка;
- ненужной тревожности;
- категоричных формулировок без клинических оговорок.

## 13. SEO and Growth Strategy

### 13.1 Три уровня страниц

1. Disease pages
2. Symptom hubs
3. Clinical pathway hubs

### 13.2 Приоритетные SEO-кластеры

Урология:

- кровь в моче;
- почечная колика;
- цистит у мужчин;
- пиелонефрит;
- увеличение простаты;
- ПСА;
- рак простаты;
- задержка мочи.

Андрология:

- эректильная дисфункция;
- варикоцеле;
- бесплодие у мужчин;
- плохая спермограмма;
- гипогонадизм;
- преждевременная эякуляция;
- приапизм.

### 13.3 Внутренняя перелинковка

Связи должны быть:

- symptom -> pathway -> disease;
- disease -> tools;
- disease -> emergency;
- disease -> surgery;
- disease -> follow-up;
- disease -> related diseases;
- stone disease -> metaphylaxis;
- male infertility -> spermogram and fertility preservation.

## 14. Content Governance Plan

### 14.1 Единый content schema

Для каждой болезни обязательны поля:

- `id`
- `slug`
- `title`
- `section`
- `subsection`
- `icd`
- `summaryPatient`
- `summaryClinical`
- `riskLevel`
- `urgencyLevel`
- `keySymptoms`
- `redFlags`
- `diagnosticPathway`
- `treatmentPathway`
- `followUp`
- `references`
- `lastReviewed`
- `reviewStatus`
- `relatedIds`
- `seoTitle`
- `seoDescription`

### 14.2 Дополнительные поля для урологии

- `imagingPlan`
- `obstructionRisk`
- `infectionRisk`
- `renalRisk`
- `stoneProfile`

### 14.3 Дополнительные поля для андрологии

- `fertilityImpact`
- `sexualFunctionImpact`
- `hormonalAxis`
- `partnerPathway`
- `reproductivePlanning`

### 14.4 Editorial workflow

Статусы:

- draft;
- reviewed;
- published;
- needs update.

### 14.5 Контроль качества

Нужно автоматизировать:

- uniqueness slug;
- integrity relatedIds;
- required field checks;
- lastReviewed validation;
- evidence block validation;
- route integrity.

## 15. Design System Roadmap

### 15.1 Visual Direction

Нужно закрепить:

- одну палитру;
- одну иерархию поверхностей;
- один набор акцентных цветов;
- одну систему pills and badges;
- одну типографическую шкалу;
- один motion language.

### 15.2 UI Primitives

Нужно стандартизировать:

- buttons;
- cards;
- panels;
- chips;
- badges;
- alert blocks;
- evidence blocks;
- FAQ blocks;
- TOC/sticky rail;
- empty states;
- skeletons;
- modal shells.

### 15.3 Accessibility

Обязательные направления:

- WCAG 2.1;
- keyboard navigation;
- high contrast control;
- focus states;
- accessible search;
- screen-reader semantics for modals and tabs.

## 16. Technical Roadmap

### 16.1 P0

- исправить кодировки и текстовую целостность;
- завершить hardening маршрутов и lazy-loading;
- ввести content validation pipeline;
- унифицировать metadata layer;
- усилить tests на critical paths.

### 16.2 P1

- ввести architecture boundaries;
- вынести content contract;
- типизировать критичные доменные модули;
- выделить shared UI primitives;
- централизовать route and navigation metadata.

### 16.3 P2

- prerender/SSG for key routes;
- auto sitemap generation;
- structured data expansion;
- analytics by journey;
- performance budget in CI.

## 17. Priority Disease and Journey Backlog

### 17.1 P0 Showcase Diseases

- мочекаменная болезнь;
- пиелонефрит;
- гематурия как pathway hub;
- ДГПЖ;
- эректильная дисфункция;
- мужское бесплодие;
- гипогонадизм;
- варикоцеле;
- приапизм;
- перекрут яичка.

### 17.2 P1 Secondary Expansion

- хронический простатит / CPPS;
- эпидидимит / орхоэпидидимит;
- рак простаты;
- рак почки;
- гидронефроз;
- задержка мочи;
- преждевременная эякуляция;
- Peyronie;
- azoospermia;
- leukocytospermia.

## 18. 12-Week Delivery Roadmap

### Weeks 1-2

- UX/content audit;
- fix encoding issues;
- define design tokens;
- define disease schema;
- establish KPI baseline.

### Weeks 3-4

- redesign landing;
- redesign navbar and search;
- build symptom-entry concept;
- redesign disease modal shell.

### Weeks 5-6

- showcase stone disease;
- build hematuria hub;
- improve emergency integration;
- connect metaphylaxis with stone journey.

### Weeks 7-8

- showcase erectile dysfunction;
- showcase male infertility;
- spermogram pathway;
- fertility-sensitive trust layer.

### Weeks 9-10

- calculators and questionnaires integrated into pathways;
- patient summaries;
- FAQ standardization;
- related journeys network.

### Weeks 11-12

- structured data and sitemap;
- integrity tests;
- polish service pages;
- launch and measure.

## 19. KPI Framework

### 19.1 Product KPIs

- рост глубины просмотра;
- рост переходов из поиска в нозологии;
- рост переходов по related journeys;
- рост completion rate ключевых сценариев;
- снижение пустых поисков.

### 19.2 UX KPIs

- faster time to first relevant action;
- снижение числа возвратов назад из-за путаницы;
- рост interaction with calculators and symptom hubs;
- выше completion in disease modal reading.

### 19.3 Technical KPIs

- stable deep-links;
- no encoding regressions;
- faster modal open;
- lower JS cost on key screens;
- valid schema and sitemap generation.

## 20. Immediate P0 Recommendations

Если запускать работу уже сейчас, первый стек задач должен быть таким:

1. Исправить кодировки во всем пользовательском тексте.
2. Зафиксировать единый шаблон disease card.
3. Пересобрать disease modal как главный premium reading experience.
4. Сделать 4 флагманских потока:
   - мочекаменная болезнь;
   - инфекции;
   - эректильная дисфункция;
   - мужское бесплодие.
5. Запустить symptom hubs:
   - гематурия;
   - дизурия;
   - почечная колика;
   - боль в мошонке;
   - снижение фертильности.
6. Внедрить trust layer и evidence badges.
7. Связать calculators, emergency, surgery и metaphylaxis с disease journeys.

## 21. Reference Template: Disease Card for Urology

### Header

- Название
- МКБ
- 2-3 badges
- last reviewed
- 2 summaries: patient / clinical

### Tabs or Sections

- Обзор
- Симптомы
- Red flags
- Диагностика
- Дифференциальный ряд
- Лечение
- Follow-up
- Пациенту
- FAQ
- Источники

### Right Rail on Desktop

- urgency
- risk
- what to do today
- key tests
- related journeys

## 22. Reference Template: Disease Card for Andrology

### Header

- Название
- деликатный subtitle
- fertility-sensitive / sexual-function badge
- patient-safe summary
- clinical summary

### Tabs or Sections

- Обзор
- Симптомы
- Причины
- Обследование
- Что влияет на фертильность
- Лечение
- Когда оценивать партнера/пару
- Follow-up
- FAQ
- Источники

### Right Rail on Desktop

- impact on fertility
- impact on sexual function
- first-line tests
- what to discuss at first visit
- linked questionnaires

## 23. Final Product Principle

Главное направление развития сайта:

не наращивать страницы ради количества, а превращать каждую ключевую тему в сильный, удобный, доверительный и clinically actionable digital experience.

Если это сделать системно, UroMed сможет восприниматься не как "еще один медицинский сайт", а как реальный digital leader в урологии и андрологии.

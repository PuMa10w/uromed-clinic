# UroMed Implementation Backlog

Дата: 2026-04-23
Статус: actionable backlog
Источник: `uro-andrology-premium-master-plan.md`

## P0: Foundation and Core Reading Experience

### 1. Text Integrity and Encoding

- [ ] Проверить пользовательские тексты в `README`, `src/components`, `src/data`, `src/styles`.
- [ ] Убрать mojibake из UI-строк, метаданных и документации.
- [ ] Добавить проверку кодировки и текстовой целостности в CI.

### 2. Disease Content Contract

- [ ] Зафиксировать обязательные поля disease schema.
- [ ] Ввести валидацию `id`, `slug`, `section`, `subsection`, `relatedIds`.
- [ ] Добавить обязательные поля trust-layer:
  - [ ] `lastReviewed`
  - [ ] `evidenceVersion`
  - [ ] `reviewStatus`
  - [ ] `references`

### 3. Disease Modal Upgrade

- [ ] Пересобрать `DiseaseModalHeader` в формат clinical dossier.
- [ ] Добавить risk, urgency, fertility, oncology badges.
- [ ] Добавить patient summary и clinical focus.
- [ ] Добавить trust rail:
  - [ ] review date
  - [ ] evidence sync
  - [ ] next step
  - [ ] referral logic
- [ ] Улучшить блок related journeys.

### 4. Trust Layer

- [ ] Ввести единые badges:
  - [ ] `urgent`
  - [ ] `oncologic-alert`
  - [ ] `fertility-sensitive`
  - [ ] `infection-risk`
  - [ ] `renal-risk`
  - [ ] `chronic-monitoring`
- [ ] Вынести единый visual pattern для:
  - [ ] "Когда срочно обращаться"
  - [ ] "Что делать сегодня"
  - [ ] "Куда направлять"
  - [ ] "Когда пересмотреть тактику"

## P1: High-Value Clinical Paths

### 5. Showcase Flows

- [ ] `urolithiasis`
- [ ] `infections`
- [ ] `erectile-dysfunction`
- [ ] `male-infertility`

### 6. Symptom Hubs

- [ ] `hematuria`
- [ ] `dysuria`
- [ ] `renal-colic`
- [ ] `scrotal-pain`
- [ ] `fertility-decline`

### 7. Calculators and Questionnaires Integration

- [ ] Встроить результаты калькуляторов в disease journeys.
- [ ] Добавить переходы:
  - [ ] calculator -> disease
  - [ ] calculator -> follow-up
  - [ ] calculator -> red flags

## P1: Navigation and Discovery

### 8. Home Upgrade

- [ ] Добавить symptom-first entrance.
- [ ] Показать top clinical scenarios.
- [ ] Снизить визуальную конкуренцию между hero и feature blocks.

### 9. Search Upgrade

- [ ] Усилить search overlay.
- [ ] Добавить category labels.
- [ ] Добавить urgency markers.
- [ ] Добавить recent, favorites, top conditions.

### 10. Section Hubs

- [ ] У каждого крупного раздела добавить curated pathways.
- [ ] Сделать лучшие входы по клиническим сценариям.

## P2: SEO, Analytics, and Scalability

### 11. SEO

- [ ] Привести страницы к модели:
  - [ ] disease pages
  - [ ] symptom hubs
  - [ ] clinical pathway hubs
- [ ] Расширить schema.org.
- [ ] Автоматизировать sitemap.

### 12. Analytics

- [ ] Пустые поиски
- [ ] Популярные disease opens
- [ ] Related journey clicks
- [ ] Modal depth
- [ ] Calculator completion

### 13. Architecture

- [ ] Вынести слои `app`, `features`, `entities`, `shared`, `content`.
- [ ] Типизировать критичные domain-модули.
- [ ] Ввести shared UI primitives для premium reading components.

## First Delivery Slice

### Спринт 1

- [ ] `DiseaseModalHeader` premium upgrade
- [ ] overview trust layer
- [ ] related journeys upgrade
- [ ] backlog + roadmap docs
- [ ] tests for modal trust experience

### Спринт 2

- [ ] showcase `urolithiasis`
- [ ] showcase `erectile-dysfunction`
- [ ] search overlay improvement
- [ ] symptom-hub specification

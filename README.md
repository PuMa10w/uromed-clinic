# UroMed — Урология и Андрология

Медицинский справочник по урологии и андрологии с доказательными клиническими рекомендациями EAU, AUA, РКР.

## Возможности

- **50+ нозологий** с полным клиническим контентом
- **Клинические рекомендации** EAU, AUA, РКР, UA
- **Калькуляторы** — IPSS, IIEF-5, объём простаты и др.
- **Избранное и история** — сохранение важных статей
- **Поиск** — быстрый доступ по названию, МКБ
- **PWA** — работает офлайн, устанавливается как приложение

## Технологии

- React 19 + React Router
- Framer Motion (анимации)
- React Helmet (SEO)
- Bootstrap 5 + CSS Variables (стили)
- Workbox (PWA/Service Worker)

## Установка

```bash
npm install
npm start
```

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm start` | Запуск dev-сервера |
| `npm run build` | Production билд |
| `npm test` | Запуск тестов |
| `npm run lint` | Проверка кода |
| `npm run lint:fix` | Автоисправление lint |
| `npm run format` | Форматирование Prettier |

## Структура проекта

```
src/
├── components/     # UI компоненты (Navbar, Footer, Modal)
├── config/         # Конфигурация роутов
├── data/          # Данные болезней (140+ файлов)
├── hooks/         # Кастомные React хуки
├── sections/      # Lazy-loaded секции (урология, андрология)
└── utils/         # Утилиты и тесты
```

## Последние улучшения

### SEO и Structured Data
- Расширенные meta tags (keywords, canonical, robots)
- Open Graph и Twitter Card
- JSON-LD schema для MedicalWebPage и WebSite

### Accessibility
- ARIA labels в модалях, навигации, кнопках
- Focus trap в модальных окнах
- Keyboard navigation (Tab, Escape, Arrow keys)
- Skip link для навигации
- Screen reader поддержка (aria-live)

### PWA
- Service Worker с офлайн-кэшированием
- Web App Manifest с ярлыками
- Индикатор офлайн-режима
- Уведомление об обновлении

### UI/UX
- Стилизованный Error Boundary
- Улучшенные skeleton loaders
- Индибок офлайн-статуса

### Инструменты разработки
- ESLint конфиг
- Prettier конфиг
- Unit-тесты для утилит и хуков

## Источники данных

Данные разделены на несколько слоёв:

1. `src/data/index.js` — метаданные нозологий (id, name, icd, section, subsection, icon)
2. `src/data/*Data.js` — полный контент по конкретной нозологии
3. `src/data/diseaseModules.js` — карта id -> module

## Добавление новой нозологии

1. Добавить запись в `src/data/index.js`
2. Создать файл `src/data/<Name>Data.js` с полным контентом
3. Подключить модуль в `src/data/diseaseModules.js`
4. Убедиться, что `section` и `subsection` соответствуют структуре

## Лицензия

MIT

## Ограничения

Проект предназначен для профессионального использования. Медицинская информация не заменяет клиническое мышление и проверку актуальных рекомендаций.
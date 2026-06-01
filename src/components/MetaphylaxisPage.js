import React, { useState } from 'react';
import '../styles/servicePages.css';

const diets = [
  {
    id: 'calcium-oxalate',
    name: '🥛 Кальций-оксалатные камни',
    color: '#16c79a',
    subtitle: '70-80% всех камней',
    goal: 'Снизить оксалаты, повысить цитраты, сохранить нормальный кальций',
    icon: '💎',
    allowed: ['Молоко, йогурт, сыр', 'Лимон, лайм, апельсин', 'Рис, макароны, крупы', 'Курица, рыба умеренно'],
    limited: ['Шпинат, ревень, свёкла', 'Шоколад, какао', 'Орехи', 'Чай'],
    forbidden: ['Витамин C > 1000 мг/сут', 'Избыток крепкого чая', 'Избыток шоколада'],
    sampleMenu: [
      { meal: 'Завтрак', food: 'Овсянка с молоком, банан, лимонный чай' },
      { meal: 'Обед', food: 'Куриная грудка, рис, салат, цитрусовый напиток' },
      { meal: 'Ужин', food: 'Рыба, макароны, кабачки на пару' },
    ],
    tips: 'Кальций с приемом пищи связывает оксалаты в кишечнике. Лимонный сок в воде повышает цитраты.',
  },
  {
    id: 'urate',
    name: '🍷 Уратные камни',
    color: '#f59e0b',
    subtitle: '5-10% всех камней',
    goal: 'Снизить пурины и ощелачивать мочу до pH 6.5-7.0',
    icon: '🟡',
    allowed: ['Молочные продукты', 'Овощи', 'Фрукты', 'Крупы', 'Щелочная минеральная вода'],
    limited: ['Мясо до 150 г/день', 'Рыба до 2 раз/неделю', 'Бобовые умеренно'],
    forbidden: ['Красное мясо', 'Субпродукты', 'Сардины, анчоусы', 'Мясные бульоны', 'Пиво'],
    sampleMenu: [
      { meal: 'Завтрак', food: 'Творог, фрукты, щелочная минеральная вода' },
      { meal: 'Обед', food: 'Овощной суп, картофельное пюре, салат' },
      { meal: 'Ужин', food: 'Омлет, рис, овощи на пару' },
    ],
    tips: 'Бульоны концентрируют пурины. Цитраты и щелочная вода помогают поддерживать целевой pH.',
  },
];

const generalRules = [
  { icon: '🚰', title: 'Гидратация', desc: '> 2.5 л/сут, при цистинурии 3-4 л/сут' },
  { icon: '🧂', title: 'Натрий', desc: '< 5 г соли/сут' },
  { icon: '🥩', title: 'Белок', desc: '< 1 г/кг/сут, ограничить красное мясо' },
  { icon: '🏃', title: 'Активность', desc: 'Не менее 30 минут ежедневно' },
  { icon: '⚖️', title: 'ИМТ', desc: 'Держать в диапазоне 18.5-25' },
  { icon: '🍋', title: 'Цитраты', desc: 'Лимон, лайм, апельсин как естественные ингибиторы камнеобразования' },
];

const MetaphylaxisPage = () => {
  const [activeDiet, setActiveDiet] = useState(null);

  return (
    <section className="section metastaphylaxis-page service-page-shell">
      <h2 className="section-title">Метафилактика МКБ</h2>
      <p className="section-subtitle">Профилактика рецидивов камнеобразования: диеты, питьевой режим и образ жизни</p>

      <div className="meta-general-rules">
        <h3 className="meta-section-title">📋 Общие правила для всех типов камней</h3>
        <div className="meta-rules-grid">
          {generalRules.map((rule, i) => (
            <div key={i} className="meta-rule-card">
              <span className="meta-rule-icon">{rule.icon}</span>
              <h4>{rule.title}</h4>
              <p>{rule.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="meta-diet-selector">
        <h3 className="meta-section-title">🍽️ Выберите тип камней</h3>
        <div className="meta-diet-grid">
          {diets.map((diet) => (
            <div
              key={diet.id}
              className={`meta-diet-card ${activeDiet === diet.id ? 'active' : ''}`}
              onClick={() => setActiveDiet(activeDiet === diet.id ? null : diet.id)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveDiet(activeDiet === diet.id ? null : diet.id)}
              style={{ borderColor: diet.color }}
              role="button"
              tabIndex="0"
              aria-pressed={activeDiet === diet.id}
              aria-label={`${diet.name}: ${diet.subtitle}`}
            >
              <span className="meta-diet-icon">{diet.icon}</span>
              <h4 style={{ color: diet.color }}>{diet.name}</h4>
              <p>{diet.subtitle}</p>
              <p className="meta-diet-goal">{diet.goal}</p>
            </div>
          ))}
        </div>
      </div>

      {activeDiet && (() => {
        const diet = diets.find((item) => item.id === activeDiet);
        if (!diet) return null;

        return (
          <div className="meta-diet-details">
            <div className="meta-diet-header" style={{ borderColor: diet.color }}>
              <h3 style={{ color: diet.color }}>{diet.icon} {diet.name}</h3>
              <p>{diet.goal}</p>
            </div>

            <div className="meta-diet-columns">
              <div className="meta-diet-col allowed">
                <h4 style={{ color: '#16c79a' }}>Можно</h4>
                <ul>{diet.allowed.map((item, i) => <li key={i}>{item}</li>)}</ul>
              </div>
              <div className="meta-diet-col limited">
                <h4 style={{ color: '#f59e0b' }}>Ограничить</h4>
                <ul>{diet.limited.map((item, i) => <li key={i}>{item}</li>)}</ul>
              </div>
              <div className="meta-diet-col forbidden">
                <h4 style={{ color: '#ef4444' }}>Нельзя</h4>
                <ul>{diet.forbidden.map((item, i) => <li key={i}>{item}</li>)}</ul>
              </div>
            </div>

            <div className="meta-sample-menu" style={{ borderColor: diet.color }}>
              <h4 style={{ color: diet.color }}>Примерное меню на день</h4>
              <div className="meta-meals">
                {diet.sampleMenu.map((meal, i) => (
                  <div key={i} className="meta-meal">
                    <span className="meta-meal-label">{meal.meal}</span>
                    <span className="meta-meal-food">{meal.food}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="meta-tip" style={{ borderColor: diet.color }}>
              <strong>Совет:</strong> {diet.tips}
            </div>
          </div>
        );
      })()}
    </section>
  );
};

export default React.memo(MetaphylaxisPage);

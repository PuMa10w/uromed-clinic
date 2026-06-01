import React, { useState } from 'react';
import '../styles/servicePages.css';

const jokes = [
  { id: 1, category: 'urology', emoji: '🔬', setup: 'Пациент урологу:', punchline: 'Доктор, я пью 2 литра воды в день.\nОтлично. А сколько из них чай?\n...все два.', reaction: '😂' },
  { id: 2, category: 'andrology', emoji: '⚡', setup: 'Андролог мужу:', punchline: 'Ваша жена говорит, что у вас проблемы...\nКакие проблемы? Я как кролик!\nКролики живут 8 лет. А вам 62.', reaction: '🤣' },
  { id: 3, category: 'stones', emoji: '💎', setup: 'Уролог пациенту с камнем:', punchline: 'У вас камень 8 мм. Рекомендую ДУВЛТ.\nА можно без операции?\nМожно. Но тогда он будет с вами дольше, чем жена.', reaction: '😅' },
  { id: 4, category: 'bph', emoji: '🔬', setup: 'Мужчина 70 лет урологу:', punchline: 'Доктор, я встаю ночью 7 раз.\nЭто не проблема. Проблема — что вы не ложитесь обратно.', reaction: '🤣' },
];

const categories = [
  { id: 'all', label: 'Все', icon: '🎭' },
  { id: 'urology', label: 'Урология', icon: '🔬' },
  { id: 'andrology', label: 'Андрология', icon: '⚡' },
  { id: 'stones', label: 'Камни', icon: '💎' },
  { id: 'bph', label: 'ДГПЖ', icon: '🔬' },
];

const UroHumorPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [revealedJokes, setRevealedJokes] = useState({});
  const [laughCount, setLaughCount] = useState(0);

  const filtered = activeCategory === 'all' ? jokes : jokes.filter((joke) => joke.category === activeCategory);

  const toggleReveal = (id) => {
    setRevealedJokes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const laugh = (id) => {
    setLaughCount((prev) => prev + 1);
    setRevealedJokes((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className="section uro-humor-page service-page-shell">
      <h2 className="section-title">
        😂 Урологический юмор
      </h2>
      <p className="section-subtitle">
        Медицина — серьезная наука. Но без юмора — никуда! {laughCount > 0 && <span className="laugh-counter">😂×{laughCount}</span>}
      </p>

      <div className="humor-tabs" role="tablist">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`humor-tab ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
            role="tab"
            aria-selected={activeCategory === cat.id}
          >
            <span>{cat.icon}</span> {cat.label}
          </button>
        ))}
      </div>

      <div className="humor-grid">
        {filtered.map((joke) => (
          <div key={joke.id} className="humor-card">
            <div className="humor-card-header">
              <span className="humor-emoji">{joke.emoji}</span>
              <span
                className="humor-reaction"
                onClick={() => laugh(joke.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    laugh(joke.id);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                {joke.reaction}
              </span>
            </div>
            <div className="humor-setup">{joke.setup}</div>
            <div className="humor-punchline-wrapper">
              {!revealedJokes[joke.id] ? (
                <button className="humor-reveal-btn" onClick={() => toggleReveal(joke.id)}>
                  👀 Показать ответ
                </button>
              ) : (
                <div className="humor-punchline">
                  {joke.punchline.split('\n').map((line, i) => (
                    <span key={i} className="humor-punchline-line">{line}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="humor-empty">
          <span style={{ fontSize: '4rem' }}>🤷</span>
          <p>В этой категории пока нет шуток. Но мы работаем над этим.</p>
        </div>
      )}
    </section>
  );
};

export default React.memo(UroHumorPage);

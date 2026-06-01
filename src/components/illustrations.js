import React from 'react';

// ===== УРОЛОГИЯ: ПОЧКИ И МОЧЕВЫЕ ПУТИ =====

export const kidneyUltrasoundSVG = (
  <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="#0a0a0a" rx="8"/>
    {/* Почка - УЗИ */}
    <ellipse cx="200" cy="150" rx="100" ry="70" fill="#1a1a2e" stroke="#333" stroke-width="2"/>
    {/* Корковый слой */}
    <ellipse cx="200" cy="150" rx="90" ry="62" fill="#2a2a4e" opacity="0.6"/>
    {/* Мозговой слой */}
    <ellipse cx="200" cy="150" rx="70" ry="48" fill="#1e1e3e" opacity="0.8"/>
    {/* ЧЛС */}
    <ellipse cx="200" cy="150" rx="35" ry="25" fill="#0d0d1a" stroke="#444" stroke-width="1"/>
    {/* Синус */}
    <ellipse cx="200" cy="150" rx="20" ry="15" fill="#3a3a5e" opacity="0.4"/>
    {/* Метки */}
    <text x="310" y="100" fill="#c9a84c" font-size="11">Корковый слой</text>
    <line x1="280" y1="105" x2="265" y2="115" stroke="#c9a84c" stroke-width="1"/>
    <text x="310" y="130" fill="#16c79a" font-size="11">Мозговой слой</text>
    <line x1="280" y1="135" x2="255" y2="140" stroke="#16c79a" stroke-width="1"/>
    <text x="310" y="160" fill="#e8d48b" font-size="11">ЧЛС</text>
    <line x1="280" y1="160" x2="235" y2="155" stroke="#e8d48b" stroke-width="1"/>
    {/* Заголовок */}
    <text x="10" y="25" fill="#888" font-size="12">УЗИ почек - нормальная анатомия</text>
    <text x="10" y="280" fill="#666" font-size="10">Longitudinal view</text>
  </svg>
);

export const kidneyStoneSVG = (
  <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="#0a0a0a" rx="8"/>
    {/* Почка */}
    <ellipse cx="150" cy="150" rx="80" ry="60" fill="#1a1a2e" stroke="#444" stroke-width="2"/>
    {/* Камень в лоханке */}
    <polygon points="150,120 165,135 160,155 140,155 135,135" fill="#e8d48b" stroke="#c9a84c" stroke-width="2"/>
    {/* Акустическая тень */}
    <polygon points="135,155 165,155 175,250 125,250" fill="#000" opacity="0.5"/>
    {/* Мочеточник */}
    <path d="M150,210 Q145,240 140,270" stroke="#444" stroke-width="3" fill="none"/>
    {/* Метка камня */}
    <text x="250" y="120" fill="#c9a84c" font-size="12">Конкремент</text>
    <line x1="240" y1="125" x2="170" y2="140" stroke="#c9a84c" stroke-width="1"/>
    {/* Акустическая тень метка */}
    <text x="250" y="200" fill="#888" font-size="11">Акустическая тень</text>
    <line x1="240" y1="205" x2="165" y2="210" stroke="#888" stroke-width="1" stroke-dasharray="3,3"/>
    {/* Заголовок */}
    <text x="10" y="25" fill="#888" font-size="12">МКБ - конкремент почки с акустической тенью</text>
  </svg>
);

export const prostateUltrasoundSVG = (
  <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="#0a0a0a" rx="8"/>
    {/* Простата - ТРУЗИ */}
    <ellipse cx="200" cy="160" rx="70" ry="55" fill="#1a1a2e" stroke="#444" stroke-width="2"/>
    {/* Аденоматозный узел */}
    <ellipse cx="200" cy="155" rx="40" ry="35" fill="#2a2a5e" stroke="#16c79a" stroke-width="2"/>
    {/* Уретра */}
    <circle cx="200" cy="155" r="8" fill="#0d0d1a" stroke="#c9a84c" stroke-width="1.5"/>
    {/* Хирургическая капсула */}
    <ellipse cx="200" cy="155" rx="45" ry="40" fill="none" stroke="#c9a84c" stroke-width="1" stroke-dasharray="4,3"/>
    {/* Объём */}
    <text x="10" y="250" fill="#16c79a" font-size="13">V = 45 см³ (норма &lt; 30)</text>
    {/* Метки */}
    <text x="280" y="120" fill="#16c79a" font-size="11">Периферическая зона</text>
    <line x1="270" y1="125" x2="245" y2="140" stroke="#16c79a" stroke-width="1"/>
    <text x="280" y="150" fill="#c9a84c" font-size="11">Аденоматозный узел</text>
    <line x1="270" y1="155" x2="240" y2="155" stroke="#c9a84c" stroke-width="1"/>
    <text x="280" y="180" fill="#e8d48b" font-size="11">Уретра</text>
    <line x1="270" y1="175" x2="210" y2="160" stroke="#e8d48b" stroke-width="1"/>
    {/* Заголовок */}
    <text x="10" y="25" fill="#888" font-size="12">ТРУЗИ - ДГПЖ, объём 45 см³</text>
  </svg>
);

export const bladderUltrasoundSVG = (
  <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="#0a0a0a" rx="8"/>
    {/* Мочевой пузырь */}
    <ellipse cx="200" cy="150" rx="90" ry="70" fill="#0d0d2a" stroke="#16c79a" stroke-width="2"/>
    {/* Содержимое - анэхогенное */}
    <ellipse cx="200" cy="150" rx="85" ry="65" fill="#050515"/>
    {/* Стенка утолщена */}
    <ellipse cx="200" cy="150" rx="90" ry="70" fill="none" stroke="#c9a84c" stroke-width="4"/>
    {/* Опухоль */}
    <ellipse cx="180" cy="120" rx="15" ry="12" fill="#3a3a5e" stroke="#ff6b6b" stroke-width="2"/>
    <text x="280" y="100" fill="#ff6b6b" font-size="11">Опухоль мочевого пузыря</text>
    <line x1="270" y1="105" x2="195" y2="120" stroke="#ff6b6b" stroke-width="1"/>
    {/* Метки */}
    <text x="280" y="150" fill="#c9a84c" font-size="11">Утолщённая стенка</text>
    <line x1="270" y1="155" x2="265" y2="160" stroke="#c9a84c" stroke-width="1"/>
    <text x="280" y="180" fill="#16c79a" font-size="11">Анэхогенное содержимое</text>
    <line x1="270" y1="180" x2="250" y2="165" stroke="#16c79a" stroke-width="1"/>
    {/* Заголовок */}
    <text x="10" y="25" fill="#888" font-size="12">УЗИ мочевого пузыря - опухоль</text>
    <text x="10" y="280" fill="#666" font-size="10">Transverse view</text>
  </svg>
);

// ===== АНАТОМИЧЕСКИЕ СХЕМЫ =====

export const urinarySystemAnatomySVG = (
  <svg viewBox="0 0 400 450" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="450" fill="#0a0a1a" rx="8"/>
    {/* Почка левая */}
    <ellipse cx="140" cy="120" rx="45" ry="60" fill="#1a1a3e" stroke="#16c79a" stroke-width="2"/>
    <ellipse cx="140" cy="120" rx="30" ry="40" fill="#12122a" stroke="#c9a84c" stroke-width="1"/>
    {/* Почка правая */}
    <ellipse cx="260" cy="120" rx="45" ry="60" fill="#1a1a3e" stroke="#16c79a" stroke-width="2"/>
    <ellipse cx="260" cy="120" rx="30" ry="40" fill="#12122a" stroke="#c9a84c" stroke-width="1"/>
    {/* Мочеточники */}
    <path d="M140,180 Q130,250 150,320" stroke="#16c79a" stroke-width="4" fill="none"/>
    <path d="M260,180 Q270,250 250,320" stroke="#16c79a" stroke-width="4" fill="none"/>
    {/* Мочевой пузырь */}
    <ellipse cx="200" cy="350" rx="60" ry="40" fill="#1a1a3e" stroke="#c9a84c" stroke-width="2"/>
    {/* Уретра */}
    <rect x="195" y="390" width="10" height="40" fill="#16c79a" rx="5"/>
    {/* Метки */}
    <text x="50" y="100" fill="#16c79a" font-size="13">Почка</text>
    <text x="30" y="250" fill="#16c79a" font-size="13">Мочеточник</text>
    <text x="270" y="350" fill="#c9a84c" font-size="13">Мочевой пузырь</text>
    <text x="220" y="420" fill="#16c79a" font-size="13">Уретра</text>
    {/* Заголовок */}
    <text x="120" y="30" fill="#e8d48b" font-size="16" font-family="Playfair Display">Мочевыделительная система</text>
  </svg>
);

export const prostateAnatomySVG = (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="400" fill="#0a0a1a" rx="8"/>
    {/* Мочевой пузырь */}
    <ellipse cx="200" cy="80" rx="70" ry="50" fill="#1a1a3e" stroke="#16c79a" stroke-width="2"/>
    <text x="175" y="85" fill="#16c79a" font-size="12">МП</text>
    {/* Простата */}
    <ellipse cx="200" cy="170" rx="50" ry="45" fill="#2a2a5e" stroke="#c9a84c" stroke-width="2"/>
    {/* Зоны */}
    {/* Периферическая зона (70%) */}
    <ellipse cx="200" cy="180" rx="45" ry="35" fill="#1e1e4e" stroke="#ff6b6b" stroke-width="1" stroke-dasharray="3,2"/>
    {/* Центральная зона (25%) */}
    <ellipse cx="200" cy="160" rx="30" ry="25" fill="#252558" stroke="#6495ed" stroke-width="1" stroke-dasharray="3,2"/>
    {/* Переходная зона (5%) - аденома */}
    <ellipse cx="200" cy="155" rx="15" ry="12" fill="#3a3a6e" stroke="#e8d48b" stroke-width="1.5"/>
    {/* Уретра */}
    <rect x="195" y="100" width="10" height="120" fill="#16c79a" rx="5"/>
    {/* Семенные пузырьки */}
    <ellipse cx="160" cy="130" rx="15" ry="25" fill="#1a1a3e" stroke="#888" stroke-width="1.5" transform="rotate(-15, 160, 130)"/>
    <ellipse cx="240" cy="130" rx="15" ry="25" fill="#1a1a3e" stroke="#888" stroke-width="1.5" transform="rotate(15, 240, 130)"/>
    {/* Прямая кишка */}
    <ellipse cx="200" cy="250" rx="60" ry="30" fill="#0d0d1a" stroke="#666" stroke-width="1.5" stroke-dasharray="5,3"/>
    {/* Метки */}
    <text x="260" y="160" fill="#ff6b6b" font-size="10">Периферическая зона (70%)</text>
    <text x="260" y="145" fill="#6495ed" font-size="10">Центральная зона (25%)</text>
    <text x="260" y="130" fill="#e8d48b" font-size="10">Переходная зона (5%)</text>
    <text x="260" y="250" fill="#666" font-size="10">Прямая кишка (ТРУЗИ доступ)</text>
    {/* Заголовок */}
    <text x="110" y="30" fill="#e8d48b" font-size="16" font-family="Playfair Display">Зоны предстательной железы (McNeal)</text>
    <text x="30" y="380" fill="#888" font-size="11">Сагиттальный разрез</text>
  </svg>
);

export const testicleAnatomySVG = (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="400" fill="#0a0a1a" rx="8"/>
    {/* Мошонка */}
    <ellipse cx="200" cy="200" rx="100" ry="130" fill="#0d0d2a" stroke="#444" stroke-width="2"/>
    {/* Яичко */}
    <ellipse cx="200" cy="200" rx="70" ry="90" fill="#1a1a3e" stroke="#16c79a" stroke-width="2"/>
    {/* Средостение */}
    <line x1="200" y1="120" x2="200" y2="280" stroke="#c9a84c" stroke-width="2"/>
    {/* Дольки */}
    <path d="M200,130 Q160,160 155,200" stroke="#c9a84c" stroke-width="1" fill="none"/>
    <path d="M200,130 Q240,160 245,200" stroke="#c9a84c" stroke-width="1" fill="none"/>
    <path d="M200,270 Q160,240 155,200" stroke="#c9a84c" stroke-width="1" fill="none"/>
    <path d="M200,270 Q240,240 245,200" stroke="#c9a84c" stroke-width="1" fill="none"/>
    {/* Придаток */}
    <ellipse cx="280" cy="180" rx="20" ry="60" fill="#2a2a5e" stroke="#e8d48b" stroke-width="2"/>
    {/* Варикозные вены (варикоцеле) */}
    <path d="M150,140 Q130,180 140,220" stroke="#ff6b6b" stroke-width="4" fill="none" opacity="0.6"/>
    <path d="M160,130 Q145,175 150,215" stroke="#ff6b6b" stroke-width="3" fill="none" opacity="0.5"/>
    <path d="M170,125 Q160,170 160,210" stroke="#ff6b6b" stroke-width="3" fill="none" opacity="0.4"/>
    {/* Семенной канатик */}
    <rect x="185" y="80" width="30" height="50" fill="#1a1a3e" stroke="#888" stroke-width="1.5" rx="5"/>
    {/* Метки */}
    <text x="310" y="160" fill="#e8d48b" font-size="11">Придаток</text>
    <text x="310" y="180" fill="#16c79a" font-size="11">Яичко</text>
    <text x="100" y="170" fill="#ff6b6b" font-size="11">Варикозные вены</text>
    <text x="180" y="70" fill="#888" font-size="11">Семенной канатик</text>
    {/* Заголовок */}
    <text x="130" y="30" fill="#e8d48b" font-size="16" font-family="Playfair Display">Анатомия яичка</text>
    <text x="120" y="370" fill="#888" font-size="11">Фронтальный разрез</text>
  </svg>
);

// ===== АЛГОРИТМЫ И СХЕМЫ ЛЕЧЕНИЯ =====

export const bphTreatmentAlgorithmSVG = (
  <svg viewBox="0 0 500 600" xmlns="http://www.w3.org/2000/svg">
    <rect width="500" height="600" fill="#0a0a1a" rx="8"/>
    <text x="130" y="35" fill="#e8d48b" font-size="18" font-family="Playfair Display">Алгоритм лечения ДГПЖ</text>
    
    {/* IPSS оценка */}
    <rect x="150" y="55" width="200" height="45" fill="#1a1a3e" stroke="#c9a84c" stroke-width="2" rx="10"/>
    <text x="250" y="73" fill="#c9a84c" font-size="12" text-anchor="middle" font-weight="bold">Оценка IPSS</text>
    <text x="250" y="90" fill="#aaa" font-size="11" text-anchor="middle">Лёгкие / Умеренные / Тяжёлые</text>
    <text x="355" y="105" fill="#16c79a" font-size="18">↓</text>
    
    {/* Лёгкие симптомы */}
    <rect x="30" y="120" width="140" height="55" fill="#1a1a3e" stroke="#6495ed" stroke-width="2" rx="10"/>
    <text x="100" y="140" fill="#6495ed" font-size="11" text-anchor="middle" font-weight="bold">IPSS 0-7</text>
    <text x="100" y="158" fill="#aaa" font-size="10" text-anchor="middle">Активное наблюдение</text>
    <text x="355" y="145" fill="#16c79a" font-size="18">↓</text>
    
    {/* Умеренные-тяжёлые */}
    <rect x="180" y="120" width="140" height="55" fill="#2a2a5e" stroke="#c9a84c" stroke-width="2" rx="10"/>
    <text x="250" y="140" fill="#c9a84c" font-size="11" text-anchor="middle" font-weight="bold">IPSS 8-35</text>
    <text x="250" y="158" fill="#aaa" font-size="10" text-anchor="middle">Медикаментозная терапия</text>
    
    {/* Объём простаты */}
    <rect x="330" y="120" width="140" height="55" fill="#1a1a3e" stroke="#16c79a" stroke-width="2" rx="10"/>
    <text x="400" y="140" fill="#16c79a" font-size="11" text-anchor="middle" font-weight="bold">Объём &gt; 40 мл</text>
    <text x="400" y="158" fill="#aaa" font-size="10" text-anchor="middle">Комбинированная</text>
    <text x="355" y="180" fill="#16c79a" font-size="18">↓</text>
    
    {/* α-блокаторы */}
    <rect x="30" y="200" width="220" height="50" fill="#1a1a3e" stroke="#e8d48b" stroke-width="2" rx="10"/>
    <text x="140" y="220" fill="#e8d48b" font-size="12" text-anchor="middle" font-weight="bold">α1-адреноблокаторы</text>
    <text x="140" y="238" fill="#aaa" font-size="10" text-anchor="middle">Тамсулозин, Силазодозин</text>
    
    {/* и5αР */}
    <rect x="260" y="200" width="210" height="50" fill="#1a1a3e" stroke="#ff6b6b" stroke-width="2" rx="10"/>
    <text x="365" y="220" fill="#ff6b6b" font-size="12" text-anchor="middle" font-weight="bold">Ингибиторы 5α-редуктазы</text>
    <text x="365" y="238" fill="#aaa" font-size="10" text-anchor="middle">Дутастерид, Финастерид</text>
    <text x="355" y="255" fill="#16c79a" font-size="18">↓</text>
    
    {/* Комбинированная */}
    <rect x="150" y="270" width="200" height="50" fill="#2a2a5e" stroke="#c9a84c" stroke-width="2" rx="10"/>
    <text x="250" y="290" fill="#c9a84c" font-size="12" text-anchor="middle" font-weight="bold">Комбинированная терапия</text>
    <text x="250" y="308" fill="#aaa" font-size="10" text-anchor="middle">α-блокатор + и5αР</text>
    <text x="355" y="325" fill="#16c79a" font-size="18">↓</text>
    
    {/* Неэффективность */}
    <rect x="150" y="340" width="200" height="45" fill="#3a1a1a" stroke="#ff6b6b" stroke-width="2" rx="10"/>
    <text x="250" y="358" fill="#ff6b6b" font-size="12" text-anchor="middle" font-weight="bold">Неэффективность?</text>
    <text x="250" y="375" fill="#aaa" font-size="10" text-anchor="middle">ОЗМ, рецидивирующие ИМП</text>
    <text x="355" y="390" fill="#16c79a" font-size="18">↓</text>
    
    {/* Хирургия */}
    <rect x="80" y="410" width="340" height="55" fill="#2a1a3e" stroke="#c9a84c" stroke-width="2" rx="10"/>
    <text x="250" y="432" fill="#c9a84c" font-size="13" text-anchor="middle" font-weight="bold">Хирургическое лечение</text>
    <text x="250" y="452" fill="#aaa" font-size="10" text-anchor="middle">ТУР / HoLEP / PVP / UroLift / Rezum</text>
    <text x="355" y="470" fill="#16c79a" font-size="18">↓</text>
    
    {/* Объём */}
    <rect x="30" y="490" width="130" height="50" fill="#1a1a3e" stroke="#6495ed" stroke-width="1.5" rx="8"/>
    <text x="95" y="510" fill="#6495ed" font-size="10" text-anchor="middle">30-80 мл</text>
    <text x="95" y="528" fill="#aaa" font-size="10" text-anchor="middle" font-weight="bold">ТУР</text>
    
    <rect x="180" y="490" width="130" height="50" fill="#1a1a3e" stroke="#16c79a" stroke-width="1.5" rx="8"/>
    <text x="245" y="510" fill="#16c79a" font-size="10" text-anchor="middle">&gt; 80 мл</text>
    <text x="245" y="528" fill="#aaa" font-size="10" text-anchor="middle" font-weight="bold">HoLEP</text>
    
    <rect x="330" y="490" width="140" height="50" fill="#1a1a3e" stroke="#e8d48b" stroke-width="1.5" rx="8"/>
    <text x="400" y="510" fill="#e8d48b" font-size="10" text-anchor="middle">Сохранить эякуляцию</text>
    <text x="400" y="528" fill="#aaa" font-size="10" text-anchor="middle" font-weight="bold">UroLift / Rezum</text>
    
    {/* Легенда */}
    <text x="30" y="570" fill="#888" font-size="10">На основе EAU/AUA Guidelines 2025</text>
  </svg>
);

export const prostateCancerStagingSVG = (
  <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
    <rect width="500" height="500" fill="#0a0a1a" rx="8"/>
    <text x="130" y="35" fill="#e8d48b" font-size="18" font-family="Playfair Display">Стадирование рака простаты</text>
    
    {/* T1 */}
    <rect x="30" y="60" width="210" height="80" fill="#1a2a1a" stroke="#16c79a" stroke-width="2" rx="10"/>
    <text x="135" y="85" fill="#16c79a" font-size="16" text-anchor="middle" font-weight="bold">T1 - Клинически не определяется</text>
    <text x="135" y="105" fill="#aaa" font-size="11" text-anchor="middle">T1a: &lt; 5% ткани</text>
    <text x="135" y="122" fill="#aaa" font-size="11" text-anchor="middle">T1b: &gt; 5% ткани</text>
    <text x="135" y="132" fill="#aaa" font-size="11" text-anchor="middle">T1c: биопсия по ПСА</text>
    
    {/* T2 */}
    <rect x="260" y="60" width="210" height="80" fill="#1a2a1a" stroke="#16c79a" stroke-width="2" rx="10"/>
    <text x="365" y="85" fill="#16c79a" font-size="16" text-anchor="middle" font-weight="bold">T2 - Ограничена простатой</text>
    <text x="365" y="105" fill="#aaa" font-size="11" text-anchor="middle">T2a: одна доля</text>
    <text x="365" y="122" fill="#aaa" font-size="11" text-anchor="middle">T2b: обе доли</text>
    <text x="365" y="132" fill="#aaa" font-size="11" text-anchor="middle">T2c: двустороннее</text>
    
    {/* T3 */}
    <rect x="30" y="160" width="210" height="80" fill="#2a2a1a" stroke="#e8d48b" stroke-width="2" rx="10"/>
    <text x="135" y="185" fill="#e8d48b" font-size="16" text-anchor="middle" font-weight="bold">T3 - Экстрапростатическое</text>
    <text x="135" y="205" fill="#aaa" font-size="11" text-anchor="middle">T3a: экстракапсулярное</text>
    <text x="135" y="222" fill="#aaa" font-size="11" text-anchor="middle">T3b: семенные пузырьки</text>
    <text x="135" y="235" fill="#888" font-size="10" text-anchor="middle">⚠ Высокий риск</text>
    
    {/* T4 */}
    <rect x="260" y="160" width="210" height="80" fill="#3a1a1a" stroke="#ff6b6b" stroke-width="2" rx="10"/>
    <text x="365" y="185" fill="#ff6b6b" font-size="16" text-anchor="middle" font-weight="bold">T4 - Инвазия соседних</text>
    <text x="365" y="205" fill="#aaa" font-size="11" text-anchor="middle">Шейка МП, сфинктер,</text>
    <text x="365" y="222" fill="#aaa" font-size="11" text-anchor="middle">прямая кишка</text>
    <text x="365" y="235" fill="#888" font-size="10" text-anchor="middle">⚠ Очень высокий риск</text>
    
    {/* Grade Groups */}
    <text x="150" y="280" fill="#e8d48b" font-size="15" font-family="Playfair Display">Grade Groups (ISUP)</text>
    
    {/* GG1 */}
    <rect x="30" y="300" width="85" height="50" fill="#1a2a1a" stroke="#16c79a" stroke-width="1.5" rx="8"/>
    <text x="72" y="320" fill="#16c79a" font-size="12" text-anchor="middle" font-weight="bold">GG 1</text>
    <text x="72" y="338" fill="#aaa" font-size="10" text-anchor="middle">Глисон 3+3=6</text>
    
    {/* GG2 */}
    <rect x="125" y="300" width="85" height="50" fill="#1a2a1a" stroke="#6495ed" stroke-width="1.5" rx="8"/>
    <text x="167" y="320" fill="#6495ed" font-size="12" text-anchor="middle" font-weight="bold">GG 2</text>
    <text x="167" y="338" fill="#aaa" font-size="10" text-anchor="middle">Глисон 3+4=7</text>
    
    {/* GG3 */}
    <rect x="220" y="300" width="85" height="50" fill="#2a2a1a" stroke="#e8d48b" stroke-width="1.5" rx="8"/>
    <text x="262" y="320" fill="#e8d48b" font-size="12" text-anchor="middle" font-weight="bold">GG 3</text>
    <text x="262" y="338" fill="#aaa" font-size="10" text-anchor="middle">Глисон 4+3=7</text>
    
    {/* GG4 */}
    <rect x="315" y="300" width="85" height="50" fill="#2a1a1a" stroke="#ff8c00" stroke-width="1.5" rx="8"/>
    <text x="357" y="320" fill="#ff8c00" font-size="12" text-anchor="middle" font-weight="bold">GG 4</text>
    <text x="357" y="338" fill="#aaa" font-size="10" text-anchor="middle">Глисон 8</text>
    
    {/* GG5 */}
    <rect x="410" y="300" width="85" height="50" fill="#3a1a1a" stroke="#ff4444" stroke-width="1.5" rx="8"/>
    <text x="452" y="320" fill="#ff4444" font-size="12" text-anchor="middle" font-weight="bold">GG 5</text>
    <text x="452" y="338" fill="#aaa" font-size="10" text-anchor="middle">Глисон 9-10</text>
    
    {/* Риск-стратификация */}
    <text x="120" y="390" fill="#e8d48b" font-size="15" font-family="Playfair Display">Стратификация риска</text>
    
    <rect x="30" y="410" width="130" height="40" fill="#1a2a1a" stroke="#16c79a" stroke-width="1.5" rx="8"/>
    <text x="95" y="435" fill="#16c79a" font-size="12" text-anchor="middle">Низкий: GG1, ПСА&lt;10</text>
    
    <rect x="180" y="410" width="130" height="40" fill="#2a2a1a" stroke="#e8d48b" stroke-width="1.5" rx="8"/>
    <text x="245" y="435" fill="#e8d48b" font-size="12" text-anchor="middle">Промежуточный: GG2-3</text>
    
    <rect x="330" y="410" width="160" height="40" fill="#3a1a1a" stroke="#ff6b6b" stroke-width="1.5" rx="8"/>
    <text x="410" y="435" fill="#ff6b6b" font-size="12" text-anchor="middle">Высокий: GG4-5, ПСА&gt;20</text>
    
    <text x="30" y="480" fill="#888" font-size="10">На основе EAU/AUA/NCCN Guidelines 2025</text>
  </svg>
);

export const edTreatmentAlgorithmSVG = (
  <svg viewBox="0 0 500 550" xmlns="http://www.w3.org/2000/svg">
    <rect width="500" height="550" fill="#0a0a1a" rx="8"/>
    <text x="120" y="35" fill="#e8d48b" font-size="18" font-family="Playfair Display">Лечение эректильной дисфункции</text>
    
    {/* Диагностика */}
    <rect x="100" y="55" width="300" height="50" fill="#1a1a3e" stroke="#c9a84c" stroke-width="2" rx="10"/>
    <text x="250" y="75" fill="#c9a84c" font-size="13" text-anchor="middle" font-weight="bold">Оценка: IIEF-5, тестостерон, глюкоза, липиды</text>
    <text x="250" y="93" fill="#aaa" font-size="11" text-anchor="middle">Исключить гипогонадизм, ССЗ</text>
    <text x="250" y="110" fill="#16c79a" font-size="20">↓</text>
    
    {/* Первая линия */}
    <rect x="50" y="120" width="400" height="70" fill="#1a2a1a" stroke="#16c79a" stroke-width="2" rx="10"/>
    <text x="250" y="145" fill="#16c79a" font-size="14" text-anchor="middle" font-weight="bold">1-я линия: Ингибиторы ФДЭ-5</text>
    <text x="250" y="165" fill="#aaa" font-size="11" text-anchor="middle">Силденафил | Тадалафил | Варденафил | Аванафил</text>
    <text x="250" y="182" fill="#888" font-size="10" text-anchor="middle">Эффективность 70-80%</text>
    <text x="250" y="195" fill="#16c79a" font-size="20">↓</text>
    
    {/* Неэффективность */}
    <rect x="130" y="210" width="240" height="40" fill="#2a2a1a" stroke="#e8d48b" stroke-width="2" rx="8"/>
    <text x="250" y="235" fill="#e8d48b" font-size="12" text-anchor="middle">Неэффективность?</text>
    <text x="250" y="255" fill="#16c79a" font-size="20">↓</text>
    
    {/* Вторая линия */}
    <rect x="50" y="270" width="400" height="75" fill="#1a1a3e" stroke="#6495ed" stroke-width="2" rx="10"/>
    <text x="250" y="295" fill="#6495ed" font-size="14" text-anchor="middle" font-weight="bold">2-я линия</text>
    <text x="250" y="315" fill="#aaa" font-size="11" text-anchor="middle">Интракавернозные инъекции (алпростадил)</text>
    <text x="250" y="332" fill="#aaa" font-size="11" text-anchor="middle">Вакуумная терапия (VED) | Li-ESWT</text>
    <text x="250" y="348" fill="#16c79a" font-size="20">↓</text>
    
    {/* Неэффективность 2 */}
    <rect x="130" y="360" width="240" height="40" fill="#2a2a1a" stroke="#e8d48b" stroke-width="2" rx="8"/>
    <text x="250" y="385" fill="#e8d48b" font-size="12" text-anchor="middle">Неэффективность?</text>
    <text x="250" y="405" fill="#16c79a" font-size="20">↓</text>
    
    {/* Третья линия */}
    <rect x="50" y="420" width="400" height="60" fill="#2a1a3e" stroke="#ff6b6b" stroke-width="2" rx="10"/>
    <text x="250" y="445" fill="#ff6b6b" font-size="14" text-anchor="middle" font-weight="bold">3-я линия: Фаллопротезирование</text>
    <text x="250" y="465" fill="#aaa" font-size="11" text-anchor="middle">Надувной (AMS 700) | Полужёсткий (Coloplast)</text>
    <text x="250" y="480" fill="#888" font-size="10" text-anchor="middle">Удовлетворённость &gt; 90%</text>
    
    {/* Гипогонадизм */}
    <rect x="30" y="500" width="200" height="40" fill="#3a1a1a" stroke="#ff8c00" stroke-width="1.5" rx="8"/>
    <text x="130" y="525" fill="#ff8c00" font-size="11" text-anchor="middle">При гипогонадизме: ЗТТ тестостероном</text>
    
    <text x="30" y="545" fill="#888" font-size="10">На основе EAU/AUA Guidelines 2025</text>
  </svg>
);

// ===== ЭКСПОРТ ВСЕХ ИЛЛЮСТРАЦИЙ =====
const illustrations = {
  kidneyUltrasoundSVG,
  kidneyStoneSVG,
  prostateUltrasoundSVG,
  bladderUltrasoundSVG,
  urinarySystemAnatomySVG,
  prostateAnatomySVG,
  testicleAnatomySVG,
  bphTreatmentAlgorithmSVG,
  prostateCancerStagingSVG,
  edTreatmentAlgorithmSVG
};

export default illustrations;

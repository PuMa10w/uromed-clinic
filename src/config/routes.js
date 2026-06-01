/**
 * Конфигурация разделов приложения - статические данные
 */

export const SUBSECTION_TITLES = {
  urology: {
    stones: { title: 'Мочекаменная', icon: '💎', desc: 'Нефролитиаз, уретеролитиаз' },
    infections: { title: 'Инфекции', icon: '🔥', desc: 'Цистит, пиелонефрит, абсцесс, гангрена Фурнье' },
    oncology: { title: 'Онкология', icon: '🎗️', desc: 'Рак простаты, мочевого пузыря, почки, яичка' },
    functional: { title: 'Функциональная', icon: '⚡', desc: 'ДГПЖ, ГАМП, семенные пузырьки, кисты простаты' },
    reconstructive: { title: 'Реконструктивная', icon: '🔧', desc: 'Стриктуры, свищи, дивертикулы, парафимоз, перекрут' },
    nephrology: { title: 'Нефрология', icon: '🫘', desc: 'Гломерулонефрит, ХБП, ОПП, поликистоз, стеноз, инфаркт, тромбоз' },
    pain: { title: 'Болевой синдром', icon: '💢', desc: 'Болевой синдром МП, малакоплакия' },
  },
  andrology: {
    sexual: { title: 'Сексуальная', icon: '⚡', desc: 'ЭД, ПЭ, болезнь Пейрони, приапизм' },
    fertility: { title: 'Фертильность', icon: '🧬', desc: 'Бесплодие, варикоцеле, крипторхизм' },
    endocrine: { title: 'Эндокринология', icon: '⚗️', desc: 'Гипогонадизм, гормональные нарушения' },
  },
};

export const SECTION_TITLES = {
  urology: 'УРОЛОГИЯ',
  andrology: 'АНДРОЛОГИЯ',
  pediatric: 'ДЕТСКАЯ УРОЛОГИЯ',
};

export const SECTION_ICD = {
  urology: 'N00-N39',
  andrology: 'N40-N51',
  pediatric: 'Q53-Q64',
};

export const SECTION_SUBTITLE = {
  urology: 'Заболевания мочевыделительной системы (N00-N39 по МКБ-10)',
  andrology: 'Заболевания мужской половой сферы (N40-N51 по МКБ-10)',
  pediatric: 'Врождённые аномалии мочеполовой системы (Q53-Q64 по МКБ-10)',
};

export function getSectionTitle(section) {
  return SECTION_TITLES[section] || section;
}

export function getSectionIcd(section) {
  return SECTION_ICD[section] || '';
}

export function getSectionSubtitle(section) {
  return SECTION_SUBTITLE[section] || '';
}

export function getSubsectionData(section, subsection) {
  return SUBSECTION_TITLES[section]?.[subsection] || null;
}
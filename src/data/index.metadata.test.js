import { sectionIcons, sectionNames, sections, subsectionLabels } from './index';

describe('data metadata integrity', () => {
  it('keeps top-level section labels readable and localized', () => {
    expect(sections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'home', label: 'Главная', icon: '🏠' }),
        expect.objectContaining({ id: 'urology', label: 'Урология', icon: '🔬' }),
        expect.objectContaining({ id: 'andrology', label: 'Андрология', icon: '⚡' }),
        expect.objectContaining({ id: 'sitemap', label: 'Карта', icon: '🗺️' }),
      ]),
    );
  });

  it('keeps subsection and section dictionaries in clean Russian', () => {
    expect(subsectionLabels).toMatchObject({
      stones: 'Мочекаменная',
      infections: 'Инфекции',
      oncology: 'Онкология',
      functional: 'Функциональная',
      reconstructive: 'Реконструктивная',
      nephrology: 'Нефрология',
      pain: 'Болевой синдром',
      sexual: 'Сексуальная',
      fertility: 'Фертильность',
      endocrine: 'Эндокринология',
    });

    expect(sectionNames).toMatchObject({
      home: 'Главная',
      urology: 'Урология',
      andrology: 'Андрология',
      surgery: 'Хирургия',
      metaphylaxis: 'Диеты при МКБ',
      sitemap: 'Карта сайта',
    });

    expect(sectionIcons).toMatchObject({
      home: '🏠',
      urology: '🔬',
      andrology: '⚡',
      surgery: '🔪',
      sitemap: '🗺️',
    });
  });
});

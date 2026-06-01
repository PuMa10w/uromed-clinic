import {
  timeAgo,
  parseHash,
  parseLocation,
  buildPath,
  buildHash,
} from './utils';

const MOCK_SUBSECTION_TITLES = {
  urology: { stones: 'Мочекаменная болезнь', infections: 'Инфекции', oncology: 'Онкология', functional: 'Функциональная' },
  andrology: { sexual: 'Сексуальная дисфункция', fertility: 'Фертильность', endocrine: 'Эндокринология' },
};

describe('App Utility Functions', () => {
  describe('timeAgo', () => {
    it('returns "только что" for less than a minute', () => {
      const now = Date.now();
      expect(timeAgo(now)).toBe('только что');
    });

    it('returns minutes ago for less than an hour', () => {
      const fiveMinutesAgo = Date.now() - 5 * 60000;
      expect(timeAgo(fiveMinutesAgo)).toBe('5 мин назад');
    });

    it('returns hours ago for less than a day', () => {
      const threeHoursAgo = Date.now() - 3 * 3600000;
      expect(timeAgo(threeHoursAgo)).toBe('3 ч назад');
    });

    it('returns days ago for more than a day', () => {
      const twoDaysAgo = Date.now() - 2 * 86400000;
      expect(timeAgo(twoDaysAgo)).toBe('2 дн назад');
    });
  });

  describe('parseHash', () => {
    it('parses home page', () => {
      expect(parseHash('', {})).toEqual({ section: 'home', subsection: null, diseaseId: null });
      expect(parseHash('#home', {})).toEqual({ section: 'home', subsection: null, diseaseId: null });
    });

    it('parses section without subsection', () => {
      expect(parseHash('#urology', {})).toEqual({ section: 'urology', subsection: null, diseaseId: null });
    });

    it('parses section with subsection', () => {
      expect(parseHash('#urology/stones', MOCK_SUBSECTION_TITLES)).toEqual({ section: 'urology', subsection: 'stones', diseaseId: null });
    });

    it('parses section with disease id', () => {
      expect(parseHash('#urology/bph', {})).toEqual({ section: 'urology', subsection: null, diseaseId: 'bph' });
    });

    it('parses section with subsection and disease id', () => {
      expect(parseHash('#urology/stones/urolithiasis', MOCK_SUBSECTION_TITLES)).toEqual({ section: 'urology', subsection: 'stones', diseaseId: 'urolithiasis' });
    });

    it('handles unknown hash parts', () => {
      expect(parseHash('#unknown', {})).toEqual({ section: 'unknown', subsection: null, diseaseId: null });
    });
  });

  describe('parseLocation', () => {
    it('parses pathname-based home route', () => {
      expect(parseLocation('/', '', {})).toEqual({ section: 'home', subsection: null, diseaseId: null });
    });

    it('parses pathname-based subsection route', () => {
      expect(parseLocation('/urology/stones', '', MOCK_SUBSECTION_TITLES)).toEqual({
        section: 'urology',
        subsection: 'stones',
        diseaseId: null,
      });
    });

    it('parses pathname-based disease route', () => {
      expect(parseLocation('/urology/stones/urolithiasis', '', MOCK_SUBSECTION_TITLES)).toEqual({
        section: 'urology',
        subsection: 'stones',
        diseaseId: 'urolithiasis',
      });
    });

    it('falls back to legacy hash route when pathname is home', () => {
      expect(parseLocation('/', '#andrology/sexual/erectile-dysfunction', MOCK_SUBSECTION_TITLES)).toEqual({
        section: 'andrology',
        subsection: 'sexual',
        diseaseId: 'erectile-dysfunction',
      });
    });
  });

  describe('buildPath', () => {
    it('returns slash for home', () => {
      expect(buildPath('home', null, null)).toBe('/');
    });

    it('builds section path', () => {
      expect(buildPath('urology', null, null)).toBe('/urology');
    });

    it('builds section with subsection path', () => {
      expect(buildPath('urology', 'stones', null)).toBe('/urology/stones');
    });

    it('builds full disease path', () => {
      expect(buildPath('urology', 'stones', 'urolithiasis')).toBe('/urology/stones/urolithiasis');
    });
  });

  describe('buildHash', () => {
    it('returns empty string for home', () => {
      expect(buildHash('home', null, null)).toBe('');
    });

    it('builds section hash', () => {
      expect(buildHash('urology', null, null)).toBe('#urology');
    });

    it('builds section with subsection hash', () => {
      expect(buildHash('urology', 'stones', null)).toBe('#urology/stones');
    });

    it('builds section with disease hash', () => {
      expect(buildHash('urology', null, 'bph')).toBe('#urology/bph');
    });

    it('builds full hash', () => {
      expect(buildHash('urology', 'stones', 'urolithiasis')).toBe('#urology/stones/urolithiasis');
    });
  });
});

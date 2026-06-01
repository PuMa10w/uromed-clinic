import { enrichDiseaseMetadata, enrichDiseaseMetadataList } from './enrichMetadata';

describe('enrichMetadata', () => {
  it('adds richer clinical description and tags for lightweight metadata', () => {
    const enriched = enrichDiseaseMetadata({
      id: 'urolithiasis',
      name: 'Мочекаменная болезнь',
      icd: 'N20',
      section: 'urology',
      subsection: 'stones',
      icon: '💎',
    });

    expect(enriched.description).toContain('Мочекаменная болезнь');
    expect(enriched.description).toContain('диагностика камней');
    expect(Array.isArray(enriched.tags)).toBe(true);
    expect(enriched.tags).toEqual(expect.arrayContaining(['Урология', 'МКБ']));
  });

  it('does not overwrite existing description and tags', () => {
    const enriched = enrichDiseaseMetadata({
      id: 'custom',
      name: 'Custom',
      icd: 'X00',
      section: 'urology',
      subsection: 'stones',
      description: 'Existing description',
      tags: ['Existing'],
    });

    expect(enriched.description).toBe('Existing description');
    expect(enriched.tags).toEqual(['Existing']);
  });

  it('enriches arrays of diseases', () => {
    const enriched = enrichDiseaseMetadataList([
      {
        id: 'bph',
        name: 'ДГПЖ',
        icd: 'N40',
        section: 'urology',
        subsection: 'functional',
      },
    ]);

    expect(enriched).toHaveLength(1);
    expect(enriched[0].description).toContain('поведенческая терапия');
    expect(enriched[0].tags).toEqual(expect.arrayContaining(['Урология']));
  });
});

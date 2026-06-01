import { searchDiseases } from './index';

describe('searchDiseases', () => {
  it('finds diseases by clinical abbreviation', () => {
    const results = searchDiseases('дгпж');

    expect(results[0]?.id).toBe('bph');
  });

  it('prioritizes exact ICD matches', () => {
    const results = searchDiseases('N23');

    expect(results[0]?.id).toBe('renal-colic');
  });

  it('supports transliterated synonyms', () => {
    const results = searchDiseases('rak prostaty');

    expect(results[0]?.id).toBe('prostate-cancer');
  });

  it('supports latin keyboard layout mistakes for Russian abbreviations', () => {
    const results = searchDiseases('lug;');

    expect(results[0]?.id).toBe('bph');
  });

  it('finds by symptom-style and lab-style clinical queries', () => {
    expect(searchDiseases('плохая спермограмма')[0]?.id).toBe('male-infertility');
    expect(searchDiseases('слабая эрекция')[0]?.id).toBe('erectile-dysfunction');
  });

  it('keeps useful results when the query has a typo', () => {
    const results = searchDiseases('пиелонефрти');

    expect(results[0]?.id).toBe('pyelonephritis');
  });
});

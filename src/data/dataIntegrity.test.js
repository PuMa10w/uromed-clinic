import { allDiseases } from './index';
import { preloadDiseaseData } from './lazyData';
import { normalizeDisease } from '../components/diseaseModal/normalizeDisease';

describe('disease data integrity', () => {
  it('loads and normalizes every registered disease route without throwing', async () => {
    const failures = [];

    for (const disease of allDiseases) {
      try {
        const loaded = await preloadDiseaseData(disease.id);
        const normalized = normalizeDisease(loaded || disease);

        expect(normalized.id).toBe(disease.id);
        expect(normalized.name).toBeTruthy();
      } catch (error) {
        failures.push(`${disease.id}: ${error.message}`);
      }
    }

    expect(failures).toEqual([]);
  });
});

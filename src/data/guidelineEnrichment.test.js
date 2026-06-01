import { enrichDiseaseGuidelines } from './guidelineEnrichment';

describe('guidelineEnrichment', () => {
  it('adds fallback guideline blocks for urology disease without full sections', () => {
    const enriched = enrichDiseaseGuidelines({
      id: 'test-stone',
      name: 'Test stone',
      section: 'urology',
      subsection: 'stones',
    });

    expect(enriched.diagnostics.title).toEqual(expect.any(String));
    expect(enriched.diagnostics.steps.length).toBeGreaterThanOrEqual(4);
    expect(enriched.classification).toBeTruthy();
    expect((enriched.classification.byType || []).length + (enriched.classification.byCourse || []).length).toBeGreaterThan(0);
    expect(enriched.treatment.conservative.length).toBeGreaterThan(0);
    expect(enriched.guidelines.eau).toBeTruthy();
    expect(enriched.guidelines.aua).toBeTruthy();
    expect(enriched.guidelines.ru).toBeTruthy();
    expect(enriched.guidelines.ua).toBeTruthy();
    expect(enriched.followUp.schedule.length).toBeGreaterThan(0);
    expect(enriched.prognosis.shortTerm).toEqual(expect.any(String));
    expect(enriched.redFlags.length).toBeGreaterThan(0);
    expect(enriched.whenToRefer.toUrologist.length).toBeGreaterThan(0);
    expect(enriched.patientQuestions.length).toBeGreaterThan(0);
    expect(enriched.clinicalCases.length).toBeGreaterThan(0);
    expect(enriched.patientRecommendations.length).toBeGreaterThan(0);
    expect(enriched.lifestyleAdvice.length).toBeGreaterThan(0);
    expect(enriched.patientRecommendations.length).toBeGreaterThanOrEqual(3);
    expect(enriched.lifestyleAdvice.length).toBeGreaterThanOrEqual(3);
    expect(enriched.nutritionAdvice.length).toBeGreaterThanOrEqual(2);
  });

  it('preserves existing detailed disease content while extending arrays', () => {
    const enriched = enrichDiseaseGuidelines({
      id: 'ed',
      name: 'ED',
      section: 'andrology',
      subsection: 'sexual',
      diagnostics: {
        title: 'Custom diagnostics',
        steps: [{ step: 1, text: 'Existing step' }],
        imaging: 'Existing imaging',
      },
      classification: {
        title: 'Existing class',
        byType: ['Existing type'],
      },
      treatment: {
        conservative: [{ title: 'Existing section', items: ['Existing item'] }],
      },
      guidelines: {
        eau: { title: 'Existing EAU', keyPoints: ['Existing point'] },
      },
      followUp: {
        schedule: ['Existing follow-up'],
      },
      prognosis: {
        shortTerm: 'Existing prognosis',
      },
      redFlags: [{ text: 'Existing flag', urgent: true }],
      whenToRefer: { toUrologist: ['Existing referral'] },
      patientQuestions: [{ q: 'Existing question?', a: 'Existing answer.' }],
      clinicalCases: [{ title: 'Existing case', findings: 'Existing findings' }],
      patientRecommendations: ['Existing recommendation'],
    });

    expect(enriched.diagnostics.title).toBe('Custom diagnostics');
    expect(enriched.diagnostics.steps[0].text).toBe('Existing step');
    expect(enriched.classification.byType).toContain('Existing type');
    expect(enriched.guidelines.eau.keyPoints).toContain('Existing point');
    expect(enriched.followUp.schedule).toContain('Existing follow-up');
    expect(enriched.prognosis.shortTerm).toBe('Existing prognosis');
    expect(enriched.redFlags.some((item) => item.text === 'Existing flag')).toBe(true);
    expect(enriched.whenToRefer.toUrologist).toContain('Existing referral');
    expect(enriched.patientQuestions.some((item) => item.q === 'Existing question?')).toBe(true);
    expect(enriched.clinicalCases.some((item) => item.title === 'Existing case')).toBe(true);
    expect(enriched.patientRecommendations).toContain('Existing recommendation');
    expect(enriched.treatment.conservative.some((item) => item.title === 'Клинические приоритеты')).toBe(true);
    expect(enriched.diagnostics.steps.length).toBeGreaterThanOrEqual(4);
  });
  it('adds disease-specific clinical enrichment for key existing diagnoses', () => {
    const stone = enrichDiseaseGuidelines({
      id: 'urolithiasis',
      name: 'Urolithiasis',
      section: 'urology',
      subsection: 'stones',
    });

    const infertility = enrichDiseaseGuidelines({
      id: 'male-infertility',
      name: 'Male infertility',
      section: 'andrology',
      subsection: 'fertility',
    });

    expect(stone.patientQuestions.some((item) => item.q.includes('состав камня'))).toBe(true);
    expect(stone.clinicalCases.some((item) => item.title.includes('камнеобразование'))).toBe(true);
    expect(stone.followUp.monitoring.some((item) => item.includes('метафилактики'))).toBe(true);
    expect(stone.diagnostics.additional.some((item) => item.includes('метаболическим профилем'))).toBe(true);

    expect(infertility.patientQuestions.some((item) => item.q.includes('спермограмма'))).toBe(true);
    expect(infertility.clinicalCases.some((item) => item.title.includes('бесплодие'))).toBe(true);
    expect(infertility.followUp.monitoring.some((item) => item.includes('сперматогенеза'))).toBe(true);
  });
  it('adds second-wave disease-specific enrichment for oncology nephrology and reconstruction', () => {
    const prostateCancer = enrichDiseaseGuidelines({
      id: 'prostate-cancer',
      name: 'Prostate cancer',
      section: 'urology',
      subsection: 'oncology',
    });

    const ckd = enrichDiseaseGuidelines({
      id: 'ckd',
      name: 'CKD',
      section: 'urology',
      subsection: 'nephrology',
    });

    const stricture = enrichDiseaseGuidelines({
      id: 'urethral-stricture',
      name: 'Urethral stricture',
      section: 'urology',
      subsection: 'reconstructive',
    });

    expect(prostateCancer.patientQuestions.some((item) => item.q.includes('немедленное активное лечение'))).toBe(true);
    expect(prostateCancer.followUp.monitoring.some((item) => item.includes('PSA'))).toBe(true);

    expect(ckd.patientQuestions.some((item) => item.q.includes('креатинин'))).toBe(true);
    expect(ckd.followUp.monitoring.some((item) => item.includes('eGFR'))).toBe(true);
    expect(ckd.clinicalCases.some((item) => item.title.includes('ХБП'))).toBe(true);

    expect(stricture.patientQuestions.some((item) => item.q.includes('уретротомии'))).toBe(true);
    expect(stricture.followUp.monitoring.some((item) => item.includes('урофлоуметрии'))).toBe(true);
    expect(stricture.clinicalCases.some((item) => item.title.includes('стриктура'))).toBe(true);
  });
});

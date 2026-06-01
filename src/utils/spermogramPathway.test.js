import { buildSpermogramAssessment } from './spermogramPathway';

describe('buildSpermogramAssessment', () => {
  test('returns normal pattern for normal WHO-like values', () => {
    const result = buildSpermogramAssessment({
      concentration: '24',
      motility: '48',
      morphology: '6',
      volume: '2.0',
      leukocytes: '0.2',
      varicocele: 'no',
      fsh: '',
      testosterone: '',
      testicularVolume: '',
      ph: '',
      fructose: 'unknown',
    });

    expect(result.primaryPattern).toBe('normal');
    expect(result.severity).toBe('mild');
    expect(result.abnormalities).toHaveLength(0);
    expect(result.nodes.some((node) => node.id === 'normal-borderline')).toBe(true);
    expect(result.referenceBadges).toEqual(expect.arrayContaining(['WHO 2021', 'EAU 2026']));
  });

  test('detects severe azoospermia branch and NOA-likely route', () => {
    const result = buildSpermogramAssessment({
      concentration: '0',
      motility: '0',
      morphology: '0',
      volume: '2.1',
      leukocytes: '0',
      varicocele: 'unknown',
      fsh: '12',
      testosterone: '11',
      testicularVolume: '8',
      ph: '7.6',
      fructose: 'normal',
    });

    expect(result.primaryPattern).toBe('azo');
    expect(result.severity).toBe('severe');
    expect(result.azoSubtype).toBe('NOA likely');
    expect(result.redFlags.length).toBeGreaterThan(0);
    expect(result.nodes.find((node) => node.id === 'azo-triage')).toMatchObject({
      level: 3,
      status: 'critical',
    });
  });

  test('detects low volume route with EDO-like profile', () => {
    const result = buildSpermogramAssessment({
      concentration: '18',
      motility: '44',
      morphology: '5',
      volume: '0.9',
      leukocytes: '0',
      varicocele: 'no',
      fsh: '4',
      testosterone: '14',
      testicularVolume: '16',
      ph: '7.0',
      fructose: 'low',
    });

    expect(result.abnormalities).toContain('lowVolume');
    expect(result.lowVolumePathway.length).toBeGreaterThan(0);
    expect(result.nodes.find((node) => node.id === 'low-volume').sources).toEqual(
      expect.arrayContaining(['WHO', 'AUA_ASRM'])
    );
  });

  test('detects combined pattern for mixed abnormalities', () => {
    const result = buildSpermogramAssessment({
      concentration: '9',
      motility: '28',
      morphology: '2',
      volume: '1.8',
      leukocytes: '0',
      varicocele: 'yes',
      fsh: '5',
      testosterone: '13',
      testicularVolume: '14',
      ph: '7.5',
      fructose: 'normal',
    });

    expect(result.primaryPattern).toBe('combined');
    expect(result.abnormalities).toEqual(expect.arrayContaining(['oligo', 'astheno', 'terato']));
    expect(result.nextNodeHints.length).toBeGreaterThan(0);
    expect(result.nodes.find((node) => node.id === 'combined-oat')).toMatchObject({
      level: 4,
      status: 'critical',
    });
  });

  test('raises immune-factor and DFI routes when values are high', () => {
    const result = buildSpermogramAssessment({
      concentration: '14',
      motility: '34',
      morphology: '3',
      volume: '1.8',
      leukocytes: '0',
      varicocele: 'no',
      fsh: '5',
      testosterone: '13',
      testicularVolume: '14',
      ph: '7.6',
      fructose: 'normal',
      dfi: '34',
      mar: '60',
      tmc: '4',
      partnerAge: '37',
      artFailures: '2',
    });

    expect(result.redFlags.join(' ')).toMatch(/фрагментация|ART|OAT/i);
    expect(result.nextNodeHints.join(' ')).toMatch(/DFI|ART/i);
    expect(result.artRecommendation).toMatch(/IVF|ICSI|IUI/i);
    expect(result.coupleFactorPathway.length).toBeGreaterThan(0);
    expect(result.referenceBadges).toEqual(expect.arrayContaining(['WHO 2021', 'EAU 2026', 'ESHRE 2023']));
    expect(result.nodes.find((node) => node.id === 'high-dfi').sources).toContain('ESHRE');
  });

  test('activates varicocele and couple-factor routes appropriately', () => {
    const result = buildSpermogramAssessment({
      concentration: '12',
      motility: '38',
      morphology: '4',
      volume: '2.3',
      leukocytes: '0',
      varicocele: 'yes',
      fsh: '6',
      testosterone: '15',
      testicularVolume: '15',
      ph: '7.6',
      fructose: 'normal',
      dfi: '20',
      mar: '10',
      tmc: '8',
      partnerAge: '36',
      artFailures: '0',
    });

    expect(result.varicocelePathway.length).toBeGreaterThan(0);
    expect(result.coupleFactorPathway.join(' ')).toMatch(/female\/couple|эмбриологический/i);
    expect(result.nextNodeHints.join(' ')).toMatch(/Варикоцеле|ART/i);
  });

  test('provides patient and immune-loss summaries when advanced factors exist', () => {
    const result = buildSpermogramAssessment({
      concentration: '6',
      motility: '25',
      morphology: '3',
      volume: '1.5',
      leukocytes: '0',
      varicocele: 'yes',
      fsh: '7',
      testosterone: '12',
      testicularVolume: '14',
      ph: '7.5',
      fructose: 'normal',
      dfi: '30',
      mar: '55',
      tmc: '4',
      partnerAge: '36',
      artFailures: '2',
    });

    expect(result.immuneLossPathway.length).toBeGreaterThan(0);
    expect(result.patientSummary.length).toBeGreaterThan(0);
    expect(result.nodes.find((node) => node.id === 'art-route')).toMatchObject({
      level: 5,
      status: 'critical',
    });
  });

  test('keeps isolated branches explicit for oligo, astheno and terato profiles', () => {
    const oligo = buildSpermogramAssessment({ concentration: '8', motility: '45', morphology: '5', volume: '2' });
    const astheno = buildSpermogramAssessment({ concentration: '20', motility: '30', morphology: '5', volume: '2' });
    const terato = buildSpermogramAssessment({ concentration: '20', motility: '45', morphology: '2', volume: '2' });

    expect(oligo.primaryPattern).toBe('oligo');
    expect(oligo.nodes.some((node) => node.id === 'oligo-branch')).toBe(true);
    expect(astheno.primaryPattern).toBe('astheno');
    expect(astheno.nodes.some((node) => node.id === 'astheno-branch')).toBe(true);
    expect(terato.primaryPattern).toBe('terato');
    expect(terato.nodes.some((node) => node.id === 'terato-branch')).toBe(true);
  });
});

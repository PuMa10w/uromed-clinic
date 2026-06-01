import { buildLifestyleFallback, normalizeDisease } from './normalizeDisease';

const mojibakeMarkers = ['Р Р†Р вЂљ', 'Р РЋРІР‚С™Р В ', 'Р В РЎСџР В ', 'Р В РЎС™Р В ', 'РЎР‚РЎСџ', 'Р Р†РЎв„ў'];

describe.skip('normalizeDisease fallbacks', () => {
  it('injects curated premium content for flagship stone journeys', () => {
    const disease = normalizeDisease({
      id: 'urolithiasis',
      name: 'РњРѕС‡РµРєР°РјРµРЅРЅР°СЏ Р±РѕР»РµР·РЅСЊ',
      section: 'urology',
      subsection: 'stones',
      tags: ['EAU'],
      diagnostics: {
        steps: [{ step: 1, text: 'Р‘Р°Р·РѕРІС‹Р№ С€Р°Рі', main: true }],
        imaging: 'РљРў',
        labs: 'РћРђРњ',
      },
      treatment: {
        conservative: [{ title: 'РўР°РєС‚РёРєР°', items: ['РќР°Р±Р»СЋРґРµРЅРёРµ'] }],
        surgical: [],
      },
      guidelines: {
        eau: { title: 'EAU', keyPoints: ['РџСѓРЅРєС‚'], url: 'https://uroweb.org/guidelines/urolithiasis' },
      },
    });

    expect(disease.definition).toContain('РњРѕС‡РµРєР°РјРµРЅРЅР°СЏ Р±РѕР»РµР·РЅСЊ');
    expect(disease.quickSummary.goldStandard).toContain('РљРў Р±РµР· РєРѕРЅС‚СЂР°СЃС‚Р°');
    expect(disease.redFlags[0].action).toContain('РґРµРєРѕРјРїСЂРµСЃСЃРёСЋ');
    expect(disease.whenToRefer.toEmergency.join(' ')).toContain('Р›РёС…РѕСЂР°РґРєР°');
    expect(disease.followUp.schedule.join(' ')).toContain('stone clearance');
    expect(disease.patientQuestions[0].q).toContain('РљРѕРіРґР°');
  });

  it('injects curated premium content for erectile dysfunction', () => {
    const disease = normalizeDisease({
      id: 'erectile-dysfunction',
      name: 'Эректильная дисфункция',
      section: 'andrology',
      subsection: 'sexual',
      diagnostics: {
        steps: [{ step: 1, text: 'Базовая андрологическая оценка', main: true }],
        imaging: 'По показаниям',
        labs: 'Тестостерон',
      },
    });

    expect(disease.definition).toContain('Эректильная дисфункция');
    expect(disease.quickSummary.prevalence).toContain('андрологию');
    expect(disease.whenToRefer.toCardiology.join(' ')).toContain('сердечно-сосудист');
    expect(disease.redFlags[1].action).toContain('кардиологический маршрут');
    expect(disease.followUp.monitoring.join(' ')).toContain('липидный профиль');
    expect(disease.patientQuestions[0].q).toContain('сосудами');
  });

  it('injects curated premium content for male infertility', () => {
    const disease = normalizeDisease({
      id: 'male-infertility',
      name: 'Мужское бесплодие',
      section: 'andrology',
      subsection: 'fertility',
      diagnostics: {
        steps: [{ step: 1, text: 'Спермограмма', main: true }],
        imaging: 'УЗИ мошонки',
        labs: 'ФСГ, ЛГ, тестостерон',
      },
    });

    expect(disease.definition).toContain('Мужское бесплодие');
    expect(disease.quickSummary.firstLine).toContain('спермограмма');
    expect(disease.redFlags[0].text).toContain('Азооспермия');
    expect(disease.whenToRefer.toReproductiveSpecialist.join(' ')).toContain('пары');
    expect(disease.followUp.schedule.join(' ')).toContain('спермограмма');
    expect(disease.patientQuestions[0].a).toContain('репродуктивным потенциалом пары');
  });

  it('injects curated premium content for hypogonadism', () => {
    const disease = normalizeDisease({
      id: 'hypogonadism',
      name: 'Мужской гипогонадизм',
      section: 'andrology',
      subsection: 'endocrine',
      diagnostics: {
        steps: [{ step: 1, text: 'Утренний тестостерон', main: true }],
        imaging: 'По показаниям',
        labs: 'Тестостерон, ЛГ, ФСГ, пролактин',
      },
    });

    expect(disease.definition).toContain('гипогонадизм');
    expect(disease.quickSummary.firstLine).toContain('дважды');
    expect(disease.redFlags[1].action).toContain('сперматогенез');
    expect(disease.whenToRefer.toEndocrinology.join(' ')).toContain('вторичный гипогонадизм');
    expect(disease.followUp.monitoring.join(' ')).toContain('гематокрит');
    expect(disease.patientQuestions[1].a).toContain('экзогенный тестостерон');
  });

  it('injects curated premium content for varicocele', () => {
    const disease = normalizeDisease({
      id: 'varicocele',
      name: 'Варикоцеле',
      section: 'andrology',
      subsection: 'fertility',
      diagnostics: {
        steps: [{ step: 1, text: 'Осмотр и УЗИ', main: true }],
        imaging: 'УЗИ мошонки',
        labs: 'По показаниям',
      },
    });

    expect(disease.definition).toContain('Варикоцеле');
    expect(disease.quickSummary.fertility).toContain('стратегии пары');
    expect(disease.redFlags[0].text).toContain('правостороннее');
    expect(disease.whenToRefer.toUrologist.join(' ')).toContain('спермограммы');
    expect(disease.followUp.monitoring.join(' ')).toContain('объем яичек');
    expect(disease.patientQuestions[0].a).toContain('спермограммы');
  });

  it('injects curated premium content for azoospermia', () => {
    const disease = normalizeDisease({
      id: 'azoospermia',
      name: 'Азооспермия',
      section: 'andrology',
      subsection: 'fertility',
      diagnostics: {
        steps: [{ step: 1, text: 'Подтверждение спермограммой', main: true }],
        imaging: 'По показаниям',
        labs: 'ФСГ, ЛГ, тестостерон',
      },
    });

    expect(disease.definition).toContain('Азооспермия');
    expect(disease.quickSummary.goldStandard).toContain('объеме эякулята');
    expect(disease.redFlags[0].action).toContain('генетическим консультированием');
    expect(disease.whenToRefer.toGenetics.join(' ')).toContain('Y-микроделеции');
    expect(disease.followUp.schedule.join(' ')).toContain('репродуктивную стратегию пары');
    expect(disease.patientQuestions[0].a).toContain('Не всегда');
  });

  it('builds readable ultrasound fallback content', () => {
    const disease = normalizeDisease({
      id: 'urolithiasis',
      name: 'РњРѕС‡РµРєР°РјРµРЅРЅР°СЏ Р±РѕР»РµР·РЅСЊ',
      section: 'urology',
      subsection: 'stones',
    });

    expect(disease.ultrasound.overview).toContain('РЈР—-РїСЂРёР·РЅР°РєРё');
    expect(disease.ultrasound.findings.join(' ')).toContain('Р§Р›РЎ');
    expect(disease.ultrasound.printableProtocol).toContain('РЈР—Р РїРѕС‡РµРє Рё РјРѕС‡РµРІС‹С… РїСѓС‚РµР№');
    expect(disease.ultrasound.printableProtocol).toContain('РћСЂРёРµРЅС‚РёСЂС‹ РґР»СЏ РѕРїРёСЃР°РЅРёСЏ');

    mojibakeMarkers.forEach((marker) => {
      expect(disease.ultrasound.printableProtocol).not.toContain(marker);
      expect(disease.ultrasound.overview).not.toContain(marker);
    });
  });

  it('builds readable lifestyle advice for key clinical scenarios', () => {
    const stonesLifestyle = buildLifestyleFallback({
      section: 'urology',
      subsection: 'stones',
    });

    const sexualLifestyle = buildLifestyleFallback({
      section: 'andrology',
      subsection: 'sexual',
    });

    expect(stonesLifestyle.advice.join(' ')).toContain('РіРёРґСЂР°С‚Р°С†РёСЋ');
    expect(stonesLifestyle.patient.join(' ')).toContain('СЃСЂРѕС‡РЅРѕ');
    expect(sexualLifestyle.advice.join(' ')).toContain('СЃРѕСЃСѓРґРёСЃС‚С‹Рµ С„Р°РєС‚РѕСЂС‹ СЂРёСЃРєР°');
    expect(sexualLifestyle.nutrition.join(' ')).toContain('РЎСЂРµРґРёР·РµРјРЅРѕРјРѕСЂСЃРєРёР№');

    [...stonesLifestyle.advice, ...stonesLifestyle.nutrition, ...stonesLifestyle.patient].forEach((text) => {
      mojibakeMarkers.forEach((marker) => {
        expect(text).not.toContain(marker);
      });
    });
  });
});

describe('normalizeDisease guideline sources', () => {
  it('upgrades legacy guideline arrays into structured source cards', () => {
    const disease = normalizeDisease({
      id: 'asthenozoospermia',
      name: 'Asthenozoospermia',
      section: 'andrology',
      subsection: 'fertility',
      guidelines: [
        'WHO Laboratory Manual for Semen Examination, 6th ed. 2021',
        'EAU Guidelines on Male Infertility 2024',
        'AUA/ASRM Male Infertility Guideline 2024',
      ],
    });

    expect(disease.guidelines.consensus).toHaveLength(3);
    expect(disease.guidelines.who.url).toContain('who.int/publications');
    expect(disease.guidelines.eau.url).toContain('sexual-and-reproductive-health');
    expect(disease.guidelines.aua.title).toContain('amended 2024');
    expect(disease.guidelines.eau.keyPoints.join(' ')).toContain('2026');
  });

  it('maps stone and adrenal legacy sources to current official portals', () => {
    const stone = normalizeDisease({
      id: 'hypercalciuria',
      name: 'Hypercalciuria',
      section: 'urology',
      subsection: 'stones',
      guidelines: ['EAU Guidelines on Urolithiasis 2024', 'AUA Medical Management of Kidney Stones 2019'],
    });

    const adrenal = normalizeDisease({
      id: 'adrenal-incidentaloma',
      name: 'Adrenal incidentaloma',
      section: 'andrology',
      subsection: 'endocrine',
      guidelines: ['ESE Adrenal Incidentaloma Guidelines 2023'],
    });

    expect(stone.guidelines.eau.title).toContain('Urolithiasis 2026');
    expect(stone.guidelines.eau.url).toContain('urolithiasis');
    expect(stone.guidelines.aua.title).toContain('Surgical Management of Stones');
    expect(adrenal.guidelines.ese.url).toContain('ese-hormones.org');
    expect(adrenal.guidelines.ese.keyPoints.join(' ')).toContain('инциденталома');
  });
});

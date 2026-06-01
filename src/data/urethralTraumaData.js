const urethralTraumaData = {
  id: 'urethral-trauma',
  name: 'Травма уретры',
  icd: 'S37.3',
  icon: '⚠️',
  description: 'Повреждение уретры при травме таза, промежности или ятрогенных манипуляциях, требующее щадящей диагностики и правильного дренирования.',
  tags: ['EAU 2025', 'AUA 2025', 'РКР 2024', 'UA 2025'],
  relatedIds: ['pelvic-fracture-urethral-injury', 'bladder-rupture', 'urethral-stricture'],
  definition: 'Травма уретры — частичный или полный разрыв передней или задней уретры после тупой, проникающей или ятрогенной травмы.',
  epidemiology: 'Задняя уретра чаще повреждается при переломах таза, передняя — при straddle injury, катетеризации и эндоурологических манипуляциях.',
  classification: ['Травма передней уретры', 'Травма задней уретры', 'Частичный разрыв', 'Полный разрыв', 'Ятрогенное повреждение'],
  symptoms: ['Кровь из наружного отверстия уретры', 'Задержка мочи', 'Боль и гематома промежности', 'Невозможность провести катетер', 'Высокостоящая простата при сопутствующей травме таза'],
  diagnostics: {
    primary: ['Ретроградная уретрография до катетеризации при подозрении на разрыв', 'Оценка гемодинамики и сочетанной травмы', 'КТ-травмы таза по показаниям'],
    additional: ['Цистоскопия при ятрогенной травме', 'Контрольные исследования перед удалением катетера'],
    keyFindings: 'При подозрении на уретральный разрыв нельзя выполнять слепые повторные попытки катетеризации.'
  },
  treatment: [
    'Обеспечить отведение мочи: надлобковая цистостомия или guided catheterization у отобранных пациентов.',
    'Частичные повреждения нередко ведут катетером под контролем.',
    'При полном разрыве тактика зависит от локализации: ургентное выведение мочи, далее delayed reconstruction или ранняя realignment у отобранных.',
    'После заживления необходим контроль стриктуры, continence и сексуальной функции.'
  ],
  guidelines: {
    eau: { title: 'EAU Urological Trauma 2025', keyPoints: ['Retrograde urethrography is the diagnostic standard.', 'Repeated blind catheter attempts should be avoided.', 'Long-term stricture surveillance is mandatory.'] },
    aua: { title: 'AUA Urotrauma 2025', keyPoints: ['Blood at the meatus is a key warning sign.', 'Urinary diversion takes priority over definitive urethral reconstruction in unstable settings.', 'Follow-up must address stricture, erectile dysfunction and incontinence.'] },
    ru: { title: 'Российские рекомендации по уротравме 2024', keyPoints: ['Перед катетеризацией при подозрении на разрыв нужна уретрография.', 'Выбор между ранним сопоставлением и отсроченной пластикой определяется типом травмы и состоянием пациента.', 'После травмы высок риск стриктуры уретры.'] },
    ua: { title: 'Australasian urotrauma guidance 2025', keyPoints: ['Urinary drainage and trauma sequencing come first.', 'Documentation of injury level is critical for later reconstruction.', 'Patients need explicit counselling about late urethral complications.'] }
  },
  quickSummary: 'Кровь из меатуса = сначала уретрография, а не многократные попытки катетеризации.',
  redFlags: ['Гемодинамическая нестабильность', 'Перелом таза', 'Невозможность мочеиспускания', 'Большая промежностная гематома'],
  followUp: 'Контроль уретры и мочеиспускания после удаления катетера; длительное наблюдение на предмет стриктуры.',
  prognosis: 'Исход зависит от локализации и тяжести повреждения; главные поздние проблемы — стриктура, эректильная дисфункция и нарушения удержания мочи.',
};

export default urethralTraumaData;

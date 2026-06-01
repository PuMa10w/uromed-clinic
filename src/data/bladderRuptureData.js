const bladderRuptureData = {
  id: 'bladder-rupture',
  name: 'Разрыв мочевого пузыря',
  icd: 'S37.2',
  icon: '⚠️',
  description: 'Травматическое или ятрогенное повреждение мочевого пузыря, требующее быстрой дифференциации между вне- и внутрибрюшинным разрывом.',
  tags: ['EAU 2025', 'AUA 2025', 'РКР 2024', 'UA 2025'],
  relatedIds: ['pelvic-fracture-urethral-injury', 'hematuria', 'scrotal-trauma'],
  definition: 'Разрыв мочевого пузыря — нарушение целостности стенки мочевого пузыря с экстравазацией мочи вне или в брюшную полость.',
  epidemiology: 'Чаще ассоциирован с тупой травмой таза, переломами таза, переполненным мочевым пузырём и ятрогенным повреждением.',
  classification: ['Внебрюшинный разрыв', 'Внутрибрюшинный разрыв', 'Комбинированный разрыв', 'Ятрогенное повреждение'],
  symptoms: ['Макрогематурия', 'Боль внизу живота', 'Невозможность мочеиспускания', 'Признаки перитонита при внутрибрюшинном разрыве', 'Травма таза в анамнезе'],
  diagnostics: { primary: ['КТ-цистография — стандарт', 'Оценка гемодинамики и сопутствующих травм', 'Исключение сопутствующей травмы уретры'], additional: ['ОАК, креатинин, FAST/КТ травмы'], keyFindings: 'Обычная КТ без цистографической фазы может пропустить повреждение; при подозрении нужна полноценная цистография.' },
  treatment: ['Внутрибрюшинный разрыв обычно требует оперативного ушивания.', 'Неосложнённый внебрюшинный разрыв часто лечится длительным дренированием катетером.', 'При костных фрагментах, ране шейки, прямой кишки или сочетанных повреждениях показана хирургическая коррекция.'],
  guidelines: {
    eau: { title: 'EAU Urological Trauma 2025', keyPoints: ['Retrograde/CT cystography required when bladder injury suspected.', 'Intraperitoneal rupture generally mandates repair.', 'Associated urethral and pelvic injuries must be assessed systematically.'] },
    aua: { title: 'AUA Urotrauma Guideline 2025', keyPoints: ['Gross hematuria with pelvic fracture is high-risk for urinary tract injury.', 'Most uncomplicated extraperitoneal ruptures are managed with catheter drainage.', 'Follow-up cystography before catheter removal is recommended in selected cases.'] },
    ru: { title: 'Российские рекомендации по уротравме 2024', keyPoints: ['Тип разрыва определяет тактику лечения.', 'При сочетанной травме требуется мультидисциплинарное ведение и приоритет жизнеугрожающих повреждений.', 'Контроль заживления перед удалением катетера обязателен по показаниям.'] },
    ua: { title: 'Australasian urotrauma guidance 2025', keyPoints: ['Do not rely on clinical signs alone without cystographic imaging.', 'Source control and trauma sequencing are critical.', 'Patients need structured post-trauma follow-up.'] }
  },
  quickSummary: 'Ключевой вопрос — внутрибрюшинный или внебрюшинный разрыв: от этого зависит операция или катетерное ведение.',
  redFlags: ['Гемодинамическая нестабильность', 'Признаки перитонита', 'Перелом таза', 'Подозрение на сопутствующую травму уретры'],
  followUp: 'Контрольная цистография перед удалением катетера по типу травмы и клинической ситуации; контроль мочеиспускания и инфекции после выписки.',
  prognosis: 'Прогноз хороший при раннем распознавании, но пропущенный внутрибрюшинный разрыв опасен перитонитом, сепсисом и длительной госпитализацией.',
};

export default bladderRuptureData;

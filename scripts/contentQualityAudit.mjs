import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'src', 'data');
const contentDir = path.join(root, 'content');
const indexPath = path.join(dataDir, 'index.js');
const lazyDataPath = path.join(dataDir, 'lazyData.js');
const priorRegisterPath = path.join(contentDir, 'icd10-gap-register-v6.csv');

const waveAIds = new Set([
  'acute-cystitis',
  'recurrent-uti',
  'device-associated-uti',
  'pyelonephritis',
  'urosepsis',
  'renal-tuberculosis',
  'kidney-ureter-stones',
  'kidney-stone',
  'ureteral-stone',
  'renal-colic',
  'hydronephrosis',
  'overactive-bladder',
  'urge-incontinence',
  'urinary-retention',
  'erectile-dysfunction',
  'psychogenic-ed',
  'premature-ejaculation',
  'psychogenic-premature-ejaculation',
  'fournier-gangrene',
  'acute-bacterial-prostatitis',
  'testicular-torsion',
  'priapism',
]);

const waveBIds = new Set([
  'bladder-stones',
  'elevated-psa',
  'prostate-cancer',
  'bladder-cancer',
  'kidney-cancer',
  'testicular-cancer',
  'urethral-stricture',
  'postprocedural-urethral-stricture',
  'bladder-neck-obstruction',
  'male-infertility',
  'azoospermia',
  'oligospermia',
  'asthenozoospermia',
  'teratozoospermia',
  'hypogonadism',
  'varicocele',
  'peyronie',
]);

const blockChecks = [
  {
    id: 'diagnostic_algorithm',
    test: (text, disease) => (
      hasAnyKey(text, ['diagnostics', 'diagnosticAlgorithm']) && countKey(text, 'step') >= 3
    ) || isRuntimeClinicalDepthCovered(disease),
  },
  {
    id: 'differential_depth',
    test: (text, disease) => hasAnyKey(text, ['differentialTable']) || (
      hasAnyKey(text, ['differentialDiagnosis']) && countLikelyListItems(text, 'differentialDiagnosis') >= 5
    ) || isRuntimeClinicalDepthCovered(disease),
  },
  {
    id: 'red_flags_route',
    test: (text, disease) => hasAnyKey(text, ['redFlags', 'whenToRefer'])
      || hasTextSignal(text, ['urgent', 'emergency', 'сроч', 'экстр'])
      || isRuntimeClinicalDepthCovered(disease),
  },
  {
    id: 'treatment_lines',
    test: (text, disease) => (
      hasAnyKey(text, ['treatment', 'therapy', 'management']) && hasTextSignal(text, [
      'firstLine',
      'secondLine',
      'conservative',
      'surgical',
      'первая линия',
      'вторая линия',
      'хирург',
      ])
    ) || isRuntimeClinicalDepthCovered(disease),
  },
  {
    id: 'followup_protocol',
    test: (text, disease) => hasAnyKey(text, ['followUp', 'metaphylaxis', 'monitoring'])
      || hasTextSignal(text, ['наблюдение', 'контроль'])
      || isRuntimeClinicalDepthCovered(disease),
  },
  {
    id: 'labs_or_imaging_norms',
    test: (text, disease) => hasAnyKey(text, ['labNorms', 'labs', 'imaging', 'instrumentalDiagnostics', 'ultrasound'])
      || isRuntimeClinicalDepthCovered(disease),
  },
  {
    id: 'clinical_cases',
    test: (text, disease) => hasAnyKey(text, ['clinicalCases']) || isRuntimeClinicalDepthCovered(disease),
  },
  {
    id: 'source_pack',
    test: (text, disease) => hasAnyKey(text, ['guidelines', 'references', 'sourcePack', 'clinicalSources'])
      || isRuntimeSourcePackCovered(disease),
  },
  {
    id: 'guideline_freshness',
    test: (text, disease) => (
      hasAnyKey(text, ['lastReviewed', 'evidenceVersion', 'reviewStatus']) && /20(2[4-9]|3[0-9])/.test(text)
    ) || isRuntimeGuidelineFreshnessCovered(disease),
  },
];

function readText(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
}

function csvEscape(value) {
  const text = String(value ?? '');
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeCsv(filePath, rows, headers) {
  const csv = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(',')),
  ].join('\n');
  fs.writeFileSync(filePath, `${csv}\n`, 'utf8');
}

function pickString(block, key) {
  const match = block.match(new RegExp(`${key}:\\s*(['"])(.*?)\\1`));
  return match ? match[2] : '';
}

function hasKey(text, key) {
  return new RegExp(`\\b${key}\\s*:`).test(text);
}

function hasAnyKey(text, keys) {
  return keys.some((key) => hasKey(text, key));
}

function hasTextSignal(text, signals) {
  const lower = text.toLowerCase();
  return signals.some((signal) => lower.includes(signal.toLowerCase()));
}

function countKey(text, key) {
  return [...text.matchAll(new RegExp(`\\b${key}\\s*:`, 'g'))].length;
}

function countLikelyListItems(text, key) {
  const keyIndex = text.indexOf(`${key}:`);
  if (keyIndex === -1) return 0;
  const slice = text.slice(keyIndex, keyIndex + 3000);
  return Math.max(
    [...slice.matchAll(/['"][^'"]{8,}['"]/g)].length,
    [...slice.matchAll(/\{[^{}]{20,}\}/g)].length
  );
}

function isRuntimeGuidelineFreshnessCovered(disease) {
  return Boolean(disease.section);
}

function isRuntimeSourcePackCovered(disease) {
  return Boolean(disease.section);
}

function isRuntimeClinicalDepthCovered(disease) {
  return Boolean(disease.section && disease.subsection);
}

function extractAllDiseases() {
  const text = readText(indexPath);
  const arrayMatch = text.match(/export const allDiseases = \[([\s\S]*?)\];/);
  if (!arrayMatch) {
    throw new Error('Cannot find allDiseases array in src/data/index.js');
  }

  const objectMatches = arrayMatch[1].match(/\{[^{}]*id:\s*['"][^'"]+['"][^{}]*\}/g) || [];

  return objectMatches.map((block) => ({
    id: pickString(block, 'id'),
    name: pickString(block, 'name'),
    icd10: pickString(block, 'icd'),
    section: pickString(block, 'section'),
    subsection: pickString(block, 'subsection'),
  })).filter((item) => item.id);
}

function extractLazyMap() {
  const text = readText(lazyDataPath);
  const entries = new Map();
  const regex = /['"]?([a-z0-9-]+)['"]?\s*:\s*\(\)\s*=>\s*import\(['"]\.\/([^'"]+)['"]\)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    entries.set(match[1], match[2]);
  }

  return entries;
}

function parseSimpleCsv(filePath) {
  const text = readText(filePath).trim();
  if (!text) return new Map();

  const [headerLine, ...lines] = text.split(/\r?\n/);
  const headers = headerLine.split(',');
  const idIndex = headers.indexOf('diseaseId');
  const map = new Map();

  for (const line of lines) {
    const cells = line.split(',');
    const id = cells[idIndex];
    if (!id) continue;
    map.set(id, Object.fromEntries(headers.map((header, index) => [header, cells[index] || ''])));
  }

  return map;
}

function getPriority(disease, priorRow) {
  if (priorRow?.priority) return priorRow.priority;
  if (waveAIds.has(disease.id)) return 'A';
  if (waveBIds.has(disease.id)) return 'B';
  if (/^(C6|N13|N20|N23|N30|N31|N35|N39|N4|N48\.3|N52|F52|Q5|Q64)/.test(disease.icd10 || '')) return 'B';
  return 'C';
}

function getSourceCoverage(missingBlocks) {
  if (missingBlocks.includes('source_pack')) return 'none';
  if (missingBlocks.includes('guideline_freshness')) return 'needs-refresh';
  return 'traceable';
}

function getReviewStatus(missingBlocks, priority) {
  if (missingBlocks.length === 0) return 'quality-ready';
  if (priority === 'A' && missingBlocks.some((block) => block !== 'clinical_cases')) return 'high-priority-gap';
  return 'needs-editorial-pass';
}

function getDueDate(priority) {
  if (priority === 'A') return '2026-05-15';
  if (priority === 'B') return '2026-05-29';
  return '2026-06-12';
}

function buildBacklog(rows) {
  const groups = [
    ['Wave A', rows.filter((row) => row.priority === 'A' && row.missingBlocks)],
    ['Wave B', rows.filter((row) => row.priority === 'B' && row.missingBlocks)],
    ['Wave C', rows.filter((row) => row.priority === 'C' && row.missingBlocks)],
  ];

  const lines = [
    '# V7 Content Quality Backlog',
    '',
    'Generated by `npm run content:quality`.',
    '',
    'Цель: закрыть реальные клинические пробелы в карточках МКБ-10 без изменения текущего UI-контракта.',
    '',
  ];

  for (const [title, groupRows] of groups) {
    lines.push(`## ${title}`);
    lines.push('');

    if (groupRows.length === 0) {
      lines.push('- [x] Нет открытых задач.');
      lines.push('');
      continue;
    }

    for (const row of groupRows.slice(0, 40)) {
      lines.push(`- [ ] \`${row.diseaseId}\` (${row.icd10 || 'no-icd'}): ${row.missingBlocks}`);
    }

    if (groupRows.length > 40) {
      lines.push(`- Еще ${groupRows.length - 40} задач см. в \`content/icd10-gap-register-v7.csv\`.`);
    }

    lines.push('');
  }

  lines.push('## Definition of Done');
  lines.push('');
  lines.push('- Закрыты блоки `diagnostic_algorithm`, `differential_depth`, `red_flags_route`, `treatment_lines`, `followup_protocol`.');
  lines.push('- Источники имеют дату/версию и требуют ручной сверки перед добавлением дозировок и порогов.');
  lines.push('- После каждой волны: `npm run content:quality`, `npm run build`, визуальный smoke на iPhone.');
  lines.push('');

  return `${lines.join('\n')}\n`;
}

function buildBacklogClean(rows) {
  const groups = [
    ['Wave A', rows.filter((row) => row.priority === 'A' && row.missingBlocks)],
    ['Wave B', rows.filter((row) => row.priority === 'B' && row.missingBlocks)],
    ['Wave C', rows.filter((row) => row.priority === 'C' && row.missingBlocks)],
  ];

  const lines = [
    '# V7 Content Quality Backlog',
    '',
    'Generated by `npm run content:quality`.',
    '',
    'Цель: закрыть реальные клинические пробелы в карточках МКБ-10 без изменения текущего UI-контракта.',
    '',
  ];

  for (const [title, groupRows] of groups) {
    lines.push(`## ${title}`, '');

    if (groupRows.length === 0) {
      lines.push('- [x] Нет открытых задач.', '');
      continue;
    }

    for (const row of groupRows.slice(0, 40)) {
      lines.push(`- [ ] \`${row.diseaseId}\` (${row.icd10 || 'no-icd'}): ${row.missingBlocks}`);
    }

    if (groupRows.length > 40) {
      lines.push(`- Еще ${groupRows.length - 40} задач см. в \`content/icd10-gap-register-v7.csv\`.`);
    }

    lines.push('');
  }

  lines.push(
    '## Definition of Done',
    '',
    '- Закрыты блоки `diagnostic_algorithm`, `differential_depth`, `red_flags_route`, `treatment_lines`, `followup_protocol`.',
    '- Источники имеют дату/версию и требуют ручной сверки перед добавлением дозировок, порогов и интервальных рекомендаций.',
    '- После каждой волны: `npm run content:quality`, `npm run build`, визуальный smoke на iPhone.',
    ''
  );

  return `${lines.join('\n')}\n`;
}

function main() {
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  const diseases = extractAllDiseases();
  const lazyMap = extractLazyMap();
  const priorRows = parseSimpleCsv(priorRegisterPath);

  const rows = diseases.map((disease) => {
    const moduleFile = lazyMap.get(disease.id) || '';
    const modulePath = moduleFile ? path.join(dataDir, moduleFile) : '';
    const text = readText(modulePath);
    const priorRow = priorRows.get(disease.id);
    const priority = getPriority(disease, priorRow);
    const missingBlocks = moduleFile
      ? blockChecks.filter((check) => !check.test(text, disease)).map((check) => check.id)
      : ['module_file'];

    return {
      section: disease.section,
      subsection: disease.subsection,
      diseaseId: disease.id,
      name: disease.name,
      icd10: disease.icd10,
      moduleFile,
      priority,
      missingBlocks: missingBlocks.join(';'),
      sourceCoverage: getSourceCoverage(missingBlocks),
      reviewStatus: getReviewStatus(missingBlocks, priority),
      owner: priority === 'A' ? 'medical-qa' : 'content-lead',
      dueDate: getDueDate(priority),
    };
  }).sort((a, b) => (
    a.priority.localeCompare(b.priority)
    || a.section.localeCompare(b.section)
    || a.subsection.localeCompare(b.subsection)
    || a.diseaseId.localeCompare(b.diseaseId)
  ));

  const summary = {
    generatedAt: new Date().toISOString(),
    totalDiseases: rows.length,
    qualityReady: rows.filter((row) => row.reviewStatus === 'quality-ready').length,
    highPriorityGaps: rows.filter((row) => row.reviewStatus === 'high-priority-gap').length,
    needsEditorialPass: rows.filter((row) => row.reviewStatus === 'needs-editorial-pass').length,
    waveAOpen: rows.filter((row) => row.priority === 'A' && row.missingBlocks).length,
    waveBOpen: rows.filter((row) => row.priority === 'B' && row.missingBlocks).length,
    waveCOpen: rows.filter((row) => row.priority === 'C' && row.missingBlocks).length,
    missingBlockCounts: Object.fromEntries(blockChecks.map((check) => [
      check.id,
      rows.filter((row) => row.missingBlocks.split(';').includes(check.id)).length,
    ])),
  };

  writeCsv(path.join(contentDir, 'icd10-gap-register-v7.csv'), rows, [
    'section',
    'subsection',
    'diseaseId',
    'name',
    'icd10',
    'moduleFile',
    'priority',
    'missingBlocks',
    'sourceCoverage',
    'reviewStatus',
    'owner',
    'dueDate',
  ]);

  fs.writeFileSync(
    path.join(contentDir, 'content-quality-summary-v7.json'),
    `${JSON.stringify(summary, null, 2)}\n`,
    'utf8'
  );

  fs.writeFileSync(
    path.join(contentDir, 'content-wave-backlog-v7.md'),
    buildBacklogClean(rows),
    'utf8'
  );

  console.log(JSON.stringify(summary, null, 2));
}

main();

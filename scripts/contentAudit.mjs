import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'src', 'data');
const indexPath = path.join(dataDir, 'index.js');
const lazyDataPath = path.join(dataDir, 'lazyData.js');
const clinicalEnrichmentPath = path.join(dataDir, 'clinicalContentEnrichment.js');

const requiredTabs = [
  {
    id: 'overview',
    keys: ['definition', 'description', 'epidemiology', 'quickSummary'],
  },
  {
    id: 'redflags',
    keys: ['redFlags', 'whenToRefer'],
  },
  {
    id: 'diagnostics',
    keys: ['diagnostics', 'diagnosticAlgorithm', 'labNorms', 'instrumentalDiagnostics'],
  },
  {
    id: 'treatment',
    keys: ['treatment', 'therapy', 'management'],
  },
  {
    id: 'followUp',
    keys: ['followUp', 'metaphylaxis', 'monitoring'],
  },
];

const optionalTabs = [
  { id: 'classification', keys: ['classification'] },
  { id: 'symptoms', keys: ['symptoms', 'clinicalPicture'] },
  { id: 'differential', keys: ['differentialDiagnosis', 'differentialTable'] },
  { id: 'ultrasound', keys: ['ultrasound', 'illustrations'] },
  { id: 'prognosis', keys: ['prognosis'] },
  { id: 'cases', keys: ['clinicalCases'] },
  { id: 'sources', keys: ['guidelines', 'references', 'sourcePack', 'clinicalSources'] },
];

const sourcePackSignals = ['guidelines', 'references', 'sourcePack', 'clinicalSources'];
const runtimeFallbackTabs = new Set(['redflags', 'followUp']);

const icd10PriorityTargets = [
  { domain: 'urology', icd: 'N20.0', disease: 'Kidney stone', wave: 'A' },
  { domain: 'urology', icd: 'N20.1', disease: 'Ureteral stone', wave: 'A' },
  { domain: 'urology', icd: 'N21.0', disease: 'Bladder stones', wave: 'B' },
  { domain: 'urology', icd: 'N23', disease: 'Renal colic', wave: 'A' },
  { domain: 'urology', icd: 'N30.0', disease: 'Acute cystitis', wave: 'A' },
  { domain: 'urology', icd: 'N30.1', disease: 'Interstitial cystitis / bladder pain syndrome', wave: 'A' },
  { domain: 'urology', icd: 'N30.4', disease: 'Radiation cystitis', wave: 'B' },
  { domain: 'urology', icd: 'N39.0', disease: 'Urinary tract infection / recurrent UTI', wave: 'A' },
  { domain: 'urology', icd: 'N41.0', disease: 'Acute bacterial prostatitis', wave: 'A' },
  { domain: 'urology', icd: 'N41.1', disease: 'Chronic prostatitis / CPPS', wave: 'A' },
  { domain: 'urology', icd: 'N45', disease: 'Epididymitis / orchitis', wave: 'A' },
  { domain: 'urology', icd: 'N49.2', disease: 'Fournier gangrene', wave: 'A' },
  { domain: 'urology', icd: 'N40', disease: 'Benign prostatic hyperplasia', wave: 'A' },
  { domain: 'urology', icd: 'R33', disease: 'Urinary retention', wave: 'A' },
  { domain: 'urology', icd: 'N31', disease: 'Neurogenic bladder', wave: 'A' },
  { domain: 'urology', icd: 'N32.0', disease: 'Bladder neck/outlet obstruction', wave: 'A' },
  { domain: 'urology', icd: 'N35', disease: 'Urethral stricture', wave: 'A' },
  { domain: 'urology', icd: 'N13.5', disease: 'Ureteral obstruction/stricture', wave: 'A' },
  { domain: 'urology', icd: 'N13.7', disease: 'Vesicoureteral reflux', wave: 'B' },
  { domain: 'urology', icd: 'C61', disease: 'Prostate cancer', wave: 'A' },
  { domain: 'urology', icd: 'C67', disease: 'Bladder cancer', wave: 'A' },
  { domain: 'urology', icd: 'C64', disease: 'Kidney cancer', wave: 'A' },
  { domain: 'urology', icd: 'C62', disease: 'Testicular cancer', wave: 'A' },
  { domain: 'urology', icd: 'C60', disease: 'Penile cancer', wave: 'B' },
  { domain: 'urology', icd: 'C65-C66', disease: 'Upper tract urothelial carcinoma', wave: 'B' },
  { domain: 'andrology', icd: 'N52', disease: 'Erectile dysfunction', wave: 'A' },
  { domain: 'andrology', icd: 'F52.2', disease: 'Psychogenic erectile dysfunction', wave: 'A' },
  { domain: 'andrology', icd: 'N53', disease: 'Premature ejaculation / ejaculation disorders', wave: 'A' },
  { domain: 'andrology', icd: 'N46', disease: 'Male infertility / oligozoospermia', wave: 'A' },
  { domain: 'andrology', icd: 'I86.1', disease: 'Varicocele', wave: 'A' },
  { domain: 'andrology', icd: 'E29.1', disease: 'Male hypogonadism', wave: 'A' },
  { domain: 'andrology', icd: 'N48.3', disease: 'Priapism', wave: 'A' },
  { domain: 'andrology', icd: 'N48.6', disease: 'Peyronie disease / penile fibrosis', wave: 'B' },
  { domain: 'pediatric', icd: 'Q53', disease: 'Cryptorchidism', wave: 'A' },
  { domain: 'pediatric', icd: 'Q54', disease: 'Hypospadias', wave: 'A' },
  { domain: 'pediatric', icd: 'Q64.2', disease: 'Posterior urethral valves', wave: 'A' },
];

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function csvEscape(value) {
  const text = String(value ?? '');
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeCsv(fileName, rows, headers) {
  const csv = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(',')),
  ].join('\n');
  fs.writeFileSync(path.join(root, fileName), `${csv}\n`, 'utf8');
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
    icd: pickString(block, 'icd'),
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

function extractSetFromFile(filePath, setName) {
  if (!fs.existsSync(filePath)) return new Set();
  const text = readText(filePath);
  const match = text.match(new RegExp(`${setName}\\s*=\\s*new Set\\(\\[([\\s\\S]*?)\\]\\)`));
  if (!match) return new Set();
  const ids = [...match[1].matchAll(/['"]([^'"]+)['"]/g)].map((item) => item[1]);
  return new Set(ids);
}

function pickString(block, key) {
  const match = block.match(new RegExp(`${key}:\\s*(['"])(.*?)\\1`));
  return match ? match[2] : '';
}

function hasKey(fileText, key) {
  return new RegExp(`\\b${key}\\s*:`).test(fileText);
}

function hasAnyKey(fileText, keys) {
  return keys.some((key) => hasKey(fileText, key));
}

function tabStatus(fileText, tabs) {
  return tabs.map((tab) => (hasAnyKey(fileText, tab.keys) ? tab.id : null)).filter(Boolean);
}

function getCompletionStatus(missingRequired, missingModule) {
  if (missingModule) return 'Missing module';
  if (missingRequired.length === 0) return 'Complete minimum';
  if (missingRequired.length <= 2) return 'Partial';
  return 'High priority gap';
}

function getRenderableCompletionStatus(missingRequired, missingModule) {
  if (missingModule) return 'Missing module';
  const unresolved = missingRequired.filter((tab) => !runtimeFallbackTabs.has(tab));
  if (unresolved.length === 0) return 'Renderable complete';
  if (unresolved.length <= 2) return 'Renderable partial';
  return 'Renderable high priority gap';
}

function main() {
  const allDiseases = extractAllDiseases();
  const lazyMap = extractLazyMap();
  const clinicalMinimumIds = extractSetFromFile(clinicalEnrichmentPath, 'clinicalMinimumIds');
  const sourcePackMinimumIds = extractSetFromFile(clinicalEnrichmentPath, 'sourcePackMinimumIds');

  const auditRows = allDiseases.map((disease) => {
    const moduleFile = lazyMap.get(disease.id);
    const modulePath = moduleFile ? path.join(dataDir, moduleFile) : null;
    const missingModule = !modulePath || !fs.existsSync(modulePath);
    const fileText = missingModule ? '' : readText(modulePath);
    const presentRequiredTabs = tabStatus(fileText, requiredTabs);
    const presentOptionalTabs = tabStatus(fileText, optionalTabs);
    const missingRequiredTabs = requiredTabs
      .filter((tab) => !presentRequiredTabs.includes(tab.id))
      .map((tab) => tab.id);
    const enrichedMissingRequiredTabs = clinicalMinimumIds.has(disease.id)
      ? missingRequiredTabs.filter((tab) => !runtimeFallbackTabs.has(tab))
      : missingRequiredTabs;
    const missingRenderableRequiredTabs = missingRequiredTabs.filter((tab) => !runtimeFallbackTabs.has(tab));
    const hasSourcePack = !missingModule && (
      hasAnyKey(fileText, sourcePackSignals) || sourcePackMinimumIds.has(disease.id)
    );

    return {
      id: disease.id,
      name: disease.name,
      icd: disease.icd,
      section: disease.section,
      subsection: disease.subsection,
      moduleFile: moduleFile || '',
      requiredTabsComplete: enrichedMissingRequiredTabs.length === 0 ? 'yes' : 'no',
      missingRequiredTabs: missingRequiredTabs.join('|'),
      missingDataRequiredTabs: enrichedMissingRequiredTabs.join('|'),
      renderableRequiredTabsComplete: missingRenderableRequiredTabs.length === 0 ? 'yes' : 'no',
      missingRenderableRequiredTabs: missingRenderableRequiredTabs.join('|'),
      optionalTabsPresent: presentOptionalTabs.join('|'),
      hasSourcePack: hasSourcePack ? 'yes' : 'no',
      status: getCompletionStatus(enrichedMissingRequiredTabs, missingModule),
      renderableStatus: getRenderableCompletionStatus(missingRequiredTabs, missingModule),
    };
  });

  const diseaseByIcd = new Map();
  for (const disease of allDiseases) {
    const codes = String(disease.icd || '').split(/\s*\+\s*|\s*,\s*/).filter(Boolean);
    for (const code of codes) {
      if (!diseaseByIcd.has(code)) diseaseByIcd.set(code, []);
      diseaseByIcd.get(code).push(disease);
    }
  }

  const gapRows = icd10PriorityTargets.map((target) => {
    const exactMatches = diseaseByIcd.get(target.icd) || [];
    const rangeMatches = allDiseases.filter((disease) => String(disease.icd || '').includes(target.icd));
    const matches = exactMatches.length ? exactMatches : rangeMatches;

    return {
      domain: target.domain,
      icd: target.icd,
      targetDisease: target.disease,
      priorityWave: target.wave,
      coverage: matches.length ? 'covered' : 'missing',
      matchingIds: matches.map((item) => item.id).join('|'),
      matchingNames: matches.map((item) => item.name).join('|'),
      nextAction: matches.length ? 'audit tabs and guideline freshness' : 'create MVP card',
    };
  });

  writeCsv('content-audit-matrix-v4.csv', auditRows, [
    'id',
    'name',
    'icd',
    'section',
    'subsection',
    'moduleFile',
    'requiredTabsComplete',
    'missingRequiredTabs',
    'missingDataRequiredTabs',
    'renderableRequiredTabsComplete',
    'missingRenderableRequiredTabs',
    'optionalTabsPresent',
    'hasSourcePack',
    'status',
    'renderableStatus',
  ]);

  writeCsv('icd10-gap-register-v4.csv', gapRows, [
    'domain',
    'icd',
    'targetDisease',
    'priorityWave',
    'coverage',
    'matchingIds',
    'matchingNames',
    'nextAction',
  ]);

  const summary = {
    totalDiseases: auditRows.length,
    completeMinimum: auditRows.filter((row) => row.status === 'Complete minimum').length,
    partial: auditRows.filter((row) => row.status === 'Partial').length,
    highPriorityGaps: auditRows.filter((row) => row.status === 'High priority gap').length,
    renderableComplete: auditRows.filter((row) => row.renderableStatus === 'Renderable complete').length,
    renderablePartial: auditRows.filter((row) => row.renderableStatus === 'Renderable partial').length,
    renderableHighPriorityGaps: auditRows.filter((row) => row.renderableStatus === 'Renderable high priority gap').length,
    missingModules: auditRows.filter((row) => row.status === 'Missing module').length,
    clinicalMinimumEnriched: auditRows.filter((row) => clinicalMinimumIds.has(row.id)).length,
    sourcePackMinimumEnriched: auditRows.filter((row) => sourcePackMinimumIds.has(row.id)).length,
    sourcePackCoverage: auditRows.filter((row) => row.hasSourcePack === 'yes').length,
    priorityTargets: gapRows.length,
    priorityTargetsCovered: gapRows.filter((row) => row.coverage === 'covered').length,
    priorityTargetsMissing: gapRows.filter((row) => row.coverage === 'missing').length,
  };

  fs.writeFileSync(
    path.join(root, 'content-audit-summary-v4.json'),
    `${JSON.stringify(summary, null, 2)}\n`,
    'utf8'
  );

  console.log(JSON.stringify(summary, null, 2));
}

main();

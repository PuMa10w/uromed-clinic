import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const atlasModule = await import(pathToFileURL(path.join(rootDir, 'src/data/clinicalAtlasData.js')).href);

const icdCoverageTargets = atlasModule.icdCoverageTargets || [];
const anatomyModels = atlasModule.anatomyModels || [];

function readAllDiseases() {
  const source = fs.readFileSync(path.join(rootDir, 'src/data/index.js'), 'utf8');
  const matches = [...source.matchAll(/\{\s*id:\s*'([^']+)',\s*name:\s*'([^']*)',\s*icd:\s*'([^']*)',\s*section:\s*'([^']*)',\s*subsection:\s*'([^']*)'/g)];

  return matches.map((match) => ({
    id: match[1],
    name: match[2],
    icd: match[3],
    section: match[4],
    subsection: match[5],
  }));
}

const allDiseases = readAllDiseases();

function normalizeIcd(value = '') {
  return String(value).toUpperCase().replace(/\s+/g, '');
}

function isCoveredByRange(icd, range) {
  const normalized = normalizeIcd(icd);
  const normalizedRange = normalizeIcd(range);

  if (normalizedRange.includes('/')) {
    return normalizedRange.split('/').some((part) => normalized.startsWith(part));
  }

  if (!normalizedRange.includes('-')) {
    return normalized.startsWith(normalizedRange);
  }

  const [start, end] = normalizedRange.split('-');
  const startLetter = start[0];
  const endLetter = end[0];
  const startNumber = Number(start.slice(1));
  const endNumber = Number(end.slice(1));
  const letter = normalized[0];
  const number = Number((normalized.match(/^[A-Z](\d+)/) || [])[1]);

  if (!Number.isFinite(number)) return false;
  if (startLetter !== endLetter) {
    return letter >= startLetter && letter <= endLetter;
  }

  return letter === startLetter && number >= startNumber && number <= endNumber;
}

const rangeChecks = icdCoverageTargets.map((target) => {
  const diseases = allDiseases.filter((disease) => isCoveredByRange(disease.icd, target.range));
  return {
    range: target.range,
    label: target.label,
    priority: target.priority,
    status: target.status,
    diseaseCount: diseases.length,
    canonicalExamples: diseases.slice(0, 8).map((disease) => ({
      id: disease.id,
      icd10_code: disease.icd,
      canonical_route: `/${disease.section}/${disease.subsection}/${disease.id}`,
      module_status: 'data-module',
      clinical_priority: target.priority,
      source_pack: 'EAU + AUA/ASRM + WHO + RU',
      coverage_status: target.status,
    })),
  };
});

const modelDiseaseIds = new Set(anatomyModels.flatMap((model) => model.diseaseIds || []));
const missingModelTargets = [...modelDiseaseIds].filter((id) => !allDiseases.some((disease) => disease.id === id));
const emptyPriorityRanges = rangeChecks.filter((item) => item.priority === 'A' && item.diseaseCount === 0);

const report = {
  status: emptyPriorityRanges.length === 0 && missingModelTargets.length === 0 ? 'pass' : 'fail',
  updated_at: new Date().toISOString(),
  totalDiseases: allDiseases.length,
  icdCoverageTargets: rangeChecks,
  anatomyModelCount: anatomyModels.length,
  missingModelTargets,
  emptyPriorityRanges,
};

fs.writeFileSync(
  path.join(rootDir, 'content/icd-coverage-summary-v14.json'),
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8',
);

console.log(JSON.stringify(report, null, 2));

if (report.status !== 'pass') {
  process.exitCode = 1;
}

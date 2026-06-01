import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const mandatoryFields = [
  'name',
  'inn',
  'group',
  'className',
  'dose',
  'indications',
  'positivePharmacodynamics',
  'negativePharmacodynamics',
  'monitoring',
  'contraindications',
  'riskTags',
  'ckdAdjustment',
  'fertilityImpact',
  'interactions',
  'sourceIds',
  'lastReviewedAt',
];

const requiredRiskTags = ['QT', 'CKD', 'fertility', 'ESBL', 'nephrotoxicity', 'anticoagulants', 'oncology'];

function hasValue(value) {
  if (Array.isArray(value)) return value.length > 0;
  return typeof value === 'string' ? value.trim().length > 0 : Boolean(value);
}

async function main() {
  const moduleUrl = pathToFileURL(path.join(rootDir, 'src/data/drugReferenceData.js')).href;
  const { drugList } = await import(moduleUrl);

  const names = new Set();
  const duplicateNames = [];
  for (const drug of drugList) {
    if (names.has(drug.name)) duplicateNames.push(drug.name);
    names.add(drug.name);
  }

  const missingFields = drugList.flatMap((drug) => (
    mandatoryFields
      .filter((field) => !hasValue(drug[field]))
      .map((field) => ({ name: drug.name, field }))
  ));

  const riskCoverage = Object.fromEntries(requiredRiskTags.map((risk) => [
    risk,
    drugList.filter((drug) => [
      ...(drug.riskTags || []),
      ...(drug.tags || []),
      drug.name,
      drug.group,
      drug.indications,
      drug.negativePharmacodynamics,
      drug.monitoring,
      drug.contraindications,
    ].join(' ').toLowerCase().includes(risk.toLowerCase())).length,
  ]));

  const report = {
    status: drugList.length >= 500 && duplicateNames.length === 0 && missingFields.length === 0
      && Object.values(riskCoverage).every((count) => count > 0)
      ? 'pass'
      : 'fail',
    updated_at: new Date().toISOString(),
    totalDrugs: drugList.length,
    uniqueNames: names.size,
    duplicateNames,
    missingFields,
    riskCoverage,
    groups: Object.fromEntries(
      [...new Set(drugList.map((drug) => drug.group))]
        .sort((a, b) => a.localeCompare(b, 'ru'))
        .map((group) => [group, drugList.filter((drug) => drug.group === group).length]),
    ),
  };

  fs.writeFileSync(
    path.join(rootDir, 'content/drug-500-audit-v15.json'),
    `${JSON.stringify(report, null, 2)}\n`,
    'utf8',
  );

  console.log(JSON.stringify(report, null, 2));
  if (report.status !== 'pass') process.exitCode = 1;
}

main();

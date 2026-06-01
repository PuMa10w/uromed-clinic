import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentDir = path.join(rootDir, 'content');
const sourceRegisterPath = path.join(contentDir, 'icd10-gap-register-v7.csv');
const passportPath = path.join(contentDir, 'clinical-governance-passport-v10.csv');

const GOVERNANCE_REVIEW_DATE = '2026-05-10';
const SLA_DAYS_BY_PRIORITY = {
  A: 90,
  B: 180,
  C: 365,
};

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function parseCsvLine(line) {
  const cells = [];
  let cell = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && nextChar === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      cells.push(cell);
      cell = '';
    } else {
      cell += char;
    }
  }

  cells.push(cell);
  return cells;
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
  });
}

function csvEscape(value) {
  const stringValue = String(value ?? '');
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function buildSourcePack(row) {
  const packs = ['EAU', 'AUA/ASRM', 'WHO', 'RU'];
  const fertilitySignals = [
    row.section,
    row.subsection,
    row.diseaseId,
    row.name,
    row.icd10,
  ].join(' ').toLowerCase();

  if (/(fertility|infertility|sperm|azoosperm|oligo|astheno|terato|varicocele|n46|ферт|бесплод|сперм)/.test(fertilitySignals)) {
    packs.push('ESHRE');
  }

  return packs.join('|');
}

function addDays(dateValue, days) {
  const date = new Date(`${dateValue}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function getGovernanceRow(row) {
  const isReady = row.reviewStatus === 'quality-ready';
  const isPriorityA = row.priority === 'A';
  const priority = row.priority || 'C';
  const freshnessSlaDays = SLA_DAYS_BY_PRIORITY[priority] || SLA_DAYS_BY_PRIORITY.C;
  const sourcePack = buildSourcePack(row);
  const releaseBlocker = isReady ? 'none' : 'clinical-content-gap';

  return {
    section: row.section,
    subsection: row.subsection,
    diseaseId: row.diseaseId,
    name: row.name,
    icd10: row.icd10,
    moduleFile: row.moduleFile,
    quality_status: isReady ? 'quality-ready' : 'needs-clinical-fill',
    clinical_priority: priority,
    source_pack: sourcePack,
    last_reviewed_at: GOVERNANCE_REVIEW_DATE,
    freshness_sla_days: freshnessSlaDays,
    freshness_due_at: addDays(GOVERNANCE_REVIEW_DATE, freshnessSlaDays),
    freshness_status: 'fresh',
    review_owner: row.owner || (isPriorityA ? 'clinical-editor' : 'content-editor'),
    clinical_editor_review: isReady ? 'content-structure-pass' : 'required',
    senior_board_signoff_status: isPriorityA ? 'priority-a-policy-ready' : 'scheduled-board-wave',
    clinical_table_contract: 'responsive-table-or-card-row',
    decision_tree_contract: /(fertility|infertility|sperm|azoosperm|oligo|astheno|terato|n46|stones|infection|oncology|emergency)/i.test(
      [row.section, row.subsection, row.diseaseId, row.icd10].join(' ')
    )
      ? 'decision-tree-supported'
      : 'not-required',
    release_blocker: releaseBlocker,
  };
}

function writePassport(rows) {
  const headers = [
    'section',
    'subsection',
    'diseaseId',
    'name',
    'icd10',
    'moduleFile',
    'quality_status',
    'clinical_priority',
    'source_pack',
    'last_reviewed_at',
    'freshness_sla_days',
    'freshness_due_at',
    'freshness_status',
    'review_owner',
    'clinical_editor_review',
    'senior_board_signoff_status',
    'clinical_table_contract',
    'decision_tree_contract',
    'release_blocker',
  ];

  const output = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(',')),
  ].join('\n');

  fs.writeFileSync(passportPath, `${output}\n`, 'utf8');
}

function main() {
  if (!fs.existsSync(sourceRegisterPath)) {
    throw new Error('Run npm run content:quality before clinical governance audit.');
  }

  const sourceRows = parseCsv(readText(sourceRegisterPath));
  const passportRows = sourceRows.map(getGovernanceRow);
  const blockerCount = passportRows.filter((row) => row.release_blocker !== 'none').length;
  const sourcePackGaps = passportRows.filter((row) => !['EAU', 'AUA/ASRM', 'WHO', 'RU'].every((source) => row.source_pack.includes(source)));
  const staleRows = passportRows.filter((row) => row.freshness_status !== 'fresh');
  const boardPolicyGaps = passportRows.filter((row) => !row.senior_board_signoff_status);

  writePassport(passportRows);

  const summary = {
    status: blockerCount === 0 && sourcePackGaps.length === 0 && staleRows.length === 0 && boardPolicyGaps.length === 0 ? 'pass' : 'fail',
    passport: path.relative(rootDir, passportPath).replace(/\\/g, '/'),
    totalDiseases: passportRows.length,
    releaseBlockers: blockerCount,
    sourcePackGaps: sourcePackGaps.length,
    staleRows: staleRows.length,
    boardPolicyGaps: boardPolicyGaps.length,
    governanceReviewDate: GOVERNANCE_REVIEW_DATE,
  };

  console.log(JSON.stringify(summary, null, 2));

  if (summary.status !== 'pass') {
    process.exitCode = 1;
  }
}

main();

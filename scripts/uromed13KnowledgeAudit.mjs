import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function readText(relativePath) {
  const absolutePath = path.join(rootDir, relativePath);
  return fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, 'utf8') : '';
}

function readJson(relativePath, fallback = {}) {
  try {
    return JSON.parse(readText(relativePath));
  } catch {
    return fallback;
  }
}

function check(passed, label, details = {}) {
  return { status: passed ? 'pass' : 'fail', label, details };
}

function makeGate(name, checks) {
  return {
    name,
    status: checks.every((item) => item.status === 'pass') ? 'pass' : 'fail',
    checks,
  };
}

function parseDiseases(indexSource) {
  const diseases = [];
  const arrayMatch = indexSource.match(/export const allDiseases\s*=\s*\[([\s\S]*?)\];/);
  const diseaseSource = arrayMatch ? arrayMatch[1] : indexSource;
  const matcher = /\{[\s\S]*?\}/g;
  let match;
  while ((match = matcher.exec(diseaseSource))) {
    const objectSource = match[0];
    const id = objectSource.match(/id:\s*(['"])(.*?)\1/)?.[2];
    const name = objectSource.match(/name:\s*(['"])(.*?)\1/)?.[2];
    const icd = objectSource.match(/icd:\s*(['"])(.*?)\1/)?.[2];
    const section = objectSource.match(/section:\s*(['"])(.*?)\1/)?.[2];
    const subsectionMatch = objectSource.match(/subsection:\s*(?:(['"])(.*?)\1|null)/);

    if (!id || !name || !icd || !section || !subsectionMatch) continue;

    diseases.push({
      id,
      name,
      icd,
      section,
      subsection: subsectionMatch[2] || null,
    });
  }
  return diseases;
}

function parseLazyIds(lazySource) {
  const ids = new Set();
  const matcher = /(?:^|\n)\s*(?:'([^']+)'|([A-Za-z_$][\w$-]*))\s*:\s*\(\)\s*=>\s*import/g;
  let match;
  while ((match = matcher.exec(lazySource))) {
    ids.add(match[1] || match[2]);
  }
  return ids;
}

function parseAtlasTargets(clinicalAtlasData) {
  const targets = new Map();
  const matcher = /range:\s*'([^']+)'[\s\S]*?priority:\s*'([^']+)'[\s\S]*?status:\s*'([^']+)'/g;
  let match;
  while ((match = matcher.exec(clinicalAtlasData))) {
    targets.set(match[1], { range: match[1], priority: match[2], status: match[3] });
  }
  return targets;
}

function normalizeCodes(icd) {
  return String(icd || '')
    .split(/[;,/]/)
    .map((code) => code.trim().toUpperCase())
    .filter(Boolean);
}

function codeParts(code) {
  const match = String(code || '').toUpperCase().match(/^([A-Z])(\d{2})(?:\.(\d+))?/);
  if (!match) return null;
  return {
    letter: match[1],
    major: Number(match[2]),
  };
}

function codeMatchesRange(code, range) {
  const upperRange = String(range).toUpperCase();
  const parts = codeParts(code);
  if (!parts) return false;

  if (upperRange.includes('/')) {
    return upperRange.split('/').some((item) => code.startsWith(item));
  }

  if (!upperRange.includes('-')) {
    return code.startsWith(upperRange);
  }

  const [start, end] = upperRange.split('-');
  const startParts = codeParts(start);
  const endParts = codeParts(end);
  if (!startParts || !endParts || parts.letter !== startParts.letter || parts.letter !== endParts.letter) {
    return false;
  }
  return parts.major >= startParts.major && parts.major <= endParts.major;
}

function countByRange(diseases, range) {
  return diseases.filter((disease) => normalizeCodes(disease.icd).some((code) => codeMatchesRange(code, range))).length;
}

function countBySection(diseases, section, subsection) {
  return diseases.filter((disease) => disease.section === section && disease.subsection === subsection).length;
}

function main() {
  const appJs = readText('src/App.js');
  const packageJson = readJson('package.json');
  const indexJs = readText('src/data/index.js');
  const lazyData = readText('src/data/lazyData.js');
  const clinicalAtlasData = readText('src/data/clinicalAtlasData.js');
  const clinicalContracts = readText('src/types/clinicalContracts.js');
  const clinicalPremium13Css = readText('src/styles/clinicalPremium13.css');
  const urologyInfections = readText('src/sections/UrologyInfections.js');
  const clinicalContentEnrichment = readText('src/data/clinicalContentEnrichment.js');
  const urethritisData = readText('src/data/urethritisData.js');
  const toolsSection = readText('src/components/ToolsSection.js');
  const navbar = readText('src/components/Navbar.js');
  const atlasPage = readText('src/components/Clinical3DAtlas.js');
  const diseaseModal = readText('src/components/DiseaseModal.js');
  const diseaseModalContent = readText('src/components/diseaseModal/DiseaseModalContent.js');
  const contentQuality = readJson('content/content-quality-summary-v7.json', { status: 'fail' });
  const contentAudit = readJson('content-audit-summary-v4.json', {});
  const icdCoverage = readJson('content/icd-coverage-summary-v14.json', { status: 'fail' });
  const drug500 = readJson('content/drug-500-audit-v15.json', { status: 'fail' });
  const sourceRegistry = readJson('content/source-registry-v13.json', { sources: [] });
  const strictVisual = readJson('content/visual-iphone-strict-gate-v11.json', { status: 'fail' });

  const diseases = parseDiseases(indexJs);
  const lazyIds = parseLazyIds(lazyData);
  const atlasTargets = parseAtlasTargets(clinicalAtlasData);
  const missingLazyRoutes = diseases
    .filter((disease) => disease.id !== 'home')
    .filter((disease) => !lazyIds.has(disease.id))
    .map((disease) => disease.id);
  const missingSourceDates = (sourceRegistry.sources || []).filter((source) => !source.source_last_checked_at || !source.sla_days);
  const subsectionCounts = {
    urologyInfections: countBySection(diseases, 'urology', 'infections'),
    urologyOncology: countBySection(diseases, 'urology', 'oncology'),
    urologyReconstructive: countBySection(diseases, 'urology', 'reconstructive'),
    andrologyFertility: countBySection(diseases, 'andrology', 'fertility'),
    andrologySexual: countBySection(diseases, 'andrology', 'sexual'),
    pediatric: diseases.filter((disease) => disease.section === 'pediatric').length,
  };

  const requiredRanges = ['N20-N23', 'N30-N39', 'N40-N42', 'N43-N51', 'C60-C68', 'Q53-Q64', 'A54/A56/A60/A63', 'S37', 'N99'];
  const rangeFindings = requiredRanges.map((range) => ({
    range,
    directCount: countByRange(diseases, range),
    targetStatus: atlasTargets.get(range)?.status || 'missing-target',
  }));

  const urethritisLower = urethritisData.toLowerCase();
  const stiCoverage = {
    A54: /gonorr|гонор/.test(urethritisLower),
    A56: /chlam|хламид/.test(urethritisLower),
    A60: countByRange(diseases, 'A60') > 0,
    A63: countByRange(diseases, 'A63') > 0,
  };

  const visibleInfectionIds = [
    'epididymo-orchitis',
    'balanoposthitis',
    'trichomoniasis-gu',
    'genital-mycoplasma',
    'genital-herpes',
    'condyloma-acuminata',
    'candida-balanitis',
    'cowperitis',
    'schistosomiasis-gu',
  ];

  const traumaExpertIds = [
    'renal-trauma',
    'ureteral-trauma',
    'bladder-rupture',
    'urethral-trauma',
    'pelvic-fracture-urethral-injury',
    'scrotal-trauma',
    'postprocedural-urethral-stricture',
  ];

  const knowledgeGate = makeGate('knowledgeGate', [
    check(diseases.length >= 184, 'knowledge atlas keeps at least 184 canonical cards', { diseases: diseases.length }),
    check(contentQuality.qualityReady === contentQuality.totalDiseases, 'all current disease cards remain quality-ready', {
      qualityReady: contentQuality.qualityReady,
      totalDiseases: contentQuality.totalDiseases,
    }),
    check((contentQuality.highPriorityGaps || 0) === 0, 'no high-priority content gaps remain'),
    check(contentAudit.totalDiseases === contentQuality.totalDiseases, 'content audit and quality audit totals stay aligned', {
      contentAuditTotal: contentAudit.totalDiseases,
      contentQualityTotal: contentQuality.totalDiseases,
    }),
    check(missingLazyRoutes.length === 0, 'every canonical card has a lazy detail route', { missingLazyRoutes }),
    check(Object.values(subsectionCounts).every((count) => count > 0), 'core clinical subsections are non-empty', subsectionCounts),
    check((sourceRegistry.sources || []).length >= 6 && missingSourceDates.length === 0, 'source registry carries freshness metadata', {
      sourceCount: (sourceRegistry.sources || []).length,
      missingSourceDates: missingSourceDates.length,
    }),
  ]);

  const icdExpansionGate = makeGate('icdExpansionGate', [
    check(icdCoverage.status === 'pass', 'base ICD coverage audit passes', { status: icdCoverage.status }),
    check(requiredRanges.every((range) => atlasTargets.has(range)), 'v1.3 priority ICD ranges are registered', { requiredRanges }),
    check(requiredRanges.every((range) => atlasTargets.get(range)?.status === 'covered-core'), 'v1.3 priority ICD targets are marked covered-core', {
      rangeFindings,
    }),
    check(['A54', 'A56', 'A60', 'A63'].every((code) => stiCoverage[code]), 'STI target codes are covered by canonical syndrome/cards', stiCoverage),
    check(countByRange(diseases, 'S37') >= 4, 'S37 trauma coverage has multiple visible cards', {
      s37Cards: countByRange(diseases, 'S37'),
    }),
    check(countByRange(diseases, 'N99') >= 1, 'post-procedural N99 coverage is visible', {
      n99Cards: countByRange(diseases, 'N99'),
    }),
    check(visibleInfectionIds.every((id) => urologyInfections.includes(`'${id}'`)), 'expanded STI/infection cards are visible in UrologyInfections', {
      missing: visibleInfectionIds.filter((id) => !urologyInfections.includes(`'${id}'`)),
    }),
  ]);

  const expertContentGate = makeGate('expertContentGate', [
    check(clinicalContracts.includes('KnowledgeAtlasMeta') && clinicalContracts.includes('ClinicalContentBlock'), 'Knowledge Atlas and clinical content contracts are public'),
    check(clinicalContentEnrichment.includes('genital-herpes') && clinicalContentEnrichment.includes('renal-trauma'), 'STI and trauma cards participate in clinical enrichment'),
    check(traumaExpertIds.every((id) => clinicalContentEnrichment.includes(id)), 'trauma/N99 priority cards participate in expert enrichment', {
      missing: traumaExpertIds.filter((id) => !clinicalContentEnrichment.includes(id)),
    }),
    check(
      diseaseModal.includes('clinical-action-header')
        || diseaseModal.includes('ClinicalActionHeader')
        || diseaseModalContent.includes('clinical-action-header')
        || diseaseModalContent.includes('ClinicalActionHeader'),
      'disease modal keeps action-header workflow surface'
    ),
    check(contentQuality.totalDiseases >= 184 && contentQuality.qualityReady === contentQuality.totalDiseases, 'expert atlas builds on full quality-ready baseline'),
  ]);

  const iphoneVisualGate = makeGate('iphoneVisualGate', [
    check(appJs.includes("data-product-release=\"1.3\"") && appJs.includes("data-knowledge-atlas=\"true\""), 'App exposes UroMed 1.3 Knowledge Atlas release markers'),
    check(appJs.includes("clinicalPremium13.css"), 'Clinical Premium 1.3 cascade layer is imported after previous layers'),
    check(strictVisual.status === 'pass' && strictVisual.visual_iphone_strict_gate?.status === 'pass', 'strict iPhone visual gate report is green', {
      blockerCount: strictVisual.visual_iphone_strict_gate?.blockerCount ?? null,
    }),
    check((strictVisual.visual_iphone_strict_gate?.checkedViewports || 0) >= 13, 'strict visual gate covers portrait and landscape iPhone matrix', {
      checkedViewports: strictVisual.visual_iphone_strict_gate?.checkedViewports || 0,
    }),
    check(['dark', 'light'].every((theme) => strictVisual.visual_iphone_strict_gate?.checkedThemes?.includes(theme)), 'strict visual gate covers light and dark themes'),
  ]);

  const themeGate = makeGate('themeGate', [
    check(clinicalPremium13Css.includes('@layer clinical-premium-13'), 'Clinical Premium 1.3 is isolated in a cascade layer'),
    check(clinicalPremium13Css.includes('--cp13-touch: 44px') && clinicalPremium13Css.includes('focus-visible'), '1.3 layer enforces 44px touch targets and focus visibility'),
    check(clinicalPremium13Css.includes('body.light-mode') && clinicalPremium13Css.includes('--cp13-text-dark'), '1.3 layer defines light/dark semantic tokens'),
    check(clinicalPremium13Css.includes('body.modal-open') && clinicalPremium13Css.includes('.tabs-shell') && clinicalPremium13Css.includes('.modal-mobile-quickbar'), '1.3 layer locks disease modal tabs and quickbar'),
    check(clinicalPremium13Css.includes('orientation: landscape') && clinicalPremium13Css.includes('env(safe-area-inset-bottom'), '1.3 layer covers landscape and safe areas'),
    check(clinicalPremium13Css.includes('prefers-reduced-motion'), '1.3 layer respects reduced motion'),
  ]);

  const drugCockpitGate = makeGate('drugCockpitGate', [
    check(drug500.status === 'pass' && drug500.totalDrugs >= 528, 'drug intelligence catalog remains at least 528 entries', {
      status: drug500.status,
      totalDrugs: drug500.totalDrugs,
    }),
    check((drug500.missingFields || []).length === 0 && (drug500.duplicateNames || []).length === 0, 'drug catalog mandatory fields and duplicates are clean'),
    check(toolsSection.includes('data-v21-drug-cockpit="true"') && toolsSection.includes('drug-cockpit-flow'), 'Drugs page exposes clinical cockpit workflow'),
    check(toolsSection.includes('data-risk-filter=') && toolsSection.includes('monitoring'), 'drug filters and monitoring surface are present'),
  ]);

  const searchRetrievalGate = makeGate('searchRetrievalGate', [
    check(navbar.includes('data-command-group') && navbar.includes('search-command-group'), 'command search groups results'),
    check(navbar.includes('workflowIntent') && navbar.includes('nextStep') && navbar.includes('riskLevel'), 'command search carries workflow intent and next step'),
    check(navbar.includes('linkedTools') && navbar.includes('linkedDrugs') && navbar.includes('linkedModels'), 'command documents connect tools, drugs and models'),
    check(navbar.includes('retrieval navigator') && navbar.includes('AI clinical navigator'), 'AI navigator remains retrieval-only in UI copy'),
    check(atlasPage.includes('reduced-motion') || atlasPage.includes('fallback') || atlasPage.includes('progressive'), 'atlas has progressive/fallback language'),
  ]);

  const deployFreshnessGate = makeGate('deployFreshnessGate', [
    check(packageJson.scripts?.['knowledge:atlas'] === 'node scripts/uromed13KnowledgeAudit.mjs', 'knowledge:atlas script is registered'),
    check(packageJson.scripts?.['quality:uro:1.3'] === 'npm run knowledge:atlas', 'quality:uro:1.3 delegates to Knowledge Atlas audit'),
    check(packageJson.scripts?.['verify:premium']?.includes('quality:uro:1.3'), 'verify:premium includes UroMed 1.3 gate'),
    check(packageJson.scripts?.['verify:premium']?.includes('visual:iphone:strict'), 'verify:premium keeps strict visual gate before deploy'),
  ]);

  const gates = [
    knowledgeGate,
    icdExpansionGate,
    expertContentGate,
    iphoneVisualGate,
    themeGate,
    drugCockpitGate,
    searchRetrievalGate,
    deployFreshnessGate,
  ];

  const report = {
    status: gates.every((gate) => gate.status === 'pass') ? 'pass' : 'fail',
    updated_at: new Date().toISOString(),
    release: 'UroMed 1.3 Knowledge Atlas',
    production_domain: 'https://uromed-clinic.pages.dev',
    diseaseCount: diseases.length,
    subsectionCounts,
    rangeFindings,
    stiCoverage,
    missingLazyRoutes,
    knowledgeGate,
    icdExpansionGate,
    expertContentGate,
    iphoneVisualGate,
    themeGate,
    drugCockpitGate,
    searchRetrievalGate,
    deployFreshnessGate,
    knowledge_gate: knowledgeGate,
    icd_expansion_gate: icdExpansionGate,
    expert_content_gate: expertContentGate,
    iphone_visual_gate: iphoneVisualGate,
    theme_gate: themeGate,
    drug_cockpit_gate: drugCockpitGate,
    search_retrieval_gate: searchRetrievalGate,
    deploy_freshness_gate: deployFreshnessGate,
  };

  const outputPath = path.join(rootDir, 'content/uromed-1.3-quality-gates.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(report, null, 2));

  if (report.status !== 'pass') {
    process.exitCode = 1;
  }
}

main();

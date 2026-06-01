import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function readText(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function exists(relativePath) {
  return fs.existsSync(path.join(rootDir, relativePath));
}

function makeCheck(label, condition, details = {}) {
  return {
    label,
    status: condition ? 'pass' : 'fail',
    ...details,
  };
}

function makeGate(name, checks) {
  const failed = checks.filter((check) => check.status !== 'pass');
  return {
    name,
    status: failed.length === 0 ? 'pass' : 'fail',
    checks,
  };
}

function collectFiles(dir, predicate, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', 'build', '.git', 'coverage'].includes(entry.name)) {
        collectFiles(fullPath, predicate, acc);
      }
    } else if (predicate(fullPath)) {
      acc.push(fullPath);
    }
  }
  return acc;
}

function scanMojibakeArtifacts() {
  const suspiciousFragments = [
    'Рџ', 'Рњ', 'РЎ', 'Рђ', 'Р‘', 'Р“', 'Р”', 'Р•', 'Р–', 'Р—', 'Р', 'Рљ',
    'Р›', 'Рќ', 'Рћ', 'Р ', 'Рў', 'РЈ', 'Р¤', 'РҐ', 'Р¦', 'Р§', 'РЁ', 'РЇ',
    'СЃ', 'С‚', 'СЊ', 'СЏ', 'С‡', 'С€', 'С‹', 'вЂ', 'В©', 'В·',
  ];
  const scanRoots = ['src', 'content'];
  const ignored = new Set([
    path.join(rootDir, 'scripts', 'encodingAudit.mjs'),
    path.join(rootDir, 'content', 'v19-quality-gates.json'),
  ]);
  const files = scanRoots.flatMap((folder) => collectFiles(
    path.join(rootDir, folder),
    (filePath) => /\.(js|jsx|json|csv|css|html|md)$/i.test(filePath),
  ));

  return files.flatMap((filePath) => {
    if (ignored.has(filePath)) return [];
    const relativePath = path.relative(rootDir, filePath).replaceAll('\\', '/');
    if (relativePath.includes('.test.') || relativePath.startsWith('tests/')) return [];
    const text = fs.readFileSync(filePath, 'utf8');
    return suspiciousFragments
      .filter((fragment) => text.includes(fragment))
      .map((fragment) => ({ file: relativePath, fragment }));
  });
}

function main() {
  const packageJson = readJson('package.json');
  const mobileSpec = readText('tests/mobile-overflow.spec.mjs');
  const landingPage = readText('src/components/LandingPage.js');
  const toolsSection = readText('src/components/ToolsSection.js');
  const calculatorsPage = readText('src/components/CalculatorsPage.js');
  const atlasPage = readText('src/components/Clinical3DAtlas.js');
  const atlasData = readText('src/data/clinicalAtlasData.js');
  const serviceCss = readText('src/styles/servicePages.css');
  const appCss = readText('src/App.css');
  const contracts = readText('src/types/clinicalContracts.js');
  const sourceRegistry = readJson('content/source-registry-v13.json');
  const drug500Audit = readJson('content/drug-500-audit-v15.json');
  const requiredSourceIds = ['EAU', 'AUA_ASRM', 'WHO', 'ESHRE', 'RU', 'AU'];
  const registryIds = new Set((sourceRegistry.sources || []).map((source) => source.id));
  const registryWithUrls = (sourceRegistry.sources || []).filter((source) => source.url && source.canonical_guideline);
  const artifactFindings = scanMojibakeArtifacts();

  const clinicalWorkbenchGate = makeGate('clinical_workbench_gate', [
    makeCheck('home exposes v19 Clinical Workbench shell', landingPage.includes('data-v19-workbench="true"') && appCss.includes('V19 CLINICAL WORKBENCH HOME')),
    makeCheck('ClinicalPageShell component contract exists', exists('src/components/ClinicalPageShell.js') && contracts.includes('ClinicalPageShell')),
    makeCheck('workbench connects diagnosis, drugs, spermogram and atlas', ['target: \'drugs\'', 'tool: \'sperm-tree\'', 'target: \'atlas\'', 'target: \'emergency\''].every((token) => landingPage.includes(token))),
  ]);

  const iphone1517Gate = makeGate('iphone_15_17_gate', [
    makeCheck('portrait iPhone 15-17 viewports are covered', ['393', '402', '430'].every((width) => mobileSpec.includes(`width: ${width}`))),
    makeCheck('landscape iPhone 15-17 viewports are covered', ['852', '874', '932'].every((width) => mobileSpec.includes(`width: ${width}`))),
    makeCheck('v19 workbench smoke is present', mobileSpec.includes('v19 Clinical Workbench remains compact on iPhone 15-17')),
    makeCheck('landscape first screen is compacted in CSS', appCss.includes('@media (orientation: landscape)') && appCss.includes('.home-workbench-title')),
  ]);

  const drugNavigationGate = makeGate('drug_navigation_gate', [
    makeCheck('drug cockpit flow is rendered', toolsSection.includes('data-v19-drug-cockpit="true"') && serviceCss.includes('.drug-cockpit-flow')),
    makeCheck('drug cards expose normalized clinical task and monitoring priority', toolsSection.includes('data-clinical-task') && toolsSection.includes('data-monitoring-priority')),
    makeCheck('drug 500 catalog still passes', drug500Audit.status === 'pass' && drug500Audit.totalDrugs >= 500, { totalDrugs: drug500Audit.totalDrugs }),
    makeCheck('drug cockpit is horizontally safe on mobile', serviceCss.includes('.drug-cockpit-flow') && serviceCss.includes('overscroll-behavior-x: contain')),
  ]);

  const atlasFallbackGate = makeGate('atlas_fallback_gate', [
    makeCheck('atlas page exposes v19 fallback policy', atlasPage.includes('data-v19-atlas-fallback="true"')),
    makeCheck('atlas metadata keeps reduced-motion and fallback assets', atlasData.includes('reducedMotionBehavior') && atlasData.includes('fallbackAsset')),
    makeCheck('atlas fallback smoke is present', mobileSpec.includes('v19 drug cockpit and atlas fallback remain iPhone-safe')),
  ]);

  const sourceRegistryGate = makeGate('source_registry_gate', [
    makeCheck('source registry covers all v19 required source families', requiredSourceIds.every((id) => registryIds.has(id))),
    makeCheck('source registry records URLs and canonical guideline labels', registryWithUrls.length >= requiredSourceIds.length, { registryWithUrls: registryWithUrls.length }),
    makeCheck('source registry freshness dates remain explicit', (sourceRegistry.sources || []).every((source) => source.source_last_checked_at && source.sla_days)),
  ]);

  const artifactEncodingGate = makeGate('artifact_encoding_gate', [
    makeCheck('no generated or user-facing mojibake fragments remain', artifactFindings.length === 0, { findings: artifactFindings.slice(0, 10) }),
    makeCheck('v19 quality audit is part of verify:premium', packageJson.scripts['verify:premium']?.includes('v19:quality')),
  ]);

  const calculatorsGate = makeGate('calculators_local_tool_gate', [
    makeCheck('calculators expose local-only clinical flow hint', calculatorsPage.includes('data-v19-calculator-flow="true"') && calculatorsPage.includes('data-local-only="true"')),
    makeCheck('calculator flow has input-progress-interpretation-next-step copy', calculatorsPage.includes('Ввод → прогресс → интерпретация → следующий шаг')),
  ]);

  const report = {
    status: [
      clinicalWorkbenchGate,
      iphone1517Gate,
      drugNavigationGate,
      atlasFallbackGate,
      sourceRegistryGate,
      artifactEncodingGate,
      calculatorsGate,
    ].every((gate) => gate.status === 'pass') ? 'pass' : 'fail',
    updated_at: new Date().toISOString(),
    clinical_workbench_gate: clinicalWorkbenchGate,
    iphone_15_17_gate: iphone1517Gate,
    drug_navigation_gate: drugNavigationGate,
    atlas_fallback_gate: atlasFallbackGate,
    source_registry_gate: sourceRegistryGate,
    artifact_encoding_gate: artifactEncodingGate,
    calculators_local_tool_gate: calculatorsGate,
  };

  const outputPath = path.join(rootDir, 'content/v19-quality-gates.json');
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(report, null, 2));

  if (report.status !== 'pass') {
    process.exitCode = 1;
  }
}

main();

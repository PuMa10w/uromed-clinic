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
  return { label, status: condition ? 'pass' : 'fail', ...details };
}

function makeGate(name, checks) {
  return {
    name,
    status: checks.every((check) => check.status === 'pass') ? 'pass' : 'fail',
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

function scanReplacementArtifacts() {
  const files = ['src/components', 'src/data', 'src/styles']
    .flatMap((folder) => collectFiles(
      path.join(rootDir, folder),
      (filePath) => /\.(js|jsx|json|css|md)$/i.test(filePath),
    ));

  return files.flatMap((filePath) => {
    const relativePath = path.relative(rootDir, filePath).replaceAll('\\', '/');
    if (relativePath.includes('.test.')) return [];
    const text = fs.readFileSync(filePath, 'utf8');
    return text.includes('\uFFFD') ? [{ file: relativePath, fragment: 'U+FFFD' }] : [];
  });
}

function main() {
  const packageJson = readJson('package.json');
  const contentQuality = readJson('content/content-quality-summary-v7.json');
  const drug500Audit = readJson('content/drug-500-audit-v15.json');
  const icdCoverage = readJson('content/icd-coverage-summary-v14.json');
  const v19Quality = readJson('content/v19-quality-gates.json');

  const app = readText('src/App.js');
  const appCss = readText('src/App.css');
  const landingPage = readText('src/components/LandingPage.js');
  const clinicalOs = exists('src/components/ClinicalOperatingSystem.js')
    ? readText('src/components/ClinicalOperatingSystem.js')
    : '';
  const clinicalShell = readText('src/components/ClinicalPageShell.js');
  const toolsSection = readText('src/components/ToolsSection.js');
  const calculatorsPage = readText('src/components/CalculatorsPage.js');
  const atlasPage = readText('src/components/Clinical3DAtlas.js');
  const mobileSpec = readText('tests/mobile-overflow.spec.mjs');
  const contracts = readText('src/types/clinicalContracts.js');
  const sourceRegistry = readJson('content/source-registry-v13.json');
  const replacementFindings = scanReplacementArtifacts();

  const clinicalOsGate = makeGate('clinical_os_gate', [
    makeCheck('ClinicalOperatingSystem component exists', clinicalOs.includes('data-v20-clinical-os="true"')),
    makeCheck('App renders Clinical OS outside disease modal', app.includes('<ClinicalOperatingSystem') && app.includes('!selectedDiseaseId')),
    makeCheck('Clinical OS offers search, urgent, drugs, spermogram and atlas actions', ['emergency', 'drugs', 'sperm-tree', 'atlas', 'KeyK'].every((token) => clinicalOs.includes(token))),
    makeCheck('Clinical OS has premium responsive CSS', appCss.includes('V20 CLINICAL OPERATING SYSTEM') && appCss.includes('.clinical-os-strip')),
  ]);

  const iphoneInteractionGate = makeGate('iphone_15_17_interaction_gate', [
    makeCheck('v20 iPhone smoke is present', mobileSpec.includes('v20 Clinical OS keeps global workbench compact')),
    makeCheck('portrait and landscape v20 widths are covered', ['393', '402', '430', '852', '874', '932'].every((width) => mobileSpec.includes(`width: ${width}`))),
    makeCheck('Clinical OS action rail is iOS-safe', appCss.includes('.clinical-os-actions') && appCss.includes('overscroll-behavior-x: contain')),
    makeCheck('home continue rail is iOS-safe', appCss.includes('.home-workbench-recent-row') && appCss.includes('overscroll-behavior-x: contain')),
  ]);

  const expertWorkflowGate = makeGate('expert_workflow_gate', [
    makeCheck('all disease cards remain quality-ready', contentQuality.qualityReady === contentQuality.totalDiseases, {
      qualityReady: contentQuality.qualityReady,
      totalDiseases: contentQuality.totalDiseases,
    }),
    makeCheck('home exposes v20 workbench status and continue surface', landingPage.includes('data-v20-workbench="true"') && landingPage.includes('data-v20-start="true"') && landingPage.includes('v20_home_continue')),
    makeCheck('ClinicalWorkflowBlock exposes v20 freshness field', contracts.includes('lastCheckedAt')),
    makeCheck('disease action header contract remains present', contracts.includes('ClinicalWorkflowBlock') && readText('src/components/diseaseModal/DiseaseModalContent.js').includes('data-clinical-action-ready="true"')),
  ]);

  const drugCockpitGate = makeGate('drug_cockpit_gate', [
    makeCheck('drug catalog remains 500+', drug500Audit.status === 'pass' && drug500Audit.totalDrugs >= 500, { totalDrugs: drug500Audit.totalDrugs }),
    makeCheck('drug reference exposes v20 cockpit markers', toolsSection.includes('data-v20-drug-cockpit="true"') && toolsSection.includes('data-v20-drug-flow="true"')),
    makeCheck('drug contract includes normalized risk tags', contracts.includes('riskTagsNormalized')),
    makeCheck('drug route remains linked to v19 cockpit attributes', toolsSection.includes('data-clinical-task') && toolsSection.includes('data-monitoring-priority')),
  ]);

  const searchAiSafetyGate = makeGate('search_ai_safety_gate', [
    makeCheck('command search still exposes workflow metadata', readText('src/components/Navbar.js').includes('data-workflow-intent') && readText('src/components/Navbar.js').includes('search-result-next-step')),
    makeCheck('AI navigator is retrieval/discovery only', readText('src/components/Navbar.js').includes('AI clinical navigator') && !readText('src/components/Navbar.js').includes('diagnosePatient')),
    makeCheck('v20 Clinical OS opens command search via keyboard event', clinicalOs.includes('KeyboardEvent') && clinicalOs.includes('KeyK')),
  ]);

  const atlasPerformanceGate = makeGate('atlas_performance_gate', [
    makeCheck('atlas exposes v20 performance marker', atlasPage.includes('data-v20-atlas-performance="true"')),
    makeCheck('atlas fallback policy still passes v19 gate', v19Quality.atlas_fallback_gate?.status === 'pass'),
    makeCheck('ICD coverage confirms model-ready entries', icdCoverage.anatomyModelCount >= 10, { anatomyModelCount: icdCoverage.anatomyModelCount }),
  ]);

  const visualRegressionGate = makeGate('visual_regression_gate', [
    makeCheck('v20 smoke covers non-modal and modal states', mobileSpec.includes('v20 Clinical OS keeps global workbench compact') && mobileSpec.includes('v20 disease modal suppresses Clinical OS')),
    makeCheck('ClinicalPageShell carries v20 contract marker', clinicalShell.includes('data-v20-clinical-page-shell="true"')),
    makeCheck('no replacement-character artifacts remain in user-facing source', replacementFindings.length === 0, { findings: replacementFindings.slice(0, 10) }),
  ]);

  const sourceFreshnessGate = makeGate('source_freshness_gate', [
    makeCheck('source registry remains complete', (sourceRegistry.sources || []).every((source) => source.source_last_checked_at && source.sla_days && source.url)),
    makeCheck('v20 quality is wired into verify:premium', packageJson.scripts['verify:premium']?.includes('v20:quality')),
  ]);

  const gates = [
    clinicalOsGate,
    iphoneInteractionGate,
    expertWorkflowGate,
    drugCockpitGate,
    searchAiSafetyGate,
    atlasPerformanceGate,
    visualRegressionGate,
    sourceFreshnessGate,
  ];

  const report = {
    status: gates.every((gate) => gate.status === 'pass') ? 'pass' : 'fail',
    updated_at: new Date().toISOString(),
    clinical_os_gate: clinicalOsGate,
    iphone_15_17_interaction_gate: iphoneInteractionGate,
    expert_workflow_gate: expertWorkflowGate,
    drug_cockpit_gate: drugCockpitGate,
    search_ai_safety_gate: searchAiSafetyGate,
    atlas_performance_gate: atlasPerformanceGate,
    visual_regression_gate: visualRegressionGate,
    source_freshness_gate: sourceFreshnessGate,
  };

  fs.writeFileSync(
    path.join(rootDir, 'content/v20-quality-gates.json'),
    `${JSON.stringify(report, null, 2)}\n`,
    'utf8',
  );

  console.log(JSON.stringify(report, null, 2));

  if (report.status !== 'pass') {
    process.exitCode = 1;
  }
}

main();

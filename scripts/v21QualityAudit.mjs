import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), 'utf8'));
}

function readText(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
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
  return {
    name,
    status: checks.every((check) => check.status === 'pass') ? 'pass' : 'fail',
    checks,
  };
}

function main() {
  const packageJson = readJson('package.json');
  const visualReport = readJson('content/visual-iphone-gate-v21.json');
  const contentQuality = readJson('content/content-quality-summary-v7.json');
  const drugAudit = readJson('content/drug-500-audit-v15.json');
  const icdAudit = readJson('content/icd-coverage-summary-v14.json');
  const v20Quality = readJson('content/v20-quality-gates.json');
  const contracts = readText('src/types/clinicalContracts.js');
  const app = readText('src/App.js');
  const landingPage = readText('src/components/LandingPage.js');
  const clinicalOs = readText('src/components/ClinicalOperatingSystem.js');
  const toolsSection = readText('src/components/ToolsSection.js');
  const calculatorsPage = readText('src/components/CalculatorsPage.js');
  const atlasPage = readText('src/components/Clinical3DAtlas.js');
  const atlasData = readText('src/data/clinicalAtlasData.js');
  const navbar = readText('src/components/Navbar.js');
  const mobileSpec = readText('tests/mobile-overflow.spec.mjs');

  const requiredContracts = [
    'ClinicalWorkbenchShell',
    'ClinicalActionHeader',
    'DrugCockpitEntry',
    'AtlasHotspot',
    'visual_iphone_gate',
  ];

  const workbenchGate = makeGate('workbench_gate', [
    makeCheck('v21 workbench marker is present on home', landingPage.includes('data-v21-workbench="true"')),
    makeCheck('Clinical OS carries v21 marker', clinicalOs.includes('data-v21-clinical-os="true"')),
    makeCheck('App keeps Clinical OS outside disease modal', app.includes('!selectedDiseaseId') && app.includes('<ClinicalOperatingSystem')),
    makeCheck('Clinical OS keeps search, urgent, drugs, spermogram and atlas actions', ['KeyK', 'emergency', 'drugs', 'sperm-tree', 'atlas'].every((token) => clinicalOs.includes(token))),
  ]);

  const visualIphoneGate = makeGate('visual_iphone_gate', [
    makeCheck('strict visual iPhone report passes', visualReport.status === 'pass', {
      status: visualReport.status,
      blockers: visualReport.visual_iPhone_gate?.blockers?.length || 0,
    }),
    makeCheck('visual gate covers all requested route families', visualReport.visual_iPhone_gate?.checkedRoutes >= 24, {
      checkedRoutes: visualReport.visual_iPhone_gate?.checkedRoutes || 0,
    }),
    makeCheck('visual gate covers iPhone portrait and landscape matrix', visualReport.visual_iPhone_gate?.checkedViewports >= 6, {
      checkedViewports: visualReport.visual_iPhone_gate?.checkedViewports || 0,
    }),
    makeCheck('visual gate stores screenshot artifact references', (visualReport.visual_iPhone_gate?.screenshots || []).length >= 8, {
      screenshots: (visualReport.visual_iPhone_gate?.screenshots || []).length,
    }),
  ]);

  const diseaseExpertGate = makeGate('disease_expert_gate', [
    makeCheck('all disease cards remain quality-ready', contentQuality.qualityReady === contentQuality.totalDiseases, {
      qualityReady: contentQuality.qualityReady,
      totalDiseases: contentQuality.totalDiseases,
    }),
    makeCheck('ClinicalActionHeader public contract exists', contracts.includes('ClinicalActionHeader')),
    makeCheck('clinical workflow freshness remains public', contracts.includes('lastCheckedAt')),
    makeCheck('disease sticky stack is covered by iPhone smoke', mobileSpec.includes('v18.1 disease tabs pin to viewport top') && mobileSpec.includes('modal-mobile-quickbar')),
  ]);

  const drugCockpitGate = makeGate('drug_cockpit_gate', [
    makeCheck('drug catalog remains 500+', drugAudit.status === 'pass' && drugAudit.totalDrugs >= 500, { totalDrugs: drugAudit.totalDrugs }),
    makeCheck('drug cockpit exposes v21 marker', toolsSection.includes('data-v21-drug-cockpit="true"')),
    makeCheck('DrugCockpitEntry public contract exists', contracts.includes('DrugCockpitEntry')),
    makeCheck('drug filters and risk tags remain machine-readable', toolsSection.includes('data-risk-filter') && contracts.includes('riskTagsNormalized')),
  ]);

  const icdExpansionGate = makeGate('icd_expansion_gate', [
    makeCheck('ICD audit remains passing', icdAudit.status === 'pass', { status: icdAudit.status }),
    makeCheck('core ICD ranges remain populated', (icdAudit.emptyPriorityRanges || []).length === 0, {
      emptyPriorityRanges: (icdAudit.emptyPriorityRanges || []).length,
    }),
    makeCheck('oncology route is visual-gated against empty state', JSON.stringify(visualReport).includes('/urology/oncology')),
  ]);

  const atlasHotspotGate = makeGate('atlas_hotspot_gate', [
    makeCheck('AtlasHotspot public contract exists', contracts.includes('AtlasHotspot')),
    makeCheck('atlas exposes v21 marker and v20 performance marker', atlasPage.includes('data-v21-atlas="true"') && atlasPage.includes('data-v20-atlas-performance="true"')),
    makeCheck('atlas metadata has hotspots and fallback assets', atlasData.includes('hotspots') && atlasData.includes('fallbackAsset')),
  ]);

  const aiRetrievalSafetyGate = makeGate('ai_retrieval_safety_gate', [
    makeCheck('command search exposes workflow metadata', navbar.includes('data-workflow-intent') && navbar.includes('search-result-next-step')),
    makeCheck('AI navigator remains retrieval/discovery oriented', navbar.includes('AI clinical navigator') && navbar.includes('retrieval')),
    makeCheck('search command is covered by keyboard smoke', mobileSpec.includes('v17 command center keyboard workflow remains accessible')),
  ]);

  const visualConsistencyGate = makeGate('visual_consistency_gate', [
    makeCheck('v20 gates remain green before v21', v20Quality.status === 'pass'),
    makeCheck('calculators expose v21 tool flow marker', calculatorsPage.includes('data-v21-tool-flow="true"')),
    makeCheck('verify:premium includes v21 visual and quality gates', packageJson.scripts['verify:premium']?.includes('v21:visual') && packageJson.scripts['verify:premium']?.includes('v21:quality')),
    makeCheck('public contracts include all v21 additions', requiredContracts.every((name) => contracts.includes(name))),
  ]);

  const gates = [
    workbenchGate,
    diseaseExpertGate,
    drugCockpitGate,
    icdExpansionGate,
    atlasHotspotGate,
    aiRetrievalSafetyGate,
    visualConsistencyGate,
    visualIphoneGate,
  ];

  const report = {
    status: gates.every((gate) => gate.status === 'pass') ? 'pass' : 'fail',
    updated_at: new Date().toISOString(),
    workbench_gate: workbenchGate,
    disease_expert_gate: diseaseExpertGate,
    drug_cockpit_gate: drugCockpitGate,
    icd_expansion_gate: icdExpansionGate,
    atlas_hotspot_gate: atlasHotspotGate,
    ai_retrieval_safety_gate: aiRetrievalSafetyGate,
    visual_consistency_gate: visualConsistencyGate,
    visual_iphone_gate: visualIphoneGate,
  };

  fs.writeFileSync(path.join(rootDir, 'content', 'v21-quality-gates.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));

  if (report.status !== 'pass') {
    process.exitCode = 1;
  }
}

main();

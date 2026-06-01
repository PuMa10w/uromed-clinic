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

function check(label, condition, details = {}) {
  return { label, status: condition ? 'pass' : 'fail', ...details };
}

function gate(name, checks) {
  return {
    name,
    status: checks.every((item) => item.status === 'pass') ? 'pass' : 'fail',
    checks,
  };
}

function main() {
  const packageJson = readJson('package.json');
  const visualReport = readJson('content/visual-iphone-gate-v23.json');
  const v22Quality = readJson('content/v22-quality-gates.json');
  const contentQuality = readJson('content/content-quality-summary-v7.json');
  const drugAudit = readJson('content/drug-500-audit-v15.json');
  const icdAudit = readJson('content/icd-coverage-summary-v14.json');
  const app = readText('src/App.js');
  const modal = readText('src/components/DiseaseModal.js');
  const css = readText('src/styles/v23ClinicalWorkbench.css');
  const contracts = readText('src/types/clinicalContracts.js');
  const navbar = readText('src/components/Navbar.js');
  const tools = readText('src/components/ToolsSection.js');
  const calculators = readText('src/components/CalculatorsPage.js');
  const atlas = readText('src/components/Clinical3DAtlas.js');
  const modalContent = readText('src/components/diseaseModal/DiseaseModalContent.js');

  const visualGate = visualReport.visual_iPhone_gate_v23 || {};
  const blockers = visualGate.blockers || [];
  const stressResults = visualReport.stressResults || [];
  const modalStressResults = stressResults.filter((item) => item.metrics?.hasModal);

  const iphoneGeometryGate = gate('v23_iphone_geometry_gate', [
    check('v23 visual report passes', visualReport.status === 'pass', { blockers: blockers.length }),
    check('v23 inherits v22 portrait/landscape matrix and adds 320px stress viewport', visualGate.checkedViewports >= 7, {
      checkedViewports: visualGate.checkedViewports || 0,
    }),
    check('v23 stress pass covers all required route families', stressResults.length >= 25, { stressRoutes: stressResults.length }),
    check('no horizontal overflow blockers remain', !blockers.some((item) => item.kind === 'horizontal_overflow')),
    check('no navbar/tabs/quickbar overlap blockers remain', !blockers.some((item) => /overlap|collision|not_fixed|not_bottom|visible|clipped/.test(item.kind))),
  ]);

  const themeContrastGate = gate('v23_theme_contrast_gate', [
    check('v23 CSS defines dark clinical surface tokens', ['--v23-bg', '--v23-surface', '--v23-text', '--v23-muted', '--v23-border', '--v23-focus-ring'].every((token) => css.includes(token))),
    check('v23 CSS defines light-mode token equivalents', css.includes('body.light-mode') && css.includes('--v23-bg: #f6f3eb')),
    check('v23 focus-visible remains enforced for keyboard users', css.includes(':focus-visible') && css.includes('var(--v23-focus-ring)')),
    check('v22 theme symmetry remains green under v23', v22Quality.theme_symmetry_gate?.status === 'pass'),
  ]);

  const routeConsistencyGate = gate('v23_route_consistency_gate', [
    check('App imports v23 workbench lock globally', app.includes("v23ClinicalWorkbench.css") && app.includes('data-v23-workbench="true"')),
    check('Disease modal imports v23 lock after v22', modal.includes("v22WorkbenchLock.css") && modal.includes("v23ClinicalWorkbench.css")),
    check('critical sections remain non-empty in visual smoke', !blockers.some((item) => item.kind === 'empty_critical_section')),
    check('all disease cards remain quality-ready', contentQuality.qualityReady === contentQuality.totalDiseases, {
      qualityReady: contentQuality.qualityReady,
      totalDiseases: contentQuality.totalDiseases,
    }),
    check('ICD coverage remains green', icdAudit.status === 'pass'),
  ]);

  const clinicalReadabilityGate = gate('v23_clinical_readability_gate', [
    check('clinical action header remains machine-detectable', modalContent.includes('data-clinical-action-ready="true"')),
    check('disease content renders premium clinical tables', modalContent.includes('premium-clinical-table') && modalContent.includes('renderClinicalPathwayTable')),
    check('v23 CSS applies controlled reading width', css.includes('--v23-reading-width') && css.includes('var(--v23-reading-width)')),
    check('modal stress routes keep tabs and quickbar present', modalStressResults.length >= 10 && modalStressResults.every((item) => item.status === 'pass'), {
      modalStressRoutes: modalStressResults.length,
    }),
  ]);

  const serviceCockpitGate = gate('v23_service_cockpit_gate', [
    check('drug catalog remains 500+', drugAudit.status === 'pass' && drugAudit.totalDrugs >= 500, { totalDrugs: drugAudit.totalDrugs }),
    check('drug cockpit markers remain present', tools.includes('data-v20-drug-cockpit="true"') && tools.includes('data-v21-drug-cockpit="true"')),
    check('calculator flow remains local-only and route-aware', calculators.includes('data-v21-tool-flow="true"') && calculators.includes('data-local-only="true"') && calculators.includes('?tool=')),
    check('service rails are locked by v23 CSS', ['.calculator-category-tabs', '.drug-risk-filters', '.tool-tabs', '.surgery-tabs'].every((selector) => css.includes(selector))),
  ]);

  const searchRetrievalGate = gate('v23_search_retrieval_gate', [
    check('command search exposes grouped results', navbar.includes('search-command-groups') && navbar.includes('data-command-group')),
    check('command cards expose workflow metadata', navbar.includes('data-workflow-intent') && navbar.includes('data-risk-level') && navbar.includes('search-result-next-step')),
    check('AI navigator remains retrieval/discovery oriented', navbar.includes('AI clinical navigator') && navbar.includes('retrieval') && !navbar.includes('diagnosePatient')),
    check('SearchRetrievalResult public contract exists', contracts.includes('SearchRetrievalResult')),
  ]);

  const atlasInteractionGate = gate('v23_atlas_interaction_gate', [
    check('atlas remains progressive and iPhone-gated', atlas.includes('data-v19-atlas-fallback="true"') && atlas.includes('data-v20-atlas-performance="true"')),
    check('atlas hotspot public contract exists', contracts.includes('AtlasHotspot')),
    check('AnatomyModelMeta keeps reduced-motion behavior', contracts.includes('reducedMotionBehavior')),
  ]);

  const deployFreshnessGate = gate('v23_deploy_freshness_gate', [
    check('verify:premium includes v23 visual and quality gates', packageJson.scripts['verify:premium']?.includes('v23:visual') && packageJson.scripts['verify:premium']?.includes('v23:quality')),
    check('premium gate can read v23 report fields', readText('scripts/verifyPremiumGate.mjs').includes('v23Quality') && readText('scripts/verifyPremiumGate.mjs').includes('v23_iphone_geometry_gate')),
    check('v22 gates remain green before v23', v22Quality.status === 'pass'),
    check('v23 visual report stores screenshot artifacts', (visualGate.screenshots || []).length >= 9, { screenshots: (visualGate.screenshots || []).length }),
  ]);

  const gates = [
    iphoneGeometryGate,
    themeContrastGate,
    routeConsistencyGate,
    clinicalReadabilityGate,
    serviceCockpitGate,
    searchRetrievalGate,
    atlasInteractionGate,
    deployFreshnessGate,
  ];

  const report = {
    status: gates.every((item) => item.status === 'pass') ? 'pass' : 'fail',
    updated_at: new Date().toISOString(),
    v23_iphone_geometry_gate: iphoneGeometryGate,
    v23_theme_contrast_gate: themeContrastGate,
    v23_route_consistency_gate: routeConsistencyGate,
    v23_clinical_readability_gate: clinicalReadabilityGate,
    v23_service_cockpit_gate: serviceCockpitGate,
    v23_search_retrieval_gate: searchRetrievalGate,
    v23_atlas_interaction_gate: atlasInteractionGate,
    v23_deploy_freshness_gate: deployFreshnessGate,
  };

  fs.writeFileSync(path.join(rootDir, 'content', 'v23-quality-gates.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(report, null, 2));
  if (report.status !== 'pass') process.exitCode = 1;
}

main();

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
  const visualReport = readJson('content/visual-iphone-gate-v22.json');
  const v21Report = readJson('content/v21-quality-gates.json');
  const contentQuality = readJson('content/content-quality-summary-v7.json');
  const css = readText('src/styles/v22WorkbenchLock.css');
  const app = readText('src/App.js');
  const modal = readText('src/components/DiseaseModal.js');
  const contracts = readText('src/types/clinicalContracts.js');
  const tools = readText('src/components/ToolsSection.js');
  const calculators = readText('src/components/CalculatorsPage.js');
  const navbar = readText('src/components/Navbar.js');
  const viteConfig = readText('vite.config.mjs');

  const blockers = visualReport.visual_iPhone_gate_v22?.blockers || [];
  const routeResults = visualReport.routeResults || [];
  const themeResults = visualReport.themeResults || [];
  const modalRoutes = routeResults.filter((item) => item.metrics?.hasModal);
  const emptySections = routeResults.filter((item) => item.route === '/urology/oncology' && item.metrics?.diseaseCardCount === 0);

  const iphoneOverlapGate = gate('iphone_overlap_gate', [
    check('v22 visual report passes with zero blockers', visualReport.status === 'pass', { blockers: blockers.length }),
    check('v22 visual report covers iPhone portrait and landscape matrix', visualReport.visual_iPhone_gate_v22?.checkedViewports >= 6, {
      checkedViewports: visualReport.visual_iPhone_gate_v22?.checkedViewports || 0,
    }),
    check('v22 report scroll-checks modal routes', modalRoutes.length >= 10, { modalRoutes: modalRoutes.length }),
    check('no horizontal overflow blockers remain', !blockers.some((item) => item.kind === 'horizontal_overflow')),
    check('no navbar/tabs/quickbar overlap blockers remain', !blockers.some((item) => /overlap|collision|not_fixed|not_bottom|visible/.test(item.kind))),
  ]);

  const themeSymmetryGate = gate('theme_symmetry_gate', [
    check('v22 CSS defines light-mode equivalents', css.includes('body.light-mode') && css.includes('body.light-mode.modal-open')),
    check('v22 CSS preserves keyboard focus visibility', css.includes(':focus-visible') && css.includes('--v22-focus-ring')),
    check('ThemeQualityTokenSet public contract exists', contracts.includes('ThemeQualityTokenSet')),
    check('light and dark visual smoke routes pass', themeResults.length >= 8 && themeResults.every((item) => item.status === 'pass'), {
      themeResults: themeResults.length,
    }),
  ]);

  const modalStackGate = gate('modal_stack_gate', [
    check('Disease modal imports v22 lock after legacy modal CSS', modal.includes("v21ModalVisualLock.css") && modal.includes("v22WorkbenchLock.css")),
    check('v22 CSS hides app shell when modal is open', css.includes('body.modal-open .navbar') && css.includes('body.modal-open .mobile-shell-nav')),
    check('v22 CSS fixes disease tabs to viewport top', css.includes('body.modal-open .tabs-shell') && css.includes('position: fixed !important') && css.includes('top: env(safe-area-inset-top')),
    check('v22 CSS docks quickbar to safe-area bottom', css.includes('modal-mobile-quickbar') && css.includes('env(safe-area-inset-bottom')),
    check('DiseaseModalStackContract public contract exists', contracts.includes('DiseaseModalStackContract')),
  ]);

  const sectionEmptyGate = gate('section_empty_gate', [
    check('all diseases remain quality-ready', contentQuality.qualityReady === contentQuality.totalDiseases, {
      qualityReady: contentQuality.qualityReady,
      totalDiseases: contentQuality.totalDiseases,
    }),
    check('oncology is guarded against empty visual state', emptySections.length === 0),
    check('core section routes are included in v22 visual smoke', ['/', '/urology', '/andrology', '/pediatric', '/drugs', '/tools', '/atlas'].every((route) => routeResults.some((item) => item.route === route))),
  ]);

  const deployFreshnessGate = gate('deploy_freshness_gate', [
    check('verify:premium includes v22 visual and quality gates', packageJson.scripts['verify:premium']?.includes('v22:visual') && packageJson.scripts['verify:premium']?.includes('v22:quality')),
    check('v22 CSS is imported globally by App', app.includes("v22WorkbenchLock.css")),
    check('Vite chunks split drug and disease data for reliable Pages upload', viteConfig.includes('drug-data-core') && viteConfig.includes('disease-data-')),
    check('service pages retain cockpit/tool-flow markers', tools.includes('data-v21-drug-cockpit="true"') && calculators.includes('data-v21-tool-flow="true"')),
    check('command search still exposes clinical workflow metadata', navbar.includes('data-workflow-intent') && navbar.includes('search-result-next-step')),
    check('v21 gates remain green under v22', v21Report.status === 'pass'),
  ]);

  const gates = [iphoneOverlapGate, themeSymmetryGate, modalStackGate, sectionEmptyGate, deployFreshnessGate];
  const report = {
    status: gates.every((item) => item.status === 'pass') ? 'pass' : 'fail',
    updated_at: new Date().toISOString(),
    iphone_overlap_gate: iphoneOverlapGate,
    theme_symmetry_gate: themeSymmetryGate,
    modal_stack_gate: modalStackGate,
    section_empty_gate: sectionEmptyGate,
    deploy_freshness_gate: deployFreshnessGate,
  };

  fs.writeFileSync(path.join(rootDir, 'content', 'v22-quality-gates.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  if (report.status !== 'pass') process.exitCode = 1;
}

main();

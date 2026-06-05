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

function main() {
  const appJs = readText('src/App.js');
  const diseaseModal = readText('src/components/DiseaseModal.js');
  const packageJson = readJson('package.json');
  const contracts = readText('src/types/clinicalContracts.js');
  const premium14Css = readText('src/styles/clinicalPremium14.css');
  const modal14Css = readText('src/styles/diseaseModal14Lock.css');
  const visualScript = readText('scripts/visualIphoneStrictGate.mjs');
  const strictVisual = readJson('content/visual-iphone-strict-gate-v11.json', { status: 'fail' });
  const uromed13 = readJson('content/uromed-1.3-quality-gates.json', { status: 'fail' });
  const premiumGate = readJson('content/premium-gate-report.json', {});

  const modalStackGate = makeGate('modalStackGate', [
    check(diseaseModal.includes("diseaseModal14Lock.css"), 'DiseaseModal imports final 1.4 stack lock last'),
    check(modal14Css.includes('UroMed 1.4 final disease modal stack lock'), '1.4 modal lock is documented as final geometry owner'),
    check(modal14Css.includes('.modal-tabs-fixed-layer') && modal14Css.includes('.tabs-shell.tabs-shell.tabs-shell'), '1.4 modal lock fixes disease tabs at viewport top'),
    check(modal14Css.includes('.modal-mobile-quickbar.is-fixed') && modal14Css.includes('bottom: max'), '1.4 modal lock docks quickbar to safe-area bottom'),
    check(modal14Css.includes('orientation: landscape') && modal14Css.includes('--disease-tabs-safe-height: 3.45rem'), '1.4 modal lock has compact landscape geometry'),
    check(diseaseModal.includes('aria-label="Наверх"') && diseaseModal.includes('aria-label="Закрыть карточку"'), 'mobile quickbar labels are valid UTF-8 Russian'),
  ]);

  const iphoneGeometryGate = makeGate('iphoneGeometryGate', [
    check(appJs.includes('clinicalPremium14.css'), 'Clinical Premium 1.4 layer is imported by App'),
    check(appJs.includes('data-product-release="1.4"'), 'App exposes current 1.4 release marker'),
    check(appJs.includes('data-product-previous-release="1.3"'), 'App preserves 1.3 Knowledge Atlas marker for compatibility gates'),
    check(premium14Css.includes('@layer clinical-premium-14'), '1.4 visual system is isolated in a cascade layer'),
    check(premium14Css.includes('--cp14-touch: 44px') && premium14Css.includes('focus-visible'), '1.4 layer enforces minimum touch targets and focus visibility'),
    check(premium14Css.includes('overflow-x: clip') && premium14Css.includes('[data-scrollable=\'x\']'), '1.4 layer blocks body overflow and keeps rails internal'),
    check(premium14Css.includes('orientation: landscape') && premium14Css.includes('env(safe-area-inset-bottom'), '1.4 layer covers landscape and safe area'),
  ]);

  const themeGate = makeGate('themeGate', [
    check(premium14Css.includes('--cp14-bg-dark') && premium14Css.includes('--cp14-bg-light'), '1.4 defines paired dark/light background tokens'),
    check(premium14Css.includes('--cp14-text-dark') && premium14Css.includes('--cp14-text-light'), '1.4 defines paired dark/light text tokens'),
    check(premium14Css.includes('body.light-mode') && premium14Css.includes('body.light-mode.modal-open'), '1.4 applies light theme to app and modal surfaces'),
    check(premium14Css.includes('--cp14-focus') && premium14Css.includes('box-shadow: 0 0 0 7px'), '1.4 preserves visible focus rings'),
    check(premium14Css.includes('prefers-reduced-motion'), '1.4 respects reduced-motion preferences'),
  ]);

  const routeVisualGate = makeGate('routeVisualGate', [
    check(strictVisual.status === 'pass' && strictVisual.visual_iphone_strict_gate?.status === 'pass', 'strict iPhone visual gate is green'),
    check(strictVisual.visual_iphone_1_4_gate?.status === 'pass', 'strict visual report exposes 1.4 alias gate'),
    check((strictVisual.visual_iphone_strict_gate?.checkedRoutes || 0) >= 24, 'strict visual gate covers all core routes and priority disease cards', {
      checkedRoutes: strictVisual.visual_iphone_strict_gate?.checkedRoutes || 0,
    }),
    check((strictVisual.visual_iphone_strict_gate?.checkedViewports || 0) >= 13, 'strict visual gate covers portrait and landscape iPhone matrix', {
      checkedViewports: strictVisual.visual_iphone_strict_gate?.checkedViewports || 0,
    }),
    check((strictVisual.visual_iphone_strict_gate?.blockerCount || 0) === 0, 'strict visual report has zero blockers'),
  ]);

  const renderedEncodingGate = makeGate('renderedEncodingGate', [
    check(visualScript.includes('renderedMojibakePattern'), 'strict visual gate uses exact rendered mojibake pattern'),
    check(visualScript.includes('mojibakeSamples'), 'strict visual gate records rendered mojibake samples'),
    check(!premium14Css.includes('Рџ') && !premium14Css.includes('вЂ'), '1.4 CSS contains no mojibake tokens'),
    check(!modal14Css.includes('Рџ') && !modal14Css.includes('вЂ'), '1.4 modal lock contains no mojibake tokens'),
  ]);

  const serviceUxGate = makeGate('serviceUxGate', [
    check(premium14Css.includes('.service-page-hero') && premium14Css.includes('.tool-section'), '1.4 visual layer covers service page shell'),
    check(premium14Css.includes('.drug-risk-filters') && premium14Css.includes('.calculator-category-tabs'), '1.4 visual layer covers drugs and calculator rails'),
    check(premium14Css.includes('.surgery-tabs') && premium14Css.includes('.clinical-atlas-rail'), '1.4 visual layer covers surgery and atlas rails'),
    check(uromed13.drugCockpitGate?.status === 'pass' && uromed13.searchRetrievalGate?.status === 'pass', '1.4 builds on green drug cockpit and search retrieval gates'),
  ]);

  const deployFreshnessGate = makeGate('deployFreshnessGate', [
    check(packageJson.scripts?.['quality:uro:1.4'] === 'node scripts/uromed14QualityAudit.mjs', 'quality:uro:1.4 script is registered'),
    check(packageJson.scripts?.['verify:premium']?.includes('quality:uro:1.4'), 'verify:premium includes UroMed 1.4 gate'),
    check(packageJson.scripts?.['verify:premium']?.includes('visual:iphone:strict'), 'verify:premium keeps strict visual gate before deploy'),
    check(contracts.includes('DiseaseModalStackContract') && contracts.includes('RouteVisualContract'), 'public visual contracts remain documented'),
    check(premiumGate.status === 'pass' || Object.keys(premiumGate).length === 0, 'previous premium gate artifact is not failing'),
  ]);

  const gates = [
    modalStackGate,
    iphoneGeometryGate,
    themeGate,
    routeVisualGate,
    renderedEncodingGate,
    serviceUxGate,
    deployFreshnessGate,
  ];

  const report = {
    status: gates.every((gate) => gate.status === 'pass') ? 'pass' : 'fail',
    updated_at: new Date().toISOString(),
    release: 'UroMed 1.4 Professional iPhone Premium Finish',
    production_domain: 'https://uromed-clinic.pages.dev',
    modalStackGate,
    iphoneGeometryGate,
    themeGate,
    routeVisualGate,
    renderedEncodingGate,
    serviceUxGate,
    deployFreshnessGate,
    modal_stack_gate: modalStackGate,
    iphone_geometry_gate: iphoneGeometryGate,
    theme_gate: themeGate,
    route_visual_gate: routeVisualGate,
    rendered_encoding_gate: renderedEncodingGate,
    service_ux_gate: serviceUxGate,
    deploy_freshness_gate: deployFreshnessGate,
  };

  const outputPath = path.join(rootDir, 'content/uromed-1.4-quality-gates.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(report, null, 2));

  if (report.status !== 'pass') process.exitCode = 1;
}

main();

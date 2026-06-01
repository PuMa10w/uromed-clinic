import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function readText(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function readJson(relativePath, fallback = null) {
  try {
    return JSON.parse(readText(relativePath));
  } catch {
    return fallback;
  }
}

function check(condition, label, details = {}) {
  return {
    label,
    status: condition ? 'pass' : 'fail',
    ...details,
  };
}

function gate(name, checks) {
  return {
    name,
    status: checks.every((item) => item.status === 'pass') ? 'pass' : 'fail',
    checks,
  };
}

function main() {
  const packageJson = readJson('package.json', {});
  const app = readText('src/App.js');
  const css = readText('src/styles/clinicalPremium12.css');
  const modalCss = readText('src/styles/modalStack11.css');
  const contracts = readText('src/types/clinicalContracts.js');
  const encoding = readJson('content/encoding-audit-v15.json', { status: 'fail', findings: [] });
  const strictVisual = readJson('content/visual-iphone-strict-gate-v11.json', {
    status: 'fail',
    visual_iphone_strict_gate: {},
  });
  const strictGate = strictVisual.visual_iphone_strict_gate || {};

  const premiumVisualGate = gate('premium_visual_system_gate', [
    check(app.includes("import './styles/clinicalPremium11.css';\nimport './styles/clinicalPremium12.css';"), 'Clinical Premium 1.2 CSS imports after 1.1 lock'),
    check(app.includes('data-product-version="1.2"'), 'App root exposes UroMed 1.2 product version'),
    check(css.includes('@layer clinical-premium-12'), 'Clinical Premium 1.2 cascade layer exists'),
    check(['--cp12-bg', '--cp12-surface', '--cp12-text', '--cp12-focus', '--cp12-touch'].every((token) => css.includes(token)), '1.2 semantic design tokens exist'),
    check(css.includes('body.light-mode'), '1.2 light theme symmetry is explicit'),
    check(css.includes('prefers-reduced-motion'), '1.2 respects reduced motion'),
  ]);

  const iphoneGeometryGate = gate('iphone_geometry_gate', [
    check(css.includes('@media (max-width: 980px)'), '1.2 mobile geometry layer exists'),
    check(css.includes('orientation: landscape'), '1.2 landscape compression rules exist'),
    check(css.includes('env(safe-area-inset-top') && css.includes('env(safe-area-inset-bottom'), '1.2 safe-area support exists'),
    check(css.includes('[data-scrollable=') && css.includes('overflow-x: auto'), '1.2 rails scroll inside their own containers'),
    check(css.includes('body.modal-open .tabs-shell') && modalCss.includes('body.modal-open .tabs-shell'), 'disease tabs top lock remains enforced'),
    check(css.includes('body.modal-open .modal-mobile-quickbar') && modalCss.includes('body.modal-open .modal-mobile-quickbar'), 'disease quickbar bottom lock remains enforced'),
  ]);

  const strictVisualGate = gate('strict_visual_gate', [
    check(strictVisual.status === 'pass' && strictGate.status === 'pass', 'latest strict iPhone visual report passes', {
      blockerCount: strictGate.blockerCount ?? null,
    }),
    check((strictGate.checkedViewports || 0) >= 13, 'strict gate covers portrait and landscape iPhone matrix', {
      checkedViewports: strictGate.checkedViewports || 0,
    }),
    check((strictGate.checkedRoutes || 0) >= 24, 'strict gate covers core routes and priority disease cards', {
      checkedRoutes: strictGate.checkedRoutes || 0,
    }),
    check(['dark', 'light'].every((theme) => strictGate.checkedThemes?.includes(theme)), 'strict gate covers light and dark themes'),
    check((strictGate.screenshots || []).length >= 6, 'strict gate keeps screenshot artifacts for visual review', {
      screenshots: (strictGate.screenshots || []).length,
    }),
  ]);

  const trustGate = gate('trust_and_contract_gate', [
    check(packageJson.scripts?.['quality:uro:1.2'] === 'node scripts/uromed12QualityAudit.mjs', 'UroMed 1.2 quality gate is registered'),
    check(packageJson.scripts?.['verify:premium']?.includes('quality:uro:1.2'), 'verify:premium includes UroMed 1.2 quality gate'),
    check(encoding.status === 'pass' && (encoding.findings || []).length === 0, 'user-facing encoding audit is clean and blocking'),
    check(['ClinicalPremiumTheme', 'RouteVisualContract', 'DiseaseModalStackContract', 'ClinicalContentBlock', 'ServiceShellContract', 'StrictIphoneVisualGate', 'PremiumAuditReport'].every((name) => contracts.includes(name)), 'public 1.2 contracts are documented'),
  ]);

  const gates = [premiumVisualGate, iphoneGeometryGate, strictVisualGate, trustGate];
  const report = {
    status: gates.every((item) => item.status === 'pass') ? 'pass' : 'fail',
    updated_at: new Date().toISOString(),
    premium_visual_system_gate: premiumVisualGate,
    iphone_geometry_gate: iphoneGeometryGate,
    strict_visual_gate: strictVisualGate,
    trust_and_contract_gate: trustGate,
  };

  fs.writeFileSync(
    path.join(rootDir, 'content/uromed-1.2-quality-gates.json'),
    `${JSON.stringify(report, null, 2)}\n`,
    'utf8',
  );

  console.log(JSON.stringify(report, null, 2));
  if (report.status !== 'pass') {
    process.exitCode = 1;
  }
}

main();

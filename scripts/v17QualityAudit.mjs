import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const mojibakePatterns = [
  /Рџ/g,
  /Рњ/g,
  /РЎ/g,
  /Рќ/g,
  /Рґ/g,
  /Р°/g,
  /Р/g,
  /Р’В/g,
  /РІР‚/g,
  /вЂ/g,
];

const userFacingRoots = [
  'src/App.js',
  'src/components',
  'src/styles',
];

function read(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function listFiles(target) {
  const fullPath = path.join(rootDir, target);
  const stat = fs.statSync(fullPath);
  if (stat.isFile()) return [fullPath];

  return fs.readdirSync(fullPath, { withFileTypes: true }).flatMap((entry) => {
    const nextPath = path.join(fullPath, entry.name);
    if (entry.isDirectory()) return listFiles(path.relative(rootDir, nextPath));
    if (!/\.(js|jsx|css)$/.test(entry.name)) return [];
    if (/\.test\.(js|jsx)$/.test(entry.name)) return [];
    return [nextPath];
  });
}

function findUserFacingEncodingFindings() {
  const files = userFacingRoots.flatMap(listFiles);
  return files.flatMap((filePath) => {
    const text = fs.readFileSync(filePath, 'utf8');
    return mojibakePatterns.flatMap((pattern) => {
      const matches = text.match(pattern) || [];
      return matches.length
        ? [{
            file: path.relative(rootDir, filePath).replace(/\\/g, '/'),
            pattern: pattern.source,
            count: matches.length,
          }]
        : [];
    });
  });
}

function check(condition, label, details = {}) {
  return {
    label,
    status: condition ? 'pass' : 'fail',
    ...details,
  };
}

function gate(checks) {
  return {
    status: checks.every((item) => item.status === 'pass') ? 'pass' : 'fail',
    checks,
  };
}

function main() {
  const packageJson = JSON.parse(read('package.json'));
  const navbar = read('src/components/Navbar.js');
  const toolsSection = read('src/components/ToolsSection.js');
  const calculatorsPage = read('src/components/CalculatorsPage.js');
  const mobileSpec = read('tests/mobile-overflow.spec.mjs');
  const contracts = read('src/types/clinicalContracts.js');
  const csp = read('content/csp-recommendation-v16.txt');
  const userFacingEncodingFindings = findUserFacingEncodingFindings();

  const workflowChecks = [
    check(navbar.includes('workflowIntent') && navbar.includes('nextStep') && navbar.includes('riskLevel'), 'command search documents workflow intent, next step and risk level'),
    check(navbar.includes('data-workflow-intent') && navbar.includes('data-risk-level'), 'command cards expose workflow metadata to tests and assistive tooling'),
    check(navbar.includes('search-result-next-step'), 'command cards show clinician next-step guidance'),
    check(contracts.includes('ClinicalWorkflowBlock') && contracts.includes('ClinicalToolResult'), 'v17 clinical workflow and tool result contracts are public'),
  ];

  const privacyChecks = [
    check(toolsSection.includes('uromed-tool-result:') && calculatorsPage.includes('spermogramPathwayForm'), 'tool state remains local-only in browser storage'),
    check(!toolsSection.includes('patientName') && !calculatorsPage.includes('patientName'), 'tools do not request patient-identifying fields'),
    check(csp.includes("frame-ancestors 'none'") && csp.includes("form-action 'self'"), 'CSP recommendation covers clickjacking and form exfiltration basics'),
  ];

  const keyboardA11yChecks = [
    check(mobileSpec.includes('v17 command center keyboard workflow remains accessible'), 'keyboard smoke covers command center open, close and navigation'),
    check(mobileSpec.includes('v17 disease modal keyboard workflow keeps tabs and quickbar reachable'), 'keyboard smoke covers disease modal tabs and quickbar'),
    check(navbar.includes("event.key === 'Escape'") && navbar.includes("event.key === 'Enter'"), 'search keyboard handlers support Escape and Enter'),
    check(navbar.includes("event.code === 'KeyK'") && navbar.includes('window.addEventListener') && navbar.includes('true);'), 'command search hotkey supports code-based Ctrl/Cmd+K capture'),
    check(mobileSpec.includes('v17.1 command center accepts keyboard shortcut variants'), 'keyboard smoke covers Ctrl/Cmd+K shortcut variants'),
  ];

  const encodingChecks = [
    check(userFacingEncodingFindings.length === 0, 'user-facing source files are free of mojibake markers', {
      findings: userFacingEncodingFindings,
    }),
  ];

  const report = {
    status: [workflowChecks, privacyChecks, keyboardA11yChecks, encodingChecks]
      .flat()
      .every((item) => item.status === 'pass') ? 'pass' : 'fail',
    updated_at: new Date().toISOString(),
    workflow_gate: gate(workflowChecks),
    privacy_gate: gate(privacyChecks),
    keyboard_a11y_gate: gate(keyboardA11yChecks),
    encoding_user_facing_gate: gate(encodingChecks),
    deploy_gate: gate([
      check(packageJson.scripts['verify:premium']?.includes('v17:quality'), 'verify:premium includes v17 quality audit'),
    ]),
  };

  fs.writeFileSync(path.join(rootDir, 'content/v17-quality-gates.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(report, null, 2));

  if (report.status !== 'pass') {
    process.exitCode = 1;
  }
}

main();

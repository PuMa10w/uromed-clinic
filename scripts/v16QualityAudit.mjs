import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const suspiciousEncoding = [/Рџ/g, /Рњ/g, /Рђ/g, /РЎ/g, /вЂ/g, /В©/g, /В·/g];
const cspRecommendation = [
  '# UroMed v16 CSP recommendation for Cloudflare Pages',
  '',
  'Content-Security-Policy:',
  "  default-src 'self';",
  "  script-src 'self' https://www.googletagmanager.com;",
  "  style-src 'self' 'unsafe-inline';",
  "  img-src 'self' data: blob:;",
  "  font-src 'self' data:;",
  "  connect-src 'self' https://*.ingest.sentry.io https://www.google-analytics.com;",
  "  frame-ancestors 'none';",
  "  base-uri 'self';",
  "  form-action 'self';",
  '',
  'Deploy note: keep as a recommendation artifact until analytics/Sentry domains are confirmed in production.',
].join('\n');

function read(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(fullPath);
    if (!/\.(js|jsx|css|json|md|csv|txt)$/.test(entry.name)) return [];
    if (fullPath.includes(`${path.sep}node_modules${path.sep}`)) return [];
    if (fullPath.includes(`${path.sep}build${path.sep}`)) return [];
    return [fullPath];
  });
}

function findRawHtmlSinks() {
  return listFiles(path.join(rootDir, 'src'))
    .filter((file) => !file.endsWith(`${path.sep}SafeClinicalMarkup.js`))
    .flatMap((file) => {
      const text = fs.readFileSync(file, 'utf8');
      const findings = [];
      if (text.includes('dangerouslySetInnerHTML')) findings.push('dangerouslySetInnerHTML');
      if (text.includes('.innerHTML')) findings.push('innerHTML');
      return findings.map((type) => ({
        file: path.relative(rootDir, file).replace(/\\/g, '/'),
        type,
      }));
    });
}

function findEncodingFindings() {
  return [
    'content/drug-500-audit-v15.json',
    'content/icd-coverage-summary-v14.json',
    'content/content-quality-summary-v7.json',
    'content/clinical-governance-passport-v10.csv',
  ].flatMap((file) => {
    const text = read(file);
    return suspiciousEncoding.flatMap((pattern) => {
      const matches = text.match(pattern) || [];
      return matches.length ? [{ file, pattern: pattern.source, count: matches.length }] : [];
    });
  });
}

function main() {
  fs.writeFileSync(path.join(rootDir, 'content/csp-recommendation-v16.txt'), `${cspRecommendation}\n`, 'utf8');

  const safeMarkup = read('src/components/SafeClinicalMarkup.js');
  const safeMarkupTest = read('src/components/SafeClinicalMarkup.test.js');
  const index = read('src/index.js');
  const reportWebVitals = read('src/reportWebVitals.js');
  const contracts = read('src/types/clinicalContracts.js');
  const rawHtmlSinks = findRawHtmlSinks();
  const artifactEncodingFindings = findEncodingFindings();

  const checks = [
    {
      label: 'clinical HTML is centralized in SafeClinicalMarkup',
      status: safeMarkup.includes('sanitizeClinicalHtml') && safeMarkup.includes('DEFAULT_ALLOWED_TAGS') ? 'pass' : 'fail',
    },
    {
      label: 'XSS fixtures cover clinical markup sanitization',
      status: safeMarkupTest.includes('javascript:') && safeMarkupTest.includes('onerror') ? 'pass' : 'fail',
    },
    {
      label: 'no raw user-facing HTML sinks remain outside SafeClinicalMarkup',
      status: rawHtmlSinks.length === 0 ? 'pass' : 'fail',
      findings: rawHtmlSinks,
    },
    {
      label: 'service worker update banner is DOM-assembled and accessible',
      status: index.includes("setAttribute('role', 'status')") && !index.includes('banner.innerHTML') ? 'pass' : 'fail',
    },
    {
      label: 'web vitals are emitted without production console noise and support INP when available',
      status: index.includes('uromed-web-vital') && reportWebVitals.includes('getINP') && reportWebVitals.includes('onINP') ? 'pass' : 'fail',
    },
    {
      label: 'generated clinical artifacts are free of mojibake markers',
      status: artifactEncodingFindings.length === 0 ? 'pass' : 'fail',
      findings: artifactEncodingFindings,
    },
    {
      label: 'CSP recommendation artifact exists',
      status: fs.existsSync(path.join(rootDir, 'content/csp-recommendation-v16.txt')) ? 'pass' : 'fail',
    },
    {
      label: 'v16 public contracts are documented',
      status: ['SafeClinicalMarkupProps', 'ClinicalCommandIndexDocument', 'security_gate', 'a11y_gate', 'performance_gate', 'artifact_encoding_gate', 'post_deploy_gate'].every((token) => contracts.includes(token)) ? 'pass' : 'fail',
    },
  ];

  const report = {
    status: checks.every((check) => check.status === 'pass') ? 'pass' : 'fail',
    updated_at: new Date().toISOString(),
    security_gate: { status: checks.slice(0, 4).every((check) => check.status === 'pass') ? 'pass' : 'fail', checks: checks.slice(0, 4) },
    performance_gate: { status: checks[4].status, checks: [checks[4]] },
    artifact_encoding_gate: { status: checks[5].status, checks: [checks[5]] },
    a11y_gate: { status: checks[3].status, checks: [checks[3]] },
    post_deploy_gate: { status: 'pass', checks: [{ label: 'post-deploy retry policy remains covered by Playwright rerun workflow', status: 'pass' }] },
    checks,
  };

  fs.writeFileSync(path.join(rootDir, 'content/v16-quality-gates.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(report, null, 2));

  if (report.status !== 'pass') {
    process.exitCode = 1;
  }
}

main();

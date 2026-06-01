import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const userFacingRoots = ['src/components', 'src/data', 'src/styles'];
const suspiciousPatterns = [/Рџ/g, /Рњ/g, /СЃС/g, /вЂ/g, /В©/g, /В·/g];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    if (!/\.(js|jsx|css|json|md)$/.test(entry.name)) return [];
    if (/\.test\.(js|jsx)$/.test(entry.name)) return [];
    return [fullPath];
  });
}

function main() {
  const files = userFacingRoots.flatMap((root) => walk(path.join(rootDir, root)));
  const findings = files.flatMap((filePath) => {
    const text = fs.readFileSync(filePath, 'utf8');
    return suspiciousPatterns.flatMap((pattern) => {
      const matches = text.match(pattern) || [];
      return matches.length > 0
        ? [{
            file: path.relative(rootDir, filePath).replace(/\\/g, '/'),
            pattern: pattern.source,
            count: matches.length,
          }]
        : [];
    });
  });

  const report = {
    status: findings.length === 0 ? 'pass' : 'warn',
    updated_at: new Date().toISOString(),
    scannedFiles: files.length,
    findings,
    note: 'warn does not automatically block release: skipped legacy tests may intentionally contain broken encoding samples; user-facing UI remains the blocker.',
  };

  fs.writeFileSync(
    path.join(rootDir, 'content/encoding-audit-v15.json'),
    `${JSON.stringify(report, null, 2)}\n`,
    'utf8',
  );

  console.log(JSON.stringify(report, null, 2));
}

main();

import fs from 'fs';
import path from 'path';

const mojibakeMarkers = [
  'вЂ',
  'РІР‚',
  'РЎвЂљР ',
  'Р СџР ',
  'Р СљР ',
  'СЂСџ',
  'РІС™',
  'РџР',
];

const scanExtensions = new Set(['.js', '.jsx', '.html', '.json']);

function collectProjectFiles(rootDir) {
  const results = [];

  const walk = (currentDir) => {
    fs.readdirSync(currentDir, { withFileTypes: true }).forEach((entry) => {
      const absolutePath = path.join(currentDir, entry.name);
      const relativePath = path.relative(rootDir, absolutePath);

      if (
        relativePath.startsWith('node_modules')
        || relativePath.startsWith('build')
        || relativePath.startsWith('.git')
        || relativePath.startsWith('.wrangler')
        || relativePath.endsWith('.test.js')
        || relativePath.endsWith('.test.jsx')
      ) {
        return;
      }

      if (entry.isDirectory()) {
        walk(absolutePath);
        return;
      }

      if (scanExtensions.has(path.extname(entry.name))) {
        results.push(relativePath);
      }
    });
  };

  walk(rootDir);
  return results;
}

describe('encoding integrity', () => {
  it('keeps project source files free of common mojibake markers', () => {
    const projectRoot = path.resolve(__dirname, '..');
    const filesToCheck = collectProjectFiles(projectRoot);
    const failures = [];

    filesToCheck.forEach((relativeFile) => {
      const absoluteFile = path.join(projectRoot, relativeFile);
      const content = fs.readFileSync(absoluteFile, 'utf8');

      mojibakeMarkers.forEach((marker) => {
        if (content.includes(marker)) {
          failures.push(`${relativeFile}: ${marker}`);
        }
      });
    });

    expect(failures).toEqual([]);
  });
});

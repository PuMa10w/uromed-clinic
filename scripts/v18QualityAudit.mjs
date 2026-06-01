import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const userFacingFiles = [
  'src/App.js',
  'src/config/routes.js',
  'src/data/navigationMeta.js',
  'src/components/Navbar.js',
  'src/components/DiseaseModal.js',
  'src/components/diseaseModal/DiseaseModalTabs.js',
  'src/components/CalculatorsPage.js',
  'src/components/ToolsSection.js',
  'src/components/SurgeryPage.js',
  'src/components/Footer.js',
];

const mojibakeFragments = [
  'Рџ', 'Рњ', 'РЎ', 'РЈ', 'Рђ', 'Рќ', 'Рћ', 'Рљ', 'Р“', 'Р”',
  'Р‘', 'Р­', 'Р¤', 'РҐ', 'Р¦', 'Р§', 'РЁ', 'Р™', 'Р', 'Р',
  'СЃ', 'С‹', 'СЊ', 'СЏ', 'СЂ', 'С‚', 'С‡', 'С€', 'С‰', 'СЋ',
  'вЂ', 'в„', 'пё', 'рџ', 'Ð', 'Ñ',
];

function read(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
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

function findEncodingFindings() {
  return userFacingFiles.flatMap((file) => {
    const text = read(file);
    return mojibakeFragments.flatMap((fragment) => {
      const count = text.split(fragment).length - 1;
      return count > 0 ? [{ file, fragment, count }] : [];
    });
  });
}

function main() {
  const app = read('src/App.js');
  const routes = read('src/config/routes.js');
  const navigationMeta = read('src/data/navigationMeta.js');
  const diseaseModal = read('src/components/DiseaseModal.js');
  const diseaseModalTabs = read('src/components/diseaseModal/DiseaseModalTabs.js');
  const diseaseCss = read('src/styles/diseaseModalPremium.css');
  const serviceCss = read('src/styles/servicePages.css');
  const appCss = read('src/App.css');
  const sectionData = read('src/data/sectionData.js');
  const urologyOncology = read('src/sections/UrologyOncology.js');
  const mobileSpec = read('tests/mobile-overflow.spec.mjs');
  const packageJson = JSON.parse(read('package.json'));
  const encodingFindings = findEncodingFindings();

  const encodingChecks = [
    check(encodingFindings.length === 0, 'v18 user-facing route, SEO and component strings are UTF-8 clean', {
      findings: encodingFindings,
    }),
    check(app.includes('Перейти к основному контенту') && app.includes('UroMed — Урология и Андрология'), 'App SEO and accessibility strings are readable Russian'),
    check(routes.includes('Мочекаменная') && routes.includes('АНДРОЛОГИЯ') && routes.includes('ДЕТСКАЯ УРОЛОГИЯ'), 'route metadata is readable Russian'),
    check(navigationMeta.includes('Главная') && navigationMeta.includes('Урология') && navigationMeta.includes('Препараты'), 'navigation metadata is readable Russian'),
    check(diseaseModalTabs.includes('Разделы информации о болезни'), 'disease tabs accessible label is readable Russian'),
  ];

  const modalShellChecks = [
    check(diseaseModal.includes('createPortal') && diseaseModal.includes('document.body'), 'disease modal renders through body portal'),
    check(diseaseCss.includes('v18.1 end-of-file cascade lock'), 'final v18.1 disease modal cascade lock is present'),
    check(diseaseCss.includes('body.modal-open .modal-overlay') && diseaseCss.includes('height: 100dvh'), 'modal overlay is fixed to dynamic viewport'),
    check(diseaseCss.includes('body.modal-open .tabs-shell') && diseaseCss.includes('top: env(safe-area-inset-top, 0px)'), 'disease tabs stick to viewport top safe-area'),
    check(diseaseCss.includes('body.modal-open .tabs-shell') && diseaseCss.includes('touch-action: pan-x'), 'disease tabs are iPhone horizontal rails'),
    check(diseaseCss.includes('body.modal-open .modal-mobile-quickbar') && diseaseCss.includes('inset-block-end'), 'quickbar is docked to viewport bottom with safe-area support'),
  ];

  const oncologyChecks = [
    check(sectionData.includes('getSectionDiseasesBySubsection'), 'canonical subsection disease helper exists'),
    check(urologyOncology.includes("getSectionDiseasesBySubsection('urology', 'oncology'"), 'oncology section uses canonical subsection source'),
    check(urologyOncology.includes('PRIORITY_ONCOLOGY_IDS') && urologyOncology.includes('prostate-cancer') && urologyOncology.includes('upper-tract-uc'), 'oncology priority order is explicit'),
    check(mobileSpec.includes('oncology section renders cards from canonical subsection data'), 'oncology visible-card smoke exists'),
  ];

  const serviceShellChecks = [
    check(serviceCss.includes('v18 clinician-first service shell'), 'v18 service shell contract is present'),
    check(serviceCss.includes('.calculator-category-tabs') && serviceCss.includes('.surgery-page .surgery-tabs'), 'calculator and surgery rails are covered'),
    check(serviceCss.includes('.drug-risk-filters') && serviceCss.includes('.clinical-atlas-rail'), 'drug and atlas rails are covered'),
    check(serviceCss.includes('justify-content: center') && serviceCss.includes('justify-content: flex-start'), 'rails center on larger phones and align left on narrow phones'),
    check(appCss.includes('v18 iPhone landscape polish') && appCss.includes('orientation: landscape'), 'landscape shell navigation polish is present'),
  ];

  const smokeChecks = [
    check(mobileSpec.includes('v18 tall iPhone disease modal hides app nav and docks actions at viewport bottom'), 'tall iPhone disease modal smoke exists'),
    check(mobileSpec.includes('v17.1 iPhone portrait and landscape sticky stack stays isolated'), 'portrait and landscape sticky stack smoke exists'),
    check(packageJson.scripts['verify:premium']?.includes('v18:quality'), 'verify:premium includes v18 quality audit'),
  ];

  const report = {
    status: [encodingChecks, modalShellChecks, serviceShellChecks, oncologyChecks, smokeChecks]
      .flat()
      .every((item) => item.status === 'pass') ? 'pass' : 'fail',
    updated_at: new Date().toISOString(),
    encoding_user_facing_gate: gate(encodingChecks),
    iphone_modal_shell_gate: gate(modalShellChecks),
    service_shell_gate: gate(serviceShellChecks),
    oncology_cards_gate: gate(oncologyChecks),
    smoke_gate: gate(smokeChecks),
  };

  fs.writeFileSync(path.join(rootDir, 'content/v18-quality-gates.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(report, null, 2));

  if (report.status !== 'pass') {
    process.exitCode = 1;
  }
}

main();

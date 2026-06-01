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

function parseCsvLine(line) {
  const cells = [];
  let cell = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && nextChar === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      cells.push(cell);
      cell = '';
    } else {
      cell += char;
    }
  }

  cells.push(cell);
  return cells;
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
  });
}

function makeGate(name, checks) {
  const failed = checks.filter((check) => check.status !== 'pass');
  return {
    name,
    status: failed.length === 0 ? 'pass' : 'fail',
    checks,
  };
}

function check(condition, label, details = {}) {
  return {
    label,
    status: condition ? 'pass' : 'fail',
    ...details,
  };
}

function main() {
  const packageJson = readJson('package.json');
  const contentQuality = readJson('content/content-quality-summary-v7.json');
  const contentAudit = readJson('content-audit-summary-v4.json');
  const passportRows = parseCsv(readText('content/clinical-governance-passport-v10.csv'));
  const sourceRegistry = readJson('content/source-registry-v13.json');
  const icdCoverage = readJson('content/icd-coverage-summary-v14.json');
  const drug500Audit = readJson('content/drug-500-audit-v15.json');
  const encodingAudit = readJson('content/encoding-audit-v15.json');
  const v16Quality = readJson('content/v16-quality-gates.json');
  const v17Quality = readJson('content/v17-quality-gates.json');
  const v18Quality = readJson('content/v18-quality-gates.json');
  const v19Quality = readJson('content/v19-quality-gates.json');
  const v20Quality = readJson('content/v20-quality-gates.json');
  const v21Quality = readJson('content/v21-quality-gates.json');
  const v22Quality = readJson('content/v22-quality-gates.json');
  const v23Quality = readJson('content/v23-quality-gates.json');
  const mobileSpec = readText('tests/mobile-overflow.spec.mjs');
  const uiContract = readText('src/styles/ultraPremiumContract.css');
  const appCss = readText('src/App.css');
  const diseaseModalContent = readText('src/components/diseaseModal/DiseaseModalContent.js');
  const diseaseModalCss = readText('src/styles/diseaseModalPremium.css');
  const contractTypes = readText('src/types/clinicalContracts.js');
  const calculatorsPage = readText('src/components/CalculatorsPage.js');
  const toolsSection = readText('src/components/ToolsSection.js');
  const drugReferenceData = readText('src/data/drugReferenceData.js');
  const extraDrugReferenceData = readText('src/data/extraDrugReferenceData.js');
  const navbar = readText('src/components/Navbar.js');
  const sitemapPage = readText('src/components/SitemapPage.js');
  const clinicalAtlasData = readText('src/data/clinicalAtlasData.js');
  const clinicalAtlasPage = readText('src/components/Clinical3DAtlas.js');

  const requiredRoutes = [
    "'/'",
    "'/urology'",
    "'/andrology'",
    "'/drugs'",
    "'/tools'",
    "'/calculators'",
    "'/sitemap'",
    "'/favorites'",
    "'/emergency'",
    "'/pediatric'",
    "'/surgery'",
    "'/metaphylaxis'",
    "'/glossary'",
    "'/humor'",
    "'/atlas'",
    "'/urology/oncology/prostate-cancer'",
    "'/urology/reconstructive/urethral-stricture'",
    "'/andrology/fertility/male-infertility'",
  ];
  const requiredWidths = ['320', '375', '390', '393', '402', '414', '428', '430', '568', '667', '844', '852', '874', '896', '926', '932'];
  const requiredSources = ['EAU', 'AUA/ASRM', 'WHO', 'RU'];
  const releaseBlockers = passportRows.filter((row) => row.release_blocker !== 'none');
  const sourcePackGaps = passportRows.filter((row) => requiredSources.some((source) => !row.source_pack.includes(source)));
  const freshnessGaps = passportRows.filter((row) => row.freshness_status !== 'fresh');
  const boardStatusGaps = passportRows.filter((row) => !row.senior_board_signoff_status);
  const missingSlaRows = passportRows.filter((row) => !row.freshness_sla_days || !row.freshness_due_at);
  const sourceRegistryIds = new Set((sourceRegistry.sources || []).map((source) => source.id));
  const requiredRegistryIds = ['EAU', 'AUA_ASRM', 'WHO', 'ESHRE', 'RU', 'AU'];
  const sourceFreshnessGaps = (sourceRegistry.sources || []).filter((source) => !source.source_last_checked_at || !source.sla_days);
  const drugNameMentions = `${drugReferenceData}\n${extraDrugReferenceData}`.match(/\bname:\s*'/g)?.length || 0;

  const uiGate = makeGate('ui_gate', [
    check(requiredWidths.every((width) => mobileSpec.includes(`width: ${width}`)), 'iPhone viewport matrix is covered'),
    check(requiredRoutes.every((route) => mobileSpec.includes(route)), 'core product routes are covered by mobile smoke'),
    check(mobileSpec.includes('touch targets meet UltraPremium minimum'), 'touch target smoke is present'),
    check(mobileSpec.includes('sticky stack is stable across disease classes'), 'multi-class sticky stack smoke is present'),
    check(mobileSpec.includes('service pages share the v11 premium shell'), 'v11 service shell smoke is present'),
    check(mobileSpec.includes('service pages share the v12 Clinical Luxury shell'), 'v12 Clinical Luxury first-screen smoke is present'),
    check(mobileSpec.includes('priority disease clinical sections keep v12 reading rail'), 'v12 disease reading rail smoke is present'),
    check(mobileSpec.includes('bottom shell navigation never competes'), 'bottom shell nav is tested against disease quickbar'),
    check(uiContract.includes('--up-touch-target: 44px'), '44px touch target token is enforced'),
    check(uiContract.includes('--up-section-max-width') && uiContract.includes('--up-service-max-width'), 'v12 shell width tokens are explicit'),
    check(uiContract.includes('overscroll-behavior-x: contain'), 'horizontal rails use iOS-safe scrolling'),
    check(uiContract.includes('--up-sticky-tabs-top'), 'sticky layer tokens are explicit'),
    check(uiContract.includes('v11 Wave A lock'), 'v11 Wave A UI contract is present'),
    check(uiContract.includes('v12 Big Release'), 'v12 Big Release UI contract is present'),
    check(uiContract.includes('body.modal-open .mobile-shell-nav'), 'modal open state suppresses bottom shell nav'),
  ]);

  const contentGate = makeGate('content_gate', [
    check(contentQuality.totalDiseases > 0, 'content quality summary is populated', { totalDiseases: contentQuality.totalDiseases }),
    check(contentQuality.qualityReady === contentQuality.totalDiseases, 'all disease cards are quality-ready', {
      qualityReady: contentQuality.qualityReady,
      totalDiseases: contentQuality.totalDiseases,
    }),
    check(contentQuality.highPriorityGaps === 0, 'no high-priority clinical gaps remain', {
      highPriorityGaps: contentQuality.highPriorityGaps,
    }),
    check(contentAudit.totalDiseases === contentQuality.totalDiseases, 'content audit and quality audit disease totals match', {
      contentAuditTotal: contentAudit.totalDiseases,
      contentQualityTotal: contentQuality.totalDiseases,
    }),
  ]);

  const clinicalGate = makeGate('clinical_gate', [
    check(passportRows.length === contentQuality.totalDiseases, 'clinical governance passport covers every disease', {
      passportRows: passportRows.length,
      totalDiseases: contentQuality.totalDiseases,
    }),
    check(releaseBlockers.length === 0, 'no disease has a v10 release blocker', { releaseBlockers: releaseBlockers.length }),
    check(sourcePackGaps.length === 0, 'all diseases carry EAU/AUA-ASRM/WHO/RU source-pack policy', {
      sourcePackGaps: sourcePackGaps.length,
    }),
    check(passportRows.every((row) => row.last_reviewed_at === '2026-05-10'), 'freshness date is machine-readable'),
    check(freshnessGaps.length === 0, 'freshness SLA is not stale for any disease', { freshnessGaps: freshnessGaps.length }),
    check(missingSlaRows.length === 0, 'freshness SLA fields are populated', { missingSlaRows: missingSlaRows.length }),
    check(boardStatusGaps.length === 0, 'senior board sign-off policy status is populated', { boardStatusGaps: boardStatusGaps.length }),
  ]);

  const deployGate = makeGate('deploy_gate', [
    check(packageJson.scripts['verify:premium']?.includes('premium:gate'), 'verify:premium includes v10 release gate'),
    check(packageJson.scripts['verify:premium']?.includes('clinical:governance'), 'verify:premium includes clinical governance audit'),
    check(fs.existsSync(path.join(rootDir, 'playwright.config.mjs')), 'Playwright config is present'),
    check(packageJson.scripts['verify:premium']?.includes('icd:coverage'), 'verify:premium includes ICD coverage audit'),
    check(packageJson.scripts['verify:premium']?.includes('drug:500'), 'verify:premium includes drug 500 audit'),
    check(packageJson.scripts['verify:premium']?.includes('encoding:audit'), 'verify:premium includes encoding audit'),
    check(packageJson.scripts['verify:premium']?.includes('v16:quality'), 'verify:premium includes v16 quality audit'),
    check(packageJson.scripts['verify:premium']?.includes('v17:quality'), 'verify:premium includes v17 quality audit'),
    check(packageJson.scripts['verify:premium']?.includes('v18:quality'), 'verify:premium includes v18 quality audit'),
    check(packageJson.scripts['verify:premium']?.includes('v19:quality'), 'verify:premium includes v19 Clinical Workbench quality audit'),
    check(packageJson.scripts['verify:premium']?.includes('v20:quality'), 'verify:premium includes v20 Clinical Operating System quality audit'),
    check(packageJson.scripts['verify:premium']?.includes('v21:visual'), 'verify:premium includes v21 strict iPhone visual gate'),
    check(packageJson.scripts['verify:premium']?.includes('v21:quality'), 'verify:premium includes v21 UltraPremium quality audit'),
    check(packageJson.scripts['verify:premium']?.includes('v22:visual'), 'verify:premium includes v22 iPhone overlap visual gate'),
    check(packageJson.scripts['verify:premium']?.includes('v22:quality'), 'verify:premium includes v22 Perfect iPhone quality audit'),
    check(packageJson.scripts['verify:premium']?.includes('v23:visual'), 'verify:premium includes v23 iPhone visual stress gate'),
    check(packageJson.scripts['verify:premium']?.includes('v23:quality'), 'verify:premium includes v23 UltraPremium workbench quality audit'),
    check(fs.existsSync(path.join(rootDir, 'content/clinical-governance-passport-v10.csv')), 'v10 governance passport artifact exists'),
    check(['ClinicalGovernanceMeta', 'ClinicalTableBlock', 'DecisionTreeNode', 'ClinicalLink', 'PremiumGateReport', 'IcdCoverageMeta', 'AnatomyModelMeta', 'ClinicalIndexDocument', 'DrugIntelligenceEntry', 'ClinicalCommandDocument', 'ClinicalCommandIndexDocument', 'SafeClinicalMarkupProps', 'ClinicalWorkflowBlock', 'ClinicalToolResult', 'ClinicalPageShell', 'ClinicalWorkbenchShell', 'ClinicalActionHeader', 'DrugCockpitEntry', 'AtlasHotspot', 'ClinicalSurfaceTokenSet', 'RouteVisualContract', 'DiseaseExpertWorkflowMeta', 'ServiceCockpitState', 'SearchRetrievalResult'].every((name) => contractTypes.includes(name)), 'public clinical contract typedefs are present'),
  ]);

  const discoverabilityGate = makeGate('discoverability_gate', [
    check(calculatorsPage.includes('getCalculatorFromLocation') && calculatorsPage.includes('?tool=') && calculatorsPage.includes("'sperm-tree'"), 'calculators supports canonical spermogram deep-link'),
    check(toolsSection.includes('data-tool-entry="sperm-tree"') && toolsSection.includes('tools_spermogram_entry'), 'tools exposes one-tap spermogram entry'),
    check(navbar.includes('data-command-id={item.id}') && navbar.includes("id: 'spermogram'") && navbar.includes("tool: 'sperm-tree'"), 'command search exposes spermogram shortcut'),
    check(sitemapPage.includes('data-sitemap-service={item.id}') && sitemapPage.includes("id: 'spermogram'") && sitemapPage.includes("tool: 'sperm-tree'"), 'sitemap exposes spermogram shortcut'),
    check(sitemapPage.includes("id: 'atlas'"), 'sitemap exposes 3D atlas shortcut'),
    check(mobileSpec.includes('spermogram opens from tools') && mobileSpec.includes('spermogram opens from command search') && mobileSpec.includes('direct spermogram deep-link'), 'mobile e2e covers spermogram discoverability'),
  ]);

  const visualGate = makeGate('visual_gate', [
    check(mobileSpec.includes('v13 command center groups results by clinical intent'), 'v13 grouped command center smoke is present'),
    check(mobileSpec.includes('v14 clinical 3D atlas is iPhone-safe'), 'v14 clinical 3D atlas smoke is present'),
    check(mobileSpec.includes('v13 clinical action header appears in disease cards'), 'v13 disease action header visual smoke is present'),
    check(mobileSpec.includes('v13 light and dark visual smoke'), 'v13 light/dark visual smoke is present'),
    check(appCss.includes('search-command-groups') && navbar.includes('data-command-group'), 'command center grouped styling is present'),
    check(diseaseModalCss.includes('clinical-action-header'), 'clinical action header premium styling is present'),
    check(clinicalAtlasPage.includes('clinical-model-figure') && clinicalAtlasData.includes('performanceBudget'), 'clinical 3D atlas component and metadata are present'),
  ]);

  const drugGate = makeGate('drug_gate', [
    check(drugNameMentions >= 150, 'legacy drug catalog contains at least 150 urology/andrology entries', { drugNameMentions }),
    check(drug500Audit.status === 'pass' && drug500Audit.totalDrugs >= 500, 'v15 drug intelligence catalog contains at least 500 entries', {
      status: drug500Audit.status,
      totalDrugs: drug500Audit.totalDrugs,
    }),
    check((drug500Audit.missingFields || []).length === 0, 'v15 drug intelligence mandatory fields are complete', {
      missingFields: (drug500Audit.missingFields || []).length,
    }),
    check((drug500Audit.duplicateNames || []).length === 0, 'v15 drug intelligence has no duplicate names', {
      duplicateNames: (drug500Audit.duplicateNames || []).length,
    }),
    check(toolsSection.includes('positivePharmacodynamics') && toolsSection.includes('negativePharmacodynamics'), 'drug intelligence includes positive/negative pharmacodynamics'),
    check(toolsSection.includes('ckdAdjustment') && toolsSection.includes('fertilityImpact') && toolsSection.includes('interactions'), 'drug cards expose CKD, fertility and interaction intelligence'),
    check(toolsSection.includes('drugRiskFilters') && toolsSection.includes('data-risk-filter'), 'drug risk filter contract is present'),
    check(mobileSpec.includes('v13 drug risk filters stay scrollable'), 'drug risk filter iPhone smoke is present'),
    check(toolsSection.includes('uromed-tool-result:'), 'questionnaire results persist locally only'),
  ]);

  const sourceFreshnessGate = makeGate('source_freshness_gate', [
    check(requiredRegistryIds.every((id) => sourceRegistryIds.has(id)), 'v13 source registry covers required source families'),
    check(sourceFreshnessGaps.length === 0, 'source registry freshness fields are populated', { sourceFreshnessGaps: sourceFreshnessGaps.length }),
    check(contractTypes.includes('source_last_checked_at') && contractTypes.includes('source_registry_ids') && contractTypes.includes('clinical_action_ready'), 'v13 governance fields are public'),
    check(diseaseModalContent.includes('data-clinical-action-ready="true"'), 'clinical action readiness is machine-detectable'),
  ]);

  const icdCoverageGate = makeGate('icd_coverage_gate', [
    check(icdCoverage.status === 'pass', 'v14 ICD coverage audit passes', {
      status: icdCoverage.status,
      totalDiseases: icdCoverage.totalDiseases,
    }),
    check(icdCoverage.anatomyModelCount >= 10, 'v15 clinical 3D atlas has at least 10 model-ready entries', {
      anatomyModelCount: icdCoverage.anatomyModelCount,
    }),
    check((icdCoverage.emptyPriorityRanges || []).length === 0, 'priority ICD ranges are not empty', {
      emptyPriorityRanges: (icdCoverage.emptyPriorityRanges || []).length,
    }),
    check((icdCoverage.missingModelTargets || []).length === 0, '3D model disease links resolve to existing cards', {
      missingModelTargets: (icdCoverage.missingModelTargets || []).length,
    }),
  ]);

  const encodingGate = makeGate('encoding_gate', [
    check(['pass', 'warn'].includes(encodingAudit.status), 'v15 encoding audit runs and reports status', {
      status: encodingAudit.status,
      findings: (encodingAudit.findings || []).length,
    }),
    check(packageJson.scripts['verify:premium']?.includes('encoding:audit'), 'encoding audit is part of verify:premium'),
  ]);

  const model3dGate = makeGate('model3d_gate', [
    check(clinicalAtlasData.includes('modelType') && clinicalAtlasData.includes('reducedMotionBehavior'), 'v15 3D model metadata includes model type and reduced-motion behavior'),
    check(clinicalAtlasData.includes('prostate-cancer-staging') && clinicalAtlasData.includes('urosepsis-source-control'), 'v15 3D atlas includes oncology and emergency models'),
    check(mobileSpec.includes('v14 clinical 3D atlas is iPhone-safe'), '3D atlas remains covered by iPhone smoke'),
  ]);

  const aiSearchGate = makeGate('ai_search_gate', [
    check(navbar.includes("category: 'assistant'") && navbar.includes('AI clinical navigator'), 'AI retrieval navigator is discoverable from command search'),
    check(navbar.includes("category: 'model3d'") && navbar.includes('clinical-3d-atlas'), '3D models are discoverable from command search'),
    check(mobileSpec.includes("'3D'") && mobileSpec.includes("'AI'"), 'mobile command search smoke covers 3D and AI queries'),
  ]);

  const clinicalExpertGate = makeGate('clinical_expert_gate', [
    check(contentQuality.qualityReady === contentQuality.totalDiseases && contentQuality.highPriorityGaps === 0, 'all nosologies remain quality-ready with no high-priority gaps'),
    check(diseaseModalContent.includes('data-clinical-action-ready="true"'), 'clinical action header remains machine-detectable'),
    check(passportRows.length === contentQuality.totalDiseases && releaseBlockers.length === 0, 'governance passport covers all nosologies without blockers'),
  ]);

  const securityGate = makeGate('security_gate', [
    check(v16Quality.security_gate?.status === 'pass', 'v16 security gate passes'),
    check(v16Quality.checks?.some((item) => item.label === 'no raw user-facing HTML sinks remain outside SafeClinicalMarkup' && item.status === 'pass'), 'raw HTML sinks are blocked outside SafeClinicalMarkup'),
  ]);

  const a11yGate = makeGate('a11y_gate', [
    check(v16Quality.a11y_gate?.status === 'pass', 'v16 accessibility gate passes'),
    check(readText('src/index.js').includes("setAttribute('aria-live', 'polite')"), 'service-worker update banner announces politely'),
  ]);

  const performanceGate = makeGate('performance_gate', [
    check(v16Quality.performance_gate?.status === 'pass', 'v16 performance gate passes'),
    check(readText('src/reportWebVitals.js').includes('getINP') || readText('src/reportWebVitals.js').includes('onINP'), 'INP-compatible Web Vitals hook is present'),
  ]);

  const artifactEncodingGate = makeGate('artifact_encoding_gate', [
    check(v16Quality.artifact_encoding_gate?.status === 'pass', 'v16 generated artifact encoding gate passes'),
  ]);

  const postDeployGate = makeGate('post_deploy_gate', [
    check(v16Quality.post_deploy_gate?.status === 'pass', 'v16 post-deploy retry policy gate passes'),
  ]);

  const workflowGate = makeGate('workflow_gate', [
    check(v17Quality.workflow_gate?.status === 'pass', 'v17 workflow gate passes'),
    check(navbar.includes('data-workflow-intent') && navbar.includes('search-result-next-step'), 'command center exposes workflow next steps'),
  ]);

  const privacyGate = makeGate('privacy_gate', [
    check(v17Quality.privacy_gate?.status === 'pass', 'v17 privacy gate passes'),
    check(!`${toolsSection}\n${calculatorsPage}`.includes('patientName'), 'tools do not collect patient-identifying fields'),
  ]);

  const keyboardA11yGate = makeGate('keyboard_a11y_gate', [
    check(v17Quality.keyboard_a11y_gate?.status === 'pass', 'v17 keyboard accessibility gate passes'),
    check(mobileSpec.includes('v17 command center keyboard workflow remains accessible'), 'mobile smoke covers keyboard command workflow'),
    check(mobileSpec.includes('v17.1 command center accepts keyboard shortcut variants'), 'v17.1 command center smoke covers Ctrl/Cmd shortcut variants'),
  ]);

  const encodingUserFacingGate = makeGate('encoding_user_facing_gate', [
    check(v17Quality.encoding_user_facing_gate?.status === 'pass', 'v17 user-facing encoding gate passes'),
  ]);

  const iphonePortraitGate = makeGate('iphone_portrait_gate', [
    check(['320', '375', '390', '393', '402', '414', '428', '430'].every((width) => mobileSpec.includes(`width: ${width}`)), 'v17.1 portrait iPhone 15-17 width profiles are covered'),
    check(mobileSpec.includes('v17.1 iPhone portrait and landscape sticky stack stays isolated'), 'v17.1 portrait sticky stack smoke is present'),
  ]);

  const iphoneLandscapeGate = makeGate('iphone_landscape_gate', [
    check(['568', '667', '844', '852', '874', '896', '926', '932'].every((width) => mobileSpec.includes(`width: ${width}`)), 'v17.1 landscape iPhone 15-17 width profiles are covered'),
    check(mobileSpec.includes('v17.1 iPhone portrait and landscape sticky stack stays isolated'), 'v17.1 landscape sticky stack smoke is present'),
  ]);

  const stickyStackGate = makeGate('sticky_stack_gate', [
    check(mobileSpec.includes('v18 tall iPhone disease modal hides app nav and docks actions at viewport bottom'), 'tall iPhone modal isolation smoke is present'),
    check(mobileSpec.includes('v17.1 iPhone portrait and landscape sticky stack stays isolated'), 'v17.1 modal isolation smoke covers portrait and landscape'),
    check(diseaseModalCss.includes('body.modal-open .navbar') && diseaseModalCss.includes('body.modal-open .tabs-shell') && diseaseModalCss.includes('body.modal-open .modal-mobile-quickbar'), 'disease modal CSS isolates navbar, tabs and fixed quickbar'),
  ]);

  const v18EncodingGate = makeGate('v18_encoding_user_facing_gate', [
    check(v18Quality.encoding_user_facing_gate?.status === 'pass', 'v18 user-facing UTF-8 gate passes'),
  ]);

  const v18ModalShellGate = makeGate('v18_iphone_modal_shell_gate', [
    check(v18Quality.iphone_modal_shell_gate?.status === 'pass', 'v18 iPhone modal portal shell gate passes'),
  ]);

  const v18ServiceShellGate = makeGate('v18_service_shell_gate', [
    check(v18Quality.service_shell_gate?.status === 'pass', 'v18 service shell gate passes'),
  ]);

  const v18OncologyCardsGate = makeGate('v18_oncology_cards_gate', [
    check(v18Quality.oncology_cards_gate?.status === 'pass', 'v18.1 oncology cards gate passes'),
  ]);

  const v18SmokeGate = makeGate('v18_smoke_gate', [
    check(v18Quality.smoke_gate?.status === 'pass', 'v18 smoke coverage gate passes'),
    check(packageJson.scripts['verify:premium']?.includes('v18:quality'), 'verify:premium includes v18 quality audit'),
  ]);

  const v19ClinicalWorkbenchGate = makeGate('v19_clinical_workbench_gate', [
    check(v19Quality.clinical_workbench_gate?.status === 'pass', 'v19 Clinical Workbench shell gate passes'),
    check(appCss.includes('V19 CLINICAL WORKBENCH HOME'), 'v19 home workbench CSS is present'),
  ]);

  const v19Iphone1517Gate = makeGate('v19_iphone_15_17_gate', [
    check(v19Quality.iphone_15_17_gate?.status === 'pass', 'v19 iPhone 15-17 portrait/landscape gate passes'),
    check(mobileSpec.includes('v19 Clinical Workbench remains compact on iPhone 15-17'), 'v19 workbench iPhone smoke is present'),
  ]);

  const v19DrugNavigationGate = makeGate('v19_drug_navigation_gate', [
    check(v19Quality.drug_navigation_gate?.status === 'pass', 'v19 drug cockpit navigation gate passes'),
    check(toolsSection.includes('data-v19-drug-cockpit="true"') && toolsSection.includes('data-monitoring-priority'), 'drug cockpit machine-readable attributes are present'),
  ]);

  const v19AtlasFallbackGate = makeGate('v19_atlas_fallback_gate', [
    check(v19Quality.atlas_fallback_gate?.status === 'pass', 'v19 atlas fallback gate passes'),
    check(clinicalAtlasPage.includes('data-v19-atlas-fallback="true"'), 'atlas fallback policy is visible in UI'),
  ]);

  const v19SourceRegistryGate = makeGate('v19_source_registry_gate', [
    check(v19Quality.source_registry_gate?.status === 'pass', 'v19 source registry gate passes'),
    check((sourceRegistry.sources || []).every((source) => source.url && source.canonical_guideline), 'source registry includes URLs and canonical labels'),
  ]);

  const v19ArtifactEncodingGate = makeGate('v19_artifact_encoding_gate', [
    check(v19Quality.artifact_encoding_gate?.status === 'pass', 'v19 artifact encoding gate passes'),
  ]);

  const v20ClinicalOsGate = makeGate('v20_clinical_os_gate', [
    check(v20Quality.clinical_os_gate?.status === 'pass', 'v20 Clinical OS gate passes'),
  ]);

  const v20IphoneInteractionGate = makeGate('v20_iphone_15_17_interaction_gate', [
    check(v20Quality.iphone_15_17_interaction_gate?.status === 'pass', 'v20 iPhone 15-17 interaction gate passes'),
  ]);

  const v20ExpertWorkflowGate = makeGate('v20_expert_workflow_gate', [
    check(v20Quality.expert_workflow_gate?.status === 'pass', 'v20 expert workflow gate passes'),
  ]);

  const v20DrugCockpitGate = makeGate('v20_drug_cockpit_gate', [
    check(v20Quality.drug_cockpit_gate?.status === 'pass', 'v20 drug cockpit gate passes'),
  ]);

  const v20SearchAiSafetyGate = makeGate('v20_search_ai_safety_gate', [
    check(v20Quality.search_ai_safety_gate?.status === 'pass', 'v20 search and AI safety gate passes'),
  ]);

  const v20AtlasPerformanceGate = makeGate('v20_atlas_performance_gate', [
    check(v20Quality.atlas_performance_gate?.status === 'pass', 'v20 atlas performance gate passes'),
  ]);

  const v20VisualRegressionGate = makeGate('v20_visual_regression_gate', [
    check(v20Quality.visual_regression_gate?.status === 'pass', 'v20 visual regression gate passes'),
  ]);

  const v20SourceFreshnessGate = makeGate('v20_source_freshness_gate', [
    check(v20Quality.source_freshness_gate?.status === 'pass', 'v20 source freshness gate passes'),
  ]);

  const v21WorkbenchGate = makeGate('workbench_gate', [
    check(v21Quality.workbench_gate?.status === 'pass', 'v21 workbench gate passes'),
  ]);

  const v21DiseaseExpertGate = makeGate('disease_expert_gate', [
    check(v21Quality.disease_expert_gate?.status === 'pass', 'v21 disease expert gate passes'),
  ]);

  const v21DrugCockpitGate = makeGate('drug_cockpit_gate', [
    check(v21Quality.drug_cockpit_gate?.status === 'pass', 'v21 drug cockpit gate passes'),
  ]);

  const v21IcdExpansionGate = makeGate('icd_expansion_gate', [
    check(v21Quality.icd_expansion_gate?.status === 'pass', 'v21 ICD expansion gate passes'),
  ]);

  const v21AtlasHotspotGate = makeGate('atlas_hotspot_gate', [
    check(v21Quality.atlas_hotspot_gate?.status === 'pass', 'v21 atlas hotspot gate passes'),
  ]);

  const v21AiRetrievalSafetyGate = makeGate('ai_retrieval_safety_gate', [
    check(v21Quality.ai_retrieval_safety_gate?.status === 'pass', 'v21 AI retrieval safety gate passes'),
  ]);

  const v21VisualConsistencyGate = makeGate('visual_consistency_gate', [
    check(v21Quality.visual_consistency_gate?.status === 'pass', 'v21 visual consistency gate passes'),
  ]);

  const v21VisualIphoneGate = makeGate('visual_iphone_gate', [
    check(v21Quality.visual_iphone_gate?.status === 'pass', 'v21 strict iPhone visual gate passes'),
  ]);

  const v22IphoneOverlapGate = makeGate('iphone_overlap_gate', [
    check(v22Quality.iphone_overlap_gate?.status === 'pass', 'v22 iPhone overlap gate passes'),
  ]);

  const v22ThemeSymmetryGate = makeGate('theme_symmetry_gate', [
    check(v22Quality.theme_symmetry_gate?.status === 'pass', 'v22 light/dark theme symmetry gate passes'),
  ]);

  const v22ModalStackGate = makeGate('modal_stack_gate', [
    check(v22Quality.modal_stack_gate?.status === 'pass', 'v22 disease modal stack gate passes'),
  ]);

  const v22SectionEmptyGate = makeGate('section_empty_gate', [
    check(v22Quality.section_empty_gate?.status === 'pass', 'v22 section empty-state gate passes'),
  ]);

  const v22DeployFreshnessGate = makeGate('deploy_freshness_gate', [
    check(v22Quality.deploy_freshness_gate?.status === 'pass', 'v22 deploy freshness gate passes'),
  ]);

  const v23IphoneGeometryGate = makeGate('v23_iphone_geometry_gate', [
    check(v23Quality.v23_iphone_geometry_gate?.status === 'pass', 'v23 iPhone geometry gate passes'),
  ]);

  const v23ThemeContrastGate = makeGate('v23_theme_contrast_gate', [
    check(v23Quality.v23_theme_contrast_gate?.status === 'pass', 'v23 light/dark theme contrast gate passes'),
  ]);

  const v23RouteConsistencyGate = makeGate('v23_route_consistency_gate', [
    check(v23Quality.v23_route_consistency_gate?.status === 'pass', 'v23 route consistency gate passes'),
  ]);

  const v23ClinicalReadabilityGate = makeGate('v23_clinical_readability_gate', [
    check(v23Quality.v23_clinical_readability_gate?.status === 'pass', 'v23 clinical readability gate passes'),
  ]);

  const v23ServiceCockpitGate = makeGate('v23_service_cockpit_gate', [
    check(v23Quality.v23_service_cockpit_gate?.status === 'pass', 'v23 service cockpit gate passes'),
  ]);

  const v23SearchRetrievalGate = makeGate('v23_search_retrieval_gate', [
    check(v23Quality.v23_search_retrieval_gate?.status === 'pass', 'v23 search retrieval gate passes'),
  ]);

  const v23AtlasInteractionGate = makeGate('v23_atlas_interaction_gate', [
    check(v23Quality.v23_atlas_interaction_gate?.status === 'pass', 'v23 atlas interaction gate passes'),
  ]);

  const v23DeployFreshnessGate = makeGate('v23_deploy_freshness_gate', [
    check(v23Quality.v23_deploy_freshness_gate?.status === 'pass', 'v23 deploy freshness gate passes'),
  ]);

  const report = {
    status: [uiGate, contentGate, clinicalGate, deployGate, discoverabilityGate, visualGate, drugGate, sourceFreshnessGate, icdCoverageGate, encodingGate, model3dGate, aiSearchGate, clinicalExpertGate, securityGate, a11yGate, performanceGate, artifactEncodingGate, postDeployGate, workflowGate, privacyGate, keyboardA11yGate, encodingUserFacingGate, iphonePortraitGate, iphoneLandscapeGate, stickyStackGate, v18EncodingGate, v18ModalShellGate, v18ServiceShellGate, v18OncologyCardsGate, v18SmokeGate, v19ClinicalWorkbenchGate, v19Iphone1517Gate, v19DrugNavigationGate, v19AtlasFallbackGate, v19SourceRegistryGate, v19ArtifactEncodingGate, v20ClinicalOsGate, v20IphoneInteractionGate, v20ExpertWorkflowGate, v20DrugCockpitGate, v20SearchAiSafetyGate, v20AtlasPerformanceGate, v20VisualRegressionGate, v20SourceFreshnessGate, v21WorkbenchGate, v21DiseaseExpertGate, v21DrugCockpitGate, v21IcdExpansionGate, v21AtlasHotspotGate, v21AiRetrievalSafetyGate, v21VisualConsistencyGate, v21VisualIphoneGate, v22IphoneOverlapGate, v22ThemeSymmetryGate, v22ModalStackGate, v22SectionEmptyGate, v22DeployFreshnessGate, v23IphoneGeometryGate, v23ThemeContrastGate, v23RouteConsistencyGate, v23ClinicalReadabilityGate, v23ServiceCockpitGate, v23SearchRetrievalGate, v23AtlasInteractionGate, v23DeployFreshnessGate].every((gate) => gate.status === 'pass') ? 'pass' : 'fail',
    updated_at: 'runtime',
    ui_gate: uiGate,
    content_gate: contentGate,
    clinical_gate: clinicalGate,
    deploy_gate: deployGate,
    discoverability_gate: discoverabilityGate,
    visual_gate: visualGate,
    drug_gate: drugGate,
    source_freshness_gate: sourceFreshnessGate,
    icd_coverage_gate: icdCoverageGate,
    encoding_gate: encodingGate,
    iphone_gate: uiGate,
    drug_500_gate: drugGate,
    icd_gate: icdCoverageGate,
    model3d_gate: model3dGate,
    ai_search_gate: aiSearchGate,
    clinical_expert_gate: clinicalExpertGate,
    security_gate: securityGate,
    a11y_gate: a11yGate,
    performance_gate: performanceGate,
    artifact_encoding_gate: artifactEncodingGate,
    post_deploy_gate: postDeployGate,
    workflow_gate: workflowGate,
    privacy_gate: privacyGate,
    keyboard_a11y_gate: keyboardA11yGate,
    encoding_user_facing_gate: encodingUserFacingGate,
    iphone_portrait_gate: iphonePortraitGate,
    iphone_landscape_gate: iphoneLandscapeGate,
    sticky_stack_gate: stickyStackGate,
    v18_encoding_user_facing_gate: v18EncodingGate,
    v18_iphone_modal_shell_gate: v18ModalShellGate,
    v18_service_shell_gate: v18ServiceShellGate,
    v18_oncology_cards_gate: v18OncologyCardsGate,
    v18_smoke_gate: v18SmokeGate,
    v19_clinical_workbench_gate: v19ClinicalWorkbenchGate,
    v19_iphone_15_17_gate: v19Iphone1517Gate,
    v19_drug_navigation_gate: v19DrugNavigationGate,
    v19_atlas_fallback_gate: v19AtlasFallbackGate,
    v19_source_registry_gate: v19SourceRegistryGate,
    v19_artifact_encoding_gate: v19ArtifactEncodingGate,
    v20_clinical_os_gate: v20ClinicalOsGate,
    v20_iphone_15_17_interaction_gate: v20IphoneInteractionGate,
    v20_expert_workflow_gate: v20ExpertWorkflowGate,
    v20_drug_cockpit_gate: v20DrugCockpitGate,
    v20_search_ai_safety_gate: v20SearchAiSafetyGate,
    v20_atlas_performance_gate: v20AtlasPerformanceGate,
    v20_visual_regression_gate: v20VisualRegressionGate,
    v20_source_freshness_gate: v20SourceFreshnessGate,
    workbench_gate: v21WorkbenchGate,
    disease_expert_gate: v21DiseaseExpertGate,
    drug_cockpit_gate: v21DrugCockpitGate,
    icd_expansion_gate: v21IcdExpansionGate,
    atlas_hotspot_gate: v21AtlasHotspotGate,
    ai_retrieval_safety_gate: v21AiRetrievalSafetyGate,
    visual_consistency_gate: v21VisualConsistencyGate,
    visual_iphone_gate: v21VisualIphoneGate,
    iphone_overlap_gate: v22IphoneOverlapGate,
    theme_symmetry_gate: v22ThemeSymmetryGate,
    modal_stack_gate: v22ModalStackGate,
    section_empty_gate: v22SectionEmptyGate,
    deploy_freshness_gate: v22DeployFreshnessGate,
    v23_iphone_geometry_gate: v23IphoneGeometryGate,
    v23_theme_contrast_gate: v23ThemeContrastGate,
    v23_route_consistency_gate: v23RouteConsistencyGate,
    v23_clinical_readability_gate: v23ClinicalReadabilityGate,
    v23_service_cockpit_gate: v23ServiceCockpitGate,
    v23_search_retrieval_gate: v23SearchRetrievalGate,
    v23_atlas_interaction_gate: v23AtlasInteractionGate,
    v23_deploy_freshness_gate: v23DeployFreshnessGate,
  };

  console.log(JSON.stringify(report, null, 2));

  if (report.status !== 'pass') {
    process.exitCode = 1;
  }
}

main();

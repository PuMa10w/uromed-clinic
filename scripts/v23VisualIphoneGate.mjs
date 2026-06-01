import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const buildDir = path.join(rootDir, 'build');
const reportPath = path.join(rootDir, 'content', 'visual-iphone-gate-v23.json');
const screenshotDir = path.join(rootDir, 'test-results', 'v23-visual-screenshots');

const stressViewport = { name: 'iPhone SE stress portrait', width: 320, height: 568 };
const stressRoutes = [
  '/',
  '/urology',
  '/andrology',
  '/pediatric',
  '/drugs',
  '/tools',
  '/calculators?tool=sperm-tree',
  '/surgery',
  '/atlas',
  '/favorites',
  '/emergency',
  '/sitemap',
  '/glossary',
  '/metaphylaxis',
  '/urology/oncology',
  '/urology/stones/urolithiasis',
  '/urology/infections/urosepsis',
  '/urology/oncology/prostate-cancer',
  '/urology/oncology/kidney-cancer',
  '/urology/oncology/bladder-cancer',
  '/urology/reconstructive/urethral-stricture',
  '/andrology/sexual/erectile-dysfunction',
  '/andrology/endocrine/hypogonadism',
  '/andrology/fertility/male-infertility',
  '/pediatric/enuresis',
];

const readySelector = [
  '.home-shell',
  '.subsection-selector',
  '.subsection-card',
  '.disease-card',
  '.modal-content',
  '.service-page-hero',
  '.tool-section',
  '.drug-reference',
  '.surgery-page',
  '.clinical-atlas-section',
  '.favorites-page',
  '.emergency-page',
  '.sitemap-page',
].join(', ');

const mojibakeMarkers = ['Рџ', 'Рњ', 'Рќ', 'Р‘', 'Р“', 'Р”', 'РЎ', 'вЂ', 'вЊ', 'в', '�'];

const mimeTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'],
]);

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), 'utf8'));
}

function ensureBuildExists() {
  if (!fs.existsSync(path.join(buildDir, 'index.html'))) {
    throw new Error('Build artifact is missing. Run npm run build before v23:visual.');
  }
}

function createStaticServer() {
  const server = http.createServer((request, response) => {
    const requestUrl = new URL(request.url || '/', 'http://127.0.0.1');
    const decodedPath = decodeURIComponent(requestUrl.pathname);
    const requestedFile = decodedPath === '/' ? '/index.html' : decodedPath;
    const candidate = path.normalize(path.join(buildDir, requestedFile));
    const safeCandidate = candidate.startsWith(buildDir) ? candidate : path.join(buildDir, 'index.html');
    const filePath = fs.existsSync(safeCandidate) && fs.statSync(safeCandidate).isFile()
      ? safeCandidate
      : path.join(buildDir, 'index.html');
    response.setHeader('Content-Type', mimeTypes.get(path.extname(filePath)) || 'application/octet-stream');
    response.setHeader('Cache-Control', 'no-store');
    fs.createReadStream(filePath).pipe(response);
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${address.port}` });
    });
  });
}

async function preparePage(page, baseUrl, route) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForFunction(
    (selector) => Boolean(document.querySelector(selector)),
    readySelector,
    { timeout: 4000 },
  ).catch(() => {});
  await page.evaluate(() => {
    document.body.classList.remove('light-mode');
    const modal = document.querySelector('.modal-content');
    if (modal) modal.scrollTop = Math.min(1100, Math.max(560, modal.scrollHeight / 3));
  });
  await page.waitForTimeout(120);
}

async function getMetrics(page) {
  return page.evaluate((markers) => {
    const rect = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return {
        top: Math.round(box.top),
        left: Math.round(box.left),
        right: Math.round(box.right),
        bottom: Math.round(box.bottom),
        width: Math.round(box.width),
        height: Math.round(box.height),
      };
    };

    const isVisible = (element) => {
      const style = window.getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number(style.opacity) > 0.05
        && box.width > 0
        && box.height > 0;
    };

    const railSelector = [
      '[data-scrollable="x"]',
      '.tabs[data-scrollable="x"]',
      '.calculator-category-tabs',
      '.calculator-tool-tabs',
      '.sort-controls',
      '.drug-search-hints',
      '.drug-risk-filters',
      '.drug-filters',
      '.tool-tabs',
      '.surgery-tabs',
      '.clinical-atlas-rail',
      '.sperm-source-row',
      '.sperm-tree-linkbar',
    ].join(', ');

    const rails = [...document.querySelectorAll(railSelector)]
      .filter(isVisible)
      .map((element) => {
        const box = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return {
          left: Math.round(box.left),
          right: Math.round(box.right),
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
          overflowX: style.overflowX,
        };
      });

    const clippedControls = [...document.querySelectorAll('button, input, select, textarea, [role="button"], a[href]')]
      .filter(isVisible)
      .filter((element) => !element.classList.contains('skip-link') && !element.closest('.sr-only'))
      .map((element) => {
        const box = element.getBoundingClientRect();
        return {
          left: Math.round(box.left),
          right: Math.round(box.right),
          top: Math.round(box.top),
          bottom: Math.round(box.bottom),
          width: Math.round(box.width),
          height: Math.round(box.height),
          inRail: Boolean(element.closest(railSelector)),
        };
      })
      .filter((item) => !item.inRail && (item.left < -2 || item.right > window.innerWidth + 2));

    const modal = document.querySelector('.modal-content');
    const navbar = document.querySelector('.navbar');
    const navbarStyle = navbar ? window.getComputedStyle(navbar) : null;
    const visibleNavbar = navbarStyle
      ? navbarStyle.display !== 'none' && navbarStyle.visibility !== 'hidden' && Number(navbarStyle.opacity) > 0.05
      : false;
    const bodyText = document.body.innerText || '';

    return {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      documentScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      hasModal: Boolean(modal),
      visibleNavbar,
      diseaseCardCount: document.querySelectorAll('.disease-card').length,
      mojibakeFound: markers.some((marker) => bodyText.includes(marker)),
      hasDebugNoise: /\bDebug\b|retained opens/.test(bodyText),
      rects: {
        navbar: rect('.navbar'),
        title: rect('.section-title, .service-page-hero h1, .drug-reference-hero h1, .home-destination-card'),
        modal: rect('.modal-content'),
        tabs: rect('.tabs-shell'),
        quickbar: rect('.modal-mobile-quickbar.is-fixed'),
        bottomNav: rect('.mobile-shell-nav'),
      },
      railIssues: rails.filter((item) => (
        item.left < -2
        || item.right > window.innerWidth + 2
        || (item.scrollWidth > item.clientWidth + 2 && !['auto', 'scroll'].includes(item.overflowX))
      )),
      clippedControls,
    };
  }, mojibakeMarkers);
}

function evaluateBlockers(route, metrics) {
  const blockers = [];
  const add = (kind, detail = {}) => blockers.push({
    route,
    viewport: stressViewport.name,
    size: `${stressViewport.width}x${stressViewport.height}`,
    kind,
    detail,
  });

  if (metrics.documentScrollWidth > metrics.innerWidth + 2 || metrics.bodyScrollWidth > metrics.innerWidth + 2) {
    add('horizontal_overflow', {
      innerWidth: metrics.innerWidth,
      documentScrollWidth: metrics.documentScrollWidth,
      bodyScrollWidth: metrics.bodyScrollWidth,
    });
  }
  if (metrics.mojibakeFound) add('mojibake_visible');
  if (metrics.hasDebugNoise) add('technical_noise_visible');
  if (metrics.clippedControls.length) add('clipped_controls', metrics.clippedControls.slice(0, 4));
  if (metrics.railIssues.length) add('rail_issue', metrics.railIssues.slice(0, 4));

  const { navbar, title, modal, tabs, quickbar } = metrics.rects;
  if (route === '/urology/oncology' && metrics.diseaseCardCount === 0) {
    add('empty_critical_section', { diseaseCardCount: metrics.diseaseCardCount });
  }

  if (modal) {
    if (metrics.visibleNavbar) add('modal_app_nav_visible', { navbar });
    if (!tabs) add('modal_tabs_missing');
    if (!quickbar) add('modal_quickbar_missing');
    if (tabs && tabs.top > 4) add('modal_tabs_not_fixed_top_after_scroll', { tabs });
    if (tabs && (tabs.left < -2 || tabs.right > metrics.innerWidth + 2)) add('modal_tabs_overflow', { tabs });
    if (quickbar && quickbar.bottom > metrics.innerHeight + 2) add('modal_quickbar_below_viewport', { quickbar });
    if (quickbar && quickbar.top < metrics.innerHeight - 150) {
      add('modal_quickbar_not_bottom_docked_after_scroll', { quickbar, innerHeight: metrics.innerHeight });
    }
    if (tabs && quickbar && tabs.bottom >= quickbar.top - 8) {
      add('modal_tabs_quickbar_collision', { tabs, quickbar });
    }
  } else if (navbar && title && title.top < navbar.bottom - 10) {
    add('navbar_title_overlap', { navbar, title });
  }

  return blockers;
}

async function main() {
  ensureBuildExists();
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.mkdirSync(screenshotDir, { recursive: true });

  const v22Report = readJson('content/visual-iphone-gate-v22.json');
  const inheritedBlockers = v22Report.visual_iPhone_gate_v22?.blockers || [];
  const { server, baseUrl } = await createStaticServer();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const stressResults = [];
  const stressBlockers = [];
  const screenshots = [];

  try {
    await page.setViewportSize({ width: stressViewport.width, height: stressViewport.height });
    for (const route of stressRoutes) {
      await preparePage(page, baseUrl, route);
      const metrics = await getMetrics(page);
      const routeBlockers = evaluateBlockers(route, metrics);
      stressBlockers.push(...routeBlockers);
      stressResults.push({
        route,
        viewport: stressViewport.name,
        size: `${stressViewport.width}x${stressViewport.height}`,
        status: routeBlockers.length ? 'fail' : 'pass',
        metrics: {
          innerWidth: metrics.innerWidth,
          innerHeight: metrics.innerHeight,
          documentScrollWidth: metrics.documentScrollWidth,
          bodyScrollWidth: metrics.bodyScrollWidth,
          hasModal: metrics.hasModal,
          diseaseCardCount: metrics.diseaseCardCount,
          rects: metrics.rects,
          railIssues: metrics.railIssues,
          clippedControls: metrics.clippedControls,
        },
      });
    }

    for (const scenario of [
      { route: '/', name: 'home-dark-320x568.png' },
      { route: '/urology/stones/urolithiasis', name: 'disease-modal-320x568.png' },
      { route: '/drugs', name: 'drugs-dark-320x568.png' },
    ]) {
      await preparePage(page, baseUrl, scenario.route);
      const screenshotPath = path.join(screenshotDir, scenario.name);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      screenshots.push({
        route: scenario.route,
        theme: 'dark',
        viewport: stressViewport.name,
        path: path.relative(rootDir, screenshotPath).replaceAll('\\', '/'),
      });
    }
  } finally {
    await browser.close();
    server.close();
  }

  const blockers = [
    ...inheritedBlockers.map((item) => ({ ...item, inheritedFrom: 'v22' })),
    ...stressBlockers,
  ];
  const report = {
    status: v22Report.status === 'pass' && blockers.length === 0 ? 'pass' : 'fail',
    updated_at: new Date().toISOString(),
    visual_iPhone_gate_v23: {
      name: 'visual_iPhone_gate_v23',
      status: v22Report.status === 'pass' && blockers.length === 0 ? 'pass' : 'fail',
      inheritedV22Status: v22Report.status,
      checkedRoutes: stressRoutes.length + (v22Report.visual_iPhone_gate_v22?.checkedRoutes || 0),
      checkedViewports: 1 + (v22Report.visual_iPhone_gate_v22?.checkedViewports || 0),
      themeRoutes: v22Report.visual_iPhone_gate_v22?.themeRoutes || 0,
      blockers,
      screenshots: [
        ...(v22Report.visual_iPhone_gate_v22?.screenshots || []),
        ...screenshots,
      ],
    },
    stressResults,
    inheritedV22: {
      updated_at: v22Report.updated_at,
      status: v22Report.status,
      checkedRoutes: v22Report.visual_iPhone_gate_v22?.checkedRoutes || 0,
      checkedViewports: v22Report.visual_iPhone_gate_v22?.checkedViewports || 0,
    },
  };

  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(report, null, 2));
  if (report.status !== 'pass') process.exitCode = 1;
}

main();

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const buildDir = path.join(rootDir, 'build');
const reportPath = path.join(rootDir, 'content', 'visual-iphone-gate-v22.json');
const screenshotDir = path.join(rootDir, 'test-results', 'v22-visual-screenshots');

const viewports = [
  { name: 'iPhone 15 portrait', width: 393, height: 852 },
  { name: 'iPhone 15 Pro portrait', width: 402, height: 874 },
  { name: 'iPhone Pro Max portrait', width: 430, height: 932 },
  { name: 'iPhone 15 landscape', width: 852, height: 393 },
  { name: 'iPhone 15 Pro landscape', width: 874, height: 402 },
  { name: 'iPhone Pro Max landscape', width: 932, height: 430 },
];

const coreRoutes = [
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
];

const diseaseRoutes = [
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

const themeRoutes = ['/', '/drugs', '/calculators?tool=sperm-tree', '/urology/stones/urolithiasis'];
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

const mojibakeMarkers = [
  '\u0420\u045F',
  '\u0420\u045A',
  '\u0421\u0453',
  '\u0421\u040F',
  '\u0432\u0402',
  '\uFFFD',
];

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

function ensureBuildExists() {
  if (!fs.existsSync(path.join(buildDir, 'index.html'))) {
    throw new Error('Build artifact is missing. Run npm run build before v22:visual.');
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

async function preparePage(page, baseUrl, route, theme = 'dark') {
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForFunction(
    (selector) => Boolean(document.querySelector(selector)),
    readySelector,
    { timeout: 3500 },
  ).catch(() => {});
  await page.evaluate(({ requestedTheme, markers }) => {
    window.__v22MojibakeMarkers = markers;
    document.body.classList.toggle('light-mode', requestedTheme === 'light');
    const modal = document.querySelector('.modal-content');
    if (modal) modal.scrollTop = Math.min(900, Math.max(520, modal.scrollHeight / 3));
  }, { requestedTheme: theme, markers: mojibakeMarkers });
  await page.waitForTimeout(140);
}

async function getMetrics(page) {
  return page.evaluate(() => {
    const selectorMap = {
      navbar: '.navbar',
      main: '#main-content, .page-content',
      title: '.section-title, .service-page-hero h1, .drug-reference-hero h1, .home-destination-card',
      modal: '.modal-content',
      tabs: '.tabs-shell',
      quickbar: '.modal-mobile-quickbar.is-fixed',
      bottomNav: '.mobile-shell-nav',
    };

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
      '.drug-search-hints',
      '.drug-risk-filters',
      '.drug-filters',
      '.tool-tabs',
      '.surgery-tabs',
      '.clinical-atlas-rail',
      '.sperm-source-row',
      '.sperm-tree-linkbar',
    ].join(', ');

    const controls = [...document.querySelectorAll('button, input, select, textarea, [role="button"], a[href]')]
      .filter(isVisible)
      .filter((element) => !element.classList.contains('skip-link') && !element.closest('.sr-only'))
      .map((element) => {
        const box = element.getBoundingClientRect();
        return {
          top: Math.round(box.top),
          left: Math.round(box.left),
          right: Math.round(box.right),
          bottom: Math.round(box.bottom),
          width: Math.round(box.width),
          height: Math.round(box.height),
          inHorizontalRail: Boolean(element.closest(railSelector)),
        };
      });

    const rails = [...document.querySelectorAll(railSelector)]
      .filter(isVisible)
      .map((element) => {
        const box = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return {
          left: Math.round(box.left),
          right: Math.round(box.right),
          width: Math.round(box.width),
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
          overflowX: style.overflowX,
        };
      });

    const modal = document.querySelector(selectorMap.modal);
    const navbar = document.querySelector(selectorMap.navbar);
    const navbarStyle = navbar ? window.getComputedStyle(navbar) : null;
    const visibleNavbar = navbarStyle
      ? navbarStyle.display !== 'none' && navbarStyle.visibility !== 'hidden' && Number(navbarStyle.opacity) > 0.05
      : false;
    const bodyStyle = window.getComputedStyle(document.body);
    const main = document.querySelector(selectorMap.main) || document.body;
    const mainStyle = window.getComputedStyle(main);

    return {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      documentScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      hasModal: Boolean(modal),
      visibleNavbar,
      diseaseCardCount: document.querySelectorAll('.disease-card').length,
      mojibakeFound: window.__v22MojibakeMarkers?.some((marker) => (document.body.innerText || '').includes(marker)) || false,
      hasDebugNoise: /\bDebug\b|retained opens/.test(document.body.innerText || ''),
      theme: {
        bodyBg: bodyStyle.backgroundColor,
        bodyColor: bodyStyle.color,
        mainBg: mainStyle.backgroundColor,
        mainColor: mainStyle.color,
      },
      rects: Object.fromEntries(Object.entries(selectorMap).map(([key, selector]) => [key, rect(selector)])),
      clippedControls: controls.filter((item) => !item.inHorizontalRail && (item.left < -2 || item.right > window.innerWidth + 2)),
      smallControls: controls.filter((item) => item.width > 0 && item.height > 0 && Math.min(item.width, item.height) < 38 && !item.inHorizontalRail),
      railIssues: rails.filter((item) => (
        item.left < -2
        || item.right > window.innerWidth + 2
        || (item.scrollWidth > item.clientWidth + 2 && !['auto', 'scroll'].includes(item.overflowX))
      )),
    };
  });
}

function evaluateBlockers(route, viewport, theme, metrics) {
  const blockers = [];
  const context = { route, viewport: viewport.name, theme, size: `${viewport.width}x${viewport.height}` };
  const add = (kind, detail = {}) => blockers.push({ ...context, kind, detail });

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
    if (tabs && tabs.left < -2) add('modal_tabs_left_overflow', { tabs });
    if (tabs && tabs.right > metrics.innerWidth + 2) add('modal_tabs_right_overflow', { tabs });
    if (quickbar && quickbar.bottom > metrics.innerHeight + 2) add('modal_quickbar_below_viewport', { quickbar });
    if (quickbar && quickbar.top < metrics.innerHeight - Math.max(150, metrics.innerHeight * 0.45)) {
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

  const { server, baseUrl } = await createStaticServer();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const routeResults = [];
  const themeResults = [];
  const screenshots = [];
  const blockers = [];

  try {
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      for (const route of [...coreRoutes, ...diseaseRoutes]) {
        await preparePage(page, baseUrl, route, 'dark');
        const metrics = await getMetrics(page);
        const routeBlockers = evaluateBlockers(route, viewport, 'dark', metrics);
        blockers.push(...routeBlockers);
        routeResults.push({
          route,
          viewport: viewport.name,
          size: `${viewport.width}x${viewport.height}`,
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
            smallControls: metrics.smallControls.slice(0, 4),
          },
        });
      }
    }

    const themeViewport = viewports.find((viewport) => viewport.width === 430 && viewport.height === 932);
    await page.setViewportSize({ width: themeViewport.width, height: themeViewport.height });
    for (const route of themeRoutes) {
      for (const theme of ['dark', 'light']) {
        await preparePage(page, baseUrl, route, theme);
        const metrics = await getMetrics(page);
        const themeBlockers = evaluateBlockers(route, themeViewport, theme, metrics);
        blockers.push(...themeBlockers);
        themeResults.push({
          route,
          theme,
          status: themeBlockers.length ? 'fail' : 'pass',
          tokens: metrics.theme,
        });
      }
    }

    for (const scenario of [
      { route: '/', viewport: viewports[2], theme: 'dark', name: 'home-dark' },
      { route: '/', viewport: viewports[2], theme: 'light', name: 'home-light' },
      { route: '/urology/stones/urolithiasis', viewport: viewports[2], theme: 'dark', name: 'disease-modal-portrait' },
      { route: '/urology/oncology/prostate-cancer', viewport: viewports[3], theme: 'dark', name: 'disease-modal-landscape' },
      { route: '/drugs', viewport: viewports[2], theme: 'light', name: 'drugs-light' },
      { route: '/calculators?tool=sperm-tree', viewport: viewports[2], theme: 'dark', name: 'spermogram-dark' },
    ]) {
      await page.setViewportSize({ width: scenario.viewport.width, height: scenario.viewport.height });
      await preparePage(page, baseUrl, scenario.route, scenario.theme);
      const fileName = `${scenario.name}-${scenario.viewport.width}x${scenario.viewport.height}.png`;
      const absolutePath = path.join(screenshotDir, fileName);
      await page.screenshot({ path: absolutePath, fullPage: false });
      screenshots.push({
        route: scenario.route,
        theme: scenario.theme,
        viewport: scenario.viewport.name,
        path: path.relative(rootDir, absolutePath).replaceAll('\\', '/'),
      });
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  const report = {
    status: blockers.length ? 'fail' : 'pass',
    updated_at: new Date().toISOString(),
    visual_iPhone_gate_v22: {
      name: 'visual_iPhone_gate_v22',
      status: blockers.length ? 'fail' : 'pass',
      checkedRoutes: coreRoutes.length + diseaseRoutes.length,
      checkedViewports: viewports.length,
      themeRoutes: themeResults.length,
      blockers,
      screenshots,
    },
    routeResults,
    themeResults,
  };

  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report.visual_iPhone_gate_v22, null, 2));
  if (report.status !== 'pass') process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

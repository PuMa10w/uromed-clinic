import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const buildDir = path.join(rootDir, 'build');
const reportPath = path.join(rootDir, 'content', 'visual-iphone-gate-v21.json');
const screenshotDir = path.join(rootDir, 'test-results', 'v21-visual-screenshots');

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

const screenshotScenarios = [
  { route: '/', viewport: 'iPhone Pro Max portrait', name: 'home-workbench' },
  { route: '/drugs', viewport: 'iPhone Pro Max portrait', name: 'drug-cockpit' },
  { route: '/calculators?tool=sperm-tree', viewport: 'iPhone Pro Max portrait', name: 'spermogram' },
  { route: '/atlas', viewport: 'iPhone Pro Max portrait', name: 'atlas' },
  { route: '/surgery', viewport: 'iPhone Pro Max portrait', name: 'surgery' },
  { route: '/urology/stones/urolithiasis', viewport: 'iPhone Pro Max portrait', name: 'disease-stones' },
  { route: '/urology/oncology/prostate-cancer', viewport: 'iPhone 15 landscape', name: 'disease-oncology-landscape' },
  { route: '/andrology/sexual/erectile-dysfunction', viewport: 'iPhone 15 Pro landscape', name: 'disease-ed-landscape' },
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
    throw new Error('Build artifact is missing. Run npm run build before v21:visual.');
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
    const extension = path.extname(filePath);
    response.setHeader('Content-Type', mimeTypes.get(extension) || 'application/octet-stream');
    response.setHeader('Cache-Control', 'no-store');
    fs.createReadStream(filePath).pipe(response);
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      resolve({
        server,
        baseUrl: `http://127.0.0.1:${address.port}`,
      });
    });
  });
}

function rectToJson(rect) {
  if (!rect) return null;
  return {
    top: Math.round(rect.top),
    left: Math.round(rect.left),
    right: Math.round(rect.right),
    bottom: Math.round(rect.bottom),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  };
}

async function getMetrics(page) {
  return page.evaluate(() => {
    const selectors = {
      navbar: '.navbar',
      clinicalOs: '[data-v20-clinical-os="true"], [data-v21-clinical-os="true"]',
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
      '.home-workbench-actions',
      '.calculator-category-tabs',
      '.calculator-tool-tabs',
      '.drug-search-hints',
      '.drug-risk-filters',
      '.drug-filters',
      '.tool-tabs',
      '.surgery-tabs',
      '.sperm-source-row',
      '.sperm-tree-linkbar',
      '.spermogram-decision-board',
      '.clinical-atlas-rail',
      '.tabs[data-scrollable="x"]',
    ].join(', ');

    const controls = [...document.querySelectorAll('button, input, select, textarea, [role="button"], a[href]')]
      .filter(isVisible)
      .map((element) => {
        const box = element.getBoundingClientRect();
        const rail = element.closest(railSelector);
        return {
          text: element.textContent.trim().slice(0, 48) || element.getAttribute('aria-label') || element.tagName,
          top: Math.round(box.top),
          left: Math.round(box.left),
          right: Math.round(box.right),
          bottom: Math.round(box.bottom),
          width: Math.round(box.width),
          height: Math.round(box.height),
          inHorizontalRail: Boolean(rail),
        };
      });

    const rails = [...document.querySelectorAll(railSelector)]
      .filter(isVisible)
      .map((element) => {
        const box = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return {
          className: element.className || element.getAttribute('data-scrollable') || element.tagName,
          left: Math.round(box.left),
          right: Math.round(box.right),
          width: Math.round(box.width),
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
          overflowX: style.overflowX,
        };
      });

    const bodyText = document.body.innerText || '';
    const modal = document.querySelector(selectors.modal);
    const navbar = document.querySelector(selectors.navbar);
    const navbarStyle = navbar ? window.getComputedStyle(navbar) : null;
    const visibleNavbar = navbarStyle
      ? navbarStyle.display !== 'none' && navbarStyle.visibility !== 'hidden' && Number(navbarStyle.opacity) > 0.05
      : false;

    return {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      documentScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      hasModal: Boolean(modal),
      visibleNavbar,
      diseaseCardCount: document.querySelectorAll('.disease-card').length,
      mojibakeFound: /Рџ|Рњ|СЃ|вЂ|�/.test(bodyText),
      hasDebugNoise: /\bDebug\b|retained opens/.test(bodyText),
      rects: Object.fromEntries(Object.entries(selectors).map(([key, selector]) => [key, rect(selector)])),
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

function evaluateBlockers(route, viewport, metrics) {
  const blockers = [];
  const context = { route, viewport: viewport.name, size: `${viewport.width}x${viewport.height}` };
  const add = (kind, detail) => blockers.push({ ...context, kind, detail });

  if (metrics.documentScrollWidth > metrics.innerWidth + 2 || metrics.bodyScrollWidth > metrics.innerWidth + 2) {
    add('horizontal_overflow', {
      innerWidth: metrics.innerWidth,
      documentScrollWidth: metrics.documentScrollWidth,
      bodyScrollWidth: metrics.bodyScrollWidth,
    });
  }

  if (metrics.mojibakeFound) add('mojibake_visible', {});
  if (metrics.hasDebugNoise) add('technical_noise_visible', {});
  if (metrics.clippedControls.length > 0) add('clipped_controls', metrics.clippedControls.slice(0, 6));
  if (metrics.railIssues.length > 0) add('rail_issue', metrics.railIssues.slice(0, 6));

  if (route === '/urology/oncology' && metrics.diseaseCardCount === 0) {
    add('empty_critical_section', { diseaseCardCount: metrics.diseaseCardCount });
  }

  const { navbar, title, modal, tabs, quickbar, bottomNav, main } = metrics.rects;

  if (modal) {
    if (metrics.visibleNavbar) add('modal_navbar_overlap_risk', { navbar });
    if (!tabs) add('modal_tabs_missing', {});
    if (!quickbar) add('modal_quickbar_missing', {});
    if (tabs && tabs.top > 8) add('modal_tabs_not_fixed_top', { tabs });
    if (quickbar && quickbar.bottom > metrics.innerHeight + 2) add('modal_quickbar_below_viewport', { quickbar });
    if (quickbar && quickbar.top < metrics.innerHeight - Math.max(160, metrics.innerHeight * 0.42)) {
      add('modal_quickbar_not_bottom_docked', { quickbar, innerHeight: metrics.innerHeight });
    }
    if (tabs && quickbar && tabs.bottom >= quickbar.top - 8) {
      add('modal_tabs_quickbar_collision', { tabs, quickbar });
    }
  } else {
    if (navbar && title && title.top < navbar.bottom - 10) {
      add('navbar_title_overlap', { navbar, title });
    }
    if (navbar && main && main.top < -1) {
      add('main_content_negative_top', { navbar, main });
    }
    if (bottomNav && main && bottomNav.top < 0) {
      add('bottom_nav_layout_issue', { bottomNav, main });
    }
  }

  return blockers;
}

function screenshotName(name, viewport) {
  return `${name}-${viewport.width}x${viewport.height}.png`;
}

async function main() {
  ensureBuildExists();
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.mkdirSync(screenshotDir, { recursive: true });

  const { server, baseUrl } = await createStaticServer();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const routeResults = [];
  const blockers = [];
  const screenshots = [];

  try {
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      for (const route of [...coreRoutes, ...diseaseRoutes]) {
        await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await page.waitForLoadState('networkidle').catch(() => {});
        await page.waitForTimeout(180);
        const metrics = await getMetrics(page);
        const routeBlockers = evaluateBlockers(route, viewport, metrics);
        blockers.push(...routeBlockers);
        routeResults.push({
          route,
          viewport: viewport.name,
          size: `${viewport.width}x${viewport.height}`,
          status: routeBlockers.length === 0 ? 'pass' : 'fail',
          metrics: {
            innerWidth: metrics.innerWidth,
            innerHeight: metrics.innerHeight,
            documentScrollWidth: metrics.documentScrollWidth,
            bodyScrollWidth: metrics.bodyScrollWidth,
            hasModal: metrics.hasModal,
            diseaseCardCount: metrics.diseaseCardCount,
            rects: metrics.rects,
            clippedControls: metrics.clippedControls,
            smallControls: metrics.smallControls.slice(0, 6),
            railIssues: metrics.railIssues,
          },
        });
      }
    }

    for (const scenario of screenshotScenarios) {
      const viewport = viewports.find((item) => item.name === scenario.viewport);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(`${baseUrl}${scenario.route}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(220);
      const fileName = screenshotName(scenario.name, viewport);
      const absolutePath = path.join(screenshotDir, fileName);
      await page.screenshot({ path: absolutePath, fullPage: false });
      screenshots.push({
        route: scenario.route,
        viewport: scenario.viewport,
        path: path.relative(rootDir, absolutePath).replaceAll('\\', '/'),
      });
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  const report = {
    status: blockers.length === 0 ? 'pass' : 'fail',
    updated_at: new Date().toISOString(),
    visual_iPhone_gate: {
      name: 'visual_iPhone_gate',
      status: blockers.length === 0 ? 'pass' : 'fail',
      checkedRoutes: coreRoutes.length + diseaseRoutes.length,
      checkedViewports: viewports.length,
      blockers,
      screenshots,
    },
    routeResults,
  };

  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report.visual_iPhone_gate, null, 2));

  if (report.status !== 'pass') {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const buildDir = path.join(rootDir, 'build');
const reportPath = path.join(rootDir, 'content', 'visual-iphone-strict-gate-v11.json');
const screenshotDir = path.join(rootDir, 'test-results', 'v11-strict-iphone-screenshots');

const routes = [
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
  '/andrology/sexual/psychogenic-ed',
  '/andrology/endocrine/hypogonadism',
  '/andrology/fertility/male-infertility',
];

const viewports = [
  { name: 'iPhone SE portrait', width: 320, height: 568 },
  { name: 'iPhone 12/13 portrait', width: 390, height: 844 },
  { name: 'iPhone 15/16 portrait', width: 393, height: 852 },
  { name: 'iPhone 15/16 Pro portrait', width: 402, height: 874 },
  { name: 'iPhone Plus portrait', width: 414, height: 896 },
  { name: 'iPhone Pro Max portrait', width: 430, height: 932 },
  { name: 'iPhone 16 Pro Max portrait', width: 440, height: 956 },
  { name: 'iPhone SE landscape', width: 568, height: 320 },
  { name: 'iPhone 12/13 landscape', width: 844, height: 390 },
  { name: 'iPhone 15/16 landscape', width: 852, height: 393 },
  { name: 'iPhone 15/16 Pro landscape', width: 874, height: 402 },
  { name: 'iPhone Pro Max landscape', width: 932, height: 430 },
  { name: 'iPhone 16 Pro Max landscape', width: 956, height: 440 },
];

const themes = ['dark', 'light'];

const readySelector = [
  '.home-shell',
  '.subsection-selector',
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
]);

function ensureBuildExists() {
  if (!fs.existsSync(path.join(buildDir, 'index.html'))) {
    throw new Error('Build artifact is missing. Run npm run build before visual:iphone:strict.');
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

async function preparePage(page, baseUrl, route, theme) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForFunction((selector) => Boolean(document.querySelector(selector)), readySelector, { timeout: 800 }).catch(() => {});
  const routePath = route.split('?')[0];
  const isDiseaseRoute = routePath.split('/').filter(Boolean).length >= 3;
  if (isDiseaseRoute) {
    await page.waitForLoadState('networkidle', { timeout: 2500 }).catch(() => {});
    await page.waitForSelector('.modal-content', { timeout: 5000 }).catch(() => {});
    await page.waitForSelector('.tabs-shell', { timeout: 1200 }).catch(() => {});
  }
  await page.evaluate((activeTheme) => {
    document.body.classList.toggle('light-mode', activeTheme === 'light');
    const modal = document.querySelector('.modal-content');
    if (modal) modal.scrollTop = Math.min(1200, Math.max(520, modal.scrollHeight / 3));
  }, theme);
  if (isDiseaseRoute) {
    await page.waitForFunction(() => {
      const modal = document.querySelector('.modal-content');
      const tabs = document.querySelector('.tabs-shell');
      if (!modal || !tabs || !document.body.classList.contains('modal-open')) return false;
      return tabs.getBoundingClientRect().top <= 8;
    }, null, { timeout: 1800 }).catch(() => {});
  }
  await page.waitForTimeout(120);
}

async function getMetrics(page) {
  return page.evaluate(() => {
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

    const visible = (element) => {
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
      '.sort-controls',
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

    const controls = [...document.querySelectorAll('button, input, select, textarea, [role="button"]')]
      .filter(visible)
      .filter((element) => !element.classList.contains('skip-link'))
      .map((element) => {
        const box = element.getBoundingClientRect();
        return {
          selector: element.className || element.getAttribute('aria-label') || element.textContent?.slice(0, 32) || element.tagName,
          left: Math.round(box.left),
          right: Math.round(box.right),
          top: Math.round(box.top),
          bottom: Math.round(box.bottom),
          width: Math.round(box.width),
          height: Math.round(box.height),
          inRail: Boolean(element.closest(railSelector)),
        };
      });

    const rails = [...document.querySelectorAll(railSelector)]
      .filter(visible)
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

    const textNodes = ['body', '.section-title', '.service-page-hero', '.disease-card', '.tool-section', '.modal-tabpanel p']
      .map((selector) => document.querySelector(selector))
      .filter(Boolean)
      .filter(visible)
      .map((element) => {
        const style = window.getComputedStyle(element);
        return {
          selector: element.matches('body') ? 'body' : selectorFor(element),
          color: style.color,
          backgroundColor: style.backgroundColor,
          fontSize: Number.parseFloat(style.fontSize),
          lineHeight: Number.parseFloat(style.lineHeight),
        };
      });

    function selectorFor(element) {
      if (element.id) return `#${element.id}`;
      if (element.className && typeof element.className === 'string') return `.${element.className.split(/\s+/).slice(0, 2).join('.')}`;
      return element.tagName.toLowerCase();
    }

    const navbar = document.querySelector('.navbar');
    const navbarStyle = navbar ? window.getComputedStyle(navbar) : null;
    const bodyText = document.body.innerText || '';

    return {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      documentScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      hasModal: Boolean(document.querySelector('.modal-content')),
      visibleNavbar: navbarStyle
        ? navbarStyle.display !== 'none' && navbarStyle.visibility !== 'hidden' && Number(navbarStyle.opacity) > 0.05
        : false,
      diseaseCardCount: document.querySelectorAll('.disease-card').length,
      bodyTextSample: bodyText.slice(0, 180),
      mojibakeFound: /Рџ|Рњ|РЎ|РІР‚|вЂ|пїЅ/.test(bodyText),
      rects: {
        navbar: rect('.navbar'),
        title: rect('.section-title, .service-page-hero h1, .drug-reference-hero h1, .home-destination-card'),
        modal: rect('.modal-content'),
        tabs: rect('.tabs-shell'),
        quickbar: rect('.modal-mobile-quickbar.is-fixed'),
        bottomNav: rect('.mobile-shell-nav'),
      },
      clippedControls: controls.filter((item) => !item.inRail && (item.left < -2 || item.right > window.innerWidth + 2)),
      tinyControls: controls.filter((item) => Math.min(item.width, item.height) < 36),
      rails,
      railIssues: rails.filter((item) => item.left < -2 || item.right > window.innerWidth + 2 || (item.scrollWidth > item.clientWidth && !/(auto|scroll)/.test(item.overflowX))),
      textNodes,
    };
  });
}

function evaluate(route, viewport, theme, metrics) {
  const blockers = [];
  const add = (type, details = {}) => blockers.push({ route, viewport: viewport.name, size: `${viewport.width}x${viewport.height}`, theme, type, ...details });
  const { navbar, title, tabs, quickbar, bottomNav } = metrics.rects;

  if (metrics.documentScrollWidth > metrics.innerWidth + 2) add('document_horizontal_overflow', { documentScrollWidth: metrics.documentScrollWidth, innerWidth: metrics.innerWidth });
  if (metrics.bodyScrollWidth > metrics.innerWidth + 2) add('body_horizontal_overflow', { bodyScrollWidth: metrics.bodyScrollWidth, innerWidth: metrics.innerWidth });
  if (metrics.mojibakeFound) add('visible_mojibake', { bodyTextSample: metrics.bodyTextSample });
  if (metrics.clippedControls.length) add('clipped_controls', { clippedControls: metrics.clippedControls.slice(0, 6) });
  if (metrics.railIssues.length) add('rail_geometry_issue', { railIssues: metrics.railIssues.slice(0, 6) });

  if (route === '/urology/oncology' && metrics.diseaseCardCount === 0) add('empty_oncology_section');

  if (metrics.hasModal) {
    if (metrics.visibleNavbar) add('modal_app_nav_visible', { navbar });
    if (!tabs) add('modal_tabs_missing');
    if (!quickbar) add('modal_quickbar_missing');
    if (tabs && tabs.top > 5) add('modal_tabs_not_fixed_top', { tabs });
    if (tabs && (tabs.left < -2 || tabs.right > metrics.innerWidth + 2)) add('modal_tabs_overflow', { tabs });
    if (quickbar && quickbar.bottom > metrics.innerHeight + 2) add('modal_quickbar_below_viewport', { quickbar });
    if (quickbar && quickbar.top < metrics.innerHeight - 160) add('modal_quickbar_not_bottom_docked', { quickbar, innerHeight: metrics.innerHeight });
    if (tabs && quickbar && tabs.bottom >= quickbar.top - 8) add('modal_tabs_quickbar_collision', { tabs, quickbar });
  } else if (navbar && title && title.top < navbar.bottom - 10) {
    add('navbar_content_overlap', { navbar, title });
  }

  if (!metrics.hasModal && bottomNav && title && bottomNav.top < title.bottom + 12 && viewport.height < 500) {
    add('landscape_bottom_nav_crowds_first_screen', { bottomNav, title });
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
  page.setDefaultTimeout(2000);
  const results = [];
  const blockers = [];
  const screenshots = [];

  try {
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      for (const route of routes) {
        for (const theme of themes) {
          await preparePage(page, baseUrl, route, theme);
          const metrics = await getMetrics(page);
          const routeBlockers = evaluate(route, viewport, theme, metrics);
          blockers.push(...routeBlockers);
          results.push({
            route,
            viewport: viewport.name,
            size: `${viewport.width}x${viewport.height}`,
            theme,
            status: routeBlockers.length ? 'fail' : 'pass',
            metrics: {
              innerWidth: metrics.innerWidth,
              innerHeight: metrics.innerHeight,
              documentScrollWidth: metrics.documentScrollWidth,
              bodyScrollWidth: metrics.bodyScrollWidth,
              hasModal: metrics.hasModal,
              rects: metrics.rects,
              clippedControlCount: metrics.clippedControls.length,
              tinyControlCount: metrics.tinyControls.length,
              railIssueCount: metrics.railIssues.length,
              textNodes: metrics.textNodes.slice(0, 4),
            },
          });
        }
      }
      console.log(`strict visual gate checked ${viewport.name}`);
    }

    for (const scenario of [
      { route: '/', theme: 'dark', viewport: viewports[0], name: 'home-dark-se.png' },
      { route: '/', theme: 'light', viewport: viewports[2], name: 'home-light-modern.png' },
      { route: '/urology/stones/urolithiasis', theme: 'dark', viewport: viewports[5], name: 'disease-dark-pro-max.png' },
      { route: '/drugs', theme: 'light', viewport: viewports[4], name: 'drugs-light-plus.png' },
      { route: '/calculators?tool=sperm-tree', theme: 'dark', viewport: viewports[6], name: 'spermogram-dark-16pm.png' },
      { route: '/atlas', theme: 'light', viewport: viewports[9], name: 'atlas-light-landscape.png' },
    ]) {
      await page.setViewportSize({ width: scenario.viewport.width, height: scenario.viewport.height });
      await preparePage(page, baseUrl, scenario.route, scenario.theme);
      const screenshotPath = path.join(screenshotDir, scenario.name);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      screenshots.push({
        route: scenario.route,
        theme: scenario.theme,
        viewport: scenario.viewport.name,
        path: path.relative(rootDir, screenshotPath).replaceAll('\\', '/'),
      });
    }
  } finally {
    await browser.close();
    server.close();
  }

  const report = {
    status: blockers.length === 0 ? 'pass' : 'fail',
    updated_at: new Date().toISOString(),
    visual_iphone_strict_gate: {
      name: 'visual_iphone_strict_gate',
      status: blockers.length === 0 ? 'pass' : 'fail',
      checkedRoutes: routes.length,
      checkedViewports: viewports.length,
      checkedThemes: themes,
      blockerCount: blockers.length,
      blockers,
      screenshots,
    },
    results,
  };

  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(report.visual_iphone_strict_gate, null, 2));
  if (report.status !== 'pass') process.exitCode = 1;
}

main();

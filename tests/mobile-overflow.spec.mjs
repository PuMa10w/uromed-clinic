import { test, expect } from '@playwright/test';

const BASE_URL = process.env.MOBILE_AUDIT_BASE_URL || 'http://127.0.0.1:5175';

const viewports = [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 414, height: 896 },
  { width: 428, height: 926 },
  { width: 667, height: 375 },
];

const iphoneReleaseViewports = [
  { name: 'SE portrait', width: 320, height: 568 },
  { name: 'classic portrait', width: 375, height: 667 },
  { name: 'modern portrait', width: 390, height: 844 },
  { name: '15/16 portrait', width: 393, height: 852 },
  { name: '15/16 Pro portrait', width: 402, height: 874 },
  { name: 'Plus portrait', width: 414, height: 896 },
  { name: 'large portrait', width: 428, height: 926 },
  { name: 'Pro Max portrait', width: 430, height: 932 },
  { name: 'SE landscape', width: 568, height: 320 },
  { name: 'classic landscape', width: 667, height: 375 },
  { name: 'modern landscape', width: 844, height: 390 },
  { name: '15/16 landscape', width: 852, height: 393 },
  { name: '15/16 Pro landscape', width: 874, height: 402 },
  { name: 'Plus landscape', width: 896, height: 414 },
  { name: 'large landscape', width: 926, height: 428 },
  { name: 'Pro Max landscape', width: 932, height: 430 },
];

const routes = [
  '/',
  '/urology',
  '/andrology',
  '/drugs',
  '/tools',
  '/calculators',
  '/sitemap',
  '/favorites',
  '/emergency',
  '/pediatric',
  '/surgery',
  '/metaphylaxis',
  '/glossary',
  '/humor',
  '/atlas',
  '/urology/stones/urolithiasis',
  '/urology/infections/renal-tuberculosis',
  '/urology/oncology/prostate-cancer',
  '/urology/reconstructive/urethral-stricture',
  '/andrology/fertility/male-infertility',
  '/andrology/sexual/psychogenic-ed',
];

async function readLayoutMetrics(page) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await page.evaluate(() => ({
        innerWidth: window.innerWidth,
        documentScrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
        visibleText: document.body.innerText.slice(0, 120),
      }));
    } catch (error) {
      if (!String(error.message || error).includes('Execution context was destroyed') || attempt === 2) {
        throw error;
      }

      await page.waitForLoadState('domcontentloaded').catch(() => {});
      await page.waitForTimeout(250);
    }
  }

  throw new Error('Unable to read layout metrics');
}

async function gotoStable(page, url) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
  } catch (error) {
    const message = String(error?.message || error);
    if (!message.includes('ERR_ABORTED') && !message.includes('frame was detached')) {
      throw error;
    }
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
  }
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(300);
}

test.describe('iPhone premium layout smoke', () => {
  for (const viewport of viewports) {
    for (const route of routes) {
      test(`no horizontal overflow at ${viewport.width}px on ${route}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(`${BASE_URL}${route}`);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(250);

        const metrics = await readLayoutMetrics(page);

        expect(metrics.documentScrollWidth, JSON.stringify(metrics)).toBeLessThanOrEqual(metrics.innerWidth + 2);
        expect(metrics.bodyScrollWidth, JSON.stringify(metrics)).toBeLessThanOrEqual(metrics.innerWidth + 2);
      });
    }
  }

  test('disease tabs remain horizontally scrollable on iPhone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoStable(page, `${BASE_URL}/urology/stones/urolithiasis`);

    const tabs = page.locator('.tabs[data-scrollable="x"]').first();
    await expect(tabs).toBeVisible();
    await expect
      .poll(
        async () => tabs.evaluate((element) => element.scrollWidth - element.clientWidth),
        { message: 'disease tabs should expose horizontal overflow after SPA route settles' },
      )
      .toBeGreaterThan(0);

    const before = await tabs.evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      scrollLeft: element.scrollLeft,
    }));

    expect(before.scrollWidth).toBeGreaterThan(before.clientWidth);

    await tabs.evaluate((element) => {
      element.scrollBy({ left: element.scrollWidth - element.clientWidth, behavior: 'instant' });
    });
    await page.waitForTimeout(120);

    const after = await tabs.evaluate((element) => element.scrollLeft);
    expect(after).toBeGreaterThan(before.scrollLeft);
  });

  test('v18.1 disease tabs pin to viewport top after modal scroll', async ({ page }) => {
    for (const viewport of [
      { width: 393, height: 852 },
      { width: 852, height: 393 },
    ]) {
      await page.setViewportSize(viewport);
      await gotoStable(page, `${BASE_URL}/urology/oncology/prostate-cancer`);

      await expect(page.locator('.tabs-shell').first()).toBeVisible();
      await expect(page.locator('.modal-mobile-quickbar.is-fixed').first()).toBeVisible();

      await page.locator('.modal-content').first().evaluate((element) => {
        element.scrollTo({ top: 980, behavior: 'instant' });
      });
      await page.waitForTimeout(180);

      const metrics = await page.evaluate(() => {
        const tabs = document.querySelector('.tabs-shell')?.getBoundingClientRect();
        const quickbar = document.querySelector('.modal-mobile-quickbar.is-fixed')?.getBoundingClientRect();
        const modal = document.querySelector('.modal-content');
        return {
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
          scrollWidth: document.documentElement.scrollWidth,
          modalScrollTop: modal?.scrollTop ?? 0,
          tabsTop: tabs?.top ?? 999,
          tabsBottom: tabs ? tabs.top + tabs.height : 999,
          quickbarTop: quickbar?.top ?? 0,
          quickbarBottom: quickbar ? quickbar.top + quickbar.height : 0,
        };
      });

      expect(metrics.modalScrollTop, JSON.stringify(metrics)).toBeGreaterThan(120);
      expect(metrics.scrollWidth, JSON.stringify(metrics)).toBeLessThanOrEqual(metrics.innerWidth + 2);
      expect(metrics.tabsTop, JSON.stringify(metrics)).toBeLessThanOrEqual(6);
      expect(metrics.tabsBottom, JSON.stringify(metrics)).toBeLessThan(metrics.innerHeight / 2);
      expect(metrics.quickbarTop, JSON.stringify(metrics)).toBeGreaterThan(metrics.innerHeight - 150);
      expect(metrics.quickbarBottom, JSON.stringify(metrics)).toBeLessThanOrEqual(metrics.innerHeight + 2);
    }
  });

  test('oncology section renders cards from canonical subsection data', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 852 });
    await gotoStable(page, `${BASE_URL}/urology/oncology`);

    await expect(page.locator('.disease-card').first()).toBeVisible();

    const metrics = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      cardCount: document.querySelectorAll('.disease-card').length,
      hasEmptyState: Boolean(document.querySelector('.no-data')),
      text: document.body.innerText,
    }));

    expect(metrics.cardCount, JSON.stringify(metrics)).toBeGreaterThanOrEqual(12);
    expect(metrics.hasEmptyState, JSON.stringify(metrics)).toBe(false);
    expect(metrics.text).toContain('Рак');
    expect(metrics.scrollWidth, JSON.stringify(metrics)).toBeLessThanOrEqual(metrics.innerWidth + 2);
  });

  test('mobile disease shell keeps sticky tabs and fixed quickbar out of the reading flow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/urology/infections/renal-tuberculosis`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(300);

    const tabsShell = page.locator('.tabs-shell').first();
    const quickbar = page.locator('.modal-mobile-quickbar.is-fixed').first();

    await expect(tabsShell).toBeVisible();
    await expect(quickbar).toBeVisible();

    const before = await tabsShell.boundingBox();
    await page.evaluate(() => window.scrollBy(0, 720));
    await page.waitForTimeout(150);
    const after = await tabsShell.boundingBox();
    const quickbarBox = await quickbar.boundingBox();
    const viewportHeight = await page.evaluate(() => window.innerHeight);

    expect(before?.y ?? 999).toBeLessThan(160);
    expect(after?.y ?? 999).toBeLessThan(160);
    expect(quickbarBox?.y ?? 0).toBeGreaterThan(viewportHeight - 145);
    expect((quickbarBox?.y ?? 0) + (quickbarBox?.height ?? 0)).toBeLessThanOrEqual(viewportHeight + 2);
  });

  test('long disease cards keep tabs and quick actions docked on compact iPhone', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto(`${BASE_URL}/urology/pain/malakoplakia`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(300);

    await page.locator('#tab-followup').click();
    await page.waitForTimeout(150);
    await page.evaluate(() => window.scrollBy(0, 900));
    await page.waitForTimeout(150);

    const tabsShell = page.locator('.tabs-shell').first();
    const quickbar = page.locator('.modal-mobile-quickbar.is-fixed').first();
    const tabsBox = await tabsShell.boundingBox();
    const quickbarBox = await quickbar.boundingBox();
    const viewportHeight = await page.evaluate(() => window.innerHeight);

    expect(tabsBox?.y ?? 999).toBeLessThan(150);
    expect((tabsBox?.y ?? 0) + (tabsBox?.height ?? 0)).toBeLessThan(viewportHeight / 2);
    expect(quickbarBox?.y ?? 0).toBeGreaterThan(viewportHeight - 112);
    expect((quickbarBox?.y ?? 0) + (quickbarBox?.height ?? 0)).toBeLessThanOrEqual(viewportHeight + 2);
  });

  test('sticky stack is stable across disease classes on iPhone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    for (const route of [
      '/urology/infections/renal-tuberculosis',
      '/urology/oncology/prostate-cancer',
      '/urology/reconstructive/urethral-stricture',
      '/andrology/fertility/male-infertility',
      '/andrology/sexual/erectile-dysfunction',
    ]) {
      await page.goto(`${BASE_URL}${route}`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(300);

      const tabsShell = page.locator('.tabs-shell').first();
      const tabs = page.locator('.tabs[data-scrollable="x"]').first();
      const quickbar = page.locator('.modal-mobile-quickbar.is-fixed').first();

      await expect(tabsShell).toBeVisible();
      await expect(quickbar).toBeVisible();

      await tabs.evaluate((element) => {
        element.scrollBy({ left: element.scrollWidth - element.clientWidth, behavior: 'instant' });
      });
      await page.evaluate(() => window.scrollBy(0, 760));
      await page.waitForTimeout(120);

      const metrics = await page.evaluate(() => {
        const tabsRect = document.querySelector('.tabs-shell')?.getBoundingClientRect();
        const quickRect = document.querySelector('.modal-mobile-quickbar.is-fixed')?.getBoundingClientRect();
        return {
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
          scrollWidth: document.documentElement.scrollWidth,
          tabsY: tabsRect?.y ?? 999,
          tabsBottom: tabsRect ? tabsRect.y + tabsRect.height : 999,
          quickY: quickRect?.y ?? 0,
          quickBottom: quickRect ? quickRect.y + quickRect.height : 0,
        };
      });

      expect(metrics.scrollWidth, route).toBeLessThanOrEqual(metrics.innerWidth + 2);
      expect(metrics.tabsY, route).toBeLessThan(165);
      expect(metrics.tabsBottom, route).toBeLessThan(metrics.innerHeight / 2);
      expect(metrics.quickY, route).toBeGreaterThan(metrics.innerHeight - 150);
      expect(metrics.quickBottom, route).toBeLessThanOrEqual(metrics.innerHeight + 2);
    }
  });

  test('clinical tables stay compact and readable on compact iPhone', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto(`${BASE_URL}/urology/stones/urolithiasis`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(300);

    await page.locator('#tab-diagnostics').click();
    await page.waitForTimeout(150);

    const card = page.locator('.clinical-table-card').first();
    const rows = page.locator('.premium-clinical-table tr');
    await expect(card).toBeVisible();
    await expect(rows.first()).toBeVisible();

    const tableMetrics = await page.evaluate(() => {
      const viewportWidth = window.innerWidth;
      const cards = [...document.querySelectorAll('.clinical-table-card')].map((element) => {
        const rect = element.getBoundingClientRect();
        return { width: rect.width, left: rect.left, right: rect.right };
      });
      const rows = [...document.querySelectorAll('.premium-clinical-table tr')].map((element) => {
        const rect = element.getBoundingClientRect();
        return { width: rect.width, left: rect.left, right: rect.right };
      });
      const labelledCells = [...document.querySelectorAll('.premium-clinical-table td[data-label]')].length;
      return { viewportWidth, cards, rows, labelledCells };
    });

    expect(tableMetrics.labelledCells).toBeGreaterThan(3);
    for (const item of [...tableMetrics.cards, ...tableMetrics.rows]) {
      expect(item.left).toBeGreaterThanOrEqual(-2);
      expect(item.right).toBeLessThanOrEqual(tableMetrics.viewportWidth + 2);
      expect(item.width).toBeLessThanOrEqual(tableMetrics.viewportWidth);
    }
  });

  test('premium pages do not expose technical helper labels', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    for (const route of ['/urology/reconstructive', '/drugs', '/tools', '/calculators']) {
      await gotoStable(page, `${BASE_URL}${route}`);
      await page.waitForTimeout(200);

      const visibleText = await page.locator('body').innerText();
      expect(visibleText).not.toContain('retained opens');
      expect(visibleText).not.toContain('Debug');
    }
  });

  test('service page rails remain horizontally usable on the narrowest iPhone', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });

    await gotoStable(page, `${BASE_URL}/calculators`);

    for (const selector of ['.calculator-category-tabs', '.calculator-tool-tabs']) {
      const rail = page.locator(selector).first();
      await expect(rail).toBeVisible();

      const before = await rail.evaluate((element) => ({
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        scrollLeft: element.scrollLeft,
      }));

      expect(before.scrollWidth).toBeGreaterThanOrEqual(before.clientWidth);

      await rail.evaluate((element) => {
        element.scrollBy({ left: element.scrollWidth - element.clientWidth, behavior: 'instant' });
      });

      const after = await rail.evaluate((element) => element.scrollLeft);
      if (before.scrollWidth > before.clientWidth) {
        expect(after).toBeGreaterThan(before.scrollLeft);
      }
    }

    await gotoStable(page, `${BASE_URL}/drugs`);

    const hints = page.locator('.drug-search-hints').first();
    await expect(hints).toBeVisible();
    const hintMetrics = await hints.evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      scrollLeft: element.scrollLeft,
    }));

    expect(hintMetrics.scrollWidth).toBeGreaterThan(hintMetrics.clientWidth);

    await hints.evaluate((element) => {
      element.scrollBy({ left: element.scrollWidth - element.clientWidth, behavior: 'instant' });
    });

    const hintAfter = await hints.evaluate((element) => element.scrollLeft);
    expect(hintAfter).toBeGreaterThan(hintMetrics.scrollLeft);
  });

  test('service pages share the v11 premium shell without clipped controls', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    for (const route of ['/tools', '/calculators', '/drugs', '/sitemap', '/favorites', '/emergency']) {
      await gotoStable(page, `${BASE_URL}${route}`);
      await page
        .locator('.service-page-shell, .tools-section, .calculators-page, .drug-reference, .sitemap-page, .favorites-page, .emergency-page')
        .first()
        .waitFor({ state: 'visible', timeout: 5000 });

      const metrics = await page.evaluate(() => {
        const shell = document.querySelector(
          '.service-page-shell, .tools-section, .calculators-page, .drug-reference, .sitemap-page, .favorites-page, .emergency-page'
        );
        const controls = [
          ...document.querySelectorAll(
            '.service-page-shell button, .service-page-shell input, .service-page-shell select, .service-page-shell textarea, .tools-section button, .calculators-page button, .drug-reference button'
          ),
        ]
          .filter((element) => {
            const style = window.getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
          })
          .map((element) => {
            const rect = element.getBoundingClientRect();
            const rail = element.closest(
              '.calculator-category-tabs, .calculator-tool-tabs, .drug-search-hints, .drug-risk-filters, .drug-filters, .tool-tabs, .surgery-tabs, .sperm-source-row, .sperm-tree-linkbar, .spermogram-decision-board, .clinical-atlas-rail'
            );
            return {
              text: element.textContent.trim().slice(0, 40),
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              height: Math.round(rect.height),
              inHorizontalRail: Boolean(rail),
            };
          });

        return {
          hasShell: Boolean(shell),
          innerWidth: window.innerWidth,
          documentScrollWidth: document.documentElement.scrollWidth,
          controls,
        };
      });

      const clipped = metrics.controls.filter((item) => !item.inHorizontalRail && (item.left < -2 || item.right > metrics.innerWidth + 2));
      const smallPrimaryControls = metrics.controls.filter((item) => item.height > 0 && item.height < 34);

      expect(metrics.hasShell, route).toBe(true);
      expect(metrics.documentScrollWidth, JSON.stringify(metrics)).toBeLessThanOrEqual(metrics.innerWidth + 2);
      expect(clipped, `${route}: ${JSON.stringify(clipped.slice(0, 8))}`).toEqual([]);
      expect(smallPrimaryControls.length, route).toBeLessThanOrEqual(2);
    }
  });

  test('service pages share the v12 Clinical Luxury shell on first screen', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    for (const route of [
      '/',
      '/urology',
      '/andrology',
      '/pediatric',
      '/tools',
      '/calculators',
      '/drugs',
      '/sitemap',
      '/favorites',
      '/emergency',
      '/surgery',
      '/metaphylaxis',
      '/glossary',
      '/humor',
      '/atlas',
    ]) {
      await gotoStable(page, `${BASE_URL}${route}`);

      const metrics = await page.evaluate(() => {
        const navbar = document.querySelector('.navbar')?.getBoundingClientRect();
        const content = document.querySelector('#main-content, .page-content')?.getBoundingClientRect();
        const title = document.querySelector('.section-title, .service-page-hero h1, .drug-reference-hero h1, .home-destination-card')?.getBoundingClientRect();
        const visibleControls = [...document.querySelectorAll('button, input, select, textarea, [role="button"]')]
          .filter((element) => {
            const style = window.getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
          })
          .map((element) => {
            const rect = element.getBoundingClientRect();
            const rail = element.closest(
            '.home-workbench-actions, .calculator-category-tabs, .calculator-tool-tabs, .drug-search-hints, .drug-risk-filters, .drug-filters, .tool-tabs, .surgery-tabs, .sperm-source-row, .sperm-tree-linkbar, .spermogram-decision-board, .clinical-atlas-rail, .tabs[data-scrollable="x"]'
            );
            return {
              text: element.textContent.trim().slice(0, 30),
              top: Math.round(rect.top),
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              height: Math.round(rect.height),
              inHorizontalRail: Boolean(rail),
            };
          });

        return {
          innerWidth: window.innerWidth,
          documentScrollWidth: document.documentElement.scrollWidth,
          navbarBottom: navbar?.bottom ?? 0,
          contentTop: content?.top ?? 0,
          titleTop: title?.top ?? null,
          clippedControls: visibleControls.filter((item) => !item.inHorizontalRail && (item.left < -2 || item.right > window.innerWidth + 2)),
        };
      });

      expect(metrics.documentScrollWidth, `${route}: ${JSON.stringify(metrics)}`).toBeLessThanOrEqual(metrics.innerWidth + 2);
      expect(metrics.contentTop, route).toBeGreaterThanOrEqual(-1);
      if (metrics.titleTop !== null) {
        expect(metrics.titleTop, route).toBeGreaterThanOrEqual(metrics.navbarBottom - 8);
      }
      expect(metrics.clippedControls, `${route}: ${JSON.stringify(metrics.clippedControls.slice(0, 6))}`).toEqual([]);
    }
  });

  test('priority disease clinical sections keep v12 reading rail and fixed actions', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    for (const route of [
      '/urology/stones/urolithiasis',
      '/urology/infections/renal-tuberculosis',
      '/urology/oncology/prostate-cancer',
      '/urology/reconstructive/urethral-stricture',
      '/andrology/fertility/male-infertility',
      '/andrology/sexual/psychogenic-ed',
    ]) {
      await gotoStable(page, `${BASE_URL}${route}`);
      await expect(page.locator('.modal-content').first()).toBeVisible();

      for (const tabId of ['diagnostics', 'differential', 'treatment', 'followup']) {
        const tab = page.locator(`#tab-${tabId}`).first();
        if (await tab.count()) {
          await tab.click();
          await page.waitForTimeout(120);
        }

        const metrics = await page.evaluate(() => {
          const quickbar = document.querySelector('.modal-mobile-quickbar.is-fixed')?.getBoundingClientRect();
          const tabs = document.querySelector('.tabs-shell')?.getBoundingClientRect();
          const blocks = [...document.querySelectorAll('.modal-tabpanel p, .modal-tabpanel li, .clinical-table-card, .premium-clinical-table')]
            .filter((element) => {
              const rect = element.getBoundingClientRect();
              return rect.width > 0 && rect.height > 0;
            })
            .slice(0, 10)
            .map((element) => {
              const rect = element.getBoundingClientRect();
              return {
                width: Math.round(rect.width),
                left: Math.round(rect.left),
                right: Math.round(rect.right),
              };
            });

          return {
            innerWidth: window.innerWidth,
            documentScrollWidth: document.documentElement.scrollWidth,
            quickbarTop: quickbar?.top ?? 0,
            quickbarBottom: quickbar?.bottom ?? 0,
            tabsTop: tabs?.top ?? 0,
            blockOverflow: blocks.filter((item) => item.left < -2 || item.right > window.innerWidth + 2),
          };
        });

        expect(metrics.documentScrollWidth, `${route}/${tabId}: ${JSON.stringify(metrics)}`).toBeLessThanOrEqual(metrics.innerWidth + 2);
        expect(metrics.tabsTop, route).toBeGreaterThanOrEqual(-1);
        expect(metrics.quickbarTop, route).toBeGreaterThan(metrics.tabsTop + 80);
        expect(metrics.quickbarBottom, route).toBeLessThanOrEqual(846);
        expect(metrics.blockOverflow, `${route}/${tabId}`).toEqual([]);
      }
    }
  });

  test('bottom shell navigation never competes with disease modal quick actions', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/urology/stones/urolithiasis`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(300);

    await expect(page.locator('.modal-mobile-quickbar.is-fixed').first()).toBeVisible();

    const state = await page.evaluate(() => {
      const shellNav = document.querySelector('.mobile-shell-nav');
      const shellStyle = shellNav ? window.getComputedStyle(shellNav) : null;
      const quickbar = document.querySelector('.modal-mobile-quickbar.is-fixed')?.getBoundingClientRect();
      return {
        modalOpen: document.body.classList.contains('modal-open'),
        shellNavVisible: Boolean(
          shellNav &&
            shellStyle &&
            shellStyle.display !== 'none' &&
            shellStyle.visibility !== 'hidden' &&
            shellNav.getBoundingClientRect().height > 0
        ),
        quickbarY: quickbar?.y ?? 0,
        quickbarBottom: quickbar ? quickbar.y + quickbar.height : 0,
        innerHeight: window.innerHeight,
      };
    });

    expect(state.modalOpen).toBe(true);
    expect(state.shellNavVisible).toBe(false);
    expect(state.quickbarY).toBeGreaterThan(state.innerHeight - 145);
    expect(state.quickbarBottom).toBeLessThanOrEqual(state.innerHeight + 2);
  });

  test('touch targets meet UltraPremium minimum on iPhone shell', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    for (const route of ['/', '/drugs', '/tools', '/calculators', '/urology/stones/urolithiasis', '/emergency']) {
      await gotoStable(page, `${BASE_URL}${route}`);

      const targetMetrics = await page.evaluate(() => {
        const selectors = [
          '.navbar button',
          '.navbar-section-btn',
          '.bottom-nav button',
          '.mobile-shell-nav button',
          '.tabs button',
          '.calculator-category-tabs button',
          '.calculator-tool-tabs button',
          '.drug-search-hints button',
          '.modal-mobile-quickbtn',
        ];
        return selectors.flatMap((selector) =>
          [...document.querySelectorAll(selector)]
            .filter((element) => {
              const style = window.getComputedStyle(element);
              const rect = element.getBoundingClientRect();
              return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
            })
            .map((element) => {
              const rect = element.getBoundingClientRect();
              return {
                selector,
                text: element.textContent.trim().slice(0, 30),
                width: Math.round(rect.width),
                height: Math.round(rect.height),
              };
            })
        );
      });

      const tooSmall = targetMetrics.filter((item) => item.height < 44);
      expect(tooSmall, `${route}: ${JSON.stringify(tooSmall.slice(0, 8))}`).toEqual([]);
    }
  });

  test('mobile search behaves like a compact command sheet', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(250);

    await page.locator('.search-toggle').click();
    const dropdown = page.locator('.search-dropdown').first();
    const drugsCommand = page.locator('[data-command-id="drugs"]').first();

    await expect(dropdown).toBeVisible();
    await expect(drugsCommand).toBeVisible();

    const shellMetrics = await dropdown.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        left: rect.left,
        right: rect.right,
        width: rect.width,
        viewportWidth: window.innerWidth,
        scrollHeight: element.scrollHeight,
        clientHeight: element.clientHeight,
      };
    });

    expect(shellMetrics.left).toBeGreaterThanOrEqual(-1);
    expect(shellMetrics.right).toBeLessThanOrEqual(shellMetrics.viewportWidth + 1);
    expect(shellMetrics.width).toBeLessThanOrEqual(shellMetrics.viewportWidth);
    expect(shellMetrics.clientHeight).toBeLessThanOrEqual(await page.evaluate(() => window.innerHeight));

    await drugsCommand.click();
    await expect(page).toHaveURL(/\/drugs$/);
  });

  test('spermogram opens from tools in one tap with canonical deep-link', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/tools`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(250);

    await page.locator('[data-tool-entry="sperm-tree"]').click();
    await expect(page).toHaveURL(/\/calculators\?tool=sperm-tree$/);
    await expect(page.locator('.spermogram-premium-shell')).toBeVisible();

    const metrics = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
    }));
    expect(metrics.documentScrollWidth, JSON.stringify(metrics)).toBeLessThanOrEqual(metrics.innerWidth + 2);
  });

  test('spermogram opens from command search and sitemap shortcuts', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoStable(page, `${BASE_URL}/`);

    const searchToggle = page.locator('.search-toggle').first();
    await expect(searchToggle).toBeVisible();
    await searchToggle.click();
    await expect(page.locator('.search-dropdown').first()).toBeVisible();
    await page.locator('.search-input').first().fill('спермограмма');
    await expect(page.locator('[data-command-id="spermogram"]')).toBeVisible();
    await page.locator('[data-command-id="spermogram"]').click();
    await expect(page).toHaveURL(/\/calculators\?tool=sperm-tree$/);
    await expect(page.locator('.spermogram-premium-shell')).toBeVisible();

    await page.goto(`${BASE_URL}/sitemap`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(250);
    await page.locator('[data-sitemap-service="spermogram"]').click();
    await expect(page).toHaveURL(/\/calculators\?tool=sperm-tree$/);
    await expect(page.locator('.spermogram-premium-shell')).toBeVisible();
  });

  test('direct spermogram deep-link keeps sperm tree active', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/calculators?tool=sperm-tree`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(250);

    await expect(page.locator('.spermogram-premium-shell')).toBeVisible();
    await expect(page.locator('.calculator-tool-tab.active')).toHaveAttribute('class', /active/);
  });

  test('spermogram decision tree is readable and interactive on iPhone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/calculators`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(350);

    await expect(page.locator('.spermogram-premium-shell')).toBeVisible();
    await expect(page.getByText('Спермограмма: дерево решений')).toBeVisible();

    await page.getByLabel('Концентрация, млн/мл').fill('0');
    await page.getByLabel('ФСГ, МЕ/л').fill('12');
    await page.getByLabel('Объем яичка, мл').fill('8');
    await page.getByLabel('DFI, %').fill('35');
    await page.getByLabel('MAR-test, %').fill('60');
    await page.getByLabel('Возраст партнерши').fill('39');
    await page.getByLabel('Неудачные ART циклы').fill('2');
    await page.waitForTimeout(150);

    await expect(page.getByText('Азооспермия: OA / NOA / HH')).toBeVisible();
    await expect(page.locator('.sperm-tree-node').filter({ hasText: 'NOA likely' }).first()).toBeVisible();
    await expect(page.locator('.sperm-source-row').filter({ hasText: 'WHO 2021' }).first()).toBeVisible();

    const metrics = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      bodyText: document.body.innerText,
      nodeCount: document.querySelectorAll('.sperm-tree-node').length,
      sourceChipCount: document.querySelectorAll('.sperm-source-row span').length,
    }));

    expect(metrics.documentScrollWidth, JSON.stringify(metrics)).toBeLessThanOrEqual(metrics.innerWidth + 2);
    expect(metrics.nodeCount).toBeGreaterThan(4);
    expect(metrics.sourceChipCount).toBeGreaterThan(8);
    expect(metrics.bodyText).not.toContain('Рљ');
    expect(metrics.bodyText).not.toContain('Рџ');
  });

  test('v13 command center groups results by clinical intent', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoStable(page, `${BASE_URL}/`);

    await page.locator('.search-toggle').first().click();
    await expect(page.locator('.search-dropdown').first()).toBeVisible();

    for (const query of ['QT', 'камни', 'ЭД', 'спермограмма', '3D', 'AI']) {
      await page.locator('.search-input').first().fill(query);
      await page.waitForTimeout(320);

      const commandGroups = await page.locator('[data-command-group]').count();
      const commandCards = await page.locator('[data-command-id]').count();
      const metrics = await readLayoutMetrics(page);

      expect(commandGroups, query).toBeGreaterThan(0);
      expect(commandCards, query).toBeGreaterThan(0);
      expect(metrics.documentScrollWidth, query).toBeLessThanOrEqual(metrics.innerWidth + 2);
    }
  });

  test('v13 clinical action header appears in disease cards without breaking reading rail', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoStable(page, `${BASE_URL}/urology/stones/urolithiasis`);

    const actionHeader = page.locator('[data-clinical-action-ready="true"]').first();
    await expect(actionHeader).toBeVisible();

    const metrics = await page.evaluate(() => {
      const header = document.querySelector('[data-clinical-action-ready="true"]')?.getBoundingClientRect();
      const items = [...document.querySelectorAll('.clinical-action-item')].map((element) => {
        const rect = element.getBoundingClientRect();
        return { left: rect.left, right: rect.right, width: rect.width };
      });
      return {
        innerWidth: window.innerWidth,
        documentScrollWidth: document.documentElement.scrollWidth,
        headerWidth: header?.width ?? 0,
        overflowItems: items.filter((item) => item.left < -2 || item.right > window.innerWidth + 2),
      };
    });

    expect(metrics.documentScrollWidth, JSON.stringify(metrics)).toBeLessThanOrEqual(metrics.innerWidth + 2);
    expect(metrics.headerWidth).toBeLessThanOrEqual(metrics.innerWidth);
    expect(metrics.overflowItems).toEqual([]);
  });

  test('v13 drug risk filters stay scrollable and premium on iPhone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoStable(page, `${BASE_URL}/drugs`);

    const riskRail = page.locator('.drug-risk-filters').first();
    await expect(riskRail).toBeVisible();
    await page.locator('[data-risk-filter="qt"]').click();
    await expect(page.locator('[data-active-risk="qt"]')).toBeVisible();

    const metrics = await page.evaluate(() => {
      const rail = document.querySelector('.drug-risk-filters');
      const cards = [...document.querySelectorAll('.drug-card')].slice(0, 6).map((element) => {
        const rect = element.getBoundingClientRect();
        return { left: rect.left, right: rect.right, width: rect.width };
      });
      return {
        innerWidth: window.innerWidth,
        documentScrollWidth: document.documentElement.scrollWidth,
        railScrollWidth: rail?.scrollWidth ?? 0,
        railClientWidth: rail?.clientWidth ?? 0,
        visibleCards: cards.length,
        overflowCards: cards.filter((item) => item.left < -2 || item.right > window.innerWidth + 2),
      };
    });

    expect(metrics.documentScrollWidth, JSON.stringify(metrics)).toBeLessThanOrEqual(metrics.innerWidth + 2);
    expect(metrics.railScrollWidth).toBeGreaterThan(metrics.railClientWidth);
    expect(metrics.visibleCards).toBeGreaterThan(0);
    expect(metrics.overflowCards).toEqual([]);
  });

  test('v13 light and dark visual smoke keeps header clear of content', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    for (const route of ['/', '/drugs', '/calculators', '/urology/stones/urolithiasis']) {
      await gotoStable(page, `${BASE_URL}${route}`);

      for (let pass = 0; pass < 2; pass += 1) {
        const metrics = await page.evaluate(() => {
          const main = document.querySelector('#main-content')?.getBoundingClientRect();
          const quickbar = document.querySelector('.modal-mobile-quickbar.is-fixed')?.getBoundingClientRect();
          return {
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            documentScrollWidth: document.documentElement.scrollWidth,
            mainTop: main?.top ?? 0,
            quickbarBottom: quickbar?.bottom ?? null,
          };
        });

        expect(metrics.documentScrollWidth, route).toBeLessThanOrEqual(metrics.innerWidth + 2);
        expect(metrics.mainTop, route).toBeGreaterThanOrEqual(-1);
        if (metrics.quickbarBottom !== null) {
          expect(metrics.quickbarBottom, route).toBeLessThanOrEqual(metrics.innerHeight + 2);
        }

        const visibleThemeToggles = await page.locator('.theme-toggle:visible').count();
        if (visibleThemeToggles > 0) {
          await page.locator('.theme-toggle:visible').first().click({ force: true });
          await page.waitForTimeout(180);
        }
      }
    }
  });

  test('v17 command center keyboard workflow remains accessible', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoStable(page, `${BASE_URL}/`);

    await page.keyboard.press('Control+K');
    const dropdown = page.locator('.search-dropdown').first();
    const input = page.locator('.search-input').first();
    await expect(dropdown).toBeVisible();
    await expect(input).toBeFocused();

    await input.fill('QT');
    await page.waitForTimeout(320);
    const qtCommand = page.locator('[data-command-id="drug-qt-risk"]').first();
    await expect(qtCommand).toBeVisible();
    await expect(qtCommand).toHaveAttribute('data-workflow-intent', /open_clinical_workspace/);
    await expect(qtCommand).toHaveAttribute('data-risk-level', /routine|watch|urgent/);
    await expect(qtCommand.locator('.search-result-next-step')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dropdown).toBeHidden();
  });

  test('v17.1 command center accepts keyboard shortcut variants', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    for (const shortcut of ['Control+K', 'Control+Shift+K', 'Meta+K']) {
      await gotoStable(page, `${BASE_URL}/drugs`);
      await page.keyboard.press(shortcut);

      const dropdown = page.locator('.search-dropdown').first();
      const input = page.locator('.search-input').first();
      await expect(dropdown, shortcut).toBeVisible();
      await expect(input, shortcut).toBeFocused();

      await page.keyboard.press('Escape');
      await expect(dropdown, shortcut).toBeHidden();
    }
  });

  test('v17 disease modal keyboard workflow keeps tabs and quickbar reachable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoStable(page, `${BASE_URL}/urology/stones/urolithiasis`);

    const diagnosticsTab = page.locator('#tab-diagnostics').first();
    const quickbar = page.locator('.modal-mobile-quickbar.is-fixed').first();
    await expect(diagnosticsTab).toBeVisible();
    await expect(quickbar).toBeVisible();

    await diagnosticsTab.focus();
    await expect(diagnosticsTab).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#tabpanel-diagnostics')).toBeVisible();

    const metrics = await page.evaluate(() => {
      const tabs = document.querySelector('.tabs-shell')?.getBoundingClientRect();
      const actions = document.querySelector('.modal-mobile-quickbar.is-fixed')?.getBoundingClientRect();
      return {
        innerHeight: window.innerHeight,
        documentScrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        tabsTop: tabs?.top ?? 999,
        quickbarBottom: actions?.bottom ?? 0,
      };
    });

    expect(metrics.documentScrollWidth, JSON.stringify(metrics)).toBeLessThanOrEqual(metrics.innerWidth + 2);
    expect(metrics.tabsTop).toBeLessThan(165);
    expect(metrics.quickbarBottom).toBeLessThanOrEqual(metrics.innerHeight + 2);
  });

  test('v17.1 iPhone portrait and landscape sticky stack stays isolated', async ({ page }) => {
    test.setTimeout(120000);

    const releaseRoutes = [
      '/',
      '/drugs',
      '/calculators?tool=sperm-tree',
      '/atlas',
      '/urology/stones/urolithiasis',
      '/urology/infections/renal-tuberculosis',
    ];

    for (const viewport of iphoneReleaseViewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      for (const route of releaseRoutes) {
        await gotoStable(page, `${BASE_URL}${route}`);

        const metrics = await page.evaluate(() => {
          const modal = document.querySelector('.modal-content');
          const navbar = document.querySelector('.navbar');
          const navbarRect = navbar?.getBoundingClientRect();
          const navbarStyle = navbar ? window.getComputedStyle(navbar) : null;
          const header = document.querySelector('.modal-header')?.getBoundingClientRect();
          const tabs = document.querySelector('.tabs-shell')?.getBoundingClientRect();
          const actions = document.querySelector('.modal-mobile-quickbar.is-fixed')?.getBoundingClientRect();
          const main = document.querySelector('#main-content, .page-content')?.getBoundingClientRect();
          const title = document.querySelector('.section-title, .service-page-hero h1, .drug-reference-hero h1, .home-destination-card')?.getBoundingClientRect();
          return {
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            documentScrollWidth: document.documentElement.scrollWidth,
            bodyScrollWidth: document.body.scrollWidth,
            hasModal: Boolean(modal),
            navbarVisible: navbarStyle
              ? navbarStyle.visibility !== 'hidden' && Number(navbarStyle.opacity) > 0.05
              : false,
            navbarBottom: navbarRect?.bottom ?? 0,
            headerBottom: header?.bottom ?? 0,
            tabsTop: tabs?.top ?? null,
            tabsBottom: tabs?.bottom ?? null,
            actionsTop: actions?.top ?? null,
            actionsBottom: actions?.bottom ?? null,
            mainTop: main?.top ?? 0,
            titleTop: title?.top ?? null,
          };
        });

        expect(metrics.documentScrollWidth, `${viewport.name} ${route}: ${JSON.stringify(metrics)}`).toBeLessThanOrEqual(metrics.innerWidth + 2);
        expect(metrics.bodyScrollWidth, `${viewport.name} ${route}: ${JSON.stringify(metrics)}`).toBeLessThanOrEqual(metrics.innerWidth + 2);

        if (metrics.hasModal) {
          expect(metrics.navbarVisible, `${viewport.name} ${route}`).toBe(false);
          expect(metrics.tabsTop, `${viewport.name} ${route}`).not.toBeNull();
          expect(metrics.actionsTop, `${viewport.name} ${route}`).not.toBeNull();
          expect(metrics.tabsTop, `${viewport.name} ${route}: ${JSON.stringify(metrics)}`).toBeLessThanOrEqual(6);
          expect(metrics.tabsBottom, `${viewport.name} ${route}: ${JSON.stringify(metrics)}`).toBeLessThan(metrics.innerHeight * 0.62);
          expect(metrics.actionsBottom, `${viewport.name} ${route}: ${JSON.stringify(metrics)}`).toBeLessThanOrEqual(metrics.innerHeight + 2);
          expect(metrics.actionsTop, `${viewport.name} ${route}: ${JSON.stringify(metrics)}`).toBeGreaterThan(metrics.innerHeight - Math.max(146, metrics.innerHeight * 0.34));
          expect(metrics.actionsTop, `${viewport.name} ${route}: ${JSON.stringify(metrics)}`).toBeGreaterThan((metrics.tabsBottom ?? 0) + 12);
        } else {
          expect(metrics.mainTop, `${viewport.name} ${route}`).toBeGreaterThanOrEqual(-1);
          if (metrics.titleTop !== null) {
            expect(metrics.titleTop, `${viewport.name} ${route}: ${JSON.stringify(metrics)}`).toBeGreaterThanOrEqual(metrics.navbarBottom - 10);
          }
        }
      }
    }
  });

  test('v18 tall iPhone disease modal hides app nav and docks actions at viewport bottom', async ({ page }) => {
    await page.setViewportSize({ width: 399, height: 1229 });
    await gotoStable(page, `${BASE_URL}/urology/infections/renal-tuberculosis`);

    await expect(page.locator('.modal-content').first()).toBeVisible();
    await expect(page.locator('.tabs-shell').first()).toBeVisible();
    await expect(page.locator('.modal-mobile-quickbar.is-fixed').first()).toBeVisible();

    await page.evaluate(() => {
      document.querySelector('.modal-content')?.scrollTo({ top: 720, behavior: 'instant' });
    });
    await page.waitForTimeout(180);

    const metrics = await page.evaluate(() => {
      const navbar = document.querySelector('.navbar')?.getBoundingClientRect();
      const header = document.querySelector('.modal-header')?.getBoundingClientRect();
      const tabs = document.querySelector('.tabs-shell')?.getBoundingClientRect();
      const actions = document.querySelector('.modal-mobile-quickbar.is-fixed')?.getBoundingClientRect();
      const firstParagraph = document.querySelector('.modal-tabpanel p')?.getBoundingClientRect();
      const navbarStyle = document.querySelector('.navbar')
        ? window.getComputedStyle(document.querySelector('.navbar'))
        : null;
      return {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        documentScrollWidth: document.documentElement.scrollWidth,
        navbarVisible: navbarStyle
          ? navbarStyle.visibility !== 'hidden' && Number(navbarStyle.opacity) > 0.05
          : false,
        navbarBottom: navbar?.bottom ?? 0,
        headerBottom: header?.bottom ?? 0,
        tabsTop: tabs?.top ?? 0,
        tabsBottom: tabs?.bottom ?? 0,
        actionsTop: actions?.top ?? 0,
        actionsBottom: actions?.bottom ?? 0,
        paragraphBottom: firstParagraph?.bottom ?? 0,
      };
    });

    expect(metrics.documentScrollWidth, JSON.stringify(metrics)).toBeLessThanOrEqual(metrics.innerWidth + 2);
    expect(metrics.navbarVisible, JSON.stringify(metrics)).toBe(false);
    expect(metrics.tabsTop, JSON.stringify(metrics)).toBeLessThanOrEqual(6);
    expect(metrics.actionsBottom, JSON.stringify(metrics)).toBeLessThanOrEqual(metrics.innerHeight + 2);
    expect(metrics.innerHeight - metrics.actionsBottom, JSON.stringify(metrics)).toBeLessThanOrEqual(40);
    expect(metrics.actionsTop, JSON.stringify(metrics)).toBeGreaterThan(metrics.innerHeight - 140);
    expect(metrics.actionsTop, JSON.stringify(metrics)).toBeGreaterThan(metrics.tabsBottom + 320);
  });

  test('v14 clinical 3D atlas is iPhone-safe and links back to disease cards', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoStable(page, `${BASE_URL}/atlas`);

    await expect(page.locator('.clinical-atlas-page')).toBeVisible();
    await expect(page.locator('[data-atlas-model="kidney-ureter-stone"]')).toBeVisible();

    const rail = page.locator('.clinical-atlas-rail').first();
    await rail.evaluate((element) => {
      element.scrollBy({ left: element.scrollWidth - element.clientWidth, behavior: 'instant' });
    });
    await page.locator('[data-atlas-model="testis-varicocele-fertility"]').click();
    await page.locator('.clinical-hotspot-card').nth(1).click();

    const metrics = await page.evaluate(() => {
      const model = document.querySelector('.clinical-model-figure')?.getBoundingClientRect();
      const railElement = document.querySelector('.clinical-atlas-rail');
      return {
        innerWidth: window.innerWidth,
        documentScrollWidth: document.documentElement.scrollWidth,
        modelWidth: model?.width ?? 0,
        railScrollWidth: railElement?.scrollWidth ?? 0,
        railClientWidth: railElement?.clientWidth ?? 0,
        hotspotCount: document.querySelectorAll('.clinical-hotspot-card').length,
      };
    });

    expect(metrics.documentScrollWidth, JSON.stringify(metrics)).toBeLessThanOrEqual(metrics.innerWidth + 2);
    expect(metrics.modelWidth).toBeLessThanOrEqual(metrics.innerWidth);
    expect(metrics.hotspotCount).toBeGreaterThanOrEqual(3);
    expect(metrics.railScrollWidth).toBeGreaterThan(metrics.railClientWidth);

    await page.locator('.atlas-open-route').click();
    await expect(page).toHaveURL(/\/andrology\/fertility\/varicocele$/);
  });

  test('v19 Clinical Workbench remains compact on iPhone 15-17 portrait and landscape', async ({ page }) => {
    const v19Viewports = [
      { width: 393, height: 852 },
      { width: 402, height: 874 },
      { width: 430, height: 932 },
      { width: 852, height: 393 },
      { width: 874, height: 402 },
      { width: 932, height: 430 },
    ];

    for (const viewport of v19Viewports) {
      await page.setViewportSize(viewport);
      await gotoStable(page, `${BASE_URL}/`);
      await expect(page.locator('[data-v19-workbench="true"]')).toBeVisible();

      const metrics = await page.evaluate(() => {
        const workbench = document.querySelector('[data-v19-workbench="true"]')?.getBoundingClientRect();
        const actionRail = document.querySelector('.home-workbench-actions');
        const cards = [...document.querySelectorAll('.home-workbench, .home-destination-card, .home-panel')]
          .map((element) => element.getBoundingClientRect())
          .filter((rect) => rect.width > 0);
        return {
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
          documentScrollWidth: document.documentElement.scrollWidth,
          workbenchTop: workbench?.top ?? 0,
          workbenchHeight: workbench?.height ?? 0,
          actionRailScrollWidth: actionRail?.scrollWidth ?? 0,
          actionRailClientWidth: actionRail?.clientWidth ?? 0,
          overflowCards: cards.filter((rect) => rect.left < -2 || rect.right > window.innerWidth + 2).length,
        };
      });

      expect(metrics.documentScrollWidth, `${viewport.width}x${viewport.height}: ${JSON.stringify(metrics)}`).toBeLessThanOrEqual(metrics.innerWidth + 2);
      expect(metrics.overflowCards, `${viewport.width}x${viewport.height}: ${JSON.stringify(metrics)}`).toBe(0);
      expect(metrics.actionRailScrollWidth, `${viewport.width}x${viewport.height}: ${JSON.stringify(metrics)}`).toBeGreaterThanOrEqual(metrics.actionRailClientWidth);
      if (viewport.width > viewport.height) {
        expect(metrics.workbenchHeight, `${viewport.width}x${viewport.height}: ${JSON.stringify(metrics)}`).toBeLessThan(metrics.innerHeight * 1.6);
      }
    }
  });

  test('v19 drug cockpit and atlas fallback remain iPhone-safe', async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 932 });
    await gotoStable(page, `${BASE_URL}/drugs`);
    await expect(page.locator('[data-v19-drug-cockpit="true"]')).toBeVisible();

    const drugMetrics = await page.evaluate(() => {
      const cockpit = document.querySelector('[data-v19-drug-cockpit="true"]');
      const firstCard = document.querySelector('.drug-card');
      return {
        innerWidth: window.innerWidth,
        documentScrollWidth: document.documentElement.scrollWidth,
        cockpitScrollWidth: cockpit?.scrollWidth ?? 0,
        cockpitClientWidth: cockpit?.clientWidth ?? 0,
        firstClinicalTask: firstCard?.getAttribute('data-clinical-task') || '',
        firstMonitoringPriority: firstCard?.getAttribute('data-monitoring-priority') || '',
      };
    });

    expect(drugMetrics.documentScrollWidth, JSON.stringify(drugMetrics)).toBeLessThanOrEqual(drugMetrics.innerWidth + 2);
    expect(drugMetrics.cockpitScrollWidth).toBeGreaterThanOrEqual(drugMetrics.cockpitClientWidth);
    expect(drugMetrics.firstClinicalTask).not.toBe('');
    expect(drugMetrics.firstMonitoringPriority).not.toBe('');

    await gotoStable(page, `${BASE_URL}/atlas`);
    await expect(page.locator('[data-v19-atlas-fallback="true"]')).toBeVisible();

    const atlasMetrics = await page.evaluate(() => {
      const fallback = document.querySelector('[data-v19-atlas-fallback="true"]')?.getBoundingClientRect();
      return {
        innerWidth: window.innerWidth,
        documentScrollWidth: document.documentElement.scrollWidth,
        fallbackWidth: fallback?.width ?? 0,
      };
    });

    expect(atlasMetrics.documentScrollWidth, JSON.stringify(atlasMetrics)).toBeLessThanOrEqual(atlasMetrics.innerWidth + 2);
    expect(atlasMetrics.fallbackWidth).toBeLessThanOrEqual(atlasMetrics.innerWidth);
  });

  test('v20 Clinical OS keeps global workbench compact on iPhone 15-17', async ({ page }) => {
    for (const viewport of [
      { width: 393, height: 852 },
      { width: 402, height: 874 },
      { width: 430, height: 932 },
      { width: 852, height: 393 },
      { width: 874, height: 402 },
      { width: 932, height: 430 },
    ]) {
      await page.setViewportSize(viewport);
      await gotoStable(page, `${BASE_URL}/drugs`);

      await expect(page.locator('[data-v20-clinical-os="true"]')).toBeVisible();
      await expect(page.locator('[data-v20-drug-cockpit="true"]')).toBeVisible();

      const metrics = await page.evaluate(() => {
        const os = document.querySelector('[data-v20-clinical-os="true"]')?.getBoundingClientRect();
        const rail = document.querySelector('.clinical-os-actions');
        const cockpit = document.querySelector('[data-v20-drug-flow="true"]');
        return {
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
          documentScrollWidth: document.documentElement.scrollWidth,
          osWidth: os?.width ?? 0,
          osTop: os?.top ?? 0,
          railScrollWidth: rail?.scrollWidth ?? 0,
          railClientWidth: rail?.clientWidth ?? 0,
          cockpitScrollWidth: cockpit?.scrollWidth ?? 0,
          cockpitClientWidth: cockpit?.clientWidth ?? 0,
        };
      });

      expect(metrics.documentScrollWidth, `${viewport.width}x${viewport.height}: ${JSON.stringify(metrics)}`).toBeLessThanOrEqual(metrics.innerWidth + 2);
      expect(metrics.osWidth, `${viewport.width}x${viewport.height}: ${JSON.stringify(metrics)}`).toBeLessThanOrEqual(metrics.innerWidth);
      expect(metrics.osTop, `${viewport.width}x${viewport.height}: ${JSON.stringify(metrics)}`).toBeGreaterThanOrEqual(0);
      expect(metrics.railScrollWidth).toBeGreaterThanOrEqual(metrics.railClientWidth);
      expect(metrics.cockpitScrollWidth).toBeGreaterThanOrEqual(metrics.cockpitClientWidth);
    }
  });

  test('v20 disease modal suppresses Clinical OS and keeps fixed stack clean', async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 932 });
    await gotoStable(page, `${BASE_URL}/urology/stones/urolithiasis`);

    await expect(page.locator('.modal-content').first()).toBeVisible();
    await expect(page.locator('[data-v20-clinical-os="true"]')).toHaveCount(0);

    await page.evaluate(() => {
      document.querySelector('.modal-content')?.scrollTo({ top: 920, behavior: 'instant' });
    });
    await page.waitForTimeout(180);

    const metrics = await page.evaluate(() => {
      const tabs = document.querySelector('.tabs-shell')?.getBoundingClientRect();
      const quickbar = document.querySelector('.modal-mobile-quickbar.is-fixed')?.getBoundingClientRect();
      return {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        documentScrollWidth: document.documentElement.scrollWidth,
        tabsTop: tabs?.top ?? 999,
        tabsBottom: tabs?.bottom ?? 999,
        quickbarTop: quickbar?.top ?? 0,
        quickbarBottom: quickbar?.bottom ?? 0,
      };
    });

    expect(metrics.documentScrollWidth, JSON.stringify(metrics)).toBeLessThanOrEqual(metrics.innerWidth + 2);
    expect(metrics.tabsTop, JSON.stringify(metrics)).toBeLessThanOrEqual(6);
    expect(metrics.tabsBottom, JSON.stringify(metrics)).toBeLessThan(metrics.innerHeight / 2);
    expect(metrics.quickbarTop, JSON.stringify(metrics)).toBeGreaterThan(metrics.innerHeight - 150);
    expect(metrics.quickbarBottom, JSON.stringify(metrics)).toBeLessThanOrEqual(metrics.innerHeight + 2);
  });
});

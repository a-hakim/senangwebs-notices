const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs');
const path = require('node:path');

test.beforeEach(async ({ page }) => { await page.goto('/tests/browser/fixture.html'); });

test('modal focus excludes hidden and disabled controls and restores the launcher', async ({ page }) => {
  await page.locator('#launch').focus();
  await page.evaluate(() => {
    document.body.insertAdjacentHTML('beforeend', '<template id="custom"><div data-swn><div data-swn-title></div><div data-swn-body></div><button hidden>Hidden</button><button disabled>Disabled</button><button data-swn-cancel></button><button data-swn-ok></button><button data-swn-close></button></div></template>');
    window.swn = new SWN(); window.result = swn.showConfirm('Continue?', { template: '#custom' });
  });
  await expect(page.locator('[data-swn-cancel]')).toBeFocused();
  await page.keyboard.press('Shift+Tab'); await expect(page.locator('[data-swn-ok]')).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.locator('[data-swn-cancel]')).toBeFocused();
  await expect(page.locator('main')).toHaveAttribute('inert', '');
  await page.locator('[data-swn-ok]').click();
  expect(await page.evaluate(() => window.result)).toBe(true);
  await expect(page.locator('#launch')).toBeFocused();
  await expect(page.locator('main')).not.toHaveAttribute('inert');
});

test('only the top modal handles Escape and lower notices remain scroll locked', async ({ page }) => {
  await page.evaluate(() => {
    document.body.style.overflow = 'scroll';
    window.first = new SWN({ zIndex: 20000 }); window.second = new SWN();
    window.firstResult = first.show('Highest'); window.secondResult = second.show('Lower');
  });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(1);
  await expect(page.getByRole('dialog')).toContainText('Lower');
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('scroll');
});

test('centered modal backdrop receives clicks outside the notice', async ({ page }) => {
  await page.evaluate(() => { window.swn = new SWN(); window.result = swn.fire({ type: 'confirm', body: 'Backdrop', closeOnOverlayClick: true }); });
  await page.locator('[data-swn-overlay]').click({ position: { x: 4, y: 4 } });
  expect((await page.evaluate(() => window.result)).isDismissed).toBe(true);
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('toast stacks span instances and reflow after resize and removal', async ({ page }) => {
  await page.evaluate(() => {
    new SWN().showToast('First', { position: 'top right', zIndex: 15000 });
    new SWN().showToast('Second', { position: 'top right' });
  });
  const toasts = page.getByRole('status');
  await expect(toasts).toHaveCount(2);
  expect(await toasts.first().evaluate(element => element.style.zIndex)).toBe('15001');
  const separated = () => page.evaluate(() => {
    const boxes = [...document.querySelectorAll('[role="status"]')].map(element => element.getBoundingClientRect());
    return boxes[1].top >= boxes[0].bottom + 7;
  });
  await expect.poll(separated).toBe(true);
  await toasts.first().locator('[data-swn-body]').evaluate(element => { element.textContent = 'Long content '.repeat(40); });
  await expect.poll(separated).toBe(true);
  expect((await toasts.first().boundingBox()).width).toBeLessThanOrEqual(400);
  await toasts.first().getByRole('button', { name: 'Close' }).click();
  await expect(toasts).toHaveCount(1);
  await expect.poll(() => toasts.first().evaluate(element => element.getBoundingClientRect().top)).toBe(16);
  await page.locator('#background').click();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
});

test('default toast has compact geometry and leaves background controls usable', async ({ page }) => {
  await page.evaluate(() => { new SWN().showToast('Saved'); });
  const box = await page.getByRole('status').boundingBox();
  expect(box.height).toBeLessThan(200); expect(box.width).toBeLessThan(500);
  await page.locator('#background').click();
  await expect(page.getByRole('status').locator('[data-swn-type="toast"]')).toHaveCount(1);
});

test('default modal keeps its stylesheet width limit on wide screens', async ({ page }) => {
  await page.evaluate(() => { window.swn = new SWN(); window.result = swn.show('Long content '.repeat(100)); });
  expect((await page.locator('[data-swn]').boundingBox()).width).toBeLessThanOrEqual(512);
  await page.getByRole('button', { name: 'OK', exact: true }).click();
});

test('long prompts fit a narrow viewport and controls remain reachable', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 480 });
  await page.evaluate(() => { window.swn = new SWN(); window.result = swn.showPrompt('Long text '.repeat(150), { defaultValue: 'Jane' }); });
  const notice = page.locator('[data-swn]');
  const box = await notice.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(15); expect(box.x + box.width).toBeLessThanOrEqual(305);
  expect(box.y).toBeGreaterThanOrEqual(15); expect(box.height).toBeLessThanOrEqual(448);
  await page.locator('[data-swn-input]').scrollIntoViewIfNeeded();
  const inputBox = await page.locator('[data-swn-input]').boundingBox();
  expect(inputBox.x + inputBox.width).toBeLessThanOrEqual(box.x + box.width);
  await page.screenshot({ path: testInfo.outputPath('narrow-prompt.png') });
  await page.getByRole('button', { name: 'OK', exact: true }).click();
  expect(await page.evaluate(() => window.result)).toBe('Jane');
});

test('custom prompt input respects wrapper padding with full-width utilities', async ({ page }, testInfo) => {
  const example = fs.readFileSync(path.join(__dirname, '../../examples/index.html'), 'utf8');
  const template = example.match(/<template id="default-notice">[\s\S]*?<\/template>/)[0];
  // Tailwind injects utility CSS after the library stylesheet. Reproduce the
  // relevant layout rules locally to keep this regression independent of a CDN.
  await page.addStyleTag({ content: '* { box-sizing: border-box; } .grid { display: grid; } .w-full { width: 100%; } .px-4 { padding-left: 16px; padding-right: 16px; } .px-3 { padding-left: 12px; padding-right: 12px; } .py-2 { padding-top: 8px; padding-bottom: 8px; } .mb-2 { margin-bottom: 8px; } .border-2 { border: 2px solid #ddd; } .rounded-xl { border-radius: 12px; }' });
  await page.evaluate(template => {
    document.body.insertAdjacentHTML('beforeend', template);
    window.swn = new SWN({ template: '#default-notice' });
    window.result = swn.showPrompt('Step 2 of 3: Enter your display name:', { titleText: 'Name', defaultValue: 'User' });
  }, template);
  for (const width of [800, 320]) {
    await page.setViewportSize({ width, height: 480 });
    const spacing = await page.locator('[data-swn-input]').evaluate(input => {
      const field = input.getBoundingClientRect();
      const wrapper = input.parentElement.getBoundingClientRect();
      return { left: field.left - wrapper.left, right: wrapper.right - field.right };
    });
    expect(spacing.left).toBeCloseTo(16, 0);
    expect(spacing.right).toBeCloseTo(16, 0);
    await expect(page.locator('[data-swn-input]')).toHaveValue('User');
    await page.screenshot({ path: testInfo.outputPath(`custom-prompt-${width}.png`) });
  }
  await page.getByRole('button', { name: 'OK', exact: true }).click();
  expect(await page.evaluate(() => window.result)).toBe('User');
});

test('built-in prompt preserves its default input insets', async ({ page }) => {
  await page.evaluate(() => { window.swn = new SWN(); window.result = swn.showPrompt('Name', { defaultValue: 'User' }); });
  const spacing = await page.locator('[data-swn-input]').evaluate(input => {
    const field = input.getBoundingClientRect();
    const notice = input.parentElement.getBoundingClientRect();
    return { left: field.left - notice.left, right: notice.right - field.right };
  });
  expect(spacing.left).toBeCloseTo(16, 0);
  expect(spacing.right).toBeCloseTo(16, 0);
  await page.getByRole('button', { name: 'OK', exact: true }).click();
});

test('native email constraints and custom validation errors are announced and visible', async ({ page }) => {
  await page.evaluate(() => {
    document.body.insertAdjacentHTML('beforeend', '<template id="prompt-custom"><div data-swn><div data-swn-title></div><div data-swn-body></div><input data-swn-input><div data-swn-validation style="display:none"></div><button data-swn-ok></button></div></template>');
    window.swn = new SWN(); window.calls = 0;
    window.result = swn.showPrompt('Email', { template: '#prompt-custom', inputType: 'email', inputAttributes: { required: true }, preConfirm: value => { window.calls++; throw new Error('Custom error'); } });
  });
  await page.getByRole('button', { name: 'OK', exact: true }).click();
  await expect(page.locator('[data-swn-validation]')).toBeVisible();
  expect(await page.evaluate(() => calls)).toBe(0);
  await page.locator('[data-swn-input]').fill('person@example.com');
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-swn-validation]')).toHaveText('Custom error');
  await expect(page.locator('[data-swn-input]')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[data-swn-validation]')).toHaveAttribute('aria-live', 'polite');
});

test('repeated Enter invokes async validation once and destruction ignores late completion', async ({ page }) => {
  await page.evaluate(() => {
    window.calls = 0; window.swn = new SWN();
    window.result = swn.showPrompt('Name', { preConfirm: () => { window.calls++; return new Promise(resolve => { window.complete = resolve; }); } });
  });
  await page.keyboard.press('Enter'); await page.keyboard.press('Enter'); await page.keyboard.press('Enter');
  expect(await page.evaluate(() => calls)).toBe(1);
  await page.evaluate(() => { swn.destroy(); window.other = new SWN(); window.otherResult = other.show('Still open'); complete('late'); });
  expect(await page.evaluate(() => window.result)).toBeNull();
  await expect(page.getByRole('dialog')).toHaveCount(1);
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');
});

test('textarea templates preserve multiline values and Enter does not submit', async ({ page }) => {
  await page.evaluate(() => {
    document.body.insertAdjacentHTML('beforeend', '<template id="custom"><div data-swn><div data-swn-title></div><input data-swn-input><button data-swn-ok></button></div></template>');
    window.swn = new SWN(); window.result = swn.showPrompt('Bio', { template: '#custom', inputType: 'textarea', defaultValue: 'One\nTwo' });
  });
  await expect(page.locator('textarea[data-swn-input]')).toHaveValue('One\nTwo');
  await page.keyboard.press('Enter'); await expect(page.getByRole('dialog')).toHaveCount(1);
  await page.getByRole('button', { name: 'OK', exact: true }).click();
});

test('animated queues do not overlap and close events bubble while connected', async ({ page }) => {
  await page.evaluate(() => {
    window.swn = new SWN({ animation: { type: 'fade', duration: 150 } }); window.events = [];
    document.addEventListener('swn:close', event => events.push(event.target.isConnected));
    window.result = swn.queue([{ body: 'First' }, { body: 'Second' }]);
  });
  await page.getByRole('button', { name: 'OK', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(1);
  await expect(page.getByRole('dialog')).toContainText('Second');
  await page.getByRole('button', { name: 'OK', exact: true }).click();
  expect((await page.evaluate(() => window.result)).length).toBe(2);
  expect(await page.evaluate(() => events)).toEqual([true, true]);
});

test('timer pauses on hover and resumes when leaving', async ({ page }) => {
  await page.evaluate(() => { window.swn = new SWN(); window.result = swn.showToast('Timer', { timer: 1200, timerProgressBar: true }); });
  await page.getByRole('status').hover();
  await page.waitForTimeout(1300); await expect(page.getByRole('status')).toHaveCount(1);
  await page.mouse.move(0, 0);
  await expect(page.getByRole('status')).toHaveCount(0, { timeout: 2000 });
  expect((await page.evaluate(() => window.result)).isDismissed).toBe(true);
});

test('reduced motion disables entry and exit animations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(() => { window.swn = new SWN(); window.result = swn.show('Reduced motion', { animation: { type: 'scale', duration: 10000 } }); });
  expect(await page.locator('[data-swn]').evaluate(element => element.style.transform)).toBe('');
  await page.getByRole('button', { name: 'OK', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('late script loading initializes declarative integration', async ({ page }) => {
  await page.goto('/tests/browser/late.html');
  await page.addScriptTag({ url: '/dist/swn.min.js' });
  await page.locator('[data-swn-trigger]').click();
  await expect(page.getByRole('dialog')).toContainText('Declarative message');
  await expect(page.getByRole('dialog').locator('[data-swn-title]')).toHaveText('Declarative title');
  expect(await page.locator('[data-swn-overlay]').evaluate(element => element.style.opacity)).toBe('0');
  await page.getByRole('button', { name: 'OK', exact: true }).click();
});

test('ESM works directly in a browser and shares ownership with UMD', async ({ page }) => {
  await page.evaluate(async () => {
    const { default: ModuleSWN } = await import('/dist/swn.mjs');
    window.moduleInstance = new ModuleSWN(); window.globalInstance = new SWN();
    window.firstResult = moduleInstance.show('ESM'); window.secondResult = globalInstance.show('UMD');
  });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(1); await expect(page.getByRole('dialog')).toContainText('ESM');
  await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('plain text remains inert and standard prompt markup passes accessibility checks', async ({ page }) => {
  await page.evaluate(() => { window.swn = new SWN(); window.result = swn.showPrompt('<img src=x onerror="window.exploited=true">', { titleText: 'Your name', showCloseButton: true }); });
  await expect(page.locator('[data-swn-body] img')).toHaveCount(0);
  expect(await page.evaluate(() => window.exploited)).toBeUndefined();
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
});

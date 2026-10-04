import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SWN from '../../src/js/swn.js';

const instances = [];
const create = options => { const instance = new SWN(options); instances.push(instance); return instance; };
const control = attribute => attribute === 'container' ? document.querySelector('[data-swn-container]') : document.querySelector('[data-swn-container]')?.querySelector(`[data-swn-${attribute}]`);
const click = attribute => control(attribute).click();
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
beforeEach(() => { document.body.innerHTML = '<button id="launch">Launch</button>'; document.body.style.overflow = 'auto'; });
afterEach(() => {
  for (const instance of instances.splice(0)) { instance.destroy(); instance.uninstall(); }
  vi.useRealTimers();
  document.body.innerHTML = '';
});

describe('results, defaults, and template controls', () => {
  it('keeps default input attributes independent between instances', () => {
    const first = create(); const second = create();
    first.options.inputAttributes.required = true;
    expect(second.options.inputAttributes).toEqual({});
  });
  it('preserves explicit zero, false and empty values and ignores undefined overrides', async () => {
    const swn = create({ bgOpacity: 0, bgBlur: 0, zIndex: 0, titleText: '', inputPlaceholder: '', timer: 0 });
    const result = swn.fire({ body: '<img src=x onerror="window.exploited=true">', titleText: undefined, showCloseButton: true });
    expect(document.querySelector('[data-swn-overlay]').style.opacity).toBe('0');
    expect(control('title').textContent).toBe('');
    expect(control('body').querySelector('img')).toBeNull();
    expect(control('close').hidden).toBe(false);
    click('ok');
    expect(await result).toEqual({ isConfirmed: true, isDismissed: false, value: undefined });
  });
  it('supports trusted HTML without changing the plain text default', async () => {
    const swn = create();
    const result = swn.show('<strong>Trusted</strong>', { html: true });
    expect(control('body').querySelector('strong').textContent).toBe('Trusted');
    click('ok');
    expect(await result).toBeUndefined();
  });
  it('preserves default input values and returns convenience-method result shapes', async () => {
    const swn = create();
    const prompt = swn.showPrompt('Name', { defaultValue: 'Jane' });
    expect(control('input').value).toBe('Jane');
    click('ok');
    expect(await prompt).toBe('Jane');
    const confirm = swn.showConfirm('Continue?');
    click('cancel');
    expect(await confirm).toBe(false);
    const cancelled = swn.showPrompt('Name');
    click('cancel');
    expect(await cancelled).toBeNull();
  });
  it('replaces template inputs with textareas and makes hidden validation visible', async () => {
    document.body.insertAdjacentHTML('beforeend', '<template id="custom"><div data-swn><div data-swn-title></div><input data-swn-input class="custom"><div data-swn-validation class="hidden" style="display:none"></div><button data-swn-ok></button></div></template>');
    const swn = create();
    const promise = swn.fire({ type: 'prompt', template: '#custom', inputType: 'textarea', defaultValue: 'Line one\nLine two', preConfirm: () => { throw new Error('Try again'); } });
    expect(control('input').tagName).toBe('TEXTAREA');
    expect(control('input').value).toBe('Line one\nLine two');
    expect(control('input').className).toBe('custom');
    click('ok');
    expect(control('validation').textContent).toBe('Try again');
    expect(control('validation').hidden).toBe(false);
    expect(control('validation').style.display).toBe('block');
    expect(control('input').getAttribute('aria-invalid')).toBe('true');
    swn.destroy(); await promise;
  });
  it('supports switching a template textarea back to a typed input', async () => {
    document.body.insertAdjacentHTML('beforeend', '<template id="custom"><div data-swn><textarea data-swn-input></textarea><button data-swn-ok></button></div></template>');
    const swn = create();
    const result = swn.showPrompt('Email', { template: '#custom', inputType: 'email', defaultValue: 'a@example.com' });
    expect(control('input').tagName).toBe('INPUT');
    expect(control('input').type).toBe('email');
    click('ok'); expect(await result).toBe('a@example.com');
  });
  it.each([
    ['#bad', '<div id="bad"></div>'],
    ['#bad', '<template id="bad"><div data-swn><button data-swn-ok></button></div></template>'],
    ['#bad', '<template id="bad"><div><input data-swn-input></div></template>'],
    ['[', ''],
  ])('rejects malformed prompt templates before mounting or locking scrolling', async (template, markup) => {
    document.body.insertAdjacentHTML('beforeend', markup);
    await expect(create().showPrompt('Name', { template })).rejects.toThrow();
    expect(document.querySelector('[data-swn-container]')).toBeNull();
    expect(document.body.style.overflow).toBe('auto');
  });
  it.each([{ timer: -1 }, { position: 'outside' }, { bgOpacity: NaN }, { bgOpacity: 2 }, { animation: { duration: -1 } }])('rejects invalid options without leaking UI: %j', async options => {
    await expect(create().fire(options)).rejects.toThrow();
    expect(document.querySelector('[data-swn-overlay-wrapper]')).toBeNull();
    expect(document.body.style.overflow).toBe('auto');
  });
  it('parses declarative zero and empty values and rejects invalid numeric attributes', async () => {
    const trigger = document.getElementById('launch');
    trigger.dataset.swnBgOpacity = '0'; trigger.dataset.swnTitle = ''; trigger.dataset.swnTimer = 'invalid';
    const swn = create();
    const options = swn.getOptionsFromElement(trigger);
    expect(options.bgOpacity).toBe(0); expect(options.titleText).toBe('');
    await expect(swn.fire(options)).rejects.toThrow();
  });
});

describe('validation and lifecycle', () => {
  it.each([
    ['email', 'bad-email', { required: true }],
    ['number', '3', { min: 10 }],
    ['text', '', { required: true }],
  ])('honors native %s constraints before preConfirm', async (inputType, value, inputAttributes) => {
    const preConfirm = vi.fn(); const swn = create();
    const result = swn.showPrompt('Response', { inputType, defaultValue: value, inputAttributes, preConfirm });
    click('ok');
    expect(preConfirm).not.toHaveBeenCalled();
    expect(control('validation').textContent.length).toBeGreaterThan(0);
    expect(swn.openCount).toBe(1);
    swn.destroy(); await result;
  });
  it('prevents overlapping async validation even when Enter is pressed repeatedly', async () => {
    const pending = deferred(); const preConfirm = vi.fn(() => pending.promise);
    const result = create().showPrompt('Number', { preConfirm, defaultValue: '12' });
    for (let count = 0; count < 3; count++) control('input').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(preConfirm).toHaveBeenCalledTimes(1);
    expect(control('ok').disabled).toBe(true);
    pending.resolve(12);
    expect(await result).toBe(12);
  });
  it('recovers from rejected validation and accepts a subsequent attempt', async () => {
    const pending = deferred(); const preConfirm = vi.fn().mockReturnValueOnce(pending.promise).mockReturnValueOnce('valid');
    const result = create().showPrompt('Name', { preConfirm });
    click('ok'); pending.reject(null); await Promise.resolve(); await Promise.resolve();
    expect(control('validation').textContent).toBe('Validation failed.');
    expect(control('ok').disabled).toBe(false);
    click('ok'); expect(await result).toBe('valid');
  });
  it.each(['resolve', 'reject'])('ignores late validation %s after destruction without unlocking another modal', async action => {
    const pending = deferred(); const onClose = vi.fn(); const first = create(); const second = create();
    const result = first.showPrompt('Name', { preConfirm: () => pending.promise, onClose });
    click('ok'); first.destroy(); expect(await result).toBeNull();
    const other = second.show('Still open');
    pending[action](action === 'resolve' ? 'late' : new Error('late'));
    await Promise.resolve(); await Promise.resolve();
    expect(document.body.style.overflow).toBe('hidden');
    expect(second.openCount).toBe(1); expect(onClose).toHaveBeenCalledTimes(1);
    click('ok'); await other; expect(document.body.style.overflow).toBe('auto');
  });
  it('cancels queued steps on destroy and permits later reuse', async () => {
    const swn = create(); const queue = swn.queue([{ body: 'First' }, { body: 'Second' }]);
    swn.destroy();
    expect(await queue).toHaveLength(1); expect(swn.openCount).toBe(0);
    const reused = swn.queue([{ body: 'New queue' }]); click('ok');
    expect(await reused).toHaveLength(1);
  });
  it('continues ordinary queues after a cancelled step', async () => {
    const swn = create(); const queue = swn.queue([{ type: 'confirm', body: 'First' }, { body: 'Second' }]);
    click('cancel'); await Promise.resolve(); await Promise.resolve();
    expect(control('body').textContent).toBe('Second'); click('ok');
    expect((await queue).map(result => result.isConfirmed)).toEqual([false, true]);
  });
  it('cleans up and rejects when onOpen throws', async () => {
    const onClose = vi.fn(); const swn = create();
    await expect(swn.show('Message', { onOpen: () => { throw new Error('hook'); }, onClose })).rejects.toThrow('hook');
    expect(swn.openCount).toBe(0); expect(onClose).toHaveBeenCalledTimes(1);
    expect(document.body.style.overflow).toBe('auto');
  });
  it('settles promises and closes all notices even when onClose throws', async () => {
    const report = vi.spyOn(console, 'error').mockImplementation(() => {});
    const swn = create({ onClose: () => { throw new Error('hook'); } });
    const first = swn.show('First'); const second = swn.show('Second');
    swn.destroy(); await Promise.all([first, second]);
    expect(report).toHaveBeenCalledTimes(2); expect(swn.openCount).toBe(0);
    expect(document.body.style.overflow).toBe('auto');
  });
  it('dispatches submit, cancel and close events while connected, including keyboard submission', async () => {
    const events = []; const listener = event => events.push([event.type, event.target.isConnected]);
    for (const name of ['swn:confirm', 'swn:cancel', 'swn:close']) document.addEventListener(name, listener);
    try {
      const swn = create(); const first = swn.showPrompt('Name');
      control('input').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); await first;
      const second = swn.showConfirm('Continue?'); click('cancel'); await second;
      expect(events).toEqual([['swn:confirm', true], ['swn:close', true], ['swn:cancel', true], ['swn:close', true]]);
    } finally { for (const name of ['swn:confirm', 'swn:cancel', 'swn:close']) document.removeEventListener(name, listener); }
  });
  it('keeps animated exits modal until removal and destroy can finish an exit immediately', async () => {
    vi.useFakeTimers(); const swn = create();
    const result = swn.show('Animated', { animation: { type: 'fade', duration: 100 } });
    click('ok');
    expect(swn.openCount).toBe(1); expect(document.body.style.overflow).toBe('hidden');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(control('ok'));
    await vi.advanceTimersByTimeAsync(100); await result;
    expect(swn.openCount).toBe(0); expect(document.body.style.overflow).toBe('auto');
    const next = swn.show('Animated again', { animation: { type: 'fade', duration: 100 } });
    click('ok'); swn.destroy(); await next;
    expect(swn.openCount).toBe(0);
    await vi.runAllTimersAsync(); expect(document.querySelector('[data-swn-container]')).toBeNull();
  });
  it('pauses and resumes toast timers without duplicating timeouts', async () => {
    vi.useFakeTimers(); const swn = create(); const result = swn.showToast('Saved', { timer: 1000, timerProgressBar: true });
    await vi.advanceTimersByTimeAsync(400);
    const notice = document.querySelector('[data-swn-type="toast"]');
    notice.dispatchEvent(new MouseEvent('mouseenter'));
    await vi.advanceTimersByTimeAsync(2000); expect(swn.openCount).toBe(1);
    notice.dispatchEvent(new MouseEvent('mouseleave'));
    await vi.advanceTimersByTimeAsync(599); expect(swn.openCount).toBe(1);
    await vi.advanceTimersByTimeAsync(1); expect((await result).isDismissed).toBe(true);
  });
});

describe('modal and native integration ownership', () => {
  it('uses pointer trigger attributes even when a button never receives focus', async () => {
    const trigger = document.getElementById('launch'); trigger.dataset.swnTrigger = ''; trigger.dataset.swnTitle = 'Pointer title'; trigger.dataset.swnBgOpacity = '0';
    const swn = create(); swn.install(); let result;
    trigger.addEventListener('click', () => { result = window.confirm('Pointer action'); });
    trigger.click();
    expect(control('title').textContent).toBe('Pointer title');
    expect(document.querySelector('[data-swn-overlay]').style.opacity).toBe('0');
    click('ok'); expect(await result).toBe(true);
  });
  it('restores the original launcher when lower modals are destroyed before the top one', async () => {
    const launch = document.getElementById('launch'); launch.focus();
    const first = create(); const second = create();
    const one = first.show('First'); const two = second.show('Second');
    first.destroy(); await one; second.destroy(); await two;
    expect(document.activeElement).toBe(launch);
  });
  it('Escape closes only the top modal even if a higher z-index notice was created first', async () => {
    const first = create({ zIndex: 20000 }); const second = create();
    const one = first.show('Highest'); const two = second.show('Lower');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await one; expect(second.openCount).toBe(1); expect(document.body.style.overflow).toBe('hidden');
    second.destroy(); await two;
  });
  it('restores preexisting inert/ARIA attributes and focus after the last modal closes', async () => {
    const launch = document.getElementById('launch'); launch.focus();
    const background = document.createElement('aside'); background.setAttribute('inert', ''); background.setAttribute('aria-hidden', 'false'); document.body.appendChild(background);
    const result = create().show('Notice');
    expect(launch.hasAttribute('inert')).toBe(true); expect(background.getAttribute('aria-hidden')).toBe('true');
    const added = document.createElement('button'); document.body.appendChild(added); await Promise.resolve();
    expect(added.hasAttribute('inert')).toBe(true);
    click('ok'); await result;
    expect(launch.hasAttribute('inert')).toBe(false); expect(document.activeElement).toBe(launch);
    expect(background.hasAttribute('inert')).toBe(true); expect(background.getAttribute('aria-hidden')).toBe('false');
    expect(added.hasAttribute('inert')).toBe(false);
  });
  it('cycles through visible enabled controls and provides a focus fallback', async () => {
    document.body.insertAdjacentHTML('beforeend', '<template id="custom"><div data-swn><button hidden>Hidden</button><button disabled>Disabled</button><button data-swn-ok></button></div></template>');
    const result = create().show('Notice', { template: '#custom' });
    expect(document.activeElement).toBe(control('ok'));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(control('ok'));
    control('ok').disabled = true;
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(control('container'));
    instances.at(-1).destroy(); await result;
  });
  it('installs once, supports out-of-order uninstallation, and preserves outside replacements', () => {
    const original = window.alert; const first = create(); const second = create();
    first.install(); const firstAlert = window.alert; first.install(); expect(window.alert).toBe(firstAlert);
    second.install(); const secondAlert = window.alert;
    first.uninstall(); expect(window.alert).toBe(secondAlert);
    second.uninstall(); expect(window.alert).toBe(original);
    first.install(); const external = vi.fn(); window.alert = external;
    first.uninstall(); expect(window.alert).toBe(external);
    window.alert = original;
  });
  it('restores the previous owner when the top native integration uninstalls', () => {
    const original = window.confirm; const first = create(); const second = create();
    first.install(); const installed = window.confirm; second.install(); second.uninstall();
    expect(window.confirm).toBe(installed); first.uninstall(); expect(window.confirm).toBe(original);
  });
  it('keeps toast geometry independent of modal geometry and honors per-call z-index', async () => {
    const first = create(); const second = create();
    const one = first.showToast('First', { position: 'top right', zIndex: 123 });
    const two = second.showToast('Second', { position: 'top right' });
    const containers = document.querySelectorAll('[data-swn-container]');
    expect(containers[0].style.zIndex).toBe('124'); expect(containers[0].style.width).toBe('max-content');
    expect(parseFloat(containers[1].style.top)).toBeGreaterThan(parseFloat(containers[0].style.top));
    expect(document.body.style.overflow).toBe('auto');
    first.destroy(); expect(containers[1].style.top).toBe('16px'); second.destroy(); await Promise.all([one, two]);
  });
});

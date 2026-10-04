import '../css/swn.css';

const DEFAULTS = {
  titleText: 'Notice', buttonText: 'OK', cancelText: 'Cancel', template: null,
  position: 'center', bgColor: '#000000', bgOpacity: 0.5, bgBlur: 0, zIndex: 9999,
  inputPlaceholder: 'Enter your response...', defaultValue: '', inputType: 'text',
  inputAttributes: {}, preConfirm: null, closeOnOverlayClick: false,
  showCloseButton: false, animation: null, timer: null, timerProgressBar: false,
  html: false, onOpen: null, onClose: null,
};
const TYPES = ['alert', 'confirm', 'prompt', 'toast'];
const POSITIONS = ['center', 'top', 'top left', 'top right', 'bottom', 'bottom left', 'bottom right', 'left', 'right'];
const ANIMATIONS = ['fade', 'slide-up', 'slide-down', 'scale'];
const INPUT_TYPES = ['text', 'email', 'password', 'number', 'textarea'];
const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
// Share ownership across instances AND concurrently loaded UMD/ESM/CJS builds.
const stateKey = Symbol.for('senangwebs-notices.v2.state');
const shared = globalThis[stateKey] || (globalThis[stateKey] = { id: 0, documents: new WeakMap() });

function requireDocument() {
  if (typeof document === 'undefined' || !document.body) {
    throw new Error('SWN requires a browser document with a body to display or install notices.');
  }
  return document;
}

function stateFor(doc) {
  if (!shared.documents.has(doc)) {
    shared.documents.set(doc, {
      notices: [], isolated: new Map(), overflow: null, observer: null, returnFocus: null,
      owners: [], originals: null, autoInstance: null, trigger: null, triggerTimer: null, captureTrigger: null,
    });
  }
  return shared.documents.get(doc);
}

function normalizeOptions(base, options = {}) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new TypeError('SWN options must be an object.');
  const result = { ...base };
  for (const key of Object.keys(options)) {
    if (options[key] !== undefined) result[key] = options[key];
  }
  if (!POSITIONS.includes(result.position)) throw new TypeError('Unsupported SWN position.');
  if (!INPUT_TYPES.includes(result.inputType)) throw new TypeError('Unsupported SWN inputType.');
  for (const key of ['bgOpacity', 'bgBlur', 'zIndex']) {
    if (!Number.isFinite(result[key])) throw new TypeError(`SWN ${key} must be a finite number.`);
  }
  if (result.bgOpacity < 0 || result.bgOpacity > 1 || result.bgBlur < 0) throw new RangeError('Invalid SWN overlay options.');
  if (result.timer !== null && (!Number.isFinite(result.timer) || result.timer < 0)) throw new RangeError('SWN timer must be a nonnegative number or null.');
  if (!result.inputAttributes || typeof result.inputAttributes !== 'object' || Array.isArray(result.inputAttributes)) throw new TypeError('SWN inputAttributes must be an object.');
  result.inputAttributes = { ...result.inputAttributes };
  for (const key of ['preConfirm', 'onOpen', 'onClose']) {
    if (result[key] !== null && typeof result[key] !== 'function') throw new TypeError(`SWN ${key} must be a function or null.`);
  }
  if (result.template !== null && typeof result.template !== 'string') throw new TypeError('SWN template must be a selector or null.');
  if (result.animation !== null) {
    if (!result.animation || typeof result.animation !== 'object') throw new TypeError('SWN animation must be an object or null.');
    result.animation = { type: 'fade', duration: 200, ...result.animation };
    if (!ANIMATIONS.includes(result.animation.type) || !Number.isFinite(result.animation.duration) || result.animation.duration < 0) throw new TypeError('Invalid SWN animation.');
  }
  return result;
}

function createResult(isConfirmed, value) {
  return { isConfirmed, isDismissed: !isConfirmed, value };
}

function topModal(state) {
  return state.notices.filter(item => item.type !== 'toast' && !item.finished)
    .sort((a, b) => b.currentOptions.zIndex - a.currentOptions.zIndex || b.id - a.id)[0];
}

function focusables(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE)).filter(element => {
    if (element.disabled || element.tabIndex < 0 || element.closest('[hidden], [inert], [aria-hidden="true"]')) return false;
    for (let ancestor = element; ancestor && ancestor !== container.parentElement; ancestor = ancestor.parentElement) {
      const style = container.ownerDocument.defaultView.getComputedStyle(ancestor);
      if (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse') return false;
    }
    return true;
  });
}

function focusNotice(item) {
  const candidates = focusables(item.container);
  const input = item.type === 'prompt' ? item.container.querySelector('[data-swn-input]') : null;
  const target = candidates.includes(item.lastFocused) ? item.lastFocused : candidates.includes(input) ? input : candidates[0] || item.container;
  target.focus({ preventScroll: true });
}

function restoreIsolation(state, element) {
  const saved = state.isolated.get(element);
  if (!saved) return;
  if (saved.inert === null) element.removeAttribute('inert'); else element.setAttribute('inert', saved.inert);
  if (saved.ariaHidden === null) element.removeAttribute('aria-hidden'); else element.setAttribute('aria-hidden', saved.ariaHidden);
  state.isolated.delete(element);
}

function syncModals(doc, state) {
  const top = topModal(state);
  if (!top) {
    for (const element of Array.from(state.isolated.keys())) restoreIsolation(state, element);
    if (state.overflow !== null) {
      doc.body.style.overflow = state.overflow;
      state.overflow = null;
    }
    state.observer?.disconnect();
    state.observer = null;
    state.returnFocus = null;
    return;
  }
  if (state.overflow === null) {
    state.overflow = doc.body.style.overflow;
    doc.body.style.overflow = 'hidden';
    state.observer = new doc.defaultView.MutationObserver(() => syncModals(doc, state));
    state.observer.observe(doc.body, { childList: true });
  }
  restoreIsolation(state, top.overlay);
  if (!top.container.contains(doc.activeElement)) focusNotice(top);
  for (const element of doc.body.children) {
    if (element === top.overlay || ['SCRIPT', 'STYLE', 'TEMPLATE', 'LINK'].includes(element.tagName)) continue;
    if (!state.isolated.has(element)) state.isolated.set(element, { inert: element.getAttribute('inert'), ariaHidden: element.getAttribute('aria-hidden') });
    element.setAttribute('inert', '');
    element.setAttribute('aria-hidden', 'true');
  }
}

function toastPosition(position) {
  return position === 'center' ? 'top' : position === 'left' ? 'top left' : position === 'right' ? 'top right' : position;
}

function repositionToasts(state) {
  const offsets = new Map();
  for (const item of state.notices) {
    if (item.type !== 'toast' || item.finished) continue;
    const position = toastPosition(item.currentOptions.position);
    const offset = offsets.get(position) || 0;
    Object.assign(item.container.style, item.owner._getToastPositionStyles(position, offset, item.currentOptions.zIndex));
    offsets.set(position, offset + (item.container.getBoundingClientRect().height || 60) + 8);
  }
}

function element(doc, tag, attribute) {
  const node = doc.createElement(tag);
  if (attribute) node.setAttribute(attribute, '');
  if (tag === 'button') node.type = 'button';
  return node;
}

function reportCloseError(doc, error) {
  // User hooks cannot prevent another instance from releasing its resources.
  doc.defaultView.console.error('SWN onClose callback failed:', error);
}

class SWN {
  constructor(options = {}) {
    this.options = normalizeOptions(DEFAULTS, options);
    this.originalAlert = typeof window === 'undefined' ? undefined : window.alert;
    this.originalConfirm = typeof window === 'undefined' ? undefined : window.confirm;
    this.originalPrompt = typeof window === 'undefined' ? undefined : window.prompt;
    this._activeOverlays = [];
    this._queueGeneration = 0;
    this._installation = null;
  }

  get openCount() { return this._activeOverlays.length; }
  _generateId() { return ++shared.id; }
  applyStyles(node, styles) { Object.assign(node.style, styles); }

  _getAnimationStyles(animation) {
    if (!animation) return { enter: {}, active: {}, exit: {} };
    const duration = animation.duration ?? 200;
    const transform = { 'slide-up': 'translateY(20px)', 'slide-down': 'translateY(-20px)', scale: 'scale(0.9)' }[animation.type];
    const enter = { opacity: '0', transition: `opacity ${duration}ms ease, transform ${duration}ms ease` };
    const active = { opacity: '1' };
    if (transform) { enter.transform = transform; active.transform = 'none'; }
    return { enter, active, exit: { ...enter } };
  }

  _getToastPositionStyles(position, offset = 0, zIndex = this.options.zIndex) {
    position = toastPosition(position);
    const bottom = position.startsWith('bottom');
    const styles = {
      position: 'fixed', display: 'flex', width: 'max-content', maxWidth: 'calc(100% - 32px)',
      top: bottom ? 'auto' : `${16 + offset}px`, bottom: bottom ? `${16 + offset}px` : 'auto',
      left: 'auto', right: 'auto', transform: 'none', zIndex: String(zIndex + 1),
    };
    if (position.endsWith('left')) styles.left = '16px';
    else if (position.endsWith('right')) styles.right = '16px';
    else { styles.left = '50%'; styles.transform = 'translateX(-50%)'; }
    return styles;
  }

  getPositionStyles(position) {
    const vertical = position.startsWith('top') ? 'flex-start' : position.startsWith('bottom') ? 'flex-end' : 'center';
    const horizontal = position.includes('left') ? 'flex-start' : position.includes('right') ? 'flex-end' : 'center';
    return {
      position: 'fixed', inset: '0', display: 'flex', boxSizing: 'border-box', padding: '16px',
      alignItems: vertical, justifyContent: horizontal, pointerEvents: 'none',
    };
  }

  createOverlay(options) {
    const doc = requireDocument();
    const wrapper = element(doc, 'div', 'data-swn-overlay-wrapper');
    this.applyStyles(wrapper, { position: 'fixed', inset: '0', zIndex: String(options.zIndex) });
    const overlay = element(doc, 'div', 'data-swn-overlay');
    this.applyStyles(overlay, {
      position: 'absolute', inset: '0', backgroundColor: options.bgColor, opacity: String(options.bgOpacity),
    });
    if (options.bgBlur > 0) this.applyStyles(wrapper, { backdropFilter: `blur(${options.bgBlur}px)`, WebkitBackdropFilter: `blur(${options.bgBlur}px)` });
    wrapper.appendChild(overlay);
    return wrapper;
  }

  _applyInputAttributes(input, attributes) {
    for (const [key, value] of Object.entries(attributes)) {
      if (value === false || value === null || value === undefined) input.removeAttribute(key);
      else input.setAttribute(key, value === true ? '' : String(value));
    }
  }

  _createInput(type, options) {
    const input = element(requireDocument(), type === 'textarea' ? 'textarea' : 'input', 'data-swn-input');
    if (type !== 'textarea') input.type = type;
    this._applyInputAttributes(input, options.inputAttributes);
    input.placeholder = options.inputPlaceholder;
    input.value = String(options.defaultValue ?? '');
    return input;
  }

  createNoticeElement(message, type, options) {
    const doc = requireDocument();
    const isToast = type === 'toast';
    const container = element(doc, 'div', 'data-swn-container');
    container.setAttribute('tabindex', '-1');
    container.setAttribute('role', isToast ? 'status' : 'dialog');
    if (isToast) { container.setAttribute('aria-live', 'polite'); container.setAttribute('aria-atomic', 'true'); }
    else container.setAttribute('aria-modal', 'true');
    this.applyStyles(container, isToast ? this._getToastPositionStyles(options.position, 0, options.zIndex) : { ...this.getPositionStyles(options.position), zIndex: '1' });

    const selector = options.template || ({ prompt: '#prompt-template', confirm: '#confirm-template', toast: '#toast-template' }[type]);
    const template = selector ? doc.querySelector(selector) : null;
    if (template && template.tagName !== 'TEMPLATE') throw new TypeError('SWN template selector must identify a <template>.');
    let notice;
    if (template) {
      const fragment = template.content.cloneNode(true);
      const roots = fragment.querySelectorAll('[data-swn]');
      if (roots.length !== 1 || roots[0].parentNode !== fragment || fragment.children.length !== 1) throw new TypeError('SWN templates require exactly one top-level [data-swn] element.');
      notice = roots[0];
      container.appendChild(fragment);
      if (!isToast && !notice.querySelector('[data-swn-ok]')) throw new TypeError('SWN modal templates require a [data-swn-ok] control.');
      if (type === 'prompt' && !notice.querySelector('input[data-swn-input], textarea[data-swn-input]')) throw new TypeError('SWN prompt templates require an input or textarea with [data-swn-input].');
    } else {
      notice = element(doc, 'div', 'data-swn');
      notice.setAttribute('data-swn-built-in', '');
      notice.append(element(doc, 'div', 'data-swn-title'), element(doc, 'div', 'data-swn-body'));
      if (type === 'prompt') notice.appendChild(this._createInput(options.inputType, options));
      if (!isToast) {
        const buttons = element(doc, 'div', 'data-swn-buttons');
        if (type === 'confirm' || type === 'prompt') buttons.appendChild(element(doc, 'button', 'data-swn-cancel'));
        buttons.appendChild(element(doc, 'button', 'data-swn-ok'));
        notice.appendChild(buttons);
      }
      container.appendChild(notice);
    }
    this.applyStyles(notice, { pointerEvents: 'auto', maxHeight: 'calc(100dvh - 32px)', overflowY: 'auto', minWidth: `min(${isToast ? 240 : 280}px, calc(100vw - 32px))` });
    notice.setAttribute('data-swn-type', type);
    for (const [key, value] of Object.entries({ position: options.position, 'bg-color': options.bgColor, 'bg-opacity': options.bgOpacity, 'bg-blur': options.bgBlur, 'z-index': options.zIndex })) notice.setAttribute(`data-swn-${key}`, String(value));
    const id = this._generateId();
    const title = notice.querySelector('[data-swn-title]');
    const body = notice.querySelector('[data-swn-body]');
    if (title) { title.textContent = options.titleText; title.id = `swn-title-${id}`; }
    if (body) {
      if (options.html) body.innerHTML = message; else body.textContent = message;
      body.id = `swn-body-${id}`;
    }
    if (!isToast) {
      if (title && String(options.titleText).trim()) container.setAttribute('aria-labelledby', title.id);
      else container.setAttribute('aria-label', String(options.titleText || 'Notice'));
      if (body) container.setAttribute('aria-describedby', body.id);
    }
    const ok = notice.querySelector('[data-swn-ok]');
    const cancel = notice.querySelector('[data-swn-cancel]');
    if (ok && !isToast) { ok.textContent = options.buttonText; if (ok.tagName === 'BUTTON') ok.type = 'button'; }
    if (cancel) {
      cancel.hidden = !['confirm', 'prompt'].includes(type);
      if (!cancel.hidden) { cancel.textContent = options.cancelText; cancel.style.display = ''; }
      if (cancel.tagName === 'BUTTON') cancel.type = 'button';
    }
    let input = notice.querySelector('[data-swn-input]');
    if (type === 'prompt') {
      const tag = options.inputType === 'textarea' ? 'TEXTAREA' : 'INPUT';
      if (input.tagName !== tag) {
        const replacement = element(doc, tag.toLowerCase(), 'data-swn-input');
        for (const attr of input.attributes) if (attr.name !== 'type') replacement.setAttribute(attr.name, attr.value);
        input.replaceWith(replacement);
        input = replacement;
      }
      if (tag === 'INPUT') input.type = options.inputType;
      this._applyInputAttributes(input, options.inputAttributes);
      input.value = String(options.defaultValue ?? '');
      input.placeholder = options.inputPlaceholder;
      input.hidden = false;
      input.style.display = '';
      if (!input.id) input.id = `swn-input-${id}`;
      if (!input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby') && !notice.querySelector(`label[for="${input.id.replace(/"/g, '\\"')}"]`)) input.setAttribute('aria-label', String(options.titleText || options.inputPlaceholder || 'Response'));
      if (body) input.setAttribute('aria-describedby', [input.getAttribute('aria-describedby'), body.id].filter(Boolean).join(' '));
      let validation = notice.querySelector('[data-swn-validation]');
      if (!validation) { validation = element(doc, 'div', 'data-swn-validation'); input.after(validation); }
      validation.id = `swn-validation-${id}`;
      validation.textContent = '';
      validation.hidden = true;
      validation.setAttribute('aria-live', 'polite');
      input.setAttribute('aria-describedby', [input.getAttribute('aria-describedby'), validation.id].filter(Boolean).join(' '));
    } else if (input) input.hidden = true;
    let close = notice.querySelector('[data-swn-close]');
    if (!close && (options.showCloseButton || isToast)) { close = element(doc, 'button', 'data-swn-close'); close.textContent = '\u00d7'; notice.appendChild(close); }
    if (close) { close.hidden = !options.showCloseButton && !isToast; close.setAttribute('aria-label', close.getAttribute('aria-label') || 'Close'); if (close.tagName === 'BUTTON') close.type = 'button'; }
    let bar = notice.querySelector('[data-swn-timer-bar]');
    if (!bar && options.timerProgressBar) { bar = element(doc, 'div', 'data-swn-timer-bar'); notice.appendChild(bar); }
    if (bar) { bar.hidden = !options.timerProgressBar || !options.timer; bar.setAttribute('aria-hidden', 'true'); }
    return { container };
  }

  show(message, options = {}) { return this._showInternal(message, 'alert', options).then(() => undefined); }
  showConfirm(message, options = {}) { return this._showInternal(message, 'confirm', options).then(result => result.isConfirmed); }
  showPrompt(message, options = {}) { return this._showInternal(message, 'prompt', options).then(result => result.isConfirmed ? result.value : null); }
  showToast(message, options = {}) { return this._showInternal(message, 'toast', options); }
  showNotice(message, type, options = {}) {
    return this._showInternal(message, type, options).then(result => type === 'alert' ? undefined : type === 'confirm' ? result.isConfirmed : type === 'prompt' ? result.isConfirmed ? result.value : null : result);
  }
  fire(options = {}) {
    if (!options || typeof options !== 'object' || Array.isArray(options)) return Promise.reject(new TypeError('SWN fire options must be an object.'));
    const { type = 'alert', body, message = '', ...callOptions } = options;
    return this._showInternal(body !== undefined ? body : message, type, callOptions);
  }
  async queue(steps) {
    if (!Array.isArray(steps)) throw new TypeError('SWN queue steps must be an array.');
    const generation = this._queueGeneration;
    const results = [];
    for (const step of steps) {
      if (generation !== this._queueGeneration) break;
      results.push(await this.fire(step));
    }
    return results;
  }

  _showInternal(message, type, callOptions) {
    return new Promise((resolve, reject) => {
      const doc = requireDocument();
      if (!TYPES.includes(type)) throw new TypeError('Unsupported SWN notice type.');
      const options = normalizeOptions(this.options, callOptions);
      const { container } = this.createNoticeElement(message, type, options);
      const state = stateFor(doc);
      const isToast = type === 'toast';
      const notice = container.querySelector('[data-swn]');
      const overlay = isToast ? null : this.createOverlay(options);
      const input = container.querySelector('[data-swn-input]');
      const ok = container.querySelector('[data-swn-ok]');
      const validation = container.querySelector('[data-swn-validation]');
      const bar = container.querySelector('[data-swn-timer-bar]');
      const animation = options.animation && !doc.defaultView.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? options.animation : null;
      const item = {
        id: this._generateId(), owner: this, overlay, container, currentOptions: options, type,
        previousActiveElement: doc.activeElement, lastFocused: null, closing: false, finished: false,
        timerId: null, exitTimer: null, resizeObserver: null, frames: new Set(), listeners: [], pending: false,
      };
      const listen = (target, event, handler, capture = false) => {
        target.addEventListener(event, handler, capture);
        item.listeners.push(() => target.removeEventListener(event, handler, capture));
      };
      const frame = callback => {
        const id = doc.defaultView.requestAnimationFrame(() => { item.frames.delete(id); if (!item.closing) callback(); });
        item.frames.add(id);
      };
      let finalResult;
      let finalError;
      const finish = () => {
        if (item.finished) return;
        item.finished = true;
        clearTimeout(item.exitTimer);
        for (const remove of item.listeners) remove();
        item.listeners = [];
        this._dispatchEvent(container, 'swn:close', { type });
        (overlay || container).remove();
        restoreIsolation(state, overlay || container);
        state.notices = state.notices.filter(other => other !== item);
        this._activeOverlays = this._activeOverlays.filter(other => other !== item);
        const returnFocus = state.returnFocus;
        syncModals(doc, state);
        if (!isToast && !topModal(state) && returnFocus?.isConnected && !returnFocus.closest('[inert]')) returnFocus.focus({ preventScroll: true });
        repositionToasts(state);
        if (finalError) reject(finalError); else resolve(finalResult);
        try { options.onClose?.(); } catch (error) { reportCloseError(doc, error); }
      };
      const finalize = (result, reason, immediate = false, error) => {
        if (item.closing) { if (immediate) finish(); return; }
        item.closing = true;
        finalResult = result;
        finalError = error;
        clearTimeout(item.timerId);
        for (const id of item.frames) doc.defaultView.cancelAnimationFrame(id);
        item.frames.clear();
        item.resizeObserver?.disconnect();
        if (reason === 'cancel') this._dispatchEvent(container, 'swn:cancel', { type });
        if (animation && animation.duration > 0 && !immediate) {
          this.applyStyles(notice, this._getAnimationStyles(animation).exit);
          item.exitTimer = setTimeout(finish, animation.duration);
        } else finish();
      };
      const dismissed = () => createResult(false, type === 'prompt' ? null : type === 'confirm' ? false : undefined);
      item.dismiss = (reason, immediate = false) => finalize(dismissed(), reason, immediate);
      const showValidation = error => {
        if (item.closing) return;
        item.pending = false;
        if (ok) { ok.disabled = false; ok.textContent = options.buttonText; }
        container.removeAttribute('aria-busy');
        if (validation) {
          validation.textContent = error?.message || String(error ?? 'Validation failed.');
          validation.hidden = false;
          validation.style.display = 'block';
        }
        input?.setAttribute('aria-invalid', 'true');
      };
      const confirm = () => {
        if (item.closing || item.pending || (!isToast && topModal(state) !== item)) return;
        item.pending = true;
        this._dispatchEvent(container, 'swn:confirm', { type });
        if (item.closing) return;
        if (type === 'prompt' && !input.checkValidity()) { showValidation(new Error(input.validationMessage)); return; }
        input?.removeAttribute('aria-invalid');
        if (validation) { validation.textContent = ''; validation.hidden = true; }
        const value = type === 'prompt' ? input.value : type === 'confirm' ? true : undefined;
        if (type !== 'prompt' || !options.preConfirm) { finalize(createResult(true, value), 'confirm'); return; }
        let validated;
        try { validated = options.preConfirm(value); } catch (error) { showValidation(error); return; }
        if (item.closing) return;
        if (validated && typeof validated.then === 'function') {
          if (ok) { ok.disabled = true; ok.textContent = '...'; }
          container.setAttribute('aria-busy', 'true');
          Promise.resolve(validated).then(result => {
            if (!item.closing) finalize(createResult(true, result === undefined ? value : result), 'confirm');
          }, showValidation);
        } else finalize(createResult(true, validated === undefined ? value : validated), 'confirm');
      };

      try {
        if (!isToast && !topModal(state)) state.returnFocus = item.previousActiveElement;
        this._activeOverlays.push(item);
        state.notices.push(item);
        if (overlay) { overlay.appendChild(container); doc.body.appendChild(overlay); }
        else doc.body.appendChild(container);
        if (!isToast) {
          listen(doc, 'keydown', event => {
            if (topModal(state) !== item || event.defaultPrevented) return;
            if (event.key === 'Escape') { event.preventDefault(); if (!item.closing) item.dismiss('esc'); }
            if (event.key !== 'Tab') return;
            const candidates = focusables(container);
            const first = candidates[0] || container;
            const last = candidates[candidates.length - 1] || container;
            if (!candidates.length || !container.contains(doc.activeElement) || (event.shiftKey && doc.activeElement === first) || (!event.shiftKey && doc.activeElement === last) || doc.activeElement === container) {
              event.preventDefault(); (event.shiftKey ? last : first).focus();
            }
          });
          listen(doc, 'focusin', event => {
            if (topModal(state) !== item) return;
            if (container.contains(event.target)) item.lastFocused = event.target;
            else focusNotice(item);
          });
          if (options.closeOnOverlayClick) listen(overlay, 'click', event => {
            if (topModal(state) === item && (event.target === overlay || event.target.hasAttribute('data-swn-overlay'))) item.dismiss('overlay');
          });
        }
        if (ok && !isToast) listen(ok, 'click', confirm);
        const cancel = container.querySelector('[data-swn-cancel]');
        if (cancel) listen(cancel, 'click', () => item.dismiss('cancel'));
        const close = container.querySelector('[data-swn-close]');
        if (close) listen(close, 'click', () => item.dismiss('close'));
        if (input && type === 'prompt') listen(input, 'keydown', event => {
          if (event.key === 'Enter' && !event.isComposing && input.tagName !== 'TEXTAREA') { event.preventDefault(); confirm(); }
        });
        if (animation) {
          const styles = this._getAnimationStyles(animation);
          this.applyStyles(notice, styles.enter);
          frame(() => frame(() => this.applyStyles(notice, styles.active)));
        }
        syncModals(doc, state);
        repositionToasts(state);
        if (isToast) {
          if (doc.defaultView.ResizeObserver) {
            item.resizeObserver = new doc.defaultView.ResizeObserver(() => repositionToasts(state));
            item.resizeObserver.observe(container);
          }
          listen(doc.defaultView, 'resize', () => repositionToasts(state));
        }
        if (options.timer > 0) {
          let remaining = options.timer;
          let started = 0;
          let hovered = false;
          let focused = false;
          const resume = () => {
            if (item.closing || item.timerId !== null || hovered || focused) return;
            started = Date.now();
            item.timerId = setTimeout(() => item.dismiss('timer'), remaining);
            if (bar && options.timerProgressBar) frame(() => { if (item.timerId !== null) { bar.style.transition = `width ${remaining}ms linear`; bar.style.width = '0%'; } });
          };
          const pause = () => {
            if (item.timerId === null) return;
            clearTimeout(item.timerId); item.timerId = null;
            remaining = Math.max(0, remaining - (Date.now() - started));
            if (bar && options.timerProgressBar) {
              bar.style.transition = 'none';
              bar.style.width = `${remaining / options.timer * 100}%`;
            }
          };
          if (bar && options.timerProgressBar) { bar.classList.add('swn-timer-active'); bar.style.width = '100%'; }
          item.pauseTimer = pause; item.resumeTimer = resume;
          listen(notice, 'mouseenter', () => { hovered = true; pause(); });
          listen(notice, 'mouseleave', () => { hovered = false; resume(); });
          listen(notice, 'focusin', () => { focused = true; pause(); });
          listen(notice, 'focusout', event => { if (!notice.contains(event.relatedTarget)) { focused = false; resume(); } });
          // Initial modal focus does not pause an auto-dismiss timer until focus moves.
          resume();
        }
        this._dispatchEvent(container, 'swn:open', { type });
        if (!item.closing) options.onOpen?.();
      } catch (error) {
        finalize(dismissed(), 'error', true, error);
      }
    });
  }

  _repositionToasts() { if (typeof document !== 'undefined') repositionToasts(stateFor(document)); }
  _dispatchEvent(node, name, detail) { node.dispatchEvent(new node.ownerDocument.defaultView.CustomEvent(name, { bubbles: true, detail })); }
  destroy() {
    this._queueGeneration++;
    for (const item of [...this._activeOverlays].reverse()) item.dismiss('destroy', true);
  }

  getOptionsFromElement(node) {
    const options = {};
    const strings = { swnTitle: 'titleText', swnOkText: 'buttonText', swnCancelText: 'cancelText', swnTemplate: 'template', swnPosition: 'position', swnBgColor: 'bgColor', swnInputType: 'inputType' };
    const numbers = { swnBgOpacity: 'bgOpacity', swnBgBlur: 'bgBlur', swnZIndex: 'zIndex', swnTimer: 'timer' };
    const booleans = { swnCloseOnOverlayClick: 'closeOnOverlayClick', swnShowCloseButton: 'showCloseButton', swnHtml: 'html', swnTimerProgressBar: 'timerProgressBar' };
    for (const [key, option] of Object.entries(strings)) if (node.dataset[key] !== undefined) options[option] = node.dataset[key];
    for (const [key, option] of Object.entries(numbers)) if (node.dataset[key] !== undefined) options[option] = node.dataset[key].trim() ? Number(node.dataset[key]) : NaN;
    for (const [key, option] of Object.entries(booleans)) if (node.dataset[key] !== undefined) options[option] = node.dataset[key] === 'true';
    if (node.dataset.swnAnimation !== undefined) {
      try { options.animation = JSON.parse(node.dataset.swnAnimation); } catch { options.animation = { type: node.dataset.swnAnimation }; }
    }
    return options;
  }

  install() {
    const doc = requireDocument();
    const state = stateFor(doc);
    if (this._installation) return;
    const win = doc.defaultView;
    if (!state.owners.length) {
      state.originals = { alert: win.alert, confirm: win.confirm, prompt: win.prompt };
      // Safari does not focus buttons on pointer clicks. Capture the trigger for
      // the current event rather than relying exclusively on activeElement.
      state.captureTrigger = event => {
        const trigger = event.composedPath().find(node => node?.hasAttribute?.('data-swn-trigger'));
        state.trigger = trigger ? { node: trigger, event } : null;
        win.clearTimeout(state.triggerTimer);
        state.triggerTimer = win.setTimeout(() => { state.trigger = null; state.triggerTimer = null; }, 0);
      };
      doc.addEventListener('click', state.captureTrigger, true);
    }
    const getOptions = () => {
      const trigger = state.trigger?.event.eventPhase ? state.trigger.node : doc.activeElement?.closest('[data-swn-trigger]');
      return trigger ? this.getOptionsFromElement(trigger) : {};
    };
    const handlers = {
      alert: message => this.show(message, getOptions()),
      confirm: message => this.showConfirm(message, getOptions()),
      prompt: (message, defaultValue = '') => this.showPrompt(message, { defaultValue, ...getOptions() }),
    };
    const installation = { owner: this, handlers, doc };
    state.owners.push(installation);
    Object.assign(win, handlers);
    this._installation = installation;
  }

  uninstall() {
    const installation = this._installation;
    if (!installation) return;
    const state = stateFor(installation.doc);
    state.owners = state.owners.filter(item => item !== installation);
    const replacement = state.owners[state.owners.length - 1]?.handlers || state.originals;
    for (const key of ['alert', 'confirm', 'prompt']) {
      if (installation.doc.defaultView[key] === installation.handlers[key]) installation.doc.defaultView[key] = replacement[key];
    }
    if (!state.owners.length) {
      state.originals = null;
      installation.doc.removeEventListener('click', state.captureTrigger, true);
      installation.doc.defaultView.clearTimeout(state.triggerTimer);
      state.captureTrigger = null; state.trigger = null; state.triggerTimer = null;
    }
    this._installation = null;
  }
}

function autoInitialize() {
  if (typeof document === 'undefined' || !document.body) return;
  const state = stateFor(document);
  if (state.autoInstance || !document.querySelector('[data-swn-trigger]')) return;
  if (!Array.from(document.querySelectorAll('template')).some(template => template.content.querySelector('[data-swn]'))) return;
  state.autoInstance = new SWN();
  // Explicit integrations retain ownership if they were installed before DOM ready.
  if (!state.owners.length) state.autoInstance.install();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoInitialize, { once: true });
  else autoInitialize();
}

export default SWN;

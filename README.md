# SenangWebs Notices (SWN)

SenangWebs Notices (SWN) is a lightweight JavaScript library that replaces native browser dialogs (alert, confirm, prompt) with customizable, modern-looking notifications. It provides a flexible way to create stylish modal dialogs, toasts, and prompts with various positioning options, animations, and a template-driven design.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.md)

## Features

- Replace native browser dialogs (alert, confirm, prompt) with customizable alternatives
- **Toast notifications** — non-blocking, auto-dismissing, stackable toasts
- **`fire()` API** — SweetAlert2-style structured result objects
- **`queue()`** — display notices sequentially
- Multiple positioning options (center, top, bottom, corners, etc.)
- Backdrop blur effect support
- Customizable overlay colors and opacity
- Template-based customization — you bring the HTML, SWN brings the behavior
- Promise-based async/await support
- Auto-dismiss timer with optional progress bar
- Close button (×) support
- HTML content rendering
- Input types: text, email, password, number, textarea
- Async input validation with `preConfirm`
- Focus trapping and restoration for accessibility
- Modal-only scroll locking that restores the page's previous inline overflow style
- Enter key submits prompt input
- Custom DOM events for extensibility
- Default CSS stylesheet included (optional — use with templates for full control)
- No runtime dependencies; optional default CSS

## Installation

### Using npm

```bash
npm install senangwebs-notices
```

```javascript
import SWN from 'senangwebs-notices';
import 'senangwebs-notices/style.css'; // optional default styles

const notices = new SWN();
await notices.show('Hello!');
```

CommonJS consumers can use `const SWN = require('senangwebs-notices')`. The package provides real ESM and CommonJS entrypoints, while `dist/swn.js` and `dist/swn.min.js` retain the browser global `window.SWN`. Legacy CSS imports such as `senangwebs-notices/dist/swn.css` also work.

TypeScript declarations are included for both module systems:

```typescript
import SWN from 'senangwebs-notices';

const options: SWN.Options<number> = {
  inputType: 'number',
  preConfirm: value => Number(value),
};
const notices = new SWN();
const result = await notices.fire<number>({ ...options, type: 'prompt', body: 'Enter a number' });
```

Importing and constructing SWN during server rendering is safe. Display methods reject with a descriptive error outside a browser or before `document.body` exists. `install()` requires a browser; `destroy()` and `uninstall()` are safe during server rendering. Stylesheets are explicitly imported rather than injected into the page.

### Using a CDN

Include both the JS and CSS (or use your own styles with templates):

```html
<link rel="stylesheet" href="https://unpkg.com/senangwebs-notices@2.0.2/dist/swn.min.css">
<script src="https://unpkg.com/senangwebs-notices@2.0.2/dist/swn.min.js"></script>
```

**Note:** The CSS is optional. If you use custom templates with Tailwind or your own CSS, you can skip `swn.min.css`. Source maps are available as `swn.js.map` and `swn.css.map` for debugging.

Pin CDN URLs to the version you deploy. These repository changes must be released before they become available from a CDN; the version above is the current package version, not a claim that unreleased changes are published.

## Quick Start

```javascript
const swn = new SWN();

// Simple alert
await swn.show("Hello World!");

// Confirm dialog
const confirmed = await swn.showConfirm("Are you sure?");

// Prompt dialog
const name = await swn.showPrompt("Enter your name:");

// Structured result with fire()
const result = await swn.fire({
  type: "confirm",
  body: "Delete this item?",
  titleText: "Confirm",
});
if (result.isConfirmed) {
  // User clicked OK
}

// Toast notification
await swn.showToast("Saved successfully!", {
  position: "top right",
  timer: 3000,
  animation: { type: "slide-down", duration: 250 },
});

// Replace native dialogs
swn.install();
alert("This uses SWN!");
swn.uninstall(); // restore native dialogs
```

Installing SWN makes native dialog functions **asynchronous**. Always await replaced dialogs: `const accepted = await window.confirm('Continue?')`. A Promise is truthy, so existing synchronous code such as `if (confirm(...))` must be updated. `alert()` also stops blocking the following statements. Repeated installation is idempotent; uninstalling restores the previous installed SWN owner or original functions, while preserving replacements made by unrelated code. `destroy()` closes notices but does not uninstall the native integration.

## Usage

### `fire()` — Structured Result API

The `fire()` method always returns a `SwNResult` object, making it easy to handle all outcomes:

```javascript
const result = await swn.fire({
  type: "confirm",          // "alert" | "confirm" | "prompt" | "toast"
  body: "Are you sure?",
  titleText: "Confirm",
  buttonText: "Delete",
  cancelText: "Cancel",
  animation: { type: "scale", duration: 200 },
  showCloseButton: true,
});

// result: { isConfirmed: boolean, isDismissed: boolean, value: any }
```

**Result Object:**

| Field | Type | Description |
|-------|------|-------------|
| `isConfirmed` | `boolean` | `true` if user clicked the OK button |
| `isDismissed` | `boolean` | `true` if user cancelled, pressed Escape, clicked overlay, closed, or timer expired |
| `value` | `any` | Confirmed prompts: input or transformed value; confirms: `true`; alerts: `undefined`. Dismissed prompts: `null`; confirms: `false`; alerts/toasts: `undefined`. |

### Convenience Methods

```javascript
await swn.show("Hello!");                      // → undefined
const ok = await swn.showConfirm("Continue?"); // → true | false
const name = await swn.showPrompt("Name?");    // → string | null
```

### Toast Notifications

```javascript
await swn.showToast("File saved!", {
  position: "top right",
  timer: 3000,
  animation: { type: "slide-down" },
  showCloseButton: true,
});
```

Toasts differ from modals:
- No overlay/backdrop
- No focus trap
- No page scroll lock
- `role="status"` + `aria-live="polite"` for screen readers
- Stack vertically when multiple toasts share the same position
- Auto-dismiss with `timer`

Stacks are shared across SWN instances and loaded module formats, and reflow when content sizes change. Toasts default to top-center when the instance position is `center`; `left` and `right` map to the corresponding top corners. A toast has no default timer: supply `timer` to auto-dismiss it. An active modal makes background content, including toasts, inert until the modal closes.

### Auto-Dismiss Timer

```javascript
await swn.fire({
  type: "alert",
  body: "This will close in 3 seconds",
  timer: 3000,
  timerProgressBar: true,
});
```

The timer pauses when the user hovers over the notice or moves keyboard focus within it, then resumes after leaving. Initial modal focus does not pause the timer. With `timerProgressBar: true`, SWN supplies a `[data-swn-timer-bar]` element if one is missing; include the default CSS or style this element yourself.

### Close Button

Set `showCloseButton: true` to show a × button. It uses the `[data-swn-close]` attribute — if your template has one, it'll be shown; otherwise SWN creates one automatically for non-template notices.

```javascript
await swn.show("Click × to close", { showCloseButton: true });
```

### HTML Content

By default, `body` text is inserted as plain text (XSS-safe). Set `html: true` to render HTML:

**`html: true` is trusted-content mode.** SWN does not sanitize HTML. Sanitize untrusted content before passing it to SWN; templates and input attribute configuration must also come from trusted application code.

```javascript
await swn.fire({
  body: "<strong>Bold</strong> and <em>italic</em> text",
  html: true,
});
```

### Input Types & Validation

```javascript
const result = await swn.fire({
  type: "prompt",
  body: "Enter your email:",
  inputType: "email",
  inputPlaceholder: "you@example.com",
  inputAttributes: { maxlength: "100", required: "" },
  preConfirm: (value) => {
    if (!value || !value.includes("@")) {
      throw new Error("Please enter a valid email");
    }
    return value.trim();
  },
});
```

Supported `inputType` values: `"text"` (default), `"email"`, `"password"`, `"number"`, `"textarea"`

The `preConfirm` function runs after the user clicks OK. If it throws an error, the notice stays open and the message is shown in the `[data-swn-validation]` element. Return a Promise for async validation.

Native constraints (`required`, email format, `min`, `max`, `pattern`, etc.) are checked before `preConfirm`. Async validation disables OK and suppresses repeated submissions, including Enter. Cancellation or destruction ignores late validation completions. Returning `undefined`, synchronously or asynchronously, retains the input value. Template controls are replaced when switching between an input and textarea. Error messages become visible and are associated with the input for assistive technology.

### Queue

Display notices sequentially:

```javascript
const results = await swn.queue([
  { type: "confirm", body: "Step 1: Agree to terms?" },
  { type: "prompt", body: "Step 2: Enter your name:", inputType: "text" },
  { type: "alert", body: "Step 3: All done!" },
]);
// results is an array of SwNResult objects
```

Ordinary dismissal continues to the next step. `destroy()` stops every queue currently running on that instance, closes its notices immediately, and lets each queue Promise resolve with the results collected so far, including the dismissed current step. The instance can then be reused. Animated notices finish their exit before the next queued notice opens.

### Custom Events

SWN dispatches `CustomEvent`s on the notice container:

| Event | When |
|-------|------|
| `swn:open` | Notice is added to the DOM |
| `swn:close` | Immediately before DOM removal, after any exit animation |
| `swn:confirm` | A submit attempt through OK or Enter, before validation |
| `swn:cancel` | User clicks Cancel, before closure |

```javascript
document.addEventListener("swn:confirm", (e) => {
  console.log("Confirmed!", e.detail);
});
```

Events bubble while the notice container is connected and retain `{ type }` in `detail`. `swn:confirm` describes a submission attempt; use the resolved result to determine whether validation succeeded. The display Promise settles after removal. `onOpen` errors close the notice and reject its Promise. `onClose` runs once after removal; thrown errors are logged without preventing cleanup or Promise settlement.

### Custom Templates

```html
<template id="custom-template">
  <div data-swn class="your-custom-classes">
    <div data-swn-title></div>
    <div data-swn-body></div>
    <input type="text" data-swn-input class="custom-input" />
    <div data-swn-validation class="text-red-500 text-sm"></div>
    <div data-swn-buttons>
      <button data-swn-cancel>Cancel</button>
      <button data-swn-ok>OK</button>
    </div>
    <button data-swn-close aria-label="Close">&times;</button>
    <div data-swn-timer-bar></div>
  </div>
</template>

<script>
  const notices = new SWN({ template: "#custom-template" });
</script>
```

Templates must contain exactly one top-level `[data-swn]` element. Modal templates require `[data-swn-ok]`; prompt templates also require an input or textarea with `[data-swn-input]`. Use actual buttons for keyboard-accessible actions. A missing selector falls back to the built-in notice, while malformed selectors, non-template targets, and invalid template structures reject before mounting. SWN adds missing close buttons when requested, prompt validation elements, and enabled progress bars. Provide custom styling for these elements if omitting the default CSS.

Custom templates control input widths and margins. For a full-width field inside a padded wrapper, use `width: 100%` (or Tailwind `w-full`); SWN reserves its default input insets for built-in prompts.

### Auto-Initialization via HTML Attributes

```html
<template id="my-notice">
  <div data-swn class="custom-modal">
    <div data-swn-title></div>
    <div data-swn-body></div>
    <button data-swn-close aria-label="Close">&times;</button>
    <div data-swn-buttons>
      <button data-swn-cancel>Cancel</button>
      <button data-swn-ok>OK</button>
    </div>
  </div>
</template>

<button
  onclick="alert('Hello!')"
  data-swn-trigger
  data-swn-template="#my-notice"
  data-swn-title="Hello"
  data-swn-position="top right"
  data-swn-show-close-button="true"
  data-swn-timer="5000"
  data-swn-timer-progress-bar="true"
>
  Show Alert
</button>
```

**Supported Trigger Attributes:**

- `data-swn-title`: Title text
- `data-swn-ok-text`: OK button text
- `data-swn-cancel-text`: Cancel button text
- `data-swn-template`: Template selector
- `data-swn-position`: Dialog position
- `data-swn-bg-color`: Overlay color
- `data-swn-bg-opacity`: Overlay opacity
- `data-swn-bg-blur`: Overlay blur (px)
- `data-swn-z-index`: Z-index
- `data-swn-close-on-overlay-click`: `"true"` to close on overlay click
- `data-swn-show-close-button`: `"true"` to show × button
- `data-swn-html`: `"true"` to render HTML content
- `data-swn-timer`: Auto-dismiss timer (ms)
- `data-swn-timer-progress-bar`: `"true"` to show timer progress bar
- `data-swn-input-type`: Input type for prompt
- `data-swn-animation`: Animation config (JSON or type string)

## Configuration Options

```javascript
const swn = new SWN({
  titleText: "Notice",
  buttonText: "OK",
  cancelText: "Cancel",
  template: "#custom-template",
  position: "center",
  bgColor: "#000000",
  bgOpacity: 0.5,
  bgBlur: 0,
  zIndex: 9999,
  inputPlaceholder: "Enter your response...",
  defaultValue: "",
  inputType: "text",
  inputAttributes: {},
  preConfirm: null,
  closeOnOverlayClick: false,
  showCloseButton: false,
  html: false,
  animation: null,
  timer: null,
  timerProgressBar: false,
  onOpen: null,
  onClose: null,
});
```

### Supported Positions

`center` (default), `top`, `top left`, `top right`, `bottom`, `bottom left`, `bottom right`, `left`, `right`

### Animations

`fade`, `slide-up`, `slide-down`, `scale` — each accepts an optional `duration` (default `200ms`):

```javascript
await swn.show("Hello!", { animation: { type: "fade", duration: 300 } });
```

### Data Attributes (Template)

- `data-swn`: Main notice container
- `data-swn-title`: Title container
- `data-swn-body`: Message body (plain text or HTML if `html: true`)
- `data-swn-buttons`: Buttons container
- `data-swn-ok`: OK button
- `data-swn-cancel`: Cancel button
- `data-swn-input`: Input field (for prompt)
- `data-swn-close`: Close button (×)
- `data-swn-validation`: Validation error message
- `data-swn-timer-bar`: Timer progress bar element

## Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `show(message, options?)` | `Promise<undefined>` | Display an alert |
| `showConfirm(message, options?)` | `Promise<boolean>` | Display a confirm dialog |
| `showPrompt(message, options?)` | `Promise<string\|null>` | Display a prompt dialog |
| `showToast(message, options?)` | `Promise<SwNResult>` | Display a toast notification |
| `showNotice(message, type, options?)` | `Promise<any>` | Display a notice by type |
| `fire(options)` | `Promise<SwNResult>` | Display a notice with structured result |
| `queue(steps)` | `Promise<SwNResult[]>` | Display notices sequentially |
| `install()` | `void` | Replace native dialog functions |
| `uninstall()` | `void` | Restore native dialog functions |
| `destroy()` | `void` | Close all active notices and resolve pending promises |

## Default CSS

Include `dist/swn.css` for a ready-to-use default style. This provides styling for all SWN elements including the toast variant, close button, validation errors, and timer progress bar. You can override any of these styles or skip the CSS entirely and use your own classes with custom templates.

## Accessibility

- **ARIA attributes**: Dialog containers have `role="dialog"` + `aria-modal="true"`. Toasts use `role="status"` + `aria-live="polite"`
- **Focus trapping**: Tab and Shift+Tab cycle within open dialogs (not toasts)
- **Focus restoration**: Focus returns to the previously active element on close
- **Scroll restoration**: Modals lock body scrolling; the last modal to close restores the previous inline overflow style. Toasts do not affect scrolling.
- **Keyboard**: Escape closes dialogs; Enter submits prompt input
- **Labels**: `aria-labelledby` and `aria-describedby` link title and body

Only the top modal receives keyboard input, even across multiple instances or module formats. Hidden and disabled controls are excluded from focus cycling. Background body elements and lower dialogs become inert with their original `inert` and `aria-hidden` attributes restored on closure. Added body elements are also isolated while a modal is open. Prompts receive an accessible input name and announce validation errors. Long dialogs scroll within the viewport; animations honor `prefers-reduced-motion`.

## Browser Support

SWN targets the latest two major versions of Chrome/Edge, Firefox, and Safari, including mobile Safari. It uses modern browser features including `inert`, ResizeObserver, and dynamic viewport units. `backdrop-filter` is optional for blur effects. Internet Explorer is not supported. Automated checks cover Chromium, Firefox, and WebKit; real-device mobile Safari and screen-reader checks remain part of release review.

## Development and release checks

Use Node 22.22.2+ on the 22.x line, or Node 24.15+ on the 24.x line, for the development tools.

```bash
npm ci
npm run build
npm test
npm run test:package
npx playwright install chromium firefox webkit
npm run test:browser
npm audit --audit-level=high
```

The unit suite covers lifecycle, validation, cancellation, and integration ownership. Browser regressions cover real focus, backdrop hit testing, toast geometry, narrow screens, reduced motion, ESM integration, and automated accessibility checks. The package check extracts an npm tarball and verifies SSR, ESM/CommonJS, CSS exports, legacy bundles, and TypeScript consumption. `npm pack` and `npm publish` rebuild the distribution through `prepack`; `dist/` remains tracked. CI runs the release checks on Node 22 and 24 and rejects distribution drift and high/critical dependency advisories. Publishing is a separate maintainer action after choosing the release version and updating pinned CDN examples.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License — see the [LICENSE.md](LICENSE.md) file for details.

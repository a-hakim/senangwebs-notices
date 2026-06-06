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
- No external dependencies (~8KB gzipped JS + CSS)

## Installation

### Using npm

```bash
npm install senangwebs-notices
```

### Using a CDN

Include both the JS and CSS (or use your own styles with templates):

```html
<link rel="stylesheet" href="https://unpkg.com/senangwebs-notices@latest/dist/swn.min.css">
<script src="https://unpkg.com/senangwebs-notices@latest/dist/swn.min.js"></script>
```

**Note:** The CSS is optional. If you use custom templates with Tailwind or your own CSS, you can skip `swn.min.css`. Source maps are available as `swn.js.map` and `swn.css.map` for debugging.

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
| `value` | `any` | For prompts: the input string. For confirms: `true`. For alerts: `undefined`. `null` when dismissed. |

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

### Auto-Dismiss Timer

```javascript
await swn.fire({
  type: "alert",
  body: "This will close in 3 seconds",
  timer: 3000,
  timerProgressBar: true,
});
```

The timer pauses when the user hovers over the notice. Include a `[data-swn-timer-bar]` element in your template to show a progress bar, or use the default CSS which provides one.

### Close Button

Set `showCloseButton: true` to show a × button. It uses the `[data-swn-close]` attribute — if your template has one, it'll be shown; otherwise SWN creates one automatically for non-template notices.

```javascript
await swn.show("Click × to close", { showCloseButton: true });
```

### HTML Content

By default, `body` text is inserted as plain text (XSS-safe). Set `html: true` to render HTML:

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

### Custom Events

SWN dispatches `CustomEvent`s on the notice container:

| Event | When |
|-------|------|
| `swn:open` | Notice is added to the DOM |
| `swn:close` | Notice is removed from the DOM |
| `swn:confirm` | User clicks OK |
| `swn:cancel` | User clicks Cancel |

```javascript
document.addEventListener("swn:confirm", (e) => {
  console.log("Confirmed!", e.detail);
});
```

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

## Browser Support

SWN works on all modern browsers supporting ES6+ (Promise, async/await), CSS Flexbox, and `backdrop-filter` (optional, for blur effects).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License — see the [LICENSE.md](LICENSE.md) file for details.
